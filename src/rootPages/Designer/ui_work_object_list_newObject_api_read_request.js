import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Object_List_NewObject_API_Read_Request extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_api_read_request", {
            requestPanel: "",
            requestForm: "",

            tabBasic: "",
            tabHeaders: "",
            tabPaging: "",

            pagingType: "",
            pagingStart: "",
            pagingLimit: "",
            pagingTotal: "",
            headers: "",
         });
      }

      ui() {
         const ids = this.ids;
         const uiSettings = AB.UISettings.config();

         // Our webix UI definition:
         return {
            id: ids.requestPanel,
            header: L("Request"),
            body: {
               id: ids.requestForm,
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
                                 id: ids.tabHeaders,
                                 value: L("Headers"),
                              },
                              {
                                 id: ids.tabPaging,
                                 value: L("Paging"),
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
                                             // Clear return data
                                             this._data.returnData = null;
                                          },
                                       },
                                    },
                                    {
                                       fillspace: true,
                                    },
                                 ],
                              },
                              {
                                 id: ids.tabHeaders,
                                 view: "layout",
                                 padding: 10,
                                 rows: [
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
                                          id: ids.headers,
                                          view: "layout",
                                          padding: 0,
                                          margin: 0,
                                          rows: [],
                                       },
                                    },
                                 ],
                              },
                              {
                                 id: ids.tabPaging,
                                 view: "layout",
                                 padding: 10,
                                 rows: [
                                    {
                                       id: ids.pagingType,
                                       view: "richselect",
                                       label: L("Type"),
                                       value: "QueryString",
                                       labelWidth: uiSettings.labelWidthMedium,
                                       options: [
                                          {
                                             id: "QueryString",
                                             value: L("Query String"),
                                          },
                                          { id: "Header", value: L("Headers") },
                                       ],
                                    },
                                    {
                                       id: ids.pagingStart,
                                       view: "text",
                                       label: L("Start"),
                                       labelWidth: uiSettings.labelWidthMedium,
                                       placeholder: L(
                                          "Property name of the API for start index"
                                       ),
                                    },
                                    {
                                       id: ids.pagingLimit,
                                       view: "text",
                                       label: L("Limit"),
                                       labelWidth: uiSettings.labelWidthMedium,
                                       placeholder: L(
                                          "Property name of the API for limit return the item number"
                                       ),
                                    },
                                    {
                                       id: ids.pagingTotal,
                                       view: "text",
                                       label: L("Total"),
                                       labelWidth: uiSettings.labelWidthMedium,
                                       placeholder: L(
                                          "Property name of the API that returns the total value"
                                       ),
                                    },
                                    {
                                       fillspace: true,
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
         const $requestForm = $$(ids.requestForm);

         AB.Webix.extend($requestForm, webix.ProgressBar);

         this._data = data;
      }

      getValues() {
         const ids = this.ids;
         const $requestForm = $$(ids.requestForm);
         const values = $requestForm.getValues() ?? {};

         // Request's pagings
         values.paging = {
            type: $$(ids.pagingType).getValue(),
            start: $$(ids.pagingStart).getValue(),
            limit: $$(ids.pagingLimit).getValue(),
            total: $$(ids.pagingTotal).getValue(),
         };

         // Request's headers
         const $headers = $$(ids.headers);
         values.headers = values.headers ?? [];
         $headers?.getChildViews().forEach((headerItem) => {
            const $name = headerItem.getChildViews()[0];
            const $value = headerItem.getChildViews()[1];
            values.headers.push({
               key: $name.getValue(),
               value: $value.getValue(),
            });
         });
         values.headers = values.headers.filter(
            (header) => header.key != null && header.value != null
         );

         return values;
      }

      validate() {
         return $$(this.ids.requestForm).validate();
      }

      busy() {
         $$(this.ids.requestForm).showProgress({ type: "icon" });
      }

      ready() {
         $$(this.ids.requestForm).hideProgress();
      }

      _addHeaderItem() {
         const uiItem = this._headerItem();
         $$(this.ids.headers).addView(uiItem);
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
   }

   return new UI_Work_Object_List_NewObject_API_Read_Request();
}
