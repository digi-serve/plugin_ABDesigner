/*
 * ui_work_interface_list
 *
 * Manage the ABInterface List
 *
 */

import UI_Class from "./ui_class";
import UIListNewPage from "./ui_work_interface_list_newPage";
import UIListCopyPage from "./ui_work_interface_list_copyPage";

//import UI_Work_Interface_List_NewPage from "./ui_work_interface_list_newPage";
import UI_Common_PopupEditMenu from "./ui_common_popupEditMenu";

export default function (AB) {
   var PopupEditPageComponent = UI_Common_PopupEditMenu(AB);

   var AddForm = new UIListNewPage(AB);
   var CopyForm = new UIListCopyPage(AB);
   // the popup form for adding a new page

   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();
   class UI_Work_Interface_List extends UIClass {
      constructor() {
         var base = "ui_work_interface_list";
         super(base, {
            list: "",
            buttonNew: "",
         });

         this.EditPopup = new PopupEditPageComponent(base);

         this.viewList = new webix.TreeCollection();
      }

      // Our webix UI definition:
      ui() {
         var ids = this.ids;
         // Our webix UI definition:
         return {
            id: ids.component,
            rows: [
               {
                  view: "unitlist",
                  uniteBy: L("Pages"),
                  height: 34,
                  data: [" "],
                  type: {
                     height: 0,
                     headerHeight: 35,
                  },
               },
               {
                  view: AB._App.custom.edittree.view, // "edittree",
                  id: ids.list,
                  width: uiConfig.columnWidthLarge,

                  select: true,

                  editaction: "custom",
                  editable: true,
                  editor: "text",
                  editValue: "label",
                  css: "ab-tree-ui",

                  template: (obj, common) => {
                     return this.templateListItem(obj, common);
                  },
                  type: {
                     iconGear: "<span class='webix_icon fa fa-cog'></span>",
                  },
                  on: {
                     onAfterRender: () => {
                        this.onAfterRender();
                     },
                     onAfterSelect: (id) => {
                        this.onAfterSelect(id);
                     },
                     onAfterOpen: () => {
                        this.onAfterOpen();
                     },
                     onAfterClose: () => {
                        this.onAfterClose();
                     },
                     onBeforeEditStop: (state, editor) => {
                        this.onBeforeEditStop(state, editor);
                     },
                     onAfterEditStop: (state, editor, ignoreUpdate) => {
                        this.onAfterEditStop(state, editor, ignoreUpdate);
                     },
                  },
                  onClick: {
                     "ab-page-list-edit": (e, id, trg) => {
                        this.clickEditMenu(e, id, trg);
                     },
                  },
               },
               {
                  view: "button",
                  css: "webix_primary",
                  id: ids.buttonNew,
                  type: "form",
                  value: L("Add new Page"), //labels.component.addNew,
                  click: () => {
                     this.emit("clickNewView");
                  },
               },
            ],
         };
         // Making custom UI settings above
         // return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB, options) {
         this.AB = AB;

         this.on("clickNewView", (selectNew) => {
            // if we receive a signal to add a new Interface from another source
            // like the blank interface workspace offering an Add New button:
            this.clickNewView(selectNew);
         });

         if ($$(this.ids.component)) $$(this.ids.component).adjust();

         let $List = $$(this.ids.list);
         this.ListComponent = $List;

         if ($List) {
            webix.extend($List, webix.ProgressBar);
            $List.data.unsync();
            $List.data.sync(this.viewList);
            $List.adjust();
         }

         await this.EditPopup.init(AB, {
            hideExclude: true,
         });

         this.EditPopup.menuOptions([
            {
               label: L("Rename"),
               icon: "fa fa-pencil-square-o",
               command: "rename",
            },
            {
               label: L("Copy"),
               icon: "fa fa-files-o",
               command: "copy",
            },
            {
               label: L("Delete"),
               icon: "fa fa-trash",
               command: "delete",
            },
         ]);

         this.EditPopup.on("click", (command) => {
            switch (command) {
               case "delete":
                  this.remove();
                  break;
               case "copy":
                  this.copy();
                  break;
               case "rename":
                  this.rename();
                  break;
               default:
            }
         });

         await AddForm.init(AB);

         AddForm.on("cancel", () => {
            AddForm.hide();
         });

         AddForm.on("save", (obj, select) => {
            // the PopupEditPageComponent already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of interfaces
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(obj.id);
            // }
         });

         CopyForm.on("save", (obj) => {
            // the PopupEditPageComponent already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of interfaces
            this.applicationLoad(this.CurrentApplication);
            this.callbackNewPage(obj);

            // Select the new page
            this.ListComponent.select(obj.id);
            this.listReady();
         });

         CopyForm.on("cancel", () => {
            CopyForm.hide();
            this.listReady();
         });
      }

      addNew() {
         this.clickNewView(true);
      }

      /**
       * @function applicationLoad
       * Initialize the List from the provided ABApplication
       * If no ABApplication is provided, then show an empty form. (create operation)
       * @param {ABApplication} application
       *        [optional] The current ABApplication we are working with.
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         this.listBusy();
         // this so it looks right/indented in a tree view:
         this.viewList.clearAll();

         var addPage = (page, index, parentId) => {
            if (!page) return;

            this.viewList.add(page, index, parentId);

            page.pages().forEach((childPage, childIndex) => {
               addPage(childPage, childIndex, page.id);
            });
         };
         application.pages().forEach((p, index) => {
            addPage(p, index);
         });

         // clear our list and display our objects:
         var List = $$(this.ids.list);
         List.refresh();
         List.unselectAll();

         //
         this.listReady();

         // // prepare our Popup with the current Application
         AddForm.applicationLoad(application);
         CopyForm.applicationLoad(application);
         // this.EditPopup.applicationLoad(application);
      }

      /**
       * @function clickNewView
       *
       * Manages initiating the transition to the new Page Popup window
       */
      clickNewView() {
         // show the new popup
         AddForm.show();
      }

      showGear(id) {
         var domNode = $$(this.ids.list).getItemNode(id);
         if (domNode) {
            var gearIcon = domNode.querySelector(".ab-page-list-edit");
            gearIcon.style.visibility = "visible";
            gearIcon.style.display = "block";
         }
      }
      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      refreshTemplateItem(view) {
         // make sure this item is updated in our list:
         view = view.updateIcon(view);
         this.viewList.updateItem(view.id, view);
      }
      rename() {
         var pageID = $$(this.ids.list).getSelectedId(false);
         $$(this.ids.list).edit(pageID);
      }
      /*
       * @function copy
       * make a copy of the current selected item.
       *
       * copies should have all the same sub-page data,
       * but will need unique names, and ids.
       *
       * we start the process by making a copy and then
       * having the user enter a new label/name for it.
       *
       * our .afterEdit() routines will detect it is a copy
       * then alert the parent UI component of the "copied" data
       */
      copy() {
         var selectedPage = $$(this.ids.list).getSelectedItem(false);
         // show loading cursor
         this.listBusy();

         CopyForm.init(AB, selectedPage);

         // Data must be loaded AFTER init, as it populates the form immediatly
         CopyForm.applicationLoad(this.CurrentApplication);

         CopyForm.show();
      }
      remove() {
         var selectedPage = $$(this.ids.list).getSelectedItem(false);
         if (!selectedPage) return;

         // verify they mean to do this:
         webix.confirm({
            title: L("Delete Page"),
            text: L("Are you sure you wish to delete this page?"),
            ok: L("Yes"),
            cancel: L("No"),
            callback: async (isOK) => {
               if (isOK) {
                  this.listBusy();

                  try {
                     await selectedPage.destroy();
                     this.listReady();
                     $$(this.ids.list).remove(
                        $$(this.ids.list).getSelectedId()
                     );
                     // let the calling component know about
                     // the deletion:
                     this.emit("deleted", selectedPage);

                     // clear object workspace
                     this.emit("selected", null);
                  } catch (e) {
                     this.AB.notify.developer(e, {
                        context:
                           "ui_interface_list:remove(): error removing item",
                        base: selectedPage,
                     });
                     this.listReady();
                  }
               }
            },
         });
      }
      clickEditMenu(e, id, trg) {
         // Show menu
         this.EditPopup.show(trg);

         return false;
      }
      /**
       * @function callbackNewObject
       *
       * Once a New Page was created in the Popup, follow up with it here.
       */
      callbackNewPage(page) {
         var parentPage = page.pageParent() || page.parent;
         var parentPageId = parentPage.id != page.id ? parentPage.id : null;
         if (!this.viewList.exists(page.id))
            this.viewList.add(page, null, parentPageId);

         // add sub-pages to tree-view
         page.pages().forEach((p, index) => {
            if (!this.viewList.exists(p.id))
               this.viewList.add(p, index, page.id);
         });

         $$(this.ids.list).refresh();

         if (parentPageId) $$(this.ids.list).open(parentPageId);

         this.select(page);

         AddForm.hide();
      }
      listBusy() {
         $$(this.ids.list)?.showProgress?.({ type: "icon" });
      }

      listReady() {
         $$(this.ids.list)?.hideProgress?.();
      }

      select(page) {
         $$(this.ids.list).select(page.id);
      }

      templateListItem(item, common, oldWarnings) {
         if (oldWarnings) {
            // TODO: remove this debugging statement.
            console.error(
               "templateListItem(): oldWarnings: How'd we get here?"
            );
         }

         item.warningsEval();
         const warnings = item.warningsAll();

         let warnIcon = "";
         if (warnings.length > 0) {
            warnIcon = this.WARNING_ICON;
         }
         var template = `<div class='ab-page-list-item'>
            ${common.icon(item)} <span class='webix_icon fa fa-${
            item.icon || item.viewIcon()
         }'></span> ${item.label}${warnIcon}<div class='ab-page-list-edit'>${
            common.iconGear
         }</div>
            </div>`;

         // now register a callback to update this display when this view is updated:
         item
            .removeListener("properties.updated", this.refreshTemplateItem)
            .once("properties.updated", this.refreshTemplateItem);

         return template;
      }
      onAfterOpen() {
         var id = $$(this.ids.list).getSelectedId(false);
         if (id) {
            this.showGear(id);
         }
      }

      onAfterRender() {
         var id = $$(this.ids.list).getSelectedId(false);
         if (id) {
            this.showGear(id);
         }
      }

      /**
       * @function onAfterSelect()
       *
       * Perform these actions when a View is selected in the List.
       */
      onAfterSelect(id) {
         // var view = $$(this.ids.list).getItem(id);
         // AB.actions.populateInterfaceWorkspace(view);

         this.showGear(id);

         let view = $$(this.ids.list).getItem(id);
         this.emit("selected", view);
      }

      onBeforeEditStop(state /*, editor */) {
         var selectedItem = $$(this.ids.list).getSelectedItem(false);
         selectedItem.label = state.value;

         // if this item supports isValid()
         if (selectedItem.isValid) {
            var validator = selectedItem.isValid();
            if (validator.fail()) {
               selectedItem.label = state.old;

               return false; // stop here.
            }
         }

         return true;
      }
      onAfterEditStop(state, editor, ignoreUpdate) {
         this.showGear(editor.id);

         if (state.value != state.old) {
            this.listBusy();

            var selectedPage = $$(this.ids.list).getSelectedItem(false);
            selectedPage.label = state.value;

            // Call server to rename
            selectedPage
               .save()
               .then(() => {
                  this.listReady();

                  // refresh the root page list
                  AddForm.applicationLoad(this.CurrentApplication);

                  // TODO : should use message box
                  webix.alert({
                     text: L("<b>{0}</b> is renamed.", [state.value]),
                  });
               })
               .catch((err) => {
                  this.listReady();
                  this.AB.notify.developer(err, {
                     context: "ABFieldProperty: isValid()",
                     base: state.value,
                  });
                  webix.alert({
                     text: L("System could not rename <b>{0}</b>.", [
                        state.value,
                     ]),
                  });
               });
         }
      }
      onAfterClose() {
         var selectedIds = $$(this.ids.list).getSelectedId(true);

         // Show gear icon
         selectedIds.forEach((id) => {
            this.showGear(id);
         });
      }
   }
   return new UI_Work_Interface_List();
}
