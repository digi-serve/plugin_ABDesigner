// ABObjectWorkspaceViewCollection.js
//
// Manages the settings for a collection of views in the AppBuilder Object Workspace
import ABWorkspaceDatatable from "./ui_work_object_workspace_view_grid";

import FViewGanttProperties from "./properties/views/ABViewGantt";
import FViewGridProperties from "./properties/views/ABViewGrid";
import FViewKanbanProperties from "./properties/views/ABViewKanban";

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   const Datatable = ABWorkspaceDatatable(AB);

   // Gather a list of the various View Properties
   const ViewGanttProperties = FViewGanttProperties(AB);
   const ViewGridProperties = FViewGridProperties(AB);
   const ViewKanbanProperties = FViewKanbanProperties(AB);

   var hashViews = {};
   hashViews[ViewGanttProperties.type()] = ViewGanttProperties;
   hashViews[ViewGridProperties.type()] = ViewGridProperties;
   hashViews[ViewKanbanProperties.type()] = ViewKanbanProperties;

   const defaultAttributes = {
      currentViewID: undefined,
      list: [],
   };

   class ABObjectWorkspaceViewCollection {
      constructor() {
         this.AB = AB;
         // {ABFactory}

         this.objectID = null;
         // {string}
         // The current ABObject.id we are providing workspace views for

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

      objectLoad(objectID) {
         if (this.objectID) {
            // save current data:
            this._settings[this.objectID] = this.toObj();
         }
         this.objectID = objectID;

         this.fromObj(this._settings[objectID]);
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
            this.addView(view, false);
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

      addView(view, save = true) {
         // var newView = new hashViews[view.type](view, this);
         this._views.push(view);
         if (save) {
            this.save();
         }
         return view;
      }

      removeView(view) {
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
         await this.AB.Storage.set("workspaceviews", this._settings);
      }

      updateView(viewToUpdate, view) {
         var newView;
         if (view.type === viewToUpdate.type) {
            viewToUpdate.update(view);
            newView = viewToUpdate;
         } else {
            newView = new hashViews[view.type](view, this);
            var indexToRemove = this._views.indexOf(viewToUpdate);
            this._views.splice(indexToRemove, 1, newView);
            if (this.currentViewID === viewToUpdate.id) {
               this.currentViewID = newView.id;
            }
         }
         this.save();
         return newView;
      }

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
