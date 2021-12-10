/*
 * ABFieldNumber
 * A Property manager for our ABFieldNumber.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var ABField = FFieldClass(AB);

   class ABFieldNumberProperty extends ABField {
      constructor() {
         var base = "properties_abfield_number";

         super(base, {
            default: "",
            decimalOptions: "",
            typeDecimalPlaces: "",
            typeRounding: "",
            validate: "",
            validateMinimum: "",
            validateMaximum: "",
         });
      }

      ui() {
         var FC = this.FieldClass();
         var ids = this.ids;
         return super.ui([
            // {
            //    view: "text",
            //    name:'textDefault',
            //    labelWidth: App.config.labelWidthXLarge,
            //    placeholder: L('ab.dataField.string.default', '*Default text')
            // },
            // {
            //    view: "checkbox",
            //    id: ids.allowRequired,
            //    name: "allowRequired",
            //    labelRight: L("ab.dataField.number.required", "*Required"),
            //    disallowEdit: true,
            //    labelWidth: 0,
            //    on: {
            //       onChange: (newVal, oldVal) => {
            //          // when require number, then should have default value
            //          if (newVal && !$$(ids.default).getValue()) {
            //             $$(ids.default).setValue('0');
            //          }
            //       }
            //    }
            // },
            {
               view: "text",
               label: L("Default"),
               labelWidth: uiConfig.labelWidthXLarge,
               id: ids.default,
               name: "default",
               placeholder: L("Enter default value"),
               labelPosition: "top",
               on: {
                  onChange: function (newVal, oldVal) {
                     // Validate number
                     if (!new RegExp("^[0-9.]*$").test(newVal)) {
                        // $$(componentIds.default).setValue(oldVal);
                        this.setValue(oldVal);
                     }
                     // when require number, then should have default value
                     // else if ($$(ids.allowRequired).getValue() && !newVal) {
                     //    this.setValue('0');
                     // }
                  },
                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
            },
            {
               view: "richselect",
               name: "typeFormat",
               label: L("Format"),
               value: "none",
               labelWidth: uiConfig.labelWidthXLarge,
               options: FC.formatList(),
               on: {
                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
            },
            {
               view: "richselect",
               name: "typeDecimals",
               disallowEdit: true,
               label: L("Decimals"),
               value: "none",
               labelWidth: uiConfig.labelWidthXLarge,
               options: FC.delimiterList(),
               on: {
                  onChange: function (newValue /*, oldValue */) {
                     if (newValue == "none") {
                        $$(ids.decimalOptions).hide();
                        $$(ids.typeDecimalPlaces).disable();
                        $$(ids.typeRounding).disable();
                        $$(ids.typeDecimalPlaces).hide();
                        $$(ids.typeRounding).hide();
                     } else {
                        $$(ids.typeDecimalPlaces).enable();
                        $$(ids.typeRounding).enable();
                        $$(ids.typeDecimalPlaces).show();
                        $$(ids.typeRounding).show();
                        $$(ids.decimalOptions).show();
                     }
                  },
                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
            },
            {
               // show these options as sub optionsof our "typeDecimals"
               id: ids.decimalOptions,
               cols: [
                  { width: 20 },
                  {
                     rows: [
                        {
                           view: "richselect",
                           id: ids.typeDecimalPlaces,
                           name: "typeDecimalPlaces",
                           disallowEdit: true,
                           label: L("Places"),
                           value: "none",
                           labelWidth: uiConfig.labelWidthXLarge,
                           disabled: true,
                           hidden: true,
                           options: [
                              { id: "none", value: "0" },
                              { id: 1, value: "1" },
                              { id: 2, value: "2" },
                              { id: 3, value: "3" },
                              { id: 4, value: "4" },
                              { id: 5, value: "5" },
                              { id: 10, value: "10" },
                           ],
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },

                        {
                           view: "richselect",
                           id: ids.typeRounding,
                           name: "typeRounding",
                           label: L("Rounding"),
                           value: "none",
                           labelWidth: uiConfig.labelWidthXLarge,
                           vertical: true,
                           disabled: true,
                           hidden: true,
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
               view: "richselect",
               name: "typeThousands",
               label: L("Thousands"),
               value: "none",
               labelWidth: uiConfig.labelWidthXLarge,
               vertical: true,
               options: FC.delimiterList(),
               on: {
                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
            },

            {
               view: "checkbox",
               id: ids.validate,
               name: "validation",
               labelWidth: uiConfig.labelWidthCheckbox,
               labelRight: L("Validation"),
               on: {
                  onChange: function (newVal) {
                     if (newVal) {
                        $$(ids.validateMinimum).enable();
                        $$(ids.validateMaximum).enable();
                        $$(ids.validateMinimum).show();
                        $$(ids.validateMaximum).show();
                     } else {
                        $$(ids.validateMinimum).disable();
                        $$(ids.validateMaximum).disable();
                        $$(ids.validateMinimum).hide();
                        $$(ids.validateMaximum).hide();
                     }
                  },

                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
            },
            {
               view: "text",
               id: ids.validateMinimum,
               name: "validateMinimum",
               label: L("Minimum"),
               labelWidth: uiConfig.labelWidthXLarge,
               disabled: true,
               hidden: true,
               on: {
                  onChange: function (newVal, oldVal) {
                     // Validate number
                     if (!new RegExp("^[0-9.]*$").test(newVal)) {
                        $$(ids.validateMinimum).setValue(oldVal || "");
                     }
                  },

                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
            },
            {
               view: "text",
               id: ids.validateMaximum,
               name: "validateMaximum",
               label: L("Maximum"),
               labelWidth: uiConfig.labelWidthXLarge,
               disabled: true,
               hidden: true,
               on: {
                  onChange: function (newVal, oldVal) {
                     // Validate number
                     if (!new RegExp("^[0-9.]*$").test(newVal)) {
                        $$(ids.validateMaximum).setValue(oldVal || "");
                     }
                  },

                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
            },
         ]);
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
         var isValid = super.isValid();

         var values = this.formValues();

         var defaultValue = values["default"];
         var fDefault = 0;
         if (defaultValue !== "") {
            fDefault = parseFloat(defaultValue);
         }

         // if required then default value must be set:
         var required = values["required"];
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
            var minValue = values["validateMinimum"];
            var maxValue = values["validateMaximum"];
            var fmin = 0;
            var fmax = 0;

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
         var ids = this.ids;
         super.populate(field);

         if (field.settings.validation) {
            $$(ids.validateMinimum).enable();
            $$(ids.validateMaximum).enable();
         } else {
            $$(ids.validateMinimum).disable();
            $$(ids.validateMaximum).disable();
         }

         if (field.settings.typeDecimals == "none") {
            $$(ids.decimalOptions).hide();
            $$(ids.typeDecimalPlaces).disable();
            $$(ids.typeRounding).disable();
            $$(ids.typeDecimalPlaces).hide();
            $$(ids.typeRounding).hide();
         } else {
            $$(ids.typeDecimalPlaces).enable();
            $$(ids.typeRounding).enable();
            $$(ids.typeDecimalPlaces).show();
            $$(ids.typeRounding).show();
            $$(ids.decimalOptions).show();
         }
      }
   }

   return ABFieldNumberProperty;
}
