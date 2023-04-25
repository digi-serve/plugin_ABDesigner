/**
 * ABViewKanban
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
      const BASE_ID = "interface_editor_viewkanban";

      const UIClass = UI_Class(AB);

      myClass = class ABViewKanbanEditor extends UIClass {
         static get key() {
            return "kanban";
         }

         constructor(view, base = BASE_ID) {
            // base: {string} unique base id reference
            super(base);

            this.AB = AB;
            this.view = view;
            this.component = this.view.component();
         }

         ui() {
            const component = this.component;
            const _ui = component.ui();
            _ui.minWidth = 400;

            return {
               view: "layout",
               cols: [_ui, { fillspace: true }],
            };
         }

         init(AB) {
            this.AB = AB;

            this.component?.init?.(AB);
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
