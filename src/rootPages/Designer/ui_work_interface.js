/*
 * ui_work_interface
 *
 * Display the Interface Tab UI:
 *
 */

import UI_Class from "./ui_class";
import UI_Work_Interface_List from "./ui_work_interface_list";
//import UI_Work_Interface_Workspace_Class from "./ui_work_interface_workspace";

export default function (AB) {
   var InterfaceList = UI_Work_Interface_List(AB);
   //  var InterfaceWorkspace = UI_Work_Interface_Workspace_Class(
   //     AB
   //     /* leave empty for default settings */
   //  );

   const UIClass = UI_Class(AB);
   var L = UIClass.L();

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
            cols: [InterfaceList.ui(), { view: "resizer" }, {}], // ,InterfaceWorkspace.ui()
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI

         InterfaceList.on("selected", (page) => {
            console.log("this is unfinished");
            // TODO
            // this.select(page);
         });

         //  InterfaceWorkspace.on("addNew", (selectNew) => {
         //     InterfaceList.emit("addNew", selectNew);
         //  });
         this.warningsPropogate([InterfaceList, InterfaceList]);
         this.on("warnings", () => {
            // make sure our list refreshes it's display
            InterfaceList.applicationLoad(this.CurrentApplication);
         });

         return Promise.all([
            //InterfaceWorkspace.init(AB),
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
         //  InterfaceWorkspace.applicationLoad(application);
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
         // TODO: This
         // if (page == null) InterfaceWorkspace.clearWorkspace();
         // InterfaceWorkspace.datacollectionLoad(page);
         // InterfaceWorkspace.populateWorkspace(page);
      }
   }

   return new UI_Work_Interface();
}
