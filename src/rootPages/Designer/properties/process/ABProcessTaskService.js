import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const ProcessTaskManager = AB.Class.ABProcessTaskManager;

   class UIProcessService extends UIClass {
      constructor() {
         super("properties_process_service", {
            name: "",
            option: "",
         });

         this.element = null;
      }

      static get key() {
         return "TaskService";
      }
      // {string}
      // This should match the ABProcessTriggerLifecycleCore.defaults().key value.

      ui() {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.

         const ids = this.ids;

         return {
            id: ids.component,
            view: "form",
            elements: [
               {
                  id: ids.name,
                  view: "text",
                  label: L("Name"),
                  name: "name",
                  value: "",
               },
               {
                  id: ids.option,
                  rows: [
                     {
                        view: "button",
                        label: L("Accounting: Process Batch"),
                        click: () => {
                           this.switchTo("accountingBatch");
                        },
                     },
                     {
                        view: "button",
                        label: L("Accounting: Fiscal Period Close"),
                        click: () => {
                           this.switchTo("accountingFPClose");
                        },
                     },
                     {
                        view: "button",
                        label: L("Accounting: Fiscal Period Year Close"),
                        click: () => {
                           this.switchTo(
                              "accountingFPYearClose",
                              ids.component
                           );
                        },
                     },
                     {
                        view: "button",
                        label: L("Accounting: Journal Entry Archive"),
                        click: () => {
                           this.switchTo("accountingJEArchive");
                        },
                     },
                     {
                        view: "button",
                        label: L("Query Task"),
                        click: () => {
                           this.switchTo("query");
                        },
                     },
                     {
                        view: "button",
                        label: L("Insert Record Task"),
                        click: () => {
                           this.switchTo("InsertRecord");
                        },
                     },
                     {
                        view: "button",
                        label: L("Calculate Task"),
                        click: () => {
                           this.switchTo("calculate");
                        },
                     },
                     {
                        view: "button",
                        label: L("Get Reset Password Url"),
                        click: () => {
                           this.switchTo("GetResetPasswordUrl");
                           // this.AB.Network.post(
                           //    {
                           //       url:
                           //          "/auth/login/reset",
                           //       data: {
                           //          email: this.AB.Account.email(),
                           //          tenant: this.AB.Account.username(),
                           //          url:
                           //             window
                           //                .location
                           //                .origin ||
                           //             window
                           //                .location
                           //                .href,
                           //          fromProcessManager: "1",
                           //       },
                           //    },
                           // )
                           //    .then((data) => {
                           //       console.log(data)
                           //    })
                           //    .catch((err) => {
                           //       console.log(err);
                           //    });
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
      /**
       * switchTo()
       * replace this object with an instance of one of our child classes:
       * @param {string} classType
       *        a key representing with subObject to create an instance of.
       * @param {string} propertiesID
       *        the webix ui.id container for the properties panel.
       */
      switchTo(key) {
         const ids = this.ids;

         const values = this.values();

         values.id = this.element.id;
         values.diagramID = this.element.diagramID;

         switch (key) {
            // case "accountingBatch":
            //    child = new AccountingBatchProcessing(
            //       myValues,
            //       this.process,
            //       this.application
            //    );
            //    break;

            // case "accountingFPClose":
            //    child = new AccountingFPClose(
            //       myValues,
            //       this.process,
            //       this.application
            //    );
            //    break;

            // case "accountingFPYearClose":
            //    child = new AccountingFPYearClose(
            //       myValues,
            //       this.process,
            //       this.application
            //    );
            //    break;

            // case "accountingJEArchive":
            //    child = new AccountingJEArchive(
            //       myValues,
            //       this.process,
            //       this.application
            //    );
            //    break;

            // case "query":
            //    child = new ABProcessTaskServiceQuery(
            //       myValues,
            //       this.process,
            //       this.application
            //    );
            //    break;

            case "InsertRecord":
               values.key = key;

               break;

            // case "calculate":
            //    child = new ABProcessTaskServiceCalculate(
            //       myValues,
            //       this.process,
            //       this.application
            //    );
            //    break;

            case "GetResetPasswordUrl":
               values.key = key;

               break;

            default:
               values.key = this.key;
         }

         const subtask =
            ProcessTaskManager.newTask(values, this.element.process, this.AB) ||
            null;
         if (subtask) {
            this.element.switchTo(subtask, ids.component);
         }
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

      values() {
         const ids = this.ids;

         let obj = {};

         const $name = $$(ids.name);

         obj.label = $name.getValue() || "";
         obj.name = $name.getValue() || "";

         return obj;
      }

      populate(element) {
         const ids = this.ids;

         this.element = element;

         const $name = $$(ids.name);

         $name.setValue(element.label || "");
      }
   }

   return UIProcessService;
}
