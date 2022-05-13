/*
 * ui_work_object_workspace_popupCountColumns
 *
 * Manage the Count Columns popup.
 *
 */

import UI_Class from "./ui_class";

export default function (AB, ibase) {
   ibase = ibase || "ui_work_object_workspace_popupCountColumns";
   // const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupCountColumns extends UIClass {
      constructor(base) {
         super(base, {
            list: "",
         });

         this.CountFieldIds = [];
         // {array}
         // An array of the ABField.ids that are our count fileds.
      }

      // Our webix UI definition:
      ui() {
         const ids = this.ids;

         return {
            id: ids.component,
            view: "popup",
            body: {
               rows: [
                  {
                     cols: [
                        {
                           view: "button",
                           css: "webix_primary",
                           value: L("Select All"),
                           on: {
                              onItemClick: () => {
                                 this.clickShowAll();
                              },
                           },
                        },
                        {
                           view: "button",
                           value: L("Unselect All"),
                           on: {
                              onItemClick: () => {
                                 this.clickHideAll();
                              },
                           },
                        },
                     ],
                  },
                  {
                     id: ids.list,
                     view: "list",
                     maxHeight: 250,
                     select: false,
                     template:
                        '<span style="min-width: 18px; display: inline-block;"><i class="fa ab-count-field-icon"></i>&nbsp;</span> #label#',
                     on: {
                        onItemClick: (id, e, node) => {
                           this.clickListItem(id, e, node);
                        },
                     },
                  },
               ],
            },
            on: {
               onShow: () => {
                  this.onShow();
               },
            },
         };
      }

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         return Promise.resolve();
      }

      onChange() {
         this.emit("changed", this.CountFieldIds);
      }

      /**
       * @method clickHideAll
       * the user clicked the [hide all] option.  So hide all our fields.
       */
      clickHideAll() {
         var List = $$(this.ids.list);

         // pass an array is empty
         this.CountFieldIds = [];

         // hide all icons
         List.find({}).forEach((item) => {
            this.iconHide(item.id);
         });

         this.onChange();
      }

      /**
       * @method clickShowAll
       * the user clicked the [show all] option.  So show all our fields.
       */
      clickShowAll() {
         var List = $$(this.ids.list);

         this.CountFieldIds = List.find({}).map((f) => f.id);

         // show all icons
         List.find({}).forEach((item) => {
            this.iconShow(item.id);
         });

         this.onChange();
      }

      /**
       * @function clickListItem
       * update the clicked field setting.
       */
      clickListItem(fieldId) {
         // select
         if (this.CountFieldIds.indexOf(fieldId) < 0) {
            this.CountFieldIds.push(fieldId);

            this.iconShow(fieldId);
         }
         // unselect
         else {
            this.CountFieldIds = this.CountFieldIds.filter(
               (fid) => fid != fieldId
            );

            this.iconHide(fieldId);
         }

         this.onChange();
      }

      /**
       * @method getValue()
       * return the current value of the Summary Columns settings.
       */
      getValue() {
         return this.CountFieldIds;
      }

      /**
       * @function iconHide
       * Hide the icon for the given node
       * @param {DOM} node  the html dom node of the element that contains our icon
       */
      iconHide(fieldId) {
         var List = $$(this.ids.list);
         var $node = List.getItemNode(fieldId);
         if ($node) {
            $node
               .querySelector(".ab-count-field-icon")
               .classList.remove("fa-circle");
         }
      }

      /**
       * @function iconShow
       * Show the icon for the given node
       * @param {DOM} node  the html dom node of the element that contains our icon
       */
      iconShow(fieldId) {
         var List = $$(this.ids.list);
         var $node = List.getItemNode(fieldId);
         if ($node) {
            $node
               .querySelector(".ab-count-field-icon")
               .classList.add("fa-circle");
         }
      }

      /**
       * @function setValue
       *
       * @param {array} - an array contains field ids
       */
      setValue(fieldIds) {
         this.CountFieldIds = fieldIds || [];
         this.onShow();
      }

      /**
       * @function onShow
       * Ready the Popup according to the current object each time it is shown (perhaps a field was created or delted)
       */
      onShow() {
         // refresh list
         var allFields = this.CurrentObject.fields().map((f) => {
            return {
               id: f.id,
               label: f.label,
            };
         });

         $$(this.ids.list).clearAll();
         $$(this.ids.list).parse(allFields);

         // update icons
         this.CountFieldIds.forEach((fieldId) => {
            this.iconShow(fieldId);
         });
      }

      /**
       * @function show()
       *
       * Show this component.
       * @param {obj} $view  the webix.$view to hover the popup around.
       */
      show(...params) {
         $$(this.ids.component).show(...params);
      }
   }
   return new UI_Work_Object_Workspace_PopupCountColumns(ibase);
}
