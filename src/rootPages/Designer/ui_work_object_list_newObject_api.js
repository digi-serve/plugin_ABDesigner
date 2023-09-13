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
                           value: "1",
                           disabled: true,
                        },
                     ],
                  },
                  {
                     view: "tabview",
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
         const $saveButton = $$(this.ids.buttonSave);
         $saveButton.disable();

         const Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate() || !this.API_Read.validate()) {
            $saveButton.enable();
            return false;
         }

         let values = Form.getValues();
         const apiRead = this.API_Read.getValues();

         values = Object.assign(values, apiRead);

         // Add fields
         const addFieldTasks = [];
         const object = AB.objectNew(values);
         (values.response?.fields ?? []).forEach((f) => {
            const field = AB.fieldNew(
               {
                  name: f.columnName,
                  label: f.columnName,
                  columnName: f.columnName,
                  key: f.type,
               },
               object
            );
            addFieldTasks.push(field.save());
         });

         values.fieldIDs = [];
         (await Promise.all(addFieldTasks)).forEach((f) => {
            values.fieldIDs.push(f.id);
            values.id = object.id;
         });

         this.emit("save", object.toObj());
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component)?.show();
      }
   }
   return new UI_Work_Object_List_NewObject_API();
}
