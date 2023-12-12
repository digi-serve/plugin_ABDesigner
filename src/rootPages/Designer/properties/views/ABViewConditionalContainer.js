/*
 * ABViewConditionalContainer
 * A Property manager for our ABViewConditionalContainer definitions
 */
import FABView from "./ABView";

export default function (AB) {
   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   const idBase = "properties_abview_conditionalcontainer";

   let ABViewPropertyDefaults;

   class ABViewConditionalContainerProperty extends ABView {
      constructor() {
         super(idBase, {
            // Put our ids here
            buttonFilter: "",
            datacollection: "",
         });

         this.AB = AB;
         ABViewPropertyDefaults = this.AB.Class.ABViewManager.viewClass(
            "conditionalcontainer"
         ).defaultValues();
      }

      static get key() {
         return "conditionalcontainer";
      }

      get filterComponent() {
         if (this._filterComponent == null) {
            this._filterComponent = this.AB.filterComplexNew(
               `${idBase}_filter`
            );
         }

         return this._filterComponent;
      }

      ui() {
         this.filterComponent.init();
         this.filterComponent.on("save", (val) => {
            this.onFilterChange(val);
         });

         if (this._filterPopup == null) {
            this._filterPopup = this.AB.Webix.ui({
               view: "popup",
               width: 800,
               hidden: true,
               body: this.filterComponent.ui,
            });
         }

         return super.ui([
            {
               id: this.ids.datacollection,
               name: "datacollection",
               view: "richselect",
               label: L("Data Source"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: (dvId) => {
                     this.changeDatacollection(dvId);
                  },
               },
            },
            {
               view: "fieldset",
               name: "filter",
               label: L("Filter:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Filter Data:"),
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              id: this.ids.buttonFilter,
                              view: "button",
                              name: "buttonFilter",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              css: "webix_primary",
                              autowidth: true,
                              badge: 0,
                              click: () => {
                                 const $button = $$(this.ids.buttonFilter);
                                 this.showFilterPopup($button?.$view);
                              },
                           },
                        ],
                     },
                  ],
               },
            },
         ]);
      }

      populate(view) {
         super.populate(view);
         if (!view) return;

         const ids = this.ids;

         // this.filterComponent.applicationLoad(view.application);
         const SourceSelector = $$(ids.datacollection);

         // Pull data collections to options
         const dcOptions = view.application
            .datacollectionsIncluded()
            .map((dc) => {
               let icon = "fa-database";
               if (dc.sourceType === "query") {
                  icon = "fa-filter";
               }
               return {
                  id: dc.id,
                  value: `<i class="fa ${icon}"></i> ${dc.label}`,
               };
            });
         SourceSelector.define("options", dcOptions);
         SourceSelector.define("value", view?.settings?.dataviewID ?? null);
         SourceSelector.refresh();
         if (view?.settings?.filterConditions) {
            this.filterComponent.setValue(view.settings.filterConditions);
         }
         this.populatePopupEditors(view);
      }

      defaultValues() {
         let values = {};
         const ViewClass = this.ViewClass();
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
         const filterValues = this.filterComponent.getValue();

         const vals = super.values();
         vals.settings = vals.settings ?? {};
         vals.settings.dataviewID = $$(ids.datacollection).getValue();
         vals.settings.filterConditions = filterValues;
         return vals;
      }

      /**
       * @method ViewClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("conditionalcontainer");
      }

      changeDatacollection(dcId) {
         const view = this.CurrentView;

         this.populatePopupEditors(view, dcId);

         // clear filter condition
         this.filterComponent.setValue(ABViewPropertyDefaults.filterConditions);

         this.onChange();

         this.populateBadgeNumber(view);
      }

      showFilterPopup($view) {
         this._filterPopup.show($view, { pos: "bottom" });
      }

      hideFilterPopup() {
         this._filterPopup.hide();
      }

      onFilterChange() {
         // Update .settings values
         this.values();

         const filterValues = this.filterComponent.getValue();

         // only perform the update if a complete row is specified:
         if (this.filterComponent.isConditionComplete(filterValues)) {
            this.hideFilterPopup();

            // we want to call .save() but give webix a chance to properly update it's
            // select boxes before this call causes them to be removed:
            setTimeout(() => {
               this.onChange();

               const view = this.CurrentView;
               this.populateBadgeNumber(view);
            }, 10);
         }
      }

      populatePopupEditors(view, datacollectionId) {
         // pull current data collection
         let dc = view.datacollection;

         // specify data collection id
         if (datacollectionId) {
            dc = view.AB.datacollectionByID(datacollectionId);
         }

         if (dc?.datasource) {
            this.filterComponent.fieldsLoad(dc.datasource.fields());
         } else {
            this.filterComponent.fieldsLoad();
         }

         this.filterComponent.setValue(
            view.settings.filterConditions ??
               ABViewPropertyDefaults.filterConditions
         );

         this.populateBadgeNumber(view);
      }

      populateBadgeNumber(view) {
         const ids = this.ids;
         const $buttonFilter = $$(ids.buttonFilter);
         const count = view?.settings?.filterConditions?.rules?.length || null;
         $buttonFilter.define("badge", count);
         $buttonFilter.refresh();
      }
   }

   return ABViewConditionalContainerProperty;
}
