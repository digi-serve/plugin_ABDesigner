/*
 * ui_work_version
 *
 * Display the Version Tab UI:
 *
 */
import UI_Class from "./ui_class";
import UI_Work_Version_List from "./ui_work_version_list";
import UI_Work_Version_Workspace from "./ui_work_version_workspace";

export default function (AB) {
   const UIClass = UI_Class(AB);

   const VersionList = UI_Work_Version_List(AB);
   const VersionWorkspace = UI_Work_Version_Workspace(AB, {
      allowDelete: 0,
      configureHeaders: false,
      detailsView: "",
      editView: "",
      isEditable: 0,
      massUpdate: 0,
      isReadOnly: true,
   });

   class UI_Work_Version extends UIClass {
      constructor() {
         super("ui_work_version");
      }

      ui() {
         const ids = this.ids;
         // Our webix UI definition:
         return {
            id: ids.component,
            type: "space",
            cols: [
               VersionList.ui(),
               { view: "resizer", width: 11 },
               VersionWorkspace.ui(),
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
         VersionList.on("selected", (dc) => {
            this.select(dc);
         });

         VersionWorkspace.on("addNew", (AB, selectNew) => {
            VersionList.emit("addNew", AB, selectNew);
         });

         await VersionWorkspace.init(AB);
         await VersionList.init(AB);

         this.on("versionDataUpdate", () => {
            // if we receive a signal that a version has been updated
            this.VersionList.refresh();
         });

         this.on("clearForm", () => {
            // if we receive a signal that a version has been updated
            this.VersionWorkspace.clearForm();
         });
      }

      /**
       * @function applicationLoad
       * Initialize the Version Workspace with the given ABApplication.
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         const oldAppID = this.CurrentApplicationID;

         super.applicationLoad(application);

         if (oldAppID && oldAppID != this.CurrentApplicationID) {
            VersionWorkspace.clearForm();
         }

         // application.versionData =
         //    application.json.versionData || application.versionData;

         VersionList.applicationLoad(application);
         VersionWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         const ids = this.ids;

         $$(ids.component).show(false, false);

         const application = this.CurrentApplication;
         if (application) {
            VersionWorkspace.applicationLoad(application);
            VersionList.applicationLoad(application);
         }
         VersionList.ready();
      }

      select(dc) {
         if (dc == null) VersionWorkspace.clearForm();
         VersionWorkspace.versionLoad(dc);
         // VersionWorkspace.populateWorkspace(dc);
      }
   }

   return new UI_Work_Version();
}
