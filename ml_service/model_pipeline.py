import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

class ILIPredictorPipeline:
    def __init__(self, model_path='models/xgboost_ili.pkl'):
        self.model_path = model_path
        self.scaler = StandardScaler()
        self.model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100)
        
        if not os.path.exists('models'):
            os.makedirs('models')

    def preprocess_data(self, df):
        """
        Preprocesses uploaded epidemiological data:
        - Handle missing values
        - Create temporal features
        - Scale features
        """
        # Fill missing numeric values with median
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
        
        # Temporal features
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df['month'] = df['date'].dt.month
            df['week_num'] = df['date'].dt.isocalendar().week
            
        # Feature Engineering: Symptom severity
        symptom_cols = ['fever_count', 'cough_count', 'sore_throat_count', 'shortness_of_breath_count']
        available_symptoms = [c for c in symptom_cols if c in df.columns]
        
        if available_symptoms:
            df['symptom_severity_score'] = df[available_symptoms].sum(axis=1)
            
        # Drop non-numeric for ML
        features = df.select_dtypes(include=[np.number]).drop(columns=['ili_cases_confirmed'], errors='ignore')
        
        scaled_features = self.scaler.fit_transform(features)
        return scaled_features, df

    def train(self, df):
        """Trains the model on historical data"""
        X, processed_df = self.preprocess_data(df)
        y = df['ili_cases_confirmed'] if 'ili_cases_confirmed' in df.columns else np.random.randint(0, 100, size=len(df))
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model.fit(X_train, y_train)
        
        # Save model
        joblib.dump({'model': self.model, 'scaler': self.scaler}, self.model_path)
        print(f"Model saved to {self.model_path}")
        return self.model.score(X_test, y_test)

    def predict(self, df):
        """Loads model and predicts ILI risk score"""
        if not os.path.exists(self.model_path):
            raise Exception("Model not trained yet.")
            
        saved = joblib.load(self.model_path)
        model = saved['model']
        scaler = saved['scaler']
        
        features, _ = self.preprocess_data(df)
        features_scaled = scaler.transform(features)
        
        predictions = model.predict(features_scaled)
        
        # Normalize predictions to 0-100 risk score
        max_pred = max(predictions) if max(predictions) > 0 else 1
        risk_scores = np.clip((predictions / max_pred) * 100, 0, 100)
        
        return risk_scores

if __name__ == "__main__":
    # Mock data generation for testing
    print("Generating mock dataset for initial training...")
    mock_data = pd.DataFrame({
        'date': pd.date_range(start='2025-01-01', periods=100, freq='W'),
        'fever_count': np.random.randint(10, 100, 100),
        'cough_count': np.random.randint(10, 120, 100),
        'sore_throat_count': np.random.randint(5, 50, 100),
        'population_density': np.random.randint(100, 1000, 100),
        'ili_cases_confirmed': np.random.randint(20, 200, 100)
    })
    
    pipeline = ILIPredictorPipeline()
    r2_score = pipeline.train(mock_data)
    print(f"Initial training complete. R2 Score: {r2_score:.2f}")
