import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms
from PIL import Image
import logging
from logging.handlers import RotatingFileHandler

# Setup Logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
file_handler = RotatingFileHandler('training.log', maxBytes=5 * 1024 * 1024, backupCount=5)
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

# Dataset Class
class PlantVillageDataset(Dataset):
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        image = Image.open(self.image_paths[idx]).convert('RGB')
        if self.transform:
            image = self.transform(image)
        label = self.labels[idx]
        return image, label

# Data Preparation
def prepare_data(images_folder, test_size=0.2, random_seed=42):
    image_paths = []
    labels = []
    class_names = [d for d in os.listdir(images_folder) if os.path.isdir(os.path.join(images_folder, d))]
    class_to_idx = {cls_name: idx for idx, cls_name in enumerate(class_names)}
    
    for cls_name in class_names:
        cls_path = os.path.join(images_folder, cls_name)
        for img_name in os.listdir(cls_path):
            img_path = os.path.join(cls_path, img_name)
            if img_path.lower().endswith(('.jpg', '.jpeg', '.png')):
                image_paths.append(img_path)
                labels.append(class_to_idx[cls_name])
    
    if not image_paths:
        raise FileNotFoundError(f"No images found in {images_folder}")
    
    from sklearn.model_selection import train_test_split
    train_paths, val_paths, train_labels, val_labels = train_test_split(
        image_paths, labels, test_size=test_size, random_state=random_seed, stratify=labels)

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    train_dataset = PlantVillageDataset(train_paths[:1000], train_labels[:1000], transform=transform)  # Subset for speed
    val_dataset = PlantVillageDataset(val_paths[:200], val_labels[:200], transform=transform)  # Subset for speed

    return train_dataset, val_dataset, len(class_names), class_names

# Model
model = models.resnet50(pretrained=False)
num_features = model.fc.in_features
model.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(num_features, 38)
).to(device)

# Data Loaders
images_folder = os.path.join('C:\\Users\\GUNA\\.cache\\kagglehub\\datasets\\abdallahalidev\\plantvillage-dataset\\versions\\3\\plantvillage dataset\\color')
train_dataset, val_dataset, num_classes, class_names = prepare_data(images_folder)
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

# Training Setup
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.fc.parameters(), lr=0.001)

# Quick Training
def train_quick(model, train_loader, val_loader, criterion, optimizer, num_epochs=1):
    model.train()
    for epoch in range(num_epochs):
        logger.info(f"Epoch {epoch + 1}/{num_epochs}")
        running_loss = 0.0
        running_corrects = 0
        for inputs, labels in train_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(torch.max(outputs, 1)[1] == labels.data)
        epoch_loss = running_loss / len(train_loader.dataset)
        epoch_acc = running_corrects.double().item() / len(train_loader.dataset)
        logger.info(f"Train Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")
    return model

# Save Checkpoint
if not os.path.exists('CHECKPOINT'):
    os.makedirs('CHECKPOINT')
model = train_quick(model, train_loader, val_loader, criterion, optimizer)
torch.save(model.state_dict(), os.path.join('CHECKPOINT', 'training_checkpoint.pth'))
logger.info("Checkpoint saved as training_checkpoint.pth")

# Inference
model.eval()
test_image = os.path.join('C:\\Users\\GUNA\\.cache\\kagglehub\\datasets\\abdallahalidev\\plantvillage-dataset\\versions\\3\\plantvillage dataset\\color\\Apple___Apple_scab\\0ea78733-9404-4536-8793-a108c66269b3___FREC_Scab 3145.JPG')
if os.path.exists(test_image):
    image = Image.open(test_image).convert('RGB')
    image = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)
    logger.info(f"Predicted class: {class_names[predicted.item()]} (Class index: {predicted.item()})")
else:
    logger.error(f"Image not found at {test_image}")