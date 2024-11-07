import express from "express";
import EasyDB from "./db/easydb.mjs";
import fs, { globSync } from "node:fs";
import * as vite from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const DB = new EasyDB();

const app = express();

// admin
const adminRouter = express.Router();
app.use("/admin", adminRouter);

if (!fs.existsSync("./project/pages")) {
  fs.mkdirSync("./project/pages");
}

for (const page of DB.pages) {
  fs.writeFileSync(
    `./project/pages/${page.id}.html`,
    `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div id="app"></div>
            <script type="module">
                import { mount } from 'svelte';
                import layout from '/project/layouts/${page.layout}.svelte';
                import rootComponent from '/project/components/${
                  page.content.type
                }/index.svelte';

                console.log({rootComponent})

                mount(layout, { target: document.getElementById('app'), props: {
                    page: ${JSON.stringify(page)},
                    rootComponent
                } });
            </script>
        </body>
        </html>
    `
  );
}

await vite.build({
  root: "./",
  build: {
    outDir: "./build",
    rollupOptions: {
      input: globSync("./project/**/*.*"),
      preserveEntrySignatures: "strict",
      output: {
        dir: "./build",
        preserveModules: true,
        preserveModulesRoot: "project",
      },
    },
  },
  plugins: [svelte({ preprocess: vitePreprocess() })],
});

for (const page of DB.pages) {
  app.get(page.path, (req, res) => {
    res.sendFile(`${page.id}.html`, {
      root: "./build/project/pages",
    });
  });
}

app.use(express.static("./build"));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
