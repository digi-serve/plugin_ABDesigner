/*
 * ui_work_object_workspace_popupFilter
 *
 * Manage the Filter popup.
 *
 */
import UI_Class from "./ui_class";
export default function (AB, ibase) {
   ibase = ibase || "ui_work_object_workspace_popupHideFields";
   const UIClass = UI_Class(AB);
   // var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupFilter extends UIClass {
      constructor(base) {
         super(base, {});

         this.AB = AB;
         this.base = base;

         this.rowFilter = this.AB.filterComplexNew(
            `${this.ids.component}_filter`
         );
         // {RowFilter}
         // we use this RowFilter to
         // display a form in a popup where the toolbar button is.

         // Add event listener
         this.rowFilter.on("save", (...params) => {
            this.emit("save", ...params);
            this.hide();
         });
      }

      /**
       * @method objectLoad
       * A rule is based upon a Form that was working with an Object.
       * Ready the Popup according to the current object
       * .objectLoad() is how we specify which object we are working with.
       *
       * @param {ABObject} The object that will be used to evaluate the Rules
       */
      objectLoad(object) {
         super.objectLoad(object);

         if (this.rowFilter) {
            this.rowFilter.fieldsLoad(object.fields(), object);
         }
      }

      viewLoad(view) {
         this.view = view;
      }

      /** == UI == */
      ui() {
         var ids = this.ids;

         // Our webix UI definition:
         return {
            view: "popup",
            id: ids.component,
            autoheight: true,
            minHeight: 275,
            body: this.rowFilter.ui,
            on: {
               // onShow: () => {
               //    this.show();
               // },
               onHide: () => {
                  this.hide();
               },
            },
         };
      }

      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());

         // Quick Reference Helpers
         this.$Component = $$(this.ids.component);
         this.$List = $$(this.ids.list);
      }

      /**
       * @method show()
       * Show this component.
       * Ready the Popup according to the current object each time it is
       * shown (perhaps a field was created or delted)
       * @param {obj} $view
       *        the webix.$view to hover the popup around.
       */
      show($view, options = null) {
         if (options != null) {
            this.$Component.show($view, options);
         } else {
            this.$Component.show($view);
         }
      }

      /**
       * @method hide()
       * Hide this component.
       *
       * @param {obj} $view
       *        the webix.$view to hover the popup around.
       */
      hide($view, options = null) {
         if (options != null) {
            this.$Component.hide($view, options);
         } else {
            this.$Component.hide($view);
         }
      }
      /*
       * this runs on workspace switch
       */
      setFilter(filter) {
         if (!filter.rules?.length) {
            filter = filter[0] || [];
         }
         this.rowFilter.setValue(filter);
      }
   }

   return new UI_Work_Object_Workspace_PopupFilter(ibase);
}
