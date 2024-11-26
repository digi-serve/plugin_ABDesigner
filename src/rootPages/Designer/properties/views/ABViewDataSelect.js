import FABView from "./ABView";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();
   const BASE_ID = "properties_abview_data_filter";

   const ABView = FABView(AB);
   const L = ABView.L();

   class ABViewDataFilterProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            datacollection: "",
            labelField: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "data-select";
      }

      ui() {
         let ids = this.ids;

         return super.ui([
            {
               id: ids.datacollection,
               name: "dataviewID",
               view: "combo",
               label: L("Datacollection"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: (newVal, oldVal) => {
                     if (newVal != oldVal) {
                        this.onChange();
                        this.populateFields(newVal);
                     }
                  },
               },
            },
            {
               id: ids.labelField,
               name: "labelField",
               view: "combo",
               label: L("Label"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: (newVal, oldVal) => {
                     if (newVal != oldVal) {
                        this.onChange();
                     }
                  },
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      populate(view) {
         let ids = this.ids;
         if (!view) return;

         const $component = $$(ids.component);

         const defaultValues = this.defaultValues();
         let values = $component.getValues();

         // set default values
         for (const key in defaultValues)
            values[key] = defaultValues[key] || values[key];

         // set values saved on server
         for (const key in view.settings)
            values[key] =
               typeof view.settings[key] != "undefined"
                  ? view.settings[key]
                  : values[key];

         let datacollectionId = values.dataviewID ? values.dataviewID : null;
         var $d = $$(ids.datacollection);

         // Pull data collections to options
         var dcOptions = view.application
            .datacollectionsIncluded()
            .map((dc) => {
               return {
                  id: dc.id,
                  value: dc.label,
                  icon:
                     dc.sourceType === "query"
                        ? "fa fa-filter"
                        : "fa fa-database",
               };
            });
         $d.define("options", dcOptions);
         $d.define("value", view.datacollection);
         $d.refresh();

         // if there is a data collection we want to get all connected fields
         if (datacollectionId) {
            this.populateFields(datacollectionId);
         }
         $component.setValues(values);
      }

      populateFields(id) {
         const options = this.AB.datacollectionByID(id)
            .datasource.fields()
            .map((f) => ({ id: f.id, value: f.label }));
         $$(this.ids.labelField).define("options", options);
         $$(this.ids.labelField).refresh();
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
         values.text = values.settings.text;

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("data-select");
      }
   }

   return ABViewDataFilterProperty;
}
