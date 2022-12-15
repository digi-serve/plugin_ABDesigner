/*
 * ABViewConnect
 * A Property manager for our ABViewConnect definitions
 */

import FABView from "./ABView";
import ABPopupSort from "../../ui_work_object_workspace_popupSortFields";
import ABViewPropertyAddPage from "./viewProperties/ABViewPropertyAddPage";
import ABViewPropertyEditPage from "./viewProperties/ABViewPropertyEditPage";

export default function (AB) {
   const BASE_ID = "properties_abview_connect";

   const ABView = FABView(AB);
   const ABAddPage = ABViewPropertyAddPage(AB, BASE_ID);
   const ABEditPage = ABViewPropertyEditPage(AB, BASE_ID);
   const L = ABView.L();

   let FilterComponent = null;
   let SortComponent = null;

   class ABViewConnectProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            addNewSettings: "",
            popupWidth: "",
            popupHeight: "",
            advancedOption: "",
            buttonFilter: "",
            filterConnectedValue: "",
            buttonSort: "",
         });

         this.AB = AB;
         FilterComponent = this.AB.filterComplexNew(`${BASE_ID}_filter`);
         SortComponent = ABPopupSort(this.AB, `${BASE_ID}_sort`);
      }

      static get key() {
         return "connect";
      }

      ui() {
         const self = this;
         const ids = this.ids;
         const uiConfig = this.AB.UISettings.config();

         return super.ui([
            this.addPageProperty.ui(),
            this.editPageProperty.ui(),
            {
               id: ids.addNewSettings,
               view: "fieldset",
               name: "addNewSettings",
               label: L("Add New Popup Settings:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.popupWidth,
                        view: "text",
                        name: "popupWidth",
                        placeholder: L("Set popup width"),
                        label: L("Width:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        validate: this.AB.Webix.rules.isNumber,
                     },
                     {
                        id: ids.popupHeight,
                        view: "text",
                        name: "popupHeight",
                        placeholder: L("Set popup height"),
                        label: L("Height:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        validate: this.AB.Webix.rules.isNumber,
                     },
                  ],
               },
            },
            {
               id: ids.advancedOption,
               view: "fieldset",
               name: "advancedOption",
               label: L("Advanced Options:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Filter Options:"),
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              id: ids.buttonFilter,
                              view: "button",
                              name: "buttonFilter",
                              css: "webix_primary",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              badge: 0,
                              click: function () {
                                 self.showFilterPopup(this.$view);
                              },
                           },
                        ],
                     },
                     {
                        rows: [
                           {
                              view: "label",
                              label: L("Filter by Connected Field Value:"),
                           },
                           {
                              id: ids.filterConnectedValue,
                              view: "combo",
                              name: "filterConnectedValue",
                              options: [], // we will add these in propertyEditorPopulate
                           },
                        ],
                     },
                     {
                        height: 30,
                     },
                     {
                        rows: [
                           {
                              cols: [
                                 {
                                    view: "label",
                                    label: L("Sort Options:"),
                                    width: uiConfig.labelWidthLarge,
                                 },
                                 {
                                    id: ids.buttonSort,
                                    view: "button",
                                    name: "buttonSort",
                                    css: "webix_primary",
                                    label: L("Settings"),
                                    icon: "fa fa-gear",
                                    type: "icon",
                                    badge: 0,
                                    click: function () {
                                       self.showSortPopup(this.$view);
                                    },
                                 },
                              ],
                           },
                        ],
                     },
                  ],
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);

         FilterComponent.init();
         // when we make a change in the popups we want to make sure we save the new workspace to the properties to do so just fire an onChange event
         //  FilterComponent.on("change", (val) => {
         //     _logic.onFilterChange(val);
         //  });

         SortComponent.init(AB);

         if (this.filter_popup == null) {
            this.filter_popup = this.AB.Webix.ui({
               view: "popup",
               width: 800,
               hidden: true,
               body: FilterComponent.ui,
            });
         }
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const ABViewFormConnectPropertyComponentDefaults =
            this.defaultValues();

         // Default set of options for filter connected combo
         const filterConnectedOptions = [{ id: "", value: "" }];

         // get the definitions for the connected field
         const fieldDefs = this.AB.definitionByID(view.settings.fieldId);

         // get the definition for the object that the field is related to
         const objectDefs = this.AB.definitionByID(
            fieldDefs.settings.linkObject
         );

         // we need these definitions later as we check to find out which field
         // we are filtering by so push them into an array for later
         const fieldsDefs = [];
         objectDefs.fieldIDs.forEach((fld) => {
            fieldsDefs.push(this.AB.definitionByID(fld));
         });

         // find out what connected objects this field has
         const connectedObjs = view.application.connectedObjects(
            fieldDefs.settings.linkObject
         );

         // loop through the form's elements (need to ensure that just looking at parent is okay in all cases)
         view.parent.views().forEach((element) => {
            // identify if element is a connected field
            if (element.key == "connect") {
               // we need to get the fields defs to find out what it is connected to
               const formElementsDefs = this.AB.definitionByID(
                  element.settings.fieldId
               );

               // loop through the connected objects discovered above
               connectedObjs.forEach((connObj) => {
                  // see if the connected object matches the connected object of the form element
                  if (connObj.id == formElementsDefs.settings.linkObject) {
                     // get the ui id of this component that matches the link Object
                     let fieldToCheck;
                     fieldsDefs.forEach((fdefs) => {
                        // if the field has a custom foreign key we need to store it
                        // so selectivity later can know what value to get, otherwise
                        // we just get the uuid of the record
                        if (
                           fdefs.settings.isCustomFK &&
                           fdefs.settings.indexField != "" &&
                           fdefs.settings.linkObject &&
                           fdefs.settings.linkType == "one" &&
                           fdefs.settings.linkObject ==
                              formElementsDefs.settings.linkObject
                        ) {
                           fieldToCheck = fdefs.id;
                           let customFK = this.AB.definitionByID(
                              fdefs.settings.indexField
                           );

                           // if the index definitions were found
                           if (customFK) {
                              fieldToCheck = `${fdefs.id}:${customFK.columnName}`;
                           }
                        } else if (
                           fdefs.settings.linkObject &&
                           fdefs.settings.linkType == "one" &&
                           fdefs.settings.linkObject ==
                              formElementsDefs.settings.linkObject
                        ) {
                           fieldToCheck = `${fdefs.id}:uuid`;
                        }
                     });

                     // only add optinos that have a fieldToCheck
                     if (fieldToCheck) {
                        // get the component we are referencing so we can display its label
                        const formComponent =
                           view.parent.viewComponents[element.id]; // need to ensure that just looking at parent is okay in all cases
                        filterConnectedOptions.push({
                           id: `${formComponent.ui.name}:${fieldToCheck}`, // store the columnName name because the ui id changes on each load
                           value: formComponent.ui.label, // should be the translated field label
                        });
                     }
                  }
               });
            }
         });

         // Set the options of the possible edit forms
         this.addPageProperty.setSettings(view, view.settingsAddPage);
         this.editPageProperty.setSettings(view, view.settingsEditPage);
         $$(ids.filterConnectedValue).define("options", filterConnectedOptions);
         $$(ids.filterConnectedValue).setValue(
            view.settings.filterConnectedValue
         );

         $$(ids.popupWidth).setValue(
            view.settings.popupWidth ||
               ABViewFormConnectPropertyComponentDefaults.popupWidth
         );
         $$(ids.popupHeight).setValue(
            view.settings.popupHeight ||
               ABViewFormConnectPropertyComponentDefaults.popupHeight
         );

         // initial populate of popups
         this.populatePopupEditors(view);

         // inform the user that some advanced settings have been set
         this.populateBadgeNumber(ids, view);
      }

      populatePopupEditors(view) {
         const filterConditions =
            view?.settings?.filterConditions ??
            this.defaultValues().filterConditions;

         // Populate data to popups
         // FilterComponent.objectLoad(objectCopy);
         let linkedObj;
         const field = view.field();
         if (field) {
            linkedObj = field.datasourceLink;
            if (linkedObj)
               FilterComponent.fieldsLoad(linkedObj.fields(), linkedObj);
         }

         FilterComponent.setValue(filterConditions);

         if (linkedObj) SortComponent.objectLoad(linkedObj);
         SortComponent.setSettings(view.settings.sortFields);
      }

      populateBadgeNumber(ids, view) {
         const $buttonFilter = $$(ids.buttonFilter);
         if (view?.settings?.filterConditions?.rules) {
            $buttonFilter.define(
               "badge",
               view.settings.filterConditions.rules.length || null
            );
            $buttonFilter.refresh();
         } else {
            $buttonFilter.define("badge", null);
            $buttonFilter.refresh();
         }

         const $buttonSort = $$(ids.buttonSort);
         if (view?.settings?.sortFields?.length) {
            $buttonSort.define(
               "badge",
               view.settings.sortFields.length || null
            );
            $buttonSort.refresh();
         } else {
            $buttonSort.define("badge", null);
            $buttonSort.refresh();
         }
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
         const view = this.CurrentView;

         const $component = $$(ids.component);

         const values = super.values() ?? {};
         values.settings = $component.getValues() ?? {};
         values.settings.popupWidth = $$(ids.popupWidth).getValue();
         values.settings.popupHeight = $$(ids.popupHeight).getValue();
         values.settings.filterConnectedValue = $$(
            ids.filterConnectedValue
         ).getValue();
         values.settings.filterConditions = FilterComponent.getValue();
         values.settings.sortFields = SortComponent.getSettings();

         values.settingsAddPage = this.addPageProperty.getSettings(view);
         values.settingsEditPage = this.editPageProperty.getSettings(view);

         // refresh settings of app page tool
         this.addPageProperty.setSettings(view, values.settingsAddPage);
         this.editPageProperty.setSettings(view, values.settingsEditPage);

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("connect");
      }

      get addPageProperty() {
         if (!this._addPage) this._addPage = new ABAddPage();

         return this._addPage;
      }

      get editPageProperty() {
         if (!this._editPage) this._editPage = new ABEditPage();

         return this._editPage;
      }

      showFilterPopup($view) {
         this.filter_popup.show($view, null, { pos: "top" });
      }

      showSortPopup($button) {
         SortComponent.show($button, null, {
            pos: "top",
         });
      }
   }

   return ABViewConnectProperty;
}