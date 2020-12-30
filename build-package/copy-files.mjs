import cpFile from "cp-file";
import path from "path";

/**
 * @param {string[]} filenames
 * @param {string} outDir
 * @returns {Promise<void>}
 */
export default (filenames, outDir) => {

    const invoke = async () => {
        const cssFiles = filenames.filter(isCss);
        const jsFiles = filenames.filter(isJs);
        const filesToCopy = [...jsFiles, ...cssFiles];
        await Promise.all(filesToCopy.map(copyToOutput));
    };

    const isCss = (filename) => {
        const extension = path.extname(filename);
        return [".css"].includes(extension);
    };

    const isJs = (filename) => {
        const extension = path.extname(filename);
        return [".js", ".cjs", ".mjs"].includes(extension);
    };

    const copyToOutput = (filename) => {
        const destination = path.join(outDir, filename);
        return cpFile(filename, destination);
    };

    return invoke();

};
