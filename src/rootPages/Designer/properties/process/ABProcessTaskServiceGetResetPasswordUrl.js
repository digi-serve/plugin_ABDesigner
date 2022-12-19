/*
 * UIProcessTaskServiceGetResetPasswordUrl
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

   class UIProcessServiceGetResetPasswordUrl extends UIClass {
      constructor() {
         super("properties_process_service_getResetPasswordUrl", {
            name: "",
            email: "",
         });
      }

      static get key() {
         return "GetResetPasswordUrl";
      }
      // {string}
      // This should match the ABProcessTaskServiceGetResetPasswordUrlCore.defaults().key value.

      ui() {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.

         const ids = this.ids;

         return {
            id: ids.component,
            view: "form",
            rows: [
               {
                  id: ids.name,
                  view: "text",
                  label: L("Name"),
                  labelWidth: uiConfig.labelWidthLarge,
                  name: "name",
                  value: "",
               },
               {
                  id: ids.email,
                  view: "multicombo",
                  label: L("Email"),
                  name: "email",
                  options: [],
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
         const processData = (element.process.processDataFields(element) ?? [])
            .filter((item) => item.field?.key == "email")
            .map((item) => {
               return {
                  id: item.key,
                  value: item.label,
               };
            });

         const ids = this.ids;

         const $name = $$(ids.name);
         const $email = $$(ids.email);

         $name.setValue(element.label);
         $email.setValue(element.email);
         $email.define("options", processData);
         $email.refresh();
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
         const $email = $$(ids.email);

         obj.label = $name?.getValue() ?? "";
         obj.name = $name?.getValue() ?? "";
         obj.email = $email?.getValue() ?? "";

         return obj;
      }
   }

   return UIProcessServiceGetResetPasswordUrl;
}
