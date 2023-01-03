import FABViewRuleAction from "../ABViewRuleAction";

export default function (AB) {
   const ABViewRuleAction = FABViewRuleAction(AB);
   const L = ABViewRuleAction.L();

   class ABViewRuleActionFormSubmitRuleWebsite extends ABViewRuleAction {
      /**
       * @param {object} App
       *      The shared App object that is created in OP.Component
       * @param {string} idBase
       *      Identifier for this component
       */
      constructor(idBase) {
         super(idBase, {
            website: "",
         });

         this.key = "ABViewRuleActionFormSubmitRuleWebsite";
         this.label = L("Redirect to another website URL");

         this.formRows = []; // keep track of the Value Components being set
         // [
         //		{ fieldId: xxx, value:yyy, type:key['string', 'number', 'date',...]}
         // ]
      }

      ui() {
         return {
            id: this.ids.website,
            view: "text",
         };
      }

      fromSettings(settings) {
         super.fromSettings(settings); // let the parent handle the QB

         const valueRules = settings.valueRules || {};

         $$(this.ids.website).setValue(valueRules.website ?? "");
      }

      toSettings() {
         const ids = this.ids;
         const settings = super.toSettings();

         settings.valueRules = {
            website: $$(ids.website).getValue() ?? "",
         };

         return settings;
      }
   }

   return ABViewRuleActionFormSubmitRuleWebsite;
}
