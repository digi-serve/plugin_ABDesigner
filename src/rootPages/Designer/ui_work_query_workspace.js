export default function (AB, init_settings) {
   class UI_Work_Query_Workspace extends AB.ClassUI {
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

      applicationLoad() {
         // TODO
      }

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
