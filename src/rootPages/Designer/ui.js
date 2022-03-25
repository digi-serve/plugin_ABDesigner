/*
 * UI
 *
 * The central Controller for the ABDesigner.
 *
 * We switch between allowing a User to Choose an application to work
 * with, and the actual Workspace for an Application.
 */
import UI_Class from "./ui_class";
import AppChooserFactory from "./ui_choose.js";
import AppWorkspaceFactory from "./ui_work.js";

export default function (AB) {
   const UIClass = UI_Class(AB);

   const AppChooser = AppChooserFactory(AB);
   const AppWorkspace = AppWorkspaceFactory(AB);

   var L = UIClass.L();

   class UI extends UIClass {
      constructor() {
         super("abd");
         this.id = this.ids.component;
      }

      label() {
         return L("AB Designer");
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

      /* mimic ABPage.getUserAccess() */
      getUserAccess() {
         return 2;
      }

      ui() {
         return {
            id: this.ids.component,
            view: "multiview",
            borderless: true,
            animate: false,
            // height : 800,
            rows: [AppChooser.ui(), AppWorkspace.ui()],
         };
      }

      async init(AB) {
         this.AB = AB;

         AppChooser.on("view.workplace", (application) => {
            AppWorkspace.transitionWorkspace(application);
         });

         AppWorkspace.on("view.chooser", () => {
            AppChooser.show();
         });
         AppWorkspace.on("warnings", () => {
            AppChooser.emit("warnings");
         });

         await Promise.all([AppChooser.init(AB), AppWorkspace.init(AB)]);

         try {
            await this.AB.Network.post({
               url: `/definition/register`,
            });
         } catch (err) {
            if (err?.code == "E_NOPERM") {
               // ?? What do we do here ??
               this.AB.notify.developer(err, {
                  plugin: "ABDesigner",
                  context: "ui::init():/definition/register",
                  msg: "User is not able to access /definition/register",
               });
            }
         }
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
