/*
 * ui_work_process_list
 *
 * Manage the Process List
 *
 */
import UI_Class from "./ui_class";
import UI_COMMON_LIST from "./ui_common_list";
import UI_PROCESS_NEW_FORM from "./ui_work_process_list_newProcess";

export default function (AB) {
   const UIClass = UI_Class(AB);
   // var L = UIClass.L();

   class UI_Work_Process_List extends UIClass {
      constructor() {
         super("ui_work_process_list");

         // {ui_common_list} instance to display a list of our objects.
         this.ListComponent = UI_COMMON_LIST(AB, {
            idBase: this.ids.component,
            labels: {
               addNew: "Add new process",
               confirmDeleteTitle: "Delete Process",
               title: "Processes",
               searchPlaceholder: "Process name",
            },
            // we can overrid the default template like this:
            // templateListItem:
            //    "<div class='ab-object-list-item'>#label#{common.iconGear}</div>",
            menu: {
               copy: false,
               exclude: true,
            },
         });

         // the popup form for adding a new process
         this.AddForm = UI_PROCESS_NEW_FORM(AB);
      }

      // Our webix UI definition:
      ui() {
         return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB) {
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

         this.AddForm.on("save", (process /*, select */) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(process.id);
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
         super.applicationLoad(application);
         this.ListComponent.dataLoad(application?.processes());
         this.AddForm.applicationLoad(application);
      }

      /**
       * @function clickNewProcess
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewProcess(/* selectNew */) {
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
         await this.CurrentApplication.processRemove(process);
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

      /**
       * @method warningRefresh()
       * Perform a reload of our list, so the list can refresh the warnings
       * listed.
       */
      warningsRefresh() {
         if (this.CurrentApplication) {
            // NOTE: only include System Objects if the user has permission
            var f = (obj) => !obj.isSystemObject;
            if (this.AB.Account.isSystemDesigner()) {
               f = () => true;
            }

            let selectedItem = this.ListComponent.selectedItem();
            this.ListComponent.dataLoad(this.CurrentApplication?.processes(f));
            this.ListComponent.selectItem(selectedItem?.id);
         }
      }
   }
   return new UI_Work_Process_List();
}
