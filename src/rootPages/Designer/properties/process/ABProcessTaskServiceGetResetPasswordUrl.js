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
   var L = UIClass.L();

   class UIProcessServiceGetResetPasswordUrl extends UIClass {
      constructor() {
         super("properties_process_service_getResetPasswordUrl", {
            name: "",
            email: "",
            url: "",
         });
      }

      static get key() {
         return "GetResetPasswordUrl";
      }
      // {string}
      // This should match the ABProcessTriggerLifecycleCore.defaults().key value.

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
                  name: "name",
                  value: "",
               },
               {
                  id: ids.email,
                  view: "text",
                  label: L("Email"),
                  placeholder: L("Type email address here..."),
                  name: "email",
                  value: "",
               },
               {
                  id: ids.url,
                  view: "text",
                  label: L("URL"),
                  name: "url",
                  value: "",
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

         const $name = $$(ids.name);
         const $email = $$(ids.email);
         const $url = $$(ids.url);

         $name.setValue(element.label);
         $email.setValue(element.email);
         $url.setValue(element.url);
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
         const $url = $$(ids.url);

         obj.label = $name?.getValue() ?? "";
         obj.name = $name?.getValue() ?? "";
         obj.email = $email?.getValue() ?? "";
         obj.url = $url?.getValue() ?? "";

         return obj;
      }
   }

   return UIProcessServiceGetResetPasswordUrl;
}
