/*
 * ABProcessTaskUserApproval
 *
 * Display the form for entering the properties for an Approval Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";
import FABProcessParticipant from "./ABProcessParticipant_selectManagersUI";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   const ABProcessParticipantUsers = FABProcessParticipant(AB);

   class UIProcessUserApproval extends UIClass {
      constructor() {
         super("properties_process_user_approval", {
            name: "",
            who: "",
            toUser: "",
            formBuilder: "",
            modalWindow: "",
            formPreview: "",
         });

         this.toUser = new ABProcessParticipantUsers(
            this.ids.component + "_to_"
         );
         this.on("save", () => {
            this.processComponents();
         });
      }

      static get key() {
         return "Approval";
      }
      // {string}
      // This should match the ABProcessTaskServiceGetResetPasswordUrlCore.defaults().key value.

      uiUser(obj) {
         var usersUI = this.users.ui(obj ?? {});
         return {
            id: this.ids.users,
            rows: [usersUI],
            paddingY: 10,
         };
      }

      ui(element) {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.

         const ids = this.ids;

         const whoOptions = [
            // current lane/participant
            {
               id: 0,
               value: L("Current Participant"),
            },
            // manually select User/Role
            {
               id: 1,
               value: L("Select Role or User"),
            },
         ];

         // if we don't have a lane, then remove the lane option:
         if (!this.laneDiagramID || this.laneDiagramID == "?laneID?") {
            whoOptions.shift();
         }

         const modalUi = () => {
            return {
               id: ids.modalWindow,
               view: "window",
               position: "center",
               fullscreen: true,
               modal: true,
               head: {
                  view: "toolbar",
                  css: "webix_dark",
                  cols: [
                     {
                        view: "spacer",
                        width: 17,
                     },
                     {
                        view: "label",
                        label: L("Customize the approval layout"),
                     },
                     {
                        view: "spacer",
                     },
                     {
                        view: "button",
                        label: L("Cancel"),
                        autowidth: true,
                        click: function () {
                           $$(ids.modalWindow).close();
                        },
                     },
                     {
                        view: "button",
                        css: "webixtype_form",
                        label: L("Save"),
                        autowidth: true,
                        click: () => {
                           this.formBuilder = $$(ids.formBuilder).getFormData();
                           this.element.formBuilder = this.formBuilder;
                           (this.formBuilder.components || []).forEach(
                              (component) => {
                                 if (
                                    component._key &&
                                    component.key != component._key
                                 )
                                    component.key = component._key;
                              }
                           );
                           this.emit("save");
                           $$(ids.modalWindow).close();
                        },
                     },
                     {
                        view: "spacer",
                        width: 17,
                     },
                  ],
               },
               body: {
                  id: ids.formBuilder,
                  view: "formiobuilder",
                  dataFields: this.dataFields,
                  formComponents: this.formIOComponents,
               },
            };
         };

         const toUserUI = this.toUser.ui(element?.toUsers ?? {});

         return {
            id: ids.component,
            view: "form",
            rows: [
               {
                  id: ids.name,
                  view: "text",
                  label: L("Name"),
                  name: "name",
                  value: "",
               },
               {
                  id: ids.who,
                  view: "select",
                  label: L("Who"),
                  name: "who",
                  options: whoOptions,
                  value: whoOptions.length == 1 ? "1" : "",
                  on: {
                     onChange: (val) => {
                        if (parseInt(val) == 1) {
                           $$(ids.toUser).show();
                        } else {
                           $$(ids.toUser).hide();
                        }
                     },
                  },
               },
               {
                  id: ids.toUser,
                  rows: [toUserUI],
                  paddingY: 10,
               },
               {
                  view: "spacer",
                  height: 10,
               },
               {
                  view: "toolbar",
                  type: "clean",
                  borderless: true,
                  cols: [
                     {
                        view: "label",
                        label: L("Data To Approve"),
                     },
                     {
                        view: "spacer",
                     },
                     {
                        view: "button",
                        value: L("Customize Layout"),
                        autowidth: true,
                        click: () => {
                           webix.ui(modalUi()).show();
                        },
                     },
                  ],
               },
               {
                  view: "layout",
                  type: "form",
                  rows: [
                     {
                        view: "layout",
                        padding: 20,
                        rows: [
                           {
                              id: ids.formPreview,
                              view: "formiopreview",
                              formComponents: [],
                              height: 500,
                           },
                        ],
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

      /**
       * process the formIOComponents components and data for the preview and
       * form builder
       * @function processComponents
       */
      processComponents() {
         const ids = this.ids;
         this.dataFields = this.element.process.processDataFields(this.element);
         this.formIOComponents = this.element.preProcessFormIOComponents();

         const $preview = $$(ids.formPreview).getParentView();
         $preview.removeView(ids.formPreview);

         $preview.addView({
            id: ids.formPreview,
            view: "formiopreview",
            formComponents: this.formIOComponents,
            height: 500,
         });
      }

      populate(element) {
         this.element = element;
         const ids = this.ids;

         const $name = $$(ids.name);
         const $who = $$(ids.who);

         $name.setValue(element.label);

         if (element.who !== null) {
            $who.setValue(element.who);
            if (element.who === "0") {
               $$(ids.toUser).hide();
            } else {
               let $toUser = this.toUser.ui(element.toUsers ?? {});
               let $toUserUi = {
                  id: ids.toUser,
                  rows: [$toUser],
                  paddingY: 10,
               };
               webix.ui($toUserUi, $$(ids.toUser));
            }
         }
         this.processComponents();
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */

      values() {
         const obj = {};
         const ids = this.ids;

         const $name = $$(ids.name);
         // "who", "toUsers", "formBuilder"
         const $who = $$(ids.who);

         obj.label = $name?.getValue() ?? "";
         obj.name = $name?.getValue() ?? "";
         obj.who = $who?.getValue() ?? "";
         obj.formBuilder = this.formBuilder;
         obj.toUsers = this.toUser.values();

         return obj;
      }
   }

   return UIProcessUserApproval;
}
