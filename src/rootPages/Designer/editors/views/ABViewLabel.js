/**
 * ABViewLabel
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
      const BASE_ID = "interface_editor_viewlabel";

      const UIClass = UI_Class(AB);

      myClass = class ABViewTextEditor extends UIClass {
         static get key() {
            return "label";
         }

         constructor(view, base = BASE_ID) {
            // base: {string} unique base id reference
            super(base);

            this.AB = AB;
            this.view = view;
            this.component = this.view.component();
         }

         ui() {
            const ids = this.ids;
            const baseView = this.view;
            const component = this.component;
            const _ui = {
               type: "form",
               margin: 10,
               padding: 10,
               borderless: true,
               rows: [
                  {
                     id: ids.component,
                     view: "label",
                     label: baseView.text || "",
                     align: baseView.settings.alignment,
                  },
                  {},
               ],
            };

            return component.uiFormatting(_ui);
         }

         async init(AB) {
            this.AB = AB;

            webix.codebase = "/js/webix/extras/";

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
