/*
 * ABProcessParticipant_selectManagersUI
 *
 * Display the form for entering how to select "managers".
 * this form allows you to choose Roles, or Users directly.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";
import UI_Common_Participant_SelectManager from "../../ui_common_participant_selectManager";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UIProcessParticipant_selectManagersUI extends UI_Common_Participant_SelectManager {
      constructor(id) {
         super(id, {
            useField: "", // bool on whether to use userFields from process
            fields: "", // to\fromUsers.fields
            userField: "",
         });
      }

      ui(obj = {}) {
         const baseUI = super.ui(obj);

         var __UserFields = [];
         if (obj.userProcessFieldData) {
            __UserFields = obj.userProcessFieldData.map((u) => {
               return {
                  uuid: u.field.id,
                  id: u.key,
                  value: u.label,
                  key: u.key,
               };
            });
         }

         var ids = this.ids;

         const userFieldElements = [
            {},
            {
               cols: [
                  {
                     view: "checkbox",
                     id: this.ids.useField,
                     width: 34,
                     labelWidth: 0,
                     value: obj.useField == "1" ? 1 : 0,
                     click: function (id /*, event */) {
                        if ($$(id).getValue()) {
                           $$(ids.userField).enable();
                        } else {
                           $$(ids.userField).disable();
                        }
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "label",
                     label: L("by Field"),
                     width: 88,
                  },
                  {
                     // TODO @achoobert look these up
                     view: "multicombo",
                     id: this.ids.userField,
                     value: obj.userFields ? obj.userFields : 0,
                     disabled: obj.useField == "1" ? false : true,
                     suggest: {
                        body: {
                           yCount: 4,
                           data: __UserFields,
                           on: {
                              //
                              // TODO: looks like a Webix Bug that has us
                              // doing all this work.  Let's see if Webix
                              // can fix this for us.
                              onAfterRender() {
                                 this.data.each((a) => {
                                    UIClass.CYPRESS_REF(
                                       this.getItemNode(a.id),
                                       `${ids.userField}_${a.id}`
                                    );
                                 });
                              },
                              onItemClick: function (id) {
                                 var $userFieldsCombo = $$(ids.userField);
                                 var currentItems = $userFieldsCombo.getValue();
                                 var indOf = currentItems.indexOf(id);
                                 if (indOf == -1) {
                                    currentItems.push(id);
                                 } else {
                                    currentItems.splice(indOf, 1);
                                 }
                                 $userFieldsCombo.setValue(currentItems);
                                 // var item = this.getItem(id);
                                 // UIClass.CYPRESS_REF(
                                 //    this.getItemNode(item.id),
                                 //    `${ids.userField}_${item.id}`
                                 // );
                              },
                           },
                        },
                     },
                     placeholder: L("Click to add User"),
                     labelAlign: "left",
                     stringResult: false /* returns data as an array of [id] */,
                     on: {
                        onAfterRender: function () {
                           // set data-cy for original field to track clicks to open option list
                           UIClass.CYPRESS_REF(this.getNode(), ids.userField);
                        },
                        onChange: (/* newVal, oldVal */) => {
                           // trigger the onAfterRender function from the list so we can add data-cy to dom
                           $$(this.ids.userField)
                              .getList()
                              .callEvent("onAfterRender");
                        },
                     },
                  },
               ],
            },
         ];

         return baseUI.elements.push(...userFieldElements);
      }

      async init(AB) {
         this.AB = AB;

         return Promise.resolve();
      }

      // show() {
      //    super.show();
      //    AppList.show();
      // }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */
      values() {
         var obj = super.values();
         var ids = this.ids;

         if ($$(ids.useField)) {
            obj.useField = $$(ids.useField).getValue();
         }

         if ($$(ids.useField)) {
            obj["userFields"] = $$(ids.userField).getValue();
         } else {
            obj.userFields = [];
         }

         return obj;
      }
   }

   return UIProcessParticipant_selectManagersUI;
}
