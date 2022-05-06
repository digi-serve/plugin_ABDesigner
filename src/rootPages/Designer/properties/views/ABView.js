/*
 * ABView
 * A Generic Property manager for All our ABViews.
 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import UI_Class from "../../ui_class";

export default function (AB) {
   if (!myClass) {
      // const uiConfig = AB.Config.uiSettings();
      const UIClass = UI_Class(AB);
      var L = UIClass.L();

      myClass = class ABViewProperty extends UIClass {
         constructor(base = "properties_abview", ids = {}) {
            // base: {string} unique base id reference
            // ids: {hash}  { key => '' }
            // this is provided by the Sub Class and has the keys
            // unique to the Sub Class' interface elements.

            var common = {
               label: "",
            };

            Object.keys(ids).forEach((k) => {
               if (typeof common[k] != "undefined") {
                  console.error(
                     `!!! ABFieldProperty:: passed in ids contains a restricted field : ${k}`
                  );
                  return;
               }
               common[k] = "";
            });

            super(base, common);

            this.base = base;
            this.AB = AB;
         }

         ui(elements = [], rules = {}) {
            let ids = this.ids;

            let _ui = {
               view: "form",
               id: ids.component,
               scroll: true,
               elements: [
                  {
                     id: ids.label,
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     value: "",
                  },
               ],
               rules: {
                  // label: webix.rules.isNotEmpty,
               },
            };

            elements.forEach((e) => {
               _ui.elements.push(e);
            });

            Object.keys(rules).forEach((r) => {
               _ui.rules[r] = rules[r];
            });

            return _ui;
         }

         async init(AB) {
            this.AB = AB;

            var VC = this.ViewClass();
            if (VC) {
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

         clearEditor() {
            console.error("!!! Depreciated! call clear() instead.");
            this.clear();
         }

         clear() {
            $$(this.ids.label).setValue("");
         }

         propertyDatacollections(view) {
            return view.application.datacollectionsIncluded().map((d) => {
               return { id: d.id, value: d.label };
            });
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

         /**
          * @method onChange()
          * emit a "changed" event so our property manager can know
          * there are new values that need saving.
          */
         onChange() {
            this.emit("changed");
         }

         /**
          * @function populate
          * populate the property form with the given ABField instance provided.
          * @param {ABView} view
          *        The ABViewXXX instance that we are editing the settings for.
          */
         populate(view) {
            $$(this.ids.label).setValue(view.label);
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
            let vals = {};
            vals.label = $$(this.ids.label).getValue();
            return vals;
         }

         /**
          * @method ViewClass()
          * A method to return the proper ABViewXXX Definition.
          * NOTE: Must be overwritten by the Child Class
          */
         ViewClass() {
            console.error("!!! Child Class has not overwritten ViewClass()");
            return null;
            // return super._ViewClass("string");
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
