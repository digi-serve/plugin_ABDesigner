/*
 * ABViewCSVImporter
 * A Property manager for our ABViewCSVImporter widget
 */

import FViewClass from "./ABView";
import ABRecordRule from "../rules/ABViewRuleListFormRecordRules";

let PopupRecordRule = null;

export default function (AB) {
   const BASE_ID = "properties_abview_csvimporter";

   const ABViewClassProperty = FViewClass(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABViewClassProperty.L();

   class ABViewCSVImporterProperty extends ABViewClassProperty {
      constructor(baseID) {
         super(baseID ?? BASE_ID, {
            datacollection: "",
            fields: "",
            buttonLabel: "",
            buttonRecordRules: "",
            width: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "csvImporter";
      }

      ui() {
         const ids = this.ids;
         PopupRecordRule = ABRecordRule(this.AB, this.base);
         // PopupRecordRule.component(`${this.base}_recordrule`);

         return super.ui([
            {
               view: "fieldset",
               label: L("Data:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  id: ids.datacollection,
                  name: "datacollection",
                  view: "richselect",
                  label: L("Data Source"),
                  labelWidth: uiConfig.labelWidthLarge,
                  skipAutoSave: true,
                  on: {
                     onChange: (newVal) => this.selectSource(newVal),
                  },
               },
            },
            {
               view: "fieldset",
               label: L("Available Fields:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.fields,
                        name: "fields",
                        view: "list",
                        select: false,
                        minHeight: 250,
                        template: this.listTemplate.bind(this),
                        type: {
                           markCheckbox: function (item) {
                              return `<span class='check webix_icon fa fa-${
                                 item.selected ? "check-" : ""
                              }square-o'></span>`;
                           },
                        },
                        onClick: {
                           check: this.check.bind(this),
                        },
                     },
                  ],
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
                              label: L("Record Rules:"),
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              id: ids.buttonRecordRules,
                              view: "button",
                              name: "buttonRecordRules",
                              css: "webix_primary",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              badge: 0,
                              click: this.recordRuleShow.bind(this),
                           },
                        ],
                     },
                  ],
               },
            },
            {
               view: "fieldset",
               label: L("Customize Display:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.buttonLabel,
                        name: "buttonLabel",
                        view: "text",
                        label: L("Label"),
                        labelWidth: uiConfig.labelWidthXLarge,
                        on: {
                           onChange: () => this.onChange(),
                        },
                     },
                     {
                        id: ids.width,
                        view: "counter",
                        name: "width",
                        label: L("Width:"),
                        labelWidth: uiConfig.labelWidthXLarge,
                        on: {
                           onChange: () => this.onChange(),
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

         PopupRecordRule.init(AB);
         PopupRecordRule.on("save", () => {
            this.populateBadgeNumber();
         });
      }

      selectSource(dcId) {
         const view = this.CurrentView;
         view.settings = view.settings ?? {};
         view.settings.dataviewID = dcId;

         this.updateRules();
         this.populateAvailableFields({ selectAll: true });
         this.onChange();
      }

      updateRules() {
         // Populate values to rules
         const selectedDv = this.CurrentView.datacollection;
         if (selectedDv?.datasource) {
            PopupRecordRule.objectLoad(selectedDv.datasource);
         }

         PopupRecordRule.fromSettings(
            this.CurrentView?.settings?.recordRules ?? []
         );
      }

      populateAvailableFields(options = {}) {
         const ids = this.ids;
         const view = this.CurrentView;

         const datacollection = this.AB.datacollectionByID(
            view.settings.dataviewID
         );
         const object = datacollection?.datasource;

         view.settings = view.settings ?? {};
         const availableFields = view.settings.availableFieldIds ?? [];

         // Pull field list
         const fieldOptions = object?.fields()?.map((f) => {
            f.selected = options.selectAll
               ? true
               : availableFields.filter((fieldId) => f.id == fieldId).length >
                 0;

            return f;
         });

         $$(ids.fields).clearAll();
         $$(ids.fields).parse(fieldOptions);
      }

      populateBadgeNumber() {
         const ids = this.ids;
         const view = this.CurrentView;
         if (!view) return;

         $$(ids.buttonRecordRules).define(
            "badge",
            view.settings?.recordRules?.length ?? null
         );
         $$(ids.buttonRecordRules).refresh();
      }

      listTemplate(field, $common) {
         const fieldComponent = field.formComponent();
         if (fieldComponent == null)
            return `<i class='fa fa-times'></i>  ${field.label} <div class='ab-component-form-fields-component-info'> Disable </div>`;

         const componentKey = fieldComponent.common().key;
         const formComponent = this.CurrentApplication.viewAll(
            (v) => v.common().key == componentKey
         )[0];

         return `${$common.markCheckbox(field)} ${
            field.label
         } <div class='ab-component-form-fields-component-info'> <i class='fa fa-${
            formComponent?.common()?.icon ?? "fw"
         }'></i> ${
            formComponent ? L(formComponent.common().labelKey ?? "Label") : ""
         } </div>`;
      }

      check(e, fieldId) {
         const ids = this.ids;

         // update UI list
         let item = $$(ids.fields).getItem(fieldId);
         item.selected = item.selected ? 0 : 1;
         $$(ids.fields).updateItem(fieldId, item);
         this.onChange();
      }

      recordRuleShow() {
         this.updateRules();
         if (PopupRecordRule.CurrentObject) PopupRecordRule.show();

         // Workaround
         PopupRecordRule.qbFixAfterShow();
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;

         view.settings = view.settings ?? {};

         this.populateDataCollections();
         this.populateAvailableFields();

         $$(ids.buttonLabel).setValue(view.settings.buttonLabel);
         $$(ids.width).setValue(view.settings.width);

         view.settings.availableFieldIds = [];
         let fields = $$(ids.fields).find({ selected: true });
         (fields || []).forEach((f) => {
            view.settings.availableFieldIds.push(f.id);
         });
      }

      populateDataCollections() {
         const ids = this.ids;
         const view = this.CurrentView;

         const datacollections =
            this.CurrentApplication.datacollectionsIncluded().map((dc) => {
               return {
                  id: dc.id,
                  value: dc.label,
                  icon:
                     dc.sourceType === "query"
                        ? "fa fa-filter"
                        : "fa fa-database",
               };
            });

         const $d = $$(ids.datacollection);
         $d.define("options", datacollections);
         $d.define("value", view.settings.dataviewID);
         $d.refresh();
      }

      defaultValues() {
         const values = {
            dataviewID: null,
            buttonLabel: "Upload CSV",
            width: 0,
            recordRules: [],
            availableFieldIds: [],
         };

         const FieldClass = this.ViewClass();
         if (FieldClass) {
            const fcValues = FieldClass.defaultValues();
            Object.keys(fcValues).forEach((k) => {
               values[k] = fcValues[k];
            });
         }

         return values;
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const ids = this.ids;
         const values = super.values();

         values.settings = values.settings ?? {};
         values.settings.dataviewID = $$(ids.datacollection).getValue();
         values.settings.recordRules = PopupRecordRule.toSettings();
         values.settings.buttonLabel = $$(ids.buttonLabel).getValue();
         values.settings.width = $$(ids.width).getValue();

         values.settings.availableFieldIds = [];
         $$(ids.fields)
            .find({ selected: true })
            .forEach((f) => {
               values.settings.availableFieldIds.push(f.id);
            });

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("csvImporter");
      }

      toSettings() {
         var base = this.defaults();
         base.settings = this.defaultValues();
         return base;
      }
   }

   return ABViewCSVImporterProperty;
}
