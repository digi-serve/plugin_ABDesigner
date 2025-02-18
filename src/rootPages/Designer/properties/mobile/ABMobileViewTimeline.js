/*
 * ABMobileViewTimeline
 * A Property manager for our ABMobileViewTimeline definitions
 */

import FABMobileView from "./ABMobileView";
import FLabelTemplate from "../../ui_common_label_template";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_timeline";

   const ABMobileView = FABMobileView(AB);
   const LabelTemplate = FLabelTemplate(AB);

   const L = ABMobileView.L();
   const uiConfig = AB.UISettings.config();

   class ABViewListProperty extends ABMobileView {
      constructor() {
         super(BASE_ID, {
            datacollection: "",
            dateField: "",
            // height: "",
            hideTitle: "",
            linkPageAdd: "",
            linkPageDetail: "",
         });
      }

      static get key() {
         return "mobile-timeline";
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
                     this.onChangeDC(dcId);
                     this.onChange();
                  },
               },
            },
            {
               id: ids.dateField,
               name: "dateField",
               view: "richselect",
               label: L("Date Field"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            // {
            //    id: ids.height,
            //    view: "counter",
            //    name: "height",
            //    label: L("Height:"),
            //    labelWidth: uiConfig.labelWidthLarge,
            //    on: {
            //       onChange: () => {
            //          this.onChange();
            //       },
            //    },
            // },
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
               id: ids.itemTemplate,
               view: "button",
               type: "icon",
               icon: "fa-regular fa-pen-to-square",
               label: L("Item Template"),
               click: function (/* id, event*/) {
                  LabelTemplate.show(this.$view);
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

         LabelTemplate.init(AB);
         LabelTemplate.on("save", (/*labelTemplate*/) => {
            this.onChange();
         });

         await super.init(AB);
      }

      onChangeDC(dcId) {
         var datacollection = this.AB.datacollectionByID(dcId);
         var object = datacollection ? datacollection.datasource : null;
         if (object) {
            LabelTemplate.objectLoad(object);
         }

         this.propertyUpdateFieldOptions(dcId);
      }

      /**
       * @method propertyUpdateFieldOptions
       * Populate fields of object to select list in property
       * @param {string} dcId - id of ABDatacollection
       */
      propertyUpdateFieldOptions(dcId) {
         var datacollection = this.AB.datacollectionByID(dcId);
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
         $$(ids.dateField).define("options", fieldOptions);
         $$(ids.dateField).refresh();
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

         $$(ids.dateField).setValue(view.settings.dateField);

         let $hideTitle = $$(ids.hideTitle);
         if (view.settings.hideTitle) {
            $hideTitle.define("value", 1);
         } else {
            $hideTitle.define("value", 0);
         }
         $hideTitle.refresh();

         // $$(ids.height).setValue(view.settings.height);

         let obj = this.AB.datacollectionByID(dcID)?.datasource;
         if (obj) {
            LabelTemplate.objectLoad(obj);
         }

         // offer a suggestion if label format is not set:
         if (!view.settings.templateItem) {
            view.settings.templateItem = `
<div class="timeline-item-title">
   <small>
      {Title}
   </small>
   <div class="item-footer"></div>
</div>
<div class="item-after">
   <small
      >{Secondary Item}</small>
</div>`;
         }
         LabelTemplate.setLabelFormat(view.settings.templateItem);

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
         values.settings.templateItem = LabelTemplate.labelFormat;

         return values;
      }
   }

   return ABViewListProperty;
}
