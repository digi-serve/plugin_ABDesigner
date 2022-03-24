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

export default function (AB, ibase, isettings) {
   ibase = ibase || "ui_work_datacollection_workspace_workspaceviews";
   const UIClass = UI_Class(AB);
   // var L = UIClass.L();

   const Datatable = WorkspaceDatatable(AB, `${ibase}_grid`, isettings);

   const hashViewComponentGrid = Datatable;

   const defaultAttributes = {
      currentViewID: undefined,
      list: [],
   };

   class ABObjectWorkspaceViewCollection extends UIClass {
      constructor(base) {
         super(base);

         this.AB = AB;
         // {ABFactory}

         this._settings = null;
         // {hash} { ABDataCollection.id  : {collection} }
         // The data structure we are using to manage the different
         // Views for each of our ABDataCollections.
      }

      async init(AB) {
         this.AB = AB;

         hashViewComponentGrid.init(AB);

         // load in the stored View data.
         this._settings = (await this.AB.Storage.get("workspaceviews")) || {};
      }

      datacollectionLoad(dc) {
         if (this.CurrentDatacollectionID) {
            // save current data:
            this._settings[this.CurrentDatacollectionID] = this.toObj();
         }
         super.datacollectionLoad(dc);

         hashViewComponentGrid.datacollectionLoad(dc);

         this.fromObj(this._settings[this.CurrentDatacollectionID]);
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

            const defaultGrid = Datatable.defaultSettings();
            defaultGrid.isDefaultView = true;
            data.list.unshift(defaultGrid);
         } else {
            // For our ABDesigner Datacollection workspace, these settings are
            // enabled:
            for (let i = 0; i < data.list.length; i++) {
               for (const key in isettings)
                  if (
                     Object.prototype.hasOwnProperty.call(
                        data.list[i].component.settings,
                        key
                     )
                  )
                     data.list[i].component.settings[key] = isettings[key];
            }
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

      /**
       * @method save()
       * Persist our settings to local storage.
       * @return {Promise}
       */
      async save() {
         this._settings[this.CurrentDatacollectionID] = this.toObj();
         await this.AB.Storage.set("workspaceviews", this._settings);
      }
   }
   return new ABObjectWorkspaceViewCollection(ibase);
}
