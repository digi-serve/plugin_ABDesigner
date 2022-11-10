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
      }

      static get key() {
         return "TaskService";
      }
      // {string}
      // This should match the ABProcessTaskServiceCore.defaults().key value.

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
                           this.switchTo("AccountingBatchProcessing");
                        },
                     },
                     {
                        view: "button",
                        label: L("Accounting: Fiscal Period Close"),
                        click: () => {
                           this.switchTo("AccountingFPClose");
                        },
                     },
                     {
                        view: "button",
                        label: L("Accounting: Fiscal Period Year Close"),
                        click: () => {
                           this.switchTo(
                              "AccountingFPYearClose",
                              ids.component
                           );
                        },
                     },
                     {
                        view: "button",
                        label: L("Accounting: Journal Entry Archive"),
                        click: () => {
                           this.switchTo("AccountingJEArchive");
                        },
                     },
                     {
                        view: "button",
                        label: L("Query Task"),
                        click: () => {
                           this.switchTo("TaskServiceQuery");
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
                           this.switchTo("Calculate");
                        },
                     },
                     {
                        view: "button",
                        label: L("Get Reset Password Url"),
                        click: () => {
                           this.switchTo("GetResetPasswordUrl");
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
         values.key = key ?? this.key;

         const subtask =
            ProcessTaskManager.newTask(values, this.element.process, this.AB) ??
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

         obj.label = $name?.getValue() ?? "";
         obj.name = $name?.getValue() ?? "";

         return obj;
      }

      populate(element) {
         const ids = this.ids;

         const $name = $$(ids.name);

         this.element = element;

         $name?.setValue(element.label ?? "");
      }
   }

   return UIProcessService;
}
