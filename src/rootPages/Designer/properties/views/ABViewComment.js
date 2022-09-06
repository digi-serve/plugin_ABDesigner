/*
 * ABViewComment
 * A Property manager for our ABViewTab definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_comment";

   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   class ABViewCommentProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            dataviewID: "",
            columnUser: "",
            columnComment: "",
            columnDate: "",
            height: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "comment";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.dataviewID,
               view: "richselect",
               name: "dataviewID",
               label: L("Data Source"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: (newValue) => {
                     this.selectSource(newValue);
                  },
               },
            },
            {
               id: ids.columnUser,
               view: "richselect",
               name: "columnUser",
               label: L("Select a user field"),
               labelWidth: uiConfig.labelWidthLarge,
            },
            {
               id: ids.columnComment,
               view: "richselect",
               name: "columnComment",
               label: L("Select a comment field"),
               labelWidth: uiConfig.labelWidthLarge,
            },
            {
               id: ids.columnDate,
               view: "richselect",
               name: "columnDate",
               label: L("Select a date field"),
               labelWidth: uiConfig.labelWidthLarge,
            },
            {
               id: ids.height,
               view: "counter",
               name: "height",
               label: L("Height:"),
               labelWidth: uiConfig.labelWidthLarge,
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      selectSource(datacollectionID) {
         //  Update field options in property
         this.updateUserFieldOptions(datacollectionID);
         this.updateCommentFieldOptions(datacollectionID);
         this.updateDateFieldOptions(datacollectionID);
      }

      updateDatacollectionOptions(datacollectionID) {
         // Pull data collections to options
         // Load in all the Available Datacollections:
         const datacollections =
            this.CurrentApplication.datacollectionsIncluded().map((e) => {
               return {
                  id: e.id,
                  value: e.label,
                  icon:
                     e.sourceType === "query"
                        ? "fa fa-filter"
                        : "fa fa-database",
               };
            });

         const ids = this.ids;

         $$(ids.dataviewID).define("options", datacollections);
         $$(ids.dataviewID).define("value", datacollectionID);
         $$(ids.dataviewID).refresh();
      }

      updateUserFieldOptions(datacollectionID) {
         const currentView = this.CurrentView;
         const datacollection =
            currentView.AB.datacollectionByID(datacollectionID);
         const object = datacollection ? datacollection.datasource : null;

         // Pull field list
         const fieldOptions = object
            ? object
                 .fields((f) => f.key === "user")
                 .map((f) => {
                    return {
                       id: f.id,
                       value: f.label,
                    };
                 })
            : [];

         // Add a default option
         const defaultOption = { id: null, value: "[Select]" };
         fieldOptions.unshift(defaultOption);

         const ids = this.ids;

         $$(ids.columnUser).define("options", fieldOptions);
         $$(ids.columnUser).refresh();
      }

      updateCommentFieldOptions(datacollectionID) {
         const currentView = this.CurrentView;
         const datacollection =
            currentView.AB.datacollectionByID(datacollectionID);
         const object = datacollection ? datacollection.datasource : null;

         // Pull field list
         const fieldOptions = object
            ? object
                 .fields((f) => f.key === "string" || f.key === "LongText")
                 .map((f) => {
                    return {
                       id: f.id,
                       value: f.label,
                    };
                 })
            : [];

         // Add a default option
         const defaultOption = { id: null, value: "[Select]" };
         fieldOptions.unshift(defaultOption);

         const ids = this.ids;

         $$(ids.columnComment).define("options", fieldOptions);
         $$(ids.columnComment).refresh();
      }

      updateDateFieldOptions(datacollectionID) {
         const currentView = this.CurrentView;
         const datacollection =
            currentView.AB.datacollectionByID(datacollectionID);
         const object = datacollection ? datacollection.datasource : null;

         // Pull field list
         const fieldOptions = object
            ? object
                 .fields((f) => f.key === "date")
                 .map((f) => {
                    return {
                       id: f.id,
                       value: f.label,
                    };
                 })
            : [];

         // Add a default option
         const defaultOption = { id: null, value: "[Select]" };
         fieldOptions.unshift(defaultOption);

         const ids = this.ids;

         $$(ids.columnDate).define("options", fieldOptions);
         $$(ids.columnDate).refresh();
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const datacollectionId = view.settings.dataviewID
            ? view.settings.dataviewID
            : null;

         this.updateDatacollectionOptions(datacollectionId);
         this.updateUserFieldOptions(datacollectionId);
         this.updateCommentFieldOptions(datacollectionId);
         this.updateDateFieldOptions(datacollectionId);

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

         const values = super.values();

         values.settings = $component.getValues();

         // Retrive the values of your properties from Webix and store them in the view

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("comment");
      }
   }

   return ABViewCommentProperty;
}
