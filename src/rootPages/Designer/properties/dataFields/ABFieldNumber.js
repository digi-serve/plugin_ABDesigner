/*
 * ABFieldNumber
 * A Property manager for our ABFieldNumber.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldNumberProperty extends ABField {
      constructor() {
         super("properties_abfield_number", {
            default: "",
            decimalOptions: "",
            typeDecimalPlaces: "",
            typeRounding: "",
            validation: "",
            validateMinimum: "",
            validateMaximum: "",

            defaultCheckbox: "",
            validateView: "",
            typeDecimals: "",
            typeFormat: "",
            typeThousands: "",
         });
      }

      ui() {
         const FC = this.FieldClass();
         const ids = this.ids;
         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Default Value:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.defaultCheckbox,
                     view: "checkbox",
                     width: 30,
                     value: 0,
                     on: {
                        onChange: (newv) => {
                           this.checkboxDefaultValue(newv);
                        },
                        onAfterRender: () => {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.default,
                     view: "text",
                     name: "default",
                     placeholder: L("Enter default value"),
                     disabled: true,
                     labelWidth: uiConfig.labelWidthXLarge,
                     on: {
                        onChange: (newVal, oldVal) => {
                           this.numValidation(newVal, oldVal, ids.default);
                        },
                        onAfterRender: () => {
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
                     label: L("Format:" + " "),
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.typeFormat,
                     view: "richselect",
                     name: "typeFormat",
                     value: "none",
                     labelWidth: uiConfig.labelWidthXLarge,
                     options: FC.formatList(),
                     on: {
                        onAfterRender() {
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
                     label: L("Decimals:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.typeDecimals,
                     view: "segmented",
                     name: "typeDecimals",
                     disallowEdit: true,
                     labelWidth: uiConfig.labelWidthXLarge,
                     value: "none",
                     options: FC.delimiterList(),
                     on: {
                        onChange: (newVal /*, oldVal */) => {
                           this.segmentedDecimals(newVal);
                        },
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               // show these options as sub optionsof our "typeDecimals"
               id: ids.decimalOptions,
               hidden: true,
               disabled: true,
               rows: [
                  {
                     cols: [
                        { width: 20 },
                        {
                           view: "label",
                           label: L("Places:") + ": ",
                           align: "right",
                           width: 100,
                        },
                        {
                           id: ids.typeDecimalPlaces,
                           view: "counter",
                           disallowEdit: true,
                           name: "typeDecimalPlaces",
                           width: 102,
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                        { width: 20 },
                        {
                           view: "label",
                           label: L("Rounding:") + " ",
                           align: "right",
                           width: 100,
                        },
                        {
                           id: ids.typeRounding,
                           view: "richselect",
                           name: "typeRounding",
                           value: "none",
                           vertical: true,
                           options: [
                              { id: "none", value: L("Default") },
                              {
                                 id: "roundUp",
                                 value: L("Round Up"),
                              },
                              {
                                 id: "roundDown",
                                 value: L("Round Down"),
                              },
                           ],
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Thousands:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.typeThousands,
                     view: "segmented",
                     name: "typeThousands",
                     value: "none",
                     options: FC.delimiterList(),
                     on: {
                        onAfterRender() {
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
                     label: L("Validation:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     view: "switch",
                     id: ids.validation,
                     name: "validation",
                     value: 0,
                     width: 55,
                     on: {
                        onChange: (newVal) => {
                           this.switchValidation(newVal);
                        },

                        onAfterRender: () => {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               id: ids.validateView,
               hidden: true,
               disabld: true,
               rows: [
                  {
                     cols: [
                        { width: 20 },
                        {
                           view: "label",
                           label: L("Minimum:") + " ",
                           align: "right",
                           width: 100,
                        },
                        {
                           view: "text",
                           id: ids.validateMinimum,
                           name: "validateMinimum",
                           placeholder: L("Minimum Number"),
                           on: {
                              onChange: (newVal, oldVal) => {
                                 this.numValidation(
                                    newVal,
                                    oldVal,
                                    ids.validateMinimum
                                 );
                              },

                              onAfterRender: () => {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
                  {
                     cols: [
                        { width: 20 },
                        {
                           view: "label",
                           label: L("Maximum:") + " ",
                           align: "right",
                           width: 100,
                        },
                        {
                           view: "text",
                           id: ids.validateMaximum,
                           name: "validateMaximum",
                           placeholder: L("Maximum Number"),
                           on: {
                              onChange: (newVal, oldVal) => {
                                 this.numValidation(
                                    newVal,
                                    oldVal,
                                    ids.validateMaximum
                                 );
                              },

                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
         ]);
      }

      numValidation(newVal, oldVal, id) {
         // Validate number
         if (!new RegExp("^[0-9.]*$").test(newVal)) {
            $$(id).setValue(oldVal || "");
         }
      }

      checkboxDefaultValue(state) {
         if (state == 0) {
            $$(this.ids.default).disable();
            $$(this.ids.default).setValue("");
         } else {
            $$(this.ids.default).enable();
         }
      }

      segmentedDecimals(val) {
         if (val == "none") {
            $$(this.ids.decimalOptions).disable();
            $$(this.ids.decimalOptions).hide();
         } else {
            $$(this.ids.decimalOptions).enable();
            $$(this.ids.decimalOptions).show();
         }
      }

      switchValidation(state) {
         if (state) {
            $$(this.ids.validateView).enable();
            $$(this.ids.validateView).show();
         } else {
            $$(this.ids.validateView).disable();
            $$(this.ids.validateView).hide();
         }
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("number");
      }

      isValid() {
         let isValid = super.isValid();

         const values = this.formValues();

         const defaultValue = values["default"];
         let fDefault = 0;
         if (defaultValue !== "") {
            fDefault = parseFloat(defaultValue);
         }

         // if required then default value must be set:
         const required = values["required"];
         if (required) {
            if (defaultValue === "") {
               this.markInvalid(
                  "default",
                  L("If a field is required, you must set a default value.")
               );
               isValid = false;
            }
         }

         // Default Value must be within any min / max value set.
         if (values["validation"]) {
            const minValue = values["validateMinimum"];
            const maxValue = values["validateMaximum"];
            let fmin = 0;
            let fmax = 0;

            if (minValue !== "") {
               fmin = parseFloat(minValue);
            }

            if (maxValue !== "") {
               fmax = parseFloat(maxValue);
            }

            // Default Value must be within any min / max value set.
            if (defaultValue !== "") {
               if (minValue !== "") {
                  if (fDefault < fmin) {
                     this.markInvalid(
                        "default",
                        L(
                           "default value must be within any min / max value setting"
                        )
                     );
                     isValid = false;
                  }
               }

               if (maxValue !== "") {
                  if (fDefault > fmax) {
                     this.markInvalid(
                        "default",
                        L(
                           "default value must be within any min / max value setting"
                        )
                     );
                     isValid = false;
                  }
               }
            }

            // Min / Max values must be appropriate: min <= max
            if (minValue != "" && maxValue != "") {
               if (fmin > fmax) {
                  this.markInvalid(
                     "validateMinimum",
                     L("minimum value must be <= maximum value")
                  );
                  this.markInvalid(
                     "validateMaximum",
                     L("maximum value must be >= minimum value")
                  );
                  isValid = false;
               }
            }
         }

         return isValid;
      }

      populate(field) {
         const ids = this.ids;
         super.populate(field);

         if (field.settings.default === "") {
            $$(ids.defaultCheckbox).setValue(0);
         } else {
            $$(ids.defaultCheckbox).setValue(1);
         }

         if (field.settings.validation === 0) {
            $$(ids.validateView).hide();
         } else {
            $$(ids.validateView).show();
         }

         if (field.settings.typeDecimals === "none") {
            $$(ids.decimalOptions).hide();
            $$(ids.decimalOptions).disable();
         } else {
            $$(ids.decimalOptions).enable();
            $$(ids.decimalOptions).show();
            $$(ids.typeDecimalPlaces).enable();
            $$(ids.typeDecimalPlaces).show();
            $$(ids.typeRounding).enable();
            $$(ids.typeRounding).show();
         }
      }
   }

   return ABFieldNumberProperty;
}
