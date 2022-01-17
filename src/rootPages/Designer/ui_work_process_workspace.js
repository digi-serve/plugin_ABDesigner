export default function (AB, init_settings) {
   class UIWorkProcessWorkspace extends AB.ClassUI {
      constructor(settings = init_settings || {}) {
         super();

         this.settings = settings;
      }

      ui() {}

      init() {}

      populateWorkspace() {}
   }

   return UIWorkProcessWorkspace;
}
