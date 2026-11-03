import { expect, test } from "@playwright/test";
import { buildWith, dataFixture } from "./helpers";

test("DATA-03 broken data fails the build naming entry and field", () => {
  const file = dataFixture((data) => {
    data.certifications[3].requires = "CTAL-X";
  });
  const build = buildWith(file);
  expect(build.status).not.toBe(0);
  expect(build.output).toContain(
    'data.json: certifications[3] (CTAL-TM).requires: "CTAL-X" is not a certification name',
  );
});
