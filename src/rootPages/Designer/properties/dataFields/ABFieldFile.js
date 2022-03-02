/*
 * ABFieldFile
 * A Property manager for our ABFieldFile.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const ABField = FFieldClass(AB);
   const L = ABField.L();

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
                     view: "label",
                     label: L("Size (MB):") + " ",
                     align: "right",
                     width: 75,
                  },
                  {
                     view: "checkbox",
                     name: "limitFileSize",
                     value: 1,
                     width: 30,
                     click: function () {
                        if (this.getValue()) $$(ids.fileSize).enable();
                        else $$(ids.fileSize).disable();
                     },
                     on: {
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "counter",
                     name: "fileSize",
                     id: ids.fileSize,
                     width: 104,
                     on: {
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Type:") + " ",
                     align: "right",
                     width: 75,
                  },
                  {
                     view: "checkbox",
                     name: "limitFileType",
                     width: 30,
                     labelWidth: 0,
                     value: 1,
                     click: function () {
                        if (this.getValue()) $$(ids.fileType).enable();
                        else $$(ids.fileType).disable();
                     },
                     on: {
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.fileType,
                     view: "text",
                     name: "fileType",
                     placeholder: L("txt,rtf,doc,docx,..."),
                     on: {
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
         ]);
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

      clear() {
         const ids = this.ids;

         super.clear();
         $$(ids.fileSize).setValue(0);
         $$(ids.fileType).setValue("");
      }
   }

   return ABFieldFile;
}
