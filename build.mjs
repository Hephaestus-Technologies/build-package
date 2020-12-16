import cpFile from "cp-file";
import * as path from "path";
import ts from "typescript";
import sass from "sass";
import {readdir} from "./file-system.mjs";
import * as fs from "./file-system.mjs";
import filesFromSplat from "./files-from-splat.mjs";

/**
 * @typedef {object} BuildOptions
 * @property {string[]} inputs
 * @property {string} outDir
 */

const tsOptions = {
    jsx: ts.JsxEmit.React,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    declaration: true,
    alwaysStrict: true,
    sourceMap: true
};

/**
 * @param {String} root
 * @param {BuildOptions} buildOptions
 * @param {string[]} buildOptions.inputs
 * @param {string} buildOptions.outDir
 */
export default (root, {inputs, outDir}) => {

    const invoke = async () => {
        await prepBuildDir();
        const filenames = await getFilenames();
        transpileTs(filenames.filter(isTs));
        await transpileSass(filenames.filter(isSass));
        await copyFiles(filenames);
    };

    const copyFiles = async (filenames) => {
        const cssFiles = filenames.filter(isCss);
        const jsFiles = filenames.filter(isJs);
        const filesToCopy = [...jsFiles, ...cssFiles];
        await Promise.all(filesToCopy.map(copyToOutput));
    };

    const prepBuildDir = async () => {
        const dirRoot = path.join(root, outDir);
        if (!fs.exists(dirRoot)) await fs.mkdir(dirRoot);
        const items = await readDir(outDir);
        return Promise.all(items.map(clearItem));
    };

    const getFilenames = async () => {
        const filenames = inputs.map(generateInputFilenames);
        return [].concat(...await Promise.all(filenames));
    };

    const generateInputFilenames = async (item) => {
        return item.includes("*") ? (await filesFromSplat(root, item)) : [item];
    };

    const isTs = (filename) => {
        const extension = path.extname(filename);
        return [".ts", ".tsx"].includes(extension);
    };

    const isSass = (filename) => {
        const extension = path.extname(filename);
        return [".sass", ".scss"].includes(extension);
    };

    const isCss = (filename) => {
        const extension = path.extname(filename);
        return [".css"].includes(extension);
    };

    const isJs = (filename) => {
        const extension = path.extname(filename);
        return [".js", ".cjs", ".mjs"].includes(extension);
    };

    /** @param {string[]} filenames */
    const transpileTs = (filenames) => {
        const options = {
            ...tsOptions,
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

    const transpileSass = (filenames) => {
        return Promise.all(filenames.map(renderSass));
    };

    const renderSass = async (filename) => {
        const {dir, name} = path.parse(filename);
        const dirname = path.join(outDir, dir);
        const result = sass.renderSync({
            file: filename,
            sourceMap: true
        });
        if (!fs.exists(dirname)) await fs.mkdir(dirname)
        const destination = path.join(dirname, name + ".css");
        await fs.writeFile(destination, result.css.toString());
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

}
