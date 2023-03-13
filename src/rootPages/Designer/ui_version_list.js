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
         attributes.idBase = attributes.idBase || "ui_common_list";
         var base = attributes.idBase || "ui_common_list";
         super(base, {
            listSetting: "",
            vList: "",
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
            "<div class='ab-object-list-item'>#version# - #changelog.author# <div style='padding-left:18px'>#changelog.commitMessage#</div></div>";

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
         var data = data || {};

         // Our webix UI definition:
         return {
            id: this.ids.component,
            rows: [
               {
                  // view: AB.custom.editunitlist.view, // "editunitlist"
                  // view: AB.custom..view, // "editunitlist"
                  view: "list",
                  id: this.ids.vList,
                  width: uiConfig.columnWidthLarge,

                  select: true,

                  editaction: "custom",
                  editable: true,
                  editor: "text",
                  editValue: "label",

                  type: {
                     height: 57,
                  },
                  template: (obj, common) => {
                     return this.templateListItem(obj, common);
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
                  // onClick: {
                  //    "ab-object-list-edit": (e, id, trg) => {
                  //       this.clickEditMenu(e, id, trg);
                  //    },
                  // },
               },
               {
                  view: "button",
                  css: "webix_primary",
                  id: this.ids.buttonNew,
                  value: "bob", // L(this.labels.addNew),
                  type: "form",
                  click: () => {
                     //this.clickAddNew(true); // pass true so it will select the new object after you created it
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

         this.$list = $$(this.ids.vList);

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
      // ! this may not ever be used?
      applicationLoad(application) {
         this.CurrentApplication = application;
      }

      dataLoad(versionData) {
         this.busy();
         var data = versionData.changeLog;

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
            const sortedChangelog = sortedVersionNumbers.map(
               (version, index) => {
                  if (typeof changelogObj[version] == "string") {
                     AB.notify.developer(new Error(), {
                        context: "ui_version_list.loadData()",
                        message:
                           "The changelog object is not in the correct format.",
                        version: version,
                     });
                     return { version: version, id: index };
                  }

                  changelogObj[version]["versionNumber"] = version;
                  // TODO clean up this object @achoobert
                  return {
                     id: index,
                     label: version,
                     title: version,
                     name: version,
                     version: version,
                     changelog: changelogObj[version],
                     commitMessage: changeData[version]["commitMessage"],
                     author: changeData[version]["author"],
                     timestamp: changeData[version]["timestamp"],
                     changeSize: changeData[version]["changeSize"],
                  };
               }
            );

            return sortedChangelog;
         }

         // get a sorted list of changes, and add it to a data collection
         this.itemList = new webix.DataCollection({
            data: sortChangelogByVersion(data),
         });

         // clear our list and display our versions:
         var List = this.$list || $$(this.ids.vList);
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
         console.dir("This is never called");
         //"#version# - #changelog.author# <div style='padding-left:18px'>#changelog.commitMessage#</div>"
         if (!this.cacheTemplate[obj.id]) {
            if (typeof this._templateListItem == "string") {
               this.cacheTemplate[obj.id] = this._templateListItem
                  .replace("#label#", obj.label || "??label??")
                  .replace("#title#", obj.title || "??title??")
                  .replace("#year#", obj.year || "??year??")
                  .replace("#version#", obj.version || "??version??")
                  .replace(
                     "#changelog.author#",
                     obj.changelog?.author || "??changelog.author??"
                  )
                  .replace(
                     "#changelog.commitMessage#",
                     obj.changelog?.commitMessage ||
                        "??changelog.commitMessage??"
                  );
            } else {
               // else they sent in a function()
               this.cacheTemplate[obj.id] = this._templateListItem(obj, common);
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
      // toolTipListItem(obj) {
      //    let issues = $$(this.ids.vList)
      //       .data.getItem(obj.id)
      //       .warningsAll().length;

      //    return issues ? `${issues} issues` : "";
      // }

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
