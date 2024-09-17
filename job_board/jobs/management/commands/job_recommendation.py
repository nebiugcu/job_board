from django.core.management.base import BaseCommand
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import r2_score
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import numpy as np

# Define the path to your CSV file
csv_path = r'E:\job_board\job_board\jobs\data\job_postings.csv'

# Candidate profile for job match calculation
candidate_profile = {
    'desired_titles': ['Software Engineer', 'Data Scientist'],
    'preferred_location': 'New York, NY',
    'expected_salary': 100000,
    'experience_level': 'Mid-level',
    'skills': ['Python', 'Django', 'Machine Learning']
}

class Command(BaseCommand):
    help = 'Load, preprocess data, train model, and recommend jobs'

    def calculate_job_match(self, row, candidate_profile):
        """Calculates job match score with custom weights for each criterion."""
        score = 0
        max_score = 100  # Total possible score for normalization
        score_weights = {
            'title': 5,  # 25% weight
            'location': 5,  # 15% weight
            'salary': 20,  # 20% weight
            'skills':70,  # 40% weight
        }

        # Title Match - Basic string matching
        title_str = str(row.get('title', ''))
        if any(title.lower() in title_str.lower() for title in candidate_profile['desired_titles']):
            score += score_weights['title']

        # Location Match
        if candidate_profile['preferred_location'].lower() in str(row.get('location', '')).lower():
            score += score_weights['location']

        # Salary Match
        if row['min_salary'] and row['max_salary']:
            salary_range = row['max_salary'] - row['min_salary']
            if salary_range > 0:
                salary_proximity = 1 - (abs(candidate_profile['expected_salary'] - row['min_salary']) / salary_range)
                score += score_weights['salary'] * max(0, salary_proximity)

        # Skills Match using TF-IDF and cosine similarity
        candidate_skills = candidate_profile['skills']
        job_skills = str(row['skills_desc'])

        if candidate_skills and job_skills:
            vectorizer = TfidfVectorizer()
            skills_vecs = vectorizer.fit_transform([', '.join(candidate_skills), job_skills])
            cosine_sim = cosine_similarity(skills_vecs[0], skills_vecs[1]).flatten()[0]
            score += score_weights['skills'] * cosine_sim

        return (score / max_score) * 100

    def load_and_preprocess_data(self, csv_path):
        df = pd.read_csv(csv_path)

        # Fill missing salary values with the median
        df['min_salary'] = df['min_salary'].fillna(df['min_salary'].median())
        df['max_salary'] = df['max_salary'].fillna(df['max_salary'].median())
        df['skills_desc'] = df['skills_desc'].fillna('')

        # Apply job match score
        df['job_match_score'] = df.apply(lambda row: self.calculate_job_match(row, candidate_profile), axis=1)
        return df

    def recommend_top_jobs(self, df, top_n=5):
        """Return the top N recommended jobs based on the calculated job match score."""
        # Sort jobs by match score in descending order
        recommended_jobs = df.sort_values(by='job_match_score', ascending=False).head(top_n)
        return recommended_jobs[['title', 'location', 'job_match_score']]

    def train_neural_network(self, X_train, y_train, X_test, y_test):
        # Define the neural network
        model = Sequential()
        model.add(Dense(128, activation='relu', input_shape=(X_train.shape[1],)))
        model.add(Dense(64, activation='relu'))
        model.add(Dense(32, activation='relu'))
        model.add(Dense(1, activation='linear'))

        # Optimizer with learning rate schedule
        initial_learning_rate = 0.01
        lr_schedule = Adam(learning_rate=initial_learning_rate)

        model.compile(optimizer=lr_schedule, loss='mean_squared_error', metrics=['mean_squared_error'])

        # Early stopping to prevent overfitting
        early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

        # Train the model with a smaller batch size and early stopping
        history = model.fit(X_train, y_train, validation_data=(X_test, y_test),
                            epochs=100, batch_size=32, callbacks=[early_stopping], verbose=2)

        # Evaluate the model on test data
        mse, _ = model.evaluate(X_test, y_test, verbose=2)

        # Predict using the trained model
        y_pred = model.predict(X_test)

        # Calculate R-squared score
        r2_nn = r2_score(y_test, y_pred)

        return model, mse, r2_nn

    def handle(self, *args, **kwargs):
        df = self.load_and_preprocess_data(csv_path)

        # Recommend top 5 jobs based on match score
        self.stdout.write(self.style.SUCCESS("Top 5 Job Recommendations:"))
        recommended_jobs = self.recommend_top_jobs(df, top_n=5)
        self.stdout.write(str(recommended_jobs))

        # Prepare the data for training
        X = df.drop(columns=['job_match_score', 'title', 'location', 'skills_desc', 'description', 'job_posting_url',
                             'application_url'])
        y = df['job_match_score']

        # Fill missing values in X
        X = X.fillna(0)

        # One-hot encode categorical columns
        X_encoded = pd.get_dummies(X, drop_first=True)

        # Split into train and test sets
        X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

        # Standardize the features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Train the neural network model
        self.stdout.write(self.style.SUCCESS("Training Neural Network model..."))
        model, mse, r2_nn = self.train_neural_network(X_train_scaled, y_train, X_test_scaled, y_test)

        self.stdout.write(self.style.SUCCESS(f"Neural Network - Mean Squared Error: {mse:.2f}"))
        self.stdout.write(self.style.SUCCESS(f"Neural Network - R-squared: {r2_nn:.2f}"))
