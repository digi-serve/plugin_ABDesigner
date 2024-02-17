/*
 * ABViewGrid
 * A Property manager for our ABViewGrid definitions
 */

import FABView from "./ABView";

import FPopupCountFields from "../../ui_work_object_workspace_popupCountColumns";
import FPopupFrozenColumns from "../../ui_work_object_workspace_popupFrozenColumns";
import FPopupHideFields from "../../ui_work_object_workspace_popupHideFields";
import FPopupSummaryFields from "../../ui_work_object_workspace_popupSummaryColumns";

import FABViewPropertyFilterData from "./viewProperties/ABViewPropertyFilterData";
import FABViewPropertyLinkPage from "./viewProperties/ABViewPropertyLinkPage";

export default function (AB) {
   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   const base = "properties_abview_grid";
   const ABViewPropertyFilterData = FABViewPropertyFilterData(AB, base);
   const PopupFilterMenu = new ABViewPropertyFilterData({ isGrid: true });

   const LinkPageHelper = new FABViewPropertyLinkPage(AB, base);

   class ABViewGridProperty extends ABView {
      constructor() {
         super(base, {
            // Put our ids here
            isEditable: "",
            massUpdate: "",
            allowDelete: "",
            isSortable: "",
            isExportable: "",

            datacollection: "",

            groupBy: "",
            groupByList: "",

            buttonFieldsVisible: "",
            buttonFieldsFreeze: "",
            buttonSummaryFields: "",
            buttonCountFields: "",
            height: "",
            hideHeader: "",
            labelAsField: "",
            hideButtons: "",
         });

         this._preFilterSettings = null;
         // {json}
         // The settings that were in the Filter popup when we chose to
         // display them.  We will use these values to undo any modifications
         // if the user clicks [cancel] or [close];

         this.linkPageComponent = new LinkPageHelper();
         this.linkPageComponent.on("changed", () => {
            this.onChange();
         });

         this.PopupCountColumnsComponent = FPopupCountFields(
            AB,
            `${base}_count`
         );
         this.PopupCountColumnsComponent.on("changed", (settings) => {
            this.badgesCount(settings);
            this.onChange();
         });

         this.PopupFrozenColumnsComponent = new FPopupFrozenColumns(
            AB,
            `${base}_frozenFields`
         );
         this.PopupFrozenColumnsComponent.on("changed", (settings) => {
            this.badgesFrozen(settings);
            this.PopupHideFieldComponent.setFrozenColumnID(settings);
            this.onChange();
         });

         this.PopupHideFieldComponent = FPopupHideFields(
            AB,
            `${base}_hideFields`
         );
         this.PopupHideFieldComponent.on("changed", (settings = []) => {
            this.badgesHidden(settings);
            this.PopupFrozenColumnsComponent.setHiddenFields(settings);
            this.onChange();
         });

         this.PopupSummaryColumnsComponent = FPopupSummaryFields(
            AB,
            `${base}_summary`
         );
         this.PopupSummaryColumnsComponent.on("changed", (settings) => {
            this.badgesSummary(settings);
            this.onChange();
         });
      }

      static get key() {
         return "grid";
      }

      ui() {
         let ids = this.ids;
         let _this = this;

         return super.ui([
            {
               view: "fieldset",
               label: L("Grid Properties:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.isEditable,
                        view: "checkbox",
                        name: "isEditable",
                        labelRight: L("User can edit in grid."),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        click: () => {
                           this.onChange();
                        },
                     },
                     {
                        id: ids.massUpdate,
                        view: "checkbox",
                        name: "massUpdate",
                        labelRight: L(
                           "User can edit multiple items at one time."
                        ),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        click: () => {
                           this.onChange();
                        },
                     },
                     {
                        id: ids.allowDelete,
                        view: "checkbox",
                        name: "allowDelete",
                        labelRight: L("User can delete records."),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        click: () => {
                           this.onChange();
                        },
                     },
                     {
                        id: ids.isSortable,
                        view: "checkbox",
                        name: "isSortable",
                        labelRight: L("User can sort records."),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        click: () => {
                           this.onChange();
                        },
                     },
                     {
                        id: ids.isExportable,
                        view: "checkbox",
                        name: "isExportable",
                        labelRight: L("User can export."),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        click: () => {
                           this.onChange();
                        },
                     },
                  ],
               },
            },
            {
               view: "fieldset",
               label: L("Grid Data:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.datacollection,
                        view: "richselect",
                        name: "datacollection",
                        label: L("Datacollection:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: (newv, oldv) => {
                              if (newv != oldv) {
                                 this.linkPageComponent.clear();
                                 // the linkPageComponent needs to refresh
                                 // itself with the possible Link Pages
                                 // that are related to this new DC:
                                 this.linkPageComponent.viewLoad(
                                    this.CurrentView,
                                    newv
                                 );

                                 let currDC =
                                    this.CurrentView?.AB.datacollectionByID(
                                       newv
                                    );
                                 // disallow edit data of query
                                 if (currDC && currDC.sourceType == "query") {
                                    $$(ids.isEditable).setValue(false);
                                    $$(ids.massUpdate).setValue(false);
                                    $$(ids.allowDelete).setValue(false);
                                    $$(ids.isEditable).disable();
                                    $$(ids.massUpdate).disable();
                                    $$(ids.allowDelete).disable();
                                 } else {
                                    $$(ids.isEditable).enable();
                                    $$(ids.massUpdate).enable();
                                    $$(ids.allowDelete).enable();
                                 }

                                 this.refreshGroupBy(currDC);

                                 this.onChange();
                              }
                           },
                        },
                     },
                  ],
               },
            },
            {
               view: "fieldset",
               label: L("Group:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.groupBy,
                        view: "multiselect",
                        name: "groupBy",
                        label: L("Group by:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: (newV /*, oldV */) => {
                              this.refreshGroupByList(newV);
                              this.onChange();
                           },
                        },
                     },
                     {
                        id: ids.groupByList,
                        view: "list",
                        name: "groupByList",
                        drag: true,
                        data: [],
                        height: 200,
                        template:
                           "<span class='fa fa-sort'></span>&nbsp;&nbsp; #value#",
                        on: {
                           onAfterDrop: () => {
                              // let currView = _logic.currentEditObject();
                              // this.propertyEditorSave(ids, currView);
                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },
            this.linkPageComponent.ui(),
            {
               view: "fieldset",
               label: L("Customize Display:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Hidden Fields:"),
                              css: "ab-text-bold",
                              width: uiConfig.labelWidthXLarge,
                           },
                           {
                              id: ids.buttonFieldsVisible,
                              view: "button",
                              name: "buttonFieldsVisible",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              click: function () {
                                 _this.PopupHideFieldComponent.show(this.$view);
                              },
                           },
                        ],
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
                              id: ids.buttonFilterData,
                              view: "button",
                              name: "buttonFilterData",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              click: () => {
                                 this.filter_property_popup.show();
                                 // PopupFilterMenu.show(this.$view);
                              },
                           },
                        ],
                     },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Freeze Columns:"),
                              css: "ab-text-bold",
                              width: uiConfig.labelWidthXLarge,
                           },
                           {
                              id: ids.buttonFieldsFreeze,
                              view: "button",
                              name: "buttonFieldsFreeze",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              click: function () {
                                 _this.PopupFrozenColumnsComponent.show(
                                    this.$view
                                 );
                              },
                           },
                        ],
                     },

                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Summary Fields:"),
                              css: "ab-text-bold",
                              width: uiConfig.labelWidthXLarge,
                           },
                           {
                              id: ids.buttonSummaryFields,
                              view: "button",
                              name: "buttonSummaryFields",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              click: function () {
                                 _this.PopupSummaryColumnsComponent.show(
                                    this.$view
                                 );
                              },
                           },
                        ],
                     },

                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Count Fields:"),
                              css: "ab-text-bold",
                              width: uiConfig.labelWidthXLarge,
                           },
                           {
                              id: ids.buttonCountFields,
                              view: "button",
                              name: "buttonCountFields",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              click: function () {
                                 _this.PopupCountColumnsComponent.show(
                                    this.$view
                                 );
                              },
                           },
                        ],
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
                        id: ids.hideHeader,
                        view: "checkbox",
                        name: "hideHeader",
                        labelRight: L("Hide table header"),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        click: () => {
                           this.onChange();
                        },
                     },

                     {
                        id: ids.labelAsField,
                        view: "checkbox",
                        name: "labelAsField",
                        labelRight: L("Show a field using label template"),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        click: () => {
                           this.onChange();
                        },
                     },

                     {
                        id: ids.hideButtons,
                        view: "checkbox",
                        name: "hideButtons",
                        labelRight: L("Hide edit and view buttons"),
                        labelWidth: uiConfig.labelWidthCheckbox,
                        click: () => {
                           this.onChange();
                        },
                     },
                  ],
               },
            },
            {},
         ]);
      }

      async init(AB) {
         super.init(AB);

         // Load in all the Available Datacollections:
         var listDC = this.CurrentApplication.datacollectionsIncluded().map(
            (d) => {
               return {
                  id: d.id,
                  value: d.label,
                  icon:
                     d.sourceType == "query"
                        ? "fa fa-filter"
                        : "fa fa-database",
               };
            }
         );
         $$(this.ids.datacollection).define("options", listDC);
         $$(this.ids.datacollection).refresh();

         /// Filter Data Helper:

         this._handler_onCancel = () => {
            // we have to set the values BACK to what they were:
            PopupFilterMenu.setSettings(this._preFilterSettings);
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
            body: PopupFilterMenu.ui(),
         });

         PopupFilterMenu.on("cancel", this._handler_onCancel);

         PopupFilterMenu.on("save", () => {
            this.filter_property_popup.hide();
            this.onChange();
         });

         let allInits = [];

         allInits.push(PopupFilterMenu.init(AB));
         allInits.push(this.linkPageComponent.init(AB));

         allInits.push(this.PopupFrozenColumnsComponent.init(AB));
         allInits.push(this.PopupHideFieldComponent.init(AB));
         allInits.push(this.PopupSummaryColumnsComponent.init(AB));
         allInits.push(this.PopupCountColumnsComponent.init(AB));

         return Promise.all(allInits);
      }

      /**
       * @method badgesCount()
       * Set the badge count for the Count Fields button.
       * @param {array} settings
       *        An array of the ABFieldXXX.id that should be hidden.
       */
      badgesCount(settings) {
         let badgeCount = settings.length;
         if (badgeCount == 0) badgeCount = false;
         $$(this.ids.buttonCountFields).config.badge = badgeCount;
         $$(this.ids.buttonCountFields).refresh();
      }

      /**
       * @method badgesHidden()
       * Set the badge count for the Hidden Fields button.
       * @param {array} settings
       *        An array of the ABFieldXXX.id that should be hidden.
       */
      badgesHidden(settings) {
         let badgeCount = settings.length;
         if (badgeCount == 0) badgeCount = false;
         $$(this.ids.buttonFieldsVisible).config.badge = badgeCount;
         $$(this.ids.buttonFieldsVisible).refresh();
      }

      /**
       * @method badgesFrozen()
       * Set the badge count for the Frozen Fields button.
       * @param {string} settings
       *        The ABFieldXXX.id that should be frozen.
       */
      badgesFrozen(settings) {
         const hidden = this.CurrentView.settings.hiddenFields || [];

         const visibleFields = this.CurrentView.datacollection.datasource
            .fields((f) => hidden.indexOf(f.columnName) == -1)
            .map((f) => f.columnName);

         let badgeCount = visibleFields.indexOf(settings) + 1;
         if (badgeCount == 0) badgeCount = false;
         $$(this.ids.buttonFieldsFreeze).config.badge = badgeCount;
         $$(this.ids.buttonFieldsFreeze).refresh();
      }

      /**
       * @method badgesSummary()
       * Set the badge count for the Hidden Fields button.
       * @param {array} settings
       *        An array of the ABFieldXXX.id that should be hidden.
       */
      badgesSummary(settings) {
         let badgeCount = settings.length;
         if (badgeCount == 0) badgeCount = false;
         $$(this.ids.buttonSummaryFields).config.badge = badgeCount;
         $$(this.ids.buttonSummaryFields).refresh();
      }

      get datacollection() {
         return this.AB.datacollectionByID(
            this.CurrentView.settings?.dataviewID
         );
      }

      populate(view) {
         super.populate(view);
         let ids = this.ids;

         if (!view) return;

         // this.viewEditing = view;
         let $dataCollection = $$(ids.datacollection);
         $dataCollection.blockEvent();
         $dataCollection.setValue(view.settings.dataviewID);
         $dataCollection.unblockEvent();
         $$(ids.isEditable).setValue(view.settings.isEditable);
         $$(ids.massUpdate).setValue(view.settings.massUpdate);
         $$(ids.allowDelete).setValue(view.settings.allowDelete);
         $$(ids.isSortable).setValue(view.settings.isSortable);
         $$(ids.isExportable).setValue(view.settings.isExportable);

         // populate the Datacollection chooser
         if (view.settings.datacollection != "") {
            $$(ids.datacollection).setValue(view.settings.dataviewID);
            // $$(ids.linkedObject).show();
         } else {
            $$(ids.datacollection).setValue("");
            // $$(ids.linkedObject).hide();
         }

         $$(ids.height).setValue(view.settings.height);
         $$(ids.hideHeader).setValue(view.settings.hideHeader);
         $$(ids.labelAsField).setValue(view.settings.labelAsField);
         $$(ids.hideButtons).setValue(view.settings.hideButtons);

         // Grouping options
         this.refreshGroupBy();
         this.refreshGroupByList(view.settings.groupBy);

         // Populate values to QueryBuilder
         // NOTE: we are going around the standard: view.datacollection getter
         // since calling that without a datacollection set will display an error.
         // BUT, since we are the designer, this is a normal situation, so:
         // var selectedDv = view.datacollection;
         let selectedDv = this.datacollection;
         if (selectedDv) {
            PopupFilterMenu.objectLoad(selectedDv.datasource);
            PopupFilterMenu.setSettings(view.settings.gridFilter);
            // PopupFilterMenu.setSettings(view.settings.filter);

            this.PopupCountColumnsComponent.objectLoad(selectedDv.datasource);
            this.PopupCountColumnsComponent.setValue(
               view.settings.countColumns || ""
            );

            this.PopupFrozenColumnsComponent.objectLoad(selectedDv.datasource);
            this.PopupFrozenColumnsComponent.setValue(
               view.settings.frozenColumnID || ""
            );
            this.PopupFrozenColumnsComponent.setHiddenFields(
               view.settings.hiddenFields
            );

            this.PopupHideFieldComponent.objectLoad(selectedDv.datasource);
            this.PopupHideFieldComponent.setSettings(
               view.settings.hiddenFields
            );
            this.PopupHideFieldComponent.setFrozenColumnID(
               view.settings.frozenColumnID || ""
            );

            this.PopupSummaryColumnsComponent.objectLoad(selectedDv.datasource);
            this.PopupSummaryColumnsComponent.setValue(
               view.settings.summaryColumns || []
            );

            this.badgesCount(view.settings.countColumns);
            this.badgesHidden(view.settings.hiddenFields);
            this.badgesFrozen(view.settings.frozenColumnID);
            this.badgesSummary(view.settings.summaryColumns);
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

         this._preFilterSettings = PopupFilterMenu.getSettings();

         // show filter popup
         this.filter_property_popup.show();
      }

      refreshGroupBy(dv) {
         const ids = this.ids;
         let view = this.CurrentView;
         let groupFields = [];
         dv = dv || this.datacollection;
         if (dv && dv.datasource) {
            dv.datasource
               .fields((f) => {
                  return (
                     !f.isConnection &&
                     view.settings.hiddenFields.indexOf(f.columnName) < 0
                  );
               })
               .forEach((f) => {
                  groupFields.push({
                     id: f.columnName,
                     value: f.label,
                  });
               });
         }
         $$(ids.groupBy).define("options", groupFields);
         $$(ids.groupBy).refresh();
         $$(ids.groupBy).setValue(view.settings.groupBy);
      }

      refreshGroupByList(groupBy) {
         const ids = this.ids;

         let colNames = groupBy || [];
         if (typeof colNames == "string") {
            colNames = colNames.split(",");
         }

         let options = $$(ids.groupBy).getList().data.find({});

         $$(ids.groupByList).clearAll();
         colNames.forEach((colName) => {
            let opt = options.filter((o) => o.id == colName)[0];
            if (opt) {
               $$(ids.groupByList).add(opt);
            }
         });
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
         vals.settings.isEditable = $$(ids.isEditable).getValue();
         vals.settings.massUpdate = $$(ids.massUpdate).getValue();
         vals.settings.allowDelete = $$(ids.allowDelete).getValue();
         vals.settings.isSortable = $$(ids.isSortable).getValue();
         vals.settings.isExportable = $$(ids.isExportable).getValue();

         vals.settings.height = $$(ids.height).getValue();
         vals.settings.hideHeader = $$(ids.hideHeader).getValue();
         vals.settings.labelAsField = $$(ids.labelAsField).getValue();
         vals.settings.hideButtons = $$(ids.hideButtons).getValue();
         //    // view.settings.groupBy = $$(ids.groupBy).getValue();

         // pull order groupBy list
         let groupByList = $$(ids.groupByList).serialize() || [];
         vals.settings.groupBy = groupByList.map((item) => item.id).join(",");

         // filter
         vals.settings.gridFilter = PopupFilterMenu.getSettings();

         //    view.settings.objectWorkspace = view.settings.objectWorkspace || {};
         vals.settings.hiddenFields =
            this.PopupHideFieldComponent.getSettings();
         vals.settings.frozenColumnID =
            this.PopupFrozenColumnsComponent.getValue();

         vals.settings.summaryColumns =
            this.PopupSummaryColumnsComponent.getValue();

         vals.settings.countColumns =
            this.PopupCountColumnsComponent.getValue();

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
         return super._ViewClass("grid");
      }
   }

   return ABViewGridProperty;
}
