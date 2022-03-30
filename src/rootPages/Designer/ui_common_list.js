/*
 * ab_common_list
 *
 * A common interface for displaying AB category list widget
 *
 */

import UIListEditMenuFactory from "./ui_common_popupEditMenu";

export default function (AB, options) {
   var UIListEditMenu = UIListEditMenuFactory(AB);

   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Common_List extends AB.ClassUI {
      constructor(attributes) {
         // attributes.idBase = attributes.idBase || "ui_common_list";
         var base = attributes.idBase || "ui_common_list";
         super(base, {
            listSetting: "",
            list: "",
            searchText: "",
            sort: "",
            group: "",
            buttonNew: "",
         });

         this.idBase = base;

         this.labels = {
            addNew: "Add new item",
            confirmDeleteTitle: "Delete Item",
            title: "Items",
            searchPlaceholder: "Item name",
            renameErrorMessage: "error renaming {0}",

            // we can reuse some of the Object ones:
            confirmDeleteMessage: "Do you want to delete <b>{0}</b>?",
            listSearch: "Search",
            listSetting: "Settings",
            listSort: "Sort",
            listAsc: "A -> Z",
            listDesc: "Z -> A",
            listGroup: "Group",
         };
         // copy in any passed in labels:
         if (attributes.labels) {
            for (var key in attributes.labels) {
               this.labels[key] = attributes.labels[key];
            }
         }
         // {lookup hash} id : Label Key
         // we allow the creating UI component to pass in alternate
         // label keys for this list.  That's how to customize the labels
         // for the current situation.

         attributes.menu = attributes.menu || {};
         attributes.menu.copy =
            typeof attributes.menu.copy == "undefined"
               ? true
               : attributes.menu.copy;
         attributes.menu.exclude =
            typeof attributes.menu.exclude == "undefined"
               ? true
               : attributes.menu.exclude;
         this.attributes = attributes;

         /*
          * _templateListItem
          *
          * The Process Row template definition.
          */
         this._templateListItem =
            attributes.templateListItem ||
            [
               "<div class='ab-object-list-item'>",
               "#label##warnings#",
               "{common.iconGear}",
               "</div>",
            ].join("");

         this.CurrentApplication = null;
         this.itemList = null;

         this._initialized = false;
         this._settings = {};
      }

      ui() {
         // the popup edit list for each entry in the list.
         this.PopupEditComponent = new UIListEditMenu(this.ids.component);

         //PopupListEditMenuComponent
         // console.log("look here------------------>", App.custom.editunitlist.view);

         var ids = this.ids;
         // for our onAfterRender() handler

         // Our webix UI definition:
         return {
            id: this.ids.component,
            rows: [
               {
                  view: AB.custom.editunitlist.view, // "editunitlist"
                  id: this.ids.list,
                  width: uiConfig.columnWidthLarge,

                  select: true,

                  editaction: "custom",
                  editable: true,
                  editor: "text",
                  editValue: "label",

                  uniteBy: (/* item */) => {
                     return L(this.labels.title);
                  },
                  template: (obj, common) => {
                     return this.templateListItem(obj, common);
                  },
                  tooltip: (obj) => {
                     return this.toolTipListItem(obj);
                  },
                  type: {
                     height: 35,
                     headerHeight: 35,
                     iconGear: (obj) => {
                        return `<div class="ab-object-list-edit"><span class="webix_icon fa fa-cog" data-cy="${this.ids.list}_edit_${obj.id}"></span></div>`;
                     },
                  },
                  on: {
                     onAfterSelect: (id) => {
                        this.onSelectItem(id);
                     },
                     onBeforeEditStop: (state, editor) => {
                        this.onBeforeEditStop(state, editor);
                     },
                     onAfterEditStop: (state, editor, ignoreUpdate) => {
                        this.onAfterEditStop(state, editor, ignoreUpdate);
                     },
                     onAfterRender() {
                        this.data.each((a) => {
                           AB.ClassUI.CYPRESS_REF(
                              this.getItemNode(a.id),
                              `${ids.list}_${a.id}`
                           );
                        });
                     },
                  },
                  onClick: {
                     "ab-object-list-edit": (e, id, trg) => {
                        this.clickEditMenu(e, id, trg);
                     },
                  },
               },
               {
                  view: "accordion",
                  multi: true,
                  css: "ab-object-list-filter",
                  rows: [
                     {
                        id: this.ids.listSetting,
                        header: L(this.labels.listSetting),
                        headerHeight: 45,
                        headerAltHeight: 45,
                        body: {
                           padding: 5,
                           rows: [
                              {
                                 id: this.ids.searchText,
                                 view: "search",
                                 icon: "fa fa-search",
                                 label: L(this.labels.listSearch),
                                 labelWidth: 80,
                                 placeholder: L(this.labels.searchPlaceholder),
                                 height: 35,
                                 keyPressTimeout: 100,
                                 on: {
                                    onAfterRender() {
                                       AB.ClassUI.CYPRESS_REF(this);
                                    },
                                    onTimedKeyPress: () => {
                                       this.listSearch();
                                       this.save();
                                    },
                                 },
                              },
                              {
                                 id: this.ids.sort,
                                 view: "segmented",
                                 label: L(this.labels.listSort),
                                 labelWidth: 80,
                                 height: 35,
                                 options: [
                                    {
                                       id: "asc",
                                       value: L(this.labels.listAsc),
                                    },
                                    {
                                       id: "desc",
                                       value: L(this.labels.listDesc),
                                    },
                                 ],
                                 on: {
                                    onAfterRender() {
                                       this.$view
                                          .querySelectorAll("button")
                                          .forEach((b) => {
                                             var bid =
                                                b.getAttribute("button_id");
                                             AB.ClassUI.CYPRESS_REF(
                                                b,
                                                `${ids.sort}_${bid}`
                                             );
                                          });
                                    },
                                    onChange: (newVal /*, oldVal */) => {
                                       this.listSort(newVal);
                                       this.save();
                                    },
                                 },
                              },
                              {
                                 id: this.ids.group,
                                 view: "checkbox",
                                 label: L(this.labels.listGroup),
                                 labelWidth: 80,
                                 on: {
                                    onAfterRender() {
                                       AB.ClassUI.CYPRESS_REF(this);
                                    },
                                    onChange: (newVal /*, oldVal */) => {
                                       this.listGroup(newVal);
                                       this.save();
                                    },
                                 },
                              },
                           ],
                        },
                     },
                  ],
                  on: {
                     onAfterCollapse: (/* id */) => {
                        this.listSettingCollapse();
                        this.save();
                     },
                     onAfterExpand: (/* id */) => {
                        this.listSettingExpand();
                        this.save();
                     },
                  },
               },
               {
                  view: "button",
                  css: "webix_primary",
                  id: this.ids.buttonNew,
                  value: L(this.labels.addNew),
                  type: "form",
                  click: () => {
                     this.clickAddNew(true); // pass true so it will select the new object after you created it
                  },
                  on: {
                     onAfterRender() {
                        AB.ClassUI.CYPRESS_REF(this);
                     },
                  },
               },
            ],
         };
      }

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;

         if ($$(this.ids.component)) $$(this.ids.component).adjust();

         this.$list = $$(this.ids.list);
         if (this.$list) {
            webix.extend(this.$list, webix.ProgressBar);
            this.$list.adjust();
         }

         this.PopupEditComponent.init(AB, {
            // onClick: _logic.callbackProcessEditorMenu,
            hideCopy: !this.attributes.menu.copy,
            hideExclude: !this.attributes.menu.exclude,
         });

         this.PopupEditComponent.on("click", (command) => {
            var selectedItem = this.$list.getSelectedItem(false);
            switch (command) {
               case "delete":
                  this.remove();
                  break;

               case "rename":
                  this.rename();
                  break;

               case "exclude":
                  this.emit("exclude", selectedItem);
                  break;

               case "copy":
                  this.copy(selectedItem);
                  // this.emit("copy", selectedItem);
                  break;

               default:
                  this.emit("menu", {
                     command: command,
                     id: selectedItem.id,
                  });
                  break;
            }
         });

         this._settings = this.AB.Storage.get(this.idBase) || {
            objectlistIsOpen: false,
            objectlistSearchText: "",
            objectlistSortDirection: "",
            objectlistIsGroup: false,
         };

         // mark initialed
         this._initialized = true;
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Process List from the provided ABApplication
       *
       * If no ABApplication is provided, then show an empty form. (create operation)
       *
       * @param {ABApplication} application  	[optional] The current ABApplication
       *										we are working with.
       */
      // applicationLoad(application) {
      //    // this.CurrentApplication = application;
      // }

      dataLoad(data) {
         this.busy();

         // get a DataCollection of all our objects
         this.itemList = new webix.DataCollection({
            data: data,
         });

         // setup object list settings
         var $listSetting = $$(this.ids.listSetting);
         $listSetting.getParentView().blockEvent();
         $listSetting.define(
            "collapsed",
            this._settings.objectlistIsOpen != true
         );
         $listSetting.refresh();
         $listSetting.getParentView().unblockEvent();

         var $searchText = $$(this.ids.searchText);
         $searchText.blockEvent();
         $searchText.setValue(this._settings.objectlistSearchText);
         $searchText.unblockEvent();

         var $sort = $$(this.ids.sort);
         $sort.blockEvent();
         $sort.setValue(this._settings.objectlistSortDirection);
         $sort.unblockEvent();

         var $group = $$(this.ids.group);
         $group.blockEvent();
         $group.setValue(this._settings.objectlistIsGroup);
         $group.unblockEvent();

         // clear our list and display our objects:
         var List = this.$list;
         List.clearAll();
         List.data.unsync();
         List.data.sync(this.itemList);
         List.refresh();
         List.unselectAll();

         // sort objects
         this.listSort(this._settings.objectlistSortDirection);

         // filter object list
         this.listSearch();

         // hide progress loading cursor
         this.ready();
      }

      clickEditMenu(e, id, trg) {
         // Show menu
         this.PopupEditComponent.show(trg);
         return false;
      }

      /**
       * @method copy
       * make a copy of the current selected item.
       *
       * copies should have all the same .toObj() data,
       * but will need unique names, and ids.
       *
       * we start the process by making a copy and then
       * having the user enter a new label/name for it.
       *
       * our .afterEdit() routines will detect it is a copy
       * then alert the parent UI component of the "copied" data
       *
       * @param {obj} selectedItem the currently selected item in
       * 		our list.
       */
      copy(selectedItem) {
         var newItem = selectedItem.toObj();
         newItem.id = "copy_" + (this.itemList ? this.itemList.count() : "01");
         delete newItem.translations;
         newItem.name = newItem.name + " copy";
         newItem.label = newItem.name;

         // find the current index of the item being copied:
         var list = this.$list;
         var selectedIndex = list.getIndexById(list.getSelectedId());

         // insert copy in it's place and make it editable:
         list.add(newItem, selectedIndex);
         list.select(newItem.id);
         list.edit(newItem.id);
      }

      listSettingCollapse() {
         this._settings.objectlistIsOpen = false;
      }

      listSettingExpand() {
         this._settings.objectlistIsOpen = true;
      }

      busy() {
         this.$list?.showProgress?.({ type: "icon" });
      }

      ready() {
         this.$list?.hideProgress?.();
      }

      listSearch() {
         var searchText = $$(this.ids.searchText).getValue().toLowerCase();

         this.$list.filter(function (item) {
            return (
               !item.label || item.label.toLowerCase().indexOf(searchText) > -1
            );
         });

         this._settings.objectlistSearchText = searchText;
      }

      listSort(sortType) {
         if (this.itemList == null) return;
         this.itemList.sort("label", sortType);
         this.listSearch();
         this._settings.objectlistSortDirection = sortType;
      }

      listGroup(isGroup) {
         if (isGroup == true) {
            this.$list.define("uniteBy", (item) => {
               return item.label.toUpperCase().substr(0, 1);
            });
         } else {
            this.$list.define("uniteBy", (/* item */) => {
               return L(this.labels.title);
            });
         }
         this.$list.refresh();
         this._settings.objectlistIsGroup = isGroup;
      }

      listCount() {
         if (this.$list) return this.$list.count();
      }

      selectedItem() {
         return this.$list.getSelectedItem(false);
      }

      onAfterEditStop(state, editor /*, ignoreUpdate */) {
         this.showGear(editor.id);

         if (state.value != state.old) {
            this.busy();

            var selectedItem = this.$list.getSelectedItem(false);
            selectedItem.label = state.value;

            // if this item supports .save()
            if (selectedItem.save) {
               // Call server to rename
               selectedItem
                  .save()
                  .catch((err) => {
                     this.ready();

                     webix.alert({
                        title: L("Alert"),
                        text: L(this.labels.renameErrorMessage, state.old),
                     });
                     this.AB.notify.developer(err, {
                        context:
                           "ui_common_list:onAfterEditStop():Error saving item.",
                        id: selectedItem.id,
                        value: state.value,
                     });
                  })
                  .then(() => {
                     this.ready();
                  });
            } else {
               // maybe this is from a .copy() command:
               if (selectedItem.id.indexOf("copy_") == 0) {
                  // if so, then our default name should be what
                  // the label is:
                  selectedItem.name = selectedItem.label;
                  var currID = selectedItem.id;

                  // remove our temp id
                  delete selectedItem.id;

                  // alert the parent UI of the copied data:
                  this.emit("copied", {
                     item: selectedItem,
                     currID: currID,
                  });
               }
            }
         }
      }

      onBeforeEditStop(state /*, editor */) {
         var selectedItem = this.$list.getSelectedItem(false);
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

      /**
       * @function onSelectItem()
       *
       * Perform these actions when an Process is selected in the List.
       */
      onSelectItem(id) {
         var process = this.$list.getItem(id);

         // _logic.callbacks.onChange(object);
         this.emit("selected", process);

         this.showGear(id);
      }

      /**
       * @function save()
       *
       */
      save() {
         // if this UI has not been initialed, then skip it
         if (!this._initialized) return;

         // CurrentApplication.save();
         this.AB.Storage.set(this.idBase, this._settings);
      }

      selectItem(id) {
         this.$list.blockEvent();
         this.select(id);
         this.$list.unblockEvent();
      }

      showGear(id) {
         let $item = this.$list.getItemNode(id);
         if ($item) {
            let gearIcon = $item.querySelector(".ab-object-list-edit");
            if (gearIcon) {
               gearIcon.style.visibility = "visible";
               gearIcon.style.display = "block";
            }
         }
      }

      /**
       * @function templateListItem
       *
       * Defines the template for each row of our ProcessList.
       *
       * @param {obj} obj the current instance of ABProcess for the row.
       * @param {?} common the webix.common icon data structure
       * @return {string}
       */
      templateListItem(obj, common) {
         var warnings = obj.warningsAll();

         if (typeof this._templateListItem == "string") {
            var warnText = "";
            if (warnings.length > 0) {
               warnText = `<span class="webix_sidebar_dir_icon webix_icon fa fa-warning pulseLight smalltext"></span>`;
            }

            return this._templateListItem
               .replace("#label#", obj.label || "??label??")
               .replace("{common.iconGear}", common.iconGear(obj))
               .replace("#warnings#", warnText);
         }
         // else they sent in a function()
         return this._templateListItem(obj, common, warnings);
      }

      /**
       * @function templateListItem
       *
       * Defines the template for each row of our ProcessList.
       *
       * @param {obj} obj the current instance of ABProcess for the row.
       * @param {?} common the webix.common icon data structure
       * @return {string}
       */
      toolTipListItem(obj) {
         let issues = $$(this.ids.list)
            .data.getItem(obj.id)
            .warningsAll().length;

         return issues ? `${issues} issues` : "";
      }

      /**
       * @function callbackNewProcess
       *
       * Once a New Process was created in the Popup, follow up with it here.
       */
      // callbackNewProcess:function(err, object, selectNew, callback){

      // 	if (err) {
      // 		OP.Error.log('Error creating New Process', {error: err});
      // 		return;
      // 	}

      // 	let objects = CurrentApplication.objects();
      // 	itemList.parse(objects);

      // 	// if (processList.exists(object.id))
      // 	// 	processList.updateItem(object.id, object);
      // 	// else
      // 	// 	processList.add(object);

      // 	if (selectNew != null && selectNew == true) {
      // 		$$(ids.list).select(object.id);
      // 	}
      // 	else if (callback) {
      // 		callback();
      // 	}

      // },

      /**
       * @function clickAddNew
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickAddNew(selectNew) {
         this.emit("addNew", selectNew);
      }

      /**
       * @function exclude()
       *
       * alert calling UI that a list item was chosen for "exclude"
       */
      exclude() {
         var item = this.$list.getSelectedItem(false);
         this.emit("exclude", item);
      }

      rename() {
         var itemId = this.$list.getSelectedId(false);
         this.$list.edit(itemId);
      }

      remove() {
         var selectedItem = this.$list.getSelectedItem(false);

         // verify they mean to do this:
         webix.confirm({
            title: L(this.labels.confirmDeleteTitle),
            text: L(this.labels.confirmDeleteMessage, [selectedItem.label]),
            ok: L("Yes"),
            cancel: L("No"),
            callback: async (isOK) => {
               if (isOK) {
                  this.busy();

                  try {
                     await selectedItem.destroy();
                     this.ready();
                     this.itemList.remove(selectedItem.id);

                     // let the calling component know about
                     // the deletion:
                     this.emit("deleted", selectedItem);

                     // clear object workspace
                     this.emit("selected", null);
                  } catch (e) {
                     this.AB.notify.developer(e, {
                        context: "ui_common_list:remove(): error removing item",
                     });
                     this.ready();
                  }
               }
            },
         });
      }

      select(id) {
         this.$list.select(id);
      }

      callbackProcessEditorMenu(action) {
         switch (action) {
            case "rename":
               this.rename();
               break;
            case "exclude":
               this.exclude();
               break;
            case "delete":
               this.remove();
               break;
         }
      }

      // Expose any globally accessible Actions:
      // this.actions({
      //    /**
      //     * @function getSelectedProcess
      //     *
      //     * returns which ABProcess is currently selected.
      //     * @return {ABProcess}  or {null} if nothing selected.
      //     */
      //    getSelectedProcess: function () {
      //       return $$(ids.list).getSelectedItem();
      //    },

      //    addNewProcess: function (selectNew, callback) {
      //       _logic.clickNewProcess(selectNew, callback);
      //    },
      // });
   }

   // NOTE: We are returning the Class here, not an instance:
   return new UI_Common_List(options);
}
