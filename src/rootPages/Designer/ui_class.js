/*
 * ui_class
 *
 * A common UI object for our UI pages.
 *

 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

export default function (AB) {
   if (!myClass) {
      myClass = class UI extends AB.ClassUI {
         constructor(...params) {
            super(...params);

            this.CurrentApplicationID = null;
            // {string} uuid
            // The current ABApplication.id we are working with.

            this.CurrentObjectID = null;
            // {string}
            // the ABObject.id of the object we are working with.
         }

         static L() {
            return function (...params) {
               return AB.Multilingual.labelPlugin("ABDesigner", ...params);
            };
         }

         /**
          * @method CurrentApplication
          * return the current ABApplication being worked on.
          * @return {ABApplication} application
          */
         get CurrentApplication() {
            return this.AB.applicationByID(this.CurrentApplicationID);
         }

         /**
          * @function applicationLoad
          * save the ABApplication.id of the current application.
          * @param {ABApplication} app
          */
         applicationLoad(app) {
            this.CurrentApplicationID = app?.id;
         }

         objectLoad(obj) {
            this.CurrentObjectID = obj?.id;
         }

         /**
          * @method CurrentObject()
          * A helper to return the current ABObject we are working with.
          * @return {ABObject}
          */
         get CurrentObject() {
            return this.AB.objectByID(this.CurrentObjectID);
         }
      };
   }

   return myClass;
}
