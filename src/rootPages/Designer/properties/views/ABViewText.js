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
            height: "",
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
               id: ids.height,
               view: "counter",
               name: "height",
               label: L("Height:"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
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
                     this.onChange();
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

         // insert text to tinymce (which is globally defined)
         // eslint-disable-next-line no-undef
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

         const $dc = $$(ids.dataviewID);

         //// Pull data collections to options

         //// NOTE: only include System Objects if the user has permission
         const datacollectionFilter = this.AB.Account.isSystemDesigner()
            ? () => true
            : (obj) => !obj.isSystemObject;

         const datacollections =
            this.CurrentApplication.datacollectionsIncluded(
               datacollectionFilter
            );
         const options = [
            {
               id: "none",
               value: L("None"),
            },
            ...datacollections.map((e) => {
               return {
                  id: e.id,
                  value: e.label,
                  icon:
                     e.sourceType == "query"
                        ? "fa fa-filter"
                        : "fa fa-database",
               };
            }),
         ];

         $dc.define("options", options);
         $dc.define("value", dataviewID);
         $dc.refresh();

         this.updateFieldOptions(view, dataviewID);

         $$(ids.height).setValue(view.settings.height);
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const values = super.values();

         const ids = this.ids;
         const $component = $$(ids.component);

         values.settings = $component.getValues();
         if (values.settings.dataviewID == "none")
            values.settings.dataviewID = null;

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
