//
// ABViewQueryBuilderObjectFieldConditions
//
// A UI component that is responsible for displaying a QueryBuilder based upon
// the fields of a given ABObject.
//
// This object is also responsible for saving it's state to a settings value,
// and generating the settings value to be saved.

import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = UIClass.L();

   class ABViewQueryBuilderObjectFieldConditions extends UIClass {
      /**
       * @param {object} App
       *      The shared App object that is created in OP.Component
       * @param {string} idBase
       *      Identifier for this component
       */
      constructor(base, label) {
         super(`${base}_ofc`, {
            queryBuilder: "",
            queryBuilderContainer: "",
            queryBuilderLayout: "",
            showQBButton: "",
         });
         this.label = label;

         this.FilterComplex = AB.filterComplexNew(`${this.ids.component}_fc`);
      }

      /**
       * cleanRules
       * walk through all the QueryBuilder (QB) rules and make conversions
       * of the data into their proper formats.
       * @param {obj} rules  the {rules} obj that is returned from the QB object
       * @param {array} fields  an array of field definitions from the QB object
       * @param {bool} dateToString  convert Dates to String format?
       */
      cleanRules(rules, fields, dateToString) {
         if (typeof dateToString == "undefined") dateToString = true;

         // walk the given condition rules / values, walk them and make sure
         // any given rules have properly formatted values.
         function processCondition(rule) {
            // make sure rule is provided
            if (rule) {
               if (rule.glue && rule.rules) {
                  rule.rules.forEach((r) => {
                     processCondition(r);
                  });
               } else {
                  // converting a single rule:

                  var field = fields.filter((f) => {
                     return f.id == rule.key;
                  })[0];
                  if (field) {
                     switch (field.type) {
                        case "number":
                        case "formula":
                           // when getting data from the server, the numbers are
                           // sent back as strings ("100.25").
                           // make sure to convert strings to numbers:
                           if (typeof rule.value == "string") {
                              if (rule.value.indexOf(".") == -1) {
                                 rule.value = parseInt(rule.value);
                              } else {
                                 rule.value = parseFloat(rule.value);
                              }
                           }
                           break;
                        case "date":
                           // in some cases we want to convert the Date() object returned
                           // by QueryBuilder into a string for saving on the Server.
                           if (dateToString) {
                              // if we have a Date() obj returned from QueryBuilder,
                              // convert to a string format:
                              if (rule.value instanceof Date) {
                                 rule.value = webix.i18n.dateFormatStr(
                                    rule.value
                                 );
                              }
                           } else {
                              // in other cases we want to convert the string returned
                              // by the server into a Date() for the QB
                              if (typeof rule.value == "string") {
                                 rule.value = new Date(rule.value);
                              }
                           }

                           break;
                     }
                  }
               }
            }
         }
         processCondition(rules);
      }

      ui() {
         const ids = this.ids;

         let _ui = {
            id: ids.queryBuilderLayout,
            view: "layout",
            hidden: true,
            type: "line",
            rows: [
               {
                  id: ids.showQBButton,
                  cols: [
                     { fillspace: true },
                     {
                        view: "button",
                        css: "webix_primary",
                        name: "addqb",
                        value: L("Add Custom Conditions"),
                        autowidth: true,
                        click: () => {
                           $$(ids.queryBuilderContainer).show();
                           $$(ids.showQBButton).hide();
                           // _logic.buttonCancel();
                           // Timing Wise, this needs to be called when the
                           // query UI is already created.
                           this.FilterComplex.fieldsLoad(
                              this.conditionFields(),
                              this.CurrentObject
                           );
                        },
                     },
                     { fillspace: true },
                  ],
               },
               {
                  hidden: true,
                  id: ids.queryBuilderContainer,
                  cols: [this.FilterComplex.ui],
               },
            ],
         };

         if (this.label) {
            _ui.rows[1].cols.unshift({
               view: "label",
               css: "ab-text-bold",
               label: this.label,
               width: uiConfig.labelWidthLarge,
            });
         }

         return _ui;
      }

      init(AB) {
         this.AB = AB;
         this.FilterComplex.init(/*{isRecordRule: true}*/);
      }

      // // component
      // // initialize the UI display for this popup editor.
      // component(App, idBase) {
      //    this.App = App;
      //    this.idBase = idBase;

      //    var L = App.Label;

      //    var uniqueInstanceID = webix.uid();
      //    var myUnique = (key) => {
      //       // return this.unique(idBase + key ) + '_' + uniqueInstanceID;
      //       return `${idBase}_${key}_${uniqueInstanceID}`;
      //    };

      //    // internal list of Webix IDs to reference our UI components.
      //    var ids = (this.ids = {
      //       component: myUnique("qbObjectFieldConditions"),
      //       queryBuilder: myUnique("qBuilder"),
      //       queryBuilderContainer: myUnique("qBuilderContainer"),
      //       queryBuilderLayout: myUnique("qBuilderLayout"),
      //       showQBButton: myUnique("showQBButton"),
      //    });

      //    // webix UI definition:
      //    this.ui = {
      //       view: "layout",
      //       id: ids.queryBuilderLayout,
      //       hidden: true,
      //       type: "line",
      //       rows: [
      //          {
      //             id: ids.showQBButton,
      //             cols: [
      //                { fillspace: true },
      //                {
      //                   view: "button",
      //                   css: "webix_primary",
      //                   name: "addqb",
      //                   value: L("Add Custom Conditions"),
      //                   autowidth: true,
      //                   click: function () {
      //                      $$(ids.queryBuilderContainer).show();
      //                      $$(ids.showQBButton).hide();
      //                      // _logic.buttonCancel();
      //                   },
      //                },
      //                { fillspace: true },
      //             ],
      //          },
      //          {
      //             hidden: true,
      //             id: ids.queryBuilderContainer,
      //             cols: [
      //                {
      //                   view: "querybuilder",
      //                   id: ids.queryBuilder,
      //                   fields: this.conditionFields(),
      //                },
      //             ],
      //          },
      //       ],
      //    };

      //    // tack on a label if provided.
      //    if (this.label) {
      //       this.ui.rows[1].cols.unshift({
      //          view: "label",
      //          css: "ab-text-bold",
      //          label: this.label,
      //          width: uiConfig.labelWidthLarge,
      //       });
      //    }

      //    // for setting up UI
      //    this.init = (options) => {
      //       options = options || {};

      //       // register callbacks:
      //       for (var c in _logic.callbacks) {
      //          _logic.callbacks[c] = options[c] || _logic.callbacks[c];
      //       }
      //    };

      //    // internal business logic
      //    var _logic = (this._logic = {
      //       callbacks: {
      //          onCancel: function () {
      //             console.warn("NO onCancel()!");
      //          },
      //          onSave: function (field) {
      //             console.warn("NO onSave()!");
      //          },
      //       },

      //       /**
      //        * cleanRules
      //        * walk through all the QueryBuilder (QB) rules and make conversions
      //        * of the data into their proper formats.
      //        * @param {obj} rules  the {rules} obj that is returned from the QB object
      //        * @param {array} fields  an array of field definitions from the QB object
      //        * @param {bool} dateToString  convert Dates to String format?
      //        */
      //       cleanRules: (rules, fields, dateToString) => {
      //          this.cleanRules(rules, fields, dateToString);
      //       },

      //       getValue: () => {
      //          var values = null;
      //          var QB = $$(ids.queryBuilder);
      //          if (QB) {
      //             values = QB.getValue();
      //          }

      //          // convert dates to simpler format:
      //          // by default we're getting long values: "Mon Feb 2, 2018 GMT xxxxxxx",
      //          // and webix doesn't seem to understand them when we send them back.
      //          // so save simple date values: "mm/dd/yyyy"
      //          if (values) {
      //             _logic.cleanRules(values[0], values[1], true);
      //          }

      //          return values;
      //       },

      //       setValue: (values) => {
      //          values = values || [];
      //          if (!Array.isArray(values)) values = [values];
      //          if (values.length == 0) {
      //             values.push({});
      //          } // push default rules
      //          if (values.length < 2) {
      //             values.push(this.conditionFields());
      //          }

      //          // convert dates from our server side "string" format into
      //          // Date() objects.
      //          _logic.cleanRules(values[0], values[1], false);

      //          var QB = $$(ids.queryBuilder);
      //          if (QB) {
      //             if (values[0] && values[0].rules && values[0].rules.length) {
      //                QB.setValue(values[0]);
      //                $$(ids.queryBuilderContainer).show();
      //                $$(ids.showQBButton).hide();
      //             }
      //          }
      //       },
      //    });

      //    this.getValue = _logic.getValue;
      //    this.show = _logic.show;
      //    this.setValue = _logic.setValue;
      // }

      objectLoad(object) {
         super.objectLoad(object);
         this.FilterComplex.fieldsLoad(this.conditionFields(), object);
      }

      getValue() {
         var condition = this.FilterComplex.getValue();
         let fields = this.conditionFields();

         // convert dates to simpler format:
         // by default we're getting long values: "Mon Feb 2, 2018 GMT xxxxxxx",
         // and webix doesn't seem to understand them when we send them back.
         // so save simple date values: "mm/dd/yyyy"

         if (condition) {
            this.cleanRules(condition, fields, true);
         }

         return condition; // [condition, fields];
      }

      setValue(condition) {
         // previous format was [ condition, fields ]
         if (Array.isArray(condition)) {
            condition = condition[0];
         }

         condition = condition || { glue: "and", rules: [] };
         // if (!Array.isArray(values)) values = [values];
         // if (values.length == 0) {
         //    values.push({});
         // } // push default rules
         // if (values.length < 2) {
         //    values.push(this.conditionFields());
         // }

         // convert dates from our server side "string" format into
         // Date() objects.
         this.cleanRules(condition, this.conditionFields(), false);

         this.FilterComplex.setValue(condition);

         /*
         var QB = $$(ids.queryBuilder);
         if (QB) {
            if (values[0] && values[0].rules && values[0].rules.length) {
               QB.setValue(values[0]);
               $$(ids.queryBuilderContainer).show();
               $$(ids.showQBButton).hide();
            }
         }
*/
      }

      // conditionFields()
      // Return the list of fields we are able to update.
      // @return {array} of querybuilder field definitions:
      //					[
      // 						{ id:"fname",   value:"First Name", type:"string" },
      //					    { id:"lname",   value:"Last Name",  type:"string" },
      //					    { id:"age",     value:"Age",        type:"number" },
      //					    { id:"bdate",   value:"Birth Date", type:"date" }
      //					]
      conditionFields() {
         var fieldTypes = [
            "string",
            "LongText",
            "number",
            "date",
            "email",
            "formula",
            "calculate",
         ];

         var currFields = [];

         if (this.CurrentObject) {
            this.CurrentObject.fields().forEach((f) => {
               if (fieldTypes.indexOf(f.key) != -1) {
                  // NOTE: the .id value must match the obj[.id]  in the data set
                  // so if your object data looks like:
                  // 	{
                  //		name_first:'Neo',
                  //		name_last: 'The One'
                  //  },
                  // then the ids should be:
                  // { id:'name_first', value:'xxx', type:'string' }

                  ////
                  //// New FilterComplex wants actual fields returned:
                  ////

                  // let type = f.key;
                  // if (f.key == "formula" || f.key == "calculate")
                  //    type = "number";
                  // else if (f.key == "LongText") type = "string";

                  // currFields.push({
                  //    id: f.columnName,
                  //    value: f.label,
                  //    type: type,
                  // });

                  currFields.push(f);
               }
            });
         }

         return currFields;
      }

      // process
      // Take the provided data and process each of our rules.
      // @param {obj} options
      // @return {promise}
      // process(options) {
      //    return new Promise((resolve, reject) => {
      //       var numDone = 0;
      //       var onDone = () => {
      //          numDone++;
      //          if (numDone >= this.listRules.length) {
      //             resolve();
      //          }
      //       };

      //       this.listRules.forEach((rule) => {
      //          rule
      //             .process(options)
      //             .then(function () {
      //                onDone();
      //             })
      //             .catch((err) => {
      //                reject(err);
      //             });
      //       });

      //       if (this.listRules.length == 0) {
      //          resolve();
      //       }
      //    });
      // }

      // showQueryBuilderContainer() {
      //    $$(this.ids.queryBuilderLayout).show();
      //    $$(this.ids.queryBuilderContainer).show();
      //    $$(this.ids.showQBButton).hide();
      // }
   }

   return ABViewQueryBuilderObjectFieldConditions;
}
