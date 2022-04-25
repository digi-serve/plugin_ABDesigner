/*
 * ui_work_interface
 *
 * Display the Interface Tab UI:
 *
 */

import UI_Class from "./ui_class";
import UI_Work_Interface_List from "./ui_work_interface_list";
import UI_Work_Interface_Workspace from "./ui_work_interface_workspace";

export default function (AB) {
   var InterfaceList = UI_Work_Interface_List(AB);
   var InterfaceWorkspace = UI_Work_Interface_Workspace(AB);

   const UIClass = UI_Class(AB);

   class UI_Work_Interface extends UIClass {
      constructor() {
         super("ab_work_interface");
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            margin: 10,
            cols: [
               InterfaceList.ui(),
               { view: "resizer" },
               InterfaceWorkspace.ui(),
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI

         InterfaceList.on("selected", (page) => {
            this.select(page);
         });

         InterfaceWorkspace.on("view.new", () => {
            InterfaceList.clickNewView();
         });
         InterfaceWorkspace.on("select.view", (view) => {
            InterfaceList.select(view);
         });

         this.warningsPropogate([InterfaceList, InterfaceWorkspace]);
         this.on("warnings", () => {
            // make sure our list refreshes it's display
            InterfaceList.applicationLoad(this.CurrentApplication);
         });

         return Promise.all([
            InterfaceWorkspace.init(AB),
            InterfaceList.init(AB),
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

         //  InterfaceWorkspace.clearInterfaceWorkspace();
         InterfaceList.applicationLoad(application);
         InterfaceWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         if (this.CurrentApplication) {
            InterfaceList?.applicationLoad(this.CurrentApplication);
         }
         // InterfaceList?.ready();
      }

      select(page) {
         if (!page) {
            InterfaceWorkspace.clearWorkspace();
         } else {
            // InterfaceWorkspace.datacollectionLoad(page);
            InterfaceWorkspace.viewLoad(page);
         }
      }
   }

   return new UI_Work_Interface();
}
