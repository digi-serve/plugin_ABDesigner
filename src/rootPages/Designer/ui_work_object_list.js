/*
 * ui_work_object_list
 *
 * Manage the ABObject List
 *
 */
import UICommonListFactory from "./ui_common_list";
import UIListNewProcess from "./ui_work_object_list_newObject";

export default function (AB) {
   var UI_COMMON_LIST = UICommonListFactory(AB);

   // var L = function (...params) {
   //    return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   // };

   var AddForm = new UIListNewProcess(AB);
   // the popup form for adding a new process

   class UI_Work_Object_List extends AB.ClassUI {
      constructor() {
         super("ui_work_object_list");

         this.CurrentApplicationID = null;
         // {string}
         // the ABApplication.id we are currently working with.

         this.ListComponent = new UI_COMMON_LIST({
            idBase: this.ids.component,
            labels: {
               addNew: "Add new object",
               confirmDeleteTitle: "Delete Object",
               title: "Objects",
               searchPlaceholder: "Object name",
            },
            // we can overrid the default template like this:
            // templateListItem:
            //    "<div class='ab-object-list-item'>#label##warnings#{common.iconGear}</div>",
            menu: {
               copy: false,
               exclude: true,
            },
         });
         // {ui_common_list} instance to display a list of our objects.
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
         // List of Objects
         //
         await this.ListComponent.init(AB);

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item?.id);
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

         // this.ListComponent.on("copied", (data) => {
         //    this.copy(data);
         // });

         // ListComponent.on("menu", (data)=>{
         // 	console.log(data);
         // 	switch (data.command) {
         // 		case "exclude":
         // 			this._logic.exclude(process);
         // 			break;

         // 		case "copy":
         // 			break;
         // 	}
         // })

         //
         // Add Form
         //
         await AddForm.init(AB);

         AddForm.on("cancel", () => {
            AddForm.hide();
         });

         AddForm.on("save", (obj, select) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplicationID);

            // if (select) {
            this.ListComponent.select(obj.id);
            // }
         });

         // this._handler_refreshApp = (def) => {
         //    this.CurrentApplication = this.CurrentApplication.refreshInstance();
         //    this.applicationLoad(this.CurrentApplication);
         // };
      }

      addNew() {
         console.error("!! Who is calling this?");
         this.clickNewProcess(true);
      }

      /**
       * @function applicationLoad
       * Initialize the List from the provided ABApplication
       * If no ABApplication is provided, then show an empty form. (create operation)
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      applicationLoad(application) {
         var oldAppID = this.CurrentApplicationID;
         var selectedItem = null;
         // {ABObject}
         // if we are updating the SAME application, we will want to default
         // the list to the currently selectedItem

         this.CurrentApplicationID = application?.id;

         if (oldAppID == this.CurrentApplicationID) {
            selectedItem = this.ListComponent.selectedItem();
         }

         // NOTE: only include System Objects if the user has permission
         var f = (obj) => !obj.isSystemObject;
         if (this.AB.Account.isSystemDesigner()) {
            f = () => true;
         }
         this.ListComponent.dataLoad(application?.objectsIncluded(f));

         if (selectedItem) {
            this.ListComponent.selectItem(selectedItem.id);
         }

         AddForm.applicationLoad(application);
      }

      /**
       * @function callbackNewProcess
       *
       * Once a New Process was created in the Popup, follow up with it here.
       */
      // callbackNewProcess(err, object, selectNew, callback) {
      //    debugger;
      //    if (err) {
      //       OP.Error.log("Error creating New Process", { error: err });
      //       return;
      //    }

      //    let objects = this.CurrentApplication.objects();
      //    processList.parse(objects);

      //    // if (processList.exists(object.id))
      //    // 	processList.updateItem(object.id, object);
      //    // else
      //    // 	processList.add(object);

      //    if (selectNew != null && selectNew == true) {
      //       $$(ids.list).select(object.id);
      //    } else if (callback) {
      //       callback();
      //    }
      // }

      /**
       * @function clickNewProcess
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewProcess(selectNew) {
         // show the new popup
         AddForm.show();
      }

      /*
       * @function copy
       * the list component notified us of a copy action and has
       * given us the new data for the copied item.
       *
       * now our job is to create a new instance of that Item and
       * tell the list to display it
       */
      // copy(data) {
      //    debugger;
      //    // TODO:
      //    this.ListComponent.busy();

      //    this.CurrentApplication.processCreate(data.item).then((newProcess) => {
      //       this.ListComponent.ready();
      //       this.ListComponent.dataLoad(this.CurrentApplication.processes());
      //       this.ListComponent.select(newProcess.id);
      //    });
      // }

      /*
       * @function exclude
       * the list component notified us of an exclude action and which
       * item was chosen.
       *
       * perform the removal and update the UI.
       */
      async exclude(item) {
         this.ListComponent.busy();
         var application = this.AB.applicationByID(this.CurrentApplicationID);
         await application.objectRemove(item);
         this.ListComponent.dataLoad(application.objectsIncluded());

         // this will clear the object workspace
         this.emit("selected", null);
      }

      ready() {
         this.ListComponent.ready();
      }
   }
   return new UI_Work_Object_List();
}
