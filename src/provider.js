// Configuración de proveedores de IA

const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), '.opencode', 'providers.json');
const envConfigPath = path.join(process.cwd(), '.opencode', '.env');

const DEFAULT_PROVIDERS = [
    { name: 'OpenAI', key: 'openai', envKey: 'OPENAI_API_KEY', models: ['gpt-4', 'gpt-4o', 'gpt-3.5-turbo'] },
    { name: 'Anthropic', key: 'anthropic', envKey: 'ANTHROPIC_API_KEY', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
    { name: 'Google', key: 'google', envKey: 'GOOGLE_API_KEY', models: ['gemini-pro', 'gemini-ultra'] },
    { name: 'Ollama (local)', key: 'ollama', envKey: null, models: ['llama2', 'mistral', 'codellama'] }
];

function getProviders() {
    return JSON.parse(JSON.stringify(DEFAULT_PROVIDERS));
}

function findProvider(keyOrName) {
    const providers = getProviders();
    const normalized = keyOrName.toLowerCase().trim();
    return providers.find(p =>
        p.key === normalized ||
        p.name.toLowerCase() === normalized
    ) || null;
}

function isValidModel(providerKey, model) {
    const p = findProvider(providerKey);
    if (!p) return false;
    return p.models.includes(model);
}

function getModels(providerKey) {
    const p = findProvider(providerKey);
    return p ? p.models : [];
}

function formatProviders() {
    const providers = getProviders();
    const lines = ['Proveedores disponibles:'];

    providers.forEach((p, i) => {
        lines.push(`  ${i + 1}. ${p.name} (${p.key})`);
        lines.push(`     Modelos: ${p.models.join(', ')}`);
    });

    return lines.join('\n');
}

function formatProviderDetail(providerKey) {
    const p = findProvider(providerKey);
    if (!p) return `Proveedor no encontrado: ${providerKey}`;

    const lines = [
        `Proveedor: ${p.name} (${p.key})`,
        `Modelos disponibles:`,
        ...p.models.map((m, i) => `  ${i + 1}. ${m}`)
    ];

    return lines.join('\n');
}

function readProvidersConfig() {
    try {
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    } catch {
        // ignore read errors
    }
    return {};
}

function writeProvidersConfig(config) {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function setProvider(provider, model) {
    try {
        const config = readProvidersConfig();
        const p = findProvider(provider);
        if (!p) {
            return `Error: Proveedor "${provider}" no encontrado.`;
        }
        if (!isValidModel(provider, model)) {
            return `Error: Modelo "${model}" no válido para ${p.name}. Modelos: ${p.models.join(', ')}`;
        }

        config.active = { provider: p.key, model, updatedAt: new Date().toISOString() };
        writeProvidersConfig(config);
        return `Proveedor configurado: ${p.name} (${p.key}/${model})`;
    } catch (err) {
        return `Error al guardar configuración: ${err.message}`;
    }
}

function addProvider(provider, model, apiKey) {
    try {
        const p = findProvider(provider);
        if (!p) {
            return `Error: Proveedor "${provider}" no encontrado.`;
        }
        if (!isValidModel(provider, model)) {
            return `Error: Modelo "${model}" no válido para ${p.name}.`;
        }

        const config = readProvidersConfig();
        if (!config.providers) config.providers = {};

        config.providers[p.key] = {
            model,
            apiKey: apiKey || null,
            addedAt: new Date().toISOString()
        };
        writeProvidersConfig(config);

        if (apiKey && p.envKey) {
            saveEnvVariable(p.envKey, apiKey);
        }

        return `Proveedor ${p.name} agregado con modelo ${model}.`;
    } catch (err) {
        return `Error: ${err.message}`;
    }
}

function removeProvider(provider) {
    try {
        const config = readProvidersConfig();
        const p = findProvider(provider);
        if (!p) {
            return `Error: Proveedor "${provider}" no encontrado.`;
        }

        if (config.providers && config.providers[p.key]) {
            delete config.providers[p.key];
            if (config.active && config.active.provider === p.key) {
                delete config.active;
            }
            writeProvidersConfig(config);
            return `Proveedor ${p.name} eliminado.`;
        }

        return `Proveedor ${p.name} no estaba configurado.`;
    } catch (err) {
        return `Error: ${err.message}`;
    }
}

function getCurrentConfig() {
    const config = readProvidersConfig();
    if (config.active) {
        return config.active;
    }
    return null;
}

function getAllConfiguredProviders() {
    const config = readProvidersConfig();
    return config.providers || {};
}

function formatConfiguredProviders() {
    const config = readProvidersConfig();
    const all = config.providers || {};
    const active = config.active || null;
    const keys = Object.keys(all);

    if (keys.length === 0) {
        return 'No hay proveedores configurados. Use "add" para agregar uno.';
    }

    const lines = ['Proveedores configurados:'];
    keys.forEach((key, i) => {
        const p = findProvider(key);
        const name = p ? p.name : key;
        const marker = active && active.provider === key ? ' [ACTIVO]' : '';
        lines.push(`  ${i + 1}. ${name} (${key}) -> ${all[key].model}${marker}`);
    });

    return lines.join('\n');
}

function saveEnvVariable(key, value) {
    try {
        const lines = [];
        if (fs.existsSync(envConfigPath)) {
            const content = fs.readFileSync(envConfigPath, 'utf8');
            content.split('\n').forEach(line => {
                if (line && !line.startsWith(`${key}=`)) {
                    lines.push(line);
                }
            });
        }
        lines.push(`${key}=${value}`);
        fs.writeFileSync(envConfigPath, lines.join('\n') + '\n');
        return true;
    } catch {
        return false;
    }
}

function getApiKey(providerKey) {
    const p = findProvider(providerKey);
    if (!p || !p.envKey) return null;

    // Try environment variable first
    const env = process.env[p.envKey];
    if (env) return env;

    // Try .env file
    try {
        if (fs.existsSync(envConfigPath)) {
            const content = fs.readFileSync(envConfigPath, 'utf8');
            const match = content.match(new RegExp(`^${p.envKey}=(.+)$`, 'm'));
            if (match) return match[1];
        }
    } catch {
        // ignore
    }

    return null;
}

function hasApiKey(providerKey) {
    return !!getApiKey(providerKey);
}

function formatApiKeyStatus() {
    const providers = getProviders();
    const lines = ['Estado de claves API:'];

    providers.forEach((p, i) => {
        if (p.envKey) {
            const hasKey = hasApiKey(p.key);
            const status = hasKey ? '✓ configurada' : '✗ no configurada';
            lines.push(`  ${i + 1}. ${p.name}: ${status}`);
        } else {
            lines.push(`  ${i + 1}. ${p.name}: (local, no requiere clave)`);
        }
    });

    return lines.join('\n');
}

module.exports = {
    getProviders,
    findProvider,
    isValidModel,
    getModels,
    formatProviders,
    formatProviderDetail,
    setProvider,
    addProvider,
    removeProvider,
    getCurrentConfig,
    getAllConfiguredProviders,
    formatConfiguredProviders,
    getApiKey,
    hasApiKey,
    formatApiKeyStatus,
    saveEnvVariable
};
