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

describe('findProvider', () => {
    it('should find provider by key', () => {
        const p = provider.findProvider('openai');
        assert.ok(p);
        assert.strictEqual(p.name, 'OpenAI');
    });

    it('should find provider by name', () => {
        const p = provider.findProvider('OpenAI');
        assert.ok(p);
        assert.strictEqual(p.key, 'openai');
    });

    it('should return null for unknown provider', () => {
        const p = provider.findProvider('unknown');
        assert.strictEqual(p, null);
    });
});

describe('isValidModel', () => {
    it('should return true for valid model', () => {
        assert.strictEqual(provider.isValidModel('openai', 'gpt-4'), true);
    });

    it('should return false for invalid model', () => {
        assert.strictEqual(provider.isValidModel('openai', 'invalid'), false);
    });

    it('should return false for unknown provider', () => {
        assert.strictEqual(provider.isValidModel('unknown', 'gpt-4'), false);
    });
});

describe('getModels', () => {
    it('should return models for known provider', () => {
        const models = provider.getModels('openai');
        assert.ok(models.includes('gpt-4'));
    });

    it('should return empty array for unknown provider', () => {
        const models = provider.getModels('unknown');
        assert.strictEqual(models.length, 0);
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

describe('formatProviderDetail', () => {
    it('should show detail for known provider', () => {
        const result = provider.formatProviderDetail('openai');
        assert.ok(result.includes('OpenAI'));
        assert.ok(result.includes('gpt-4'));
    });

    it('should show not found for unknown provider', () => {
        const result = provider.formatProviderDetail('unknown');
        assert.ok(result.includes('no encontrado'));
    });
});

describe('setProvider', () => {
    it('should set a valid provider and model', () => {
        const result = provider.setProvider('openai', 'gpt-4');
        assert.ok(result.includes('openai'));
        assert.ok(result.includes('gpt-4'));
    });

    it('should reject invalid provider', () => {
        const result = provider.setProvider('unknown', 'gpt-4');
        assert.ok(result.includes('Error'));
    });

    it('should reject invalid model', () => {
        const result = provider.setProvider('openai', 'invalid');
        assert.ok(result.includes('Error'));
        assert.ok(result.includes('no válido'));
    });
});

describe('addProvider', () => {
    it('should add a valid provider', () => {
        const result = provider.addProvider('openai', 'gpt-4');
        assert.ok(result.includes('agregado'));
    });

    it('should reject invalid provider', () => {
        const result = provider.addProvider('unknown', 'gpt-4');
        assert.ok(result.includes('Error'));
    });
});

describe('removeProvider', () => {
    it('should handle non-configured provider', () => {
        const result = provider.removeProvider('google');
        assert.ok(result.includes('no estaba configurado') || result.includes('eliminado'));
    });
});

describe('getCurrentConfig', () => {
    it('should return an object or null', () => {
        const result = provider.getCurrentConfig();
        assert.ok(result === null || typeof result === 'object');
    });
});

describe('formatConfiguredProviders', () => {
    it('should return a string', () => {
        const result = provider.formatConfiguredProviders();
        assert.strictEqual(typeof result, 'string');
    });
});

describe('formatApiKeyStatus', () => {
    it('should return status for all providers', () => {
        const result = provider.formatApiKeyStatus();
        assert.ok(result.includes('OpenAI'));
        assert.ok(result.includes('Ollama'));
    });
});

describe('hasApiKey', () => {
    it('should return boolean', () => {
        const result = provider.hasApiKey('openai');
        assert.strictEqual(typeof result, 'boolean');
    });
});

describe('saveEnvVariable', () => {
    it('should save an env variable', () => {
        const result = provider.saveEnvVariable('TEST_KEY', 'test_value');
        assert.strictEqual(result, true);
    });
});
