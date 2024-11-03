/*
 * ui_work_object_list_newObject_netsuite
 *
 * Display the form for creating a new ABObject that connects to a Netsuite
 * instance.
 */
import UI_Class from "./ui_class";
import UI_Credentials from "./ui_work_object_list_newObject_netsuite_credentials";
import UI_Tables from "./ui_work_object_list_newObject_netsuite_tables";
import UI_Fields from "./ui_work_object_list_newObject_netsuite_fields";
import UI_Connections from "./ui_work_object_list_newObject_netsuite_connections";
import UI_FieldTest from "./ui_work_object_list_newObject_netsuite_dataTest";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Object_List_NewObject_Netsuite extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_netsuite", {
            // component: base,

            form: "",
            buttonSave: "",
            buttonCancel: "",
         });

         this.UI_Credentials = UI_Credentials(AB);
         this.UI_Tables = UI_Tables(AB);
         this.UI_Fields = UI_Fields(AB);
         this.UI_FieldTest = UI_FieldTest(AB);
         this.UI_Connections = UI_Connections(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Netsuite"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 820,
               height: 650,
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
                           value: 0,
                           // disabled: true,
                        },
                     ],
                  },
                  {
                     view: "tabview",
                     cells: [
                        this.UI_Credentials.ui(),
                        this.UI_Tables.ui(),
                        this.UI_Fields.ui(),
                        this.UI_Connections.ui(),
                        this.UI_FieldTest.ui(),
                     ],
                  },
                  { fillspace: true },
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
                           disabled: true,
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

         this.UI_Credentials.init(AB);
         this.UI_Tables.init(AB);
         this.UI_Fields.init(AB);
         this.UI_Connections.init(AB);
         this.UI_FieldTest.init(AB);

         this.UI_Credentials.show();
         this.UI_Tables.disable();
         this.UI_Fields.disable();
         this.UI_Connections.disable();
         this.UI_FieldTest.disable();

         // "verified" is triggered on the credentials tab once we verify
         // the entered data is successful.
         this.UI_Credentials.on("verified", () => {
            this.UI_Tables.enable();
            let creds = this.UI_Credentials.credentials();
            this.UI_Tables.setCredentials(creds);
            this.UI_Fields.setCredentials(creds);
            this.UI_FieldTest.setCredentials(creds);
            this.UI_Connections.setCredentials(creds);
            this.UI_Tables.show();
         });

         this.UI_Credentials.on("notverified", () => {
            this.UI_Tables.disable();
         });

         this.UI_Tables.on("tables", (tables) => {
            this.UI_Connections.setAllTables(tables);
         });

         this.UI_Tables.on("table.selected", (table) => {
            this.UI_Fields.enable();
            this.UI_Fields.loadFields(table);
            this.UI_Fields.show();

            this.UI_Connections.setTable(table);
            this.UI_FieldTest.setTable(table);
         });

         this.UI_Fields.on("connections", (list) => {
            this.UI_Connections.loadConnections(list);
            this.UI_Connections.enable();
         });

         this.UI_Fields.on("fields.ready", (config) => {
            this.UI_FieldTest.enable();
            this.UI_FieldTest.loadConfig(config);
         });

         this.UI_FieldTest.on("data.verfied", () => {
            $$(this.ids.buttonSave).enable();
         });

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

         this.UI_Credentials.formClear();
         this.UI_Tables.formClear();
         this.UI_Fields.formClear();
         this.UI_Connections.formClear();
         this.UI_FieldTest.formClear();

         $$(this.ids.buttonSave).disable();
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
         if (!Form.validate()) {
            this.ready();
            return false;
         }

         let values = Form.getValues();

         values.credentials = this.UI_Credentials.getValues();
         values.tableName = this.UI_Tables.getValues();

         let allFields = this.UI_Fields.getValues();

         // Pick out our special columns: pk, created_at, updated_at
         let pkField = allFields.find((f) => f.pk);
         if (!pkField) {
            webix.alert({
               title: L("Error creating Object: {0}", [values.name]),
               ok: L("fix it"),
               text: L("No primary key specified."),
               type: "alert-error",
            });
            return;
         }
         values.primaryColumnName = pkField.column;

         values.columnRef = { created_at: null, updated_at: null };

         ["created_at", "updated_at"].forEach((field) => {
            let foundField = allFields.find((f) => f[field]);
            if (foundField) {
               values.columnRef[field] = foundField.column;
            }
         });

         // Create a new Object
         const object = AB.objectNew(
            Object.assign({ isNetsuite: true }, values)
         );

         try {
            // Add fields

            for (const f of allFields) {
               let def = {
                  name: f.title,
                  label: f.title,
                  columnName: f.column,
                  key: f.abType,
               };
               if (f.default) {
                  def.settings = {};
                  def.settings.default = f.default;
               }
               const field = AB.fieldNew(def, object);
               await field.save(true);

               // values.fieldIDs.push(field.id);
            }
            // values.id = object.id;
         } catch (err) {
            console.error(err);
         }

         let allConnectFields = this.UI_Connections.getValues();
         for (var i = 0; i < allConnectFields.length; i++) {
            let f = allConnectFields[i];
            /* f = 
                {
                    "thisField": "_this_object_",
                    "thatObject": "b7c7cca2-b919-4a90-b199-650a7a4693c1",
                    "thatObjectField": "custrecord_whq_teams_strategy_strtgy_cod",
                    "linkType": "many:one"
                }
            */

            let linkObject = this.AB.objectByID(f.thatObject);
            if (!linkObject) continue;

            let linkType = f.linkType;
            let parts = linkType.split(":");
            let link = parts[0];
            let linkVia = parts[1];

            let thisField = {
               key: "connectObject",
               // columnName: f.thisField,
               label: linkObject.label,
               settings: {
                  showIcon: "1",

                  linkObject: linkObject.id,
                  linkType: link,
                  linkViaType: linkVia,
                  isCustomFK: 0,
                  indexField: "",
                  indexField2: "",
                  isSource: 0,
                  width: 100,
               },
            };

            let linkField = this.AB.cloneDeep(thisField);
            // linkField.columnName = f.thatObjectField;
            linkField.label = object.label || object.name;
            linkField.settings.linkObject = object.id;
            linkField.settings.linkType = linkVia;
            linkField.settings.linkViaType = link;

            switch (linkType) {
               case "one:one":
                  if (f.whichSource == "_this_") {
                     thisField.settings.isSource = 1;
                  } else {
                     linkField.settings.isSource = 1;
                  }
                  thisField.columnName = f.sourceField;
                  linkField.columnName = f.sourceField;
                  break;

               case "one:many":
               case "many:one":
                  thisField.columnName = f.thatField;
                  linkField.columnName = f.thatField;
                  break;

               case "many:many":
                  thisField.settings.joinTable = f.joinTable;
                  linkField.settings.joinTable = f.joinTable;

                  thisField.settings.joinTableReference = f.thisObjReference;
                  linkField.settings.joinTableReference = f.thatObjReference;

                  thisField.settings.joinTablePK = f.joinTablePK;
                  linkField.settings.joinTablePK = f.joinTablePK;
                  break;
            }

            // create an initial LinkColumn
            let fieldLink = linkObject.fieldNew(linkField);
            await fieldLink.save(true); // should get an .id now

            // make sure I can reference field => linkColumn
            thisField.settings.linkColumn = fieldLink.id;
            let field = object.fieldNew(thisField);
            await field.save();

            // now update reference linkColumn => field
            fieldLink.settings.linkColumn = field.id;
            await fieldLink.save();
         }

         this.emit("save", object.toObj());

         this.ready();
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
   return new UI_Work_Object_List_NewObject_Netsuite();
}
