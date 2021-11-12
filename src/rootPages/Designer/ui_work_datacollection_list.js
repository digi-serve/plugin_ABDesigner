/*
 * ui_work_datacollection_list
 *
 * Manage the ABDataCollection List
 *
 */
import UICommonListFactory from "./ui_common_list";
import UIListNewProcess from "./ui_work_datacollection_list_newDatacollection";

export default function (AB) {
   const UI_COMMON_LIST = UICommonListFactory(AB);
   const UI_ADD_FORM = UIListNewProcess(AB);

   class UI_Work_Datacollection_List extends AB.ClassUI {
      constructor() {
         super("ui_work_datacollection_list");

         this.CurrentApplication = null;

         // {ui_common_list} instance to display a list of our data collections.
         this.ListComponent = new UI_COMMON_LIST({
            idBase: this.ids.component,
            labels: {
               addNew: "Add new data collection",
               confirmDeleteTitle: "Delete Data Collection",
               title: "Data Collections",
               searchPlaceholder: "Data Collection name",
            },
            menu: {
               copy: false,
               exclude: true,
            },
            /**
             * @function templateListItem
             *
             * Defines the template for each row of our Data view list.
             *
             * @param {ABDatacollection} obj the current instance of ABDatacollection for the row.
             * @param {?} common the webix.common icon data structure
             * @return {string}
             */
            templateListItem: function (datacollection, common) {
               return `<div class='ab-datacollection-list-item'>
                        <i class="fa ${
                           datacollection.settings.isQuery
                              ? "fa-filter"
                              : "fa-database"
                        }"></i>
                        ${datacollection.label || "??label??"}
                        ${common.iconGear}
                        </div>`;
            },
         });
         this.AddForm = new UI_ADD_FORM();

         this._handler_refreshApp = (def) => {
            if (!this.CurrentApplication) return;
            this.CurrentApplication = this.CurrentApplication.refreshInstance();
            this.applicationLoad(this.CurrentApplication);
         };
      }

      // Our webix UI definition:
      ui() {
         return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB, options) {
         this.AB = AB;

         this.on("addNew", (selectNew) => {
            // if we receive a signal to add a new Data Collection from another source
            this.clickNewDataCollection(selectNew);
         });

         //
         // List of Processes
         //
         await this.ListComponent.init(AB);

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item);
         });

         this.ListComponent.on("addNew", (selectNew) => {
            this.clickNewDataCollection(selectNew);
         });

         this.ListComponent.on("deleted", (item) => {
            this.emit("deleted", item);
         });

         this.ListComponent.on("exclude", (item) => {
            this.exclude(item);
         });

         //
         // Add Form
         //
         await this.AddForm.init(AB);

         this.AddForm.on("cancel", () => {
            this.AddForm.hide();
         });

         this.AddForm.on("save", (q, select) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of data collections
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(q.id);
            // }
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
         let events = ["definition.updated", "definition.deleted"];
         if (this.CurrentApplication) {
            // remove current handler
            events.forEach((e) => {
               this.CurrentApplication.removeListener(
                  e,
                  this._handler_refreshApp
               );
            });
         }
         this.CurrentApplication = application;
         if (this.CurrentApplication) {
            events.forEach((e) => {
               this.CurrentApplication.on(e, this._handler_refreshApp);
            });
         }

         // clear our list and display our data collections:
         this.ListComponent.dataLoad(application?.datacollectionsIncluded());

         // prepare our Popup with the current Application
         this.AddForm.applicationLoad(application);
      }

      /**
       * @function exclude
       * the list component notified us of an exclude action and which
       * item was chosen.
       *
       * perform the removal and update the UI.
       */
      async exclude(item) {
         this.ListComponent.busy();
         await this.CurrentApplication.datacollectionRemove(item);
         this.ListComponent.dataLoad(
            this.CurrentApplication?.datacollectionsIncluded()
         );

         // this will clear the data collection workspace
         this.emit("selected", null);
      }

      ready() {
         this.ListComponent.ready();
      }

      /**
       * @function clickNewDataCollection
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewDataCollection(selectNew) {
         // show the new popup
         this.AddForm.show();
      }
   }

   return UI_Work_Datacollection_List;
}
