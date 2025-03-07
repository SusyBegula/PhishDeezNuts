import pandas as pd
import numpy as np
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
import re
from datetime import datetime

# Define paths
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'ml_model')
MODEL_PATH = os.path.join(MODEL_DIR, 'phishing_model.joblib')
VECTORIZER_PATH = os.path.join(MODEL_DIR, 'tfidf_vectorizer.joblib')
DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'Phishing_Email.csv')

# Ensure model directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

def preprocess_text(text):
    """Preprocess email text for ML model"""
    if not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', ' URL ', text)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', ' EMAIL ', text)
    
    # Remove special characters and digits
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\d+', ' NUM ', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def load_and_preprocess_data():
    """Load and preprocess the phishing email dataset"""
    try:
        # Load dataset
        df = pd.read_csv(DATASET_PATH)
        
        # Preprocess text
        df['processed_text'] = df['Email Text'].apply(preprocess_text)
        
        # Convert labels to binary (1 for phishing, 0 for safe)
        df['label'] = df['Email Type'].apply(lambda x: 0 if x == 'Safe Email' else 1)
        
        return df
    except Exception as e:
        print(f"Error loading dataset: {str(e)}")
        return None

def train_model():
    """Train the ML model on the phishing dataset"""
    # Load and preprocess data
    df = load_and_preprocess_data()
    if df is None:
        raise Exception("Failed to load dataset")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        df['processed_text'], 
        df['label'], 
        test_size=0.2, 
        random_state=42
    )
    
    # Create and fit TF-IDF vectorizer
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    # Train Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_tfidf, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    
    # Save model and vectorizer
    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)
    
    # Save model metadata
    metadata = {
        'accuracy': accuracy,
        'f1_score': f1,
        'precision': precision,
        'recall': recall,
        'trained_at': datetime.now().isoformat(),
        'samples': len(df)
    }
    
    with open(os.path.join(MODEL_DIR, 'model_metadata.txt'), 'w') as f:
        for key, value in metadata.items():
            f.write(f"{key}: {value}\n")
    
    return {
        'accuracy': accuracy,
        'f1_score': f1,
        'precision': precision,
        'recall': recall
    }

def load_model():
    """Load the trained model and vectorizer"""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
        # Train model if it doesn't exist
        train_model()
    
    # Load model and vectorizer
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    
    return model, vectorizer

def predict(email_text):
    """Predict if an email is phishing using the ML model"""
    try:
        # Load model and vectorizer
        model, vectorizer = load_model()
        
        # Preprocess text
        processed_text = preprocess_text(email_text)
        
        # Vectorize text
        text_tfidf = vectorizer.transform([processed_text])
        
        # Make prediction
        prediction = model.predict(text_tfidf)[0]
        probability = model.predict_proba(text_tfidf)[0][1]  # Probability of phishing class
        
        return {
            'is_phishing': bool(prediction),
            'probability': float(probability),
            'confidence': 'high' if abs(probability - 0.5) > 0.3 else 'medium' if abs(probability - 0.5) > 0.15 else 'low'
        }
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return {
            'is_phishing': False,
            'probability': 0.0,
            'confidence': 'error',
            'error': str(e)
        }

def get_model_status():
    """Get the status of the ML model"""
    model_exists = os.path.exists(MODEL_PATH)
    vectorizer_exists = os.path.exists(VECTORIZER_PATH)
    metadata_path = os.path.join(MODEL_DIR, 'model_metadata.txt')
    
    metadata = {}
    if os.path.exists(metadata_path):
        with open(metadata_path, 'r') as f:
            for line in f:
                if ':' in line:
                    key, value = line.strip().split(':', 1)
                    metadata[key.strip()] = value.strip()
    
    return {
        'model_exists': model_exists,
        'vectorizer_exists': vectorizer_exists,
        'metadata': metadata
    }

def retrain_model():
    """Retrain the ML model"""
    return train_model() 