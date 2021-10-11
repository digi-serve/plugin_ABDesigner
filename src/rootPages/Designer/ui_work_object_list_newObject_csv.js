/*
 * ab_work_object_list_newObject_csv
 *
 * Display the form for import CSV file to a object.
 *
 */

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_List_NewObject_Csv extends AB.ClassUI {
      constructor() {
         var base = "ui_work_object_list_newObject_csv";
         super({
            component: base,

            form: `${base}_csvForm`,
            uploadFileList: `${base}_uploadFileList`,
            separatedBy: `${base}_separatedBy`,
            headerOnFirstLine: `${base}_headerOnFirstLine`,
            columnList: `${base}_columnList`,
            importButton: `${base}_importButton`,
         });
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
                     labelWidth: 70,
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
                        webix_remove_upload: (e, id, trg) => {
                           this.removeCsvFile(id);
                        },
                     },
                  },
                  {
                     id: ids.separatedBy,
                     view: "richselect",
                     name: "separatedBy",
                     label: L("Separated by"),
                     labelWidth: 140,
                     options: csvImporter.getSeparateItems(),
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
                        onChange: (newVal, oldVal) => {
                           this.populateColumnList();
                        },
                     },
                  },
                  {
                     id: ids.columnList,
                     view: "list",
                     datatype: "json",
                     multiselect: false,
                     select: false,
                     disabled: true,
                     height: 260,
                     minHeight: 260,
                     maxHeight: 260,
                     type: {
                        height: 40,
                        include: function (obj, common) {
                           return {
                              view: "checkbox",
                              width: 30,
                           };
                        },
                        columnName: function (obj, common) {
                           return {
                              view: "text",
                              width: 170,
                           };
                        },
                        dataType: function (obj, common) {
                           return {
                              view: "select",
                              options: [
                                 {
                                    id: "string",
                                    value: ABFieldString.defaults().menuName,
                                 },
                                 {
                                    id: "LongText",
                                    value: ABFieldLongText.defaults().menuName,
                                 },
                                 {
                                    id: "number",
                                    value: ABFieldNumber.defaults().menuName,
                                 },
                                 {
                                    id: "date",
                                    value: ABFieldDate.defaults().menuName,
                                 },
                                 {
                                    id: "boolean",
                                    value: ABFieldBoolean.defaults().menuName,
                                 },
                              ],
                              width: 120,
                           };
                        },
                     },
                     template:
                        '<span style="float: left;">{common.include()}</span>' +
                        '<span style="float: left;">{common.columnName()}</span>' +
                        '<span style="float: left;">{common.dataType()}</span>',
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
         if (!csvImporter.validateFile(fileInfo)) {
            webix.alert({
               title: L("This file extension is disallow"),
               text: L("Please only upload CSV file"),
               ok: L("OK"),
            });

            return false;
         }

         // show loading cursor
         if (this.$form.showProgress) this.$form.showProgress({ type: "icon" });

         // read CSV file
         let separatedBy = this.$separatedBy.getValue();
         let data = await csvImporter.getDataRows(fileInfo, separatedBy);

         this._dataRows = data;

         this.$headerOnFirstLine.enable();
         this.$columnList.enable();
         this.$importButton.enable();

         this.populateColumnList();

         if (this.$form.hideProgress) this.$form.hideProgress();

         return true;
      }

      removeCsvFile(fileId) {
         this.uploadFileList.remove(fileId);
         this.formClear();
         return true;
      }

      populateColumnList() {
         this.$columnList.clearAll();

         var firstLine = this._dataRows[0];
         if (firstLine == null) return;

         var columnList = [];

         if (this.$headerOnFirstLine.getValue()) {
            columnList = firstLine.map(function (colName, index) {
               return {
                  include: true,
                  columnName: colName,
                  dataType: csvImporter.getGuessDataType(this._dataRows, index),
               };
            });
         } else {
            for (var i = 0; i < firstLine.length; i++) {
               columnList.push({
                  include: true,
                  columnName: "Field " + (i + 1),
                  dataType: csvImporter.getGuessDataType(this._dataRows, i),
               });
            }
         }

         this.$columnList.parse(columnList);
      }

      import() {
         this.$importButton.disable();

         if (!this.$form.validate()) {
            this.$importButton.enable();
            return false;
         }

         // Validate required column names
         let emptyColNames = this.$columnList.data.find(
            (col) => col.include && col.columnName.trim().length == 0
         );
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
         var reservedColNames = this.$columnList.data.find((col) => {
            return (
               col.include &&
               ABField.reservedNames.indexOf(
                  col.columnName.trim().toLowerCase()
               ) > -1
            );
         });
         if (reservedColNames.length > 0) {
            webix.alert({
               title: L("Column name is invalid"),
               text: L(
                  "Please enter column name does not match [{0}]",
                  ABField.reservedNames.join(", ")
               ),
               ok: L("OK"),
            });

            this.$importButton.enable();
            return false;
         }

         // create new object
         var newObjAttr = {
            primaryColumnName: "uuid", // set uuid to be primary column
            name: this.$form.getValues()["name"],
            fields: [],
         };

         // add new columns to object
         this.$columnList.data.find({}).forEach((item, index) => {
            if (item.include) {
               var newField = {
                  id: OP.Util.uuid(),
                  columnName: item.columnName,
                  label: item.columnName,
                  key: item.dataType,
                  settings: {
                     showIcon: 1,
                     weight: index,
                  },
               };

               switch (item.dataType) {
                  case "string":
                  case "LongText":
                     newField.settings.supportMultilingual = 0;
                     break;
               }

               newObjAttr.fields.push(newField);
            }
         });

         // now send data back to be added:
         this.emit("save");
      }

      onSuccess(newObj) {
         // add rows to Server
         var objModel = newObj.model();

         // Add each records sequentially
         var subTasks = Promise.resolve();
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
         return subTasks.then(() => {
            this.formClear();
            this.$importButton.enable();

            return Promise.resolve();
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

         this.$columnList.clearAll();
         this.$uploadFileList.clearAll();

         this.$headerOnFirstLine.disable();
         this.$columnList.disable();
         this.$importButton.disable();
      }
   }
   return new UI_Work_Object_List_NewObject_Csv();
}
