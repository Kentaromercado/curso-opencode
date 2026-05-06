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

    it('should handle providers command', () => {
        const result = processCommand('providers');
        assert.strictEqual(typeof result, 'string');
    });

    it('should handle apikeys command', () => {
        const result = processCommand('apikeys');
        assert.ok(result.includes('OpenAI'));
    });

    it('should handle provider-detail command with arg', () => {
        const result = processCommand('provider-detail openai');
        assert.ok(result.includes('OpenAI'));
    });

    it('should handle provider-detail without arg', () => {
        const result = processCommand('provider-detail');
        assert.ok(result.includes('Uso:'));
    });

    it('should handle add-provider with args', () => {
        const result = processCommand('add-provider openai gpt-4');
        assert.ok(result.includes('agregado'));
    });

    it('should handle add-provider without enough args', () => {
        const result = processCommand('add-provider openai');
        assert.ok(result.includes('Uso:'));
    });

    it('should handle remove-provider command', () => {
        const result = processCommand('remove-provider openai');
        assert.strictEqual(typeof result, 'string');
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
