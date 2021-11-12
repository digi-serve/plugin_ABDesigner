/*
 * ui_work_datacollection
 *
 * Display the DataCollection Tab UI:
 *
 */

import UI_Work_DataCollection_List from "./ui_work_datacollection_list";
import UI_Work_DataCollection_Workspace from "./ui_work_datacollection_workspace";

export default function (AB) {
   const DataCollection_List = UI_Work_DataCollection_List(AB);
   const DataCollection_Workspace = UI_Work_DataCollection_Workspace(AB);

   class UI_Work_DataCollection extends AB.ClassUI {
      constructor() {
         super("ui_work_datacollection");

         this.CurrentApplication = null;
         this.DataCollectionList = new DataCollection_List();
         this.DataCollectionWorkspace =
            new DataCollection_Workspace(/** default settings */);
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            cols: [
               this.DataCollectionList.ui(),
               { view: "resizer", width: 11 },
               this.DataCollectionWorkspace.ui(),
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
         this.DataCollectionList.on("selected", this.select);

         return Promise.all([
            this.DataCollectionWorkspace.init(AB),
            this.DataCollectionList.init(AB),
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

         this.DataCollectionWorkspace.clearWorkspace();
         this.DataCollectionList.applicationLoad(application);
         this.DataCollectionWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         // this.DataCollectionList.busy();

         if (this.CurrentApplication) {
            this.DataCollectionWorkspace.applicationLoad(
               this.CurrentApplication
            );
            this.DataCollectionList.applicationLoad(this.CurrentApplication);
         }
         this.DataCollectionList.ready();
      }

      select(dc) {
         this.DataCollectionWorkspace.clearWorkspace();
         this.DataCollectionWorkspace.populateWorkspace(dc);
      }
   }

   return UI_Work_DataCollection;
}
