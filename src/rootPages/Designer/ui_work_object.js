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

         this.CurrentApplicationID = null;
         // {string} uuid
         // The current ABApplication.id we are working with.
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

         ObjectList.on("selected", (objID) => {
            if (objID == null) ObjectWorkspace.clearObjectWorkspace();
            else ObjectWorkspace.populateObjectWorkspace(objID);
         });

         ObjectWorkspace.on("addNew", (selectNew) => {
            ObjectList.emit("addNew", selectNew);
         });

         return Promise.all([ObjectWorkspace.init(AB), ObjectList.init(AB)]);
      }

      /**
       * @method applicationLoad
       * Initialize the Object Workspace with the given ABApplication.
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      applicationLoad(application) {
         var oldAppID = this.CurrentApplicationID;
         this.CurrentApplicationID = application?.id;

         if (oldAppID != this.CurrentApplicationID) {
            ObjectWorkspace.clearObjectWorkspace();
         }

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

         // if (this.CurrentApplicationID) {
         //    ObjectList?.applicationLoad(this.CurrentApplicationID);
         // }
         ObjectList?.ready();
      }
   }

   return new UI_Work_Object();
}
