/*
 * ABViewPage
 * A Property manager for our ABViewPage definitions
 */

import FABViewContainer from "./ABViewContainer";

export default function (AB) {
   const ABViewContainer = FABViewContainer(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABViewContainer.L();

   class ABViewPageProperty extends ABViewContainer {
      constructor() {
         super("properties_abview_page", {
            // Put our ids here
            type: "",
            popupSettings: "",
            popupWidth: "",
            popupHeight: "",
            pageSettings: "",
            fixedPageWidth: "",
            pageWidth: "",
            pageBackground: "",
            // pagePermissionPanel: "",
         });
      }

      static get key() {
         return "page";
      }

      ui() {
         let ids = this.ids;
         let _this = this;

         return super.ui([
            {
               id: ids.type,
               name: "type",
               view: "richselect",
               label: L("Type"),
               options: [
                  { id: "page", value: L("Page") },
                  { id: "popup", value: L("Popup") },
               ],
               on: {
                  onChange: (newv /*, oldv */) => {
                     if (newv == "page") {
                        $$(ids.popupSettings).hide();
                        $$(ids.pageSettings).show();
                     } else {
                        $$(ids.popupSettings).show();
                        $$(ids.pageSettings).hide();
                     }
                     this.onChange();
                  },
               },
            },
            {
               id: ids.popupSettings,
               view: "fieldset",
               name: "popupSettings",
               label: L("Popup Settings"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.popupWidth,
                        view: "text",
                        name: "popupWidth",
                        placeholder: L("Set popup width"),
                        label: L("Width:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        validate: webix.rules.isNumber,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                     {
                        id: ids.popupHeight,
                        view: "text",
                        name: "popupHeight",
                        placeholder: L("Set popup height"),
                        label: L("Height:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        validate: webix.rules.isNumber,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },
            {
               id: ids.pageSettings,
               view: "fieldset",
               name: "pageSettings",
               label: L("Page Settings"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.fixedPageWidth,
                        view: "checkbox",
                        name: "fixedPageWidth",
                        labelRight: L("Page has fixed width"),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        click: function (/*id, event */) {
                           if (this.getValue() == 1) {
                              $$(ids.pageWidth).show();
                           } else {
                              $$(ids.pageWidth).hide();
                           }
                           _this.onChange();
                        },
                     },
                     {
                        id: ids.pageWidth,
                        view: "text",
                        name: "pageWidth",
                        placeholder: L("Set page width"),
                        label: L("Page width:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                     {
                        id: ids.pageBackground,
                        view: "richselect",
                        name: "pageBackground",
                        label: L("Page background:"),
                        labelWidth: uiConfig.labelWidthXLarge,
                        options: [
                           {
                              id: "ab-background-default",
                              value: L("White (default)"),
                           },
                           {
                              id: "ab-background-gray",
                              value: L("Dark"),
                           },
                           // { "id":"ab-background-texture", "value":L('ab.component.page.pageBackgroundTextured', '*Textured')}
                        ],
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },
         ]);
      }

      // async init(AB) {
      //    return super.init(AB);
      // }

      populate(view) {
         super.populate(view);
         let ids = this.ids;

         let DefaultValues = this.defaultValues();

         $$(ids.type).setValue(view.settings.type || DefaultValues.type);
         $$(ids.popupWidth).setValue(
            view.settings.popupWidth || DefaultValues.popupWidth
         );
         $$(ids.popupHeight).setValue(
            view.settings.popupHeight || DefaultValues.popupHeight
         );
         $$(ids.pageWidth).setValue(
            view.settings.pageWidth || DefaultValues.pageWidth
         );
         $$(ids.fixedPageWidth).setValue(
            view.settings.fixedPageWidth || DefaultValues.fixedPageWidth
         );
         $$(ids.pageBackground).setValue(
            view.settings.pageBackground || DefaultValues.pageBackground
         );

         // Disable select type of page when this page is root
         if (view.isRoot()) {
            $$(ids.type).hide();
         } else {
            $$(ids.type).show();
         }

         if (view.settings.type == "popup") {
            $$(ids.popupSettings).show();
            $$(ids.pageSettings).hide();
         } else {
            $$(ids.popupSettings).hide();
            $$(ids.pageSettings).show();
         }

         if (view.settings.fixedPageWidth == 1) {
            $$(ids.pageWidth).show();
         } else {
            $$(ids.pageWidth).hide();
         }
      }

      defaultValues() {
         let values = {};
         var ViewClass = this.ViewClass();
         if (ViewClass) {
            values = ViewClass.defaultValues();
         }
         return values;
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         let ids = this.ids;
         let vals = super.values();

         vals.settings = vals.settings || {};
         vals.settings.type = $$(ids.type).getValue();
         vals.settings.popupWidth = $$(ids.popupWidth).getValue();
         vals.settings.popupHeight = $$(ids.popupHeight).getValue();
         vals.settings.pageWidth = $$(ids.pageWidth).getValue();
         vals.settings.fixedPageWidth = $$(ids.fixedPageWidth).getValue();
         vals.settings.pageBackground = $$(ids.pageBackground).getValue();

         return vals;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("page");
      }
   }

   return ABViewPageProperty;
}
