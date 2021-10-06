/*
 * ui_work_object
 *
 * Display the Object Tab UI:
 *
 */

import UI_Work_Object_List from "./ui_work_object_list";
import UI_Work_Object_Workspace_Class from "./ui_work_object_workspace";

export default function (AB) {
   var ObjectList = UI_Work_Object_List(AB);
   var ObjectWorkspace = UI_Work_Object_Workspace_Class(
      AB
      /* leave empty for default settings */
   );

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object extends AB.ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         super("ab_work_object");

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
            cols: [ObjectList.ui(), { view: "resizer" }, ObjectWorkspace.ui()],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI

         ObjectList.on("selected", (obj) => {
            if (obj == null) ObjectWorkspace.clearObjectWorkspace();
            else ObjectWorkspace.populateObjectWorkspace(obj);
         });

         ObjectWorkspace.on("addNew", (selectNew) => {
            ObjectList.emit("addNew", selectNew);
         });

         return Promise.all([ObjectWorkspace.init(AB), ObjectList.init(AB)]);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Object Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplication = application;

         ObjectWorkspace.clearObjectWorkspace();
         ObjectList.applicationLoad(application);
         ObjectWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         if (this.CurrentApplication) {
            ObjectList?.applicationLoad(this.CurrentApplication);
         }
         ObjectList?.ready();
      }
   }

   return new UI_Work_Object();
}
