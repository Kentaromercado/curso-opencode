// Tests para session.js

const { describe, it } = require('node:test');
const assert = require('node:assert');
const session = require('../src/session');

describe('listSessions', () => {
    it('should return an array', () => {
        const result = session.listSessions();
        assert.strictEqual(Array.isArray(result), true);
    });
});

describe('formatSessionList', () => {
    it('should show empty message for no sessions', () => {
        const result = session.formatSessionList([]);
        assert.ok(result.includes('No hay sesiones'));
    });

    it('should format sessions with index and date', () => {
        const sessions = [
            { name: 'session1.json', date: '2026-05-06T12:00:00Z' }
        ];
        const result = session.formatSessionList(sessions);
        assert.ok(result.includes('Sesiones guardadas'));
        assert.ok(result.includes('session1.json'));
        assert.ok(result.includes('2026-05-06'));
    });
});
