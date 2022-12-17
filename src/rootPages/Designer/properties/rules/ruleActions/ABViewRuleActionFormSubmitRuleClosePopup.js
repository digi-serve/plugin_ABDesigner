import FABViewRuleAction from "../ABViewRuleAction";

export default function (AB) {
   const ABViewRuleAction = FABViewRuleAction(AB);
   const L = ABViewRuleAction.L();

   class ABViewRuleActionFormSubmitRuleClosePopup extends ABViewRuleAction {
      /**
       * @param {object} App
       *      The shared App object that is created in OP.Component
       * @param {string} idBase
       *      Identifier for this component
       */
      constructor(idBase) {
         super(idBase, {});

         this.key = "ABViewRuleActionFormSubmitRuleClosePopup";
         this.label = L("Close the current popup");

         this.formRows = []; // keep track of the Value Components being set
         // [
         //		{ fieldId: xxx, value:yyy, type:key['string', 'number', 'date',...]}
         // ]
      }

      ui() {
         return {
            view: "layout",
            rows: [],
         };
      }
   }

   return ABViewRuleActionFormSubmitRuleClosePopup;
}
