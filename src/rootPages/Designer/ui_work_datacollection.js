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

   const DataCollectionList = UI_Work_DataCollection_List(AB);
   const DataCollectionWorkspace = UI_Work_DataCollection_Workspace(AB, {
      allowDelete: 0,
      configureHeaders: false,
      detailsView: "",
      editView: "",
      isEditable: 0,
      massUpdate: 0,
      isReadOnly: true,
   });

   class UI_Work_DataCollection extends UIClass {
      constructor() {
         super("ui_work_datacollection");
      }

      ui() {
         const ids = this.ids;
         // Our webix UI definition:
         return {
            id: ids.component,
            type: "space",
            cols: [
               DataCollectionList.ui(),
               { view: "resizer", width: 11 },
               DataCollectionWorkspace.ui(),
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
         DataCollectionList.on("selected", this.select);

         await DataCollectionWorkspace.init(AB);
         await DataCollectionList.init(AB);
      }

      /**
       * @function applicationLoad
       * Initialize the Datacollection Workspace with the given ABApplication.
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         DataCollectionWorkspace.clearWorkspace();
         DataCollectionList.applicationLoad(application);
         DataCollectionWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         // DataCollectionList.busy();

         const application = this.CurrentApplication;
         if (application) {
            DataCollectionWorkspace.applicationLoad(application);
            DataCollectionList.applicationLoad(application);
         }
         DataCollectionList.ready();
      }

      async select(dc) {
         DataCollectionWorkspace.clearWorkspace();
         await DataCollectionWorkspace.populateWorkspace(dc);
      }
   }

   return new UI_Work_DataCollection();
}
