/*
 * ui_work_object_workspace_view_grid
 *
 * Display an instance of a Grid type of Workspace View in our area.
 *
 * This generic webix container will be given an instace of a workspace
 * view definition (Grid), and then create an instance of an ABViewGrid
 * widget to display.
 *
 */
import FViewGridProperties from "./properties/views/ABViewGrid";

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   const ViewGridProperties = FViewGridProperties(AB);

   class UI_Work_Object_Workspace_View_Grid extends AB.ClassUI {
      constructor() {
         super("ui_work_object_workspace_view_grid");

         this._mockApp = AB.applicationNew({});
         // {ABApplication}
         // Any ABViews we create are expected to be in relation to
         // an ABApplication, so we create a "mock" app for our
         // workspace views to use to display.

         this.objectID = null;
         // {string}
         // the current ABObject.id that is being displayed in our space.
      }

      // Our webix UI definition:
      ui() {
         var ids = this.ids;

         return {
            id: ids.component,
            rows: [
               {},
               {
                  view: "label",
                  label: "Impressive View -> Grid",
               },
               {},
            ],
         };
      }

      // Our init() function for setting up our UI
      async init(AB, options) {
         this.AB = AB;
      }

      defaultSettings() {
         // Pull the ABViewGrid definitions
         var defaultGridSettings = ViewGridProperties.toSettings();
         defaultGridSettings.label = L(defaultGridSettings.name);
         var defaultGridView = this._mockApp.viewNew(
            defaultGridSettings,
            this._mockApp
         );
         var defaultGrid = defaultGridView.toObj();
         defaultGrid.id = AB.jobID();

         // For our ABDesigner Object workspace, these settings are
         // enabled:
         ["isEditable", "massUpdate", "allowDelete"].forEach((k) => {
            defaultGrid.settings[k] = 1;
         });
         defaultGrid.settings.padding = 0;
         defaultGrid.settings.showToolbar = 0;
         defaultGrid.settings.gridFilter = {
            filterOption: 0,
            isGlobalToolbar: 0,
         };

         return {
            id: defaultGrid.id,
            isDefaultView: false,
            type: defaultGrid.type,
            icon: defaultGrid.icon,

            name: "Default Grid",
            sortFields: [], // array of columns with their sort configurations
            filterConditions: [], // array of filters to apply to the data table
            frozenColumnID: "", // id of column you want to stop freezing
            hiddenFields: [], // array of [ids] to add hidden:true to

            component: defaultGrid,
         };
      }

      getColumnIndex(id) {
         return this._currentComponent.getColumnIndex(id);
      }

      datacollectionLoad(dc) {
         this.datacollection = dc;
      }

      objectLoad(objectID) {
         this.objectID = objectID;
      }

      ready() {
         this.ListComponent.ready();
      }

      show(view) {
         this.viewLoad(view);
         $$(this.ids.component).show();
      }

      viewLoad(view) {
         this.currentViewDef = view;
         this.currentView = this._mockApp.viewNew(
            view.component,
            this._mockApp,
            null
         );
         var component = this.currentView.componentV2();

         // OK, a ABViewGrid component wont display the grid unless there
         // is a .datacollection or .dataviewID specified.
         // but calling .datacollectionLoad() doesn't actually load the data
         // unless there is the UI available.
         // So ... do this to register the datacollection
         component.datacollectionLoad(this.datacollection);

         var ui = component.ui();
         ui.id = this.ids.component;
         webix.ui(ui, $$(this.ids.component));
         component.init(this.AB);

         // Now call .datacollectionLoad() again to actually load the data.
         component.datacollectionLoad(this.datacollection);

         component.on("column.header.clicked", (node, EditField) => {
            this.emit("column.header.clicked", node, EditField);
         });

         this._currentComponent = component;
      }

      /**
       * @method refreshHeader()
       * This is called everytime a change in the ABObject happens and the
       * current component needs to refresh the display.  So when a Field is
       * Added or Removed, the display of the component changes.
       *
       * the ui_work_object_workspace keeps track of what the USER has set
       * for the hiddenFields, frozenColumns and related display options.
       *
       * Those are passed in, and we are responsible for converting that
       * to the component settings.
       * @param {array} fields
       *        An array of ABField instances that are in the current object.
       * @param {array} hiddenFields
       *        An array of the ABfield.columnName(s) that are to be hidden.
       *        These are what are matched with the {columnHeader}.id
       * @param {array} filters
       *        The current filter settings.
       * @param {array} sorts
       *        The current sort settings.
       * @param {array} frozenColumns
       *        An array of the ABField.id of the frozen columns.
       */
      refreshHeader(fields, hiddenFields, filters, sorts, frozenColumns) {
         var object = this.AB.objectByID(this.objectID);
         var columnHeaders = object.columnHeaders(true, true, [], [], []);
         columnHeaders.forEach((h) => {
            if (hiddenFields.indexOf(h.id) > -1) {
               h.hidden = true;
            }
         });

         this._currentComponent.columnConfig(columnHeaders);
         this._currentComponent.refreshHeader(true);
      }

      /**
       * @function rowAdd()
       *
       * add a new row to the data table
       */
      rowAdd() {
         if (!settings.isEditable) return;

         var emptyObj = CurrentObject.defaultValues();
         CurrentObject.model()
            .create(emptyObj)
            .then((obj) => {
               if (obj == null) return;

               // var DataTable = $$(ids.component);
               // if (!DataTable.exists(obj.id))
               //     DataTable.add(obj, 0);
               if (
                  CurrentDatacollection &&
                  CurrentDatacollection.__dataCollection &&
                  !CurrentDatacollection.__dataCollection.exists(obj.id)
               )
                  CurrentDatacollection.__dataCollection.add(obj, 0);
            });
      }
   }
   return new UI_Work_Object_Workspace_View_Grid();
}
