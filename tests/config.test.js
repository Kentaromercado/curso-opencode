// Tests para config.js

const { describe, it } = require('node:test');
const assert = require('node:assert');
const config = require('../src/config');

describe('config', () => {
    it('should have a name property', () => {
        assert.strictEqual(typeof config.name, 'string');
        assert.ok(config.name.length > 0);
    });

    it('should have a version property', () => {
        assert.strictEqual(typeof config.version, 'string');
        assert.ok(config.version.length > 0);
    });

    it('should have a defaultModel property', () => {
        assert.strictEqual(typeof config.defaultModel, 'string');
        assert.ok(config.defaultModel.includes('/'));
    });

    it('should have a debug property set to false', () => {
        assert.strictEqual(config.debug, false);
    });
});
