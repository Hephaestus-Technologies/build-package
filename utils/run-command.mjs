import {exec} from "child_process";

/**
 * @param {string} command
 * @returns {Promise<void>}
 */
export default (command) => new Promise((resolve) => {
    const child = exec(command, {env: process.env});
    child.stderr.on("data", data => console.error(data.toString()));
    child.on("close", resolve);
});
