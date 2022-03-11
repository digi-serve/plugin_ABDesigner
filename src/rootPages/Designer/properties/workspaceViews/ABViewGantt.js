// ABObjectWorkspaceViewGantt.js
//
// Manages the settings for a Gantt Chart View in the AppBuilder Object Workspace

var defaultValues = {
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
   var L = UIClass.L();

   const ABFieldDate = AB.Class.ABFieldManager.fieldByKey("date");
   const ABFieldNumber = AB.Class.ABFieldManager.fieldByKey("number");
   const ABFieldString = AB.Class.ABFieldManager.fieldByKey("string");
   const ABFieldLongText = AB.Class.ABFieldManager.fieldByKey("LongText");

   class ABObjectWorkspaceViewGantt extends UIClass {
      constructor(idBase) {
         super(idBase, {
            title: "",
            startDate: "",
            endDate: "",
            duration: "",
            progress: "",
            notes: "",
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

      refreshOptions(object, view) {
         let ids = this.ids;

         let dateFields = object
            .fields((f) => f instanceof ABFieldDate)
            .map(({ id, label }) => ({ id, value: label }));

         // sort by value
         dateFields.sort((a, b) => (a.value > b.value ? 1 : -1));

         // Add default option
         dateFields.unshift({
            id: "none",
            value: L("Select a date field"),
         });
         this._dateFields = dateFields;

         // Start date
         $$(ids.startDate).define("options", dateFields);

         // // End date
         $$(ids.endDate).define("options", dateFields);

         // Duration
         let numberFields = object
            .fields((f) => f instanceof ABFieldNumber)
            .map(({ id, label }) => ({ id, value: label }));

         // sort by value
         numberFields.sort((a, b) => (a.value > b.value ? 1 : -1));

         // Add default option
         numberFields.unshift({
            id: "none",
            value: L("Select a number field"),
         });
         this._numberFields = numberFields;

         $$(ids.duration).define("options", numberFields);

         // Progress
         // let decimalFields = object
         //    .fields((f) => f instanceof ABFieldNumber)
         //    .map(({ id, label }) => ({ id, value: label }));

         // // sort by value
         // decimalFields.sort((a, b) => (a.value > b.value ? 1 : -1));

         // // Add default option
         // decimalFields.unshift({
         //    id: "none",
         //    value: L("Select a number field"),
         // });
         $$(ids.progress).define("options", numberFields);

         // Title & Notes
         let stringFields = object
            .fields(
               (f) => f instanceof ABFieldString || f instanceof ABFieldLongText
            )
            .map(({ id, label }) => ({ id, value: label }));

         // sort by value
         stringFields.sort((a, b) => (a.value > b.value ? 1 : -1));

         // Add default option
         stringFields.unshift({
            id: "none",
            value: L("Select a string field"),
         });
         this._stringFields = stringFields;

         $$(ids.title).define("options", stringFields);
         $$(ids.notes).define("options", stringFields);

         // Select view's values
         if (view && view.title) {
            $$(ids.title).define("value", view.title);
            $$(ids.title).refresh();
         }

         if (view && view.startDateFieldID) {
            $$(ids.startDate).define("value", view.startDateFieldID);
            $$(ids.startDate).refresh();
         }

         if (view && view.endDateFieldID) {
            $$(ids.endDate).define(
               "value",
               view.endDateFieldID || defaultValues.settings.endDateFieldID
            );
            $$(ids.endDate).refresh();
         }

         if (view && view.durationFieldID) {
            $$(ids.duration).define(
               "value",
               view.durationFieldID || defaultValues.settings.durationFieldID
            );
            $$(ids.duration).refresh();
         }

         if (view && view.progressFieldID) {
            $$(ids.progress).define("value", view.progressFieldID);
            $$(ids.progress).refresh();
         }

         if (view && view.notesFieldID) {
            $$(ids.notes).define("value", view.notesFieldID);
            $$(ids.notes).refresh();
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
            let otherVals = [];
            let otherIDs = commonIDs.filter((i) => i != idCurr);
            otherIDs.forEach((idOther) => {
               otherVals.push($$(idOther).getValue());
            });

            let $list = $$(idCurr);
            let newOptions = fullOptions.filter(
               (o) => otherVals.indexOf(o.id) == -1
            );
            $list.define("options", newOptions);
            $list.refresh();
         });
      }

      ui() {
         let ids = this.ids;

         // let labels = {
         //    common: App.labels,
         //    component: {
         //       title: L("ab.add_view.gantt.title", "*Title"),
         //       startDate: L("ab.add_view.gantt.startDate", "*Start Date"),
         //       endDate: L("ab.add_view.gantt.endDate", "*End Date"),
         //       duration: L("ab.add_view.gantt.duration", "*Duration"),
         //       progress: L("ab.add_view.gantt.progress", "*Progress"),
         //       notes: L("ab.add_view.gantt.notes", "*Notes"),

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

         // var PopupNewDataFieldComponent = new ABPopupNewDataField(
         //    App,
         //    idBase + "_gantt"
         // );

         return {
            batch: "gantt",
            rows: [
               {
                  cols: [
                     {
                        id: ids.title,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-calendar'></span> ${L(
                           "Title"
                        )}`,
                        placeholder: L("Select a string field"),
                        labelWidth: 130,
                        name: "titleFieldID",
                        options: [],
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.syncCommonLists(
                                 [ids.title, ids.notes],
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
                        width: 20,
                        click: () => {
                           this._autoSelectInput = ids.title;
                           this.emit("new.field", ABFieldString.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.startDate,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-calendar'></span> ${L(
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
                                 [ids.startDate, ids.endDate],
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
                        width: 20,
                        click: () => {
                           this._autoSelectInput = ids.startDate;
                           this.emit("new.field", ABFieldDate.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.endDate,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-calendar'></span> ${L(
                           "End Date"
                        )}`,
                        placeholder: L("Select a date field"),
                        labelWidth: 130,
                        name: "endDateFieldID",
                        options: [],
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.syncCommonLists(
                                 [ids.startDate, ids.endDate],
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
                        width: 20,
                        click: () => {
                           this._autoSelectInput = ids.endDate;
                           this.emit("new.field", ABFieldDate.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.duration,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-hashtag'></span> ${L(
                           "Duration"
                        )}`,
                        placeholder: L("Select a number field"),
                        labelWidth: 130,
                        name: "durationFieldID",
                        options: [],
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.syncCommonLists(
                                 [ids.duration, ids.progress],
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
                        width: 20,
                        click: () => {
                           this._autoSelectInput = ids.duration;
                           this.emit("new.field", ABFieldNumber.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.progress,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-hashtag'></span> ${L(
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
                                 [ids.duration, ids.progress],
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
                        width: 20,
                        click: () => {
                           this._autoSelectInput = ids.progress;
                           this.emit("new.field", ABFieldNumber.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.notes,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-align-right'></span> ${L(
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
                                 [ids.title, ids.notes],
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
                        width: 20,
                        click: () => {
                           this._autoSelectInput = ids.notes;
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
         this.refreshOptions(object, view);
      }

      validate($form) {
         let ids = this.ids;

         let endDate =
               $$(ids.endDate).getValue() ||
               defaultValues.settings.endDateFieldID,
            duration =
               $$(ids.duration).getValue() ||
               defaultValues.settings.durationFieldID;

         if (
            endDate == defaultValues.settings.endDateFieldID &&
            duration == defaultValues.settings.durationFieldID
         ) {
            $form.markInvalid("endDateFieldID", "Required");
            $form.markInvalid("duration", "Required");

            return false;
         } else {
            return true;
         }
      }

      values() {
         let ids = this.ids;

         let result = {};

         result.titleFieldID =
            $$(ids.title).getValue() || defaultValues.settings.titleFieldID;
         result.startDateFieldID =
            $$(ids.startDate).getValue() ||
            defaultValues.settings.startDateFieldID;
         result.endDateFieldID =
            $$(ids.endDate).getValue() || defaultValues.settings.endDateFieldID;
         result.durationFieldID =
            $$(ids.duration).getValue() ||
            defaultValues.settings.durationFieldID;
         result.progressFieldID =
            $$(ids.progress).getValue() ||
            defaultValues.settings.progressFieldID;
         result.notesFieldID =
            $$(ids.notes).getValue() || defaultValues.settings.notesFieldID;

         return result;
      }

      /**
       * @method fromObj
       * take our persisted data, and properly load it
       * into this object instance.
       * @param {json} data  the persisted data
       */
      fromSettings(data) {
         for (let v in defaultValues) {
            if (v != "settings") {
               this[v] = data[v] || defaultValues[v];
            }
         }
         this.settings = {};
         for (let v in defaultValues.settings) {
            this.settings[v] = data.settings?.[v] ?? defaultValues.settings[v];
         }

         this.type = this.type();
      }

      /**
       * @method toObj()
       * compile our current state into a {json} object
       * that can be persisted.
       */
      toSettings() {
         var obj = {}; //super.toObj();

         for (let v in defaultValues) {
            if (v != "settings") {
               obj[v] = this[v] || defaultValues[v];
            }
         }
         obj.settings = {};
         for (let s in defaultValues.settings) {
            obj.settings[s] = this.settings?.[s] || defaultValues.settings[s];
         }

         obj.key = this.type();
         obj.type = this.type();
         return obj;
      }
   }

   return new ABObjectWorkspaceViewGantt(ibase);
}
