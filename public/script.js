// 
//----------------------------------------------------------------------------------

// VERSION - 2
document.getElementById('runBtn').addEventListener('click', async () => {
    const code = document.getElementById('code').value;
    const lang = document.getElementById('language').value;

    if (!['c', 'java'].includes(lang)) {
        alert('Only C and Java code execution is supported.');
        return;
    }

    const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, lang })
    });

    const data = await res.json();
    document.getElementById('output').textContent = data.output;
});
