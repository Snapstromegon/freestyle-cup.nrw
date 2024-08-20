import { chromium } from "playwright";
import path from "node:path";
import { readFile } from "node:fs/promises";

const renderRoute = async (browser, url, output, eleventyConfig) => {
    const page = await browser.newPage({
        baseURL: "http://localhost:8080",
    });
    await page.route("**", async (route) => {
        let reqUrl = route.request().url()
            .replace("http://localhost:8080/", "");
        if (reqUrl.endsWith("/")) reqUrl += "index.html";
        const filePath = path.join(import.meta.dirname, "..", eleventyConfig.dir.output, reqUrl);
        route.fulfill({
            body: await readFile(filePath),
            status: 200,
        });
    });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
        displayHeaderFooter: false,
        format: "A4",
        path: path.join(".", eleventyConfig.dir.output, output),
    });
    await page.close();
};

export default (eleventyConfig, routes = []) => {
    eleventyConfig.on("eleventy.after", async () => {
        console.log("Rendering PDFs...");
        const browser = await chromium.launch();
        for (const route of routes) {
            await renderRoute(browser, route.url, route.file, eleventyConfig);
        }
        await browser.close();
        console.log("Rendering PDFs done.");
    });
};
