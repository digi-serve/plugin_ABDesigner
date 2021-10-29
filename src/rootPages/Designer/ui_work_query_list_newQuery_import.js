/*
 * ab_work_query_list_newQuery_import
 *
 * Display the form for importing an existing query into the application.
 *
 */

export default function (AB) {
   const L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Query_List_NewQuery_Import extends AB.ClassUI {
      constructor() {
         let base = "ui_work_query_list_newQuery_import";
         super({
            component: base,

            form: `${base}_import`,
            filter: `${base}_filter`,
            queryList: `${base}_queryList`,
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
                     id: this.ids.queryList,
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
         this.$queryList = $$(this.ids.queryList);
         this.$buttonSave = $$(this.ids.buttonSave);
         this.$buttonCancel = $$(this.ids.buttonCancel);

         // "save.error" is triggered by the ui_work_query_list_newQuery
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_query_list_newQuery
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

         const availableQueries = this.currentApp.queriesExcluded();
         this.$queryList.parse(availableQueries, "json");
      }

      filter() {
         let filterText = this.$filter.getValue();
         this.$queryList.filter("#label#", filterText);
      }

      save() {
         let selectedQuery = this.$queryList.getSelectedItem();
         if (!selectedQuery) return false;

         this.$buttonSave.disable();

         this.emit("save", selectedQuery);
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
         this.$queryList.clearAll();
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
               title: L("Error creating Query: {0}", [values.name]),
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

   return UI_Work_Query_List_NewQuery_Import;
}
