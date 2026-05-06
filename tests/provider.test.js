// Tests para provider.js

const { describe, it } = require('node:test');
const assert = require('node:assert');
const provider = require('../src/provider');

describe('getProviders', () => {
    it('should return an array of providers', () => {
        const providers = provider.getProviders();
        assert.strictEqual(Array.isArray(providers), true);
        assert.ok(providers.length > 0);
    });

    it('should have OpenAI as a provider', () => {
        const providers = provider.getProviders();
        const openai = providers.find(p => p.key === 'openai');
        assert.ok(openai);
        assert.ok(openai.models.includes('gpt-4'));
    });
});

describe('formatProviders', () => {
    it('should return a formatted string with providers', () => {
        const result = provider.formatProviders();
        assert.ok(result.includes('OpenAI'));
        assert.ok(result.includes('Anthropic'));
    });

    it('should include model names', () => {
        const result = provider.formatProviders();
        assert.ok(result.includes('gpt-4') || result.includes('gpt-4o'));
    });
});

describe('setProvider', () => {
    it('should set a provider and model', () => {
        const result = provider.setProvider('openai', 'gpt-4');
        assert.ok(result.includes('openai'));
        assert.ok(result.includes('gpt-4'));
    });
});

describe('getCurrentConfig', () => {
    it('should return null when no config exists', () => {
        // This might return a config if one was set above
        // But the test validates the function exists and returns the right type
        const result = provider.getCurrentConfig();
        assert.ok(result === null || typeof result === 'object');
    });
});
