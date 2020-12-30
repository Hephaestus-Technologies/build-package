import {readFile} from "../utils/file-system.mjs";
import * as fs from "../utils/file-system.mjs";
import path from "path";
import htmlTemplate from "./html-template.mjs";
import {buildOptions} from "../utils/package-json.mjs";
import runCommand from "../utils/run-command.mjs";
import configTemplate from "./config-template.mjs";
import logProgress from "../utils/log-progress.mjs";
import {fileURLToPath} from "url";

/**
 * @param {string} root
 * @returns {Promise<void>}
 */
export default async (root) => {

    const invoke = async () => {
        await installPlugins();
        await prepareBin();
        await buildHtml();
        await buildSnowpackConfig();
        await runSnowpack();
    };

    const installPlugins = async () => {
        const plugins = await readPlugins();
        await runCommand(`npm install snowpack ${plugins.join(" ")} --no-save --loglevel error`)
    };

    const readPlugins = async () => {
        const dirname = fileURLToPath(path.dirname(import.meta.url));
        const jsonPath = path.join(dirname, "../package.json");
        const raw = await readFile(jsonPath);
        return JSON.parse(raw).plugins;
    };

    const prepareBin = async () => {
        const directory = path.join(root, "bin");
        if (!fs.exists(directory))
            await fs.mkdir(directory);
        process.on("SIGINT", cleanupBin);
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
