

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();


app.use(cors()); 
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/api/save-csv', (req, res) => {
    const csv = req.body.csv;
    if (!csv) {
        return res.status(400).json({ success: false, error: 'No CSV data provided' });
    }

    const csvPath = path.join(__dirname, 'public', 'assets', 'data', 'SolyVieDatabase.csv');
    try {
        if (fs.existsSync(csvPath)) {
            fs.copyFileSync(csvPath, path.join(__dirname, 'public', 'assets', 'data', `backup_${Date.now()}.csv`));
        }
        fs.writeFileSync(csvPath, csv, 'utf8');
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving CSV:', error);
        res.status(500).json({ success: false, error: 'Failed to save CSV' });
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});