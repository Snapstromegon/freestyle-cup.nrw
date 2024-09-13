export default (data) =>
  data.eleventy.env.runMode === "serve" ||
  (process.env.BRANCH && process.env.BRANCH !== "main") ||
  (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== "main");
