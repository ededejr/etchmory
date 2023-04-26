import * as fs from "fs";
import * as path from "path";

const ROOT_DIR = path.join(__dirname, "../");
const SCRIPTS_DIR = path.join(ROOT_DIR, "scripts", "bin");
const DIST_DIR = path.resolve(ROOT_DIR, "dist");

export function getRootDir() {
  return ROOT_DIR;
}

export function getDistDir() {
  return DIST_DIR;
}

export function getScriptsDir() {
  return SCRIPTS_DIR;
}

export function ensureDistExists() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(
      "dist directory does not exist. Please run `npm run package:build` first."
    );
  }
}
