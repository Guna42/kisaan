import sys
import json
import joblib
import pandas as pd
import os

# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model and encoders using absolute paths
model = joblib.load(os.path.join(BASE_DIR, 'water_recommendation_model.pkl'))
le_crop = joblib.load(os.path.join(BASE_DIR, 'le_crop.pkl'))
le_soil = joblib.load(os.path.join(BASE_DIR, 'le_soil.pkl'))
le_recommendation = joblib.load(os.path.join(BASE_DIR, 'le_recommendation.pkl'))

# Read input from Node.js
try:
    input_data = json.loads(sys.argv[1])
except (IndexError, json.JSONDecodeError) as e:
    print(json.dumps({'error': 'Invalid input JSON'}))
    sys.exit(1)

# Extract and validate inputs
try:
    temperature = float(input_data['temperature'])
    humidity = float(input_data['humidity'])
    precipitation = float(input_data['precipitation'])
    crop_type = input_data['crop_type']
    soil_type = input_data['soil_type']
except (KeyError, ValueError) as e:
    print(json.dumps({'error': f'Invalid input: {str(e)}'}))
    sys.exit(1)

# Encode categorical inputs
try:
    crop_encoded = le_crop.transform([crop_type])[0]
    if crop_type not in le_crop.classes_:
        raise ValueError('Unknown crop_type')
    soil_encoded = le_soil.transform([soil_type])[0]
    if soil_type not in le_soil.classes_:
        raise ValueError('Unknown soil_type')
except ValueError as e:
    print(json.dumps({'error': str(e)}))
    sys.exit(1)

# Prepare input for model
input_df = pd.DataFrame([[temperature, humidity, precipitation, crop_encoded, soil_encoded]],
                        columns=['temperature', 'humidity', 'precipitation', 'crop_type', 'soil_type'])

# Predict
try:
    prediction = model.predict(input_df)[0]
    recommendation = le_recommendation.inverse_transform([prediction])[0]
    print(json.dumps({'recommendation': recommendation}))
except Exception as e:
    print(json.dumps({'error': f'Prediction failed: {str(e)}'}))
    sys.exit(1)