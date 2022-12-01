/*
 * ABProcessTaskSubProcess.js
 *
 * Display the form for creating a sub process task in ABDesigner.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();
   const uiConfig = AB.Config.uiSettings();

   class ABProcessTaskSubProcess extends UIClass {
      constructor() {
         super("properties_process_subprocess", {
            name: "",
            isEnable: "",
            parameterId: "",
         });
      }

      static get key() {
         return "SubProcess";
      }
      // {string}
      // This should match the ABProcessTaskSubProcessCore.defaults().key value.

      ui() {
         let ids = this.ids;

         return {
            id: ids.component,
            view: "form",
            elementsConfig: {
               labelWidth: 120,
            },
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
                  id: ids.isEnable,
                  view: "switch",
                  label: L("Enable"),
                  value: false,
               },
               {
                  id: ids.parameterId,
                  view: "richselect",
                  label: L("Repeat for"),
                  options: [{ id: "", value: "" }], // empty placeholder
                  value: "",
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         return Promise.resolve();
      }

      /**
       * @method populate()
       * given an instance of our process element, we populate our form with
       * the current values.
       * @param {ABProcessTaskSubProcess} element
       *        An instance of one of our ABProcessTaskSubProcess elements.
       */
      populate(element) {
         let ids = this.ids;

         // Pull query tasks option list
         let parameterOptions = (
            element.process.processDataFields(element) || []
         ).map((item) => {
            return {
               id: item.key,
               value: item.label,
            };
         });

         let $Params = $$(ids.parameterId);
         $Params.define("options", parameterOptions);
         $Params.refresh();

         $$(ids.name).setValue(element.name);
         $$(ids.isEnable).setValue(element.isEnable);
         $Params.setValue(element.parameterId);
      }

      /**
       * @method values()
       * return an object hash representing the values for this component.
       * @return {json}
       */
      values() {
         const obj = {};
         const ids = this.ids;
         obj.name = $$(ids.name)?.getValue();
         obj.label = obj.name;
         obj.isEnable = $$(ids.isEnable)?.getValue();
         obj.parameterId = $$(ids.parameterId)?.getValue();

         return obj;
      }
   }

   return ABProcessTaskSubProcess;
}
