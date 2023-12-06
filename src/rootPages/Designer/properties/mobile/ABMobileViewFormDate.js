/*
 * ABMobileViewFormDate
 * A Property manager for our ABMobileViewFormDatepicker definitions
 */

import FABMobileViewFormItem from "./ABMobileViewFormItem";

export default function (AB) {
   const ABMobileViewFormItem = FABMobileViewFormItem(AB);
   const L = ABMobileViewFormItem.L();
   const uiConfig = AB.Config.uiSettings();

   class ABMobileViewFormDate extends ABMobileViewFormItem {
      constructor() {
         super("properties_abmobileview_form_date", {
            default: "",
            currentToDefault: "",

            dateDisplay: "",

            dateFormat: "",
            defaultDate: "",
            defaultDateValue: "",

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
         return "mobile-date";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Date Format:"),
                     align: "right",
                     width: uiConfig.labelWidthLarge,
                  },
                  {
                     view: "richselect",
                     name: "dateFormat",
                     id: ids.dateFormat,
                     value: 2,
                     options: [
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
                           ABMobileViewFormItem.CYPRESS_REF(this);
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
                           ABMobileViewFormItem.CYPRESS_REF(this);
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
                           ABMobileViewFormItem.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },

            // spacer
            {
               view: "label",
               label: "",
               // width: 123,
               height: 10,
            },

            // Validator
            {
               view: "fieldset",
               label: L("Validation criteria:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
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
                                    ABMobileViewFormItem.CYPRESS_REF(this);
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
                                          ABMobileViewFormItem.CYPRESS_REF(
                                             this
                                          );
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
                                    // width: 140,
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
                                    width: 1,
                                 },
                                 {
                                    id: ids.validateRangeAfterLabel,
                                    view: "template",
                                    align: "right",
                                    // width: 140,
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
                                          ABMobileViewFormItem.CYPRESS_REF(
                                             this
                                          );
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
                                          ABMobileViewFormItem.CYPRESS_REF(
                                             this
                                          );
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
                              on: {
                                 onChange: () => {
                                    this.onChange();
                                 },
                                 onAfterRender: function () {
                                    ABMobileViewFormItem.CYPRESS_REF(this);
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
                                    ABMobileViewFormItem.CYPRESS_REF(this);
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

      // defaultTimeChange() {
      //    const ids = this.ids;

      //    console.log("defaultTimeChange");
      //    const dateFormat = parseInt($$(ids.defaultTime).getValue());
      //    switch (dateFormat) {
      //       case 1:
      //          {
      //             $$(ids.defaultTimeValue).disable();
      //             $$(ids.defaultTimeValue).setValue();
      //          }
      //          break;
      //       case 2:
      //          {
      //             $$(ids.defaultTimeValue).enable();
      //             $$(ids.defaultTimeValue).setValue(new Date());
      //          }
      //          break;
      //       case 3:
      //          {
      //             $$(ids.defaultTimeValue).enable();
      //             $$(ids.defaultTimeValue).setValue();
      //          }
      //          break;
      //       default:
      //          {
      //             $$(ids.defaultTimeValue).disable();
      //             $$(ids.defaultTimeValue).setValue();
      //          }
      //          break;
      //    }
      // }

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

      // show() {
      //    // dateDisplayRefresh();
      //    this.refreshDateValue();
      //    super.show();
      // }
   }

   return ABMobileViewFormDate;
}
