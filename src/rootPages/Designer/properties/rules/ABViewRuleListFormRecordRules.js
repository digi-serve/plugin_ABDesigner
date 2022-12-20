//
// ABViewRuleListFormRecordRules
//
// A component that is responsible for displaying the specific list of Submit
// Rules for a form.
//
import FABViewRuleList from "./ABViewRuleList";
import FABViewRule from "./ABViewRule";

import FRuleInsertConnected from "./ruleActions/ABViewRuleActionFormRecordRuleInsertConnected";
import FRuleUpdateConnected from "./ruleActions/ABViewRuleActionFormRecordRuleUpdateConnected";
import FRuleRemoveConnected from "./ruleActions/ABViewRuleActionFormRecordRuleRemoveConnected";

export default function (AB, iBase) {
   const ABViewRuleList = FABViewRuleList(AB);
   const ABViewRule = FABViewRule(AB);
   const L = ABViewRuleList.L();

   const RuleInsertConnected = FRuleInsertConnected(AB);
   const RuleUpdateConnected = FRuleUpdateConnected(AB);
   const RuleRemoveConnected = FRuleRemoveConnected(AB);
   // const RuleEmail = FRuleEmail(AB);

   class ABViewRuleListFormRecordRules extends ABViewRuleList {
      constructor(base = `ABViewRuleListFormRecordRules`) {
         var settings = {
            labels: {
               header: L("Record Rules"),
               headerDefault: L("Record Rules"),
            },
         };
         super(base, settings);
         this.base = base;
      }

      // must return the actual Rule object.
      getRule() {
         var listActions = [
            new RuleInsertConnected(`${this.base}_ruleActionInsertConnected`),
            new RuleUpdateConnected(`${this.base}_ruleActionUpdateConnected`),
            new RuleRemoveConnected(`${this.base}_ruleActionRemoveConnected`),
            // new RuleExistPage(this.App, `${this.idBase}_ruleActionExistPage`),
            // new RuleParentPage(this.App, `${this.idBase}_ruleActionParentPage`),
            // new RuleClosePopup(this.App, `${this.idBase}_ruleActionClosePopup`),
            // new RuleWebsite(this.App, `${this.idBase}_ruleActionWebsite`),
         ];

         var Rule = new ABViewRule(`${this.base}_rule_record`, listActions);
         Rule.init(this.AB);
         Rule.objectLoad(this.CurrentObject);
         Rule.formLoad(this.currentForm);
         return Rule;
      }
   }

   return new ABViewRuleListFormRecordRules(iBase);
}
