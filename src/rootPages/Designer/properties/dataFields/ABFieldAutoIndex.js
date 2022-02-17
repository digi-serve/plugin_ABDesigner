/*
 * ABFieldAutoIndex
 * A Property manager for our ABFieldAutoIndex.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

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
               id: ids.prefix,
               view: "text",
               name: "prefix",
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Prefix"),
               placeholder: L("US"),
               on: {
                  onChange: () => {
                     this.previewChange();
                  },
               },
            },
            {
               id: ids.delimiter,
               view: "richselect",
               name: "delimiter",
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Delimiter"),
               value: "dash",
               options: FC.delimiterList(),
               on: {
                  onChange: () => {
                     this.previewChange();
                  },
               },
            },
            {
               id: ids.displayLength,
               view: "counter",
               name: "displayLength",
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Length"),
               step: 1,
               value: 4,
               min: 1,
               max: 10,
               on: {
                  onChange: () => {
                     this.previewChange();
                  },
               },
            },
            {
               id: ids.previewText,
               view: "text",
               name: "previewText",
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Preview"),
               value: "-0000",
               disabled: true,
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

      isValid() {
         const isValid = super.isValid();

         // validator.addError('columnName', L('ab.validation.object.name.unique', 'Field columnName must be unique (#name# already used in this Application)').replace('#name#', this.name) );

         return isValid;
      }

      populate(field) {
         super.populate(field);

         this.previewChange();
      }
   }
   return ABFieldAutoIndexProperty;
}
