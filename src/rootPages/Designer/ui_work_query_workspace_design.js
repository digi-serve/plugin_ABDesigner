/*
 * ui_work_query_workspace_design
 *
 * Manage the Query Workspace area.
 *
 */

import UI_Class from "./ui_class";

// const ABDataCollection = require("../classes/platform/ABDataCollection");
// const RowFilter = require("../classes/platform/RowFilter");

export default function (AB, init_settings) {
   const UIClass = UI_Class(AB);
   const uiConfig = AB.Config.uiSettings();
   var L = UIClass.L();

   class UI_Work_Query_Workspace_Design extends UIClass {
      constructor(settings = {}) {
         super("ui_work_query_workspace_design", {
            tree: "",
            tabObjects: "",
            depth: "",

            datatable: "",

            selectedObject: "",
            grouping: "",
            hidePrefix: "",
            filter: "",
         });

         this.settings = settings;

         this.CurrentDatacollection = null;
         // {ABDataCollection}
         // A DC used to drive the display of our workspace views.

         this.CurrentQueryID = null;
         // {string}
         // the ABObjectQuery.id of the query we are working with.

         this.DataFilter = AB.rowfilterNew(null, this.ids.filter);
         this.DataFilter.init({
            onChange: () => {
               this.save();
            },
            showObjectName: true,
         });
      }

      ui() {
         const _this = this;
         const ids = this.ids;

         return {
            view: "scrollview",
            id: ids.component,
            body: {
               rows: [
                  {
                     id: ids.selectedObject,
                     type: "form",
                     rows: [
                        {
                           cols: [
                              {
                                 rows: [
                                    {
                                       view: "label",
                                       label: L("Manage Objects"),
                                       css: "ab-query-label",
                                       // height: 50
                                    },
                                    // {
                                    //    autowidth: true,
                                    //    css: "bg-gray",
                                    //    cols: [
                                    //       {},
                                    //       {
                                    //          id: ids.depth,
                                    //          view: "counter",
                                    //          label: L('ab.object.querybuilder.relationshipDepth', "*Relationship Depth"),
                                    //          width: 270,
                                    //          labelWidth: 165,
                                    //          step: 1,
                                    //          value: 5,
                                    //          min: 1,
                                    //          max: 10,
                                    //          on: {
                                    //             onChange: function (newv, oldv) {
                                    //                _logic.depthChange(newv, oldv);
                                    //             }
                                    //          }
                                    //       },
                                    //       {}
                                    //    ]
                                    // },
                                    {
                                       view: "tree",
                                       id: ids.tree,
                                       css: "ab-tree",
                                       template:
                                          "{common.icon()} {common.checkbox()} #value#",
                                       data: [],
                                       on: {
                                          onItemClick: function (
                                             id,
                                             event,
                                             item
                                          ) {
                                             if (this.getItem(id).disabled)
                                                return;

                                             if (this.isChecked(id)) {
                                                this.uncheckItem(id);
                                             } else {
                                                this.checkItem(id);
                                             }
                                          },
                                          onItemCheck: (
                                             id,
                                             isChecked,
                                             event
                                          ) => {
                                             this.checkObjectLink(
                                                id,
                                                isChecked
                                             );
                                          },
                                          onBeforeOpen: function (id) {
                                             let item = this.getItem(id);
                                             if (item.$count === -1) {
                                                $$(ids.tree).showProgress({
                                                   type: "icon",
                                                });

                                                let result =
                                                   _this.getChildItems(
                                                      item.objectLinkId,
                                                      id
                                                   );

                                                $$(ids.tree).parse(
                                                   result.treeItems
                                                );
                                                $$(ids.tree).hideProgress();
                                             }
                                          },
                                       },
                                    },
                                 ],
                              },
                              {
                                 width: 20,
                              },
                              {
                                 gravity: 2,
                                 rows: [
                                    {
                                       view: "label",
                                       label: L("Manage Fields"),
                                       css: "ab-query-label",
                                       // height: 50
                                    },
                                    {
                                       view: "tabview",
                                       id: ids.tabObjects,
                                       tabMinWidth: 180,
                                       tabbar: {
                                          bottomOffset: 1,
                                       },
                                       cells: [
                                          {}, // require
                                       ],
                                       multiview: {
                                          on: {
                                             onViewChange: (prevId, nextId) => {
                                                this.setSelectedFields(nextId);
                                             },
                                          },
                                       },
                                    },
                                 ],
                              },
                           ],
                        },
                        // grouping
                        {
                           id: ids.grouping,
                           view: "checkbox",
                           label: L("Grouping"),
                           labelWidth: uiConfig.labelWidthXLarge,
                           on: {
                              onChange: () => {
                                 this.save();
                              },
                           },
                        },
                        // hide prefix labels
                        {
                           id: ids.hidePrefix,
                           view: "checkbox",
                           label: L("Hide prefix labels"),
                           labelWidth: uiConfig.labelWidthXLarge,
                           on: {
                              onChange: () => {
                                 this.save();
                              },
                           },
                        },
                        // filter
                        {
                           view: "label",
                           label: L("Manage Filters"),
                           css: "ab-query-label",
                           // height: 50
                        },
                        this.DataFilter.ui,
                        {
                           id: ids.datatable,
                           view: "treetable",
                           minHeight: 280,
                           dragColumn: true,
                           columns: [],
                           data: [],
                           on: {
                              onAfterColumnDrop: () => {
                                 this.save();
                              },
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;
         const ids = this.ids;

         // webix.extend($$(ids.form), webix.ProgressBar);
         webix.extend($$(ids.tree), webix.ProgressBar);
         webix.extend($$(ids.tabObjects), webix.ProgressBar);
         webix.extend($$(ids.datatable), webix.ProgressBar);

         return Promise.resolve();
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Object Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      // applicationLoad(application) {
      //    CurrentApplication = application;
      // }

      /**
       * @method clearWorkspace()
       * Clear the query workspace.
       */
      clearWorkspace() {
         // $$(this.ids.component).hide();
      }

      /**
       * @method populateQueryWorkspace()
       * Initialize the Object Workspace with the provided ABObject.
       * @param {ABObjectQuery} query
       *        current ABObject instance we are working with.
       */
      populateQueryWorkspace(query) {
         console.error("DEPRECIATED! Use queryLoad() instead");
         this.queryLoad(query);
      }
      queryLoad(query) {
         super.queryLoad(query);

         let CurrentQuery = this.CurrentQuery;
         if (CurrentQuery == null) {
            this.clearWorkspace();
            return;
         }

         // create new data view
         this.CurrentDatacollection = this.AB.datacollectionNew({
            query: [CurrentQuery.toObj()],
            settings: {
               datasourceID: CurrentQuery.id,
            },
         });
         this.CurrentDatacollection.datasource = CurrentQuery;
         // this.CurrentDatacollection.init(); << need this?

         const objBase = CurrentQuery.objectBase();

         const ids = this.ids;
         $$(ids.selectedObject).show();

         // *** Tree ***
         this.refreshTree();

         // *** Tabs ***

         let links = CurrentQuery.joins().links || [];
         const $tabObjects = $$(ids.tabObjects);

         $tabObjects?.showProgress({ type: "icon" });

         // NOTE : Tabview have to contain at least one cell
         $tabObjects.addView({
            body: {
               id: "temp",
            },
         });

         // clear object tabs
         var tabbar = $tabObjects.getTabbar();
         var optionIds = tabbar.config.options.map((opt) => opt.id);
         optionIds.forEach((optId) => {
            if (optId != "temp") {
               // Don't remove a temporary tab (remove later)
               $tabObjects.removeView(optId);
            }
         });
         var $viewMultiview = $tabObjects.getMultiview();
         $viewMultiview
            .getChildViews()
            .map(($view) => $view)
            .forEach(($view) => {
               if ($view && $view.config.id != "temp")
                  $viewMultiview.removeView($view);
            });

         if (!objBase) return;

         // add the main object tab
         let tabUI = this.templateField({
            object: objBase,
            isTypeHidden: true,
            aliasName: "BASE_OBJECT",
         });
         $tabObjects.addView(tabUI);

         // select default tab to the main object
         $tabObjects.setValue(tabUI.id);

         // populate selected fields
         this.setSelectedFields("BASE_OBJECT");

         // Other object tabs will be added in a check tree item event
         var fnAddTab = (objFrom, links) => {
            (links || []).forEach((join) => {
               // NOTE: query v1
               // if (join.objectURL) {
               //    objFrom = CurrentApplication.urlResolve(
               //       join.objectURL
               //    );
               // }

               if (!objFrom) return;

               if (!join.fieldID) return;

               var fieldLink = objFrom.fieldByID(join.fieldID);
               if (!fieldLink) return;

               var objLink = CurrentQuery.objectByID(
                  fieldLink.settings.linkObject
               );
               if (!objLink) return;
               // if (!objLink ||
               // 	// prevent join recursive base object
               // 	objLink.id == objBase.id) return;

               // add tab
               let tabUI = this.templateField({
                  field: fieldLink,
                  joinType: join.type,
                  aliasName: join.alias,
               });
               $tabObjects.addView(tabUI);

               // populate selected fields
               this.setSelectedFields(join.alias);

               fnAddTab(objLink, join.links);
            });
         };

         fnAddTab(objBase, links);

         /** Grouping **/
         $$(ids.grouping).define("value", query.settings.grouping);
         $$(ids.grouping).refresh();

         /** Hide prefix label **/
         $$(ids.hidePrefix).define("value", query.settings.hidePrefix);
         $$(ids.hidePrefix).refresh();

         // remove a temporary tab
         $tabObjects.removeView("temp");
         $tabObjects.adjust();

         $tabObjects.hideProgress();

         /** Filter **/
         this.refreshFilter();

         /** DataTable **/
         this.refreshDataTable();
      }

      /**
       * @method getChildItems
       * Get items of tree view
       * @param {string} objectId
       *        ABObject.id
       * @param {uuid} parentItemId
       * @return {Promise}
       */
      getChildItems(objectId, parentItemId) {
         let treeItems = {
            data: [],
         };
         let object = this.getObject(objectId);

         if (parentItemId) treeItems.parent = parentItemId;

         let tasks = [];

         // Loop to find object of the connect field
         object.connectFields().forEach((f) => {
            let objectLink = this.getObject(f.settings.linkObject);
            if (objectLink == null) return;

            // Prevent System Objects from showing up in List
            // UNLESS we are in a SystemApp:
            if (!this.CurrentApplication.isSystemObj) {
               if (objectLink.isSystemObject) return;
            }

            let fieldID = f.id;

            // add items to tree
            var label = `${objectLink.label} (${f.label})`;

            treeItems.data.push({
               value: label, // a label of link object
               fieldID: fieldID,
               objectId: objectLink.id,
               objectLinkId: f.settings.linkObject,
               checked: false,
               disabled: false, // always enable
               open: false,

               webix_kids: true,
            });
         });

         return {
            object,
            treeItems: treeItems,
         };

         /*
               return (
                  Promise.resolve()
                     // get object
                     .then(() => _logic.getObject(objectId))

                     // populate to tree values
                     .then((object) => {
                        // if (parentItemId) {
                        // 	var item = store.getItem(parentItemId);
                        // 	if (item.$level > $$(ids.depth).getValue())
                        // 		return;
                        // }

                        objectResult = object;

                        if (parentItemId) treeItems.parent = parentItemId;

                        let tasks = [];

                        // Loop to find object of the connect field
                        object.connectFields(true).forEach((f) => {
                           tasks.push(() => {
                              return new Promise((ok, error) => {
                                 _logic
                                    .getObject(f.settings.linkObject)
                                    .catch(error)
                                    .then((objectLink) => {
                                       if (objectLink == null) return ok();

                                       let fieldID = f.id;

                                       // add items to tree
                                       var label = "#object# (#field#)"
                                          .replace("#object#", objectLink.label)
                                          .replace("#field#", f.label);

                                       treeItems.data.push({
                                          value: label, // a label of link object
                                          fieldID: fieldID,
                                          objectId: objectLink.id,
                                          objectLinkId: f.settings.linkObject,
                                          checked: false,
                                          disabled: false, // always enable
                                          open: false,

                                          webix_kids: true,
                                       });

                                       ok();
                                    });
                              });
                           });
                        });

                        // action sequentially
                        return tasks.reduce((promiseChain, currTask) => {
                           return promiseChain.then(currTask);
                        }, Promise.resolve());
                     })

                     // Final - pass result
                     .then(() =>
                        Promise.resolve({
                           object: objectResult,
                           treeItems: treeItems,
                        })
                     )
               );
               */
      }

      /**
       * @method aliasName
       * get new alias name
       *
       * @return {string}
       */
      aliasName() {
         return this.AB.uuid()
            .replace(/[^a-zA-Z0-9]+/g, "")
            .substring(0, 8);
      }

      /**
       * @method save
       * update settings of the current query and save to database
       *
       * @return {Promise}
       */
      save(selctedFields = null) {
         let ids = this.ids;
         let CurrentQuery = this.CurrentQuery;
         return new Promise((resolve, reject) => {
            var $tree = $$(ids.tree);

            var objectBase = CurrentQuery.objectBase();

            //
            // 1) Prepare current joins
            //
            let joins = {
               alias: "BASE_OBJECT",
               objectID: objectBase.id, // the base object of the join
               links: [],
            };

            let lookupFields = {};

            let $checkedItem = $tree
               .getChecked()
               .map((id) => $tree.getItem(id))
               .sort((a, b) => a.$level - b.$level);

            ($checkedItem || []).forEach(($treeItem) => {
               // let field = CurrentQuery.fields(f => f.id == $treeItem.fieldID, true)[0];
               // if (!field) return;

               // alias name
               let aliasName = $treeItem.alias;
               if (!aliasName) {
                  aliasName = this.aliasName();
                  $tree.updateItem($treeItem.id, {
                     alias: aliasName,
                  });
               }

               // pull the join type &&
               let joinType = "innerjoin";
               let $tabObject = $$(ids.tabObjects)
                  .getMultiview()
                  .getChildViews()
                  .filter((v) => v.config.id == aliasName)[0];
               if ($tabObject) {
                  let $joinType = $tabObject.queryView({
                     name: "joinType",
                  });
                  joinType = $joinType.getValue() || "innerjoin";
               }

               let links = joins.links, // default is links of base
                  newJoin = {
                     alias: aliasName,
                     fieldID: $treeItem.fieldID,
                     type: joinType,
                     links: [],
                  };

               if ($treeItem.$level > 1) {
                  // pull parent join
                  let parentId = $tree.getParentId($treeItem.id),
                     $parentItem = $tree.getItem(parentId);

                  links = lookupFields[$parentItem.alias].links;
               }

               // add new join into parent links
               links.push(newJoin);

               // cache join
               lookupFields[aliasName] = newJoin;
            });

            CurrentQuery.importJoins(joins);

            //
            // 2) Prepare current fields
            //
            if (selctedFields == null) {
               selctedFields = $$(ids.datatable)
                  .config.columns.map((col) => {
                     // an array of field ids

                     // pull object by alias
                     let object = CurrentQuery.objectByAlias(col.alias);
                     if (!object) return;

                     let field = object.fieldByID(col.fieldID);
                     if (!field) return;

                     // avoid add fields that not exists alias
                     if (
                        col.alias != "BASE_OBJECT" &&
                        CurrentQuery.links((l) => l.alias == col.alias).length <
                           1
                     )
                        return;

                     return {
                        alias: col.alias,
                        fieldID: col.fieldID,
                     };
                  })
                  .filter((col) => col != null);
            }

            CurrentQuery.importFields(selctedFields);

            //
            // 3) Prepare where condition
            //
            CurrentQuery.where = this.DataFilter.getValue();

            /** depth **/
            // CurrentQuery.objectWorkspace.depth = $$(ids.depth).getValue();

            //
            // 4) Prepare grouping
            //
            CurrentQuery.settings = {
               grouping: $$(ids.grouping).getValue(),
               hidePrefix: $$(ids.hidePrefix).getValue(),
            };

            //
            // Save to db
            //
            CurrentQuery.save()
               .then(() => {
                  return CurrentQuery.migrateCreate();
               })
               .then(() => {
                  // refresh data
                  this.refreshDataTable();
                  resolve();
               })
               .catch((err) => {
                  this.AB.notify.developer(err, {
                     context: `${ids.component}:save(): Error saving Query`,
                     query: CurrentQuery.toObj(),
                  });
                  reject(err);
               });
         });
      }

      checkObjectLink(objId, isChecked) {
         var $tree = $$(this.ids.tree);
         $tree.blockEvent(); // prevents endless loop

         var rootid = objId;
         if (isChecked) {
            // If check we want to check all of the parents as well
            while ($tree.getParentId(rootid)) {
               rootid = $tree.getParentId(rootid);
               if (rootid != objId) $tree.checkItem(rootid);
            }
         } else {
            // If uncheck we want to uncheck all of the child items as well.
            $tree.data.eachSubItem(rootid, function (item) {
               if (item.id != objId) $tree.uncheckItem(item.id);
            });
         }

         // call save to db
         this.save().then(() => {
            // update UI -- add new tab
            this.populateQueryWorkspace(this.CurrentQuery);
         });

         $tree.unblockEvent();
      }

      depthChange(/*newv, oldv*/) {
         // call save to db
         this.save().then(() => {
            this.populateQueryWorkspace(this.CurrentQuery);
         });
      }

      setSelectedFields(aliasName) {
         // *** Field double list ***
         let $viewDbl = $$(aliasName).queryView({ name: "fields" });
         if ($viewDbl) {
            let fieldIDs = this.CurrentQuery.fields(
               (f) => f.alias == aliasName,
               true
            ).map((f) => f.id);

            $viewDbl.setValue(fieldIDs);
         }
      }

      checkFields() {
         let ids = this.ids;
         // pull check fields
         var fields = [];
         var $viewMultiview = $$(ids.tabObjects).getMultiview();
         $viewMultiview.getChildViews().forEach(($viewTab) => {
            let $viewDbl = $viewTab.queryView({ name: "fields" });
            if ($viewDbl && $viewDbl.getValue()) {
               // pull an array of field's url
               let selectedFields = $viewDbl
                  .getValue()
                  .split(",")
                  .map((fieldID) => {
                     return {
                        alias: $viewTab.config.aliasName,
                        fieldID: fieldID,
                     };
                  });
               fields = fields.concat(selectedFields);
            }
         });

         // keep same order of fields
         var orderFieldUrls = $$(ids.datatable).config.columns.map(
            (col) => col.fieldID
         );
         fields.sort((a, b) => {
            var indexA = orderFieldUrls.indexOf(a.fieldID),
               indexB = orderFieldUrls.indexOf(b.fieldID);

            if (indexA < 0) indexA = 999;
            if (indexB < 0) indexB = 999;

            return indexA - indexB;
         });

         // CurrentQuery.importFields(fields);

         // call save to db
         this.save(fields).then(() => {
            // refresh filter
            this.refreshFilter();
         });
      }

      /**
       * @function templateField()
       *	return UI of the object tab
       * @param {JSON} option - {
       *           object: ABObject [option],
       *           field:  ABField [option],
       *           joinType: 'string',
       *           isTypeHidden: boolean
       *        }
       *
       * @return {JSON}
       */
      templateField(option) {
         if (option.object == null && option.field == null)
            throw new Error("Invalid params");

         var object = option.object
            ? option.object
            : this.CurrentQuery.objectByID(option.field.settings.linkObject);

         var fields = object
            .fields((f) => f.fieldSupportQuery(), true)
            .map((f) => {
               return {
                  id: f.id,
                  value: f.label,
               };
            });

         let fieldLabel = "";
         if (option.field) {
            fieldLabel = ` (${option.field.label})`;
         }
         var label = `${object.label}${fieldLabel}`;

         let aliasName = option.aliasName;

         return {
            header: label,
            body: {
               id: aliasName,
               aliasName: aliasName,
               type: "space",
               css: "bg-white",
               rows: [
                  {
                     view: "select",
                     name: "joinType",
                     label: L("join records by"),
                     labelWidth: 200,
                     placeholder: L("Choose a type of table join"),
                     hidden: option.isTypeHidden == true,
                     value: option.joinType || "innerjoin",
                     options: [
                        {
                           id: "innerjoin",
                           value: L(
                              "Returns records that have matching values in both tables (INNER JOIN)."
                           ),
                        },
                        {
                           id: "left",
                           value: L(
                              "Return all records from the left table, and the matched records from the right table (LEFT JOIN)."
                           ),
                        },
                        {
                           id: "right",
                           value: L(
                              "Return all records from the right table, and the matched records from the left table (RIGHT JOIN)."
                           ),
                        },
                        {
                           id: "fullouterjoin",
                           value: L(
                              "Return all records when there is a match in either left or right table (FULL JOIN)"
                           ),
                        },
                     ],
                     on: {
                        onChange: () => {
                           this.save();
                        },
                     },
                  },
                  {
                     view: "dbllist",
                     name: "fields",
                     list: {
                        height: 300,
                     },
                     labelLeft: L("Available Fields"),
                     labelRight: L("Included Fields"),
                     labelBottomLeft: L(
                        "Move these fields to the right to include in data set."
                     ),
                     labelBottomRight: L(
                        "These fields will display in your final data set."
                     ),
                     data: fields,
                     on: {
                        onChange: () => {
                           this.checkFields();
                        },
                     },
                  },
                  { fillspace: true },
               ],
            },
         };
      }

      refreshTree() {
         // return new Promise((resolve, reject) => {
         // Relationship Depth
         // $$(ids.depth).blockEvent(); // prevents endless loop

         // if (CurrentQuery.objectWorkspace.depth) {
         // 	$$(ids.depth).setValue(CurrentQuery.objectWorkspace.depth);
         // } else {
         // 	$$(ids.depth).setValue(5);
         // }

         // $$(ids.depth).unblockEvent();

         let fnCheckItem = (treeStore, object, links, parentId = 0) => {
            (links || []).forEach((link) => {
               // NOTE: query v1
               // if (link.objectURL) {
               //    object = CurrentApplication.urlResolve(
               //       link.objectURL
               //    );
               //    parentId = undefined;
               // } else {
               // parentId = parentId || 0;
               // }

               if (!object) return;

               let field = object.fieldByID(link.fieldID);
               if (!field) return;

               let findCond = {
                  fieldID: field.id,
               };
               if (parentId != null) {
                  findCond.$parent = parentId;
               }

               let $item = null;
               (treeStore.find(findCond) || []).forEach((item) => {
                  if (item.$parent) {
                     // select item who has parent is checked
                     let parentItem = treeStore.getItem(item.$parent);
                     if (parentItem && parentItem.checked) $item = item;
                  } else {
                     $item = item;
                  }
               });

               // update check status
               if ($item) {
                  treeStore.updateItem($item.id, {
                     alias: link.alias,
                     checked: true,
                     open: true,
                  });

                  let result = this.getChildItems(
                     field.settings.linkObject,
                     $item.id
                  );

                  $$(ids.tree).parse(result.treeItems);

                  fnCheckItem(treeStore, result.object, link.links, $item.id);
               }
            });
         };

         const objBase = this.CurrentQuery.objectBase();
         let links = this.CurrentQuery.joins().links || [];

         // set connected objects:
         let ids = this.ids;
         $$(ids.tree).clearAll();

         // show loading cursor
         $$(ids.tree).showProgress({ type: "icon" });

         // NOTE: render the tree component in Promise to prevent freeze UI.
         // populate tree store

         // Transition v2: testing w/o Promise here
         if (objBase) {
            let result = this.getChildItems(objBase.id);

            $$(ids.tree).parse(result.treeItems);

            fnCheckItem($$(ids.tree), objBase, links);

            // show loading cursor
            $$(ids.tree).hideProgress();
         }

         /* if (objBase) {
                     _logic
                        .getChildItems(objBase.id)
                        .catch(reject)
                        .then((result) => {
                           $$(ids.tree).parse(result.treeItems);

                           fnCheckItem($$(ids.tree), objBase, links);

                           // show loading cursor
                           $$(ids.tree).hideProgress({ type: "icon" });

                           resolve();
                        });
                  }
                  */
         // });
      }

      refreshFilter() {
         // this.DataFilter.applicationLoad(
         //    CurrentQuery ? CurrentQuery.application : null
         // );
         let CurrentQuery = this.CurrentQuery;
         this.DataFilter.fieldsLoad(
            CurrentQuery ? CurrentQuery.fields() : [],
            CurrentQuery
         );
         this.DataFilter.setValue(CurrentQuery.where);
      }

      refreshDataTable() {
         if (this.CurrentDatacollection == null) return;
         let CurrentQuery = this.CurrentQuery;
         if (!CurrentQuery) return;

         // console.log("Refresh data table *******");

         let DataTable = $$(this.ids.datatable);
         DataTable.clearAll();

         // set columns:
         var columns = CurrentQuery.columnHeaders(false, false);
         DataTable.refreshColumns(columns);

         let qCurrentView = CurrentQuery.workspaceViews.getCurrentView();

         this.CurrentDatacollection.clearAll();
         this.CurrentDatacollection.datasource = CurrentQuery;

         // Set filter and sort conditions
         this.CurrentDatacollection.fromValues({
            query: [CurrentQuery.toObj()],
            settings: {
               datasourceID: CurrentQuery.id,
               objectWorkspace: {
                  //// NOTE: the .where condition is already part of the
                  //// query definition, so we don't want to pass it again
                  //// as part of the workspace filter conditions.
                  // filterConditions: null,  // qCurrentView.filterConditions,
                  sortFields: qCurrentView.sortFields,
               },
            },
         });
         this.CurrentDatacollection.datasource = CurrentQuery;

         // Bind datatable view to data view
         this.CurrentDatacollection.unbind(DataTable);
         this.CurrentDatacollection.bind(DataTable);

         DataTable.showProgress({ type: "icon" });

         // set data:
         this.CurrentDatacollection.loadData(0, 50, () => {}).then(() => {
            this.CurrentDatacollection.bind(DataTable);
            // DataTable.hideProgress();
         });
         // CurrentQuery.model().findAll({ limit: 20, where: CurrentQuery.workspaceViews.getCurrentView().filterConditions, sort: CurrentQuery.workspaceViews.getCurrentView().sortFields })
         // 	.then((response) => {

         // 		DataTable.clearAll();

         // 		response.data.forEach((d) => {
         // 			DataTable.add(d);
         // 		})
         // 	})
         // 	.catch((err) => {
         // 		OP.Error.log('Error running Query:', { error: err, query: CurrentQuery });
         // 	});
      }

      getObject(objectId) {
         let objectLink = this.CurrentQuery.objectByID(objectId);
         if (objectLink) return objectLink;

         // Find object from our complete list of Objects
         objectLink = this.AB.objectByID(objectId);
         if (objectLink) return objectLink;
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }
   }
   return new UI_Work_Query_Workspace_Design(init_settings);
}
