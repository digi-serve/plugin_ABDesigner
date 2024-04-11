/*
 * UIProcessTaskServiceAccountingFPYearClose
 *
 * Display the form for entering the properties for a new
 * ServiceAccountingFPYearClose Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import ABProcessTaskServiceAccounting from "./_ABProcessTaskServiceAccounting";

export default function (AB) {
   const ProcessAccounting = ABProcessTaskServiceAccounting(AB);
   const L = ProcessAccounting.L();
   const uiConfig = AB.Config.uiSettings();

   class ABProcessTaskServiceAccountingFPYearClose extends ProcessAccounting {
      constructor() {
         super("properties_process_service_accounting_fiscal_year_close", {
            form: "",

            label: "",
            processFPYearValue: "",
            objectFPYear: "",
            objectFPMonth: "",
            objectGL: "",
            objectAccount: "",
            valueFundBalances: "",
            valueNetIncome: "",
            fieldFPYearStart: "",
            fieldFPYearEnd: "",
            fieldFPYearStatus: "",
            fieldFPYearActive: "",
            fieldFPMonthStart: "",
            fieldFPMonthEnd: "",
            fieldGLStartBalance: "",
            fieldGLRunningBalance: "",
            fieldGLrc: "",
            fieldAccNumber: "",
            fieldAccType: "",
            fieldAccTypeIncome: "",
            fieldAccTypeExpense: "",
            fieldAccTypeEquity: "",
         });

         this.element = null;
      }

      static get key() {
         return "AccountingFPYearClose";
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
                  id: ids.processFPYearValue,
                  view: "select",
                  label: L("Process Fiscal Period Year Value"),
                  name: "processFPYearValue",
                  options: [],
               },
               {
                  id: ids.objectFPYear,
                  view: "select",
                  label: L("FP Year Object"),
                  name: "objectFPYear",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        const fpYearDateFields = this._getFieldOptions(
                           newVal,
                           "date"
                        );
                        this._updateFieldOptions(
                           this._optionsFPYearDate,
                           fpYearDateFields
                        );

                        const accTypeFields = this._getFieldOptions(
                           newVal,
                           "list"
                        );
                        this._updateFieldOptions(
                           this._optionsAccountType,
                           accTypeFields
                        );
                     },
                  },
               },
               {
                  id: ids.objectFPMonth,
                  view: "select",
                  label: L("FP Month Object"),
                  name: "objectFPMonth",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        const fpMonthDateFields = this._getFieldOptions(
                           newVal,
                           "date"
                        );
                        this._updateFieldOptions(
                           this._optionsFPMonthDate,
                           fpMonthDateFields
                        );
                     },
                  },
               },
               {
                  id: ids.objectGL,
                  view: "select",
                  label: L("Balance Object"),
                  name: "objectGL",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        const glNumberFields = this._getFieldOptions(
                           newVal,
                           "number"
                        );
                        this._updateFieldOptions(
                           this._optionsGLbalance,
                           glNumberFields
                        );

                        const glRcFields = this._getFieldOptions(
                           newVal,
                           "connectObject"
                        );
                        this._updateFieldOptions(this._optionsGLrc, glRcFields);
                     },
                  },
               },
               {
                  id: ids.objectAccount,
                  view: "select",
                  label: L("Account Object"),
                  name: "objectAccount",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        const accTypeFields = this._getFieldOptions(
                           newVal,
                           "list"
                        );
                        this._updateFieldOptions(
                           this._optionsAccountType,
                           accTypeFields
                        );

                        const accNumberFields = this._getFieldOptions(
                           newVal,
                           "number"
                        );
                        this._updateFieldOptions(
                           this._optionsAccountNumber,
                           accNumberFields
                        );
                     },
                  },
               },
               {
                  id: ids.valueFundBalances,
                  view: "text",
                  label: L("Fund Balances Code"),
                  name: "valueFundBalances",
               },
               {
                  id: ids.valueNetIncome,
                  view: "text",
                  label: L("Net Income Code"),
                  name: "valueNetIncome",
               },
               {
                  id: ids.fieldFPYearStart,
                  view: "select",
                  label: L("FP Year -> Start"),
                  name: "fieldFPYearStart",
                  options: [],
               },
               {
                  id: ids.fieldFPYearEnd,
                  view: "select",
                  label: L("FP Year -> End"),
                  name: "fieldFPYearEnd",
                  options: [],
               },
               {
                  id: ids.fieldFPYearStatus,
                  view: "select",
                  label: L("FP Year -> Status"),
                  name: "fieldFPYearStatus",
                  options: [],
                  on: {
                     onChange: (newVal, oldVal) => {
                        if (newVal == oldVal) return;

                        const fpYearStatusOptions = this._getListFieldOptions({
                           objectId:
                              this.objectFPYear ||
                              $$(ids.objectFPYear).getValue(),
                           fieldId: newVal,
                        });
                        this._updateFieldOptions(
                           this._optionsFPYearStatusActive,
                           fpYearStatusOptions
                        );
                     },
                  },
               },
               {
                  id: ids.fieldFPYearActive,
                  view: "select",
                  label: L("FP Year -> Active"),
                  name: "fieldFPYearActive",
                  options: [],
               },
               {
                  id: ids.fieldFPMonthStart,
                  view: "select",
                  label: L("FP Month -> Start"),
                  name: "fieldFPMonthStart",
                  options: [],
               },
               {
                  id: ids.fieldFPMonthEnd,
                  view: "select",
                  label: L("FP Month -> End"),
                  name: "fieldFPMonthEnd",
                  options: [],
               },
               {
                  id: ids.fieldGLStartBalance,
                  view: "select",
                  label: L("GL -> Start Balance"),
                  name: "fieldGLStartBalance",
                  options: [],
               },
               {
                  id: ids.fieldGLRunningBalance,
                  view: "select",
                  label: L("GL -> Running Balance"),
                  name: "fieldGLRunningBalance",
                  options: [],
               },
               {
                  id: ids.fieldGLrc,
                  view: "select",
                  label: L("GL -> RC"),
                  name: "fieldGLrc",
                  options: [],
               },
               {
                  id: ids.fieldAccNumber,
                  view: "select",
                  label: L("Acc -> Account Number"),
                  name: "fieldAccNumber",
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
                              this.objectAccount ||
                              $$(ids.objectAccount).getValue(),
                           fieldId: newVal,
                        });
                        this._updateFieldOptions(
                           this._optionsAccountTypeOptions,
                           accTypeOptions
                        );
                     },
                  },
               },
               {
                  id: ids.fieldAccTypeIncome,
                  view: "select",
                  label: L("Acc -> Income"),
                  name: "fieldAccTypeIncome",
                  options: [],
               },
               {
                  id: ids.fieldAccTypeExpense,
                  view: "select",
                  label: L("Acc -> Expense"),
                  name: "fieldAccTypeExpense",
                  options: [],
               },
               {
                  id: ids.fieldAccTypeEquity,
                  view: "select",
                  label: L("Acc -> Equity"),
                  name: "fieldAccTypeEquity",
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

         const fpYearDateFields = this._getFieldOptions(
            element.objectFPYear,
            "date"
         );
         const fpYearStatusFields = this._getFieldOptions(
            element.objectFPYear,
            "list"
         );
         const fpYearStatusOptions = this._getListFieldOptions({
            objectId: element.objectFPYear,
            fieldId: element.fieldFPYearStatus,
         });

         const fpMonthDateFields = this._getFieldOptions(
            element.objectFPMonth,
            "date"
         );
         const glNumberFields = this._getFieldOptions(
            element.objectGL,
            "number"
         );
         const glRcFields = this._getFieldOptions(
            element.objectGL,
            "connectObject"
         );
         const accNumberFields = this._getFieldOptions(
            element.objectAccount,
            "number"
         );
         const accTypeFields = this._getFieldOptions(
            element.objectAccount,
            "list"
         );
         const accTypeOptions = this._getListFieldOptions({
            objectId: element.objectAccount,
            fieldId: element.fieldAccType,
         });

         this._updateFieldOptions([ids.processFPYearValue], processValues);
         this._updateFieldOptions(this._optionsObject, objectList);
         this._updateFieldOptions(this._optionsFPYearDate, fpYearDateFields);
         this._updateFieldOptions(
            this._optionsFPYearStatus,
            fpYearStatusFields
         );
         this._updateFieldOptions(
            this._optionsFPYearStatusActive,
            fpYearStatusOptions
         );
         this._updateFieldOptions(this._optionsFPMonthDate, fpMonthDateFields);
         this._updateFieldOptions(this._optionsGLbalance, glNumberFields);
         this._updateFieldOptions(this._optionsGLrc, glRcFields);
         this._updateFieldOptions(this._optionsAccountNumber, accNumberFields);
         this._updateFieldOptions(this._optionsAccountType, accTypeFields);
         this._updateFieldOptions(
            this._optionsAccountTypeOptions,
            accTypeOptions
         );

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
         return [
            this.ids.objectFPYear,
            this.ids.objectFPMonth,
            this.ids.objectGL,
            this.ids.objectAccount,
         ];
      }

      get _optionsFPYearDate() {
         return [this.ids.fieldFPYearStart, this.ids.fieldFPYearEnd];
      }

      get _optionsFPYearStatus() {
         return [this.ids.fieldFPYearStatus];
      }

      get _optionsFPYearStatusActive() {
         return [this.ids.fieldFPYearActive];
      }

      get _optionsFPMonthDate() {
         return [this.ids.fieldFPMonthStart, this.ids.fieldFPMonthEnd];
      }

      get _optionsGLbalance() {
         return [this.ids.fieldGLStartBalance, this.ids.fieldGLRunningBalance];
      }

      get _optionsGLrc() {
         return [this.ids.fieldGLrc];
      }

      get _optionsAccountNumber() {
         return [this.ids.fieldAccNumber];
      }

      get _optionsAccountType() {
         return [this.ids.fieldAccType];
      }

      get _optionsAccountTypeOptions() {
         return [
            this.ids.fieldAccTypeIncome,
            this.ids.fieldAccTypeExpense,
            this.ids.fieldAccTypeEquity,
         ];
      }
   }

   return ABProcessTaskServiceAccountingFPYearClose;
}
