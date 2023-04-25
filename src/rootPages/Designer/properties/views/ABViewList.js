/*
 * ABViewList
 * A Property manager for our ABViewList definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_list";

   const ABView = FABView(AB);
   const L = ABView.L();
   const uiConfig = AB.UISettings.config();

   class ABViewListProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            datacollection: "",
            field: "",
            height: "",
         });
      }

      static get key() {
         return "list";
      }

      ui() {
         // const defaultValues = this.defaultValues();
         const ids = this.ids;

         return super.ui([
            {
               id: ids.datacollection,
               name: "dataviewID",
               view: "richselect",
               label: L("Data Source"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: (dcId, oldDcId) => {
                     if (dcId == oldDcId) return;

                     // Update field options in property
                     this.propertyUpdateFieldOptions(dcId);
                     this.onChange();
                  },
               },
            },
            {
               id: ids.field,
               name: "field",
               view: "richselect",
               label: L("Field"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
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
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      /**
       * @method propertyUpdateFieldOptions
       * Populate fields of object to select list in property
       * @param {string} dvId - id of ABDatacollection
       */
      propertyUpdateFieldOptions(dvId) {
         var datacollection = this.AB.datacollectionByID(dvId);
         var object = datacollection ? datacollection.datasource : null;

         // Pull field list
         var fieldOptions = [];
         if (object != null) {
            fieldOptions = object.fields().map((f) => {
               return {
                  id: f.id,
                  value: f.label,
               };
            });
         }

         const ids = this.ids;
         $$(ids.field).define("options", fieldOptions);
         $$(ids.field).refresh();
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;

         var dcID = view.settings.dataviewID ? view.settings.dataviewID : null;
         var $dc = $$(ids.datacollection);

         // Pull data collections to options
         var dcOptions = view.application.datacollectionsIncluded().map((d) => {
            return {
               id: d.id,
               value: d.label,
               icon:
                  d.sourceType == "query" ? "fa fa-filter" : "fa fa-database",
            };
         });
         $dc.define("options", dcOptions);
         $dc.define("value", dcID);
         $dc.refresh();

         this.propertyUpdateFieldOptions(dcID);

         $$(ids.field).setValue(view.settings.field);
         $$(ids.height).setValue(view.settings.height);
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

         const values = super.values();

         values.settings = $component.getValues();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("list");
      }
   }

   return ABViewListProperty;
}
