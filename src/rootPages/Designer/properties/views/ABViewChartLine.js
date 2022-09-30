/*
 * ABViewChartline
 * A Property manager for our ABViewChartLine definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_chart_line";

   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   class ABViewChartLineProperty extends ABView {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "line";
      }

      ui() {
         return super.ui([
            {
               name: "lineType",
               view: "richselect",
               label: L("Chart Type"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [
                  {
                     id: "line",
                     value: L("Line"),
                  },
                  {
                     id: "spline",
                     value: L("Spline"),
                  },
               ],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               name: "linePreset",
               view: "richselect",
               label: L("Chart Preset"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [
                  {
                     id: "plot",
                     value: L("Plot"),
                  },
                  {
                     id: "diamond",
                     value: L("Diamond"),
                  },
                  {
                     id: "simple",
                     value: L("Simple"),
                  },
               ],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            // {
            // 	name: 'chartWidth',
            // 	view: 'counter',
            // 	min: 1,
            // 	label: L('ab.component.chart.line.chartWidth', '*Width')
            // },
            {
               name: "chartHeight",
               view: "counter",
               min: 1,
               label: L("Height"),
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               name: "stepValue",
               view: "counter",
               min: 1,
               label: L("Step"),
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               name: "maxValue",
               view: "counter",
               min: 1,
               label: L("Max Value"),
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               name: "labelFontSize",
               view: "counter",
               min: 1,
               label: L("Label Font Size"),
               labelWidth: uiConfig.labelWidthXLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               name: "isLegend",
               view: "checkbox",
               labelRight: L("Show Legend"),
               labelWidth: uiConfig.labelWidthCheckbox,
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

         const $component = $$(this.ids.component);
         const defaultValues = this.defaultValues();
         const values = Object.assign(
            $component.getValues(),
            Object.assign(defaultValues, view.settings)
         );

         $component.setValues(values);
      }

      defaultValues() {
         const ViewClass = this.ViewClass();

         let values = null;

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
         const values = super.values();

         values.settings = Object.assign(
            $$(this.ids.component).getValues(),
            values.settings
         );

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("line");
      }
   }

   return ABViewChartLineProperty;
}
