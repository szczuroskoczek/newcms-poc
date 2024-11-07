import express from "express";
import EasyDB from "./util/easydb.mjs";
import fs, { globSync } from "node:fs";
import * as vite from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const DB = new EasyDB();

const app = express();

// admin
const adminRouter = express.Router();
app.use("/admin", adminRouter);

/**
 *
 * @param {DB['pages'][number]} page
 */
const renderPage = (page) => {
  const makeEntry = () => {
    return `
        <script type="module">
            import rootComponent from "/project/components/${
              page.content.type
            }/entry.ts";

            rootComponent(${JSON.stringify(page.content.props)});
        </script>
        `;
  };

  return vite.build({
    build: {
      outDir: `./project/dist/${page.id}`,
      assetsDir: "./project/dist/assets",
      emptyOutDir: false,
      rollupOptions: {
        input: fs
          .readFileSync(`./project/layouts/${page.layout}/index.html`, "utf-8")
          .replace(`#ENTRY#`, makeEntry()),
        output: {
          entryFileNames: "index.html",
        },
      },
    },
  });
};

// render all the pages first
for (const page of DB.pages) {
  renderPage(page);
}
