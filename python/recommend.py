from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from datetime import datetime

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/nexa_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Recommandation(db.Model):
    __tablename__ = 'recommandation'
    id = db.Column(db.Integer, primary_key=True)
    engagement = db.Column(db.Integer)
    date_de_creation = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    cours_id = db.Column(db.Integer, db.ForeignKey('cours.id'))

class Cours(db.Model):
    __tablename__ = 'cours'
    id = db.Column(db.Integer, primary_key=True)
    sujet = db.Column(db.String(100))

@app.route('/recommend', methods=['POST'])
def recommend_courses():
    data = request.json
    user_id = data.get('user_id')

    user_data = Recommandation.query.filter_by(user_id=user_id).all()

    if not user_data:
        return jsonify({'message': 'No recommendations data for this user'}), 404
    
    most_engaged_courses = []
    for rec in user_data:
        for _ in range(rec.engagement): 
            most_engaged_courses.append(rec.cours_id)
    
    courses = Cours.query.all()
    course_subjects = [course.sujet for course in courses]

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(course_subjects)

    engaged_course_vectors = tfidf_matrix[[course.id - 1 for course in courses if course.id in most_engaged_courses]]
    avg_engaged_vector = np.mean(engaged_course_vectors, axis=0)
    cosine_similarities = cosine_similarity(np.asarray(avg_engaged_vector), tfidf_matrix)

    similar_courses_indices = cosine_similarities.argsort()[0][::-1][:5]
    recommended_courses = [courses[i] for i in similar_courses_indices]
    recommended_scores = [cosine_similarities[0][i] for i in similar_courses_indices]

    sujets = [course.sujet for course in recommended_courses]
    plt.figure(figsize=(10, 6))
    bars = plt.bar(sujets, recommended_scores, color='skyblue')
    plt.xlabel('Course Sujet')
    plt.ylabel('Similarity Score')
    plt.title(f'Top 5 Recommended Courses for User {user_id}')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    plot_path = f'recommendations_plot_user_{user_id}_{timestamp}.png'
    plt.savefig(plot_path)
    plt.close()

    result = [{'cours_id': course.id, 'sujet': course.sujet} for course in recommended_courses]

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True,port=5001)
