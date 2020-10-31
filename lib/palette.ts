import chroma from "chroma-js";

// 12-color "paired" palette from https://colorbrewer2.org
export const brewerPaired = [
  "rgb(166, 206, 227)", // #a6cee3
  "rgb( 31, 120, 180)", // #1f78b4
  "rgb(178, 223, 138)", // #b2df8a
  "rgb( 51, 160,  44)", // #33a02c
  "rgb(251, 154, 153)", // #fb9a99
  "rgb(227,  26,  28)", // #e31a1c
  "rgb(253, 191, 111)", // #fdbf6f
  "rgb(255, 127,   0)", // #ff7f00
  "rgb(202, 178, 214)", // #cab2d6
  "rgb(255, 255, 153)", // #ffff99
  "rgb(106,  61, 154)", // #6a3d9a
  "rgb(177,  89,  40)", // #b15928
];

// 10-color DIY
export const chromaFancy = [
  chroma("royalblue").luminance(0.2).hex(),
  chroma("green").luminance(0.3).hex(),
  chroma("red").luminance(0.3).hex(),
  chroma("orange").luminance(0.4).hex(),
  chroma("indigo").luminance(0.4).hex(),
  chroma("brown").luminance(0.2).hex(),
  chroma("yellow").luminance(0.7).hex(),
  chroma("gray").luminance(0.5).hex(),
  chroma("violet").luminance(0.4).hex(),
  chroma("black").luminance(0.1).hex(),
];

export const chromaSaturated = [
  chroma("royalblue").hex(),
  chroma("green").hex(),
  chroma("red").hex(),
  chroma("orange").hex(),
  chroma("indigo").hex(),
  chroma("brown").hex(),
  // chroma("yellow").hex(),
  // chroma("gray").hex(),
  chroma("violet").hex(),
  chroma("goldenrod").hex(),
  chroma("magenta").hex(),
  chroma("cyan").hex(),
  chroma("pink").hex(),
];

export default chromaFancy;
export const clusterPalette = chromaSaturated;
export const driverPalette = chromaSaturated;
