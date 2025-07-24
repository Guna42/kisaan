import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import logging
from logging.handlers import RotatingFileHandler

# Setup Logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
file_handler = RotatingFileHandler('inference.log', maxBytes=5 * 1024 * 1024, backupCount=5)
file_handler.setLevel(logging.INFO)
file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)
logger.addHandler(file_handler)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(file_formatter)
logger.addHandler(console_handler)

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# Load the pre-trained model (adjust based on repo's model architecture)
model = models.resnet50(pretrained=False)  # Example; change to match their architecture
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, 38)  # Adjust num_classes (38 for PlantVillage)
model.load_state_dict(torch.load('path/to/their/model.pth', map_location=device))
model.eval()
model.to(device)

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Function to predict
def predict_image(image_path):
    image = Image.open(image_path).convert('RGB')
    image = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)
    return predicted.item()

# Example usage
if __name__ == '__main__':
    logger.info("Loading model and ready for inference...")
    # Test with an image from the dataset (adjust path)
    test_image = os.path.join('C:\\Users\\GUNA\\.cache\\kagglehub\\datasets\\abdallahalidev\\plantvillage-dataset\\versions\\3\\plantvillage dataset\\color\\Apple___Apple_scab\\00e909aa-e3ae-4558-9961-336bb0f35db3___JR_FrgE.S 8593.JPG')
    if os.path.exists(test_image):
        pred = predict_image(test_image)
        class_names = ['Apple___Apple_scab', 'Apple___Black_rot', ..., 'Tomato___Tomato_Yellow_Leaf_Curl_Virus']  # Full 38-class list
        logger.info(f"Predicted class: {class_names[pred]} (Class index: {pred})")
    else:
        logger.error(f"Image not found at {test_image}")