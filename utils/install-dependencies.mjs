import runCommand from "./run-command.mjs";
import logProgress from "./log-progress.mjs";

export default () => logProgress("Installing packages", () => {
    return runCommand("npm install --loglevel error");
});
