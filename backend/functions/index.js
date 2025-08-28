const functions = require('firebase-functions');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors')({ origin: true });

// Load Google credentials from the secure key file
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// The ID of your Google Sheet
const SPREADSHEET_ID = '1rxg5GTNX0wFkQtU3NjzkJJysBB3d7cnrCIQd0R1W1NE';

// Helper function to parse a date string into a consistent format (YYYY-MM-DD)
const parseDate = (dateString) => {
  if (!dateString) return null;

  const parts = dateString.split(/[-\/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) { // Handles YYYY-MM-DD from front-end
      const [year, month, day] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else { // Handles DD-MM-YYYY from Google Sheet
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  const dateObj = new Date(dateString);
  if (!isNaN(dateObj.getTime())) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return null;
};

exports.getStudentData = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { registerNumber, dob, classSection } = req.body;

    if (!registerNumber || !dob || !classSection) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const range = `${classSection}!A:Z`;

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: `No data found for sheet: ${classSection}` });
      }

      const formattedDob = parseDate(dob);

      const studentData = rows.find(row => {
        const sheetDob = parseDate(row[4]); // Column E for DOB
        return row[1] === registerNumber && sheetDob === formattedDob; // Column B for Register No.
      });

      if (!studentData) {
        return res.status(404).json({ error: 'Student details not found. Please check your Register Number and Date of Birth.' });
      }

      const feeDefaulterStatus = studentData[2]; // Column C for Fee Status
      if (feeDefaulterStatus && feeDefaulterStatus.trim() !== '') {
        return res.status(403).json({ error: 'Hall Ticket cannot be issued due to a pending fee payment.' });
      }

      // ✅ FIX: Use .trim() to remove whitespace after splitting the string
      const student = {
        photoUrl: studentData[0],
        registerNumber: studentData[1],
        name: studentData[3],
        dob: studentData[4],
        className: classSection.includes('-') ? classSection.split('-')[0].trim() : classSection,
        section: classSection.includes('-') ? classSection.split('-')[1].trim() : 'N/A'
      };
      
      res.json(student);
    } catch (error) {
      console.error('API Error:', error.message);
      if (error.message.includes('Unable to parse range')) {
        return res.status(404).json({ error: `The class "${classSection}" was not found. Please check the selected value.` });
      }
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  });
});