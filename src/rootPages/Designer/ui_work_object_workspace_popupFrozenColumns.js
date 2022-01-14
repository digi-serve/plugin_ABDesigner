/*
 * ui_work_object_workspace_popupFrozenColumns
 *
 * Manage the Frozen Columns popup.
 *
 */

// const ABComponent = require("../AppBuilder/platform/ABComponent");

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_Workspace_PopupFrozenColumns extends AB.ClassUI {
      constructor() {
         var idBase = "ui_work_object_workspace_popupFrozenColumns";
         super({
            component: `${idBase}_popupFrozen`,
            list: `${idBase}_popupFrozen_list`,
         });

         this._setting = "";
         // {string}
         // the ABField.columnName of the field that we want to freeze at.

         this.CurrentObjectID = null;
         // {string}
         // the ABObject.id of the object we are working with.

         var CurrentView = null;
      }

      ui() {
         var ids = this.ids;

         // Our webix UI definition:
         return {
            view: "popup",
            id: ids.component,
            // modal: true,
            // autoheight:true,
            width: 500,
            body: {
               rows: [
                  {
                     view: "list",
                     id: ids.list,
                     width: 250,
                     // autoheight: true,
                     maxHeight: 350,
                     select: false,
                     template:
                        '<span style="min-width: 18px; display: inline-block;"><i class="fa fa-circle-o ab-frozen-field-icon"></i>&nbsp;</span> #label#',
                     on: {
                        onItemClick: (id, e, node) => {
                           this.clickListItem(id, e, node);
                        },
                     },
                  },
                  {
                     view: "button",
                     css: "webix_primary",
                     value: L("Clear All"),
                     type: "form",
                     on: {
                        onItemClick: (id, e, node) => {
                           return this.clickClearAll();
                        },
                     },
                  },
               ],
            },
            on: {
               onShow: () => {
                  this.onShow();
                  this.iconsReset();
               },
            },
         };
      }

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
      }

      changed() {
         this.emit("changed", this._setting);
      }

      /**
       * @method CurrentObject()
       * A helper to return the current ABObject we are working with.
       * @return {ABObject}
       */
      get CurrentObject() {
         return this.AB.objectByID(this.CurrentObjectID);
      }

      // our internal business logic

      /**
       * @method clickClearAll
       * the user clicked the [clear all] option.  So show unfreeze all our
       * columns.
       */
      clickClearAll() {
         this.setValue("");
         this.iconsReset();
         this.changed();
      }

      /**
       * @method clickListItem
       * update the list to show which columns are frozen by showing an icon
       * next to the column name
       */
      clickListItem(id, e, node) {
         // update our Object with current frozen column id
         var List = $$(this.ids.list);
         var recordClicked = List.getItem(id);
         var label = recordClicked.columnName;

         if ((this._hiddenFields || []).indexOf(label) != -1) {
            webix.alert({
               text: L("Sorry, you cannot freeze a hidden column."),
            });
            return;
         }

         this.setValue(label);
         this.iconsReset();
         this.changed();
      }

      /**
       * @method iconDefault
       * Hide the icon for the given node
       * @param {DOM} node
       *        the html dom node of the element that contains our icon
       */
      iconDefault(node) {
         if (node) {
            node
               .querySelector(".ab-frozen-field-icon")
               .classList.remove("fa-circle");
            node
               .querySelector(".ab-frozen-field-icon")
               .classList.add("fa-circle-o");
         }
      }

      /**
       * @method iconFreeze
       * Show the icon for the given node
       * @param {DOM} node
       *        the html dom node of the element that contains our icon
       */
      iconFreeze(node) {
         if (node) {
            node
               .querySelector(".ab-frozen-field-icon")
               .classList.remove("fa-circle-o");
            node
               .querySelector(".ab-frozen-field-icon")
               .classList.add("fa-circle");
         }
      }

      /**
       * @method iconsReset
       * Reset the icon displays according to the current values in our Object
       */
      iconsReset() {
         var List = $$(this.ids.list);
         var isFrozen = false;

         // for each item in the List
         var id = List.getFirstId();
         while (id) {
            var record = List.getItem(id);
            var label = record.columnName;

            // find it's HTML Node
            var node = List.getItemNode(id);

            if (this._setting == "") {
               // if there isn't any frozen columns just use the plain icon
               this.iconDefault(node);
            } else if (isFrozen == false) {
               // if this item is not the frozen id it is frozen until we reach
               // the frozen id
               this.iconFreeze(node);
            } else {
               // else just show default icon
               this.iconDefault(node);
            }

            if (this._setting == label) {
               isFrozen = true;
            }

            if ((this._hiddenFields || []).indexOf(label) != -1) {
               node.style.opacity = 0.4;
               node
                  .querySelector(".ab-frozen-field-icon")
                  .classList.remove("fa-circle");
               node
                  .querySelector(".ab-frozen-field-icon")
                  .classList.remove("fa-circle-o");
               node
                  .querySelector(".ab-frozen-field-icon")
                  .classList.add("fa-eye-slash");
            } else {
               node.style.opacity = 1;
               node
                  .querySelector(".ab-frozen-field-icon")
                  .classList.remove("fa-eye-slash");
            }

            // next item
            id = List.getNextId(id);
         }
      }

      /**
       * @method objectLoad
       * Ready the Popup according to the current object
       * @param {ABObject} object
       *        the currently selected object.
       */
      objectLoad(object) {
         this.CurrentObjectID = object.id;
      }

      onShow() {
         // refresh list
         var allFields = this.CurrentObject.fields();
         var listFields = [];
         allFields.forEach((f) => {
            listFields.push({
               id: f.id,
               label: f.label,
               columnName: f.columnName,
               $css: "hidden_fields_" + f.id,
            });
         });
         $$(this.ids.list).clearAll();
         $$(this.ids.list).parse(listFields);
      }

      /**
       * @method show()
       * Show this component.
       * @param {obj} $view
       *        the webix.$view to hover the popup around.
       */
      show($view, options) {
         if (options != null) {
            $$(this.ids.component).show($view, options);
         } else {
            $$(this.ids.component).show($view);
         }
      }

      setValue(setting) {
         this._setting = setting;
      }

      getValue() {
         return this._setting;
      }

      setHiddenFields(hidden_fields = []) {
         this._hiddenFields = hidden_fields ?? [];
      }
   }

   return new UI_Work_Object_Workspace_PopupFrozenColumns();
}
