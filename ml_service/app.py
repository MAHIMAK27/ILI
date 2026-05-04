from flask import Flask, request, jsonify
import pandas as pd
import os
from model_pipeline import ILIPredictorPipeline

app = Flask(__name__)
pipeline = ILIPredictorPipeline()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ILI Prediction ML API"})

@app.route('/predict', methods=['POST'])
def predict_risk():
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400
            
        # Read dataset
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        else:
            return jsonify({"error": "Unsupported file format. Please upload CSV or Excel."}), 400
            
        # Predict
        risk_scores = pipeline.predict(df)
        
        # Attach predictions to dataframe
        df['predicted_risk_score'] = risk_scores
        df['risk_level'] = pd.cut(df['predicted_risk_score'], 
                                  bins=[-1, 60, 80, 100], 
                                  labels=['Low', 'Medium', 'High'])
                                  
        # Return summary
        summary = {
            "total_records_processed": len(df),
            "high_risk_count": int(sum(df['risk_level'] == 'High')),
            "average_risk_score": float(df['predicted_risk_score'].mean()),
            "predictions": df[['date', 'predicted_risk_score', 'risk_level']].to_dict(orient='records')[:10] # Top 10 for preview
        }
        
        return jsonify({
            "message": "Prediction successful",
            "data": summary
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
