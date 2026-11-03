import raw from "@data";
import type { Data } from "./model/types";

/** The page's content, validated at build time by the validate-data plugin. */
export const data = raw as unknown as Data;
