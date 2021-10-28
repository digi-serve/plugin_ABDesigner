/*
 * ui_work_query
 *
 * Display the Query Tab UI:
 *
 */

import UI_Work_Query_List from "./ui_work_query_list";
import UI_Work_Query_Workspace from "./ui_work_query_workspace";

export default function (AB) {
   const QueryList = UI_Work_Query_List(AB);
   const QueryWorkspace = UI_Work_Query_Workspace(AB);

   class UI_Work_Query extends AB.ClassUI {
      constructor() {
         super("ab_work_query");

         this.CurrentApplication = null;
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            cols: [QueryList.ui(), { view: "resizer" }, QueryWorkspace.ui()],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
         QueryList.on("selected", (q) => {
            QueryWorkspace.resetTabs();
            QueryWorkspace.populateQueryWorkspace(q);
         });

         return Promise.all([QueryWorkspace.init(AB), QueryList.init(AB)]);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Query Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplication = application;

         QueryWorkspace.clearWorkspace();
         QueryList.applicationLoad(application);
         QueryWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         if (this.CurrentApplication) {
            QueryList?.applicationLoad(this.CurrentApplication);
         }
         QueryList?.ready();
      }
   }

   return new UI_Work_Query();
}
