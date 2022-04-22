/*
 * ABProcessparticipant
 *
 * Display the form for entering the properties for a Process
 * Participant Element
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";
import FABProcessParticipant from "./ABProcessParticipant_selectManagersUI";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   const ABProcessParticipantUsers = FABProcessParticipant(AB);

   class ABProcessparticipant extends UIClass {
      constructor() {
         super("properties_process_participant", {
            name: "",
            users: "",
         });

         this.users = new ABProcessParticipantUsers(
            this.ids.component + "_users_"
         );
      }

      static key = "process.participant";
      // {string}
      // This should match the ABProcessParticipant.defaults().key value.

      uiUser(obj) {
         var usersUI = this.users.ui(obj ?? {});
         return {
            id: this.ids.users,
            rows: [usersUI],
            paddingY: 10,
         };
      }

      ui(obj) {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.

         let ids = this.ids;
         let ui = {
            id: ids.component,
            rows: [
               { view: "label", label: L("Process Participant:") },
               {
                  view: "label",
                  label: L(
                     "This element defines a group of users that are responsible for the tasks contained within."
                  ),
               },
               {
                  view: "form",
                  id: ids.form,
                  // width: 300,
                  elements: [
                     {
                        id: ids.name,
                        view: "text",
                        label: L("Name"),
                        name: "name",
                        value: this.name,
                     },
                     // Select Users Template Goes here
                  ],
               },
            ],
         };
         let usersUI = { id: ids.users };
         // If we don't have any sub lanes, then offer the select user options:
         if (obj?.laneIDs && obj?.laneIDs.length == 0) {
            usersUI = this.uiUser(obj ?? {});
         }
         ui.rows[2].elements.push(usersUI);

         return ui;
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

         if (obj.laneIDs && obj.laneIDs.length == 0) {
            var usersUI = this.uiUser(obj ?? {});
            webix.ui(usersUI, $$(ids.users));
         }
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

         // if (obj.laneIDs.length == 0) {
         var userDef = this.users.values();
         Object.keys(userDef).forEach((k) => {
            obj[k] = userDef[k];
         });
         // }
         return obj;
      }
   }

   return ABProcessparticipant;
}
