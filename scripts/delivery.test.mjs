import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

// Real TSX components, mocked API boundary: no live orders or requests.
function moduleURL(source, aliases = {}) {
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  outputText = outputText.replace(/from "([^"]+)"/g, (_, specifier) =>
    `from ${JSON.stringify(aliases[specifier] || import.meta.resolve(specifier))}`);
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}
const apiURL = moduleURL(`export const deliveryPolicyKey = ['delivery-policy']; export const deliveryApi = { get: async () => { throw Error('No network in tests'); } };`);
const deliveryURL = moduleURL(fs.readFileSync(new URL("../src/features/delivery/DeliveryInformation.tsx", import.meta.url), "utf8"), {
  "@/core/api/services/delivery": apiURL,
});
const { DeliveryInformation, OrderDeliveryInformation } = await import(deliveryURL);
const successURL = moduleURL(fs.readFileSync(new URL("../src/features/checkout/components/OrderSuccess.tsx", import.meta.url), "utf8"), {
  "@/features/delivery/DeliveryInformation": deliveryURL,
});
const { OrderSuccess } = await import(successURL);

test("delivery fallback never invents a price", () => {
  const client = new QueryClient();
  const html = renderToStaticMarkup(React.createElement(QueryClientProvider, { client }, React.createElement(DeliveryInformation)));
  assert.match(html, /confirmed separately/);
  assert.match(html, /not included/);
  assert.doesNotMatch(html, /300|free delivery/i);
  client.clear();
});

test("public information comes from backend query data", () => {
  const client = new QueryClient();
  client.setQueryData(["delivery-policy"], { message: "Backend notice: KES 425, confirmed separately." });
  const html = renderToStaticMarkup(React.createElement(QueryClientProvider, { client }, React.createElement(DeliveryInformation)));
  assert.match(html, /KES 425/);
  assert.doesNotMatch(html, /KES 300/);
  client.clear();
});

test("saved notices are escaped and legacy delivery stays unknown", () => {
  const html = renderToStaticMarkup(React.createElement(OrderDeliveryInformation, { snapshot: { notice: "Saved notice: KES 300 <script>" } }));
  assert.match(html, /Saved notice: KES 300/);
  assert.doesNotMatch(html, /<script>/);
  const legacy = renderToStaticMarkup(React.createElement(OrderDeliveryInformation));
  assert.match(legacy, /not recorded/);
  assert.doesNotMatch(legacy, /KES 300|free delivery/i);
});

test("success renders saved order amount independently of the cart", () => {
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, null,
    React.createElement(OrderSuccess, { orderId: "ZNT-test", itemCount: 2, totalPrice: 4500, delivery: { notice: "Delivery confirmed separately." } })));
  assert.match(html, /ZNT-test/);
  assert.match(html, /4,500/);
  assert.match(html, /excluding delivery/);
  assert.match(html, /confirmed separately/);
});
