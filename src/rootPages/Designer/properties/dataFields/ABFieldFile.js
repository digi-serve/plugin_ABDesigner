/*
 * ABFieldFile
 * A Property manager for our ABFieldFile.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   var ABField = FFieldClass(AB);
   var L = ABField.L();

   class ABFieldFile extends ABField {
      constructor() {
         super("properties_abfield_file", {
            fileSize: "",
            fileType: "",
         });
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               cols: [
                  {
                     view: "checkbox",
                     name: "limitFileSize",
                     labelRight: L("Size (MB)"),
                     width: 120,
                     labelWidth: 0,
                     value: 1,
                     click: function () {
                        if (this.getValue()) $$(ids.fileSize).enable();
                        else $$(ids.fileSize).disable();
                     },
                  },
                  {
                     view: "counter",
                     name: "fileSize",
                     id: ids.fileSize,
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "checkbox",
                     name: "limitFileType",
                     labelRight: L("Type"),
                     width: 120,
                     labelWidth: 0,
                     value: 1,
                     click: function () {
                        if (this.getValue()) $$(ids.fileType).enable();
                        else $$(ids.fileType).disable();
                     },
                  },
                  {
                     view: "text",
                     name: "fileType",
                     placeholder: L("txt,rtf,doc,docx,..."),
                     id: ids.fileType,
                  },
               ],
            },
         ]);
      }

      clear() {
         const ids = this.ids;
console.log("ssss")
         super.clear();
         $$(ids.fileSize).setValue(0);
         $$(ids.fileType).setValue("");
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("file");
      }
   }

   return ABFieldFile;
}
