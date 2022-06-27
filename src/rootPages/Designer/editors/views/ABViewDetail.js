/**
 * ABViewDetailEditor
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 */
var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import FABViewContainer from "./ABViewContainer";

export default function (AB) {
   if (!myClass) {
      const ABViewContainer = FABViewContainer(AB);
      // var L = UIClass.L();
      // var L = ABViewContainer.L();

      myClass = class ABViewDetailEditor extends ABViewContainer {
         static get key() {
            return "detail";
         }

         constructor(view, base = "interface_editor_viewdetail") {
            // base: {string} unique base id reference

            super(view, base);

            // this.component = this.view.component();
         }

         ui() {
            let _ui = super.ui();
            _ui.rows[0].cellHeight = 75;
            return _ui;
         }

         init(AB) {
            this.AB = AB;
            return super.init(AB);
         }

         detatch() {
            this.component?.detatch?.();
         }

         onShow() {
            this.component?.onShow?.();
         }
      };
   }

   return myClass;
}
