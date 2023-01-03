//
// ABViewRuleActionFormRecordRuleInsertConnected
//
// An action that allows you to insert a connected object.
//
// NOTE: this is very similar to the Update Connected Rule, so we subclass that one and
// modify it to only Insert data.
//
//
import FUpdateConnected from "./ABViewRuleActionFormRecordRuleUpdateConnected";

export default function (AB) {
   const UpdateConnected = FUpdateConnected(AB);
   const L = (...params) => AB.Multilingual.label(...params);

   class ABViewRuleActionFormRecordRuleInsertConnected extends UpdateConnected {
      constructor(idBase) {
         super(idBase, {});

         this.key = "ABViewRuleActionFormRecordRuleInsertConnected";
         this.label = L("Insert Connected Object");
      }
   }

   return ABViewRuleActionFormRecordRuleInsertConnected;
}
