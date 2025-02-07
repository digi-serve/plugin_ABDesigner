/*
 * ABMobileViewForm
 * A Property manager for our ABMobileViewForm definitions
 */

import FABMobileView from "./ABMobileView";
import FABViewRuleListFormRecordRules from "../rules/ABViewRuleListFormRecordRules";
import FABViewRuleListFormSubmitRules from "../rules/ABViewRuleListFormSubmitRules";

export default function (AB) {
   const ABMobileView = FABMobileView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABMobileView.L();

   const base = "properties_abmobileview_form";

   const PopupRecordRule = FABViewRuleListFormRecordRules(
      AB,
      `${base}_popupRecordRule`
   );

   const PopupSubmitRule = FABViewRuleListFormSubmitRules(
      AB,
      `${base}_popupSubmitRule`
   );

   class ABMobileViewFormProperty extends ABMobileView {
      constructor() {
         super(base, {
            // Put our ids here
            datacollection: "",
            fields: "",
            showLabel: "",
            labelPosition: "",
            labelWidth: "",
            height: "",
            clearOnLoad: "",
            clearOnSave: "",

            buttonSubmitRules: "",
            buttonRecordRules: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "mobile-form";
      }

      ui() {
         let ids = this.ids;

         return super.ui([
            {
               id: ids.datacollection,
               view: "richselect",
               name: "dataviewID",
               label: L("Datacollection"),
               labelWidth: uiConfig.labelWidthLarge,
               skipAutoSave: true,
               on: {
                  onChange: (newId, oldId) => {
                     this.selectSource(newId, oldId);
                  },
               },
            },

            {
               view: "fieldset",
               label: L("Form Fields:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.fields,
                        view: "list",
                        name: "fields",

                        select: false,
                        minHeight: 200,
                        template: (...params) => {
                           return this.listTemplate(...params);
                        },
                        type: {
                           markCheckbox: function (item) {
                              return (
                                 "<span class='check webix_icon fa fa-" +
                                 (item.selected ? "check-" : "") +
                                 "square-o'></span>"
                              );
                           },
                        },
                        onClick: {
                           check: (...params) => {
                              return this.check(...params);
                           },
                        },
                     },
                  ],
               },
            },
            {
               id: ids.showLabel,
               name: "showLabel",
               view: "checkbox",
               label: L("Display Label"),
               labelWidth: uiConfig.labelWidthLarge,
               click: () => {
                  this.onChange();
               },
            },
            {
               id: ids.labelPosition,
               view: "richselect",
               name: "labelPosition",

               label: L("Label Position"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [
                  {
                     id: "left",
                     value: L("Left"),
                  },
                  {
                     id: "top",
                     value: L("Top"),
                  },
               ],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.labelWidth,
               view: "counter",
               name: "labelWidth",

               label: L("Label Width"),
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
               label: L("Height"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.clearOnLoad,
               view: "checkbox",
               name: "clearOnLoad",

               label: L("Clear on load"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.clearOnSave,
               view: "checkbox",
               name: "clearOnSave",
               label: L("Clear on save"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               view: "fieldset",
               label: L("Rules:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Submit Rules:"),
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              id: ids.buttonSubmitRules,
                              view: "button",
                              css: "webix_primary",
                              name: "buttonSubmitRules",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              badge: 0,
                              click: () => {
                                 this.submitRuleShow();
                              },
                           },
                        ],
                     },
                     // {
                     //    cols: [
                     //       {
                     //          view: "label",
                     //          label: L("Display Rules:"),
                     //          width: uiConfig.labelWidthLarge,
                     //       },
                     //       {
                     //          view: "button",
                     //          name: "buttonDisplayRules",
                     //          css: "webix_primary",
                     //          label: L("Settings"),
                     //          icon: "fa fa-gear",
                     //          type: "icon",
                     //          badge: 0,
                     //          click: () => {
                     //             this.displayRuleShow();
                     //          },
                     //       },
                     //    ],
                     // },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Record Rules:"),
                              width: uiConfig.labelWidthLarge,
                           },
                           {
                              id: ids.buttonRecordRules,
                              view: "button",
                              name: "buttonRecordRules",
                              css: "webix_primary",
                              label: L("Settings"),
                              icon: "fa fa-gear",
                              type: "icon",
                              badge: 0,
                              click: () => {
                                 this.recordRuleShow();
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

         webix.extend($$(this.ids.component), webix.ProgressBar);

         let allInits = [];
         allInits.push(PopupRecordRule.init(AB));
         PopupRecordRule.on("save", () => {
            this.onChange();
            this.populateBadgeNumber();
         });
         allInits.push(PopupSubmitRule.init(AB));
         PopupSubmitRule.on("save", (/* settings */) => {
            this.onChange();
            this.populateBadgeNumber();
         });

         return Promise.all(allInits);
      }

      populate(view) {
         super.populate(view);
         let ids = this.ids;
         if (!view) return;

         let formCom = view.parentFormComponent();
         let datacollectionId = formCom.settings.dataviewID
            ? formCom.settings.dataviewID
            : null;
         var SourceSelector = $$(ids.datacollection);

         // Pull data collections to options
         var dcOptions = view.application
            .datacollectionsIncluded()
            .filter((dc) => {
               const obj = dc.datasource;
               return (
                  dc.sourceType == "object" &&
                  !obj?.isImported &&
                  !obj?.isReadOnly
               );
            })
            .map((d) => {
               let entry = { id: d.id, value: d.label };
               if (d.sourceType == "query") {
                  entry.icon = "fa fa-filter";
               } else {
                  entry.icon = "fa fa-database";
               }
               return entry;
            });
         SourceSelector.define("options", dcOptions);
         SourceSelector.define("value", datacollectionId);
         SourceSelector.refresh();

         this.propertyUpdateFieldOptions(datacollectionId);

         // update properties when a field component is deleted
         view.views().forEach((v) => {
            if (v instanceof this.AB.Class.ABMobileViewFormItem)
               v.once("destroyed", () => this.populate(view));
         });

         SourceSelector.enable();
         $$(ids.showLabel).setValue(view.settings.showLabel);

         let DefaultValues = this.defaultValues();
         Object.keys(DefaultValues).forEach((k) => {
            $$(ids[k])?.setValue(view.settings[k] || DefaultValues[k]);
         });
         // $$(ids.labelPosition).setValue(
         //    view.settings.labelPosition ||
         //       ABViewFormPropertyComponentDefaults.labelPosition
         // );
         // $$(ids.labelWidth).setValue(
         //    view.settings.labelWidth ||
         //       ABViewFormPropertyComponentDefaults.labelWidth
         // );
         // $$(ids.height).setValue(
         //    view.settings.height || ABViewFormPropertyComponentDefaults.height
         // );
         // $$(ids.clearOnLoad).setValue(
         //    view.settings.clearOnLoad ||
         //       ABViewFormPropertyComponentDefaults.clearOnLoad
         // );
         // $$(ids.clearOnSave).setValue(
         //    view.settings.clearOnSave ||
         //       ABViewFormPropertyComponentDefaults.clearOnSave
         // );

         // NOTE: load the object and view BEFORE the .fromSettings();
         PopupRecordRule.objectLoad(this.CurrentObject);
         PopupRecordRule.viewLoad(view);
         PopupRecordRule.fromSettings(view.settings.recordRules || []);

         PopupSubmitRule.objectLoad(this.CurrentObject);
         PopupSubmitRule.viewLoad(view);
         PopupSubmitRule.fromSettings(view.settings.submitRules || []);

         // this.propertyUpdateRules(ids, view, datacollectionId);
         this.populateBadgeNumber();

         // when a change is made in the properties the popups need to reflect the change
         this.updateEventIds = this.updateEventIds || {}; // { viewId: boolean, ..., viewIdn: boolean }
         if (!this.updateEventIds[view.id]) {
            this.updateEventIds[view.id] = true;

            view.addListener("properties.updated", () => {
               this.populateBadgeNumber();
            });
         }
      }

      defaultValues() {
         let values = {};
         var ViewClass = this.ViewClass();
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
         let ids = this.ids;
         let vals = super.values();

         let DefaultValues = this.defaultValues();

         const $component = $$(ids.component);

         vals.settings = vals.settings || {};
         vals.settings = $component.getValues();

         vals.settings.dataviewID = $$(ids.datacollection).getValue();
         vals.settings.showLabel = $$(ids.showLabel).getValue();
         vals.settings.labelPosition =
            $$(ids.labelPosition).getValue() || DefaultValues.labelPosition;
         vals.settings.labelWidth =
            $$(ids.labelWidth).getValue() || DefaultValues.labelWidth;
         vals.settings.height = $$(ids.height).getValue();
         vals.settings.clearOnLoad = $$(ids.clearOnLoad).getValue();
         vals.settings.clearOnSave = $$(ids.clearOnSave).getValue();

         vals.settings.recordRules = PopupRecordRule.toSettings();
         vals.settings.submitRules = PopupSubmitRule.toSettings();
         return vals;
      }

      //
      //
      //

      busy() {
         $$(this.ids.component)?.showProgress?.({ type: "icon" });
      }

      check(e, fieldId) {
         const ids = this.ids;
         let currView = this.CurrentView;
         let formView = currView.parentFormComponent();

         // update UI list
         let item = $$(ids.fields).getItem(fieldId);
         item.selected = item.selected ? 0 : 1;
         $$(ids.fields).updateItem(fieldId, item);

         let doneFn = () => {
            formView
               .refreshDefaultButton(ids)
               .save()
               .then(() => {
                  // refresh UI
                  currView.emit("properties.updated", currView);
                  this.onChange();
               });

            // // trigger a save()
            // this.propertyEditorSave(ids, currView);
         };

         // add a field to the form
         if (item.selected) {
            let fieldView = currView.addFieldToForm(item);
            if (fieldView) {
               fieldView.save().then(() => {
                  fieldView.once("destroyed", () => this.populate(currView));
                  currView.viewInsert(fieldView).then(() => {
                     doneFn();
                  });
               });
            }
         }
         // remove field in the form
         else {
            let fieldView = formView
               .fieldComponents()
               .filter((c) => c.settings.fieldId == fieldId)[0];
            if (fieldView) {
               // let remainingViews = formView.views(c => c.settings.fieldId != fieldId);
               // formView._views = remainingViews;

               fieldView.destroy();
               currView.viewRemove(fieldView).then(() => {
                  doneFn();
               });
            }
         }
      }

      populateBadgeNumber(/* */) {
         const ids = this.ids;

         let view = this.CurrentView;

         if (!view) return;

         if (view.settings.submitRules) {
            $$(ids.buttonSubmitRules).define(
               "badge",
               view.settings.submitRules.length || null
            );
         } else {
            $$(ids.buttonSubmitRules).define("badge", null);
         }
         $$(ids.buttonSubmitRules).refresh();

         // if (view.settings.displayRules) {
         //    $$(ids.buttonDisplayRules).define(
         //       "badge",
         //       view.settings.displayRules.length || null
         //    );
         //    $$(ids.buttonDisplayRules).refresh();
         // } else {
         //    $$(ids.buttonDisplayRules).define("badge", null);
         //    $$(ids.buttonDisplayRules).refresh();
         // }

         if (view.settings.recordRules) {
            $$(ids.buttonRecordRules).define(
               "badge",
               view.settings.recordRules.length || null
            );
         } else {
            $$(ids.buttonRecordRules).define("badge", null);
         }
         $$(ids.buttonRecordRules).refresh();
      }

      ready() {
         $$(this.ids.component)?.hideProgress?.();
      }

      recordRuleShow() {
         PopupRecordRule.fromSettings(this.CurrentView.settings.recordRules);
         PopupRecordRule.show();
      }

      submitRuleShow() {
         PopupSubmitRule.fromSettings(this.CurrentView.settings.submitRules);
         PopupSubmitRule.show();
      }

      listTemplate(field, common) {
         let currView = this.CurrentView;

         // disable in form
         var fieldComponent = field.formComponent();
         if (fieldComponent == null)
            return `<i class='fa fa-times'></i>  ${field.label} <div class='ab-component-form-fields-component-info'> Disable </div>`;

         var componentKey = fieldComponent.common().key;
         var formComponent = currView.application.viewAll(
            (v) => v.common().key == componentKey
         )[0];

         return `${common.markCheckbox(field)} ${
            field.label
         } <div class='ab-component-form-fields-component-info'> <i class='fa fa-${
            formComponent ? formComponent.common().icon : "fw"
         }'></i> ${
            formComponent ? L(formComponent.common().labelKey) : ""
         } </div>`;
      }

      /**
       * @method propertyUpdateFieldOptions
       * Populate fields of object to select list in property
       *
       * @param {ABViewForm} view - the current component
       * @param {string} dcId - id of ABDatacollection
       */
      propertyUpdateFieldOptions(dcId) {
         const ids = this.ids;
         var formComponent = this.CurrentView?.parentFormComponent();
         var existsFields = formComponent?.fieldComponents() ?? [];
         var datacollection = this.AB.datacollectionByID(dcId);
         var object = datacollection ? datacollection.datasource : null;

         // Pull field list
         var fieldOptions = [];
         if (object != null) {
            fieldOptions = object.fields().map((f) => {
               f.selected =
                  existsFields.filter((com) => {
                     return f.id == com.settings.fieldId;
                  }).length > 0;

               return f;
            });

            this.objectLoad(object);
         }

         $$(ids.fields).clearAll();
         $$(ids.fields).parse(fieldOptions);
      }

      refreshDefaultButton() {
         const ids = this.ids;
         const ABViewFormButton =
            this.AB.Class.ABViewManager.viewClass("button");

         // If default button is not exists, then skip this
         let defaultButton = this.views(
            (v) => v instanceof ABViewFormButton && v.settings.isDefault
         )[0];

         // Add a default button
         if (defaultButton == null) {
            defaultButton = ABViewFormButton.newInstance(
               this.application,
               this
            );
            defaultButton.settings.isDefault = true;
         }
         // Remove default button from array, then we will add it to be the last item later (.push)
         else {
            this._views = this.views(
               (v) => !(v instanceof ABViewFormButton) && !v.settings.isDefault
            );
         }

         // Calculate position Y of the default button
         let yList = this.views().map((v) => (v.position.y || 0) + 1);
         yList.push(this._views.length || 0);
         yList.push($$(ids.fields).length || 0);
         let posY = Math.max(...yList);

         // Update to be the last item
         defaultButton.position.y = posY;

         // Keep the default button is always the last item of array
         this._views.push(defaultButton);

         return defaultButton;
      }

      selectSource(dcId /*, oldDcId */) {
         // TODO : warning message
         const ids = this.ids;
         this.busy();

         let currView = this.CurrentView;
         let formView = currView.parentFormComponent();

         currView.settings.dataviewID = dcId;

         // clear sub views
         var viewsToRemove = currView._views;
         currView._views = [];

         return (
            Promise.resolve()
               .then(() => {
                  var allRemoves = [];
                  viewsToRemove.forEach((v) => {
                     allRemoves.push(v.destroy());
                  });
                  return Promise.all(allRemoves);
               })
               // .then(() => {
               //    // remove all old components
               //    let destroyTasks = [];
               //    if (oldDcId != null) {
               //       let oldComps = formView.views();
               //       oldComps.forEach(child => destroyTasks.push(() => child.destroy()));
               //    }

               //    return destroyTasks.reduce((promiseChain, currTask) => {
               //       return promiseChain.then(currTask);
               //    }, Promise.resolve([]));
               // })
               .then(() => {
                  // refresh UI
                  // formView.emit('properties.updated', currView);

                  // Update field options in property
                  this.propertyUpdateFieldOptions(dcId);

                  // add all fields to editor by default
                  if (currView._views.length > 0) return Promise.resolve();

                  let saveTasks = [];
                  let fields = $$(ids.fields).find({});

                  // fields.reverse();
                  fields.forEach((f, index) => {
                     if (!f.selected) {
                        let yPosition = fields.length - index - 1;

                        // Add new form field
                        let newFieldView = currView.addFieldToForm(
                           f,
                           yPosition
                        );
                        // @TODO: filter out unknown mobile-view
                        if (!newFieldView) return;
                        if (newFieldView.defaults.key == "mobile-view") return;

                        newFieldView.once("destroyed", () =>
                           this.populate(currView)
                        );

                        // // Call save API
                        saveTasks.push(newFieldView.save());

                        // update item to UI list
                        f.selected = 1;
                        $$(ids.fields).updateItem(f.id, f);
                     }
                  });

                  let defaultButton = formView.refreshDefaultButton(ids);
                  if (defaultButton) saveTasks.push(defaultButton.save());

                  return Promise.all(saveTasks);
               })
               // Saving
               .then(() => {
                  //// NOTE: the way the .addFieldToForm() works, it will prevent
                  //// the typical field.save() -> triggering the form.save() on a
                  //// new Field.  So once all our field.saves() are finished, we
                  //// need to perform a form.save() to persist the changes.
                  return currView.save();
               })
               // Finally
               .then(() => {
                  // refresh UI
                  formView.emit("properties.updated", currView);

                  // Update field options in property
                  // this.propertyUpdateRules(ids, currView, dcId);

                  this.ready();
                  this.onChange();
                  return Promise.resolve();
               })
         );
      }
   }

   return ABMobileViewFormProperty;
}
