import renderPdf from "./lib/render-pdf.js";
import lightningcss from "./lib/lightning-css.js";
import browserslist from "browserslist";

export default (eleventyConfig) => {
  eleventyConfig.addPlugin(lightningcss, {
    lightningcssOptions: {
      drafts: {
        nesting: true,
      },
      minify: true,
      sourceMap: true,
    },
    support: browserslist("last 2 versions, not dead"),
    watch: "assets/css/",
  });
  eleventyConfig.addPlugin(renderPdf, [
    { url: "/ausschreibung/", file: "downloads/ausschreibung.pdf" },
  ]);

  return {
    dir: {
      input: "src",
    },
  };
};
