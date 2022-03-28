/*
 * ui_work_query
 *
 * Display the Query Tab UI:
 *
 */
import UI_Class from "./ui_class";
import UI_Work_Query_List from "./ui_work_query_list";
import UI_Work_Query_Workspace from "./ui_work_query_workspace";

export default function (AB) {
   const UIClass = UI_Class(AB);
   // var L = UIClass.L();
   class UI_Work_Query extends UIClass {
      constructor() {
         super("ab_work_query");

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
         this.QueryList.on("selected", (q) => {
            this.select(q);
         });

         this.QueryWorkspace.on("query.add", () => {
            this.QueryList.emit("addNew");
         });

         this.warningsPropogate([this.QueryList, this.QueryWorkspace]);
         this.on("warnings", () => {
            // make sure our list refreshes it's display
            this.QueryList.applicationLoad(this.CurrentApplication);
         });

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
         super.applicationLoad(application);

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
         if (this._lastSelectedQuery) {
            this.QueryList.select(this._lastSelectedQuery);
            // NOTE: this.select() is called when an item in QueryList is selected.
            this.select(this._lastSelectedQuery);
         }
      }

      select(q) {
         // if (q?.id != this._lastSelectedQuery?.id) {
         this._lastSelectedQuery = q;
         this.QueryWorkspace.resetTabs();
         this.QueryWorkspace.queryLoad(q);
         // }
      }
   }

   return new UI_Work_Query();
}
