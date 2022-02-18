/*
 * ABFieldUser
 * A Property manager for our ABFieldUser.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

   var ABField = FFieldClass(AB);
   var L = ABField.L();

   class ABFieldUser extends ABField {
      constructor() {
         super("properties_abfield_user", {
            editable: "",
            isMultiple: "",
            isCurrentUser: "",
            isShowProfileImage: "",
            isShowUsername: "",
         });
      }

      ui() {
         // const FC = this.FieldClass();
         const ids = this.ids;

         return super.ui([
            {
               view: "checkbox",
               name: "isMultiple",
               id: ids.isMultiple,
               disallowEdit: true,
               labelRight: L("Allow multiple users"),
               labelWidth: uiConfig.labelWidthCheckbox,
            },
            {
               cols: [
                  {
                     view: "checkbox",
                     name: "isCurrentUser",
                     id: ids.isCurrentUser,
                     labelRight: L("Default value as current user"),
                     labelWidth: uiConfig.labelWidthCheckbox,
                     on: {
                        onChange: function (newValue /*, oldValue*/) {
                           if (newValue == 0) {
                              $$(ids.editable).setValue(1);
                              $$(ids.editable).hide();
                           } else {
                              $$(ids.editable).setValue(1);
                              $$(ids.editable).show();
                           }
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     name: "editable",
                     hidden: true,
                     id: ids.editable,
                     labelRight: L("Editable"),
                     labelWidth: uiConfig.labelWidthCheckbox,
                  },
               ],
            },
            {
               view: "checkbox",
               name: "isShowProfileImage",
               id: ids.isShowProfileImage,
               labelRight: L("Show Profile Image"),
               labelWidth: uiConfig.labelWidthCheckbox,
            },
            {
               view: "checkbox",
               name: "isShowUsername",
               id: ids.isShowUsername,
               labelRight: L("Show Username"),
               labelWidth: uiConfig.labelWidthCheckbox,
            },
         ]);
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("user");
      }
   }

   return ABFieldUser;
}
