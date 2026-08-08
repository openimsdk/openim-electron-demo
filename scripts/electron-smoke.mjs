#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rootPackage = JSON.parse(
  readFileSync(path.join(repoRoot, "package.json"), "utf8"),
);
const explicitExecutable = process.argv.slice(2).find((arg) => arg !== "--");

const getDefaultExecutable = () => {
  const releaseRoot = path.join(repoRoot, "release", "Base", rootPackage.version);
  if (process.platform === "darwin") {
    return path.join(
      releaseRoot,
      `mac-${process.arch}`,
      `${rootPackage.name}.app`,
      "Contents",
      "MacOS",
      rootPackage.name,
    );
  }
  if (process.platform === "win32") {
    return path.join(releaseRoot, "win-unpacked", `${rootPackage.name}.exe`);
  }
  return path.join(releaseRoot, "linux-unpacked", rootPackage.name);
};

const executablePath = path.resolve(
  repoRoot,
  explicitExecutable ?? getDefaultExecutable(),
);
if (!existsSync(executablePath)) {
  throw new Error(`Packaged Electron executable is missing: ${executablePath}`);
}

const userDataPath = mkdtempSync(path.join(os.tmpdir(), "openim-electron-smoke-"));
const child = spawn(
  executablePath,
  [`--user-data-dir=${userDataPath}`, "--no-sandbox"],
  {
    cwd: repoRoot,
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: "1",
      OPENIM_SMOKE_TEST: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let output = "";
const collectOutput = (stream, destination) => {
  stream.on("data", (chunk) => {
    const text = chunk.toString();
    output += text;
    destination.write(text);
  });
};
collectOutput(child.stdout, process.stdout);
collectOutput(child.stderr, process.stderr);

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const exitPromise = new Promise((resolve) => {
  child.once("exit", (code, signal) => resolve({ type: "exit", code, signal }));
});
const errorPromise = new Promise((resolve) => {
  child.once("error", (error) => resolve({ type: "error", error }));
});
const readyPromise = new Promise((resolve) => {
  const inspect = () => {
    if (output.includes("OPENIM_ELECTRON_READY")) {
      resolve({ type: "ready" });
    }
  };
  child.stdout.on("data", inspect);
  child.stderr.on("data", inspect);
});

const stopChild = async () => {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([exitPromise, delay(3000)]);
  if (child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL");
    await Promise.race([exitPromise, delay(3000)]);
  }
};

try {
  const startupResult = await Promise.race([
    readyPromise,
    exitPromise,
    errorPromise,
    delay(15000).then(() => ({ type: "timeout" })),
  ]);
  if (startupResult.type !== "ready") {
    throw new Error(
      `Packaged Electron app failed startup smoke test (${startupResult.type})\n${output}`,
    );
  }

  const stabilizationResult = await Promise.race([
    exitPromise,
    errorPromise,
    delay(2000).then(() => ({ type: "stable" })),
  ]);
  if (stabilizationResult.type !== "stable") {
    throw new Error(
      `Packaged Electron app exited during startup (${stabilizationResult.type})\n${output}`,
    );
  }
  if (
    /Uncaught Exception|Cannot find module|A JavaScript error occurred/i.test(output)
  ) {
    throw new Error(`Packaged Electron app reported a startup error\n${output}`);
  }
  console.log("Packaged Electron startup smoke test passed");
} finally {
  await stopChild();
  rmSync(userDataPath, { recursive: true, force: true });
}
