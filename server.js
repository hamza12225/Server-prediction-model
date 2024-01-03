const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();

const API_KEY = 'LPIBD';
const verifyAPIKey = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.use(bodyParser.json()); // Use body-parser middleware
// Define a route to handle loan prediction
app.post('/predictLoanStatus',verifyAPIKey, (req, res) => {
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
  const pythonProcess = spawn('python', [
    './prediction_loan.py',
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
