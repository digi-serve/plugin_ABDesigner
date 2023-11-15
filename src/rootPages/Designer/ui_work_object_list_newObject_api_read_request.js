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
            tabSecret: "",

            pagingType: "",
            pagingStart: "",
            pagingLimit: "",
            pagingTotal: "",
            headers: "",
            secrets: "",
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
                                 value: L("Header"),
                              },
                              {
                                 id: ids.tabPaging,
                                 value: L("Paging"),
                              },
                              {
                                 id: ids.tabSecret,
                                 value: L("Secret"),
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
                                                this._addHeaderItem(
                                                   $$(this.ids.headers)
                                                );
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
                              {
                                 id: ids.tabSecret,
                                 view: "layout",
                                 padding: 10,
                                 rows: [
                                    {
                                       padding: 0,
                                       cols: [
                                          {
                                             label: L("Secrets"),
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
                                                this._addHeaderItem(
                                                   $$(this.ids.secrets)
                                                );
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
                                          id: ids.secrets,
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
         $headers?.getChildViews().forEach((item) => {
            const $key = item.getChildViews()[0];
            const $value = item.getChildViews()[1];
            const key = $key.getValue();
            const value = $value.getValue();

            if (key != null && value != null)
               values.headers.push({
                  key,
                  value,
               });
         });

         // APIObject's secrets
         values.secrets = this._getSecretValues();

         return values;
      }

      validate() {
         return $$(this.ids.requestForm).validate();
      }

      formClear() {
         const ids = this.ids;
         const $form = $$(ids.requestForm);
         const $headers = $$(ids.headers);
         const $secrets = $$(ids.secrets);

         $form.clearValidation();
         $form.clear();

         this.AB.Webix.ui([], $headers);
         this.AB.Webix.ui([], $secrets);
      }

      busy() {
         $$(this.ids.requestForm).showProgress({ type: "icon" });
      }

      ready() {
         $$(this.ids.requestForm).hideProgress();
      }

      _getSecretValues() {
         const result = [];

         const $secrets = $$(this.ids.secrets);
         $secrets?.getChildViews().forEach((item) => {
            const $name = item.getChildViews()[0];
            const $value = item.getChildViews()[1];
            const name = $name.getValue();
            const value = $value.getValue();

            if (name != null && value != null)
               result.push({
                  name,
                  value,
               });
         });

         return result;
      }

      _addHeaderItem($container) {
         const uiItem = this._headerItem($container);
         $container.addView(uiItem);
      }

      _headerItem($container, key, value) {
         return {
            cols: [
               {
                  placeholder: "key",
                  view: "text",
                  value: key,
               },
               {
                  placeholder: "value",
                  view: "text",
                  suggest: this._getSecretValues().map(
                     (secret) => `SECRET:${secret.name}`
                  ),
                  value: value,
               },
               {
                  icon: "wxi-trash",
                  view: "icon",
                  width: 38,
                  click: function () {
                     const $item = this.getParentView();
                     $container.removeView($item);
                  },
               },
            ],
         };
      }
   }

   return new UI_Work_Object_List_NewObject_API_Read_Request();
}
