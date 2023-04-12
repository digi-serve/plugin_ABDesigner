/*
 * ABViewGantt
 * A Property manager for our ABViewGantt definitions
 */

import FABView from "./ABView";

import FABViewGanttWorkspaceView from "../workspaceViews/ABViewGantt";

import FPopupNewDataField from "../../ui_work_object_workspace_popupNewDataField";

export default function (AB) {
   const BASE_ID = "properties_abview_gantt";

   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   const ABViewGanttWorkspaceView = FABViewGanttWorkspaceView(
      AB,
      `${BASE_ID}_workspaceView_gantt`
   );

   class ABViewGanttProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            dataviewID: "",
            fields: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "gantt";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "fieldset",
               label: `${L("Gantt Data")}:`,
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.dataviewID,
                        view: "richselect",
                        name: "dataviewID",
                        label: `${L("Datacollection")}:`,
                        labelWidth: uiConfig.labelWidthLarge,
                        on: {
                           onChange: (newValue, oldValue) => {
                              if (newValue === oldValue) return;

                              ABViewGanttWorkspaceView.emit(
                                 "dc.changed",
                                 newValue,
                                 this.CurrentView
                              );

                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },
            {
               view: "fieldset",
               label: `${L("Gantt Fields")}:`,
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  id: ids.fields,
                  view: "form",
                  name: "fields",
                  borderless: true,
                  elements: [ABViewGanttWorkspaceView.ui()],
                  on: {
                     onChange: () => {
                        this.onChange();
                     },
                  },
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         this.PopupNewDataFieldComponent = FPopupNewDataField(
            AB,
            `${BASE_ID}_popupNewDataField`
         );
         await this.PopupNewDataFieldComponent.init(AB);
         this.PopupNewDataFieldComponent.on("save", (...params) => {
            ABViewGanttWorkspaceView.emit("field.added", params[0]);
         });

         ABViewGanttWorkspaceView.on("dc.changed", (dcID, view) => {
            const DC = this.AB.datacollectionByID(dcID);

            ABViewGanttWorkspaceView.init(DC.datasource, view);
            this.PopupNewDataFieldComponent.objectLoad(DC.datasource);
         });

         ABViewGanttWorkspaceView.on("new.field", (fieldKey) => {
            this.PopupNewDataFieldComponent.show(null, fieldKey, false);
         });

         await super.init(AB);
      }

      populateDataview() {
         // Pull data collections to options
         // / NOTE: only include System Objects if the user has permission
         const datacollectionFilter = this.AB.Account.isSystemDesigner()
            ? (obj) => !obj.isSystemObject
            : () => true;
         const datacollections =
            this.CurrentApplication.datacollectionsIncluded(
               datacollectionFilter
            );

         // Set the objects you can choose from in the list
         const $dataviewID = $$(this.ids.dataviewID);

         $dataviewID.define(
            "options",
            datacollections.map((e) => {
               return {
                  id: e.id,
                  value: e.label,
                  icon:
                     e.sourceType == "query"
                        ? "fa fa-filter"
                        : "fa fa-database",
               };
            })
         );
         $dataviewID.refresh();
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const $component = $$(ids.component);
         const defaultValues = this.defaultValues();
         const values = Object.assign(
            $component.getValues(),
            defaultValues,
            view.settings
         );

         this.populateDataview();

         $component.setValues(values);

         let DC = this.AB.datacollectionByID(values.dataviewID);
         if (DC) {
            ABViewGanttWorkspaceView.init(DC.datasource, this.CurrentView);
            this.PopupNewDataFieldComponent.objectLoad(DC.datasource);
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
         const values = super.values();
         const ids = this.ids;

         values.settings = Object.assign(
            $$(ids.component).getValues(),
            $$(ids.fields).getValues()
         );

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("gantt");
      }
   }

   return ABViewGanttProperty;
}
