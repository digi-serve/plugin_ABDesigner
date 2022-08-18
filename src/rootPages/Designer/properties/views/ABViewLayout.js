/*
 * ABViewLayout
 * A Property manager for our ABViewLayout definitions
 */
import FABView from "./ABView";

export default function (AB) {
   const ABView = FABView(AB);
   const L = ABView.L();

   const base = "properties_abview_layout";

   class ABViewLayoutProperty extends ABView {
      constructor() {
         super(base, {
            // Put our ids here
         });

         this.AB = AB;
      }

      static get key() {
         return "layout";
      }

      ui() {
         return super.ui([
            // [button] : add column
            {
               view: "button",
               css: "webix_primary",
               value: L("Add Column "),
               click: () => this.addView(),
            },
         ]);
      }

      defaultValues() {
         let values = {};
         const ViewClass = this.ViewClass();
         if (ViewClass) {
            values = ViewClass.defaultValues();
         }
         return values;
      }

      /**
       * @method ViewClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("layout");
      }

      /**
       * @method addView
       * called when the .propertyEditorDefaultElements() button is clicked.
       * This method should find the current View instance and call it's .addColumn()
       * method.
       */
      async addView() {
         // get current instance and .addColumn()
         const currView = this.CurrentView;
         currView.addColumn();

         // save child views
         const addingTasks = [];
         currView.views().forEach((v) => {
            addingTasks.push(v.save());
         });
         await Promise.all(addingTasks);

         // const includeSubViews = true; // we ask later on down the save if we should save subviews...we do this time

         // trigger a save()
         // this.propertyEditorSave(ids, currView, includeSubViews);

         this.onChange();
      }
   }

   return ABViewLayoutProperty;
}
