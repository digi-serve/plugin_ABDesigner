/*
 * ab_work_object_workspace_PopupAddView
 *
 * Manage the Sort Fields popup.
 *
 */

import FormABViewGantt from "./properties/views/ABViewGantt";
import FormABViewGrid from "./properties/views/ABViewGrid";
import FormABViewKanBan from "./properties/views/ABViewKanban";

export default function (AB) {
   const ABViewGrid = FormABViewGrid(AB);

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_Workspace_PopupAddView extends AB.ClassUI {
      constructor() {
         var base = "abd_work_object_workspace_popupAddView";

         super({
            component: `${base}_component`,
            form: `${base}_popupAddViewForm`,
            formAdditional: `${base}_popupAddViewFormAdditional`,
            nameInput: `${base}_popupAddViewName`,
            typeInput: `${base}_popupAddViewType`,
            cancelButton: `${base}_popupAddViewCancelButton`,
            saveButton: `${base}_popupAddViewSaveButton`,
         });

         this._object = null;
         // {ABObject} the current ABObject we are working with.

         this._view = null;
         // {Grid/kanban/Gantt} the current UI View type we are displaying

         this.comKanban = FormABViewKanBan(AB, `${base}_kanban`);
         this.comGantt = FormABViewGantt(AB, `${base}_gantt`);
      }

      ui() {
         var ids = this.ids;

         // Our webix UI definition:
         var formUI = {
            view: "form",
            id: ids.form,
            visibleBatch: "global",
            rules: {
               hGroup: (value, { vGroup }) => {
                  return !value || value !== vGroup;
               },
            },
            elements: [
               {
                  view: "text",
                  label: L("Name"),
                  id: ids.nameInput,
                  name: "name",
                  placeholder: L("Create a name for the view"),
                  required: true,
                  invalidMessage: L("this field is required"),
                  on: {
                     onChange: (/* id */) => {
                        $$(ids.nameInput).validate();
                     },
                  },
               },
               {
                  view: "richselect",
                  label: L("Type"),
                  id: ids.typeInput,
                  name: "type",
                  options: [
                     {
                        id: ABViewGrid.type(),
                        value: L("Grid"),
                     },
                     {
                        id: this.comKanban.type(),
                        value: L("Kanban"),
                     },
                     {
                        id: this.comGantt.type(),
                        value: L("Gantt"),
                     },
                  ],
                  value: ABViewGrid.type(),
                  required: true,
                  on: {
                     onChange: (typeView) => {
                        this.switchType(typeView);
                     },
                  },
               },
               {
                  id: ids.formAdditional,
                  view: "layout",
                  rows: [this.comKanban.ui(), this.comGantt.ui()],
               },
               {
                  margin: 5,
                  cols: [
                     { fillspace: true },
                     {
                        view: "button",
                        value: L("Cancel"),
                        css: "ab-cancel-button",
                        autowidth: true,
                        click: () => {
                           this.buttonCancel();
                        },
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        value: L("Save"),
                        autowidth: true,
                        type: "form",
                        click: () => {
                           this.buttonSave();
                        },
                     },
                  ],
               },
            ],
         };

         return {
            view: "window",
            id: ids.component,
            height: 400,
            width: 400,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("View Settings"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     label: L("Close"),
                     autowidth: true,
                     align: "center",
                     click: () => {
                        this.buttonCancel();
                     },
                  },
               ],
            },
            position: "center",
            body: formUI,
            modal: true,
            on: {
               onShow: () => {
                  this.onShow();
               },
            },
         };
      } // ui()

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         return Promise.resolve();
      } // init()

      objectLoad(object) {
         this._object = object;
      }

      switchType(typeView) {
         $$(this.ids.formAdditional).showBatch(typeView);

         // initial
         switch (typeView) {
            case "kanban":
               this.comKanban.init(this._object, this._view);
               break;
            case "gantt":
               this.comGantt.init(this._object, this._view);
               break;
         }

         $$(this.ids.component).resize();
      }

      onShow() {
         var ids = this.ids;

         // clear field options in the form
         $$(ids.form).clear();
         $$(ids.form).clearValidation();

         if (this._view) {
            $$(ids.nameInput).setValue(this._view.name);
            $$(ids.typeInput).setValue(this._view.type);
         }
         // Default value
         else {
            $$(ids.nameInput).setValue("");
            $$(ids.typeInput).setValue(ABViewGrid.type());
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show(viewObj) {
         this._view = viewObj;
         $$(this.ids.component).show();
      }

      /**
       * @function hide()
       *
       * hide this component.
       */
      hide() {
         $$(this.ids.component).hide();
      }

      buttonCancel() {
         this.hide();
      }

      buttonSave() {
         var ids = this.ids;
         if (!$$(ids.form).validate()) return;

         var view = {};

         switch ($$(ids.typeInput).getValue()) {
            case this.comKanban.type():
               // validate
               if (
                  this.comKanban.validate &&
                  !this.comKanban.validate($$(ids.form))
               )
                  return;

               view = this.comKanban.values();
               break;

            case this.comGantt.type():
               // validate
               if (
                  this.comGantt.validate &&
                  !this.comGantt.validate($$(ids.form))
               )
                  return;

               view = this.comGantt.values($$(ids.form));
               break;
         }

         // save the new/updated view
         view.name = $$(ids.nameInput).getValue();
         view.type = $$(ids.typeInput).getValue();

         // var viewObj;
         if (this._view) {
            // viewObj = this._object.workspaceViews.updateView(this._view, view);
            this.emit("updated", view);
            // this.callbacks.onViewUpdated(viewObj);
         } else {
            // viewObj = this._object.workspaceViews.addView(view);
            this.emit("added", view);
            // this.callbacks.onViewAdded(viewObj);
         }
         this.hide();
      }
   }
   return new UI_Work_Object_Workspace_PopupAddView();
}
