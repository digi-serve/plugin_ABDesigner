/*
 * ui_work_pwa_list
 *
 * Manage the PWA List and page builder.
 *
 */

import UI_Class from "./ui_class";

import UI_Work_PWA_List_NewPage from "./ui_work_pwa_list_newPage";
// import UI_Common_PopupEditMenu from "./ui_common_popupEditMenu";
import ABComponentMenu from "./ui_work_pwa_list_addWidget";

export default function (AB) {
   // var PopupEditPageComponent = UI_Common_PopupEditMenu(AB);

   var ComponentMenu = ABComponentMenu(AB);

   // const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();
   class UI_Work_PWA_List extends UIClass {
      constructor() {
         var base = "ui_work_pwa_list";
         super(base, {
            tabs: "",
            tabs_add: "",
            menus: "",
            menus_add: "",
            widgets: "",
            widgets_add: "",
         });

         // this.EditPopup = new PopupEditPageComponent(base);
         this.PageNew = UI_Work_PWA_List_NewPage(AB);

         this.viewListTabs = new webix.TreeCollection();
         this.viewListMenus = new webix.TreeCollection();
         this.viewListWidgets = new webix.TreeCollection();

         this.selectedPage = null;
      }

      // Our webix UI definition:
      ui() {
         var ids = this.ids;
         // Our webix UI definition:
         return {
            id: ids.component,
            css: "webix_list",
            rows: [
               {
                  view: "toolbar",
                  css: "webix_unit_header",
                  cols: [
                     {
                        view: "label",
                        label: L("Tabs"),
                        autowidth: true,
                     },
                     {},
                     {
                        id: ids.tabs_add,
                        view: "button",
                        type: "icon",
                        icon: "fa fa-fw fa-plus no-margin",
                        width: 35,
                        click: async () => {
                           this.PageNew.show("tab");
                        },
                     },
                     { width: 10 },
                  ],
               },
               {
                  id: ids.tabs,
                  view: "tree",
                  drag: true,
                  select: "row",
                  dragscroll: true,
                  type: {
                     template: (obj, common) => {
                        return this.templatePage(obj, common);
                     },
                  },
                  on: {
                     onItemClick: (item) => {
                        $$(ids.menus).unselect();
                        $$(ids.widgets).unselect();
                        this.loadWidgets(item);

                        let page = this.CurrentApplication.pageByID(item, true);
                        if (!page) return;
                        this.emit("selected", page);
                     },
                     onBeforeDrop: (context, e) => {
                        // context.from   :  the webix object the item came from
                        // context.start  :  id of the item being dropped (the task .key)
                        // context.target :  id of the item being dropped ON
                        // context.to     :  the webix object of the item being dropped ON

                        // Don't allow drops from widgets
                        if (context.from !== $$(ids.widgets)) {
                           // else they want to drop and make current element
                           // a child:

                           var droppedPage = this.CurrentApplication.pages(
                              (p) => context.start == p.id,
                              true
                           )[0];

                           // make sure the dropped page is now a "tab" type.
                           if (droppedPage) {
                              droppedPage.menuType = "tab";
                           }

                           var targetPage = this.CurrentApplication.pages(
                              (p) => context.target == p.id,
                              true
                           )[0];

                           // if they are just making a normal move:
                           if (!e.shiftKey) {
                              // just do the default Webix thang
                              // The droppedPage should connect to the
                              // targetPage.parent

                              this.moveToChild(
                                 targetPage.parent,
                                 droppedPage,
                                 context.to,
                                 "tab"
                              );

                              return;
                           }

                           // Holding [Shift] makes the dropped page a child of the
                           // Target Page.
                           this.moveToChild(
                              targetPage,
                              droppedPage,
                              context.to,
                              "tab"
                           );

                           // end this here:
                           // and return false to prevent the normal reordering
                           return false;
                        }
                     },
                  },
                  onClick: {
                     delme: (e, id) => {
                        let page = this.CurrentApplication.pageByID(id, true);

                        // verify they mean to do this:
                        webix.confirm({
                           title: L("Delete {0}", [page.label]),
                           text: L(
                              "Are you sure you wish to delete this Page?  All child pages will be removed as well."
                           ),
                           ok: L("Yes"),
                           cancel: L("No"),
                           callback: async (isOK) => {
                              if (isOK) {
                                 let Tree = $$(ids.tabs);
                                 Tree.showProgress();

                                 try {
                                    await page.destroy();
                                 } catch (e) {
                                    this.AB.notify.developer(e, {
                                       context:
                                          "ui_work_pwa_list:delete menu: error removing item",
                                       page: page?.toObj(),
                                    });
                                 }

                                 let currState = Tree.getState();
                                 this.refreshTree(Tree, "tabs");
                                 Tree.setState(currState);
                                 Tree.hideProgress();
                              }
                           },
                        });

                        // this prevents processing the onItemClick() handler
                        return false;
                     },
                  },
                  data: [],
               },
               {
                  view: "toolbar",
                  css: "webix_unit_header",
                  cols: [
                     {
                        view: "label",
                        label: L("Menu Items"),
                        autowidth: true,
                     },
                     {},
                     {
                        id: ids.menus_add,
                        view: "button",
                        type: "icon",
                        icon: "fa fa-fw fa-plus no-margin",
                        width: 35,
                        click: async () => {
                           this.PageNew.show("menu");
                        },
                     },
                     { width: 10 },
                  ],
               },
               {
                  id: ids.menus,
                  view: "tree",
                  drag: true,
                  select: "row",
                  dragscroll: true,
                  type: {
                     template: (obj, common) => {
                        return this.templatePage(obj, common);
                     },
                  },
                  on: {
                     onItemClick: (item) => {
                        $$(ids.tabs).unselect();

                        $$(ids.widgets).unselect();
                        this.loadWidgets(item);
                        let page = this.CurrentApplication.pageByID(item, true);
                        if (!page) return;
                        this.emit("selected", page);
                     },
                     onBeforeDrop: (context, e) => {
                        // context.from   :  the webix object the item came from
                        // context.start  :  id of the item being dropped (the task .key)
                        // context.target :  id of the item being dropped ON
                        // context.to     :  the webix object of the item being dropped ON

                        // Don't allow drops from Widgets
                        if (context.from !== $$(ids.widgets)) {
                           // else they want to drop and make current element
                           // a child:

                           var droppedPage = this.CurrentApplication.pageByID(
                              context.start,
                              true
                           );

                           // make sure the dropped page is now a "menu" type.
                           if (droppedPage) {
                              droppedPage.menuType = "menu";
                           }

                           var targetPage = this.CurrentApplication.pageByID(
                              context.target,
                              true
                           );

                           // if they are just making a normal move:
                           if (!e.shiftKey) {
                              // just do the default Webix thang
                              // The droppedPage should connect to the
                              // targetPage.parent

                              this.moveToChild(
                                 targetPage.parent,
                                 droppedPage,
                                 context.to,
                                 "menu"
                              );

                              return;
                           }

                           // Holding [Shift] makes the dropped page a child of the
                           // Target Page.
                           this.moveToChild(
                              targetPage,
                              droppedPage,
                              context.to,
                              "menu"
                           );

                           // end this here:
                           // and return false to prevent the normal reordering
                           return false;
                        }
                     },
                  },

                  onClick: {
                     delme: (e, id) => {
                        let page = this.CurrentApplication.pageByID(id, true);

                        // verify they mean to do this:
                        webix.confirm({
                           title: L("Delete {0}", [page.label]),
                           text: L(
                              "Are you sure you wish to delete this Page?  All child pages will be removed as well."
                           ),
                           ok: L("Yes"),
                           cancel: L("No"),
                           callback: async (isOK) => {
                              if (isOK) {
                                 let Tree = $$(ids.menus);
                                 Tree.showProgress();

                                 try {
                                    await page.destroy();
                                 } catch (e) {
                                    this.AB.notify.developer(e, {
                                       context:
                                          "ui_work_pwa_list:delete menu: error removing item",
                                       page: page?.toObj(),
                                    });
                                 }

                                 let currState = Tree.getState();
                                 this.refreshTree(Tree, "menu");
                                 Tree.setState(currState);
                                 // this.loadWidgets(this.selectedPage.id);
                                 Tree.hideProgress();
                              }
                           },
                        });

                        // this prevents processing the onItemClick() handler
                        return false;
                     },
                  },
                  data: [],
               },
               {
                  view: "toolbar",
                  css: "webix_unit_header",
                  cols: [
                     {
                        view: "label",
                        label: L("Widgets"),
                        autowidth: true,
                     },
                     {},
                     {
                        id: ids.widgets_add,
                        view: "button",
                        type: "icon",
                        icon: "fa fa-fw fa-plus no-margin",
                        width: 35,
                        click: () => {
                           ComponentMenu.show();
                        },
                     },
                     { width: 10 },
                  ],
               },
               {
                  id: ids.widgets,
                  view: "tree",
                  drag: "order",
                  select: "row",
                  dragscroll: true,
                  type: {
                     template: (obj, common) => {
                        return this.templateWidget(obj, common);
                     },
                  },
                  on: {
                     onItemClick: (id) => {
                        let widget = this.selectedPage.viewByID(id);
                        this.emit("selected", widget);
                     },

                     onBeforeDrop: (context, e) => {
                        // context.from   :  the webix object the item came from
                        // context.start  :  id of the item being dropped (the task .key)
                        // context.target :  id of the item being dropped ON
                        // context.to     :  the webix object of the item being dropped ON

                        var droppedWidget = this.selectedPage.viewByID(
                           context.start,
                           true
                        );

                        // if this is a FormItem, then it must remain under it's parent Form
                        // @TODO: figure out why this stopped working ...
                        // if (
                        //    droppedWidget instanceof
                        //    this.AB.Class.ABMobileViewFormItem
                        // ) {
                        if (droppedWidget.parent?.key == "mobile-form") {
                           // it can't move to the root:
                           if (context.parent == 0) return false;
                           if (context.target == null) return false;

                           // parent must be it's form.
                           if (droppedWidget.parent.id !== context.parent)
                              return false;
                        } else {
                           // other widgets must remain at the top level:
                           if (context.parent || context.target) return false;
                        }

                        // if we get to here, then let's update the order of our
                        // widgets
                        // NOTE: setTimeout() allows time for the UI widget to reorder.
                        setTimeout(() => {
                           this.widgetOrder();
                        }, 10);
                     },
                  },
                  onClick: {
                     delme: (e, id) => {
                        let widget = this.selectedPage.viewByID(id);

                        // verify they mean to do this:
                        webix.confirm({
                           title: L("Delete {0}", [widget.label]),
                           text: L(
                              "Are you sure you wish to delete this widget?"
                           ),
                           ok: L("Yes"),
                           cancel: L("No"),
                           callback: async (isOK) => {
                              if (isOK) {
                                 $$(ids.widgets).showProgress();

                                 try {
                                    await widget.destroy();
                                 } catch (e) {
                                    this.AB.notify.developer(e, {
                                       context:
                                          "ui_work_pwa_list:delete widget: error removing item",
                                       widget: widget?.toObj(),
                                    });
                                 }
                                 this.loadWidgets(this.selectedPage.id);
                                 $$(ids.widgets).hideProgress();
                                 this.emit("widget.updated");
                              }
                           },
                        });

                        // this prevents processing the onItemClick() handler
                        return false;
                     },
                  },
                  data: [],
               },
            ],
         };
         // Making custom UI settings above
         // return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB) {
         this.AB = AB;

         // Synchronize our TreeCollections with their Lists:
         let $ListTabs = $$(this.ids.tabs);
         if ($ListTabs) {
            webix.extend($ListTabs, webix.ProgressBar);
            $ListTabs.data.unsync();
            $ListTabs.data.sync(this.viewListTabs);
            $ListTabs.adjust();
         }

         let $ListMenus = $$(this.ids.menus);
         if ($ListMenus) {
            webix.extend($ListMenus, webix.ProgressBar);
            $ListMenus.data.unsync();
            $ListMenus.data.sync(this.viewListMenus);
            $ListMenus.adjust();
         }

         let $ListWidgets = $$(this.ids.widgets);
         if ($ListWidgets) {
            webix.extend($ListWidgets, webix.ProgressBar);
            $ListWidgets.data.unsync();
            $ListWidgets.data.sync(this.viewListWidgets);
            $ListWidgets.adjust();

            webix.extend($ListWidgets, webix.OverlayBox);
         }

         this.PageNew.init(AB);
         this.PageNew.on("done", () => {
            this.refresh();
            // let menuState = $ListMenus.getState();
            // let tabsState = $ListTabs.getState();
            // this.applicationLoad(this.CurrentApplication);
            // $ListMenus.setState(menuState);
            // $ListTabs.setState(tabsState);
         });

         if ($$(this.ids.component)) $$(this.ids.component).adjust();

         // Popup Widget Selector
         ComponentMenu.init(AB);

         ComponentMenu.on("widget.adding", () => {
            $ListWidgets?.showProgress?.({ type: "icon" });
         });
         ComponentMenu.on("widget.add", () => {
            // this.viewLoad(this.CurrentView);
            this.loadWidgets(this.selectedPage.id);
            $ListWidgets?.hideProgress?.();
            this.emit("widget.updated");
         });

         $$(this.ids.widgets_add)?.disable();
         $ListWidgets.showOverlay(
            L("Select a Page to modify it's widgets ...")
         );
      }

      addNew() {
         this.clickNewView(true);
      }

      /**
       * @method refreshDisplay()
       * Called when we want to make sure any noticable changes are
       * updated in our list.
       */
      refresh() {
         let $ListTabs = $$(this.ids.tabs);
         let $ListMenus = $$(this.ids.menus);
         let $ListWidgets = $$(this.ids.widgets);
         let tabsState = $ListTabs.getState();
         let menuState = $ListMenus.getState();
         let widgetState = $ListWidgets.getState();
         this.applicationLoad(this.CurrentApplication);
         $ListMenus.setState(menuState);
         $ListTabs.setState(tabsState);

         if (this.selectedPage) {
            this.loadWidgets(this.selectedPage.id);
            $ListWidgets.setState(widgetState);
         }
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

         this.PageNew.applicationLoad(application);

         // this.listBusy();

         this.refreshTree(this.viewListTabs, "tab");
         this.refreshTree(this.viewListMenus, "menu");

         let tree = $$(this.ids.widgets);
         tree.clearAll();

         // this so it looks right/indented in a tree view:
         // this.viewListTabs.clearAll();
         // this.viewListMenus.clearAll();

         // var addPage = (list, page, index, parentId) => {
         //    if (!page) return;

         //    list.add(page, index, parentId);

         //    page.pages().forEach((childPage, childIndex) => {
         //       addPage(list, childPage, childIndex, page.id);
         //    });
         // };
         // application
         //    .pages((p) => p.menuType == "tab")
         //    .forEach((p, index) => {
         //       addPage(this.viewListTabs, p, index);
         //    });
         // application
         //    .pages((p) => p.menuType == "menu")
         //    .forEach((p, index) => {
         //       addPage(this.viewListMenus, p, index);
         //    });
      }

      /**
       * @method loadWidgets()
       * Display the current list of Widgets on the given page.
       * @param {uuid} id
       *        the {ABMobilePage.id}
       */
      loadWidgets(id) {
         // if (this.selectedPage?.id === id) return;

         let tree = $$(this.ids.widgets);
         tree.clearAll();

         let page = this.CurrentApplication.pageByID(id);
         if (!page) return;

         ComponentMenu.viewLoad(page);

         this.selectedPage = page;
         $$(this.ids.widgets_add)?.enable();

         var addView = (list, view, index, parentId) => {
            if (!view) return;

            list.add(view, index, parentId);

            view.views().forEach((childView, childIndex) => {
               addView(list, childView, childIndex, view.id);
            });
         };

         let allViews = page.views() || [];
         allViews.forEach((v, index) => {
            addView(tree, v, index);
         });

         if (allViews.length == 0) {
            tree.showOverlay(L("Click [+] to add your first widget."));
         } else {
            tree.hideOverlay();
         }
      }

      refreshTree(tree, menuType) {
         tree.clearAll();

         var addPage = (list, page, index, parentId) => {
            if (!page) return;

            list.add(page, index, parentId);

            page.pages().forEach((childPage, childIndex) => {
               addPage(list, childPage, childIndex, page.id);
            });
         };

         this.CurrentApplication.pages((p) => p.menuType == menuType).forEach(
            (p, index) => {
               addPage(tree, p, index);
            }
         );
      }

      async widgetOrder() {
         let tree = $$(this.ids.widgets);

         let items = tree.find({});
         // [ {ABMobileViewxxx}, ... ] current UNORDERED data

         let hashByParent = {
            /* parent.id : parent.id  */
         };
         items.forEach((i) => {
            hashByParent[i.$parent] = i.$parent;
         });

         let allSaves = [];
         Object.keys(hashByParent).forEach((k) => {
            let parent = this.selectedPage.viewByID(k);
            let entryID = tree.getFirstChildId(parent?.id);

            // this is probably the top level (k == 0) so:
            if (!parent) {
               parent = this.selectedPage;
               entryID = tree.getFirstId();
            }

            // reorder the views by the order in the Tree
            parent._views = [];
            while (entryID) {
               parent._views.push(items.find((i) => i.id == entryID));
               entryID = tree.getNextSiblingId(entryID);
            }

            allSaves.push(parent.save());
         });

         await Promise.all(allSaves);

         this.emit("widget.updated");
      }

      /**
       * @function addChild()
       *
       * Add a LBTask as a Child to the given dropTarget.
       * @param {LBTask} dropTarget  The LBTask that an item was dropped ON
       * @param {LBTask} newTask     The instance of a LBTask to add
       */
      async addChild(parent, child, TreeList) {
         var parID = parent.id;

         var oldParent = child.parent;
         if (oldParent) {
            await oldParent.pageRemove(child);
         }
         await parent.pageInsert(child);
         child.parent = parent;
         await child.save();
      }

      async moveToChild(parent, child, TreeList, menuType) {
         TreeList?.showProgress?.({ type: "icon" });

         await this.addChild(parent, child, TreeList);

         let currState = TreeList.getState();
         this.refreshTree(TreeList, menuType);
         TreeList.setState(currState);
         TreeList?.hideProgress?.();
      }

      /**
       * @function clickNewView
       *
       * Manages initiating the transition to the new Page Popup window
       */
      // clickNewView() {
      //    // show the new popup
      //    AddForm.show();
      // }

      // showGear(id) {
      //    var domNode = $$(this.ids.list).getItemNode(id);
      //    if (domNode) {
      //       var gearIcon = domNode.querySelector(".ab-page-list-edit");
      //       gearIcon.style.visibility = "visible";
      //       gearIcon.style.display = "block";
      //    }
      // }
      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      /**
       * @method templatePage()
       * display the proper entry for a Page in our lists
       * @param {ABMobilePage} obj
       *        The instance of the ABMobilePage we are displaying
       * @param {common} common
       *        The webix {common} object for a tree view.
       * @return {string}
       */
      templatePage(obj, common) {
         obj.warningsEval();
         const warnings = obj.warningsAll();

         let warnIcon = "";
         if (warnings.length > 0) {
            warnIcon = this.WARNING_ICON;
         }

         let defaultPage = obj.defaultPage
            ? "<i class='fa fa-asterisk dragme'></i>"
            : "";
         return `${common.icon(obj)}${common.folder(obj)}<span>${
            obj.label
         }</span><i class='fa fa-bars dragme'></i><i class='fa fa-trash dragme delme'></i>${defaultPage}${warnIcon}`;
      }

      /**
       * @method templateWidget()
       * display the proper entry for a Widget in our lists
       * @param {ABMobileView} obj
       *        The instance of the ABMobileView we are displaying
       * @param {common} common
       *        The webix {common} object for a tree view.
       * @return {string}
       */
      templateWidget(obj, common) {
         obj.warningsEval();
         const warnings = obj.warningsAll();

         let warnIcon = "";
         if (warnings.length > 0) {
            warnIcon = this.WARNING_ICON;
         }

         return `${common.icon(obj)}${common.folder(obj)}<span>${
            obj.label
         }</span><i class='fa fa-bars dragme'></i><i class='fa fa-trash dragme delme'></i>${warnIcon}`;
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
      // callbackNewPage(page) {
      //    var parentPage = page.pageParent() || page.parent;
      //    var parentPageId = parentPage.id != page.id ? parentPage.id : null;
      //    if (!this.viewList.exists(page.id))
      //       this.viewList.add(page, null, parentPageId);

      //    // add sub-pages to tree-view
      //    page.pages().forEach((p, index) => {
      //       if (!this.viewList.exists(p.id))
      //          this.viewList.add(p, index, page.id);
      //    });

      //    $$(this.ids.list).refresh();

      //    if (parentPageId) $$(this.ids.list).open(parentPageId);

      //    this.select(page);

      //    AddForm.hide();
      // }
      // listBusy() {
      //    $$(this.ids.list)?.showProgress?.({ type: "icon" });
      // }

      // listReady() {
      //    $$(this.ids.list)?.hideProgress?.();
      // }

      // select(page) {
      //    $$(this.ids.list).select(page.id);
      // }

      // templateListItem(item, common, oldWarnings) {
      //    if (oldWarnings) {
      //       // TODO: remove this debugging statement.
      //       console.error(
      //          "templateListItem(): oldWarnings: How'd we get here?"
      //       );
      //    }

      //    item.warningsEval();
      //    const warnings = item.warningsAll();

      //    let warnIcon = "";
      //    if (warnings.length > 0) {
      //       warnIcon = this.WARNING_ICON;
      //    }
      //    var template = `<div class='ab-page-list-item'>
      //       ${common.icon(item)} <span class='webix_icon fa fa-${
      //       item.icon || item.viewIcon()
      //    }'></span> ${item.label}${warnIcon}<div class='ab-page-list-edit'>${
      //       common.iconGear
      //    }</div>
      //       </div>`;

      //    // now register a callback to update this display when this view is updated:
      //    item
      //       .removeListener("properties.updated", this.refreshTemplateItem)
      //       .once("properties.updated", this.refreshTemplateItem);

      //    return template;
      // }
      // onAfterOpen() {
      //    var id = $$(this.ids.list).getSelectedId(false);
      //    if (id) {
      //       this.showGear(id);
      //    }
      // }

      // onAfterRender() {
      //    var id = $$(this.ids.list).getSelectedId(false);
      //    if (id) {
      //       this.showGear(id);
      //    }
      // }

      /**
       * @function onAfterSelect()
       *
       * Perform these actions when a View is selected in the List.
       */
      // onAfterSelect(id) {
      //    // var view = $$(this.ids.list).getItem(id);
      //    // AB.actions.populateInterfaceWorkspace(view);

      //    this.showGear(id);

      //    let view = $$(this.ids.list).getItem(id);
      //    this.emit("selected", view);
      // }

      // onBeforeEditStop(state /*, editor */) {
      //    var selectedItem = $$(this.ids.list).getSelectedItem(false);
      //    selectedItem.label = state.value;

      //    // if this item supports isValid()
      //    if (selectedItem.isValid) {
      //       var validator = selectedItem.isValid();
      //       if (validator.fail()) {
      //          selectedItem.label = state.old;

      //          return false; // stop here.
      //       }
      //    }

      //    return true;
      // }

      // onAfterEditStop(state, editor, ignoreUpdate) {
      //    this.showGear(editor.id);

      //    if (state.value != state.old) {
      //       this.listBusy();

      //       var selectedPage = $$(this.ids.list).getSelectedItem(false);
      //       selectedPage.label = state.value;

      //       // Call server to rename
      //       selectedPage
      //          .save()
      //          .then(() => {
      //             this.listReady();

      //             // refresh the root page list
      //             AddForm.applicationLoad(this.CurrentApplication);

      //             // TODO : should use message box
      //             webix.alert({
      //                text: L("<b>{0}</b> is renamed.", [state.value]),
      //             });
      //          })
      //          .catch((err) => {
      //             this.listReady();
      //             this.AB.notify.developer(err, {
      //                context: "ABFieldProperty: isValid()",
      //                base: state.value,
      //             });
      //             webix.alert({
      //                text: L("System could not rename <b>{0}</b>.", [
      //                   state.value,
      //                ]),
      //             });
      //          });
      //    }
      // }

      // onAfterClose() {
      //    var selectedIds = $$(this.ids.list).getSelectedId(true);

      //    // Show gear icon
      //    selectedIds.forEach((id) => {
      //       this.showGear(id);
      //    });
      // }
   }
   return new UI_Work_PWA_List();
}
