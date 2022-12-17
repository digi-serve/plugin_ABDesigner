import FABViewRuleAction from "../ABViewRuleAction";

export default function (AB) {
   const ABViewRuleAction = FABViewRuleAction(AB);
   const L = ABViewRuleAction.L();

   class ABViewRuleActionFormSubmitRuleParentPage extends ABViewRuleAction {
      /**
       * @param {object} App
       *      The shared App object that is created in OP.Component
       * @param {string} idBase
       *      Identifier for this component
       */
      constructor(idBase) {
         super(idBase, {});

         this.key = "ABViewRuleActionFormSubmitRuleParentPage";
         this.label = L("Redirect to the parent page");

         this.formRows = []; // keep track of the Value Components being set
         // [
         //		{ fieldId: xxx, value:yyy, type:key['string', 'number', 'date',...]}
         // ]
      }

      ui() {
         return {
            view: "label",
            label: this.label,
         };
      }
   }

   return ABViewRuleActionFormSubmitRuleParentPage;
}
