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
            // list: "",
            // buttonHide: "",
            // buttonShow: "",
            filterPanel: `${base}_filterPanel`,
            globalFilterFormContainer: `${base}__globalFilterFormContainer`,
            globalFilterForm: `${base}_globalFilterForm`,
            filterMenutoolbar: `${base}_filterMenuToolbar`,
            resetFilterButton: `${base}_resetFilterButton`,
         });

         this.AB = AB;
         this.base = base;
         this.object = null;

         this.rowFilter = this.AB.filterComplexNew(
            `${this.ids.component}_filter`
         );
         // {RowFilter}
         // When .userFilterPosition == "toolbar" we use this RowFilter to
         // display a form in a popup where the toolbar button is.

         this._settings = [];
         // {array}
         // an array of the ABField.columnNames of the fields
         // that we want to hide.

         this._frozenColumnID = null;
         // {string}
         // the ABField.columnName of the column that is currently "frozen"
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
            // this.rowFilter.applicationLoad(object.application);
            this.rowFilter.fieldsLoad(object.fields(), object);

            // Add event listener
            this.rowFilter.on("save", (...params) => {
               this.emit("save", ...params);
            });
         }
      }

      viewLoad(view) {
         this.view = view;
      }

      /** == UI == */
      ui() {
         var self = this;
         var ids = this.ids;

         // Our webix UI definition:
         return {
            view: "popup",
            id: ids.component,
            // modal: true,
            // autoheight:true,
            body: this.rowFilter.ui,
            on: {
               onShow: () => {
                  this.show();
                  this.iconsReset();
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
       * @method clickSave
       * the user clicked the [hide all] option.  So hide all our fields.
       */
      clickSave(id, e, node) {
         debugger;
         // create an array of all our field.id's:
         var allFields = this.object._fields;
         var newHidden = [];
         allFields.forEach(function (f) {
            newHidden.push(f.columnName);
         });

         this._settings = newHidden;

         this.iconsReset();
         this.changed();
      }

      /**
       * @method clickListItem
       * update the clicked field setting.
       */
      clickListItem(id, e, node) {
         var item = this.$List.getItem(id);
         var newFields = [];
         var isHidden =
            (this._settings || []).filter((fID) => {
               return fID == item.columnName;
            }).length > 0;
         if (isHidden) {
            // unhide this field

            // get remaining fields
            newFields = (this._settings || []).filter((fID) => {
               return fID != item.columnName;
            });

            // find the icon and display it:
            this.iconShow(node);
         } else {
            newFields = this._settings || [];
            newFields.push(item.columnName);

            this.iconHide(node);
         }

         this._settings = newFields || [];
         this.changed();
      }

      /**
       * @method iconFreezeOff
       * Remove thumb tack if the field is not the choosen frozen column
       * field
       * @param {DOM} node
       *        the html dom node of the element that contains our icon
       */
      iconFreezeOff(node) {
         if (node) {
            node
               .querySelector(".ab-visible-field-icon")
               .classList.remove("fa-thumb-tack");
            // node.querySelector('.ab-visible-field-icon').classList.add("fa-circle");
         }
      }
      /**
       * @method iconsReset
       * Reset the icon displays according to the current values in our
       * Object
       */
      iconsReset() {
         var List = this.$List;

         // for each item in the List
         var id = List.getFirstId();
         while (id) {
            var item = List.getItem(id);

            // find it's HTML Node
            var node = List.getItemNode(id);

            if (this._frozenColumnID == item.columnName) {
               this.iconFreezeOn(node);
            } else {
               this.iconFreezeOff(node);
               // if this item is not hidden, show it.
               if ((this._settings || []).indexOf(item.columnName) == -1) {
                  this.iconShow(node);
               } else {
                  // else hide it
                  this.iconHide(node);
               }
            }

            // next item
            id = List.getNextId(id);
         }
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
