import { expect, test } from "@playwright/test";
import { SECTIONS, sectionHeading } from "../../src/model/sections";

test("PAGE-16 section numbers follow the order: Stack is 01", () => {
  expect(sectionHeading("stack")).toEqual({ index: "02", title: "Stack" });
  expect(sectionHeading("certs")).toEqual({ index: "01", title: "Certifications" });
  expect(sectionHeading("gists")).toEqual({ index: "04", title: "Gists" });
});

test("PAGE-16 sections follow the old site's order", () => {
  expect(SECTIONS.map((s) => s.id)).toEqual(["certs", "stack", "projects", "gists"]);
  expect(SECTIONS.map((s) => s.title)).toEqual(["Certifications", "Stack", "Projects", "Gists"]);
});

test("NAV-01 tab labels in the old site's order", () => {
  expect(SECTIONS.map((s) => s.tab)).toEqual(["Certs", "Stack", "Projects", "Gists"]);
});
