/*
 * ABViewCarousel
 * A Property manager for our ABViewCarousel definitions
 */

import FABView from "./ABView";

import FABViewPropertyFilterData from "./viewProperties/ABViewPropertyFilterData";
import FABViewPropertyLinkPage from "./viewProperties/ABViewPropertyLinkPage";

export default function (AB) {
   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   const base = "properties_abview_carousel";
   const ABViewPropertyFilterData = FABViewPropertyFilterData(AB, base);
   const PopupCarouselFilterMenu = new ABViewPropertyFilterData();

   const LinkPageHelper = new FABViewPropertyLinkPage(AB, base);

   class ABViewCarouselProperty extends ABView {
      constructor() {
         super(base, {
            // Put our ids here
            datacollection: "",
            field: "",
            filterByCursor: "",
            width: "",
            height: "",
            showLabel: "",
            hideItem: "",
            hideButton: "",
            navigationType: "",

            gridFilterMenuButton: "",
            detailsPage: "",
            editPage: "",
         });

         this.ABFieldImage = AB.Class.ABFieldManager.fieldByKey("image");
         // {ABFieldImage}  the Class reference
         // we use this later to help find which fields in an object
         // are image fields.

         this._preFilterSettings = null;
         // {json}
         // The settings that were in the Filter popup when we chose to
         // display them.  We will use these values to undo any modifications
         // if the user clicks [cancel] or [close];

         this.linkPageComponent = new LinkPageHelper();
      }

      static get key() {
         return "carousel";
      }

      ui() {
         let ids = this.ids;
         let _this = this;

         return super.ui([
            {
               view: "fieldset",
               label: L("Data:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.datacollection,
                        view: "select",
                        name: "datacollection",
                        label: L("Datacollection:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: (newv, oldv) => {
                              if (newv != oldv) {
                                 this.linkPageComponent.clear();

                                 let imageFields = [];

                                 let dataCollection =
                                    this.AB.datacollectionByID(newv);
                                 if (dataCollection) {
                                    let datasource = dataCollection.datasource;
                                    if (datasource) {
                                       imageFields =
                                          datasource
                                             .fields(
                                                (f) =>
                                                   f instanceof
                                                   this.ABFieldImage
                                             )
                                             .map((f) => {
                                                return {
                                                   id: f.id,
                                                   value: f.label,
                                                };
                                             }) || [];
                                    }
                                 }
                                 if (imageFields.length > 0) {
                                    imageFields.unshift({
                                       id: "",
                                       value: L("Select a field"),
                                    });
                                 } else {
                                    imageFields.unshift({
                                       id: "",
                                       value: L("no image fields."),
                                    });
                                 }

                                 $$(ids.field).define("options", imageFields);
                                 $$(ids.field).refresh();
                                 this.onChange();
                              }
                           },
                        },
                     },

                     {
                        id: ids.field,
                        view: "select",
                        name: "field",
                        label: L("Image Field:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },

                     {
                        id: ids.filterByCursor,
                        view: "checkbox",
                        name: "filterByCursor",
                        labelWidth: 0,
                        labelRight: L("Filter images by cursor"),
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },
            this.linkPageComponent.ui(),
            // this.linkPageComponent.ui,
            // {
            //    view: "fieldset",
            //    label: L('ab.component.label.linkedPages', '*Linked Pages:'),
            //    labelWidth: uiConfig.labelWidthLarge,
            //    body: {
            //       type: "clean",
            //       padding: 10,
            //       rows: [
            //          {
            //             view: "select",
            //             name: "detailsPage",
            //             label: L('ab.component.label.detailsPage', '*Details Page:'),
            //             labelWidth: uiConfig.labelWidthLarge,
            //             options: []
            //          },
            //          {
            //             view: "select",
            //             name: "editPage",
            //             label: L('ab.component.label.editForm', '*Edit Form:'),
            //             labelWidth: uiConfig.labelWidthLarge,
            //             options: []
            //          }
            //       ]
            //    }
            // },
            {
               view: "fieldset",
               label: L("Customize Display:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.navigationType,
                        view: "select",
                        name: "navigationType",
                        label: L("Navigation Type"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [
                           { id: "corner", value: L("Corner") },
                           { id: "side", value: L("Side") },
                        ],
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },

                     {
                        id: ids.showLabel,
                        view: "checkbox",
                        name: "showLabel",
                        labelRight: L("Show label of image"),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },

                     {
                        id: ids.hideItem,
                        view: "checkbox",
                        name: "hideItem",
                        labelRight: L("Hide item list"),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },

                     {
                        id: ids.hideButton,
                        view: "checkbox",
                        name: "hideButton",
                        labelRight: L("Hide navigation buttons"),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },

                     {
                        id: ids.width,
                        view: "counter",
                        name: "width",
                        label: L("Width:"),
                        labelWidth: uiConfig.labelWidthXLarge,
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
                        labelWidth: uiConfig.labelWidthXLarge,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },

                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Filter Option:"),
                              css: "ab-text-bold",
                              width: uiConfig.labelWidthXLarge,
                           },
                           {
                              id: ids.gridFilterMenuButton,
                              view: "button",
                              css: "webix_primary",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              // badge: 0,
                              click: function () {
                                 _this.filterMenuShow(this.$view);
                              },
                           },
                        ],
                     },
                  ],
               },
            },
         ]);
      }

      async init(AB) {
         super.init(AB);

         this._handler_onCancel = () => {
            // we have to set the values BACK to what they were:
            PopupCarouselFilterMenu.setSettings(this._preFilterSettings);
            this.filter_property_popup.hide();
         };

         this.filter_property_popup = webix.ui({
            view: "window",
            modal: true,
            position: "center",
            resize: true,
            width: 700,
            height: 450,
            css: "ab-main-container",
            hidden: true,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Filter Menu"),
                  },
                  {
                     view: "button",
                     autowidth: true,
                     // width: 50,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: this._handler_onCancel,
                     on: {
                        onAfterRender() {
                           ABView.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            body: PopupCarouselFilterMenu.ui(),
         });

         PopupCarouselFilterMenu.on("cancel", this._handler_onCancel);

         PopupCarouselFilterMenu.on("save", () => {
            this.filter_property_popup.hide();
            this.onChange();
         });

         let allInits = [];

         allInits.push(PopupCarouselFilterMenu.init(AB));
         allInits.push(this.linkPageComponent.init(AB));
         return Promise.all(allInits);
      }

      populate(view) {
         super.populate(view);
         let ids = this.ids;

         if (!view) return;

         this.viewEditing = view;

         // Set the objects you can choose from in the list
         // Pull data collections to options
         var objectOptions = this.propertyDatacollections(view);
         $$(ids.datacollection).define("options", objectOptions);
         $$(ids.datacollection).refresh();

         $$(ids.datacollection).setValue(view.settings.dataviewID);
         $$(ids.field).setValue(view.settings.field);
         $$(ids.filterByCursor).setValue(view.settings.filterByCursor);

         $$(ids.width).setValue(view.settings.width);
         $$(ids.height).setValue(view.settings.height);
         $$(ids.showLabel).setValue(view.settings.showLabel);
         $$(ids.hideItem).setValue(view.settings.hideItem);
         $$(ids.hideButton).setValue(view.settings.hideButton);
         $$(ids.navigationType).setValue(view.settings.navigationType);

         // Populate values to QueryBuilder
         var selectedDv = view.datacollection;
         if (selectedDv) {
            PopupCarouselFilterMenu.objectLoad(selectedDv.datasource);
            PopupCarouselFilterMenu.setSettings(view.settings.filter);
         }

         // Populate values to link page properties
         this.linkPageComponent.viewLoad(view);
         this.linkPageComponent.setSettings(view.settings);
      }

      defaultValues() {
         let values = {};
         var ViewClass = this.ViewClass();
         if (ViewClass) {
            values = ViewClass.defaultValues();
         }
         return values;
      }

      filterMenuShow() {
         // var currView = _logic.currentEditObject();

         this._preFilterSettings = PopupCarouselFilterMenu.getSettings();

         // show filter popup
         this.filter_property_popup.show();
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         let ids = this.ids;
         let vals = super.values();

         vals.settings = vals.settings || {};
         vals.settings.dataviewID = $$(ids.datacollection).getValue();
         vals.settings.field = $$(ids.field).getValue();
         vals.settings.filterByCursor =
            $$(ids.filterByCursor).getValue() || false;

         vals.settings.width = $$(ids.width).getValue();
         vals.settings.height = $$(ids.height).getValue();
         vals.settings.showLabel = $$(ids.showLabel).getValue();
         vals.settings.hideItem = $$(ids.hideItem).getValue();
         vals.settings.hideButton = $$(ids.hideButton).getValue();
         vals.settings.navigationType = $$(ids.navigationType).getValue();

         // filter
         vals.settings.filter = PopupCarouselFilterMenu.getSettings();

         // link pages
         let linkSettings = this.linkPageComponent.getSettings();
         for (let key in linkSettings) {
            vals.settings[key] = linkSettings[key];
         }

         return vals;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("carousel");
      }
   }

   return ABViewCarouselProperty;
}
