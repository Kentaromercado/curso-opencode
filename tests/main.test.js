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
    it('should process command 1 / start', () => {
        assert.strictEqual(processCommand('1'), 'Iniciando Opencode TUI...');
        assert.strictEqual(processCommand('start'), 'Iniciando Opencode TUI...');
    });

    it('should process command 2 / config', () => {
        assert.strictEqual(processCommand('2'), 'Abriendo configuración de proveedor de IA...');
        assert.strictEqual(processCommand('config'), 'Abriendo configuración de proveedor de IA...');
    });

    it('should process command 3 / sessions', () => {
        assert.strictEqual(processCommand('3'), 'Mostrando sesiones guardadas...');
        assert.strictEqual(processCommand('sessions'), 'Mostrando sesiones guardadas...');
    });

    it('should process command 4 / exit', () => {
        assert.strictEqual(processCommand('4'), 'Saliendo del programa...');
        assert.strictEqual(processCommand('exit'), 'Saliendo del programa...');
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
