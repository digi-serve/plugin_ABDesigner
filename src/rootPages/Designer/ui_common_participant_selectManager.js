/*
 * ab_common_participant_selectManager
 *
 * Display the form for entering how to select "managers".
 * this form allows you to choose Roles, or Users directly.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "./ui_class";
// import ui_choose_list from "./ui_choose_list";
// import ABProcessTaskCore from "../../../../../ab_platform_web/AppBuilder/core/process/tasks/ABProcessElementCore";
// import ABProcessTaskUser from "./properties/process/ABProcessTaskUser";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Common_Participant_SelectManager extends UIClass {
      constructor(idBase, ids) {
         super(
            idBase,
            Object.assign(
               {
                  form: "",
                  name: "",
                  role: "",
                  useRole: "",
                  useAccount: "",
                  account: "",
               },
               ids
            )
         );
      }

      ui(obj = {}) {
         var __Roles = AB.Account.rolesAll().map((r) => {
            return { id: r.id, value: r.name };
         });
         var __Users = AB.Account.userList().map((u) => {
            return { id: u.uuid, value: u.username };
         });

         var ids = this.ids;

         return {
            view: "form",
            id: this.ids.component,
            css: "no-margin",
            elements: [
               {
                  cols: [
                     {
                        view: "checkbox",
                        id: this.ids.useRole,
                        width: 34,
                        labelWidth: 0,
                        value: obj.useRole == "1" ? 1 : 0,
                        click: function (id /*, event */) {
                           if ($$(id).getValue()) {
                              $$(ids.role).enable();
                           } else {
                              $$(ids.role).disable();
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
                        label: L("by Role"),
                        width: 88,
                     },
                     {
                        view: "multicombo",
                        id: this.ids.role,
                        value: obj.role ? obj.role : 0,
                        disabled: obj.useRole == "1" ? false : true,
                        suggest: {
                           body: {
                              yCount: 4,
                              data: __Roles,
                              on: {
                                 //
                                 // TODO: looks like a Webix Bug that has us
                                 // doing all this work.  Let's see if Webix
                                 // can fix this for us.
                                 onAfterRender() {
                                    this.data.each((a) => {
                                       UIClass.CYPRESS_REF(
                                          this.getItemNode(a.id),
                                          `${ids.role}_${a.id}`
                                       );
                                    });
                                 },
                                 onItemClick: function (id) {
                                    var $roleCombo = $$(ids.role);
                                    var currentItems = $roleCombo.getValue();
                                    var indOf = currentItems.indexOf(id);
                                    if (indOf == -1) {
                                       currentItems.push(id);
                                    } else {
                                       currentItems.splice(indOf, 1);
                                    }
                                    $roleCombo.setValue(currentItems);
                                    // var item = this.getItem(id);
                                    // UIClass.CYPRESS_REF(
                                    //    this.getItemNode(item.id),
                                    //    `${ids.role}_${item.id}`
                                    // );
                                 },
                              },
                           },
                        },
                        placeholder: L("Click to add Role"),
                        labelAlign: "left",
                        stringResult: false /* returns data as an array of [id] */,
                        on: {
                           onAfterRender: function () {
                              // set data-cy for original field to track clicks to open option list
                              UIClass.CYPRESS_REF(this.getNode(), ids.role);
                           },
                           onChange: (/* newVal, oldVal */) => {
                              // trigger the onAfterRender function from the list so we can add data-cy to dom
                              $$(this.ids.role)
                                 .getList()
                                 .callEvent("onAfterRender");
                           },
                        },
                     },
                  ],
               },
               {},
               {
                  cols: [
                     {
                        view: "checkbox",
                        id: this.ids.useAccount,
                        width: 34,
                        labelWidth: 0,
                        value: obj.useAccount == "1" ? 1 : 0,
                        click: function (id /*, event */) {
                           if ($$(id).getValue()) {
                              $$(ids.account).enable();
                           } else {
                              $$(ids.account).disable();
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
                        label: L("by Account"),
                        width: 88,
                     },
                     {
                        view: "multicombo",
                        id: this.ids.account,
                        value: obj.account ? obj.account : 0,
                        disabled: obj.useAccount == "1" ? false : true,
                        suggest: {
                           body: {
                              yCount: 4,
                              data: __Users,
                              on: {
                                 //
                                 // TODO: looks like a Webix Bug that has us
                                 // doing all this work.  Let's see if Webix
                                 // can fix this for us.
                                 onAfterRender() {
                                    this.data.each((a) => {
                                       UIClass.CYPRESS_REF(
                                          this.getItemNode(a.id),
                                          `${ids.account}_${a.id}`
                                       );
                                    });
                                 },
                                 onItemClick: function (id) {
                                    var $accountCombo = $$(ids.account);
                                    var currentItems = $accountCombo.getValue();
                                    var indOf = currentItems.indexOf(id);
                                    if (indOf == -1) {
                                       currentItems.push(id);
                                    } else {
                                       currentItems.splice(indOf, 1);
                                    }
                                    $accountCombo.setValue(currentItems);
                                    // var item = this.getItem(id);
                                    // UIClass.CYPRESS_REF(
                                    //    this.getItemNode(item.id),
                                    //    `${ids.account}_${item.id}`
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
                              UIClass.CYPRESS_REF(this.getNode(), ids.account);
                           },
                           onChange: (/* newVal, oldVal */) => {
                              // trigger the onAfterRender function from the list so we can add data-cy to dom
                              $$(this.ids.account)
                                 .getList()
                                 .callEvent("onAfterRender");
                           },
                        },
                     },
                  ],
               },
            ],
         };
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
         var obj = {};
         var ids = this.ids;

         if ($$(ids.useRole)) {
            obj.useRole = $$(ids.useRole).getValue();
         }

         if ($$(ids.role) && obj.useRole) {
            obj.role = $$(ids.role).getValue();
            if (obj.role === "--") obj.role = null;
         } else {
            obj.role = null;
         }

         if ($$(ids.useAccount)) {
            obj.useAccount = $$(ids.useAccount).getValue();
         }

         if ($$(ids.account) && obj.useAccount) {
            obj.account = $$(ids.account).getValue(/*{ options: true }*/);
            if (obj.account === "--") obj.account = null;
         } else {
            obj.account = null;
         }

         return obj;
      }
   }

   return UI_Common_Participant_SelectManager;
}
