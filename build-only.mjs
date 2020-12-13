#!/usr/bin/env node
import build from "./build.mjs";
import buildOptions from "./build-options.mjs";

const root = process.cwd();

await build(root, buildOptions);
