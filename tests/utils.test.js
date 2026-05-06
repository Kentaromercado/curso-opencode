// Tests para utils.js

const { describe, it } = require('node:test');
const assert = require('node:assert');
const utils = require('../src/utils');

describe('formatDate', () => {
    it('should format a date as YYYY-MM-DD', () => {
        const date = new Date('2026-05-06');
        const formatted = utils.formatDate(date);
        assert.strictEqual(formatted, '2026-05-06');
    });

    it('should handle different dates', () => {
        const date = new Date('1999-12-31');
        const formatted = utils.formatDate(date);
        assert.strictEqual(formatted, '1999-12-31');
    });
});

describe('logMessage', () => {
    it('should log a message with a level', () => {
        // Just verify it doesn't throw
        assert.doesNotThrow(() => {
            utils.logMessage('info', 'Test message');
        });
    });
});

describe('printMenu', () => {
    it('should print without throwing', () => {
        assert.doesNotThrow(() => {
            utils.printMenu();
        });
    });
});
