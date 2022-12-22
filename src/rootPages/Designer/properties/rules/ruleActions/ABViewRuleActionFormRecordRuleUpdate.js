//
// ABViewRuleActionFormRecordRuleUpdate
//
// An action that allows you to update fields on an object that was currently
// Added/Updated.
//
//
import FObjectUpdater from "./ABViewRuleActionObjectUpdater";

export default function (AB) {
   const ObjectUpdate = FObjectUpdater(AB);
   const L = (...params) => AB.Multilingual.label(...params);

   class ABViewRuleActionFormRecordRuleUpdate extends ObjectUpdate {
      constructor(idBase) {
         super(idBase, {});

         this.key = "ABViewRuleActionFormRecordRuleUpdate";
         this.label = L("Update Record");
      }
   }

   return ABViewRuleActionFormRecordRuleUpdate;
}
