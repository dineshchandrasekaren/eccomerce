import path from "path";

/**
 * @file getPath is used to get a project path.
 * @description If container path library join(__dirname) method. If i place a file here then only it give '/src'
 * @example getPath("templates","file.ejs")
 * It give absolute path + src/templates/file.ejs. as output
 */

export function getPath(...paths: string[]) {
  return path.join(__dirname, ...paths);
}
