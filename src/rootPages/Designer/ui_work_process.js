/*
 * ui_work_process
 *
 * Display the Process Tab UI:
 *
 */
import UI_Class from "./ui_class";
import UI_Work_Process_List from "./ui_work_process_list";
import UI_Work_Process_Workspace from "./ui_work_process_workspace";

export default function (AB) {
   const UIClass = UI_Class(AB);

   class UI_Work_Process extends UIClass {
      constructor() {
         super("ui_work_process");

         this.CurrentProcessID = null;
         // {string} uuid
         // The current ABProcess.id we are working with.

         this.ProcessList = UI_Work_Process_List(AB);
         this.ProcessWorkspace = UI_Work_Process_Workspace(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            margin: 10,
            cols: [
               this.ProcessList.ui(),
               { view: "resizer", css: "bg_gray", width: 11 },
               this.ProcessWorkspace.ui(),
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
         // the ProcessWorkspace can show an [add] button if there is
         // no Process selected. When that Add button is pressed,
         // trigger our addNew process on our ProcessList
         this.ProcessWorkspace.on("addNew", () => {
            this.ProcessList.clickNewProcess(true);
         });

         this.ProcessList.on("selected", this.select);

         this.ProcessList.on("deleted", (process) => {
            if (this.CurrentProcessID == process.id) {
               this.select(null);
            }
         });

         return Promise.all([
            this.ProcessWorkspace.init(AB),
            this.ProcessList.init(AB),
         ]);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         var app = this.CurrentApplication;
         if (app && (!app.loadedProcesss || this.ProcessList?.count() < 1)) {
            this.ProcessList?.busy();
            this.ProcessList?.applicationLoad(app);
            this.ProcessList?.ready();
         }
      }

      select(process) {
         this.CurrentProcessID = process?.id;

         if (!process) this.ProcessWorkspace?.clearWorkspace();
         else this.ProcessWorkspace?.populateWorkspace(process);
      }
   }

   return new UI_Work_Process();
}
