from django.core.management.base import BaseCommand
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_squared_error

class Command(BaseCommand):
    help = 'Train the job recommendation model'

    def handle(self, *args, **kwargs):
        # Path to your CSV file
        csv_path = r'C:\Users\nebiu\PycharmProjects\job_board\job_board\jobs\data\job_postings.csv'

        # Load the dataset
        data = pd.read_csv(csv_path)

        # Preprocessing and match score calculation logic
        def skills_match(x, user_skills):
            if isinstance(x, str):  # If skills_desc is a string
                return 1 if any(skill.lower() in x.lower() for skill in user_skills) else 0
            elif isinstance(x, list):  # If skills_desc is a list
                return 1 if any(skill.lower() in skill_item.lower() for skill_item in x for skill in user_skills) else 0
            else:
                return 0

        user_input = {
            'title': 'Software Engineer',
            'location': 'San Francisco',
            'min_salary': 60000,
            'max_salary': 120000,
            'skills_desc': ['Python', 'Django', 'Machine Learning']
        }

        # Ensure company_name exists
        if 'company_name' not in data.columns:
            data['company_name'] = 'Not provided'

        # Calculate match score
        data['match_score'] = (
            0.25 * data['title'].apply(lambda x: 1 if user_input['title'].lower() in str(x).lower() else 0.5) +
            0.25 * data['location'].apply(lambda x: 1 if user_input['location'].lower() in str(x).lower() else 0.5) +
            0.25 * data[['max_salary', 'med_salary', 'min_salary']].mean(axis=1).apply(
                lambda x: 1 if user_input['min_salary'] <= x <= user_input['max_salary'] else 0.5) +
            0.25 * data['skills_desc'].apply(lambda x: skills_match(x, user_input['skills_desc']))
        )

        # Split data for training
        X = pd.get_dummies(data[['title', 'location', 'max_salary', 'med_salary', 'min_salary', 'skills_desc']], drop_first=True)
        y = data['match_score']
        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

        # Standardize the data
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_val_scaled = scaler.transform(X_val)

        # Train the RandomForestRegressor
        model = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
        model.fit(X_train_scaled, y_train)

        # Evaluate the model
        y_pred = model.predict(X_val_scaled)
        r_squared = r2_score(y_val, y_pred)
        mse = mean_squared_error(y_val, y_pred)
        self.stdout.write(self.style.SUCCESS(f"R-squared: {r_squared}"))
        self.stdout.write(self.style.SUCCESS(f"Mean Squared Error: {mse}"))

        # Predict top candidates
        data['predicted_match_score'] = model.predict(scaler.transform(pd.get_dummies(X, drop_first=True)))
        top_5_candidates = data[data['predicted_match_score'] > 0.2].nlargest(5, 'predicted_match_score')[['title', 'location', 'company_name', 'max_salary', 'predicted_match_score']]

        # Output the top 5 candidates
        self.stdout.write(self.style.SUCCESS('Top 5 Candidates:'))
        for idx, job in top_5_candidates.iterrows():
            self.stdout.write(self.style.SUCCESS(f"{job['title']} at {job['company_name']} in {job['location']} with a score of {job['predicted_match_score']:.2f}%"))

