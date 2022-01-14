/*
 * ab_work_object_workspace_popupExport
 *
 * Manage the Export object to files popup.
 *
 */

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_PopupExport extends AB.ClassUI {
      constructor() {
         var idBase = "ui_work_object_workspace_popupExport";

         super({
            popupExport: `${idBase}_popupExport`,
            list: `${idBase}_popupExport_list`,
         });

         this.CurrentObjectID = null;
         // {string}
         // the ABObject.id of the object we are working with.

         this.DatacollectionID = null;
         // {string}
         // the ABDataCollection.id of the DC we are working with.

         this.grid = null;
         // {webix.grid}
         // the webix grid UI containing our data.

         this.filename = null;
         // {string}
         // the name of the exported file

         this.hiddenFields = [];
         // {array} [ABField.columnName, ... ]
         // an array of the columnNames of the hidden fields.
      }

      ui() {
         var self = this;

         // webix UI definition:
         return {
            view: "popup",
            id: this.ids.popupExport,
            width: 160,
            height: 180,
            select: false,
            hidden: true,
            body: {
               id: this.ids.list,
               view: "list",
               data: [
                  { name: "CSV", icon: "file-excel-o" },
                  { name: "Excel", icon: "file-excel-o" },
                  { name: "PDF", icon: "file-pdf-o" },
                  { name: "PNG", icon: "file-image-o" },
               ],
               template:
                  "<div><i class='fa fa-#icon# webix_icon_btn' aria-hidden='true'></i> #name#</div>",
               on: {
                  onItemClick: function (id /*, e, node */) {
                     var component = this.getItem(id);
                     self.export(component.name);
                  },
               },
            },
         };
      }

      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
      }

      /**
       * @method CurrentObject()
       * A helper to return the current ABObject we are working with.
       * @return {ABObject}
       */
      get CurrentObject() {
         return this.AB.objectByID(this.CurrentObjectID);
      }

      /**
       * @method Datacollection()
       * A helper to return the current ABObject we are working with.
       * @return {ABObject}
       */
      get Datacollection() {
         return this.AB.datacollectionByID(this.DatacollectionID);
      }

      objectLoad(object) {
         this.CurrentObjectID = object.id;
      }

      dataCollectionLoad(dc) {
         this.DatacollectionID = dc.id;
      }

      /**
       * @method setHiddenFields
       * @param {array} fields - an array of string
       */
      setHiddenFields(fields) {
         this.hiddenFields = fields || [];
      }

      setFilename(filename) {
         this.filename = filename;
      }

      setGridComponent($grid) {
         this.grid = $grid;
      }

      /**
       * @function show()
       * Show this component.
       * @param {webix.view} $view
       *        the webix.$view to hover the popup around.
       */
      show($view) {
         $$(this.ids.popupExport).show($view);
      }

      /**
       * @method export()
       * triggers the process of exporting the data.
       * @param {string} name
       *        The type of export we are performing.
       *        ["CSV", "Excel", "PDV", "PNG"]
       */
      async export(name) {
         let fnExport;

         let columns = {};

         let dc = this.Datacollection;
         if (
            dc &&
            (!dc.settings.loadAll ||
               dc.dataStatus == dc.dataStatusFlag.notInitial)
         ) {
            // Load all data
            await dc.reloadData(0, null);
            dc.settings.loadAll = true;
         }

         // client filter data
         // template of report
         var _currentObject = this.CurrentObject;
         if (_currentObject) {
            _currentObject.fields().forEach((f) => {
               // hidden fields
               if (this.hiddenFields.indexOf(f.columnName) > -1) return;

               columns[f.columnName] = {
                  template: (rowData) => {
                     return f.format(rowData);
                  },
               };
            });
         }

         var _grid = this.grid;
         if (!_grid) {
            return;
         }

         var _filename = this.filename;
         var _label = _currentObject ? _currentObject.label : null;

         switch (name) {
            case "CSV":
               webix.csv.delimiter.cols = ",";

               fnExport = webix.toCSV(_grid, {
                  _filename: this.filename || _label,
                  columns: columns,
               });
               break;
            case "Excel":
               fnExport = webix.toExcel(_grid, {
                  filename: _filename || _label,
                  name: _filename || _label,
                  columns: columns,
                  filterHTML: true,
               });
               break;
            case "PDF":
               fnExport = webix.toPDF(_grid, {
                  filename: _filename || _label,
                  filterHTML: true,
               });
               break;
            case "PNG":
               fnExport = webix.toPNG(_grid, {
                  filename: _filename || _label,
               });
               break;
         }

         try {
            await fnExport;
            $$(this.ids.popupExport).hide();
         } catch (err) {
            this.AB.notify.developer(err, {
               message: `ui_work_object_workspace_popupExport:export(): could not export: ${name}`,
            });
         }
      }
   }

   return new UI_Work_Object_PopupExport();
}
