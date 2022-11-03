// ABObjectWorkspaceViewGantt.js
//
// Manages the settings for a Gantt Chart View in the AppBuilder Object Workspace

const defaultValues = {
   name: "Default Gantt",
   filterConditions: [], // array of filters to apply to the data table
   sortFields: [],
   settings: {
      dataviewID: "",
      // {string}
      // {ABDatacollection.id} of the datacollection that contains the data for
      // the Gantt chart.

      titleFieldID: "",
      // {string}
      // {ABFieldXXX.id} of the field that contains the value of the title
      // ABFieldString, ABFieldLongText

      startDateFieldID: "",
      // {string}
      // {ABFieldDate.id} of the field that contains the start date

      endDateFieldID: "",
      // {string}
      // {ABFieldDate.id} of the field that contains the end date

      durationFieldID: "",
      // {string}
      // {ABFieldNumber.id} of the field that contains the duration

      progressFieldID: "",
      // {string}
      // {ABFieldNumber.id} of the field that marks the duration

      notesFieldID: "",
      // {string}
      // {ABFieldXXX.id} of the field that contains the value of the notes
      // ABFieldString, ABFieldLongText
   },
};

import UI_Class from "../../ui_class";

export default function (AB, ibase) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const ABFieldDate = AB.Class.ABFieldManager.fieldByKey("date");
   const ABFieldNumber = AB.Class.ABFieldManager.fieldByKey("number");
   const ABFieldString = AB.Class.ABFieldManager.fieldByKey("string");
   const ABFieldLongText = AB.Class.ABFieldManager.fieldByKey("LongText");

   class ABObjectWorkspaceViewGantt extends UIClass {
      constructor(idBase) {
         super(idBase, {
            titleFieldID: "",
            startDateFieldID: "",
            endDateFieldID: "",
            durationFieldID: "",
            progressFieldID: "",
            notesFieldID: "",
         });

         this.on("field.added", (field) => {
            // refresh our droplists with the new field.
            this.refreshOptions(this.CurrentObject, this._view);
            if (this._autoSelectInput) {
               $$(this._autoSelectInput)?.setValue(field.id);
            }
         });

         this._autoSelectInput = null;
         // {string}
         // contains the webix.id of the input that should be auto selected
         // if we receive a "field.add" event;

         this._dateFields = [];
         // {array}
         // an array of webix options { id, value } that represent all the date
         // fields of the CurrentObject.
      }

      /**
       * unique key describing this View.
       * @return {string}
       */
      type() {
         return "gantt";
      }

      /**
       * @return {string}
       */
      icon() {
         return "fa fa-tasks";
      }

      refreshOptions(object, settings) {
         const ids = this.ids;

         const dateFields = object
            .fields((f) => f instanceof ABFieldDate)
            .map(({ id, label }) => ({ id, value: label }));

         // sort by value
         dateFields.sort((a, b) => (a.value > b.value ? 1 : -1));

         // Add default option
         dateFields.unshift({
            id: null,
            value: L("Select a date field"),
         });
         this._dateFields = dateFields;

         // Start date
         $$(ids.startDateFieldID).define("options", dateFields);

         // // End date
         $$(ids.endDateFieldID).define("options", dateFields);

         // Duration
         const numberFields = object
            .fields((f) => f instanceof ABFieldNumber)
            .map(({ id, label }) => ({ id, value: label }));

         // sort by value
         numberFields.sort((a, b) => (a.value > b.value ? 1 : -1));

         // Add default option
         numberFields.unshift({
            id: null,
            value: L("Select a number field"),
         });
         this._numberFields = numberFields;

         $$(ids.durationFieldID).define("options", numberFields);

         // Progress
         // const decimalFields = object
         //    .fields((f) => f instanceof ABFieldNumber)
         //    .map(({ id, label }) => ({ id, value: label }));

         // // sort by value
         // decimalFields.sort((a, b) => (a.value > b.value ? 1 : -1));

         // // Add default option
         // decimalFields.unshift({
         //    id: "",
         //    value: L("Select a number field"),
         // });
         $$(ids.progressFieldID).define("options", numberFields);

         // Title & Notes
         const stringFields = object
            .fields(
               (f) => f instanceof ABFieldString || f instanceof ABFieldLongText
            )
            .map(({ id, label }) => ({ id, value: label }));

         // sort by value
         stringFields.sort((a, b) => (a.value > b.value ? 1 : -1));

         // Add default option
         stringFields.unshift({
            id: null,
            value: L("Select a string field"),
         });
         this._stringFields = stringFields;

         $$(ids.titleFieldID).define("options", stringFields);
         $$(ids.notesFieldID).define("options", stringFields);

         if (!settings) return;

         // Select settings's values
         if (settings.titleFieldID) {
            $$(ids.titleFieldID).define("value", settings.titleFieldID);
            $$(ids.titleFieldID).refresh();
            this.syncCommonLists(
               [ids.titleFieldID, ids.notesFieldID],
               this._stringFields
            );
         }

         if (settings.startDateFieldID) {
            $$(ids.startDateFieldID).define("value", settings.startDateFieldID);
            $$(ids.startDateFieldID).refresh();
            this.syncCommonLists(
               [ids.startDateFieldID, ids.endDateFieldID],
               this._dateFields
            );
         }

         if (settings.endDateFieldID) {
            $$(ids.endDateFieldID).define(
               "value",
               settings.endDateFieldID ||
                  defaultValues.settings.endDateFieldIDFieldID
            );
            $$(ids.endDateFieldID).refresh();
            this.syncCommonLists(
               [ids.startDateFieldID, ids.endDateFieldID],
               this._dateFields
            );
         }

         if (settings.durationFieldID) {
            $$(ids.durationFieldID).define(
               "value",
               settings.durationFieldID ||
                  defaultValues.settings.durationFieldID
            );
            $$(ids.durationFieldID).refresh();
            this.syncCommonLists(
               [ids.durationFieldID, ids.progressFieldID],
               this._numberFields
            );
         }

         if (settings.progressFieldID) {
            $$(ids.progressFieldID).define("value", settings.progressFieldID);
            $$(ids.progressFieldID).refresh();
            this.syncCommonLists(
               [ids.durationFieldID, ids.progressFieldID],
               this._numberFields
            );
         }

         if (settings.notesFieldID) {
            $$(ids.notesFieldID).define("value", settings.notesFieldID);
            $$(ids.notesFieldID).refresh();
            this.syncCommonLists(
               [ids.titleFieldID, ids.notesFieldID],
               this._stringFields
            );
         }
      }

      /**
       * @method syncCommonLists()
       * Make sure the given lists do not contain options for the other lists
       * in their selections.
       * In this case, we have multiple lists of fields that can be options for
       * the start and end dates.  However once the start date field is chosen
       * we want to make sure that entry doesn't show up in the end date.
       * @param {array} commonIDs
       *        an array of [ webix.id, webix.id ] of the lists that share the
       *        same values, but shouldn't show the options of the others.
       * @param {array} fullOptions
       *        The full list of options available for those lists.
       */
      syncCommonLists(commonIDs, fullOptions) {
         // for each of the Other lists

         commonIDs.forEach((idCurr) => {
            const otherVals = [];
            const otherIDs = commonIDs.filter((i) => i != idCurr);
            otherIDs.forEach((idOther) => {
               otherVals.push($$(idOther).getValue());
            });

            const $list = $$(idCurr);
            const newOptions = fullOptions.filter(
               (o) => otherVals.indexOf(o.id) == -1
            );
            $list.define("options", newOptions);
            $list.refresh();
         });
      }

      ui() {
         const ids = this.ids;

         // const labels = {
         //    common: App.labels,
         //    component: {
         //       titleFieldID: L("ab.add_view.gantt.title", "*Title"),
         //       startDateFieldID: L("ab.add_view.gantt.startDate", "*Start Date"),
         //       endDateFieldID: L("ab.add_view.gantt.endDate", "*End Date"),
         //       durationFieldID: L("ab.add_view.gantt.duration", "*Duration"),
         //       progressFieldID: L("ab.add_view.gantt.progress", "*Progress"),
         //       notesFieldID: L("ab.add_view.gantt.notes", "*Notes"),

         //       datePlaceholder: L(
         //          "ab.add_view.gantt.datePlaceholder",
         //          "*Select a date field"
         //       ),
         //       numberPlaceholder: L(
         //          "ab.add_view.gantt.numberPlaceholder",
         //          "*Select a number field"
         //       ),
         //       stringPlaceholder: L(
         //          "ab.add_view.gantt.stringPlaceholder",
         //          "*Select a string field"
         //       ),
         //    },
         // };

         // const PopupNewDataFieldComponent = new ABPopupNewDataField(
         //    App,
         //    idBase + "_gantt"
         // );

         return {
            batch: "gantt",
            rows: [
               {
                  cols: [
                     {
                        id: ids.titleFieldID,
                        view: "richselect",
                        label: `<span style='opacity: 0.6;' class='webix_icon fa fa-calendar'></span> ${L(
                           "Title"
                        )}`,
                        placeholder: L("Select a string field"),
                        labelWidth: 130,
                        name: "titleFieldID",
                        options: [],
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.syncCommonLists(
                                 [ids.titleFieldID, ids.notesFieldID],
                                 this._stringFields
                              );
                           },
                        },
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 30,
                        click: () => {
                           this._autoSelectInput = ids.titleFieldID;
                           this.emit("new.field", ABFieldString.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.startDateFieldID,
                        view: "richselect",
                        label: `<span style='opacity: 0.6;' class='webix_icon fa fa-calendar'></span> ${L(
                           "Start Date"
                        )}`,
                        placeholder: L("Select a date field"),
                        labelWidth: 130,
                        name: "startDateFieldID",
                        required: true,
                        options: [],
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.syncCommonLists(
                                 [ids.startDateFieldID, ids.endDateFieldID],
                                 this._dateFields
                              );
                           },
                        },
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 30,
                        click: () => {
                           this._autoSelectInput = ids.startDateFieldID;
                           this.emit("new.field", ABFieldDate.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.endDateFieldID,
                        view: "richselect",
                        label: `<span style='opacity: 0.6;' class='webix_icon fa fa-calendar'></span> ${L(
                           "End Date"
                        )}`,
                        placeholder: L("Select a date field"),
                        labelWidth: 130,
                        name: "endDateFieldID",
                        options: [],
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.syncCommonLists(
                                 [ids.startDateFieldID, ids.endDateFieldID],
                                 this._dateFields
                              );
                           },
                        },
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 30,
                        click: () => {
                           this._autoSelectInput = ids.endDateFieldID;
                           this.emit("new.field", ABFieldDate.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.durationFieldID,
                        view: "richselect",
                        label: `<span style='opacity: 0.6;' class='webix_icon fa fa-hashtag'></span> ${L(
                           "Duration"
                        )}`,
                        placeholder: L("Select a number field"),
                        labelWidth: 130,
                        name: "durationFieldID",
                        options: [],
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.syncCommonLists(
                                 [ids.durationFieldID, ids.progressFieldID],
                                 this._numberFields
                              );
                           },
                        },
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 30,
                        click: () => {
                           this._autoSelectInput = ids.durationFieldID;
                           this.emit("new.field", ABFieldNumber.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.progressFieldID,
                        view: "richselect",
                        label: `<span style='opacity: 0.6;' class='webix_icon fa fa-hashtag'></span> ${L(
                           "Progress"
                        )}`,
                        placeholder: L("Select a number field"),
                        labelWidth: 130,
                        name: "progressFieldID",
                        required: false,
                        options: [],
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.syncCommonLists(
                                 [ids.durationFieldID, ids.progressFieldID],
                                 this._numberFields
                              );
                           },
                        },
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 30,
                        click: () => {
                           this._autoSelectInput = ids.progressFieldID;
                           this.emit("new.field", ABFieldNumber.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.notesFieldID,
                        view: "richselect",
                        label: `<span style='opacity: 0.6;' class='webix_icon fa fa-align-right'></span> ${L(
                           "Notes"
                        )}`,
                        placeholder: L("Select a string field"),
                        labelWidth: 130,
                        name: "notesFieldID",
                        required: false,
                        options: [],
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.syncCommonLists(
                                 [ids.titleFieldID, ids.notesFieldID],
                                 this._stringFields
                              );
                           },
                        },
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 30,
                        click: () => {
                           this._autoSelectInput = ids.notesFieldID;
                           this.emit(
                              "new.field",
                              ABFieldLongText.defaults().key
                           );
                        },
                     },
                  ],
               },
            ],
         };
      }

      init(object, view) {
         this.objectLoad(object);
         this._view = view;
         this.refreshOptions(object, view?.settings);
      }

      validate($form) {
         const ids = this.ids;
         const endDateFieldID =
            $$(ids.endDateFieldID).getValue() ||
            defaultValues.settings.endDateFieldID;
         const durationFieldID =
            $$(ids.durationFieldID).getValue() ||
            defaultValues.settings.durationFieldID;

         if (!endDateFieldID && !durationFieldID) {
            $form.markInvalid("endDateFieldID", "Required");
            $form.markInvalid("durationFieldID", "Required");

            return false;
         }

         return true;
      }

      values() {
         const ids = this.ids;

         const result = {};

         result.titleFieldID =
            $$(ids.titleFieldID).getValue() ||
            defaultValues.settings.titleFieldID;
         result.startDateFieldID =
            $$(ids.startDateFieldID).getValue() ||
            defaultValues.settings.startDateFieldID;
         result.endDateFieldID =
            $$(ids.endDateFieldID).getValue() ||
            defaultValues.settings.endDateFieldID;
         result.durationFieldID =
            $$(ids.durationFieldID).getValue() ||
            defaultValues.settings.durationFieldID;
         result.progressFieldID =
            $$(ids.progressFieldID).getValue() ||
            defaultValues.settings.progressFieldID;
         result.notesFieldID =
            $$(ids.notesFieldID).getValue() ||
            defaultValues.settings.notesFieldID;

         return result;
      }

      /**
       * @method fromObj
       * take our persisted data, and properly load it
       * into this object instance.
       * @param {json} data  the persisted data
       */
      fromSettings(data) {
         for (const key in defaultValues)
            this[v] = data[key] || defaultValues[key];

         this.settings = Object.assign(
            {},
            defaultValues.settings,
            data.settings ?? {}
         );

         this.type = this.type();
      }

      /**
       * @method toObj()
       * compile our current state into a {json} object
       * that can be persisted.
       */
      toSettings() {
         const obj = {}; //super.toObj();

         for (const key in defaultValues)
            obj[key] = this[key] || defaultValues[key];

         obj.settings = Object.assign(
            {},
            defaultValues.settings,
            obj.settings ?? {}
         );
         obj.key = this.type();
         obj.type = this.type();

         return obj;
      }
   }

   return new ABObjectWorkspaceViewGantt(ibase);
}
