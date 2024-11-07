import pages from "./pages.json" with { type: 'json' };
import fs from "node:fs";

export default class EasyDB {
  pages = pages;

  save() {
    for (const [key, value] of Object.entries(this.pages)) {
      fs.writeFileSync(`../db/${key}.json`, JSON.stringify(value, null, 4));
    }
  }
}
