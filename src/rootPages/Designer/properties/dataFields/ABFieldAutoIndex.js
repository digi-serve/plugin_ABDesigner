/*
 * ABFieldAutoIndex
 * A Property manager for our ABFieldAutoIndex.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldAutoIndexProperty extends ABField {
      constructor() {
         super("properties_abfield_autoindex", {
            prefix: "",
            delimiter: "",
            displayLength: "",
            previewText: "",
            // currentIndex: 'currentIndex',
         });
      }

      ui() {
         const ids = this.ids;
         const FC = this.FieldClass();

         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Prefix:") + " ",
                     align: "right",
                     width: 75,
                  },
                  {
                     id: ids.prefix,
                     view: "text",
                     name: "prefix",
                     placeholder: L("Prefix"),
                     on: {
                        onTimedKeyPress: () => {
                           this.previewChange();
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Delimiter:") + " ",
                     align: "right",
                     width: 75,
                  },
                  {
                     id: ids.delimiter,
                     view: "richselect",
                     name: "delimiter",
                     value: "none",
                     options: FC.delimiterList(),
                     on: {
                        onChange: () => {
                           this.previewChange();
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Length:") + " ",
                     align: "right",
                     width: 75,
                  },
                  {
                     id: ids.displayLength,
                     view: "counter",
                     name: "displayLength",
                     step: 1,
                     value: 4,
                     min: 1,
                     max: 10,
                     width: 104,
                     on: {
                        onChange: () => {
                           this.previewChange();
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Preview:") + " ",
                     align: "right",
                     width: 75,
                  },
                  {
                     id: ids.previewText,
                     view: "text",
                     name: "previewText",
                     value: "0000",
                     disabled: true,
                  },
               ],
            },
            // {
            // 	id: ids.currentIndex,
            // 	view: "text",
            // 	name: 'currentIndex',
            // 	value: 0,
            // 	hidden: true
            // }
            // {
            // 	view: "checkbox",
            // 	name:'supportMultilingual',
            // 	labelRight: L('ab.dataField.string.supportMultilingual', '*Support multilingual'),
            // 	labelWidth: uiConfig.labelWidthCheckbox,
            // 	value: true
            // }
         ]);
      }

      previewChange() {
         const ids = this.ids;
         const FC = this.FieldClass();

         const previewResult = FC.setValueToIndex(
            $$(ids.prefix).getValue(),
            $$(ids.delimiter).getValue(),
            $$(ids.displayLength).getValue(),
            0
         );

         $$(ids.previewText).setValue(previewResult);
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("AutoIndex");
      }

      populate(field) {
         super.populate(field);

         this.previewChange();
      }
   }
   return ABFieldAutoIndexProperty;
}
