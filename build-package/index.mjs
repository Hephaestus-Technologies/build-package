import {buildOptions} from "../utils/package-json.mjs";
import copyFiles from "./copy-files.mjs";
import filesFromSplat from "./files-from-splat.mjs";
import prepBuildDir from "./prep-build-directory.mjs";
import transpileSass from "./transpile-sass.mjs";
import transpileTs from "./transpile-typescript.mjs";
import logProgress from "../utils/log-progress.mjs";

/**
 * @param {String} root
 * @returns {Promise<void>}
 */
export default (root) => {

    const invoke = async () => {
        await prepBuildDir(root, buildOptions.outDir);
        const filenames = await getFilenames();
        await transpileTs(filenames, buildOptions.outDir);
        await transpileSass(filenames, buildOptions.outDir);
        await copyFiles(filenames, buildOptions.outDir);
    };

    const getFilenames = async () => {
        const inputs = [
            ...buildOptions.inputs,
            ...(buildOptions.client ? [`${buildOptions.client.rootDir}/*`] : []),
            ...(buildOptions.api ? [`${buildOptions.api.rootDir}/*`] : []),
            ...buildOptions.shared
        ];
        const filenames = inputs.map(generateInputFilenames);
        return [].concat(...await Promise.all(filenames));
    };

    const generateInputFilenames = (item) => {
        return item.includes("*") ? filesFromSplat(root, item) : [item];
    };

    return logProgress("Building", invoke);

}
