import renderPdf from "./lib/render-pdf.js";
import lightningcss from "./lib/lightning-css.js";
import browserslist from "browserslist";
import Image from "@11ty/eleventy-img";

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
  
  eleventyConfig.addShortcode(
    "image",
    async function (src, alt, widths = [300, 600], sizes = "100vh") {
      let metadata = await Image(src, {
        widths,
        formats: ["avif", "webp", "jpeg", "svg"],
        outputDir: "./_site/img/",
      });

      let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
      };

      // You bet we throw an error on a missing alt (alt="" works okay)
      return Image.generateHTML(metadata, imageAttributes);
    }
  );

  eleventyConfig.addPassthroughCopy("assets/fonts");
  eleventyConfig.addPassthroughCopy("assets/downloads");
  eleventyConfig.addPlugin(renderPdf, [
    { url: "/ausschreibung/", file: "downloads/ausschreibung.pdf" },
  ]);

  return {
    dir: {
      input: "src",
    },
  };
};
