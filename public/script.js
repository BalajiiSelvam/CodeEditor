
// Initialize CodeMirror for C code
const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'text/x-csrc',   // C syntax highlighting
    theme: 'default',
    tabSize: 4,
    indentUnit: 4
});


// 
//----------------------------------------------------------------------------------

// VERSION - 2

document.getElementById('runBtn').addEventListener('click', async () => {
    // const code = document.getElementById('code').value;
    const code = editor.getValue();  // get code from CodeMirror instead of textarea
    const input = document.getElementById('input').value;
    const lang = document.getElementById('language').value;

    if (!['c', 'java'].includes(lang)) {
        alert('Only C and Java code execution is supported.');
        return;
    }

    // const res = await fetch('/run', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ code })
    // });
    const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        // body: JSON.stringify({ code, input })  // send input
        body: JSON.stringify({ code, lang })

    });

    const data = await res.json();
    document.getElementById('output').textContent = data.output;
});
