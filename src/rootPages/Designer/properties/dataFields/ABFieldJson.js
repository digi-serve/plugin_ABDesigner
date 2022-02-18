/*
 * ABFieldJson
 * A Property manager for our ABFieldJson.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const ABField = FFieldClass(AB);

   class ABFieldJson extends ABField {
      constructor() {
         super("properties_abfield_json", {});
      }

      ui() {
         return super.ui([]);
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("json");
      }
   }

   return ABFieldJson;
}
