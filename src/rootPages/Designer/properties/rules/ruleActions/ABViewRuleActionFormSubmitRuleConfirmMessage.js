//
// ABViewRuleActionFormSubmitRuleConfirmMessage
//
//
//
import FABViewRuleAction from "../ABViewRuleAction";

export default function (AB) {
   const ABViewRuleAction = FABViewRuleAction(AB);
   const L = ABViewRuleAction.L();

   class ABViewRuleActionFormSubmitRuleConfirmMessage extends ABViewRuleAction {
      /**
       * @param {object} App
       *      The shared App object that is created in OP.Component
       * @param {string} idBase
       *      Identifier for this component
       */
      constructor(idBase) {
         super(idBase, {
            message: "",
         });

         this.key = "ABViewRuleActionFormSubmitRuleConfirmMessage";
         this.label = L("Show a confirmation message");

         this.formRows = []; // keep track of the Value Components being set
         // [
         //		{ fieldId: xxx, value:yyy, type:key['string', 'number', 'date',...]}
         // ]
      }

      // conditionFields() {
      //    var fieldTypes = ["string", "number", "date", "formula", "calculate"];

      //    var currFields = [];

      //    if (this.currentObject) {
      //       this.currentObject.fields().forEach((f) => {
      //          if (fieldTypes.indexOf(f.key) != -1) {
      //             // NOTE: the .id value must match the obj[.id]  in the data set
      //             // so if your object data looks like:
      //             // 	{
      //             //		name_first:'Neo',
      //             //		name_last: 'The One'
      //             //  },
      //             // then the ids should be:
      //             // { id:'name_first', value:'xxx', type:'string' }
      //             currFields.push({
      //                id: f.columnName,
      //                value: f.label,
      //                type: f.key
      //             });
      //          }
      //       });
      //    }

      //    return currFields;
      // }

      ui() {
         return {
            id: this.ids.message,
            view: "textarea",
            height: 130,
         };
      }

      init(AB) {
         this.AB = AB;
         return Promise.resolve();
      }

      // valueDisplayComponent
      // Return an ABView to display our values form.
      //
      // valueDisplayComponent(idBase) {
      //    var ids = {
      //       message: `${idBase}_message`,
      //    };

      //    this._ui = {
      //       ui: {
      //          id: ids.message,
      //          view: "textarea",
      //          // label: this.labels.component.message,
      //          // labelWidth: this.AB.UISettings.config().labelWidthLarge,
      //          height: 130,
      //       },

      //       init: () => {},

      //       _logic: _logic,

      //       fromSettings: (valueRules) => {
      //          _logic.fromSettings(valueRules);
      //       },
      //       toSettings: () => {
      //          return _logic.toSettings();
      //       },
      //    };

      //    var _logic = {
      //       fromSettings: (valueRules) => {
      //          valueRules = valueRules || {};

      //          $$(ids.message).setValue(valueRules.message || "");
      //       },

      //       toSettings: () => {
      //          // return the confirm message
      //          return {
      //             message: $$(ids.message).getValue() || "",
      //          };
      //       },
      //    };

      //    return this._ui;
      // }

      // // process
      // // gets called when a form is submitted and the data passes the Query Builder Rules.
      // // @param {obj} options
      // process(options) {
      //    return new Promise((resolve, reject) => {
      //       var confirmMessage = this.valueRules.message || "";

      //       webix.message({
      //          text: confirmMessage,
      //          type: "info",
      //       });

      //       resolve();
      //    });
      // }

      // fromSettings
      // initialize this Action from a given set of setting values.
      // @param {obj}  settings
      fromSettings(settings) {
         settings = settings || {};
         super.fromSettings(settings); // let the parent handle the QB

         // if we have a display component, then populate it:
         $$(this.ids.message)?.setValue(settings.message || "");
      }

      // toSettings
      // return an object that represents the current state of this Action
      // @return {obj}
      toSettings() {
         // settings: {
         //	message:''
         // }

         // let our parent store our QB settings
         var settings = super.toSettings();

         settings.message = $$(this.ids.message)?.getValue() || "";

         return settings;
      }
   }

   return ABViewRuleActionFormSubmitRuleConfirmMessage;
}
