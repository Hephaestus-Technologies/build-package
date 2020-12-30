import path from "path";
import sass from "sass";
import * as fs from "../utils/file-system.mjs";

/**
 * @param {string[]} filenames
 * @param {string} outDir
 */
export default (filenames, outDir) => {

    const invoke = async () => {
        const results = filenames
            .filter(isSass)
            .map(transpileToSass);
        for (let result of results)
            await writeOut(result);
    };

    const isSass = (filename) => {
        const extension = path.extname(filename);
        return [".sass", ".scss"].includes(extension);
    };

    const transpileToSass = (filename) => {
        const result = sass.renderSync({
            file: filename,
            sourceMap: true
        });
        return {filename, result};
    };

    const writeOut = async ({filename, result}) => {
        const {file, directory} = parse(filename);
        if (!fs.exists(directory)) await fs.mkdir(directory)
        await fs.writeFile(file, result.css.toString());
    };

    const parse = (filename) => {
        const {dir, name} = path.parse(filename);
        const directory = path.join(outDir, dir);
        const file = path.join(directory, name + ".css");
        return {file, directory};
    };

    return invoke();

};
