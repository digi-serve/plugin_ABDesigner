/*
 * ABViewCSVExporter
 * A Property manager for our ABViewCSVExporter widget
 */

import FViewClass from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_csvexporter";

   const ABViewClassProperty = FViewClass(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABViewClassProperty.L();

   class ABViewCSVExporterProperty extends ABViewClassProperty {
      constructor(baseID) {
         super(baseID ?? BASE_ID, {
            datacollection: "",
            buttonLabel: "",
            hasHeader: "",
            filename: "",
            width: "",
            buttonFilter: "",
            fields: "",
         });

         this.AB = AB;
         this.propertyFilter = this.AB.filterComplexNew(`${baseID}_filter`);
      }

      static get key() {
         return "csvExporter";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "fieldset",
               label: L("Data:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  rows: [
                     {
                        id: ids.datacollection,
                        name: "datacollection",
                        view: "richselect",
                        label: L("Data Source"),
                        labelWidth: uiConfig.labelWidthLarge,
                        skipAutoSave: true,
                        on: {
                           onChange: (newVal, oldVal) => {
                              if (newVal != oldVal) {
                                 this.populateFilter();
                                 this.onChange();
                              }
                           },
                        },
                     },
                     {
                        id: ids.hasHeader,
                        name: "hasHeader",
                        view: "checkbox",
                        label: L("Header on first line"),
                        labelWidth: uiConfig.labelWidthXLarge,
                     },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Filter Option:"),
                              css: "ab-text-bold",
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              id: ids.buttonFilter,
                              view: "button",
                              name: "buttonFilter",
                              css: "webix_primary",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              badge: 0,
                              click: () => {
                                 this.showFilterPopup();
                              },
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
                        labelWidth: uiConfig.labelWidthLarge,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                     {
                        id: ids.filename,
                        name: "filename",
                        view: "text",
                        label: L("File name"),
                        labelWidth: uiConfig.labelWidthLarge,
                     },
                     {
                        id: ids.width,
                        view: "counter",
                        name: "width",
                        label: L("Width:"),
                        labelWidth: uiConfig.labelWidthLarge,
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
               view: "fieldset",
               label: L("Fields:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  view: "list",
                  id: ids.fields,
                  autoheight: true,
                  select: false,
                  template: (item) => {
                     return `<span style="min-width: 18px; display: inline-block;"><i class="fa ${
                        item.isHidden ? "fa-square-o" : "fa-check-square-o"
                     } ab-visible-field-icon"></i>&nbsp;</span> ${item.label}`;
                  },
                  on: {
                     onItemClick: (id, e, node) => {
                        this.toggleField(id, e, node);
                        this.onChange();
                     },
                  },
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);

         this.propertyFilter.init();
         this.propertyFilter.on("save", (val) => {
            this.onChange();
            this.populateBadgeNumber();
            this.filter_popup.hide();
         });

         this.filter_popup = webix.ui({
            view: "popup",
            width: 800,
            hidden: true,
            body: this.propertyFilter.ui,
         });
      }

      populate(view) {
         super.populate(view);

         view.settings = view.settings ?? {};

         const ids = this.ids;
         const FieldClass = this.ViewClass();
         const ABViewCSVExporterPropertyComponentDefaults =
            FieldClass.defaultValues();

         this.populateDatacollections();

         $$(ids.hasHeader).setValue(
            view.settings.hasHeader ??
               ABViewCSVExporterPropertyComponentDefaults.hasHeader
         );
         $$(ids.buttonLabel).setValue(
            view.settings.buttonLabel ??
               ABViewCSVExporterPropertyComponentDefaults.buttonLabel
         );
         $$(ids.filename).setValue(
            view.settings.filename ??
               ABViewCSVExporterPropertyComponentDefaults.filename
         );
         $$(ids.width).setValue(
            view.settings.width ??
               ABViewCSVExporterPropertyComponentDefaults.width
         );

         this.populateFilter();

         this.populateBadgeNumber();

         this.populateFields();
      }

      populateDatacollections() {
         // Pull data views to options
         const dcOptions = this.CurrentView.application
            .datacollectionsIncluded()
            .map((dc) => {
               return {
                  id: dc.id,
                  value: dc.label,
                  icon:
                     dc.sourceType === "query"
                        ? "fa fa-filter"
                        : "fa fa-database",
               };
            });

         const $d = $$(this.ids.datacollection);
         $d.define("options", dcOptions);
         $d.define("value", this.CurrentView?.settings?.dataviewID ?? null);
         $d.refresh();
      }

      populateBadgeNumber() {
         const ids = this.ids;
         const view = this.CurrentView;

         $$(ids.buttonFilter).define(
            "badge",
            view?.settings?.where?.rules?.length ?? null
         );
         $$(ids.buttonFilter).refresh();
      }

      populateFilter() {
         const view = this.CurrentView;
         const dc = view.datacollection;
         const obj = dc?.datasource;

         // Populate data to popups
         // PropertyFilter.applicationLoad(view.application);
         this.propertyFilter.fieldsLoad(obj?.fields() ?? []);
         this.propertyFilter.setValue(view.settings.where);
      }

      populateFields() {
         const ids = this.ids;
         const $fields = $$(ids.fields);
         const view = this.CurrentView;
         const hiddenFieldIds = view.settings.hiddenFieldIds ?? [];
         const fields = view?.datacollection?.datasource?.fields();

         $fields.clearAll();
         if (!fields?.length) return;

         $fields.parse(
            fields.map((f) => {
               return {
                  id: f.id,
                  label: f.label,
                  isHidden: hiddenFieldIds.indexOf(f.id) >= 0,
               };
            })
         );
         $fields.refresh();
      }

      showFilterPopup() {
         const $buttonFilter = $$(this.ids.buttonFilter);
         this.propertyFilter.popUp($buttonFilter?.$view);
      }

      toggleField(fieldId) {
         const ids = this.ids;
         const $fields = $$(ids.fields);

         const fieldItem = $fields.getItem(fieldId);
         $fields.updateItem(fieldId, {
            isHidden: !fieldItem.isHidden,
         });
         $fields.refresh();
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const ids = this.ids;
         const FieldClass = this.ViewClass();
         const ABViewCSVExporterPropertyComponentDefaults =
            FieldClass.defaultValues();

         const values = super.values();
         values.settings = values.settings ?? {};

         values.settings.dataviewID = $$(ids.datacollection).getValue();
         values.settings.hasHeader = $$(ids.hasHeader).getValue();
         values.settings.where = this.propertyFilter.getValue();

         values.settings.buttonLabel =
            $$(ids.buttonLabel).getValue() ??
            ABViewCSVExporterPropertyComponentDefaults.buttonLabel;

         values.settings.filename =
            $$(ids.filename).getValue() ??
            ABViewCSVExporterPropertyComponentDefaults.filename;

         values.settings.width =
            $$(ids.width).getValue() ??
            ABViewCSVExporterPropertyComponentDefaults.width;

         values.settings.hiddenFieldIds = $$(ids.fields)
            .find({ isHidden: true })
            .map((item) => item.id);

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("csvExporter");
      }
   }

   return ABViewCSVExporterProperty;
}
