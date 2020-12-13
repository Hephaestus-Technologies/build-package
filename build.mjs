import cpFile from "cp-file";
import * as path from "path";
import ts from "typescript";
import * as fs from "./file-system.mjs";

/**
 * @typedef {object} BuildOptions
 * @property {string[]} inputs
 * @property {string} outDir
 */

/**
 * @param {String} root
 * @param {BuildOptions} buildOptions
 * @param {string[]} buildOptions.inputs
 * @param {string} buildOptions.outDir
 */
export default (root, {inputs, outDir}) => {

    const invoke = () => logProgress(async () => {
        await prepBuildDir();
        const filenames = await generateFilenames();
        transpileTs(filenames.filter(isTs));
        const styleSheets = filenames.filter(isStylesheet);
        const jsFiles = filenames.filter(isJs);
        const filesToCopy = [...jsFiles, ...styleSheets];
        await Promise.all(filesToCopy.map(copyToOutput));
    });

    const prepBuildDir = async () => {
        const dirRoot = path.join(root, outDir);
        if (!fs.exists(dirRoot)) await fs.mkdir(dirRoot);
        /**@type string[]*/ const items = await fs.readdir(dirRoot);
        return Promise.all(items.map((item) => {
            return fs.rm(path.join(dirRoot, item), {
                force: true,
                recursive: true
            });
        }));
    };

    const generateFilenames = async () => {
        const filenames = inputs.map(generateInputFilenames);
        return [].concat(...await Promise.all(filenames));
    };

    const generateInputFilenames = async (item) => {
        return item.includes("*") ? (await filenamesFromDirectory(item)) : [item];
    };

    const filenamesFromDirectory = async (dirname) => {
        const [dirPart] = dirname.split("*");
        const dirRoot = path.join(root, dirPart);
        /**@type string[]*/ const items = await fs.readdir(dirRoot);
        const subItems = await Promise.all(items.map(filenamesFromSubItems(dirname)));
        return [].concat(...subItems);
    };

    const filenamesFromSubItems = (dirname) => async (item) => {
        if (dirname === "node_modules") return [];
        const [dirPart, extension] = dirname.split("*");
        const itemPath = path.join(dirPart, item);
        /**@type Stats */ const stat = await fs.stat(path.join(root, itemPath));
        if (stat.isDirectory())
            return filenamesFromDirectory(path.join(itemPath, "*" + extension));
        if (item.endsWith(extension)) return [path.join(itemPath)];
        return [];
    };

    const isTs = (filename) => {
        const extension = path.extname(filename);
        return [".ts", ".tsx"].includes(extension);
    };

    const isStylesheet = (filename) => {
        const extension = path.extname(filename);
        return [".css", ".scss", ".sass"].includes(extension);
    };

    const isJs = (filename) => {
        const extension = path.extname(filename);
        return [".js", ".cjs", ".mjs"].includes(extension);
    };

    /**
     * @param {string[]} filenames
     */
    const transpileTs = (filenames) => {
        const options = {
            jsx: "react",
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
            declaration: true,
            alwaysStrict: true,
            sourceMap: true,
            outDir
        };
        const host = ts.createCompilerHost(options);
        const program = ts.createProgram(filenames, options, host);
        program.emit();
    };

    const copyToOutput = (filename) => {
        const destination = path.join(outDir, filename);
        return cpFile(filename, destination);
    };

    const logProgress = async (invokable) => {
        const start = Date.now();
        console.log("\n\x1b[96mBuilding...");
        await invokable();
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        console.log(`\x1b[32mBuild completed in \x1b[92m${elapsed}\x1b[32ms`);
    };

    return invoke();

}
