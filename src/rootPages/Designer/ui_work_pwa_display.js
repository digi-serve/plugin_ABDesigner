/*
 * ui_work_pwa_display
 *
 * Display the PWA Interface Builder Display.  This section
 * of the UI will display a current version of the selected
 * page for the designer to see.
 *
 */

import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);

   class UI_Work_PWA_DISPLAY extends UIClass {
      constructor() {
         super("ab_work_pwa_display");
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            margin: 10,
            rows: [{}, { template: "Display Area" }, {}],
         };
      }

      async init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
      }

      /**
       * @method clearWorkspace()
       * remove the current editor from the workspace.
       */
      clearWorkspace() {
         console.log("Display: clear workspace!");
         return;

         let ui = [this._ViewSelect];

         webix.ui(ui, $$(this.ids.editors));
      }

      pageLoad(view) {
         console.log("Display: page Load", view);
      }
      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }
   }

   return new UI_Work_PWA_DISPLAY();
}
