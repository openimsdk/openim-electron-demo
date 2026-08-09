import { expect, test, _electron as electron } from "@playwright/test";

test("launches the Electron application", async ({}, testInfo) => {
  const app = await electron.launch({
    args: [
      ".",
      "--no-sandbox",
      `--user-data-dir=${testInfo.outputPath("user-data")}`,
    ],
  });

  try {
    await app.firstWindow();
    await expect
      .poll(() => Promise.all(app.windows().map((window) => window.title())))
      .toContain("OpenCorp-Base");
    const windows = app.windows();
    const titles = await Promise.all(windows.map((window) => window.title()));
    const page = windows[titles.indexOf("OpenCorp-Base")];
    if (!page) throw new Error("OpenCorp-Base window was not created");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveTitle("OpenCorp-Base");
    await page.screenshot({ path: testInfo.outputPath("homepage.png") });
  } finally {
    await app.close();
  }
});
