import UI_Class from "../../../ui_class";

let myClass = null;

export default function (AB, idBase) {
   if (!myClass) {
      const base = `${idBase}_viewpropertyaddpage`;
      const UIClass = UI_Class(AB);
      const L = UIClass.L();

      myClass = class ABViewPropertyAddPage extends UIClass {
         /**
          * @property default
          * return default settings
          *
          * @return {Object}
          */
         static get default() {
            return {
               formView: "none", // id of form to add new data
            };
         }

         constructor() {
            // base: {string} unique base id reference

            super(base, {
               formView: "",
            });

            this.AB = AB;
         }

         ui() {
            const ids = this.ids;

            return {
               id: ids.formView,
               name: "formView",
               view: "richselect",
               label: L("Add New Form"),
               labelWidth: this.AB.UISettings.config().labelWidthXLarge,
               on: {
                  onChange: (newVal, oldVal) => {
                     if (newVal == L("No add new option")) {
                        $$(ids.formView).setValue("");
                     }
                  },
               },
            };
         }

         setSettings(view, settings = {}) {
            if (view == null) return;

            // Set the options of the possible edit forms
            let editForms = [
               {
                  id: "none",
                  value: L("No add new option"),
               },
            ];

            const pagesHasForm = view
               .pageRoot()
               .pages(
                  (p) =>
                     p.views(
                        (v) =>
                           v?.key == "form" &&
                           v?.datacollection?.datasource?.id ==
                              view.field().settings.linkObject,
                        true
                     ).length,
                  true
               )
               .map((p) => {
                  return {
                     id: p.id,
                     value: p.label,
                  };
               });

            editForms = editForms.concat(pagesHasForm);

            const $selector = $$(this.ids.formView);
            if ($selector) {
               $selector.define("options", editForms);
               $selector.define(
                  "value",
                  settings.formView ?? this.constructor.default.formView
               );
               $selector.refresh();
            }
         }

         getSettings(view) {
            const settings = view.settings ?? {};

            settings.formView = $$(this.ids.formView).getValue();

            return settings;
         }
      };
   }

   return myClass;
}
