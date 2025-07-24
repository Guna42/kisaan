import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# Generate synthetic dataset
np.random.seed(42)
n_samples = 10000  # Increased for better training

data = {
    'temperature': np.random.uniform(15, 35, n_samples),
    'humidity': np.random.uniform(20, 90, n_samples),
    'precipitation': np.random.uniform(0, 10, n_samples),
    'crop_type': np.random.choice(['Maize', 'Rice', 'Wheat', 'Mango', 'Apple', 'Orange', 'Banana'], n_samples),
    'soil_type': np.random.choice(['Sandy', 'Clay', 'Loamy'], n_samples),
    'recommendation': [''] * n_samples
}

# Assign recommendations based on agricultural rules
for i in range(n_samples):
    temp = data['temperature'][i]
    hum = data['humidity'][i]
    prec = data['precipitation'][i]
    crop = data['crop_type'][i]
    soil = data['soil_type'][i]

    # Water needs (mm/week): Maize (25-50), Rice (50-100), Wheat (20-40), Mango (25-50), Apple (20-40), Orange (25-50), Banana (50-100)
    if soil == 'Sandy':  # Drains quickly, needs more water
        if hum < 50 or prec < 1:
            data['recommendation'][i] = 'Increase'
        elif hum > 70 and prec > 3:
            data['recommendation'][i] = 'Reduce'
        else:
            data['recommendation'][i] = 'Maintain'
    elif soil == 'Clay':  # Retains water, needs less
        if hum < 40 or prec < 0.5:
            data['recommendation'][i] = 'Increase'
        elif hum > 80 and prec > 5:
            data['recommendation'][i] = 'Reduce'
        else:
            data['recommendation'][i] = 'Maintain'
    else:  # Loamy, balanced
        if hum < 45 or prec < 1:
            data['recommendation'][i] = 'Increase'
        elif hum > 75 and prec > 4:
            data['recommendation'][i] = 'Reduce'
        else:
            data['recommendation'][i] = 'Maintain'

    # Crop-specific adjustments
    if crop in ['Rice', 'Banana']:  # High water demand
        if hum < 60 or prec < 2:
            data['recommendation'][i] = 'Increase'
    elif crop in ['Wheat', 'Apple']:  # Lower water demand
        if hum > 65 and prec > 3:
            data['recommendation'][i] = 'Reduce'

# Convert to DataFrame
df = pd.DataFrame(data)

# Encode categorical variables
le_crop = LabelEncoder()
le_soil = LabelEncoder()
le_recommendation = LabelEncoder()

df['crop_type'] = le_crop.fit_transform(df['crop_type'])
df['soil_type'] = le_soil.fit_transform(df['soil_type'])
df['recommendation'] = le_recommendation.fit_transform(df['recommendation'])

# Features and target
X = df[['temperature', 'humidity', 'precipitation', 'crop_type', 'soil_type']]
y = df['recommendation']

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Evaluate model
scores = cross_val_score(model, X, y, cv=5)
print(f"Cross-Validation Accuracy: {scores.mean():.2f} ± {scores.std():.2f}")

# Detailed evaluation on a test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
y_pred = model.predict(X_test)
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=le_recommendation.classes_))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nFeature Importance:")
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values(by='importance', ascending=False)
print(feature_importance)

# Save model and encoders
joblib.dump(model, 'water_recommendation_model.pkl')
joblib.dump(le_crop, 'le_crop.pkl')
joblib.dump(le_soil, 'le_soil.pkl')
joblib.dump(le_recommendation, 'le_recommendation.pkl')

print("\nModel and encoders saved successfully!")