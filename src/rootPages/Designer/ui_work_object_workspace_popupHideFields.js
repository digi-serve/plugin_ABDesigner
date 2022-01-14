/*
 * ui_work_object_workspace_popupHideFields
 *
 * Manage the Hide Fields popup.
 *
 */

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_Workspace_PopupHideFields extends AB.ClassUI {
      constructor() {
         var idBase = "ui_work_object_workspace_popupHideFields";

         super({
            component: `${idBase}`,
            list: `${idBase}_list`,
            buttonHide: `${idBase}_buttonHide`,
            buttonShow: `${idBase}_buttonShow`,
         });

         this._settings = [];
         // {array}
         // an array of the ABField.columnNames of the fields
         // that we want to hide.

         this.CurrentObjectID = null;
         // {string}
         // the ABObject.id of the object we are working with.

         this._frozenColumnID = null;
         // {string}
         // the ABField.columnName of the column that is currently "frozen"
      }

      ui() {
         var ids = this.ids;

         // Our webix UI definition:
         return {
            view: "popup",
            id: ids.component,
            // modal: true,
            // autoheight:true,
            body: {
               rows: [
                  {
                     view: "list",
                     id: ids.list,
                     maxHeight: 350,
                     // autoheight: true,
                     select: false,
                     // template: '<span style="min-width: 18px; display: inline-block;"><i class="fa fa-circle ab-visible-field-icon"></i>&nbsp;</span> #label#',
                     template:
                        '<span style="min-width: 18px; display: inline-block;"><i class="fa ab-visible-field-icon"></i>&nbsp;</span> #label#',
                     on: {
                        onItemClick: (id, e, node) => {
                           this.clickListItem(id, e, node);
                        },
                        onAfterRender() {
                           this.data.each((a) => {
                              AB.ClassUI.CYPRESS_REF(
                                 this.getItemNode(a.id),
                                 `${ids.list}_${a.id}`
                              );
                           });
                        },
                     },
                  },
                  {
                     cols: [
                        {
                           id: ids.buttonHide,
                           view: "button",
                           value: L("Hide All"),
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                              onItemClick: () => {
                                 this.clickHideAll();
                              },
                           },
                        },
                        {
                           id: ids.buttonShow,
                           view: "button",
                           css: "webix_primary",
                           value: L("Show All"),
                           type: "form",
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                              onItemClick: () => {
                                 this.clickShowAll();
                              },
                           },
                        },
                     ],
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

      /**
       * @method CurrentObject()
       * A helper to return the current ABObject we are working with.
       * @return {ABObject}
       */
      get CurrentObject() {
         return this.AB.objectByID(this.CurrentObjectID);
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
       * @method clickHideAll
       * the user clicked the [hide all] option.  So hide all our fields.
       */
      clickHideAll() {
         // create an array of all our field.id's:
         var allFields = this.CurrentObject.fields();
         var newHidden = [];
         allFields.forEach(function (f) {
            newHidden.push(f.columnName);
         });

         this._settings = newHidden;

         this.iconsReset();
         this.changed();

         // _logic.callbacks.onChange(this._settings);
      }

      /**
       * @method clickShowAll
       * the user clicked the [show all] option.  So show all our fields.
       */
      clickShowAll() {
         this._settings = [];

         this.iconsReset();
         this.changed();
      }

      /**
       * @method clickListItem
       * update the clicked field setting.
       */
      clickListItem(id, e, node) {
         var item = this.$List.getItem(id);
         if (this._frozenColumnID == item.columnName) {
            webix.alert({
               text: L("Sorry, you cannot hide your last frozen column."),
            });
            return;
         }

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
       * @method iconFreezeOn
       * Show a thumb tack if the field is the choosen frozen column field
       * @param {DOM} node
       *        the html dom node of the element that contains our icon
       */
      iconFreezeOn(node) {
         if (node) {
            // node.querySelector('.ab-visible-field-icon')
            // .classList.remove("fa-circle");
            node
               .querySelector(".ab-visible-field-icon")
               .classList.add("fa-thumb-tack");
         }
      }

      /**
       * @method iconHide
       * Hide the icon for the given node
       * @param {DOM} node
       *        the html dom node of the element that contains our icon
       */
      iconHide(node) {
         if (node) {
            // node.querySelector('.ab-visible-field-icon').style.visibility = "hidden";
            // node.querySelector('.ab-visible-field-icon').classList.remove("fa-circle");
            node
               .querySelector(".ab-visible-field-icon")
               .classList.add("fa-eye-slash");
            node.style.opacity = 0.4;
         }
      }

      /**
       * @method iconShow
       * Show the icon for the given node
       * @param {DOM} node
       *        the html dom node of the element that contains our icon
       */
      iconShow(node) {
         if (node) {
            // node.querySelector('.ab-visible-field-icon').style.visibility = "visible";
            node
               .querySelector(".ab-visible-field-icon")
               .classList.remove("fa-eye-slash");
            // node.querySelector('.ab-visible-field-icon').classList.add("fa-circle");
            node.style.opacity = 1;
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
       * @method objectLoad
       * Ready the Popup according to the current object
       * @param {ABObject} object
       *        the currently selected ABObject.
       */
      objectLoad(object) {
         this.CurrentObjectID = object.id;
      }

      /**
       * @method onShow
       * Ready the Popup according to the current object each time it is
       * shown (perhaps a field was created or delted)
       */
      onShow() {
         // refresh list
         var allFields = this.CurrentObject.fields();
         var listFields = [];
         allFields.forEach((f) => {
            listFields.push({
               id: f.id,
               label: f.label,
               columnName: f.columnName,
            });
         });
         this.$List.clearAll();
         this.$List.parse(allFields);
      }

      /**
       * @method show()
       * Show this component.
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

      getSettings() {
         return this._settings || [];
      }

      setFrozenColumnID(frozenColumnID) {
         this._frozenColumnID = frozenColumnID;
      }
   }

   return new UI_Work_Object_Workspace_PopupHideFields();
}
