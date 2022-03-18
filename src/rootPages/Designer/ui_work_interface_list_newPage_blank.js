/*
 * ui_work_interface_list_newPage_blank
 *
 * Display the form for creating a new ABPage.
 */
import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_Interface_List_NewPage_Blank extends UIClass {
      constructor() {
         var base = "ui_work_interface_list_newPage_blank";
         super(base, {
            form: "",
            buttonSave: "",
            buttonCancel: "",
         });
         this.ids.parentList = {};
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
                     placeholder: L("[Root Page]"),
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

      init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);

         // "save.error" is triggered by the ui_work_interface_list_newPage
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.AB.notify.developer(err, {
               context: "ui_work_interface_list_newPage:init(): there was an error saving the values from our form."
            });
         });

         // "save.successful" is triggered by the ui_work_interface_list_newPage
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      /**
       * @function applicationLoad()
       *
       * Prepare our New Popups with the current Application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         var options = [{ id: "-", value: L("[Root page]") }];

         var addPage = function (page, indent) {
            indent = indent || "";
            options.push({
               id: page.urlPointer(),
               value: indent + page.label,
            });
            page
               .pages()
               .forEach(function (p) {
                  addPage(p, indent + "-");
               });
         };
         // this.CurrentApplication.pages((p) => p instanceof AB.Class.ABViewPage).forEach(
         application.pages().forEach(function (page) {
            addPage(page, "");
         });

         if ($$(this.ids?.parentList)?.define) {
            // $$(this.ids.parentList).define("options", options);
            $$(this.ids.parentList).define("options", options);
            $$(this.ids.parentList).refresh();
         }
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
            this.AB.notify.developer(err, {
               context: "ui_work_interface_list_newPage: the entered data is invalid",
               base: values,
            });
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

         if (values.parent === "-") {
            values.parent = null;
         } else if (values.parent) {
            values.parent = this.CurrentApplication.urlResolve(values.parent);
         }

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
