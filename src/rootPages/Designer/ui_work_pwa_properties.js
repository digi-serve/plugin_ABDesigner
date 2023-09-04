/*
 * ui_work_pwa_properties
 *
 * Display the PWA Interface Builder Properties Panel.  This section of the UI
 * will display a current version of the selected page for the designer to see.
 *
 */

import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);

   class UI_Work_PWA_PROPERTIES extends UIClass {
      constructor() {
         super("ab_work_pwa_display");
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            margin: 10,
            rows: [{}, { template: "Properties Area" }, {}],
         };
      }

      async init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Interface Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      // applicationLoad(application) {
      //    super.applicationLoad(application);
      // }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }
   }

   return new UI_Work_PWA_PROPERTIES();
}
