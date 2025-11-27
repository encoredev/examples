const API_BASE = 'http://localhost:4000';
const userId = `user-${Math.random().toString(36).slice(2, 11)}`;

// Session management
let currentSessionId = null;
let sessions = JSON.parse(localStorage.getItem('chat_sessions') || '[]');

// Stats
let messageCount = 0;
let totalCost = 0;
let totalTokens = 0;

// Initialize app
window.addEventListener('DOMContentLoaded', async () => {
    console.log('App initializing, sessions:', sessions);
    loadChatHistory();
    
    if (sessions.length === 0) {
        console.log('No sessions found, creating new chat');
        createNewChat();
    } else {
        console.log('Loading existing session:', sessions[0].id);
        await loadSession(sessions[0].id);
    }
    
    // Auto-resize textarea
    const textarea = document.getElementById('message-input');
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    });
});

async function createNewChat() {
    const sessionId = `session-${Date.now()}`;
    const session = {
        id: sessionId,
        title: 'New Chat',
        createdAt: new Date().toISOString(),
        messageCount: 0,
        totalCost: 0,
        totalTokens: 0
    };
    
    console.log('Creating new chat with session ID:', sessionId);
    sessions.unshift(session);
    saveSessions();
    console.log('Sessions after save:', sessions);
    await loadSession(sessionId);
    loadChatHistory();
}

async function loadSession(sessionId) {
    console.log('Loading session:', sessionId);
    currentSessionId = sessionId;
    
    // Clear messages container
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';
    
    // Reset stats
    messageCount = 0;
    totalCost = 0;
    totalTokens = 0;
    updateStats();
    
    // Update active state in sidebar
    document.querySelectorAll('.chat-history-item').forEach(item => {
        item.classList.toggle('active', item.dataset.sessionId === sessionId);
    });
    
    // Load messages from backend first, THEN show empty state if none exist
    await loadMessagesFromBackend(sessionId);
}

async function loadMessagesFromBackend(sessionId) {
    const messagesContainer = document.getElementById('messages');
    
    console.log('Loading messages for session:', sessionId);
    
    try {
        const response = await fetch(`${API_BASE}/ai/chat/${sessionId}`);
        console.log('Backend response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Loaded messages:', data.messages.length, 'messages');
            
            if (data.messages.length > 0) {
                // Remove empty state
                const emptyState = messagesContainer.querySelector('.empty-state');
                if (emptyState) {
                    emptyState.remove();
                }
                
                // Add all messages
                data.messages.forEach(msg => {
                    console.log('Adding message:', msg.role, msg.content.substring(0, 30));
                    if (msg.role === 'user') {
                        addMessage('user', msg.content, msg.model);
                    } else {
                        addMessage('assistant', msg.content, msg.model, {
                            tokens: msg.tokensUsed,
                            cost: Number(msg.costUsd),
                            latency: 0,
                            traceId: msg.traceId,
                            rating: msg.rating
                        });
                    }
                });
                
                messageCount = data.messages.length;
                totalCost = data.totalCost;
                totalTokens = data.totalTokens;
                updateStats();
                
                // Update session in local storage
                updateSessionStats(sessionId, messageCount, totalCost, totalTokens);
            } else {
                console.log('No messages found for this session');
                // Show empty state if no messages
                if (!messagesContainer.querySelector('.empty-state')) {
                    messagesContainer.innerHTML = `
                        <div class="empty-state">
                            <h2>Start a conversation</h2>
                            <p>Select a model and type your message below</p>
                        </div>
                    `;
                }
            }
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        // Show empty state on error
        if (!messagesContainer.querySelector('.empty-state')) {
            messagesContainer.innerHTML = `
                <div class="empty-state">
                    <h2>Start a conversation</h2>
                    <p>Select a model and type your message below</p>
                </div>
            `;
        }
    }
}

