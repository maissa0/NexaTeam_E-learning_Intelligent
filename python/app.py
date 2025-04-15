from flask import Flask, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.json
    feedback_text = data.get('text', '')

    scores = analyzer.polarity_scores(feedback_text)
    compound = scores['compound']  

   
    if compound <= -0.6:
        emotion = 0
    elif compound <= -0.2:
        emotion = 1
    elif compound < 0.2:
        emotion = 2
    elif compound < 0.5:
        emotion = 3
    elif compound < 0.8:
        emotion = 4
    else:
        emotion = 5

    return jsonify({"emotion": emotion})

if __name__ == '__main__':
    app.run(port=5000)
