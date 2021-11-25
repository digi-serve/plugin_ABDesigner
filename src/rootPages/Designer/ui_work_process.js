/*
 * ab_work_process
 *
 * Display the Process Tab UI:
 *
 */

import UI_Work_Process_List from "./ui_work_process_list";
import UI_Work_Process_Workspace from "./ui_work_process_workspace";

export default function (AB) {
   const Process_List = UI_Work_Process_List(AB);
   const Process_Workspace = UI_Work_Process_Workspace(AB);

   class UI_Work_Process extends AB.ClassUI {
      constructor() {
         super("ab_work_process");

         this.CurrentApplication = null;
         this.ProcessList = new Process_List();
         this.ProcessWorkspace = new Process_Workspace(/** default settings */);
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
            if (this.CurrentProcess.id == process.id) {
               this.select(null);
            }
         });

         return Promise.all([
            this.ProcessWorkspace.init(AB),
            this.ProcessList.init(AB),
         ]);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Query Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplication = application;

         this.ProcessList.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         if (
            this.CurrentApplication &&
            (!this.CurrentApplication.loadedProcesss ||
               this.ProcessList?.count() < 1)
         ) {
            this.ProcessList?.busy();
            this.ProcessList?.applicationLoad(this.CurrentApplication);
            this.ProcessList?.ready();
         }
      }

      select(process) {
         this.CurrentProcess = process;

         if (process == null) this.ProcessWorkspace?.clearWorkspace();
         else this.ProcessWorkspace?.populateWorkspace(process);
      }
   }

   return UI_Work_Process;
}
