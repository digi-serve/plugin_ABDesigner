/*
 * ui_work_query
 *
 * Display the Query Tab UI:
 *
 */

import UI_Work_Query_List from "./ui_work_query_list";
import UI_Work_Query_Workspace from "./ui_work_query_workspace";

export default function (AB) {
   const Query_List = UI_Work_Query_List(AB);
   const Query_Workspace = UI_Work_Query_Workspace(AB);

   class UI_Work_Query extends AB.ClassUI {
      constructor() {
         super("ab_work_query");

         this.CurrentApplication = null;
         this.QueryList = new Query_List();
         this.QueryWorkspace = new Query_Workspace(/** default settings */);
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            cols: [
               this.QueryList.ui(),
               { view: "resizer" },
               this.QueryWorkspace.ui(),
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
         this.QueryList.on("selected", this.select);

         return Promise.all([
            this.QueryWorkspace.init(AB),
            this.QueryList.init(AB),
         ]);
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

         this.QueryWorkspace.clearWorkspace();
         this.QueryList.applicationLoad(application);
         this.QueryWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         if (this.CurrentApplication) {
            this.QueryList?.applicationLoad(this.CurrentApplication);
         }
         this.QueryList?.ready();
      }

      select(q) {
         this.QueryWorkspace.resetTabs();
         this.QueryWorkspace.populateQueryWorkspace(q);
      }
   }

   return UI_Work_Query;
}
