/*
 * ui_work_object_workspace_popupImport
 *
 * Manage the Import CSV data to our currently selected ABObject.
 *
 */
import UI_Class from "./ui_class";
import FViewProperties from "./properties/views/ABViewCSVImporter";

export default function (AB) {
   const UIClass = UI_Class(AB);
   // var L = UIClass.L();
   const ViewProperties = FViewProperties(AB);

   class UI_Work_Object_Workspace_PopupImport extends UIClass {
      constructor() {
         super("ui_work_object_workspace_popupImport");

         this._mockApp = AB.applicationNew({});
         // {ABApplication}
         // Any ABViews we create are expected to be in relation to
         // an ABApplication, so we create a "mock" app for our
         // workspace views to use to display.

         this.popup = null;
         // {ABViewCSVImporter}
         // an instance of our ABViewCSVImporter widget that we use to display
         // the CSV Import interface.
      }

      ui() {
         return {};
      }

      init(AB) {
         this.AB = AB;

         var defaultSettings = ViewProperties.toSettings();
         var defaultView = this._mockApp.viewNew(
            defaultSettings,
            this._mockApp
         );

         this.popup = defaultView.component();
         this.popup.init(AB);
         this.popup.objectLoad(this.CurrentObject);
      }

      objectLoad(object) {
         super.objectLoad(object);

         this.popup?.objectLoad(object);
      }

      /**
       * @function show()
       *
       * Show popup.
       */
      show() {
         this.popup.showPopup();
      }

      hide() {
         this.popup.hide();
      }
   }

   return new UI_Work_Object_Workspace_PopupImport();
}
