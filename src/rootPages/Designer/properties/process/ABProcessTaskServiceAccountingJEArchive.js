/*
 * UIProcessTaskServiceAccountingJEArchive
 *
 * Display the form for entering the properties for a new
 * ServiceAccountingJEArchive Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import ABProcessTaskServiceAccounting from "./_ABProcessTaskServiceAccounting";

export default function (AB) {
   const ProcessAccounting = ABProcessTaskServiceAccounting(AB);
   const L = ProcessAccounting.L();
   const uiConfig = AB.Config.uiSettings();

   class ABProcessTaskServiceAccountingJEArchive extends ProcessAccounting {
      constructor() {
         super("properties_process_service_accounting_je_archive", {
            form: "",

            label: "",
            processBatchValue: "",
            objectBatch: "",
            objectBalance: "",
            objectJE: "",
            objectJEArchive: "",

            fieldBatchFiscalMonth: "",
            fieldJeAccount: "",
            fieldJeRC: "",
            fieldJeArchiveBalance: "",
            fieldBrFiscalMonth: "",
            fieldBrAccount: "",
            fieldBrRC: "",

            fieldsMatch: "",
         });

         this.element = null;
      }

      static get key() {
         return "AccountingJEArchive";
      }

      ui() {
         const ids = this.ids;

         return {
            id: ids.form,
            view: "form",
            elementsConfig: {
               labelWidth: uiConfig.labelWidthXLarge,
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
                     onChange: (newVal) => {
                        this.objectBatch = newVal;
                        this._refreshBatchFields(newVal);
                     },
                  },
               },
               {
                  id: ids.fieldBatchFiscalMonth,
                  view: "select",
                  label: L("Batch -> Fiscal Month"),
                  name: "fieldBatchFiscalMonth",
                  options: [],
               },
               {
                  id: ids.objectBalance,
                  view: "select",
                  label: L("BR Object"),
                  name: "objectBalance",
                  options: [],
                  on: {
                     onChange: (newVal) => {
                        this.objectBalance = newVal;
                        this._refreshBRFields(newVal);
                     },
                  },
               },
               {
                  id: ids.fieldBrFiscalMonth,
                  view: "select",
                  label: L("BR -> Fiscal Month"),
                  name: "fieldBrFiscalMonth",
                  options: [],
               },
               {
                  id: ids.fieldBrAccount,
                  view: "select",
                  label: L("BR -> Account"),
                  name: "fieldBrAccount",
                  options: [],
               },
               {
                  id: ids.fieldBrRC,
                  view: "select",
                  label: L("BR -> RC"),
                  name: "fieldBrRC",
                  options: [],
               },
               {
                  id: ids.objectJE,
                  view: "select",
                  label: L("JE Object"),
                  name: "objectJE",
                  options: [],
                  on: {
                     onChange: (newVal) => {
                        this.objectJE = newVal;
                        this._refreshJeFields(newVal);
                        this._refreshFieldsMatch(
                           this.objectJE,
                           this.objectJEArchive,
                           this.fieldsMatch
                        );
                     },
                  },
               },
               {
                  id: ids.fieldJeAccount,
                  view: "select",
                  label: L("JE -> Account"),
                  name: "fieldJeAccount",
                  options: [],
               },
               {
                  id: ids.fieldJeRC,
                  view: "select",
                  label: L("JE -> RC"),
                  name: "fieldJeRC",
                  options: [],
               },
               {
                  id: ids.objectJEArchive,
                  view: "select",
                  label: L("JE Archive Object"),
                  name: "objectJEArchive",
                  options: [],
                  on: {
                     onChange: (newVal) => {
                        this.objectJEArchive = newVal;
                        this._refreshJeArchiveFields(newVal);
                        this._refreshFieldsMatch(
                           this.objectJE,
                           this.objectJEArchive,
                           this.fieldsMatch
                        );
                     },
                  },
               },
               {
                  id: ids.fieldJeArchiveBalance,
                  view: "select",
                  label: L("JE Archive -> BR"),
                  name: "fieldJeArchiveBalance",
                  options: [],
               },
               {
                  view: "fieldset",
                  label: "Fields Matching",
                  body: {
                     id: ids.fieldsMatch,
                     view: "form",
                     elementsConfig: {
                        labelWidth: uiConfig.labelWidthXXLarge,
                     },
                     borderless: true,
                     elements: [],
                  },
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

         this._updateFieldOptions([ids.processBatchValue], processValues);
         this._updateFieldOptions(this._optionsObject, objectList);
         this._refreshBatchFields(element.objectBatch);
         this._refreshBRFields(element.objectBalance);
         this._refreshJeFields(element.objectJE);
         this._refreshJeArchiveFields(element.objectJEArchive);

         // Set values
         $$(ids.label).setValue(element.label);
         element.defaults.settings.forEach((setting) => {
            const val = element[setting] == 0 ? "" : element[setting];
            $$(ids[setting]).setValue?.(val);
            // element.fieldsMatch
            $$(ids[setting]).setValues?.(val);
         });
      }

      values() {
         const ids = this.ids;
         const values = $$(ids.form).getValues();
         values.fieldsMatch = $$(ids.fieldsMatch).getValues();

         return values;
      }

      _refreshBatchFields(batchObjId) {
         const fieldBatchList = this._getFieldOptions(
            batchObjId,
            "connectObject"
         );
         this._updateFieldOptions(this._optionsBatch, fieldBatchList);
      }

      _refreshBRFields(balanceObjId) {
         const fieldBalanceList = this._getFieldOptions(
            balanceObjId,
            "connectObject"
         );
         this._updateFieldOptions(this._optionsBalance, fieldBalanceList);
      }

      _refreshJeFields(jeObjectId) {
         const fieldJeList = this._getFieldOptions(jeObjectId, "connectObject");
         this._updateFieldOptions(this._optionsJE, fieldJeList);
      }

      _refreshJeArchiveFields(jeArchiveObjId) {
         const fieldJeArchiveList = this._getFieldOptions(
            jeArchiveObjId,
            "connectObject"
         );
         this._updateFieldOptions(this._optionsJeArchive, fieldJeArchiveList);
      }

      _refreshFieldsMatch(jeObjId, jeArcObjId, fieldsMatch = {}) {
         const ids = this.ids;

         const $fieldsMatch = $$(ids.fieldsMatch);
         if (!$fieldsMatch) return;

         // clear form
         this.AB.Webix.ui([], $fieldsMatch);

         const JEObj = this.AB.objectByID(jeObjId);
         if (!JEObj) return;

         const JEArchiveObj = this.AB.objectByID(jeArcObjId);
         if (!JEArchiveObj) return;

         // create JE acrhive field options to the form
         JEArchiveObj.fields().forEach((f) => {
            let jeFields = [];

            if (f.isConnection) {
               jeFields = JEObj.fields((fJe) => {
                  return (
                     fJe.isConnection &&
                     fJe.settings?.linkObject == f.settings?.linkObject &&
                     fJe.settings?.linkType == f.settings?.linkType &&
                     fJe.settings?.linkViaType == f.settings?.linkViaType &&
                     fJe.settings?.isCustomFK == f.settings?.isCustomFK
                  );
               });
            } else {
               jeFields = JEObj.fields((fJe) => fJe.key == f.key);
            }

            jeFields = jeFields.map((fJe) => {
               return {
                  id: fJe.id,
                  value: fJe.label,
               };
            });

            $fieldsMatch.addView({
               view: "select",
               name: f.id,
               label: f.label,
               options: jeFields,
            });
         });

         $fieldsMatch.setValues(fieldsMatch ?? {});
      }

      get _optionsObject() {
         return [
            this.ids.objectBatch,
            this.ids.objectBalance,
            this.ids.objectJE,
            this.ids.objectJEArchive,
         ];
      }

      get _optionsBatch() {
         return [this.ids.fieldBatchFiscalMonth];
      }

      get _optionsBalance() {
         return [
            this.ids.fieldBrFiscalMonth,
            this.ids.fieldBrAccount,
            this.ids.fieldBrRC,
         ];
      }

      get _optionsJE() {
         return [this.ids.fieldJeAccount, this.ids.fieldJeRC];
      }

      get _optionsJeArchive() {
         return [this.ids.fieldJeArchiveBalance];
      }
   }

   return ABProcessTaskServiceAccountingJEArchive;
}
