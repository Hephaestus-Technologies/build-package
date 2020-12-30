/**
 * @param {string} message
 * @param {function(): Promise<void>} invokable
 * @returns {Promise<void>}
 */
export default async (message, invokable) => {
    const start = Date.now();
    console.log(`\x1b[35m${message}...\x1b[0m`);
    await invokable();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\x1b[32mCompleted in \x1b[92m${elapsed}\x1b[32ms\x1b[0m`);
};
