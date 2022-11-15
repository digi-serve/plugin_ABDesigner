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
                              name: "filterMenuButton",
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
                     },
                  ],
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);

         this.propertyFilter.init();
         this.propertyFilter.on("change", (val) => {
            this.onChange();
            this.populateBadgeNumber();
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

         // Populate data to popups
         // PropertyFilter.applicationLoad(view.application);
         const dc = view.datacollection;
         const obj = dc?.datasource;
         this.propertyFilter.fieldsLoad(obj?.fields() ?? []);
         this.propertyFilter.setValue(view.settings.where);

         this.populateBadgeNumber();
      }

      populateDatacollections() {
         // Pull data views to options
         const dcOptions = this.AB.datacollections().map((dc) => {
            return {
               id: dc.id,
               value: dc.label,
            };
         });

         const $DcSelector = $$(this.ids.datacollection);
         $DcSelector.define("options", dcOptions);
         $DcSelector.define(
            "value",
            this.CurrentView?.settings?.dataviewID ?? null
         );
         $DcSelector.refresh();
      }

      populateBadgeNumber() {
         const ids = this.ids;
         const view = this.CurrentView;

         $$(ids.filterMenuButton).define(
            "badge",
            view?.settings?.where?.rules?.length ?? null
         );
         $$(ids.filterMenuButton).refresh();
      }

      showFilterPopup() {
         const $buttonFilter = $$(this.ids.buttonFilter);
         this.propertyFilter.popUp($buttonFilter?.$view);
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
