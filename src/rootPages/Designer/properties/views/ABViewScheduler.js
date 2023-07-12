/*
 * ABViewScheduler
 * A Property manager for our ABViewScheduler definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_scheduler";

   const ABView = FABView(AB);
   const L = ABView.L();
   const uiConfig = AB.UISettings.config();

   class ABViewSchedulerProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            dataviewID: "",

            dataviewFieldsLabel: "",
            dataviewFields: "",
            fieldName: "",
            fieldStart: "",
            fieldEnd: "",
            fieldAllDay: "",
            fieldRepeat: "",
            fieldCalendar: "",
            fieldEventColor: "",
            fieldSectionID: "",
            fieldUnitID: "",
            fieldNotes: "",
            fieldOriginID: "",

            calendarDataviewID: "",

            calendarDataviewFieldsLabel: "",
            calendarDataviewFields: "",
            fieldTitle: "",
            fieldCalendarColor: "",
            fieldActive: "",

            timeline: "",
            export: "",
            sectionAdd: "",
            timelineSectionList: "",
            unitAdd: "",
            unitList: "",
            readonly: "",
         });
      }

      static get key() {
         return "scheduler";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.dataviewID,
               name: "dataviewID",
               view: "richselect",
               label: L("Data Source"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: (newValue, oldValue) => {
                     if (newValue === oldValue) return;

                     this.getDataviewFieldOptions(newValue);
                     this.onChange();
                  },
               },
            },
            {
               id: ids.dataviewFieldsLabel,
               view: "label",
               label: L("Dataview Fields"),
               hidden: true,
            },
            {
               id: ids.dataviewFields,
               view: "form",
               hidden: true,
               elements: [
                  {
                     id: ids.fieldName,
                     view: "richselect",
                     name: "name",
                     label: L("Event"),
                     placeholder: L("Single line text"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldStart,
                     view: "richselect",
                     name: "start",
                     label: L("Start"),
                     placeholder: L("Date & Time"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldEnd,
                     view: "richselect",
                     name: "end",
                     label: L("End"),
                     placeholder: L("Date & Time"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldAllDay,
                     view: "richselect",
                     name: "allDay",
                     label: L("All day"),
                     placeholder: L("Checkbox"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldRepeat,
                     view: "richselect",
                     name: "repeat",
                     label: L("Repeat"),
                     placeholder: L("Single line text"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldCalendar,
                     view: "richselect",
                     name: "calendar",
                     label: L("Calendar"),
                     placeholder: L("Connect to another record (One to Many)"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldEventColor,
                     view: "richselect",
                     name: "color",
                     label: L("Color"),
                     placeholder: L("Single line text"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldSectionID,
                     view: "richselect",
                     name: "sectionID",
                     label: L("Section ID"),
                     placeholder: L("Single line text"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldUnitID,
                     view: "richselect",
                     name: "unitID",
                     label: L("Unit ID"),
                     placeholder: L("Single line text"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldNotes,
                     view: "richselect",
                     name: "notes",
                     label: L("Notes"),
                     placeholder: L("Long text"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldOriginID,
                     view: "richselect",
                     name: "originID",
                     label: L("Origin ID"),
                     placeholder: L("Number"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
               ],
               on: {
                  onChange: (newValue, oldValue) => {
                     if (newValue === oldValue) return;

                     this.onChange();
                  },
               },
            },
            {
               id: ids.calendarDataviewID,
               view: "richselect",
               name: "calendarDataviewID",
               label: L("Calendar Data Source"),
               labelWidth: uiConfig.labelWidthLarge,
               hidden: true,
               on: {
                  onChange: (newValue, oldValue) => {
                     if (newValue === oldValue) return;

                     this.getCalendarDataviewFieldOptions(newValue);
                     this.onChange();
                  },
               },
            },
            {
               id: ids.calendarDataviewFieldsLabel,
               view: "label",
               label: L("Calendar Dataview Fields"),
               hidden: true,
            },
            {
               id: ids.calendarDataviewFields,
               view: "form",
               hidden: true,
               elements: [
                  {
                     id: ids.fieldTitle,
                     view: "richselect",
                     name: "title",
                     label: L("Title"),
                     placeholder: L("Single line text"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldCalendarColor,
                     view: "richselect",
                     name: "color",
                     label: L("Color"),
                     placeholder: L("Single line text"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldActive,
                     view: "richselect",
                     name: "active",
                     label: L("Active"),
                     placeholder: L("Checkbox"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
               ],
               on: {
                  onChange: (newValue, oldValue) => {
                     if (newValue === oldValue) return;

                     this.onChange();
                  },
               },
            },
            {
               view: "label",
               label: L("Timeline"),
            },
            {
               id: ids.timeline,
               view: "form",
               elements: [
                  {
                     name: "day",
                     view: "checkbox",
                     label: L("Day"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     name: "week",
                     view: "checkbox",
                     label: L("Week"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     name: "month",
                     view: "checkbox",
                     label: L("Month"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     name: "year",
                     view: "checkbox",
                     label: L("Year"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     name: "agenda",
                     view: "checkbox",
                     label: L("Agenda"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     name: "timeline",
                     view: "checkbox",
                     label: L("Timeline"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     name: "units",
                     view: "checkbox",
                     label: L("Units"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
               ],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               view: "label",
               label: L("Timeline Section List"),
            },
            {
               cols: [
                  {
                     id: ids.sectionAdd,
                     view: "text",
                     placeholder: L('Name of Section (not include ",")'),
                  },
                  {
                     view: "button",
                     label: L("Add"),
                     maxWidth: 100,
                     click: () => {
                        const value = $$(ids.sectionAdd).getValue();

                        if (value === "" || value.includes(",")) return;

                        const $timelineSectionList = $$(
                           ids.timelineSectionList
                        );

                        if (
                           $timelineSectionList.data.find(
                              (e) => e.value === value
                           ).length > 0
                        )
                           return;

                        $timelineSectionList.data.add({
                           value,
                        });
                        this.onChange();
                     },
                  },
               ],
            },
            {
               id: ids.timelineSectionList,
               view: "list",
               height: 200,
               select: "multiselect",
               template: "#value#",
               data: [],
            },
            {
               cols: [
                  {
                     view: "button",
                     label: L("Delete"),
                     click: () => {
                        const $timelineSectionList = $$(
                           ids.timelineSectionList
                        );

                        $timelineSectionList.remove(
                           $timelineSectionList.getSelectedId()
                        );
                        this.onChange();
                     },
                  },
                  {
                     view: "button",
                     label: L("Delete All"),
                     click: () => {
                        $$(ids.timelineSectionList).clearAll();
                        this.onChange();
                     },
                  },
               ],
            },
            {
               view: "label",
               label: L("Unit List"),
            },
            {
               cols: [
                  {
                     id: ids.unitAdd,
                     view: "text",
                     placeholder: L('Name of Unit (not include ",")'),
                  },
                  {
                     view: "button",
                     label: L("Add"),
                     maxWidth: 100,
                     click: () => {
                        const value = $$(ids.unitAdd).getValue();

                        if (value === "" || value.includes(",")) return;

                        const $unitList = $$(ids.unitList);

                        if (
                           $unitList.data.find((e) => e.value === value)
                              .length > 0
                        )
                           return;

                        $unitList.data.add({
                           value,
                        });
                        this.onChange();
                     },
                  },
               ],
            },
            {
               id: ids.unitList,
               view: "list",
               height: 200,
               select: "multiselect",
               template: "#value#",
               data: [],
            },
            {
               cols: [
                  {
                     view: "button",
                     label: L("Delete"),
                     click: () => {
                        const $unitList = $$(ids.unitList);

                        $unitList.remove($unitList.getSelectedId());
                        this.onChange();
                     },
                  },
                  {
                     view: "button",
                     label: L("Delete All"),
                     click: () => {
                        $$(ids.unitList).clearAll();
                        this.onChange();
                     },
                  },
               ],
            },
            {
               view: "label",
               label: L("Export"),
            },
            {
               id: ids.export,
               view: "form",
               elements: [
                  {
                     name: "excel",
                     view: "checkbox",
                     label: L("Excel"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     name: "csv",
                     view: "checkbox",
                     label: L("CSV"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     name: "pdf",
                     view: "checkbox",
                     label: L("PDF"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
               ],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.readonly,
               name: "readonly",
               view: "checkbox",
               label: L("Read only"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);

         const ids = this.ids;
         const $dataviewID = $$(ids.dataviewID);

         $dataviewID.define(
            "options",
            this.CurrentApplication.datacollectionsIncluded().map((dc) => {
               return { id: dc.id, value: dc.label };
            })
         );
         $dataviewID.refresh();
      }

      getDataviewFieldOptions(dataviewID) {
         const ids = this.ids;
         const $fieldName = $$(ids.fieldName);
         const $fieldStart = $$(ids.fieldStart);
         const $fieldEnd = $$(ids.fieldEnd);
         const $fieldAllDay = $$(ids.fieldAllDay);
         const $fieldRepeat = $$(ids.fieldRepeat);
         const $fieldCalendar = $$(ids.fieldCalendar);
         const $fieldEventColor = $$(ids.fieldEventColor);
         const $fieldSectionID = $$(ids.fieldSectionID);
         const $fieldUnitID = $$(ids.fieldUnitID);
         const $fieldNotes = $$(ids.fieldNotes);
         const $fieldOriginID = $$(ids.fieldOriginID);
         const $dataviewFieldsLabel = $$(ids.dataviewFieldsLabel);
         const $dataviewFields = $$(ids.dataviewFields);
         const $calendarDataviewID = $$(ids.calendarDataviewID);
         const defaultValues = this.defaultValues();

         $calendarDataviewID.setValue(defaultValues.calendarDataviewID);
         this.getCalendarDataviewFieldOptions("");

         if (!dataviewID) {
            $calendarDataviewID.define("options", []);
            $calendarDataviewID.refresh();
            $fieldName.define("options", []);
            $fieldName.refresh();
            $fieldStart.define("options", []);
            $fieldStart.refresh();
            $fieldEnd.define("options", []);
            $fieldEnd.refresh();
            $fieldAllDay.define("options", []);
            $fieldAllDay.refresh();
            $fieldRepeat.define("options", []);
            $fieldRepeat.refresh();
            $fieldCalendar.define("options", []);
            $fieldCalendar.refresh();
            $fieldEventColor.define("options", []);
            $fieldEventColor.refresh();
            $fieldSectionID.define("options", []);
            $fieldSectionID.refresh();
            $fieldUnitID.define("options", []);
            $fieldUnitID.refresh();
            $fieldNotes.define("options", []);
            $fieldNotes.refresh();
            $fieldOriginID.define("options", []);
            $fieldOriginID.refresh();
            $dataviewFieldsLabel.hide();
            $dataviewFields.hide();
            $dataviewFields.setValues(defaultValues.dataviewFields);
            $calendarDataviewID.hide();

            return;
         }

         $dataviewFieldsLabel.show();
         $dataviewFields.show();
         $calendarDataviewID.show();

         const obj = this.AB.datacollectionByID(dataviewID).datasource;
         const connect12MFields = obj.fields(
            (f) =>
               f.key === "connectObject" &&
               f.settings.linkType === "one" &&
               f.settings.linkViaType === "many"
         );

         $fieldCalendar.define(
            "options",
            connect12MFields.map((e) => {
               return { id: e.id, value: e.label };
            })
         );
         $fieldCalendar.refresh();

         const linkObjectIDs = connect12MFields.map(
            (e) => e.settings.linkObject
         );
         const calendarDataviews = [];

         linkObjectIDs.forEach((objID) => {
            calendarDataviews.push(
               ...this.CurrentApplication.datacollectionsIncluded().filter(
                  (dc) => dc.settings.datasourceID === objID
               )
            );
         });

         $calendarDataviewID.define(
            "options",
            calendarDataviews.map((e) => {
               return { id: e.id, value: e.label };
            })
         );
         $calendarDataviewID.refresh();
         $fieldName.define(
            "options",
            obj
               .fields((f) => f.key === "string")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldName.refresh();
         $fieldStart.define(
            "options",
            obj
               .fields((f) => f.key === "datetime")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldStart.refresh();
         $fieldEnd.define(
            "options",
            obj
               .fields((f) => f.key === "datetime")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldEnd.refresh();
         $fieldAllDay.define(
            "options",
            obj
               .fields((f) => f.key === "boolean")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldAllDay.refresh();
         $fieldRepeat.define(
            "options",
            obj
               .fields((f) => f.key === "string")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldRepeat.refresh();
         $fieldEventColor.define(
            "options",
            obj
               .fields((f) => f.key === "string")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldEventColor.refresh();
         $fieldSectionID.define(
            "options",
            obj
               .fields((f) => f.key === "string")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldSectionID.refresh();
         $fieldUnitID.define(
            "options",
            obj
               .fields((f) => f.key === "string")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldUnitID.refresh();
         $fieldNotes.define(
            "options",
            obj
               .fields((f) => f.key === "LongText")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldNotes.refresh();
         $fieldOriginID.define(
            "options",
            obj
               .fields((f) => f.key === "number")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldOriginID.refresh();
      }

      getCalendarDataviewFieldOptions(dataviewID) {
         const ids = this.ids;
         const $fieldTitle = $$(ids.fieldTitle);
         const $fieldCalendarColor = $$(ids.fieldCalendarColor);
         const $fieldActive = $$(ids.fieldActive);
         const $calendarDataviewFieldsLabel = $$(
            ids.calendarDataviewFieldsLabel
         );
         const $calendarDataviewFields = $$(ids.calendarDataviewFields);

         if (!dataviewID) {
            $fieldTitle.define("options", []);
            $fieldTitle.refresh();
            $fieldCalendarColor.define("options", []);
            $fieldCalendarColor.refresh();
            $fieldActive.define("options", []);
            $fieldActive.refresh();
            $calendarDataviewFieldsLabel.hide();
            $calendarDataviewFields.setValues(
               this.defaultValues().calendarDataviewFields
            );
            $calendarDataviewFields.hide();

            return;
         }

         $calendarDataviewFieldsLabel.show();
         $calendarDataviewFields.show();

         const obj = this.AB.datacollectionByID(dataviewID).datasource;

         $fieldTitle.define(
            "options",
            obj
               .fields((f) => f.key === "string")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldTitle.refresh();
         $fieldCalendarColor.define(
            "options",
            obj
               .fields((f) => f.key === "string")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldCalendarColor.refresh();
         $fieldActive.define(
            "options",
            obj
               .fields((f) => f.key === "boolean")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldActive.refresh();
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const defaultValues = this.defaultValues();

         Object.keys(view.settings).forEach((key) => {
            const $key = $$(ids[key]);

            if (typeof view.settings[key] !== "object") {
               switch (key) {
                  case "timelineSectionList":
                  case "unitList":
                     if (view.settings[key] === "") break;

                     view.settings[key].split(", ").forEach((e) => {
                        $$(ids[key]).data.add({ value: e });
                     });

                     break;

                  default:
                     $key.setValue(view.settings[key]);

                     break;
               }

               return;
            }

            switch (key) {
               case "dataviewFields":
                  {
                     const $dataviewFieldsLabel = $$(ids.dataviewFieldsLabel);
                     const $dataviewFields = $$(ids[key]);
                     const $calendarDataviewID = $$(ids.calendarDataviewID);

                     if (!view.settings.dataviewID) {
                        $dataviewFields.setValues(defaultValues[key]);
                        $calendarDataviewID.setValue(
                           defaultValues.calendarDataviewID
                        );
                        $dataviewFieldsLabel.hide();
                        $dataviewFields.hide();
                        $calendarDataviewID.hide();

                        return;
                     }

                     $dataviewFieldsLabel.show();
                     $dataviewFields.show();
                     $calendarDataviewID.show();
                  }

                  break;

               case "calendarDataviewFields":
                  {
                     const $calendarDataviewFieldsLabel = $$(
                        ids.calendarDataviewFieldsLabel
                     );
                     const $calendarDataviewFields = $$(
                        ids.calendarDataviewFields
                     );

                     if (
                        !view.settings.dataviewID ||
                        !view.settings.calendarDataviewID
                     ) {
                        $calendarDataviewFields.setValues(defaultValues[key]);
                        $calendarDataviewFieldsLabel.hide();
                        $calendarDataviewFields.hide();

                        return;
                     }

                     $calendarDataviewFieldsLabel.show();
                     $calendarDataviewFields.show();
                  }

                  break;
            }

            $key.setValues(view.settings[key]);
         });
      }

      defaultValues() {
         return this.ViewClass()?.defaultValues() || {};
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const values = super.values();
         const defaultValues = this.defaultValues();

         values.settings = Object.assign(
            {},
            defaultValues,
            $$(this.ids.component).getValues()
         );

         const ids = this.ids;

         values.settings.dataviewFields = values.settings.dataviewID
            ? $$(ids.dataviewFields).getValues()
            : defaultValues.dataviewFields;
         values.settings.calendarDataviewFields = values.settings
            .calendarDataviewID
            ? $$(ids.calendarDataviewFields).getValues()
            : defaultValues.calendarDataviewFields;
         values.settings.timeline = $$(ids.timeline).getValues();
         values.settings.timelineSectionList = $$(ids.timelineSectionList)
            .data.find(() => true)
            .map((e) => e.value)
            .join(", ");
         values.settings.unitList = $$(ids.unitList)
            .data.find(() => true)
            .map((e) => e.value)
            .join(", ");
         values.settings.export = $$(ids.export).getValues();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("scheduler");
      }
   }

   return ABViewSchedulerProperty;
}
