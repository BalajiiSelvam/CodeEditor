// C and JAVA
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Route to run C or Java code
app.post('/run', (req, res) => {
    const code = req.body.code;
    const lang = req.body.lang; // 'c' or 'java'
    const input = req.body.input || '';

    console.log('====================');
    console.log('Language:', lang);
    console.log('User Input:\n', input);
    console.log('Code:\n', code);
    console.log('====================');


    if (lang === 'c') {
        const tempFile = 'temp.c';
        const outputBinary = 'temp.out';
        fs.writeFileSync(tempFile, code);

        exec(`gcc ${tempFile} -o ${outputBinary}`, (err, stdout, stderr) => {
            if (err) return res.json({ output: stderr });

            exec(`./${outputBinary}`, { timeout: 3000 }, (err, stdout, stderr) => {
                if (err) return res.json({ output: stderr || 'Error during execution' });
                res.json({ output: stdout });
            });
        });

    } else if (lang === 'java') {
        const className = 'Main'; // Java class must be Main
        const tempFile = `${className}.java`;
        fs.writeFileSync(tempFile, code);

        exec(`javac ${tempFile}`, (err, stdout, stderr) => {
            if (err) return res.json({ output: stderr });

            exec(`java ${className}`, { timeout: 3000 }, (err, stdout, stderr) => {
                if (err) return res.json({ output: stderr || 'Error during execution' });
                res.json({ output: stdout });
            });
        });

    } else {
        res.json({ output: 'Only C and Java are supported.' });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
