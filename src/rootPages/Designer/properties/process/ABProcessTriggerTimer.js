/*
 * UIProcessTriggerTimer
 *
 * Display the form for entering the properties for a new
 * Timer Trigger.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();
   const uiConfig = AB.Config.uiSettings();

   class UIProcessTriggerTimer extends UIClass {
      constructor() {
         super("properties_process_trigger_lifecycle", {
            name: "",
            repeatEvery: "",
            repeatTime: "",
            repeatOnPanel: "",
            repeatDaily: "",
            repeatWeekly: "",
            repeatMonthly: "",
            isEnabled: "",
            triggerKey: "",
         });
      }

      static get key() {
         return "TimerStartEvent";
      }
      // {string}
      // This should match the ABProcessTriggerTimerCore.defaults().key value.

      ui() {
         let ids = this.ids;

         let dayOptions = [];
         for (let day = 1; day <= 31; day++) {
            dayOptions.push({
               id: day,
               value: day,
            });
         }
         // dayOptions.push({
         //    id: "L",
         //    value: "Last"
         // });

         return {
            view: "form",
            id: ids.component,
            elements: [
               {
                  id: ids.name,
                  view: "text",
                  label: L("Name"),
                  labelWidth: uiConfig.labelWidthLarge,
                  name: "name",
                  value: "",
               },
               {
                  id: ids.repeatEvery,
                  view: "richselect",
                  name: "repeatEvery",
                  label: L("Repeat every"),
                  labelWidth: uiConfig.labelWidthLarge,
                  value: defaultValues.repeatEvery,
                  options: [
                     { id: "daily", value: L("Daily") },
                     {
                        id: "weekly",
                        value: L("Weekly"),
                     },
                     {
                        id: "monthly",
                        value: L("Monthly"),
                     },
                  ],
                  on: {
                     onChange: (repeatEvery) => {
                        $$(ids.repeatOnPanel).showBatch(repeatEvery);
                     },
                  },
               },
               {
                  id: ids.repeatTime,
                  view: "datepicker",
                  name: "repeatTime",
                  label: L("Time"),
                  labelWidth: uiConfig.labelWidthLarge,
                  value: defaultValues.repeatTime,
                  timepicker: true,
                  type: "time",
                  multiselect: false,
               },
               {
                  view: "multiview",
                  id: ids.repeatOnPanel,
                  cells: [
                     {
                        view: "radio",
                        id: ids.repeatDaily,
                        label: " ",
                        labelWidth: uiConfig.labelWidthLarge,
                        batch: "daily",
                        vertical: true,
                        value: defaultValues.repeatDaily,
                        options: [
                           { id: "day", value: L("Day") },
                           { id: "weekday", value: L("Weekday") },
                        ],
                     },
                     {
                        view: "multiselect",
                        id: ids.repeatWeekly,
                        labelWidth: uiConfig.labelWidthLarge,
                        label: L("Every week on:"),
                        batch: "weekly",
                        value: defaultValues.repeatWeekly,
                        options: [
                           {
                              id: "SUN",
                              value: L("Sunday"),
                           },
                           {
                              id: "MON",
                              value: L("Monday"),
                           },
                           {
                              id: "TUE",
                              value: L("Tuesday"),
                           },
                           {
                              id: "WED",
                              value: L("Wednesday"),
                           },
                           {
                              id: "THU",
                              value: L("Thursday"),
                           },
                           {
                              id: "FRI",
                              value: L("Friday"),
                           },
                           {
                              id: "SAT",
                              value: L("Saturday"),
                           },
                        ],
                     },
                     {
                        view: "layout",
                        batch: "monthly",
                        rows: [
                           {
                              id: ids.repeatMonthly,
                              view: "richselect",
                              labelWidth: uiConfig.labelWidthLarge,
                              label: L("Monthly on day"),
                              options: dayOptions,
                              value: defaultValues.repeatMonthly,
                           },
                        ],
                     },
                  ],
               },
               {
                  id: ids.isEnabled,
                  view: "switch",
                  label: L("Enable"),
                  labelWidth: uiConfig.labelWidthLarge,
                  value: defaultValues.isEnabled,
               },
               {
                  id: ids.triggerKey,
                  view: "text",
                  hidden: true,
                  value: "triggerKey.??",
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;
      }

      // applicationLoad(application) {
      //    super.applicationLoad(application);

      //    $$(this.ids.objList).define("data", listObj);
      //    $$(this.ids.objList).refresh();
      // }

      // show() {
      //    super.show();
      //    AppList.show();
      // }

      populate(element) {
         const ids = this.ids;

         $$(ids.name).setValue(element.label);
         $$(ids.repeatEvery).setValue(element.repeatEvery);
         $$(ids.repeatTime).setValue(element.repeatTime);
         $$(ids.repeatDaily).setValue(element.repeatDaily);
         $$(ids.repeatWeekly).setValue(element.repeatWeekly);
         $$(ids.repeatMonthly).setValue(element.repeatMonthly);
         $$(ids.isEnabled).setValue(element.isEnabled);

         $$(ids.triggerKey).setValue(element.triggerKey);
         if (
            element.triggerKey == null ||
            element.triggerKey == "triggerKey.??"
         ) {
            $$(ids.triggerKey).setValue(
               `timer.${element.id || this.AB.uuid()}`
            );
         }
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */
      values() {
         const obj = {};
         const ids = this.ids;

         obj.label = $$(ids.name).getValue();
         obj.repeatEvery = $$(ids.repeatEvery).getValue();
         obj.repeatTime = $$(ids.repeatTime).getValue().toLocaleTimeString();
         obj.repeatDaily = $$(ids.repeatDaily).getValue();
         obj.repeatWeekly = $$(ids.repeatWeekly).getValue();
         obj.repeatMonthly = $$(ids.repeatMonthly).getValue();
         obj.isEnabled = $$(ids.isEnabled).getValue();

         obj.triggerKey = $$(ids.triggerKey)?.getValue();

         return obj;
      }
   }

   const defaultValues = AB.Class.ABProcessTaskManager.allTasks()
      .filter((e) => e.defaults().key == UIProcessTriggerTimer.key)[0]
      .defaults();
   // {json} The default Values from the ABProcessTriggerTimerCore
   // class definition.

   return UIProcessTriggerTimer;
}
