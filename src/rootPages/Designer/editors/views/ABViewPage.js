/**
 * ABViewPage
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 *
 * ABViewPage is a glorified ABViewContainer
 */
var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import FABViewContainer from "./ABViewContainer";

export default function (AB) {
   if (!myClass) {
      // const uiConfig = AB.Config.uiSettings();
      const ABViewContainer = FABViewContainer(AB);
      // var L = ABViewContainer.L();

      myClass = class ABViewPageEditor extends ABViewContainer {
         static get key() {
            return "page";
         }
      };
   }

   return myClass;
}
