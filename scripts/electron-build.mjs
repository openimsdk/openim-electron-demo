#!/usr/bin/env node

import { builtinModules } from "node:module";
import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagePath = path.join(repoRoot, "package.json");
const backupPath = path.join(repoRoot, ".electron-package.backup.json");
const electronOutputPath = path.join(repoRoot, "dist-electron");
// electron-builder 23 flattens pnpm dependencies while packaging. Keep runtime
// dependencies with conflicting hoisted development versions explicit here.
const requiredRuntimePackages = ["ajv"];
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const electronBuilderCommand = path.join(
  repoRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "electron-builder.cmd" : "electron-builder",
);

const rawArgs = process.argv.slice(2).filter((arg) => arg !== "--");
const dryRun = rawArgs.includes("--dry-run");
const buildAll = rawArgs.includes("--all");
const forwardedArgs = rawArgs.filter((arg) => arg !== "--dry-run" && arg !== "--all");

const run = (command, args) => {
  console.log(`> ${path.basename(command)} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`${path.basename(command)} exited with code ${result.status ?? 1}`);
  }
};

const getJavaScriptFiles = (directory) => {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...getJavaScriptFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(entryPath);
    }
  }
  return files;
};

const builtinPackages = new Set([
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
  "electron",
]);

const toPackageName = (specifier) =>
  specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];

const detectRuntimePackageNames = () => {
  if (!existsSync(electronOutputPath)) {
    throw new Error("dist-electron is missing; run pnpm build first");
  }

  const packageNames = new Set();
  const importPattern = /\b(?:require|import)\(\s*["']([^"']+)["']\s*\)/g;
  for (const filePath of getJavaScriptFiles(electronOutputPath)) {
    const source = readFileSync(filePath, "utf8");
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1];
      if (
        specifier.startsWith(".") ||
        specifier.startsWith("/") ||
        builtinPackages.has(specifier)
      ) {
        continue;
      }
      packageNames.add(toPackageName(specifier));
    }
  }
  return [...packageNames].sort();
};

const createRuntimeManifest = (rootPackage) => {
  const dependencies = {};
  const runtimePackageNames = new Set([
    ...detectRuntimePackageNames(),
    ...requiredRuntimePackages,
  ]);
  for (const packageName of [...runtimePackageNames].sort()) {
    const version =
      rootPackage.dependencies?.[packageName] ??
      rootPackage.optionalDependencies?.[packageName];
    if (!version) {
      throw new Error(
        `Electron runtime dependency ${packageName} must be declared in package.json`,
      );
    }
    dependencies[packageName] = version;
  }

  const manifest = { dependencies };
  for (const key of [
    "name",
    "version",
    "main",
    "description",
    "author",
    "license",
    "homepage",
    "private",
    "build",
  ]) {
    if (rootPackage[key] !== undefined) {
      manifest[key] = rootPackage[key];
    }
  }
  return manifest;
};

const ensurePublishMode = (args) => {
  if (args.some((arg) => arg === "--publish" || arg.startsWith("--publish="))) {
    return args;
  }
  return [...args, "--publish", "never"];
};

const getBuilderCommands = () => {
  const extraArgs = ensurePublishMode(forwardedArgs);
  if (!buildAll) {
    return [extraArgs];
  }
  return [
    ["--win", "--x64", ...extraArgs],
    ["--mac", "--x64", "--arm64", ...extraArgs],
    ["--linux", "--x64", ...extraArgs],
    ["--linux", "--arm64", ...extraArgs],
  ];
};

const restoreStaleBackup = () => {
  if (!existsSync(backupPath)) return;
  console.warn("Restoring package.json left by an interrupted Electron build");
  copyFileSync(backupPath, packagePath);
  unlinkSync(backupPath);
};

restoreStaleBackup();

if (!dryRun) {
  run(pnpmCommand, ["build"]);
}

const originalPackageText = readFileSync(packagePath, "utf8");
const rootPackage = JSON.parse(originalPackageText);
const runtimeManifest = createRuntimeManifest(rootPackage);
const builderCommands = getBuilderCommands();

console.log(
  `Electron runtime dependencies: ${Object.keys(runtimeManifest.dependencies).join(
    ", ",
  )}`,
);

if (dryRun) {
  for (const args of builderCommands) {
    console.log(`Would run: electron-builder ${args.join(" ")}`);
  }
  process.exit(0);
}

writeFileSync(backupPath, originalPackageText);
let exitCode = 0;
try {
  writeFileSync(packagePath, `${JSON.stringify(runtimeManifest, null, 2)}\n`);
  for (const args of builderCommands) {
    run(electronBuilderCommand, args);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  exitCode = 1;
} finally {
  copyFileSync(backupPath, packagePath);
  unlinkSync(backupPath);
  console.log("Restored development package.json");
}

process.exit(exitCode);
