import pandas as pd
import numpy as np
import xgboost as xgb
import joblib

# Load saved models and encoders
xgb_model = xgb.XGBRegressor()
xgb_model.load_model('ultra_pro_xgb_model.json')
rf_model = joblib.load('ultra_pro_rf_model.pkl')
encoder = joblib.load('target_encoder.pkl')
scaler = joblib.load('scaler.pkl')

# Load new data (replace with your actual data file or DataFrame)
new_data = pd.read_csv(r"C:\Users\GUNA\Videos\agrisage\agrisage\backend\data\new_crop_data.csv")  # Update path

# Preprocess new data (mimics training preprocessing)
new_data['Production'] = pd.to_numeric(new_data['Production'], errors='coerce')
new_data['Area'] = pd.to_numeric(new_data['Area'], errors='coerce')
new_data = new_data.dropna(subset=['Production', 'Area'])
new_data['Production'] = np.log1p(new_data['Production'])

# Encode categorical columns
categorical_columns = ['State_Name', 'District_Name', 'Season', 'Crop']
new_data[categorical_columns] = encoder.transform(new_data[categorical_columns])

# Create engineered features
new_data['Year_Season'] = new_data['Crop_Year'] * new_data['Season']
new_data['Crop_District'] = new_data['Crop'] * new_data['District_Name']
new_data['Avg_Production_Crop'] = new_data.groupby('Crop')['Production'].transform('mean')

# Scale numerical columns
numerical_columns = ['Area', 'Crop_Year', 'Year_Season', 'Crop_District']
new_data[numerical_columns] = scaler.transform(new_data[numerical_columns])

# Select features
features = ['State_Name', 'District_Name', 'Crop_Year', 'Season', 'Crop', 
            'Area', 'Year_Season', 'Crop_District', 'Avg_Production_Crop']
X_new = new_data[features]

# Make ensemble predictions
xgb_pred = xgb_model.predict(X_new)
rf_pred = rf_model.predict(X_new)
final_pred = 0.7 * xgb_pred + 0.3 * rf_pred
final_pred = np.expm1(final_pred)  # Back-transform from log scale

# Save predictions
new_data['Predicted_Production'] = final_pred
new_data.to_csv('predictions.csv', index=False)
print("Predictions saved to predictions.csv")