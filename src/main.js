// Curso Opencode - Archivo principal
// Este es el punto de entrada del proyecto

const config = require('./config');
const utils = require('./utils');

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
            return 'Iniciando Opencode TUI...';
        case '2':
        case 'config':
            return 'Abriendo configuración de proveedor de IA...';
        case '3':
        case 'sessions':
            return 'Mostrando sesiones guardadas...';
        case '4':
        case 'exit':
            return 'Saliendo del programa...';
        default:
            return `Comando no reconocido: "${command}". Use una opción válida.`;
    }
}

function main(args = []) {
    console.log(showBanner());
    console.log('');
    utils.printMenu();
    
    if (args.length > 0) {
        const result = processCommand(args[0]);
        console.log(result);
        return result;
    }
    
    return showBanner();
}

if (require.main === module) {
    main(process.argv.slice(2));
}

module.exports = { main, showBanner, processCommand };
