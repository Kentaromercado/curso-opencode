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
    const cmd = command.trim().toLowerCase();

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
        default:
            return `Comando no reconocido: "${command}". Escriba 'help' para ver opciones.`;
    }
}

function startOpencode() {
    return 'Iniciando Opencode TUI...\nEjecuta: opencode';
}

function showProviderConfig() {
    const providers = provider.formatProviders();
    const current = provider.getCurrentConfig();
    let result = providers;
    
    if (current) {
        result += `\n\nProveedor actual: ${current.provider}/${current.model}`;
    } else {
        result += '\n\nNo hay proveedor configurado.';
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
        '  1, start     - Iniciar Opencode TUI',
        '  2, config    - Ver configuración de proveedores',
        '  3, sessions  - Listar sesiones guardadas',
        '  4, exit      - Salir',
        '  help, ?      - Mostrar esta ayuda'
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
