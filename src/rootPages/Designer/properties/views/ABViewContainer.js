/*
 * ABViewContainer
 * A Generic Property manager for views that are ABViewContainers.
 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import FABView from "./ABView";

const ABViewContainerDefaults = {
   columns: 1,
   // {int}
   // The number of columns this view is broken up into.

   gravity: 1,
   // {int}
   // the gravity or weight of the column relative to other columns.
   // the higher the number, the wider the space relative to other columns.
   // so a gravity of 2 will be twice as wide as a gravity of 1.
};

export default function (AB) {
   if (!myClass) {
      const uiConfig = AB.Config.uiSettings();
      const ABView = FABView(AB);
      var L = ABView.L();

      myClass = class ABViewContainerProperty extends ABView {
         constructor(base = "properties_abview_container", ids = {}) {
            // base: {string} unique base id reference
            // ids: {hash}  { key => '' }
            // this is provided by the Sub Class and has the keys
            // unique to the Sub Class' interface elements.

            var common = {
               columns: "",
               gravity: "",
            };

            Object.keys(ids).forEach((k) => {
               if (typeof common[k] != "undefined") {
                  console.error(
                     `!!! ABViewContainerProperty:: passed in ids contains a restricted id : ${k}`
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

            let _elements = [
               {
                  id: ids.columns,
                  name: "columns",
                  view: "counter",
                  min: 1,
                  label: L("Columns"),
                  labelWidth: uiConfig.labelWidthXLarge,
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal > 8) $$(ids.columns).setValue(8);

                        let $grav = $$(ids.gravity);
                        let addCounter = (counterNum) => {
                           var pos = $grav.getParentView().index($grav);
                           $grav.getParentView().addView(
                              {
                                 view: "counter",
                                 value: "1",
                                 min: 1,
                                 label: L("Column {0} Gravity", [counterNum]),
                                 labelWidth: uiConfig.labelWidthXLarge,
                                 css: "gravity_counter",
                                 on: {
                                    onChange: () => {
                                       this.onChange();
                                    },
                                 },
                              },
                              pos
                           );
                        };

                        function removeCounter() {
                           $grav
                              .getParentView()
                              .removeView(
                                 $grav.getParentView().getChildViews()[
                                    $grav.getParentView().index($grav) - 1
                                 ]
                              );
                        }

                        if (newVal > oldVal) {
                           // Add a Gravity Counter

                           // SPECIAL CASE:
                           // we are now hiding the gravity counter if only
                           // 1 column.  So be sure to show the hidden counter
                           // when switching to 2:
                           if (newVal == 2) {
                              addCounter(1);
                           }

                           addCounter(newVal);
                        } else if (newVal < oldVal) {
                           // Remove a gravity counter
                           removeCounter();

                           // SPECIAL CASE
                           // if we go back to 1 column, hide them all
                           if (newVal == 1) {
                              removeCounter();
                           }
                        }

                        this.onChange();
                     },
                  },
               },
               {
                  id: ids.gravity,
                  view: "text",
                  name: "gravity",
                  height: 1,
               },
            ];

            _elements = _elements.concat(elements);

            // Object.keys(rules).forEach((r) => {
            //    _ui.rules[r] = rules[r];
            // });

            return super.ui(_elements, rules);
         }

         //          async init(AB) {
         //             this.AB = AB;

         //             var VC = this.ViewClass();
         //             if (VC) {

         // // TODO:
         //                $$(this.ids.fieldDescription).define(
         //                   "label",
         //                   L(FC.defaults().description)
         //                );
         //             } else {
         //                $$(this.ids.fieldDescription).hide();

         //             }
         //          }

         clear() {}

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
          * @function populate
          * populate the property form with the given ABField instance provided.
          * @param {ABField} field
          *        The ABFieldXXX instance that we are editing the settings for.
          */
         populate(view) {
            super.populate(view);
            let ids = this.ids;

            let $col = $$(ids.columns);
            $col?.setValue(
               view.settings.columns || ABViewContainerDefaults.columns
            );

            // remove all the gravity counters:
            let $grav = $$(ids.gravity);
            $grav
               .getParentView()
               .queryView({ css: "gravity_counter" }, "all")
               .map((counter) => $grav.getParentView().removeView(counter));

            let numCol = $col.getValue();

            if (numCol > 1) {
               // now add gravity counters for the number of columns we have
               for (var step = 1; step <= numCol; step++) {
                  var pos = $grav.getParentView().index($grav);
                  $grav.getParentView().addView(
                     {
                        view: "counter",
                        min: 1,
                        label: L("Column {0} Gravity", [step]),
                        labelWidth: uiConfig.labelWidthXLarge,
                        css: "gravity_counter",
                        value:
                           view.settings.gravity &&
                           view.settings.gravity[step - 1]
                              ? view.settings.gravity[step - 1]
                              : ABViewContainerDefaults.gravity,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                     pos
                  );
               }
            }
         }

         requiredOnChange() {
            // Sub Class should overwrite this if it is necessary.
         }

         // show() {
         //    super.show();
         //    // AppList.show();
         // }

         /**
          * @method values
          * return the values for this form.
          * @return {obj}
          */
         values() {
            let vals = super.values();
            vals.settings = {};
            vals.settings.columns = $$(this.ids.columns).getValue();

            var gravity = [];
            $$(this.ids.gravity)
               .getParentView()
               .queryView({ css: "gravity_counter" }, "all")
               .map((counter) => gravity.push($$(counter).getValue()));
            vals.settings.gravity = gravity;

            return vals;
         }

         /**
          * @method ViewClass()
          * A method to return the proper ABViewXXX Definition.
          * NOTE: Must be overwritten by the Child Class
          */
         // ViewClass() {
         //    console.error("!!! Child Class has not overwritten ViewClass()");
         //    return null;
         //    // return super._ViewClass("string");
         // }

         // _ViewClass(key) {
         //    var app = this.CurrentApplication;
         //    if (!app) {
         //       app = this.AB.applicationNew({});
         //    }
         //    return app.viewAll((V) => V.common().key == key)[0];
         // }
      };
   }
   return myClass;
}
