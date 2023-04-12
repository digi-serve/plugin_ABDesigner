/*
 * ABViewPivot
 * A Property manager for our ABViewPivot definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_pivot";

   const ABView = FABView(AB);
   const L = ABView.L();
   const uiConfig = AB.UISettings.config();

   class ABViewPivotProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            datacollection: "",
            height: "",
            removeMissed: "",
            totalColumn: "",
            separateLabel: "",
            min: "",
            max: "",
            decimalPlaces: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "pivot";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
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
                  },
               },
            },
            {
               id: ids.height,
               view: "counter",
               name: "height",
               label: L("Height:"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.removeMissed,
               view: "checkbox",
               name: "removeMissed",
               labelRight: L("Remove empty data."),
               labelWidth: uiConfig.labelWidthCheckbox,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.totalColumn,
               view: "checkbox",
               name: "totalColumn",
               labelRight: L("Show a total column."),
               labelWidth: uiConfig.labelWidthCheckbox,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.separateLabel,
               view: "checkbox",
               name: "separateLabel",
               labelRight: L("Separate header label."),
               labelWidth: uiConfig.labelWidthCheckbox,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.min,
               view: "checkbox",
               name: "min",
               labelRight: L(
                  "Highlighting of a cell(s) with the least value in a row."
               ),
               labelWidth: uiConfig.labelWidthCheckbox,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.max,
               view: "checkbox",
               name: "max",
               labelRight: L(
                  "Highlighting of a cell(s) with the biggest value in a row."
               ),
               labelWidth: uiConfig.labelWidthCheckbox,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.decimalPlaces,
               name: "decimalPlaces",
               view: "counter",
               min: 1,
               label: L("Decimal Places"),
               labelWidth: uiConfig.labelWidthXLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;

         const dcID = view.settings.dataviewID
            ? view.settings.dataviewID
            : null;
         var $dc = $$(ids.datacollection);

         // Pull data collections to options
         var dcOptions = view.application.datacollectionsIncluded().map((d) => {
            return {
               id: d.id,
               value: d.label,
               icon:
                  d.sourceType == "query" ? "fa fa-filter" : "fa fa-database",
            };
         });
         $dc.define("options", dcOptions);
         $dc.define("value", dcID);
         $dc.refresh();

         $$(ids.removeMissed).setValue(view.settings.removeMissed);
         $$(ids.totalColumn).setValue(view.settings.totalColumn);
         $$(ids.separateLabel).setValue(view.settings.separateLabel);
         $$(ids.min).setValue(view.settings.min);
         $$(ids.max).setValue(view.settings.max);
         $$(ids.height).setValue(view.settings.height);
         $$(ids.decimalPlaces).setValue(
            view.settings.decimalPlaces == null
               ? 2
               : view.settings.decimalPlaces
         );
      }

      // defaultValues() {
      //    const ViewClass = this.ViewClass();

      //    let values = null;

      //    if (ViewClass) {
      //       values = ViewClass.defaultValues();
      //    }

      //    return values;
      // }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const $component = $$(this.ids.component);

         const values = super.values();

         values.settings = $component.getValues();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("pivot");
      }
   }

   return ABViewPivotProperty;
}
