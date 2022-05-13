/*
 * ui_work_object_workspace_popupSummaryColumns
 *
 * Manage the Summary Columns popup.
 *
 */
import UI_Class from "./ui_class";

export default function (AB, ibase) {
   ibase = ibase || "ui_work_object_workspace_popupSummaryColumns";
   // const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupSummaryColumns extends UIClass {
      constructor(base) {
         super(base, {
            list: "",
         });

         // make a reference to our Field CLASS definitions
         this.ABFieldNumber = AB.Class.ABFieldManager.fieldByKey("number");
         this.ABFieldFormula = AB.Class.ABFieldManager.fieldByKey("formula");
         this.ABFieldCalculate =
            AB.Class.ABFieldManager.fieldByKey("calculate");

         this.SummaryFieldIds = [];
         // {array}
         // an array of the {ABFieldXXX.id}s that are used as summary fields.
      }

      // Our webix UI definition:
      ui() {
         const ids = this.ids;

         return {
            view: "popup",
            id: ids.component,
            body: {
               rows: [
                  {
                     cols: [
                        {
                           view: "button",
                           value: L("Select All"),
                           on: {
                              onItemClick: () => {
                                 this.clickHideAll();
                              },
                           },
                        },
                        {
                           view: "button",
                           css: "webix_primary",
                           value: L("Unselect All"),
                           on: {
                              onItemClick: () => {
                                 this.clickShowAll();
                              },
                           },
                        },
                     ],
                  },
                  {
                     view: "list",
                     id: ids.list,
                     maxHeight: 250,
                     select: false,
                     template:
                        '<span style="min-width: 18px; display: inline-block;"><i class="fa ab-summary-field-icon"></i>&nbsp;</span> #label#',
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

      /**
       * @function clickHideAll
       * the user clicked the [hide all] option.  So hide all our fields.
       */
      clickHideAll() {
         var List = $$(this.ids.list);

         // pass an array is empty
         this.SummaryFieldIds = [];

         // hide all icons
         List.find({}).forEach((item) => {
            this.iconHide(item.id);
         });

         this.emit("changed", this.SummaryFieldIds);
         // _logic.callbacks.onChange(SummaryFieldIds);
      }

      /**
       * @function clickShowAll
       * the user clicked the [show all] option.  So show all our fields.
       */
      clickShowAll() {
         var List = $$(this.ids.list);

         this.SummaryFieldIds = List.find({}).map((f) => f.id);

         // show all icons
         List.find({}).forEach((item) => {
            this.iconShow(item.id);
         });
         this.emit("changed", this.SummaryFieldIds);
      }

      /**
       * @function clickListItem
       * update the clicked field setting.
       */
      clickListItem(fieldId) {
         // select
         if (this.SummaryFieldIds.indexOf(fieldId) < 0) {
            this.SummaryFieldIds.push(fieldId);

            this.iconShow(fieldId);
         }
         // unselect
         else {
            this.SummaryFieldIds = this.SummaryFieldIds.filter(
               (fid) => fid != fieldId
            );

            this.iconHide(fieldId);
         }
         this.emit("changed", this.SummaryFieldIds);
      }

      /**
       * @method getValue()
       * return the current value of the Summary Columns settings.
       */
      getValue() {
         return this.SummaryFieldIds;
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
               .querySelector(".ab-summary-field-icon")
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
               .querySelector(".ab-summary-field-icon")
               .classList.add("fa-circle");
         }
      }

      /**
       * @function objectLoad
       * Ready the Popup according to the current object
       * @param {ABObject} object  the currently selected object.
       */
      // objectLoad (object) {
      //    CurrentObject = object;
      // }

      /**
       * @function setValue
       *
       * @param {array} - an array contains field ids
       */
      setValue(fieldIds) {
         this.SummaryFieldIds = fieldIds || [];

         this.onShow();
      }

      /**
       * @function onShow
       * Ready the Popup according to the current object each time it is shown (perhaps a field was created or delted)
       */
      onShow() {
         const ids = this.ids;

         // refresh list
         var numberFields = this.CurrentObject.fields(
            (f) => f instanceof this.ABFieldNumber
         ).map((f) => {
            return {
               id: f.id,
               label: f.label,
            };
         });

         var calculateFields = this.CurrentObject.fields(
            (f) => f instanceof this.ABFieldCalculate
         ).map((f) => {
            return {
               id: f.id,
               label: f.label,
            };
         });

         var formulaFields = this.CurrentObject.fields(
            (f) => f instanceof this.ABFieldFormula
         ).map((f) => {
            return {
               id: f.id,
               label: f.label,
            };
         });

         var fieldOptions = numberFields.concat(calculateFields);
         fieldOptions = fieldOptions.concat(formulaFields);

         $$(ids.list).clearAll();
         $$(ids.list).parse(fieldOptions);

         // update icons
         this.SummaryFieldIds.forEach((fieldId) => {
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

   return new UI_Work_Object_Workspace_PopupSummaryColumns(ibase);
}
