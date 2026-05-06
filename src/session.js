// Manejo de sesiones

const fs = require('fs');
const path = require('path');

const sessionsDir = path.join(process.cwd(), '.opencode', 'sessions');
const sessionsIndexPath = path.join(sessionsDir, 'index.json');

function ensureSessionsDir() {
    if (!fs.existsSync(sessionsDir)) {
        fs.mkdirSync(sessionsDir, { recursive: true });
    }
}

function readIndex() {
    try {
        if (fs.existsSync(sessionsIndexPath)) {
            return JSON.parse(fs.readFileSync(sessionsIndexPath, 'utf8'));
        }
    } catch {
        // ignore read errors
    }
    return [];
}

function writeIndex(index) {
    ensureSessionsDir();
    fs.writeFileSync(sessionsIndexPath, JSON.stringify(index, null, 2));
}

function generateSessionId() {
    const now = new Date();
    const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const random = Math.random().toString(36).substring(2, 6);
    return `session-${dateStr}-${random}`;
}

function createSession(name, provider, model) {
    try {
        ensureSessionsDir();
        const id = generateSessionId();
        const sessionPath = path.join(sessionsDir, `${id}.json`);
        
        const sessionData = {
            id,
            name: name || `Sesión ${id}`,
            provider: provider || 'openai',
            model: model || 'gpt-4',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: []
        };
        
        fs.writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
        
        const index = readIndex();
        index.unshift({ id, name: sessionData.name, createdAt: sessionData.createdAt });
        writeIndex(index);
        
        return { success: true, session: sessionData, message: `Sesión creada: ${sessionData.name} (${id})` };
    } catch (err) {
        return { success: false, message: `Error al crear sesión: ${err.message}` };
    }
}

function loadSession(sessionId) {
    try {
        ensureSessionsDir();
        const sessionPath = path.join(sessionsDir, `${sessionId}.json`);
        
        if (!fs.existsSync(sessionPath)) {
            return { success: false, message: `Sesión no encontrada: ${sessionId}` };
        }
        
        const data = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
        return { success: true, session: data };
    } catch (err) {
        return { success: false, message: `Error al cargar sesión: ${err.message}` };
    }
}

function saveSession(sessionId, updates) {
    try {
        const loaded = loadSession(sessionId);
        if (!loaded.success) return loaded;
        
        const sessionPath = path.join(sessionsDir, `${sessionId}.json`);
        const sessionData = loaded.session;
        
        if (updates.name) sessionData.name = updates.name;
        if (updates.messages) sessionData.messages = updates.messages;
        if (updates.provider) sessionData.provider = updates.provider;
        if (updates.model) sessionData.model = updates.model;
        
        sessionData.updatedAt = new Date().toISOString();
        fs.writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
        
        // Update index
        const index = readIndex();
        const idx = index.findIndex(s => s.id === sessionId);
        if (idx !== -1) {
            index[idx].name = sessionData.name;
            index[idx].updatedAt = sessionData.updatedAt;
        }
        writeIndex(index);
        
        return { success: true, session: sessionData, message: `Sesión guardada: ${sessionData.name}` };
    } catch (err) {
        return { success: false, message: `Error al guardar sesión: ${err.message}` };
    }
}

function deleteSession(sessionId) {
    try {
        ensureSessionsDir();
        const sessionPath = path.join(sessionsDir, `${sessionId}.json`);
        
        if (!fs.existsSync(sessionPath)) {
            return { success: false, message: `Sesión no encontrada: ${sessionId}` };
        }
        
        fs.unlinkSync(sessionPath);
        
        const index = readIndex();
        const filtered = index.filter(s => s.id !== sessionId);
        writeIndex(filtered);
        
        return { success: true, message: `Sesión eliminada: ${sessionId}` };
    } catch (err) {
        return { success: false, message: `Error al eliminar sesión: ${err.message}` };
    }
}

function listSessions() {
    try {
        ensureSessionsDir();
        const index = readIndex();
        return index;
    } catch (err) {
        return [];
    }
}

function getSessionDetail(sessionId) {
    const loaded = loadSession(sessionId);
    if (!loaded.success) {
        return loaded.message;
    }
    
    const s = loaded.session;
    const lines = [
        `Sesión: ${s.name}`,
        `ID: ${s.id}`,
        `Proveedor: ${s.provider}/${s.model}`,
        `Creada: ${s.createdAt}`,
        `Actualizada: ${s.updatedAt}`,
        `Mensajes: ${s.messages.length}`
    ];
    
    if (s.messages.length > 0) {
        lines.push('');
        lines.push('Últimos mensajes:');
        s.messages.slice(-5).forEach((m, i) => {
            const role = m.role === 'user' ? 'Usuario' : 'Asistente';
            const preview = m.content.substring(0, 60).replace(/\n/g, ' ');
            lines.push(`  ${i + 1}. [${role}] ${preview}${m.content.length > 60 ? '...' : ''}`);
        });
    }
    
    return lines.join('\n');
}

function formatSessionList(sessions) {
    if (!sessions || sessions.length === 0) {
        return 'No hay sesiones guardadas.';
    }
    
    const lines = ['Sesiones guardadas:'];
    sessions.forEach((s, i) => {
        const date = s.createdAt ? s.createdAt.split('T')[0] : '?';
        lines.push(`  ${i + 1}. ${s.name} (${s.id}) - ${date}`);
    });
    
    return lines.join('\n');
}

function addMessage(sessionId, role, content) {
    const loaded = loadSession(sessionId);
    if (!loaded.success) return loaded;
    
    const messages = loaded.session.messages || [];
    messages.push({ role, content, timestamp: new Date().toISOString() });
    
    return saveSession(sessionId, { messages });
}

function clearMessages(sessionId) {
    return saveSession(sessionId, { messages: [] });
}

module.exports = {
    createSession,
    loadSession,
    saveSession,
    deleteSession,
    listSessions,
    getSessionDetail,
    formatSessionList,
    addMessage,
    clearMessages,
    generateSessionId
};
