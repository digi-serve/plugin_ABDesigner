/*
 * ui_work_dataCollection_list_newDataCollection_blank
 *
 * Display the form for creating a new ABDataCollection.
 */
import UI_Class from "./ui_class";
export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_DataCollection_List_NewDataCollection_Blank extends UIClass {
      constructor() {
         super("ui_work_dataCollection_list_newDataCollection_blank", {
            // component: base, <-- auto-generated

            form: "",
            buttonSave: "",
            buttonCancel: "",
            object: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Create"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateDataCollectionName
               },
               elements: [
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Data Collection name"),
                     labelWidth: 70,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(
                              this,
                              "ui_work_dataCollection_list_newDatacollection_blank_name"
                           );
                        },
                     },
                  },
                  {
                     id: this.ids.object,
                     view: "richselect",
                     label: L("Object"),
                     name: "object",
                     required: true,
                     placeholder: L("Select an object"),
                     labelWidth: 70,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(
                              this,
                              "ui_work_dataCollection_list_newDatacollection_blank_object"
                           );
                        },
                     },
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.cancel();
                           },
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Add Data Collection"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         this.$buttonSave = $$(this.ids.buttonSave);
         this.$objectList = $$(this.ids.object);

         // "save.error" is triggered by the ui_work_dataCollection_list_newDataCollection
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_dataCollection_list_newDataCollection
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         if (this.$form) {
            this.$form.clearValidation();
            this.$form.clear();
         }
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_dataCollection_list_newDataCollection had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of queries:
       *        - A javascript Error() dataCollection
       *        - An ABValidation dataCollection returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            var message = L("the entered data is invalid");
            // if this was our Validation() dataCollection:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating DataCollection: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         this.$buttonSave.enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_dataCollection_list_newDatacollection successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         this.$buttonSave.enable();
      }

      /**
       * @function save
       *
       * verify the current info is ok, package it, and return it to be
       * added to the application.createModel() method.
       */
      save() {
         this.$buttonSave.disable();

         var Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            this.$buttonSave.enable();
            return false;
         }

         let formVals = Form.getValues();
         let id = formVals.object;
         let selectedObject = this.AB.objectByID(id);
         if (!selectedObject) {
            selectedObject = this.AB.queryByID(id);
         }

         let values = {
            name: formVals.name,
            label: formVals.name,
            settings: {
               datasourceID: id,
               isQuery: selectedObject?.isQuery ?? false,
            },
         };

         this.emit("save", values);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if ($$(this.ids.component)) $$(this.ids.component).show();
      }

      onShow(currentApplication) {
         // populate object list
         if (this.$objectList && currentApplication) {
            let datasourceOpts = [];

            // Objects
            datasourceOpts = datasourceOpts.concat(
               currentApplication.objectsIncluded().map((obj) => {
                  return {
                     id: obj.id,
                     value: obj.label,
                     icon: "fa fa-database",
                     isQuery: false,
                  };
               })
            );

            // Queries
            datasourceOpts = datasourceOpts.concat(
               currentApplication.queriesIncluded().map((q) => {
                  return {
                     id: q.id,
                     value: q.label,
                     icon: "fa fa-filter",
                     isQuery: true,
                  };
               })
            );

            this.$objectList.define("options", datasourceOpts);
            this.$objectList.refresh();

            // Set width of item list
            let $suggestView = this.$objectList.getPopup();
            $suggestView.attachEvent("onShow", () => {
               $suggestView.define("width", 350);
               $suggestView.resize();
            });
         }

         // clear form
         if (this.$form) {
            this.$form.setValues({
               name: "",
               object: "",
            });
         }
      }
   }

   return new UI_Work_DataCollection_List_NewDataCollection_Blank();
}
