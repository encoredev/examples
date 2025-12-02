// State
let history = [];
let isRunning = false;
let isGenerating = false;
let editor = null;

// DOM Elements
const languageSelect = document.getElementById('language');
const runBtn = document.getElementById('run-btn');
const output = document.getElementById('output');
const executionTime = document.getElementById('execution-time');
const aiPrompt = document.getElementById('ai-prompt');
const historyList = document.getElementById('history-list');

// Language templates
const templates = {
    python: `# Calculate Fibonacci sequence
def fibonacci(n):
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

result = fibonacci(10)
print(f"First 10 Fibonacci numbers: {result}")`,
    
    typescript: `// Calculate Fibonacci sequence
function fibonacci(n: number): number[] {
    const fib: number[] = [0, 1];
    for (let i = 2; i < n; i++) {
        fib.push(fib[i - 1] + fib[i - 2]);
    }
    return fib;
}

const result = fibonacci(10);
console.log(\`First 10 Fibonacci numbers: \${result.join(', ')}\`);`,
    
    javascript: `// Calculate Fibonacci sequence
function fibonacci(n) {
    const fib = [0, 1];
    for (let i = 2; i < n; i++) {
        fib.push(fib[i - 1] + fib[i - 2]);
    }
    return fib;
}

const result = fibonacci(10);
console.log(\`First 10 Fibonacci numbers: \${result.join(', ')}\`);`
};

// Ace Editor language modes
const aceLanguageModes = {
    python: 'ace/mode/python',
    typescript: 'ace/mode/typescript',
    javascript: 'ace/mode/javascript'
};

// Initialize Ace Editor
window.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    
    editor = ace.edit('code-editor');
    editor.setTheme('ace/theme/tomorrow_night');
    editor.session.setMode(aceLanguageModes.python);
    editor.setValue(templates.python, -1);
    editor.setOptions({
        fontSize: '13px',
        fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
        showPrintMargin: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: false,
        tabSize: 4,
        useSoftTabs: true
    });
    
    // Update editor mode and template when language changes
    languageSelect.addEventListener('change', () => {
        const lang = languageSelect.value;
        editor.session.setMode(aceLanguageModes[lang]);
        editor.setValue(templates[lang], -1);
    });
    
    // Keyboard shortcut: Cmd/Ctrl + Enter to run
    editor.commands.addCommand({
        name: 'runCode',
        bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
        exec: function() {
            runCode();
        }
    });
});

// Run code
async function runCode() {
    if (isRunning) return;
    
    const code = editor.getValue();
    const language = languageSelect.value;
    
    if (!code.trim()) {
        showOutput('Please enter some code to run.', 'error');
        return;
    }
    
    isRunning = true;
    runBtn.disabled = true;
    runBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="10 8 16 12 10 16"></polyline></svg> Running...';
    output.classList.add('loading');
    showOutput('Executing code in Daytona sandbox...', '');
    
    try {
        const startTime = Date.now();
        
        const response = await fetch('/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                language,
                userId: 'playground-user'
            })
        });
        
        const data = await response.json();
        const elapsed = Date.now() - startTime;
        
        if (data.error || data.exitCode !== 0) {
            showOutput(data.error || data.output || 'Execution failed', 'error');
            addToHistory(code, language, data.error || data.output, false, data.executionTimeMs || elapsed);
        } else {
            showOutput(data.output || 'Code executed successfully (no output)', 'success');
            addToHistory(code, language, data.output, true, data.executionTimeMs || elapsed);
        }
        
        executionTime.textContent = `${data.executionTimeMs || elapsed}ms`;
    } catch (error) {
        showOutput(`Error: ${error.message}`, 'error');
        addToHistory(code, language, error.message, false, 0);
    } finally {
        isRunning = false;
        runBtn.disabled = false;
        runBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Run Code';
        output.classList.remove('loading');
    }
}

// Generate code with AI
async function generateCode() {
    if (isGenerating) return;
    
    const prompt = aiPrompt.value.trim();
    const language = languageSelect.value;
    
    if (!prompt) {
        aiPrompt.placeholder = 'Please enter a prompt...';
        setTimeout(() => {
            aiPrompt.placeholder = 'Ask Claude to generate code...';
        }, 2000);
        aiPrompt.focus();
        return;
    }
    
    isGenerating = true;
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    showOutput('Generating code with Claude...', '');
    
    try {
        const response = await fetch('/ai/generate-and-run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                language
            })
        });
        
        const data = await response.json();
        
        if (data.code) {
            editor.setValue(data.code, -1);
            
            if (data.success) {
                showOutput(data.output || 'Code generated and executed successfully!', 'success');
                addToHistory(data.code, language, data.output, true, 0);
            } else {
                showOutput(`Generated but execution failed:\n${data.output}`, 'error');
                addToHistory(data.code, language, data.output, false, 0);
            }
            
            executionTime.textContent = `${data.attempts} attempt${data.attempts > 1 ? 's' : ''}`;
        } else {
            showOutput('Failed to generate code. Please try again.', 'error');
        }
        
        aiPrompt.value = '';
    } catch (error) {
        showOutput(`Error: ${error.message}`, 'error');
    } finally {
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
    }
}

// Show output
function showOutput(text, type) {
    output.textContent = text;
    output.className = 'output';
    if (type) {
        output.classList.add(type);
    }
}

// Clear code
function clearCode() {
    const lang = languageSelect.value;
    editor.setValue(templates[lang], -1);
    editor.focus();
}

// History management
function addToHistory(code, language, result, success, timeMs) {
    const item = {
        id: Date.now(),
        code,
        language,
        result,
        success,
        timeMs,
        timestamp: new Date().toLocaleTimeString()
    };
    
    history.unshift(item);
    if (history.length > 20) {
        history = history.slice(0, 20);
    }
    
    saveHistory();
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<div style="padding: 20px; color: var(--text-tertiary); font-size: 12px; text-align: center;">No executions yet</div>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item ${item.success ? 'success' : 'error'}" onclick="loadFromHistory(${item.id})">
            <div class="history-language">${item.language}</div>
            <div class="history-code">${escapeHtml(item.code.split('\n')[0])}</div>
            <div class="history-time">${item.timestamp} · ${item.timeMs}ms</div>
        </div>
    `).join('');
}

function loadFromHistory(id) {
    const item = history.find(h => h.id === id);
    if (item) {
        editor.setValue(item.code, -1);
        languageSelect.value = item.language;
        editor.session.setMode(aceLanguageModes[item.language]);
        showOutput(item.result, item.success ? 'success' : 'error');
        executionTime.textContent = `${item.timeMs}ms`;
    }
}

function clearHistory() {
    if (!confirm('Clear all execution history?')) return;
    history = [];
    saveHistory();
    renderHistory();
}

function saveHistory() {
    try {
        localStorage.setItem('daytona-history', JSON.stringify(history));
    } catch (e) {
        // Ignore storage errors
    }
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('daytona-history');
        if (saved) {
            history = JSON.parse(saved);
        }
    } catch (e) {
        history = [];
    }
    renderHistory();
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
