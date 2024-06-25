/**
 * ABViewOrgChartEditor
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 */
var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import FABViewDefault from "./_ABViewDefault";

export default function (AB) {
   if (!myClass) {
      const ABViewDefault = FABViewDefault(AB);
      // var L = UIClass.L();
      // var L = ABViewContainer.L();

      myClass = class ABViewOrgChartEditor extends ABViewDefault {
         static get key() {
            return "orgchart";
         }

         constructor(view, base = "interface_editor_viewOrgChart") {
            // base: {string} unique base id reference

            super(view, base);

            // this.component = this.view.component();
         }

         ui() {
            let _ui = super.ui();
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
