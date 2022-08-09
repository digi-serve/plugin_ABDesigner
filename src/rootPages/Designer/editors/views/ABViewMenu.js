/**
 * ABViewMenuEditor
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

      myClass = class ABViewMenuEditor extends UIClass {
         static get key() {
            return "menu";
         }

         constructor(view, base = "interface_editor_viewmenu") {
            // base: {string} unique base id reference

            super(view, base);

            this.view = view;
            this.component = this.view.component();
         }

         ui() {
            const menu = this.component.ui();

            return {
               type: "space",
               rows: [menu, {}],
            };
         }

         init(AB) {
            this.AB = AB;

            const ids = this.ids;
            const currView = this.view;

            const $menu = $$(ids.menu);
            currView.ClearPagesInView($menu);
            if (currView?.settings?.order?.length) {
               currView.AddPagesToView($menu, currView.settings.order);
               // } else if (this.settings.pages && this.settings.pages.length) {
               //    this.AddPagesToView(Menu, this.settings.pages);
            }
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
