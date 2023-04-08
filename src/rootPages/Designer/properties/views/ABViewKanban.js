/*
 * ABViewKanban
 * A Property manager for our ABViewKanban definitions
 */

import FABView from "./ABView";
import FViewKanbanProperties from "../workspaceViews/ABViewKanban";
import FPopupNewDataField from "../../ui_work_object_workspace_popupNewDataField";

export default function (AB) {
   const BASE_ID = "properties_abview_kanban";

   const ABView = FABView(AB);
   const L = ABView.L();
   const uiConfig = AB.UISettings.config();

   const ViewKanbanProperties = FViewKanbanProperties(AB, `${BASE_ID}_prop`);
   var PopupNewDataFieldComponent = null;
   // NOTE: this is the instance of the FPopupNewDataField.
   // however we need to make the instance later to prevent an inifinite
   // recursion upon loading.

   class ABViewKanbanProperty extends ABView {
      constructor() {
         super(BASE_ID, { datacollection: "" });
      }

      static get key() {
         return "kanban";
      }

      ui() {
         let _ui = ViewKanbanProperties.ui();

         let rows = [
            {
               view: "fieldset",
               label: L("Kanban Data:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: this.ids.datacollection,
                        view: "richselect",
                        name: "dataviewID",
                        label: L("Data Source:"),
                        placeholder: L("Select a Datacollection"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: (newv, oldv) => {
                              if (newv != oldv) {
                                 this.refreshFields(newv);
                                 this.onChange();
                              }
                           },
                        },
                     },
                  ],
               },
            },
            ..._ui.rows,
         ];

         return super.ui(rows);
      }

      async init(AB) {
         this.AB = AB;

         ViewKanbanProperties.on("new.field", (key) => {
            let dc = this.AB.datacollectionByID(
               this.CurrentView.settings.dataviewID
            );
            PopupNewDataFieldComponent.objectLoad(dc.datasource);
            PopupNewDataFieldComponent.resetState();
            PopupNewDataFieldComponent.show(null, key, false);
         });
         ViewKanbanProperties.on("changed", () => {
            this.onChange();
         });

         // NOTE: keep this definition in the .init() routine
         // to prevent an infinite recursion.
         PopupNewDataFieldComponent = FPopupNewDataField(
            AB,
            `${BASE_ID}_popupNewDataField`
         );
         await PopupNewDataFieldComponent.init(AB);
         PopupNewDataFieldComponent.on("save", (...params) => {
            ViewKanbanProperties.emit("field.added", params[0]);
         });

         await super.init(AB);
      }

      populate(view) {
         super.populate(view);

         // Load in all the Available Datacollections:
         var listDC = view.application.datacollectionsIncluded().map((d) => {
            return {
               id: d.id,
               value: d.label,
               icon:
                  d.sourceType == "query" ? "fa fa-filter" : "fa fa-database",
            };
         });

         let $dc = $$(this.ids.datacollection);
         let dcID = view.settings.dataviewID || null;
         $dc.blockEvent();
         $dc.define("options", listDC);
         $dc.define("value", dcID);
         $dc.unblockEvent();
         $dc.refresh();
         this.refreshFields(dcID);
      }

      refreshFields(dcID) {
         let dc = this.AB.datacollectionByID(dcID);
         if (!dc) {
            ViewKanbanProperties.clearValues();
            return;
         }

         let obj = dc.datasource;
         ViewKanbanProperties.init(obj, this.CurrentView);
         PopupNewDataFieldComponent.objectLoad(obj);
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const values = super.values();

         const ids = this.ids;
         const $component = $$(ids.component);

         values.settings = $component.getValues();

         // let fields = ViewKanbanProperties.values();
         // Object.keys(fields).forEach((f) => {
         //    values.settings[f] = fields[f];
         // });

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("kanban");
      }
   }

   return ABViewKanbanProperty;
}
