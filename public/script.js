// Initialize CodeMirror for C/Java code
const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'text/x-csrc',   // C syntax highlighting by default
    theme: 'default',
    tabSize: 4,
    indentUnit: 4
});

document.getElementById('runBtn').addEventListener('click', async () => {
    const code = editor.getValue();              // Get code from CodeMirror
    const input = document.getElementById('input').value;  // Optional user input
    const lang = document.getElementById('language').value;

    if (!['c', 'java'].includes(lang)) {
        alert('Only C and Java code execution is supported.');
        return;
    }

    console.log('====================');
    console.log('Language:', lang);
    console.log('User Input:\n', input);
    console.log('Code:\n', code);
    console.log('====================');

    const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, lang, input }) // send code, lang, and input
    });

    const data = await res.json();

    console.log('Output:\n', data.output);  // log output

    document.getElementById('output').textContent = data.output;
});
