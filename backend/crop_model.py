import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import sys

def train_model():
    data_path = os.path.join('data', 'Crop_recommendation.csv')
    df = pd.read_csv(data_path)
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']
    X['rainfall'] = X['rainfall'].clip(upper=300)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.2f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    joblib.dump(model, 'crop_model.joblib')
    joblib.dump(scaler, 'scaler.joblib')
    print("Model saved as crop_model.joblib")
    print("Scaler saved as scaler.joblib")

def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    try:
        # Convert inputs to floats
        inputs = [float(N), float(P), float(K), float(temperature), float(humidity), float(ph), float(rainfall)]
        if any(x < 0 for x in inputs):
            return "Error: Inputs cannot be negative."
        if not (3.5 <= inputs[5] <= 9.9):  # Check ph (index 5)
            return "Error: pH must be between 3.5 and 9.9."
        if not (0 <= inputs[4] <= 100):   # Check humidity (index 4)
            return "Error: Humidity must be between 0 and 100%."
        inputs[6] = min(inputs[6], 300)   # Cap rainfall
    except ValueError:
        return "Error: All inputs must be numeric."
    
    # Load model and scaler
    model = joblib.load('crop_model.joblib')
    scaler = joblib.load('scaler.joblib')
    
    # Prepare input
    features = pd.DataFrame(
        [inputs],
        columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    )
    features_scaled = scaler.transform(features)
    
    # Predict
    prediction = model.predict(features_scaled)[0]
    return prediction

if __name__ == '__main__':
    if len(sys.argv) == 8:
        # API call: python crop_model.py N P K temperature humidity ph rainfall
        N, P, K, temperature, humidity, ph, rainfall = sys.argv[1:]
        result = predict_crop(N, P, K, temperature, humidity, ph, rainfall)
        print(result)
    else:
        # Train model and test
        train_model()
        test_cases = [
            {'N': 90, 'P': 42, 'K': 43, 'temperature': 20.88, 'humidity': 82.00, 'ph': 6.50, 'rainfall': 202.94},
            {'N': 71, 'P': 54, 'K': 16, 'temperature': 22.61, 'humidity': 63.69, 'ph': 5.75, 'rainfall': 87.76},
            {'N': 133, 'P': 47, 'K': 24, 'temperature': 24.40, 'humidity': 79.20, 'ph': 7.23, 'rainfall': 90.80},
            {'N': 89, 'P': 47, 'K': 38, 'temperature': 25.52, 'humidity': 72.25, 'ph': 6.00, 'rainfall': 151.89},
            {'N': 100, 'P': 50, 'K': 45, 'temperature': 27.00, 'humidity': 72.00, 'ph': 6.00, 'rainfall': 750.00}
        ]
        print("\nTest Predictions:")
        for test in test_cases:
            result = predict_crop(
                test['N'], test['P'], test['K'], test['temperature'],
                test['humidity'], test['ph'], test['rainfall']
            )
            print(f"Input: {test}, Prediction: {result}")