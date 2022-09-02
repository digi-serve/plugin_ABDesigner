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
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupFilter extends UIClass {
      constructor(base) {
         super(base, {
            // filterPanel: `${base}_filterPanel`,
            // globalFilterFormContainer: `${base}__globalFilterFormContainer`,
            // globalFilterForm: `${base}_globalFilterForm`,
            // filterMenutoolbar: `${base}_filterMenuToolbar`,
            // resetFilterButton: `${base}_resetFilterButton`,
         });

         this.AB = AB;
         this.base = base;
         this.object = null;

         this.rowFilter = this.AB.filterComplexNew(
            `${this.ids.component}_filter`
         );
         // {RowFilter}
         // we use this RowFilter to
         // display a form in a popup where the toolbar button is.

         this._settings = [];
         // {array}
         // an array of the ABField.columnNames of the fields
         // that we can filter by.
      }

      /**
       * @method fromSettings
       * Create an initial set of default values based upon our settings object.
       * @param {obj} settings  The settings object we created in .toSettings()
       */
      fromSettings(settings) {
         settings = settings || {};

         settings.filterOption =
            typeof settings.filterOption != "undefined"
               ? settings.filterOption
               : ABViewPropertyFilterData.default.filterOption;

         settings.isGlobalToolbar =
            typeof settings.isGlobalToolbar != "undefined"
               ? settings.isGlobalToolbar
               : ABViewPropertyFilterData.default.isGlobalToolbar;

         this.settings = settings;
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
         this.object = object;

         //tell each of our rules about our object
         // if (this.queryRules &&
         // 	this.queryRules.length) {
         // 	this.queryRules.forEach((r) => {
         // 		r.objectLoad(object);
         // 	});
         // }

         if (this.rowFilter) {
            this.rowFilter.fieldsLoad(object.fields(), object);

            // Add event listener
            this.rowFilter.on("save", (...params) => {
               this.emit("save", ...params);
               this.hide();
            });
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
            modal: true,
            autoheight: true,
            minHeight: 275,
            body: this.rowFilter.ui,
            on: {
               onShow: () => {
                  this.show();
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

      changed() {
         this.emit("changed", this._settings);
      }

      // our internal business logic

      // callbacks: {
      //    *
      //     * @function onChange
      //     * called when we have made changes to the hidden field settings
      //     * of our Current Object.
      //     *
      //     * this is meant to alert our parent component to respond to the
      //     * change.

      //    onChange: function (settings) {},
      // },

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

      setSettings(settings) {
         this._settings = this.AB.cloneDeep(settings || []);
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

      getSettings() {
         return this._settings || [];
      }
   }

   return new UI_Work_Object_Workspace_PopupFilter(ibase);
}
