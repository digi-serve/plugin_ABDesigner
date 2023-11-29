/*
 * ABViewList
 * A Property manager for our ABViewList definitions
 */

import FABMobileView from "./ABMobileView";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_list";

   const ABMobileView = FABMobileView(AB);
   const L = ABMobileView.L();
   const uiConfig = AB.UISettings.config();

   class ABViewListProperty extends ABMobileView {
      constructor() {
         super(BASE_ID, {
            datacollection: "",
            field: "",
            height: "",
            hideTitle: "",
            linkPageAdd: "",
            linkPageDetail: "",
         });
      }

      static get key() {
         return "mobile-list";
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
            {
               id: ids.hideTitle,
               view: "checkbox",
               name: "hideTitle",
               label: L("Hide Title:"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               view: "fieldset",
               label: L("Linked Pages:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.linkPageAdd,
                        view: "combo",
                        clear: true,
                        placeholder: L("No linked view"),
                        name: "linkPageAdd",
                        label: L("Add Page:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: () => this.onChange(),
                        },
                     },
                     {
                        id: ids.linkPageDetail,
                        view: "combo",
                        clear: true,
                        placeholder: L("No linked view"),
                        name: "linkPageDetail",
                        label: L("Edit/Detail Page:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: () => this.onChange(),
                        },
                     },
                     /*  
                     // See if we need a separate Edit option:
                     {
                        id: ids.linkPageEdit,
                        view: "combo",
                        clear: true,
                        placeholder: L("No linked form"),
                        name: "linkPageEdit",
                        label: L("Edit Form:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: () => this.onChange(),
                        },
                     },
                     */
                  ],
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

         ////
         //// Page Lists

         // Regather the current Page lists so they are always up to date:
         let pagesWithForms = this.pagesRelevant(view, "mobile-form", dcID);

         // include an option we will use to remove the value:
         // pagesWithForms.unshift({
         //    id: "noLinkedView",
         //    value: L("No linked view"),
         // });

         let $lpAdd = $$(ids.linkPageAdd);
         $lpAdd.define("options", pagesWithForms);
         $lpAdd.define("value", view.settings.linkPageAdd);
         $lpAdd.refresh();

         let $lpDetail = $$(ids.linkPageDetail);
         $lpDetail.define("options", pagesWithForms);
         $lpDetail.define("value", view.settings.linkPageDetail);
         $lpDetail.refresh();
      }

      _filterWidgetAndDC(v, widgetKey, dcID) {
         // valid options have .widgetKey  AND are tied to our
         // datacollection

         return true; // <--- testing: remove this!

         let vDC = v.datacollection;
         return (
            v.key == widgetKey &&
            (vDC?.id == dcID || vDC?.datacollectionFollow?.id == dcID)
         );
      }

      /**
       * @method pagesRelevant()
       * search our possible Pages for ones that might work as one of our
       * link pages.
       * @param {string} key
       *        A matching page must contain a widget that is tied to our
       *        datacollection.  This is the key of a widget we are searching
       *        for.
       * @return {array[ABMobilePage]}
       */
      pagesRelevant(view, key, dcID) {
         let relevantPages = [];

         // First gather Pages that are UNDER the page this current View is on
         let parent = view.parent;
         if (parent) {
            relevantPages = relevantPages.concat(
               parent
                  .pages((p) => {
                     return p.views((v) => {
                        return this._filterWidgetAndDC(v, key, dcID);
                     }, true).length;
                  }, true)
                  .map((p) => {
                     return {
                        id: p.id,
                        value: p.label,
                     };
                  })
            );
         }

         // NOW Add in possible pages from ALL the available Pages:
         // I mean, who knows how our designer is laying things out:

         relevantPages = relevantPages.concat(
            view
               .pageRoot()
               .pages((p) => {
                  return p.views((v) => {
                     return this._filterWidgetAndDC(v, key, dcID);
                  }, true).length;
               }, true)
               // now remove any pages that were already in relevantPages
               .filter((p) => {
                  return !relevantPages.find((rp) => p.id == rp.id);
               })
               .map((p) => {
                  let pParent = p.parent;
                  return {
                     id: p.id,
                     value: pParent
                        ? `${pParent.label} -> ${p.label}`
                        : p.label,
                  };
               })
         );

         return relevantPages;
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
         return super._ViewClass("mobile-list");
      }
   }

   return ABViewListProperty;
}
