/*
 * ui_work_object_workspace_popupViewSettings
 *
 * Manage the popup to collect the settings for a workspace view.
 *
 */
import UI_Class from "./ui_class";
import FormABViewGantt from "./properties/workspaceViews/ABViewGantt";
import FormABViewGrid from "./properties/workspaceViews/ABViewGrid";
import FormABViewKanBan from "./properties/workspaceViews/ABViewKanban";

export default function (AB, ibase, isettings) {
   ibase = ibase || "abd_work_object_workspace_popupAddView";
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupAddView extends UIClass {
      constructor(base, settings = {}) {
         super(base, {
            form: "",
            formAdditional: "",
            nameInput: "",
            typeInput: "",
            cancelButton: "",
            cancelX: "",
            saveButton: "",
         });

         settings.isReadOnly = settings.isReadOnly ?? false;
         this.settings = settings;

         this._view = null;
         // {Grid/kanban/Gantt} the current UI View type we are displaying

         this.comGrid = FormABViewGrid(AB, `${base}_grid`);

         this.comKanban = FormABViewKanBan(AB, `${base}_kanban`);
         this.comKanban.on("new.field", (key) => {
            this._newFieldSource = "comKanban";
            this.emit("new.field", key);
         });
         this.comGantt = FormABViewGantt(AB, `${base}_gantt`);
         this.comGantt.on("new.field", (key) => {
            this._newFieldSource = "comGantt";
            this.emit("new.field", key);
         });

         this.on("field.added", (field) => {
            this[this._newFieldSource]?.emit("field.added", field);
         });
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
                     onAfterRender() {
                        UIClass.CYPRESS_REF(this);
                     },
                  },
               },
               {
                  view: "richselect",
                  label: L("Type"),
                  id: ids.typeInput,
                  name: "type",
                  hidden: this.settings.isReadOnly,
                  options: [
                     {
                        id: this.comGrid.type(),
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
                  value: this.comGrid.type(),
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
                        id: ids.buttonCancel,
                        view: "button",
                        value: L("Cancel"),
                        css: "ab-cancel-button",
                        autowidth: true,
                        click: () => {
                           this.buttonCancel();
                        },
                        on: {
                           onAfterRender() {
                              UIClass.CYPRESS_REF(this);
                           },
                        },
                     },
                     {
                        id: ids.buttonSave,
                        view: "button",
                        css: "webix_primary",
                        value: L("Save"),
                        autowidth: true,
                        type: "form",
                        click: () => {
                           this.buttonSave();
                        },
                        on: {
                           onAfterRender() {
                              UIClass.CYPRESS_REF(this);
                           },
                        },
                     },
                  ],
               },
            ],
         };

         return {
            view: "window",
            id: ids.component,
            width: 400,
            resize: true,
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
                     id: ids.cancelX,
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.buttonCancel();
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
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

      switchType(typeView) {
         $$(this.ids.formAdditional).showBatch(typeView);

         // initial
         switch (typeView) {
            case "kanban":
               this.comKanban.init(this.CurrentObject, this._view);
               break;
            case "gantt":
               this.comGantt.init(this.CurrentObject, this._view);
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
            // NOTE: the $$(ids.typeInput).onChange() will trigger
            // the selected view's refresh.
         }
         // Default value
         else {
            $$(ids.nameInput).setValue("");
            $$(ids.typeInput).setValue(this.comGrid.type());
         }
      }

      /**
       * @function show()
       * Show this component.  If a viewObj is passed in, then we are editing
       * a component. Otherwise, this is an Add operation.
       * @param {ui_work_object_workspace_view_*} viewObj
       *        The currentView definitions of an existing view we are editing
       */
      show(viewObj) {
         this._view = viewObj;
         $$(this.ids.component).show();
      }

      /**
       * @function hide()
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
            Object.keys(view).forEach((k) => {
               this._view[k] = view[k];
            });
            this.emit("updated", this._view);
            // this.callbacks.onViewUpdated(viewObj);
         } else {
            // viewObj = this.CurrentObject.workspaceViews.addView(view);
            this.emit("added", view);
         }
         this.hide();
      }
   }
   return new UI_Work_Object_Workspace_PopupAddView(ibase, isettings);
}
