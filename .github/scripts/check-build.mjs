import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Deparser } from "@fulcrumapp/pg-query-deparser";

const fixture = JSON.parse(readFileSync(
  new URL("../../test/fixtures/modern-parse/select-simple.json", import.meta.url),
  "utf8"
));

assert.equal(Deparser.deparse([fixture.stmt]).replace(/\s+/g, " ").trim(), 'SELECT "a" FROM "t"');
console.log("Built distribution exports a working deparser.");
