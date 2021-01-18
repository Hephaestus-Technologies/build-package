import path from "path";
import ts from "typescript";

/**
 * @param {string[]} filenames
 * @param {string} outDir
 */
export default (filenames, outDir) => {

    const invoke = () => {
        const tsFiles = filenames.filter(isTs);
        const options = {...tsOptions, outDir};
        const host = ts.createCompilerHost(options);
        const program = ts.createProgram(tsFiles, options, host);
        program.emit();
    };

    const isTs = (filename) => {
        const extension = path.extname(filename);
        return [".ts", ".tsx"].includes(extension);
    };

    const tsOptions = {
        jsx: ts.JsxEmit.React,
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        declaration: true,
        alwaysStrict: true,
        sourceMap: true
    };

    return invoke();

};
