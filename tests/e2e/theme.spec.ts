import { expect, test, type Page } from "@playwright/test";

const GROUND = { paper: "rgb(244, 244, 241)", void: "rgb(10, 11, 13)", blueprint: "rgb(15, 50, 112)" };
type Theme = keyof typeof GROUND;

async function expectTheme(page: Page, theme: Theme) {
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await expect(page.locator("body")).toHaveCSS("background-color", GROUND[theme]);
  for (const id of Object.keys(GROUND)) {
    await expect(page.locator(`#theme-${id}`)).toHaveAttribute("aria-pressed", id === theme ? "true" : "false");
  }
}

test.describe("from the light OS default", () => {
  test.use({ colorScheme: "light" });

  test("THEME-01 VOID applies Void and is pressed", async ({ page }) => {
    await page.goto("/");
    await expectTheme(page, "paper");
    await page.click("#theme-void");
    await expectTheme(page, "void");
  });

  test("THEME-02 BLUEPRINT applies Blueprint and is pressed", async ({ page }) => {
    await page.goto("/");
    await page.click("#theme-blueprint");
    await expectTheme(page, "blueprint");
  });

  test("THEME-04 theme persists across a reload", async ({ page }) => {
    await page.goto("/");
    await page.click("#theme-void");
    await page.reload();
    await expectTheme(page, "void");
  });

  test("THEME-06 storage blocked: the switch still changes the theme", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("storage blocked");
        },
      });
    });
    await page.goto("/");
    await expectTheme(page, "paper");
    await page.click("#theme-blueprint");
    await expectTheme(page, "blueprint");
    expect(errors).toEqual([]);
  });
});

test.describe("from the dark OS default", () => {
  test.use({ colorScheme: "dark" });

  test("THEME-03 PAPER applies Paper and is pressed", async ({ page }) => {
    await page.goto("/");
    await expectTheme(page, "void");
    await page.click("#theme-paper");
    await expectTheme(page, "paper");
  });
});
