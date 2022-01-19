import UI_Class from "./ui_class";

export default function (AB, init_settings) {
   const UIClass = UI_Class(AB);
   // var L = UIClass.L();
   class UI_Work_Query_Workspace extends UIClass {
      constructor(settings = init_settings || {}) {
         super();

         this.settings = settings;
      }

      ui() {
         return {};
      }

      init() {
         // TODO
      }

      // applicationLoad(app) {
      //    super.applicationLoad(app);
      //    // TODO
      // }

      clearWorkspace() {
         // TODO
      }

      resetTabs() {
         // TODO
      }

      populateQueryWorkspace() {
         // TODO
      }
   }

   return new UI_Work_Query_Workspace();
}
