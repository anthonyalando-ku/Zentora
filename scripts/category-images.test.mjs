import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

function moduleURL(source, aliases = {}) {
  let { outputText } = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } });
  outputText = outputText.replace(/from "([^"]+)"/g, (_, name) => `from ${JSON.stringify(aliases[name] || import.meta.resolve(name))}`);
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}
const source = (path) => fs.readFileSync(new URL("../src/" + path, import.meta.url), "utf8");
const validatorURL = moduleURL(source("features/catalog/categoryImageUrl.ts"));
const { categoryImageUrl } = await import(validatorURL);
const componentSource = source("features/catalog/CategoryImage.tsx");
const { CategoryImage } = await import(moduleURL(componentSource, { "./categoryImageUrl": validatorURL }));

test("missing and malformed URLs preserve the existing presentation", () => {
  for (const src of [undefined, null, "", " ", "not a URL", "/relative.png", "javascript:alert(1)", "https://", "https://user:pass@example.com/x"]) {
    assert.equal(categoryImageUrl(src), null);
    const html = renderToStaticMarkup(React.createElement(CategoryImage, { src, alt: "Electronics", fallback: React.createElement("div", null, "EL") }));
    assert.equal(html, "<div>EL</div>");
  }
});

test("backend image URL is rendered without changing the fallback while loading", () => {
  const html = renderToStaticMarkup(React.createElement(CategoryImage, {
    src: "https://ik.imagekit.io/store/category.webp", alt: "Electronics", fallback: React.createElement("div", null, "EL"),
  }));
  assert.match(html, /src="https:\/\/ik.imagekit.io\/store\/category.webp"/);
  assert.match(html, /EL/);
  assert.match(html, /opacity-0/);
});

// Drive the real loader's event handlers through its one state slot. No DOM/test framework dependency.
test("load/error events switch between the image and original fallback, and replacement resets the loader", async () => {
  globalThis.categoryImageTestState = undefined;
  const hookURL = moduleURL(`export function useState(initial) { if (globalThis.categoryImageTestState === undefined) globalThis.categoryImageTestState = initial; return [globalThis.categoryImageTestState, value => globalThis.categoryImageTestState = value]; }`);
  const { CategoryImage: Component } = await import(moduleURL(componentSource, { react: hookURL, "./categoryImageUrl": validatorURL }));
  const fallback = React.createElement("div", null, "EL");
  const first = Component({ src: "https://example.com/first.webp", alt: "Electronics", fallback });
  let rendered = first.type(first.props);
  const img = rendered.props.children[1];
  img.props.onLoad();
  rendered = first.type(first.props);
  assert.equal(rendered.props.children[0], false);
  assert.doesNotMatch(rendered.props.children[1].props.className, /opacity-0/);
  img.props.onError();
  assert.equal(first.type(first.props).props.children, fallback);
  const replacement = Component({ src: "https://example.com/replacement.webp", alt: "Electronics", fallback });
  assert.notEqual(first.key, replacement.key);
  globalThis.categoryImageTestState = undefined;
  assert.equal(replacement.type(replacement.props).props.children[0], fallback);
  delete globalThis.categoryImageTestState;
});

test("admin API preserves JSON requests and sends uploads as one multipart category operation", async () => {
  globalThis.categoryImageApiCalls = [];
  const httpURL = moduleURL(`export const http = { post: async (...args) => { globalThis.categoryImageApiCalls.push(args); return {data:{id:1}}; }, put: async (...args) => { globalThis.categoryImageApiCalls.push(args); return {data:{id:1}}; } };`);
  const { adminCatalogApi } = await import(moduleURL(source("features/admin/catalog/shared/adminCatalogApi.ts"), { "@/core/api": httpURL }));
  await adminCatalogApi.createCategory({ name: "Plain" });
  assert.deepEqual(globalThis.categoryImageApiCalls[0][1], { name: "Plain" });
  await adminCatalogApi.updateCategory(1, { name: "Edited", image_url: "" });
  assert.equal(globalThis.categoryImageApiCalls[1][1].image_url, "");
  await adminCatalogApi.createCategory({ name: "Uploaded", image: new File(["test"], "category.png", { type: "image/png" }) });
  const [path, body] = globalThis.categoryImageApiCalls[2];
  assert.equal(path, "/admin/catalog/categories");
  assert.equal(body.get("image").name, "category.png");
  assert.deepEqual(JSON.parse(body.get("data")), { name: "Uploaded" });
  delete globalThis.categoryImageApiCalls;
});
