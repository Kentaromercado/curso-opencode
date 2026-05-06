// Configuración de proveedores de IA

const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), '.opencode', 'config.json');

function getProviders() {
    return [
        { name: 'OpenAI', key: 'openai', models: ['gpt-4', 'gpt-4o', 'gpt-3.5-turbo'] },
        { name: 'Anthropic', key: 'anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
        { name: 'Google', key: 'google', models: ['gemini-pro', 'gemini-ultra'] },
        { name: 'Ollama (local)', key: 'ollama', models: ['llama2', 'mistral', 'codellama'] }
    ];
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

function setProvider(provider, model) {
    try {
        const dir = path.dirname(configPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const config = { provider, model, updatedAt: new Date().toISOString() };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return `Proveedor configurado: ${provider}/${model}`;
    } catch (err) {
        return `Error al guardar configuración: ${err.message}`;
    }
}

function getCurrentConfig() {
    try {
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        return null;
    } catch {
        return null;
    }
}

module.exports = { getProviders, formatProviders, setProvider, getCurrentConfig };
