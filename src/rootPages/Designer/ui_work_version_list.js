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

         // {ui_common_list} instance to display a list of our data collections.
         this.ListComponent = UI_VERSION_LIST(AB, {
            idBase: this.ids.component,
            labels: {
               addNew: "Add new Version",
               // confirmDeleteTitle: "Delete Data Collection",
               title: "Versions",
               searchPlaceholder: "Version",
            },
            // menu: {
            //    copy: false,
            //    // exclude: true,
            // },
            /**
             * @function templateListItem
             *
             * Defines the template for each row of our Data view list.
             *
             * @param {ABVersion} obj the current instance of ABVersion for the row.
             * @param {?} common the webix.common icon data structure
             * @return {string}
             */
            templateListItem: function (version, common, warnings) {
               let warnIcon = "";
               if (warnings?.length > 0) {
                  warnIcon =
                     '<span class="webix_sidebar_dir_icon webix_icon fa fa-warning pulseLight smalltext"></span>';
               }
               return `<div class='ab-version-list-item'>
                  <i class="fa ${
                     version.settings.isQuery ? "fa-filter" : "fa-database"
                  }"></i>
                  ${version.label || "??label??"}
                  ${warnIcon}
                  ${common.iconGear(version)}
               </div>`;
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

         this.on("addNew", (selectNew) => {
            // if we receive a signal to add a new Data Collection from another source
            this.clickNewVersion(selectNew);
         });

         //
         // List of Processes
         //
         await this.ListComponent.init(AB);

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item);
         });

         this.ListComponent.on("addNew", (selectNew) => {
            this.clickNewVersion(selectNew);
         });

         this.ListComponent.on("deleted", (item) => {
            this.emit("deleted", item);
         });

         this.ListComponent.on("exclude", (item) => {
            this.exclude(item);
         });

         //
         // // Add Form
         // //
         // await AddForm.init(AB);

         // AddForm.on("cancel", () => {
         //    AddForm.hide();
         // });

         // AddForm.on("save", (q /* , select */) => {
         //    // the AddForm already takes care of updating the
         //    // CurrentApplication.

         //    // we just need to update our list of data collections
         //    this.applicationLoad(this.CurrentApplication);

         //    // if (select) {
         //    this.ListComponent.select(q.id);
         //    // }
         // });
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
         var oldAppID = this.CurrentApplicationID;
         var selectedItem = null;

         super.applicationLoad(application);

         if (oldAppID == this.CurrentApplicationID) {
            selectedItem = this.ListComponent.selectedItem();
         }

         // NOTE: only include System Objects if the user has permission
         var f = (obj) => !obj.isSystemObject;
         if (this.AB.Account.isSystemDesigner()) {
            f = () => true;
         }

         // clear our list and display our data collections:
         // TODO
         console.dir("Make the list from the definitions here...  ");
         this.ListComponent.dataLoad(application.versionData.changeLog);

         // if (selectedItem) {
         //    this.ListComponent.selectItem(selectedItem.id);
         // }

         // prepare our Popup with the current Application
         // AddForm.applicationLoad(application);
      }

      warningsRefresh() {
         if (this.CurrentApplication) {
            // NOTE: only include System Objects if the user has permission
            var f = (obj) => !obj.isSystemObject;
            if (this.AB.Account.isSystemDesigner()) {
               f = () => true;
            }

            let selectedItem = this.ListComponent.selectedItem();
            this.ListComponent.dataLoad(
               this.CurrentApplication?.versionsIncluded(f)
            );
            this.ListComponent.selectItem(selectedItem.id);
         }
      }

      // /**
      //  * @function exclude
      //  * the list component notified us of an exclude action and which
      //  * item was chosen.
      //  *
      //  * perform the removal and update the UI.
      //  */
      // async exclude(item) {
      //    this.ListComponent.busy();
      //    var app = this.CurrentApplication;
      //    await app?.versionRemove(item);
      //    this.ListComponent.dataLoad(app?.versionsIncluded());

      //    // this will clear the data collection workspace
      //    this.emit("selected", null);
      // }

      ready() {
         this.ListComponent.ready();
      }

      // /**
      //  * @function clickNewVersion
      //  *
      //  * Manages initiating the transition to the new Process Popup window
      //  */
      // clickNewVersion(/* selectNew */) {
      //    // show the new popup
      //    AddForm.show();
      // }
   }

   return new UI_Work_Version_List();
}
