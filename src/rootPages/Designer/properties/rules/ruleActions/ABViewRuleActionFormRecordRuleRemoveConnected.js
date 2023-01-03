//
// ABViewRuleActionFormRecordRuleRemoveConnected
//
// An action that allows you to update fields on an object that is connected to
// the current object we just Added/Updated
//
//
import FUpdateConnected from "./ABViewRuleActionFormRecordRuleUpdateConnected";

export default function (AB) {
   const UpdateConnected = FUpdateConnected(AB);
   const L = (...params) => AB.Multilingual.label(...params);

   class ABViewRuleActionFormRecordRuleRemoveConnected extends UpdateConnected {
      constructor(idBase) {
         super(idBase, {});

         this.key = "ABViewRuleActionFormRecordRuleRemoveConnected";
         this.label = L("Remove Connected Record");

         this.isUpdateValueDisabled = true; // disable update data of each fields
      }
   }

   return ABViewRuleActionFormRecordRuleRemoveConnected;
}
