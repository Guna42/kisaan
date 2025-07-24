import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import sys
import json
import os

# Load saved models and encoders
try:
    xgb_model = xgb.XGBRegressor()
    xgb_model.load_model('ultra_pro_xgb_model.json')
    rf_model = joblib.load('ultra_pro_rf_model.pkl')
    encoder = joblib.load('target_encoder.pkl')
    scaler = joblib.load('scaler.pkl')
except FileNotFoundError as e:
    print(json.dumps({"error": f"Model or encoder file not found: {e}"}))
    sys.exit(1)

# Preprocess input
def preprocess_input(input_data, encoder, scaler):
    try:
        # Convert input to DataFrame
        df = pd.DataFrame([input_data])
        
        # Load reference data for Avg_Production_Crop
        ref_data = pd.read_csv(r"C:\Users\GUNA\Videos\agrisage\agrisage\backend\data\crop_production.csv")
        ref_data['Production'] = pd.to_numeric(ref_data['Production'], errors='coerce')
        ref_data['Production'] = np.log1p(ref_data['Production'])
        avg_production = ref_data.groupby('Crop')['Production'].mean().to_dict()
        df['Avg_Production_Crop'] = df['Crop'].map(avg_production).fillna(0)
        
        # Encode categorical columns
        categorical_columns = ['State_Name', 'District_Name', 'Season', 'Crop']
        df[categorical_columns] = encoder.transform(df[categorical_columns])
        
        # Create engineered features
        df['Year_Season'] = df['Crop_Year'] * df['Season']
        df['Crop_District'] = df['Crop'] * df['District_Name']
        
        # Scale numerical columns
        numerical_columns = ['Area', 'Crop_Year', 'Year_Season', 'Crop_District', 'Avg_Production_Crop']
        df[numerical_columns] = scaler.transform(df[numerical_columns])
        
        # Select features
        features = ['State_Name', 'District_Name', 'Crop_Year', 'Season', 'Crop', 
                    'Area', 'Year_Season', 'Crop_District', 'Avg_Production_Crop']
        return df[features]
    except Exception as e:
        print(json.dumps({"error": f"Preprocessing failed: {str(e)}"}))
        sys.exit(1)

# Main execution
if __name__ == "__main__":
    try:
        # Read JSON input
        input_data = json.loads(sys.argv[1])
        
        # Validate required fields
        required_fields = ['State_Name', 'District_Name', 'Crop_Year', 'Season', 'Crop', 'Area']
        missing_fields = [field for field in required_fields if field not in input_data]
        if missing_fields:
            print(json.dumps({"error": f"Missing required fields: {missing_fields}"}))
            sys.exit(1)
        
        # Ensure numeric fields
        try:
            input_data['Crop_Year'] = int(input_data['Crop_Year'])
            input_data['Area'] = float(input_data['Area'])
        except (ValueError, TypeError) as e:
            print(json.dumps({"error": f"Invalid numeric fields: {str(e)}"}))
            sys.exit(1)
        
        # Preprocess input
        X_new = preprocess_input(input_data, encoder, scaler)
        
        # Make ensemble predictions
        xgb_pred = xgb_model.predict(X_new)
        rf_pred = rf_model.predict(X_new)
        final_pred = 0.7 * xgb_pred + 0.3 * rf_pred
        final_pred = np.expm1(final_pred)  # Back-transform from log scale
        
        # Output prediction as JSON
        print(json.dumps({"production": float(final_pred[0])}))
    except Exception as e:
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
        sys.exit(1)