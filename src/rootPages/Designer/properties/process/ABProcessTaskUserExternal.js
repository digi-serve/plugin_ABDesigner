/*
 * ABProcessTaskUserExternal
 *
 * Display the form for entering the properties for an External Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";
import FABProcessParticipant from "./ABProcessParticipant_selectManagersUI";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const ABProcessParticipantUsers = FABProcessParticipant(AB);

   class UIProcessUserExternal extends UIClass {
      constructor() {
         super("properties_process_user_external", {
            toUsers: "",
         });

         this.toUsers = new ABProcessParticipantUsers(
            `${this.ids.component}_to_`
         );
      }

      static get key() {
         return "External";
      }

      ui() {
         const ids = this.ids;

         return {
            id: ids.component,
            view: "form",
            elements: [
               {
                  view: "text",
                  label: L("Name"),
                  name: "name",
                  value: "",
               },
               {
                  view: "select",
                  label: L("Who"),
                  name: "who",
                  options: [
                     // current lane/participant
                     {
                        id: 0,
                        value: L("Current Participant"),
                     },
                     // manually select User/Role
                     {
                        id: 1,
                        value: L("Select Role or User"),
                     },
                  ],
                  value: "0",
                  on: {
                     onChange: (value) => {
                        const $toUsers = $$(ids.toUsers);
                        if (parseInt(value) === 1) $toUsers.show();
                        else $toUsers.hide();
                     },
                  },
               },
               {
                  id: ids.toUsers,
                  rows: [this.toUsers.ui({})],
               },
               {
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

      populate(element) {
         const ids = this.ids;
         const obj = {
            name: element.name,
            who: element.who,
            url: element.url,
         };
         const $component = $$(ids.component);
         const $toUsers = $$(ids.toUsers);

         this.element = element;

         $component.setValues(obj);

         if (element.who === "0") $toUsers.hide();
         else
            webix.ui(
               {
                  id: ids.toUsers,
                  rows: [this.toUsers.ui(element.toUsers ?? {})],
                  paddingY: 10,
               },
               $toUsers
            );
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */

      values() {
         const ids = this.ids;

         const $component = $$(ids.component);

         const obj = $component.getValues();

         obj.label = obj.name;
         obj.toUsers = this.toUsers.values();

         return obj;
      }
   }

   return UIProcessUserExternal;
}
