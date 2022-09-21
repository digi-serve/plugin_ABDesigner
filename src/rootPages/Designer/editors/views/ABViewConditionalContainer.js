/**
 * ABViewConditionalContainer
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 */
let myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import FABViewContainer from "./ABViewContainer";

export default function (AB) {
   if (myClass) return myClass;

   const ABViewContainer = FABViewContainer(AB);

   myClass = class ABViewConditionalContainerEditor extends ABViewContainer {
      static get key() {
         return "conditionalcontainer";
      }

      constructor(view, base = "interface_editor_viewconditionalContainer") {
         // base: {string} unique base id reference
         super(view, base);
      }
   };

   return myClass;
}
