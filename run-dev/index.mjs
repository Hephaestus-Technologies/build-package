import * as fs from "../utils/file-system.mjs";
import path from "path";
import htmlTemplate from "./html-template.mjs";
import {buildOptions} from "../utils/package-json.mjs";
import runCommand from "../utils/run-command.mjs";
import configTemplate from "./config-template.mjs";
import logProgress from "../utils/log-progress.mjs";

/**
 * @param {string} root
 * @returns {Promise<void>}
 */
export default async (root) => {

    const invoke = async () => {
        await prepareBin();
        await buildHtml();
        await buildSnowpackConfig();
        await runSnowpack();
        await cleanupBin();
    };

    const prepareBin = async () => {
        const directory = path.join(root, "bin");
        if (!fs.exists(directory))
            await fs.mkdir(directory);
    };

    const  buildHtml = () => {
        const html = htmlTemplate(clientOptions);
        const htmlFilename = path.join(root, "bin", "index.html");
        return fs.writeFile(htmlFilename, html);
    }

    const buildSnowpackConfig = () => {
        const config = configTemplate(root, clientOptions.rootDir);
        return fs.writeFile(configFilename(), config);
    };

    const runSnowpack = () => {
        return runCommand(`npx snowpack dev --config ${configFilename()}`);
    };

    const configFilename = () => {
        return path.join(root, "bin", "snowpack.config.js");
    };

    const clientOptions = {
        rootDir: "/",
        app: "app.tsx",
        ...buildOptions.client
    };

    const cleanupBin = () => {
        const directory = path.join(root, "bin");
        return fs.rm(directory, {force: true, recursive: true});
    };

    return logProgress("Starting server", invoke);

};
