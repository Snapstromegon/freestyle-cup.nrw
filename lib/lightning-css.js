import { bundle, browserslistToTargets } from "lightningcss";
import { parse, join, dirname } from "path";
import { mkdir, writeFile } from "fs/promises";
import { Hash } from "crypto";

const getPaths = (filename, code, hashLength) => {
  const hash = new Hash("sha256").update(code)
    .digest("hex");
  const cssFilename = `${parse(filename).name}-${hash.slice(
    0,
    hashLength
  )}.css`;
  const cssUrl = `/assets/css/${cssFilename}`;
  const cssPath = join("_site", cssUrl);
  const mapUrl = `/assets/css/${cssFilename}.map`;
  const mapPath = join("_site", mapUrl);
  const outputDir = dirname(cssPath);
  return {
    cssPath,
    cssUrl,
    mapPath,
    mapUrl,
    outputDir,
  };
};

const bundleCss = async ({
  filename,
  hashLength,
  lightningcssOptions,
  support,
}) => {
  const { code, map } = bundle({
    filename,
    targets: browserslistToTargets(support),
    ...lightningcssOptions,
  });
  const { cssUrl, cssPath, mapUrl, mapPath, outputDir } = getPaths(
    filename,
    code,
    hashLength
  );
  await mkdir(outputDir, { recursive: true });
  if (map) {
    await writeFile(mapPath, map);
  }
  await writeFile(
    cssPath,
    map ? `${code.toString()}/*# sourceMappingURL=${mapUrl}*/` : code
  );
  return {
    cssUrl,
  };
};

export default (
  eleventyConfig,
  { lightningcssOptions = {}, hashLength = 6, watch, support } = {}
) => {
  eleventyConfig.addWatchTarget(watch);
  eleventyConfig.addShortcode(
    "lightningcss",
    async (filename, media = "all") => {
      const { cssUrl } = await bundleCss({
        filename,
        hashLength,
        lightningcssOptions,
        support,
      });
      return `<link rel="stylesheet" href="${cssUrl}" media="${media}">`;
    }
  );
};