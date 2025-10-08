// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const { exec } = require('child_process');
// const path = require('path');

// const app = express();
// const PORT = 3000;

// app.use(bodyParser.json());
// app.use(express.static('public'));

// app.post('/run', (req, res) => {
//     const code = req.body.code;
//     const tempFile = 'temp.c';
//     const outputBinary = 'temp.out';

//     fs.writeFileSync(tempFile, code);

//     // Compile C code
//     exec(`gcc ${tempFile} -o ${outputBinary}`, (err, stdout, stderr) => {
//         if (err) {
//             return res.json({ output: stderr });
//         }

//         // Execute binary
//         exec(`./${outputBinary}`, { timeout: 3000 }, (err, stdout, stderr) => {
//             if (err) {
//                 return res.json({ output: stderr || 'Error during execution' });
//             }
//             res.json({ output: stdout });
//         });
//     });
// });

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// ------------------------------------------------------------------------------------------

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec, spawn } = require('child_process'); // Added spawn for input support

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// POST route to run C code
app.post('/run', (req, res) => {
    const code = req.body.code;           // Code from frontend
    // const input = req.body.input || '';   // Optional input from frontend
    const input = typeof req.body.input === 'string' ? req.body.input : '';

    //See what front-end send
    console.log('Received code:', code);
    console.log('Received input:', input);

    const tempFile = 'temp.c';            // Temporary C source file
    const outputBinary = 'temp.out';      // Compiled binary

    // Write code to temporary file
    fs.writeFileSync(tempFile, code);

    // Compile the C code
    exec(`gcc ${tempFile} -o ${outputBinary}`,{ timeout: 3000 }, (err, stdout, stderr) => {
        if (err) {
            // Compilation error
            return res.json({ output: stderr  || 'Error during execution' });
        }

        // Run the compiled binary
        // const process = spawn(`./${outputBinary}`);
        const path = require('path');
        const binaryPath = path.join(__dirname, 'temp.out');
        // const process = spawn(binaryPath);
        const process = spawn(binaryPath);

        let outputData = '';

        // Capture stdout
        process.stdout.on('data', data => outputData += data);

        // Capture stderr (runtime errors)
        process.stderr.on('data', data => outputData += data);

        // When process finishes, send output back
        process.on('close', () => res.json({ output: outputData }));

        // Send user input to program
        // process.stdin.write(input);
        // process.stdin.end();
         if (input) {
            const lines = input.split('\n');
            lines.forEach(line => process.stdin.write(line + '\n'));
        }
        process.stdin.end();
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

