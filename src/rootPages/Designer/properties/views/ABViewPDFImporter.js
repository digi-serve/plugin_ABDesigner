/*
 * ABViewPDFImporter
 * A Property manager for our ABViewPDFImporter definitions
 */

import FABView from "./ABView";
import FABViewRuleListFormSubmitRules from "../rules/ABViewRuleListFormSubmitRules";

export default function (AB) {
   const BASE_ID = "properties_abview_pdfImporter";

   const ABView = FABView(AB);
   const L = ABView.L();
   const uiConfig = AB.UISettings.config();

   const PopupSubmitRule = FABViewRuleListFormSubmitRules(
      AB,
      `${BASE_ID}_popupSubmitRule`
   );

   class ABViewPDFImporterProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            datacollection: "",
            field: "",
            buttonSubmitRules: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "pdfImporter";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "fieldset",
               label: L("Data:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.datacollection,
                        name: "dataviewID",
                        view: "richselect",
                        label: L("Data Source"),
                        labelWidth: uiConfig.labelWidthLarge,
                        on: {
                           onChange: (dcId, oldDcId) => {
                              if (dcId == oldDcId) return;

                              this.onChange();
                              this.populateFieldOptions();
                           },
                        },
                     },
                     {
                        id: ids.field,
                        name: "fieldID",
                        view: "richselect",
                        label: L("Field"),
                        labelWidth: uiConfig.labelWidthLarge,
                        on: {
                           onChange: (dcId, oldDcId) => {
                              if (dcId == oldDcId) return;
                              this.onChange();
                           },
                        },
                     },
                     {
                        view: "fieldset",
                        label: L("Rules:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        body: {
                           type: "clean",
                           padding: 10,
                           rows: [
                              {
                                 cols: [
                                    {
                                       view: "label",
                                       label: L("Submit Rules:"),
                                       width: uiConfig.labelWidthLarge,
                                    },
                                    {
                                       id: ids.buttonSubmitRules,
                                       view: "button",
                                       css: "webix_primary",
                                       name: "buttonSubmitRules",
                                       label: L("Settings"),
                                       icon: "fa fa-gear",
                                       type: "icon",
                                       badge: 0,
                                       click: () => {
                                          this.submitRuleShow();
                                       },
                                    },
                                 ],
                              },
                           ],
                        },
                     },
                  ],
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);

         PopupSubmitRule.init(AB);
         PopupSubmitRule.on("save", (/* settings */) => {
            this.onChange();
            this.populateBadgeNumber();
         });
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;

         const $dc = $$(ids.datacollection);
         const dcID = view.settings.dataviewID;

         // Pull data collections to options
         const dcOptions = view.application
            .datacollectionsIncluded()
            .filter(
               (d) => d.sourceType == "object" && !d?.datasource?.isReadOnly
            )
            .map((d) => {
               return {
                  id: d.id,
                  value: d.label,
                  icon: "fa fa-database",
               };
            });
         $dc.define("options", dcOptions);
         $dc.define("value", dcID);
         $dc.refresh();

         // Pull fields to options
         this.populateFieldOptions(view);

         PopupSubmitRule.objectLoad(this.CurrentObject);
         PopupSubmitRule.viewLoad(view);
         PopupSubmitRule.fromSettings(view.settings.submitRules ?? []);
      }

      populateFieldOptions(view) {
         view = view ?? this.CurrentView;
         const $dc = $$(this.ids.datacollection);
         const $field = $$(this.ids.field);
         const fieldID = view.settings.fieldID;
         const obj = this.AB.datacollections(
            (dc) => dc.id == $dc.getValue()
         )[0];
         const fieldOptions =
            obj?.datasource
               ?.fields((f) => f.key == "image")
               ?.map((f) => {
                  return {
                     id: f.id,
                     value: f.label,
                     icon: "fa fa-file-image-o",
                  };
               }) ?? [];
         $field.define("options", fieldOptions);
         $field.define("value", fieldID);
         $field.refresh();
      }

      populateBadgeNumber() {
         const ids = this.ids;

         const view = this.CurrentView;
         if (!view) return;

         $$(ids.buttonSubmitRules).define(
            "badge",
            view?.settings?.submitRules?.length || null
         );
         $$(ids.buttonSubmitRules).refresh();
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const $component = $$(this.ids.component);

         const values = super.values();

         values.settings = $component.getValues();
         values.settings.submitRules = PopupSubmitRule.toSettings();

         return values;
      }

      submitRuleShow() {
         PopupSubmitRule.fromSettings(this.CurrentView.settings.submitRules);
         PopupSubmitRule.show();
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("pdfImporter");
      }
   }

   return ABViewPDFImporterProperty;
}
