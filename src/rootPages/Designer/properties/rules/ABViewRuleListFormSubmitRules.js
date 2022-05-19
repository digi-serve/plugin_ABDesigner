//
// ABViewRuleListFormSubmitRules
//
// A component that is responsible for displaying the specific list of Submit
// Rules for a form.
//
import FABViewRuleList from "./ABViewRuleList";
import FABViewRule from "./ABViewRule";

import FRuleConfirmMessage from "./ruleActions/ABViewRuleActionFormSubmitRuleConfirmMessage";
// const RuleExistPage = require("./ruleActions/ABViewRuleActionFormSubmitRuleExistPage");
// const RuleParentPage = require("./ruleActions/ABViewRuleActionFormSubmitRuleParentPage");
// const RuleClosePopup = require("./ruleActions/ABViewRuleActionFormSubmitRuleClosePopup");
// const RuleWebsite = require("./ruleActions/ABViewRuleActionFormSubmitRuleWebsite");
import FRuleEmail from "./ruleActions/ABViewRuleActionFormSubmitRuleEmail";

export default function (AB, iBase) {
   const ABViewRuleList = FABViewRuleList(AB);
   const ABViewRule = FABViewRule(AB);
   const L = ABViewRuleList.L();

   const RuleConfirmMessage = FRuleConfirmMessage(AB);
   const RuleEmail = FRuleEmail(AB);

   class ABViewRuleListFormSubmitRules extends ABViewRuleList {
      constructor(base = `ABViewRuleListFormSubmitRules`) {
         var settings = {
            labels: {
               header: L("Submit Rules"),
               headerDefault: L("Submit Rules"),
            },
         };
         super(base, settings);
         this.base = base;
      }

      // must return the actual Rule object.
      getRule() {
         var listActions = [
            new RuleConfirmMessage(`${this.idBase}_ruleActionConfirmMessage`),
            // new RuleExistPage(this.App, `${this.idBase}_ruleActionExistPage`),
            // new RuleParentPage(this.App, `${this.idBase}_ruleActionParentPage`),
            // new RuleClosePopup(this.App, `${this.idBase}_ruleActionClosePopup`),
            // new RuleWebsite(this.App, `${this.idBase}_ruleActionWebsite`),
            new RuleEmail(`${this.idBase}_ruleActionEmail`),
         ];

         var Rule = new ABViewRule(`${this.base}_rule`, listActions);
         Rule.init(this.AB);
         Rule.objectLoad(this.CurrentObject);
         Rule.formLoad(this.currentForm);
         return Rule;
      }
   }

   return new ABViewRuleListFormSubmitRules(iBase);
}
