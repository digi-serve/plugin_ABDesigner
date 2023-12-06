/*
 * ui_work_pwa
 *
 * Display the PWA Interface Builder UI:
 *
 */

import UI_Class from "./ui_class";
import UI_Work_PWA_List from "./ui_work_pwa_list";
import UI_Work_PWA_Display from "./ui_work_pwa_display";
import UI_Work_PWA_Properties from "./ui_work_pwa_properties";

import UI_Warnings from "./ui_warnings";

export default function (AB) {
   const ibase = "ab_work_pwa";
   const PWAList = UI_Work_PWA_List(AB);
   const PWADisplay = UI_Work_PWA_Display(AB);
   const PWAProperties = UI_Work_PWA_Properties(AB);

   const UIClass = UI_Class(AB);

   const Warnings = UI_Warnings(AB, `${ibase}_view_warnings`, {});

   class UI_Work_PWA extends UIClass {
      constructor() {
         super(ibase);
      }

      ui() {
         // Our webix UI definition:
         // return {
         //    id: this.ids.component,
         //    type: "space",
         //    margin: 10,
         //    cols: [
         //       PWAList.ui(),
         //       { view: "resizer" },
         //       PWADisplay.ui(),
         //       { view: "resizer" },
         //       PWAProperties.ui(),
         //    ],
         // };

         return {
            id: this.ids.component,
            view: "layout",
            rows: [
               {
                  // id: this.ids.component,
                  type: "space",
                  margin: 10,
                  cols: [
                     PWAList.ui(),
                     { view: "resizer" },
                     PWADisplay.ui(),
                     { view: "resizer" },
                     PWAProperties.ui(),
                  ],
               },
               Warnings.ui(),
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI

         PWAList.on("selected", (item) => {
            this.select(item);
         });

         PWAList.on("widget.updated", () => {
            PWADisplay.refresh();
         });

         PWAProperties.on("view.changed", () => {
            PWAList.refresh();
            PWADisplay.refresh();
         });

         // InterfaceWorkspace.on("view.new", () => {
         //    InterfaceList.clickNewView();
         // });
         // InterfaceWorkspace.on("select.view", (view) => {
         //    InterfaceList.select(view);
         // });

         this.warningsPropogate([PWAList /*, PWAProperties */]);
         this.on("warnings", () => {
            // make sure our list refreshes it's display
            PWAList.applicationLoad(this.CurrentApplication);
            // only show warnings for our Pages:
            Warnings.show(this.CurrentApplication.pages());
         });

         return Promise.all([
            PWADisplay.init(AB),
            PWAProperties.init(AB),
            PWAList.init(AB),
         ]);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Interface Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         PWAList.applicationLoad(application);
         PWADisplay.applicationLoad(application);
         PWAProperties.applicationLoad(application);

         // only show warnings for our Pages:
         Warnings.show(application.pages());
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         if (this.CurrentApplication) {
            PWAList?.applicationLoad(this.CurrentApplication);
            PWADisplay?.applicationLoad(this.CurrentApplication);
            PWAProperties?.applicationLoad(this.CurrentApplication);
         }
      }

      select(page) {
         if (!page) {
            PWADisplay.clearWorkspace();
            PWAProperties.clearWorkspace();
         } else {
            PWADisplay.pageLoad(page);
            PWAProperties.viewLoad(page);
         }
      }
   }

   return new UI_Work_PWA();
}
