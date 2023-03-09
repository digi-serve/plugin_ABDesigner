/*
 * ab_common_list
 *
 * A common interface for displaying AB category list widget
 *
 */

export default function (AB, options) {
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
            buttonNew: "",
         });

         this.idBase = base;

         this.labels = {
            addNew: "Add new item",
            confirmDeleteTitle: "Delete Item",
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
            "#version# - #changelog.author# <div style='padding-left:18px'>#changelog.commitMessage#</div>";

         this.cacheTemplate = {};
         // {json} hash { obj.id : template display }
         // a temporary cache of an items template
         // this is to prevent multiple template generations
         // in rapid succession.

         this.CurrentApplication = null;
         this.itemList = null;

         this._initialized = false;
         this._settings = {};
      }

      ui() {
         var ids = this.ids;
         // for our onAfterRender() handler

         // function sortChangelogByVersion(changelogObj) {
         //    const changeData = changelogObj;
         //    // Get an array of the changelog object's keys (i.e. version numbers)
         //    const versionNumbers = Object.keys(changelogObj);

         //    // Sort the version numbers based on semantic versioning rules, with newest versions first
         //    const sortedVersionNumbers = versionNumbers.sort((a, b) => {
         //       const [aMajor, aMinor, aPatch] = a
         //          .split(".")
         //          .map((num) => parseInt(num));
         //       const [bMajor, bMinor, bPatch] = b
         //          .split(".")
         //          .map((num) => parseInt(num));

         //       if (aMajor !== bMajor) {
         //          return bMajor - aMajor;
         //       } else if (aMinor !== bMinor) {
         //          return bMinor - aMinor;
         //       } else {
         //          return bPatch - aPatch;
         //       }
         //    });

         //    // Map the sorted versions to an array of objects that includes the version number and changelog info
         //    const sortedChangelog = sortedVersionNumbers.map((version) => {
         //       changelogObj[version]["versionNumber"] = version;
         //       console.dir(changeData[version].commitMessage);
         //       return {
         //          version,
         //          changelog: changelogObj[version],
         //          commitMessage: changeData[version]["commitMessage"],
         //          author: changeData[version]["author"],
         //          timestamp: changeData[version]["timestamp"],
         //          changeSize: changeData[version]["changeSize"],
         //       };
         //    });

         //    return sortedChangelog;
         // }
         // Helper functions
         //  The getVersionOptions() function generates an array of version options that start from the current version
         // and go up by one for each of the three segments (major, minor, and patch).
         function getVersionOptions() {
            const versionNumber = versionData.versionNumber;
            const major = versionNumber.split(".")[0];
            const minor = versionNumber.split(".")[1];
            const patch = versionNumber.split(".")[2];
            const options = [
               `${parseInt(major) + 1}.0.0 <i>major</i>`,
               `${major}.${parseInt(minor) + 1}.0 <i>minor</i>`,
               `${major}.${minor}.${parseInt(patch) + 1} <i>patch</i>`,
            ];
            return options;
         }
         // The getVersionOptionByNumber(versionNumber) function takes a version number and returns the
         // corresponding option from the array generated by getVersionOptions().
         function getVersionOptionByNumber(versionNumber) {
            const options = getVersionOptions();
            const major = versionNumber.split(".")[0];
            const minor = versionNumber.split(".")[1];
            const patch = versionNumber.split(".")[2];
            if (major > 1) {
               return `${major}.0.0 <i>major</i>`;
            } else if (minor > 91) {
               return `${major}.${minor}.0 <i>minor</i>`;
            } else {
               return `${major}.${minor}.${patch} <i>patch</i>`;
            }
         }

         return {
            id: this.ids.component,
            view: "layout",
            rows: [
               {
                  view: "button",
                  value: "Set current Changes",
                  click: function () {
                     $$("versionList").unselectAll();
                     $$("save_button_1").show();
                     $$("save_button_2").show();
                     $$("versionForm").show();
                     $$("version").hide();
                     $$("timestamp").hide();
                     $$("rollback_button").hide();
                     $$("keepVersion").hide();
                  },
               },
               {
                  id: this.ids.list,
                  width: uiConfig.columnWidthLarge,
                  editaction: "custom",
                  editable: true,
                  editor: "text",
                  editValue: "label",
                  view: "list",
                  template: (obj, common) => {
                     return this.templateListItem(obj, common);
                  },
                  // template:
                  //    "#version# - #changelog.author# <div style='padding-left:18px'>#changelog.commitMessage#</div>",
                  type: {
                     height: 60,
                  },
                  select: true,
                  autowidth: true,
                  autoheight: true,
                  // data: data,
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
                     onItemClick: function (id) {
                        var item = this.getItem(id);
                        console.log(item);
                        $$("save_button_1").hide();
                        $$("save_button_2").hide();
                        $$("version").show();
                        $$("timestamp").show();
                        $$("rollback_button").show();
                        $$("keepVersion").show();
                     },
                  },
               },
            ],
         };

         // // Our webix UI definition:
         // return {
         //    id: this.ids.component,
         //    rows: [
         //       {
         //          view: AB.custom.editunitlist.view, // "editunitlist"
         //          id: this.ids.list,
         //          width: uiConfig.columnWidthLarge,

         //          select: true,

         //          editaction: "custom",
         //          editable: true,
         //          editor: "text",
         //          editValue: "label",

         //          uniteBy: (/* item */) => {
         //             return L(this.labels.title);
         //          },
         //          template: (obj, common) => {
         //             return this.templateListItem(obj, common);
         //          },
         //          tooltip: (obj) => {
         //             return this.toolTipListItem(obj);
         //          },
         //          type: {
         //             height: 35,
         //             headerHeight: 35,
         //             iconGear: (obj) => {
         //                return `<div class="ab-object-list-edit"><span class="webix_icon fa fa-cog" data-cy="${this.ids.list}_edit_${obj.id}"></span></div>`;
         //             },
         //          },
         //          on: {
         //             onAfterSelect: (id) => {
         //                this.onSelectItem(id);
         //             },
         //             onBeforeEditStop: (state, editor) => {
         //                this.onBeforeEditStop(state, editor);
         //             },
         //             onAfterEditStop: (state, editor, ignoreUpdate) => {
         //                this.onAfterEditStop(state, editor, ignoreUpdate);
         //             },
         //             onAfterRender() {
         //                this.data.each((a) => {
         //                   AB.ClassUI.CYPRESS_REF(
         //                      this.getItemNode(a.id),
         //                      `${ids.list}_${a.id}`
         //                   );
         //                });
         //             },
         //          },
         //          onClick: {
         //             "ab-object-list-edit": (e, id, trg) => {
         //                this.clickEditMenu(e, id, trg);
         //             },
         //          },
         //       },
         //       {
         //          view: "accordion",
         //          multi: true,
         //          css: "ab-object-list-filter",
         //          rows: [
         //             {
         //                id: this.ids.listSetting,
         //                header: L(this.labels.listSetting),
         //                headerHeight: 45,
         //                headerAltHeight: 45,
         //                body: {
         //                   padding: 5,
         //                   rows: [
         //                      {
         //                         id: this.ids.searchText,
         //                         view: "search",
         //                         icon: "fa fa-search",
         //                         label: L(this.labels.listSearch),
         //                         labelWidth: 80,
         //                         placeholder: L(this.labels.searchPlaceholder),
         //                         height: 35,
         //                         keyPressTimeout: 100,
         //                         on: {
         //                            onAfterRender() {
         //                               AB.ClassUI.CYPRESS_REF(this);
         //                            },
         //                            onTimedKeyPress: () => {
         //                               this.listSearch();
         //                               this.save();
         //                            },
         //                         },
         //                      },
         //                      {
         //                         id: this.ids.sort,
         //                         view: "segmented",
         //                         label: L(this.labels.listSort),
         //                         labelWidth: 80,
         //                         height: 35,
         //                         options: [
         //                            {
         //                               id: "asc",
         //                               value: L(this.labels.listAsc),
         //                            },
         //                            {
         //                               id: "desc",
         //                               value: L(this.labels.listDesc),
         //                            },
         //                         ],
         //                         on: {
         //                            onAfterRender() {
         //                               this.$view
         //                                  .querySelectorAll("button")
         //                                  .forEach((b) => {
         //                                     var bid =
         //                                        b.getAttribute("button_id");
         //                                     AB.ClassUI.CYPRESS_REF(
         //                                        b,
         //                                        `${ids.sort}_${bid}`
         //                                     );
         //                                  });
         //                            },
         //                            onChange: (newVal /*, oldVal */) => {
         //                               this.listSort(newVal);
         //                               this.save();
         //                            },
         //                         },
         //                      },
         //                      {
         //                         id: this.ids.group,
         //                         view: "checkbox",
         //                         label: L(this.labels.listGroup),
         //                         labelWidth: 80,
         //                         on: {
         //                            onAfterRender() {
         //                               AB.ClassUI.CYPRESS_REF(this);
         //                            },
         //                            onChange: (newVal /*, oldVal */) => {
         //                               this.listGroup(newVal);
         //                               this.save();
         //                            },
         //                         },
         //                      },
         //                   ],
         //                },
         //             },
         //          ],
         //          on: {
         //             onAfterCollapse: (/* id */) => {
         //                this.listSettingCollapse();
         //                this.save();
         //             },
         //             onAfterExpand: (/* id */) => {
         //                this.listSettingExpand();
         //                this.save();
         //             },
         //          },
         //       },
         //       {
         //          view: "button",
         //          css: "webix_primary",
         //          id: this.ids.buttonNew,
         //          value: L(this.labels.addNew),
         //          type: "form",
         //          click: () => {
         //             this.clickAddNew(true); // pass true so it will select the new object after you created it
         //          },
         //          on: {
         //             onAfterRender() {
         //                AB.ClassUI.CYPRESS_REF(this);
         //             },
         //          },
         //       },
         //    ],
         // };
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

         var versionData = {
            versionNumber: "1.0.1",
            changelog: {
               "1.0.0": {
                  changeSize: 0, // the initial version has no changes, so the change size is 0
                  commitMessage: "Created App", // the commit message for the initial version
                  author: "Bob", // the name of the builder who created the initial version
                  timestamp: "2023-03-02T14:30:00.000Z", // the timestamp for the initial version
               },
               "1.0.1": {
                  changeSize: 1, // the size of the changes made in version 1.0.1
                  commitMessage: "Added a home page", // the commit message for version 1.0.1
                  author: "Ann", // the name of the builder who made the changes
                  timestamp: "2023-03-03T10:15:00.000Z", // the timestamp for version 1.0.1
               },
            },
         };

         function sortChangelogByVersion(changelogObj) {
            const changeData = changelogObj;
            // Get an array of the changelog object's keys (i.e. version numbers)
            const versionNumbers = Object.keys(changelogObj);

            // Sort the version numbers based on semantic versioning rules, with newest versions first
            const sortedVersionNumbers = versionNumbers.sort((a, b) => {
               const [aMajor, aMinor, aPatch] = a
                  .split(".")
                  .map((num) => parseInt(num));
               const [bMajor, bMinor, bPatch] = b
                  .split(".")
                  .map((num) => parseInt(num));

               if (aMajor !== bMajor) {
                  return bMajor - aMajor;
               } else if (aMinor !== bMinor) {
                  return bMinor - aMinor;
               } else {
                  return bPatch - aPatch;
               }
            });

            // Map the sorted versions to an array of objects that includes the version number and changelog info
            const sortedChangelog = sortedVersionNumbers.map((version) => {
               changelogObj[version]["versionNumber"] = version;
               console.dir(changeData[version].commitMessage);
               return {
                  version,
                  changelog: changelogObj[version],
                  commitMessage: changeData[version]["commitMessage"],
                  author: changeData[version]["author"],
                  timestamp: changeData[version]["timestamp"],
                  changeSize: changeData[version]["changeSize"],
               };
            });

            return sortedChangelog;
         }

         // get a sorted list of changes
         this.itemList = sortChangelogByVersion(
            data.changelog || versionData.changelog
         );

         // clear our list and display our versions:
         var List = this.$list || $$(this.ids.list);
         if (List) {
            List.clearAll();
            List.data.unsync();
            List.data.sync(this.itemList);
            List.refresh();
            List.unselectAll();
         }

         this.ready();
      }

      busy() {
         this.$list?.showProgress?.({ type: "icon" });
      }

      ready() {
         this.$list?.hideProgress?.();
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
       * @param {obj} obj the current instance of ABxxxx for the row.
       * @param {?} common the webix.common icon data structure
       * @return {string}
       */
      templateListItem(obj, common) {
         if (!this.cacheTemplate[obj.id]) {
            var warnings = obj.warningsAll();

            if (typeof this._templateListItem == "string") {
               var warnText = "";
               if (warnings.length > 0) {
                  warnText = `<span class="webix_sidebar_dir_icon webix_icon fa fa-warning pulseLight smalltext"></span>`;
               }

               this.cacheTemplate[obj.id] = this._templateListItem
                  .replace("#label#", obj.label || "??label??")
                  .replace("{common.iconGear}", common.iconGear(obj))
                  .replace("#warnings#", warnText);
            } else {
               // else they sent in a function()
               this.cacheTemplate[obj.id] = this._templateListItem(
                  obj,
                  common,
                  warnings
               );
            }

            setTimeout(() => {
               delete this.cacheTemplate[obj.id];
            }, 400);
         }
         return this.cacheTemplate[obj.id];
      }

      /**
       * @function toolTipListItem
       * Defines the tooltip text for an item in our list.
       * @param {obj} obj the current instance of the Object being displayed
       *              in each row.
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
