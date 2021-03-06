/*
 * ui_work_object_list_newObject_csv
 *
 * Display the form for import CSV file to a object.
 *
 */
import UI_Class from "./ui_class";
import CSVImporter from "../../utils/CSVImporter.js";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();
   let uiSettings = AB.Config.uiSettings();

   class UI_Work_Object_List_NewObject_Csv extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_csv", {
            // component: base,

            form: "",
            uploadFileList: "",
            separatedBy: "",
            headerOnFirstLine: "",
            columnList: "",
            importButton: "",
         });

         this._csvImporter = new CSVImporter(AB);
      }

      ui() {
         let ids = this.ids;

         // Our webix UI definition:
         return {
            id: ids.component,
            header: L("Import CSV"),
            body: {
               view: "form",
               id: ids.form,
               width: 400,
               rules: {},
               elements: [
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Object name"),
                     labelWidth: uiSettings.labelWidthMedium,
                  },
                  {
                     view: "uploader",
                     name: "csvFile",
                     value: L("Choose a CSV file"),
                     accept: "text/csv",
                     multiple: false,
                     autosend: false,
                     link: ids.uploadFileList,
                     on: {
                        onBeforeFileAdd: (fileInfo) => {
                           return this.loadCsvFile(fileInfo);
                        },
                     },
                  },
                  {
                     id: ids.uploadFileList,
                     name: "uploadedFile",
                     view: "list",
                     type: "uploader",
                     autoheight: true,
                     borderless: true,
                     onClick: {
                        webix_remove_upload: (e, id /*, trg */) => {
                           this.removeCsvFile(id);
                        },
                     },
                  },
                  {
                     id: ids.separatedBy,
                     view: "richselect",
                     name: "separatedBy",
                     label: L("Separated by"),
                     labelWidth: uiSettings.labelWidthXLarge,
                     options: this._csvImporter.getSeparateItems(),
                     value: ",",
                     on: {
                        onChange: () => {
                           this.populateColumnList();
                        },
                     },
                  },
                  {
                     id: ids.headerOnFirstLine,
                     view: "checkbox",
                     name: "headerOnFirstLine",
                     labelRight: L("Header on first line"),
                     labelWidth: 0,
                     disabled: true,
                     value: true,
                     on: {
                        onChange: (/* newVal, oldVal */) => {
                           this.populateColumnList();
                        },
                     },
                  },
                  {
                     type: "space",
                     rows: [
                        {
                           view: "scrollview",
                           height: 260,
                           minHeight: 260,
                           maxHeight: 260,
                           body: {
                              id: ids.columnList,
                              disabled: true,
                              rows: [],
                           },
                        },
                     ],
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           name: "cancel",
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.cancel();
                           },
                        },
                        {
                           view: "button",
                           name: "import",
                           id: ids.importButton,
                           value: L("Import"),
                           css: "webix_primary",
                           disabled: true,
                           autowidth: true,
                           type: "form",
                           click: () => {
                              this.import();
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.allFields = this.AB.Class.ABFieldManager.allFields();

         this._dataRows = [];

         this.$form = $$(this.ids.form);
         this.$uploadFileList = $$(this.ids.uploadFileList);
         this.$separatedBy = $$(this.ids.separatedBy);
         this.$headerOnFirstLine = $$(this.ids.headerOnFirstLine);
         this.$columnList = $$(this.ids.columnList);
         this.$importButton = $$(this.ids.importButton);

         // "save.error" is triggered by the ui_work_object_list_newObject
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_object_list_newObject
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      async loadCsvFile(fileInfo) {
         if (!this._csvImporter.validateFile(fileInfo)) {
            webix.alert({
               title: L("This file extension is not allowed"),
               text: L("Please only upload CSV files"),
               ok: L("OK"),
            });

            return false;
         }

         // show loading cursor
         if (this.$form.showProgress) this.$form.showProgress({ type: "icon" });

         // read CSV file
         let separatedBy = this.$separatedBy.getValue();
         this._dataRows = await this._csvImporter.getDataRows(
            fileInfo,
            separatedBy
         );

         this.$headerOnFirstLine.enable();
         this.$columnList.enable();
         this.$importButton.enable();

         this.populateColumnList();

         if (this.$form.hideProgress) this.$form.hideProgress();

         return true;
      }

      removeCsvFile(fileId) {
         this.$uploadFileList.remove(fileId);
         this.formClear();
         return true;
      }

      populateColumnList() {
         webix.ui([], this.$columnList);

         var firstLine = this._dataRows[0];
         if (firstLine == null) return;

         var columnList = [];

         if (this.$headerOnFirstLine.getValue()) {
            columnList = firstLine.map((colName, index) => {
               return {
                  include: true,
                  columnName: colName,
                  dataType: this._csvImporter.getGuessDataType(
                     this._dataRows,
                     index
                  ),
               };
            });
         } else {
            for (var i = 0; i < firstLine.length; i++) {
               columnList.push({
                  include: true,
                  columnName: "Field " + (i + 1),
                  dataType: this._csvImporter.getGuessDataType(
                     this._dataRows,
                     i
                  ),
               });
            }
         }

         // Add dynamic columns UI
         let uiColumns = [];
         columnList.forEach((col) => {
            uiColumns.push({
               height: 40,
               cols: [
                  {
                     view: "checkbox",
                     value: col.include,
                     width: 30,
                  },
                  {
                     view: "text",
                     value: col.columnName,
                     width: uiSettings.labelWidthXLarge,
                  },
                  {
                     view: "select",
                     value: col.dataType,
                     options: [
                        {
                           id: "string",
                           value: this.allFields
                              .filter((f) => f.key == "string")[0]
                              .defaults().menuName,
                        },
                        {
                           id: "LongText",
                           value: this.allFields
                              .filter((f) => f.key == "LongText")[0]
                              .defaults().menuName,
                        },
                        {
                           id: "number",
                           value: this.allFields
                              .filter((f) => f.key == "number")[0]
                              .defaults().menuName,
                        },
                        {
                           id: "date",
                           value: this.allFields
                              .filter((f) => f.key == "date")[0]
                              .defaults().menuName,
                        },
                        {
                           id: "boolean",
                           value: this.allFields
                              .filter((f) => f.key == "boolean")[0]
                              .defaults().menuName,
                        },
                     ],
                     width: 120,
                  },
               ],
            });
         });

         webix.ui(uiColumns, $$(this.$columnList));
      }

      import() {
         this.$importButton.disable();

         if (!this.$form.validate()) {
            this.$importButton.enable();
            return false;
         }

         // Validate required column names
         let columnViews = $$(this.$columnList).getChildViews();
         var emptyColNames = columnViews.filter((cView) => {
            return (
               cView.queryView({ view: "checkbox" }).getValue() &&
               cView.queryView({ view: "text" }).getValue().trim().length == 0
            );
         });
         if (emptyColNames.length > 0) {
            webix.alert({
               title: L("Column name is required"),
               text: L("Please enter column name"),
               ok: L("OK"),
            });

            this.$importButton.enable();
            return false;
         }

         // Validate reserve column names
         var reservedColNames = columnViews.filter((cView) => {
            return (
               cView.queryView({ view: "checkbox" }).getValue() &&
               this.allFields[0].reservedNames.indexOf(
                  cView
                     .queryView({ view: "text" })
                     .getValue()
                     .trim()
                     .toLowerCase()
               ) > -1
            );
         });
         if (reservedColNames.length > 0) {
            webix.alert({
               title: L("Column name is invalid"),
               text: L(
                  "Please enter column name that does not match [{0}]",
                  this.allFields[0].reservedNames.join(", ")
               ),
               ok: L("OK"),
            });

            this.$importButton.enable();
            return false;
         }

         // create new object
         let newObjAttr = {
            primaryColumnName: "uuid", // set uuid to be primary column
            name: this.$form.getValues()["name"],
         };

         // now send data back to be added:
         this.emit("save", newObjAttr);
      }

      onSuccess(newObj) {
         let subTasks = Promise.resolve();

         // add new columns to object
         let columnViews = $$(this.$columnList).getChildViews();
         columnViews.forEach((cView, index) => {
            let include = cView.queryView({ view: "checkbox" }).getValue();
            if (!include) return;

            let columnName = cView.queryView({ view: "text" }).getValue();
            let dataType = cView.queryView({ view: "select" }).getValue();

            let newField = {
               // id: AB.uuid(),
               columnName: columnName,
               label: columnName,
               key: dataType,
               settings: {
                  showIcon: 1,
                  weight: index,
               },
            };

            switch (dataType) {
               case "string":
               case "LongText":
                  newField.settings.supportMultilingual = 0;
                  break;
            }

            let field = newObj.fieldNew(newField);
            subTasks = subTasks.then(() => field.save());
            // .then(() => field.migrateCreate());
         });

         // add rows to Server
         var objModel = newObj.model();

         // Add each records sequentially
         this._dataRows.forEach((data, index) => {
            subTasks = subTasks.then(() => {
               if (this.$headerOnFirstLine.getValue() && index == 0)
                  return Promise.resolve();

               var rowData = {};
               var colValues = data;

               newObj.fields().forEach((col) => {
                  if (colValues[col.settings.weight] != null)
                     rowData[col.columnName] = colValues[col.settings.weight];
               });

               // Add row data
               return objModel.create(rowData);
            });
         });

         // if there was no error, clear the form for the next
         // entry:
         return subTasks
            .then(() => {
               this.formClear();
               this.$importButton.enable();

               return Promise.resolve();
            })
            .catch((err) => {
               AB.notify.developer(err, {
                  message: "Error import data rows from CSV",
               });
            });
      }

      onError(err) {
         // if this was our Validation() object:
         if (err) {
            if (err.updateForm) err.updateForm(this.$form);

            // get notified if there was an error saving.
            this.$importButton.enable();
         }
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         this._dataRows = [];

         this.$form.clearValidation();
         this.$form.clear();
         this.$separatedBy.setValue(",");

         webix.ui([], $$(this.$columnList));
         this.$uploadFileList.clearAll();

         this.$headerOnFirstLine.disable();
         this.$columnList.disable();
         this.$importButton.disable();
      }
   }
   return new UI_Work_Object_List_NewObject_Csv();
}
