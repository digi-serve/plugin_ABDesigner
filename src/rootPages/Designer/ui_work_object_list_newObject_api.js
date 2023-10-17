/*
 * ui_work_object_list_newObject_api
 *
 * Display the form for creating a new ABObject.
 */
import UI_Class from "./ui_class";
import UI_ApiObjectRead from "./ui_work_object_list_newObject_api_read";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Object_List_NewObject_API extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_api", {
            // component: base,

            form: "",
            buttonSave: "",
            buttonCancel: "",
         });

         this.API_Read = UI_ApiObjectRead(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("API"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 800,
               height: 500,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateObjectName
               },
               elements: [
                  {
                     rows: [
                        {
                           view: "text",
                           label: L("Name"),
                           name: "name",
                           required: true,
                           placeholder: L("Object name"),
                           labelWidth: 70,
                        },
                        {
                           view: "checkbox",
                           label: L("Read Only"),
                           name: "readonly",
                           value: 1,
                           disabled: true,
                        },
                     ],
                  },
                  {
                     view: "tabview",
                     name: "apiType",
                     tabbar: {
                        options: [
                           { value: "Create", disabled: true },
                           "Read",
                           { value: "Update", disabled: true },
                           { value: "Delete", disabled: true },
                        ],
                        value: "Read",
                        height: 40,
                     },
                     cells: [this.API_Read.ui()],
                  },
                  {
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
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Save"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
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
         AB.Webix.extend(this.$form, webix.ProgressBar);

         this.API_Read.init(AB);

         // "save.error" is triggered by the ui_work_object_list_newObject
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_object_list_newObject
         // if the values we provided were successfully saved.
         this.on("save.successful", async (obj) => {
            this.onSuccess();

            // try {
            //    await obj.fetchData();

            //    webix.message({
            //       type: "success",
            //       text: L("Successfully fetching data."),
            //    });
            // } catch (err) {
            //    webix.message({
            //       type: "error",
            //       text: L("Error fetching data."),
            //    });
            //    this.AB.notify.developer(err, {
            //       context: "ABObjectAPI.fetchData()",
            //       object: obj.toObj(),
            //    });
            // }
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

            const values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Object: {0}", [values.name]),
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
       * ui_work_object_list_newObject successfully saved the values.
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
      async save() {
         this.busy();

         const Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate() || !this.API_Read.validate()) {
            this.ready();
            return false;
         }

         let values = Form.getValues();

         const apiValues = this.API_Read.getValues();
         const secretValues = apiValues?.request?.secrets ?? [];
         delete apiValues?.request?.secrets;

         // Create a new Object
         values = Object.assign(values, apiValues);
         const object = AB.objectNew(Object.assign({ isAPI: true }, values));

         try {
            // Add fields
            // const addFieldTasks = [];
            values.fieldIDs = [];
            for (const f of values.response?.fields ?? []) {
               const field = AB.fieldNew(
                  {
                     name: f.columnName,
                     label: f.columnName,
                     columnName: f.columnName,
                     key: f.type,
                  },
                  object
               );
               await field.save(true);

               values.fieldIDs.push(field.id);
            }
            values.id = object.id;

            this.emit("save", object.toObj());

            // TODO: Save Secrets object.id
            console.log("secretValues: ", secretValues);

            this.ready();
         } catch (err) {
            console.error(err);
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component)?.show();
      }

      busy() {
         const $form = $$(this.ids.form);
         const $saveButton = $$(this.ids.buttonSave);

         $form.showProgress({ type: "icon" });
         $saveButton.disable();
      }

      ready() {
         const $form = $$(this.ids.form);
         const $saveButton = $$(this.ids.buttonSave);

         $form.hideProgress();
         $saveButton.enable();
      }
   }
   return new UI_Work_Object_List_NewObject_API();
}
