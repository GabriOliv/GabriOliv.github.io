import { expect, test } from "@playwright/test";
import { certTree, fileCode, hexCode, isLive, isTop, liveCount, shortUrl } from "../../src/model/derive";
import type { Cert, Entry } from "../../src/model/types";

const entry = (name: string, url: string, language = "HTML"): Entry => ({ name, url, description: "", language });

const cert = (name: string, focus: string, requires?: string): Cert => ({
  name,
  issuer: "istqb",
  type: "certification",
  level: "advanced",
  focus,
  ...(requires ? { requires } : {}),
});

test("PROJ-02 isLive is true only for github.io URLs", () => {
  expect(isLive("https://gabrioliv.github.io/garden/")).toBe(true);
  expect(isLive("https://GabriOliv.github.io/gherkin-to-html/")).toBe(true);
  expect(isLive("https://github.com/GabriOliv/chaos")).toBe(false);
});

test("PROJ-01 shortUrl drops https:// and one trailing slash", () => {
  expect(shortUrl("https://gabrioliv.github.io/garden/")).toBe("gabrioliv.github.io/garden");
  expect(shortUrl("https://gabrioliv.github.io/comparador-de-listas")).toBe("gabrioliv.github.io/comparador-de-listas");
  expect(shortUrl("https://github.com/GabriOliv/chaos")).toBe("github.com/GabriOliv/chaos");
});

test("PROJ-04 liveCount counts github.io projects", () => {
  const projects = [
    entry("chaos", "https://github.com/GabriOliv/chaos"),
    entry("asciigraph", "https://gabrioliv.github.io/asciigraph/"),
    entry("garden", "https://gabrioliv.github.io/garden/"),
  ];
  expect(liveCount(projects)).toBe(2);
  expect(liveCount([])).toBe(0);
});

test("PAGE-04 hexCode gives the asked number of hex digits", () => {
  expect(hexCode(7, () => 0)).toBe("0000000");
  expect(hexCode(4, () => 0.99999999)).toBe("ffff");
  const seq = [0.0, 0.7, 0.99];
  expect(hexCode(3, () => seq.shift()!)).toBe("0bf");
  expect(hexCode(8)).toMatch(/^[0-9a-f]{8}$/);
});

test("PAGE-04 fileCode joins the file and rev hashes", () => {
  expect(fileCode("3fc48d4a", "a9e5431")).toBe("File 3fc48d4a · Rev a9e5431");
});

test("CERT-01 certTree builds CTFL, CTAL, then CT-TAS and CTAL-TM, the top two active", () => {
  const certs = [
    cert("CTFL", "Foundation"),
    cert("CTAL", "Advanced", "CTFL"),
    cert("CT-TAS", "Test Automation Strategy", "CTAL"),
    cert("CTAL-TM", "Test Management", "CTAL"),
  ];
  expect(certTree(certs)).toEqual({
    code: "CTFL",
    label: "Foundation",
    children: [
      {
        code: "CTAL",
        label: "Advanced",
        children: [
          { code: "CT-TAS", label: "Test Automation Strategy", active: true },
          { code: "CTAL-TM", label: "Test Management", active: true },
        ],
      },
    ],
  });
});

test("CERT-01 certTree keeps data order among siblings and handles no certs", () => {
  const certs = [cert("B", "b", "A"), cert("A", "a"), cert("C", "c", "A")];
  expect(certTree(certs)?.children?.map((n) => n.code)).toEqual(["B", "C"]);
  expect(certTree([])).toBeNull();
});

test("CERT-03 isTop is true only for certifications nothing builds on", () => {
  const certs = [cert("A", "a"), cert("B", "b", "A"), cert("C", "c", "A")];
  expect(certs.map((c) => isTop(certs, c))).toEqual([false, true, true]);
  expect(isTop([cert("A", "a")], cert("A", "a"))).toBe(true);
});
