const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/run', (req, res) => {
    const code = req.body.code;
    const tempFile = 'temp.c';
    const outputBinary = 'temp.out';

    fs.writeFileSync(tempFile, code);

    // Compile C code
    exec(`gcc ${tempFile} -o ${outputBinary}`, (err, stdout, stderr) => {
        if (err) {
            return res.json({ output: stderr });
        }

        // Execute binary
        exec(`./${outputBinary}`, { timeout: 3000 }, (err, stdout, stderr) => {
            if (err) {
                return res.json({ output: stderr || 'Error during execution' });
            }
            res.json({ output: stdout });
        });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
