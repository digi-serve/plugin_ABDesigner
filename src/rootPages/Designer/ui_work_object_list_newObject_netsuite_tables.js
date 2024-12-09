/*
 * ui_work_object_list_newObject_netsuite_tables
 *
 * Display the tab/form for selecting which of the available tables we are
 * working with.
 */
import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Object_List_NewObject_Netsuite_Tables extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_netsuite_tables", {
            // component: base,

            form: "",

            searchText: "",
            tableList: "",
            // fieldSelector: "",
            fields: "",
            buttonVerify: "",
            buttonLookup: "",
         });

         this.credentials = {};
         // {  CRED_KEY : CRED_VAL }
         // The entered credential references necessary to perform our Netsuite
         // operations.

         this.lastSelectedTable = null;
         // {string}
         // the table name of the last selected table.
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Tables"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 800,
               height: 700,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateObjectName
               },
               elements: [
                  {
                     cols: [
                        // The Table Selector Column
                        {
                           rows: [
                              {
                                 cols: [
                                    {
                                       view: "label",
                                       align: "left",
                                       label: L(
                                          "Use the provided credentials to request a list of tables to work with."
                                       ),
                                    },
                                    {
                                       view: "button",
                                       id: this.ids.buttonLookup,
                                       value: L("Load Catalog"),
                                       // css: "ab-cancel-button",
                                       autowidth: true,
                                       click: () => {
                                          this.loadCatalog();
                                       },
                                    },
                                 ],
                              },
                              {
                                 id: this.ids.searchText,
                                 view: "search",
                                 icon: "fa fa-search",
                                 label: L("Search"),
                                 labelWidth: 80,
                                 placeholder: L("tablename"),
                                 height: 35,
                                 keyPressTimeout: 100,
                                 on: {
                                    onAfterRender() {
                                       AB.ClassUI.CYPRESS_REF(this);
                                    },
                                    onTimedKeyPress: () => {
                                       let searchText = $$(this.ids.searchText)
                                          .getValue()
                                          .toLowerCase();

                                       this.$list.filter(function (item) {
                                          return (
                                             !item.value ||
                                             item.value
                                                .toLowerCase()
                                                .indexOf(searchText) > -1
                                          );
                                       });
                                    },
                                 },
                              },
                              {
                                 id: this.ids.tableList,
                                 view: "list",
                                 select: 1,
                                 height: 400,
                                 on: {
                                    onItemClick: (id, e) => {
                                       if (id != this.lastSelectedTable) {
                                          this.lastSelectedTable = id;
                                          this.emit("table.selected", id);
                                       }
                                    },
                                 },
                              },
                           ],
                        },

                        // Select Table indicator
                        {
                           rows: [
                              {},
                              {
                                 view: "label",
                                 align: "center",
                                 height: 200,
                                 label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-database'></div>",
                              },
                              {
                                 view: "label",
                                 align: "center",
                                 label: L("Select an table to work with."),
                              },
                              {},
                           ],
                        },
                     ],
                  },
                  // {
                  //    cols: [
                  //       { fillspace: true },
                  //       // {
                  //       //    view: "button",
                  //       //    id: this.ids.buttonCancel,
                  //       //    value: L("Cancel"),
                  //       //    css: "ab-cancel-button",
                  //       //    autowidth: true,
                  //       //    click: () => {
                  //       //       this.cancel();
                  //       //    },
                  //       // },
                  //       {
                  //          view: "button",
                  //          id: this.ids.buttonVerify,
                  //          css: "webix_primary",
                  //          value: L("Verify"),
                  //          autowidth: true,
                  //          type: "form",
                  //          click: () => {
                  //             return this.verify();
                  //          },
                  //       },
                  //    ],
                  // },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         this.$list = $$(this.ids.tableList);
         // this.$fieldSelector = $$(this.ids.fieldSelector);
         AB.Webix.extend(this.$form, webix.ProgressBar);
         AB.Webix.extend(this.$list, webix.ProgressBar);
         // AB.Webix.extend(this.$fieldSelector, webix.ProgressBar);

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

         $$(this.ids.searchText).setValue("");
         this.$list.filter(() => true);
         this.lastSelectedTable = null;
      }
      getValues() {
         return this.lastSelectedTable;
      }

      async loadCatalog() {
         this.busy();
         let result = await this.AB.Network.get({
            url: "/netsuite/metadata",
            params: { credentials: JSON.stringify(this.credentials) },
         });

         let data = [];
         result.forEach((r) => {
            data.push({ id: r, value: r });
         });
         let $table = $$(this.ids.tableList);
         $table.clearAll();
         $table.parse(data);

         // console.error(data);
         this.emit("tables", data);
      }

      _fieldItem(def) {
         const self = this;
         const fieldTypes = this.AB.Class.ABFieldManager.allFields();
         const fieldKeys = ["string", "LongText", "number", "date", "boolean"];

         let key = def.column || def.title;
         let type = def.type;

         return {
            cols: [
               {
                  view: "text",
                  value: key,
                  placeholder: "key",
               },
               {
                  placeholder: "Type",
                  options: fieldKeys.map((fKey) => {
                     return {
                        id: fKey,
                        value: fieldTypes
                           .filter((f) => f.defaults().key == fKey)[0]
                           ?.defaults().menuName,
                     };
                  }),
                  view: "select",
                  value: type,
               },
               {
                  icon: "wxi-trash",
                  view: "icon",
                  width: 38,
                  click: function () {
                     const $item = this.getParentView();
                     $$(self.ids.fields).removeView($item);
                  },
               },
            ],
         };
      }

      async loadFields(table) {
         // $$(this.ids.fieldSelector).show();
         this.busyFields();

         let result = await this.AB.Network.get({
            url: `/netsuite/table/${table}`,
            params: { credentials: JSON.stringify(this.credentials) },
         });

         this.fieldList = result;
         (result || []).forEach((f) => {
            const uiItem = this._fieldItem(f);
            $$(this.ids.fields).addView(uiItem);
         });
         this.readyFields();
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
         const $list = $$(this.ids.tableList);
         // const $verifyButton = $$(this.ids.buttonVerify);

         $list.showProgress({ type: "icon" });
         // $verifyButton.disable();
      }

      // busyFields() {
      //    this.$fieldSelector.showProgress({ type: "icon" });
      // }

      ready() {
         const $form = $$(this.ids.form);
         // const $verifyButton = $$(this.ids.buttonVerify);

         $form.hideProgress();
         // $verifyButton.enable();
      }

      // readyFields() {
      //    this.$fieldSelector.hideProgress();
      // }

      setCredentials(creds) {
         this.credentials = creds;
      }
   }
   return new UI_Work_Object_List_NewObject_Netsuite_Tables();
}
