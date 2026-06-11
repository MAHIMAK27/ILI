from flask import Flask, request, jsonify
import pandas as pd
from model_pipeline import ILITimeSeriesPredictor

app = Flask(__name__)
predictor = ILITimeSeriesPredictor()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data or 'records' not in data:
            return jsonify({'error': 'Missing records array in request body'}), 400
            
        df = pd.DataFrame(data['records'])
        
        # We need historical records to generate lag features!
        raw_predictions, risk_scores = predictor.predict(df)
        
        results = []
        for i in range(len(df)):
            results.append({
                'date': str(df['date'].iloc[i]) if 'date' in df.columns else f"Record_{i}",
                'predicted_cases': float(raw_predictions[i]),
                'risk_score': float(risk_scores[i])
            })
            
        return jsonify({
            'status': 'success',
            'predictions': results
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/train', methods=['POST'])
def train():
    try:
        data = request.json
        df = pd.DataFrame(data['records'])
        avg_r2 = predictor.train_and_validate(df)
        return jsonify({'status': 'success', 'validation_r2_score': avg_r2})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
