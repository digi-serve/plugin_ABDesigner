/*
 * ABProcessEnd
 *
 * Display the form for entering the properties for a new
 * End Task.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UIProcessEnd extends UIClass {
      constructor() {
         super("properties_process_end", {
            name: "",
         });
      }

      static key = "End";
      // {string}
      // This should match the ABProcessTriggerLifecycleCore.defaults().key value.

      ui() {
         let ids = this.ids;
         return {
            view: "form",
            id: ids.component,
            elements: [
               {
                  id: ids.name,
                  view: "text",
                  label: L("Name"),
                  name: "name",
                  value: "",
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         return Promise.resolve();
      }


      populate(element) {
         let ids = this.ids;
         $$(ids.name).setValue(element.name);
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */
      values() {
         var obj = {};
         var ids = this.ids;
         obj.label = $$(ids.name)?.getValue();
         return obj;
      }
   }

   return UIProcessEnd;
}
