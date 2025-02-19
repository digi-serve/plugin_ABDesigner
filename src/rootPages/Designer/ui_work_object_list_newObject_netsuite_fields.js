/*
 * ui_work_object_list_newObject_netsuite_fields
 *
 * Display the tab/form for selecting which of the available tables we are
 * working with.
 */
import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Object_List_NewObject_Netsuite_Fields extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_netsuite_fields", {
            // component: base,

            form: "",

            tableName: "",
            // tableList: "",
            fieldSelector: "",
            // fields: "",
            fieldGrid: "",
            buttonVerify: "",
            // buttonLookup: "",
         });

         this.credentials = {};
         // {  CRED_KEY : CRED_VAL }
         // The entered credential references necessary to perform our Netsuite
         // operations.

         this.fieldKeys = [
            "string",
            "LongText",
            "number",
            "date",
            "datetime",
            "boolean",
            "json",
            "list",
            // "connectObject",
         ];
         // {array} of types of ABFields we can translate into.

         this.fieldList = null;
         // {array}
         // Holds an array of field descriptions

         this.fields = null;
         // {array}
         // Holds the array of chosen/verified fields
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Fields"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 800,
               height: 450,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateObjectName
               },
               elements: [
                  // Field Selector
                  {
                     id: this.ids.fieldSelector,
                     view: "layout",
                     padding: 10,
                     rows: [
                        {
                           rows: [
                              {
                                 id: this.ids.tableName,
                                 label: L("Selected Table: {0}", [this.table]),
                                 view: "label",
                                 height: 40,
                              },
                              {},
                           ],
                        },
                        // {
                        //    view: "scrollview",
                        //    scroll: "y",
                        //    borderless: true,
                        //    padding: 0,
                        //    margin: 0,
                        //    body: {
                        //       id: this.ids.fields,
                        //       view: "layout",
                        //       padding: 0,
                        //       margin: 0,
                        //       rows: [],
                        //    },
                        // },
                        {
                           id: this.ids.fieldGrid,
                           view: "datatable",
                           resizeColumn: true,
                           height: 300,
                           columns: [
                              {
                                 id: "title",
                                 header: L("title"),
                                 editor: "text",
                              },
                              { id: "column", header: L("column") },

                              { id: "nullable", header: L("nullable") },
                              { id: "readOnly", header: L("read only") },
                              {
                                 id: "default",
                                 header: L("Default Value"),
                                 editor: "text",
                              },
                              {
                                 id: "pk",
                                 header: L("is primary key"),
                                 template: "{common.radio()}",
                              },
                              {
                                 id: "created_at",
                                 header: L("Created At"),
                                 template: "{common.radio()}",
                              },
                              {
                                 id: "updated_at",
                                 header: L("Updated At"),
                                 template: "{common.radio()}",
                              },
                              // {
                              //    id: "description",
                              //    header: L("description"),
                              //    fillspace: true,
                              // },
                              {
                                 id: "abType",
                                 header: L("AB Field Type"),
                                 editor: "select",
                                 options: [" "].concat(this.fieldKeys),
                                 on: {
                                    onChange: (newValue, oldValue) => {
                                       debugger;
                                    },
                                 },
                              },
                              {
                                 id: "delme",
                                 header: "",
                                 template: "{common.trashIcon()}",
                              },
                           ],
                           editable: true,
                           scroll: "xy",
                           onClick: {
                              "wxi-trash": (e, id) => {
                                 $$(this.ids.fieldGrid).remove(id);
                                 this.fields = this.fields.filter(
                                    (f) => f.id != id.row
                                 );
                              },
                           },
                        },
                        {
                           cols: [
                              { fillspace: true },
                              // {
                              //    view: "button",
                              //    id: this.ids.buttonCancel,
                              //    value: L("Cancel"),
                              //    css: "ab-cancel-button",
                              //    autowidth: true,
                              //    click: () => {
                              //       this.cancel();
                              //    },
                              // },
                              {
                                 view: "button",
                                 id: this.ids.buttonVerify,
                                 css: "webix_primary",
                                 value: L("Verify"),
                                 autowidth: true,
                                 type: "form",
                                 click: () => {
                                    return this.verify();
                                 },
                              },
                           ],
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

         this.$fieldSelector = $$(this.ids.fieldSelector);
         AB.Webix.extend(this.$form, webix.ProgressBar);
         AB.Webix.extend(this.$fieldSelector, webix.ProgressBar);

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      disable() {
         $$(this.ids.form).disable();
      }

      enable() {
         $$(this.ids.form).enable();
      }

      formClear() {
         this.$form.clearValidation();
         this.$form.clear();

         $$(this.ids.fieldGrid)?.clearAll();
         this.disable();
         $$(this.ids.buttonVerify).disable();
      }

      addABType(f) {
         switch (f.type) {
            case "array":
               // this is most likely a MANY:x connection.
               // Q:what do we default this to?
               f.abType = "json";
               break;

            case "object":
               // this is most likely a ONE:X[ONE,MANY] connection.
               // // lets scan the properties of the dest obj,
               // // find a property with title = "Internal Identifier"
               // // and make this ABType == that property.type

               // if (f.properties) {
               //    Object.keys(f.properties).forEach((k) => {
               //       if (f.properties[k].title == "Internal Identifier") {
               //          f.abType = f.properties[k].type;
               //       }
               //    });
               // }
               // // default to "string" if an Internal Identifier isn't found.
               // if (!f.abType) {
               //    f.abType = "string";
               // }
               f.abType = "connectObject";
               break;

            case "boolean":
               f.abType = "boolean";
               break;

            default:
               f.abType = "string";
         }

         // just in case:
         // lets see if this looks like a date field instead

         if (f.abType == "string") {
            let lcTitle = f.title?.toLowerCase();
            if (lcTitle) {
               let indxDate = lcTitle.indexOf("date") > -1;
               let indxDay = lcTitle.indexOf("day") > -1;
               if (indxDate || indxDay) {
                  f.abType = "date";
               }
            }

            if (f.format == "date-time") {
               f.abType = "datetime";
            }
         }

         // Seems like the PKs have title == "Internal ID"
         if (f.title == "Internal ID") {
            f.pk = true;
         }
      }

      getValues() {
         return this.fields;
      }

      setTableName() {
         $$(this.ids.tableName).setValue(
            `<span style="font-size: 1.5em; font-weight:bold">${this.table}</span>`
         );
      }
      async loadFields(table) {
         $$(this.ids.fieldGrid)?.clearAll();
         this.table = table;
         $$(this.ids.fieldSelector).show();
         this.busy();
         this.setTableName();

         let result = await this.AB.Network.get({
            url: `/netsuite/table/${table}`,
            params: { credentials: JSON.stringify(this.credentials) },
         });

         this.fieldList = result;
         (result || []).forEach((f) => {
            this.addABType(f);
         });

         // ok, in this pane, we are just looking at the base fields
         // leave the connections to the next pane:
         this.fields = result.filter((r) => r.type != "object");

         // let our other pane know about it's connections
         this.emit(
            "connections",
            result.filter((r) => r.type == "object")
         );

         $$(this.ids.fieldGrid).parse(this.fields);
         this.ready();
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
         $$(this.ids.buttonVerify).enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_object_list_newObject successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         $$(this.ids.buttonVerify).enable();
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
         const $verifyButton = $$(this.ids.buttonVerify);

         this.$fieldSelector.showProgress({ type: "icon" });
         $verifyButton.disable();
      }

      ready() {
         const $verifyButton = $$(this.ids.buttonVerify);

         this.$fieldSelector.hideProgress();
         $verifyButton.enable();
      }

      setCredentials(creds) {
         this.credentials = creds;
      }

      verify() {
         this.emit("fields.ready", {
            credentials: this.credentials,
            table: this.table,
            fieldList: this.fields,
         });
      }
   }
   return new UI_Work_Object_List_NewObject_Netsuite_Fields();
}
