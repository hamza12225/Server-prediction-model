const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // Use body-parser middleware

// Define a route to handle loan prediction
app.post('/predictLoanStatus', (req, res) => {
  // Get input data from the request
  const { 
    ApplicantIncome,
    Gender,
    Married,
    Dependents,
    Education,
    Self_Employed,
    CoapplicantIncome,
    LoanAmount,
    Loan_Amount_Term,
    Credit_History,
    Property_Area
  } = req.body;

  // Call the Python script with input data
  const pythonProcess = spawn('C:\\Python311\\python.exe', [
    'C:\\Users\\Hamza Elhaiki\\Desktop\\BackEnd\\prediction_loan.py',
    ApplicantIncome,
    Gender,
    Married,
    Dependents,
    Education,
    Self_Employed,
    CoapplicantIncome,
    LoanAmount,
    Loan_Amount_Term,
    Credit_History,
    Property_Area
  ]);

  let prediction = '';

  pythonProcess.stdout.on('data', (data) => {
    // Assuming the Python script outputs the prediction
    prediction += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.json({ prediction });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
