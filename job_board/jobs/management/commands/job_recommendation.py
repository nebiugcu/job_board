from django.core.management.base import BaseCommand
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error


class Command(BaseCommand):
    help = 'Recommend jobs based on user input and select best candidates for jobs'

    def handle(self, *args, **options):
        # Path to your CSV file
        csv_path = 'C:/Users/nebiu/PycharmProjects/job_board/job_board/jobs/data/job_postings.csv'

        # Example user input
        user_input = {
            'title': 'Software Engineer',
            'location': 'San Francisco',
            'min_salary': 60000,
            'max_salary': 120000,
            'skills_desc': ['Python', 'Django', 'Machine Learning']
        }

        # Call the job recommendation function
        self.job_recommendation(csv_path, user_input)

    def job_recommendation(self, csv_path, user_input):
        # Load your dataset
        data = pd.read_csv(csv_path)

        # Ensure skills_desc is treated as a string or list
        def skills_match(x, user_skills):
            if isinstance(x, str):  # If skills_desc is a string
                return 1 if any(skill.lower() in x.lower() for skill in user_skills) else 0
            elif isinstance(x, list):  # If skills_desc is a list
                return 1 if any(skill.lower() in skill_item.lower() for skill_item in x for skill in user_skills) else 0
            else:
                return 0  # No match if it's neither a string nor a list

        # Calculate match score based on matches
        data['match_score'] = (
                0.25 * data['title'].apply(
            lambda x: 1 if user_input['title'].lower() in str(x).lower() else 0) +  # Title match
                0.25 * data['location'].apply(
            lambda x: 1 if user_input['location'].lower() in str(x).lower() else 0) +  # Location match
                0.25 * data[['max_salary', 'med_salary', 'min_salary']].mean(axis=1).apply(
            lambda x: 1 if user_input['min_salary'] <= x <= user_input['max_salary'] else 0) +  # Salary match
                0.25 * data['skills_desc'].apply(lambda x: skills_match(x, user_input['skills_desc']))  # Skills match
        )

        # Define features (X) and target (y)
        X = data[['title', 'location', 'max_salary', 'med_salary', 'min_salary', 'skills_desc']]
        y = data['match_score']

        # Preprocess the data (you may need to handle categorical variables if present)
        X = pd.get_dummies(X, drop_first=True)

        # Split the dataset
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Standardize the features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Train a model (RandomForestRegressor in this case)
        model = RandomForestRegressor(n_estimators=50, max_depth=10, n_jobs=-1, random_state=42)
        model.fit(X_train_scaled, y_train)

        # Make predictions on the test set
        y_pred = model.predict(X_test_scaled)

        # Calculate R-squared and Mean Squared Error (MSE)
        r_squared = model.score(X_test_scaled, y_test)
        mse = mean_squared_error(y_test, y_pred)
        print(f"R-squared: {r_squared}")
        print(f"Mean Squared Error (MSE): {mse}")

        # Predict on all data and find the top 5 candidates
        data['predicted_match_score'] = model.predict(scaler.transform(pd.get_dummies(X, drop_first=True)))
        top_5_candidates = data.nlargest(5, 'predicted_match_score')

        # Display top 5 candidates with salary and company name
        print("\nTop 5 Job Recommendations:")
        for index, row in top_5_candidates.iterrows():
            company_name = row.get('company_name', 'Unknown')  # Ensure the company_name field is present in the data
            max_salary = row.get('max_salary', 'N/A')  # Ensure max_salary is present
            min_salary = row.get('min_salary', 'N/A')  # Ensure min_salary is present
            salary_display = f"${min_salary} - ${max_salary}" if min_salary != 'N/A' and max_salary != 'N/A' else "Salary not specified"

            print(f"Title: {row['title']}")
            print(f"Company: {company_name}")
            print(f"Location: {row['location']}")
            print(f"Salary: {salary_display}")
            print(f"Score: {row['predicted_match_score'] * 100:.2f}%\n")
