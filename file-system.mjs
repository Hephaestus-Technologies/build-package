import * as fs from "fs";
import {promisify} from "util";

/**
 * @param {PathLike} path
 * @returns {Promise<string[]>}
 */
export const readdir = promisify(fs.readdir);
/**
 * @param {PathLike} path
 * @returns {Promise<Buffer>}
 */
export const readFile = promisify(fs.readFile);
/**
 * @param {PathLike} path
 * @returns {Promise<void>}
 */
export const writeFile = promisify(fs.writeFile);
/**
 * @param {PathLike} path
 * @returns {Promise<Stats>}
 */
export const stat = promisify(fs.stat);
/**
 * @param {PathLike} path
 * @returns {boolean}
 */
export const exists = fs.existsSync;
/**
 * @param {PathLike} path
 * @returns {Promise<void>}
 */
export const mkdir = promisify(fs.mkdir);
/**
 * @param {PathLike} path
 * @param {RmOptions} options
 * @returns {Promise<void>}
 */
export const rm = promisify(fs.rm);
