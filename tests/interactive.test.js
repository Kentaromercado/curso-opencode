// Tests para el CLI interactivo de main.js

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { processCommand, startOpencode, showProviderConfig, showSessions, showHelp } = require('../src/main');

describe('processCommand', () => {
    it('should handle help command', () => {
        const result = processCommand('help');
        assert.ok(result.includes('Ayuda'));
        assert.ok(result.includes('start'));
    });

    it('should handle ? as help', () => {
        const result = processCommand('?');
        assert.ok(result.includes('Ayuda'));
    });

    it('should handle start command with actual content', () => {
        const result = processCommand('start');
        assert.ok(result.includes('Iniciando'));
    });

    it('should handle config command with actual content', () => {
        const result = processCommand('config');
        assert.ok(result.includes('Proveedores disponibles'));
    });

    it('should handle sessions command with actual content', () => {
        const result = processCommand('sessions');
        assert.ok(result.includes('No hay sesiones') || result.includes('Sesiones guardadas'));
    });

    it('should handle exit command', () => {
        assert.strictEqual(processCommand('exit'), 'exit');
    });

    it('should handle 4 as exit', () => {
        assert.strictEqual(processCommand('4'), 'exit');
    });
});

describe('startOpencode', () => {
    it('should return a start message', () => {
        const result = startOpencode();
        assert.ok(result.includes('Iniciando'));
    });
});

describe('showProviderConfig', () => {
    it('should return providers list', () => {
        const result = showProviderConfig();
        assert.ok(result.includes('OpenAI'));
    });
});

describe('showSessions', () => {
    it('should return session info', () => {
        const result = showSessions();
        assert.ok(typeof result === 'string');
    });
});

describe('showHelp', () => {
    it('should list all commands', () => {
        const result = showHelp();
        assert.ok(result.includes('start'));
        assert.ok(result.includes('config'));
        assert.ok(result.includes('sessions'));
        assert.ok(result.includes('exit'));
    });
});
