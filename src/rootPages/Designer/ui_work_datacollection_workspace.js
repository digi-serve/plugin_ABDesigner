export default function (AB, init_settings) {
   class UIWorkDatacollectionWorkspace extends AB.ClassUI {
      constructor(settings = init_settings || {}) {
         super();

         this.settings = settings;
      }

      ui() {
         return {};
      }

      init() {
         // TODO
         return Promise.resolve();
      }

      applicationLoad() {
         // TODO
      }

      clearWorkspace() {
         // TODO
      }

      populateWorkspace() {
         // TODO
      }
   }

   return UIWorkDatacollectionWorkspace;
}
