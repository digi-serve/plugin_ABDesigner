/*
 * ABFieldDateTime
 * A Property manager for our ABFieldDateTime.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldDateTime extends ABField {
      constructor() {
         super("properties_abfield_datetime", {
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

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "label",
               label: L("Date:") + " ",
               align: "left",
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Format:") + " ",
                     align: "right",
                     width: 88,
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
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Default:") + " ",
                     align: "right",
                     width: 88,
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
                        },
                     },
                  },
                  {
                     view: "datepicker",
                     name: "defaultDateValue",
                     id: ids.defaultDateValue,
                     gravity: 0.5,
                     disabled: true,
                  },
               ],
            },
            // Validator
            {
               view: "label",
               label: L("Validation criteria:") + " ",
               width: 123,
               css: "ab-text-bold",
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Condition:") + " ",
                     align: "right",
                     width: 88,
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
                                 $$(ids.validateStartDateContainer).hide();
                                 $$(ids.validateEndDateContainer).hide();
                                 break;
                              case "dateRange":
                                 $$(ids.validateRange).show();
                                 $$(ids.validateStartDateContainer).hide();
                                 $$(ids.validateEndDateContainer).hide();
                                 break;
                              case "between":
                              case "notBetween":
                                 $$(ids.validateRange).hide();
                                 $$(ids.validateStartDateContainerLabel).define(
                                    "label",
                                    L("Start Date:") + " "
                                 );
                                 $$(
                                    ids.validateStartDateContainerLabel
                                 ).refresh();
                                 $$(ids.validateStartDateContainer).show();
                                 $$(ids.validateEndDateContainer).show();
                                 break;
                              case "=":
                              case "<>":
                              case ">":
                              case "<":
                              case ">=":
                              case "<=":
                                 $$(ids.validateRange).hide();
                                 $$(ids.validateStartDateContainerLabel).define(
                                    "label",
                                    L("Date:") + " "
                                 );
                                 $$(
                                    ids.validateStartDateContainerLabel
                                 ).refresh();
                                 $$(ids.validateStartDateContainer).show();
                                 $$(ids.validateEndDateContainer).hide();
                                 break;
                           }
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
                           label: L("Unit:") + " ",
                           align: "right",
                           width: 88,
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
                                 $$(ids.validateRangeBeforeLabel).refresh();
                                 $$(ids.validateRangeAfterLabel).refresh();
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
                              let unit = $$(ids.validateRangeUnit).getValue(),
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
                           borderless: true,
                           template: () => {
                              let unit = $$(ids.validateRangeUnit).getValue(),
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
                                 $$(ids.validateRangeBeforeLabel).refresh();
                              },
                           },
                        },
                        {
                           id: ids.validateRangeAfter,
                           view: "slider",
                           name: "validateRangeAfter",
                           on: {
                              onChange: () => {
                                 $$(ids.validateRangeAfterLabel).refresh();
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
                     label: L("Start Date:") + " ",
                     align: "right",
                     width: 88,
                  },
                  {
                     name: "validateStartDate",
                     view: "datepicker",
                  },
               ],
            },
            {
               id: ids.validateEndDateContainer,
               hidden: true,
               cols: [
                  {
                     view: "label",
                     label: L("End Date:") + " ",
                     align: "right",
                     width: 88,
                  },
                  {
                     name: "validateEndDate",
                     view: "datepicker",
                  },
               ],
            },
            {
               view: "label",
               label: L("Time:") + " ",
               align: "left",
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Format:") + " ",
                     align: "right",
                     width: 88,
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
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Default Time:") + " ",
                     align: "right",
                     width: 88,
                  },
                  {
                     view: "richselect",
                     name: "defaultTime",
                     id: ids.defaultTime,
                     labelWidth: 110,
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
                  },
               ],
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

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("datetime");
      }

      populate(field) {
         const ids = this.ids;

         super.populate(field);

         $$(ids.defaultDateValue).setValue(
            new Date(field.settings.defaultDateValue)
         );
         $$(ids.defaultTimeValue).setValue(
            new Date(field.settings.defaultTimeValue)
         );
      }

      show() {
         // dateDisplayRefresh();
         this.refreshDateValue();
         this.refreshTimevalue();
         super.show();
      }
   }

   return ABFieldDateTime;
}
