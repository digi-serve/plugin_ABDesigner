/*
 * UIProcessTaskServiceQuery
 *
 * Display the form for entering the properties for a new
 * ServiceGetResetPasswordUrl Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();
   const uiConfig = AB.Config.uiSettings();

   class UIProcessServiceQuery extends UIClass {
      constructor() {
         super("properties_process_service_query", {
            name: "",
            query: "",
            suggestions: "",
         });
      }

      static get key() {
         return "TaskServiceQuery";
      }
      // {string}
      // This should match the ABProcessTaskServiceQueryCore.defaults().key value.

      ui() {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.

         const ids = this.ids;
         return {
            id: ids.component,
            view: "form",
            elements: [
               {
                  id: ids.name,
                  view: "text",
                  label: L("Name"),
                  labelWidth: uiConfig.labelWidthLarge,
                  name: "name",
                  value: this.name,
               },
               {
                  id: ids.query,
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         return Promise.resolve();
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

         const Builder = element
            .ABQLManager()
            .builder(element.qlObj, element, this.AB);

         const $name = $$(ids.name);

         this.element = element;

         webix.ui(Builder.ui(ids.query), $$(ids.query));
         Builder.init(ids.query);

         $name.setValue(element.label);
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */

      values() {
         const obj = {};
         const ids = this.ids;

         const $name = $$(ids.name);

         obj.label = $name.getValue() ?? "";
         obj.name = $name.getValue() ?? "";
         obj.qlObj =
            this.element
               .ABQLManager()
               .parse(ids.query, this.element, this.AB) ?? null;

         return obj;
      }
   }

   return UIProcessServiceQuery;
}
