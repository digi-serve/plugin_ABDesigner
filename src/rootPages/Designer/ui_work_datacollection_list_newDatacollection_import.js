/*
 * ab_work_datacollection_list_newDatacollection_import
 *
 * Display the form for importing an existing data collection into the application.
 *
 */
import UI_Class from "./ui_class";
export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_DataCollection_List_NewDataCollection_Import extends UIClass {
      constructor() {
         super("ui_work_datacollection_list_newDatacollection_import", {
            // component: base, <-- auto generated

            form: "",
            filter: "",
            datacollectionList: "",
            buttonSave: "",
            buttonCancel: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Existing"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               elements: [
                  // Filter
                  {
                     cols: [
                        {
                           view: "icon",
                           icon: "fa fa-filter",
                           align: "left",
                        },
                        {
                           view: "text",
                           id: this.ids.filter,
                           on: {
                              onTimedKeyPress: () => this.filter(),
                           },
                        },
                     ],
                  },

                  // Model list
                  {
                     view: "list",
                     id: this.ids.datacollectionList,
                     select: true,
                     height: 200,
                     minHeight: 250,
                     maxHeight: 250,
                     data: [],
                     template: "<div>#label#</div>",
                  },

                  // Import & Cancel buttons
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
                           click: () => this.cancel(),
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Import"),
                           autowidth: true,
                           type: "form",
                           click: () => this.save(),
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
         this.$filter = $$(this.ids.filter);
         this.$datacollectionList = $$(this.ids.datacollectionList);
         this.$buttonSave = $$(this.ids.buttonSave);
         this.$buttonCancel = $$(this.ids.buttonCancel);

         // "save.error" is triggered by the ui_work_datacollection_list_newDatacollection
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_datacollection_list_newDatacollection
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });
      }

      onShow(app) {
         this.formClear();

         // now all objects are *global* but an application might only
         // reference a sub set of them.  Here we just need to show
         // the objects our current application isn't referencing:

         const availableQueries = app.datacollectionsExcluded();
         this.$datacollectionList.parse(availableQueries, "json");
      }

      filter() {
         let filterText = this.$filter.getValue();
         this.$datacollectionList.filter("#label#", filterText);
      }

      save() {
         let selectedDataCollection =
            this.$datacollectionList.getSelectedItem();
         if (!selectedDataCollection) return false;

         this.$buttonSave.disable();

         this.emit("save", selectedDataCollection);
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         // Filter section
         if (this.$form) {
            this.$form.clearValidation();
            this.$form.clear();
         }
         // Lists
         if (this.$datacollectionList) {
            this.$datacollectionList.clearAll();
         }
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_object_list_newObject object had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of objects:
       *        - A javascript Error() object
       *        - An ABValidation object returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            let message = L("the entered data is invalid");
            // if this was our Validation() object:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            let values = this.$form.getValues();
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
       * ui_work_object_list_newObject successfully saved the values.
       */
      onSuccess() {
         this.$buttonSave.enable();
      }
   }

   return new UI_Work_DataCollection_List_NewDataCollection_Import();
}
