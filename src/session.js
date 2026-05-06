// Manejo de sesiones

const path = require('path');

const sessionsDir = '.opencode';

function listSessions() {
    try {
        const fs = require('fs');
        const dir = path.join(process.cwd(), sessionsDir);
        
        if (!fs.existsSync(dir)) {
            return [];
        }
        
        const files = fs.readdirSync(dir)
            .filter(f => f.endsWith('.json'))
            .map(f => ({
                name: f,
                date: fs.statSync(path.join(dir, f)).mtime.toISOString()
            }));
        
        return files.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (err) {
        return [];
    }
}

function formatSessionList(sessions) {
    if (sessions.length === 0) {
        return 'No hay sesiones guardadas.';
    }
    
    const lines = ['Sesiones guardadas:'];
    sessions.forEach((s, i) => {
        const date = s.date.split('T')[0];
        lines.push(`  ${i + 1}. ${s.name} (${date})`);
    });
    
    return lines.join('\n');
}

module.exports = { listSessions, formatSessionList };
