import path from "path";
import {stat, readdir} from "../utils/file-system.mjs";

export default (root, splat) => {

    const invoke = async () => {
        return filesFromDirectory(outDir());
    };

    const filesFromSubItems = async (itemName) => {
        if (shouldSkip(itemName)) return [];
        const isDirectory = await isDir(itemName);
        return isDirectory ? filesFromDirectory(itemName) : [itemName];
    };

    const shouldSkip = (itemName) => {
        return (
            itemName === outDir() ||
            itemName.startsWith(".") ||
            itemName.endsWith("node_modules") ||
            !isMatch(itemName)
        );
    };

    const filesFromDirectory = async (dirname) => {
        const items = await readDir(dirname);
        const subItems = await Promise.all(items.map(filesFromSubItems));
        return [].concat(...subItems);
    };

    const isDir = async (item) => {
        const fullPath = path.join(root, item);
        /**@type Stats */ const stats = await stat(fullPath);
        return stats.isDirectory();
    };

    const isMatch = (item) => {
        const [,extension] = splat.split("*");
        return item.endsWith(extension);
    };

    const readDir = async (dirname) => {
        const fullPath = path.join(root, dirname);
        /**@type string[]*/ const items = await readdir(fullPath);
        return items.map(base => path.join(dirname, base));
    };

    const outDir = () => {
        const [dirPart] = splat.split("*");
        return dirPart;
    };

    return invoke();

};
