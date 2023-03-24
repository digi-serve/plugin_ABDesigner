/*
 * ui_work_version_list
 *
 * Manage the ABVersion List
 *
 */
import UI_Class from "./ui_class";
import UI_VERSION_LIST from "./ui_version_list";
// import UI_ADD_FORM from "./ui_work_version_list_newVersion";

export default function (AB) {
   const UIClass = UI_Class(AB);

   // const AddForm = UI_ADD_FORM(AB);

   class UI_Work_Version_List extends UIClass {
      constructor() {
         super("ui_work_version_list");
         this.AB = {};

         // {ui_common_list} instance to display a list of our data collections.
         this.ListComponent = UI_VERSION_LIST(AB, {
            idBase: this.ids.component,
            labels: {
               addNew: "Add new Version",
               title: "Versions",
               searchPlaceholder: "Version",
            },
         });
      }

      // Our webix UI definition:
      ui() {
         return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB) {
         this.AB = AB;

         //
         // List of Processes
         //
         await this.ListComponent.init(AB);

         this.on("addNew", (AB, selectNew) => {
            // if we receive a signal that there is new data
            let data = AB.versionData || AB.json.versionData;
            this.ListComponent.dataLoad(data);
            this.emit("selected", selectNew);
         });

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item);
         });

         this.ListComponent.on("clearForm", () => {
            this.emit("clearForm");
         });
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Data Collection List from the provided ABApplication
       *
       * If no ABApplication is provided, then show an empty form. (create operation)
       *
       * @param {ABApplication} application  	[optional] The current ABApplication
       *										we are working with.
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         this.AB = application;
         // clear our list and display our data collections:
         // Make the list from the definitions here...
         let data = application.versionData || application.json.versionData;
         this.ListComponent.dataLoad(data);
      }

      ready() {
         this.ListComponent.ready();
      }
   }

   return new UI_Work_Version_List();
}
