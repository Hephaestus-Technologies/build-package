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
        await logProgress("Installing dev plugins", async () => {
            await installPlugins();
        });
        await logProgress("Starting servers", () => {
            return Promise.all([
                runClientServer(),
                runApiServer()
            ]);
        });
    };

    const installPlugins = async () => {
        const modules = await readPlugins();
        const flags = ["--no-package-lock", "--no-save", "--loglevel error"];
        await runCommand(`npm install ${modules.join(" ")} ${flags.join(" ")}`);
    };

    const readPlugins = async () => {
        const dirname = fileURLToPath(path.dirname(import.meta.url));
        const jsonPath = path.join(dirname, "../package.json");
        const raw = await readFile(jsonPath);
        return JSON.parse(raw).plugins;
    };

    const runClientServer = async () => {
        if (!buildOptions.client) return;
        await prepareBin();
        await buildHtml();
        await buildSnowpackConfig();
        await runSnowpack();
    };

    const prepareBin = async () => {
        const directory = path.join(root, "bin");
        if (!fs.exists(directory))
            await fs.mkdir(directory);
        process.on("SIGINT", cleanupBin);
    };

    const  buildHtml = () => {
        const html = htmlTemplate(buildOptions.client);
        const htmlFilename = path.join(root, "bin", "index.html");
        return fs.writeFile(htmlFilename, html);
    };

    const buildSnowpackConfig = async () => {
        const config = configTemplate(root, buildOptions, await readPlugins());
        return fs.writeFile(configFilename(), config);
    };

    const runSnowpack = () => {
        return runCommand(`npx snowpack dev --config ${configFilename()}`);
    };

    const configFilename = () => {
        return path.join(root, "bin", "snowpack.config.json");
    };

    const cleanupBin = () => {
        const directory = path.join(root, "bin");
        return fs.rm(directory, {force: true, recursive: true});
    };

    const runApiServer = () => {
        if (!buildOptions.api) return;
        const {api: apiOptions, outDir} = buildOptions;
        const {dir, name} = path.parse(apiOptions.rootApi);
        const scriptPath = [
            ...outDir.split("/"),
            ...apiOptions.rootDir.split("/"),
            ...dir.split("/")
        ].filter(Boolean).join("/");
        return runCommand(`node ${scriptPath}/${name}.js`);
    };

    return invoke();

};
