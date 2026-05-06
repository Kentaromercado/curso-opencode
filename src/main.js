// Curso Opencode - Archivo principal
// Este es el punto de entrada del proyecto

const readline = require('readline');
const config = require('./config');
const utils = require('./utils');
const session = require('./session');
const provider = require('./provider');

let rl = null;

function showBanner() {
    return [
        '=== Curso Opencode ===',
        `Versión: ${config.version}`,
        `Proyecto: ${config.name}`,
        '',
        'Bienvenido al curso de Opencode!',
        'Este proyecto te ayudará a aprender los conceptos básicos.'
    ].join('\n');
}

function processCommand(command) {
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
        case '1':
        case 'start':
            return startOpencode();
        case '2':
        case 'config':
            return showProviderConfig();
        case '3':
        case 'sessions':
            return showSessions();
        case '4':
        case 'exit':
            return 'exit';
        case 'help':
        case '?':
            return showHelp();
        case 'providers':
        case 'p':
            return provider.formatConfiguredProviders();
        case 'add-provider':
            return handleAddProvider(args);
        case 'remove-provider':
            return handleRemoveProvider(args);
        case 'apikeys':
        case 'keys':
            return provider.formatApiKeyStatus();
        case 'provider-detail':
        case 'pd':
            return args.length > 0 ? provider.formatProviderDetail(args[0]) : 'Uso: provider-detail <proveedor>';
        default:
            return `Comando no reconocido: "${command}". Escriba 'help' para ver opciones.`;
    }
}

function handleAddProvider(args) {
    if (args.length < 2) {
        return 'Uso: add-provider <proveedor> <modelo> [apiKey]\nEjemplo: add-provider openai gpt-4 sk-...';
    }
    const [name, model, apiKey] = args;
    return provider.addProvider(name, model, apiKey);
}

function handleRemoveProvider(args) {
    if (args.length < 1) {
        return 'Uso: remove-provider <proveedor>\nEjemplo: remove-provider openai';
    }
    return provider.removeProvider(args[0]);
}

function startOpencode() {
    return 'Iniciando Opencode TUI...\nEjecuta: opencode';
}

function showProviderConfig() {
    const providers = provider.formatProviders();
    const current = provider.getCurrentConfig();
    const configured = provider.formatConfiguredProviders();
    const keys = provider.formatApiKeyStatus();
    
    let result = providers;
    result += '\n\n' + configured;
    result += '\n\n' + keys;
    
    if (current) {
        result += `\n\nProveedor activo: ${current.provider}/${current.model}`;
    }
    
    return result;
}

function showSessions() {
    const sessions = session.listSessions();
    return session.formatSessionList(sessions);
}

function showHelp() {
    return [
        'Ayuda - Comandos disponibles:',
        '  1, start              - Iniciar Opencode TUI',
        '  2, config             - Ver configuración de proveedores',
        '  3, sessions           - Listar sesiones guardadas',
        '  4, exit               - Salir',
        '  help, ?               - Mostrar esta ayuda',
        '',
        'Gestión de proveedores:',
        '  providers, p          - Listar proveedores configurados',
        '  add-provider <p> <m> [k]  - Agregar proveedor (modelo, clave opcional)',
        '  remove-provider <p>   - Eliminar proveedor configurado',
        '  apikeys, keys         - Ver estado de claves API',
        '  provider-detail <p>   - Ver detalle de un proveedor'
    ].join('\n');
}

function promptUser() {
    rl.question('\nSeleccione una opción: ', (answer) => {
        const result = processCommand(answer);
        
        if (result === 'exit') {
            console.log('\nSaliendo del programa...');
            rl.close();
            return;
        }
        
        console.log('\n' + result);
        promptUser();
    });
}

function runInteractive() {
    console.log(showBanner());
    console.log('');
    utils.printMenu();
    
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    promptUser();
}

function main(args = []) {
    if (args.length > 0) {
        const result = processCommand(args[0]);
        console.log(result);
        return result;
    }
    
    if (process.stdin.isTTY) {
        runInteractive();
    } else {
        console.log(showBanner());
    }
    
    return showBanner();
}

if (require.main === module) {
    main(process.argv.slice(2));
}

module.exports = { main, showBanner, processCommand, startOpencode, showProviderConfig, showSessions, showHelp };
