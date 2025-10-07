document.getElementById('runBtn').addEventListener('click', async () => {
    const code = document.getElementById('code').value;
    const lang = document.getElementById('language').value;
    
    if (lang !== 'c') {
        alert('Only C code execution is supported now.');
        return;
    }

    const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    });
    const data = await res.json();
    document.getElementById('output').textContent = data.output;
});
