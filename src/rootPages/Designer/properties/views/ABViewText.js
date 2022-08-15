/*
 * ABViewText
 * A Property manager for our ABViewTab definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_text";

   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   class ABViewTextProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            dataviewID: "",
            field: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "text";
      }

      ui() {
         const ids = this.ids;
         const self = this;

         return super.ui([
            {
               view: "counter",
               name: "height",
               label: L("Height:"),
               labelWidth: uiConfig.labelWidthLarge,
            },
            {
               id: ids.dataviewID,
               name: "dataviewID",
               view: "richselect",
               label: L("Data Source"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: (newValue) => {
                     self.selectSource(newValue);
                  },
               },
            },
            {
               id: ids.field,
               name: "field",
               view: "list",
               maxHeight: 322,
               template: "#label#",
               on: {
                  onItemClick: function (id) {
                     const field = this.getItem(id);

                     self.selectField(field);
                  },
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      selectSource(dataviewID) {
         const currentView = this.CurrentView;

         // Update field options in property
         this.updateFieldOptions(currentView, dataviewID);
      }

      selectField(field) {
         const format = `{${field.label}}`;

         // insert text to tinymce
         tinymce.activeEditor.execCommand("mceInsertContent", false, format);
      }

      updateFieldOptions(view, dataviewID) {
         const ids = this.ids;
         const datacollection =
            view.AB.datacollectionByID(dataviewID) ??
            view.AB.datacollectionByID(view.parent.settings.dataviewID) ??
            null;

         if (view.parent.key === "dataview")
            dataviewID = view.parent.settings.dataviewID;

         const $dataviewID = $$(ids.dataviewID);
         const $field = $$(ids.field);

         $dataviewID.setValue(dataviewID);

         if (!datacollection) {
            $field.clearAll();

            return;
         }

         const object = datacollection?.datasource ?? null;

         // Pull field list
         $field.clearAll();

         if (object) $field.parse(object.fields());

         $field.refresh();
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;

         const dataviewID = view.settings.dataviewID ?? "none";

         const $dataviewID = $$(ids.dataviewID);

         // Pull data collections to options
         const applicationLoad = this.CurrentApplication;

         // / NOTE: only include System Objects if the user has permission
         const datacollectionFilter = this.AB.Account.isSystemDesigner()
            ? (obj) => !obj.isSystemObject
            : () => true;

         const datacollections =
            applicationLoad.datacollectionsIncluded(datacollectionFilter);
         const options = [
            {
               id: "none",
               value: "None",
            },
            ...datacollections.map((e) => {
               return {
                  id: e.id,
                  value: e.label,
               };
            }),
         ];

         $dataviewID.define("options", options);
         $dataviewID.define("value", dataviewID);
         $dataviewID.refresh();

         this.updateFieldOptions(view, dataviewID);

         const $component = $$(ids.component);

         const values = $component.getValues();

         for (const key in view.settings)
            values[key] = values[key] || view.settings[key];

         $component.setValues(values);
      }

      defaultValues() {
         const ViewClass = this.ViewClass();

         let values = null;

         if (ViewClass) {
            values = ViewClass.defaultValues();
         }

         return values;
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const ids = this.ids;

         const $component = $$(ids.component);

         const values = {};

         values.settings = $component.getValues();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("text");
      }
   }

   return ABViewTextProperty;
}
