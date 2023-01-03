/**
 * ABViewLayoutEditor
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 */
let myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import UI_Class from "../../ui_class";

export default function (AB) {
   if (!myClass) {
      const UIClass = UI_Class(AB);
      const L = (...params) => AB.Multilingual.label(...params);

      myClass = class ABViewLayoutEditor extends UIClass {
         static get key() {
            return "layout";
         }

         constructor(view, base = "interface_editor_view_layout") {
            // base: {string} unique base id reference

            super(base);
         }

         get viewComponent() {
            const currView = this.CurrentView;
            if (currView && !this._component) {
               this._component = currView.component();
            }

            return this._component;
         }

         ui() {
            const childViews = this.CurrentView.views();
            const _ui = this.viewComponent.ui();
            _ui.type = "form";

            if (childViews.length) {
               childViews.forEach((v, index) => {
                  const vComponent = v.component();
                  const vUI = vComponent.ui();

                  _ui.cols[index] = {
                     rows: [
                        // Add action buttons
                        {
                           type: "template",
                           css: "ab-layout-header",
                           height: 30,
                           template: this.templateButton({
                              icon: v.icon,
                              label: v.label,
                           }),
                           onClick: {
                              "ab-component-edit": (e, id, trg) => {
                                 this.viewEdit(e, v.id, trg);
                              },
                              "ab-component-remove": (e, id, trg) => {
                                 this.viewDelete(e, v.id, trg);
                              },
                           },
                        },
                        // Preview display here
                        vUI,
                        {},
                     ],
                  };
               });
            } else {
               _ui.cols[0] = {};
            }

            return _ui;
         }

         init(AB, accessLevel) {
            this.AB = AB;

            this.viewComponent.init(AB, accessLevel);
            this.viewComponent.onShow?.();

            // initial sub views
            const childViews = this.CurrentView.views();
            childViews.forEach((v) => {
               const vComponent = v.component();
               vComponent.init(AB, accessLevel);
               vComponent.onShow?.();
            });
         }

         detatch() {
            this.viewComponent?.detatch?.();
         }

         templateButton(obj) {
            return `<div class="ab-widget-header ab-layout-header">
               <i class="fa fa-${obj.icon} webix_icon_btn"></i> ${obj.label}
               <div class="ab-component-tools">
               <i class="fa fa-trash ab-component-remove"></i>
               <i class="fa fa-edit ab-component-edit"></i>
               </div></div>`;
         }

         viewEdit(e, id, trg) {
            const view = this.CurrentView.views((v) => v.id == id)[0];
            if (!view) return false;

            // NOTE: let webix finish this onClick event, before
            // calling .populateInterfaceWorkspace() which will replace
            // the interface elements with the edited view.  (apparently
            // that causes errors.)
            setTimeout(() => {
               try {
                  this.emit("view.edit", view);
               } catch (err) {
                  console.error(err);
               }
            }, 50);

            e.preventDefault();
            return false;
         }

         viewDelete(e, id, trg) {
            const view = this.CurrentView.views((v) => v.id == id)[0];
            if (!view) return false;

            this.AB.Webix.confirm({
               title: L("Delete component"),
               text: L("Do you want to delete <b>{0}</b>?", [view.label]),
               callback: (result) => {
                  if (result) {
                     view.destroy().then(() => {
                        view.emit("destroyed", view);
                        this.emit("view.destroyed", view);
                     });
                  }
               },
            });
            e.preventDefault();
         }
      };
   }

   return myClass;
}
