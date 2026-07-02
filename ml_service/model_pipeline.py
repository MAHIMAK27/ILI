import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import joblib
import os

class ILITimeSeriesPredictor:
    def __init__(self, model_path='models/xgboost_ili.pkl'):
        self.model_path = model_path
        self.scaler = StandardScaler()
        self.model = xgb.XGBRegressor(
            objective='reg:squarederror',
            n_estimators=200,
            learning_rate=0.05,
            max_depth=5,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        
        if not os.path.exists('models'):
            os.makedirs('models')

    def create_features(self, df):
        """Generates time-series and rolling features."""
        df = df.copy()
        
        # Ensure datetime and sort chronologically
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df = df.sort_values('date').reset_index(drop=True)
            
            # Cyclical Time Features
            df['month'] = df['date'].dt.month
            df['sin_month'] = np.sin(2 * np.pi * df['month']/12.0)
            df['cos_month'] = np.cos(2 * np.pi * df['month']/12.0)
        
        # Impute missing values chronologically
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        # ffill and bfill are deprecated in newer pandas but interpolate is fine
        df[numeric_cols] = df[numeric_cols].interpolate(method='linear')
        df[numeric_cols] = df[numeric_cols].bfill() # fallback for first rows
        
        # Feature Engineering: Symptom severity
        symptom_cols = ['fever_count', 'cough_count', 'sore_throat_count', 'shortness_of_breath_count']
        available_symptoms = [c for c in symptom_cols if c in df.columns]
        
        if available_symptoms:
            df['symptom_severity_score'] = df[available_symptoms].sum(axis=1)
            # Rolling averages (past 3 days/weeks depending on freq)
            df['symptoms_rolling_3'] = df['symptom_severity_score'].rolling(window=3, min_periods=1).mean()
            
            # Lag Features (Target from previous time steps)
            if 'ili_cases_confirmed' in df.columns:
                df['ili_cases_lag_1'] = df['ili_cases_confirmed'].shift(1).fillna(0)
                df['ili_cases_lag_2'] = df['ili_cases_confirmed'].shift(2).fillna(0)

        # Drop non-feature columns
        features = df.select_dtypes(include=[np.number]).drop(columns=['ili_cases_confirmed', 'month'], errors='ignore')
        return features, df

    def train_and_validate(self, df):
        """Trains model using Strict Time-Series Cross-Validation."""
        features, processed_df = self.create_features(df)
        
        if 'ili_cases_confirmed' not in processed_df.columns:
            raise ValueError("Target column 'ili_cases_confirmed' missing for training.")
            
        X = self.scaler.fit_transform(features)
        y = processed_df['ili_cases_confirmed'].values
        
        # Time-Series Split (No random shuffling)
        tscv = TimeSeriesSplit(n_splits=3)
        
        fold = 1
        val_scores = []
        
        print("Starting Time-Series Cross Validation...")
        for train_index, test_index in tscv.split(X):
            X_train, X_test = X[train_index], X[test_index]
            y_train, y_test = y[train_index], y[test_index]
            
            self.model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
            preds = self.model.predict(X_test)
            
            mae = mean_absolute_error(y_test, preds)
            r2 = r2_score(y_test, preds)
            val_scores.append(r2)
            print(f"Fold {fold} - MAE: {mae:.2f}, R2: {r2:.2f}")
            fold += 1
            
        # Final train on all data
        self.model.fit(X, y)
        joblib.dump({'model': self.model, 'scaler': self.scaler, 'feature_cols': features.columns.tolist()}, self.model_path)
        print(f"Final Model saved to {self.model_path}. Avg Val R2: {np.mean(val_scores):.2f}")
        return np.mean(val_scores)

    def predict(self, df):
        """Predicts risk score and actual cases."""
        if not os.path.exists(self.model_path):
            raise Exception("Model not trained yet.")
            
        saved = joblib.load(self.model_path)
        features, _ = self.create_features(df)
        
        # Ensure exact same columns as training
        for col in saved['feature_cols']:
            if col not in features.columns:
                features[col] = 0
        features = features[saved['feature_cols']]
        
        X_scaled = saved['scaler'].transform(features)
        predictions = saved['model'].predict(X_scaled)
        predictions = np.clip(predictions, 0, None) # Prevent negative predictions
        
        # Risk Score normalization
        max_pred = max(predictions) if max(predictions) > 0 else 1
        risk_scores = np.clip((predictions / max_pred) * 100, 0, 100)
        
        return predictions, risk_scores

if __name__ == "__main__":
    # Mock data generation with temporal trends
    dates = pd.date_range(start='2025-01-01', periods=100, freq='D')
    base_trend = np.sin(np.linspace(0, 10, 100)) * 50 + 50
    
    mock_data = pd.DataFrame({
        'date': dates,
        'fever_count': np.clip(base_trend + np.random.normal(0, 5, 100), 0, None),
        'cough_count': np.clip(base_trend * 1.2 + np.random.normal(0, 10, 100), 0, None),
        'population_density': 500,
        'ili_cases_confirmed': np.clip(base_trend * 1.5 + np.random.normal(0, 8, 100), 0, None) # Target correlated with trend
    })
    
    pipeline = ILITimeSeriesPredictor()
    pipeline.train_and_validate(mock_data)
