/*
 * UIProcessTriggerLifecycle
 *
 * Display the form for entering the properties for a new
 * Lifecycle Trigger.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UIProcessTriggerLifecycle extends UIClass {
      constructor() {
         super("properties_process_trigger_lifecycle", {
            name: "",
            objList: "",
            lifecycleList: "",
         });
      }

      static get key() {
         return "TriggerLifecycle";
      }
      // {string}
      // This should match the ABProcessTriggerLifecycleCore.defaults().key value.

      ui() {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.
         const allObjects = this.CurrentApplication.objectsIncluded();
         const listObj = [];

         allObjects.forEach((obj) => {
            listObj.push({ id: obj.id, value: obj.label });
         });

         const ids = this.ids;

         return {
            id: ids.component,
            rows: [
               { view: "label", label: L("Object Lifecycle Trigger:") },
               {
                  view: "label",
                  label: L(
                     "Begins a process when an object's data is Added, Updated or Deleted."
                  ),
               },
               {
                  view: "form",
                  id: ids.component,
                  elements: [
                     {
                        id: ids.name,
                        view: "text",
                        label: L("Name"),
                        labelWidth: 100,
                        name: "name",
                        value: "",
                     },
                     {
                        id: ids.objList,
                        view: "select",
                        label: L("Object"),
                        // value: this.objectID,
                        options: listObj,
                     },
                     {
                        id: ids.lifecycleList,
                        view: "select",
                        label: L("lifecycle"),
                        // value: this.lifecycleKey,
                        options: [
                           { id: "added", value: L("after Add") },
                           { id: "updated", value: L("after Update") },
                           { id: "deleted", value: L("after Delete") },
                        ],
                     },
                  ],
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
         $$(ids.objList).setValue(element.objectID);
         $$(ids.lifecycleList).setValue(element.lifecycleKey);
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */
      values() {
         const obj = {};
         const ids = this.ids;

         obj.label = $$(ids.name)?.getValue();
         obj.objectID = $$(ids.objList)?.getValue();
         obj.lifecycleKey = $$(ids.lifecycleList)?.getValue();
         obj.triggerKey = `${obj.objectID}.${obj.lifecycleKey}`;

         return obj;
      }
   }

   return UIProcessTriggerLifecycle;
}
