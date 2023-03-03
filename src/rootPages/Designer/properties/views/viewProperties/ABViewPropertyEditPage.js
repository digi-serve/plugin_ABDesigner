import UI_Class from "../../../ui_class";

let myClass = null;

export default function (AB, idBase) {
   if (!myClass) {
      const base = `${idBase}_viewpropertyeditpage`;
      const UIClass = UI_Class(AB);
      const L = UIClass.L();

      myClass = class ABViewPropertyEditPage extends UIClass {
         /**
          * @property default
          * return default settings
          *
          * @return {Object}
          */
         static get default() {
            return {
               editForm: "none", // The url pointer of ABViewForm
            };
         }

         constructor() {
            // base: {string} unique base id reference

            super(base, {
               formEdit: "",
            });

            this.AB = AB;
         }

         ui() {
            const ids = this.ids;

            return {
               id: ids.formEdit,
               name: "editForm",
               view: "richselect",
               label: L("Edit Form"),
               labelWidth: this.AB.UISettings.config().labelWidthXLarge,
               on: {
                  onChange: (newVal, oldVal) => {
                     if (newVal == L("No add new option")) {
                        $$(ids.formEdit).setValue("");
                     }
                     this.emit("change");
                  },
               },
            };
         }

         setSettings(view, settings = {}) {
            if (view == null) return;

            // Set the options of the possible edit forms
            const editForms = [
               {
                  id: "none",
                  value: L("No add new option"),
               },
            ];

            (view.pageRoot().pages(() => true, true) ?? []).forEach((p) => {
               if (!p) return;

               p.views(() => true, true).forEach((v) => {
                  if (
                     v?.key == "form" &&
                     v?.datacollection?.datasource?.id ==
                        view.field().settings.linkObject
                  ) {
                     editForms.push({
                        id: v.urlPointer(),
                        value: `${p.label} - ${v.label}`,
                     });
                  }
               });
            });

            const $selector = $$(this.ids.formEdit);
            if ($selector) {
               $selector.define("options", editForms);
               $selector.define(
                  "value",
                  settings.editForm ?? this.constructor.default.editForm
               );
               $selector.refresh();
            }
         }

         getSettings(view) {
            const settings = view.settings || {};

            const $selector = $$(this.ids.formEdit);
            const $selectPopup = $selector.getPopup();
            const selectedItem = ($selectPopup.config.body.data ?? []).filter(
               (opt) => opt.id == $selector.getValue()
            )[0];
            if (selectedItem) {
               settings.editForm = selectedItem.id; // The url pointer of ABViewForm
            }

            return settings;
         }
      };
   }

   return myClass;
}
