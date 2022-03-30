/*
 * ui_work_datacollection
 *
 * Display the DataCollection Tab UI:
 *
 */
import UI_Class from "./ui_class";
import UI_Work_DataCollection_List from "./ui_work_datacollection_list";
import UI_Work_DataCollection_Workspace from "./ui_work_datacollection_workspace";

export default function (AB) {
   const UIClass = UI_Class(AB);
   class UI_Work_DataCollection extends UIClass {
      constructor() {
         super("ui_work_datacollection");

         this.DataCollectionList = UI_Work_DataCollection_List(AB);
         this.DataCollectionWorkspace = UI_Work_DataCollection_Workspace(AB);
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
       * Initialize the Datacollection Workspace with the given ABApplication.
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

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
         $$(this.ids.component).show(false, false);

         // this.DataCollectionList.busy();

         var app = this.CurrentApplication;
         if (app) {
            this.DataCollectionWorkspace.applicationLoad(app);
            this.DataCollectionList.applicationLoad(app);
         }
         this.DataCollectionList.ready();
      }

      select(dc) {
         this.DataCollectionWorkspace.clearWorkspace();
         this.DataCollectionWorkspace.populateWorkspace(dc);
      }
   }

   return new UI_Work_DataCollection();
}
