/*
 * ABFieldTextFormula
 * A Property manager for our ABFieldTextFormula.
 */

import FFieldClass from "./ABField";

export default function (AB) {
    const uiConfig = AB.Config.uiSettings();

    var ABField = FFieldClass(AB);
    var L = ABField.L();

    class ABFieldTextFormula extends ABField {
        constructor() {
            super("properties_abfield_textformula", {
            });
        }

        ui() {
            const FC = this.FieldClass();
            const ids = this.ids;
   
            return super.ui([]);
        }

        /**
         * @method FieldClass()
         * Call our Parent's _FieldClass() helper with the proper key to return
         * the ABFieldXXX class represented by this Property Editor.
         * @return {ABFieldXXX Class}
         */
        FieldClass() {
            return super._FieldClass("TextFormula");
        }
    }

    return ABFieldTextFormula;
}