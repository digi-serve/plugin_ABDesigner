/*
 * ui_work_query_list
 *
 * Manage the ABObjectQuery List
 *
 */
import UICommonListFactory from "./ui_common_list";
import UIListNewProcess from "./ui_work_query_list_newQuery";

export default function (AB) {
   const UI_COMMON_LIST = UICommonListFactory(AB);
   const UI_ADD_FORM = UIListNewProcess(AB);

   class UI_Work_Query_List extends AB.ClassUI {
      constructor() {
         super("ui_work_query_list");

         this.CurrentApplication = null;

         // {ui_common_list} instance to display a list of our objects.
         this.ListComponent = new UI_COMMON_LIST({
            idBase: this.ids.component,
            labels: {
               addNew: "Add new query",
               confirmDeleteTitle: "Delete Query",
               title: "Queries",
               searchPlaceholder: "Query name",
            },
            // we can overrid the default template like this:
            // templateListItem:
            //    "<div class='ab-object-list-item'>#label##warnings#{common.iconGear}</div>",
            menu: {
               copy: false,
               exclude: true,
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
            // if we receive a signal to add a new Object from another source
            // like the blank object workspace offering an Add New button:
            this.clickNewProcess(selectNew);
         });

         //
         // List of Processes
         //
         await this.ListComponent.init(AB);

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item);
         });

         this.ListComponent.on("addNew", (selectNew) => {
            this.clickNewProcess(selectNew);
         });

         this.ListComponent.on("deleted", (item) => {
            this.emit("deleted", item);
         });

         this.ListComponent.on("exclude", (item) => {
            this.exclude(item);
         });

         this.ListComponent.on("copied", (data) => {
            this.copy(data);
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

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(q.id);
            // }
         });
      }

      /**
       * @function applicationLoad
       * Initialize the List from the provided ABApplication
       * If no ABApplication is provided, then show an empty form. (create operation)
       * @param {ABApplication} application
       *        [optional] The current ABApplication we are working with.
       */
      applicationLoad(application) {
         var events = ["definition.updated", "definition.deleted"];
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

         this.ListComponent.dataLoad(application?.queriesIncluded());

         this.AddForm.applicationLoad(application);
      }

      ready() {
         this.ListComponent.ready();
      }

      /**
       * @function clickNewProcess
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewProcess(selectNew) {
         // show the new popup
         this.AddForm.show();
      }
   }

   return UI_Work_Query_List;
}
