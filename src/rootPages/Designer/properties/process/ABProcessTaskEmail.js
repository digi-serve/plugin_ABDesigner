/*
 * UIProcessTaskEmail
 *
 * Display the form for entering the properties for a new
 * Email Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";
import FABProcessParticipant from "./ABProcessParticipant_selectManagersUI";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   const ABProcessParticipant = FABProcessParticipant(AB);

   class UIProcessEmail extends UIClass {
      constructor() {
         super("properties_process_email", {
            name: "",
            to: "",
            from: "",
            subject: "",
            fromUser: "",
            toUser: "",
            message: "",
            toCustom: "",
            toCustomFields: "",
            fromCustom: "",
            fromCustomFields: "",
            customFrom: "",
            toEmailForm: "",
            fromEmailForm: "",
         });

         this.toUser = new ABProcessParticipant(this.ids.component + "_to_");
         this.fromUser = new ABProcessParticipant(
            this.ids.component + "_from_"
         );
      }

      static get key() {
         return "Email";
      }
      // {string}
      // This should match the ABProcessTaskEmailCore.defaults().key value.

      ui(obj) {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.

         var toUserUI = this.toUser.ui(obj?.toUsers ?? {});
         var fromUserUI = this.fromUser.ui(obj?.fromUsers ?? {});

         let ids = this.ids;
         return {
            id: ids.component,
            rows: [
               { view: "label", label: L("Send Email:") },
               {
                  view: "label",
                  label: L("Generate an Email message to be sent."),
               },
               {
                  // id: ids.component,
                  view: "form",
                  elements: [
                     {
                        id: ids.name,
                        view: "text",
                        label: L("Name"),
                        name: "name",
                        value: this.name,
                     },
                     {
                        id: ids.to,
                        view: "select",
                        label: L("To"),
                        name: "to",
                        value: this.to,
                        options: [
                           {
                              id: 0,
                              value: L("Next Participant"),
                           },
                           {
                              id: 1,
                              value: L("Select Role or User"),
                           },
                           {
                              id: 2,
                              value: L("Custom"),
                           },
                        ],
                        on: {
                           onChange: (val) => {
                              if (parseInt(val) == 1) {
                                 $$(ids.toUser).show();
                                 $$(ids.toEmailForm).hide();
                              } else if (parseInt(val) == 2) {
                                 $$(ids.toUser).hide();
                                 $$(ids.toEmailForm).show();
                              } else {
                                 $$(ids.toUser).hide();
                                 $$(ids.toEmailForm).hide();
                              }
                           },
                        },
                     },
                     {
                        id: ids.toUser,
                        rows: [toUserUI],
                        paddingY: 10,
                        hidden: parseInt(this.to) == 1 ? false : true,
                     },
                     {
                        id: ids.toEmailForm,
                        name: "toEmailForm",
                        type: "form",
                        css: "no-margin",
                        rows: [
                           {
                              id: ids.toCustom,
                              view: "text",
                              label: L("Email"),
                              placeholder: L("Type email address here..."),
                              name: "toCustom",
                              value: this.toCustom,
                           },
                           {
                              // process fields TO
                              id: ids.toCustomFields,
                              label: L("toCustomFields"),
                              name: "toCustomFields",
                              value: this.toCustomFields,
                              view: "multicombo",
                              placeholder: L("..."),
                              suggest: {
                                 body: {
                                    data: [],
                                    on: {
                                       onAfterRender() {
                                          this.data.each((a) => {
                                             UIClass.CYPRESS_REF(
                                                this.getItemNode(a.id),
                                                `${ids.toCustomFields}_${a.id}`
                                             );
                                          });
                                       },
                                       onItemClick: function (id) {
                                          var $toCustomFields = $$(
                                             ids.toCustomFields
                                          );
                                          var currentItems =
                                             $toCustomFields.getValue();
                                          var indOf = currentItems.indexOf(id);
                                          if (indOf == -1) {
                                             currentItems.push(id);
                                          } else {
                                             currentItems.splice(indOf, 1);
                                          }
                                          $toCustomFields.setValue(
                                             currentItems
                                          );
                                       },
                                    },
                                 },
                              },
                              labelAlign: "left",
                              stringResult: false /* returns data as an array of [id] */,
                              on: {
                                 onAfterRender: function () {
                                    // set data-cy for original field to track clicks to open option list
                                    UIClass.CYPRESS_REF(
                                       this.getNode(),
                                       ids.toCustomFields
                                    );
                                 },
                                 onChange: (/* newVal, oldVal */) => {
                                    // trigger the onAfterRender function from the list so we can add data-cy to dom
                                    $$(this.ids.toCustomFields)
                                       .getList()
                                       .callEvent("onAfterRender");
                                 },
                              },
                           },
                        ],
                        hidden: parseInt(this.to) == 2 ? false : true,
                     },
                     {
                        id: ids.from,
                        view: "select",
                        label: L("From"),
                        name: "from",
                        value: this.from,
                        options: [
                           {
                              id: 0,
                              value: L("Current Participant"),
                           },
                           {
                              id: 1,
                              value: L("Select Role or User"),
                           },
                           {
                              id: 2,
                              value: L("Custom"),
                           },
                        ],
                        on: {
                           onChange: (val) => {
                              if (parseInt(val) == 1) {
                                 $$(ids.fromUser).show();
                                 $$(ids.fromEmailForm).hide();
                              } else if (parseInt(val) == 2) {
                                 $$(ids.fromUser).hide();
                                 $$(ids.fromEmailForm).show();
                              } else {
                                 $$(ids.fromUser).hide();
                                 $$(ids.fromEmailForm).hide();
                              }
                           },
                        },
                     },
                     {
                        id: ids.fromUser,
                        rows: [fromUserUI],
                        paddingY: 10,
                        hidden: parseInt(this.from) == 1 ? false : true,
                     },
                     {
                        id: ids.fromEmailForm,
                        name: "fromEmailForm",
                        type: "form",
                        css: "no-margin",
                        rows: [
                           {
                              id: ids.fromCustom,
                              view: "text",
                              label: L("Email"),
                              placeholder: L("Type email address here..."),
                              name: "fromCustom",
                              value: this.fromCustom,
                              // hidden: parseInt(this.from) == 2 ? false : true,
                           },
                           {
                              id: ids.fromCustomFields,
                              view: "multicombo",
                              label: L("Process"),
                              placeholder: L("..."),
                              name: "fromCustomFields",
                              suggest: {
                                 body: {
                                    data: [],
                                    on: {
                                       onAfterRender() {
                                          this.data.each((a) => {
                                             UIClass.CYPRESS_REF(
                                                this.getItemNode(a.id),
                                                `${ids.fromCustomFields}_${a.id}`
                                             );
                                          });
                                       },
                                       onItemClick: function (id) {
                                          var $fromCustomFields = $$(
                                             ids.fromCustomFields
                                          );
                                          var currentItems =
                                             $fromCustomFields.getValue();
                                          var indOf = currentItems.indexOf(id);
                                          if (indOf == -1) {
                                             currentItems.push(id);
                                          } else {
                                             currentItems.splice(indOf, 1);
                                          }
                                          $fromCustomFields.setValue(
                                             currentItems
                                          );
                                       },
                                    },
                                 },
                              },
                              labelAlign: "left",
                              value: this.fromCustomFields,
                              // hidden: parseInt(this.from) == 2 ? false : true,
                              stringResult: false /* returns data as an array of [id] */,
                              on: {
                                 onAfterRender: function () {
                                    // set data-cy for original field to track clicks to open option list
                                    UIClass.CYPRESS_REF(
                                       this.getNode(),
                                       ids.fromCustomFields
                                    );
                                 },
                                 onChange: (/* newVal, oldVal */) => {
                                    // trigger the onAfterRender function from the list so we can add data-cy to dom
                                    $$(this.ids.fromCustomFields)
                                       .getList()
                                       .callEvent("onAfterRender");
                                 },
                              },
                           },
                        ],
                        hidden: parseInt(this.from) == 2 ? false : true,
                     },
                     {
                        id: ids.subject,
                        view: "text",
                        label: L("Subject"),
                        name: "subject",
                        value: this.subject,
                     },
                     {
                        view: "spacer",
                        height: 10,
                     },
                     {
                        id: ids.message,
                        view: "tinymce-editor",
                        label: L("Message"),
                        name: "message",
                        value: this.message,
                        borderless: true,
                        minHeight: 500,
                        config: {
                           plugins: [
                              "advlist autolink lists link image charmap print preview anchor",
                              "searchreplace visualblocks code fullscreen",
                              "insertdatetime media table contextmenu paste imagetools wordcount",
                           ],
                           toolbar:
                              "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                           // init_instance_callback: (editor) => {
                           //    editor.on("KeyUp", (event) => {
                           //       // _logic.onChange();
                           //    });

                           //    editor.on("Change", function (event) {
                           //       // _logic.onChange();
                           //    });
                           // },
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

      applicationLoad(application) {
         //    super.applicationLoad(application);
         super.applicationLoad(application);

         // $$(this.ids.objList).define("data", listObj);
         // $$(this.ids.objList).refresh();
      }

      processLoad(process) {
         super.processLoad(process);
         this.process = process;
      }

      // show() {
      //    super.show();
      //    AppList.show();
      // }

      populate(obj) {
         let ids = this.ids;

         // make sure these are initialized.
         obj.toUsers = obj.toUsers ?? {};
         obj.fromUsers = obj.fromUsers ?? {};

         // get process data user-fields
         let userProcessFieldData = obj.process
            .processDataFields(obj)
            .filter((e) => e.field?.key == "user");
         obj.toUsers["userProcessFieldData"] = userProcessFieldData;
         obj.fromUsers["userProcessFieldData"] = userProcessFieldData;

         // get process data email-fields
         let emailProcessFieldData = obj.process
            .processDataFields(obj)
            .filter((e) => e.field?.key == "email");
         let __EmailFields = emailProcessFieldData.map((u) => {
            return {
               uuid: u.field.id,
               id: u.key,
               value: u.label,
               key: u.key,
            };
         });

         $$(ids.name).setValue(obj.name);
         $$(ids.to).setValue(obj.to);
         $$(ids.from).setValue(obj.from);
         $$(ids.subject).setValue(obj.subject);
         $$(ids.message).setValue(obj.message);
         $$(ids.toCustom).setValue(obj.toCustom);
         $$(ids.fromCustom).setValue(obj.fromCustom);

         $$(ids.fromCustomFields).options_setter(__EmailFields);
         $$(ids.fromCustomFields).refresh();
         $$(ids.fromCustomFields).setValue(obj.fromCustomFields);
         $$(ids.toCustomFields).options_setter(__EmailFields);
         $$(ids.toCustomFields).refresh();
         $$(ids.toCustomFields).setValue(obj.toCustomFields);

         let $toUser = this.toUser.ui(obj.toUsers ?? {});
         let $newToUser = {
            id: ids.toUser,
            rows: [$toUser],
            paddingY: 10,
            hidden: parseInt(obj.to) == 1 ? false : true,
         };
         webix.ui($newToUser, $$(ids.toUser));

         // obj.toUsers = this.toUser.values();
         // obj.fromUsers = this.fromUser.values();
         let $fromUser = this.fromUser.ui(obj.fromUsers ?? {});
         let $newFromUser = {
            id: ids.fromUser,
            rows: [$fromUser],
            paddingY: 10,
            hidden: parseInt(obj.from) == 1 ? false : true,
         };
         webix.ui($newFromUser, $$(ids.fromUser));
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */
      // values() {
      //    var obj = {};
      //    var ids = this.ids;

      //    obj.label = $$(ids.name)?.getValue();
      //    obj.objectID = $$(ids.objList)?.getValue();
      //    obj.lifecycleKey = $$(ids.lifecycleList).getValue();
      //    obj.triggerKey = `${obj.objectID}.${obj.lifecycleKey}`;

      //    return obj;
      // }

      values() {
         var obj = {};
         var ids = this.ids;

         obj.label = $$(ids.name).getValue();
         obj.to = $$(ids.to).getValue();
         obj.from = $$(ids.from).getValue();
         obj.subject = $$(ids.subject).getValue();
         obj.message = $$(ids.message).getValue();
         obj.toCustom = $$(ids.toCustom).getValue();
         obj.toCustomFields = $$(ids.toCustomFields).getValue();
         obj.fromCustom = $$(ids.fromCustom).getValue();
         obj.fromCustomFields = $$(ids.fromCustomFields).getValue();
         obj.toUsers = this.toUser.values();
         obj.fromUsers = this.fromUser.values();

         return obj;
      }
   }

   return UIProcessEmail;
}
