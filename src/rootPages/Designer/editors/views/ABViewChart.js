/**
 * ABViewChart
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 */
let myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import FABViewContainer from "./ABViewContainer";

export default function (AB) {
   if (!myClass) {
      const BASE_ID = "interface_editor_viewchart";
      const ABViewContainer = FABViewContainer(AB);

      myClass = class ABViewChartEditor extends ABViewContainer {
         static get key() {
            return "chart";
         }

         constructor(view, base = BASE_ID) {
            // base: {string} unique base id reference
            super(view, base);
         }

         ui() {
            const _ui = super.ui();

            _ui.rows[0].cellHeight = 400;

            return _ui;
         }

         async init(AB) {
            this.AB = AB;

            await super.init(AB);

            // this.component.onShow();
            // in our editor, we provide accessLv = 2
         }

         detatch() {}

         onShow() {
            super.onShow();
         }
      };
   }

   return myClass;
}
