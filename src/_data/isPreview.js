export default (data) =>
  data.eleventy.env.runMode === "serve" || process.env.BRANCH !== "main";
