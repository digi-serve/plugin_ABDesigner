/*
 * ui_work_object_list_newObject_netsuite_connections
 *
 * Display the tab/form for selecting which of the available conections we
 * want to create for this table.
 */
import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();
   const uiConfig = AB.Config.uiSettings();

   class UI_Work_Object_List_NewObject_Netsuite_Connections extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_netsuite_connections", {
            // component: base,

            form: "",

            // fieldSelector: "",
            connections: "",
            displayConnections: "",
            displayNoConnections: "",

            fieldGrid: "",
            buttonVerify: "",
            buttonLookup: "",
            tableName: "",
         });

         this.credentials = {};
         // {  CRED_KEY : CRED_VAL }
         // The entered credential references necessary to perform our Netsuite
         // operations.

         this.connectionList = null;
         // {array}
         // Holds an array of connection descriptions

         this.connections = null;
         // {array}
         // Holds the array of chosen/verified connections
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Connections"),
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
                  {
                     view: "layout",
                     padding: 10,
                     rows: [
                        {
                           id: this.ids.tableName,
                           label: L("Selected Table: {0}", [this.table]),
                           view: "label",
                           height: 40,
                        },
                     ],
                  },

                  // Field Selector
                  {
                     view: "multiview",
                     animate: false,
                     borderless: true,
                     rows: [
                        {
                           id: this.ids.displayNoConnections,
                           rows: [
                              {
                                 maxHeight: uiConfig.xxxLargeSpacer,
                                 hidden: uiConfig.hideMobile,
                              },
                              {
                                 view: "label",
                                 align: "center",
                                 height: 200,
                                 label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-exclamation-triangle'></div>",
                              },
                              {
                                 // id: ids.error_msg,
                                 view: "label",
                                 align: "center",
                                 label: L(
                                    "You have no other Netwuite Objects imported"
                                 ),
                              },
                              {
                                 // id: ids.error_msg,
                                 view: "label",
                                 align: "center",
                                 label: L(
                                    "Continue creating this object now, then create the connections on the other objects you import."
                                 ),
                              },
                              {
                                 maxHeight: uiConfig.xxxLargeSpacer,
                                 hidden: uiConfig.hideMobile,
                              },
                           ],
                        },
                        {
                           id: this.ids.displayConnections,
                           rows: [
                              {
                                 // id: ids.tabFields,
                                 view: "layout",
                                 padding: 10,
                                 rows: [
                                    {
                                       cols: [
                                          {
                                             label: L("Connections"),
                                             view: "label",
                                          },
                                          {
                                             icon: "wxi-plus",
                                             view: "icon",
                                             width: 38,
                                             click: () => {
                                                this._addConnection();
                                             },
                                          },
                                       ],
                                    },
                                    {
                                       view: "scrollview",
                                       scroll: "y",
                                       borderless: true,
                                       padding: 0,
                                       margin: 0,
                                       body: {
                                          id: this.ids.connections,
                                          view: "layout",
                                          padding: 0,
                                          margin: 0,
                                          rows: [],
                                       },
                                    },
                                 ],
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
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);

         AB.Webix.extend(this.$form, webix.ProgressBar);

         // this.$fieldSelector = $$(this.ids.fieldSelector);
         // if (this.$fieldSelector)
         //    AB.Webix.extend(this.$fieldSelector, webix.ProgressBar);

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
         this.disable();
      }

      getValues() {
         return []; // TODO:
      }

      setTable(table) {
         this.table = table;
         $$(this.ids.tableName).setValue(
            `<span style="font-size: 1.5em; font-weight:bold">${this.table}</span>`
         );
      }

      loadConnections(allConnections) {
         this.connectionList = allConnections;
         // refresh more often than on init();
         this.listNetsuiteObjects = this.AB.objects((o) => o.isNetsuite);
         if (this.listNetsuiteObjects.length == 0) {
            $$(this.ids.displayNoConnections)?.show();
         } else {
            $$(this.ids.displayConnections)?.show();
         }
      }

      _fieldItem(key, type) {
         const self = this;
         const fieldTypes = this.AB.Class.ABFieldManager.allFields();
         const fieldKeys = ["string", "LongText", "number", "date", "boolean"];

         const linkTypes = ["one:one", "one:many", "many:one", "many:many"];

         // For the Base Object, let's include all fields that are clearly
         // objects.
         let fieldOptions = this.connectionList.map((conn) => {
            return {
               id: conn.column,
               value: conn.column,
            };
         });
         // we also need to include "_this_object_" reference so that
         // we can make many:xxx connections (we don't store the value, the
         // other object does)
         fieldOptions.unshift({
            id: "_this_object_",
            value: L("This Object"),
         });

         return {
            view: "form",
            elements: [
               {
                  cols: [
                     {
                        rows: [
                           {
                              label: L("Field"),
                              view: "label",
                           },
                           {
                              placeholder: "Type",
                              options: fieldOptions,
                              view: "select",
                              // value: type,
                              name: "thisField",
                           },
                        ],
                     },
                     {
                        rows: [
                           {
                              placeholder: L("Existing Netsuite Object"),
                              options: this.listNetsuiteObjects.map((nObj) => {
                                 return {
                                    id: nObj.id,
                                    value: nObj.label,
                                 };
                              }),
                              view: "select",
                              name: "thatObject",
                              // value: type,
                              on: {
                                 onChange: async function (
                                    newVal,
                                    oldVal,
                                    config
                                 ) {
                                    let connObj = self.AB.objectByID(newVal);
                                    if (connObj) {
                                       let result = await self.AB.Network.get({
                                          url: `/netsuite/table/${connObj.tableName}`,
                                          params: {
                                             credentials: JSON.stringify(
                                                self.credentials
                                             ),
                                          },
                                       });
                                       let fields = result.filter(
                                          (r) => r.type == "object"
                                       );
                                       let options = fields.map((f) => {
                                          return {
                                             id: f.column,
                                             value: f.column,
                                          };
                                       });

                                       // include a "_that_object_" incase this is a one:xxx
                                       // connection.
                                       options.unshift({
                                          id: "_that_object_",
                                          value: L("That Object"),
                                       });
                                       let $linkColumn =
                                          this.getParentView().getChildViews()[1];

                                       $linkColumn.define("options", options);
                                       $linkColumn.refresh();
                                    }
                                 },
                              },
                           },
                           {
                              placeholder: "Link Column",
                              options: [],
                              view: "select",
                              // value: type,
                              name: "thatObjectField",
                           },
                           {
                              placeholder: "Link Type",
                              options: linkTypes.map((l) => {
                                 return {
                                    id: l,
                                    value: l,
                                 };
                              }),
                              view: "select",
                              name: "linkType",
                              // value: type,
                           },
                        ],
                     },

                     {
                        icon: "wxi-trash",
                        view: "icon",
                        width: 38,
                        click: function () {
                           const $item = this.getParentView().getParentView();
                           $$(self.ids.connections).removeView($item);
                        },
                     },
                  ],
               },
            ],
         };
      }

      _addConnection(key, type) {
         const uiItem = this._fieldItem(key, type);
         $$(this.ids.connections).addView(uiItem);
      }

      _clearFieldItems() {
         const $connections = $$(this.ids.connections);
         AB.Webix.ui([], $connections);
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

         // this.$fieldSelector.showProgress({ type: "icon" });
         $verifyButton.disable();
      }

      ready() {
         const $verifyButton = $$(this.ids.buttonVerify);

         // this.$fieldSelector.hideProgress();
         $verifyButton.enable();
      }

      setCredentials(creds) {
         this.credentials = creds;
      }

      getValues() {
         let values = [];
         $$(this.ids.connections)
            .getChildViews()
            .forEach(($row) => {
               values.push($row.getValues());
            });
         return values;
      }

      // verify() {
      //    this.emit("fields.ready", {
      //       credentials: this.credentials,
      //       table: this.table,
      //       fieldList: this.fieldList,
      //    });
      // }
   }
   return new UI_Work_Object_List_NewObject_Netsuite_Connections();
}
