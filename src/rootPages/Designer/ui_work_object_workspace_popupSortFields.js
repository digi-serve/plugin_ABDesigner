/*
 * ui_work_object_workspace_popupSortFields
 *
 * Manage the Sort Fields popup.
 *
 */
import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupSortFields extends UIClass {
      constructor() {
         super("ui_work_object_workspace_popupSortFields", {
            list: "",
            form: "",
         });

         this._blockOnChange = false;
         // {bool}
         // Do we process our onChange event or not?
      }

      uiForm() {
         // Our webix UI definition:
         return {
            id: this.ids.form,
            view: "form",
            borderless: true,
            elements: [
               {
                  view: "button",
                  type: "form",
                  css: "webix_primary",
                  value: L("Add new sort"),
                  on: {
                     onItemClick: (/* id, e, node */) => {
                        this.clickAddNewSort();
                        this.triggerOnChange();
                     },
                  },
               },
            ],
         };
      }

      ui() {
         return {
            view: "popup",
            id: this.ids.component,
            // autoheight:true,
            width: 600,
            body: this.uiForm(),
            on: {
               onShow: () => {
                  this.onShow();
               },
            },
         };
      }

      init(AB) {
         this.AB = AB;
         webix.ui(this.ui());
      }

      /**
       * @function clickAddNewSort
       * the user clicked the add new sort buttton. I don't know what it does...will update later
       */
      // clickAddNewSort: function(by, dir, isMulti, id) {
      clickAddNewSort(fieldId, dir) {
         var self = this;
         var sort_form = $$(this.ids.form);

         var viewIndex = sort_form.getChildViews().length - 1;
         var listFields = this.getFieldList(true);
         sort_form.addView(
            {
               id: `sort_${viewIndex + 1}`,
               cols: [
                  {
                     view: "combo",
                     width: 220,
                     options: listFields,
                     on: {
                        onChange: function (columnId) {
                           var el = this;
                           self.onChangeCombo(columnId, el);
                        },
                     },
                  },
                  {
                     view: "segmented",
                     width: 200,
                     options: [
                        {
                           id: "",
                           value: L("Please select field"),
                        },
                     ],
                     on: {
                        onChange: (/* newv, oldv */) => {
                           // 'asc' or 'desc' values
                           this.triggerOnChange();
                        },
                     },
                  },
                  {
                     view: "button",
                     css: "webix_danger",
                     icon: "fa fa-trash",
                     type: "icon",
                     width: 30,
                     on: {
                        onItemClick: function () {
                           sort_form.removeView(this.getParentView());
                           self.refreshFieldList(true);
                           self.triggerOnChange();
                        },
                     },
                  },
               ],
            },
            viewIndex
         );

         // Select field
         if (fieldId) {
            var fieldsCombo = sort_form
               .getChildViews()
               [viewIndex].getChildViews()[0];
            fieldsCombo.setValue(fieldId);
         }
         if (dir) {
            var segmentButton = sort_form
               .getChildViews()
               [viewIndex].getChildViews()[1];
            segmentButton.setValue(dir);
         }
         // if (isMulti) {
         // 	var isMultilingualField = sort_form.getChildViews()[viewIndex].getChildViews()[2];
         // 	isMultilingualField.setValue(isMulti);
         // }
      }

      /**
       * @method getFieldList
       * return field list so we can present a custom UI for view
       */
      getFieldList(excludeSelected) {
         var sort_form = $$(this.ids.form),
            listFields = [];

         var allFields = this.CurrentObject.fields();
         if (!allFields) return listFields;

         // Get all fields include hidden fields
         allFields.forEach((f) => {
            if (f.fieldIsSortable()) {
               listFields.push({
                  id: f.id,
                  value: f.label,
               });
            }
         });

         // Remove selected field
         if (excludeSelected) {
            var childViews = sort_form.getChildViews();
            if (childViews.length > 1) {
               // Ignore 'Add new sort' button
               childViews.forEach(function (cView, index) {
                  if (childViews.length - 1 <= index) return false;

                  var selectedValue = cView.getChildViews()[0].getValue();
                  if (selectedValue) {
                     var removeIndex = null;
                     listFields.map((f, index) => {
                        if (f.id == selectedValue) {
                           removeIndex = index;
                           return true;
                        } else {
                           return false;
                        }
                     });
                     listFields.splice(removeIndex, 1);
                  }
               });
            }
         }
         return listFields;
      }

      /**
       * @method objectLoad
       * Ready the Popup according to the current object
       * @param {ABObject} object
       *        the currently selected object.
       */
      // objectLoad(object) {
      //    this.CurrentObjectID = object.id;
      // }

      /**
       * @method setSettings
       * @param {Array} settings
       * [
       * 	{
       * 		key: uuid,		// id of ABField
       *	 		dir: string,	// 'asc' or 'desc'
       * 	}
       * ]
       */
      setSettings(settings) {
         this._settings = this.AB.cloneDeep(settings);
      }

      /**
       * @method getSettings
       * @return {Array}
       * [
       *    {
       *       key: uuid,     // id of ABField
       *       dir: string,   // 'asc' or 'desc'
       *    }
       * ]
       */
      getSettings() {
         var sort_form = $$(this.ids.form),
            sortFields = [];

         var childViews = sort_form.getChildViews();
         if (childViews.length > 1) {
            // Ignore 'Add new sort' button
            childViews.forEach(function (cView, index) {
               if (childViews.length - 1 <= index) return false;

               var fieldId = cView.getChildViews()[0].getValue();
               var dir = cView.getChildViews()[1].getValue();
               sortFields.push({
                  // "by":by,
                  key: fieldId,
                  dir: dir,
                  // "isMulti":isMultiLingual
               });
            });
         }

         return sortFields;
      }

      onChangeCombo(columnId, el) {
         var allFields = this.CurrentObject.fields();
         var columnConfig = "",
            sortDir = el.getParentView().getChildViews()[1],
            // isMultiLingual = el.getParentView().getChildViews()[2],
            // isMulti = 0,
            options = null;

         allFields.forEach((f) => {
            if (f.id == columnId) {
               columnConfig = f;
            }
         });

         if (!columnConfig) return;

         switch (columnConfig.key) {
            case "date":
               options = [
                  { id: "asc", value: L("Before -> After") },
                  { id: "desc", value: L("After -> Before") },
               ];
               break;
            case "number":
               options = [
                  { id: "asc", value: L("1 -> 9") },
                  { id: "desc", value: L("9 -> 1") },
               ];
               break;
            case "string":
            default:
               options = [
                  { id: "asc", value: L("A -> Z") },
                  { id: "desc", value: L("Z -> A") },
               ];
               break;
         }

         sortDir.define("options", options);
         sortDir.refresh();

         // if (columnConfig.settings.supportMultilingual)
         // 	isMulti = columnConfig.settings.supportMultilingual;

         // isMultiLingual.setValue(isMulti);

         this.refreshFieldList();
         this.triggerOnChange();
      }

      /**
       * @method objectLoad
       * Ready the Popup according to the current object
       * @param {ABObject} object
       *        the currently selected object.
       */
      onShow() {
         var sort_form = $$(this.ids.form);

         // clear field options in the form
         webix.ui(this.uiForm(), sort_form);

         var sorts = this._settings;
         if (sorts && sorts.forEach) {
            sorts.forEach((s) => {
               this.clickAddNewSort(s.key, s.dir);
            });
         }

         if (sorts == null || sorts.length == 0) {
            this.clickAddNewSort();
         }
      }

      /**
       * @function refreshFieldList
       * return an updated field list so you cannot duplicate a sort
       */
      refreshFieldList(ignoreRemoveViews) {
         var sort_form = $$(this.ids.form),
            listFields = this.getFieldList(false),
            selectedFields = [],
            removeChildViews = [];

         var childViews = sort_form.getChildViews();
         if (childViews.length > 1) {
            // Ignore 'Add new sort' button
            childViews.forEach(function (cView, index) {
               if (childViews.length - 1 <= index) return false;

               let fieldId = cView.getChildViews()[0].getValue(),
                  // fieldObj = $.grep(listFields, function (f) { return f.id == fieldId });
                  fieldObj = listFields.filter((f) => {
                     return f.id == fieldId;
                  });

               if (fieldObj.length > 0) {
                  // Add selected field to list
                  selectedFields.push(fieldObj[0]);
               } else {
                  // Add condition to remove
                  removeChildViews.push(cView);
               }
            });
         }

         // Remove filter conditions when column is deleted
         if (!ignoreRemoveViews) {
            removeChildViews.forEach((cView /*, index */) => {
               sort_form.removeView(cView);
            });
         }

         // Field list should not duplicate field items
         childViews = sort_form.getChildViews();
         if (childViews.length > 1) {
            // Ignore 'Add new sort' button
            childViews.forEach((cView, index) => {
               if (childViews.length - 1 <= index) return false;

               let fieldId = cView.getChildViews()[0].getValue(),
                  // fieldObj = $.grep(listFields, function (f) { return f.id == fieldId }),
                  fieldObj = listFields.filter((f) => {
                     return f.id == fieldId;
                  });

               var selectedFieldsExcludeCurField = selectedFields.filter(
                  (x) => {
                     if (
                        Array.isArray(fieldObj) &&
                        fieldObj.indexOf(x) !== -1
                     ) {
                        return false;
                     }
                     return true;
                  }
               );

               var enableFields = listFields.filter((x) => {
                  if (
                     Array.isArray(selectedFieldsExcludeCurField) &&
                     selectedFieldsExcludeCurField.indexOf(x) !== -1
                  ) {
                     return false;
                  }
                  return true;
               });

               // Update field list
               cView.getChildViews()[0].define("options", enableFields);
               cView.getChildViews()[0].refresh();
            });
         }
      }

      /**
       * @method triggerOnChange
       * This parses the sort form to build in order the sorts then saves to the application object workspace
       */
      triggerOnChange() {
         // block .onChange callback
         if (this._blockOnChange) return;

         this._settings = this.getSettings();

         this.emit("changed", this._settings);
      }

      blockOnChange() {
         this._blockOnChange = true;
      }

      unblockOnChange() {
         this._blockOnChange = false;
      }

      /**
       * @method show()
       * Show this component.
       * @param {obj} $view
       *        the webix.$view to hover the popup around.
       * @param {uuid} fieldId
       *        the fieldId we want to prefill the sort with
       */
      show($view, fieldId, options) {
         this.blockOnChange();

         $$(this.ids.component).show($view, options || null);

         if (fieldId) {
            this.clickAddNewSort(fieldId);
         }

         this.unblockOnChange();
      }

      /**
       * @method sort()
       * client sort data in list
       * @param {Object} a
       * @param {Object} b
       */
      sort(a, b) {
         var result = 0;

         var childViews = $$(this.ids.form).getChildViews();
         if (childViews.length > 1) {
            // Ignore 'Add new sort' button
            childViews.forEach((cView, index) => {
               if (childViews.length - 1 <= index || result != 0) return;

               var fieldId = cView.getChildViews()[0].getValue();
               var dir = cView.getChildViews()[1].getValue();

               var field = this.CurrentObject.fieldByID(fieldId);
               if (!field) return;

               var by = field.columnName; // column name

               var aValue = a[by],
                  bValue = b[by];

               if (Array.isArray(aValue)) {
                  aValue = (aValue || [])
                     .map((item) => {
                        return item.text || item;
                     })
                     .join(" ");
               }

               if (Array.isArray(bValue)) {
                  bValue = (bValue || [])
                     .map((item) => {
                        return item.text || item;
                     })
                     .join(" ");
               }

               if (aValue != bValue) {
                  if (dir == "asc") {
                     result = aValue > bValue ? 1 : -1;
                  } else {
                     result = aValue < bValue ? 1 : -1;
                  }
               }
            });
         }

         return result;
      }
   }

   return new UI_Work_Object_Workspace_PopupSortFields();
}
