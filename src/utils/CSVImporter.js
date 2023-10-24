const FieldTypeTool = require("./FieldTypeTool");

module.exports = class CSVImporter {
   constructor(AB, fileReader = FileReader) {
      this._AB = AB;
      this._FileReader = fileReader;
   }

   L(...params) {
      return this._AB.Multilingual.labelPlugin("ABDesigner", ...params);
   }

   getSeparateItems() {
      return [
         { id: ",", value: this.L("Comma (,)") },
         {
            id: "\t",
            value: this.L("Tab (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)"),
         },
         { id: ";", value: this.L("Semicolon (;)") },
         { id: "s", value: this.L("Space ( )") },
      ];
   }

   /**
    * @method validateFile
    * Validate file extension
    *
    * @param {*} fileInfo - https://docs.webix.com/api__ui.uploader_onbeforefileadd_event.html
    *
    * @return {boolean}
    */
   validateFile(fileInfo) {
      if (!fileInfo || !fileInfo.file || !fileInfo.file.type) return false;

      // validate file type
      let extensionType = fileInfo.file.type.toLowerCase();
      if (
         extensionType == "text/csv" ||
         extensionType == "application/vnd.ms-excel"
      ) {
         return true;
      } else {
         return false;
      }
   }

   /**
    * @method getDataRows
    * Pull data rows from the CSV file
    *
    * @param {Object} fileInfo - https://docs.webix.com/api__ui.uploader_onbeforefileadd_event.html
    * @param {string} separatedBy
    *
    * @return {Promise} -[
    * 						["Value 1.1", "Value 1.2", "Value 1.3"],
    * 						["Value 2.1", "Value 2.2", "Value 2.3"],
    * 					]
    */
   async getDataRows(fileInfo, separatedBy) {
      if (!this.validateFile(fileInfo))
         return Promise.reject(this.L(".fileInfo parameter is invalid"));

      return new Promise((resolve, reject) => {
         // read CSV file
         let reader = new this._FileReader();
         reader.onload = (e) => {
            const result = this.convertToArray(reader.result, separatedBy);

            resolve(result);
         };
         reader.readAsText(fileInfo.file);
      });
   }

   /**
    * @method convertToArray
    * Pull data rows from the CSV file
    *
    * @param {string} text
    * @param {string} separatedBy
    *
    * @return {Promise} -[
    * 						["Value 1.1", "Value 1.2", "Value 1.3"],
    * 						["Value 2.1", "Value 2.2", "Value 2.3"],
    * 					]
    */
   convertToArray(text = "", separatedBy = ",") {
      let result = [];

      // split lines
      let dataRows = text
         .split(/\r\n|\n|\r/) // CRLF = \r\n; LF = \n; CR = \r;
         .filter((row) => row && row.length > 0);

      // split columns
      (dataRows || []).forEach((row) => {
         let dataCols = [];
         if (separatedBy == ",") {
            // NOTE: if the file contains ,, .match(), then can not recognize this empty string
            row = row.replace(/,,/g, ", ,");

            // https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript#answer-11457952
            dataCols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
         } else {
            dataCols = row.split(separatedBy);
         }

         result.push(dataCols.map((dCol) => this.reformat(dCol)));
      });

      return result;
   }

   /**
    * @method getGuessDataType
    *
    * @param dataRows {Array} - [
    * 								["Value 1.1", "Value 1.2", "Value 1.3"],
    * 								["Value 2.1", "Value 2.2", "Value 2.3"],
    * 							]
    * @param colIndex {Number}
    *
    * @return {string}
    */
   getGuessDataType(dataRows, colIndex) {
      var data,
         repeatNum = 10;

      // Loop to find a value
      for (var i = 1; i <= repeatNum; i++) {
         var line = dataRows[i];
         if (!line) break;

         data = line[colIndex];

         if (data != null && data.length > 0) break;
      }

      return FieldTypeTool.getFieldType(data);
   }

   /**
    * @method reformat
    *
    * @param {string} str
    */
   reformat(str) {
      if (!str) return "";

      return str.trim().replace(/"/g, "").replace(/'/g, "");
   }
};
