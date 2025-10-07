A simple web-based code editor that lets users write C code and run it locally. The frontend provides a textarea, language dropdown, run button, and output display. The backend saves the code temporarily, compiles and executes it using the local GCC compiler, and returns the output to the frontend.

**1. Folder Structure**

<img width="247" height="252" alt="image" src="https://github.com/user-attachments/assets/579497ee-96a7-46be-8548-e722d6f229d2" />


**2. Role of each files**

🗹 index.html                   | Provides the user interface : code editor textarea, language dropdown, run button, and output display.     

🗹 style.css                    | Styles the editor and output section (fonts, colors, spacing).   

🗹 script.js                    | Handles frontend logic : captures code from textarea, sends it via POST request to `/run`, and displays output. 

🗹 server.js                    | Backend logic : receives code, saves it temporarily, compiles C code, executes it, sends stdout/stderr back.    

🗹 package.json                 | Tracks dependencies (`express`, `body-parser`) and Node scripts.      

🗹 package-lock.json            | Ensures exact versions of dependencies.                                                                            

**3. Workflow**
**Step 1:** User opens the page
    🗹 URL: http://localhost:3000
    🗹 Browser loads index.html + style.css + script.js from /public.

**Step 2:** User selects language & writes code
    🗹 Frontend dropdown lets user select language (HTML, CSS, JS, C).
    🗹 Currently only C works. Other options will show alert if selected.
    🗹 User types code in <textarea id="code">.

**Step 3:** User clicks "Run"
    🗹 script.js captures code and selected language.
    🗹 Makes POST request to backend /run:
      fetch('/run', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ code })
      });

**Step 4:** Backend receives code
    🗹 server.js receives POST request with { code: "user code here" }.
    🗹 Backend does the following:
      1. Writes code to temporary file: temp.c (overwrites if exists)
      fs.writeFileSync('temp.c', code);
      2. Compiles the code using GCC:
      exec(`gcc temp.c -o temp.out`, ...)
        --> If compilation fails, stderr is returned to frontend as output.
        --> If compilation succeeds, it generates binary temp.out (on Linux/macOS) or temp.exe (on Windows).

**Step 5:** Execute compiled binary
    🗹 Backend executes the binary:
    🗹 Captures:
      --> stdout → normal output (e.g., Hello World)
      --> stderr → runtime errors (e.g., segmentation fault)
    🗹 Returns the output back to frontend in JSON:
    { "output": "Hello World\n" }

**Step 6:** Frontend displays output
    🗹 script.js receives JSON from server.
    🗹 Updates <pre id="output"> with returned output.

**Note :**
1. GCC must be installed locally (gcc --version). Execution happens on your laptop, not any external API.
2. Running arbitrary C code can potentially crash or harm your machine. Current code does not sandbox, but uses 3-second timeout.
