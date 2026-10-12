import { appTitle } from "./shared";
import { basePath } from "./source";

// Next merges metadata SHALLOWLY: a page that sets `openGraph` or `twitter`
// replaces the root's whole object, image included. Every page spreads these
// so a link preview never loses its card.
const image = `${basePath}/opengraph-image`;

export const baseOpenGraph = {
  siteName: appTitle,
  locale: "en_US",
  images: [{ url: image, width: 1200, height: 630, alt: appTitle }],
};

export const baseTwitter = {
  card: "summary_large_image" as const,
  images: [image],
};
