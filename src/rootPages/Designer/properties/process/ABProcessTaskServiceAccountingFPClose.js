/*
 * UIProcessTaskServiceAccountingFPClose
 *
 * Display the form for entering the properties for a new
 * ServiceAccountingFPClose Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import ABProcessTaskServiceAccounting from "./_ABProcessTaskServiceAccounting";

export default function (AB) {
   const ProcessAccounting = ABProcessTaskServiceAccounting(AB);
   const L = ProcessAccounting.L();
   const uiConfig = AB.Config.uiSettings();

   class ABProcessTaskServiceAccountingFPClose extends ProcessAccounting {
      constructor() {
         super("properties_process_service_accounting_fiscal_period", {
            form: "",

            label: "",
            processFPValue: "",
            objectFP: "",
            objectGL: "",
            objectAcc: "",
            fieldFPStart: "",
            fieldFPOpen: "",
            fieldFPStatus: "",
            fieldFPActive: "",
            fieldGLStarting: "",
            fieldGLRunning: "",
            fieldGLAccount: "",
            fieldGLRc: "",
            fieldGLDebit: "",
            fieldGLCredit: "",
            fieldAccType: "",
            fieldAccAsset: "",
            fieldAccExpense: "",
            fieldAccLiabilities: "",
            fieldAccEquity: "",
            fieldAccIncome: "",
         });

         this.element = null;
      }

      static get key() {
         return "AccountingFPClose";
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
                  id: ids.processFPValue,
                  view: "select",
                  label: L("Process Fiscal Period Value"),
                  name: "processFPValue",
                  options: [],
               },
               {
                  id: ids.objectFP,
                  view: "select",
                  label: L("FP Object"),
                  name: "objectFP",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        // gather new set of batchFields
                        const fpFields = this._getFieldOptions(newVal);
                        // rebuild the associated list of Fields to
                        this._updateFieldOptions(this._optionsFP, fpFields);
                     },
                  },
               },
               {
                  id: ids.objectGL,
                  view: "select",
                  label: L("GL Object"),
                  name: "objectGL",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        // gather new set of batchFields
                        const glFields = this._getFieldOptions(newVal);
                        // rebuild the associated list of Fields to pick
                        this._updateFieldOptions(this._optionsGL, glFields);
                     },
                  },
               },
               {
                  id: ids.objectAcc,
                  view: "select",
                  label: L("Account Object"),
                  name: "objectAcc",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        const accFields = this._getFieldOptions(newVal);
                        this._updateFieldOptions(this._optionsAcc, accFields);
                     },
                  },
               },
               {
                  id: ids.fieldFPStart,
                  view: "select",
                  label: L("FP -> Start"),
                  name: "fieldFPStart",
                  options: [],
               },
               {
                  id: ids.fieldFPOpen,
                  view: "select",
                  label: L("FP -> Open"),
                  name: "fieldFPOpen",
                  options: [],
               },
               {
                  id: ids.fieldFPStatus,
                  view: "select",
                  label: L("FP -> Status"),
                  name: "fieldFPStatus",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        const fpStatusFields = this._getListFieldOptions({
                           objectId:
                              this.objectFP || $$(ids.objectFP).getValue(),
                           fieldId: newVal,
                        });
                        this._updateFieldOptions(
                           this._optionsFpStatus,
                           fpStatusFields
                        );
                     },
                  },
               },
               {
                  id: ids.fieldFPActive,
                  view: "select",
                  label: L("FP -> Active"),
                  name: "fieldFPActive",
                  options: [],
               },
               {
                  id: ids.fieldGLStarting,
                  view: "select",
                  label: L("GL -> Starting BL"),
                  name: "fieldGLStarting",
                  options: [],
               },
               {
                  id: ids.fieldGLRunning,
                  view: "select",
                  label: L("GL -> Running BL"),
                  name: "fieldGLRunning",
                  options: [],
               },
               {
                  id: ids.fieldGLAccount,
                  view: "select",
                  label: L("GL -> Account"),
                  name: "fieldGLAccount",
                  options: [],
               },
               {
                  id: ids.fieldGLRc,
                  view: "select",
                  label: L("GL -> RC"),
                  name: "fieldGLRc",
                  options: [],
               },
               {
                  id: ids.fieldGLDebit,
                  view: "select",
                  label: L("GL -> Debit"),
                  name: "fieldGLDebit",
                  options: [],
               },
               {
                  id: ids.fieldGLCredit,
                  view: "select",
                  label: L("GL -> Credit"),
                  name: "fieldGLCredit",
                  options: [],
               },
               {
                  id: ids.fieldAccType,
                  view: "select",
                  label: L("Acc -> Type"),
                  name: "fieldAccType",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        const accTypeOptions = this._getListFieldOptions({
                           objectId:
                              this.objectAcc || $$(ids.objectAcc).getValue(),
                           fieldId: newVal,
                        });
                        this._updateFieldOptions(
                           this._optionsAccType,
                           accTypeOptions
                        );
                     },
                  },
               },
               {
                  id: ids.fieldAccAsset,
                  view: "select",
                  label: L("Acc -> Asset"),
                  name: "fieldAccAsset",
                  options: [],
               },
               {
                  id: ids.fieldAccExpense,
                  view: "select",
                  label: L("Acc -> Expense"),
                  name: "fieldAccExpense",
                  options: [],
               },
               {
                  id: ids.fieldAccLiabilities,
                  view: "select",
                  label: L("Acc -> Liabilities"),
                  name: "fieldAccLiabilities",
                  options: [],
               },
               {
                  id: ids.fieldAccEquity,
                  view: "select",
                  label: L("Acc -> Equity"),
                  name: "fieldAccEquity",
                  options: [],
               },
               {
                  id: ids.fieldAccIncome,
                  view: "select",
                  label: L("Acc -> Income"),
                  name: "fieldAccIncome",
                  options: [],
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

         const fpFields = this._getFieldOptions(element.objectFP);
         const glFields = this._getFieldOptions(element.objectGL);
         const accFields = this._getFieldOptions(element.objectAcc);
         const fpStatusFields = this._getListFieldOptions({
            objectId: element.objectFP,
            fieldId: element.fieldFPStatus,
         });
         const accTypeOptions = this._getListFieldOptions({
            objectId: element.objectAcc,
            fieldId: element.fieldAccType,
         });

         this._updateFieldOptions([ids.processFPValue], processValues);
         this._updateFieldOptions(this._optionsObject, objectList);
         this._updateFieldOptions(this._optionsFP, fpFields);
         this._updateFieldOptions(this._optionsGL, glFields);
         this._updateFieldOptions(this._optionsAcc, accFields);
         this._updateFieldOptions(this._optionsFpStatus, fpStatusFields);
         this._updateFieldOptions(this._optionsAccType, accTypeOptions);

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

      get _optionsObject() {
         return [this.ids.objectFP, this.ids.objectGL, this.ids.objectAcc];
      }

      get _optionsFP() {
         return [
            this.ids.fieldFPStart,
            this.ids.fieldFPOpen,
            this.ids.fieldFPStatus,
         ];
      }

      get _optionsGL() {
         return [
            this.ids.fieldGLStarting,
            this.ids.fieldGLRunning,
            this.ids.fieldGLAccount,
            this.ids.fieldGLRc,
            this.ids.fieldGLDebit,
            this.ids.fieldGLCredit,
         ];
      }

      get _optionsAcc() {
         return [this.ids.fieldAccType];
      }

      get _optionsFpStatus() {
         return [this.ids.fieldFPActive];
      }

      get _optionsAccType() {
         return [
            this.ids.fieldAccAsset,
            this.ids.fieldAccExpense,
            this.ids.fieldAccLiabilities,
            this.ids.fieldAccEquity,
            this.ids.fieldAccIncome,
         ];
      }
   }

   return ABProcessTaskServiceAccountingFPClose;
}
