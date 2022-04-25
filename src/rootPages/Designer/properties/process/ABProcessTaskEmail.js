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
            fromCustom: "",
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
      // This should match the ABProcessTriggerLifecycleCore.defaults().key value.

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
                                 $$(ids.toCustom).hide();
                              } else if (parseInt(val) == 2) {
                                 $$(ids.toUser).hide();
                                 $$(ids.toCustom).show();
                              } else {
                                 $$(ids.toUser).hide();
                                 $$(ids.toCustom).hide();
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
                        id: ids.toCustom,
                        view: "text",
                        label: L("Email"),
                        placeholder: L("Type email address here..."),
                        name: "toCustom",
                        value: this.toCustom,
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
                                 $$(ids.fromCustom).hide();
                              } else if (parseInt(val) == 2) {
                                 $$(ids.fromUser).hide();
                                 $$(ids.fromCustom).show();
                              } else {
                                 $$(ids.fromUser).hide();
                                 $$(ids.fromCustom).hide();
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
                        id: ids.fromCustom,
                        view: "text",
                        label: L("Email"),
                        placeholder: L("Type email address here..."),
                        name: "fromCustom",
                        value: this.fromCustom,
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

      // applicationLoad(application) {
      //    super.applicationLoad(application);

      //    $$(this.ids.objList).define("data", listObj);
      //    $$(this.ids.objList).refresh();
      // }

      // show() {
      //    super.show();
      //    AppList.show();
      // }

      populate(obj) {
         let ids = this.ids;

         $$(ids.name).setValue(obj.name);
         $$(ids.to).setValue(obj.to);
         $$(ids.from).setValue(obj.from);
         $$(ids.subject).setValue(obj.subject);
         $$(ids.message).setValue(obj.message);
         $$(ids.toCustom).setValue(obj.toCustom);
         $$(ids.fromCustom).setValue(obj.fromCustom);

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
         obj.fromCustom = $$(ids.fromCustom).getValue();
         obj.toUsers = this.toUser.values();
         obj.fromUsers = this.fromUser.values();

         return obj;
      }
   }

   return UIProcessEmail;
}
