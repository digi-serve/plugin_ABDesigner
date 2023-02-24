/*
 * Custom Component Manager
 * Make sure our {ABComponent}s are initialized with our custom
 * Webix Components.
 */

// Import our Custom Components here:
const componentList = [require("./formioBuilder").default];

export default function initCustomWebix(AB) {
   console.log(componentList);
   componentList.forEach((Component) => {
      new Component(AB);
   });
}
