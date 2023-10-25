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
import UI_Class from "./ui_class";
import FViewGridProperties from "./properties/workspaceViews/ABViewGrid";

export default function (AB, iBase, iSettings) {
   iBase = iBase || "ui_work_object_workspace_view_grid";
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   const ViewGridProperties = FViewGridProperties(AB);

   class UI_Work_Object_Workspace_View_Grid extends UIClass {
      constructor(idBase, settings = {}) {
         super(idBase);

         settings.isReadOnly = settings.isReadOnly ?? false;
         this.settings = settings;
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
      async init(AB) {
         this.AB = AB;
      }

      defaultSettings(data) {
         // Pull the ABViewGrid definitions
         var defaultGridSettings = ViewGridProperties.toSettings();
         defaultGridSettings.label = L(defaultGridSettings.name);
         var defaultGridView = this.AB.viewNewDetatched(defaultGridSettings);
         var defaultGrid = defaultGridView.toObj();
         defaultGrid.id = data?.id ?? AB.jobID();

         // For our ABDesigner Object workspace, these settings are
         // enabled:
         ["isEditable", "massUpdate", "allowDelete", "trackView"].forEach(
            (k) => {
               defaultGrid.settings[k] = 1;
            }
         );
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

      get $grid() {
         return this._currentComponent?.getDataTable();
      }

      ready() {
         this.ListComponent.ready();
      }

      async show(view) {
         await this.viewLoad(view);
         $$(this.ids.component).show();
         this.emit("show");
      }

      async viewLoad(view) {
         if (view.id == this.currentViewDef?.id) return;

         this.currentViewDef = view;

         this.currentView = this.AB.viewNewDetatched(view.component);
         this.currentView.warningsSilent = true;
         var component = this.currentView.component();

         // OK, a ABViewGrid component wont display the grid unless there
         // is a .datacollection or .dataviewID specified.
         // but calling .datacollectionLoad() doesn't actually load the data
         // unless there is the UI available.
         // So ... do this to register the datacollection
         component.datacollectionLoad(this.datacollection);

         var ui = component.ui();
         ui.id = this.ids.component;
         webix.ui(ui, $$(this.ids.component));

         let accessLevel = 2;
         if (
            this.settings.isReadOnly ||
            this.datacollection?.datasource?.isReadOnly
         ) {
            accessLevel = 1;
         }
         await component.init(this.AB, accessLevel);

         // Now call .datacollectionLoad() again to actually load the data.
         component.datacollectionLoad(this.datacollection);

         component.on("column.header.clicked", (node, EditField) => {
            this.emit("column.header.clicked", node, EditField);
         });

         component.on("object.track", (currentObject, id) => {
            this.emit("object.track", currentObject, id);
         });

         component.on("selection", () => {
            this.emit("selection");
         });

         component.on("selection.cleared", () => {
            this.emit("selection.cleared");
         });

         component.on("column.order", (fieldOrder) => {
            this.emit("column.order", fieldOrder);
         });

         this._currentComponent = component;
      }

      viewNew(data) {
         var defaults = this.defaultSettings(data);
         Object.keys(data).forEach((k) => {
            defaults[k] = data[k];
         });

         return defaults;
      }

      deleteSelected($view) {
         return this._currentComponent.toolbarDeleteSelected($view);
      }

      massUpdate($view) {
         return this._currentComponent.toolbarMassUpdate($view);
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
       * @param {string} frozenColumnID
       *        the ABField.columnName of the column that we have frozen.
       */
      refreshHeader(
         /* fields,*/ hiddenFields = [],
         filters,
         sorts,
         frozenColumnID
      ) {
         var object = this.CurrentObject;
         var columnHeaders = object.columnHeaders(true, true, [], [], []);

         // this calculation is done in the ABViewGridComponent.refreshHeader():
         // columnHeaders.forEach((h) => {
         //    if (hiddenFields.indexOf(h.id) > -1) {
         //       h.hidden = true;
         //    }
         // });
         if (this._currentComponent) {
            this._currentComponent.columnConfig(columnHeaders);

            this._currentComponent.settings.hiddenFields = hiddenFields;
            this._currentComponent.settings.filterConditions = filters;
            this._currentComponent.settings.sortFields = sorts;
            this._currentComponent.settings.frozenColumnID = frozenColumnID;

            this._currentComponent.refreshHeader(true);
         }
      }

      /**
       * @function rowAdd()
       *
       * add a new row to the data table
       */
      /*
      rowAdd() {
         // TODO: delete this, I think...
         debugger;
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
      */
   }
   return new UI_Work_Object_Workspace_View_Grid(iBase, iSettings);
}
