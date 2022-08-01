/**
 * ABViewTab
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 */
let myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import UI_Class from "../../ui_class";
import FTabPopup from "../../interface_common/ui_tab_form_popup";

export default function (AB) {
   if (!myClass) {
      const BASE_ID = "interface_editor_viewtab";

      const UIClass = UI_Class(AB);
      const L = UIClass.L();

      const TabPopup = FTabPopup(AB);

      myClass = class ABViewTabEditor extends UIClass {
         static get key() {
            return "tab";
         }

         constructor(view, base = BASE_ID) {
            // base: {string} unique base id reference
            super(base, {
               view: "",
            });

            this.AB = AB;
            this.view = view;
            this.component = this.view.component();
         }

         ui() {
            const ids = this.ids;
            const baseView = this.view;
            const component = this.component;
            const componentUI = this.component.ui();

            if (componentUI.rows) {
               componentUI.rows[0].id = ids.component;
               componentUI.rows[0].tabbar = {
                  height: 60,
                  type: "bottom",
                  css: baseView.settings.darkTheme ? "webix_dark" : "",
                  on: {
                     onItemClick: (id, e) => {
                        const tabID = $$(ids.component).getValue();
                        const tab = baseView.views(
                           (view) => view.id === tabID
                        )[0];
                        const currIndex = baseView._views.findIndex(
                           (view) => view.id === tabID
                        );

                        // Rename
                        if (e.target.classList.contains("rename")) {
                           baseView.tabPopup.show(tab);
                        }
                        // Reorder back
                        else if (e.target.classList.contains("move-back")) {
                           baseView.viewReorder(tabID, currIndex - 1);

                           // refresh editor view
                           baseView.emit("properties.updated", baseView);
                        }
                        // Reorder next
                        else if (e.target.classList.contains("move-next")) {
                           baseView.viewReorder(tabID, currIndex + 1);

                           // refresh editor view
                           baseView.emit("properties.updated", baseView);
                        }
                     },
                  },
               };

               // Add action buttons
               for (
                  let i = 0;
                  i < (componentUI.rows[0]?.cells ?? []).length;
                  i++
               ) {
                  // Add 'move back' icon
                  componentUI.rows[0].cells[
                     i
                  ].header = `<i class="fa fa-caret-left move-back ab-tab-back"></i>${componentUI.rows[0]?.cells[i].header}`;

                  // Add 'edit' icon
                  componentUI.rows[0].cells[i].header +=
                     ' <i class="fa fa-pencil-square rename ab-tab-edit"></i>';

                  // Add 'move next' icon
                  componentUI.rows[0].cells[i].header +=
                     ' <i class="fa fa-caret-right move-next ab-tab-next"></i>';
               }
            } else if (componentUI.cols) {
               // if we detect colums we are using sidebar and need to format the onItemClick event differently
               let viewIndex = 1;
               let tabIndex = 0;

               if (baseView.settings.sidebarPos === "right") {
                  // the sidebar is in the second column now so we need to reference it properly
                  viewIndex = 0;
                  tabIndex = 1;
               }

               componentUI.cols[viewIndex].id = ids.component;
               componentUI.cols[tabIndex].on = {
                  onItemClick: (id, e) => {
                     const tabID = id.replace("_menu", "");
                     const tab = baseView.views((view) => view.id == tabID)[0];
                     const currIndex = baseView._views.findIndex(
                        (view) => view.id === tabID
                     );

                     component.onShow(tabID);

                     // Rename
                     if (e.target.classList.contains("rename"))
                        baseView.tabPopup.show(tab);
                     // Reorder back
                     else if (e.target.classList.contains("move-back")) {
                        baseView.viewReorder(tabID, currIndex - 1);

                        // refresh editor view
                        baseView.emit("properties.updated", baseView);
                     }
                     // Reorder next
                     else if (e.target.classList.contains("move-next")) {
                        baseView.viewReorder(tabID, currIndex + 1);

                        // refresh editor view
                        baseView.emit("properties.updated", baseView);
                     }
                  },
               };

               // Add action buttons
               for (
                  let i = 0;
                  i < (componentUI.cols[tabIndex].data ?? []).length;
                  i++
               ) {
                  // Add 'edit' icon
                  componentUI.cols[tabIndex].data[i].value =
                     componentUI.cols[tabIndex].data[i].value +
                     ' <i class="fa fa-pencil-square rename ab-tab-edit"></i>';
                  // Add 'move up' icon
                  componentUI.cols[tabIndex].data[i].value +=
                     '<i class="fa fa-caret-up move-back ab-tab-up"></i>';
                  // Add 'move down' icon
                  componentUI.cols[tabIndex].data[i].value +=
                     ' <i class="fa fa-caret-down move-next ab-tab-down"></i>';
               }
            }

            return {
               rows: [componentUI],
            };
         }

         async init(AB) {
            this.AB = AB;

            const ids = this.ids;

            await this.component.init(this.AB);

            const $component = $$(ids.component);

            // Add actions buttons - Edit , Delete
            if ($component.config.view === "tabview") {
               webix.ui({
                  container: $component.getMultiview().$view,
                  view: "template",
                  autoheight: false,
                  height: 1,
                  width: 0,
                  template: [
                     '<div class="ab-component-tools ab-layout-view ab-tab-tools">',
                     '<i class="fa fa-trash ab-component-remove"></i>',
                     '<i class="fa fa-edit ab-component-edit"></i>',
                     "</div>",
                  ].join(""),
                  onClick: {
                     "ab-component-edit": (e, id, trg) => {
                        this.tabEdit(e, id, trg);
                     },
                     "ab-component-remove": (e, id, trg) => {
                        this.tabRemove(e, id, trg);
                     },
                  },
               });
            } else if ($component.config.view === "multiview") {
               webix.ui({
                  container: $component.$view,
                  view: "template",
                  autoheight: false,
                  height: 1,
                  width: 0,
                  template: [
                     '<div class="ab-component-tools ab-layout-view ab-tab-tools">',
                     '<i class="fa fa-trash ab-component-remove"></i>',
                     '<i class="fa fa-edit ab-component-edit"></i>',
                     "</div>",
                  ].join(""),
                  onClick: {
                     "ab-component-edit": (e) => {
                        this.tabEdit(e);
                     },
                     "ab-component-remove": (e) => {
                        this.tabRemove(e);
                     },
                  },
               });
            }

            const baseView = this.view;

            if (!baseView.tabPopup) {
               baseView.tabPopup = new TabPopup(baseView);
               baseView.tabPopup.init(AB);
            }

            // this.component.onShow();
            // in our editor, we provide accessLv = 2
         }

         // templateBlock(tab) {
         // 	const _template = [
         // 		'<div class="ab-component-in-page">',
         // 		'<div id="' + ids.view + '_#objID#" >',
         // 		'<i class="fa fa-#icon#"></i>',
         // 		' #label#',
         // 		'</div>',
         // 		'</div>'
         // 	].join('');

         // 	return _template
         // 		.replace('#objID#', tab.id)
         // 		.replace('#icon#', tab.icon)
         // 		.replace('#label#', tab.label);
         // }

         tabEdit(element) {
            const tabID = $$(this.ids.component).getValue();
            const view = this.view.views((view) => view.id == tabID)[0];

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

            element.preventDefault();

            return false;
         }

         tabRemove(element) {
            const ids = this.ids;

            const $component = $$(ids.component);

            const tabID = $component.getValue();
            const deletedView = this.view.views((view) => view.id == tabID)[0];

            if (deletedView) {
               webix.confirm({
                  title: L("Delete tab"),
                  text: L("Do you want to delete <b>{0}</b>?", [
                     deletedView.label,
                  ]),
                  callback: (result) => {
                     if (result) {
                        // this.viewDestroy(deletedView);
                        deletedView.destroy();

                        const componentUI = this.component.ui();

                        // remove tab option
                        if (componentUI.rows) $component.removeView(tabID);
                        else {
                           let $sidebar = null;

                           for (let i = 0; i < componentUI.cols.length; i++)
                              if (componentUI.cols[i].view === "sidebar") {
                                 $sidebar = $$(componentUI.cols[i].id);

                                 break;
                              }

                           $sidebar.remove(`${tabID}_menu`);
                        }
                     }
                  },
               });
            }

            element.preventDefault();

            return false;
         }

         detatch() {
            this.component.detatch?.();
         }

         onShow() {
            this.component.onShow();
         }
      };
   }

   return myClass;
}
