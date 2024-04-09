/*
 * UIProcessTaskServiceAccountingBatchProcessing
 *
 * Display the form for entering the properties for a new
 * ServiceAccountingBatchProcessing Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import ABProcessTaskServiceAccounting from "./_ABProcessTaskServiceAccounting";

export default function (AB) {
   const ProcessAccounting = ABProcessTaskServiceAccounting(AB);
   const L = ProcessAccounting.L();
   const uiConfig = AB.Config.uiSettings();

   class UIProcessTaskServiceAccountingBatchProcessing extends ProcessAccounting {
      constructor() {
         super("properties_process_service_accounting_batch_processing", {
            form: "",

            label: "",
            processBatchValue: "",
            objectBatch: "",
            fieldBatchEntries: "",
            fieldBatchFinancialPeriod: "",
            objectJE: "",
            fieldJEAccount: "",
            fieldJERC: "",
            fieldJEStatus: "",
            fieldJEStatusComplete: "",
            objectBR: "",
            fieldBRFinancialPeriod: "",
            fieldBRAccount: "",
            fieldBRRC: "",
            fieldBREntries: "",
         });

         this.element = null;
      }

      static get key() {
         return "AccountingBatchProcessing";
      }

      ui() {
         const ids = this.ids;

         return {
            id: ids.form,
            view: "form",
            elementsConfig: {
               labelWidth: uiConfig.labelWidthXXLarge,
            },
            elements: [
               {
                  id: ids.label,
                  view: "text",
                  label: L("Name"),
                  name: "label",
               },
               {
                  id: ids.processBatchValue,
                  view: "select",
                  label: L("Process Batch Value"),
                  name: "processBatchValue",
                  options: [],
               },
               {
                  id: ids.objectBatch,
                  view: "select",
                  label: L("Batch Object"),
                  name: "objectBatch",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        // gather new set of batchFields
                        const batchFields = this._getFieldOptions(newVal);
                        // rebuild the associated list of Fields to pick
                        this._updateFieldOptions(
                           this._optionsBatch,
                           batchFields
                        );
                     },
                  },
               },
               {
                  id: ids.fieldBatchEntries,
                  view: "select",
                  label: L("Batch->JE[]"),
                  name: "fieldBatchEntries",
                  options: [],
                  hidden: true,
               },
               {
                  id: ids.fieldBatchFinancialPeriod,
                  view: "select",
                  label: L("Batch->FinancialPeriod"),
                  name: "fieldBatchFinancialPeriod",
                  options: [],
                  hidden: true,
               },
               {
                  id: ids.objectJE,
                  view: "select",
                  label: L("Journal Entry Object"),
                  name: "objectJE",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        // gather new set of jeFields
                        const jeFields = this._getFieldOptions(newVal);
                        // rebuild the associated list of Fields to pick
                        this._updateFieldOptions(this._optionsJE, jeFields);
                     },
                  },
               },
               {
                  id: ids.fieldJEAccount,
                  view: "select",
                  label: L("JE->Account"),
                  name: "fieldJEAccount",
                  options: [],
                  hidden: true,
               },
               {
                  id: ids.fieldJERC,
                  view: "select",
                  label: L("JE->RC"),
                  name: "fieldJERC",
                  options: [],
                  hidden: true,
               },
               {
                  id: ids.fieldJEStatus,
                  view: "select",
                  label: L("JE->Status"),
                  name: "fieldJEStatus",
                  options: [],
                  hidden: true,
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        this._changeStatusOptValue(newVal);
                     },
                  },
               },
               {
                  id: ids.fieldJEStatusComplete,
                  view: "select",
                  label: L("JE->Status->Complete"),
                  name: "fieldJEStatusComplete",
                  options: [],
                  hidden: true,
               },
               {
                  id: ids.objectBR,
                  view: "select",
                  label: L("Balance Record"),
                  name: "objectBR",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        // gather new set of jeFields
                        const brFields = this._getFieldOptions(newVal);
                        // rebuild the associated list of Fields to pick
                        this._updateFieldOptions(this._optionsBR, brFields);
                     },
                  },
               },
               {
                  id: ids.fieldBRFinancialPeriod,
                  view: "select",
                  label: L("BR->FP"),
                  name: "fieldBRFinancialPeriod",
                  options: [],
                  hidden: true,
               },
               {
                  id: ids.fieldBRAccount,
                  view: "select",
                  label: L("BR->Account"),
                  name: "fieldBRAccount",
                  options: [],
                  hidden: true,
               },
               {
                  id: ids.fieldBRRC,
                  view: "select",
                  label: L("BR->RC"),
                  name: "fieldBRRC",
                  options: [],
                  hidden: true,
               },
               {
                  id: ids.fieldBREntries,
                  view: "select",
                  label: L("BR->Entries"),
                  name: "fieldBREntries",
                  options: [],
                  hidden: true,
               },
            ],
         };
      }

      populate(element) {
         const ids = this.ids;

         const processValues = (
            element?.process?.processDataFields(element) ?? []
         ).map((item) => {
            return {
               id: item.key,
               value: item.label,
            };
         });
         processValues.unshift({ value: L("Select a Process Value") });

         const objectList = this.CurrentApplication?.objectsIncluded().map(
            (o) => {
               return { id: o.id, value: o.label || o.name, object: o };
            }
         );
         objectList.unshift({
            value: L("Select an Object"),
         });

         $$(ids.processBatchValue).define("options", processValues);
         $$(ids.objectBatch).define("options", objectList);
         $$(ids.objectJE).define("options", objectList);
         $$(ids.objectBR).define("options", objectList);

         $$(ids.processBatchValue).refresh();
         $$(ids.objectBatch).refresh();
         $$(ids.objectJE).refresh();
         $$(ids.objectBR).refresh();

         // if there are already default values for our Objects,
         // unhide the field selectors:
         if (element.objectBatch && element.objectBatch != 0) {
            const batchFields = this._getFieldOptions(element.objectBatch);
            this._updateFieldOptions(this._optionsBatch, batchFields);
         }

         if (element.objectJE && element.objectJE != 0) {
            const jeFields = this._getFieldOptions(element.objectJE);
            this._updateFieldOptions(this._optionsJE, jeFields);
         }

         if (element.fieldJEStatus) {
            this._changeStatusOptValue(element.fieldJEStatus);
         }

         if (element.objectBR && element.objectBR != 0) {
            const brFields = this._getFieldOptions(element.objectBR);
            this._updateFieldOptions(this._optionsBR, brFields);
         }

         // Set values
         $$(ids.label).setValue(element.label);
         element.defaults.settings.forEach((setting) => {
            const val = element[setting] == 0 ? "" : element[setting];
            $$(ids[setting]).setValue(val);
         });
      }

      values() {
         const ids = this.ids;
         return $$(ids.form).getValues();
      }

      _updateStatusOptions(options) {
         const $completeOpt = $$(this.ids.fieldJEStatusComplete);
         if ($completeOpt) {
            // update fieldJEStatusComplete options
            $completeOpt.define("options", options);
            $completeOpt.refresh();
            // show fieldJEStatusComplete
            $completeOpt.show();
         }
      }

      _changeStatusOptValue(newVal) {
         // pull the ABField object from newValue
         const jeEntryID = $$(this.ids.objectJE).getValue();
         const jeEntry = this.CurrentApplication.objectsIncluded().find(
            (o) => o.id == jeEntryID
         );
         const statusField = jeEntry?.object?.fieldByID(newVal);
         if (statusField?.options) {
            // get the options as an []
            const jeFieldStatusValues = this._getListFieldOptions({
               field: statusField,
            });

            this._updateStatusOptions(jeFieldStatusValues);
         }
      }

      get _optionsBatch() {
         return [
            this.ids.fieldBatchEntries,
            this.ids.fieldBatchFinancialPeriod,
         ];
      }

      get _optionsBR() {
         return [
            this.ids.fieldBRFinancialPeriod,
            this.ids.fieldBRAccount,
            this.ids.fieldBRRC,
            this.ids.fieldBREntries,
         ];
      }

      get _optionsJE() {
         return [
            this.ids.fieldJEAccount,
            this.ids.fieldJERC,
            this.ids.fieldJEStatus,
         ];
      }
   }

   return UIProcessTaskServiceAccountingBatchProcessing;
}
