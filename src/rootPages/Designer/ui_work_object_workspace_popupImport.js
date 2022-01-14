/*
 * ui_work_object_workspace_popupImport
 *
 * Manage the Import CSV data to our currently selected ABObject.
 *
 */
import FViewProperties from "./properties/views/ABViewCSVImporter";

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };
   const ViewProperties = FViewProperties(AB);

   class UI_Work_Object_Workspace_PopupImport extends AB.ClassUI {
      constructor() {
         var idBase = "ui_work_object_workspace_popupImport";

         super({
            component: idBase,
         });

         this._mockApp = AB.applicationNew({});
         // {ABApplication}
         // Any ABViews we create are expected to be in relation to
         // an ABApplication, so we create a "mock" app for our
         // workspace views to use to display.

         this.CurrentObjectID = null;
         // {string}
         // the ABObject.id of the object we are working with.

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

      /**
       * @method CurrentObject()
       * A helper to return the current ABObject we are working with.
       * @return {ABObject}
       */
      get CurrentObject() {
         return this.AB.objectByID(this.CurrentObjectID);
      }

      objectLoad(object) {
         this.CurrentObjectID = object.id;

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
