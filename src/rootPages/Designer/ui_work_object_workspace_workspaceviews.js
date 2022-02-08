// ABObjectWorkspaceViewCollection.js
//
// Manages the settings for a collection of views in the AppBuilder Object
// Workspace
//
// Within the workspace, we offer the ability to view the current ABObject in
// different ways: Grid, KanBan, Gantt
//
// We can define multiple views for each method, and each view will allow you
// to customize certain view settings: Hidden Fields, Filters, Sorts, Frozen
// columns, etc...
//
//
import UI_Class from "./ui_class";
import WorkspaceDatatable from "./ui_work_object_workspace_view_grid";
import WorkspaceKanban from "./ui_work_object_workspace_view_kanban";

import FViewGanttProperties from "./properties/workspaceViews/ABViewGantt";
import FViewGridProperties from "./properties/workspaceViews/ABViewGrid";
import FViewKanbanProperties from "./properties/workspaceViews/ABViewKanban";

export default function (AB) {
   const UIClass = UI_Class(AB);
   // var L = UIClass.L();

   const Datatable = WorkspaceDatatable(AB);
   const Kanban = WorkspaceKanban(AB);

   // Gather a list of the various View Properties
   const ViewGanttProperties = FViewGanttProperties(AB);
   const ViewGridProperties = FViewGridProperties(AB);
   const ViewKanbanProperties = FViewKanbanProperties(AB);

   var hashViewProperties = {};
   hashViewProperties[ViewGanttProperties.type()] = ViewGanttProperties;
   hashViewProperties[ViewGridProperties.type()] = ViewGridProperties;
   hashViewProperties[ViewKanbanProperties.type()] = ViewKanbanProperties;

   var hashViewComponents = {};
   hashViewComponents[ViewGridProperties.type()] = Datatable;
   hashViewComponents[ViewKanbanProperties.type()] = Kanban;

   const defaultAttributes = {
      currentViewID: undefined,
      list: [],
   };

   class ABObjectWorkspaceViewCollection extends UIClass {
      constructor() {
         super("ui_work_object_workspace_workspaceviews");

         this.AB = AB;
         // {ABFactory}

         this._settings = null;
         // {hash} { ABObject.id  : {collection} }
         // The data structure we are using to manage the different
         // Views for each of our ABObjects.

         this._mockApp = AB.applicationNew({});
         // {ABApplication}
         // Any ABViews we create are expected to be in relation to
         // an ABApplication, so we create a "mock" app for our
         // workspace views to use to display.
      }

      async init(AB) {
         this.AB = AB;

         // load in the stored View data.
         this._settings = (await this.AB.Storage.get("workspaceviews")) || {};
      }

      objectLoad(object) {
         if (this.CurrentObjectID) {
            // save current data:
            this._settings[this.CurrentObjectID] = this.toObj();
         }
         super.objectLoad(object);

         this.fromObj(this._settings[this.CurrentObjectID]);
      }

      /**
       * @method fromObj
       * take our persisted data, and properly load it
       * into this object instance.
       * @param {json} data  the persisted data
       */
      fromObj(data) {
         data = data || AB.cloneDeep(defaultAttributes);

         if ((data?.list ?? []).length === 0) {
            // We should always have at least one default grid view. So if this list
            // is empty we can assume we're 'upgrading' from the old single-view workspace...

            var defaultGrid = Datatable.defaultSettings();
            defaultGrid.isDefaultView = true;
            data.list.unshift(defaultGrid);
         }

         this.importViews(data);

         this.currentViewID = data.currentViewID;
         if (!this.currentViewID) {
            this.currentViewID = this.list()[0].id;
         }
      }

      /**
       * @method toObj()
       *
       * properly compile the current state of this ABApplication instance
       * into the values needed for saving to the DB.
       *
       * Most of the instance data is stored in .json field, so be sure to
       * update that from all the current values of our child fields.
       *
       * @return {json}
       */
      toObj() {
         return {
            currentViewID: this.currentViewID,
            list: this._views,
         };
      }

      list(fn = () => true) {
         return this._views.filter(fn);
      }

      importViews(viewSettings) {
         this._views = [];
         viewSettings.list.forEach((view) => {
            this.viewAdd(view, false);
         });
      }

      // exportViews() {
      //    var views = [];
      //    this._views.forEach((view) => {
      //       views.push(view.toObj());
      //    });

      //    return views;
      // }

      getCurrentView() {
         return this._views.find((v) => v.id == this.currentViewID);
      }

      setCurrentView(viewID) {
         this.currentViewID = viewID;
         this._currentView = this.getCurrentView();
      }

      async viewAdd(view, save = true) {
         // var newView = new hashViewProperties[view.type](view, this);
         this._views.push(view);
         if (save) {
            await this.save();
         }
         return view;
      }

      async viewNew(data) {
         var ViewType = hashViewComponents[data.type];
         if (!ViewType) return;

         var newView = ViewType.viewNew(data);
         await this.viewAdd(newView);
         return newView;
      }

      viewRemove(view) {
         var indexToRemove = this._views.indexOf(view);
         this._views.splice(indexToRemove, 1);
         if (view.id === this.currentViewID) {
            this.currentViewID = this._views[0].id;
         }
         this.save();
      }

      /**
       * @method save()
       * Persist our settings to local storage.
       * @return {Promise}
       */
      async save() {
         this._settings[this.CurrentObjectID] = this.toObj();
         await this.AB.Storage.set("workspaceviews", this._settings);
      }

      async viewUpdate(view) {
         var indexToReplace = this._views.indexOf(view);
         this._views.splice(indexToReplace, 1, view);

         await this.save();
      }

      ///
      /// CurrentView Operations
      ///
      get filterConditions() {
         return this._currentView.filterConditions;
      }

      set filterConditions(cond) {
         this._currentView.filterConditions = cond;
      }

      get frozenColumnID() {
         return this._currentView.frozenColumnID;
      }

      set frozenColumnID(id) {
         this._currentView.frozenColumnID = id;
      }

      get hiddenFields() {
         return this._currentView.hiddenFields || [];
      }

      set hiddenFields(fields) {
         this._currentView.hiddenFields = fields;
      }

      get sortFields() {
         return this._currentView.sortFields;
      }

      set sortFields(fields = []) {
         this._currentView.sortFields = fields;
      }
   }
   return new ABObjectWorkspaceViewCollection();
}
