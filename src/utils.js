// Utilidades del proyecto

function printMenu() {
    console.log('Opciones disponibles:');
    console.log('  1. Iniciar Opencode TUI');
    console.log('  2. Configurar proveedor de IA');
    console.log('  3. Ver sesiones guardadas');
    console.log('  4. Salir');
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function logMessage(level, message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

module.exports = {
    printMenu,
    formatDate,
    logMessage
};
