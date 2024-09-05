import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import SGDRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from django.core.management.base import BaseCommand

# Relative path to the CSV file from job_recommendation.py
csv_path = os.path.join('..', '..', 'data', 'job_postings.csv')

class Command(BaseCommand):
    help = 'Load, preprocess data, train model and save job match model'

    def handle(self, *args, **kwargs):
        X_train, X_test, y_train, y_test, scaler = self.load_and_preprocess_data()
        model, scaler = self.train_incrementally(X_train, y_train)

        # Save the model and scaler for later use
        model_path = os.path.join('..', 'models', 'best_job_match_model.pkl')
        scaler_path = os.path.join('..', 'models', 'scaler.pkl')
        joblib.dump(model, model_path)
        joblib.dump(scaler, scaler_path)

        # Evaluate the model
        self.evaluate_model(model, scaler, X_test, y_test)

    def load_and_preprocess_data(self):
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"CSV file not found at path: {csv_path}")

        data = pd.read_csv(csv_path, nrows=1000000)  # Load only a portion for now, adjust as needed
        data.fillna('', inplace=True)

        # Convert salary fields to numeric, coerce errors to NaN
        data['min_salary'] = pd.to_numeric(data['min_salary'], errors='coerce')
        data['max_salary'] = pd.to_numeric(data['max_salary'], errors='coerce')

        # Handle missing or invalid salary data (for now, fill NaNs with 0)
        data['min_salary'].fillna(0, inplace=True)
        data['max_salary'].fillna(0, inplace=True)

        candidate_profile = {
            'desired_titles': ['Software Engineer', 'Data Scientist'],
            'preferred_location': 'New York, NY',
            'expected_salary': 100000,
            'experience_level': 'Mid-level',
            'skills': ['Python', 'Django', 'Machine Learning']
        }

        def calculate_job_match(row, candidate_profile):
            score = 0
            if any(title.lower() in row['title'].lower() for title in candidate_profile['desired_titles']):
                score += 20
            if candidate_profile['preferred_location'].lower() in row['location'].lower():
                score += 20
            # Salary match (ensure salary fields are numeric)
            if row['min_salary'] <= candidate_profile['expected_salary'] <= row['max_salary']:
                score += 20
            if candidate_profile['experience_level'].lower() in str(row['formatted_experience_level']).lower():
                score += 20
            matched_skills = [skill for skill in candidate_profile['skills'] if
                              skill.lower() in str(row['skills_desc']).lower()]
            score += 20 * (len(matched_skills) / len(candidate_profile['skills']))
            return score

        data['job_match_score'] = data.apply(calculate_job_match, axis=1, candidate_profile=candidate_profile)
        X = data.drop(['job_match_score', 'job_id', 'company_id'], axis=1)
        y = data['job_match_score']

        # Convert categorical variables to dummy/indicator variables
        X = pd.get_dummies(X)

        # Split the dataset into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)
        X_test = scaler.transform(X_test)

        return X_train, X_test, y_train, y_test, scaler

    def train_incrementally(self, X_train, y_train):
        model = SGDRegressor()
        batch_size = 1000

        for i in range(0, len(X_train), batch_size):
            X_batch = X_train[i:i + batch_size]
            y_batch = y_train[i:i + batch_size]

            model.partial_fit(X_batch, y_batch)

        return model, scaler

    def evaluate_model(self, model, scaler, X_test, y_test):
        X_test = scaler.transform(X_test)
        y_pred = model.predict(X_test)

        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        self.stdout.write(f'Model Mean Squared Error: {mse:.2f}')
        self.stdout.write(f'R-squared: {r2:.2f}')
