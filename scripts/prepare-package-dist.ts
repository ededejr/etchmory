const fs = require('fs');

type PackageJson = Record<string, unknown>;

function parsePackageJson(): PackageJson {
    const packageJson = fs.readFileSync('./package.json', 'utf8');
    return JSON.parse(packageJson);
}

function writePackageJson(packageJson: PackageJson) {
    fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
}

function copyReadme() {
    fs.copyFileSync('./README.md', './dist/README.md');
}

function copyLicense() {
    fs.copyFileSync('./LICENSE', './dist/LICENSE');
}

function main() {
  const package = parsePackageJson();
  delete package.scripts;
  delete package.devDependencies;
  delete package.tsup;
  
  writePackageJson(package);
  copyReadme();
  copyLicense();
}

main();