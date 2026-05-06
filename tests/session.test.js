// Tests para session.js (gestión completa de sesiones)

const { describe, it } = require('node:test');
const assert = require('node:assert');
const session = require('../src/session');

describe('generateSessionId', () => {
    it('should generate a unique string', () => {
        const id1 = session.generateSessionId();
        const id2 = session.generateSessionId();
        assert.strictEqual(typeof id1, 'string');
        assert.ok(id1.startsWith('session-'));
        assert.notStrictEqual(id1, id2);
    });
});

describe('createSession', () => {
    it('should create a session with default values', () => {
        const result = session.createSession();
        assert.ok(result.success);
        assert.ok(result.session.id.startsWith('session-'));
        assert.ok(result.session.messages.length === 0);
        assert.ok(result.message.includes('creada'));
    });

    it('should create a session with custom name', () => {
        const result = session.createSession('Mi sesión de prueba', 'anthropic', 'claude-3-sonnet');
        assert.ok(result.success);
        assert.strictEqual(result.session.name, 'Mi sesión de prueba');
        assert.strictEqual(result.session.provider, 'anthropic');
        assert.strictEqual(result.session.model, 'claude-3-sonnet');
    });
});

describe('listSessions', () => {
    it('should return an array', () => {
        const result = session.listSessions();
        assert.strictEqual(Array.isArray(result), true);
    });

    it('should list created sessions', () => {
        const created = session.createSession('Test list session');
        assert.ok(created.success);
        
        const list = session.listSessions();
        assert.ok(list.length > 0);
        assert.ok(list.some(s => s.id === created.session.id));
    });
});

describe('loadSession', () => {
    it('should load an existing session', () => {
        const created = session.createSession('Test load session');
        const loaded = session.loadSession(created.session.id);
        
        assert.ok(loaded.success);
        assert.strictEqual(loaded.session.id, created.session.id);
        assert.strictEqual(loaded.session.name, 'Test load session');
    });

    it('should return not found for unknown session', () => {
        const loaded = session.loadSession('non-existent-id');
        assert.strictEqual(loaded.success, false);
        assert.ok(loaded.message.includes('no encontrada'));
    });
});

describe('saveSession', () => {
    it('should update session name', () => {
        const created = session.createSession('Original name');
        const saved = session.saveSession(created.session.id, { name: 'Updated name' });
        
        assert.ok(saved.success);
        assert.strictEqual(saved.session.name, 'Updated name');
    });

    it('should update session messages', () => {
        const created = session.createSession('Messages test');
        const messages = [{ role: 'user', content: 'Hola' }];
        const saved = session.saveSession(created.session.id, { messages });
        
        assert.ok(saved.success);
        assert.strictEqual(saved.session.messages.length, 1);
    });
});

describe('addMessage', () => {
    it('should add a message to a session', () => {
        const created = session.createSession('Message test');
        const result = session.addMessage(created.session.id, 'user', 'Hola mundo');
        
        assert.ok(result.success);
        
        const loaded = session.loadSession(created.session.id);
        assert.ok(loaded.success);
        assert.strictEqual(loaded.session.messages.length, 1);
        assert.strictEqual(loaded.session.messages[0].role, 'user');
        assert.strictEqual(loaded.session.messages[0].content, 'Hola mundo');
    });
});

describe('deleteSession', () => {
    it('should delete an existing session', () => {
        const created = session.createSession('To delete');
        const result = session.deleteSession(created.session.id);
        
        assert.ok(result.success);
        assert.ok(result.message.includes('eliminada'));
        
        const loaded = session.loadSession(created.session.id);
        assert.strictEqual(loaded.success, false);
    });

    it('should return not found for unknown session', () => {
        const result = session.deleteSession('non-existent');
        assert.strictEqual(result.success, false);
        assert.ok(result.message.includes('no encontrada'));
    });
});

describe('clearMessages', () => {
    it('should clear all messages', () => {
        const created = session.createSession('Clear test');
        session.addMessage(created.session.id, 'user', 'Mensaje 1');
        session.addMessage(created.session.id, 'assistant', 'Respuesta');
        
        const result = session.clearMessages(created.session.id);
        assert.ok(result.success);
        
        const loaded = session.loadSession(created.session.id);
        assert.strictEqual(loaded.session.messages.length, 0);
    });
});

describe('getSessionDetail', () => {
    it('should show session details', () => {
        const created = session.createSession('Detail test');
        const detail = session.getSessionDetail(created.session.id);
        
        assert.ok(detail.includes('Detail test'));
        assert.ok(detail.includes('ID:'));
        assert.ok(detail.includes('Mensajes:'));
    });

    it('should show messages preview when present', () => {
        const created = session.createSession('Preview test');
        session.addMessage(created.session.id, 'user', 'Este es un mensaje de prueba');
        
        const detail = session.getSessionDetail(created.session.id);
        assert.ok(detail.includes('Usuario'));
        assert.ok(detail.includes('mensaje de prueba'));
    });

    it('should return not found for unknown session', () => {
        const detail = session.getSessionDetail('non-existent');
        assert.ok(detail.includes('no encontrada'));
    });
});

describe('formatSessionList', () => {
    it('should show empty message for no sessions', () => {
        const result = session.formatSessionList([]);
        assert.ok(result.includes('No hay sesiones'));
    });

    it('should format sessions with index and date', () => {
        const sessions = [
            { id: 'session-1', name: 'Test 1', createdAt: '2026-05-06T12:00:00Z' }
        ];
        const result = session.formatSessionList(sessions);
        assert.ok(result.includes('Sesiones guardadas'));
        assert.ok(result.includes('Test 1'));
        assert.ok(result.includes('session-1'));
        assert.ok(result.includes('2026-05-06'));
    });
});
