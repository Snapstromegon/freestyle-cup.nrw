import renderPdf from "./lib/render-pdf.js";
import lightningcss from "./lib/lightning-css.js";
import browserslist from "browserslist";
import Image from "@11ty/eleventy-img";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";



export default (eleventyConfig) => {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
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
  eleventyConfig.addShortcode("favicon", async (src) => {
    const metadata = await Image(src, {
      formats: ["svg", "png", "webp", "avif"],
      outputDir: "_site/img/",
      widths: [64, 128, 180, 256, 512, 1024, 2048, null],
    });
    return `
      <link rel="icon" href="${metadata.svg[0].url}" type="image/svg+xml">
      <link rel="apple-touch-icon" href="${
        metadata.png.find((png) => png.width === 180).url
      }">
    `;
  });

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
