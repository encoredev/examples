// State
let history = [];
let isRunning = false;
let isGenerating = false;

// DOM Elements
const codeEditor = document.getElementById('code-editor');
const languageSelect = document.getElementById('language');
const runBtn = document.getElementById('run-btn');
const output = document.getElementById('output');
const executionTime = document.getElementById('execution-time');
const aiPrompt = document.getElementById('ai-prompt');
const historyList = document.getElementById('history-list');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    updateLanguageTemplate();
    
    // Update template when language changes
    languageSelect.addEventListener('change', updateLanguageTemplate);
});

// Language templates
const templates = {
    python: `# Calculate prime numbers
primes = []
n = 2
while len(primes) < 10:
    is_prime = True
    for p in primes:
        if n % p == 0:
            is_prime = False
            break
    if is_prime:
        primes.append(n)
    n += 1

print(f"First 10 primes: {primes}")`,
    
    typescript: `// Calculate prime numbers
const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
};

const primes: number[] = [];
let n = 2;
while (primes.length < 10) {
    if (isPrime(n)) primes.push(n);
    n++;
}

console.log(\`First 10 primes: \${primes.join(', ')}\`);`,
    
    javascript: `// Calculate prime numbers
const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
};

const primes = [];
let n = 2;
while (primes.length < 10) {
    if (isPrime(n)) primes.push(n);
    n++;
}

console.log(\`First 10 primes: \${primes.join(', ')}\`);`
};

function updateLanguageTemplate() {
    const language = languageSelect.value;
    // Only update if editor has default content or is empty
    const currentCode = codeEditor.value.trim();
    const isDefaultTemplate = Object.values(templates).some(t => 
        t.trim() === currentCode || currentCode === ''
    );
    
    if (isDefaultTemplate || currentCode === 'Write your code here...') {
        codeEditor.value = templates[language];
    }
}

// Run code
async function runCode() {
    if (isRunning) return;
    
    const code = codeEditor.value;
    const language = languageSelect.value;
    
    if (!code.trim()) {
        showOutput('Please enter some code to run.', 'error');
        return;
    }
    
    isRunning = true;
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="btn-icon">⏳</span> Running...';
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
        runBtn.innerHTML = '<span class="btn-icon">▶</span> Run';
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
        aiPrompt.focus();
        return;
    }
    
    isGenerating = true;
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    showOutput('Generating code with AI...', '');
    
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
            codeEditor.value = data.code;
            
            if (data.success) {
                showOutput(data.output || 'Code generated and executed successfully!', 'success');
                addToHistory(data.code, language, data.output, true, 0);
            } else {
                showOutput(`Generated but execution failed:\n${data.output}`, 'error');
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
    codeEditor.value = '';
    codeEditor.focus();
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
        historyList.innerHTML = '<div style="padding: 16px; color: var(--text-secondary); font-size: 12px; text-align: center;">No executions yet</div>';
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
        codeEditor.value = item.code;
        languageSelect.value = item.language;
        showOutput(item.result, item.success ? 'success' : 'error');
        executionTime.textContent = `${item.timeMs}ms`;
    }
}

function clearHistory() {
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + Enter to run
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
    }
});

