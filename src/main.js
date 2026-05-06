// Curso Opencode - Archivo principal
// Este es el punto de entrada del proyecto

const config = require('./config');
const utils = require('./utils');

function main() {
    console.log('=== Curso Opencode ===');
    console.log(`Versión: ${config.version}`);
    console.log(`Proyecto: ${config.name}`);
    console.log('');
    console.log('Bienvenido al curso de Opencode!');
    console.log('Este proyecto te ayudará a aprender los conceptos básicos.');
    
    utils.printMenu();
}

if (require.main === module) {
    main();
}

module.exports = { main };
