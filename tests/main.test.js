// Tests para main.js

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { showBanner, processCommand, main } = require('../src/main');

describe('showBanner', () => {
    it('should include the project name', () => {
        const banner = showBanner();
        assert.ok(banner.includes('Curso Opencode'));
    });

    it('should include the version', () => {
        const banner = showBanner();
        assert.ok(banner.includes('1.0.0'));
    });
});

describe('processCommand', () => {
    it('should process command 1 / start with content', () => {
        const r1 = processCommand('1');
        const r2 = processCommand('start');
        assert.ok(r1.includes('Iniciando'));
        assert.ok(r2.includes('Iniciando'));
    });

    it('should process command 2 / config with content', () => {
        const r1 = processCommand('2');
        const r2 = processCommand('config');
        assert.ok(r1.includes('Proveedores'));
        assert.ok(r2.includes('Proveedores'));
    });

    it('should process command 3 / sessions with content', () => {
        const r1 = processCommand('3');
        const r2 = processCommand('sessions');
        assert.ok(typeof r1 === 'string');
        assert.ok(typeof r2 === 'string');
    });

    it('should process command 4 / exit', () => {
        assert.strictEqual(processCommand('4'), 'exit');
        assert.strictEqual(processCommand('exit'), 'exit');
    });

    it('should handle unknown commands', () => {
        const result = processCommand('xyz');
        assert.ok(result.includes('Comando no reconocido'));
        assert.ok(result.includes('xyz'));
    });

    it('should handle empty strings', () => {
        const result = processCommand('');
        assert.ok(result.includes('Comando no reconocido'));
    });

    it('should handle help command', () => {
        const result = processCommand('help');
        assert.ok(result.includes('Ayuda'));
    });
});

describe('main', () => {
    it('should return banner when called without args', () => {
        const result = main([]);
        assert.ok(result.includes('Curso Opencode'));
    });

    it('should process a command when args are provided', () => {
        const result = main(['start']);
        assert.ok(result.includes('Iniciando'));
    });
});
