// Single source of truth for the brand name and the site's domain — every file that needs
// either imports from here instead of hardcoding its own copy. Keeps the two correctly
// separated: SITE_NAME is text people read ("Milon M&J Shopping"), SITE_URL is where the site
// lives (a URL, "https://milonmjshopping.com") — never write one where the other belongs.
export const SITE_NAME = "Milon M&J Shopping";
export const SITE_URL = "https://milonmjshopping.com";
