/*
 * Custom Component Manager
 * Initialize our custom Webix Components.
 */

// Import our Custom Components here:
const componentList = [require("./formioBuilder").default];

export default function initCustomWebix(AB) {
   componentList.forEach((Component) => {
      new Component(AB);
   });
}
