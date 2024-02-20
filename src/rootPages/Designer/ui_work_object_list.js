/*
 * ui_work_object_list
 *
 * Manage the ABObject List
 *
 */
import UI_Class from "./ui_class";
import UI_COMMON_LIST from "./ui_common_list";
import UIListNewObject from "./ui_work_object_list_newObject";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   var AddForm = new UIListNewObject(AB);
   // the popup form for adding a new process

   class UI_Work_Object_List extends UIClass {
      constructor() {
         super("ui_work_object_list", {
            informationMenuItem: "",
            propertyObjectInfo: "",
            propertyFieldsPopup: "",
            propertyFieldsList: "",
         });

         this.ListComponent = UI_COMMON_LIST(AB, {
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
      async init(AB) {
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

         this.ListComponent.on("show", () => {
            const idList = this.ListComponent.PopupEditComponent.ids.list;
            const $list = $$(idList);
            if ($list.exists(this.ids.informationMenuItem))
               $list.remove(this.ids.informationMenuItem);

            if (this.AB.Account.isSystemDesigner()) {
               $list.add({
                  id: this.ids.informationMenuItem,
                  label: L("Information"),
                  icon: "fa fa-info-circle",
                  command: "information",
               });
            }
         });

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

         this.ListComponent.on("information", (item) => {
            this.information(item);
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

         AddForm.on("save", (obj /* , select */) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(obj.id);
            // }
         });
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

         super.applicationLoad(application);

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
            this.ListComponent.dataLoad(
               this.CurrentApplication?.objectsIncluded(f)
            );
            this.ListComponent.selectItem(selectedItem.id);
         }
      }

      /**
       * @function clickNewProcess
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewProcess(/* selectNew */) {
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
         var app = this.CurrentApplication;
         await app.objectRemove(item);
         this.ListComponent.dataLoad(app.objectsIncluded());

         // this will clear the object workspace
         this.emit("selected", null);
      }

      async information(object) {
         const fnGetDbInfo = object.getDbInfo();

         const $propertyFieldsPopup = $$(this.ids.propertyFieldsPopup);
         if (!$propertyFieldsPopup) {
            this.AB.Webix.ui({
               id: this.ids.propertyFieldsPopup,
               view: "popup",
               height: 300,
               width: 500,
               body: {
                  id: this.ids.propertyFieldsList,
                  view: "datatable",
                  columns: [
                     { id: "Field", header: "Name", width: 150 },
                     { id: "Type", header: "Type", width: 150 },
                     { id: "Default", header: "Default", width: 150 },
                     { id: "Extra", header: "Extra" },
                     { id: "Key", header: "Index Type" },
                     { id: "Null", header: "Nullable" },
                  ],
               },
            });
         }

         const $systemPopup = this.AB.Webix.ui({
            view: "window",
            height: 300,
            width: 450,
            position: "center",
            modal: true,
            resize: true,
            head: {
               view: "toolbar",
               cols: [
                  {},
                  {
                     view: "button",
                     width: 35,
                     css: "webix_transparent",
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        $systemPopup.close();
                     },
                  },
               ],
            },
            body: {
               view: "property",
               id: this.ids.propertyObjectInfo,
               nameWidth: 120,
               // editable: false,
               elements: [
                  { label: "Database Information", type: "label" },
                  {
                     label: "Definition ID",
                     type: "text",
                     id: "definitionId",
                  },
                  {
                     label: "Table Name",
                     type: "text",
                     id: "tableName",
                  },
                  {
                     id: "fieldsPopup",
                     label: "Fields",
                     type: "popup",
                     popup: this.ids.propertyFieldsPopup,
                  },
               ],
            },
         });

         $systemPopup.show();

         const $propertyObjectInfo = $$(this.ids.propertyObjectInfo);
         this.AB.Webix.extend($propertyObjectInfo, this.AB.Webix.ProgressBar);
         $propertyObjectInfo.showProgress({ type: "icon" });

         try {
            const objectInfo = await fnGetDbInfo;

            $propertyObjectInfo.setValues(objectInfo);
            $$(this.ids.propertyFieldsList).define("data", objectInfo.fields);
         } catch (err) {
            this.AB.notify.developer(err, {
               context: "Error trying to get information of object",
               object: object.toObj(),
            });
         }

         $propertyObjectInfo.hideProgress();
      }

      ready() {
         this.ListComponent.ready();
      }
   }
   return new UI_Work_Object_List();
}
