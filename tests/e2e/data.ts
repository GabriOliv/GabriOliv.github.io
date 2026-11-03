import { readFileSync } from "node:fs";
import type { Data } from "../../src/model/types";

/** data.json as the built page received it. */
export const data: Data = JSON.parse(readFileSync("data.json", "utf8"));
