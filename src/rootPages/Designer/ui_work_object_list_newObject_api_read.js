import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Object_List_NewObject_API_Read extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_api_read", {
            // component: base,

            form: "",
            headers: "",
            fields: "",
            buttonSave: "",
            buttonCancel: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "accordion",
            type: "clean",
            multi: false,
            rows: [
               {
                  header: L("Request"),
                  body: {
                     id: this.ids.form,
                     view: "form",
                     autoheight: false,
                     rows: [
                        {
                           label: "Verb",
                           options: ["GET"],
                           view: "select",
                           disabled: true,
                        },
                        {
                           view: "text",
                           label: L("URI"),
                           name: "url",
                           placeholder: "https://example.com",
                           type: "url",
                           required: true,
                        },
                        {
                           padding: 0,
                           cols: [
                              {
                                 label: L("Headers"),
                                 view: "label",
                                 padding: 0,
                                 height: 0,
                              },
                              {
                                 icon: "wxi-plus",
                                 view: "icon",
                                 padding: 0,
                                 width: 38,
                                 click: () => {
                                    this._addHeaderItem();
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
                              id: this.ids.headers,
                              view: "layout",
                              padding: 0,
                              margin: 0,
                              rows: [],
                           },
                        },
                     ],
                  },
               },
               {
                  header: L("Response"),
                  collapsed: true,
                  body: {
                     view: "form",
                     autoheight: false,
                     rows: [
                        {
                           view: "text",
                           label: "Data Key",
                           value: "data.accounts",
                           bottomLabel:
                              "* JSON key containing the relevant data from the resonse object. Can be left blank to use the root level data.",
                        },
                        {
                           cols: [
                              {
                                 label: "Fields",
                                 view: "label",
                              },
                              {
                                 icon: "wxi-plus",
                                 view: "icon",
                                 width: 38,
                                 click: () => {
                                    this._addFieldItem();
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
                              id: this.ids.fields,
                              view: "layout",
                              padding: 0,
                              margin: 0,
                              rows: [],
                           },
                        },
                     ],
                  },
               },
            ],
         };
      }

      getValues() {
         const $form = $$(this.ids.form);
         const values = $form.getValues();
         values.request = values.request ?? {};
         values.response = values.response ?? {};

         // Request's headers
         const $headers = $$(this.ids.headers);
         values.request.headers = values.request.headers ?? [];
         $headers?.getChildViews().forEach((headerItem) => {
            const $name = headerItem.getChildViews()[0];
            const $value = headerItem.getChildViews()[1];
            values.request.headers.push({
               key: $name.getValue(),
               value: $value.getValue(),
            });
         });
         values.request.headers = values.request.headers.filter(
            (header) => header.key != null && header.value != null
         );

         // Response's fields
         const $fields = $$(this.ids.fields);
         values.response.fields = values.response.fields ?? [];
         $fields?.getChildViews().forEach((fieldItem) => {
            const $name = fieldItem.getChildViews()[0];
            const $value = fieldItem.getChildViews()[1];
            values.response.fields.push({
               columnName: $name.getValue(),
               type: $value.getValue(),
            });
         });
         values.response.fields = values.response.fields.filter(
            (header) => header.columnName != null && header.type != null
         );

         return values;
      }

      validate() {
         const $form = $$(this.ids.form);
         return $form.validate();
      }

      _headerItem(header, value) {
         const self = this;
         return {
            cols: [
               {
                  placeholder: "key",
                  view: "text",
                  value: header,
               },

               {
                  placeholder: "value",
                  view: "text",
                  value: value,
               },
               {
                  icon: "wxi-trash",
                  view: "icon",
                  width: 38,
                  click: function () {
                     const $item = this.getParentView();
                     $$(self.ids.headers).removeView($item);
                  },
               },
            ],
         };
      }

      _addHeaderItem() {
         const uiItem = this._headerItem();
         $$(this.ids.headers).addView(uiItem);
      }

      _fieldItem(key, type) {
         const self = this;
         const fieldTypes = this.AB.Class.ABFieldManager.allFields();
         const fieldKeys = ["string", "LongText", "number", "date", "boolean"];

         return {
            cols: [
               {
                  placeholder: "key",
                  view: "text",
                  value: key,
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

      _addFieldItem() {
         const uiItem = this._fieldItem();
         $$(this.ids.fields).addView(uiItem);
      }
   }

   return new UI_Work_Object_List_NewObject_API_Read();
}
