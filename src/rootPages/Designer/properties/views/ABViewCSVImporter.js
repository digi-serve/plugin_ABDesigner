/*
 * ABViewCSVImporter
 * A Property manager for our ABViewCSVImporter widget
 */

import FViewClass from "./ABView";

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var ABViewClassProperty = FViewClass(AB);

   class ABViewCSVImporterProperty extends ABViewClassProperty {
      constructor() {
         super("properties_abview", {
            // Put our ids here
         });
      }

      ui() {
         /*
// TODO: this is still from ABField.js

            var ids = this.ids;

            var FC = this.FieldClass();

            var _ui = {
               view: "form",
               id: ids.component,
               autoheight: true,
               borderless: true,
               elements: [
                  // {
                  //    view: "label",
                  //    label: "<span class='webix_icon fa fa-{0}'></span>{1}".replace('{0}', Field.icon).replace('{1}', Field.menuName)
                  // },
                  {
                     view: "text",
                     id: ids.label,
                     name: "label",
                     label: L("Label"),
                     placeholder: L("Label"),
                     labelWidth: uiConfig.labelWidthLarge,
                     css: "ab-new-label-name",
                     on: {
                        onChange: function (newVal, oldVal = "") {
                           // update columnName when appropriate
                           if (
                              newVal != oldVal &&
                              oldVal == $$(ids.columnName).getValue() &&
                              $$(ids.columnName).isEnabled()
                           ) {
                              $$(ids.columnName).setValue(newVal);
                           }
                        },
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "text",
                     id: ids.columnName,
                     name: "columnName",
                     disallowEdit: true,
                     label: L("Field Name"),
                     labelWidth: uiConfig.labelWidthLarge,
                     placeholder: L("Database field name"),
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "label",
                     id: ids.fieldDescription,
                     label: L("Description"), // Field.description,
                     align: "right",
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     id: ids.showIcon,
                     name: "showIcon",
                     labelRight: L("show icon?"),
                     labelWidth: uiConfig.labelWidthCheckbox,
                     value: true,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     id: ids.required,
                     name: "required",
                     hidden: !FC.defaults().supportRequire,
                     labelRight: L("Required"),
                     // disallowEdit: true,
                     labelWidth: uiConfig.labelWidthCheckbox,
                     on: {
                        onChange: (newVal, oldVal) => {
                           this.requiredOnChange(newVal, oldVal, ids);

                           // If check require on edit field, then show warning message
                           this.getNumberOfNullValue(newVal);
                        },
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  // warning message: number of null value rows
                  {
                     view: "label",
                     id: ids.numberOfNull,
                     css: { color: "#f00" },
                     label: "",
                     hidden: true,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     id: ids.unique,
                     name: "unique",
                     hidden: !FC.defaults().supportUnique,
                     labelRight: L("Unique"),
                     disallowEdit: true,
                     labelWidth: uiConfig.labelWidthCheckbox,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.filterComplex,
                     rows: [],
                  },
                  {
                     id: ids.addValidation,
                     view: "button",
                     label: L("Add Field Validation"),
                     css: "webix_primary",
                     click: () => {
                        this.addValidation();
                     },
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  // have a hidden field to contain the validationRules
                  // value we will parse out later
                  {
                     id: ids.validationRules,
                     view: "text",
                     hidden: true,
                     name: "validationRules",
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],

               rules: {
                  label: webix.rules.isNotEmpty,
                  columnName: webix.rules.isNotEmpty,
               },
            };

            // Add our passed in elements:
            elements.forEach((e) => {
               // passed in elements might not have their .id
               // set, but have a .name. Let's default id =
               if (!e.id && e.name) {
                  if (!this.ids[e.name]) {
                     this.ids[e.name] = `${this.base}_${e.name}`;
                  }
                  e.id = this.ids[e.name];
               }
               _ui.elements.push(e);
            });

            return _ui;
*/

         return super.ui([]);
      }

      async init(AB) {
         return super.init(AB);
      }

      defaultValues() {
         var values = {
            dataviewID: null,
            buttonLabel: "Upload CSV",
            width: 0,
            recordRules: [],
         };

         var FieldClass = this.ViewClass();
         if (FieldClass) {
            var fcValues = FieldClass.defaultValues();
            Object.keys(fcValues).forEach((k) => {
               values[k] = fcValues[k];
            });
         }

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABFieldXXX Definition.
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

   return new ABViewCSVImporterProperty();
}
