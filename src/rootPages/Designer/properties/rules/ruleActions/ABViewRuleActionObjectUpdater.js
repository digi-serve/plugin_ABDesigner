// ABViewRuleActionObjectUpdater
//
// An action that allows you to update fields on an object.
//
//
import FUIClass from "../../../ui_class";
import FABViewRuleAction from "../ABViewRuleAction";

// const RowFilter = require("../../platform/RowFilter");

const ABViewRuleActionObjectUpdaterDefaults = {
   filterConditions: {
      // array of filters to apply to the data table
      glue: "and",
      rules: [],
   },
};

export default function (AB) {
   const UIClass = FUIClass(AB);
   const ABViewRuleAction = FABViewRuleAction(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABViewRuleAction.L();

   class ABViewValueDisplayList extends UIClass {
      constructor(base, Rule) {
         super(base, {
            updateForm: "",
         });

         this.uniqueIDs();

         this.base = base;

         this.Rule = Rule;
         // {ABViewRuleActionObjectUpdater}
         // Our parent ObjectUpdater RuleAction.
         // we need this to see what rules are already chosen.

         this.valueRules = null;
      }

      ui() {
         return {
            view: "form",
            id: this.ids.updateForm,
            elements: [],
         };
      }

      init(AB, valueRules) {
         this.AB = AB;

         valueRules = valueRules || this.valueRules;
         this.setValues(valueRules);
      }

      removeAddRow() {
         // get our Form
         const UpdateForm = this.formGet();
         if (!UpdateForm) return;

         // check row that's unselect a field
         const rows = UpdateForm.getChildViews();

         const addRow = rows.filter((r) => {
            return r.queryView(function (view) {
               return view.config.name == "field" && !view.getValue();
            });
         })[0];
         if (!addRow) return;

         UpdateForm.removeView(addRow);
      }

      /**
       * @method addRow()
       * add a new data entry to this form.
       * @param {obj} data  (optional)
       *        initial values for this row.
       */
      addRow(data) {
         // get our Form
         const UpdateForm = this.formGet();
         if (!UpdateForm) return;

         // check row that's unselect a field
         const rows = UpdateForm.getChildViews();
         if (
            data == null &&
            rows.filter((r) => {
               return r.queryView(function (view) {
                  return view.config.name == "field" && !view.getValue();
               });
            }).length > 0
         )
            return;

         // get a new Row Component
         const row = new ABViewValueDisplayRow(this.base, this.Rule);

         // add row to Form
         UpdateForm.addView(row.ui());

         // initialize row with any provided data:
         row.init(this.AB, data);
         row.on("add", () => {
            this.addRow();
         });
         row.on("delete", (rowId) => {
            this.delRow(rowId);
         });

         // store this row
         this.Rule.formRows.push(row);
      }

      delRow(rowId) {
         // store this row
         this.Rule.formRows.forEach((r, index) => {
            if (r.ui.id == rowId) this.Rule.formRows.splice(index, 0);
         });

         // get our Form
         const UpdateForm = this.formGet();
         if (!UpdateForm) return;

         // remove UI
         UpdateForm.removeView($$(rowId));
      }

      formClear() {
         const UpdateForm = this.formGet();
         if (!UpdateForm) return;

         const children = UpdateForm.getChildViews();

         // NOTE: need to clone this array, because it is connected with the UpdatForm's
         // internal array of items.  Once we start .removeView() the element actually
         // is removed from the internal array, which then upset's the .forEach() from
         // properly iterating through the structure.  It results in missed items from
         // being sent to the .forEach().
         // So Clone it and use that for .forEach()
         const cloneChildren = [];
         children.forEach((c) => {
            cloneChildren.push(c);
         });
         cloneChildren.forEach((c) => {
            UpdateForm.removeView(c);
         });

         // clear our stored .formRows
         this.Rule.formRows = [];
      }

      formGet() {
         const UpdateForm = $$(this.ids.updateForm);
         if (!UpdateForm) {
            // this is a problem!
            let message =
               "ABViewRuleActionFormRecordRuleUpdate.formGet() could not find webix form.";
            this.AB.notify.developer(new Error(message), {
               context: message,
               updateForm: this.ids.updateForm,
            });

            return null;
         }

         return UpdateForm;
      }

      setValues(valueRules) {
         // valueRules = {
         // fieldOperations:[
         //    { fieldID:xxx, value:yyyy, type:zzz, op:aaa }
         // ]
         // }

         valueRules = valueRules || {};
         valueRules.fieldOperations = valueRules.fieldOperations || [];

         // find the form
         const UpdateForm = this.formGet();
         if (!UpdateForm) return;

         // clear form:
         this.formClear();

         // if there are values to add
         if (valueRules.fieldOperations.length > 0) {
            valueRules.fieldOperations.forEach((r) => {
               this.addRow(r);
            });
         }

         // our default operation will cause an empty row to
         // appear after our first value entry.
         // let's remove that one, and then add a new one
         // at the end:
         this.removeAddRow();

         // display an empty row
         this.addRow();
      }

      fromSettings(settings) {
         // Note: we just want the { valueRules:[] } here:
         const mySettings = settings.valueRules || settings;

         this.setValues(mySettings);
      }

      toSettings() {
         // valueRules = {
         // fieldOperations:[
         //    { fieldID:xxx, value:yyyy, type:zzz, op:aaa }
         // ]
         // }
         const settings = { fieldOperations: [] };

         // for each of our formRows, decode the propery {}
         this.Rule.formRows.forEach((fr) => {
            const rowSettings = fr.toSettings();
            if (rowSettings) {
               settings.fieldOperations.push(rowSettings);
            }
         });

         return settings;
      }
   }

   class ABViewValueDisplayRow extends UIClass {
      constructor(base, Rule) {
         super(base, {
            row: "",
            updateForm: "",
            field: "",
            value: "",
            selectDc: "",
            selectBy: "",
            queryField: "",
            multiview: "",
            buttonAdd: "",
            buttonDelete: "",
         });

         this.uniqueIDs();

         this.base = base;

         this.FilterComponent = null;
         // {FilterComplex}
         // An optional Filter used when selecting values from a DC.

         this.Rule = Rule;
         // {ABViewRuleActionObjectUpdater}
         // Our parent ObjectUpdater RuleAction.
         // we need this to see what rules are already chosen.
      }

      ui() {
         const ids = this.ids;
         return {
            id: ids.row,
            view: "layout",
            rows: [
               {
                  cols: [
                     {
                        // Label
                        view: "label",
                        width: uiConfig.labelWidthSmall,
                        label: L("Set"),
                     },
                     {
                        // Field list
                        id: ids.field,
                        view: "combo",
                        name: "field",
                        placeholder: L("Choose a field"),
                        height: 32,
                        options: this.getFieldList(true),
                        on: {
                           onChange: (columnId) => {
                              this.selectField(columnId);
                           },
                        },
                     },
                     {
                        // Label
                        view: "label",
                        width: uiConfig.labelWidthSmall,
                        label: L("To"),
                     },

                     // Field value
                     // NOTE: this view gets replaced each time a field is selected.
                     // We replace it with a component associated with the Field
                     {},

                     {
                        // "Remove" button
                        view: "button",
                        css: "webix_danger",
                        id: ids.buttonDelete,
                        icon: "fa fa-trash",
                        type: "icon",
                        width: 30,
                        hidden: true,
                        click: () => {
                           this.emit("delete", ids.row);
                           // this.callbacks.onDelete(ids.row);
                        },
                     },
                  ],
               },
               {}, // we will add filters here if we need them
            ],
         };
      }

      datacollections(filter = () => true) {
         return (
            this.Rule.CurrentApplication?.datacollectionsIncluded(filter) ?? []
         );
      }

      buttonsToggle() {
         const $cols = $$(this.ids.row).getChildViews()[0].getChildViews();
         $cols[4].hide();
         $cols[5].show();
      }

      getFieldList(shouldFilter) {
         let options = [];
         if (this.Rule.CurrentObject) {
            options = (this.Rule.CurrentObject.fields() || []).map((f) => {
               return {
                  id: f.id,
                  value: f.label,
               };
            });

            // options = (this.updateObject.fields() || [])
            // .filter(f => {
            //
            //    if (f.key != 'connectObject') {
            //       return true;
            //    } else {
            //       // if this is a connection field, only return
            //       // fields that are 1:x  where this field is the
            //       // source:
            //       // return ((f.linkType() == 'one') && (f.isSource()))
            //
            //       // 6-14-2018 Changing from only 1:x to support many
            //       // if this is a connected field, only return
            //       // fields that this is the source
            //       return (f.isSource())
            //    }
            // })
            // .map(f => {
            //    return {
            //       id: f.id,
            //       value: f.label
            //    };
            // });

            // Remove fields who are selected
            if (shouldFilter) {
               // store this row
               const usedHash = {};
               this.Rule.formRows.forEach((row) => {
                  const rowView = $$(row.ids.row);
                  if (rowView) {
                     const field = rowView
                        .getChildViews()[0]
                        .getChildViews()[1];
                     usedHash[field.getValue()] = true;
                  }
               });
               options = options.filter((o) => {
                  return !usedHash[o.id];
               });
            }
         }
         return options;
      }

      isValid() {
         const ids = this.ids;
         const validator = this.AB.Validation.validator();
         const valueField = $$(ids.row).getChildViews()[0].getChildViews()[3];
         const FormView = valueField.getParentView().getParentView();

         const field = this.Rule.getUpdateObjectField($$(ids.field).getValue());
         if (field) {
            const value = field.getValue(valueField, {});

            // // if a standard component that supports .getValue()
            // if (valueField.getValue) {
            //    value = valueField.getValue();
            // } else {
            //    // else use for field.getValue();
            //    value = field.getValue(valueField, {});
            // }

            // our .isValidData() wants value in an object:
            const obj = {};
            obj[field.columnName] = value;

            field.isValidData(obj, validator);

            // if value is empty, this is also an error:
            if (
               value == "" ||
               value == null ||
               (Array.isArray(value) && value.length == 0)
            ) {
               validator.addError(field.columnName, L(""));
            }

            // field.getParentView()  ->  row
            // row.getParentView()  -> Form
            FormView.clearValidation();
            validator.updateForm(FormView);

            return validator.pass();
         } else {
            // if we didn't find an associated field ... then this isn't good
            // data.

            //// TODO: display error for our field picker.  Note, it doesn't have a unique .name
            // field.
            const fieldField = $$(ids.row)
               .getChildViews()[0]
               .getChildViews()[1];
            fieldField.define("invalidMessage", L("A value is required"));
            fieldField.define("invalid", true);
            fieldField.refresh();
            // fieldField.markInvalid(this.labels.component.errorRequired);
            return false;
         }
      }

      selectField(columnID) {
         const ids = this.ids;
         const field = this.Rule.getUpdateObjectField(columnID);
         if (!field) return;

         const fieldComponent = field.formComponent(),
            abView = fieldComponent.newInstance(this.Rule.CurrentApplication);
         let formFieldComponent = abView.component(this.App);
         let $componentView, $inputView;

         console.warn("TODO: remove this testing code:");
         if (typeof formFieldComponent.ui == "function") {
            // this is proper V2 code:
            $componentView = formFieldComponent.ui();
         } else {
            $componentView = formFieldComponent.ui;
         }

         $componentView.id = ids.value; // set our expected id

         // find all the DataSources
         let datasources = this.datacollections((dc) => dc.datasource);

         // create a droplist with those dataSources
         let optionsDataSources = [];
         datasources.forEach((dc) => {
            optionsDataSources.push({
               id: dc.id,
               value: dc.label,
               icon: dc.settings.isQuery ? "fa fa-filter" : "fa fa-database",
            });
         });

         // create a droplist with select options
         const optionsSelectBy = [
            { id: "select-one", value: L("Current selection") },
            {
               id: "filter-select-one",
               value: L("Select first after filter by..."),
            },
         ];

         const $optionUpdateExsits = {
            type: "clean",
            rows: [
               {
                  cols: [
                     {
                        id: ids.selectDc,
                        view: "richselect",
                        options: { data: optionsDataSources },
                        placeholder: L("Choose a data source"),
                        on: {
                           onChange: (newv /*, oldv */) => {
                              const selectedDC = this.datacollections(
                                 (dc) => dc.id == newv
                              )[0];
                              if (
                                 selectedDC &&
                                 (selectedDC.sourceType == "query" ||
                                    field.key != "connectObject")
                              ) {
                                 const queryFieldOptions = [];
                                 selectedDC.datasource.fields().forEach((f) => {
                                    queryFieldOptions.push({
                                       id: f.id,
                                       value: f.label,
                                    });
                                 });
                                 $$(ids.queryField).define(
                                    "options",
                                    queryFieldOptions
                                 );
                                 $$(ids.queryField).refresh();
                                 $$(ids.queryField).show();
                              } else {
                                 $$(ids.queryField).hide();
                              }
                           },
                        },
                     },
                     // we will place a list of query fields if you choose a datasource that has a query source type
                     {
                        id: ids.queryField,
                        view: "combo",
                        hidden: true,
                        placeholder: L("Choose value from..."),
                        options: [{ id: 1, value: "figure this out" }],
                     },
                  ],
               },
               {
                  id: ids.selectBy,
                  view: "combo",
                  options: optionsSelectBy,
                  placeholder: L("Choose select option"),
                  on: {
                     onChange: (newv /*, oldv */) => {
                        const $row = $$(ids.row);
                        $row.removeView($row.getChildViews()[1]);
                        if (newv == "select-one") {
                           $row.addView({}, 1);
                        } else {
                           const options = (
                              this.Rule.CurrentView?.datacollection?.datasource?.fields() ??
                              []
                           ).map(function (f) {
                              return {
                                 id: f.id,
                                 value: f.label,
                              };
                           });

                           // TODO: Swtich to FilterComplex
                           this.FilterComponent = this.AB.filterComplexNew(
                              this.base
                           );

                           // this.FilterComponent.applicationLoad(
                           //    this.currentForm.application
                           // );
                           this.FilterComponent.init({
                              isRecordRule: true,
                              fieldOptions: options,
                           });

                           this.FilterComponent.on("changed", (...params) => {
                              return this.onFilterChange(...params);
                           });

                           // Transition v1 to v2:
                           console.warn("TODO: remove this transition Code:");
                           if (typeof this.FilterComponent.ui == "function") {
                              $row.addView(this.FilterComponent.ui(), 1);
                           } else {
                              $row.addView(this.FilterComponent.ui, 1);
                           }

                           const dcId = $$(ids.selectDc).getValue();
                           const dataCollection = this.datacollections(
                              (dc) => dc.id == dcId
                           )[0];
                           if (dataCollection) {
                              this.populateFilters(dataCollection);
                           }
                        }
                     },
                  },
               },
            ],
         };

         // WORKAROUND: add '[Current User]' option to the user data field
         if (field.key == "user") {
            $componentView.options = $componentView.options || [];
            $componentView.options.unshift({
               id: "ab-current-user",
               value: L("Current User"),
            });
         }

         // UPDATE: ok, in practice we have not had any use cases where
         // we want individual values on connectedObject fields, but
         // instead we want to insert the current selected element from
         // a relevant data view.  So, replace the fieldComponet
         // from a connectedObject field with a list of data views that
         // are based upon the same object we are connected to:
         if (field.isConnection) {
            // key == "connectObject") {
            // find the ABObject this field connects to
            const connectedObject = field.datasourceLink;

            // find all the DataSources that are based upon this ABObject
            datasources = datasources.filter((dc) => {
               return dc.datasource.id == connectedObject.id;
            });

            const dcQueries = this.datacollections((dc) => {
               return (
                  dc.sourceType == "query" &&
                  dc.datasource &&
                  dc.datasource.canFilterObject(connectedObject)
               );
               // return dc.datasource.id == connectedObject.id;
            });

            datasources = datasources.concat(dcQueries);

            // refresh a droplist with those dataSources
            optionsDataSources = [];
            datasources.forEach((dc) => {
               optionsDataSources.push({
                  id: dc.id,
                  value: dc.label,
                  icon: dc.settings.isQuery ? "fa fa-filter" : "fa fa-database",
               });
            });

            // add select an array value option
            optionsSelectBy.push({
               id: "filter-select-all",
               value: L("Select all after filter by..."),
            });

            $inputView = $optionUpdateExsits;

            // update the dataSources option list to UI
            if ($$(ids.selectDc)) {
               $$(ids.selectDc).parse(optionsDataSources);
               $$(ids.selectDc).refresh();
            } else {
               $inputView.rows[0].cols[0].options = optionsDataSources;
            }

            // and the upcoming formFieldComponent.init()
            // doesn't need to do anything:
            formFieldComponent = {
               init: function () {},
            };

            // and we reset field so it's customDisplay isn't called:
            // field = {};
         } else {
            $inputView = {
               id: ids.multiview,
               view: "multiview",
               cells: [
                  {
                     batch: "custom",
                     rows: [
                        $componentView,
                        {
                           view: "label",
                           label: L("<a>Or exists value</a>"),
                           on: {
                              onItemClick: function () {
                                 const $container = this.getParentView(),
                                    $multiview = $container.getParentView();

                                 $multiview.showBatch("exist");
                              },
                           },
                        },
                     ],
                  },
                  {
                     // Update value from exists object
                     batch: "exist",
                     rows: [
                        $optionUpdateExsits,
                        {
                           view: "label",
                           label: L("<a>Or custom value</a>"),
                           on: {
                              onItemClick: function () {
                                 const $container = this.getParentView(),
                                    $multiview = $container.getParentView();

                                 // clear filter view
                                 $$(ids.selectBy).setValue("select-one");

                                 $multiview.showBatch("custom");
                              },
                           },
                        },
                     ],
                  },
               ],
            };
         }

         // Change component to display this field's form input
         const $row = $$(ids.row).getChildViews()[0];
         $row.removeView($row.getChildViews()[3]);
         $row.addView($inputView, 3);

         formFieldComponent.init();

         // Show custom display of data field
         if (!field.isConnection && field.customDisplay) {
            // field.customDisplay(field, this.App, $row.getChildViews()[3].$view, {

            const compNodeView = $$($componentView.id).$view;

            // wait until render UI complete
            setTimeout(() => {
               field.customDisplay(field, this.App, compNodeView, {
                  editable: true,

                  // tree
                  isForm: true,
               });
            }, 50);
         }

         // Show the remove button
         const $buttonRemove = $row.getChildViews()[4];
         $buttonRemove.show();

         // Add a new row
         if (columnID) this.emit("add"); // _logic.callbacks.onAdd();
      }

      setValue(data) {
         const ids = this.ids;
         $$(ids.field).setValue(data.fieldID);
         // note: this triggers our _logic.selectField() fn.
         const field = this.Rule.getUpdateObjectField(data.fieldID);
         if (field) {
            const setValueFn = () => {
               $$(ids.selectDc).setValue(data.value);
               if (data.queryField) {
                  $$(ids.queryField).setValue(data.queryField);
               }
               const selectBy = data.selectBy || "select-one";
               $$(ids.selectBy).setValue(selectBy);

               if (selectBy != "select-one") {
                  const collectionId = data.value;
                  const dataCollection =
                     (this.currentForm.application?.datacollectionsIncluded(
                        (dc) => dc.id == collectionId
                     ) ?? [])[0];
                  if (dataCollection && data.filterConditions) {
                     this.populateFilters(
                        dataCollection,
                        data.filterConditions
                     );
                  }
               }
            };

            // now handle our special connectedObject case:
            if (field.key == "connectObject") {
               setValueFn();
            } else {
               if (data.valueType == "exist") {
                  $$(ids.multiview)?.showBatch("exist");

                  setValueFn();
               } else {
                  $$(ids.multiview)?.showBatch("custom");

                  // wait until render UI complete
                  setTimeout(function () {
                     // set value to custom field
                     const rowData = {};
                     rowData[field.columnName] = data.value;
                     field.setValue($$(ids.value), rowData);
                  }, 50);
               }
            }
         }
      }

      populateFilters(dataView, filterConditions) {
         filterConditions =
            filterConditions ??
            ABViewRuleActionObjectUpdaterDefaults.filterConditions;

         // Populate data to popups
         // FilterComponent.objectLoad(objectCopy);
         this.FilterComponent.fieldsLoad(
            dataView.datasource ? dataView.datasource.fields() : []
         );
         this.FilterComponent.setValue(filterConditions);
      }

      toSettings() {
         const ids = this.ids;

         // if this isn't the last entry row
         // * a row with valid data has the [delete] button showing.
         const buttonDelete = $$(ids.buttonDelete);
         if (buttonDelete && buttonDelete.isVisible()) {
            const data = {};
            data.fieldID = $$(ids.field).getValue();

            const $valueField = $$(ids.value);
            const field = this.Rule.getUpdateObjectField(data.fieldID);

            const getValueFn = () => {
               data.value = $$(ids.selectDc).getValue();
               data.queryField = $$(ids.queryField).getValue();
               data.op = "set"; // possible to create other types of operations.
               data.type = field.key;
               data.selectBy = $$(ids.selectBy).getValue();
               data.valueType = "exist";
               if (this.FilterComponent) {
                  data.filterConditions = this.FilterComponent.getValue();
               }
            };

            // now handle our special connectedObject case:
            if (field.key == "connectObject") {
               getValueFn();
            } else {
               if ($$(ids.multiview).config.visibleBatch == "exist") {
                  getValueFn();
               } else {
                  data.value = field.getValue($valueField, {});
                  data.op = "set"; // possible to create other types of operations.
                  data.type = field.key;
                  data.valueType = "custom";
               }
            }

            return data;
         } else {
            return null;
         }
      }

      init(AB, data) {
         this.AB = AB;

         if (data) {
            // options.data = { formID:xxx, value:yyy,  type:zzzz }
            this.setValue(data);
         }

         return Promise.resolve();
      }
   }

   class ABViewRuleActionObjectUpdater extends ABViewRuleAction {
      /**
       * @param {object} App
       *      The shared App object that is created in OP.Component
       * @param {string} idBase
       *      Identifier for this component
       */
      constructor(idBase, ids) {
         super(idBase, ids);

         this.key = "ABViewRuleActionFormRecordRuleUpdate";
         this.label = L("Update Record");

         // this.updateObject = null; // the object this Action will Update.

         this.formRows = []; // keep track of the Value Components being set
         // [
         //		{ fieldId: xxx, value:yyy, type:key['string', 'number', 'date',...]}
         // ]

         this.stashRules = {}; // keep track of rule settings among our selected objects.

         // Labels for UI components
         // var labels = (this.labels = {
         //    // common: App.labels,
         //    component: {
         //       errorRequired: L(
         //          "ab.ruleAction.Update.required",
         //          "*A value is required"
         //       ),
         //       set: L("ab.component.form.set", "*Set"),
         //       setPlaceholder: L(
         //          "ab.component.form.setPlaceholder",
         //          "*Choose a field"
         //       ),
         //       to: L("ab.component.form.to", "*To"),
         //       chooseSource: L(
         //          "ab.component.ruleaction.chooseSource",
         //          "*Choose a data source"
         //       ),
         //       chooseField: L(
         //          "ab.component.ruleaction.chooseField",
         //          "*Choose value from..."
         //       ),
         //       selectBy: L(
         //          "ab.component.ruleaction.selectBy",
         //          "*Choose select option"
         //       ),
         //    },
         // });
      }

      ui() {
         if (!this._uiUpdater) {
            this.valueDisplayComponent();
         }

         return this._uiUpdater.ui();
      }

      init() {
         this._uiUpdater?.init(AB, this.valueRules);
      }

      // valueDisplayComponent
      // Return an ABView to display our values form.
      //
      valueDisplayComponent(idBase) {
         if (this._uiUpdater == null) {
            this._uiUpdater = new ABViewValueDisplayList(
               idBase ?? this.ids.component,
               this
            );
         }

         return this._uiUpdater;
      }

      // Our Values Display is a List of ValueRows
      // Each ValueRow will display an additional set of [add] [delete] buttons.

      // valueDisplayList(idBase) {
      //    var uniqueInstanceID = webix.uid();
      //    var myUnique = (key) => {
      //       // return idBase + '_' + key  + '_' + uniqueInstanceID;
      //       return idBase + "_" + key + "_" + uniqueInstanceID;
      //    };
      //    var ids = {
      //       updateForm: myUnique("updateForm"),
      //    };

      //    var _ui = {
      //       view: "form",
      //       id: ids.updateForm,
      //       elements: [],
      //    };

      //    var init = (valueRules) => {
      //       valueRules = valueRules || this.valueRules;
      //       _logic.setValues(valueRules);
      //    };

      //    var _logic = {
      //       removeAddRow: () => {
      //          // get our Form
      //          var UpdateForm = _logic.formGet();
      //          if (!UpdateForm) return;

      //          // check row that's unselect a field
      //          var rows = UpdateForm.getChildViews();

      //          var addRow = rows.filter((r) => {
      //             return r.queryView(function (view) {
      //                return view.config.name == "field" && !view.getValue();
      //             });
      //          })[0];
      //          if (!addRow) return;

      //          UpdateForm.removeView(addRow);
      //       },

      //       // addRow
      //       // add a new data entry to this form.
      //       // @param {obj} data  (optional) initial values for this row.
      //       addRow: (data) => {
      //          // get our Form
      //          var UpdateForm = _logic.formGet();
      //          if (!UpdateForm) return;

      //          // check row that's unselect a field
      //          var rows = UpdateForm.getChildViews();
      //          if (
      //             data == null &&
      //             rows.filter((r) => {
      //                return r.queryView(function (view) {
      //                   return view.config.name == "field" && !view.getValue();
      //                });
      //             }).length > 0
      //          )
      //             return;

      //          // get a new Row Component
      //          var row = this.valueDisplayRow(idBase);

      //          // add row to Form
      //          UpdateForm.addView(row.ui);

      //          // initialize row with any provided data:
      //          row.init({
      //             onAdd: () => {
      //                // add a new Row
      //                _logic.addRow();
      //             },
      //             onDelete: (rowId) => {
      //                // remove a row
      //                _logic.delRow(rowId);
      //             },
      //             data: data,
      //          });

      //          // store this row
      //          this.formRows.push(row);
      //       },

      //       delRow: (rowId) => {
      //          // store this row
      //          this.formRows.forEach((r, index) => {
      //             if (r.ui.id == rowId) this.formRows.splice(index, 0);
      //          });

      //          // get our Form
      //          var UpdateForm = _logic.formGet();
      //          if (!UpdateForm) return;

      //          // remove UI
      //          UpdateForm.removeView($$(rowId));
      //       },

      //       formClear: () => {
      //          var UpdateForm = _logic.formGet();
      //          if (!UpdateForm) return;

      //          var children = UpdateForm.getChildViews();

      //          // NOTE: need to clone this array, because it is connected with the UpdatForm's
      //          // internal array of items.  Once we start .removeView() the element actually
      //          // is removed from the internal array, which then upset's the .forEach() from
      //          // properly iterating through the structure.  It results in missed items from
      //          // being sent to the .forEach().
      //          // So Clone it and use that for .forEach()
      //          var cloneChildren = [];
      //          children.forEach((c) => {
      //             cloneChildren.push(c);
      //          });
      //          cloneChildren.forEach((c) => {
      //             UpdateForm.removeView(c);
      //          });

      //          // clear our stored .formRows
      //          this.formRows = [];
      //       },

      //       formGet: () => {
      //          var UpdateForm = $$(ids.updateForm);
      //          if (!UpdateForm) {
      //             // this is a problem!
      //             OP.Error.log(
      //                "ABViewRuleActionFormRecordRuleUpdate.init() could not find webix form.",
      //                { id: ids.updateForm }
      //             );
      //             return null;
      //          }

      //          return UpdateForm;
      //       },

      //       setValues: (valueRules) => {
      //          // valueRules = {
      //          //	fieldOperations:[
      //          //		{ fieldID:xxx, value:yyyy, type:zzz, op:aaa }
      //          //	]
      //          // }

      //          valueRules = valueRules || {};
      //          valueRules.fieldOperations = valueRules.fieldOperations || [];

      //          // find the form
      //          var UpdateForm = _logic.formGet();
      //          if (!UpdateForm) return;

      //          // clear form:
      //          _logic.formClear();

      //          // if there are values to
      //          if (valueRules.fieldOperations.length > 0) {
      //             valueRules.fieldOperations.forEach((r) => {
      //                _logic.addRow(r);
      //             });
      //          }

      //          // our default operation will cause an empty row to
      //          // appear after our first value entry.
      //          // let's remove that one, and then add a new one
      //          // at the end:
      //          _logic.removeAddRow();

      //          // display an empty row
      //          _logic.addRow();
      //       },

      //       fromSettings: (settings) => {
      //          // Note: we just want the { valueRules:[] } here:
      //          var mySettings = settings.valueRules || settings;

      //          _logic.setValues(mySettings);
      //       },

      //       toSettings: () => {
      //          // valueRules = {
      //          //	fieldOperations:[
      //          //		{ fieldID:xxx, value:yyyy, type:zzz, op:aaa }
      //          //	]
      //          // }
      //          var settings = { fieldOperations: [] };

      //          // for each of our formRows, decode the propery {}
      //          this.formRows.forEach((fr) => {
      //             var rowSettings = fr.toSettings();
      //             if (rowSettings) {
      //                settings.fieldOperations.push(fr.toSettings());
      //             }
      //          });

      //          return settings;
      //       },
      //    };

      //    return {
      //       ui: _ui,
      //       init: init,
      //       fromSettings: (settings) => {
      //          _logic.fromSettings(settings);
      //       },
      //       toSettings: () => {
      //          return _logic.toSettings();
      //       },
      //       _logic: _logic,
      //    };
      // }

      // valueDisplayRow(iBase) {
      //    return new ABViewValueDisplayRow(iBase, this);
      // }

      // valueDisplayRowOld(idBase) {
      //    var uniqueInstanceID = webix.uid();
      //    var myUnique = (key) => {
      //       // return idBase + '_' + key  + '_' + uniqueInstanceID;
      //       return key + "_" + uniqueInstanceID;
      //    };

      //    var ids = {
      //       row: myUnique("row"),
      //       updateForm: myUnique("updateFormRow"),
      //       field: myUnique("field"),
      //       value: myUnique("value"),
      //       selectDc: myUnique("selectDc"),
      //       selectBy: myUnique("selectBy"),
      //       queryField: myUnique("queryField"),
      //       multiview: myUnique("multiview"),
      //       buttonAdd: myUnique("add"),
      //       buttonDelete: myUnique("delete"),
      //    };

      //    var FilterComponent;

      //    var _logic = {
      //       callbacks: {
      //          onAdd: () => {},
      //          onDelete: () => {},
      //       },

      //       buttonsToggle: () => {
      //          $$(ids.row).getChildViews()[0].getChildViews()[4].hide();
      //          $$(ids.row).getChildViews()[0].getChildViews()[5].show();
      //       },

      //       getFieldList: (shouldFilter) => {
      //          var options = [];
      //          if (this.updateObject) {
      //             options = (this.updateObject.fields() || []).map((f) => {
      //                return {
      //                   id: f.id,
      //                   value: f.label,
      //                };
      //             });

      //             // options = (this.updateObject.fields() || [])
      //             // .filter(f => {
      //             //
      //             // 	if (f.key != 'connectObject') {
      //             // 		return true;
      //             // 	} else {
      //             // 		// if this is a connection field, only return
      //             // 		// fields that are 1:x  where this field is the
      //             // 		// source:
      //             // 		// return ((f.linkType() == 'one') && (f.isSource()))
      //             //
      //             // 		// 6-14-2018 Changing from only 1:x to support many
      //             // 		// if this is a connected field, only return
      //             // 		// fields that this is the source
      //             // 		return (f.isSource())
      //             // 	}
      //             // })
      //             // .map(f => {
      //             // 	return {
      //             // 		id: f.id,
      //             // 		value: f.label
      //             // 	};
      //             // });

      //             // Remove fields who are selected
      //             if (shouldFilter) {
      //                // store this row
      //                var usedHash = {};
      //                this.formRows.forEach((row) => {
      //                   var rowView = $$(row.ui.id);
      //                   if (rowView) {
      //                      var field = rowView
      //                         .getChildViews()[0]
      //                         .getChildViews()[1];
      //                      usedHash[field.getValue()] = true;
      //                   }
      //                });
      //                options = options.filter((o) => {
      //                   return !usedHash[o.id];
      //                });
      //             }
      //          }
      //          return options;
      //       },

      //       isValid: () => {
      //          var validator = OP.Validation.validator();
      //          var valueField = $$(ids.row)
      //             .getChildViews()[0]
      //             .getChildViews()[3];
      //          var FormView = valueField.getParentView().getParentView();

      //          var field = this.getUpdateObjectField($$(ids.field).getValue());
      //          if (field) {
      //             var value = field.getValue(valueField, {});

      //             // // if a standard component that supports .getValue()
      //             // if (valueField.getValue) {
      //             // 	value = valueField.getValue();
      //             // } else {
      //             // 	// else use for field.getValue();
      //             // 	value = field.getValue(valueField, {});
      //             // }

      //             // our .isValidData() wants value in an object:
      //             var obj = {};
      //             obj[field.columnName] = value;

      //             field.isValidData(obj, validator);

      //             // if value is empty, this is also an error:
      //             if (
      //                value == "" ||
      //                value == null ||
      //                (Array.isArray(value) && value.length == 0)
      //             ) {
      //                validator.addError(
      //                   field.columnName,
      //                   this.labels.component.errorRequired
      //                );
      //             }

      //             // field.getParentView()  ->  row
      //             // row.getParentView()  -> Form
      //             FormView.clearValidation();
      //             validator.updateForm(FormView);

      //             return validator.pass();
      //          } else {
      //             // if we didn't find an associated field ... then this isn't good
      //             // data.

      //             //// TODO: display error for our field picker.  Note, it doesn't have a unique .name
      //             // field.
      //             var fieldField = $$(ids.row)
      //                .getChildViews()[0]
      //                .getChildViews()[1];
      //             fieldField.define(
      //                "invalidMessage",
      //                this.labels.component.errorRequired
      //             );
      //             fieldField.define("invalid", true);
      //             fieldField.refresh();
      //             // fieldField.markInvalid(this.labels.component.errorRequired);
      //             return false;
      //          }
      //       },

      //       selectField: (columnID) => {
      //          var field = this.getUpdateObjectField(columnID);
      //          if (!field) return;

      //          var fieldComponent = field.formComponent(),
      //             abView = fieldComponent.newInstance(field.object.application),
      //             formFieldComponent = abView.component(this.App),
      //             $componentView = formFieldComponent.ui,
      //             $inputView;

      //          $componentView.id = ids.value; // set our expected id

      //          // find all the DataSources
      //          var datasources = this.currentForm.application.datacollections(
      //             (dc) => dc.datasource
      //          );

      //          // create a droplist with those dataSources
      //          var optionsDataSources = [];
      //          datasources.forEach((dc) => {
      //             optionsDataSources.push({ id: dc.id, value: dc.label });
      //          });

      //          // create a droplist with select options
      //          var optionsSelectBy = [
      //             { id: "select-one", value: "*Current selection" },
      //             {
      //                id: "filter-select-one",
      //                value: "*Select first after filter by...",
      //             },
      //          ];

      //          var $optionUpdateExsits = {
      //             type: "clean",
      //             rows: [
      //                {
      //                   cols: [
      //                      {
      //                         id: ids.selectDc,
      //                         view: "combo",
      //                         options: optionsDataSources,
      //                         placeholder: this.labels.component.chooseSource,
      //                         on: {
      //                            onChange: (newv, oldv) => {
      //                               var selectedDC =
      //                                  this.currentForm.application.datacollections(
      //                                     (dc) => dc.id == newv
      //                                  )[0];
      //                               if (
      //                                  selectedDC &&
      //                                  (selectedDC.sourceType == "query" ||
      //                                     field.key != "connectObject")
      //                               ) {
      //                                  var queryFieldOptions = [];
      //                                  selectedDC.datasource
      //                                     .fields()
      //                                     .forEach((f) => {
      //                                        queryFieldOptions.push({
      //                                           id: f.id,
      //                                           value: f.label,
      //                                        });
      //                                     });
      //                                  $$(ids.queryField).define(
      //                                     "options",
      //                                     queryFieldOptions
      //                                  );
      //                                  $$(ids.queryField).refresh();
      //                                  $$(ids.queryField).show();
      //                               } else {
      //                                  $$(ids.queryField).hide();
      //                               }
      //                            },
      //                         },
      //                      },
      //                      // we will place a list of query fields if you choose a datasource that has a query source type
      //                      {
      //                         id: ids.queryField,
      //                         view: "combo",
      //                         hidden: true,
      //                         placeholder: this.labels.component.chooseField,
      //                         options: [{ id: 1, value: "figure this out" }],
      //                      },
      //                   ],
      //                },
      //                {
      //                   id: ids.selectBy,
      //                   view: "combo",
      //                   options: optionsSelectBy,
      //                   placeholder: this.labels.component.selectBy,
      //                   on: {
      //                      onChange: (newv, oldv) => {
      //                         var $row = $$(ids.row);
      //                         $row.removeView($row.getChildViews()[1]);
      //                         if (newv == "select-one") {
      //                            $row.addView({}, 1);
      //                         } else {
      //                            var options =
      //                               this.currentForm.datacollection.datasource
      //                                  .fields()
      //                                  .map(function (f) {
      //                                     return {
      //                                        id: f.id,
      //                                        value: f.label,
      //                                     };
      //                                  });

      //                            FilterComponent = new RowFilter(
      //                               this.App,
      //                               idBase + "_filter"
      //                            );
      //                            FilterComponent.applicationLoad(
      //                               this.currentForm.application
      //                            );
      //                            FilterComponent.init({
      //                               isRecordRule: true,
      //                               onChange: _logic.onFilterChange,
      //                               fieldOptions: options,
      //                            });

      //                            $row.addView(FilterComponent.ui, 1);

      //                            var dcId = $$(ids.selectDc).getValue();
      //                            var dataCollection =
      //                               this.currentForm.application.datacollections(
      //                                  (dc) => dc.id == dcId
      //                               )[0];
      //                            if (dataCollection) {
      //                               _logic.populateFilters(dataCollection);
      //                            }
      //                         }
      //                      },
      //                   },
      //                },
      //             ],
      //          };

      //          // WORKAROUND: add '[Current User]' option to the user data field
      //          if (field.key == "user") {
      //             $componentView.options = $componentView.options || [];
      //             $componentView.options.unshift({
      //                id: "ab-current-user",
      //                value: "*[Current User]",
      //             });
      //          }

      //          // UPDATE: ok, in practice we have not had any use cases where
      //          // we want individual values on connectedObject fields, but
      //          // instead we want to insert the current selected element from
      //          // a relevant data view.  So, replace the fieldComponet
      //          // from a connectedObject field with a list of data views that
      //          // are based upon the same object we are connected to:
      //          if (field.key == "connectObject") {
      //             // find the ABObject this field connects to
      //             var connectedObject = field.datasourceLink;

      //             // find all the DataSources that are based upon this ABObject
      //             // to do this, we find the root Page we are on, then ask that Page for datasources:
      //             datasources = datasources.filter((dc) => {
      //                return dc.datasource.id == connectedObject.id;
      //             });

      //             var dcQueries = this.currentForm.application.datacollections(
      //                (dc) => {
      //                   return (
      //                      dc.sourceType == "query" &&
      //                      dc.datasource &&
      //                      dc.datasource.canFilterObject(connectedObject)
      //                   );
      //                   // return dc.datasource.id == connectedObject.id;
      //                }
      //             );

      //             datasources = datasources.concat(dcQueries);

      //             // refresh a droplist with those dataSources
      //             optionsDataSources = [];
      //             datasources.forEach((dc) => {
      //                optionsDataSources.push({ id: dc.id, value: dc.label });
      //             });

      //             // add select an array value option
      //             optionsSelectBy.push({
      //                id: "filter-select-all",
      //                value: "*Select all after filter by...",
      //             });

      //             $inputView = $optionUpdateExsits;

      //             // update the dataSources option list to UI
      //             if ($$(ids.selectDc)) {
      //                $$(ids.selectDc).parse(optionsDataSources);
      //                $$(ids.selectDc).refresh();
      //             } else {
      //                $inputView.rows[0].cols[0].options = optionsDataSources;
      //             }

      //             // and the upcoming formFieldComponent.init()
      //             // doesn't need to do anything:
      //             formFieldComponent = {
      //                init: function () {},
      //             };

      //             // and we reset field so it's customDisplay isn't called:
      //             // field = {};
      //          } else {
      //             $inputView = {
      //                id: ids.multiview,
      //                view: "multiview",
      //                cells: [
      //                   {
      //                      batch: "custom",
      //                      rows: [
      //                         $componentView,
      //                         {
      //                            view: "label",
      //                            label: "<a>Or exists value</a>",
      //                            on: {
      //                               onItemClick: function () {
      //                                  var $container = this.getParentView(),
      //                                     $multiview =
      //                                        $container.getParentView();

      //                                  $multiview.showBatch("exist");
      //                               },
      //                            },
      //                         },
      //                      ],
      //                   },
      //                   {
      //                      // Update value from exists object
      //                      batch: "exist",
      //                      rows: [
      //                         $optionUpdateExsits,
      //                         {
      //                            view: "label",
      //                            label: "<a>Or custom value</a>",
      //                            on: {
      //                               onItemClick: function () {
      //                                  var $container = this.getParentView(),
      //                                     $multiview =
      //                                        $container.getParentView();

      //                                  // clear filter view
      //                                  $$(ids.selectBy).setValue("select-one");

      //                                  $multiview.showBatch("custom");
      //                               },
      //                            },
      //                         },
      //                      ],
      //                   },
      //                ],
      //             };
      //          }

      //          // Change component to display this field's form input
      //          var $row = $$(ids.row).getChildViews()[0];
      //          $row.removeView($row.getChildViews()[3]);
      //          $row.addView($inputView, 3);

      //          formFieldComponent.init();

      //          // Show custom display of data field
      //          if (field.key != "connectObject" && field.customDisplay) {
      //             // field.customDisplay(field, this.App, $row.getChildViews()[3].$view, {

      //             var compNodeView = $$($componentView.id).$view;

      //             // wait until render UI complete
      //             setTimeout(() => {
      //                field.customDisplay(field, this.App, compNodeView, {
      //                   editable: true,

      //                   // tree
      //                   isForm: true,
      //                });
      //             }, 50);
      //          }

      //          // Show the remove button
      //          var $buttonRemove = $row.getChildViews()[4];
      //          $buttonRemove.show();

      //          // Add a new row
      //          if (columnID) _logic.callbacks.onAdd();
      //       },

      //       setValue: (data) => {
      //          $$(ids.field).setValue(data.fieldID);
      //          // note: this triggers our _logic.selectField() fn.
      //          var field = this.getUpdateObjectField(data.fieldID);
      //          if (field) {
      //             var setValueFn = () => {
      //                $$(ids.selectDc).setValue(data.value);
      //                if (data.queryField) {
      //                   $$(ids.queryField).setValue(data.queryField);
      //                }
      //                var selectBy = data.selectBy || "select-one";
      //                $$(ids.selectBy).setValue(selectBy);

      //                if (selectBy != "select-one") {
      //                   var collectionId = data.value;
      //                   var dataCollection =
      //                      this.currentForm.application.datacollections(
      //                         (dc) => dc.id == collectionId
      //                      )[0];
      //                   if (dataCollection && data.filterConditions) {
      //                      _logic.populateFilters(
      //                         dataCollection,
      //                         data.filterConditions
      //                      );
      //                   }
      //                }
      //             };

      //             // now handle our special connectedObject case:
      //             if (field.key == "connectObject") {
      //                setValueFn();
      //             } else {
      //                if (data.valueType == "exist") {
      //                   $$(ids.multiview).showBatch("exist");

      //                   setValueFn();
      //                } else {
      //                   $$(ids.multiview).showBatch("custom");

      //                   // wait until render UI complete
      //                   setTimeout(function () {
      //                      // set value to custom field
      //                      var rowData = {};
      //                      rowData[field.columnName] = data.value;
      //                      field.setValue($$(ids.value), rowData);
      //                   }, 50);
      //                }
      //             }
      //          }
      //       },

      //       populateFilters: (dataView, filterConditions) => {
      //          filterConditions =
      //             filterConditions ||
      //             ABViewRuleActionObjectUpdaterDefaults.filterConditions;

      //          // Populate data to popups
      //          // FilterComponent.objectLoad(objectCopy);
      //          FilterComponent.fieldsLoad(
      //             dataView.datasource ? dataView.datasource.fields() : []
      //          );
      //          FilterComponent.setValue(filterConditions);
      //       },

      //       toSettings: () => {
      //          // if this isn't the last entry row
      //          // * a row with valid data has the [delete] button showing.
      //          var buttonDelete = $$(ids.buttonDelete);
      //          if (buttonDelete && buttonDelete.isVisible()) {
      //             var data = {};
      //             data.fieldID = $$(ids.field).getValue();

      //             var $valueField = $$(ids.value);
      //             var field = this.getUpdateObjectField(data.fieldID);

      //             var getValueFn = () => {
      //                data.value = $$(ids.selectDc).getValue();
      //                data.queryField = $$(ids.queryField).getValue();
      //                data.op = "set"; // possible to create other types of operations.
      //                data.type = field.key;
      //                data.selectBy = $$(ids.selectBy).getValue();
      //                data.valueType = "exist";
      //                if (FilterComponent) {
      //                   data.filterConditions = FilterComponent.getValue();
      //                }
      //             };

      //             // now handle our special connectedObject case:
      //             if (field.key == "connectObject") {
      //                getValueFn();
      //             } else {
      //                if ($$(ids.multiview).config.visibleBatch == "exist") {
      //                   getValueFn();
      //                } else {
      //                   data.value = field.getValue($valueField, {});
      //                   data.op = "set"; // possible to create other types of operations.
      //                   data.type = field.key;
      //                   data.valueType = "custom";
      //                }
      //             }

      //             return data;
      //          } else {
      //             return null;
      //          }
      //       },
      //    };

      //    var _ui = {
      //       id: ids.row,
      //       view: "layout",
      //       rows: [
      //          {
      //             cols: [
      //                {
      //                   // Label
      //                   view: "label",
      //                   width: this.App.config.labelWidthSmall,
      //                   label: this.labels.component.set,
      //                },
      //                {
      //                   // Field list
      //                   view: "combo",
      //                   name: "field",
      //                   placeholder: this.labels.component.setPlaceholder,
      //                   id: ids.field,
      //                   height: 32,
      //                   options: _logic.getFieldList(true),
      //                   on: {
      //                      onChange: function (columnId) {
      //                         _logic.selectField(columnId);
      //                      },
      //                   },
      //                },
      //                {
      //                   // Label
      //                   view: "label",
      //                   width: this.App.config.labelWidthSmall,
      //                   label: this.labels.component.to,
      //                },

      //                // Field value
      //                // NOTE: this view gets replaced each time a field is selected.
      //                // We replace it with a component associated with the Field
      //                {},

      //                {
      //                   // "Remove" button
      //                   view: "button",
      //                   css: "webix_danger",
      //                   id: ids.buttonDelete,
      //                   icon: "fa fa-trash",
      //                   type: "icon",
      //                   width: 30,
      //                   hidden: true,
      //                   click: function () {
      //                      _logic.callbacks.onDelete(ids.row);
      //                   },
      //                },
      //             ],
      //          },
      //          {}, // we will add filters here if we need them
      //       ],
      //    };

      //    var init = (options) => {
      //       for (var c in _logic.callbacks) {
      //          _logic.callbacks[c] = options[c] || _logic.callbacks[c];
      //       }

      //       if (options.data) {
      //          // options.data = { formID:xxx, value:yyy,  type:zzzz }
      //          _logic.setValue(options.data);

      //          // _logic.buttonsToggle();
      //       }
      //    };

      //    return {
      //       ui: _ui,
      //       init: init,
      //       toSettings: () => {
      //          return _logic.toSettings();
      //       },
      //       _logic: _logic,
      //    };
      // }

      getUpdateObjectField(fieldID) {
         return this.CurrentObject.fieldByID(fieldID);
      }

      ////
      //// For ab_platform_web:
      // /**
      //  * @method processUpdateObject
      //  * Perform the specified update actions on the provided objectToUpdate
      //  * @param {obj} options  Additional information required to make updates.
      //  * @param {obj} objectToUpdate  The object to make the updates on.
      //  * @return {boolean}   true if an update took place, false if no updates.
      //  */
      // processUpdateObject(options, objectToUpdate) {
      //    this._formData = objectToUpdate;
      //    // return new Promise((resolve, reject) => {
      //    var isUpdated = false;

      //    this.valueRules = this.valueRules || {};
      //    this.valueRules.fieldOperations =
      //       this.valueRules.fieldOperations || [];

      //    // var allPromises = [];

      //    // for each of our operations
      //    this.valueRules.fieldOperations.forEach((op) => {
      //       // op = {
      //       // 	fieldID:'zzzzz',
      //       //	value: 'xxx',
      //       //	op: 'set',
      //       //  type:'',
      //       //  queryField: '', // id of ABField
      //       //  selectBy:'',   ['select-one', 'filter-select-one', 'filter-select-all']
      //       //  valueType: "", ['custom', 'exist']
      //       // 	filterConditions: { // array of filters to apply to the data table
      //       //		glue: 'and',
      //       // 		rules: []
      //       //  }
      //       // }

      //       var field = this.getUpdateObjectField(op.fieldID);
      //       if (!field) return;

      //       var value = op.value;

      //       if (value == "ab-current-user") value = OP.User.username();

      //       // in the case of a connected Field, we use op.value to get the
      //       // datacollection, and find it's currently selected value:
      //       if (field.key == "connectObject" || op.valueType == "exist") {
      //          // NOTE: 30 May 2018 :current decision from Ric is to limit this
      //          // to only handle 1:x connections where we update the current obj
      //          // with the PK of the value from the DC.
      //          //
      //          // In the future, if we want to handle the other options,
      //          // we need to modify this to handle the M:x connections where
      //          // we insert our PK into the value from the DC.

      //          // op.value is the ABDatacollection.id we need to find
      //          var dataCollection =
      //             this.currentForm.application.datacollections(
      //                (dc) => dc.id == op.value
      //             )[0];

      //          // we don't want to mess with the dataView directly since it might
      //          // be used by other parts of the system and this refresh might reset
      //          // it's cursor.
      //          // var clonedDataCollection = dataView.filteredClone(op.filterConditions);

      //          // loop through rules to find "same-as-field" or "not-same-as-field"
      //          // adjust operator and switch key value to actual value when found
      //          var filterConditions = _.cloneDeep(op.filterConditions);
      //          if (filterConditions && filterConditions.rules) {
      //             filterConditions.rules
      //                .filter((r) => {
      //                   return (
      //                      r.rule == "same_as_field" ||
      //                      r.rule == "not_same_as_field"
      //                   );
      //                })
      //                .forEach((item) => {
      //                   var valueField =
      //                      this.currentForm.datacollection.datasource.fields(
      //                         (f) => {
      //                            return f.id == item.value;
      //                         }
      //                      )[0];
      //                   if (valueField.key == "connectObject") {
      //                      item.value = valueField.format(this._formData);
      //                   } else {
      //                      item.value = this._formData[valueField.columnName];
      //                   }

      //                   if (item.rule == "not_same_as_field") {
      //                      item.rule = "not equals";
      //                   } else {
      //                      item.rule = "equals";
      //                   }
      //                });
      //          }

      //          let clonedDataCollection =
      //             dataCollection.filteredClone(filterConditions);

      //          switch (op.selectBy) {
      //             // the 'select-one' is getting the currently set cursor on this data collection
      //             // and using that value.
      //             // TODO: rename to 'select-cursor'
      //             case "select-one":
      //             default: // dataView.getItem(dataView.getCursor());
      //                value = clonedDataCollection.getCursor();

      //                if (value) {
      //                   // NOTE: webix documentation issue: .getCursor() is supposed to return
      //                   // the .id of the item.  However it seems to be returning the {obj}

      //                   if (op.valueType == "exist") {
      //                      var fieldWithValue =
      //                         clonedDataCollection.datasource.fields((f) => {
      //                            return f.id == op.queryField;
      //                         })[0];

      //                      if (fieldWithValue)
      //                         value = value[fieldWithValue.columnName];
      //                   } else if (value.id) {
      //                      value = value.id;
      //                   }
      //                }

      //                // QUESTION: if value returns undefined should we do something else?
      //                switch (op.op) {
      //                   case "set":
      //                      if (!value) break;

      //                      if (field.key == "connectObject") {
      //                         // if we are setting a connection we do not want to pass the full object because
      //                         // batch creates payload gets too large
      //                         objectToUpdate[field.columnName] = {};
      //                         objectToUpdate[field.columnName].id =
      //                            value[field.datasourceLink.PK()];
      //                         objectToUpdate[field.columnName][
      //                            field.datasourceLink.PK()
      //                         ] = value[field.datasourceLink.PK()];

      //                         // If the connect field use the custom FK, then it requires to pass value of the custom FK.
      //                         if (field.settings.isCustomFK) {
      //                            if (field.indexField) {
      //                               objectToUpdate[field.columnName][
      //                                  field.indexField.columnName
      //                               ] = value[field.indexField.columnName];
      //                            }
      //                            if (field.indexField2) {
      //                               objectToUpdate[field.columnName][
      //                                  field.indexField2.columnName
      //                               ] = value[field.indexField2.columnName];
      //                            }
      //                         }

      //                         field.datasourceLink
      //                            .fields(
      //                               (f) =>
      //                                  f.key == "combined" ||
      //                                  f.key == "AutoIndex"
      //                            )
      //                            .forEach((f) => {
      //                               objectToUpdate[field.columnName][
      //                                  f.columnName
      //                               ] = value[f.columnName];
      //                            });
      //                      } else {
      //                         objectToUpdate[field.columnName] = value;
      //                      }

      //                      break;
      //                }
      //                break;

      //             // attempt to filter this data collection by the given filterConditions
      //             case "filter-select-all":
      //                var newValues = [];

      //                var currRow = clonedDataCollection.getFirstRecord();
      //                while (currRow) {
      //                   // do something there

      //                   switch (clonedDataCollection.sourceType) {
      //                      // case: datacollection is an object
      //                      // we want to set our field to this values
      //                      case "object":
      //                         newValues.push(currRow.id);
      //                         break;

      //                      // case: datacollection is a query
      //                      // our field is a pointer to an object. we want to pull out that object
      //                      // from the query data.
      //                      case "query":
      //                         var fieldWithValue =
      //                            clonedDataCollection.datasource.fields((f) => {
      //                               return f.id == op.queryField;
      //                            })[0];

      //                         var newValue = currRow[fieldWithValue.columnName];

      //                         if (typeof newValue == "undefined") {
      //                            newValue =
      //                               currRow[fieldWithValue.relationName()];

      //                            if (Array.isArray(newValue)) {
      //                               newValue = newValue.map((v) => {
      //                                  return v.id ? v.id : v;
      //                               });
      //                            } else if (newValue.id) {
      //                               newValue = newValue.id;
      //                            }
      //                         }

      //                         newValues = _.uniq(newValues.concat(newValue));

      //                         break;
      //                   }

      //                   currRow = clonedDataCollection.getNextRecord(currRow);
      //                }

      //                // QUESTION: if value returns undefined should we do something else?
      //                switch (op.op) {
      //                   case "set":
      //                      if (field.linkType() == "one") {
      //                         var updates = [];
      //                         newValues.forEach((v) => {
      //                            var objectToUpdateClone =
      //                               _.cloneDeep(objectToUpdate);
      //                            objectToUpdateClone[field.columnName] = v;
      //                            updates.push(objectToUpdateClone);
      //                         });
      //                         objectToUpdate.newRecords = updates;
      //                      } else {
      //                         objectToUpdate[field.columnName] = newValues;
      //                      }
      //                      break;
      //                }
      //                break;

      //             case "filter-select-one":
      //                newValues = [];

      //                value = clonedDataCollection.getFirstRecord();

      //                if (value) {
      //                   // case: datacollection is a query
      //                   // our field is a pointer to an object. we want to pull out that object
      //                   // from the query data.
      //                   if (
      //                      clonedDataCollection.sourceType == "query" ||
      //                      (op.valueType == "exist" && op.queryField)
      //                   ) {
      //                      var fieldWithValue =
      //                         clonedDataCollection.datasource.fields((f) => {
      //                            return f.id == op.queryField;
      //                         })[0];

      //                      var newValue = value[fieldWithValue.columnName];

      //                      if (typeof newValue == "undefined") {
      //                         newValue = value[fieldWithValue.relationName()];
      //                         if (Array.isArray(newValue)) {
      //                            newValue = newValue[0];
      //                         }
      //                         if (newValue.id) newValue = newValue.id;
      //                      }

      //                      value = newValue;
      //                   }
      //                   // case: datacollection is an object
      //                   // we want to set our field to this values
      //                   else if (clonedDataCollection.sourceType == "object") {
      //                      // NOTE: webix documentation issue: .getCursor() is supposed to return
      //                      // the .id of the item.  However it seems to be returning the {obj}

      //                      // we need to use the objects indexField(2) if there is one
      //                      // otherwise default to the id
      //                      var lookup;
      //                      if (field.indexField) {
      //                         lookup = field.indexField.columnName;
      //                      } else if (field.indexField2) {
      //                         lookup = field.indexField2.columnName;
      //                      }
      //                      if (lookup && value[lookup]) {
      //                         value = value[lookup];
      //                      } else if (value.id) {
      //                         value = value.id;
      //                      }
      //                   }
      //                }

      //                // QUESTION: if value returns undefined should we do something else?
      //                switch (op.op) {
      //                   case "set":
      //                      objectToUpdate[field.columnName] = value;
      //                      break;
      //                }
      //                break;
      //          }

      //          isUpdated = true;

      //          // allPromises.push(connectedPromise);
      //       } else {
      //          // var setPromise = new Promise((resolve, reject) => {
      //          switch (op.op) {
      //             case "set":
      //                objectToUpdate[field.columnName] = value;
      //                break;
      //          }

      //          isUpdated = true;

      //          //    resolve(isUpdated);
      //          // });

      //          // allPromises.push(setPromise);

      //          // console.log("finished");
      //       }
      //    });

      //    return isUpdated;
      //    // Promise.all(allPromises).then(() => {
      //    //    resolve(isUpdated);
      //    // });
      //    // });
      // }

      // // process
      // // gets called when a form is submitted and the data passes the Query Builder Rules.
      // // @param {obj} options
      // // @return {Promise}
      // process(options) {
      //    this._formData = options.data;

      //    return new Promise((resolve, reject) => {
      //       let isUpdated = this.processUpdateObject({}, options.data);
      //       if (!isUpdated) {
      //          resolve();
      //       } else {
      //          // get the model from the provided Form Obj:
      //          var dv = options.form.datacollection;
      //          if (!dv) return resolve();

      //          var model = dv.model;
      //          model
      //             .update(options.data.id, options.data)
      //             .catch((err) => {
      //                OP.Error.log(
      //                   "!!! ABViewRuleActionFormRecordRuleUpdate.process(): update error:",
      //                   { error: err, data: options.data }
      //                );
      //                reject(err);
      //             })
      //             .then(resolve);
      //       }
      //    });
      // }

      // objectLoad
      // save the current object this Action is associated with.
      objectLoad(object) {
         // stash rules for old object
         if (this.CurrentObject) {
            this.stashRules[this.CurrentObject.id] = this.valueRules;
         }

         super.objectLoad(object);

         // with a new CurrentObject, then reset our UI
         // this._uiUpdater = null;

         // reload any stashed rules, or set to {}
         if (object) {
            this.valueRules = this.stashRules[this.CurrentObject.id] || {};
         }
      }

      // fromSettings
      // initialize this Action from a given set of setting values.
      // @param {obj}  settings
      fromSettings(settings) {
         settings = settings || {};

         super.fromSettings(settings); // let the parent handle the QB

         // make sure UI is updated:
         // set our updateObject
         if (settings.updateObjectID) {
            const updateObject = this.AB.objectByID(settings.updateObjectID);
            this.objectLoad(updateObject);
         }

         // if we have a display component, then populate it:
         if (this._uiUpdater) {
            // now we handle our valueRules:{} object settings.
            // pass the settings off to our DisplayList component:
            this._uiUpdater.fromSettings(settings);
         }
      }

      // toSettings
      // return an object that represents the current state of this Action
      // @return {obj}
      toSettings() {
         // settings: {
         //	valueRules:{}
         // }

         // let our parent store our QB settings
         const settings = super.toSettings();

         settings.valueRules = this._uiUpdater?.toSettings();
         settings.updateObjectID = this.CurrentObject.id;

         return settings;
      }
   }
   return ABViewRuleActionObjectUpdater;
}
