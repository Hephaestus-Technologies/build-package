#!/usr/bin/env node
import {exec} from "child_process";
import buildOptions from "./build-options.mjs";
import build from "./build.mjs";
import bumpVersion from "./bump-version.mjs";

const invoke = async () => {
    const root = process.cwd();
    await buildSource(root);
    if (shouldPublish()) await publish(root);
};

const shouldPublish = () => {
    return process.argv.includes("--publish");
};

const buildSource = (root) => logProgress(async () => {
    console.log("\n\x1b[96mInstalling packages...\x1b[0m");
    await runCommand("npm install");
    console.log("\n\x1b[96mTranspiling source...\x1b[0m");
    await build(root, buildOptions);
});

const publish = async (root) => {
    const version = (process.env.version || "v0.1.0").slice(1);
    await bumpVersion(root, version, buildOptions);
    const publicFlags = process.argv.includes("--public") ? "--access public" : "";
    await runCommand(`npm publish ./${buildOptions.outDir} ${publicFlags}`);
};

const runCommand = (command) => new Promise((resolve) => {
    const child = exec(command, {env: process.env});
    child.stderr.on("data", data => console.error(data.toString()));
    child.on("close", resolve);
});

const logProgress = async (invokable) => {
    const start = Date.now();
    console.log("\n\x1b[35mBuilding...\x1b[0m");
    await invokable();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\x1b[32mBuild completed in \x1b[92m${elapsed}\x1b[32ms\x1b[0m`);
};

await invoke();
