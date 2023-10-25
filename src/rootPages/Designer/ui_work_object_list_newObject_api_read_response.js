import UI_Class from "./ui_class";
import FieldTypeTool from "../../utils/FieldTypeTool";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Object_List_NewObject_API_Read_Response extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_api_read_response", {
            responsePanel: "",
            responseForm: "",

            tabBasic: "",
            tabFields: "",

            headers: "",
            dataKey: "",
            fields: "",
         });
      }

      ui() {
         const ids = this.ids;
         //  const uiSettings = AB.UISettings.config();

         // Our webix UI definition:
         return {
            id: ids.responsePanel,
            header: L("Response"),
            collapsed: true,
            body: {
               id: ids.responseForm,
               view: "form",
               autoheight: false,
               padding: 0,
               elements: [
                  {
                     view: "layout",
                     borderless: true,
                     margin: 0,
                     cols: [
                        {
                           view: "sidebar",
                           data: [
                              {
                                 id: ids.tabBasic,
                                 value: L("Basic"),
                              },
                              {
                                 id: ids.tabFields,
                                 value: L("Fields"),
                              },
                           ],
                           width: 120,
                           select: true,
                           scroll: false,
                           on: {
                              onAfterSelect: function (id) {
                                 AB.Webix.$$(id).show();
                              },
                           },
                           ready: function () {
                              this.select(this.getFirstId());
                           },
                        },
                        {
                           view: "multiview",
                           animate: false,
                           cells: [
                              {
                                 id: ids.tabBasic,
                                 view: "layout",
                                 padding: 10,
                                 rows: [
                                    {
                                       id: ids.dataKey,
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
                                       fillspace: true,
                                    },
                                 ],
                              },
                              {
                                 id: ids.tabFields,
                                 view: "layout",
                                 padding: 10,
                                 rows: [
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
                                          id: ids.fields,
                                          view: "layout",
                                          padding: 0,
                                          margin: 0,
                                          rows: [],
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

      init(AB, data) {
         const ids = this.ids;
         const $responseForm = $$(ids.responseForm);

         AB.Webix.extend($responseForm, webix.ProgressBar);

         this._data = data;
      }

      getValues() {
         const ids = this.ids;
         const values = {
            dataKey: $$(ids.dataKey).getValue(),
         };

         // Response's fields
         const $fields = $$(ids.fields);
         values.fields = [];
         $fields?.getChildViews().forEach((fieldItem) => {
            const $name = fieldItem.getChildViews()[0];
            const $value = fieldItem.getChildViews()[1];
            values.fields.push({
               columnName: $name.getValue(),
               type: $value.getValue(),
            });
         });
         values.fields = values.fields.filter(
            (header) => header.columnName != null && header.type != null
         );

         return values;
      }

      validate() {
         return $$(this.ids.responseForm).validate();
      }

      busy() {
         $$(this.ids.responseForm).showProgress({ type: "icon" });
      }

      ready() {
         $$(this.ids.responseForm).hideProgress();
      }

      async refreshResponse(requestValues) {
         if (!requestValues?.url || this._data?.returnData) return;

         // loading cursor
         this.busy();

         const mock_object = AB.objectNew({
            id: AB.uuid(),
            isAPI: true,
            request: requestValues,
         });
         const model = mock_object.model();

         const data = await model.findAll();

         // Update return data to Request page
         this._data.returnData = data?.data;

         // Populate suggest data key list
         this._populateDataKeys();

         this._guessFields();

         // hide loading cursor
         this.ready();
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

      _populateDataKeys() {
         const $textDataKey = $$(this.ids.dataKey);
         const $suggestDataKey = $$($textDataKey.config.suggest);
         const $suggestList = $suggestDataKey.getList();
         $suggestList.clearAll();

         if (!this._data?.returnData) {
            return;
         }

         const dataKeys = [];
         const findArrayValue = (obj, returnKey) => {
            let item = obj;
            if (Array.isArray(obj) && obj[0]) item = obj[0];

            Object.keys(item ?? {}).forEach((key) => {
               const newReturnKey = returnKey.length
                  ? `${returnKey}.${key}`
                  : key;

               // array
               if (Array.isArray(item[key])) {
                  dataKeys.push(newReturnKey);
               }
               // object
               else if (typeof item[key] === "object") {
                  findArrayValue(item[key], newReturnKey);
               }
            });
         };
         findArrayValue(this._data?.returnData, "");

         $suggestList.parse(dataKeys);
      }

      _guessFields() {
         // Clear UI
         this._clearFieldItems();

         if (!this._data?.returnData) return;

         // Create a new Mock Object
         const values = this.getValues();
         const mock_object = AB.objectNew(
            Object.assign(
               { isAPI: true },
               {
                  response: values,
               }
            )
         );

         // Pull data from key
         let data = mock_object.dataFromKey(this._data?.returnData);
         if (data == null) return;

         while (data && Array.isArray(data)) {
            data = data[0];
         }

         // Add UI field item
         Object.keys(data).forEach((key) => {
            if (typeof data[key] == "object" || Array.isArray(data[key]))
               return;

            const fieldType = FieldTypeTool.getFieldType(data[key]);
            this._addFieldItem(key, fieldType);
         });
      }
   }

   return new UI_Work_Object_List_NewObject_API_Read_Response();
}
