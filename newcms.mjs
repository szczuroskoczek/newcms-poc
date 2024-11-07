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

for (const page of DB.pages) {
  if (!fs.existsSync("./project/pages")) {
    fs.mkdirSync("./project/pages");
  }

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
                import {mount} from 'svelte';
                import layout from '/project/layouts/${page.layout}.svelte';

                mount(layout, { target: document.getElementById('app'), props: ${JSON.stringify(
                  page.content.props
                )} });
            </script>
        </body>
        </html>
    `
  );
}

await vite.build({
  root: "./",
  build: {
    outDir: "./project/dist",
    rollupOptions: {
      input: globSync("./project/pages/*.html"),
    },
  },
  plugins: [svelte()],
});

for (const page of DB.pages) {
  app.get(page.path, (req, res) => {
    res.sendFile(`project/dist/project/pages/${page.id}.html`, {
      root: "./",
    });
  });
}

app.use(express.static("./project/dist"));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
