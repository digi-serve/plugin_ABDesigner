/*
 * ABViewMenu
 * A Property manager for our ABViewMenu definitions
 */
import FABView from "./ABView";

export default function (AB) {
   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   let ABViewMenuPropertyComponentDefaults = {};

   const base = "properties_abview_menu";

   class ABViewMenuProperty extends ABView {
      constructor() {
         super(base, {
            // Put our ids here
            orientation: "",
            buttonStyle: "",
            menuAlignment: "",
            menuInToolbar: 0,
            menuPadding: "",
            menuTheme: "",
            menuPosition: "",
            menuTextLeft: "",
            menuTextCenter: "",
            menuTextRight: "",
            pages: "",
            treeDnD: "",
            pagesFieldset: "",
            pageOrderFieldset: "",
         });

         this.AB = AB;
         ABViewMenuPropertyComponentDefaults =
            this.AB.Class.ABViewManager.viewClass("menu").defaultValues();
      }

      static get key() {
         return "menu";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.orientation,
               name: "orientation",
               view: "richselect",
               label: L("Orientation"),
               value: ABViewMenuPropertyComponentDefaults.orientation,
               labelWidth: uiConfig.labelWidthXLarge,
               options: [
                  {
                     id: "x",
                     value: L("Horizontal"),
                  },
                  {
                     id: "y",
                     value: L("Vertical"),
                  },
               ],
            },
            {
               id: ids.buttonStyle,
               name: "buttonStyle",
               view: "richselect",
               label: L("Button Style"),
               value: ABViewMenuPropertyComponentDefaults.buttonStyle,
               labelWidth: uiConfig.labelWidthXLarge,
               options: [
                  {
                     id: "ab-menu-default",
                     value: L("Default"),
                  },
                  {
                     id: "ab-menu-link",
                     value: L("Link"),
                  },
               ],
            },
            {
               id: ids.menuAlignment,
               name: "menuAlignment",
               view: "richselect",
               label: L("Menu Alignment"),
               value: ABViewMenuPropertyComponentDefaults.menuAlignment,
               labelWidth: uiConfig.labelWidthXLarge,
               options: [
                  {
                     id: "ab-menu-left",
                     value: L("Left"),
                  },
                  {
                     id: "ab-menu-center",
                     value: L("Center"),
                  },
                  {
                     id: "ab-menu-right",
                     value: L("Right"),
                  },
               ],
            },
            {
               id: ids.menuInToolbar,
               name: "menuInToolbar",
               view: "checkbox",
               labelRight: L("Put menu in toolbar"),
               value: ABViewMenuPropertyComponentDefaults.menuInToolbar,
               labelWidth: uiConfig.labelWidthCheckbox,
            },
            {
               name: "toolbarFieldset",
               view: "fieldset",
               label: L("Toolbar Settings:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  view: "layout",
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.menuPadding,
                        name: "menuPadding",
                        view: "counter",
                        label: L("Toolbar padding"),
                        value: ABViewMenuPropertyComponentDefaults.menuPadding,
                        labelWidth: uiConfig.labelWidthLarge,
                     },
                     {
                        id: ids.menuTheme,
                        name: "menuTheme",
                        view: "richselect",
                        label: L("Toolbar theme"),
                        value: ABViewMenuPropertyComponentDefaults.menuTheme,
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [
                           {
                              id: "white",
                              value: L("White (Default)"),
                           },
                           {
                              id: "bg_gray",
                              value: L("Gray"),
                           },
                           {
                              id: "webix_dark",
                              value: L("Dark"),
                           },
                        ],
                     },
                     {
                        id: ids.menuPosition,
                        name: "menuPosition",
                        view: "richselect",
                        label: L("Menu Position"),
                        value: ABViewMenuPropertyComponentDefaults.menuPosition,
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [
                           {
                              id: "left",
                              value: L("Left"),
                           },
                           {
                              id: "center",
                              value: L("Center"),
                           },
                           {
                              id: "right",
                              value: L("Right"),
                           },
                        ],
                     },
                     {
                        id: ids.menuTextLeft,
                        name: "menuTextLeft",
                        view: "text",
                        label: L("Text Left"),
                        placeholder: L("Place text in left region of toolbar."),
                        labelWidth: uiConfig.labelWidthLarge,
                        labelPosition: "top",
                     },
                     {
                        id: ids.menuTextCenter,
                        name: "menuTextCenter",
                        view: "text",
                        label: L("Text Center"),
                        placeholder: L(
                           "Place text in center region of toolbar."
                        ),
                        labelWidth: uiConfig.labelWidthLarge,
                        labelPosition: "top",
                     },
                     {
                        id: ids.menuTextRight,
                        name: "menuTextRight",
                        view: "text",
                        label: L("Text Right"),
                        placeholder: L(
                           "Place text in right region of toolbar."
                        ),
                        labelWidth: uiConfig.labelWidthLarge,
                        labelPosition: "top",
                     },
                  ],
               },
            },
            {
               id: ids.pagesFieldset,
               name: "pagesFieldset",
               view: "fieldset",
               label: L("Page List:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  view: "layout",
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.pages,
                        name: "pages",
                        view: "edittree",
                        borderless: true,
                        css: "transparent",
                        // editor: "inline-text",
                        editable: true,
                        editValue: "aliasname",
                        editor: "text",
                        template: function (item, common) {
                           return `<div class='ab-page-list-item'>
                              ${common.icon(item)} ${common.checkbox(
                              item,
                              false
                           )} <div class="fa fa-${
                              item.key == "viewcontainer"
                                 ? "window-maximize"
                                 : "file"
                           }"></div> 
                              ${item.label}</div>`;
                        },
                        on: {
                           onItemCheck: (id, state) => {
                              // trigger to save settings
                              this.onChange();
                              this.updateTreeDnD(id, state);
                           },
                           onBeforeEditStart: function (id) {
                              var item = this.getItem(id);
                              if (!item.aliasname) {
                                 item.aliasname = item.label;
                                 this.updateItem(item);
                              }
                           },
                           onBeforeEditStop: (state, editor) => {
                              const $pages = $$(ids.pages);
                              const $treeDnD = $$(ids.treeDnD);

                              let item = $pages.getItem(editor.id);
                              if (item) {
                                 item.translations.forEach((t) => {
                                    if (
                                       t.language_code ==
                                       this.AB.Multilingual.currentLanguage()
                                    ) {
                                       t.aliasname = state.value;
                                    }
                                 });
                                 item.label = state.value;
                                 $pages.updateItem(editor.id, item);
                              }

                              if ($treeDnD.exists(editor.id)) {
                                 // we need to update the drag and drop tree item as well so get it first
                                 let treeItem =
                                    $treeDnD.getItem(editor.id) || {};
                                 // change the value (since that is what is being displayed)
                                 treeItem.value = state.value;
                                 // then change the aliasname (since that property controls the final view)
                                 treeItem.aliasname = state.value;
                                 // trigger a save so when we update the preview it has the new data to work with
                                 this.onChange();
                                 // tell the tree to update with new alias (this will trigger a page reorder save and the values already saved will be used to rebuild the component)
                                 $treeDnD.updateItem(editor.id, treeItem);
                              }
                           },
                        },
                     },
                  ],
               },
            },
            {
               id: ids.pageOrderFieldset,
               name: "pageOrderFieldset",
               view: "fieldset",
               label: L("Drag & Drop to Reorder/Click to Add Icon:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  view: "layout",
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.treeDnD,
                        view: "edittree",
                        borderless: true,
                        name: "treeDnD",
                        template:
                           "{common.icon()} <i class='fa fa-fw fa-#icon#'></i> <span>#value#</span>",
                        drag: true,
                        editable: true,
                        editValue: "icon",
                        editor: "combo",
                        options: this.AB._App.icons,
                        suggest: {
                           template: "#value#",
                           filter: function (item, value) {
                              return (
                                 item.value
                                    .toString()
                                    .toLowerCase()
                                    .indexOf(value.toLowerCase()) === 0
                              );
                           },
                           body: {
                              template:
                                 "<i class='fa fa-fw fa-#value#'></i> #value#",
                           },
                        },
                        on: {
                           onBeforeDrop: function (context) {
                              context.parent = context.target; //drop as child
                              context.index = -1; //as last child
                           },
                           onAfterDrop: (context, native_event) => {
                              this.reorderPages();
                           },
                           onDataUpdate: () => {
                              this.reorderPages();
                           },
                        },
                     },
                  ],
               },
            },
         ]);
      }

      populate(view) {
         super.populate(view);
         if (!view) return;

         const ids = this.ids;

         $$(ids.orientation).setValue(
            view.settings.orientation ??
               ABViewMenuPropertyComponentDefaults.orientation
         );
         $$(ids.buttonStyle).setValue(
            view.settings.buttonStyle ??
               ABViewMenuPropertyComponentDefaults.buttonStyle
         );
         $$(ids.menuAlignment).setValue(
            view.settings.menuAlignment ??
               ABViewMenuPropertyComponentDefaults.menuAlignment
         );
         $$(ids.menuInToolbar).setValue(
            parseInt(view.settings.menuInToolbar) ??
               ABViewMenuPropertyComponentDefaults.menuInToolbar
         );
         $$(ids.menuPadding).setValue(
            view.settings.menuPadding ??
               ABViewMenuPropertyComponentDefaults.menuPadding
         );
         $$(ids.menuTheme).setValue(
            view.settings.menuTheme ??
               ABViewMenuPropertyComponentDefaults.menuTheme
         );
         $$(ids.menuPosition).setValue(
            view.settings.menuPosition ??
               ABViewMenuPropertyComponentDefaults.menuPosition
         );
         if (view.menuTextLeft == "" && view.settings.menuTextLeft) {
            view.menuTextLeft = view.settings.menuTextLeft;
         }
         $$(ids.menuTextLeft).setValue(
            view.menuTextLeft ??
               ABViewMenuPropertyComponentDefaults.menuTextLeft
         );
         if (view.menuTextCenter == "" && view.settings.menuTextCenter) {
            view.menuTextCenter = view.settings.menuTextCenter;
         }
         $$(ids.menuTextCenter).setValue(
            view.menuTextCenter ??
               ABViewMenuPropertyComponentDefaults.menuTextCenter
         );
         if (view.menuTextRight == "" && view.settings.menuTextRight) {
            view.menuTextRight = view.settings.menuTextRight;
         }
         $$(ids.menuTextRight).setValue(
            view.menuTextRight ??
               ABViewMenuPropertyComponentDefaults.menuTextRight
         );

         const pageTree = new this.AB.Webix.TreeCollection();
         const application = view.application;
         // const currentPage = view.pageParent();
         // const parentPage = currentPage.pageParent();
         const rootPage = view.pageRoot();

         application
            .pages((p) => rootPage?.id == p.id, true)
            .forEach((p, index) => {
               this.addPage(view, p, index, pageTree);
            });

         const $pages = $$(ids.pages);
         $pages.clearAll();
         $pages.data.importData(pageTree);
         $pages.refresh();
         $pages.blockEvent();
         $pages.uncheckAll();
         $pages.unblockEvent();
         $pages.openAll();

         const $treeDnD = $$(ids.treeDnD);
         $treeDnD.clearAll();
         view?.settings?.order?.forEach((page) => {
            if ($pages.exists(page.tabId ?? page.pageId)) {
               //after this command all events will be ignored
               $pages.blockEvent();
               // we don't want to send a toggle event because it triggers saves to the database
               $pages.checkItem(page.tabId ?? page.pageId);
               //resume listening
               $pages.unblockEvent();
            }
            const label = view.getAliasname(page);
            $treeDnD.add(
               {
                  id: page.tabId ?? page.pageId,
                  value: label,
                  type: page.type,
                  pageId: page.pageId ?? "",
                  tabId: page.tabId ?? "",
                  icon: page.icon,
               },
               page.position ? parseInt(page.position) : 0,
               page.parent && page.parent != "0" ? page.parent : ""
            );
         });
         // } else if (view.settings.pages && view.settings.pages.forEach) {
         //    view.settings.pages.forEach((page) => {
         //       if (page.isChecked) {
         //          let label = view.getAliasname(page);
         //          $treeDnD.add({
         //             id: page.tabId || page.pageId,
         //             value: label,
         //             type: page.type,
         //             pageId: page.pageId
         //          });
         //       }
         //    });
         $treeDnD.openAll();
         // }

         // $$(ids.pagesFieldset).config.height = ($$(ids.pages).count()*28)+18; // Number of pages plus 9px of padding top and bottom
         $$(ids.pagesFieldset).config.height = $pages.count() * 28 + 18 + 40; // Number of pages plus 9px of padding top and bottom
         $$(ids.pagesFieldset).resize();
         $$(ids.pageOrderFieldset).config.height =
            $pages.count() * 28 + 18 + 40; // Number of pages plus 9px of padding top and bottom
         $$(ids.pageOrderFieldset).resize();
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const ids = this.ids;
         let vals = super.values();

         vals.settings = vals.settings ?? {};
         vals.settings.orientation = $$(ids.orientation).getValue();
         vals.settings.buttonStyle = $$(ids.buttonStyle).getValue();
         vals.settings.menuAlignment = $$(ids.menuAlignment).getValue();
         vals.settings.menuInToolbar = $$(ids.menuInToolbar).getValue();
         vals.settings.menuPadding = $$(ids.menuPadding).getValue();
         vals.settings.menuTheme = $$(ids.menuTheme).getValue();
         vals.settings.menuPosition = $$(ids.menuPosition).getValue();
         vals.menuTextLeft = $$(ids.menuTextLeft).getValue();
         vals.menuTextCenter = $$(ids.menuTextCenter).getValue();
         vals.menuTextRight = $$(ids.menuTextRight).getValue();
         // Legacy support: clear the old settings when new values are created
         // otherwise leave them
         if (vals.menuTextLeft.length) {
            vals.settings.menuTextLeft = "";
         }
         if (vals.menuTextCenter.length) {
            vals.settings.menuTextCenter = "";
         }
         if (vals.menuTextCenter.length) {
            vals.settings.menuTextRight = "";
         }

         // var pagesIdList = [];
         if ($$(ids.pages)) {
            for (let i = 0; i < $$(ids.pages).data.count(); i++) {
               let currentPageId = $$(ids.pages).getIdByIndex(i);
               const currentItem = $$(ids.pages).getItem(currentPageId);

               let type = "page",
                  tabId;
               if (currentItem.key == "viewcontainer") {
                  type = "tab";
                  tabId = currentPageId;
                  currentPageId = currentItem.pageParent().id;
               } else {
                  // if we have left the tabs we were looping through we need to reset the tabId
                  tabId = "";
               }

               // let pageInfo = view.settings.pages.filter(
               //    (p) => p.pageId == currentPageId
               // )[0];

               let translations = [];

               if (currentItem && currentItem.translations)
                  translations = currentItem.translations;
               // else if (pageInfo && pageInfo.translations)
               //    translations = AB.cloneDeep(pageInfo.translations);

               // pagesIdList.push({
               //    pageId: currentPageId,
               //    tabId: tabId,
               //    type: type,
               //    aliasname: currentItem.aliasname,
               //    isChecked: currentItem.checked,
               //    translations: translations
               // });
            }
            // view.settings.pages = pagesIdList;
            if (vals.settings.pages) delete vals.settings.pages;
         }

         return vals;
      }

      /**
       * @method ViewClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("menu");
      }

      updateTreeDnD(id, state) {
         const ids = this.ids;
         const currView = this.CurrentView;
         const $treeDnD = $$(ids.treeDnD);
         const $pages = $$(ids.pages);

         // var curPage = currView.settings.pages.filter((page) => {
         //    return page.pageId == id || page.tabId == id;
         // })[0];

         let curPage = currView.application.pages(
            (page) => page.id == id,
            true
         )[0];

         // must not have been a page...lets check tabs
         if (!curPage) {
            curPage = currView.application.views(
               (view) => view.id == id,
               true
            )[0];
         }

         if (state) {
            let label = currView.getAliasname(curPage);
            $treeDnD.add({
               id: curPage.id,
               value: label,
               type: curPage.type,
               pageId: curPage.pageId ?? "",
               tabId: curPage.tabId ?? "",
            });
            this.reorderPages();
         } else {
            // if this item exists in the tree and does not have a submenu you can remove it
            // otherwise we will ask the user to move its submenu items out before deleting
            if ($treeDnD.exists(id) && !$treeDnD.isBranch(id)) {
               $treeDnD.remove(id);
               this.reorderPages();
            } else if ($treeDnD.exists(id) && $treeDnD.isBranch(id)) {
               $pages.blockEvent();
               // we don't want to send a toggle event because it triggers saves to the database
               $pages.checkItem(id);
               this.AB.Webix.message({
                  text: L(
                     "Item comtains submenu, please remove items in submenu before removing."
                  ),
                  type: "error",
                  expire: 10000,
               });
               //resume listening
               $pages.unblockEvent();
            }
         }
      }

      reorderPages() {
         const ids = this.ids;
         const currView = this.CurrentView;
         const $treeDnD = $$(ids.treeDnD);

         // add a new pages container
         let pages = [];
         // loop through tree to reorder pages
         $treeDnD.data.each((obj) => {
            // find the page in settings that matches the item in the tree
            // var curPage = currView.settings.pages.filter((page) => {
            //    return page.pageId == obj.id || page.tabId == obj.id;
            // })[0];

            let curPage = currView.application.pages(
               (page) => page.id == obj.id,
               true
            )[0];

            // must not have been a page...lets check tabs
            if (!curPage) {
               curPage = currView.application.views(
                  (view) => view.id == obj.id,
                  true
               )[0];
            }

            // put that page in the next possition of the page container
            pages.push(curPage);
         });

         let newPageOrder = [];
         // loop through pages
         /*
        {
           "pageId": "9b8a9458-3ad4-46c1-9ea8-6c96950e161d",
           "tabId": "",
           "type": "page",
           "isChecked": "true",
           "translations": [
              {
                 "language_code": "en",
                 "label": "Sub Page 1",
                 "aliasname": "Sub Page 1"
              }
           ],
           "parent": "0",
           "position": "0"
        }
        */
         pages.forEach((page) => {
            if (page) {
               var thisPage = {};
               // get the id of the element we are clicking to
               var id = page.id;
               // get the object of the data with the id in the tree view
               var treeItem = $$(ids.treeDnD).getItem(id);
               // set the parent element in the page if the treeItem has one
               thisPage.parent = treeItem.$parent;
               // store the position so we can put it back in the right spot later
               thisPage.position = $$(ids.treeDnD).getBranchIndex(id);
               // store the icon
               thisPage.icon = treeItem.icon;
               // store the getAliasname
               //thisPage.aliasname = currView.getAliasname(page);
               // store the page types
               thisPage.type = page.key == "viewcontainer" ? "tab" : "page";
               if (thisPage.type == "tab") {
                  thisPage.tabId = page.id;
                  thisPage.pageId = currView.getParentPageId(page);
               } else {
                  thisPage.pageId = page.id;
               }
               thisPage.isChecked = "true";
               thisPage.translations = page.translations;
               newPageOrder.push(thisPage);
            }
         });
         currView.settings.order = newPageOrder;

         this.onChange();
         $treeDnD.openAll();
      }

      /**
       * @method addPage
       *
       * @param {ABView} view
       * @param {ABView} page
       * @param {integer} index
       * @param {Webix.TreeCollection} pageTree
       * @param {uuid} parentId
       */
      addPage(view, page, index, pageTree, parentId) {
         // update .aliasname and .translations of the page
         view?.settings?.order?.forEach((localpage) => {
            if (
               (localpage.pageId == page.id && !localpage.id) ||
               (parentId &&
                  localpage.pageId == parentId &&
                  localpage.tabId == page.id)
            ) {
               page.translations = localpage.translations;
            }
         });
         const alias = view.getAliasname(page);
         page.label = alias ? alias : page.label;
         // add to tree collection
         pageTree.add(page, index, parentId);

         // add sub-pages
         var subPages = page.pages ? page.pages() : [];
         subPages.forEach((childPage, childIndex) => {
            this.addPage(view, childPage, childIndex, pageTree, page.id);
         });

         // add tabs
         const ABViewTab = this.AB.Class.ABViewManager.viewClass("tab");
         page
            .views((v) => v instanceof ABViewTab)
            .forEach((tab, tabIndex) => {
               // tab views
               tab.views().forEach((tabView, tabViewIndex) => {
                  // tab items will be below sub-page items
                  const tIndex = subPages.length + tabIndex + tabViewIndex;

                  this.addPage(view, tabView, tIndex, pageTree, page.id);
               });
            });
      }
   }

   return ABViewMenuProperty;
}
