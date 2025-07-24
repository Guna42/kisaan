import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import optuna
from category_encoders import TargetEncoder
import matplotlib.pyplot as plt
import seaborn as sns
import shap
import warnings
import os

warnings.filterwarnings('ignore')

# Loading and preprocessing the dataset
def load_and_preprocess_data(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The file {file_path} does not exist. Please verify the path.")
    
    df = pd.read_csv(file_path)
    
    df['Production'] = pd.to_numeric(df['Production'], errors='coerce')
    df['Area'] = pd.to_numeric(df['Area'], errors='coerce')
    df = df.dropna(subset=['Production', 'Area'])
    
    Q1 = df['Production'].quantile(0.25)
    Q3 = df['Production'].quantile(0.75)
    IQR = Q3 - Q1
    df = df[(df['Production'] >= Q1 - 1.5 * IQR) & (df['Production'] <= Q3 + 1.5 * IQR)]
    
    df['Production'] = np.log1p(df['Production'])
    
    categorical_columns = ['State_Name', 'District_Name', 'Season', 'Crop']
    encoder = TargetEncoder(cols=categorical_columns)
    df[categorical_columns] = encoder.fit_transform(df[categorical_columns], df['Production'])
    
    df['Year_Season'] = df['Crop_Year'] * df['Season']
    df['Crop_District'] = df['Crop'] * df['District_Name']
    df['Avg_Production_Crop'] = df.groupby('Crop')['Production'].transform('mean')
    
    scaler = StandardScaler()
    numerical_columns = ['Area', 'Crop_Year', 'Year_Season', 'Crop_District', 'Avg_Production_Crop']
    df[numerical_columns] = scaler.fit_transform(df[numerical_columns])
    
    return df, encoder, scaler

# Preparing features and target
def prepare_data(df):
    features = ['State_Name', 'District_Name', 'Crop_Year', 'Season', 'Crop', 
                'Area', 'Year_Season', 'Crop_District', 'Avg_Production_Crop']
    X = df[features]
    y = df['Production']
    return X, y

# Defining the objective function for Optuna
def objective(trial, X_train, y_train, X_val, y_val):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 200),
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
        'subsample': trial.suggest_float('subsample', 0.5, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.5, 1.0),
        'random_state': 42
    }
    
    model = xgb.XGBRegressor(objective='reg:squarederror', **params)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_val)
    rmse = np.sqrt(mean_squared_error(y_val, y_pred))
    return rmse

# Training the ultra pro model with ensemble
def train_ultra_pro_model(X, y):
    X_train_val, X_test, y_train_val, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    X_train, X_val, y_train, y_val = train_test_split(X_train_val, y_train_val, test_size=0.1765, random_state=42)
    
    print(f"Test set size: {len(X_test)} samples")
    
    study = optuna.create_study(direction='minimize')
    study.optimize(lambda trial: objective(trial, X_train, y_train, X_val, y_val), n_trials=20)
    best_params = study.best_params
    
    xgb_model = xgb.XGBRegressor(objective='reg:squarederror', **best_params)
    xgb_model.fit(X_train, y_train)
    
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    
    xgb_pred = xgb_model.predict(X_test)
    rf_pred = rf_model.predict(X_test)
    y_pred = 0.7 * xgb_pred + 0.3 * rf_pred
    
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"Ensemble Model - RMSE: {rmse:.2f}, MAE: {mae:.2f}, R²: {r2:.2f}")
    
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(xgb_model, X, y, cv=kf, scoring='r2')
    print(f"Cross-Validation R² Scores: {cv_scores}")
    print(f"Average CV R² Score: {cv_scores.mean():.2f} ± {cv_scores.std():.2f}")
    
    return xgb_model, rf_model, X_test, y_test, y_pred

# Visualizing results
def visualize_results(xgb_model, X_test, y_test, y_pred):
    plt.figure(figsize=(10, 6))
    xgb.plot_importance(xgb_model, max_num_features=10)
    plt.title('XGBoost Feature Importance')
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    plt.close()
    
    try:
        explainer = shap.TreeExplainer(xgb_model)
        shap_values = explainer.shap_values(X_test)
        shap.summary_plot(shap_values, X_test, show=False)
        plt.savefig('shap_summary.png')
        plt.close()
    except Exception as e:
        print(f"SHAP visualization failed: {e}")
    
    plt.figure(figsize=(10, 6))
    plt.scatter(np.expm1(y_test), np.expm1(y_pred), alpha=0.5)
    plt.plot([np.expm1(y_test).min(), np.expm1(y_test).max()], 
             [np.expm1(y_test).min(), np.expm1(y_test).max()], 'r--', lw=2)
    plt.xlabel('Actual Production')
    plt.ylabel('Predicted Production')
    plt.title('Actual vs Predicted Production (Back-Transformed)')
    plt.tight_layout()
    plt.savefig('actual_vs_predicted.png')
    plt.close()

# Main execution
if __name__ == "__main__":
    file_path = r"C:\Users\GUNA\Videos\agrisage\agrisage\backend\data\crop_production.csv"
    
    try:
        df, encoder, scaler = load_and_preprocess_data(file_path)
        X, y = prepare_data(df)
        xgb_model, rf_model, X_test, y_test, y_pred = train_ultra_pro_model(X, y)
        visualize_results(xgb_model, X_test, y_test, y_pred)
        xgb_model.save_model('ultra_pro_xgb_model.json')
        import joblib
        joblib.dump(rf_model, 'ultra_pro_rf_model.pkl')
        joblib.dump(encoder, 'target_encoder.pkl')
        joblib.dump(scaler, 'scaler.pkl')
        print("Models and encoders saved successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")