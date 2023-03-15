/*
 * ABProcessParticipant_selectManagersUI
 *
 * Display the form for entering how to select "managers".
 * this form allows you to choose Roles, or Users directly.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";
import FUI_Common_Participant_SelectManager from "../../ui_common_participant_selectManager";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const UI_Common_Participant_SelectManager =
      FUI_Common_Participant_SelectManager(AB);
   var L = UIClass.L();

   class UIProcessParticipant_selectManagersUI extends UI_Common_Participant_SelectManager {
      constructor(idBase) {
         super(idBase, {
            useField: "", // bool on whether to use userFields from process
            fields: "", // to\fromUsers.fields
            userField: "",
            buttonFilter: "",
         });

         this.AB = AB;
         this.filterComponent = this.AB.filterComplexNew(
            `${this.ids.component}_filter`,
            AB
         );

         this.filterComponent.init({ isProcessParticipant: true });
         this.filterComponent.on("save", (filterConditions) => {
            this.populateBadgeNumber(filterConditions);
         });
      }

      ui(element = {}) {
         const obj = element.toUsers || {};
         const baseUI = super.ui(obj);
         const filterConditions = obj.filterConditions || {
            glue: "and",
            rules: [],
         };
         const fields =
            element.process?.processDataFields(element).map((e) => e.field) ||
            [];

         this.filterComponent.fieldsLoad(fields);
         this.filterComponent.setValue(filterConditions);

         const __UserFields =
            obj.userProcessFieldData?.map((u) => {
               return {
                  uuid: u.field.id,
                  id: u.key,
                  value: u.label,
                  key: u.key,
               };
            }) || [];
         const ids = this.ids;
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
                           self.filterComponent.emit("save", filterConditions);
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

         const self = this;

         baseUI.elements.push(...userFieldElements, {
            id: ids.buttonFilter,
            view: "button",
            name: "buttonFilter",
            css: "webix_primary",
            label: L("Scope query"),
            type: "icon",
            badge: 0,
            click: function () {
               self.filterComponent.popUp(this.$view, null, { pos: "top" });
            },
         });

         return baseUI;
      }

      async init(AB) {
         this.AB = AB;
      }

      populateBadgeNumber(filterConditions = {}) {
         const ids = this.ids;
         const $buttonFilter = $$(ids.buttonFilter);

         if (filterConditions.rules) {
            $buttonFilter.define(
               "badge",
               filterConditions.rules?.length || null
            );
            $buttonFilter.refresh();
         } else {
            $buttonFilter.define("badge", null);
            $buttonFilter.refresh();
         }
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
         const obj = super.values();
         const ids = this.ids;

         if ($$(ids.useField)) {
            obj.useField = $$(ids.useField).getValue();
         }

         if ($$(ids.useField)) {
            obj["userFields"] = $$(ids.userField).getValue();
         } else {
            obj.userFields = [];
         }

         obj.filterConditions = this.filterComponent.getValue();

         return obj;
      }
   }

   return UIProcessParticipant_selectManagersUI;
}
