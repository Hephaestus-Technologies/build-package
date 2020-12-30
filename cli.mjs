#!/usr/bin/env node
import installDependencies from "./utils/install-dependencies.mjs";
import build from "./build-package/index.mjs";
import publish from "./publish/index.mjs";
import runDevServers from "./run-dev/index.mjs";

const invoke = async () => {
    const root = process.cwd();
    await installDependencies();
    if (shouldRun())
        return await runDevServers(root);
    await build(root);
    if (shouldPublish())
        await publish(root, process.env.version);
};

const shouldRun = () => {
    return process.argv.includes("dev");
};

const shouldPublish = () => {
    return process.argv.includes("publish");
};

await invoke();
