

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();


app.use(cors()); 
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static(path.join(__dirname, 'public', 'data'))); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/load-excel', (req, res) => {
    const filePath = path.join(__dirname,'public', 'data', 'SolyVieDatabase.xlsx');
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: 'File not found' });
    }

    res.sendFile(filePath);
});

app.get('/api/files', (req, res) => {
    const dataDir = path.join(__dirname, 'public', 'data');
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Unable to read directory' });
        }

        const fileDetails = files.map(file => {
            const filePath = path.join(dataDir, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                date: stats.mtime
            };
        });

        res.json({ success: true, files: fileDetails });
    });
});



app.post('/api/save-xlsx', (req, res) => {
    const xlsxData = req.body.xlsxData;
    if (!xlsxData) {
        return res.status(400).json({ success: false, error: 'No XLSX data provided' });
    }

    const xlsxPath = path.join(__dirname, 'public', 'data', 'Solevie.xlsx');
    try {
        if (fs.existsSync(xlsxPath)) {
            fs.copyFileSync(xlsxPath, path.join(__dirname, 'public', 'data', `backup_${Date.now()}.xlsx`));
        }
        fs.writeFileSync(xlsxPath, xlsxData, 'utf8');
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving XLSX:', error);
        res.status(500).json({ success: false, error: 'Failed to save XLSX' });
    }
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});