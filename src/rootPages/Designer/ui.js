/*
 * UI
 *
 * The central Controller for the ABDesigner.
 *
 * We switch between allowing a User to Choose an application to work
 * with, and the actual Workspace for an Application.
 */

import AppChooserFactory from "./ui_choose.js";
// import AppWorkspaceFactory from "./ui_work.js";

export default function (AB) {
   const AppChooser = AppChooserFactory(AB);
   // const AppWorkspace = AppWorkspaceFactory(AB);

   class UI extends AB.ClassUI {
      constructor() {
         super("abd");
         this.id = this.ids.component;
      }

      label() {
         return AB.Multilingual.labelPlugin("ABDesigner", "AB Designer");
      }

      // return "popup" or "page"
      type() {
         return "page";
      }

      // Return any sub pages.
      pages() {
         return [];
      }

      /* mimic the ABPage.component() */
      component() {
         return {
            ui: this.ui(),
            init: () => {
               return this.init(AB);
            },
            onShow: () => {
               /* does anything special need to happen here? */
               this.show();
            },
         };
      }

      ui() {
         return {
            id: this.ids.component,
            view: "multiview",
            borderless: true,
            animate: false,
            // height : 800,
            rows: [AppChooser.ui() /*, AppWorkspace.ui*/],
         };
      }

      async init(AB) {
         this.AB = AB;

         return Promise.all([
            AppChooser.init(AB) /*, AppWorkspace.init(AB)*/,
         ]).then(() => {
            // Register for ABDefinition Updates
            return this.AB.Network.post({
               url: `/definition/register`,
            }).catch((err) => {
               if (err?.code == "E_NOPERM") {
                  // ?? What do we do here ??
                  this.AB.notify.developer(err, {
                     plugin: "ABDesigner",
                     context: "ui::init():/definition/register",
                     msg: "User is not able to access /definition/register",
                  });
               }
            });
         });
      }

      /**
       * isRoot()
       * indicates this is a RootPage.
       * @return {bool}
       */
      isRoot() {
         return true;
      }

      show() {
         super.show();
         AppChooser.show();
      }
   }
   return new UI();
}
