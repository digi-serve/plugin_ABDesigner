/**
 * ABViewDefault
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

      myClass = class ABViewDefaultEditor extends UIClass {
         static get key() {
            return "_default";
         }

         constructor(view, base = "interface_editor_viewdefault") {
            // base: {string} unique base id reference

            super(base, {
               label: "",
            });

            this.view = view;
            this.settings = view.settings;
            // shortcut to reference the settings

            this.base = base;
            this.AB = AB;

            this.component = this.view.component();
         }

         ui() {
            return this.component.ui();
         }

         init(AB) {
            this.AB = AB;
            return this.component.init?.(AB, 2);
            // in our editor, we provide accessLv = 2
         }

         detatch() {
            this.component.detatch?.();
         }

         onShow() {
            this.component.onShow?.();
         }
      };
   }

   return myClass;
}
