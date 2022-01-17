/*
 * ab_work_process_list
 *
 * Manage the Process List
 *
 */
import UICommonListFactory from "./ui_common_list";
import UIListNewProcess from "./ui_work_process_list_newProcess";

export default function (AB) {
   const UI_COMMON_LIST = UICommonListFactory(AB);
   const UI_PROCESS_NEW_FORM = UIListNewProcess(AB);

   const L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Process_List extends AB.ClassUI {
      constructor() {
         super("ui_work_process_list");

         this.CurrentApplication = null;

         // {ui_common_list} instance to display a list of our objects.
         this.ListComponent = new UI_COMMON_LIST({
            idBase: this.ids.component,
            labels: {
               addNew: "Add new process",
               confirmDeleteTitle: "Delete Process",
               title: "Processes",
               searchPlaceholder: "Process name",
            },
            // we can overrid the default template like this:
            templateListItem:
               "<div class='ab-object-list-item'>#label#{common.iconGear}</div>",
            menu: {
               copy: false,
               exclude: true,
            },
         });

         // the popup form for adding a new process
         this.AddForm = new UI_PROCESS_NEW_FORM();
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

         this.AddForm.on("save", (process, select) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(process.id);
            // }
         });

         this._handler_refreshApp = (def) => {
            this.CurrentApplication = this.CurrentApplication.refreshInstance();
            this.applicationLoad(this.CurrentApplication);
         };
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

         this.ListComponent.dataLoad(application?.processes());

         this.AddForm.applicationLoad(application);
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

      /**
       * @function copy
       * the list component notified us of a copy action and has
       * given us the new data for the copied item.
       *
       * now our job is to create a new instance of that Item and
       * tell the list to display it
       */
      copy(data) {
         this.ListComponent.busy();

         this.CurrentApplication.processCreate(data.item).then((newProcess) => {
            this.ListComponent.ready();
            this.ListComponent.dataLoad(this.CurrentApplication.processes());
            this.ListComponent.select(newProcess.id);
         });
      }

      /**
       * @function exclude
       * the list component notified us of an exclude action and which
       * item was chosen.
       *
       * perform the removal and update the UI.
       */
      async exclude(process) {
         this.ListComponent.busy();
         await this.CurrentApplication.objectRemove(process);
         this.ListComponent.dataLoad(this.CurrentApplication.processes());

         // this will clear the object workspace
         this.emit("selected", null);
      }

      busy() {
         this.ListComponent.busy();
      }

      ready() {
         this.ListComponent.ready();
      }
   }
   return UI_Work_Process_List;
}
