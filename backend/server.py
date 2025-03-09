from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)

rfc = pickle.load(open("model.pkl", "rb"))
ms = pickle.load(open("scaler.pkl", "rb"))

parameter_ranges = {
    "N": (0, 140),
    "P": (5, 145),
    "K": (5, 205),
    "temperature": (8, 45),
    "humidity": (10, 100),
    "ph": (3.5, 9),
    "rainfall": (20, 300)
}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        # Validate parameters
        for param in parameter_ranges:
            value = data[param]
            min_val, max_val = parameter_ranges[param]
            if not (min_val <= value <= max_val):
                return jsonify({"error": f"{param} must be between {min_val} and {max_val}."}), 400
        
        # Prepare features
        features = np.array([[data['N'], data['P'], data['K'], data['temperature'],
                             data['humidity'], data['ph'], data['rainfall']]])
        
        scaled_features = ms.transform(features)
        probabilities = rfc.predict_proba(scaled_features)[0]
        
        crop_dict = {
            0: "Rice", 1: "Maize", 2: "Jute", 3: "Cotton", 4: "Coconut",
            5: "Papaya", 6: "Orange", 7: "Apple", 8: "Muskmelon",
            9: "Watermelon", 10: "Grapes", 11: "Mango", 12: "Banana",
            13: "Pomegranate", 14: "Lentil", 15: "Blackgram", 16: "Mungbean",
            17: "Mothbeans", 18: "Pigeonpeas", 19: "Kidneybeans",
            20: "Chickpea", 21: "Coffee"
        }
        
        sorted_crops = sorted(enumerate(probabilities), key=lambda x: -x[1])
        top_crops = [{"crop": crop_dict[i], "probability": round(prob * 100, 2)} for i, prob in sorted_crops[:5]]
        
        return jsonify({"result": top_crops})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)