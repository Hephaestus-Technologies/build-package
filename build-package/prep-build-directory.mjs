import path from "path";
import {readdir} from "../utils/file-system.mjs";
import * as fs from "../utils/file-system.mjs";

/**
 * @param {string} root
 * @param {string} outDir
 * @returns {Promise<void>}
 */
export default (root, outDir) => {

    const invoke = async () => {
        const dirRoot = path.join(root, outDir);
        if (!fs.exists(dirRoot)) await fs.mkdir(dirRoot);
        const items = await readDir(outDir);
        await Promise.all(items.map(clearItem));
    };

    const readDir = async (dirname) => {
        const fullPath = path.join(root, dirname);
        /**@type string[]*/ const items = await readdir(fullPath);
        return items.map(base => path.join(dirname, base));
    };

    const clearItem = (itemName) => {
        return fs.rm(itemName, {
            force: true,
            recursive: true
        });
    };

    return invoke();

};
