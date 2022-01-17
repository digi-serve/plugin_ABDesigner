/*
 * ui_work_query
 *
 * Display the Query Tab UI:
 *
 */

import UI_Work_Query_List from "./ui_work_query_list";
import UI_Work_Query_Workspace from "./ui_work_query_workspace";

export default function (AB) {
   class UI_Work_Query extends AB.ClassUI {
      constructor() {
         super("ab_work_query");

         this.CurrentApplicationID = null;
         // {string} uuid
         // The current ABApplication.id we are working with.

         this.QueryList = UI_Work_Query_List(AB);
         this.QueryWorkspace = UI_Work_Query_Workspace(AB);
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
       * @method CurrentApplication
       * return the current ABApplication being worked on.
       * @return {ABApplication} application
       */
      get CurrentApplication() {
         return this.AB.applicationByID(this.CurrentApplicationID);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Query Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplicationID = application?.id;

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

         var app = this.CurrentApplication;
         if (app) {
            this.QueryList?.applicationLoad(app);
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
