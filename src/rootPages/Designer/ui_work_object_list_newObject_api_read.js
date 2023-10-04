import UI_Class from "./ui_class";
import FieldTypeTool from "../../utils/FieldTypeTool";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Object_List_NewObject_API_Read extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_api_read", {
            // component: base,

            requestPanel: "",
            requestForm: "",
            pagingType: "",
            pagingStart: "",
            pagingLimit: "",
            pagingTotal: "",
            responsePanel: "",
            responseForm: "",
            headers: "",
            dataKey: "",
            fields: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "accordion",
            type: "clean",
            multi: false,
            on: {
               onAfterExpand: (viewId) => {
                  if (this.ids.responsePanel == viewId) {
                     this._refreshResponse();
                  }
               },
            },
            rows: [
               {
                  id: this.ids.requestPanel,
                  header: L("Request"),
                  body: {
                     id: this.ids.requestForm,
                     view: "form",
                     autoheight: false,
                     elements: [
                        {
                           label: L("Verb"),
                           name: "verb",
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
                           on: {
                              onChange: () => {
                                 delete this._data;
                              },
                           },
                        },
                        {
                           view: "fieldset",
                           label: L("Paging"),
                           body: {
                              view: "layout",
                              rows: [
                                 {
                                    id: this.ids.pagingType,
                                    view: "richselect",
                                    label: "Type: ",
                                    value: "QueryString",
                                    options: [
                                       {
                                          id: "QueryString",
                                          value: L("Query String"),
                                       },
                                       { id: "Header", value: L("Headers") },
                                    ],
                                 },
                                 {
                                    id: this.ids.pagingStart,
                                    view: "text",
                                    label: L("Start"),
                                    placeholder: L(
                                       "Property name of the API for start index"
                                    ),
                                 },
                                 {
                                    id: this.ids.pagingLimit,
                                    view: "text",
                                    label: L("Limit"),
                                    placeholder: L(
                                       "Property name of the API for limit return the item number"
                                    ),
                                 },
                                 {
                                    id: this.ids.pagingTotal,
                                    view: "text",
                                    label: L("Total"),
                                    placeholder: L(
                                       "Property name of the API that returns the total value"
                                    ),
                                 },
                              ],
                           },
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
                  id: this.ids.responsePanel,
                  header: L("Response"),
                  collapsed: true,
                  body: {
                     id: this.ids.responseForm,
                     view: "form",
                     autoheight: false,
                     rows: [
                        {
                           id: this.ids.dataKey,
                           view: "text",
                           label: L("Data Key"),
                           placeholder: "data.example",
                           bottomLabel: L(
                              "* JSON key containing the relevant data from the resonse object. Can be left blank to use the root level data."
                           ),
                           suggest: [],
                           on: {
                              onChange: () => {
                                 this._guessFields();
                              },
                           },
                        },
                        {
                           cols: [
                              {
                                 label: L("Fields"),
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

      init(AB) {
         const $requestForm = $$(this.ids.requestForm);
         const $responseForm = $$(this.ids.responseForm);

         AB.Webix.extend($requestForm, webix.ProgressBar);
         AB.Webix.extend($responseForm, webix.ProgressBar);
      }

      getValues() {
         const $requestForm = $$(this.ids.requestForm);
         const values = {
            request: $requestForm.getValues(),
            response: {
               dataKey: $$(this.ids.dataKey).getValue(),
            },
         };
         values.request = values.request ?? {};
         values.response = values.response ?? {};

         // Request's pagings
         values.request.paging = values.request.paging ?? {};
         values.request.paging.type = $$(this.ids.pagingType).getValue();
         values.request.paging.start = $$(this.ids.pagingStart).getValue();
         values.request.paging.limit = $$(this.ids.pagingLimit).getValue();
         values.request.paging.total = $$(this.ids.pagingTotal).getValue();

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
         const $requestForm = $$(this.ids.requestForm);
         const $responseForm = $$(this.ids.responseForm);
         return $requestForm.validate() && $responseForm.validate();
      }

      busy() {
         const $requestForm = $$(this.ids.requestForm);
         const $responseForm = $$(this.ids.responseForm);

         $requestForm.showProgress({ type: "icon" });
         $responseForm.showProgress({ type: "icon" });
      }

      ready() {
         const $requestForm = $$(this.ids.requestForm);
         const $responseForm = $$(this.ids.responseForm);

         $requestForm.hideProgress();
         $responseForm.hideProgress();
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

      _addFieldItem(key, type) {
         const uiItem = this._fieldItem(key, type);
         $$(this.ids.fields).addView(uiItem);
      }

      _clearFieldItems() {
         const $fields = $$(this.ids.fields);
         AB.Webix.ui([], $fields);
      }

      async _refreshResponse() {
         const values = this.getValues();
         if (!values.request.url || this._data) return;

         // loading cursor
         this.busy();

         const mock_object = AB.objectNew({
            isAPI: true,
            request: values.request,
         });
         const model = mock_object.model();

         const data = await model.findAll();

         // save this
         this._data = data?.data;

         // Populate suggest data key list
         this._populateDataKeys();

         this._guessFields();

         // hide loading cursor
         this.ready();
      }

      _populateDataKeys() {
         const $textDataKey = $$(this.ids.dataKey);
         const $suggestDataKey = $$($textDataKey.config.suggest);
         const $suggestList = $suggestDataKey.getList();
         $suggestList.clearAll();

         if (!this._data) {
            return;
         }

         const dataKeys = [];
         const findArrayValue = (obj, returnKey) => {
            Object.keys(obj ?? {}).forEach((key) => {
               const newReturnKey = returnKey.length
                  ? `${returnKey}.${key}`
                  : key;

               // array
               if (Array.isArray(obj[key])) {
                  dataKeys.push(newReturnKey);
               }
               // object
               else if (typeof obj[key] === "object") {
                  findArrayValue(obj[key], newReturnKey);
               }
            });
         };
         findArrayValue(this._data, "");

         $suggestList.parse(dataKeys);
      }

      _guessFields() {
         // Clear UI
         this._clearFieldItems();

         if (!this._data) return;

         // Create a new Mock Object
         const values = this.getValues();
         const mock_object = AB.objectNew(
            Object.assign({ isAPI: true }, values)
         );

         // Pull data from key
         let data = mock_object.dataFromKey(this._data);
         if (data == null) return;

         if (Array.isArray(data)) data = data[0];

         // Add UI field item
         Object.keys(data).forEach((key) => {
            if (typeof data[key] == "object" || Array.isArray(data[key]))
               return;

            const fieldType = FieldTypeTool.getFieldType(data[key]);
            this._addFieldItem(key, fieldType);
         });
      }
   }

   return new UI_Work_Object_List_NewObject_API_Read();
}
