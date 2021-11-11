/*
 * ab_work_object_list_newObject_import
 *
 * Display the form for importing an existing object into the application.
 *
 */

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_List_NewObject_Import extends AB.ClassUI {
      constructor() {
         var base = "ui_work_object_list_newObject_import";
         super({
            component: base,

            form: `${base}_import`,
            filter: `${base}_filter`,
            objectList: `${base}_objectList`,
            columnList: `${base}_columnList`,
            buttonSave: `${base}_save`,
            buttonCancel: `${base}_cancel`,
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
                     id: this.ids.objectList,
                     select: true,
                     height: 200,
                     minHeight: 250,
                     maxHeight: 250,
                     data: [],
                     template: "<div>#label#</div>",
                     on: {
                        onSelectChange: () => this.objectSelect(),
                     },
                  },

                  // Columns list
                  {
                     view: "label",
                     label: `<b>${L("Columns")}</b>`,
                     height: 20,
                  },
                  {
                     view: "list",
                     id: this.ids.columnList,
                     datatype: "json",
                     multiselect: false,
                     select: false,
                     height: 200,
                     minHeight: 200,
                     maxHeight: 200,
                     type: {
                        height: 40,
                        isvisible: {
                           view: "checkbox",
                           width: 30,
                        },
                     },
                     template: (obj, common) => {
                        // return `
                        //     <span style="float: left;">${common.isvisible(obj, common)}</span>
                        //     <span style="float: left;">${obj.label}</span>
                        // `;
                        return `
                               <span style="float: left;"><i class="fa fa-${obj.icon}"></i></span>
                               <span style="float: left;">&nbsp;${obj.label}</span>
                           `;
                     },
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
         this.$objectList = $$(this.ids.objectList);
         this.$columnList = $$(this.ids.columnList);
         this.$buttonSave = $$(this.ids.buttonSave);
         this.$buttonCancel = $$(this.ids.buttonCancel);

         // "save.error" is triggered by the ui_work_object_list_newObject
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_object_list_newObject
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      onShow(app) {
         this.currentApp = app;
         this.formClear();

         // now all objects are *global* but an application might only
         // reference a sub set of them.  Here we just need to show
         // the objects our current application isn't referencing:

         let availableObjs = this.currentApp.objectsExcluded(
            (o) => !o.isSystemObject || AB.Account.isSystemDesigner()
         );
         this.$objectList.parse(availableObjs, "json");
      }

      filter() {
         let filterText = this.$filter.getValue();
         this.$objectList.filter("#label#", filterText);
      }

      objectSelect() {
         this.$columnList.clearAll();

         let selectedObj = this.$objectList.getSelectedItem(false);
         if (selectedObj) {
            let colNames = [];

            // Now that ABObjects are ABDefinitions, we no longer
            // have to lookup the data from the server:

            selectedObj.fields().forEach((f) => {
               // Skip these columns
               // TODO : skip connect field
               // if (col.model) continue;
               // if (col.collection) continue;

               //    let fieldClass = ABFieldManager.allFields().filter(
               //       (field) => field.defaults().key == f.key
               //    )[0];
               //    if (fieldClass == null) return;

               //    // If connect field does not link to objects in app, then skip
               //    if (
               //       f.key == "connectObject" &&
               //       !currentApp.objectsIncluded(
               //          (obj) => obj.id == f.settings.linkObject
               //       )[0]
               //    ) {
               //       return;
               //    }

               colNames.push({
                  id: f.id,
                  label: f.label,
                  isvisible: true,
                  icon: f.icon,
                  // disabled: !supported
               });
            });

            if (colNames.length == 0) {
               colNames.push({
                  id: "none",
                  label: L("No Fields Defined"),
                  isvisible: true,
               });
            }

            this.$columnList.parse(colNames);
         }
      }

      save() {
         var selectedObj = this.$objectList.getSelectedItem();
         if (!selectedObj) return false;

         this.$buttonSave.disable();

         this.emit("save", selectedObj);
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         // Filter section
         this.$form.clearValidation();
         this.$form.clear();
         // Lists
         this.$objectList.clearAll();
         this.$columnList.clearAll();
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
            var message = L("the entered data is invalid");
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

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Object: {0}", [values.name]),
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

   return new UI_Work_Object_List_NewObject_Import();
}
