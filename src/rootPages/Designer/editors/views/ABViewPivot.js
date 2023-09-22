/**
 * ABViewPivotEditor
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
      const UIClass = UI_Class(AB);
      // var L = UIClass.L();
      // var L = ABViewContainer.L();

      myClass = class ABViewPivotEditor extends UIClass {
         static get key() {
            return "pivot";
         }

         constructor(view, base = "interface_editor_viewpivot") {
            // base: {string} unique base id reference

            super(base);

            this.view = view;
            this.component = this.view.component();
         }

         ui() {
            const pivotContainer = this.component.ui();
            const pivot = pivotContainer.rows[0];

            pivot.readonly = false;

            return pivot;
         }

         init(AB) {
            this.AB = AB;

            this.component?.init?.();

            const pivotId = this.ui().id;
            const $pivot = $$(pivotId);
            $pivot.getState().$observe("structure", (structure) => {
               this._saveStructure(structure);
            });
         }

         detatch() {
            this.component?.detatch?.();
         }

         onShow() {
            this.component?.onShow?.();
         }

         _saveStructure(structure) {
            this.view.settings.structure = structure;
            this.view.save();
         }
      };
   }

   return myClass;
}
