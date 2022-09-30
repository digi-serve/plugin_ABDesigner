/**
 * ABViewChartArea
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 */
let myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import UI_Class from "../../ui_class";

export default function (AB) {
   if (!myClass) {
      const BASE_ID = "interface_editor_viewchart_line";

      const UIClass = UI_Class(AB);

      myClass = class ABViewChartLineEditor extends UIClass {
         static get key() {
            return "line";
         }

         constructor(view, base = BASE_ID) {
            // base: {string} unique base id reference
            super(base, {
               view: "",
            });

            this.AB = AB;
            this.view = view;
            this.component = this.view.component();
         }

         ui() {
            return {
               id: this.ids.component,
            };
         }

         async init(AB) {
            this.AB = AB;

            await this.component.init(this.AB);

            // this.component.onShow();
            // in our editor, we provide accessLv = 2
         }

         detatch() {
            this.component.detatch?.();
         }

         onShow() {
            this.component.onShow();
         }
      };
   }

   return myClass;
}
