import pandas as pd
import joblib

loaded_model = joblib.load('logistic_regression_model.pkl')

def predict_loan_status(ApplicantIncome, Gender, Married, Dependents, Education, Self_employed, Coapplicant_income, Loan_amount, Loan_amount_term, Credit_history, Property_area):

    # Create a dictionary with the user input
    user_input = pd.DataFrame({
        'Gender': [int(Gender)],
        'Married': [int(Married)],
        'Dependents': [int(Dependents)],
        'Education': [int(Education)],
        'Self_Employed': [int(Self_employed)],
        'ApplicantIncome': [int(ApplicantIncome)],
        'CoapplicantIncome': [int(Coapplicant_income)],
        'LoanAmount': [int(Loan_amount)],
        'Loan_Amount_Term': [int(Loan_amount_term)],
        'Credit_History': [int(Credit_history)],
        'Property_Area': [int(Property_area)]
    })

   
    # Encode categorical variables
    user_input = pd.get_dummies(user_input)

    prediction = loaded_model.predict(user_input)
    
    if prediction == 0:
        return "No"
    else :
        return "Yes"

if __name__ == "__main__":
    import sys
    args = sys.argv[1:]  # Get input arguments
    prediction = predict_loan_status(*args)  # Call prediction function
    print(prediction)  # Output the prediction result
