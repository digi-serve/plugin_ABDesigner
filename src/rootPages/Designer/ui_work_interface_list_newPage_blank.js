/*
 * ui_work_interface_list_newPage_blank
 *
 * Display the form for creating a new ABPage.
 */

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Interface_List_NewPage_Blank extends AB.ClassUI {
      constructor() {
         var base = "ui_work_interface_list_newPage_blank";
         super({
            component: base,

            form: `${base}_blank`,
            buttonSave: `${base}_save`,
            buttonCancel: `${base}_cancel`,
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Blank"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validatePageName
               },
               elements: [
                  {
                    view: "select",
                    id: this.ids.parentList,
                    // label: labels.component.parentPage,
                    label: L("Parent Page"),
                    name: "parent",
                    options: [],
                    //
                    placeholder: L("[ Root Page ]"),
                    labelWidth: 110,
                    // on: {
                    //   onAfterRender() {
                    //       AB.ClassUI.CYPRESS_REF(
                    //         this,
                    //         "ui_work_interface_list_newPage_blank_name"
                    //       );
                    //   },
                    // },
                  },
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Page name"),
                     labelWidth: 110,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(
                              this,
                              "ui_work_interface_list_newPage_blank_name"
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
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Add Page"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
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

         // "save.error" is triggered by the ui_work_interface_list_newPage
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_interface_list_newPage
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
         this.$form.clearValidation();
         this.$form.clear();
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_interface_list_newPage object had an error saving
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
               title: L("Error creating Page: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_interface_list_newPage successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @function save
       *
       * verify the current info is ok, package it, and return it to be
       * added to the application.createModel() method.
       */
      save() {
         var saveButton = $$(this.ids.buttonSave);
         saveButton.disable();

         var Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            saveButton.enable();
            return false;
         }

         var values = Form.getValues();

         // set uuid to be primary column
         values.primaryColumnName = "uuid";

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
   }
   return new UI_Work_Interface_List_NewPage_Blank();
}
