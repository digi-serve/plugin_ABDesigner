/*
 * ABFieldDateTime
 * A Property manager for our ABFieldDateTime.
 */

import FABMobileViewFormItem from "./ABMobileViewFormItem";

export default function (AB) {
   const ABMobileViewFormItem = FABMobileViewFormItem(AB);
   const L = ABMobileViewFormItem.L();
   const uiConfig = AB.Config.uiSettings();

   class ABMobileViewFormDatetime extends ABMobileViewFormItem {
      constructor() {
         super("properties_abmobileview_form_datetime", {
            default: "",
            currentToDefault: "",

            dateDisplay: "",

            dateFormat: "",
            defaultDate: "",
            defaultDateValue: "",
            timeFormat: "",
            defaultTime: "",
            defaultTimeValue: "",

            // validation
            validateCondition: "",
            validateRange: "",
            validateRangeUnit: "",
            validateRangeBefore: "",
            validateRangeAfter: "",
            validateRangeBeforeLabel: "",
            validateRangeAfterLabel: "",

            validateStartDateContainer: "",
            validateStartDateContainerLabel: "",
            validateEndDateContainer: "",
         });
      }

      static get key() {
         return "mobile-datetime";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "fieldset",
               label: L("Date:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     // {
                     //    view: "label",
                     //    label: L("Date:"),
                     //    align: "left",
                     // },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Format:"),
                              align: "right",
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              id: ids.dateFormat,
                              view: "richselect",
                              name: "dateFormat",
                              value: 1,
                              options: [
                                 {
                                    id: 1,
                                    value: L("Ignore Date"),
                                 },
                                 { id: 2, value: "dd/mm/yyyy" },
                                 { id: 3, value: "mm/dd/yyyy" },
                                 { id: 4, value: "M D, yyyy" },
                                 { id: 5, value: "D M, yyyy" },
                              ],
                              on: {
                                 onChange: () => {
                                    this.refreshDateValue();
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Default:"),
                              align: "right",
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              view: "richselect",
                              name: "defaultDate",
                              id: ids.defaultDate,
                              value: 1,
                              options: [
                                 { id: 1, value: L("None") },
                                 {
                                    id: 2,
                                    value: L("Current Date"),
                                 },
                                 {
                                    id: 3,
                                    value: L("Specific Date"),
                                 },
                              ],
                              on: {
                                 onChange: () => {
                                    this.defaultDateChange();
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                           {
                              view: "datepicker",
                              name: "defaultDateValue",
                              id: ids.defaultDateValue,
                              gravity: 0.5,
                              disabled: true,
                              on: {
                                 onChange: () => {
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },
                     // Validator
                     {
                        view: "label",
                        label: L("Validation criteria:"),
                        // width: 123,
                        css: "ab-text-bold",
                     },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Condition:"),
                              align: "right",
                              width: uiConfig.labelWidthLarge,
                              css: "ab-text-bold",
                           },
                           {
                              id: ids.validateCondition,
                              view: "select",
                              name: "validateCondition",
                              value: "none",
                              options: [
                                 { id: "none", value: L("None") },
                                 {
                                    id: "dateRange",
                                    value: L("Range"),
                                 },
                                 {
                                    id: "between",
                                    value: L("Between"),
                                 },
                                 {
                                    id: "notBetween",
                                    value: L("Not between"),
                                 },
                                 {
                                    id: "=",
                                    value: L("Equal to"),
                                 },
                                 {
                                    id: "<>",
                                    value: L("Not equal to"),
                                 },
                                 {
                                    id: ">",
                                    value: L("Greater than"),
                                 },
                                 {
                                    id: "<",
                                    value: L("Less than"),
                                 },
                                 {
                                    id: ">=",
                                    value: L("Greater than or Equal to"),
                                 },
                                 {
                                    id: "<=",
                                    value: L("Less than or Equal to"),
                                 },
                              ],
                              on: {
                                 onChange: (newVal) => {
                                    switch (newVal) {
                                       case "none":
                                          $$(ids.validateRange).hide();
                                          $$(
                                             ids.validateStartDateContainer
                                          ).hide();
                                          $$(
                                             ids.validateEndDateContainer
                                          ).hide();
                                          break;
                                       case "dateRange":
                                          $$(ids.validateRange).show();
                                          $$(
                                             ids.validateStartDateContainer
                                          ).hide();
                                          $$(
                                             ids.validateEndDateContainer
                                          ).hide();
                                          break;
                                       case "between":
                                       case "notBetween":
                                          $$(ids.validateRange).hide();
                                          $$(
                                             ids.validateStartDateContainerLabel
                                          ).define("label", L("Start Date:"));
                                          $$(
                                             ids.validateStartDateContainerLabel
                                          ).refresh();
                                          $$(
                                             ids.validateStartDateContainer
                                          ).show();
                                          $$(
                                             ids.validateEndDateContainer
                                          ).show();
                                          break;
                                       case "=":
                                       case "<>":
                                       case ">":
                                       case "<":
                                       case ">=":
                                       case "<=":
                                          $$(ids.validateRange).hide();
                                          $$(
                                             ids.validateStartDateContainerLabel
                                          ).define("label", L("Date:"));
                                          $$(
                                             ids.validateStartDateContainerLabel
                                          ).refresh();
                                          $$(
                                             ids.validateStartDateContainer
                                          ).show();
                                          $$(
                                             ids.validateEndDateContainer
                                          ).hide();
                                          break;
                                    }
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },
                     {
                        id: ids.validateRange,
                        hidden: true,
                        rows: [
                           {
                              cols: [
                                 {
                                    view: "label",
                                    label: L("Unit:"),
                                    align: "right",
                                    width: uiConfig.labelWidthLarge,
                                 },
                                 {
                                    id: ids.validateRangeUnit,
                                    view: "select",
                                    name: "validateRangeUnit",
                                    options: [
                                       {
                                          id: "days",
                                          value: L("Days"),
                                       },
                                       {
                                          id: "months",
                                          value: L("Months"),
                                       },
                                       {
                                          id: "years",
                                          value: L("Years"),
                                       },
                                    ],
                                    on: {
                                       onChange: () => {
                                          $$(
                                             ids.validateRangeBeforeLabel
                                          ).refresh();
                                          $$(
                                             ids.validateRangeAfterLabel
                                          ).refresh();
                                          this.onChange();
                                       },
                                       onAfterRender: function () {
                                          AB.ClassUI.CYPRESS_REF(this);
                                       },
                                    },
                                 },
                              ],
                           },
                           {
                              cols: [
                                 {
                                    id: ids.validateRangeBeforeLabel,
                                    view: "template",
                                    align: "left",
                                    width: 140,
                                    borderless: true,
                                    template: () => {
                                       let unit = $$(
                                             ids.validateRangeUnit
                                          ).getValue(),
                                          selectedUnit = $$(
                                             ids.validateRangeUnit
                                          ).config.options.filter(
                                             (opt) => opt.id == unit
                                          )[0];

                                       const beforeLabel = `${L("Before")} ${$$(
                                          ids.validateRangeBefore
                                       ).getValue()} ${selectedUnit.value}`;

                                       return beforeLabel;
                                    },
                                 },
                                 {
                                    view: "label",
                                    label: "",
                                    align: "center",
                                    // width: 1,
                                 },
                                 {
                                    id: ids.validateRangeAfterLabel,
                                    view: "template",
                                    align: "right",
                                    borderless: true,
                                    template: () => {
                                       let unit = $$(
                                             ids.validateRangeUnit
                                          ).getValue(),
                                          selectedUnit = $$(
                                             ids.validateRangeUnit
                                          ).config.options.filter(
                                             (opt) => opt.id == unit
                                          )[0];

                                       const afterLabel = `${L("After")} ${$$(
                                          ids.validateRangeAfter
                                       ).getValue()} ${selectedUnit.value}`;

                                       return afterLabel;
                                    },
                                 },
                              ],
                           },
                           {
                              cols: [
                                 {
                                    id: ids.validateRangeBefore,
                                    view: "slider",
                                    name: "validateRangeBefore",
                                    on: {
                                       onChange: () => {
                                          $$(
                                             ids.validateRangeBeforeLabel
                                          ).refresh();
                                          this.onChange();
                                       },
                                       onAfterRender: function () {
                                          AB.ClassUI.CYPRESS_REF(this);
                                       },
                                    },
                                 },
                                 {
                                    id: ids.validateRangeAfter,
                                    view: "slider",
                                    name: "validateRangeAfter",
                                    on: {
                                       onChange: () => {
                                          $$(
                                             ids.validateRangeAfterLabel
                                          ).refresh();
                                          this.onChange();
                                       },
                                       onAfterRender: function () {
                                          AB.ClassUI.CYPRESS_REF(this);
                                       },
                                    },
                                 },
                              ],
                           },
                        ],
                     },
                     {
                        id: ids.validateStartDateContainer,
                        hidden: true,
                        cols: [
                           {
                              id: ids.validateStartDateContainerLabel,
                              view: "label",
                              label: L("Start Date:"),
                              align: "right",
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              name: "validateStartDate",
                              view: "datepicker",
                              om: {
                                 onChange: () => {
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },
                     {
                        id: ids.validateEndDateContainer,
                        hidden: true,
                        cols: [
                           {
                              view: "label",
                              label: L("End Date:"),
                              align: "right",
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              name: "validateEndDate",
                              view: "datepicker",
                              on: {
                                 onChange: () => {
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },
                  ],
               },
            },
            {
               view: "fieldset",
               label: L("Time:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     // {
                     //    view: "label",
                     //    label: L("Time:"),
                     //    align: "left",
                     // },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Format:"),
                              align: "right",
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              view: "richselect",
                              name: "timeFormat",
                              id: ids.timeFormat,
                              value: 2,
                              options: [
                                 // {
                                 //    id: 1,
                                 //    value: L("ab.dataField.datetime.ignoreTime", "*Ignore Time")
                                 // },
                                 { id: 2, value: L("HH:MM AM/PM") },
                                 { id: 3, value: L("HH:MM (military)") },
                              ],
                              on: {
                                 onChange: () => {
                                    this.refreshTimevalue();
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Default Time:"),
                              align: "right",
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              view: "richselect",
                              name: "defaultTime",
                              id: ids.defaultTime,
                              // labelWidth: 110,
                              value: 1,
                              options: [
                                 { id: 1, value: L("None") },
                                 {
                                    id: 2,
                                    value: L("Current Time"),
                                 },
                                 {
                                    id: 3,
                                    value: L("Specific Time"),
                                 },
                              ],
                              on: {
                                 onChange: () => {
                                    this.defaultTimeChange();
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                           {
                              view: "datepicker",
                              name: "defaultTimeValue",
                              type: "time",
                              id: ids.defaultTimeValue,
                              gravity: 0.5,
                              disabled: true,
                              on: {
                                 onChange: () => {
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },
                  ],
               },
            },
         ]);
      }

      defaultDateChange() {
         const ids = this.ids;

         const defaultDateValue = $$(ids.defaultDate).getValue();
         const defaultDate = parseInt(defaultDateValue);
         switch (defaultDate) {
            case 1:
               {
                  $$(ids.defaultDateValue).disable();
                  $$(ids.defaultDateValue).setValue();
               }
               break;
            case 2:
               {
                  $$(ids.defaultDateValue).enable();
                  $$(ids.defaultDateValue).setValue(new Date());
                  this.refreshDateValue();
               }
               break;
            case 3:
               {
                  $$(ids.defaultDateValue).enable();
                  $$(ids.defaultDateValue).setValue();
               }
               break;
            default:
               {
                  $$(ids.defaultDateValue).disable();
                  $$(ids.defaultDateValue).setValue(new Date());
               }
               break;
         }
      }

      refreshDateValue() {
         const ids = this.ids;

         const defaultFormatValue = $$(ids.dateFormat).getValue();
         const dateFormat = parseInt(defaultFormatValue);

         let formatString = "";
         switch (dateFormat) {
            //Ignore Date
            case (1, 2):
               {
                  formatString = "%d/%m/%Y";
               }
               break;
            //mm/dd/yyyy
            case 3:
               {
                  formatString = "%m/%d/%Y";
               }
               break;
            //M D, yyyy
            case 4:
               {
                  formatString = "%M %d, %Y";
               }
               break;
            //D M, yyyy
            case 5:
               {
                  formatString = "%d %M, %Y";
               }
               break;
            default:
               {
                  formatString = "%d/%m/%Y";
               }
               break;
         }

         $$(ids.defaultDateValue).define("format", formatString);
         $$(ids.defaultDateValue).refresh();
      }

      defaultTimeChange() {
         const ids = this.ids;

         const dateFormat = parseInt($$(ids.defaultTime).getValue());

         switch (dateFormat) {
            case 1:
               {
                  $$(ids.defaultTimeValue).disable();
                  $$(ids.defaultTimeValue).setValue();
               }
               break;
            case 2:
               {
                  $$(ids.defaultTimeValue).enable();
                  $$(ids.defaultTimeValue).setValue(new Date());
               }
               break;
            case 3:
               {
                  $$(ids.defaultTimeValue).enable();
                  $$(ids.defaultTimeValue).setValue();
               }
               break;
            default:
               {
                  $$(ids.defaultTimeValue).disable();
                  $$(ids.defaultTimeValue).setValue();
               }
               break;
         }
         this.refreshTimevalue();
      }

      refreshTimevalue() {
         const ids = this.ids;

         const timeFormat = parseInt($$(ids.timeFormat).getValue());

         let formatString = "";
         switch (timeFormat) {
            //HH:MM AM/PM
            case 2:
               {
                  formatString = "%h:%i %A";
               }
               break;
            //HH:MM (military)
            case 3:
               {
                  formatString = "%H:%i";
               }
               break;
            default:
               {
                  formatString = "%h:%i %A";
               }
               break;
         }

         $$(ids.defaultTimeValue).define("format", formatString);
         $$(ids.defaultTimeValue).refresh();
      }

      populate(view) {
         const ids = this.ids;

         super.populate(view);

         let DV = this.defaultValues();

         Object.keys(ids).forEach((k) => {
            let $ui = $$(ids[k]);
            if ($ui) {
               let s = view.settings[k] ?? DV[k];
               if (typeof s != "undefined") {
                  $ui.setValue?.(s);
               }
            }
         });

         $$(ids.defaultDateValue).setValue(
            new Date(view.settings.defaultDateValue)
         );
         $$(ids.defaultTimeValue).setValue(
            new Date(view.settings.defaultTimeValue)
         );
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const ids = this.ids;

         const $component = $$(ids.component);

         const values = super.values() ?? {};
         values.settings = $component.getValues() ?? {};
         // values.settings.type = $$(ids.type).getValue();
         // values.settings.placeholder = $$(ids.placeholder).getValue();

         return values;
      }
   }

   return ABMobileViewFormDatetime;
}
