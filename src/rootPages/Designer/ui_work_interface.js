/*
 * ui_work_interface
 *
 * Display the Interface Tab UI:
 *
 */

import UI_Work_Interface_List from "./ui_work_interface_list";
//import UI_Work_Interface_Workspace_Class from "./ui_work_interface_workspace";

export default function (AB) {
   var InterfaceList = UI_Work_Interface_List(AB);
   //  var InterfaceWorkspace = UI_Work_Interface_Workspace_Class(
   //     AB
   //     /* leave empty for default settings */
   //  );

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Interface extends AB.ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         super("ab_work_interface");

         this.CurrentApplication = null;
         // {ABApplication}
         // The current ABApplication we are working with.
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

         InterfaceList.on("selected", (obj) => {
            console.log("this is unfinished");
            // TODO
            // if (obj == null) InterfaceWorkspace.clearInterfaceWorkspace();
            // else InterfaceWorkspace.populateInterfaceWorkspace(obj);
         });

         //  InterfaceWorkspace.on("addNew", (selectNew) => {
         //     InterfaceList.emit("addNew", selectNew);
         //  });

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
         this.CurrentApplication = application;

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
         InterfaceList?.ready();
      }
   }

   return new UI_Work_Interface();
}
