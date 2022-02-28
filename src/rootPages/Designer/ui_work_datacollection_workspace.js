import UI_Class from "./ui_class";
export default function (AB, init_settings) {
   const UIClass = UI_Class(AB);
   // var L = UIClass.L();
   class UI_Work_Datacollection_Workspace extends UIClass {
      constructor(settings = init_settings || {}) {
         super("ui_work_datacollection_workspace");

         this.settings = settings;
      }

      ui() {
         return {};
      }

      init() {
         // TODO
         return Promise.resolve();
      }

      // applicationLoad(app) {
      //    super.applicationLoad(app);
      //    // TODO
      // }

      clearWorkspace() {
         // TODO
      }

      populateWorkspace() {
         // TODO
      }
   }

   return new UI_Work_Datacollection_Workspace();
}