async function sendMessage() {
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('messages');
    const model = document.getElementById('model').value;
    
    const message = input.value.trim();
    if (!message) return;
    
    console.log('Sending message to session:', currentSessionId);
    
    // Remove empty state if present
    const emptyState = messagesContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Disable input
    input.disabled = true;
    sendBtn.disabled = true;
    
    // Add user message to UI
    addMessage('user', message, model);
    input.value = '';
    input.style.height = 'auto';
    
    // Show loading indicator
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = 'message assistant';
    loadingDiv.innerHTML = `
        <div class="message-header">
            <span class="message-role assistant">Assistant</span>
        </div>
        <div class="message-content">
            <div class="loading">Thinking</div>
        </div>
    `;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    try {
        const response = await fetch(`${API_BASE}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message, 
                model, 
                userId, 
                sessionId: currentSessionId 
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Remove loading indicator
        document.getElementById(loadingId)?.remove();
        
        // Add assistant response
        addMessage('assistant', data.response, data.model, {
            tokens: data.tokensUsed,
            cost: data.costUsd,
            latency: data.latencyMs,
            traceId: data.traceId
        });
        
        // Update stats
        messageCount += 2;
        totalCost += data.costUsd;
        totalTokens += data.tokensUsed;
        updateStats();
        
        // Update session title if it's the first message
        const session = sessions.find(s => s.id === currentSessionId);
        console.log('Found session for title update:', session);
        if (session && session.title === 'New Chat') {
            session.title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
            console.log('Updated session title to:', session.title);
            saveSessions();
            loadChatHistory();
        }
        
        // Update session stats
        console.log('Updating session stats for:', currentSessionId);
        updateSessionStats(currentSessionId, messageCount, totalCost, totalTokens);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById(loadingId)?.remove();
        addMessage('assistant', `Error: ${error.message}`, model);
    } finally {
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }
}

function addMessage(role, content, model, metadata = {}) {
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    let metaHTML = '';
    if (metadata.tokens !== undefined && metadata.traceId) {
        metaHTML = `
            <div class="message-stats">
                <span>${metadata.latency}ms</span>
                <span>${metadata.tokens} tokens</span>
                <span>$${metadata.cost.toFixed(6)}</span>
            </div>
            <div class="feedback-container">
                <span class="feedback-label">Rate this response:</span>
                <div class="feedback-buttons" id="feedback-${metadata.traceId}">
                    ${[1,2,3,4,5].map(score => {
                        const isSelected = metadata.rating === score ? 'selected' : '';
                        const isDisabled = metadata.rating && metadata.rating !== score ? 'disabled' : '';
                        const opacity = metadata.rating && metadata.rating !== score ? 'style="opacity: 0.3"' : '';
                        return `<button class="feedback-btn ${isSelected}" ${isDisabled} ${opacity} onclick="rateFeedback('${metadata.traceId}', ${score}, event)">${score}</button>`;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    const modelLabel = model ? ` <span class="message-meta">(${model.split('/')[1]})</span>` : '';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-role ${role}">${role}</span>${modelLabel}
        </div>
        <div class="message-content">${escapeHtml(content)}</div>
        ${metaHTML}
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function rateFeedback(traceId, score, event) {
    const button = event.target;
    const feedbackContainer = document.getElementById(`feedback-${traceId}`);
    
    if (!feedbackContainer) return;
    
    try {
        const response = await fetch(`${API_BASE}/ai/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ traceId, score })
        });
        
        if (response.ok) {
            button.classList.add('selected');
            
            const buttons = feedbackContainer.querySelectorAll('.feedback-btn');
            buttons.forEach(btn => {
                if (btn !== button) {
                    btn.disabled = true;
                    btn.style.opacity = '0.3';
                }
            });
        }
    } catch (error) {
        console.error('Error rating feedback:', error);
        alert('Failed to submit rating');
    }
}

function updateStats() {
    document.getElementById('total-cost').textContent = `$${totalCost.toFixed(4)}`;
    document.getElementById('total-tokens').textContent = totalTokens.toLocaleString();
    document.getElementById('message-count').textContent = messageCount;
}

function updateSessionStats(sessionId, msgCount, cost, tokens) {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
        session.messageCount = msgCount;
        session.totalCost = cost;
        session.totalTokens = tokens;
        session.updatedAt = new Date().toISOString();
        saveSessions();
        loadChatHistory();
    }
}

function loadChatHistory() {
    const historyContainer = document.getElementById('chat-history');
    historyContainer.innerHTML = '';
    
    sessions.forEach(session => {
        const item = document.createElement('div');
        item.className = 'chat-history-item';
        if (session.id === currentSessionId) {
            item.classList.add('active');
        }
        item.dataset.sessionId = session.id;
        
        const date = new Date(session.createdAt);
        const timeAgo = getTimeAgo(date);
        
        item.innerHTML = `
            <div class="chat-history-item-content" onclick="loadSessionFromHistory('${session.id}')">
                <div class="chat-history-item-title">${session.title}</div>
                <div class="chat-history-item-meta">${timeAgo} • ${session.messageCount} msgs</div>
            </div>
            <button class="delete-chat-btn" onclick="deleteChat(event, '${session.id}')" title="Delete chat">
                <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </button>
        `;
        
        historyContainer.appendChild(item);
    });
}

async function loadSessionFromHistory(sessionId) {
    await loadSession(sessionId);
}

async function deleteChat(event, sessionId) {
    event.stopPropagation();
    
    if (!confirm('Delete this conversation?')) {
        return;
    }
    
    console.log('Deleting chat:', sessionId);
    
    // Remove from sessions array
    sessions = sessions.filter(s => s.id !== sessionId);
    saveSessions();
    
    // If we deleted the current session, load another one or create new
    if (currentSessionId === sessionId) {
        if (sessions.length > 0) {
            await loadSession(sessions[0].id);
        } else {
            await createNewChat();
        }
    }
    
    // Reload sidebar
    loadChatHistory();
}

function saveSessions() {
    console.log('Saving sessions to localStorage:', sessions);
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
    console.log('Saved. Reading back:', JSON.parse(localStorage.getItem('chat_sessions') || '[]'));
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow Enter to send (Shift+Enter for new line)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('message-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
