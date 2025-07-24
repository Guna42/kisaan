import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Define ranges and categories
n_samples = 10000
n_per_class = n_samples // 3  # ~3333 samples per class
data = []

# Generate data with stricter feature ranges
for _ in range(n_samples):
    # Random features
    crop = np.random.choice(['Maize', 'Rice', 'Wheat'])
    soil = np.random.choice(['Loamy', 'Sandy', 'Clay'])
    
    # Assign recommendation and corresponding feature ranges
    recommendation = np.random.choice(['Increase', 'Maintain', 'Reduce'])
    
    if recommendation == 'Increase':
        # Low humidity, low precipitation, or sandy soil
        hum = np.random.uniform(30, 50)
        prec = np.random.uniform(0, 1)
        temp = np.random.uniform(20, 35)  # Warmer for higher water needs
        if soil == 'Sandy':
            hum = np.random.uniform(30, 60)  # Slightly wider for sandy soil
    elif recommendation == 'Reduce':
        # High humidity, high precipitation, or clay soil
        hum = np.random.uniform(70, 90)
        prec = np.random.uniform(2, 10)
        temp = np.random.uniform(15, 25)  # Cooler for less water needs
        if soil == 'Clay':
            prec = np.random.uniform(1, 10)  # Slightly wider for clay soil
    else:  # Maintain
        # Moderate conditions
        hum = np.random.uniform(50, 70)
        prec = np.random.uniform(0.5, 2)
        temp = np.random.uniform(18, 30)
    
    # Adjust for crop-specific needs
    if crop == 'Rice':
        hum -= 5  # Rice needs more water, so slightly lower humidity threshold
        prec += 0.5
    elif crop == 'Wheat':
        hum += 5  # Wheat needs less water
        prec -= 0.5
    
    # Ensure values stay in valid ranges
    hum = np.clip(hum, 30, 90)
    prec = np.clip(prec, 0, 10)
    temp = np.clip(temp, 15, 35)
    
    data.append([temp, hum, prec, crop, soil, recommendation])

# Create DataFrame
data = pd.DataFrame(data, columns=['temperature', 'humidity', 'precipitation', 'crop_type', 'soil_type', 'recommendation'])

# Balance classes
class_counts = data['recommendation'].value_counts()
min_count = min(class_counts)
balanced_data = pd.concat([
    data[data['recommendation'] == cls].sample(min_count, random_state=42)
    for cls in ['Increase', 'Maintain', 'Reduce']
])

# Save to CSV
balanced_data.to_csv('water_recommendation_data.csv', index=False)
print("Synthetic dataset generated and saved as 'water_recommendation_data.csv'")
print(balanced_data['recommendation'].value_counts())
print(balanced_data.head())