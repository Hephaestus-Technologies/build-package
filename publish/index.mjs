import generatePackageJson from "./generate-package-json.mjs";
import {buildOptions, isPrivate} from "../utils/package-json.mjs";
import runCommand from "../utils/run-command.mjs";
import logProgress from "../utils/log-progress.mjs";

/**
 * @param {string} root
 * @param {string} [version]
 * @returns {Promise<void>}
 */
export default (root, version = "v0.1.0") => {

    const invoke = async () => {
        await generatePackageJson(root, version.slice(1), buildOptions);
        const publicFlags = isPrivate ? "" : " --access public";
        await runCommand(`npm publish ./${buildOptions.outDir}${publicFlags}`);
    };

    return logProgress("Publishing", invoke);

};
