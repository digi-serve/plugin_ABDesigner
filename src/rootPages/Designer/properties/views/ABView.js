/*
 * ABView
 * A Generic Property manager for All our ABViews.
 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

export default function (AB) {
   if (!myClass) {
      // const uiConfig = AB.Config.uiSettings();
      // var L = function (...params) {
      //    return AB.Multilingual.labelPlugin("ABDesigner", ...params);
      // };

      myClass = class ABViewProperty extends AB.ClassUI {
         constructor(base = "properties_abview", ids = {}) {
            // base: {string} unique base id reference
            // ids: {hash}  { key => '' }
            // this is provided by the Sub Class and has the keys
            // unique to the Sub Class' interface elements.

            var common = {
               component: `${base}_component`,
               /*
// TODO:
               // the common property fields
               label: `${base}_label`,
               columnName: `${base}_columnName`,
               fieldDescription: `${base}_fieldDescription`,
               showIcon: `${base}_showIcon`,
               required: `${base}_required`,
               numberOfNull: `${base}_numberOfNull`,
               unique: `${base}_unique`,
               filterComplex: `${base}_filtercomplex`,
               addValidation: `${base}_addvalidation`,
               shorthand: `${base}_shorthand`,
               validationRules: `${base}_validationRules`,
*/
            };

            Object.keys(ids).forEach((k) => {
               if (typeof common[k] != "undefined") {
                  console.error(
                     `!!! ABFieldProperty:: passed in ids contains a restricted field : ${k}`
                  );
                  return;
               }
               common[k] = `${base}_${k}`;
            });

            super(common);

            this.base = base;
            this.AB = AB;

            this.currentApplicationID = null;
            // {string}
            // The current ABApplication.id being edited in our ABDesigner.

            this.currentObjectID = null;
            // {string}
            // The current ABObject.id being edited in our object workspace.
         }

         ui(elements = []) {
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
            return {};
         }

         async init(AB) {
            this.AB = AB;

            var FC = this.FieldClass();
            if (FC) {
               /*
// TODO:
               $$(this.ids.fieldDescription).define(
                  "label",
                  L(FC.defaults().description)
               );
            } else {
               $$(this.ids.fieldDescription).hide();
*/
            }
         }

         applicationLoad(appID) {
            this.currentApplicationID = appID;
         }

         clearEditor() {
            console.error("!!! Depreciated! call clear() instead.");
            this.clear();
         }

         clear() {
            /*
// TODO:
            var ids = this.ids;
            this._CurrentField = null;

            var defaultValues = this.defaultValues();

            for (var f in defaultValues) {
               var component = $$(ids[f]);
               if (component) component.setValue(defaultValues[f]);
            }

            // reset the validation rules UI
            var filterViews = $$(ids.filterComplex).queryView(
               {
                  view: "form",
                  css: "abValidationForm",
               },
               "all"
            );
            if (filterViews.length) {
               filterViews.forEach((v) => {
                  $$(ids.filterComplex).removeView(v);
               });
            }

            $$(ids.addValidation).hide();

            // hide warning message of null data
            $$(ids.numberOfNull).hide();
*/
         }

         get currentApplication() {
            return this.AB.applicationByID(this.currentApplicationID);
         }

         get currentObject() {
            return this.AB.objectByID(this.currentObjectID);
         }

         /**
          * @method defaults()
          * Return the ViewClass() default values.
          * NOTE: the child class MUST implement ViewClass() to return the
          * proper ABViewXXX class definition.
          * @return {obj}
          */
         defaults() {
            var ViewClass = this.ViewClass();
            if (!ViewClass) {
               console.error(
                  "!!! properties/views/ABView: could not find ViewClass"
               );
               return null;
            }
            return ViewClass.common();
         }

         editorPopulate(field) {
            console.error("!!! Depreciated. call populate() instead.");
            this.populate(field);
         }

         formValues() {
            return $$(this.ids.component).getValues();
         }

         /**
          * @method isValid()
          * Verify the common ABField settings are valid before allowing
          * us to create the new field.
          * @return {bool}
          */
         isValid() {
            /*
// TODO:
            var ids = this.ids;
            var isValid = $$(ids.component).validate(),
               colName = this.formValues()["columnName"];

            // validate reserve column names
            var FC = this.FieldClass();
            if (!FC) {
               this.AB.notify.developer(
                  new Error("Unable to resolve FieldClass"),
                  {
                     context: "ABFieldProperty: isValid()",
                     base: this.ids.component,
                  }
               );
            }

            // columnName should not be one of the reserved names:
            if (FC?.reservedNames.indexOf(colName.trim().toLowerCase()) > -1) {
               this.markInvalid("columnName", L("This is a reserved name"));
               isValid = false;
            }

            // columnName should not be in use by other fields on this object
            // get All fields with matching colName
            var fieldColName = this.currentObject?.fields(
               (f) => f.columnName == colName
            );
            // ignore current edit field
            if (this._CurrentField) {
               fieldColName = fieldColName.filter(
                  (f) => f.id != this._CurrentField.id
               );
            }
            // if any more matches, this is a problem
            if (fieldColName.length > 0) {
               this.markInvalid(
                  "columnName",
                  L("This column name is in use by another field ({0})", [
                     fieldColName.label,
                  ])
               );
               isValid = false;
            }

            return isValid;
*/
         }

         markInvalid(name, message) {
            $$(this.ids.component).markInvalid(name, message);
         }

         objectLoad(objectID) {
            this.currentObjectID = objectID;
         }

         /**
          * @function populate
          * populate the property form with the given ABField instance provided.
          * @param {ABField} field
          *        The ABFieldXXX instance that we are editing the settings for.
          */
         populate(/* field */) {
            /*
// TODO:
            var ids = this.ids;
            this._CurrentField = field;

            // these columns are located on the base ABField object
            ["label", "columnName"].forEach((c) => {
               $$(ids[c]).setValue?.(field[c]);
            });
            $$(ids.fieldDescription).setValue(field.fieldDescription());

            // the remaining columns are located in .settings
            Object.keys(ids).forEach((c) => {
               if (typeof field.settings[c] != "undefined") {
                  $$(ids[c])?.setValue?.(field.settings[c]);
               }
            });
            $$(ids.label).setValue(field.label);
            $$(ids.columnName).setValue(field.columnName);
            $$(ids.showIcon).setValue(field.settings.showIcon);
            $$(ids.required).setValue(field.settings.required);
            $$(ids.unique).setValue(field.settings.unique);

            if (this._CurrentField) {
               $$(ids.addValidation).show();
            }

            if (field.settings && field.settings.validationRules) {
               var rules = field.settings.validationRules;
               if (typeof rules == "string") {
                  try {
                     rules = JSON.parse(rules);
                  } catch (e) {
                     this.AB.notify.builder(e, {
                        context: `ABField[${field.id}][${field.name}]: has invalid validationRules`,
                        validationRules: field.settings.validationRules,
                     });
                     // so ... now what?
                     rules = [];
                  }
               }
               (rules || []).forEach((settings) => {
                  field.addValidation(ids, settings);
               });
            }
*/
         }

         requiredOnChange() {
            // Sub Class should overwrite this if it is necessary.
         }

         // show() {
         //    super.show();
         //    // AppList.show();
         // }

         /*
          * @function values
          *
          * return the values for this form.
          * @return {obj}
          */
         values() {
            /*
// TODO:
            var ids = this.ids;

            var settings = $$(ids.component).getValues();
            if ($$(ids.filterComplex)) {
               var validationRules = [];
               var forms = $$(ids.filterComplex).queryView(
                  { view: "form", css: "abValidationForm" },
                  "all"
               );
               forms.forEach((form) => {
                  var rules = form
                     .queryView({ view: "querybuilder" })
                     .getValue();
                  var invalidMessage = form
                     .queryView({ name: "invalidMessage" })
                     .getValue();
                  var validationObj = {
                     invalidMessage: invalidMessage,
                     rules: rules,
                  };
                  validationRules.push(validationObj);
               });
               settings.validationRules = JSON.stringify(validationRules);
            }

            var FC = this.FieldClass();

            // convert flat settings into our ABField value format:
            var values = FC.editorValues(settings);

            values.key = FC.defaults().key;

            return values;
*/
            return {};
         }

         /**
          * @method FieldClass()
          * A method to return the proper ABFieldXXX Definition.
          * NOTE: Must be overwritten by the Child Class
          */
         ViewClass() {
            console.error("!!! Child Class has not overwritten FieldClass()");
            return null;
            // return super._FieldClass("string");
         }

         _ViewClass(key) {
            var app = this.CurrentApplication;
            if (!app) {
               app = this.AB.applicationNew({});
            }
            return app.viewAll((V) => V.common().key == key)[0];
         }
      };
   }
   return myClass;
}
