/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/application.js":
/*!****************************!*\
  !*** ./src/application.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rootPages_Designer_ui_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rootPages/Designer/ui.js */ "./src/rootPages/Designer/ui.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var Designer = (0,_rootPages_Designer_ui_js__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   var application = {
      id: "ABDesigner",
      label: "AB Designer", // How to get Multilingual?
      // {string} the AB.Multilingual.Label(Key)
      isPlugin: true,

      pages: function () {
         // Return the Root Pages required to
         return this._pages;
      },
      _pages: [Designer],
      // init: function (AB) {
      //    debugger;
      //    this._pages.forEach((p) => {
      //       p.init(AB);
      //    });
      // },
      datacollectionsIncluded: () => {
         // return [];
         var myDCs = [];
         return AB.datacollections((d) => myDCs.indexOf(d.id) > -1);
      },
   };
   Designer.application = application;
   return application;
}


/***/ }),

/***/ "./src/definitions.js":
/*!****************************!*\
  !*** ./src/definitions.js ***!
  \****************************/
/***/ ((module) => {

module.exports = [];


/***/ }),

/***/ "./src/labels/en.js":
/*!**************************!*\
  !*** ./src/labels/en.js ***!
  \**************************/
/***/ ((module) => {

/* eslint-disable */
module.exports = {
   /* key : label */
};


/***/ }),

/***/ "./src/labels/labels.js":
/*!******************************!*\
  !*** ./src/labels/labels.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

//
// Labels.js
//
// The index into our label library.

var Labels = {};
// {hash}  { /* language_code : { key: label} */ }
// all the <lang_code>.js files supported by the AppBuilder

Labels.en = __webpack_require__(/*! ./en.js */ "./src/labels/en.js");

module.exports = Labels;


/***/ }),

/***/ "./src/rootPages/Designer/properties/PropertyManager.js":
/*!**************************************************************!*\
  !*** ./src/rootPages/Designer/properties/PropertyManager.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * PropertyManager
 *
 * An Interface for managing all the various Property Editors we support.
 *
 */
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var Fields = [];
   // {array}
   // All the ABField Property Inerfaces available.
   [
      __webpack_require__(/*! ./dataFields/ABFieldConnect */ "./src/rootPages/Designer/properties/dataFields/ABFieldConnect.js"),
      __webpack_require__(/*! ./dataFields/ABFieldNumber */ "./src/rootPages/Designer/properties/dataFields/ABFieldNumber.js"),
      __webpack_require__(/*! ./dataFields/ABFieldList */ "./src/rootPages/Designer/properties/dataFields/ABFieldList.js"),
      __webpack_require__(/*! ./dataFields/ABFieldString */ "./src/rootPages/Designer/properties/dataFields/ABFieldString.js"),
   ].forEach((F) => {
      var Klass = F.default(AB);
      Fields.push(new Klass());
   });

   return {
      /*
       * @function fields
       * return all the currently defined Field Properties in an array.
       * @param {fn} f
       *        A filter for limiting which fields you want.
       * @return [{ClassUI(Field1)}, {ClassUI(Field2)}, ...]
       */
      fields: function (f = () => true) {
         return Fields.filter(f);
      },
   };
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/dataFields/ABField.js":
/*!*****************************************************************!*\
  !*** ./src/rootPages/Designer/properties/dataFields/ABField.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ABField
 * A Generic Property manager for All our fields.
 */


var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   if (!myClass) {
      const uiConfig = AB.Config.uiSettings();
      const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
      var L = UIClass.L();

      myClass = class ABFieldProperty extends UIClass {
         constructor(base = "properties_abfield", ids = {}) {
            // base: {string} unique base id reference
            // ids: {hash}  { key => '' }
            // this is provided by the Sub Class and has the keys
            // unique to the Sub Class' interface elements.

            var common = {
               // component: `${base}_component`,

               // the common property fields
               label: "",
               columnName: "",
               fieldDescription: "",
               showIcon: "",
               required: "",
               numberOfNull: "",
               unique: "",
               filterComplex: "",
               addValidation: "",
               shorthand: "",
               validationRules: "",

               buttonCog: "",
               editFieldName: "",
               editFieldNameForm: "",
               editFieldNameFormDatabaseColumn: "",
               filterView: "",
               uniqueView: "",
            };

            Object.keys(ids).forEach((k) => {
               if (typeof common[k] != "undefined") {
                  console.error(
                     `!!! ABFieldProperty:: passed in ids contains a restricted field : ${k}`
                  );
                  return;
               }
               common[k] = "";
            });

            super(base, common);

            this.base = base;
            this.AB = AB;
         }

         ui(elements = []) {
            var ids = this.ids;

            var FC = this.FieldClass();
            var _ui = {
               view: "form",
               id: ids.component,
               borderless: true,
               autowidth: true,
               elements: [
                  {
                     cols: [
                        {
                           view: "label",
                           label: L("Field Name:") + " ",
                           align: "left",
                           width: 86.88,
                        },
                        {
                           name: "label",
                           id: ids.label,
                           view: "text",
                           placeholder: L("Database field name"),
                           fillspace: true,
                           on: {
                              onChange: (val) => {
                                 // update field label default when appropriate
                                 this.textFieldName(val);
                              },
                              onAfterRender: function () {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "text",
                           id: ids.columnName,
                           name: "columnName",
                           hidden: true,
                        },
                        {
                           view: "button",
                           id: ids.buttonCog,
                           css: "webix_transparent",
                           label: '<span class="webix_icon_btn" style="margin: 0px;"><i class="nomargin fa fa-cog"></i></span>',
                           width: 40,
                           on: {
                              onItemClick: () => {
                                 this.buttonCog();
                              },
                              onAfterRender: function () {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
                  {
                     cols: [
                        {
                           view: "label",
                           label: L("Show icon:") + " ",
                           align: "left",
                           width: 75.47,
                        },
                        {
                           view: "switch",
                           id: ids.showIcon,
                           name: "showIcon",
                           value: 1,
                           width: 55,
                           on: {
                              onAfterRender: function () {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                        { width: 20 },
                        {
                           view: "label",
                           label: L("Required:") + " ",
                           align: "left",
                           width: 66.28,
                        },
                        {
                           view: "switch",
                           id: ids.required,
                           name: "required",
                           disabled: !FC.defaults().supportRequire,
                           value: 0,
                           width: 55,
                           on: {
                              onChange: (newVal, oldVal) => {
                                 this.requiredOnChange(newVal, oldVal, ids);

                                 // If check require on edit field, then show warning message
                                 this.getNumberOfNullValue(newVal);
                              },

                              onAfterRender: function () {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                        { width: 20 },
                        // warning message: number of null value rows
                        {
                           view: "label",
                           id: ids.numberOfNull,
                           css: { color: "#f00" },
                           label: "",
                           hidden: true,
                           on: {
                              onAfterRender: function () {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "label",
                           label: L("Unique:") + " ",
                           align: "left",
                           width: 58.84,
                        },
                        {
                           view: "switch",
                           id: ids.unique,
                           name: "unique",
                           disabled: !FC.defaults().supportUnique,
                           disallowEdit: true,
                           value: 0,
                           width: 55,
                           on: {
                              onAfterRender: function () {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                        { width: 20 },
                        {
                           id: ids.addValidation,
                           view: "button",
                           label: L("Add Field Validation"),
                           css: "webix_primary",
                           popup: ids.filterView,
                           on: {
                              onItemClick: () => {
                                 $$(ids.filterView).adjust();
                              },

                              onAfterRender: function () {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },

                  // have a hidden field to contain the validationRules
                  // value we will parse out later
                  {
                     id: ids.validationRules,
                     view: "text",
                     hidden: true,
                     name: "validationRules",
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     cols: [
                        {
                           view: "label",
                           label: L("Custom Settings:") + " ",
                           align: "left",
                           width: 200,
                        },
                        {},
                        {
                           view: "label",
                           id: ids.fieldDescription,
                           label: L("Description"), // Field.description,
                           align: "right",
                           on: {
                              onAfterRender: function () {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
                  {
                     id: ids.uniqueView,
                     view: "scrollview",
                     borderless: true,
                     scroll: "y",
                     css: {
                        background: "#ddd",
                     },
                     body: {
                        padding: {
                           top: 25,
                           bottom: 25,
                           left: 25,
                           right: 25,
                        },
                        // Add our passed in elements:
                        rows: elements.map((e) => {
                           // passed in elements might not have their .id
                           // set, but have a .name. Let's default id =
                           if (!e.id && e.name) {
                              if (!this.ids[e.name]) {
                                 this.ids[e.name] = `${this.base}_${e.name}`;
                              }
                              e.id = this.ids[e.name];
                           }

                           return e;
                        }),
                     },
                  },
               ],
               rules: {
                  label: webix.rules.isNotEmpty,
                  columnName: webix.rules.isNotEmpty,
               },
            };

            webix.ui({
               view: "window",
               id: ids.editFieldName,
               modal: true,
               hidden: true,
               position: "center",
               width: 450,
               height: 250,
               head: {
                  view: "toolbar",
                  css: "webix_dark",
                  paddingX: 2,
                  elements: [
                     {
                        view: "label",
                        align: "center",
                        label: L("Edit field name"),
                     },
                  ],
               },
               body: {
                  view: "form",
                  id: ids.editFieldNameForm,
                  elements: [
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Database Column:") + " ",
                              align: "right",
                              width: 125,
                           },
                           {
                              view: "text",
                              id: ids.editFieldNameFormDatabaseColumn,
                              name: "columnName",
                              placeholder: L("Database Column"),
                              on: {
                                 onAfterRender: function () {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                           { width: 30 },
                        ],
                     },
                     {
                        cols: [
                           {},
                           {
                              view: "button",
                              value: L("Cancel"),
                              css: "webix_danger",
                              width: 100,
                              on: {
                                 onItemClick: () => {
                                    this.buttonEditFieldNameButtonCancel();
                                 },

                                 onAfterRender: function () {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                           {
                              view: "button",
                              value: L("Submit"),
                              css: "webix_primary",
                              width: 100,
                              on: {
                                 onItemClick: () => {
                                    this.buttonEditFieldNameButtonSubmit();
                                 },

                                 onAfterRender: function () {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                           { width: 30 },
                        ],
                     },
                  ],
               },
            });

            webix.ui({
               id: ids.filterView,
               view: "popup",
               resize: true,
               height: 503,
               width: 692,
               position: "center",
               body: {
                  rows: [
                     {
                        view: "toolbar",
                        css: "webix_dark",
                        paddingX: 0,
                        elements: [
                           {
                              view: "label",
                              align: "center",
                              label: L("Field Validation"),
                           },
                           {
                              view: "button",
                              label: '<span class="webix_icon"><i class="nomargin fa fa-times"></i></span>',
                              css: "webix_transparent",
                              width: 40,
                              click: () => {
                                 $$(ids.filterView).hide();
                              },
                              on: {
                                 onAfterRender: () => {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },
                     {
                        cols: [
                           {
                              view: "button",
                              label: L("Add"),
                              css: "webix_secondary",
                              on: {
                                 onItemClick: () => {
                                    this.addValidation();
                                 },
                                 onAfterRender: function () {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                           {
                              view: "button",
                              label: L("Delete All"),
                              css: "webix_danger",
                              on: {
                                 onItemClick: () => {
                                    this.filterViewDeleteAllValidation();
                                 },
                                 onAfterRender: function () {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },
                     {
                        view: "scrollview",
                        scroll: "y",
                        body: {
                           id: ids.filterComplex,
                           rows: [],
                        },
                     },
                  ],
               },
               on: {
                  onViewResize: () => {
                     $$(ids.filterView).show();
                  },
               },
            });

            return _ui;
         }

         async init(AB) {
            this.AB = AB;

            var FC = this.FieldClass();
            if (FC) {
               $$(this.ids.fieldDescription).define(
                  "label",
                  "*" + L(FC.defaults().description)
               );
            } else {
               $$(this.ids.fieldDescription).hide();
            }
         }

         textFieldName(val) {
            const latestVals = this.formValues();

            if (!this.modeEdit) {
               latestVals.label = val;
               latestVals.columnName = latestVals.label;
            } else latestVals.label = val;

            $$(this.ids.component).setValues(latestVals);
         }

         buttonCog() {
            if (this.isValid()) {
               const latestVals = this.formValues();

               $$(this.ids.editFieldNameForm).setValues({
                  columnName: latestVals.columnName,
               });

               if (this.modeEdit)
                  $$(this.ids.editFieldNameFormDatabaseColumn).disable();
               else $$(this.ids.editFieldNameFormDatabaseColumn).enable();

               $$(this.ids.editFieldName).show();
            }
         }

         buttonEditFieldNameButtonCancel() {
            const previousVal = $$(this.ids.component).getValues();

            $$(this.ids.editFieldNameForm).setValues({
               columnName: previousVal.columnName,
            });
            $$(this.ids.editFieldName).hide();
         }

         buttonEditFieldNameButtonSubmit() {
            const latestVals = this.formValues();
            const valColumnName = $$(this.ids.editFieldNameForm).getValues()
               .columnName;

            latestVals.columnName =
               valColumnName !== "" ? valColumnName : latestVals.columnName;
            $$(this.ids.component).setValues(latestVals);
            $$(this.ids.editFieldName).hide();
         }

         addValidation(settings) {
            var ids = this.ids;
            var Filter = new this.AB.Class.FilterComplex(
               this.AB._App,
               "field_validation_rules",
               this.AB
            );

            $$(ids.filterComplex).addView({
               view: "form",
               css: "abValidationForm",
               cols: [
                  {
                     rows: [
                        {
                           view: "text",
                           name: "invalidMessage",
                           labelWidth: uiConfig.labelWidthLarge,
                           value: settings?.invalidMessage
                              ? settings.invalidMessage
                              : "",
                           label: L("Invalid Message"),
                        },
                        Filter.ui,
                     ],
                  },
                  {
                     view: "button",
                     css: "webix_danger",
                     icon: "fa fa-trash",
                     type: "icon",
                     autowidth: true,
                     click: function () {
                        var $viewCond = this.getParentView();
                        $$(ids.filterComplex).removeView($viewCond);

                        // reset the validation rules UI
                        const filterViews = $$(ids.filterComplex).queryView(
                           {
                              view: "form",
                              css: "abValidationForm",
                           },
                           "all"
                        );
                        $$(ids.addValidation).define(
                           "badge",
                           filterViews.length !== 0 ? filterViews.length : null
                        );
                        $$(ids.addValidation).refresh();
                     },
                     on: {
                        onAfterRender: function () {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            });

            this.resetDefaultValidation();

            $$(Filter.ids.save).hide();
            Filter.fieldsLoad(this.CurrentObject.fields());
            if (settings && settings.rules) Filter.setValue(settings.rules);
         }

         filterViewDeleteAllValidation() {
            const ids = this.ids;

            // reset the validation rules UI
            var filterViews = $$(ids.filterComplex).queryView(
               {
                  view: "form",
                  css: "abValidationForm",
               },
               "all"
            );

            if (filterViews.length) {
               filterViews.forEach((v) => {
                  $$(ids.filterComplex).removeView(v);
               });
            }

            this.resetDefaultValidation();
         }

         clearEditor() {
            console.error("!!! Depreciated! call clear() instead.");
            this.clear();
         }

         clear() {
            var ids = this.ids;
            this._CurrentField = null;

            var defaultValues = this.defaultValues();

            for (var f in defaultValues) {
               var component = $$(ids[f]);
               if (component) component.setValue(defaultValues[f]);
            }

            this.filterViewDeleteAllValidation();

            // $$(ids.addValidation).hide();

            // hide warning message of null data
            $$(ids.numberOfNull).hide();
         }

         resetDefaultValidation() {
            const ids = this.ids;

            // reset the validation rules UI
            const filterViews = $$(ids.filterComplex).queryView(
               {
                  view: "form",
                  css: "abValidationForm",
               },
               "all"
            );
            $$(ids.addValidation).define(
               "badge",
               filterViews.length !== 0 ? filterViews.length : null
            );
            $$(ids.addValidation).refresh();
         }

         /**
          * @method defaults()
          * Return the FieldClass() default values.
          * NOTE: the child class MUST implement FieldClass() to return the
          * proper ABFieldXXX class definition.
          * @return {obj}
          */
         defaults() {
            var FieldClass = this.FieldClass();
            if (!FieldClass) {
               console.error(
                  "!!! ABFieldStringProperty: could not find FieldClass[]"
               );
               return null;
            }
            return FieldClass.defaults();
         }

         defaultValues() {
            var values = {
               label: "",
               columnName: "",
               showIcon: 1,
               required: 0,
               unique: 0,
               validationRules: "",
            };

            var FieldClass = this.FieldClass();
            if (FieldClass) {
               var fcValues = FieldClass.defaultValues();
               Object.keys(fcValues).forEach((k) => {
                  if (typeof values[k] == "undefined") {
                     values[k] = fcValues[k];
                  }
               });
            }

            return values;
         }

         /**
          * @function eachDeep
          * a depth first fn to apply fn() to each element of our list.
          * @param {array} list  array of webix elements to scan
          * @param {fn} fn function to apply to each element.
          */
         eachDeep(list, fn) {
            list.forEach((e) => {
               // process sub columns
               if (e.cols) {
                  this.eachDeep(e.cols, fn);
                  return;
               }

               if (e.body?.cols) {
                  this.eachDeep(e.body.cols, fn);
                  return;
               }

               // or rows
               if (e.rows) {
                  this.eachDeep(e.rows, fn);
                  return;
               }

               if (e.body?.rows) {
                  this.eachDeep(e.body.rows, fn);
                  return;
               }

               // or just process this element:
               fn(e);
            });
         }

         editorPopulate(field) {
            console.error("!!! Depreciated. call populate() instead.");
            this.populate(field);
         }

         /**
          * @method FieldClass()
          * A method to return the proper ABFieldXXX Definition.
          * NOTE: Must be overwritten by the Child Class
          */
         FieldClass() {
            console.error("!!! Child Class has not overwritten FieldClass()");
            return null;
            // return super._FieldClass("string");
         }

         _FieldClass(key) {
            return this.AB.Class.ABFieldManager.fieldByKey(key);
         }

         formValues() {
            return $$(this.ids.component).getValues();
         }

         async getNumberOfNullValue(isRequired) {
            var ids = this.ids;
            if (
               isRequired &&
               this._CurrentField &&
               this._CurrentField.id &&
               this._CurrentField.settings.required != isRequired
            ) {
               // TODO: disable save button

               // get count number
               try {
                  var data = await this._CurrentField.object.model().count({
                     where: {
                        glue: "and",
                        rules: [
                           {
                              key: this._CurrentField.id,
                              rule: "is_null",
                           },
                        ],
                     },
                  });

                  if (data.count > 0) {
                     $$(ids.numberOfNull).setValue(
                        L(
                           "** There are {0} rows that will be updated to default value",
                           [data.count]
                        )
                     );
                     $$(ids.numberOfNull).show();
                  } else {
                     $$(ids.numberOfNull).hide();
                  }

                  // TODO: enable save button
               } catch (err) {
                  // TODO: enable save button
               }
            } else {
               $$(ids.numberOfNull).hide();
            }
         }

         /**
          * @method isValid()
          * Verify the common ABField settings are valid before allowing
          * us to create the new field.
          * @return {bool}
          */
         isValid() {
            var ids = this.ids;
            var isValid = $$(ids.component).validate(),
               colName = this.formValues()["columnName"];

            setTimeout(() => {
               $$(ids.component).clearValidation();
            }, 500);

            // validate reserve column names
            var FC = this.FieldClass();
            if (!FC) {
               this.AB.notify.developer(
                  new Error("Unable to resolve FieldClass"),
                  {
                     context: "ABFieldProperty: isValid()",
                     base: this.ids.component,
                  }
               );
            }

            // columnName should not be one of the reserved names:
            if (FC?.reservedNames.indexOf(colName.trim().toLowerCase()) > -1) {
               this.markInvalid("columnName", L("This is a reserved name"));
               isValid = false;
            }

            // columnName should not be in use by other fields on this object
            // get All fields with matching colName
            var fieldColName = this.CurrentObject?.fields(
               (f) => f.columnName == colName
            );
            // ignore current edit field
            if (this._CurrentField) {
               fieldColName = fieldColName.filter(
                  (f) => f.id != this._CurrentField.id
               );
            }
            // if any more matches, this is a problem
            if (fieldColName.length > 0) {
               this.markInvalid(
                  "columnName",
                  L("This column name is in use by another field ({0})", [
                     fieldColName.label,
                  ])
               );
               isValid = false;
            }

            return isValid;
         }

         markInvalid(name, message) {
            $$(this.ids.component).markInvalid(name, message);
         }

         /**
          * @function populate
          * populate the property form with the given ABField instance provided.
          * @param {ABField} field
          *        The ABFieldXXX instance that we are editing the settings for.
          */
         populate(field) {
            var ids = this.ids;
            this._CurrentField = field;

            // these columns are located on the base ABField object
            ["label", "columnName"].forEach((c) => {
               $$(ids[c]).setValue?.(field[c]);
            });
            $$(ids.fieldDescription).setValue(field.fieldDescription());

            // the remaining columns are located in .settings
            Object.keys(ids).forEach((c) => {
               if (typeof field.settings[c] != "undefined") {
                  $$(ids[c])?.setValue?.(field.settings[c]);
               }
            });
            $$(ids.label).setValue(field.label);
            $$(ids.columnName).setValue(field.columnName);
            $$(ids.showIcon).setValue(field.settings.showIcon);
            $$(ids.required).setValue(field.settings.required);
            $$(ids.unique).setValue(field.settings.unique);

            if (field.settings && field.settings.validationRules) {
               var rules = field.settings.validationRules;
               if (typeof rules == "string") {
                  try {
                     rules = JSON.parse(rules);
                  } catch (e) {
                     this.AB.notify.builder(e, {
                        context: `ABField[${field.id}][${field.name}]: has invalid validationRules`,
                        validationRules: field.settings.validationRules,
                     });
                     // so ... now what?
                     rules = [];
                  }
               }
               (rules || []).forEach((settings) => {
                  field.addValidation(ids, settings);
               });
               $$(ids.addValidation).define(
                  "badge",
                  rules.length !== 0 ? rules.length : null
               );
               $$(ids.addValidation).refresh();
            }
         }

         requiredOnChange() {
            // Sub Class should overwrite this if it is necessary.
         }

         // show() {
         //    super.show();
         //    // AppList.show();
         // }

         /*
          * @function values
          *
          * return the values for this form.
          * @return {obj}
          */
         values() {
            var ids = this.ids;

            var settings = $$(ids.component).getValues();
            if ($$(ids.filterComplex)) {
               var validationRules = [];
               var forms = $$(ids.filterComplex).queryView(
                  { view: "form", css: "abValidationForm" },
                  "all"
               );
               forms.forEach((form) => {
                  var rules = form
                     .queryView({ view: "querybuilder" })
                     .getValue();
                  var invalidMessage = form
                     .queryView({ name: "invalidMessage" })
                     .getValue();
                  var validationObj = {
                     invalidMessage: invalidMessage,
                     rules: rules,
                  };
                  validationRules.push(validationObj);
               });
               settings.validationRules = JSON.stringify(validationRules);
            }

            var FC = this.FieldClass();

            // convert flat settings into our ABField value format:
            var values = FC.editorValues(settings);

            values.key = FC.defaults().key;

            return values;
         }
      };
   }
   return myClass;
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/dataFields/ABFieldConnect.js":
/*!************************************************************************!*\
  !*** ./src/rootPages/Designer/properties/dataFields/ABFieldConnect.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ABField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ABField */ "./src/rootPages/Designer/properties/dataFields/ABField.js");
/*
 * ABFieldNumber
 * A Property manager for our ABFieldNumber.
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const uiConfig = AB.Config.uiSettings();

   var ABField = (0,_ABField__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = ABField.L();

   class ABFieldConnectProperty extends ABField {
      constructor() {
         super("properties_abfield_connect", {
            linkObject: "",
            objectCreateNew: "",

            fieldLink: "",
            fieldLink2: "",
            linkType: "",
            linkViaType: "",
            fieldLinkVia: "",
            fieldLinkVia2: "",

            link1: "",
            link2: "",

            isCustomFK: "",
            indexField: "",
            indexField2: "",

            connectDataPopup: "",
         });
      }

      ui() {
         var FC = this.FieldClass();
         var ids = this.ids;
         return super.ui([
            {
               view: "richselect",
               label: L("Connected to:"),
               id: ids.linkObject,
               disallowEdit: true,
               name: "linkObject",
               labelWidth: uiConfig.labelWidthLarge,
               placeholder: L("Select object"),
               options: [],
               // select: true,
               // height: 140,
               // template: "<div class='ab-new-connectObject-list-item'>#label#</div>",
               on: {
                  onChange: (newV, oldV) => {
                     this.selectObjectTo(newV, oldV);
                  },
               },
            },
            /*
            // NOTE: leave out of v2 until someone asks for it back.

            {
               view: "button",
               css: "webix_primary",
               id: ids.objectCreateNew,
               disallowEdit: true,
               value: L(
                  "Connect to new Object"
               ),
               click: () => {
                  ABFieldConnectComponent.logic.clickNewObject();
               },
            },
            */
            {
               view: "layout",
               id: ids.link1,
               hidden: true,
               cols: [
                  {
                     id: ids.fieldLink,
                     view: "label",
                     width: 300,
                  },
                  {
                     id: ids.linkType,
                     disallowEdit: true,
                     name: "linkType",
                     view: "richselect",
                     value: FC.defaultValues().linkType,
                     width: 95,
                     options: [
                        {
                           id: "many",
                           value: L("many"),
                        },
                        {
                           id: "one",
                           value: L("one"),
                        },
                     ],
                     on: {
                        onChange: (newValue, oldValue) => {
                           this.selectLinkType(newValue, oldValue);
                        },
                     },
                  },
                  {
                     id: ids.fieldLinkVia,
                     view: "label",
                     label: L("<b>[Select Object]</b> entry."),
                     width: 200,
                  },
               ],
            },
            {
               view: "layout",
               id: ids.link2,
               hidden: true,
               cols: [
                  {
                     id: ids.fieldLinkVia2,
                     view: "label",
                     label: L(
                        "Each <b>[Select object]</b> entry connects with"
                     ),
                     width: 300,
                  },
                  {
                     id: ids.linkViaType,
                     name: "linkViaType",
                     disallowEdit: true,
                     view: "richselect",
                     value: FC.defaultValues().linkViaType,
                     width: 95,
                     options: [
                        {
                           id: "many",
                           value: L("many"),
                        },
                        {
                           id: "one",
                           value: L("one"),
                        },
                     ],
                     on: {
                        onChange: (newV, oldV) => {
                           this.selectLinkViaType(newV, oldV);
                        },
                     },
                  },
                  {
                     id: ids.fieldLink2,
                     view: "label",
                     width: 200,
                  },
               ],
            },
            {
               name: "linkColumn",
               view: "text",
               hidden: true,
            },
            {
               name: "isSource",
               view: "text",
               hidden: true,
            },
            {
               id: ids.isCustomFK,
               name: "isCustomFK",
               view: "checkbox",
               disallowEdit: true,
               labelWidth: 0,
               labelRight: L("Custom Foreign Key"),
               hidden: true,
               on: {
                  onChange: () => {
                     this.checkCustomFK();
                  },
               },
            },
            {
               id: ids.indexField,
               name: "indexField",
               view: "richselect",
               disallowEdit: true,
               hidden: true,
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Index Field:"),
               placeholder: L("Select index field"),
               options: [],
               // on: {
               //    onChange: () => {
               //       ABFieldConnectComponent.logic.updateColumnName();
               //    }
               // }
            },
            {
               id: ids.indexField2,
               name: "indexField2",
               view: "richselect",
               disallowEdit: true,
               hidden: true,
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Index Field:"),
               placeholder: L("Select index field"),
               options: [],
            },
         ]);
      }

      clear() {
         super.clear();
         $$(this.ids.linkObject).setValue(
            this.FieldClass().defaultValues().linkObject
         );
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("connectObject");
      }

      isValid() {
         var ids = this.ids;
         var isValid = super.isValid();

         // validate require select linked object
         var selectedObjId = $$(ids.linkObject).getValue();
         if (!selectedObjId) {
            this.markInvalid("linkObject", L("Select an object"));
            // webix.html.addCss($$(ids.linkObject).$view, "webix_invalid");
            isValid = false;
         } else {
            console.error("!!! Don't forget to refactor this .removeCss()");
            webix.html.removeCss($$(ids.linkObject).$view, "webix_invalid");
         }

         return isValid;
      }

      // populate(field) {
      //    var ids = this.ids;
      //    super.populate(field);
      // }

      selectLinkViaType(newValue /*, oldValue */) {
         let labelEntry = L("entry");
         let labelEntries = L("entries");

         let $fieldLink2 = $$(this.ids.fieldLink2);

         let message = $fieldLink2.getValue() || "";

         if (newValue == "many") {
            message = message.replace(labelEntry, labelEntries);
         } else {
            message = message.replace(labelEntries, labelEntry);
         }
         $fieldLink2.define("label", message);
         $fieldLink2.refresh();

         this.updateCustomIndex();
      }

      show() {
         super.show();

         this.populateSelect(false);
         var ids = this.ids;

         // show current object name
         $$(ids.fieldLink).setValue(
            L("Each <b>{0}</b> entry connects with", [
               this.CurrentObject?.label,
            ])
         );
         $$(ids.fieldLink2).setValue(
            L("<b>{0}</b> entry.", [this.CurrentObject?.label])
         );

         // keep the column name element to use when custom index is checked
         // ABFieldConnectComponent._$columnName = $$(pass_ids.columnName);
         this.updateCustomIndex();
      }

      ////

      checkCustomFK() {
         var ids = this.ids;
         $$(ids.indexField).hide();
         $$(ids.indexField2).hide();

         let isChecked = $$(ids.isCustomFK).getValue();
         if (isChecked) {
            let menuItems = $$(ids.indexField).getList().config.data;
            if (menuItems && menuItems.length) {
               $$(ids.indexField).show();
            }

            let menuItems2 = $$(ids.indexField2).getList().config.data;
            if (menuItems2 && menuItems2.length) {
               $$(ids.indexField2).show();
            }
         }
      }

      //// NOTE: This feature wasn't currently working as of our Transition to
      //// v2, so we decided to leave it out until someone requested for this
      //// to come back.
      /*
      clickNewObject() {
         if (!App.actions.addNewObject) return;

         async.series(
            [
               function (callback) {
                  App.actions.addNewObject(false, callback); // pass false because after it is created we do not want it to select it in the object list
               },
               function (callback) {
                  populateSelect(true, callback); // pass true because we want it to select the last item in the list that was just created
               },
            ],
            function (err) {
               if (err) {
                  App.AB.error(err);
               }
               // console.log('all functions complete')
            }
         );
      }
      */

      /**
       * @method populateSelect()
       * Ensure that the linkObject list is populated with the ABObjects in
       * our currentApplication.
       * NOTE: in v1 we had an option to [create new object] from this
       * Property panel. If we did, then the @populate & @callback params
       * were used to add the new object and default select it in our
       * panel.
       *
       * In v2: we haven't implement the [create new object] option ... yet.
       *
       * @param {bool} populate
       *        Should we default choose the last entry in our list? It
       *        would have been the one we just created.
       * @param {fn} callback
       *        The .clickNewObject() routine used callbacks to tell when
       *        a task was complete. This is that callback.
       */
      populateSelect(/* populate, callback */) {
         var options = [];
         // if an ABApplication is set then load in the related objects
         var application = this.CurrentApplication;
         if (application) {
            application.objectsIncluded().forEach((o) => {
               options.push({ id: o.id, value: o.label });
            });
         } else {
            // else load in all the ABObjects
            this.AB.objects().forEach((o) => {
               options.push({ id: o.id, value: o.label });
            });
         }

         // sort by object's label  A -> Z
         options.sort((a, b) => {
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
         });

         var ids = this.ids;
         var $linkObject = $$(ids.linkObject);
         $linkObject.define("options", options);
         $linkObject.refresh();
         /*
         // NOTE: not implemented yet ...
         if (populate != null && populate == true) {
            $linkObject.setValue(options[options.length - 1].id);
            $linkObject.refresh();
            var selectedObj = $linkObject
               .getList()
               .getItem(options[options.length - 1].id);
            if (selectedObj) {
               var selectedObjLabel = selectedObj.value;
               $$(ids.fieldLinkVia).setValue(
                  L("<b>{0}</b> entry.", [selectedObjLabel])
               );
               $$(ids.fieldLinkVia2).setValue(
                  L("Each <b>{0}</b> entry connects with", [selectedObjLabel])
               );
               $$(ids.link1).show();
               $$(ids.link2).show();
            }
            callback?.();
         }
         */
      }

      selectLinkType(newValue /*, oldValue */) {
         let labelEntry = L("entry");
         let labelEntries = L("entries");
         let $field = $$(this.ids.fieldLinkVia);

         let message = $field.getValue() || "";

         if (newValue == "many") {
            message = message.replace(labelEntry, labelEntries);
         } else {
            message = message.replace(labelEntries, labelEntry);
         }
         $field.define("label", message);
         $field.refresh();

         this.updateCustomIndex();
      }

      selectObjectTo(newValue, oldValue) {
         var ids = this.ids;

         if (!newValue) {
            $$(ids.link1).hide();
            $$(ids.link2).hide();
         }
         if (newValue == oldValue || newValue == "") return;

         let selectedObj = $$(ids.linkObject).getList().getItem(newValue);
         if (!selectedObj) return;

         let selectedObjLabel = selectedObj.value;
         $$(ids.fieldLinkVia).setValue(
            L("<b>{0}</b> entry.", [selectedObjLabel])
         );
         $$(ids.fieldLinkVia2).setValue(
            L("Each <b>{0}</b> entry connects with", [selectedObjLabel])
         );
         $$(ids.link1).show();
         $$(ids.link2).show();

         this.updateCustomIndex();
      }

      updateCustomIndex() {
         var ids = this.ids;
         let linkObjectId = $$(ids.linkObject).getValue();
         let linkType = $$(ids.linkType).getValue();
         let linkViaType = $$(ids.linkViaType).getValue();

         let sourceObject = null; // object stores index column
         let linkIndexes = null; // the index fields of link object M:N

         $$(ids.indexField2).define("options", []);
         $$(ids.indexField2).refresh();

         let link = `${linkType}:${linkViaType}`;
         // 1:1
         // 1:M
         if (["one:one", "one:many"].indexOf(link) > -1) {
            sourceObject = this.AB.objectByID(linkObjectId);
         }
         // M:1
         else if (link == "many:one") {
            sourceObject = this.CurrentObject;
         }
         // M:N
         else if (link == "many:many") {
            sourceObject = this.CurrentObject;

            let linkObject = this.AB.objectByID(linkObjectId);

            // Populate the second index fields
            let linkIndexFields = [];
            linkIndexes = linkObject.indexes((idx) => idx.unique);
            (linkIndexes || []).forEach((idx) => {
               (idx.fields || []).forEach((f) => {
                  if (
                     (!f ||
                        !f.settings ||
                        !f.settings.required ||
                        linkIndexFields.filter((opt) => opt.id == f.id)
                           .length) &&
                     f.key != "AutoIndex" &&
                     f.key != "combined"
                  )
                     return;

                  linkIndexFields.push({
                     id: f.id,
                     value: f.label,
                  });
               });
            });
            $$(ids.indexField2).define("options", linkIndexFields);
            $$(ids.indexField2).refresh();
         }

         $$(ids.indexField).hide();
         $$(ids.indexField2).hide();

         if (!sourceObject) {
            $$(ids.isCustomFK).hide();
            return;
         }

         let indexes = sourceObject.indexes((idx) => idx.unique);
         if (
            (!indexes || indexes.length < 1) &&
            (!linkIndexes || linkIndexes.length < 1)
         ) {
            $$(ids.isCustomFK).hide();
            $$(ids.indexField).define("options", []);
            $$(ids.indexField).refresh();
            return;
         }

         let indexFields = [];
         (indexes || []).forEach((idx) => {
            (idx.fields || []).forEach((f) => {
               if (
                  (!f ||
                     !f.settings ||
                     !f.settings.required ||
                     indexFields.filter((opt) => opt.id == f.id).length) &&
                  f.key != "AutoIndex" &&
                  f.key != "combined"
               )
                  return;

               indexFields.push({
                  id: f.id,
                  value: f.label,
                  field: f,
               });
            });
         });
         $$(ids.indexField).define("options", indexFields);
         $$(ids.indexField).refresh();

         if (indexFields && indexFields.length) {
            $$(ids.isCustomFK).show();
         }

         this.checkCustomFK();
      }
   }

   return ABFieldConnectProperty;
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/dataFields/ABFieldList.js":
/*!*********************************************************************!*\
  !*** ./src/rootPages/Designer/properties/dataFields/ABFieldList.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ABField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ABField */ "./src/rootPages/Designer/properties/dataFields/ABField.js");
/*
 * ABFieldList
 * A Property manager for our ABFieldList.
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   // const uiConfig = AB.Config.uiSettings();

   var ABField = (0,_ABField__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = ABField.L();

   const ABFieldSelectivity = AB.Class.ABFieldManager.fieldByKey("selectivity");

   /**
    * ABFieldListProperty
    *
    * Defines the UI Component for this Data Field.  The ui component is responsible
    * for displaying the properties editor, populating existing data, retrieving
    * property values, etc.
    */
   class ABFieldListProperty extends ABField {
      constructor() {
         super("properties_abfield_list", {
            isMultiple: "",
            hasColors: "",
            default: "",
            multipleDefault: "",
            options: "",
            colorboard: "",
         });

         this.colors = [
            ["#F44336", "#E91E63", "#9C27B0", "#673AB7"],
            ["#3F51B5", "#2196F3", "#03A9F4", "#00BCD4"],
            ["#009688", "#4CAF50", "#8BC34A", "#CDDC39"],
            ["#FFEB3B", "#FFC107", "#FF9800", "#FF5722"],
            ["#795548", "#9E9E9E", "#607D8B", "#000000"],
         ];
         // {array}
         // contains the color hex definitions of the list options when they
         // are displayed.

         this._originalOptions = [];
         // {array} [ option.id, ... ]
         // An array of the original options definitions before editing
      }

      ui() {
         var ids = this.ids;

         return super.ui([
            {
               view: "checkbox",
               name: "isMultiple",
               disallowEdit: true,
               id: ids.isMultiple,
               labelRight: L("Multiselect"),
               labelWidth: 0,
               value: false,
               on: {
                  onChange: (newV /* , oldV */) => {
                     if (newV == true) {
                        $$(ids.default).hide();
                        $$(ids.multipleDefault).show();
                     } else {
                        $$(ids.default).show();
                        $$(ids.multipleDefault).hide();
                     }

                     this.updateDefaultList();
                  },
               },
            },
            {
               view: "checkbox",
               name: "hasColors",
               id: ids.hasColors,
               labelRight: L("Customize Colors"),
               labelWidth: 0,
               value: false,
               on: {
                  onChange: (newV, oldV) => {
                     if (newV == oldV) return false;

                     this.toggleColorControl(newV);
                  },
               },
            },
            {
               view: "label",
               label: `<b>${L("Options")}</b>`,
            },
            {
               id: ids.options,
               name: "options",
               css: "padList",
               view: this.AB._App.custom.editlist.view,
               template:
                  "<div style='position: relative;'><i class='ab-color-picker fa fa-lg fa-chevron-circle-down' style='color:#hex#'></i> #value#<i class='ab-new-field-remove fa fa-remove' style='position: absolute; top: 7px; right: 7px;'></i></div>",
               autoheight: true,
               drag: true,
               editable: true,
               hex: "",
               editor: "text",
               editValue: "value",
               onClick: {
                  "ab-new-field-remove": (e, itemId /*, trg */) => {
                     // Remove option item
                     // check that item is in saved data already
                     var matches = (this._originalOptions || []).filter((x) => {
                        return x.id == itemId;
                     })[0];
                     if (matches) {
                        // Ask the user if they want to remove option
                        webix
                           .confirm({
                              title: L("Delete Option"),
                              text: L(
                                 "All exisiting entries with this value will be cleared. Are you sure you want to delete this option?"
                              ),
                              type: "confirm-warning",
                           })
                           .then(() => {
                              // This is the "Yes"/"OK" click

                              // store the item that will be deleted for the save action

                              this._CurrentField.pendingDeletions =
                                 this._CurrentField.pendingDeletions || [];
                              this._CurrentField.pendingDeletions.push(itemId);
                              $$(ids.options).remove(itemId);
                           });
                     }
                     // If this item did not be saved, then remove from list
                     else {
                        $$(ids.options).remove(itemId);
                     }
                     // NOTE: the edit list can be in process of showing the editor here.
                     // .editCancel() only works if it is already being shown.  So we do
                     // a little timeout to allow it to technically show, but then cancel it

                     // setTimeout(() => {
                     //    $$(ids.options).editCancel();
                     // }, 0);

                     // e.stopPropagation();
                     return false;
                  },
                  "ab-color-picker": (e, itemID, trg) => {
                     webix
                        .ui({
                           id: ids.colorboard,
                           view: "popup",
                           body: {
                              view: "colorboard",
                              type: "classic",
                              id: "color",
                              width: 125,
                              height: 150,
                              palette: this.colors,
                              left: 125,
                              top: 150,
                              on: {
                                 onSelect: (hex) => {
                                    var vals = $$(ids.options).getItem(itemID);
                                    vals.hex = hex;
                                    $$(ids.options).updateItem(itemID, vals);
                                    $$(ids.colorboard).hide();
                                 },
                              },
                           },
                        })
                        .show(trg, { x: -7 });
                     return false;
                  },
               },
               on: {
                  onAfterAdd: () => {
                     this.updateDefaultList();
                  },
                  onAfterEditStop: () => {
                     this.updateDefaultList();
                  },
                  onAfterDelete: () => {
                     this.updateDefaultList();
                  },
                  onAfterRender: () => {
                     this.toggleColorControl($$(ids.hasColors).getValue());
                  },
               },
            },
            {
               view: "button",
               css: "webix_primary",
               value: L("Add new option"),
               click: () => {
                  let itemId = webix.uid();
                  let nextHex = this.getNextHex();
                  let optionElem = $$(ids.options);
                  if (!optionElem) return;

                  optionElem.add(
                     {
                        id: itemId,
                        value: "",
                        hex: nextHex,
                        isNew: true,
                     },
                     optionElem.count()
                  );

                  if (optionElem.exists(itemId)) optionElem.edit(itemId);
               },
            },
            {
               id: ids.default,
               placeholder: L("Select Default"),
               name: "default",
               view: "richselect",
               label: L("Default"),
            },
            {
               id: ids.multipleDefault,
               name: "multipleDefault",
               view: "forminput",
               labelWidth: 0,
               height: 36,
               borderless: true,
               hidden: true,
               body: {
                  view: this.AB._App.custom.focusabletemplate.view,
                  css: "customFieldCls",
                  borderless: true,
                  template:
                     `<label style="width: 80px;text-align: left;line-height:32px;" class="webix_inp_label">${L(
                        "Default"
                     )}</label>` +
                     '<div style="margin-left: 80px; height: 36px;" class="list-data-values form-entry"></div>',
               },
            },
         ]);
      }

      clear() {
         var ids = this.ids;
         $$(ids.isMultiple).setValue(0);
         $$(ids.hasColors).setValue(0);
         $$(ids.options).clearAll();

         $$(ids.default).define("options", []);
         $$(ids.default).setValue(this.FieldClass()?.defaultValues()?.default);

         var domNode = $$(ids.multipleDefault).$view.querySelector(
            ".list-data-values"
         );
         if (domNode && domNode.selectivity) {
            domNode.selectivity.setData([]);
         }
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("list");
      }

      getNextHex() {
         var usedColors = [];
         $$(this.ids.options)?.data.each(function (item) {
            usedColors.push(item.hex);
         });
         var allColors = [];
         this.colors.forEach((c) => {
            c?.forEach?.((j) => {
               allColors.push(j);
            });
         });
         var newHex = "#3498db";
         for (var i = 0; i < allColors.length; i++) {
            if (usedColors.indexOf(allColors[i]) == -1) {
               newHex = allColors[i];
               break;
            }
         }
         return newHex;
      }

      populate(field) {
         super.populate(field);

         // store the options that currently exisit to compare later for deletes
         this._originalOptions = field?.settings?.options ?? [];

         // set options to webix list
         let opts = [];

         // we need to access the fields -> object -> model to run updates on save (may be refactored later)
         this._CurrentField = field;
         if (this._CurrentField) {
            // empty this out so we don't try to delete already deleted options (or delete options that we canceled before running)
            this._CurrentField.pendingDeletions = [];
            opts = (field?.settings.options || []).map((opt) => {
               return {
                  id: opt.id,
                  value: opt.text,
                  hex: opt.hex,
                  translations: opt.translations,
               };
            });
         }
         var $opts = $$(this.ids.options);
         $opts.parse(opts);
         $opts.refresh();

         setTimeout(() => {
            this.updateDefaultList();
         }, 10);
      }

      toggleColorControl(value) {
         var colorPickers = $$(this.ids.options)?.$view.querySelectorAll(
            ".ab-color-picker"
         );
         colorPickers?.forEach(function (itm) {
            if (value == 1) itm.classList.remove("hide");
            else itm.classList.add("hide");
         });
      }

      updateDefaultList() {
         var ids = this.ids;
         var settings = this._CurrentField?.settings;

         var optList = $$(ids.options)
            .find({})
            .map(function (opt) {
               return {
                  id: opt.id,
                  value: opt.value,
                  hex: opt.hex,
               };
            });

         if ($$(ids.isMultiple).getValue()) {
            // Multiple default selector
            var domNode = $$(ids.multipleDefault).$view.querySelector(
               ".list-data-values"
            );
            if (!domNode) return false;

            // TODO : use to render selectivity to set default values
            let selectivityRender = new ABFieldSelectivity(
               {
                  settings: {},
               },
               {},
               {}
            );

            selectivityRender.selectivityRender(domNode, {
               multiple: true,
               data: settings?.multipleDefault ?? [],
               placeholder: L("Select items"),
               items: optList.map(function (opt) {
                  return {
                     id: opt.id,
                     text: opt.value,
                     hex: opt.hex,
                  };
               }),
            });
            domNode.addEventListener("change", function (e) {
               if (e.value.length) {
                  $$(ids.multipleDefault).define("required", false);
               } else if (
                  $$(ids.multipleDefault)
                     .$view.querySelector(".webix_inp_label")
                     .classList.contains("webix_required")
               ) {
                  $$(ids.multipleDefault).define("required", true);
               }
            });
         } else {
            // Single default selector
            $$(ids.default).define("options", optList);
            if (settings?.default) $$(ids.default).setValue(settings.default);

            $$(ids.default).refresh();
         }
      }

      /*
       * @function requiredOnChange
       *
       * The ABField.definitionEditor implements a default operation
       * to look for a default field and set it to a required field
       * if the field is set to required
       *
       * if you want to override that functionality, implement this fn()
       *
       * @param {string} newVal	The new value of label
       * @param {string} oldVal	The previous value
       */
      // requiredOnChange: (newVal, oldVal, ids) => {

      // 	// when require number, then default value needs to be reqired
      // 	$$(ids.default).define("required", newVal);
      // 	$$(ids.default).refresh();

      // 	if ($$(ids.multipleDefault).$view.querySelector(".webix_inp_label")) {
      // 		if (newVal) {
      // 			$$(ids.multipleDefault).define("required", true);
      // 			$$(ids.multipleDefault).$view.querySelector(".webix_inp_label").classList.add("webix_required");
      // 		} else {
      // 			$$(ids.multipleDefault).define("required", false);
      // 			$$(ids.multipleDefault).$view.querySelector(".webix_inp_label").classList.remove("webix_required");
      // 		}
      // 	}

      // },

      values() {
         var values = super.values();

         var ids = this.ids;

         // Get options list from UI, then set them to settings
         values.settings.options = [];
         $$(ids.options).data.each((opt) => {
            let optionId = opt.id;

            // If it is a new option item, then .id uses string instead of UID
            // for support custom index
            if (
               opt.isNew &&
               opt.value &&
               !values.settings.options.filter((o) => o.id == opt.value).length
            ) {
               optionId = opt.value;
            }

            values.settings.options.push({
               id: optionId,
               text: opt.value,
               hex: opt.hex,
               translations: opt.translations,
            });
         });

         // Un-translate options list
         values.settings.options.forEach((opt) => {
            this.AB.Multilingual.unTranslate(opt, opt, ["text"]);
         });

         // Set multiple default value
         values.settings.multipleDefault = [];
         var domNode = $$(ids.multipleDefault).$view.querySelector(
            ".list-data-values"
         );
         if (domNode && domNode.selectivity) {
            values.settings.multipleDefault =
               domNode.selectivity.getData() || [];
         }

         return values;
      }
   }

   return ABFieldListProperty;
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/dataFields/ABFieldNumber.js":
/*!***********************************************************************!*\
  !*** ./src/rootPages/Designer/properties/dataFields/ABFieldNumber.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ABField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ABField */ "./src/rootPages/Designer/properties/dataFields/ABField.js");
/*
 * ABFieldNumber
 * A Property manager for our ABFieldNumber.
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const uiConfig = AB.Config.uiSettings();

   var ABField = (0,_ABField__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = ABField.L();

   class ABFieldNumberProperty extends ABField {
      constructor() {
         super("properties_abfield_number", {
            default: "",
            decimalOptions: "",
            typeDecimalPlaces: "",
            typeRounding: "",
            validation: "",
            validateMinimum: "",
            validateMaximum: "",

            defaultCheckbox: "",
            validateView: "",
            typeDecimals: "",
            typeFormat: "",
            typeThousands: "",
         });
      }

      ui() {
         var FC = this.FieldClass();
         var ids = this.ids;
         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Default Value:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.defaultCheckbox,
                     view: "checkbox",
                     width: 30,
                     value: 0,
                     on: {
                        onChange: (newv) => {
                           this.checkboxDefaultValue(newv);
                        },
                        onAfterRender: () => {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.default,
                     view: "text",
                     name: "default",
                     placeholder: L("Enter default value"),
                     disabled: true,
                     labelWidth: uiConfig.labelWidthXLarge,
                     on: {
                        onChange: (newVal, oldVal) => {
                           this.numValidation(newVal, oldVal, ids.default);
                        },
                        onAfterRender: () => {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Format:" + " "),
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.typeFormat,
                     view: "richselect",
                     name: "typeFormat",
                     value: "none",
                     labelWidth: uiConfig.labelWidthXLarge,
                     options: FC.formatList(),
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Decimals:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.typeDecimals,
                     view: "segmented",
                     name: "typeDecimals",
                     disallowEdit: true,
                     labelWidth: uiConfig.labelWidthXLarge,
                     value: "none",
                     options: FC.delimiterList(),
                     on: {
                        onChange: (newVal /*, oldVal */) => {
                           this.segmentedDecimals(newVal);
                        },
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               // show these options as sub optionsof our "typeDecimals"
               id: ids.decimalOptions,
               hidden: true,
               disabled: true,
               rows: [
                  {
                     cols: [
                        { width: 20 },
                        {
                           view: "label",
                           label: L("Places:") + " ",
                           align: "right",
                           width: 100,
                        },
                        {
                           id: ids.typeDecimalPlaces,
                           view: "counter",
                           disallowEdit: true,
                           name: "typeDecimalPlaces",
                           width: 102,
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                        { width: 20 },
                        {
                           view: "label",
                           label: L("Rounding:") + " ",
                           align: "right",
                           width: 100,
                        },
                        {
                           id: ids.typeRounding,
                           view: "richselect",
                           name: "typeRounding",
                           value: "none",
                           vertical: true,
                           options: [
                              { id: "none", value: L("Default") },
                              {
                                 id: "roundUp",
                                 value: L("Round Up"),
                              },
                              {
                                 id: "roundDown",
                                 value: L("Round Down"),
                              },
                           ],
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Thousands:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.typeThousands,
                     view: "segmented",
                     name: "typeThousands",
                     value: "none",
                     options: FC.delimiterList(),
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Validation:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     view: "switch",
                     id: ids.validation,
                     name: "validation",
                     value: 0,
                     width: 55,
                     on: {
                        onChange: (newVal) => {
                           this.switchValidation(newVal);
                        },

                        onAfterRender: () => {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               id: ids.validateView,
               hidden: true,
               disabld: true,
               rows: [
                  {
                     cols: [
                        { width: 20 },
                        {
                           view: "label",
                           label: L("Minimum:") + " ",
                           align: "right",
                           width: 100,
                        },
                        {
                           view: "text",
                           id: ids.validateMinimum,
                           name: "validateMinimum",
                           placeholder: L("Minimum Number"),
                           on: {
                              onChange: (newVal, oldVal) => {
                                 this.numValidation(
                                    newVal,
                                    oldVal,
                                    ids.validateMinimum
                                 );
                              },

                              onAfterRender: () => {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
                  {
                     cols: [
                        { width: 20 },
                        {
                           view: "label",
                           label: L("Maximum:") + " ",
                           align: "right",
                           width: 100,
                        },
                        {
                           view: "text",
                           id: ids.validateMaximum,
                           name: "validateMaximum",
                           placeholder: L("Maximum Number"),
                           on: {
                              onChange: (newVal, oldVal) => {
                                 this.numValidation(
                                    newVal,
                                    oldVal,
                                    ids.validateMaximum
                                 );
                              },

                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
         ]);
      }

      numValidation(newVal, oldVal, id) {
         // Validate number
         if (!new RegExp("^[0-9.]*$").test(newVal)) {
            $$(id).setValue(oldVal || "");
         }
      }

      checkboxDefaultValue(state) {
         if (state == 0) {
            $$(this.ids.default).disable();
            $$(this.ids.default).setValue("");
         } else {
            $$(this.ids.default).enable();
         }
      }

      segmentedDecimals(val) {
         if (val == "none") {
            $$(this.ids.decimalOptions).disable();
            $$(this.ids.decimalOptions).hide();
         } else {
            $$(this.ids.decimalOptions).enable();
            $$(this.ids.decimalOptions).show();
         }
      }

      switchValidation(state) {
         if (state) {
            $$(this.ids.validateView).enable();
            $$(this.ids.validateView).show();
         } else {
            $$(this.ids.validateView).disable();
            $$(this.ids.validateView).hide();
         }
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("number");
      }

      isValid() {
         var isValid = super.isValid();

         var values = this.formValues();

         var defaultValue = values["default"];
         var fDefault = 0;
         if (defaultValue !== "") {
            fDefault = parseFloat(defaultValue);
         }

         // if required then default value must be set:
         var required = values["required"];
         if (required) {
            if (defaultValue === "") {
               this.markInvalid(
                  "default",
                  L("If a field is required, you must set a default value.")
               );
               isValid = false;
            }
         }

         // Default Value must be within any min / max value set.
         if (values["validation"]) {
            var minValue = values["validateMinimum"];
            var maxValue = values["validateMaximum"];
            var fmin = 0;
            var fmax = 0;

            if (minValue !== "") {
               fmin = parseFloat(minValue);
            }

            if (maxValue !== "") {
               fmax = parseFloat(maxValue);
            }

            // Default Value must be within any min / max value set.
            if (defaultValue !== "") {
               if (minValue !== "") {
                  if (fDefault < fmin) {
                     this.markInvalid(
                        "default",
                        L(
                           "default value must be within any min / max value setting"
                        )
                     );
                     isValid = false;
                  }
               }

               if (maxValue !== "") {
                  if (fDefault > fmax) {
                     this.markInvalid(
                        "default",
                        L(
                           "default value must be within any min / max value setting"
                        )
                     );
                     isValid = false;
                  }
               }
            }

            // Min / Max values must be appropriate: min <= max
            if (minValue != "" && maxValue != "") {
               if (fmin > fmax) {
                  this.markInvalid(
                     "validateMinimum",
                     L("minimum value must be <= maximum value")
                  );
                  this.markInvalid(
                     "validateMaximum",
                     L("maximum value must be >= minimum value")
                  );
                  isValid = false;
               }
            }
         }

         return isValid;
      }

      populate(field) {
         var ids = this.ids;
         super.populate(field);

         if (field.settings.default === "") {
            $$(ids.defaultCheckbox).setValue(0);
         } else {
            $$(ids.defaultCheckbox).setValue(1);
         }

         if (field.settings.validation === 0) {
            $$(ids.validateView).hide();
         } else {
            $$(ids.validateView).show();
         }

         if (field.settings.typeDecimals === "none") {
            $$(ids.decimalOptions).hide();
            $$(ids.decimalOptions).disable();
         } else {
            $$(ids.decimalOptions).enable();
            $$(ids.decimalOptions).show();
            $$(ids.typeDecimalPlaces).enable();
            $$(ids.typeDecimalPlaces).show();
            $$(ids.typeRounding).enable();
            $$(ids.typeRounding).show();
         }
      }
   }

   return ABFieldNumberProperty;
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/dataFields/ABFieldString.js":
/*!***********************************************************************!*\
  !*** ./src/rootPages/Designer/properties/dataFields/ABFieldString.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ABField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ABField */ "./src/rootPages/Designer/properties/dataFields/ABField.js");
/*
 * ABField
 * A Generic Property manager for All our fields.
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const uiConfig = AB.Config.uiSettings();

   var ABField = (0,_ABField__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = ABField.L();

   class ABFieldStringProperty extends ABField {
      constructor() {
         super("properties_abfield_string", {
            default: "",
            supportMultilingual: "",

            defaultCheckbox: "",
         });
      }

      ui() {
         var ids = this.ids;
         return super.ui([
            // {
            //    view: "text",
            //    id: ids.default,
            //    name: "default",
            //    labelWidth: uiConfig.labelWidthXLarge,
            //    label: L("Default"),
            //    placeholder: L("Enter default value"),
            //    on: {
            //       onAfterRender() {
            //          AB.ClassUI.CYPRESS_REF(this);
            //       },
            //    },
            // },
            // {
            //    view: "checkbox",
            //    id: ids.supportMultilingual,
            //    name: "supportMultilingual",
            //    disallowEdit: true,
            //    labelRight: L("Support multilingual"),
            //    labelWidth: uiConfig.labelWidthCheckbox,
            //    value: false,
            //    on: {
            //       onAfterRender() {
            //          AB.ClassUI.CYPRESS_REF(this);
            //       },
            //    },
            // },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Default Value:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.defaultCheckbox,
                     view: "checkbox",
                     width: 30,
                     value: 0,
                     on: {
                        onChange: (newv) => {
                           this.checkboxDefaultValue(newv);
                        },
                        onAfterRender: () => {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "text",
                     id: ids.default,
                     name: "default",
                     placeholder: L("Enter default value"),
                     disabled: true,
                     labelWidth: uiConfig.labelWidthXLarge,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               view: "checkbox",
               id: ids.supportMultilingual,
               name: "supportMultilingual",
               disallowEdit: true,
               labelRight: L("Support multilingual"),
               labelWidth: uiConfig.labelWidthCheckbox,
               value: false,
               on: {
                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
            },
         ]);
      }

      checkboxDefaultValue(state) {
         if (state === 0) {
            $$(this.ids.default).disable();
            $$(this.ids.default).setValue("");
         } else {
            $$(this.ids.default).enable();
         }
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("string");
      }

      populate(field) {
         var ids = this.ids;
         super.populate(field);

         if (field.settings.default === "") {
            $$(ids.defaultCheckbox).setValue(0);
         } else {
            $$(ids.defaultCheckbox).setValue(1);
         }
      }
   }

   return ABFieldStringProperty;
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/process/ABProcessParticipant_selectManagersUI.js":
/*!********************************************************************************************!*\
  !*** ./src/rootPages/Designer/properties/process/ABProcessParticipant_selectManagersUI.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * UIProcessParticipant_SelectManagersUI
 *
 * Display the form for entering how to select "managers".
 * this form allows you to choose Roles, or Users directly.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UIProcessParticipant_SelectManagersUI extends UIClass {
      constructor(id) {
         super(id, {
            form: "",
            name: "",
            role: "",
            useRole: "",
            useAccount: "",
            account: "",
         });
      }

      ui(obj = {}) {
         var __Roles = AB.Account.rolesAll().map((r) => {
            return { id: r.id, value: r.name };
         });
         var __Users = AB.Account.userList().map((u) => {
            return { id: u.uuid, value: u.username };
         });

         var ids = this.ids;

         return {
            id: this.ids.component,
            type: "form",
            css: "no-margin",
            rows: [
               {
                  cols: [
                     {
                        view: "checkbox",
                        id: this.ids.useRole,
                        labelRight: L("by Role"),
                        labelWidth: 0,
                        width: 120,
                        value: obj.useRole == "1" ? 1 : 0,
                        click: function (id /*, event */) {
                           if ($$(id).getValue()) {
                              $$(ids.role).enable();
                           } else {
                              $$(ids.role).disable();
                           }
                        },
                        on: {
                           onAfterRender() {
                              UIClass.CYPRESS_REF(this);
                           },
                        },
                     },
                     {
                        id: this.ids.role,
                        view: "multicombo",
                        value: obj.role ? obj.role : 0,
                        disabled: obj.useRole == "1" ? false : true,
                        suggest: {
                           body: {
                              data: __Roles,
                              on: {
                                 //
                                 // TODO: looks like a Webix Bug that has us
                                 // doing all this work.  Let's see if Webix
                                 // can fix this for us.
                                 onAfterRender() {
                                    this.data.each((a) => {
                                       UIClass.CYPRESS_REF(
                                          this.getItemNode(a.id),
                                          `${ids.role}_${a.id}`
                                       );
                                    });
                                 },
                                 onItemClick: function (id) {
                                    var $roleCombo = $$(ids.role);
                                    var currentItems = $roleCombo.getValue();
                                    var indOf = currentItems.indexOf(id);
                                    if (indOf == -1) {
                                       currentItems.push(id);
                                    } else {
                                       currentItems.splice(indOf, 1);
                                    }
                                    $roleCombo.setValue(currentItems);
                                    // var item = this.getItem(id);
                                    // UIClass.CYPRESS_REF(
                                    //    this.getItemNode(item.id),
                                    //    `${ids.role}_${item.id}`
                                    // );
                                 },
                              },
                           },
                        },
                        placeholder: L("Click or type to add role..."),
                        labelAlign: "left",
                        stringResult: false /* returns data as an array of [id] */,
                        on: {
                           onAfterRender: function () {
                              // set data-cy for original field to track clicks to open option list
                              UIClass.CYPRESS_REF(this.getNode(), ids.role);
                           },
                           onChange: (/* newVal, oldVal */) => {
                              // trigger the onAfterRender function from the list so we can add data-cy to dom
                              $$(this.ids.role)
                                 .getList()
                                 .callEvent("onAfterRender");
                           },
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        view: "checkbox",
                        id: this.ids.useAccount,
                        labelRight: L("by Account"),
                        labelWidth: 0,
                        width: 120,
                        value: obj.useAccount == "1" ? 1 : 0,
                        click: function (id /*, event */) {
                           if ($$(id).getValue()) {
                              $$(ids.account).enable();
                           } else {
                              $$(ids.account).disable();
                           }
                        },
                        on: {
                           onAfterRender() {
                              UIClass.CYPRESS_REF(this);
                           },
                        },
                     },
                     {
                        id: this.ids.account,
                        view: "multicombo",
                        value: obj.account ? obj.account : 0,
                        disabled: obj.useAccount == "1" ? false : true,
                        suggest: {
                           body: {
                              data: __Users,
                              on: {
                                 //
                                 // TODO: looks like a Webix Bug that has us
                                 // doing all this work.  Let's see if Webix
                                 // can fix this for us.
                                 onAfterRender() {
                                    this.data.each((a) => {
                                       UIClass.CYPRESS_REF(
                                          this.getItemNode(a.id),
                                          `${ids.account}_${a.id}`
                                       );
                                    });
                                 },
                                 onItemClick: function (id) {
                                    var $accountCombo = $$(ids.account);
                                    var currentItems = $accountCombo.getValue();
                                    var indOf = currentItems.indexOf(id);
                                    if (indOf == -1) {
                                       currentItems.push(id);
                                    } else {
                                       currentItems.splice(indOf, 1);
                                    }
                                    $accountCombo.setValue(currentItems);
                                    // var item = this.getItem(id);
                                    // UIClass.CYPRESS_REF(
                                    //    this.getItemNode(item.id),
                                    //    `${ids.account}_${item.id}`
                                    // );
                                 },
                              },
                           },
                        },
                        labelAlign: "left",
                        placeholder: L("Click or type to add user..."),
                        stringResult: false /* returns data as an array of [id] */,
                        on: {
                           onAfterRender: function () {
                              // set data-cy for original field to track clicks to open option list
                              UIClass.CYPRESS_REF(this.getNode(), ids.account);
                           },
                           onChange: (/* newVal, oldVal */) => {
                              // trigger the onAfterRender function from the list so we can add data-cy to dom
                              $$(this.ids.account)
                                 .getList()
                                 .callEvent("onAfterRender");
                           },
                        },
                     },
                  ],
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         return Promise.resolve();
      }

      // show() {
      //    super.show();
      //    AppList.show();
      // }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */
      values() {
         var obj = {};
         var ids = this.ids;

         if ($$(ids.useRole)) {
            obj.useRole = $$(ids.useRole).getValue();
         }

         if ($$(ids.role) && obj.useRole) {
            obj.role = $$(ids.role).getValue();
            if (obj.role === "--") obj.role = null;
         } else {
            obj.role = null;
         }

         if ($$(ids.useAccount)) {
            obj.useAccount = $$(ids.useAccount).getValue();
         }

         if ($$(ids.account) && obj.useAccount) {
            obj.account = $$(ids.account).getValue(/*{ options: true }*/);
            if (obj.account === "--") obj.account = null;
         } else {
            obj.account = null;
         }

         return obj;
      }
   }

   return UIProcessParticipant_SelectManagersUI;
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/views/ABView.js":
/*!***********************************************************!*\
  !*** ./src/rootPages/Designer/properties/views/ABView.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ABView
 * A Generic Property manager for All our ABViews.
 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   if (!myClass) {
      // const uiConfig = AB.Config.uiSettings();
      const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
      // var L = UIClass.L();

      myClass = class ABViewProperty extends UIClass {
         constructor(base = "properties_abview", ids = {}) {
            // base: {string} unique base id reference
            // ids: {hash}  { key => '' }
            // this is provided by the Sub Class and has the keys
            // unique to the Sub Class' interface elements.

            var common = {
               // component: `${base}_component`,
               /*
// TODO:
               // the common property fields
               label: `${base}_label`,
               columnName: `${base}_columnName`,
               fieldDescription: `${base}_fieldDescription`,
               showIcon: `${base}_showIcon`,
               required: `${base}_required`,
               numberOfNull: `${base}_numberOfNull`,
               unique: `${base}_unique`,
               filterComplex: `${base}_filtercomplex`,
               addValidation: `${base}_addvalidation`,
               shorthand: `${base}_shorthand`,
               validationRules: `${base}_validationRules`,
*/
            };

            Object.keys(ids).forEach((k) => {
               if (typeof common[k] != "undefined") {
                  console.error(
                     `!!! ABFieldProperty:: passed in ids contains a restricted field : ${k}`
                  );
                  return;
               }
               common[k] = "";
            });

            super(base, common);

            this.base = base;
            this.AB = AB;
         }

         ui(elements = []) {
            /*
// TODO: this is still from ABField.js

            var ids = this.ids;

            var FC = this.FieldClass();

            var _ui = {
               view: "form",
               id: ids.component,
               autoheight: true,
               borderless: true,
               elements: [
                  // {
                  //    view: "label",
                  //    label: "<span class='webix_icon fa fa-{0}'></span>{1}".replace('{0}', Field.icon).replace('{1}', Field.menuName)
                  // },
                  {
                     view: "text",
                     id: ids.label,
                     name: "label",
                     label: L("Label"),
                     placeholder: L("Label"),
                     labelWidth: uiConfig.labelWidthLarge,
                     css: "ab-new-label-name",
                     on: {
                        onChange: function (newVal, oldVal = "") {
                           // update columnName when appropriate
                           if (
                              newVal != oldVal &&
                              oldVal == $$(ids.columnName).getValue() &&
                              $$(ids.columnName).isEnabled()
                           ) {
                              $$(ids.columnName).setValue(newVal);
                           }
                        },
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "text",
                     id: ids.columnName,
                     name: "columnName",
                     disallowEdit: true,
                     label: L("Field Name"),
                     labelWidth: uiConfig.labelWidthLarge,
                     placeholder: L("Database field name"),
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "label",
                     id: ids.fieldDescription,
                     label: L("Description"), // Field.description,
                     align: "right",
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     id: ids.showIcon,
                     name: "showIcon",
                     labelRight: L("show icon?"),
                     labelWidth: uiConfig.labelWidthCheckbox,
                     value: true,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     id: ids.required,
                     name: "required",
                     hidden: !FC.defaults().supportRequire,
                     labelRight: L("Required"),
                     // disallowEdit: true,
                     labelWidth: uiConfig.labelWidthCheckbox,
                     on: {
                        onChange: (newVal, oldVal) => {
                           this.requiredOnChange(newVal, oldVal, ids);

                           // If check require on edit field, then show warning message
                           this.getNumberOfNullValue(newVal);
                        },
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  // warning message: number of null value rows
                  {
                     view: "label",
                     id: ids.numberOfNull,
                     css: { color: "#f00" },
                     label: "",
                     hidden: true,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     id: ids.unique,
                     name: "unique",
                     hidden: !FC.defaults().supportUnique,
                     labelRight: L("Unique"),
                     disallowEdit: true,
                     labelWidth: uiConfig.labelWidthCheckbox,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.filterComplex,
                     rows: [],
                  },
                  {
                     id: ids.addValidation,
                     view: "button",
                     label: L("Add Field Validation"),
                     css: "webix_primary",
                     click: () => {
                        this.addValidation();
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
                  // have a hidden field to contain the validationRules
                  // value we will parse out later
                  {
                     id: ids.validationRules,
                     view: "text",
                     hidden: true,
                     name: "validationRules",
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],

               rules: {
                  label: webix.rules.isNotEmpty,
                  columnName: webix.rules.isNotEmpty,
               },
            };

            // Add our passed in elements:
            elements.forEach((e) => {
               // passed in elements might not have their .id
               // set, but have a .name. Let's default id =
               if (!e.id && e.name) {
                  if (!this.ids[e.name]) {
                     this.ids[e.name] = `${this.base}_${e.name}`;
                  }
                  e.id = this.ids[e.name];
               }
               _ui.elements.push(e);
            });

            return _ui;
*/
            return {};
         }

         async init(AB) {
            this.AB = AB;

            var FC = this.FieldClass();
            if (FC) {
               /*
// TODO:
               $$(this.ids.fieldDescription).define(
                  "label",
                  L(FC.defaults().description)
               );
            } else {
               $$(this.ids.fieldDescription).hide();
*/
            }
         }

         clearEditor() {
            console.error("!!! Depreciated! call clear() instead.");
            this.clear();
         }

         clear() {
            /*
// TODO:
            var ids = this.ids;
            this._CurrentField = null;

            var defaultValues = this.defaultValues();

            for (var f in defaultValues) {
               var component = $$(ids[f]);
               if (component) component.setValue(defaultValues[f]);
            }

            // reset the validation rules UI
            var filterViews = $$(ids.filterComplex).queryView(
               {
                  view: "form",
                  css: "abValidationForm",
               },
               "all"
            );
            if (filterViews.length) {
               filterViews.forEach((v) => {
                  $$(ids.filterComplex).removeView(v);
               });
            }

            $$(ids.addValidation).hide();

            // hide warning message of null data
            $$(ids.numberOfNull).hide();
*/
         }

         /**
          * @method defaults()
          * Return the ViewClass() default values.
          * NOTE: the child class MUST implement ViewClass() to return the
          * proper ABViewXXX class definition.
          * @return {obj}
          */
         defaults() {
            var ViewClass = this.ViewClass();
            if (!ViewClass) {
               console.error(
                  "!!! properties/views/ABView: could not find ViewClass"
               );
               return null;
            }
            return ViewClass.common();
         }

         editorPopulate(field) {
            console.error("!!! Depreciated. call populate() instead.");
            this.populate(field);
         }

         formValues() {
            return $$(this.ids.component).getValues();
         }

         /**
          * @method isValid()
          * Verify the common ABField settings are valid before allowing
          * us to create the new field.
          * @return {bool}
          */
         isValid() {
            /*
// TODO:
            var ids = this.ids;
            var isValid = $$(ids.component).validate(),
               colName = this.formValues()["columnName"];

            // validate reserve column names
            var FC = this.FieldClass();
            if (!FC) {
               this.AB.notify.developer(
                  new Error("Unable to resolve FieldClass"),
                  {
                     context: "ABFieldProperty: isValid()",
                     base: this.ids.component,
                  }
               );
            }

            // columnName should not be one of the reserved names:
            if (FC?.reservedNames.indexOf(colName.trim().toLowerCase()) > -1) {
               this.markInvalid("columnName", L("This is a reserved name"));
               isValid = false;
            }

            // columnName should not be in use by other fields on this object
            // get All fields with matching colName
            var fieldColName = this.currentObject?.fields(
               (f) => f.columnName == colName
            );
            // ignore current edit field
            if (this._CurrentField) {
               fieldColName = fieldColName.filter(
                  (f) => f.id != this._CurrentField.id
               );
            }
            // if any more matches, this is a problem
            if (fieldColName.length > 0) {
               this.markInvalid(
                  "columnName",
                  L("This column name is in use by another field ({0})", [
                     fieldColName.label,
                  ])
               );
               isValid = false;
            }

            return isValid;
*/
         }

         markInvalid(name, message) {
            $$(this.ids.component).markInvalid(name, message);
         }

         /**
          * @function populate
          * populate the property form with the given ABField instance provided.
          * @param {ABField} field
          *        The ABFieldXXX instance that we are editing the settings for.
          */
         populate(/* field */) {
            /*
// TODO:
            var ids = this.ids;
            this._CurrentField = field;

            // these columns are located on the base ABField object
            ["label", "columnName"].forEach((c) => {
               $$(ids[c]).setValue?.(field[c]);
            });
            $$(ids.fieldDescription).setValue(field.fieldDescription());

            // the remaining columns are located in .settings
            Object.keys(ids).forEach((c) => {
               if (typeof field.settings[c] != "undefined") {
                  $$(ids[c])?.setValue?.(field.settings[c]);
               }
            });
            $$(ids.label).setValue(field.label);
            $$(ids.columnName).setValue(field.columnName);
            $$(ids.showIcon).setValue(field.settings.showIcon);
            $$(ids.required).setValue(field.settings.required);
            $$(ids.unique).setValue(field.settings.unique);

            if (this._CurrentField) {
               $$(ids.addValidation).show();
            }

            if (field.settings && field.settings.validationRules) {
               var rules = field.settings.validationRules;
               if (typeof rules == "string") {
                  try {
                     rules = JSON.parse(rules);
                  } catch (e) {
                     this.AB.notify.builder(e, {
                        context: `ABField[${field.id}][${field.name}]: has invalid validationRules`,
                        validationRules: field.settings.validationRules,
                     });
                     // so ... now what?
                     rules = [];
                  }
               }
               (rules || []).forEach((settings) => {
                  field.addValidation(ids, settings);
               });
            }
*/
         }

         requiredOnChange() {
            // Sub Class should overwrite this if it is necessary.
         }

         // show() {
         //    super.show();
         //    // AppList.show();
         // }

         /*
          * @function values
          *
          * return the values for this form.
          * @return {obj}
          */
         values() {
            /*
// TODO:
            var ids = this.ids;

            var settings = $$(ids.component).getValues();
            if ($$(ids.filterComplex)) {
               var validationRules = [];
               var forms = $$(ids.filterComplex).queryView(
                  { view: "form", css: "abValidationForm" },
                  "all"
               );
               forms.forEach((form) => {
                  var rules = form
                     .queryView({ view: "querybuilder" })
                     .getValue();
                  var invalidMessage = form
                     .queryView({ name: "invalidMessage" })
                     .getValue();
                  var validationObj = {
                     invalidMessage: invalidMessage,
                     rules: rules,
                  };
                  validationRules.push(validationObj);
               });
               settings.validationRules = JSON.stringify(validationRules);
            }

            var FC = this.FieldClass();

            // convert flat settings into our ABField value format:
            var values = FC.editorValues(settings);

            values.key = FC.defaults().key;

            return values;
*/
            return {};
         }

         /**
          * @method FieldClass()
          * A method to return the proper ABFieldXXX Definition.
          * NOTE: Must be overwritten by the Child Class
          */
         ViewClass() {
            console.error("!!! Child Class has not overwritten FieldClass()");
            return null;
            // return super._FieldClass("string");
         }

         _ViewClass(key) {
            var app = this.CurrentApplication;
            if (!app) {
               app = this.AB.applicationNew({});
            }
            return app.viewAll((V) => V.common().key == key)[0];
         }
      };
   }
   return myClass;
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/views/ABViewCSVImporter.js":
/*!**********************************************************************!*\
  !*** ./src/rootPages/Designer/properties/views/ABViewCSVImporter.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ABView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ABView */ "./src/rootPages/Designer/properties/views/ABView.js");
/*
 * ABViewCSVImporter
 * A Property manager for our ABViewCSVImporter widget
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var ABViewClassProperty = (0,_ABView__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = ABViewClassProperty.L();

   class ABViewCSVImporterProperty extends ABViewClassProperty {
      constructor() {
         super("properties_abview", {
            // Put our ids here
         });
      }

      ui() {
         /*
// TODO: this is still from ABField.js

            var ids = this.ids;

            var FC = this.FieldClass();

            var _ui = {
               view: "form",
               id: ids.component,
               autoheight: true,
               borderless: true,
               elements: [
                  // {
                  //    view: "label",
                  //    label: "<span class='webix_icon fa fa-{0}'></span>{1}".replace('{0}', Field.icon).replace('{1}', Field.menuName)
                  // },
                  {
                     view: "text",
                     id: ids.label,
                     name: "label",
                     label: L("Label"),
                     placeholder: L("Label"),
                     labelWidth: uiConfig.labelWidthLarge,
                     css: "ab-new-label-name",
                     on: {
                        onChange: function (newVal, oldVal = "") {
                           // update columnName when appropriate
                           if (
                              newVal != oldVal &&
                              oldVal == $$(ids.columnName).getValue() &&
                              $$(ids.columnName).isEnabled()
                           ) {
                              $$(ids.columnName).setValue(newVal);
                           }
                        },
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "text",
                     id: ids.columnName,
                     name: "columnName",
                     disallowEdit: true,
                     label: L("Field Name"),
                     labelWidth: uiConfig.labelWidthLarge,
                     placeholder: L("Database field name"),
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "label",
                     id: ids.fieldDescription,
                     label: L("Description"), // Field.description,
                     align: "right",
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     id: ids.showIcon,
                     name: "showIcon",
                     labelRight: L("show icon?"),
                     labelWidth: uiConfig.labelWidthCheckbox,
                     value: true,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     id: ids.required,
                     name: "required",
                     hidden: !FC.defaults().supportRequire,
                     labelRight: L("Required"),
                     // disallowEdit: true,
                     labelWidth: uiConfig.labelWidthCheckbox,
                     on: {
                        onChange: (newVal, oldVal) => {
                           this.requiredOnChange(newVal, oldVal, ids);

                           // If check require on edit field, then show warning message
                           this.getNumberOfNullValue(newVal);
                        },
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  // warning message: number of null value rows
                  {
                     view: "label",
                     id: ids.numberOfNull,
                     css: { color: "#f00" },
                     label: "",
                     hidden: true,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     id: ids.unique,
                     name: "unique",
                     hidden: !FC.defaults().supportUnique,
                     labelRight: L("Unique"),
                     disallowEdit: true,
                     labelWidth: uiConfig.labelWidthCheckbox,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.filterComplex,
                     rows: [],
                  },
                  {
                     id: ids.addValidation,
                     view: "button",
                     label: L("Add Field Validation"),
                     css: "webix_primary",
                     click: () => {
                        this.addValidation();
                     },
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  // have a hidden field to contain the validationRules
                  // value we will parse out later
                  {
                     id: ids.validationRules,
                     view: "text",
                     hidden: true,
                     name: "validationRules",
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],

               rules: {
                  label: webix.rules.isNotEmpty,
                  columnName: webix.rules.isNotEmpty,
               },
            };

            // Add our passed in elements:
            elements.forEach((e) => {
               // passed in elements might not have their .id
               // set, but have a .name. Let's default id =
               if (!e.id && e.name) {
                  if (!this.ids[e.name]) {
                     this.ids[e.name] = `${this.base}_${e.name}`;
                  }
                  e.id = this.ids[e.name];
               }
               _ui.elements.push(e);
            });

            return _ui;
*/

         return super.ui([]);
      }

      async init(AB) {
         return super.init(AB);
      }

      defaultValues() {
         var values = {
            dataviewID: null,
            buttonLabel: "Upload CSV",
            width: 0,
            recordRules: [],
         };

         var FieldClass = this.ViewClass();
         if (FieldClass) {
            var fcValues = FieldClass.defaultValues();
            Object.keys(fcValues).forEach((k) => {
               values[k] = fcValues[k];
            });
         }

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABFieldXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("csvImporter");
      }

      toSettings() {
         var base = this.defaults();
         base.settings = this.defaultValues();
         return base;
      }
   }

   return new ABViewCSVImporterProperty();
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/workspaceViews/ABViewGantt.js":
/*!*************************************************************************!*\
  !*** ./src/rootPages/Designer/properties/workspaceViews/ABViewGantt.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ui_class */ "./src/rootPages/Designer/ui_class.js");
// ABObjectWorkspaceViewGantt.js
//
// Manages the settings for a Gantt Chart View in the AppBuilder Object Workspace

// const ABObjectWorkspaceView = require("./ABObjectWorkspaceView");
// const ABObjectWorkspaceViewComponent = require("./ABObjectWorkspaceViewComponent");

// const ABPopupNewDataField = require("../../../ABDesigner/ab_work_object_workspace_popupNewDataField");

// const ABFieldDate = require("../dataFields/ABFieldDate");
// const ABFieldNumber = require("../dataFields/ABFieldNumber");
// const ABFieldString = require("../dataFields/ABFieldString");
// const ABFieldLongText = require("../dataFields/ABFieldLongText");

var defaultValues = {
   name: "Default Gantt",
   filterConditions: [], // array of filters to apply to the data table
   sortFields: [],
   title: "none", // id of a ABFieldString, ABFieldLongText
   startDate: null, // id of a ABFieldDate
   endDate: "none", // id of a ABFieldDate
   duration: "none", // id of a ABFieldNumber
   progress: "none", // id of a ABFieldNumber
   notes: "none", // id of a ABFieldString, ABFieldLongText
};



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB, ibase) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class ABObjectWorkspaceViewGantt extends UIClass {
      constructor(idBase) {
         super(idBase, {
            title: "",
            startDate: "",
            endDate: "",
            duration: "",
            progress: "",
            notes: "",
         });
      }

      /**
       * unique key describing this View.
       * @return {string}
       */
      type() {
         return "gantt";
      }

      /**
       * @return {string}
       */
      icon() {
         return "fa fa-tasks";
      }

      refreshOptions(object, view) {
         let ids = this.ids;

         let dateFields = object
            .fields((f) => f instanceof ABFieldDate)
            .map(({ id, label }) => ({ id, value: label }));

         // Start date
         $$(ids.startDate).define("options", dateFields);

         // Add default option
         dateFields.unshift({
            id: "none",
            value: L("Select a date field"),
         });

         // End date
         $$(ids.endDate).define("options", dateFields);

         // Duration
         let numberFields = object
            .fields((f) => f instanceof ABFieldNumber)
            .map(({ id, label }) => ({ id, value: label }));

         // Add default option
         numberFields.unshift({
            id: "none",
            value: L("Select a number field"),
         });
         $$(ids.duration).define("options", numberFields);

         // Progress
         let decimalFields = object
            .fields((f) => f instanceof ABFieldNumber)
            .map(({ id, label }) => ({ id, value: label }));

         // Add default option
         decimalFields.unshift({
            id: "none",
            value: L("Select a number field"),
         });
         $$(ids.progress).define("options", decimalFields);

         // Title & Notes
         let stringFields = object
            .fields(
               (f) => f instanceof ABFieldString || f instanceof ABFieldLongText
            )
            .map(({ id, label }) => ({ id, value: label }));

         // Add default option
         stringFields.unshift({
            id: "none",
            value: L("Select a string field"),
         });
         $$(ids.title).define("options", stringFields);
         $$(ids.notes).define("options", stringFields);

         // Select view's values
         if (view && view.title) {
            $$(ids.title).define("value", view.title);
            $$(ids.title).refresh();
         }

         if (view && view.startDate) {
            $$(ids.startDate).define("value", view.startDate);
            $$(ids.startDate).refresh();
         }

         if (view && view.endDate) {
            $$(ids.endDate).define(
               "value",
               view.endDate || defaultValues.endDate
            );
            $$(ids.endDate).refresh();
         }

         if (view && view.duration) {
            $$(ids.duration).define(
               "value",
               view.duration || defaultValues.duration
            );
            $$(ids.duration).refresh();
         }

         if (view && view.progress) {
            $$(ids.progress).define("value", view.progress);
            $$(ids.progress).refresh();
         }

         if (view && view.notes) {
            $$(ids.notes).define("value", view.notes);
            $$(ids.notes).refresh();
         }
      }

      ui() {
         let ids = this.ids;

         // let labels = {
         //    common: App.labels,
         //    component: {
         //       title: L("ab.add_view.gantt.title", "*Title"),
         //       startDate: L("ab.add_view.gantt.startDate", "*Start Date"),
         //       endDate: L("ab.add_view.gantt.endDate", "*End Date"),
         //       duration: L("ab.add_view.gantt.duration", "*Duration"),
         //       progress: L("ab.add_view.gantt.progress", "*Progress"),
         //       notes: L("ab.add_view.gantt.notes", "*Notes"),

         //       datePlaceholder: L(
         //          "ab.add_view.gantt.datePlaceholder",
         //          "*Select a date field"
         //       ),
         //       numberPlaceholder: L(
         //          "ab.add_view.gantt.numberPlaceholder",
         //          "*Select a number field"
         //       ),
         //       stringPlaceholder: L(
         //          "ab.add_view.gantt.stringPlaceholder",
         //          "*Select a string field"
         //       ),
         //    },
         // };

         // var PopupNewDataFieldComponent = new ABPopupNewDataField(
         //    App,
         //    idBase + "_gantt"
         // );

         return {
            batch: "gantt",
            rows: [
               {
                  cols: [
                     {
                        id: ids.title,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-calendar'></span> ${L(
                           "Title"
                        )}`,
                        placeholder: L("Select a string field"),
                        labelWidth: 130,
                        name: "title",
                        options: [],
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 20,
                        click: () => {
                           PopupNewDataFieldComponent.show(
                              null,
                              ABFieldString.defaults().key
                           );
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.startDate,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-calendar'></span> ${L(
                           "Start Date"
                        )}`,
                        placeholder: L("Select a date field"),
                        labelWidth: 130,
                        name: "startDate",
                        required: true,
                        options: [],
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 20,
                        click: () => {
                           PopupNewDataFieldComponent.show(
                              null,
                              ABFieldDate.defaults().key
                           );
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.endDate,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-calendar'></span> ${L(
                           "End Date"
                        )}`,
                        placeholder: L("Select a date field"),
                        labelWidth: 130,
                        name: "endDate",
                        options: [],
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 20,
                        click: () => {
                           PopupNewDataFieldComponent.show(
                              null,
                              ABFieldDate.defaults().key
                           );
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.duration,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-hashtag'></span> ${L(
                           "Duration"
                        )}`,
                        placeholder: L("Select a number field"),
                        labelWidth: 130,
                        name: "duration",
                        options: [],
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 20,
                        click: () => {
                           PopupNewDataFieldComponent.show(
                              null,
                              ABFieldNumber.defaults().key
                           );
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.progress,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-hashtag'></span> ${L(
                           "Progress"
                        )}`,
                        placeholder: L("Select a number field"),
                        labelWidth: 130,
                        name: "progress",
                        required: false,
                        options: [],
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 20,
                        click: () => {
                           PopupNewDataFieldComponent.show(
                              null,
                              ABFieldNumber.defaults().key
                           );
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.notes,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-align-right'></span> ${L(
                           "Notes"
                        )}`,
                        placeholder: L("Select a string field"),
                        labelWidth: 130,
                        name: "notes",
                        required: false,
                        options: [],
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 20,
                        click: () => {
                           PopupNewDataFieldComponent.show(
                              null,
                              ABFieldLongText.defaults().key
                           );
                        },
                     },
                  ],
               },
            ],
         };
      }

      init(object, view) {
         if (!object) return;

         this.refreshOptions(object, view);

         // PopupNewDataFieldComponent.applicationLoad(object.application);
         // PopupNewDataFieldComponent.objectLoad(object);
         // PopupNewDataFieldComponent.init({
         //    onSave: () => {
         //       // be notified when a new Field is created & saved

         //       this.refreshOptions(object, view);
         //    },
         // });
      }

      validate($form) {
         let ids = this.ids;

         let endDate = $$(ids.endDate).getValue() || defaultValues.endDate,
            duration = $$(ids.duration).getValue() || defaultValues.duration;

         if (
            endDate == defaultValues.endDate &&
            duration == defaultValues.duration
         ) {
            $form.markInvalid("endDate", "Required");
            $form.markInvalid("duration", "Required");

            return false;
         } else {
            return true;
         }
      }

      values() {
         let ids = this.ids;

         let result = {};

         result.title = $$(ids.title).getValue() || defaultValues.title;
         result.startDate =
            $$(ids.startDate).getValue() || defaultValues.startDate;
         result.endDate = $$(ids.endDate).getValue() || defaultValues.endDate;
         result.duration =
            $$(ids.duration).getValue() || defaultValues.duration;
         result.progress =
            $$(ids.progress).getValue() || defaultValues.progress;
         result.notes = $$(ids.notes).getValue() || defaultValues.notes;

         return result;
      }

      /**
       * @method fromObj
       * take our persisted data, and properly load it
       * into this object instance.
       * @param {json} data  the persisted data
       */
      fromSettings(data) {
         for (var v in defaultValues) {
            this[v] = data[v] || defaultValues[v];
         }

         this.type = this.type();
      }

      /**
       * @method toObj()
       * compile our current state into a {json} object
       * that can be persisted.
       */
      toSettings() {
         var obj = {}; //super.toObj();

         for (var v in defaultValues) {
            obj[v] = this[v];
         }

         obj.type = this.type();
         return obj;
      }

      get titleField() {
         let viewCollection = this.object, // Should use another name property ?
            object = viewCollection.object;

         return object.fields((f) => f.id == this.title)[0];
      }

      get startDateField() {
         let viewCollection = this.object, // Should use another name property ?
            object = viewCollection.object;

         return object.fields((f) => f.id == this.startDate)[0];
      }

      get endDateField() {
         let viewCollection = this.object, // Should use another name property ?
            object = viewCollection.object;

         return object.fields((f) => f.id == this.endDate)[0];
      }

      get durationField() {
         let viewCollection = this.object, // Should use another name property ?
            object = viewCollection.object;

         return object.fields((f) => f.id == this.duration)[0];
      }

      get progressField() {
         let viewCollection = this.object, // Should use another name property ?
            object = viewCollection.object;

         return object.fields((f) => f.id == this.progress)[0];
      }

      get notesField() {
         let viewCollection = this.object,
            object = viewCollection.object;

         return object.fields((f) => f.id == this.notes)[0];
      }
   }

   return new ABObjectWorkspaceViewGantt(ibase);
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/workspaceViews/ABViewGrid.js":
/*!************************************************************************!*\
  !*** ./src/rootPages/Designer/properties/workspaceViews/ABViewGrid.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ui_class */ "./src/rootPages/Designer/ui_class.js");
// ABViewGrid.js
//
// Manages the settings for a Data Grid View in the AppBuilder Object Workspace
// These properties serve 2 purposes: they collect the configuration information
// for a grid view, and they also are able to store those settings

// const ABObjectWorkspaceView = require("./ABObjectWorkspaceView");

var defaultValues = {
   name: "Default Grid",
   sortFields: [], // array of columns with their sort configurations
   filterConditions: [], // array of filters to apply to the data table
   frozenColumnID: "", // id of column you want to stop freezing
   hiddenFields: [], // array of [ids] to add hidden:true to
};



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB, ibase) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class ABViewGrid extends UIClass {
      constructor(idBase) {
         super(idBase);

         /*
	{
		id:uuid(),
		type:'grid',  
		sortFields:[],
		filterConditions:[],
		frozenColumnID:"",
		hiddenFields:[],
	}

*/
      }

      /**
       * unique key describing this View.
       * @return {string}
       */
      type() {
         return "grid";
      }

      /**
       * @return {string}
       */
      icon() {
         return "fa fa-table";
      }

      /**
       * @method fromObj
       * take our persisted data, and properly load it
       * into this object instance.
       * @param {json} data  the persisted data
       */
      fromSettings(data) {
         // super.fromObj(data);

         for (var v in defaultValues) {
            this[v] = data[v] || defaultValues[v];
         }

         this.type = this.type();
         this.key = this.type();
      }

      /**
       * @method toObj()
       * compile our current state into a {json} object
       * that can be persisted.
       */
      toSettings() {
         var obj = {}; // super.toObj();

         for (var v in defaultValues) {
            obj[v] = this[v] || defaultValues[v];
         }

         obj.key = this.type();
         obj.type = this.type();
         return obj;
      }
   }

   return new ABViewGrid(ibase);
}


/***/ }),

/***/ "./src/rootPages/Designer/properties/workspaceViews/ABViewKanban.js":
/*!**************************************************************************!*\
  !*** ./src/rootPages/Designer/properties/workspaceViews/ABViewKanban.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ui_class */ "./src/rootPages/Designer/ui_class.js");
// ABViewKanbanProperties.js
//
// Manages the settings for a KanBan View in the Object Workspace

var defaultValues = {
   name: "Default Kanban",
   // filterConditions: [], // array of filters to apply to the data table
   // sortFields: [],
   settings: {
      verticalGroupingField: null,
      horizontalGroupingField: null,
      ownerField: null,
   },
};



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB, ibase) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   const ABFieldConnect = AB.Class.ABFieldManager.fieldByKey("connectObject");
   const ABFieldList = AB.Class.ABFieldManager.fieldByKey("list");
   const ABFieldUser = AB.Class.ABFieldManager.fieldByKey("user");

   class ABViewKanban extends UIClass {
      constructor(idBase) {
         super(idBase, {
            vGroupInput: "",
            hGroupInput: "",
            ownerInput: "",
         });

         this.on("field.added", (field) => {
            // refresh our droplists with the new field.
            this.refreshOptions(this._object, this._view);
            if (this._autoSelectInput) {
               $$(this._autoSelectInput)?.setValue(field.id);
            }
         });

         this._autoSelectInput = null;
         // {string}
         // contains the webix.id of the input that should be auto selected
         // if we receive a "field.add" event;
      }

      /**
       * unique key describing this View.
       * @return {string}
       */
      type() {
         return "kanban";
      }

      /**
       * @return {string}
       */
      icon() {
         return "fa fa-columns";
      }

      refreshOptions(object, view, options = {}) {
         let ids = this.ids;

         // Utility function to initialize the options for a field select input
         const initSelect = (
            $option,
            attribute,
            filter = (f) => f.key === ABFieldList.defaults().key,
            isRequired
         ) => {
            if ($option == null || object == null) return;

            // populate options
            var options = object
               .fields()
               .filter(filter)
               .map(({ id, label }) => ({ id, value: label }));
            if (!isRequired && options.length) {
               options.unshift({
                  id: 0,
                  value: L("None"),
               });
            }
            $option.define("options", options);

            // select a value
            if (view) {
               if (view[attribute]) {
                  $option.define("value", view[attribute]);
               } else if (!isRequired && options[0]) {
                  $option.define("value", options[0].id);
               }
            } else if (options.filter((o) => o.id).length === 1) {
               // If there's just one (real) option, default to the first one
               $option.define("value", options[0].id);
            }

            $option.refresh();
         };

         const verticalGroupingFieldFilter = (field) =>
            [ABFieldList.defaults().key, ABFieldUser.defaults().key].includes(
               field.key
            );

         const horizontalGroupingFieldFilter = (field) =>
            [
               ABFieldConnect.defaults().key,
               ABFieldList.defaults().key,
               ABFieldUser.defaults().key,
            ].includes(field.key);

         initSelect(
            options.vGroupInput || $$(ids.vGroupInput),
            "verticalGroupingField",
            verticalGroupingFieldFilter,
            true
         );
         initSelect(
            options.hGroupInput || $$(ids.hGroupInput),
            "horizontalGroupingField",
            horizontalGroupingFieldFilter,
            false
         );
         initSelect(
            options.ownerInput || $$(ids.ownerInput),
            "ownerField",
            (f) => {
               // User field
               return (
                  f.key === ABFieldUser.defaults().key ||
                  // Connected field : type 1:M
                  (f.key === ABFieldConnect.defaults().key &&
                     f.settings.linkType == "one" &&
                     f.settings.linkViaType == "many")
               );
            },
            false
         );
      }

      ui() {
         let ids = this.ids;
         return {
            batch: "kanban",
            rows: [
               {
                  cols: [
                     {
                        id: ids.vGroupInput,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-columns'></span> ${L(
                           "Vertical Grouping"
                        )}`,
                        placeholder: L("Select a field"),
                        labelWidth: 180,
                        name: "vGroup",
                        required: true,
                        options: [],
                        on: {
                           onChange: function (id) {
                              $$(ids.vGroupInput).validate();
                              $$(ids.hGroupInput).validate();
                           },
                        },
                        invalidMessage: L("Required"),
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 20,
                        click: () => {
                           this._autoSelectInput = ids.vGroupInput;
                           this.emit("new.field", ABFieldList.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        id: ids.hGroupInput,
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-list'></span> ${L(
                           "Horizontal Grouping"
                        )}`,
                        placeholder: L("Select a field"),
                        labelWidth: 180,
                        name: "hGroup",
                        required: false,
                        options: [],
                        invalidMessage: L(
                           "Cannot be the same as vertical grouping field"
                        ),
                        validate: (value) => {
                           var vGroupValue = $$(ids.vGroupInput).getValue();
                           return (
                              !vGroupValue || !value || vGroupValue !== value
                           );
                        },
                        on: {
                           onChange: function (id) {
                              $$(ids.hGroupInput).validate();
                           },
                        },
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 20,
                        click: () => {
                           this._autoSelectInput = ids.hGroupInput;
                           this.emit("new.field", ABFieldList.defaults().key);
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        view: "richselect",
                        label: `<span class='webix_icon fa fa-user-circle'></span> ${L(
                           "Card Owner"
                        )}`,
                        placeholder: L("Select a user field"),
                        id: ids.ownerInput,
                        labelWidth: 180,
                        name: "owner",
                        options: [],
                     },
                     {
                        view: "button",
                        css: "webix_primary",
                        type: "icon",
                        icon: "fa fa-plus",
                        label: "",
                        width: 20,
                        click: () => {
                           this._autoSelectInput = ids.ownerInput;
                           this.emit(
                              "new.field",
                              ABFieldConnect.defaults().key
                           );
                        },
                     },
                  ],
               },
            ],
         };
      }

      init(object, view) {
         this._object = object;
         this._view = view;
         this.refreshOptions(object, view);
      }

      values() {
         let ids = this.ids;
         let result = {};
         result.verticalGroupingField = $$(ids.vGroupInput).getValue() || null;
         result.horizontalGroupingField =
            $$(ids.hGroupInput).getValue() || null;
         result.ownerField = $$(ids.ownerInput).getValue() || null;

         return result;
      }

      /**
       * @method fromObj
       * take our persisted data, and properly load it
       * into this object instance.
       * @param {json} data  the persisted data
       */
      fromSettings(data) {
         // super.fromObj(data);

         for (var v in defaultValues) {
            this[v] = data[v] || defaultValues[v];
         }

         this.type = this.type();
         this.key = this.type();
      }

      /**
       * @method toObj()
       * compile our current state into a {json} object
       * that can be persisted.
       */
      toSettings() {
         var obj = {}; // super.toObj();

         for (var v in defaultValues) {
            obj[v] = this[v] || defaultValues[v];
         }

         obj.key = this.type();
         obj.type = this.type();
         return obj;
      }
   }

   return new ABViewKanban(ibase);
}


/***/ }),

/***/ "./src/rootPages/Designer/ui.js":
/*!**************************************!*\
  !*** ./src/rootPages/Designer/ui.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_choose_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_choose.js */ "./src/rootPages/Designer/ui_choose.js");
/* harmony import */ var _ui_work_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work.js */ "./src/rootPages/Designer/ui_work.js");
/*
 * UI
 *
 * The central Controller for the ABDesigner.
 *
 * We switch between allowing a User to Choose an application to work
 * with, and the actual Workspace for an Application.
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   const AppChooser = (0,_ui_choose_js__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
   const AppWorkspace = (0,_ui_work_js__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);

   var L = UIClass.L();

   class UI extends UIClass {
      constructor() {
         super("abd");
         this.id = this.ids.component;
      }

      label() {
         return L("AB Designer");
      }

      // return "popup" or "page"
      type() {
         return "page";
      }

      // Return any sub pages.
      pages() {
         return [];
      }

      /* mimic the ABPage.component() */
      component() {
         return {
            ui: this.ui(),
            init: () => {
               return this.init(AB);
            },
            onShow: () => {
               /* does anything special need to happen here? */
               this.show();
            },
         };
      }

      /* mimic ABPage.getUserAccess() */
      getUserAccess() {
         return 2;
      }

      ui() {
         return {
            id: this.ids.component,
            view: "multiview",
            borderless: true,
            animate: false,
            // height : 800,
            rows: [AppChooser.ui(), AppWorkspace.ui()],
         };
      }

      async init(AB) {
         this.AB = AB;

         AppChooser.on("view.workplace", (application) => {
            AppWorkspace.transitionWorkspace(application);
         });

         AppWorkspace.on("view.chooser", () => {
            AppChooser.show();
         });

         await Promise.all([AppChooser.init(AB), AppWorkspace.init(AB)]);

         try {
            await this.AB.Network.post({
               url: `/definition/register`,
            });
         } catch (err) {
            if (err?.code == "E_NOPERM") {
               // ?? What do we do here ??
               this.AB.notify.developer(err, {
                  plugin: "ABDesigner",
                  context: "ui::init():/definition/register",
                  msg: "User is not able to access /definition/register",
               });
            }
         }
      }

      /**
       * isRoot()
       * indicates this is a RootPage.
       * @return {bool}
       */
      isRoot() {
         return true;
      }

      show() {
         super.show();
         AppChooser.show();
      }
   }
   return new UI();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_choose.js":
/*!*********************************************!*\
  !*** ./src/rootPages/Designer/ui_choose.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_choose_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_choose_list */ "./src/rootPages/Designer/ui_choose_list.js");
/* harmony import */ var _ui_choose_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_choose_form */ "./src/rootPages/Designer/ui_choose_form.js");
/*
 * UI Choose
 *
 * Display the initial options of Applications we can work with.
 *
 * When choosing an initial application to work with, we can
 *   - select an application from a list  :  ab_choose_list
 *   - create an application from a form  :  ab_choose_form
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const AppList = (0,_ui_choose_list__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
   const AppForm = (0,_ui_choose_form__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   class UI_Choose extends UIClass {
      constructor() {
         super("abd_choose");
      }

      ui() {
         return {
            id: this.ids.component,
            view: "multiview",
            animate: false,
            cells: [AppList.ui(), AppForm.ui()],
         };
      }

      async init(AB) {
         this.AB = AB;

         AppList.on("view.workplace", (application) => {
            this.emit("view.workplace", application);
         });

         AppList.on("view.form", () => {
            AppForm.formReset();
            AppForm.show();
         });

         AppList.on("edit.form", (app) => {
            AppForm.formPopulate(app);
            AppForm.show();
         });

         AppForm.on("view.list", () => {
            AppList.show();
         });
         return Promise.all([AppList.init(AB), AppForm.init(AB)]);
      }

      show() {
         super.show();
         AppList.show();
      }
   }
   return new UI_Choose();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_choose_form.js":
/*!**************************************************!*\
  !*** ./src/rootPages/Designer/ui_choose_form.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _properties_process_ABProcessParticipant_selectManagersUI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./properties/process/ABProcessParticipant_selectManagersUI.js */ "./src/rootPages/Designer/properties/process/ABProcessParticipant_selectManagersUI.js");
/*
 * AB Choose Form
 *
 * Display the form for creating a new Application.
 *
 */

// const ABComponent = require("../classes/platform/ABComponent");
// const ABApplication = require("../classes/platform/ABApplication");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const uiConfig = AB.Config.uiSettings();
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();
   const ClassSelectManagersUI = (0,_properties_process_ABProcessParticipant_selectManagersUI_js__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   class ABChooseForm extends UIClass {
      // .extend(idBase, function(App) {

      constructor() {
         super("abd_choose_form", {
            warnings: "",
            form: "",
            appFormPermissionList: "",
            appFormCreateRoleButton: "",

            saveButton: "",
            accessManager: "",
            accessManagerToolbar: "",
            translationManager: "",
            translationManagerToolbar: "",
         });
      }

      ui() {
         this.accessManagerUI = new ClassSelectManagersUI("application_amp");
         this.translationManagerUI = new ClassSelectManagersUI(
            "application_translate"
         );

         return {
            id: this.ids.component,
            view: "scrollview",
            scroll: "y",
            body: {
               rows: [
                  {
                     responsive: "hide",
                     type: "space",
                     cols: [
                        {
                           maxWidth: uiConfig.appListSpacerColMaxWidth,
                           minWidth: uiConfig.appListSpacerColMinWidth,
                           width: uiConfig.appListSpacerColMaxWidth,
                        },
                        {
                           responsiveCell: false,
                           rows: [
                              {
                                 maxHeight: uiConfig.appListSpacerRowHeight,
                                 hidden: uiConfig.hideMobile,
                              },
                              {
                                 view: "toolbar",
                                 css: "webix_dark",
                                 cols: [
                                    {
                                       view: "label",
                                       label: L("Application Info"), //labels.component.formHeader,
                                       fillspace: true,
                                    },
                                 ],
                              },
                              {
                                 id: this.ids.warnings,
                                 view: "label",
                                 label: "",
                              },
                              {
                                 view: "form",
                                 id: this.ids.form,
                                 autoheight: true,
                                 margin: 0,
                                 rules: {
                                    label: (value) => {
                                       return (
                                          0 < value.length && value.length <= 20
                                       );
                                    },
                                 },
                                 elements: [
                                    {
                                       name: "label",
                                       view: "text",
                                       label: L("Name"),
                                       placeholder: L("Application name"),
                                       invalidMessage: L(
                                          "Name must be less than or equal to 20"
                                       ),
                                       labelWidth: 100,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_label"
                                             );
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       name: "description",
                                       view: "textarea",
                                       label: L("Description"),
                                       labelAlign: "left",
                                       labelWidth: 100,
                                       placeholder: L(
                                          "Application Description"
                                       ),
                                       height: 100,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_description"
                                             );
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       name: "isSystemObj",
                                       view: "checkbox",
                                       labelRight: L(
                                          "is this a System Object?"
                                       ),
                                       labelWidth: 0,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_isSystemObj"
                                             );
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       view: "toolbar",
                                       css: "ab-toolbar-submenu webix_dark",
                                       cols: [
                                          {
                                             template: L(
                                                "Who can use this app?"
                                             ),
                                             type: "header",
                                             borderless: true,
                                          },
                                          {},
                                          // {
                                          //    view: "checkbox",
                                          //    id: this.ids.appFormCreateRoleButton,
                                          //    align: "right",
                                          //    labelRight: L("Create new role"),
                                          //    labelWidth: 0,
                                          //    width: 150,
                                          //    on: {
                                          //       onItemClick: (/* id, e */) => {
                                          //          this.createRoleButtonClick();
                                          //       },
                                          //    },
                                          // },
                                       ],
                                    },
                                    {
                                       name: "permissions",
                                       id: this.ids.appFormPermissionList,
                                       view: "list",
                                       autowidth: true,
                                       height: 140,
                                       margin: 0,
                                       css: "ab-app-form-permission",
                                       template:
                                          "{common.markCheckbox()} #name#",
                                       type: {
                                          markCheckbox: function (obj) {
                                             return `<span class="check webix_icon fa fa-fw fa-${
                                                obj.markCheckbox ? "check-" : ""
                                             }square-o" data-cy="check_${
                                                obj.id
                                             }"></span>`;

                                             // (
                                             //    "<span class='check webix_icon fa fa-fw fa-" +
                                             //    (obj.markCheckbox
                                             //       ? "check-"
                                             //       : "") +
                                             //    "square-o' data-cy='check_"+obj.id+"'></span>"
                                             // );
                                          },
                                       },
                                       on: {
                                          onAfterRender() {
                                             this.data.each((a) => {
                                                AB.ClassUI.CYPRESS_REF(
                                                   this.getItemNode(a.id),
                                                   `perm_role_${a.id}`
                                                );
                                             });
                                          },
                                          onItemClick: (id, e, node) => {
                                             this.permissionClick(id, e, node);
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       name: "isAccessManaged",
                                       view: "checkbox",
                                       labelRight: L(
                                          "Enable Page/Tab Access Management"
                                       ),
                                       labelWidth: 0,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_isAccessManaged"
                                             );
                                          },
                                          onChange: (newv /* , oldv */) => {
                                             if (newv) {
                                                $$(
                                                   this.ids.accessManager
                                                ).show();
                                                $$(
                                                   this.ids.accessManagerToolbar
                                                ).show();
                                             } else {
                                                $$(
                                                   this.ids.accessManager
                                                ).hide();
                                                $$(
                                                   this.ids.accessManagerToolbar
                                                ).hide();
                                             }
                                          },
                                          onItemClick: (id /*, e */) => {
                                             var enabled = $$(id).getValue();
                                             if (enabled) {
                                                $$(
                                                   this.ids.accessManager
                                                ).show();
                                                $$(
                                                   this.ids.accessManagerToolbar
                                                ).show();
                                             } else {
                                                $$(
                                                   this.ids.accessManager
                                                ).hide();
                                                $$(
                                                   this.ids.accessManagerToolbar
                                                ).hide();
                                             }
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       view: "toolbar",
                                       id: this.ids.accessManagerToolbar,
                                       css: "ab-toolbar-submenu webix_dark",
                                       hidden:
                                          parseInt(this.accessManagement) == 1
                                             ? false
                                             : true,
                                       cols: [
                                          {
                                             template: L(
                                                "Who can manage page/tab access for this app?"
                                             ), //labels.component.managerHeader,
                                             type: "header",
                                             borderless: true,
                                          },
                                          {},
                                       ],
                                    },
                                    {
                                       id: this.ids.accessManager,
                                       rows: [this.accessManagerUI.ui()],
                                       paddingY: 10,
                                       hidden:
                                          parseInt(this.accessManagement) == 1
                                             ? false
                                             : true,
                                    },
                                    {
                                       name: "isTranslationManaged",
                                       view: "checkbox",
                                       labelRight: L("Enable Translation Tool"), // labels.component.enableTranslationManagement,
                                       labelWidth: 0,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_isTranslationManaged"
                                             );
                                          },
                                          onChange: (newv /*, oldv */) => {
                                             if (newv) {
                                                $$(
                                                   this.ids.translationManager
                                                ).show();
                                                $$(
                                                   this.ids
                                                      .translationManagerToolbar
                                                ).show();
                                             } else {
                                                $$(
                                                   this.ids.translationManager
                                                ).hide();
                                                $$(
                                                   this.ids
                                                      .translationManagerToolbar
                                                ).hide();
                                             }
                                          },
                                          onItemClick: (id /*, e*/) => {
                                             var enabled = $$(id).getValue();
                                             if (enabled) {
                                                $$(
                                                   this.ids.translationManager
                                                ).show();
                                                $$(
                                                   this.ids
                                                      .translationManagerToolbar
                                                ).show();
                                             } else {
                                                $$(
                                                   this.ids.translationManager
                                                ).hide();
                                                $$(
                                                   this.ids
                                                      .translationManagerToolbar
                                                ).hide();
                                             }
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       view: "toolbar",
                                       id: this.ids.translationManagerToolbar,
                                       css: "ab-toolbar-submenu webix_dark",
                                       hidden:
                                          parseInt(
                                             this.translationManagement
                                          ) == 1
                                             ? false
                                             : true,
                                       cols: [
                                          {
                                             template: L(
                                                "Who can translate this app?"
                                             ),
                                             type: "header",
                                             borderless: true,
                                          },
                                          {},
                                       ],
                                    },
                                    {
                                       id: this.ids.translationManager,
                                       rows: [this.translationManagerUI.ui()],
                                       paddingY: 10,
                                       hidden:
                                          parseInt(
                                             this.translationManagement
                                          ) == 1
                                             ? false
                                             : true,
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       margin: 5,
                                       cols: [
                                          { fillspace: true },
                                          {
                                             view: "button",
                                             value: L("Cancel"),
                                             width: uiConfig.buttonWidthSmall,
                                             css: "ab-cancel-button",
                                             click: () => {
                                                this.cancel();
                                             },
                                             on: {
                                                onAfterRender() {
                                                   AB.ClassUI.CYPRESS_REF(
                                                      this,
                                                      "abd_choose_form_cancel"
                                                   );
                                                },
                                             },
                                          },
                                          {
                                             id: this.ids.saveButton,
                                             view: "button",
                                             css: "webix_primary",
                                             label: L("Save"),
                                             type: "form",
                                             width: uiConfig.buttonWidthSmall,
                                             click: () => {
                                                this.buttonSaveClick();
                                             }, // end click()
                                             on: {
                                                onAfterRender() {
                                                   AB.ClassUI.CYPRESS_REF(this);
                                                },
                                             },
                                          },
                                       ],
                                    },
                                 ],
                              },
                              {
                                 hidden: uiConfig.hideMobile,
                              },
                           ],
                        },
                        {
                           maxWidth: uiConfig.appListSpacerColMaxWidth,
                           minWidth: uiConfig.appListSpacerColMinWidth,
                           width: uiConfig.appListSpacerColMaxWidth,
                        },
                     ],
                  },
               ],
            },
         };
      } // ui()

      init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);

         webix.extend(this.$form, webix.ProgressBar);
         webix.extend($$(this.ids.appFormPermissionList), webix.ProgressBar);

         // Make sure we listen for New/Updated Role information

         this.permissionPopulate();
      }

      toList() {
         this.emit("view.list");
      }

      /**
       * @function applicationCreate
       *
       * Step through the process of creating an ABApplication with the
       * current state of the Form.
       *
       * @param {obj} values 	current value hash of the form values.
       */
      async applicationCreate(values) {
         // on a CREATE, make sure .name is set:
         values.name = values.label;

         // work with a new ABApplication
         var app = this.AB.applicationNew(values);
         try {
            await app.save();
            webix.message({
               type: "success",
               text: L("{0} successfully created.", [values.label]),
            });

            // NOTE: the new App isn't actually stored in AB.applications()
            // until after the 'ab.abdefinition.created' message is returned
            // from the Server.

            // TODO: detect if our Network type is REST and then manually
            // add the Application to the AB factory.
         } catch (e) {
            webix.message({
               type: "error",
               text: L("Error creating {0}", [values.label]),
            });
            this.AB.notify.developer(e, {
               plugin: "ABDesigner",
               context: "ui_choose_form:applicationCreate()",
               values,
            });
         }
      }

      /**
       * @method applicationUpdate
       * Step through the process of updating an ABApplication with the
       * current state of the Form.
       * @param {ABApplication} application
       */
      async applicationUpdate(Application) {
         var values = this.formValues();
         // {hash} /key : value
         // the new values pulled from the form

         var oldVals = {};
         // {hash} /key : value
         // a set of the original values to reset to incase of an error saving.

         Object.keys(values).forEach((k) => {
            oldVals[k] = Application[k];
            Application[k] = values[k];
         });

         try {
            await Application.save();
            webix.message({
               type: "success",
               text: L("{0} successfully updated.", [Application.label]),
            });
         } catch (e) {
            webix.message({
               type: "error",
               text: L("Error updating {0}", [Application.label]),
            });
            this.AB.notify.developer(e, {
               context: "ui_choose_form:applicationUpdate()",
               application: Application.toObj(),
               values,
            });
            // Reset our Application to the original values.
            Object.keys(oldVals).forEach((k) => {
               Application[k] = oldVals[k];
            });
         }

         // .then(function () {
         //    next();
         // })
         // .catch(next);

         /*
               async.waterfall(
                  [
                     function (next) {
                        _logic
                           .permissionSave(Application)
                           .then(function (result) {
                              next(null, result);
                           })
                           .catch(next);
                     },
                     function (app_role, next) {
                        // Update application data
                        Application.label = values.label;
                        Application.description = values.description;
                        // Application.isAdminApp = values.isAdminApp;
                        Application.isAccessManaged = values.isAccessManaged;
                        Application.isTranslationManaged =
                           values.isTranslationManaged;
                        Application.accessManagers = accessManagers;
                        Application.translationManagers = translationManagers;

                        if (app_role && app_role.id)
                           Application.role = app_role.id;
                        else Application.role = null;

                        Application.save()
                           .then(function () {
                              next();
                           })
                           .catch(next);
                     },
                  ],
                  function (err) {
                     _logic.formReady();
                     _logic.buttonSaveEnable();
                     if (err) {
                        webix.message({
                           type: "error",
                           text: labels.common.updateErrorMessage.replace(
                              "{0}",
                              Application.label
                           ),
                        });
                        AD.error.log(
                           "App Builder : Error update application data",
                           { error: err }
                        );
                        return false;
                     }

                     App.actions.transitionApplicationList();

                     webix.message({
                        type: "success",
                        text: labels.common.updateSucessMessage.replace(
                           "{0}",
                           Application.label
                        ),
                     });
                  }
               );
*/
      }

      /**
       * @function buttonSaveClick
       * Process the user clicking on the [Save] button.
       */
      async buttonSaveClick() {
         this.buttonSaveDisable();
         this.formBusy();

         // if there is a selected Application, then this is an UPDATE
         // var updateApp = App.actions.getSelectedApplication();
         if (this.CurrentApplication) {
            if (this.formValidate("update")) {
               try {
                  await this.applicationUpdate(this.CurrentApplication);
                  this.toList();
               } catch (e) {
                  /* error is handled in .applicationUpdate() */
               }

               this.formReady();
               this.buttonSaveEnable();
            }
         } else {
            // else this is a Create
            if (this.formValidate("add")) {
               try {
                  await this.applicationCreate(this.formValues());
                  this.formReset();
                  this.toList();
               } catch (e) {
                  /* error is handled in .applicationCreate() */
               }
               this.formReady();
               this.buttonSaveEnable();
            }
         }
      }

      /**
       * @function buttonSaveDisable
       * Disable the save button.
       */
      buttonSaveDisable() {
         $$(this.ids.saveButton).disable();
      }

      /**
       * @function buttonSaveEnable
       * Re-enable the save button.
       */
      buttonSaveEnable() {
         $$(this.ids.saveButton).enable();
      }

      /**
       * @function cancel
       * Cancel the current Form Operation and return us to the AppList.
       */
      cancel() {
         this.formReset();
         this.toList();
         // App.actions.transitionApplicationList();
      }

      /**
       * @function createRoleButtonClick
       *
       * The user clicked the [Create Role] button.  Update the UI and add a
       * unique Application permission to our list.
       */
      // createRoleButtonClick: function () {
      //    if ($$(ids.appFormCreateRoleButton).getValue()) {
      //       // TODO: if not called from anywhere else, then move the name gathering into .permissionAddNew()
      //       // Add new app role
      //       var appName = $$(ids.form).elements["label"].getValue();
      //       _logic.permissionAddNew(appName);
      //    } else {
      //       // Remove app role
      //       _logic.permissionRemoveNew();
      //    }
      // },

      /**
       * @function formBusy
       *
       * Show the progress indicator to indicate a Form operation is in
       * progress.
       */
      formBusy() {
         this.$form.showProgress({ type: "icon" });
      }

      /**
       * @methoc formPopulate()
       * populate the form values from the given ABApplication
       * @param {ABApplication} application  instance of the ABApplication
       */
      formPopulate(application) {
         super.applicationLoad(application);

         // Populate data to form
         if (application) {
            [
               "label",
               "description",
               "isSystemObj",
               "isAccessManaged",
               "isTranslationManaged",
            ].forEach((f) => {
               if (this.$form.elements[f]) {
                  this.$form.elements[f].setValue(application[f]);
               }
            });

            var messages = this.CurrentApplication.warnings().map(
               (w) => w.message
            );
            $$(this.ids.warnings).setValue(messages.join("\n"));

            // populate access manager ui
            var $accessManager = $$(this.ids.accessManager);
            $accessManager.removeView($accessManager.getChildViews()[0]);
            $accessManager.addView(
               this.accessManagerUI.ui(application.accessManagers || {}),
               0
            );

            // populate translation manager ui
            var $translationManager = $$(this.ids.translationManager);
            $translationManager.removeView(
               $translationManager.getChildViews()[0]
            );
            $translationManager.addView(
               this.translationManagerUI.ui(
                  application.translationManagers || {}
               ),
               0
            );
         }

         this.permissionPopulate(application);
      }

      /**
       * @function formReady()
       *
       * remove the busy indicator from the form.
       */
      formReady() {
         this.$form.hideProgress();
      }

      /**
       * @function formReset()
       *
       * return the form to an empty state.
       */
      formReset() {
         super.applicationLoad(null);

         this.$form.clear();
         this.$form.clearValidation();

         $$(this.ids.warnings).setValue("");

         this.permissionPopulate(); // leave empty to clear selections.

         $$(this.ids.accessManager).removeView(
            $$(this.ids.accessManager).getChildViews()[0]
         );
         $$(this.ids.translationManager).removeView(
            $$(this.ids.translationManager).getChildViews()[0]
         );
         $$(this.ids.accessManager).addView(this.accessManagerUI.ui(), 0);
         $$(this.ids.translationManager).addView(
            this.translationManagerUI.ui(),
            0
         );
      }

      /**
       * @function formValidate()
       * validate the form values.
       * @param {string} op
       *        The key of the operation we are validating. Can be either
       *        "add", "update" or "destroy"
       * @return {bool}
       *         true if all values pass validation.  false otherwise.
       */
      formValidate(op) {
         // op : ['add', 'update', 'destroy']

         if (!this.$form.validate()) {
            // TODO : Error message

            this.formReady();
            this.buttonSaveEnable();
            return false;
         }

         var errors = [];

         // TODO: replace with manual checking of Application Name
         switch (op) {
            case "add":
               // make sure no other Applications have the same name.
               var values = this.formValues();
               values.name = values.label;
               var mockApp = this.AB.applicationNew(values);
               var matchingApps = [];
               (this.AB.applications() || []).forEach((app) => {
                  // NOTE: .areaKey() uses .name in a formatted way, so
                  // any matching .areaKey() would be a matching .name
                  if (app.areaKey() == mockApp.areaKey()) {
                     matchingApps.push(app);
                  }
               });
               if (matchingApps.length > 0) {
                  errors.push({
                     attr: "label",
                     msg: L("Name ({0}) is already in use.", [mockApp.label]),
                  });
               }
               break;
         }

         if (errors.length > 0) {
            var hasFocus = false;
            errors.forEach((e) => {
               this.$form.markInvalid(e.attr, e.msg);
               if (!hasFocus) {
                  this.$form.elements[e.attr].focus();
                  hasFocus = true;
               }
            });

            this.formReady();
            this.buttonSaveEnable();
            return false;
         }

         return true;
      }

      /**
       * @function formValues()
       *
       * return an object hash of name:value pairs of the current Form.
       *
       * @return {obj}
       */
      formValues() {
         // return the current values of the Form elements.
         var values = this.$form.getValues();
         values.roleAccess = $$(this.ids.appFormPermissionList).getSelectedId();
         if (!Array.isArray(values.roleAccess)) {
            values.roleAccess = [values.roleAccess];
         }
         values.accessManagers = this.accessManagerUI.values();
         values.translationManagers = this.translationManagerUI.values();
         return values;
      }

      /**
       * @function permissionAddNew
       *
       * create a new permission entry based upon the current Application.label
       *
       * This not only adds it to our Permission List, but also selects it.
       *
       * @param {string} appName	The Application.label of the current Application
       */
      // permissionAddNew: function (appName) {
      //    // add new role entry
      //    $$(ids.appFormPermissionList).add(
      //       {
      //          id: "newRole",
      //          name: _logic.permissionName(appName),
      //          isApplicationRole: true,
      //          markCheckbox: 1,
      //       },
      //       0
      //    );

      //    // Select new role
      //    var selectedIds = $$(ids.appFormPermissionList).getSelectedId(
      //       true
      //    );
      //    selectedIds.push("newRole");
      //    $$(ids.appFormPermissionList).select(selectedIds);
      // },

      /**
       * @function permissionClick
       *
       * Process when a permission entry in the list is clicked.
       */
      permissionClick(id /*, e, node*/) {
         var List = $$(this.ids.appFormPermissionList);

         var item = List.getItem(id);

         if (List.getItem(id).isApplicationRole) {
            return;
         }

         if (List.isSelected(id)) {
            item.markCheckbox = 0;
            List.unselect(id);
         } else {
            item.markCheckbox = 1;
            var selectedIds = List.getSelectedId();

            if (typeof selectedIds === "string" || !isNaN(selectedIds)) {
               if (selectedIds) selectedIds = [selectedIds];
               else selectedIds = [];
            }

            selectedIds.push(id);

            List.select(selectedIds);
            List.updateItem(id, item);
         }
      }

      /**
       * @function permissionName
       *
       * returns a formatted name for a Permission Role based upon the provided Application.label
       *
       * @param {string} appName	the current value of the Application.label
       * @return {string} 	Permission Role Name.
       */
      // permissionName(appName) {
      //    return appName + " Application Role";
      // }

      /**
       * @method permissionPopulate
       * fill out the Permission list
       * @param {ABApplication} application	the current ABApplication we are editing
       */
      permissionPopulate(application) {
         var PermForm = $$(this.ids.appFormPermissionList);
         // Get user's roles
         PermForm.showProgress({ type: "icon" });

         var availableRoles = this.AB.Account.rolesAll().map((r) => {
            return { id: r.id, name: r.name };
         });
         if (application) {
            availableRoles
               .filter((r) => application.roleAccess.indexOf(r.id) > -1)
               .map((r) => {
                  r.markCheckbox = 1;
               });
         }
         PermForm.clearAll();
         PermForm.parse(availableRoles);
         var selectedIDs = availableRoles
            .filter((r) => r.markCheckbox)
            .map((r) => r.id);
         PermForm.select(selectedIDs);
         availableRoles.forEach(function (r) {
            if (selectedIDs.indexOf(r.id) > -1) {
               var item = PermForm.getItem(r.id);
               item.markCheckbox = 1;
               PermForm.updateItem(r.id, item);
            }
         });
         PermForm.hideProgress();
      }

      /**
       * @function permissionRemoveNew()
       *
       * Intended to be called when the USER unselects the option to create a Permission
       * for this Application.
       *
       * We remove any Permission Role created for this Application.
       */
      // permissionRemoveNew: function () {
      //    // find any roles that are put here from our application form:
      //    var appRoles = $$(ids.appFormPermissionList).find(function (
      //       perm
      //    ) {
      //       return perm.isApplicationRole;
      //    });

      //    // remove them:
      //    appRoles.forEach(function (r) {
      //       $$(ids.appFormPermissionList).remove(r.id);
      //    });
      // },

      /*
       * permissionRenameRole
       *
       * When the name of the Appliction changes, change the Name of the Permission as well.
       *
       * @param {string} newValue  the current name of the application
       * @param {string} oldValue  the previous name of the application
       */
      // permissionRenameRole(newValue, oldValue) {
      //    var editRole = $$(ids.appFormPermissionList).find(function (d) {
      //       return d.name === _logic.permissionName(oldValue);
      //    });

      //    editRole.forEach(function (r) {
      //       var editItem = $$(ids.appFormPermissionList).getItem(r.id);
      //       editItem.name = _logic.permissionName(newValue);

      //       $$(ids.appFormPermissionList).updateItem(
      //          editItem.id,
      //          editItem
      //       );
      //    });
      // }

      /**
       * @function permissionSave()
       *
       * step through saving the current Permission Settings and associating
       * them with the current Application.
       *
       * @param {ABApplication} App  	The current Application we are working with.
       * @return {Promise}			.resolve( {Permission} ) if one is created for this App
       */
      // permissionSave(app) {
      //    debugger;
      //    //// REFACTOR:
      //    // this step implies that ab_choose_form understands the intracies of how
      //    // ABApplication and Permissions work.
      //    return new Promise((resolve, reject) => {
      //       var saveRoleTasks = [],
      //          appRole = null;

      //       //// Process the option to create a newRole For this Application:

      //       // if the button is set
      //       if ($$(ids.appFormCreateRoleButton).getValue()) {
      //          // check to see if we already have a permission that isApplicationRole
      //          var selectedPerms = $$(
      //             ids.appFormPermissionList
      //          ).getSelectedItem(true);
      //          selectedPerms = selectedPerms.filter((perm) => {
      //             return perm.isApplicationRole;
      //          });

      //          // if not, then create one:
      //          if (selectedPerms.length == 0) {
      //             // Create new role for application
      //             saveRoleTasks.push(function (cb) {
      //                app.createPermission()
      //                   .then(function (result) {
      //                      // remember the Role we just created
      //                      appRole = result;
      //                      cb();
      //                   })
      //                   .catch(cb);
      //             });
      //          }
      //       } else {
      //          // Delete any existing application roles
      //          saveRoleTasks.push(function (cb) {
      //             app.deletePermission()
      //                .then(function () {
      //                   cb();
      //                })
      //                .catch(cb);
      //          });
      //       }

      //       //// Now process any additional roles:

      //       // get array of selected permissions that are not our newRole
      //       var permItems = $$(ids.appFormPermissionList).getSelectedItem(
      //          true
      //       );
      //       permItems = permItems.filter(function (item) {
      //          return item.id !== "newRole";
      //       }); // Remove new role item

      //       // Make sure Application is linked to selected permission items:
      //       saveRoleTasks.push(function (cb) {
      //          // ok, so we removed the 'newRole' entry, but we might
      //          // have created an entry for it earlier, if so, add in
      //          // the created one here:
      //          if (
      //             $$(ids.appFormCreateRoleButton).getValue() &&
      //             appRole
      //          ) {
      //             // make sure it isn't already in there:
      //             var appRoleItem = permItems.filter(function (item) {
      //                return item.id == appRole.id;
      //             });
      //             if (!appRoleItem || appRoleItem.length < 1) {
      //                // if not, add it :
      //                permItems.push({
      //                   id: appRole.id,
      //                   isApplicationRole: true,
      //                });
      //             }
      //          }

      //          // Assign Role Permissions
      //          app.assignPermissions(permItems)
      //             .then(function () {
      //                cb();
      //             })
      //             .catch(cb);
      //       });

      //       async.series(saveRoleTasks, function (err, results) {
      //          if (err) {
      //             reject(err);
      //          } else {
      //             // we return the instance of the newly created Permission.
      //             resolve(appRole);
      //          }
      //       });
      //    });

      //    //// REFACTOR QUESTION:
      //    // why are we updating the app.permissions with this data structure?
      //    // where is this data structure being used?
      //    // Earlier we are using another structure (permissionAddNew()) ... how is that related to this?

      //    // // Final task
      //    // saveRoleTasks.push(function (cb) {
      //    // 	// Update store app data
      //    // 	var applicationData = self.data.filter(function (d) { return d.id == app.id; });
      //    // 	applicationData.forEach(function (app) {
      //    // 		app.attr('permissions', $.map(permItems, function (item) {
      //    // 			return {
      //    // 				application: app.id,
      //    // 				permission: item.id,
      //    // 				isApplicationRole: item.isApplicationRole
      //    // 			}
      //    // 		}));
      //    // 	});

      //    // 	q.resolve(appRole);
      //    // 	cb();
      //    // })
      // }

      /**
       * @function show()
       *
       * Show the Form Component.
       */
      show() {
         $$(this.ids.component).show();
      }

      /*
         this.actions({
            // initiate a request to create a new Application
            transitionApplicationForm: function (application) {
               // if no application is given, then this should be a [create] operation,

               // so clear our AppList
               if ("undefined" == typeof application) {
                  App.actions.unselectApplication();
               }

               // now prepare our form:
               _logic.formReset();
               if (application) {
                  // populate Form here:
                  _logic.formPopulate(application);
               }
               _logic.permissionPopulate(application);
               _logic.show();
            },
         });
         */
   }

   return new ABChooseForm();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_choose_list.js":
/*!**************************************************!*\
  !*** ./src/rootPages/Designer/ui_choose_list.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_common_popupEditMenu */ "./src/rootPages/Designer/ui_common_popupEditMenu.js");
/*
 * UI Choose List
 *
 * Display a list of Applications we can work with.
 *
 *
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   // const AppList = AB_Choose_List_Factory(AB);
   // const AppForm = AB_Choose_Form_Factory(AB);

   const uiConfig = AB.Config.uiSettings();
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   const UI_Choose_List_Menu = (0,_ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   class UIChooseList extends UIClass {
      constructor() {
         super("abd_choose_list", {
            toolbar: "",
            buttonCreateNewApplication: "",
            uploader: "",
            exporter: "",
            list: "",
         });
      }

      ui() {
         return {
            id: this.ids.component,
            responsive: "hide",
            type: "space",

            cols: [
               {
                  maxWidth: uiConfig.appListSpacerColMaxWidth,
                  minWidth: uiConfig.appListSpacerColMinWidth,
                  width: uiConfig.appListSpacerColMaxWidth,
               },
               {
                  responsiveCell: false,
                  rows: [
                     {
                        maxHeight: uiConfig.appListSpacerRowHeight,
                        hidden: uiConfig.hideMobile,
                     },
                     //
                     // ToolBar
                     //
                     {
                        view: "toolbar",
                        css: "webix_dark",
                        id: this.ids.toolBar,
                        cols: [
                           { view: "spacer", width: 10 },
                           {
                              view: "label",
                              label: L("Applications"),
                              fillspace: true,
                              on: {
                                 onAfterRender() {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                           // {
                           //    view: "button",
                           //    type: "icon",
                           //    label: labels.component.administration,
                           //    icon: "fa fa-user",
                           //    autowidth: true,
                           //    css: "webix_transparent",
                           //    click: () => {
                           //       App.actions.transitionAdministration();
                           //    },
                           // },

                           // {
                           //    view: "button",
                           //    type: "icon",
                           //    label: L("Settings"),
                           //    icon: "fa fa-cog",
                           //    autowidth: true,
                           //    css: "webix_transparent",
                           //    click: () => {
                           //       this.emit("view.config");
                           //    },
                           // },
                           {
                              id: this.ids.buttonCreateNewApplication,
                              view: "button",
                              label: L("Add new application"),
                              autowidth: true,
                              type: "icon",
                              icon: "fa fa-plus",
                              css: "webix_transparent",
                              click: () => {
                                 // Inform our Chooser we have a request to create an Application:
                                 this.emit("view.form", null); // leave null for CREATE
                              },
                              on: {
                                 onAfterRender() {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                           {
                              view: "uploader",
                              id: this.ids.uploader,
                              label: L("Import"),
                              autowidth: true,
                              upload: "/definition/import",
                              multiple: false,
                              type: "icon",
                              icon: "fa fa-upload no-margin",
                              autosend: true,
                              css: "webix_transparent",
                              on: {
                                 onAfterFileAdd: () => {
                                    $$(this.ids.uploader).disable();
                                 },
                                 onFileUpload: (/*item, response */) => {
                                    // the file upload process has finished
                                    // reload the page:
                                    window.location.reload();
                                    return false;
                                 },
                                 onFileUploadError: (
                                    details /*, response */
                                 ) => {
                                    // {obj} details
                                    //   .file : {obj} file details hash
                                    //   .name : {string} filename
                                    //   .size : {int} file size
                                    //   .status : {string} "error"
                                    //   .xhr :  {XHR Object}
                                    //      .responseText
                                    //      .status : {int}  404
                                    //      .statusText : {string}

                                    this.AB.notify.developer(
                                       "Error uploading file",
                                       {
                                          url: details.xhr.responseURL,
                                          status: details.status,
                                          code: details.xhr.status,
                                          response: details.xhr.responseText,
                                       }
                                    );
                                    $$(this.ids.uploader).enable();
                                    return false;
                                 },
                                 onAfterRender() {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },

                           {
                              view: "button",
                              id: this.ids.exporter,
                              label: L("Export All"), // labels.common.export,
                              autowidth: true,
                              type: "icon",
                              icon: "fa fa-download",
                              css: "webix_transparent",
                              click: function () {
                                 window.location.assign(
                                    "/definition/export/all?download=1"
                                 );
                              },
                              on: {
                                 onAfterRender() {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },

                     //
                     // The List of Applications
                     //
                     {
                        id: this.ids.list,
                        view: "list",
                        css: "ab-app-select-list",
                        template: (obj, common) => {
                           return this.templateListItem(obj, common);
                        },
                        type: {
                           height: uiConfig.appListRowHeight, // Defines item height
                           iconGear: function (app) {
                              return `<span class="webix_icon fa fa-cog" data-cy="edit_${app.id}"></span>`;
                           },
                           iconAdmin: function (app) {
                              return app.isAdminApp
                                 ? "<span class='webix_icon fa fa-circle-o-notch'></span> "
                                 : "";
                           },
                        },
                        select: false,
                        onClick: {
                           "ab-app-list-item": (ev, id, trg) => {
                              return this.onClickListItem(ev, id, trg);
                           },
                           "ab-app-list-edit": (ev, id, trg) => {
                              return this.onClickListEdit(ev, id, trg);
                           },
                        },
                        onHover: {},
                        on: {
                           onAfterRender() {
                              this.data.each((a) => {
                                 UIClass.CYPRESS_REF(
                                    this.getItemNode(a.id),
                                    a.id
                                 );
                              });
                           },
                        },
                     },
                     {
                        maxHeight: uiConfig.appListSpacerRowHeight,
                        hidden: uiConfig.hideMobile,
                     },
                  ],
               },
               {
                  maxWidth: uiConfig.appListSpacerColMaxWidth,
                  minWidth: uiConfig.appListSpacerColMinWidth,
                  width: uiConfig.appListSpacerColMaxWidth,
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$list = $$(this.ids.list);
         // {webix.list}  The webix component that manages our Application List

         webix.extend(this.$list, webix.ProgressBar);
         webix.extend(this.$list, webix.OverlayBox);

         // Setup our popup Editor Menu for our Applications
         this.MenuComponent = new UI_Choose_List_Menu(this.ids.component);
         this.MenuComponent.init(AB);
         var options = [
            {
               label: L("Edit"), //labels.common.edit,
               icon: "fa fa-pencil-square-o",
               command: "edit",
            },
            {
               label: L("Export"), //labels.common.export,
               icon: "fa fa-download",
               command: "export",
            },
            {
               label: L("Delete"), // labels.common.delete,
               icon: "fa fa-trash",
               command: "delete",
            },
         ];
         this.MenuComponent.menuOptions(options);
         this.MenuComponent.on("click", (action) => {
            var selectedApp = this.$list.getSelectedItem();

            switch (action) {
               case "edit":
                  this.emit("edit.form", selectedApp);
                  break;

               case "delete":
                  webix.confirm({
                     title: L("Delete {0}?", [L("Application")]),
                     text: L("Do you want to delete <b>{0}</b>?", [
                        selectedApp.label,
                     ]),
                     ok: L("Yes"),
                     cancel: L("No"),
                     callback: async (result) => {
                        if (!result) return;

                        this.busy();
                        try {
                           await selectedApp.destroy();
                           this.refreshList();
                           webix.message({
                              type: "success",
                              text: L("{0} successfully deleted.", [
                                 selectedApp.label,
                              ]),
                           });
                        } catch (e) {
                           webix.message({
                              type: "error",
                              text: L("There was an error deleting {0}.", [
                                 selectedApp.label,
                              ]),
                           });
                        }
                        this.ready();
                     },
                  });
                  break;

               case "export":
                  // Download the JSON file to disk
                  window.location.assign(
                     `/definition/export/${selectedApp.id}?download=1`
                  );
                  break;
            }
         });

         // listen for the AllApplications response:
         this.AB.Network.on(
            "definitions.allapplications",
            (context, err, allDefinitions) => {
               this.ready();
               if (err) {
                  // log the error
                  this.AB.notify.developer(err, {
                     plugin: "ABDesigner",
                     context:
                        "ui_choose_list:init(): /definition/allapplications",
                  });
                  context?.reject?.(err);
                  return;
               }

               this.AB.definitionsParse(allDefinitions);

               context?.resolve?.();
            }
         );

         this._handler_reload = (def) => {
            if (def?.type == "application") {
               this.loaded = false;
               this.loadData();
            } else if (!def) {
               this.AB.notify.developer(new Error("No def passed"), {
                  plugin: "ABDesigner",
                  context: "_handler_reload(): /definition/allapplications",
               });
            }
         };
         // {fn}
         // The handler that triggers a reload of our Application List
         // when we are alerted of changes to our applications.

         // return Promise.all([AppList.init(AB) /*, AppForm.init(AB)*/]);
         return this.loadAllApps().then(() => {
            // NOTE: .loadAllApps() will generate a TON of "definition.updated"
            // events.  So add these handlers after that is all over.

            // Refresh our Application List each time we are notified of a change
            // in our Application definitions:
            this.AB.on("definition.created", this._handler_reload);
         });
      }

      //
      // Logic Methods
      //

      busy() {
         this.$list.disable();
         if (this.$list.showProgress) this.$list.showProgress({ type: "icon" });
      }

      /**
       * @method loadAllApps();
       * specifically call for loading all the available ABApplications so that a
       * builder can work with them.
       * @return {Promise}
       */
      async loadAllApps() {
         // NOTE: we only actually perform this 1x.
         // so track the _loadInProgress as our indicator of having done that.
         if (!this._loadInProgress) {
            this.busy();
            this._loadInProgress = new Promise((resolve, reject) => {
               var jobResponse = {
                  key: "definitions.allapplications",
                  context: { resolve, reject },
               };

               this.AB.Network.get(
                  {
                     url: `/definition/allapplications`,
                  },
                  jobResponse
               );
            });
         }

         return this._loadInProgress;
      }

      /**
       * @function loadData
       *
       * Load all the ABApplications and display them in our App List
       */
      async loadData() {
         await this.loadAllApps();

         if (this.loaded) return;

         this.loaded = true;

         // Get applications data from the server
         this.busy();

         // User needs Access To Role (System Designer) in order to see
         // app.isSystemObj ABApplications.
         var f = (app) => !app.isSystemObj;

         if (this.AB.Account.isSystemDesigner()) {
            f = () => true;
         }
         var allApps = this.AB.applications(f);
         this.dcEditableApplications = new webix.DataCollection({
            data: allApps || [],
         });
         // {webix.DataCollection} dcEditableApplications
         // a list of all our applications we are able to edit.

         // Now for each of our Apps, be sure to listen for either
         // .updated or .deleted and then reload our list.
         ["definition.updated", "definition.deleted"].forEach((e) => {
            allApps.forEach((a) => {
               // make sure we only have 1 listener registered.
               a.removeListener(e, this._handler_reload);
               a.on(e, this._handler_reload);
            });
         });

         this.dcEditableApplications.attachEvent(
            "onAfterAdd",
            (/* id, index */) => {
               this.refreshOverlay();
            }
         );

         this.dcEditableApplications.attachEvent(
            "onAfterDelete",
            (/* id */) => {
               this.refreshOverlay();
            }
         );

         // // TODO: we should track the order in the List and save as
         // // .sortOrder ... or .local.sortOrder
         // this.dcEditableApplications.sort("label");
         // moved to .refreshList()

         this.refreshList();
         this.ready();
      }

      /**
       * @function onClickListEdit
       * UI updates for when the edit gear is clicked
       */
      onClickListEdit(ev, id, trg) {
         // Show menu
         this.MenuComponent.show(trg);
         this.$list.select(id);

         return false; // block default behavior
      }

      /**
       * @method onClickListItem
       * An item in the list is selected. So update the workspace with that
       * object.
       */
      onClickListItem(ev, id /*, trg */) {
         this.$list.select(id);
         let selectedApp = this.$list.getItem(id);
         if (selectedApp) {
            // set the common App so it is accessible for all the Applications views
            selectedApp.App = this.AB.App;

            // We've selected an Application to work with
            this.emit("view.workplace", selectedApp);
         }
         return false; // block default behavior
      }

      /**
       * @method ready
       * remove the busy indicator on our App List
       */
      ready() {
         this.$list.enable();
         if (this.$list.hideProgress) this.$list.hideProgress();
      }

      /**
       * @method refreshList
       * Apply our list of ABApplication data to our AppList
       */
      refreshList() {
         this.$list.clearAll();
         this.$list.data.unsync();
         this.$list.data.sync(this.dcEditableApplications);
         this.$list.sort("label", "asc");
         this.refreshOverlay();
         this.$list.refresh();
         this.ready();
      }

      /**
       * @method refreshOverlay
       * If we have no items in our list, display a Message.
       */
      refreshOverlay() {
         if (!this.$list.count())
            this.$list.showOverlay(L("There is no application data"));
         else this.$list.hideOverlay();
      }

      /**
       * @method show
       * Trigger our List component to show
       */
      show() {
         super.show();

         // start things off by loading the current list of Applications
         this.loadData();
      }

      templateListItem(obj, common) {
         // JAMES: here are the warning interface:
         // obj.warnings() : Returns the warning for this specific object (Application)
         //       {array} [  { message, data } ]
         //             message: {string} A description of the warning
         //             data: {obj} An object holding related data values.
         //
         // obj.warningsAll(): Like .warnings() but will return the warnings of
         //    this object and any of it's sub objects.
         //
         //
         var numWarnings = (obj.warningsAll() || []).length;
         return `<div class='ab-app-list-item'>
   <div class='ab-app-list-info'>
      <div class='ab-app-list-name'>${common.iconAdmin(obj)}${
            obj.label ?? ""
         }(${numWarnings})</div>
      <div class='ab-app-list-description'>${obj.description ?? ""}</div>
   </div>
   <div class='ab-app-list-edit'>
      ${common.iconGear(obj)}
   </div>
</div>`;
      }
   }
   return new UIChooseList();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_class.js":
/*!********************************************!*\
  !*** ./src/rootPages/Designer/ui_class.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * ui_class
 *
 * A common UI object for our UI pages.
 *

 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   if (!myClass) {
      myClass = class UI extends AB.ClassUI {
         constructor(...params) {
            super(...params);

            this.CurrentApplicationID = null;
            // {string} uuid
            // The current ABApplication.id we are working with.

            this.CurrentObjectID = null;
            // {string}
            // the ABObject.id of the object we are working with.
         }

         static L() {
            return function (...params) {
               return AB.Multilingual.labelPlugin("ABDesigner", ...params);
            };
         }

         /**
          * @method CurrentApplication
          * return the current ABApplication being worked on.
          * @return {ABApplication} application
          */
         get CurrentApplication() {
            return this.AB.applicationByID(this.CurrentApplicationID);
         }

         /**
          * @function applicationLoad
          * save the ABApplication.id of the current application.
          * @param {ABApplication} app
          */
         applicationLoad(app) {
            this.CurrentApplicationID = app?.id;
         }

         objectLoad(obj) {
            this.CurrentObjectID = obj?.id;
         }

         /**
          * @method CurrentObject()
          * A helper to return the current ABObject we are working with.
          * @return {ABObject}
          */
         get CurrentObject() {
            return this.AB.objectByID(this.CurrentObjectID);
         }
      };
   }

   return myClass;
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_common_list.js":
/*!**************************************************!*\
  !*** ./src/rootPages/Designer/ui_common_list.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_common_popupEditMenu */ "./src/rootPages/Designer/ui_common_popupEditMenu.js");
/*
 * ab_common_list
 *
 * A common interface for displaying AB category list widget
 *
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB, options) {
   var UIListEditMenu = (0,_ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Common_List extends AB.ClassUI {
      constructor(attributes) {
         // attributes.idBase = attributes.idBase || "ui_common_list";
         var base = attributes.idBase || "ui_common_list";
         super(base, {
            listSetting: "",
            list: "",
            searchText: "",
            sort: "",
            group: "",
            buttonNew: "",
         });

         this.idBase = base;

         this.labels = {
            addNew: "Add new item",
            confirmDeleteTitle: "Delete Item",
            title: "Items",
            searchPlaceholder: "Item name",
            renameErrorMessage: "error renaming {0}",

            // we can reuse some of the Object ones:
            confirmDeleteMessage: "Do you want to delete <b>{0}</b>?",
            listSearch: "Search",
            listSetting: "Setting",
            listSort: "Sort",
            listAsc: "A -> Z",
            listDesc: "Z -> A",
            listGroup: "Group",
         };
         // copy in any passed in labels:
         if (attributes.labels) {
            for (var key in attributes.labels) {
               this.labels[key] = attributes.labels[key];
            }
         }
         // {lookup hash} id : Label Key
         // we allow the creating UI component to pass in alternate
         // label keys for this list.  That's how to customize the labels
         // for the current situation.

         attributes.menu = attributes.menu || {};
         attributes.menu.copy =
            typeof attributes.menu.copy == "undefined"
               ? true
               : attributes.menu.copy;
         attributes.menu.exclude =
            typeof attributes.menu.exclude == "undefined"
               ? true
               : attributes.menu.exclude;
         this.attributes = attributes;

         /*
          * _templateListItem
          *
          * The Process Row template definition.
          */
         this._templateListItem =
            attributes.templateListItem ||
            [
               "<div class='ab-object-list-item'>",
               "#label##warnings#",
               "{common.iconGear}",
               "</div>",
            ].join("");

         this.CurrentApplication = null;
         this.itemList = null;

         this._initialized = false;
         this._settings = {};
      }

      ui() {
         // the popup edit list for each entry in the list.
         this.PopupEditComponent = new UIListEditMenu(this.ids.component);

         //PopupListEditMenuComponent
         // console.log("look here------------------>", App.custom.editunitlist.view);

         var ids = this.ids;
         // for our onAfterRender() handler

         // Our webix UI definition:
         return {
            id: this.ids.component,
            rows: [
               {
                  view: AB.custom.editunitlist.view, // "editunitlist"
                  id: this.ids.list,
                  width: uiConfig.columnWidthLarge,

                  select: true,

                  editaction: "custom",
                  editable: true,
                  editor: "text",
                  editValue: "label",

                  uniteBy: (/* item */) => {
                     return L(this.labels.title);
                  },
                  template: (obj, common) => {
                     return this.templateListItem(obj, common);
                  },
                  type: {
                     height: 35,
                     headerHeight: 35,
                     iconGear: (obj) => {
                        return `<div class="ab-object-list-edit"><span class="webix_icon fa fa-cog" data-cy="${this.ids.list}_edit_${obj.id}"></span></div>`;
                     },
                  },
                  on: {
                     onAfterSelect: (id) => {
                        this.onSelectItem(id);
                     },
                     onBeforeEditStop: (state, editor) => {
                        this.onBeforeEditStop(state, editor);
                     },
                     onAfterEditStop: (state, editor, ignoreUpdate) => {
                        this.onAfterEditStop(state, editor, ignoreUpdate);
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
                  onClick: {
                     "ab-object-list-edit": (e, id, trg) => {
                        this.clickEditMenu(e, id, trg);
                     },
                  },
               },
               {
                  view: "accordion",
                  multi: true,
                  css: "ab-object-list-filter",
                  rows: [
                     {
                        id: this.ids.listSetting,
                        header: L(this.labels.listSetting),
                        headerHeight: 45,
                        headerAltHeight: 45,
                        body: {
                           padding: 5,
                           rows: [
                              {
                                 id: this.ids.searchText,
                                 view: "search",
                                 icon: "fa fa-search",
                                 label: L(this.labels.listSearch),
                                 labelWidth: 80,
                                 placeholder: L(this.labels.searchPlaceholder),
                                 height: 35,
                                 keyPressTimeout: 100,
                                 on: {
                                    onAfterRender() {
                                       AB.ClassUI.CYPRESS_REF(this);
                                    },
                                    onTimedKeyPress: () => {
                                       this.listSearch();
                                       this.save();
                                    },
                                 },
                              },
                              {
                                 id: this.ids.sort,
                                 view: "segmented",
                                 label: L(this.labels.listSort),
                                 labelWidth: 80,
                                 height: 35,
                                 options: [
                                    {
                                       id: "asc",
                                       value: L(this.labels.listAsc),
                                    },
                                    {
                                       id: "desc",
                                       value: L(this.labels.listDesc),
                                    },
                                 ],
                                 on: {
                                    onAfterRender() {
                                       this.$view
                                          .querySelectorAll("button")
                                          .forEach((b) => {
                                             var bid =
                                                b.getAttribute("button_id");
                                             AB.ClassUI.CYPRESS_REF(
                                                b,
                                                `${ids.sort}_${bid}`
                                             );
                                          });
                                    },
                                    onChange: (newVal /*, oldVal */) => {
                                       this.listSort(newVal);
                                       this.save();
                                    },
                                 },
                              },
                              {
                                 id: this.ids.group,
                                 view: "checkbox",
                                 label: L(this.labels.listGroup),
                                 labelWidth: 80,
                                 on: {
                                    onAfterRender() {
                                       AB.ClassUI.CYPRESS_REF(this);
                                    },
                                    onChange: (newVal /*, oldVal */) => {
                                       this.listGroup(newVal);
                                       this.save();
                                    },
                                 },
                              },
                           ],
                        },
                     },
                  ],
                  on: {
                     onAfterCollapse: (/* id */) => {
                        this.listSettingCollapse();
                        this.save();
                     },
                     onAfterExpand: (/* id */) => {
                        this.listSettingExpand();
                        this.save();
                     },
                  },
               },
               {
                  view: "button",
                  css: "webix_primary",
                  id: this.ids.buttonNew,
                  value: L(this.labels.addNew),
                  type: "form",
                  click: () => {
                     this.clickAddNew(true); // pass true so it will select the new object after you created it
                  },
                  on: {
                     onAfterRender() {
                        AB.ClassUI.CYPRESS_REF(this);
                     },
                  },
               },
            ],
         };
      }

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;

         if ($$(this.ids.component)) $$(this.ids.component).adjust();

         this.$list = $$(this.ids.list);
         if (this.$list) {
            webix.extend(this.$list, webix.ProgressBar);
            this.$list.adjust();
         }

         this.PopupEditComponent.init(AB, {
            // onClick: _logic.callbackProcessEditorMenu,
            hideCopy: !this.attributes.menu.copy,
            hideExclude: !this.attributes.menu.exclude,
         });

         this.PopupEditComponent.on("click", (command) => {
            var selectedItem = this.$list.getSelectedItem(false);
            switch (command) {
               case "delete":
                  this.remove();
                  break;

               case "rename":
                  this.rename();
                  break;

               case "exclude":
                  this.emit("exclude", selectedItem);
                  break;

               case "copy":
                  this.copy(selectedItem);
                  // this.emit("copy", selectedItem);
                  break;

               default:
                  this.emit("menu", {
                     command: command,
                     id: selectedItem.id,
                  });
                  break;
            }
         });

         this._settings = this.AB.Storage.get(this.idBase) || {
            objectlistIsOpen: false,
            objectlistSearchText: "",
            objectlistSortDirection: "",
            objectlistIsGroup: false,
         };

         // mark initialed
         this._initialized = true;
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Process List from the provided ABApplication
       *
       * If no ABApplication is provided, then show an empty form. (create operation)
       *
       * @param {ABApplication} application  	[optional] The current ABApplication
       *										we are working with.
       */
      // applicationLoad(application) {
      //    // this.CurrentApplication = application;
      // }

      dataLoad(data) {
         this.busy();

         // get a DataCollection of all our objects
         this.itemList = new webix.DataCollection({
            data: data,
         });

         // setup object list settings
         var $listSetting = $$(this.ids.listSetting);
         $listSetting.getParentView().blockEvent();
         $listSetting.define(
            "collapsed",
            this._settings.objectlistIsOpen != true
         );
         $listSetting.refresh();
         $listSetting.getParentView().unblockEvent();

         var $searchText = $$(this.ids.searchText);
         $searchText.blockEvent();
         $searchText.setValue(this._settings.objectlistSearchText);
         $searchText.unblockEvent();

         var $sort = $$(this.ids.sort);
         $sort.blockEvent();
         $sort.setValue(this._settings.objectlistSortDirection);
         $sort.unblockEvent();

         var $group = $$(this.ids.group);
         $group.blockEvent();
         $group.setValue(this._settings.objectlistIsGroup);
         $group.unblockEvent();

         // clear our list and display our objects:
         var List = this.$list;
         List.clearAll();
         List.data.unsync();
         List.data.sync(this.itemList);
         List.refresh();
         List.unselectAll();

         // sort objects
         this.listSort(this._settings.objectlistSortDirection);

         // filter object list
         this.listSearch();

         // hide progress loading cursor
         this.ready();
      }

      clickEditMenu(e, id, trg) {
         // Show menu
         this.PopupEditComponent.show(trg);
         return false;
      }

      /**
       * @method copy
       * make a copy of the current selected item.
       *
       * copies should have all the same .toObj() data,
       * but will need unique names, and ids.
       *
       * we start the process by making a copy and then
       * having the user enter a new label/name for it.
       *
       * our .afterEdit() routines will detect it is a copy
       * then alert the parent UI component of the "copied" data
       *
       * @param {obj} selectedItem the currently selected item in
       * 		our list.
       */
      copy(selectedItem) {
         var newItem = selectedItem.toObj();
         newItem.id = "copy_" + (this.itemList ? this.itemList.count() : "01");
         delete newItem.translations;
         newItem.name = newItem.name + " copy";
         newItem.label = newItem.name;

         // find the current index of the item being copied:
         var list = this.$list;
         var selectedIndex = list.getIndexById(list.getSelectedId());

         // insert copy in it's place and make it editable:
         list.add(newItem, selectedIndex);
         list.select(newItem.id);
         list.edit(newItem.id);
      }

      listSettingCollapse() {
         this._settings.objectlistIsOpen = false;
      }

      listSettingExpand() {
         this._settings.objectlistIsOpen = true;
      }

      busy() {
         this.$list?.showProgress?.({ type: "icon" });
      }

      ready() {
         this.$list?.hideProgress?.();
      }

      listSearch() {
         var searchText = $$(this.ids.searchText).getValue().toLowerCase();

         this.$list.filter(function (item) {
            return (
               !item.label || item.label.toLowerCase().indexOf(searchText) > -1
            );
         });

         this._settings.objectlistSearchText = searchText;
      }

      listSort(sortType) {
         if (this.itemList == null) return;
         this.itemList.sort("label", sortType);
         this.listSearch();
         this._settings.objectlistSortDirection = sortType;
      }

      listGroup(isGroup) {
         if (isGroup == true) {
            this.$list.define("uniteBy", (item) => {
               return item.label.toUpperCase().substr(0, 1);
            });
         } else {
            this.$list.define("uniteBy", (/* item */) => {
               return L(this.labels.title);
            });
         }
         this.$list.refresh();
         this._settings.objectlistIsGroup = isGroup;
      }

      listCount() {
         if (this.$list) return this.$list.count();
      }

      selectedItem() {
         return this.$list.getSelectedItem(false);
      }

      onAfterEditStop(state, editor /*, ignoreUpdate */) {
         this.showGear(editor.id);

         if (state.value != state.old) {
            this.busy();

            var selectedItem = this.$list.getSelectedItem(false);
            selectedItem.label = state.value;

            // if this item supports .save()
            if (selectedItem.save) {
               // Call server to rename
               selectedItem
                  .save()
                  .catch((err) => {
                     this.ready();

                     webix.alert({
                        title: L("Alert"),
                        text: L(this.labels.renameErrorMessage, state.old),
                     });
                     this.AB.notify.developer(err, {
                        context:
                           "ui_common_list:onAfterEditStop():Error saving item.",
                        id: selectedItem.id,
                        value: state.value,
                     });
                  })
                  .then(() => {
                     this.ready();
                  });
            } else {
               // maybe this is from a .copy() command:
               if (selectedItem.id.indexOf("copy_") == 0) {
                  // if so, then our default name should be what
                  // the label is:
                  selectedItem.name = selectedItem.label;
                  var currID = selectedItem.id;

                  // remove our temp id
                  delete selectedItem.id;

                  // alert the parent UI of the copied data:
                  this.emit("copied", {
                     item: selectedItem,
                     currID: currID,
                  });
               }
            }
         }
      }

      onBeforeEditStop(state /*, editor */) {
         var selectedItem = this.$list.getSelectedItem(false);
         selectedItem.label = state.value;

         // if this item supports isValid()
         if (selectedItem.isValid) {
            var validator = selectedItem.isValid();
            if (validator.fail()) {
               selectedItem.label = state.old;

               return false; // stop here.
            }
         }

         return true;
      }

      /**
       * @function onSelectItem()
       *
       * Perform these actions when an Process is selected in the List.
       */
      onSelectItem(id) {
         var process = this.$list.getItem(id);

         // _logic.callbacks.onChange(object);
         this.emit("selected", process);

         this.showGear(id);
      }

      /**
       * @function save()
       *
       */
      save() {
         // if this UI has not been initialed, then skip it
         if (!this._initialized) return;

         // CurrentApplication.save();
         this.AB.Storage.set(this.idBase, this._settings);
      }

      selectItem(id) {
         this.$list.blockEvent();
         this.select(id);
         this.$list.unblockEvent();
      }

      showGear(id) {
         let $item = this.$list.getItemNode(id);
         if ($item) {
            let gearIcon = $item.querySelector(".ab-object-list-edit");
            if (gearIcon) {
               gearIcon.style.visibility = "visible";
               gearIcon.style.display = "block";
            }
         }
      }

      /**
       * @function templateListItem
       *
       * Defines the template for each row of our ProcessList.
       *
       * @param {obj} obj the current instance of ABProcess for the row.
       * @param {?} common the webix.common icon data structure
       * @return {string}
       */
      templateListItem(obj, common) {
         var warnings = obj.warningsAll();

         if (typeof this._templateListItem == "string") {
            var warnText = "";
            if (warnings.length > 0) {
               warnText = `(${warnings.length})`;
            }

            return this._templateListItem
               .replace("#label#", obj.label || "??label??")
               .replace("{common.iconGear}", common.iconGear(obj))
               .replace("#warnings#", warnText);
         }
         // else they sent in a function()
         return this._templateListItem(obj, common, warnings);
      }

      /**
       * @function callbackNewProcess
       *
       * Once a New Process was created in the Popup, follow up with it here.
       */
      // callbackNewProcess:function(err, object, selectNew, callback){

      // 	if (err) {
      // 		OP.Error.log('Error creating New Process', {error: err});
      // 		return;
      // 	}

      // 	let objects = CurrentApplication.objects();
      // 	itemList.parse(objects);

      // 	// if (processList.exists(object.id))
      // 	// 	processList.updateItem(object.id, object);
      // 	// else
      // 	// 	processList.add(object);

      // 	if (selectNew != null && selectNew == true) {
      // 		$$(ids.list).select(object.id);
      // 	}
      // 	else if (callback) {
      // 		callback();
      // 	}

      // },

      /**
       * @function clickAddNew
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickAddNew(selectNew) {
         this.emit("addNew", selectNew);
      }

      /**
       * @function exclude()
       *
       * alert calling UI that a list item was chosen for "exclude"
       */
      exclude() {
         var item = this.$list.getSelectedItem(false);
         this.emit("exclude", item);
      }

      rename() {
         var itemId = this.$list.getSelectedId(false);
         this.$list.edit(itemId);
      }

      remove() {
         var selectedItem = this.$list.getSelectedItem(false);

         // verify they mean to do this:
         webix.confirm({
            title: L(this.labels.confirmDeleteTitle),
            text: L(this.labels.confirmDeleteMessage, [selectedItem.label]),
            ok: L("Yes"),
            cancel: L("No"),
            callback: async (isOK) => {
               if (isOK) {
                  this.busy();

                  try {
                     await selectedItem.destroy();
                     this.ready();
                     this.itemList.remove(selectedItem.id);

                     // let the calling component know about
                     // the deletion:
                     this.emit("deleted", selectedItem);

                     // clear object workspace
                     this.emit("selected", null);
                  } catch (e) {
                     this.AB.notify.developer(e, {
                        context: "ui_common_list:remove(): error removing item",
                     });
                     this.ready();
                  }
               }
            },
         });
      }

      select(id) {
         this.$list.select(id);
      }

      callbackProcessEditorMenu(action) {
         switch (action) {
            case "rename":
               this.rename();
               break;
            case "exclude":
               this.exclude();
               break;
            case "delete":
               this.remove();
               break;
         }
      }

      // Expose any globally accessible Actions:
      // this.actions({
      //    /**
      //     * @function getSelectedProcess
      //     *
      //     * returns which ABProcess is currently selected.
      //     * @return {ABProcess}  or {null} if nothing selected.
      //     */
      //    getSelectedProcess: function () {
      //       return $$(ids.list).getSelectedItem();
      //    },

      //    addNewProcess: function (selectNew, callback) {
      //       _logic.clickNewProcess(selectNew, callback);
      //    },
      // });
   }

   // NOTE: We are returning the Class here, not an instance:
   return new UI_Common_List(options);
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_common_popupEditMenu.js":
/*!***********************************************************!*\
  !*** ./src/rootPages/Designer/ui_common_popupEditMenu.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ab_common_popupEditMenu
 *
 * Many of our Lists offer a gear icon that allows a popup menu to select
 * a set of options for this entry.  This is a common Popup Editor for those
 * options.
 *
 */


var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   if (!myClass) {
      const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
      var L = UIClass.L();

      myClass = class ABCommonPopupEditMenu extends UIClass {
         constructor(contextID) {
            var idBase = "abd_common_popupEditMenu";
            super(idBase);

            this.labels = {
               copy: L("Copy"),
               exclude: L("Exclude"),
               rename: L("Rename"),
               delete: L("Delete"),
            };

            // since multiple instances of this component can exists, we need to
            // make each instance have unique ids => so add contextID to them:
            this.ids.menu = `${idBase}_menu_${contextID}`;
            this.ids.list = `${idBase}_list_${contextID}`;

            this.Popup = null;
            this._menuOptions = [
               {
                  label: this.labels.rename,
                  icon: "fa fa-pencil-square-o",
                  command: "rename",
               },
               {
                  label: this.labels.copy,
                  icon: "fa fa-files-o",
                  command: "copy",
               },
               {
                  label: this.labels.exclude,
                  icon: "fa fa-reply",
                  command: "exclude",
               },
               {
                  label: this.labels.delete,
                  icon: "fa fa-trash",
                  command: "delete",
               },
            ];
         }

         ui() {
            return {
               view: "popup",
               id: this.ids.menu,
               head: L("Application Menu"), // labels.component.menu,
               width: 120,
               body: {
                  view: "list",
                  id: this.ids.list,
                  borderless: true,
                  data: [],
                  datatype: "json",
                  template:
                     "<i class='fa #icon#' aria-hidden='true'></i> #label#",
                  autoheight: true,
                  select: false,
                  on: {
                     onItemClick: (timestamp, e, trg) => {
                        // we need to process which node was clicked before emitting
                        return this.trigger(trg);
                     },
                  },
               },
            };
         }

         async init(AB, options) {
            options = options || {};

            if (this.Popup == null) this.Popup = webix.ui(this.ui()); // the current instance of this editor.

            // we reference $$(this.ids.list) alot:
            this.$list = $$(this.ids.list);

            this.hide();
            this.menuOptions(this._menuOptions);

            // hide "copy" item
            if (options.hideCopy) {
               let itemCopy = this.$list.data.find(
                  (item) => item.label == this.labels.copy
               )[0];
               if (itemCopy) {
                  this.$list.remove(itemCopy.id);
                  this.$list.refresh();
               }

               // hide "exclude" item
               if (options.hideExclude) {
                  let hideExclude = this.$list.data.find(
                     (item) => item.label == this.labels.exclude
                  )[0];
                  if (hideExclude) {
                     this.$list.remove(hideExclude.id);
                     this.$list.refresh();
                  }
               }
            }
         }

         /**
          * @function menuOptions
          * override the set of menu options.
          * @param {array} menuOptions an array of option entries:
          *				  .label {string} multilingual label of the option
          *				  .icon  {string} the font awesome icon reference
          *				  .command {string} the command passed back when selected.
          */
         menuOptions(menuOptions) {
            this.$list.clearAll();

            this._menuOptions = menuOptions;
            var data = [];
            menuOptions.forEach((mo) => {
               data.push({ label: mo.label, icon: mo.icon });
            });
            this.$list.parse(data);
            this.$list.refresh();
         }

         show(itemNode) {
            if (this.Popup && itemNode) this.Popup.show(itemNode);
         }

         /**
          * @method trigger()
          * process which item in our popup was selected, then
          * emit the selected command.
          * NOTE: this can be overridden by child objects
          * @param {itemNode} div.webix_list_item: we get the label then pass this up,
          * The itemNode contains the 'page' the user wants to edit
          */
         trigger(itemNode) {
            // hide our popup before we trigger any other possible UI animation: (like .edit)
            // NOTE: if the UI is animating another component, and we do .hide()
            // while it is in progress, the UI will glitch and give the user whiplash.
            var label = itemNode.textContent.trim();
            var option = this._menuOptions.filter((mo) => {
               return mo.label == label;
            })[0];
            if (option) {
               this.emit(option.command, itemNode);
               this.hide();
               return false;
            }
         }

         hide() {
            if (this.Popup) this.Popup.hide();
         }
      };
   }

   // NOTE: return JUST the class definition.
   return myClass;
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work.js":
/*!*******************************************!*\
  !*** ./src/rootPages/Designer/ui_work.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object */ "./src/rootPages/Designer/ui_work_object.js");
/* harmony import */ var _ui_work_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_query */ "./src/rootPages/Designer/ui_work_query.js");
/* harmony import */ var _ui_work_interface__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui_work_interface */ "./src/rootPages/Designer/ui_work_interface.js");
/* harmony import */ var _ui_work_datacollection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui_work_datacollection */ "./src/rootPages/Designer/ui_work_datacollection.js");
/* harmony import */ var _ui_work_process__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui_work_process */ "./src/rootPages/Designer/ui_work_process.js");
/*
 * ab_work
 *
 * Display the component for working with an ABApplication.
 *
 */






// const AB_Work_Interface = require("./ab_work_interface");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   var AppObjectWorkspace = (0,_ui_work_object__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
   const AppQueryWorkspace = (0,_ui_work_query__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
   const AppDataCollectionWorkspace = (0,_ui_work_datacollection__WEBPACK_IMPORTED_MODULE_4__["default"])(AB);
   const AppProcessWorkspace = (0,_ui_work_process__WEBPACK_IMPORTED_MODULE_5__["default"])(AB);
   var AppInterfaceWorkspace = new _ui_work_interface__WEBPACK_IMPORTED_MODULE_3__["default"](AB);

   class UI_Work extends UIClass {
      constructor(options = {}) {
         super("abd_work", {
            toolBar: "",
            labelAppName: "",
            tabbar: "",
            tab_object: "",
            tab_query: "",
            tab_datacollection: "",
            tab_processview: "",
            tab_interface: "",
            workspace: "",
            collapseMenu: "",
            expandMenu: "",
         });

         this.options = options;

         this.selectedItem = this.ids.tab_object;
         // {string} {this.ids.xxx}
         // Keep track of the currently selected Tab Item (Object, Query, etc)
      }

      /**
       * @method ui()
       * Return the webix definition of the UI we are managing.
       * @return {json}
       */
      ui() {
         var sidebarItems = [
            {
               id: this.ids.tab_object,
               value: L("Objects"),
               icon: "fa fa-fw fa-database",
            },
            {
               id: this.ids.tab_query,
               value: L("Queries"),
               icon: "fa fa-fw fa-filter",
            },
            {
               id: this.ids.tab_datacollection,
               value: L("Data Collections"),
               icon: "fa fa-fw fa-table",
            },
            {
               id: this.ids.tab_processview,
               value: L("Process"),
               icon: "fa fa-fw fa-code-fork",
            },
            {
               id: this.ids.tab_interface,
               value: L("Interface"),
               icon: "fa fa-fw fa-id-card-o",
            },
         ];

         var expandMenu = (this.expandMenu = {
            id: this.ids.expandMenu,
            value: L("Expand Menu"),
            icon: "fa fa-fw fa-chevron-circle-right",
         });

         var collapseMenu = {
            id: this.ids.collapseMenu,
            value: L("Collapse Menu"),
            icon: "fa fa-fw fa-chevron-circle-left",
         };

         return {
            id: this.ids.component,
            rows: [
               {
                  view: "toolbar",
                  id: this.ids.toolBar,
                  autowidth: true,
                  elements: [
                     {
                        view: "button",
                        css: "webix_transparent",
                        label: L("Back to Applications page"),
                        autowidth: true,
                        type: "icon",
                        icon: "fa fa-arrow-left",
                        hidden: this.options?.IsBackHidden ?? false, // hide this button in the admin lve page
                        click: () => {
                           this.emit("view.chooser");
                           // App.actions.transitionApplicationChooser();
                        },
                     },
                     // {
                     // 	view: "button",
                     // 	type: "icon",
                     // 	icon: "fa fa-bars",
                     // 	width: 37,
                     // 	align: "left",
                     // 	css: "app_button",
                     // 	click: function(){
                     // 		$$(ids.tabbar).toggle();
                     // 	}
                     // },
                     {},
                     {
                        view: "label",
                        css: "appTitle",
                        id: this.ids.labelAppName,
                        align: "center",
                     },
                     {},
                  ],
               },
               //{ height: App.config.mediumSpacer },
               // {
               // 	view:"segmented",
               // 	id: ids.tabbar,
               // 	value: ids.tab_object,
               // 	multiview: true,
               // 	align: "center",
               // 	options:[
               // 		{
               // 			id: ids.tab_object,
               // 			value: labels.component.objectTitle,
               // 			width: App.config.tabWidthMedium
               // 		},
               // 		{
               // 			id: ids.tab_interface,
               // 			value: labels.component.interfaceTitle,
               // 			width: App.config.tabWidthMedium
               // 		}
               // 	],
               // 	on: {
               // 		onChange: function (idNew, idOld) {
               // 			if (idNew != idOld) {
               // 				_logic.tabSwitch(idNew, idOld);
               // 			}
               // 		}
               // 	}
               // },
               {
                  cols: [
                     {
                        css: "webix_dark",
                        view: "sidebar",
                        id: this.ids.tabbar,
                        width: 160,
                        data: sidebarItems.concat(collapseMenu),
                        on: {
                           onAfterSelect: (id) => {
                              if (id == this.ids.collapseMenu) {
                                 setTimeout(() => {
                                    this.$tabbar.remove(this.ids.collapseMenu);
                                    this.$tabbar.add(expandMenu);
                                    this.$tabbar.toggle();
                                    this.$tabbar.select(this.selectedItem);
                                    this.saveState();
                                 }, 0);
                              } else if (id == this.ids.expandMenu) {
                                 setTimeout(() => {
                                    this.$tabbar.remove(this.ids.expandMenu);
                                    this.$tabbar.add(collapseMenu);
                                    this.$tabbar.toggle();
                                    this.$tabbar.select(this.selectedItem);
                                    this.saveState();
                                 }, 0);
                              } else {
                                 this.tabSwitch(id);
                                 this.selectedItem = id;
                              }
                           },
                        },
                     },
                     {
                        id: this.ids.workspace,
                        cells: [
                           AppObjectWorkspace.ui(),
                           AppQueryWorkspace.ui(),
                           AppDataCollectionWorkspace.ui(),
                           AppProcessWorkspace.ui(),
                           AppInterfaceWorkspace.ui(),
                        ],
                     },
                  ],
               },
            ],
         };
      } // ui()

      /**
       * @method init()
       * Initialize the State of this widget
       * @param {ABFactory} AB
       * @return {Promise}
       */
      async init(AB) {
         this.AB = AB;

         AppObjectWorkspace.init(AB);
         AppQueryWorkspace.init(AB);
         AppDataCollectionWorkspace.init(AB);
         AppProcessWorkspace.init(AB);
         AppInterfaceWorkspace.init(AB);

         this.$tabbar = $$(this.ids.tabbar);

         // initialize the Object Workspace to show first.
         var state = this.AB.Storage.get(this.ids.component);
         if (state) {
            this.$tabbar.setState(state);

            if (state.collapsed) {
               setTimeout(() => {
                  this.$tabbar.remove(this.ids.collapseMenu);
                  this.$tabbar.add(this.expandMenu);
               }, 0);
            }
         }

         this.tabSwitch(this.ids.tab_object);
         this.$tabbar.select(this.ids.tab_object);
      } // init()

      /**
       * @method applicationInit()
       * Store the current ABApplication we are working with.
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      applicationInit(application) {
         if (application) {
            // setup Application Label:
            var $labelAppName = $$(this.ids.labelAppName);
            $labelAppName.define("label", application?.label);
            $labelAppName.refresh();
         }
         super.applicationLoad(application);
      }

      /**
       * @method saveState()
       * Save the state of this tabbar to local storage.
       */
      saveState() {
         this.AB.Storage.set(this.ids.component, this.$tabbar.getState());
      }

      /**
       * @method show()
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
         let tabId = this.$tabbar.getSelectedId();
         this.tabSwitch(tabId);
      }

      /**
       * @method transitionWorkspace
       * Switch the UI to view the App Workspace screen.
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      transitionWorkspace(application) {
         if (this.CurrentApplicationID != application?.id) {
            this.applicationInit(application);
         }
         AppObjectWorkspace.applicationLoad(application);
         AppQueryWorkspace.applicationLoad(application);
         AppDataCollectionWorkspace.applicationLoad(application);
         AppProcessWorkspace.applicationLoad(application);
         AppInterfaceWorkspace.applicationLoad(application);

         this.show();
      }

      /**
       * @method tabSwitch
       * Every time a tab switch happens, decide which workspace to show.
       * @param {string} idTab
       *        the id of the tab that was changed to.
       */
      tabSwitch(idTab) {
         switch (idTab) {
            // Object Workspace Tab
            case this.ids.tab_object:
               AppObjectWorkspace.show();
               break;

            // Query Workspace Tab
            case this.ids.tab_query:
               AppQueryWorkspace.show();
               break;

            // Datacollection Workspace Tab
            case this.ids.tab_datacollection:
               AppDataCollectionWorkspace.show();
               break;

            // Process Workspace Tab
            case this.ids.tab_processview:
               AppProcessWorkspace.show();
               break;

            // Interface Workspace Tab
            case this.ids.tab_interface:
               AppInterfaceWorkspace.show();
               break;

            // Interface Workspace Tab
            case "interface":
               AppInterfaceWorkspace.show();
               this.$tabbar.select(this.ids.tab_interface);
               break;
         }
      }
   } // class UI_Work

   return new UI_Work();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_datacollection.js":
/*!**********************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_datacollection.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_datacollection_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_datacollection_list */ "./src/rootPages/Designer/ui_work_datacollection_list.js");
/* harmony import */ var _ui_work_datacollection_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_datacollection_workspace */ "./src/rootPages/Designer/ui_work_datacollection_workspace.js");
/*
 * ui_work_datacollection
 *
 * Display the DataCollection Tab UI:
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   class UI_Work_DataCollection extends UIClass {
      constructor() {
         super("ui_work_datacollection");

         this.DataCollectionList = (0,_ui_work_datacollection_list__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
         this.DataCollectionWorkspace = (0,_ui_work_datacollection_workspace__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            cols: [
               this.DataCollectionList.ui(),
               { view: "resizer", width: 11 },
               this.DataCollectionWorkspace.ui(),
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
         this.DataCollectionList.on("selected", this.select);

         return Promise.all([
            this.DataCollectionWorkspace.init(AB),
            this.DataCollectionList.init(AB),
         ]);
      }

      /**
       * @function applicationLoad
       * Initialize the Datacollection Workspace with the given ABApplication.
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         this.DataCollectionWorkspace.clearWorkspace();
         this.DataCollectionList.applicationLoad(application);
         this.DataCollectionWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         // this.DataCollectionList.busy();

         var app = this.CurrentApplication;
         if (app) {
            this.DataCollectionWorkspace.applicationLoad(app);
            this.DataCollectionList.applicationLoad(app);
         }
         this.DataCollectionList.ready();
      }

      select(dc) {
         this.DataCollectionWorkspace.clearWorkspace();
         this.DataCollectionWorkspace.populateWorkspace(dc);
      }
   }

   return new UI_Work_DataCollection();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_datacollection_list.js":
/*!***************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_datacollection_list.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_common_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_common_list */ "./src/rootPages/Designer/ui_common_list.js");
/* harmony import */ var _ui_work_datacollection_list_newDatacollection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_datacollection_list_newDatacollection */ "./src/rootPages/Designer/ui_work_datacollection_list_newDatacollection.js");
/*
 * ui_work_datacollection_list
 *
 * Manage the ABDataCollection List
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   class UI_Work_Datacollection_List extends UIClass {
      constructor() {
         super("ui_work_datacollection_list");

         // {ui_common_list} instance to display a list of our data collections.
         this.ListComponent = (0,_ui_common_list__WEBPACK_IMPORTED_MODULE_1__["default"])(AB, {
            idBase: this.ids.component,
            labels: {
               addNew: "Add new data collection",
               confirmDeleteTitle: "Delete Data Collection",
               title: "Data Collections",
               searchPlaceholder: "Data Collection name",
            },
            menu: {
               copy: false,
               exclude: true,
            },
            /**
             * @function templateListItem
             *
             * Defines the template for each row of our Data view list.
             *
             * @param {ABDatacollection} obj the current instance of ABDatacollection for the row.
             * @param {?} common the webix.common icon data structure
             * @return {string}
             */
            templateListItem: function (datacollection, common, warnings) {
               var warnIcon = "";
               if (warnings?.length > 0) {
                  warnIcon = `(${warnings.length})`;
               }
               return `<div class='ab-datacollection-list-item'>
                        <i class="fa ${
                           datacollection.settings.isQuery
                              ? "fa-filter"
                              : "fa-database"
                        }"></i>
                        ${datacollection.label || "??label??"}${warnIcon}
                        ${common.iconGear(datacollection)} 
                        </div>`;
            },
         });
         this.AddForm = (0,_ui_work_datacollection_list_newDatacollection__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
      }

      // Our webix UI definition:
      ui() {
         return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB) {
         this.AB = AB;

         this.on("addNew", (selectNew) => {
            // if we receive a signal to add a new Data Collection from another source
            this.clickNewDataCollection(selectNew);
         });

         //
         // List of Processes
         //
         await this.ListComponent.init(AB);

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item);
         });

         this.ListComponent.on("addNew", (selectNew) => {
            this.clickNewDataCollection(selectNew);
         });

         this.ListComponent.on("deleted", (item) => {
            this.emit("deleted", item);
         });

         this.ListComponent.on("exclude", (item) => {
            this.exclude(item);
         });

         //
         // Add Form
         //
         await this.AddForm.init(AB);

         this.AddForm.on("cancel", () => {
            this.AddForm.hide();
         });

         this.AddForm.on("save", (q /* , select */) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of data collections
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(q.id);
            // }
         });
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Data Collection List from the provided ABApplication
       *
       * If no ABApplication is provided, then show an empty form. (create operation)
       *
       * @param {ABApplication} application  	[optional] The current ABApplication
       *										we are working with.
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         // clear our list and display our data collections:
         this.ListComponent.dataLoad(application?.datacollectionsIncluded());

         // prepare our Popup with the current Application
         this.AddForm.applicationLoad(application);
      }

      /**
       * @function exclude
       * the list component notified us of an exclude action and which
       * item was chosen.
       *
       * perform the removal and update the UI.
       */
      async exclude(item) {
         this.ListComponent.busy();
         var app = this.CurrentApplication;
         await app?.datacollectionRemove(item);
         this.ListComponent.dataLoad(app?.datacollectionsIncluded());

         // this will clear the data collection workspace
         this.emit("selected", null);
      }

      ready() {
         this.ListComponent.ready();
      }

      /**
       * @function clickNewDataCollection
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewDataCollection(/* selectNew */) {
         // show the new popup
         this.AddForm.show();
      }
   }

   return new UI_Work_Datacollection_List();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_datacollection_list_newDatacollection.js":
/*!*********************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_datacollection_list_newDatacollection.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_datacollection_list_newDatacollection_blank__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_datacollection_list_newDatacollection_blank */ "./src/rootPages/Designer/ui_work_datacollection_list_newDatacollection_blank.js");
/* harmony import */ var _ui_work_datacollection_list_newDatacollection_import__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_datacollection_list_newDatacollection_import */ "./src/rootPages/Designer/ui_work_datacollection_list_newDatacollection_import.js");
/*
 * ui_work_datacollection_list_newDataCollection
 *
 * Display the form for creating a new Data collection.  This Popup will manage several
 * different sub components for gathering Data collection data for saving.
 *
 * The sub components will gather the data for the data collection and do basic form
 * validations on their interface.
 *
 * when ready, the sub component will emit "save" with the values gathered by
 * the form.  This component will manage the actual final datacollection validation,
 * and saving to this application.
 *
 * On success, "save.success" will be emitted on the sub-component, and this
 * component.
 *
 * On Error, "save.error" will be emitted on the sub-component.
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_DataCollection_List_NewDataCollection extends UIClass {
      constructor() {
         super("ui_work_datacollection_list_newDataCollection", {
            tab: "",
         });

         this.selectNew = true;
         // {bool} do we select a new data collection after it is created.

         // var callback = null;

         this.BlankTab = (0,_ui_work_datacollection_list_newDatacollection_blank__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
         this.ImportTab = (0,_ui_work_datacollection_list_newDatacollection_import__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            position: "center",
            modal: true,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Add new Data Collection"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.emit("cancel");
                     },
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            selectNewDataCollection: true,
            body: {
               view: "tabview",
               id: this.ids.tab,
               cells: [this.BlankTab.ui(), this.ImportTab.ui()],
               tabbar: {
                  on: {
                     onAfterTabClick: (id) => {
                        this.switchTab(id);
                     },
                     onAfterRender() {
                        this.$view
                           .querySelectorAll(".webix_item_tab")
                           .forEach((t) => {
                              var tid = t.getAttribute("button_id");
                              AB.ClassUI.CYPRESS_REF(t, `${tid}_tab`);
                           });
                     },
                  },
               },
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$component = $$(this.ids.component);

         let allInits = [];
         ["BlankTab", "ImportTab"].forEach((k) => {
            allInits.push(this[k].init(AB));
            this[k].on("cancel", () => {
               this.emit("cancel");
            });
            this[k].on("save", (values) => {
               if (values.id) {
                  return this.import(values, k);
               }
               this.save(values, k);
            });
         });

         return Promise.all(allInits);
      }

      /**
       * @method applicationLoad()
       * prepare ourself with the current application
       * @param {ABApplication} application
       */
      // applicationLoad(application) {
      //    this.CurrentApplicationID = application.id;
      // }

      /**
       * Show the busy indicator
       */
      busy() {
         this.$component?.showProgress?.();
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {object} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj, this.selectNew);
      }

      /**
       * @function hide()
       *
       * remove the busy indicator from the form.
       */
      hide() {
         this.$component?.hide();
      }

      /**
       * @method import()
       * take an existing ABDataCollection and add it to our ABApplication.
       * @param {ABODataCollection} dc
       * @param {string} tabKey
       *        which of our tabs triggered this method?
       */
      async import(dc, tabKey) {
         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            await this.CurrentApplication.datacollectionInsert(dc);
            this[tabKey].emit("save.successful", dc);
            this.done(dc);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current datacollection list of
            // the CurrentApplication.
            // NOTE: It has error "queryRemove" is not a function
            // await this.CurrentApplication.datacollectionRemove(newQuery);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         this.$component?.hideProgress?.();
      }
      /**
       * @method save
       * take the data gathered by our child creation tabs, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @param {string}  tabKey
       *        the "key" of the tab initiating the save.
       * @return {Promise}
       */
      async save(values, tabKey) {
         // must have an application set.
         if (!this.CurrentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this[tabKey].emit("save.error", true);
            return false;
         }

         // create a new (unsaved) instance of our data collection:
         let newDataCollection = this.AB.datacollectionNew(values);

         // have newObject validate it's values.
         let validator = newDataCollection.isValid();
         if (validator.fail()) {
            this[tabKey].emit("save.error", validator);
            // cb(validator); // tell current Tab component the errors
            return false; // stop here.
         }

         if (!newDataCollection.createdInAppID) {
            newDataCollection.createdInAppID = this.CurrentApplicationID;
         }

         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            let datacollection = await newDataCollection.save();
            await this.CurrentApplication.datacollectionInsert(datacollection);
            this[tabKey].emit("save.successful", datacollection);
            this.done(datacollection);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this data collection from the current data collection list of
            // the CurrentApplication.
            // NOTE: It has error "datacollectionRemove" is not a function
            // await this.CurrentApplication.datacollectionRemove(newDataCollection);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show(shouldSelectNew) {
         if (shouldSelectNew != null) {
            this.selectNew = shouldSelectNew;
         }
         this.$component?.show();

         const id = $$(this.ids.tab).getValue();
         this.switchTab(id);
      }

      switchTab(tabId) {
         if (tabId == this.BlankTab?.ui()?.body?.id || !tabId) {
            this.BlankTab?.onShow?.(this.CurrentApplication);
         } else if (tabId == this.ImportTab?.ui()?.body?.id) {
            this.ImportTab?.onShow?.(this.CurrentApplication);
         }
      }
   }

   return new UI_Work_DataCollection_List_NewDataCollection();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_datacollection_list_newDatacollection_blank.js":
/*!***************************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_datacollection_list_newDatacollection_blank.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_dataCollection_list_newDataCollection_blank
 *
 * Display the form for creating a new ABDataCollection.
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_DataCollection_List_NewDataCollection_Blank extends UIClass {
      constructor() {
         super("ui_work_dataCollection_list_newDataCollection_blank", {
            // component: base, <-- auto-generated

            form: "",
            buttonSave: "",
            buttonCancel: "",
            object: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Create"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateDataCollectionName
               },
               elements: [
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Data Collection name"),
                     labelWidth: 70,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(
                              this,
                              "ui_work_dataCollection_list_newDatacollection_blank_name"
                           );
                        },
                     },
                  },
                  {
                     id: this.ids.object,
                     view: "richselect",
                     label: L("Object"),
                     name: "object",
                     required: true,
                     placeholder: L("Select an object"),
                     labelWidth: 70,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(
                              this,
                              "ui_work_dataCollection_list_newDatacollection_blank_object"
                           );
                        },
                     },
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.cancel();
                           },
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Add Data Collection"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         this.$buttonSave = $$(this.ids.buttonSave);
         this.$objectList = $$(this.ids.object);

         // "save.error" is triggered by the ui_work_dataCollection_list_newDataCollection
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_dataCollection_list_newDataCollection
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         if (this.$form) {
            this.$form.clearValidation();
            this.$form.clear();
         }
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_dataCollection_list_newDataCollection had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of queries:
       *        - A javascript Error() dataCollection
       *        - An ABValidation dataCollection returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            var message = L("the entered data is invalid");
            // if this was our Validation() dataCollection:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating DataCollection: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         this.$buttonSave.enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_dataCollection_list_newDatacollection successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         this.$buttonSave.enable();
      }

      /**
       * @function save
       *
       * verify the current info is ok, package it, and return it to be
       * added to the application.createModel() method.
       */
      save() {
         this.$buttonSave.disable();

         var Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            this.$buttonSave.enable();
            return false;
         }

         let formVals = Form.getValues();
         let id = formVals.object;
         let selectedObject = this.AB.objectByID(id);
         if (!selectedObject) {
            selectedObject = this.AB.queryByID(id);
         }

         let values = {
            name: formVals.name,
            label: formVals.name,
            settings: {
               datasourceID: id,
               isQuery: selectedObject?.isQuery ?? false,
            },
         };

         this.emit("save", values);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if ($$(this.ids.component)) $$(this.ids.component).show();
      }

      onShow(currentApplication) {
         // populate object list
         if (this.$objectList && currentApplication) {
            let datasourceOpts = [];

            // Objects
            datasourceOpts = datasourceOpts.concat(
               currentApplication.objectsIncluded().map((obj) => {
                  return {
                     id: obj.id,
                     value: obj.label,
                     icon: "fa fa-database",
                     isQuery: false,
                  };
               })
            );

            // Queries
            datasourceOpts = datasourceOpts.concat(
               currentApplication.queriesIncluded().map((q) => {
                  return {
                     id: q.id,
                     value: q.label,
                     icon: "fa fa-filter",
                     isQuery: true,
                  };
               })
            );

            this.$objectList.define("options", datasourceOpts);
            this.$objectList.refresh();

            // Set width of item list
            let $suggestView = this.$objectList.getPopup();
            $suggestView.attachEvent("onShow", () => {
               $suggestView.define("width", 350);
               $suggestView.resize();
            });
         }

         // clear form
         if (this.$form) {
            this.$form.setValues({
               name: "",
               object: "",
            });
         }
      }
   }

   return new UI_Work_DataCollection_List_NewDataCollection_Blank();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_datacollection_list_newDatacollection_import.js":
/*!****************************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_datacollection_list_newDatacollection_import.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ab_work_datacollection_list_newDatacollection_import
 *
 * Display the form for importing an existing data collection into the application.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_DataCollection_List_NewDataCollection_Import extends UIClass {
      constructor() {
         super("ui_work_datacollection_list_newDatacollection_import", {
            // component: base, <-- auto generated

            form: "",
            filter: "",
            datacollectionList: "",
            buttonSave: "",
            buttonCancel: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Existing"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               elements: [
                  // Filter
                  {
                     cols: [
                        {
                           view: "icon",
                           icon: "fa fa-filter",
                           align: "left",
                        },
                        {
                           view: "text",
                           id: this.ids.filter,
                           on: {
                              onTimedKeyPress: () => this.filter(),
                           },
                        },
                     ],
                  },

                  // Model list
                  {
                     view: "list",
                     id: this.ids.datacollectionList,
                     select: true,
                     height: 200,
                     minHeight: 250,
                     maxHeight: 250,
                     data: [],
                     template: "<div>#label#</div>",
                  },

                  // Import & Cancel buttons
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => this.cancel(),
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Import"),
                           autowidth: true,
                           type: "form",
                           click: () => this.save(),
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         this.$filter = $$(this.ids.filter);
         this.$datacollectionList = $$(this.ids.datacollectionList);
         this.$buttonSave = $$(this.ids.buttonSave);
         this.$buttonCancel = $$(this.ids.buttonCancel);

         // "save.error" is triggered by the ui_work_datacollection_list_newDatacollection
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_datacollection_list_newDatacollection
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });
      }

      onShow(app) {
         this.formClear();

         // now all objects are *global* but an application might only
         // reference a sub set of them.  Here we just need to show
         // the objects our current application isn't referencing:

         const availableQueries = app.datacollectionsExcluded();
         this.$datacollectionList.parse(availableQueries, "json");
      }

      filter() {
         let filterText = this.$filter.getValue();
         this.$datacollectionList.filter("#label#", filterText);
      }

      save() {
         let selectedDataCollection =
            this.$datacollectionList.getSelectedItem();
         if (!selectedDataCollection) return false;

         this.$buttonSave.disable();

         this.emit("save", selectedDataCollection);
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         // Filter section
         if (this.$form) {
            this.$form.clearValidation();
            this.$form.clear();
         }
         // Lists
         if (this.$datacollectionList) {
            this.$datacollectionList.clearAll();
         }
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_object_list_newObject object had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of objects:
       *        - A javascript Error() object
       *        - An ABValidation object returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            let message = L("the entered data is invalid");
            // if this was our Validation() object:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            let values = this.$form.getValues();
            webix.alert({
               title: L("Error creating DataCollection: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         this.$buttonSave.enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_object_list_newObject successfully saved the values.
       */
      onSuccess() {
         this.$buttonSave.enable();
      }
   }

   return new UI_Work_DataCollection_List_NewDataCollection_Import();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_datacollection_workspace.js":
/*!********************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_datacollection_workspace.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB, init_settings) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();
   class UI_Work_Datacollection_Workspace extends UIClass {
      constructor(settings = init_settings || {}) {
         super("ui_work_datacollection_workspace");

         this.settings = settings;
      }

      ui() {
         return {};
      }

      init() {
         // TODO
         return Promise.resolve();
      }

      // applicationLoad(app) {
      //    super.applicationLoad(app);
      //    // TODO
      // }

      clearWorkspace() {
         // TODO
      }

      populateWorkspace() {
         // TODO
      }
   }

   return new UI_Work_Datacollection_Workspace();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_interface.js":
/*!*****************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_interface.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_work_interface_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_work_interface_list */ "./src/rootPages/Designer/ui_work_interface_list.js");
/*
 * ui_work_interface
 *
 * Display the Interface Tab UI:
 *
 */


//import UI_Work_Interface_Workspace_Class from "./ui_work_interface_workspace";

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var InterfaceList = (0,_ui_work_interface_list__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   //  var InterfaceWorkspace = UI_Work_Interface_Workspace_Class(
   //     AB
   //     /* leave empty for default settings */
   //  );

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Interface extends AB.ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         super("ab_work_interface");

         this.CurrentApplication = null;
         // {ABApplication}
         // The current ABApplication we are working with.
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            margin: 10,
            cols: [InterfaceList.ui(), { view: "resizer" }, {}], // ,InterfaceWorkspace.ui()
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI

         InterfaceList.on("selected", (obj) => {
            console.log("this is unfinished");
            // TODO
            // if (obj == null) InterfaceWorkspace.clearInterfaceWorkspace();
            // else InterfaceWorkspace.populateInterfaceWorkspace(obj);
         });

         //  InterfaceWorkspace.on("addNew", (selectNew) => {
         //     InterfaceList.emit("addNew", selectNew);
         //  });

         return Promise.all([
            //InterfaceWorkspace.init(AB),
            InterfaceList.init(AB),
         ]);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Interface Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplication = application;

         //  InterfaceWorkspace.clearInterfaceWorkspace();
         InterfaceList.applicationLoad(application);
         //  InterfaceWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         if (this.CurrentApplication) {
            InterfaceList?.applicationLoad(this.CurrentApplication);
         }
         InterfaceList?.ready();
      }
   }

   return new UI_Work_Interface();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_interface_list.js":
/*!**********************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_interface_list.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_work_interface_list_newPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_work_interface_list_newPage */ "./src/rootPages/Designer/ui_work_interface_list_newPage.js");
/* harmony import */ var _ui_work_interface_list_copyPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_interface_list_copyPage */ "./src/rootPages/Designer/ui_work_interface_list_copyPage.js");
/* harmony import */ var _ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_common_popupEditMenu */ "./src/rootPages/Designer/ui_common_popupEditMenu.js");
/*
 * ui_work_interface_list
 *
 * Manage the ABInterface List
 *
 */




//import UI_Work_Interface_List_NewPage from "./ui_work_interface_list_newPage";


// const ABProcess = require("../classes/platform/ABProcess");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var PopupEditPageComponent = (0,_ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
   //  var PopupNewPageComponent = new UIListNewProcess(AB);

   var AddForm = new _ui_work_interface_list_newPage__WEBPACK_IMPORTED_MODULE_0__["default"](AB);
   var CopyForm = new _ui_work_interface_list_copyPage__WEBPACK_IMPORTED_MODULE_1__["default"](AB);
   // the popup form for adding a new process

   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Interface_List extends AB.ClassUI {
      constructor() {
         var base = "ui_work_interface_list";
         super({
            component: base,
            list: `${base}_editList`,
            buttonNew: `${base}_buttonNew`,
         });

         this.EditPopup = new PopupEditPageComponent(base);

         this.CurrentApplication = null;

         this.viewList = new webix.TreeCollection();
      }

      // Our webix UI definition:
      ui() {
         var ids = this.ids;
         // Our webix UI definition:
         return {
            id: ids.component,
            rows: [
               {
                  view: "unitlist",
                  uniteBy: L("Pages"),
                  height: 34,
                  data: [" "],
                  type: {
                     height: 0,
                     headerHeight: 35,
                  },
               },
               {
                  view: AB._App.custom.edittree.view, // "edittree",
                  id: ids.list,
                  width: uiConfig.columnWidthLarge,

                  select: true,

                  editaction: "custom",
                  editable: true,
                  editor: "text",
                  editValue: "label",
                  css: "ab-tree-ui",

                  template: (obj, common) => {
                     return this.templateListItem(obj, common);
                  },
                  type: {
                     iconGear: "<span class='webix_icon fa fa-cog'></span>",
                  },
                  on: {
                     onAfterRender: () => {
                        this.onAfterRender();
                     },
                     onAfterSelect: (id) => {
                        this.onAfterSelect(id);
                     },
                     onAfterOpen: () => {
                        this.onAfterOpen();
                     },
                     onAfterClose: () => {
                        this.onAfterClose();
                     },
                     onBeforeEditStop: (state, editor) => {
                        this.onBeforeEditStop(state, editor);
                     },
                     onAfterEditStop: (state, editor, ignoreUpdate) => {
                        this.onAfterEditStop(state, editor, ignoreUpdate);
                     },
                  },
                  onClick: {
                     "ab-page-list-edit": (e, id, trg) => {
                        this.clickEditMenu(e, id, trg);
                     },
                  },
               },
               {
                  view: "button",
                  css: "webix_primary",
                  id: ids.buttonNew,
                  type: "form",
                  value: L("Add new Page"), //labels.component.addNew,
                  click: () => {
                     console.log("clickNewView");
                     this.emit("clickNewView");
                  },
               },
            ],
         };
         // Making custom UI settings above
         // return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB, options) {
         this.AB = AB;

         this.on("clickNewView", (selectNew) => {
            // if we receive a signal to add a new Interface from another source
            // like the blank interface workspace offering an Add New button:
            this.clickNewView(selectNew);
         });

         if ($$(this.ids.component)) $$(this.ids.component).adjust();

         let $List = $$(this.ids.list);
         this.ListComponent = $List;

         if ($List) {
            webix.extend($List, webix.ProgressBar);
            $List.data.unsync();
            $List.data.sync(this.viewList);
            $List.adjust();
         }

         await this.EditPopup.init(AB, {
            hideExclude: true,
         });

         this.EditPopup.menuOptions([
            {
               label: L("Rename"),
               icon: "fa fa-pencil-square-o",
               command: "rename",
            },
            {
               label: L("Copy"),
               icon: "fa fa-files-o",
               command: "copy",
            },
            {
               label: L("Delete"),
               icon: "fa fa-trash",
               command: "delete",
            },
         ]);

         this.EditPopup.on("delete", (item) => {
            this.remove(item);
         });

         this.EditPopup.on("copy", () => {
            this.copy();
         });

         this.EditPopup.on("rename", () => {
            this.rename();
         });

         await AddForm.init(AB);

         AddForm.on("cancel", () => {
            AddForm.hide();
         });

         AddForm.on("save", (obj, select) => {
            // the PopupEditPageComponent already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of interfaces
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(obj.id);
            // }
         });

         this._handler_refreshApp = (def) => {
            if (this.CurrentApplication.refreshInstance) {
               // TODO: Johnny refactor this
               this.CurrentApplication =
                  this.CurrentApplication.refreshInstance();
            }
            this.applicationLoad(this.CurrentApplication);
         };
      }

      addNew() {
         console.error("!! Who is calling this?");
         this.clickNewView(true);
      }

      /**
       * @function applicationLoad
       * Initialize the List from the provided ABApplication
       * If no ABApplication is provided, then show an empty form. (create operation)
       * @param {ABApplication} application
       *        [optional] The current ABApplication we are working with.
       */
      applicationLoad(application) {
         var events = ["definition.updated", "definition.deleted"];
         if (this.CurrentApplication) {
            // remove current handler
            events.forEach((e) => {
               console.log(this._handler_refreshApp); // always undefined
               //  this.CurrentApplication.removeListener(
               //     e,
               //     this._handler_refreshApp
               //  );
            });
         }
         this.CurrentApplication = application;
         if (this.CurrentApplication) {
            events.forEach((e) => {
               console.log(this._handler_refreshApp);
               // this.CurrentApplication.on(e, this._handler_refreshApp);
            });
         }

         // TODO list pages
         console.log(application?.pages());
         // this.ListComponent.dataLoad(application?.pages());

         this.busy();
         // this so it looks right/indented in a tree view:
         this.viewList.clearAll();

         var addPage = (page, index, parentId) => {
            if (!page) return;

            this.viewList.add(page, index, parentId);

            page.pages().forEach((childPage, childIndex) => {
               addPage(childPage, childIndex, page.id);
            });
         };
         application.pages().forEach((p, index) => {
            addPage(p, index);
         });

         // clear our list and display our objects:
         var List = $$(this.ids.list);
         List.refresh();
         List.unselectAll();

         //
         this.ready();

         // // prepare our Popup with the current Application
         AddForm.applicationLoad(application);
         CopyForm.applicationLoad(application);
         // this.EditPopup.applicationLoad(application);
      }

      /**
       * @function clickNewView
       *
       * Manages initiating the transition to the new Page Popup window
       */
      clickNewView(selectNew) {
         // show the new popup
         AddForm.show();
      }

      showGear(id) {
         var domNode = $$(this.ids.list).getItemNode(id);
         if (domNode) {
            var gearIcon = domNode.querySelector(".ab-page-list-edit");
            gearIcon.style.visibility = "visible";
            gearIcon.style.display = "block";
         }
      }
      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      ready() {
         let ids = this.ids;
         //this.ListComponent.ready();
         if ($$(ids.list) && $$(ids.list).hideProgress)
            $$(ids.list).hideProgress();
      }
      busy() {
         let ids = this.ids;
         if ($$(ids.list) && $$(ids.list).showProgress)
            $$(ids.list).showProgress({ type: "icon" });
      }
      refreshTemplateItem(view) {
         // make sure this item is updated in our list:
         view = view.updateIcon(view);
         this.viewList.updateItem(view.id, view);
      }
      rename() {
         var pageID = $$(this.ids.list).getSelectedId(false);
         $$(this.ids.list).edit(pageID);
      }
      /*
       * @function copy
       * make a copy of the current selected item.
       *
       * copies should have all the same sub-page data,
       * but will need unique names, and ids.
       *
       * we start the process by making a copy and then
       * having the user enter a new label/name for it.
       *
       * our .afterEdit() routines will detect it is a copy
       * then alert the parent UI component of the "copied" data
       */
      copy() {
         var selectedPage = $$(this.ids.list).getSelectedItem(false);
         // show loading cursor
         this.listBusy();

         CopyForm.init(AB, selectedPage);

         // Data must be loaded AFTER init, as it populates the form immediatly
         CopyForm.applicationLoad(this.CurrentApplication);

         CopyForm.on("save", (obj) => {
            // the PopupEditPageComponent already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of interfaces
            this.applicationLoad(this.CurrentApplication);
            this.callbackNewPage(obj);

            // Select the new page
            this.ListComponent.select(obj.id);
            this.listReady();
         });

         CopyForm.on("cancel", () => {
            CopyForm.hide();
            this.listReady();
         });

         CopyForm.show();
      }
      remove() {
         var selectedPage = $$(this.ids.list).getSelectedItem(false);
         if (!selectedPage) return;

         // verify they mean to do this:
         webix.confirm({
            title: L("Delete Page"),
            text: L("Are you sure you wish to delete this page?", [
               selectedPage.label,
            ]),
            ok: L("Yes"),
            cancel: L("No"),
            callback: async (isOK) => {
               if (isOK) {
                  this.busy();

                  try {
                     await selectedPage.destroy();
                     this.ready();
                     $$(this.ids.list).remove(
                        $$(this.ids.list).getSelectedId()
                     );
                     // let the calling component know about
                     // the deletion:
                     this.emit("deleted", selectedPage);

                     // clear object workspace
                     this.emit("selected", null);
                  } catch (e) {
                     console.error(e, {
                        context: "ui_common_list:remove(): error removing item",
                     });
                     this.ready();
                  }
               }
            },
         });
      }
      clickEditMenu(e, id, trg) {
         // Show menu
         this.EditPopup.show(trg);

         return false;
      }
      /**
       * @function callbackNewObject
       *
       * Once a New Page was created in the Popup, follow up with it here.
       */
      callbackNewPage(page) {
         var parentPage = page.pageParent() || page.parent;
         var parentPageId = parentPage.id != page.id ? parentPage.id : null;
         if (!this.viewList.exists(page.id))
            this.viewList.add(page, null, parentPageId);

         // add sub-pages to tree-view
         page.pages().forEach((p, index) => {
            if (!this.viewList.exists(p.id))
               this.viewList.add(p, index, page.id);
         });

         $$(this.ids.list).refresh();

         if (parentPageId) $$(this.ids.list).open(parentPageId);

         $$(this.ids.list).select(page.id);

         AddForm.hide();
      }
      listBusy() {
         if ($$(this.ids.list) && $$(this.ids.list).showProgress)
            $$(this.ids.list).showProgress({ type: "icon" });
      }

      listReady() {
         if ($$(this.ids.list) && $$(this.ids.list).hideProgress)
            $$(this.ids.list).hideProgress();
      }

      templateListItem(item, common) {
         var template = `<div class='ab-page-list-item'>
            ${common.icon(item)} <span class='webix_icon fa fa-${
            item.icon || item.viewIcon()
         }'></span> ${item.label} <div class='ab-page-list-edit'>${
            common.iconGear
         }</div>
            </div>`;

         // now register a callback to update this display when this view is updated:
         item
            .removeListener("properties.updated", this.refreshTemplateItem)
            .once("properties.updated", this.refreshTemplateItem);

         return template;
      }
      onAfterOpen() {
         var id = $$(this.ids.list).getSelectedId(false);
         if (id) {
            this.showGear(id);
         }
      }

      onAfterRender() {
         var id = $$(this.ids.list).getSelectedId(false);
         if (id) {
            this.showGear(id);
         }
      }

      /**
       * @function onAfterSelect()
       *
       * Perform these actions when a View is selected in the List.
       */
      onAfterSelect(id) {
         // var view = $$(this.ids.list).getItem(id);
         // AB.actions.populateInterfaceWorkspace(view);

         this.showGear(id);
      }
      onBeforeEditStop(state /*, editor */) {
         console.log(state);
         var selectedItem = $$(this.ids.list).getSelectedItem(false);
         selectedItem.label = state.value;

         // if this item supports isValid()
         if (selectedItem.isValid) {
            var validator = selectedItem.isValid();
            if (validator.fail()) {
               selectedItem.label = state.old;

               return false; // stop here.
            }
         }

         return true;
      }
      onAfterEditStop(state, editor, ignoreUpdate) {
         this.showGear(editor.id);

         if (state.value != state.old) {
            this.listBusy();

            var selectedPage = $$(this.ids.list).getSelectedItem(false);
            selectedPage.label = state.value;

            // Call server to rename
            selectedPage
               .save()
               .then(() => {
                  this.listReady();

                  // refresh the root page list
                  AddForm.applicationLoad(this.CurrentApplication);

                  // TODO : should use message box
                  webix.alert({
                     text: L("<b>{0}</b> is renamed.", [state.value]),
                  });
               })
               .catch((err) => {
                  this.listReady();
                  console.error(err);
                  webix.alert({
                     text: L("System could not rename <b>{0}</b>.", [
                        state.value,
                     ]),
                  });
               });
         }
      }
      onAfterClose() {
         var selectedIds = $$(this.ids.list).getSelectedId(true);

         // Show gear icon
         selectedIds.forEach((id) => {
            this.showGear(id);
         });
      }

      // Expose any globally accessible Actions:
      // this.actions({
      //    /**
      //     * @function getSelectedProcess
      //     *
      //     * returns which ABProcess is currently selected.
      //     * @return {ABProcess}  or {null} if nothing selected.
      //     */
      //    getSelectedProcess: function () {
      //       return $$(this.ids.list).getSelectedItem();
      //    },

      //    addNewProcess: function (selectNew, callback) {
      //       _logic.clickNewView(selectNew, callback);
      //    },
      // });
   }
   return new UI_Work_Interface_List();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_interface_list_copyPage.js":
/*!*******************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_interface_list_copyPage.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * ab_work_interface_list_copyPage
 *
 * Display the form for duplicating an interface.
 *
 */
/*
 * UI_Work_Interface_List_CopyPage
 *
 * Display the form for copying a Page.  This Popup will allow user to rename and set parent.
 *
 * The sub components will gather the data for the object and do basic form
 * validations on their interface.
 *
 * when ready, this component will manage the actual final object validation,
 * and save to this.application.
 *
 * On success, "save" will be emitted, with obj passed so it can be selected in parent view
 *
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Interface_List_NewPage extends AB.ClassUI {
      constructor() {
         var base = "ab_work_interface_list_copyInterface";
         super({
            component: base,

            form: `${base}_blank`,
            buttonSave: `${base}_save`,
            buttonCancel: `${base}_cancel`,
         });
         this.ids.parentList = {};

         this.currentApplication = null;
      }

      ui(oldName) {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            width: 400,
            position: "center",
            modal: true,
            head: L("Copy interface"),
            selectNewInterface: true,
            body: {
               view: "form",
               id: this.ids.form,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validatePageName
               },
               elements: [
                  {
                     view: "select",
                     id: this.ids.parentList,
                     label: L("Parent Page"),
                     name: "parent",
                     options: [],
                     placeholder: L("[ Root Page ]"),
                     labelWidth: 110,
                  },
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: `${oldName} - ${L("copy")}`,
                     labelWidth: 110,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(
                              this,
                              "ui_work_interface_list_newPage_blank_name"
                           );
                        },
                     },
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.cancel();
                           },
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Paste Page"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
            on: {
               onBeforeShow: () => {
                  // var id = $$(this.ids.tab).getValue();
                  // this.switchTab(id);
               },
            },
         };
      }

      async init(AB, data) {
         this.AB = AB;
         this.data = data;
         console.log(data);

         webix.ui(this.ui(data.name));
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$form = $$(this.ids.form);

         this.$component = $$(this.ids.component);

         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      /**
       * @method applicationLoad()
       * prepare ourself with the current application
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.currentApplication = application; // remember our current Application.
         var options = [{ id: "-", value: L("[Root page]") }]; // L("ab.interface.rootPage", "*[Root page]")

         var addPage = function (page, indent) {
            indent = indent || "";
            options.push({
               id: page.urlPointer(),
               value: indent + page.label,
            });
            page
               // .pages((p) => p instanceof AB.Class.ABViewPage)
               .pages()
               .forEach(function (p) {
                  addPage(p, indent + "-");
               });
         };
         // this.currentApplication.pages((p) => p instanceof AB.Class.ABViewPage).forEach(
         this.currentApplication.pages().forEach(function (page) {
            addPage(page, "");
         });

         if($$(this.ids?.parentList)?.define){
            $$(this.ids?.parentList).define("options", options);
            $$(this.ids?.parentList).refresh();
         }
      }

      /**
       * @function hide()
       *
       * remove the busy indicator from the form.
       */
      hide() {
         if (this.$component) this.$component.hide();
      }

      /**
       * @function cancel()
       *
       * remove the form.
       */
      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      /**
       * Show the busy indicator
       */
      busy() {
         if (this.$component) {
            this.$component.showProgress();
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         if (this.$component) {
            this.$component.hideProgress();
         }
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {interface} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj); // tell parent component we're done
      }

      /**
       * @method save
       * verify the current info is ok, package it, and return it to be
       * added to the application.createModel() method.
       * then take the data gathered, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @return {Promise}
       */
      async save() {
         var saveButton = $$(this.ids.buttonSave);
         saveButton.disable();
         // show progress
         this.busy();

         var Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            saveButton.enable();
            this.ready();
            return false;
         }

         var values = Form.getValues();

         // must have an application set.
         if (!this.currentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this.emit("save.error", true);
            return false;
         }

         if (!values) {
            // SaveButton.enable();
            // CurrentEditor.formReady();
            return;
         }

         if (values.parent === "-") {
            values.parent = null;
         } else if (values.parent) {
            values.parent = this.currentApplication.urlResolve(values.parent);
         }

         //  if (values.parent) {
         var newPage = this.data;

         newPage
            .copy(null, values.parent, { newName: values.name })
            .then((copiedPage) => {
               // .copy() should save ...........
               //  copiedPage.save()
               // .then((copiedPage) => {
               this.emit("save.successful", copiedPage);
               this.done(copiedPage);
               // })
               // .catch((err) => {
               //    // hide progress
               //    this.ready();

               //    // an error happened during the server side creation.
               //    // so remove this object from the current object list of
               //    // the currentApplication.
               //    this.currentApplication.pageRemove(copiedPage);

               //    // tell current Tab component there was an error
               //    this.emit("save.error", err);
               // });
            })
            .catch((err) => {
               this.ready();
               //  this.listReady();
               var strError = err.toString();
               webix.alert({
                  title: "Error copying page",
                  ok: "fix it",
                  text: strError,
                  type: "alert-error",
               });
               console.log(err);
            });
         //await values.parent.pageInsert(values);
         //  } else {
         //     this.data
         //        .copy(null, values.parent)
         //        .then((copiedPage) => {
         //           copiedPage.parent = values.parent;
         //           copiedPage.label = values.name;
         //           copiedPage.save().then(() => {
         //              this.callbackNewPage(copiedPage);
         //              this.listReady();
         //           });
         //        })
         //        .catch((err) => {
         //           var strError = err.toString();
         //           webix.alert({
         //              title: "Error copying page",
         //              ok: "fix it",
         //              text: strError,
         //              type: "alert-error",
         //           });
         //           console.log(err);
         //           this.listReady();
         //        });
         //     // page = CurrentApplication.pageNew(values);
         //     // newInterface = this.currentApplication.pageNew(values);
         //     // await this.currentApplication.pageInsert(values);
         //  }
         //

         // have newInterface validate it's values.
         //  var validator = newInterface.isValid();
         //  if (validator.fail()) {
         //     this.emit("save.error", validator);
         //     // cb(validator); // tell current Tab component the errors
         //     return false; // stop here.
         //  }

         //  if (!newInterface.createdInAppID) {
         //     newInterface.createdInAppID = this.currentApplication.id;
         //  }

         // if we get here, save the new Page
         //  try {
         //     var obj = await newInterface.save();
         //     // await this.currentApplication.pageInsert(obj);
         //     this.emit("save.successful", obj);
         //     this.done(obj);
         //  } catch (err) {
         //     // hide progress
         //     this.ready();

         //     // an error happend during the server side creation.
         //     // so remove this object from the current object list of
         //     // the currentApplication.
         //     await this.currentApplication.pageRemove(newInterface);

         //     // tell current Tab component there was an error
         //     this.emit("save.error", err);
         //  }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if (this.$component) this.$component.show();
      }

      formClear() {
         this.$form.clearValidation();
         this.$form.clear();
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_interface_list_newPage object had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of objects:
       *        - A javascript Error() object
       *        - An ABValidation object returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            var message = L("the entered data is invalid");
            // if this was our Validation() object:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Page: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_interface_list_newPage successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         $$(this.ids.buttonSave).enable();
      }
   }

   return new UI_Work_Interface_List_NewPage();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_interface_list_newPage.js":
/*!******************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_interface_list_newPage.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_work_interface_list_newPage_blank__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_work_interface_list_newPage_blank */ "./src/rootPages/Designer/ui_work_interface_list_newPage_blank.js");
/*
 * ab_work_interface_list_newPage
 *
 * Display the form for creating a new Application.
 *
 */
/*
 * UI_Work_Interface_List_NewPage
 *
 * Display the form for creating a new Page.  This Popup will manage several
 * different sub components for gathering Page data for saving.
 *
 * The sub components will gather the data for the object and do basic form
 * validations on their interface.
 *
 * when ready, the sub component will emit "save" with the values gathered by
 * the form.  This component will manage the actual final object validation,
 * and saving to this application.
 *
 * On success, "save.success" will be emitted on the sub-component, and this
 * component.
 *
 * On Error, "save.error" will be emitted on the sub-component.
 *
 */


//import UIQuickPage from "./ui_work_interface_list_newPage_quick"

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Interface_List_NewPage extends AB.ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         var base = "ab_work_interface_list_newInterface";
         super({
            component: base,
            tab: `${base}_tab`,
         });

         this.currentApplication = null;
         // {ABApplication} the ABApplication we are currently working on.

         this.selectNew = true;
         // {bool} do we select a new interface after it is created.

         // var callback = null;

         this.BlankTab = new _ui_work_interface_list_newPage_blank__WEBPACK_IMPORTED_MODULE_0__["default"](AB);
         //this.QuickTab = new UIQuickPage(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            // width: 400,
            position: "center",
            modal: true,
            head: L("Add new interface"),
            selectNewInterface: true,
            body: {
               view: "tabview",
               id: this.ids.tab,
               cells: [
                  this.BlankTab.ui(),
                  //this.QuickTab.ui(),
               ],
               tabbar: {
                  on: {
                     onAfterTabClick: (id) => {
                        this.switchTab(id);
                     },
                     onAfterRender() {
                        this.$view
                           .querySelectorAll(".webix_item_tab")
                           .forEach((t) => {
                              var tid = t.getAttribute("button_id");
                              AB.ClassUI.CYPRESS_REF(t, `${tid}_tab`);
                           });
                     },
                  },
               },
            },
            on: {
               onBeforeShow: () => {
                  var id = $$(this.ids.tab).getValue();
                  this.switchTab(id);
               },
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$component = $$(this.ids.component);
         this.$form = $$(this.ids.form);

         var allInits = [];
         ["BlankTab" /*, "QuickTab" */].forEach((k) => {
            allInits.push(this[k].init(AB));
            this[k].on("cancel", () => {
               this.emit("cancel");
            });
            this[k].on("save", (values) => {
               this.save(values, k);
            });
         });

         return Promise.all(allInits);
      }

      /**
       * @method applicationLoad()
       * prepare ourself with the current application
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.currentApplication = application; // remember our current Application.
         this.BlankTab.applicationLoad(application); // send so parent pagelist can be made
         //  this.QuickTab.applicationLoad(application);
      }

      /**
       * @function hide()
       *
       * remove the busy indicator from the form.
       */
      hide() {
         if (this.$component) this.$component.hide();
      }

      /**
       * Show the busy indicator
       */
      busy() {
         if (this.$component) {
            this.$component.showProgress();
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         if (this.$component) {
            this.$component.hideProgress();
         }
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {interface} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj, this.selectNew);
         // _logic.callbacks.onDone(null, obj, selectNew, callback); // tell parent component we're done
      }

      /**
       * @method save
       * take the data gathered by our child creation tabs, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @param {string}  tabKey
       *        the "key" of the tab initiating the save.
       * @return {Promise}
       */
      async save(values, tabKey) {
         // must have an application set.
         if (!this.currentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this[tabKey].emit("save.error", true);
            return false;
         }

         if (!values) {
            // SaveButton.enable();
            // CurrentEditor.formReady();
            return;
         }

         // create a new (unsaved) instance of our interface:
         // this interface only creates Root Pages, or pages related to
         var newInterface = null;
         if (values.useParent && values.parent) {
            // ?????????????????
            newInterface = values.parent;
         } else if (values.parent) {
            newInterface = values.parent.pageNew(values);
         } else {
            //page = CurrentApplication.pageNew(values);
            newInterface = this.currentApplication.pageNew(values);
         }
         //

         // have newInterface validate it's values.
         // if this item supports isValid()
         if (newInterface.isValid) {
           var validator = newInterface.isValid();
           if (validator.fail()) {
             // cb(validator); // tell current Tab component the errors
             this[tabKey].emit("save.error", validator);
             newInterface.label = state.old;

             return false; // stop here.
           }
         }

         if (!newInterface.createdInAppID) {
            newInterface.createdInAppID = this.currentApplication.id;
         }

         // show progress
         this.busy();

         // if we get here, save the new Page
         try {
            var obj = await newInterface.save();
            // await this.currentApplication.pageInsert(obj);
            this[tabKey].emit("save.successful", obj);
            this.done(obj);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the currentApplication.
            await this.currentApplication.pageRemove(newInterface);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if (this.$component) this.$component.show();
      }

      switchTab(tabId) {
         if (tabId == this.BlankTab?.ui?.body?.id) {
            this.BlankTab?.onShow?.(this.currentApplication);
         } else if (tabId == this.QuickTab?.ui?.body?.id) {
            this.QuickTab?.onShow?.(this.currentApplication);
         }
      }
   }

   return new UI_Work_Interface_List_NewPage();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_interface_list_newPage_blank.js":
/*!************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_interface_list_newPage_blank.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * ui_work_interface_list_newPage_blank
 *
 * Display the form for creating a new ABPage.
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Interface_List_NewPage_Blank extends AB.ClassUI {
      constructor() {
         var base = "ui_work_interface_list_newPage_blank";
         super({
            component: base,

            form: `${base}_blank`,
            buttonSave: `${base}_save`,
            buttonCancel: `${base}_cancel`,
         });
         this.ids.parentList = {};
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Blank"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validatePageName
               },
               elements: [
                  {
                     view: "select",
                     id: this.ids.parentList,
                     // label: labels.component.parentPage,
                     label: L("Parent Page"),
                     name: "parent",
                     options: [],
                     //
                     placeholder: L("[Root Page]"),
                     labelWidth: 110,
                     // on: {
                     //   onAfterRender() {
                     //       AB.ClassUI.CYPRESS_REF(
                     //         this,
                     //         "ui_work_interface_list_newPage_blank_name"
                     //       );
                     //   },
                     // },
                  },
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Page name"),
                     labelWidth: 110,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(
                              this,
                              "ui_work_interface_list_newPage_blank_name"
                           );
                        },
                     },
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.cancel();
                           },
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Add Page"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);

         // "save.error" is triggered by the ui_work_interface_list_newPage
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_interface_list_newPage
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      /**
       * @function applicationLoad()
       *
       * Prepare our New Popups with the current Application
       */
      applicationLoad(application) {
         this.currentApplication = application;

         var options = [{ id: "-", value: L("[Root page]") }]; // L("ab.interface.rootPage", "*[Root page]")

         var addPage = function (page, indent) {
            indent = indent || "";
            options.push({
               id: page.urlPointer(),
               value: indent + page.label,
            });
            page
               // .pages((p) => p instanceof AB.Class.ABViewPage)
               .pages()
               .forEach(function (p) {
                  addPage(p, indent + "-");
               });
         };
         // this.currentApplication.pages((p) => p instanceof AB.Class.ABViewPage).forEach(
         this.currentApplication.pages().forEach(function (page) {
            addPage(page, "");
         });

         if($$(this.ids?.parentList)?.define){
         // $$(this.ids.parentList).define("options", options);
            $$(this.ids.parentList).define("options", options);
            $$(this.ids.parentList).refresh();
         }
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         this.$form.clearValidation();
         this.$form.clear();
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_interface_list_newPage object had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of objects:
       *        - A javascript Error() object
       *        - An ABValidation object returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            var message = L("the entered data is invalid");
            // if this was our Validation() object:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Page: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_interface_list_newPage successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @function save
       *
       * verify the current info is ok, package it, and return it to be
       * added to the application.createModel() method.
       */
      save() {
         var saveButton = $$(this.ids.buttonSave);
         saveButton.disable();

         var Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            saveButton.enable();
            return false;
         }

         var values = Form.getValues();

         if (values.parent === "-") {
            values.parent = null;
         } else if (values.parent) {
            values.parent = this.currentApplication.urlResolve(values.parent);
         }

         // set uuid to be primary column
         values.primaryColumnName = "uuid";

         this.emit("save", values);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if ($$(this.ids.component)) $$(this.ids.component).show();
      }
   }
   return new UI_Work_Interface_List_NewPage_Blank();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object.js":
/*!**************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_object_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object_list */ "./src/rootPages/Designer/ui_work_object_list.js");
/* harmony import */ var _ui_work_object_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_object_workspace */ "./src/rootPages/Designer/ui_work_object_workspace.js");
/*
 * ui_work_object
 *
 * Display the Object Tab UI:
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();
   var ObjectList = (0,_ui_work_object_list__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
   var ObjectWorkspace = (0,_ui_work_object_workspace__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);

   class UI_Work_Object extends UIClass {
      //.extend(idBase, function(App) {

      constructor() {
         super("ui_work_object");
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            margin: 10,
            cols: [ObjectList.ui(), { view: "resizer" }, ObjectWorkspace.ui()],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI

         ObjectList.on("selected", (objID) => {
            if (objID == null) ObjectWorkspace.clearObjectWorkspace();
            else ObjectWorkspace.populateObjectWorkspace(objID);
         });

         ObjectWorkspace.on("addNew", (selectNew) => {
            ObjectList.emit("addNew", selectNew);
         });

         return Promise.all([ObjectWorkspace.init(AB), ObjectList.init(AB)]);
      }

      /**
       * @method applicationLoad
       * Initialize the Object Workspace with the given ABApplication.
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      applicationLoad(application) {
         var oldAppID = this.CurrentApplicationID;
         super.applicationLoad(application);

         if (oldAppID != this.CurrentApplicationID) {
            ObjectWorkspace.clearObjectWorkspace();
         }

         ObjectList.applicationLoad(application);
         ObjectWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         // if (this.CurrentApplicationID) {
         //    ObjectList?.applicationLoad(this.CurrentApplicationID);
         // }
         ObjectList?.ready();
      }
   }

   return new UI_Work_Object();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_list.js":
/*!*******************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_list.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_common_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_common_list */ "./src/rootPages/Designer/ui_common_list.js");
/* harmony import */ var _ui_work_object_list_newObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_object_list_newObject */ "./src/rootPages/Designer/ui_work_object_list_newObject.js");
/*
 * ui_work_object_list
 *
 * Manage the ABObject List
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();

   var AddForm = new _ui_work_object_list_newObject__WEBPACK_IMPORTED_MODULE_2__["default"](AB);
   // the popup form for adding a new process

   class UI_Work_Object_List extends UIClass {
      constructor() {
         super("ui_work_object_list");

         this.ListComponent = (0,_ui_common_list__WEBPACK_IMPORTED_MODULE_1__["default"])(AB, {
            idBase: this.ids.component,
            labels: {
               addNew: "Add new object",
               confirmDeleteTitle: "Delete Object",
               title: "Objects",
               searchPlaceholder: "Object name",
            },
            // we can overrid the default template like this:
            // templateListItem:
            //    "<div class='ab-object-list-item'>#label##warnings#{common.iconGear}</div>",
            menu: {
               copy: false,
               exclude: true,
            },
         });
         // {ui_common_list} instance to display a list of our objects.
      }

      // Our webix UI definition:
      ui() {
         return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB) {
         this.AB = AB;

         this.on("addNew", (selectNew) => {
            // if we receive a signal to add a new Object from another source
            // like the blank object workspace offering an Add New button:
            this.clickNewProcess(selectNew);
         });

         //
         // List of Objects
         //
         await this.ListComponent.init(AB);

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item?.id);
         });

         this.ListComponent.on("addNew", (selectNew) => {
            this.clickNewProcess(selectNew);
         });

         this.ListComponent.on("deleted", (item) => {
            this.emit("deleted", item);
         });

         this.ListComponent.on("exclude", (item) => {
            this.exclude(item);
         });

         // this.ListComponent.on("copied", (data) => {
         //    this.copy(data);
         // });

         // ListComponent.on("menu", (data)=>{
         // 	console.log(data);
         // 	switch (data.command) {
         // 		case "exclude":
         // 			this._logic.exclude(process);
         // 			break;

         // 		case "copy":
         // 			break;
         // 	}
         // })

         //
         // Add Form
         //
         await AddForm.init(AB);

         AddForm.on("cancel", () => {
            AddForm.hide();
         });

         AddForm.on("save", (obj /* , select */) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(obj.id);
            // }
         });

         this._handler_refreshApp = (def) => {
            if (this.CurrentApplication.refreshInstance) {
               // TODO: Johnny refactor this
               this.CurrentApplication =
                  this.CurrentApplication.refreshInstance();
            }
            this.applicationLoad(this.CurrentApplication);
         };
      }

      /**
       * @function applicationLoad
       * Initialize the List from the provided ABApplication
       * If no ABApplication is provided, then show an empty form. (create operation)
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      applicationLoad(application) {
         var oldAppID = this.CurrentApplicationID;
         var selectedItem = null;
         // {ABObject}
         // if we are updating the SAME application, we will want to default
         // the list to the currently selectedItem

         super.applicationLoad(application);

         if (oldAppID == this.CurrentApplicationID) {
            selectedItem = this.ListComponent.selectedItem();
         }

         // NOTE: only include System Objects if the user has permission
         var f = (obj) => !obj.isSystemObject;
         if (this.AB.Account.isSystemDesigner()) {
            f = () => true;
         }
         this.ListComponent.dataLoad(application?.objectsIncluded(f));

         if (selectedItem) {
            this.ListComponent.selectItem(selectedItem.id);
         }

         AddForm.applicationLoad(application);
      }

      /**
       * @function clickNewProcess
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewProcess(/* selectNew */) {
         // show the new popup
         AddForm.show();
      }

      /*
       * @function copy
       * the list component notified us of a copy action and has
       * given us the new data for the copied item.
       *
       * now our job is to create a new instance of that Item and
       * tell the list to display it
       */
      // copy(data) {
      //    debugger;
      //    // TODO:
      //    this.ListComponent.busy();

      //    this.CurrentApplication.processCreate(data.item).then((newProcess) => {
      //       this.ListComponent.ready();
      //       this.ListComponent.dataLoad(this.CurrentApplication.processes());
      //       this.ListComponent.select(newProcess.id);
      //    });
      // }

      /*
       * @function exclude
       * the list component notified us of an exclude action and which
       * item was chosen.
       *
       * perform the removal and update the UI.
       */
      async exclude(item) {
         this.ListComponent.busy();
         var app = this.CurrentApplication;
         await app.objectRemove(item);
         this.ListComponent.dataLoad(app.objectsIncluded());

         // this will clear the object workspace
         this.emit("selected", null);
      }

      ready() {
         this.ListComponent.ready();
      }
   }
   return new UI_Work_Object_List();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_list_newObject.js":
/*!*****************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_list_newObject.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_object_list_newObject_blank__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object_list_newObject_blank */ "./src/rootPages/Designer/ui_work_object_list_newObject_blank.js");
/* harmony import */ var _ui_work_object_list_newObject_csv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_object_list_newObject_csv */ "./src/rootPages/Designer/ui_work_object_list_newObject_csv.js");
/* harmony import */ var _ui_work_object_list_newObject_import__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui_work_object_list_newObject_import */ "./src/rootPages/Designer/ui_work_object_list_newObject_import.js");
/*
 * ui_work_object_list_newObject
 *
 * Display the form for creating a new Object.  This Popup will manage several
 * different sub components for gathering Object data for saving.
 *
 * The sub components will gather the data for the object and do basic form
 * validations on their interface.
 *
 * when ready, the sub component will emit "save" with the values gathered by
 * the form.  This component will manage the actual final object validation,
 * and saving to this application.
 *
 * On success, "save.success" will be emitted on the sub-component, and this
 * component.
 *
 * On Error, "save.error" will be emitted on the sub-component.
 *
 */




// const ABImportExternal = require("./ab_work_object_list_newObject_external");
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Object_List_NewObject extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject", {
            tab: "",
         });

         this.selectNew = true;
         // {bool} do we select a new object after it is created.

         // var callback = null;

         this.BlankTab = (0,_ui_work_object_list_newObject_blank__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
         this.CsvTab = (0,_ui_work_object_list_newObject_csv__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
         this.ImportTab = (0,_ui_work_object_list_newObject_import__WEBPACK_IMPORTED_MODULE_3__["default"])(AB);
         /*
         this.ExternalTab = new ABImportExternal(AB);
         */
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            // width: 400,
            position: "center",
            modal: true,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Add new object"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.emit("cancel");
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            selectNewObject: true,
            body: {
               view: "tabview",
               id: this.ids.tab,
               cells: [
                  this.BlankTab.ui() /*, this.ImportTab.ui(), this.ExternalTab.ui() */,
                  this.CsvTab.ui(),
                  this.ImportTab.ui(),
               ],
               tabbar: {
                  on: {
                     onAfterTabClick: (id) => {
                        this.switchTab(id);
                     },
                     onAfterRender() {
                        this.$view
                           .querySelectorAll(".webix_item_tab")
                           .forEach((t) => {
                              var tid = t.getAttribute("button_id");
                              UIClass.CYPRESS_REF(t, `${tid}_tab`);
                           });
                     },
                  },
               },
            },
            on: {
               onBeforeShow: () => {
                  var id = $$(this.ids.tab).getValue();
                  this.switchTab(id);
               },
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$component = $$(this.ids.component);

         var allInits = [];
         ["BlankTab", "CsvTab", "ImportTab" /*, "ExternalTab"*/].forEach(
            (k) => {
               allInits.push(this[k].init(AB));
               this[k].on("cancel", () => {
                  this.emit("cancel");
               });
               this[k].on("save", (values) => {
                  this.save(values, k);
               });
            }
         );

         return Promise.all(allInits);
      }

      /**
       * @method applicationLoad()
       * prepare ourself with the current application
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      // applicationLoad(application) {

      //    this.CurrentApplicationID = application?.id;
      // }

      /**
       * @function hide()
       *
       * remove the busy indicator from the form.
       */
      hide() {
         this.$component?.hide();
      }

      /**
       * Show the busy indicator
       */
      busy() {
         this.$component?.showProgress?.();
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         this.$component?.hideProgress?.();
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {object} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj, this.selectNew);
      }

      /**
       * @method save
       * take the data gathered by our child creation tabs, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @param {string}  tabKey
       *        the "key" of the tab initiating the save.
       * @return {Promise}
       */
      async save(values, tabKey) {
         // must have an application set.
         if (!this.CurrentApplicationID) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this[tabKey].emit("save.error", true);
            return false;
         }

         // create a new (unsaved) instance of our object:
         var newObject = this.AB.objectNew(values);

         // have newObject validate it's values.
         var validator = newObject.isValid();
         if (validator.fail()) {
            this[tabKey].emit("save.error", validator);
            // cb(validator); // tell current Tab component the errors
            return false; // stop here.
         }

         if (!newObject.createdInAppID) {
            newObject.createdInAppID = this.CurrentApplicationID;
         }

         // show progress
         this.busy();

         var application = this.CurrentApplication;

         // if we get here, save the new Object
         try {
            var obj = await newObject.save();
            await application.objectInsert(obj);
            this[tabKey].emit("save.successful", obj);
            this.done(obj);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the current application.
            await application.objectRemove(newObject);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * @function show()
       * Show this component.
       */
      show(shouldSelectNew) {
         if (shouldSelectNew != null) {
            this.selectNew = shouldSelectNew;
         }
         if (this.$component) this.$component.show();
      }

      switchTab(tabId) {
         if (tabId == this.BlankTab?.ui?.body?.id) {
            this.BlankTab?.onShow?.(this.CurrentApplicationID);
         } else if (tabId == this.CsvTab?.ui?.body?.id) {
            this.CsvTab?.onShow?.(this.CurrentApplicationID);
         } else if (tabId == this.ImportTab?.ui?.body?.id) {
            this.ImportTab?.onShow?.(this.CurrentApplicationID);
         } else if (tabId == this.ExternalTab?.ui?.body?.id) {
            this.ExternalTab?.onShow?.(this.CurrentApplicationID);
         }
      }
   }

   return new UI_Work_Object_List_NewObject();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_list_newObject_blank.js":
/*!***********************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_list_newObject_blank.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_object_list_newObject_blank
 *
 * Display the form for creating a new ABObject.
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Object_List_NewObject_Blank extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_blank", {
            // component: base,

            form: "",
            buttonSave: "",
            buttonCancel: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Create"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateObjectName
               },
               elements: [
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Object name"),
                     labelWidth: 70,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(
                              this,
                              "ui_work_object_list_newObject_blank_name"
                           );
                        },
                     },
                  },
                  {
                     name: "isSystemObject",
                     view: "checkbox",
                     labelRight: L("is this a System Object?"),
                     labelWidth: 0,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(
                              this,
                              "ui_work_object_list_newObject_blank_isSystemObj"
                           );
                        },
                     },
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.cancel();
                           },
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Add Object"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);

         // "save.error" is triggered by the ui_work_object_list_newObject
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_object_list_newObject
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         this.$form.clearValidation();
         this.$form.clear();
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_object_list_newObject object had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of objects:
       *        - A javascript Error() object
       *        - An ABValidation object returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            var message = L("the entered data is invalid");
            // if this was our Validation() object:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Object: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_object_list_newObject successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @function save
       *
       * verify the current info is ok, package it, and return it to be
       * added to the application.createModel() method.
       */
      save() {
         var saveButton = $$(this.ids.buttonSave);
         saveButton.disable();

         var Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            saveButton.enable();
            return false;
         }

         var values = Form.getValues();

         // set uuid to be primary column
         values.primaryColumnName = "uuid";

         this.emit("save", values);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component)?.show();
      }
   }
   return new UI_Work_Object_List_NewObject_Blank();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_list_newObject_csv.js":
/*!*********************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_list_newObject_csv.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _utils_CSVImporter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/CSVImporter.js */ "./src/utils/CSVImporter.js");
/* harmony import */ var _utils_CSVImporter_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_utils_CSVImporter_js__WEBPACK_IMPORTED_MODULE_1__);
/*
 * ui_work_object_list_newObject_csv
 *
 * Display the form for import CSV file to a object.
 *
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();
   let uiSettings = AB.Config.uiSettings();

   class UI_Work_Object_List_NewObject_Csv extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_csv", {
            // component: base,

            form: "",
            uploadFileList: "",
            separatedBy: "",
            headerOnFirstLine: "",
            columnList: "",
            importButton: "",
         });

         this._csvImporter = new (_utils_CSVImporter_js__WEBPACK_IMPORTED_MODULE_1___default())(AB);
      }

      ui() {
         let ids = this.ids;

         // Our webix UI definition:
         return {
            id: ids.component,
            header: L("Import CSV"),
            body: {
               view: "form",
               id: ids.form,
               width: 400,
               rules: {},
               elements: [
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Object name"),
                     labelWidth: uiSettings.labelWidthMedium,
                  },
                  {
                     view: "uploader",
                     name: "csvFile",
                     value: L("Choose a CSV file"),
                     accept: "text/csv",
                     multiple: false,
                     autosend: false,
                     link: ids.uploadFileList,
                     on: {
                        onBeforeFileAdd: (fileInfo) => {
                           return this.loadCsvFile(fileInfo);
                        },
                     },
                  },
                  {
                     id: ids.uploadFileList,
                     name: "uploadedFile",
                     view: "list",
                     type: "uploader",
                     autoheight: true,
                     borderless: true,
                     onClick: {
                        webix_remove_upload: (e, id /*, trg */) => {
                           this.removeCsvFile(id);
                        },
                     },
                  },
                  {
                     id: ids.separatedBy,
                     view: "richselect",
                     name: "separatedBy",
                     label: L("Separated by"),
                     labelWidth: uiSettings.labelWidthXLarge,
                     options: this._csvImporter.getSeparateItems(),
                     value: ",",
                     on: {
                        onChange: () => {
                           this.populateColumnList();
                        },
                     },
                  },
                  {
                     id: ids.headerOnFirstLine,
                     view: "checkbox",
                     name: "headerOnFirstLine",
                     labelRight: L("Header on first line"),
                     labelWidth: 0,
                     disabled: true,
                     value: true,
                     on: {
                        onChange: (/* newVal, oldVal */) => {
                           this.populateColumnList();
                        },
                     },
                  },
                  {
                     type: "space",
                     rows: [
                        {
                           view: "scrollview",
                           height: 260,
                           minHeight: 260,
                           maxHeight: 260,
                           body: {
                              id: ids.columnList,
                              disabled: true,
                              rows: [],
                           },
                        },
                     ],
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           name: "cancel",
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.cancel();
                           },
                        },
                        {
                           view: "button",
                           name: "import",
                           id: ids.importButton,
                           value: L("Import"),
                           css: "webix_primary",
                           disabled: true,
                           autowidth: true,
                           type: "form",
                           click: () => {
                              this.import();
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.allFields = this.AB.Class.ABFieldManager.allFields();

         this._dataRows = [];

         this.$form = $$(this.ids.form);
         this.$uploadFileList = $$(this.ids.uploadFileList);
         this.$separatedBy = $$(this.ids.separatedBy);
         this.$headerOnFirstLine = $$(this.ids.headerOnFirstLine);
         this.$columnList = $$(this.ids.columnList);
         this.$importButton = $$(this.ids.importButton);

         // "save.error" is triggered by the ui_work_object_list_newObject
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_object_list_newObject
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      async loadCsvFile(fileInfo) {
         if (!this._csvImporter.validateFile(fileInfo)) {
            webix.alert({
               title: L("This file extension is not allowed"),
               text: L("Please only upload CSV files"),
               ok: L("OK"),
            });

            return false;
         }

         // show loading cursor
         if (this.$form.showProgress) this.$form.showProgress({ type: "icon" });

         // read CSV file
         let separatedBy = this.$separatedBy.getValue();
         this._dataRows = await this._csvImporter.getDataRows(
            fileInfo,
            separatedBy
         );

         this.$headerOnFirstLine.enable();
         this.$columnList.enable();
         this.$importButton.enable();

         this.populateColumnList();

         if (this.$form.hideProgress) this.$form.hideProgress();

         return true;
      }

      removeCsvFile(fileId) {
         this.$uploadFileList.remove(fileId);
         this.formClear();
         return true;
      }

      populateColumnList() {
         webix.ui([], this.$columnList);

         var firstLine = this._dataRows[0];
         if (firstLine == null) return;

         var columnList = [];

         if (this.$headerOnFirstLine.getValue()) {
            columnList = firstLine.map((colName, index) => {
               return {
                  include: true,
                  columnName: colName,
                  dataType: this._csvImporter.getGuessDataType(
                     this._dataRows,
                     index
                  ),
               };
            });
         } else {
            for (var i = 0; i < firstLine.length; i++) {
               columnList.push({
                  include: true,
                  columnName: "Field " + (i + 1),
                  dataType: this._csvImporter.getGuessDataType(
                     this._dataRows,
                     i
                  ),
               });
            }
         }

         // Add dynamic columns UI
         let uiColumns = [];
         columnList.forEach((col) => {
            uiColumns.push({
               height: 40,
               cols: [
                  {
                     view: "checkbox",
                     value: col.include,
                     width: 30,
                  },
                  {
                     view: "text",
                     value: col.columnName,
                     width: uiSettings.labelWidthXLarge,
                  },
                  {
                     view: "select",
                     value: col.dataType,
                     options: [
                        {
                           id: "string",
                           value: this.allFields
                              .filter((f) => f.key == "string")[0]
                              .defaults().menuName,
                        },
                        {
                           id: "LongText",
                           value: this.allFields
                              .filter((f) => f.key == "LongText")[0]
                              .defaults().menuName,
                        },
                        {
                           id: "number",
                           value: this.allFields
                              .filter((f) => f.key == "number")[0]
                              .defaults().menuName,
                        },
                        {
                           id: "date",
                           value: this.allFields
                              .filter((f) => f.key == "date")[0]
                              .defaults().menuName,
                        },
                        {
                           id: "boolean",
                           value: this.allFields
                              .filter((f) => f.key == "boolean")[0]
                              .defaults().menuName,
                        },
                     ],
                     width: 120,
                  },
               ],
            });
         });

         webix.ui(uiColumns, $$(this.$columnList));
      }

      import() {
         this.$importButton.disable();

         if (!this.$form.validate()) {
            this.$importButton.enable();
            return false;
         }

         // Validate required column names
         let columnViews = $$(this.$columnList).getChildViews();
         var emptyColNames = columnViews.filter((cView) => {
            return (
               cView.queryView({ view: "checkbox" }).getValue() &&
               cView.queryView({ view: "text" }).getValue().trim().length == 0
            );
         });
         if (emptyColNames.length > 0) {
            webix.alert({
               title: L("Column name is required"),
               text: L("Please enter column name"),
               ok: L("OK"),
            });

            this.$importButton.enable();
            return false;
         }

         // Validate reserve column names
         var reservedColNames = columnViews.filter((cView) => {
            return (
               cView.queryView({ view: "checkbox" }).getValue() &&
               this.allFields[0].reservedNames.indexOf(
                  cView
                     .queryView({ view: "text" })
                     .getValue()
                     .trim()
                     .toLowerCase()
               ) > -1
            );
         });
         if (reservedColNames.length > 0) {
            webix.alert({
               title: L("Column name is invalid"),
               text: L(
                  "Please enter column name that does not match [{0}]",
                  this.allFields[0].reservedNames.join(", ")
               ),
               ok: L("OK"),
            });

            this.$importButton.enable();
            return false;
         }

         // create new object
         let newObjAttr = {
            primaryColumnName: "uuid", // set uuid to be primary column
            name: this.$form.getValues()["name"],
         };

         // now send data back to be added:
         this.emit("save", newObjAttr);
      }

      onSuccess(newObj) {
         let subTasks = Promise.resolve();

         // add new columns to object
         let columnViews = $$(this.$columnList).getChildViews();
         columnViews.forEach((cView, index) => {
            let include = cView.queryView({ view: "checkbox" }).getValue();
            if (!include) return;

            let columnName = cView.queryView({ view: "text" }).getValue();
            let dataType = cView.queryView({ view: "select" }).getValue();

            let newField = {
               // id: AB.uuid(),
               columnName: columnName,
               label: columnName,
               key: dataType,
               settings: {
                  showIcon: 1,
                  weight: index,
               },
            };

            switch (dataType) {
               case "string":
               case "LongText":
                  newField.settings.supportMultilingual = 0;
                  break;
            }

            let field = newObj.fieldNew(newField);
            subTasks = subTasks.then(() => field.save());
            // .then(() => field.migrateCreate());
         });

         // add rows to Server
         var objModel = newObj.model();

         // Add each records sequentially
         this._dataRows.forEach((data, index) => {
            subTasks = subTasks.then(() => {
               if (this.$headerOnFirstLine.getValue() && index == 0)
                  return Promise.resolve();

               var rowData = {};
               var colValues = data;

               newObj.fields().forEach((col) => {
                  if (colValues[col.settings.weight] != null)
                     rowData[col.columnName] = colValues[col.settings.weight];
               });

               // Add row data
               return objModel.create(rowData);
            });
         });

         // if there was no error, clear the form for the next
         // entry:
         return subTasks
            .then(() => {
               this.formClear();
               this.$importButton.enable();

               return Promise.resolve();
            })
            .catch((err) => {
               AB.notify.developer(err, {
                  message: "Error import data rows from CSV",
               });
            });
      }

      onError(err) {
         // if this was our Validation() object:
         if (err) {
            if (err.updateForm) err.updateForm(this.$form);

            // get notified if there was an error saving.
            this.$importButton.enable();
         }
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         this._dataRows = [];

         this.$form.clearValidation();
         this.$form.clear();
         this.$separatedBy.setValue(",");

         webix.ui([], $$(this.$columnList));
         this.$uploadFileList.clearAll();

         this.$headerOnFirstLine.disable();
         this.$columnList.disable();
         this.$importButton.disable();
      }
   }
   return new UI_Work_Object_List_NewObject_Csv();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_list_newObject_import.js":
/*!************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_list_newObject_import.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_object_list_newObject_import
 *
 * Display the form for importing an existing object into the application.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Object_List_NewObject_Import extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_import", {
            // component: base,

            form: "",
            filter: "",
            objectList: "",
            columnList: "",
            buttonSave: "",
            buttonCancel: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Existing"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               elements: [
                  // Filter
                  {
                     cols: [
                        {
                           view: "icon",
                           icon: "fa fa-filter",
                           align: "left",
                        },
                        {
                           view: "text",
                           id: this.ids.filter,
                           on: {
                              onTimedKeyPress: () => this.filter(),
                           },
                        },
                     ],
                  },

                  // Model list
                  {
                     view: "list",
                     id: this.ids.objectList,
                     select: true,
                     height: 200,
                     minHeight: 250,
                     maxHeight: 250,
                     data: [],
                     template: "<div>#label#</div>",
                     on: {
                        onSelectChange: () => this.objectSelect(),
                     },
                  },

                  // Columns list
                  {
                     view: "label",
                     label: `<b>${L("Columns")}</b>`,
                     height: 20,
                  },
                  {
                     view: "list",
                     id: this.ids.columnList,
                     datatype: "json",
                     multiselect: false,
                     select: false,
                     height: 200,
                     minHeight: 200,
                     maxHeight: 200,
                     type: {
                        height: 40,
                        isvisible: {
                           view: "checkbox",
                           width: 30,
                        },
                     },
                     template: (obj /* , common */) => {
                        // return `
                        //     <span style="float: left;">${common.isvisible(obj, common)}</span>
                        //     <span style="float: left;">${obj.label}</span>
                        // `;
                        return `
                               <span style="float: left;"><i class="fa fa-${obj.icon}"></i></span>
                               <span style="float: left;">&nbsp;${obj.label}</span>
                           `;
                     },
                  },

                  // Import & Cancel buttons
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => this.cancel(),
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Import"),
                           autowidth: true,
                           type: "form",
                           click: () => this.save(),
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         this.$filter = $$(this.ids.filter);
         this.$objectList = $$(this.ids.objectList);
         this.$columnList = $$(this.ids.columnList);
         this.$buttonSave = $$(this.ids.buttonSave);
         this.$buttonCancel = $$(this.ids.buttonCancel);

         // "save.error" is triggered by the ui_work_object_list_newObject
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_object_list_newObject
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      onShow(app) {
         this.formClear();

         // now all objects are *global* but an application might only
         // reference a sub set of them.  Here we just need to show
         // the objects our current application isn't referencing:

         let availableObjs = app.objectsExcluded(
            (o) => !o.isSystemObject || AB.Account.isSystemDesigner()
         );
         this.$objectList.parse(availableObjs, "json");
      }

      filter() {
         let filterText = this.$filter.getValue();
         this.$objectList.filter("#label#", filterText);
      }

      objectSelect() {
         this.$columnList.clearAll();

         let selectedObj = this.$objectList.getSelectedItem(false);
         if (selectedObj) {
            let colNames = [];

            // Now that ABObjects are ABDefinitions, we no longer
            // have to lookup the data from the server:

            selectedObj.fields().forEach((f) => {
               // Skip these columns
               // TODO : skip connect field
               // if (col.model) continue;
               // if (col.collection) continue;

               //    let fieldClass = ABFieldManager.allFields().filter(
               //       (field) => field.defaults().key == f.key
               //    )[0];
               //    if (fieldClass == null) return;

               //    // If connect field does not link to objects in app, then skip
               //    if (
               //       f.key == "connectObject" &&
               //       !currentApp.objectsIncluded(
               //          (obj) => obj.id == f.settings.linkObject
               //       )[0]
               //    ) {
               //       return;
               //    }

               colNames.push({
                  id: f.id,
                  label: f.label,
                  isvisible: true,
                  icon: f.icon,
                  // disabled: !supported
               });
            });

            if (colNames.length == 0) {
               colNames.push({
                  id: "none",
                  label: L("No Fields Defined"),
                  isvisible: true,
               });
            }

            this.$columnList.parse(colNames);
         }
      }

      save() {
         var selectedObj = this.$objectList.getSelectedItem();
         if (!selectedObj) return false;

         this.$buttonSave.disable();

         this.emit("save", selectedObj);
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         // Filter section
         this.$form.clearValidation();
         this.$form.clear();
         // Lists
         this.$objectList.clearAll();
         this.$columnList.clearAll();
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_object_list_newObject object had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of objects:
       *        - A javascript Error() object
       *        - An ABValidation object returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            var message = L("the entered data is invalid");
            // if this was our Validation() object:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Object: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         this.$buttonSave.enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_object_list_newObject successfully saved the values.
       */
      onSuccess() {
         this.$buttonSave.enable();
      }
   }

   return new UI_Work_Object_List_NewObject_Import();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace.js":
/*!************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_object_workspace_popupCustomIndex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object_workspace_popupCustomIndex */ "./src/rootPages/Designer/ui_work_object_workspace_popupCustomIndex.js");
/* harmony import */ var _ui_work_object_workspace_popupDefineLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_object_workspace_popupDefineLabel */ "./src/rootPages/Designer/ui_work_object_workspace_popupDefineLabel.js");
/* harmony import */ var _ui_work_object_workspace_popupExport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui_work_object_workspace_popupExport */ "./src/rootPages/Designer/ui_work_object_workspace_popupExport.js");
/* harmony import */ var _ui_work_object_workspace_popupFrozenColumns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui_work_object_workspace_popupFrozenColumns */ "./src/rootPages/Designer/ui_work_object_workspace_popupFrozenColumns.js");
/* harmony import */ var _ui_work_object_workspace_popupHeaderEditMenu__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui_work_object_workspace_popupHeaderEditMenu */ "./src/rootPages/Designer/ui_work_object_workspace_popupHeaderEditMenu.js");
/* harmony import */ var _ui_work_object_workspace_popupHideFields__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ui_work_object_workspace_popupHideFields */ "./src/rootPages/Designer/ui_work_object_workspace_popupHideFields.js");
/* harmony import */ var _ui_work_object_workspace_popupImport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ui_work_object_workspace_popupImport */ "./src/rootPages/Designer/ui_work_object_workspace_popupImport.js");
/* harmony import */ var _ui_work_object_workspace_popupNewDataField__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ui_work_object_workspace_popupNewDataField */ "./src/rootPages/Designer/ui_work_object_workspace_popupNewDataField.js");
/* harmony import */ var _ui_work_object_workspace_popupSortFields__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ui_work_object_workspace_popupSortFields */ "./src/rootPages/Designer/ui_work_object_workspace_popupSortFields.js");
/* harmony import */ var _ui_work_object_workspace_popupViewSettings__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ui_work_object_workspace_popupViewSettings */ "./src/rootPages/Designer/ui_work_object_workspace_popupViewSettings.js");
/* harmony import */ var _ui_work_object_workspace_workspaceviews__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ui_work_object_workspace_workspaceviews */ "./src/rootPages/Designer/ui_work_object_workspace_workspaceviews.js");
/* harmony import */ var _ui_work_object_workspace_view_grid__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ui_work_object_workspace_view_grid */ "./src/rootPages/Designer/ui_work_object_workspace_view_grid.js");
/* harmony import */ var _ui_work_object_workspace_view_kanban__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ui_work_object_workspace_view_kanban */ "./src/rootPages/Designer/ui_work_object_workspace_view_kanban.js");
/* harmony import */ var _ui_work_object_workspace_popupTrack__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ui_work_object_workspace_popupTrack */ "./src/rootPages/Designer/ui_work_object_workspace_popupTrack.js");
/*
 * ui_work_object_workspace
 *
 * Manage the Object Workspace area.
 */

// const ABWorkspaceGantt = require("./ab_work_object_workspace_gantt");

// const ABWorkspaceIndex = require("./ab_work_object_workspace_index");

// const ABPopupFilterDataTable = require("./ab_work_object_workspace_popupFilterDataTable");



















/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB, init_settings) {
   const uiConfig = AB.Config.uiSettings();
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   var Datatable = (0,_ui_work_object_workspace_view_grid__WEBPACK_IMPORTED_MODULE_12__["default"])(AB);
   var Kanban = (0,_ui_work_object_workspace_view_kanban__WEBPACK_IMPORTED_MODULE_13__["default"])(AB);

   var Track = (0,_ui_work_object_workspace_popupTrack__WEBPACK_IMPORTED_MODULE_14__["default"])(AB);

   class UIWorkObjectWorkspace extends UIClass {
      /**
       * @param {object} App
       * @param {string} idBase
       * @param {object} settings - {
       * 								allowDelete: bool,
       * 								detailsView: string,
       * 								editView: string,
       * 								isInsertable: bool,
       * 								isEditable: bool,
       * 								massUpdate: bool,
       * 								configureHeaders: bool,
       *
       * 								isFieldAddable: bool
       * 							}
       */
      constructor(settings = {}) {
         super("abd_work_object_workspace", {
            // component: `${base}_component`,

            buttonAddField: "",
            buttonDeleteSelected: "",
            buttonExport: "",
            buttonImport: "",
            buttonFieldsVisible: "",
            buttonFilter: "",
            buttonFrozen: "",
            buttonLabel: "",
            buttonMassUpdate: "",
            buttonRowNew: "",
            buttonSort: "",

            listIndex: "",
            buttonIndex: "",

            datatable: "",
            error: "",
            error_msg: "",

            viewMenu: "",
            viewMenuButton: "",
            viewMenuNewView: "",

            // Toolbar:
            toolbar: "",

            noSelection: "",
            selectedObject: "",
         });

         // default settings
         // settings.trackView = settings.trackView ?? true;
         // settings.allowDelete = settings.allowDelete ?? true;
         // settings.isInsertable = settings.isInsertable ?? true;
         // settings.isEditable = settings.isEditable ?? true;
         // settings.massUpdate = settings.massUpdate ?? true;
         // settings.configureHeaders = settings.configureHeaders ?? true;
         // settings.isFieldAddable = settings.isFieldAddable ?? true;
         // this.settings = settings;

         this.workspaceViews = (0,_ui_work_object_workspace_workspaceviews__WEBPACK_IMPORTED_MODULE_11__["default"])(AB);

         this.hashViews = {};
         // {hash}  { view.id : webix_component }
         // a hash of the live workspace view components

         // The Grid that displays our object:
         this.hashViews["grid"] = Datatable;
         Datatable.on("column.header.clicked", (node, EditField) => {
            this.PopupHeaderEditMenu.show(node, EditField);
         });
         Datatable.on("object.track", (currentObject, id) => {
            Track.open(currentObject, id);
         });
         Datatable.on("selection", () => {
            this.callbackCheckboxChecked("enable");
         });
         Datatable.on("selection.cleared", () => {
            this.callbackCheckboxChecked("disable");
         });
         Datatable.on("column.order", (fieldOrder) => {
            // fieldOrder : {array} the ABField.ids of the fields in the
            //              order they are displayed.
            var object = this.CurrentObject;
            var newOrder = [];
            fieldOrder.forEach((fid) => {
               newOrder.push(object.fieldByID(fid));
            });
            object._fields = newOrder;
            object.save();
         });

         // The Kanban Object View.
         this.hashViews["kanban"] = Kanban;

         // var Gantt = new ABWorkspaceGantt(base);
         // this.hashViews["gantt"] = Gantt;

         this.PopupCustomIndex = new _ui_work_object_workspace_popupCustomIndex__WEBPACK_IMPORTED_MODULE_1__["default"](AB);
         this.PopupCustomIndex.on("changed", () => {
            this.refreshIndexes();
         });

         // // Various Popups on our page:
         this.PopupHeaderEditMenu = (0,_ui_work_object_workspace_popupHeaderEditMenu__WEBPACK_IMPORTED_MODULE_5__["default"])(AB);
         this.PopupHeaderEditMenu.on("click", (action, field, node) => {
            this.callbackHeaderEditorMenu(action, field, node);
         });

         this.PopupDefineLabelComponent = new _ui_work_object_workspace_popupDefineLabel__WEBPACK_IMPORTED_MODULE_2__["default"](AB);
         this.PopupDefineLabelComponent.on("changed", () => {
            this.callbackDefineLabel();
         });

         // var PopupFilterDataTableComponent = new ABPopupFilterDataTable(
         //    App,
         //    idBase
         // );

         this.PopupFrozenColumnsComponent = new _ui_work_object_workspace_popupFrozenColumns__WEBPACK_IMPORTED_MODULE_4__["default"](AB);
         this.PopupFrozenColumnsComponent.on("changed", (settings) => {
            this.callbackFrozenColumns(settings);
         });

         this.PopupHideFieldComponent = (0,_ui_work_object_workspace_popupHideFields__WEBPACK_IMPORTED_MODULE_6__["default"])(AB);
         this.PopupHideFieldComponent.on("changed", (settings) => {
            this.callbackFieldsVisible(settings);
         });

         // var PopupMassUpdateComponent = new ABPopupMassUpdate(App, idBase);

         this.PopupNewDataFieldComponent = (0,_ui_work_object_workspace_popupNewDataField__WEBPACK_IMPORTED_MODULE_8__["default"])(AB);

         this.PopupSortFieldComponent = (0,_ui_work_object_workspace_popupSortFields__WEBPACK_IMPORTED_MODULE_9__["default"])(AB);
         this.PopupSortFieldComponent.on("changed", (settings) => {
            this.callbackSortFields(settings);
         });

         this.PopupExportObjectComponent = new _ui_work_object_workspace_popupExport__WEBPACK_IMPORTED_MODULE_3__["default"](AB);

         this.PopupImportObjectComponent = new _ui_work_object_workspace_popupImport__WEBPACK_IMPORTED_MODULE_7__["default"](AB);
         // this.PopupImportObjectComponent.on("done", () => {
         //    this.populateObjectWorkspace(this.CurrentObject);
         // });

         this.PopupViewSettingsComponent = (0,_ui_work_object_workspace_popupViewSettings__WEBPACK_IMPORTED_MODULE_10__["default"])(AB);
         this.PopupViewSettingsComponent.on("new.field", (key) => {
            this.PopupNewDataFieldComponent.show(null, key);
         });

         // create ABViewDataCollection
         this.CurrentDatacollection = null;
         // {ABDataCollection}
         // An instance of an ABDataCollection to manage the data we are displaying
         // in our workspace.

         this.CurrentObjectID = null;
         // {string} the ABObject.id of the current Object we are editing.
      } // constructor

      ui() {
         var ids = this.ids;

         var view = "button";
         // at some point we thought this was a good idea.

         var _logic = this;
         // some of these callback fn() are useful to not have this
         // refer to this class, so we allow them to call _logic.XXX()
         // instead.

         var newViewButton = {
            id: this.ids.viewMenuNewView,
            view: "button",
            type: "icon",
            autowidth: true,
            css: "webix_primary",
            label: L("New view"),
            icon: "fa fa-plus",
            align: "center",
            click: () => {
               this.PopupViewSettingsComponent.show();
            },
         };

         var menuWorkspaceViews = {
            id: ids.viewMenu,
            view: "menu",
            // css: "darkgray",
            // borderless: true,
            // minWidth: 150,
            // autowidth: true,
            data: [],
            on: {
               onMenuItemClick: (id) => {
                  var item = $$(ids.viewMenu).getMenuItem(id);
                  if (id === ids.viewMenuButton) {
                     return;
                  }
                  if (item.isView) {
                     var view = this.workspaceViews.list((v) => v.id === id)[0];
                     this.switchWorkspaceView(view);
                  } else if (item.action === "edit") {
                     var view = this.workspaceViews.list(
                        (v) => v.id === item.viewId
                     )[0];
                     this.PopupViewSettingsComponent.show(view);
                  } else if (item.action === "delete") {
                     // Ask the user what to do about the existing file:
                     webix.confirm({
                        title: L("Delete View?"),
                        message: L(
                           "Are you sure you want to remove this view?"
                        ),
                        callback: (result) => {
                           if (result) {
                              var view = this.workspaceViews.list(
                                 (v) => v.id === item.viewId
                              )[0];
                              this.workspaceViews.viewRemove(view);
                              this.switchWorkspaceView(
                                 this.workspaceViews.getCurrentView()
                              );
                           }
                        },
                     });
                  }
               },
            },
            type: {
               subsign: true,
            },
         };

         var toolbar = {
            view: "toolbar",
            id: ids.toolbar,
            hidden: true,
            css: "webix_dark",
            elementsConfig: {
               autowidth: true,
               padding: 0,
               margin: 0,
            },
            margin: 0,
            padding: 0,
            rows: [
               {
                  cols: [
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonAddField,
                        label: L("Add field"),
                        icon: "fa fa-plus",
                        css: "webix_transparent",
                        type: "icon",
                        hidden: false, // !this.settings.isFieldAddable,
                        // minWidth: 115,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarAddFields(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonFieldsVisible,
                        label: L("Hide fields"),
                        icon: "fa fa-eye-slash",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 105,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarFieldsVisible(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonFilter,
                        label: L("Filters"),
                        icon: "fa fa-filter",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 70,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarFilter(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonSort,
                        label: L("Sort"),
                        icon: "fa fa-sort",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 60,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarSort(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonFrozen,
                        label: L("Freeze"),
                        icon: "fa fa-thumb-tack",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 75,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarFrozen(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonLabel,
                        label: L("Label"),
                        icon: "fa fa-crosshairs",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 75,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarDefineLabel(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     // {
                     //  view: view,
                     //  label: L("Permission"),
                     //  icon: "lock",
                     //  type: "icon",
                     //  // autowidth: true,
                     //  click: function() {
                     //      _logic.toolbarPermission(this.$view);
                     //  }
                     //
                     // },
                     {
                        view: view,
                        id: ids.buttonImport,
                        label: L("Import"),
                        icon: "fa fa-upload",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 80,
                        click: function () {
                           _logic.toolbarButtonImport();
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonExport,
                        label: L("Export"),
                        icon: "fa fa-download",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 80,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarButtonExport(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonMassUpdate,
                        label: L("Edit"),
                        icon: "fa fa-pencil-square-o",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 65,
                        // autowidth: true,
                        badge: null,
                        hidden: true,
                        click: function () {
                           _logic.toolbarMassUpdate(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonDeleteSelected,
                        label: L("Delete"),
                        icon: "fa fa-trash",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 85,
                        // autowidth: true,
                        badge: null,
                        hidden: true,
                        click: function () {
                           _logic.toolbarDeleteSelected(this.$view);
                        },
                     },
                     { responsive: "hide" },
                  ],
               },
               {
                  css: { "background-color": "#747d84 !important" },
                  cols: [
                     {
                        view: view,
                        id: ids.buttonIndex,
                        label: L("Add Index"),
                        icon: "fa fa-plus-circle",
                        css: "webix_transparent",
                        type: "icon",
                        click: () => {
                           this.PopupCustomIndex.open(this.CurrentObject);
                        },
                     },
                     {
                        id: ids.listIndex,
                        cols: [],
                     },
                     {
                        responsive: "hide",
                     },
                  ],
               },
            ],
         };

         // Our webix UI definition:
         return {
            view: "multiview",
            id: ids.component,
            rows: [
               {
                  id: ids.error,
                  rows: [
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                     {
                        view: "label",
                        align: "center",
                        height: 200,
                        label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-exclamation-triangle'></div>",
                     },
                     {
                        id: ids.error_msg,
                        view: "label",
                        align: "center",
                        label: L("There was an error"),
                     },
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                  ],
               },
               {
                  id: ids.noSelection,
                  rows: [
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                     {
                        view: "label",
                        align: "center",
                        height: 200,
                        label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-database'></div>",
                     },
                     {
                        view: "label",
                        align: "center",
                        label: L("Select an object to work with."),
                     },
                     {
                        cols: [
                           {},
                           {
                              view: "button",
                              label: L("Add new object"),
                              type: "form",
                              css: "webix_primary",
                              autowidth: true,
                              click: () => {
                                 this.emit("addNew", true);
                              },
                           },
                           {},
                        ],
                     },
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                  ],
               },
               {
                  id: ids.selectedObject,
                  type: "wide",
                  paddingY: 0,
                  // css: "ab-data-toolbar",
                  // borderless: true,
                  rows: [
                     {
                        cols: [newViewButton, menuWorkspaceViews],
                     },
                     toolbar,
                     {
                        padding: 0,
                        rows: [
                           {
                              view: "multiview",
                              cells: [
                                 Datatable.ui(),
                                 Kanban.ui() /*, Gantt.ui() */,
                              ],
                           },
                           // this.settings.isInsertable
                           //    ?
                           {
                              view: "button",
                              type: "form",
                              id: ids.buttonRowNew,
                              css: "webix_primary",
                              value: L("Add new row"),
                              click: () => {
                                 this.rowAdd();
                              },
                           },
                           // : {
                           //      view: "layout",
                           //      rows: [],
                           //      hidden: true,
                           //   },
                        ],
                     },
                  ],
               },
            ],
         };
      } // ui()

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;

         var allInits = [];

         allInits.push(this.workspaceViews.init(AB));

         allInits.push(Datatable.init(AB));
         allInits.push(Kanban.init(AB));

         allInits.push(Track.init(AB));

         // Gantt.init();

         this.CurrentDatacollection = this.AB.datacollectionNew({});
         this.CurrentDatacollection.init();

         allInits.push(this.PopupCustomIndex.init(AB));

         Datatable.datacollectionLoad(this.CurrentDatacollection);
         Kanban.datacollectionLoad(this.CurrentDatacollection);
         // Gantt.datacollectionLoad(this.CurrentDatacollection);

         allInits.push(this.PopupHeaderEditMenu.init(AB));

         allInits.push(this.PopupDefineLabelComponent.init(AB));

         // PopupFilterDataTableComponent.init({
         //    onChange: _logic.callbackFilterDataTable, // be notified when there is a change in the filters
         // });

         allInits.push(this.PopupFrozenColumnsComponent.init(AB));

         allInits.push(this.PopupHideFieldComponent.init(AB));

         // PopupMassUpdateComponent.init({
         //    // onSave:_logic.callbackAddFields			// be notified of something...who knows...
         // });

         // if (settings.isFieldAddable) {
         //    PopupNewDataFieldComponent.init({
         //       onSave: _logic.callbackAddFields, // be notified when a new Field is created & saved
         //    });
         // }
         allInits.push(this.PopupNewDataFieldComponent.init(AB));
         this.PopupNewDataFieldComponent.on("save", (...params) => {
            this.callbackAddFields(...params);
            this.PopupViewSettingsComponent.emit("field.added", params[0]);
         });

         // // ?? what is this for ??
         // // var fieldList = Datatable.getFieldList();

         allInits.push(this.PopupSortFieldComponent.init(AB));

         allInits.push(this.PopupImportObjectComponent.init(AB));

         allInits.push(this.PopupExportObjectComponent.init(AB));

         allInits.push(this.PopupViewSettingsComponent.init(AB));
         this.PopupViewSettingsComponent.on("added", (view) => {
            this.callbackViewAdded(view);
         });
         this.PopupViewSettingsComponent.on("updated", (view) => {
            this.callbackViewUpdated(view);
         });

         $$(this.ids.noSelection).show();

         // this.refreshView();

         return Promise.all(allInits);
      }

      /**
       * @method applicationLoad
       * Initialize the Object Workspace with the given ABApplication.
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      applicationLoad(application) {
         super.applicationLoad(application);
         this.PopupNewDataFieldComponent.applicationLoad(application);

         // this.CurrentDatacollection.application = CurrentApplication;
      }

      /**
       * @function callbackAddFields
       * call back for when an ABFieldXXX is added to the current ABObject.
       * @param {ABField} field
       */
      callbackAddFields(/* field */) {
         this.refreshView();
         this.loadData();
      }

      /**
       * @function callbackDefineLabel
       *
       * call back for when the Define Label popup is finished.
       */
      // callbackDefineLabel: function () {},

      /**
       * @function callbackFilterDataTable
       *
       * call back for when the Define Label popup is finished.
       */
      callbackFilterDataTable() {
         // Since we are making server side requests lets offload the badge count to another function so it can be called independently
         _logic.getBadgeFilters();
         // this will be handled by the server side request now
         _logic.loadData();
      }

      /**
       * @function callbackFrozenColumns
       *
       * call back for when the hidden fields have changed.
       */
      async callbackFrozenColumns(frozen_field_id) {
         var currentView = this.workspaceViews.getCurrentView();
         currentView.frozenColumnID = frozen_field_id;

         try {
            await this.workspaceViews.save();
         } catch (e) {
            // intentionally left blank
         }

         this.getBadgeFrozenColumn();

         this.PopupHideFieldComponent.setFrozenColumnID(
            currentView.frozenColumnID
         );
         this.refreshView();
      }

      /**
       * @function callbackFieldsVisible
       *
       * call back for when the hidden fields have changed.
       */
      async callbackFieldsVisible(hidden_fields_settings) {
         var currentView = this.workspaceViews.getCurrentView();
         currentView.hiddenFields = hidden_fields_settings;

         try {
            await this.workspaceViews.save();
         } catch (e) {
            // intentionally left blank
         }

         this.getBadgeHiddenFields();
         this.PopupFrozenColumnsComponent.setHiddenFields(
            hidden_fields_settings
         );
         this.refreshView();
         this.getBadgeFrozenColumn();
      }

      /**
       * @function callbackCheckboxChecked
       *
       * call back for when the checkbox of datatable is checked
       */

      callbackCheckboxChecked(state) {
         if (state == "enable") {
            this.enableUpdateDelete();
         } else {
            this.disableUpdateDelete();
         }
      }

      // /**
      //  * @function callbackColumnOrderChange
      //  *
      //  */
      // callbackColumnOrderChange(object) {
      //    // TODO:
      //    _logic.getBadgeHiddenFields();
      //    _logic.getBadgeFrozenColumn();
      // }

      refreshView() {
         var ids = this.ids;
         var currentView = this.workspaceViews.getCurrentView();
         switch (currentView.type) {
            case "grid":
               Datatable.refreshHeader(
                  currentView.hiddenFields,
                  currentView.filterConditions,
                  currentView.sortFields,
                  currentView.frozenColumnID
               );
               break;

            case "kanban":
               Kanban.show(currentView);
               break;
         }
      }

      /**
       * @function callbackHeaderEditorMenu
       *
       * call back for when an editor menu action has been selected.
       * @param {string} action [ 'hide', 'filter', 'sort', 'edit', 'delete' ]
       */
      async callbackHeaderEditorMenu(action, field, node) {
         switch (action) {
            case "hide":
               var currentView = this.workspaceViews.getCurrentView();
               var newFields = [];
               var isHidden =
                  currentView.hiddenFields.filter((fID) => {
                     return fID == field.columnName;
                  }).length > 0;
               if (isHidden) {
                  // get remaining fields
                  newFields = currentView.hiddenFields.filter((fID) => {
                     return fID != field.columnName;
                  });
               } else {
                  newFields = currentView.hiddenFields;
                  newFields.push(field.columnName);
               }

               // update our Object with current hidden fields
               currentView.hiddenFields = newFields;
               try {
                  await this.workspaceViews.save();
               } catch (e) {
                  // intentionally left blank
               }
               this.PopupHideFieldComponent.setSettings(
                  currentView.hiddenFields
               );
               this.PopupFrozenColumnsComponent.setHiddenFields(
                  currentView.hiddenFields
               );
               this.refreshView();
               this.getBadgeHiddenFields();
               this.getBadgeFrozenColumn();
               break;
            case "filter":
               _logic.toolbarFilter($$(ids.buttonFilter).$view, field.id);
               break;
            case "sort":
               this.toolbarSort($$(this.ids.buttonSort).$view, field.id);
               break;
            case "freeze":
               var currentView = this.workspaceViews.getCurrentView();
               currentView.frozenColumnID = field.columnName;
               try {
                  await this.workspaceViews.save();
               } catch (e) {
                  // intentionally left blank
               }
               this.PopupFrozenColumnsComponent.setValue(
                  currentView.frozenColumnID || ""
               );
               this.PopupHideFieldComponent.setFrozenColumnID(
                  currentView.frozenColumnID || ""
               );
               this.refreshView();
               this.getBadgeFrozenColumn();
               break;
            case "edit":
               // pass control on to our Popup:
               this.PopupNewDataFieldComponent.show(field);
               break;

            case "delete":
               // verify they mean to do this:
               webix.confirm({
                  title: L("Delete data field"),
                  message: L("Do you want to delete <b>{0}</b>?", [
                     field.label,
                  ]),
                  callback: (isOK) => {
                     if (isOK) {
                        this.busy();
                        field
                           .destroy()
                           .then(() => {
                              this.ready();
                              this.refreshView();
                              this.loadData();

                              // recursive fn to remove any form/detail fields related to this field
                              function checkPages(list, cb) {
                                 if (list.length == 0) {
                                    cb();
                                 } else {
                                    var page = list.shift();

                                    // begin calling removeField for each main page in the app
                                    // this will kick off a chain of events that will have removeField called on
                                    // all pages, subpages, widgets and views.
                                    page.removeField(field, (err) => {
                                       if (err) {
                                          cb(err);
                                       } else {
                                          checkPages(list, cb);
                                       }
                                    });
                                 }
                              }

                              checkPages(
                                 this.CurrentApplication.pages(),
                                 (err) => {}
                              );
                           })
                           .catch((err) => {
                              this.ready();
                              if (err && err.message) {
                                 webix.alert({
                                    type: "alert-error",
                                    title: L("Could not delete"),
                                    text: err.message,
                                 });
                              }

                              this.AB.notify.developer(err, {
                                 context: "Error trying to delete field",
                                 fields: field.toObj(),
                              });
                           });
                     }
                  },
               });
               break;
         }
      }

      busy() {
         $$(this.ids.component)?.showProgress?.({ type: "icon" });
      }

      /**
       * @function callbackMassUpdate
       *
       * call back for when the mass update is fired
       */
      callbackMassUpdate() {
         // _logic.getBadgeSortFields();
         _logic.loadData();
      }

      /**
       * @function callbackSortFields
       *
       * call back for when the sort fields popup changes
       **/
      async callbackSortFields(sort_settings) {
         var currentView = this.workspaceViews.getCurrentView();
         currentView.sortFields = sort_settings;
         await this.workspaceViews.save();
         this.getBadgeSortFields();
         this.refreshView();
         this.loadData();
      }

      /**
       * @function callbackViewAdded
       *
       * call back for when a new workspace view is added
       */
      async callbackViewAdded(view) {
         var newView = await this.workspaceViews.viewNew(view);
         await this.switchWorkspaceView(newView);
         this.refreshView();
         this.loadData();
      }

      /**
       * @function callbackViewUpdated
       *
       * call back for when a workspace view is updated
       */
      async callbackViewUpdated(view) {
         await this.workspaceViews.viewUpdate(view);
         this.refreshWorkspaceViewMenu();
         this.refreshView();
      }

      /**
       * @function enableUpdateDelete
       *
       * enable the update or delete buttons in the toolbar if there are any items selected
       * we will make this externally accessible so we can call it from within the datatable component
       */
      enableUpdateDelete() {
         var ids = this.ids;
         $$(ids.buttonMassUpdate).show();
         $$(ids.buttonDeleteSelected).show();
      }

      /**
       * @function enableUpdateDelete
       *
       * disable the update or delete buttons in the toolbar if there no items selected
       * we will make this externally accessible so we can call it from within the datatable component
       */
      disableUpdateDelete() {
         var ids = this.ids;
         $$(ids.buttonMassUpdate).hide();
         $$(ids.buttonDeleteSelected).hide();
      }

      /**
       * @function getBadgeFilters
       *
       * we need to set the badge count for filters on load and after filters are added or removed
       */

      getBadgeFilters() {
         var ids = this.ids;
         var filterConditions = this.workspaceViews.filterConditions;
         var numberOfFilter = 0;

         if (filterConditions?.rules?.length)
            numberOfFilter = filterConditions.rules.length;

         if (typeof filterConditions != "undefined") {
            $$(ids.buttonFilter).define("badge", numberOfFilter || null);
            $$(ids.buttonFilter).refresh();
         }
      }

      /**
       * @function getBadgeFrozenColumn
       *
       * we need to set the badge count for frozen columns on load and after changed are added or removed
       */

      getBadgeFrozenColumn() {
         var ids = this.ids;
         var frozenID = this.workspaceViews.frozenColumnID;
         var badgeNumber = null;

         // get the current position of the frozenID in our Datatable
         if (frozenID !== "" && typeof frozenID != "undefined") {
            badgeNumber = Datatable.getColumnIndex(frozenID);
         }

         $$(ids.buttonFrozen).define("badge", badgeNumber);
         $$(ids.buttonFrozen).refresh();
      }

      /**
       * @function getBadgeHiddenFields
       *
       * we need to set the badge count for hidden fields on load and after fields are hidden or shown
       */

      getBadgeHiddenFields() {
         var hiddenFields = this.workspaceViews.hiddenFields;

         if (typeof hiddenFields != "undefined") {
            $$(this.ids.buttonFieldsVisible).define(
               "badge",
               hiddenFields.length || null
            );
            $$(this.ids.buttonFieldsVisible).refresh();
         }
      }

      /**
       * @function getBadgeSortFields
       *
       * we need to set the badge count for sorts on load and after sorts are added or removed
       */

      getBadgeSortFields() {
         var ids = this.ids;
         var sortFields = (this.workspaceViews.sortFields || []).filter(
            (f) => f.key != ""
         );

         if (typeof sortFields != "undefined") {
            $$(ids.buttonSort).define("badge", sortFields.length || null);
            $$(ids.buttonSort).refresh();
         }
      }

      ready() {
         $$(this.ids.component)?.hideProgress?.();
      }

      /**
       * @function rowAdd()
       *
       * When our [add row] button is pressed, alert our DataTable
       * component to add a row.
       */
      async rowAdd() {
         // safety check
         // if (!this.settings.isEditable) return;

         // create the new data entry

         var object = this.CurrentObject;
         if (!object) return;

         var emptyObj = object.defaultValues();
         try {
            var newObj = await object.model().create(emptyObj);
            if (newObj == null) return;

            // Now stick this into the DataCollection so the displayed widget
            // will update itself:
            var dc = this.CurrentDatacollection.$dc;
            if (dc && !dc.exists(newObj.id)) {
               dc.add(newObj, 0);
            }
         } catch (e) {
            this.AB.notify.developer(e, {
               context:
                  "ui_work_object_workspace:rowAdd(): error creating empty object",
               emptyObj,
            });

            var L = this.AB.Label();
            webix.alert({
               title: L("Unable to create new row"),
               text: L("An administrator has already been alerted."),
            });
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(ids.component).show();
      }

      /**
       * @function toolbarAddFields
       *
       * Show the popup to allow the user to create new fields for
       * this object.
       */
      toolbarAddFields($view) {
         this.PopupNewDataFieldComponent.show();
      }

      toolbarButtonImport() {
         this.PopupImportObjectComponent.show();
      }

      toolbarButtonExport($view) {
         this.PopupExportObjectComponent.show($view);
      }

      toolbarDeleteSelected($view) {
         // Pass this onto our Datatable to reuse the ABViewGrid's
         // delete selection routines.
         Datatable.deleteSelected($view);
      }

      /**
       * @function toolbarDefineLabel
       *
       * Show the popup to allow the user to define the default label for
       * this object.
       */
      toolbarDefineLabel($view) {
         this.PopupDefineLabelComponent.show($view);
      }

      /**
       * @function toolbarFieldsVisible
       *
       * Show the popup to allow the user to hide columns for this view.
       */
      toolbarFieldsVisible($view) {
         this.PopupHideFieldComponent.show($view);
      }

      /**
       * @function toolbarFilter
       *
       * show the popup to add a filter to the datatable
       */
      toolbarFilter($view, fieldId) {
         PopupFilterDataTableComponent.show($view, fieldId);
      }

      /**
       * @function toolbarFrozen
       *
       * show the popup to freeze columns for the datatable
       */
      toolbarFrozen($view) {
         this.PopupFrozenColumnsComponent.show($view);
      }

      toolbarPermission($view) {
         console.error("TODO: toolbarPermission()");
      }

      toolbarMassUpdate($view) {
         Datatable.massUpdate($view);
      }

      /**
       * @function toolbarSort
       *
       * show the popup to sort the datatable
       */
      toolbarSort($view, fieldId) {
         this.PopupSortFieldComponent.show($view, fieldId);
      }

      /**
       * @method populateObjectWorkspace()
       * Initialize the Object Workspace with the provided ABObject.
       * @param {uuid} objectID
       *        current ABObject.id instance we are working with.
       */
      async populateObjectWorkspace(objectID) {
         $$(this.ids.toolbar).show();
         $$(this.ids.selectedObject).show();

         this.CurrentObjectID = objectID;
         var object = this.AB.objectByID(objectID);

         // get current view from object
         this.workspaceViews.objectLoad(object);
         var currentView = this.workspaceViews.getCurrentView();
         // {WorkspaceView}
         // The current workspace view that is being displayed in our work area
         // currentView.component {ABViewGrid | ABViewKanBan | ABViewGantt}

         // // get defined views
         // // update the view picker in the toolbar

         // // get toolbar config
         // // update toolbar with approved tools

         // /// still working with DataTable
         // // initial data
         // _logic.loadData();

         // // the replicated tables are read only
         // if (this.CurrentObject.isReadOnly) {
         //    DataTable.readonly();

         //    if ($$(ids.buttonRowNew)) $$(ids.buttonRowNew).disable();
         // } else {
         //    DataTable.editable();

         //    if ($$(ids.buttonRowNew)) $$(ids.buttonRowNew).enable();
         // }

         this.CurrentDatacollection.datasource = object;

         Datatable.objectLoad(object);
         Kanban.objectLoad(object);
         // Gantt.objectLoad(object);

         this.PopupNewDataFieldComponent.objectLoad(object);
         this.PopupDefineLabelComponent.objectLoad(object);
         // PopupFilterDataTableComponent.objectLoad(object);
         this.PopupFrozenColumnsComponent.objectLoad(object);

         this.PopupHideFieldComponent.objectLoad(object);

         this.PopupSortFieldComponent.objectLoad(object);

         this.PopupImportObjectComponent.objectLoad(object);

         this.PopupExportObjectComponent.objectLoad(object);

         // NOTE: make sure Datatable exists before this:
         Datatable.on("show", () => {
            this.PopupExportObjectComponent.setGridComponent(Datatable.$grid);
         });

         this.PopupExportObjectComponent.setFilename(object.label);
         this.PopupViewSettingsComponent.objectLoad(object);

         // _logic.refreshToolBarView();

         this.refreshIndexes();

         // // $$(ids.component).setValue(ids.selectedObject);
         // $$(ids.selectedObject).show(true, false);

         // // disable add fields into the object
         // if (
         //    object.isExternal ||
         //    object.isImported ||
         //    !settings.isFieldAddable
         // ) {
         //    $$(ids.buttonAddField).disable();
         //    $$(ids.buttonImport).disable();
         // } else {
         //    $$(ids.buttonAddField).enable();
         //    $$(ids.buttonImport).enable();
         // }

         await this.switchWorkspaceView(currentView);
         this.refreshWorkspaceViewMenu();

         this.refreshView();

         // // display the proper ViewComponent
         // var currDisplay = hashViews[currentView.type];
         // currDisplay.show();
         // // viewPicker needs to show this is the current view.
      }

      /**
       * @function clearObjectWorkspace()
       *
       * Clear the object workspace.
       */
      clearObjectWorkspace() {
         // NOTE: to clear a visual glitch when multiple views are updating
         // at one time ... stop the animation on this one:
         $$(this.ids.noSelection).show(false, false);
      }

      get CurrentObject() {
         return this.AB.objectByID(this.CurrentObjectID);
      }

      /**
       * @function loadAll
       * Load all records
       *
       */
      loadAll() {
         Datatable.loadAll();
      }

      loadData() {
         // update ABViewDataCollection settings
         var wheres = {
            glue: "and",
            rules: [],
         };
         if (this.workspaceViews?.filterConditions?.rules?.length > 0) {
            wheres = this.workspaceViews.filterConditions;
         }

         var sorts = [];
         if (this.workspaceViews?.sortFields?.length > 0) {
            sorts = this.workspaceViews?.sortFields;
         }

         this.CurrentDatacollection.datasource = this.CurrentObject;

         this.CurrentDatacollection.fromValues({
            settings: {
               datasourceID: this.CurrentObjectID,
               objectWorkspace: {
                  filterConditions: wheres,
                  sortFields: sorts,
               },
            },
         });

         this.CurrentDatacollection.refreshFilterConditions(wheres);
         this.CurrentDatacollection.clearAll();

         // WORKAROUND: load all data becuase kanban does not support pagination now
         let view = this.workspaceViews.getCurrentView();
         if (view.type === "gantt" || view.type === "kanban") {
            this.CurrentDatacollection.settings.loadAll = true;
            this.CurrentDatacollection.loadData(0);
         } else {
            this.CurrentDatacollection.loadData(0, 30).catch((err) => {
               var message = err.toString();
               if (typeof err == "string") {
                  try {
                     var jErr = JSON.parse(err);
                     if (jErr.data && jErr.data.sqlMessage) {
                        message = jErr.data.sqlMessage;
                     }
                  } catch (e) {}
               }
               var ids = this.ids;
               $$(ids.error).show();
               $$(ids.error_msg).define("label", message);
               $$(ids.error_msg).refresh();

               // webix.alert({
               //     title: "Error loading object Values ",
               //     ok: "fix it",
               //     text: message,
               //     type: "alert-error"
               // });
               this.AB.notify.developer(err, {
                  context: "ui_work_object_workspace.loadData()",
                  message,
                  datacollection: this.CurrentDatacollection.toObj(),
               });
            });
         }
      }

      async switchWorkspaceView(view) {
         if (this.hashViews[view.type]) {
            this.workspaceViews.setCurrentView(view.id);
            await this.hashViews[view.type].show(view);
            this.refreshWorkspaceViewMenu();

            // now update the rest of the toolbar for this view:
            this.refreshToolBarView();

            // make sure our Popups are updated:
            this.PopupFrozenColumnsComponent.setValue(
               view.frozenColumnID || ""
            );
            this.PopupFrozenColumnsComponent.setHiddenFields(view.hiddenFields);

            this.PopupHideFieldComponent.setSettings(view.hiddenFields);
            this.PopupHideFieldComponent.setFrozenColumnID(
               view.frozenColumnID || ""
            );

            this.PopupSortFieldComponent.setSettings(view.sortFields);

            this.PopupExportObjectComponent.setHiddenFields(view.hiddenFields);

            // save current view
            this.workspaceViews.save();

            this.loadData();
         }
      }

      /**
       * @function refreshToolBarView
       * update the display of the toolbar buttons based upon
       * the current view being displayed.
       */
      refreshToolBarView() {
         var ids = this.ids;

         var currentView = this.workspaceViews.getCurrentView();
         switch (currentView.type) {
            case "grid":
               $$(ids.buttonFieldsVisible).show();
               $$(ids.buttonFrozen).show();
               $$(ids.buttonSort).show();
               break;
            case "kanban":
               $$(ids.buttonFieldsVisible).hide();
               $$(ids.buttonFrozen).hide();
               $$(ids.buttonSort).hide();
               break;
         }

         // get badge counts for server side components
         this.getBadgeHiddenFields();
         this.getBadgeFrozenColumn();
         this.getBadgeSortFields();
         this.getBadgeFilters();

         // $$(ids.component).setValue(ids.selectedObject);
         $$(ids.selectedObject).show(true, false);

         // disable add fields into the object
         if (this.CurrentObject.isExternal || this.CurrentObject.isImported) {
            $$(ids.buttonAddField).disable();
         } else {
            $$(ids.buttonAddField).enable();
         }
      }

      /**
       * @method refreshWorkspaceViewMenu()
       * On the top of our workspace, we show a list if different views
       * of our current object: Grid, Kanban, Gantt, etc...
       * This method will redraw those selectors based upon our current
       * settings.
       */
      refreshWorkspaceViewMenu() {
         var currentViewId = this.workspaceViews.getCurrentView().id;
         var submenu = this.workspaceViews.list().map((view) => ({
            id: view.id,
            hash: view.type,
            value: view.name,
            isView: true,
            $css: view.id === currentViewId ? "selected" : "",
            icon: `fa fa-${view.icon}`, // view.constructor.icon(),
            submenu: view.isDefaultView
               ? null
               : [
                    {
                       value: L("Edit"),
                       icon: "fa fa-cog",
                       viewId: view.id,
                       action: "edit",
                    },
                    {
                       value: L("Delete"),
                       icon: "fa fa-trash",
                       viewId: view.id,
                       action: "delete",
                    },
                 ],
         }));

         // var currView = this.CurrentObject.workspaceViews.getCurrentView();
         // var icon = currView.constructor.icon();
         var $viewMenu = $$(this.ids.viewMenu);
         $viewMenu.clearAll();
         $viewMenu.define("data", submenu);
         $viewMenu.refresh();
      }

      refreshIndexes() {
         let indexes = this.CurrentObject?.indexes() || [];

         // clear indexes list
         webix.ui([], $$(this.ids.listIndex));

         indexes.forEach((index) => {
            this.addNewIndex(index);
         });
      }

      addNewIndex(index) {
         $$(this.ids.listIndex).addView({
            view: "button",
            label: index.label || index.name,
            icon: "fa fa-key",
            css: "webix_transparent",
            type: "icon",
            width: 160,
            click: () => {
               this.PopupCustomIndex.open(this.CurrentObject, index);
            },
         });
      }
   }

   return new UIWorkObjectWorkspace(init_settings);
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupCustomIndex.js":
/*!*****************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupCustomIndex.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_object_workspace_popupIndex
 *
 * Manage the Object Workspace custom index popup.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   const ABIndex = AB.Class.ABIndex;

   class UI_Work_Object_Workspace_PopupIndex extends UIClass {
      /**
       * @param {object} App
       * @param {string} idBase
       */
      constructor() {
         super("ui_work_object_workspace_popupIndex", {
            // component: idBase,
            popup: "",
            form: "",
            name: "",
            fields: "",
            unique: "",
            removeButton: "",
            saveButton: "",
         });
      }

      // Our webix UI definition:
      ui() {
         let ids = this.ids;

         return {
            view: "window",
            id: ids.popup,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Custom Index"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     // width: 50,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.close();
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            position: "center",
            resize: true,
            modal: true,
            editable: false,
            width: 500,
            height: 500,
            body: {
               view: "form",
               id: ids.form,
               elements: [
                  {
                     id: ids.name,
                     view: "text",
                     label: L("Name"),
                     name: "name",
                  },
                  {
                     id: ids.fields,
                     view: "multicombo",
                     label: L("Fields"),
                     name: "fieldIDs",
                     options: [],
                  },
                  {
                     id: ids.unique,
                     view: "checkbox",
                     label: L("Unique"),
                     name: "unique",
                  },
                  {
                     cols: [
                        {
                           id: ids.removeButton,
                           view: "button",
                           type: "icon",
                           icon: "fa fa-trash-o",
                           css: "webix_danger",
                           width: 40,
                           click: () => this.removeIndex(),
                        },
                        { fillspace: true },
                        {
                           view: "button",
                           value: L("Cancel"),
                           width: 100,
                           click: () => this.close(),
                        },
                        {
                           id: ids.saveButton,
                           view: "button",
                           type: "icon",
                           icon: "fa fa-floppy-o",
                           css: "webix_primary",
                           label: L("Save"),
                           width: 100,
                           click: () => this.save(),
                        },
                     ],
                  },
               ],
            },
         };
      }

      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());

         let $form = $$(this.ids.form);
         if ($form) {
            webix.extend($form, webix.ProgressBar);
         }
      }

      open(object, index) {
         this.CurrentObject = object;
         this.CurrentIndex = index;

         let ids = this.ids;
         let $popup = $$(ids.popup);
         if (!$popup) return;

         $popup.show();

         let $fields = $$(ids.fields);
         if ($fields && this.CurrentObject) {
            var allowedFields = [
               "number",
               "date",
               "datetime",
               "boolean",
               "list",
               "email",
               "user",
               "AutoIndex",
               "combined",
            ];

            let fields = this.CurrentObject.fields((f) => {
               return (
                  allowedFields.indexOf(f.key) > -1 ||
                  ((f.key == "string" || f.key == "LongText") &&
                     f.settings &&
                     !f.settings.supportMultilingual) ||
                  (f.key == "connectObject" &&
                     // 1:M
                     ((f.settings.linkType == "one" &&
                        f.settings.linkViaType == "many") ||
                        // 1:1 isSource = true
                        (f.settings.linkType == "one" &&
                           f.settings.linkViaType == "one" &&
                           f.settings.isSource)))
               );
            }).map((f) => {
               return {
                  id: f.id,
                  value: f.label,
               };
            });

            $fields.define("options", fields);
            $fields.refresh();
         }

         let $form = $$(this.ids.form);
         if ($form) {
            $form.clear();

            if (index) $form.setValues(index.toObj());
         }

         let $name = $$(ids.name);
         let $unique = $$(ids.unique);
         let $saveButton = $$(ids.saveButton);
         let $removeButton = $$(ids.removeButton);

         // Edit
         if (this.CurrentIndex) {
            $name.disable();
            $fields.disable();
            $unique.disable();
            $saveButton.hide();
            $removeButton.show();
         }
         // Add new
         else {
            $name.enable();
            $fields.enable();
            $unique.enable();
            $saveButton.show();
            $removeButton.hide();
         }
      }

      async save() {
         let $form = $$(this.ids.form);
         if (!$form) return;

         this.busy();

         let vals = $form.getValues();
         vals.fieldIDs = vals.fieldIDs.split(",");

         // Add new
         if (this.CurrentIndex == null)
            this.CurrentIndex = new ABIndex(vals, this.CurrentObject);

         // update values
         this.CurrentIndex.fromValues(vals);
         try {
            await this.CurrentIndex.save();

            this.ready();
            this.emit("changed");
            this.close();
         } catch (err) {
            let message = L("The system could not create your index.");
            switch (err.code) {
               case "ER_DUP_ENTRY":
                  message = `${message} : ${L(
                     "There are duplicated values in this column."
                  )}`;
                  break;
            }

            this.AB.notify.developer(err, {
               context: "ui_work_object_workspace_popupIndex:save()",
               message,
               vals,
            });

            webix.alert({
               type: "alert-error",
               title: L("Failed"),
               text: message,
            });
            this.ready();
         }
      }

      close() {
         let $popup = $$(this.ids.popup);
         if (!$popup) return;
         $popup.hide();
      }

      busy() {
         $$(this.ids.form)?.showProgress?.({ type: "icon" });
         $$(this.ids.saveButton)?.disable();
         $$(this.ids.removeButton)?.disable();
      }

      ready() {
         $$(this.ids.form)?.hideProgress?.();
         $$(this.ids.saveButton)?.enable();
         $$(this.ids.removeButton)?.enable();
      }

      removeIndex() {
         if (!this.CurrentIndex) return;

         webix.confirm({
            title: L("Delete this Index"),
            message: L("Do you want to remove this index ?"),
            callback: async (isOK) => {
               if (isOK) {
                  this.busy();

                  try {
                     await this.CurrentIndex.destroy();
                     this.ready();
                     this.emit("changed");
                     this.close();
                  } catch (err) {
                     this.AB.notify.developer(err, {
                        context:
                           "ui_work_object_workspace_popupIndex:removeIndex()",
                        ABIndex: this.CurrentIndex.toObj(),
                     });
                     this.ready();
                  }
               }
            },
         });
      }
   }

   return new UI_Work_Object_Workspace_PopupIndex();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupDefineLabel.js":
/*!*****************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupDefineLabel.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_object_workspace_popupDefineLabel
 *
 * Manage the Add New Data Field popup.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupDefineLabel extends UIClass {
      constructor() {
         super("ui_work_object_workspace_popupDefineLabel", {
            // component: idBase,
            format: "",
            list: "",
            buttonSave: "",
         });
      }

      ui() {
         let ids = this.ids;

         // webix UI definition:
         return {
            view: "popup",
            id: ids.component,
            modal: true,
            autoheight: true,
            // maxHeight: 420,
            width: 500,
            body: {
               rows: [
                  {
                     view: "label",
                     label: L("<b>Label format</b>"),
                  },
                  {
                     view: "textarea",
                     id: ids.format,
                     height: 100,
                  },
                  {
                     view: "label",
                     label: L("Select field item to generate format."),
                  },
                  {
                     view: "label",
                     label: L("<b>Fields</b>"),
                  },
                  {
                     view: "list",
                     name: "columnList",
                     id: ids.list,
                     width: 500,
                     height: 180,
                     maxHeight: 180,
                     select: false,
                     template: "#label#",
                     on: {
                        onItemClick: (id, e, node) => {
                           this.onItemClick(id, e, node);
                        },
                     },
                  },
                  {
                     height: 10,
                  },
                  {
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           name: "cancel",
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.buttonCancel();
                           },
                        },
                        {
                           view: "button",
                           css: "webix_primary",
                           name: "save",
                           id: ids.buttonSave,
                           label: L("Save"),
                           type: "form",
                           autowidth: true,
                           click: () => {
                              this.buttonSave();
                           },
                        },
                     ],
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

      // for setting up UI
      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());

         webix.extend($$(this.ids.list), webix.ProgressBar);
      }

      changed() {
         this.emit("changed", this._settings);
      }

      buttonCancel() {
         $$(this.ids.component).hide();
      }

      async buttonSave() {
         var ids = this.ids;

         // disable our save button
         var ButtonSave = $$(ids.buttonSave);
         ButtonSave.disable();

         // get our current labelFormt
         var labelFormat = $$(ids.format).getValue();

         // start our spinner
         var List = $$(ids.list);
         List.showProgress({ type: "icon" });

         // convert from our User Friendly {Label} format to our
         // object friendly {Name} format
         List.data.each(function (d) {
            labelFormat = labelFormat.replace(
               new RegExp("{" + d.label + "}", "g"),
               "{" + d.id + "}"
            );
         });

         // save the value
         this.CurrentObject.labelFormat = labelFormat;
         try {
            await this.CurrentObject.save();

            // all good, so

            this.hide(); // hide the popup

            // alert our parent component we are done with our changes:
            this.changed();
         } catch (err) {
            // display some error to the user:
            this.AB.notify.developer(err, {
               context:
                  "ui_work_object_workspace_popupDefineLabel:buttonSave(): Error trying to save our Object",
            });
         }
         List.hideProgress(); // hide the spinner
         ButtonSave.enable(); // enable the save button
      }

      hide() {
         $$(this.ids.component).hide();
      }

      objectLoad(object) {
         super.objectLoad(object);

         // clear our list
         var List = $$(this.ids.list);
         List.clearAll();

         // refresh list with new set of fields
         var listFields = object
            .fields((f) => {
               return f.fieldUseAsLabel();
            })
            .map((f) => {
               return {
                  id: f.id,
                  label: f.label,
               };
            });

         List.parse(listFields);
         List.refresh();
      }

      onItemClick(id /*, e, node */) {
         var ids = this.ids;
         var selectedItem = $$(ids.list).getItem(id);
         var labelFormat = $$(ids.format).getValue();
         labelFormat += `{${selectedItem.label}}`;
         $$(ids.format).setValue(labelFormat);
      }

      onShow() {
         var ids = this.ids;

         var labelFormat = this.CurrentObject.labelFormat;
         var Format = $$(ids.format);
         var List = $$(ids.list);

         Format.setValue("");
         Format.enable();
         List.enable();
         $$(ids.buttonSave).enable();

         // our labelFormat should be in a computer friendly {name} format
         // here we want to convert it to a user friendly {label} format
         // to use in our popup:
         if (labelFormat) {
            if (List.data?.count() > 0) {
               List.data.each(function (d) {
                  labelFormat = labelFormat.replace(
                     new RegExp(`{${d.id}}`, "g"),
                     `{${d.label}}`
                  );
               });
            }
         } else {
            // no label format:
            // Default to first field
            if (List.data?.count() > 0) {
               var field = List.getItem(List.getFirstId());
               labelFormat = `{${field.label}}`;
            }
         }

         Format.setValue(labelFormat || "");
      }

      /**
       * @function show()
       *
       * Show this component.
       * @param {obj} $view  the webix.$view to hover the popup around.
       */
      show($view) {
         $$(this.ids.component).show($view);
      }
   }

   return new UI_Work_Object_Workspace_PopupDefineLabel();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupExport.js":
/*!************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupExport.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ab_work_object_workspace_popupExport
 *
 * Manage the Export object to files popup.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();

   class UI_Work_Object_PopupExport extends UIClass {
      constructor() {
         super("ui_work_object_workspace_popupExport", {
            popupExport: "",
            list: "",
         });

         this.DatacollectionID = null;
         // {string}
         // the ABDataCollection.id of the DC we are working with.

         this.grid = null;
         // {webix.grid}
         // the webix grid UI containing our data.

         this.filename = null;
         // {string}
         // the name of the exported file

         this.hiddenFields = [];
         // {array} [ABField.columnName, ... ]
         // an array of the columnNames of the hidden fields.
      }

      ui() {
         var self = this;

         // webix UI definition:
         return {
            view: "popup",
            id: this.ids.popupExport,
            width: 160,
            height: 180,
            select: false,
            hidden: true,
            body: {
               id: this.ids.list,
               view: "list",
               data: [
                  { name: "CSV", icon: "file-excel-o" },
                  { name: "Excel", icon: "file-excel-o" },
                  { name: "PDF", icon: "file-pdf-o" },
                  { name: "PNG", icon: "file-image-o" },
               ],
               template:
                  "<div><i class='fa fa-#icon# webix_icon_btn' aria-hidden='true'></i> #name#</div>",
               on: {
                  onItemClick: function (id /*, e, node */) {
                     var component = this.getItem(id);
                     self.export(component.name);
                  },
               },
            },
         };
      }

      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
      }

      /**
       * @method Datacollection()
       * A helper to return the current ABObject we are working with.
       * @return {ABObject}
       */
      get Datacollection() {
         return this.AB.datacollectionByID(this.DatacollectionID);
      }

      // objectLoad(object) {
      //    this.CurrentObjectID = object.id;
      // }

      dataCollectionLoad(dc) {
         this.DatacollectionID = dc.id;
      }

      /**
       * @method setHiddenFields
       * @param {array} fields - an array of string
       */
      setHiddenFields(fields) {
         this.hiddenFields = fields || [];
      }

      setFilename(filename) {
         this.filename = filename;
      }

      setGridComponent($grid) {
         this.grid = $grid;
      }

      /**
       * @function show()
       * Show this component.
       * @param {webix.view} $view
       *        the webix.$view to hover the popup around.
       */
      show($view) {
         $$(this.ids.popupExport).show($view);
      }

      /**
       * @method export()
       * triggers the process of exporting the data.
       * @param {string} name
       *        The type of export we are performing.
       *        ["CSV", "Excel", "PDV", "PNG"]
       */
      async export(name) {
         let fnExport;

         let columns = {};

         let dc = this.Datacollection;
         if (
            dc &&
            (!dc.settings.loadAll ||
               dc.dataStatus == dc.dataStatusFlag.notInitial)
         ) {
            // Load all data
            await dc.reloadData(0, null);
            dc.settings.loadAll = true;
         }

         // client filter data
         // template of report
         var _currentObject = this.CurrentObject;
         if (_currentObject) {
            _currentObject.fields().forEach((f) => {
               // hidden fields
               if (this.hiddenFields.indexOf(f.columnName) > -1) return;

               columns[f.columnName] = {
                  template: (rowData) => {
                     return f.format(rowData);
                  },
               };
            });
         }

         var _grid = this.grid;
         if (!_grid) {
            return;
         }

         var _filename = this.filename;
         var _label = _currentObject ? _currentObject.label : null;

         switch (name) {
            case "CSV":
               webix.csv.delimiter.cols = ",";

               fnExport = webix.toCSV(_grid, {
                  _filename: this.filename || _label,
                  columns: columns,
               });
               break;
            case "Excel":
               fnExport = webix.toExcel(_grid, {
                  filename: _filename || _label,
                  name: _filename || _label,
                  columns: columns,
                  filterHTML: true,
               });
               break;
            case "PDF":
               fnExport = webix.toPDF(_grid, {
                  filename: _filename || _label,
                  filterHTML: true,
               });
               break;
            case "PNG":
               fnExport = webix.toPNG(_grid, {
                  filename: _filename || _label,
               });
               break;
         }

         try {
            await fnExport;
            $$(this.ids.popupExport).hide();
         } catch (err) {
            this.AB.notify.developer(err, {
               message: `${this.ids.component}:export(): could not export: ${name}`,
            });
         }
      }
   }

   return new UI_Work_Object_PopupExport();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupFrozenColumns.js":
/*!*******************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupFrozenColumns.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_object_workspace_popupFrozenColumns
 *
 * Manage the Frozen Columns popup.
 *
 */


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   // const uiConfig = AB.Config.uiSettings();
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupFrozenColumns extends UIClass {
      constructor() {
         super("ui_work_object_workspace_popupFrozenColumns", {
            list: "",
         });

         this._setting = "";
         // {string}
         // the ABField.columnName of the field that we want to freeze at.
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
                        onItemClick: (/* id, e, node */) => {
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
      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
      }

      changed() {
         this.emit("changed", this._setting);
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
      clickListItem(id /*, e, node */) {
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
      // objectLoad(object) {
      //    this.CurrentObjectID = object.id;
      // }

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


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupHeaderEditMenu.js":
/*!********************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupHeaderEditMenu.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_common_popupEditMenu */ "./src/rootPages/Designer/ui_common_popupEditMenu.js");
/*
 * ab_work_object_workspace_popupHeaderEditMenu
 *
 * Manage the Add New Data Field popup.
 *
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var ListClass = (0,_ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UIWorkObjectWorkspacePopupHeaderEditMenu extends ListClass {
      constructor() {
         super("ui_work_object_workspace_popupHeaderEditMenu");

         // overwrite the default common menu with our column Header
         // options.
         this._menuOptions = [
            {
               label: L("Hide field"),
               // {string} label displayed

               icon: "fa fa-eye-slash",
               // {string} the fontawesome icon reference

               command: "hide",
               // {string} the returned command key

               imported: true,
               // {bool} include this option on an Imported Field?
            },
            {
               label: L("Filter field"),
               icon: "fa fa-filter",
               command: "filter",
               imported: true,
            },
            {
               label: L("Sort field"),
               icon: "fa fa-sort",
               command: "sort",
               imported: true,
            },
            {
               label: L("Freeze field"),
               icon: "fa fa-thumb-tack",
               command: "freeze",
               imported: true,
            },
            {
               label: L("Edit field"),
               icon: "fa fa-pencil-square-o",
               command: "edit",
               imported: false,
            },
            {
               label: L("Delete field"),
               icon: "fa fa-trash",
               command: "delete",
               imported: false,
            },
         ];

         this.$node = null;
         this.field = null;
      }

      show(node, field) {
         this.$node = node;
         this.field = field;
         super.show(node);
      }

      trigger(command) {
         this.emit("click", command, this.field, this.$node);
      }
   }
   return new UIWorkObjectWorkspacePopupHeaderEditMenu();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupHideFields.js":
/*!****************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupHideFields.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_object_workspace_popupHideFields
 *
 * Manage the Hide Fields popup.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupHideFields extends UIClass {
      constructor() {
         super("ui_work_object_workspace_popupHideFields", {
            list: "",
            buttonHide: "",
            buttonShow: "",
         });

         this._settings = [];
         // {array}
         // an array of the ABField.columnNames of the fields
         // that we want to hide.

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
      // objectLoad(object) {
      //    this.CurrentObjectID = object.id;
      // }

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


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupImport.js":
/*!************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupImport.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _properties_views_ABViewCSVImporter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./properties/views/ABViewCSVImporter */ "./src/rootPages/Designer/properties/views/ABViewCSVImporter.js");
/*
 * ui_work_object_workspace_popupImport
 *
 * Manage the Import CSV data to our currently selected ABObject.
 *
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();
   const ViewProperties = (0,_properties_views_ABViewCSVImporter__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   class UI_Work_Object_Workspace_PopupImport extends UIClass {
      constructor() {
         super("ui_work_object_workspace_popupImport");

         this.popup = null;
         // {ABViewCSVImporter}
         // an instance of our ABViewCSVImporter widget that we use to display
         // the CSV Import interface.
      }

      ui() {
         return {};
      }

      init(AB) {
         this.AB = AB;

         var defaultSettings = ViewProperties.toSettings();
         var defaultView = this.AB.viewNewDetatched(defaultSettings);

         this.popup = defaultView.component();
         this.popup.init(AB);
         this.popup.objectLoad(this.CurrentObject);
      }

      objectLoad(object) {
         super.objectLoad(object);

         this.popup?.objectLoad(object);
      }

      /**
       * @function show()
       *
       * Show popup.
       */
      show() {
         this.popup.showPopup();
      }

      hide() {
         this.popup.hide();
      }
   }

   return new UI_Work_Object_Workspace_PopupImport();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupNewDataField.js":
/*!******************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupNewDataField.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _properties_PropertyManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./properties/PropertyManager */ "./src/rootPages/Designer/properties/PropertyManager.js");
/*
 * ui_work_object_workspace_popupNewDataField
 *
 * Manage the Add New Data Field popup for creating new Fields on an object.
 *
 */



// const ABFieldManager = require("../AppBuilder/core/ABFieldManager");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   // const uiConfig = AB.Config.uiSettings();
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   var PropertyManager = (0,_properties_PropertyManager__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   class UI_Work_Object_Workspace_PopupNewDataField extends UIClass {
      //.extend(idBase, function(App) {

      constructor() {
         super("abd_work_object_workspace_popupNewDataField", {
            types: "",
            editDefinitions: "",
            buttonSave: "",
            buttonCancel: "",

            title: "",
            buttonMaximize: "",
            buttonMinimize: "",
            chooseFieldType: "",
            searchBar: "",
            fieldSetting: "",
            submission: "",
            buttonBack: "",
         });

         // var _objectHash = {}; // 'name' => ABFieldXXX object
         this._componentHash = {};
         // {hash} { ABFieldXXX.default().menuname : PropertyEditor }
         // A hash of all the available Field Property Editors, accessible by
         // the ABField.menuname
         // This is primarily used during a CREATE operation where the user
         // chooses the Field from a droplist and gets the menuname.

         this._componentsByType = {};
         // {hash} { ABFieldXXX.default().key : PropertyEditor }
         // A hash of all the available Field Property Editors, accessible by
         // the ABField.key
         // This is used during EDIT operations where a current ABField is
         // given and we lookup the editor by it's .key reference.

         this._currentEditor = null;
         // {PropertyEditor}
         // The current Property editor that is being displayed.

         this.defaultEditorComponent = null;
         // {PropertyEditor}
         // the default editor.  Usually the first one loaded.

         // var defaultEditorID = null; // the default editor id.

         this.submenus = [];
         // {array}
         // The list of ABField types that we can create.

         this._editField = null; // field instance being edited
         // {ABFieldXXX}
         // The ABField we are currently EDITING. If we are Adding a new field
         // this is null.
      }

      ui() {
         var ids = this.ids;

         // Our webix UI definition:
         return {
            view: "window",
            position: "center",
            id: ids.component,
            resize: true,
            modal: true,
            boarderless: true,
            height: 503,
            width: 700,
            head: {
               view: "toolbar",
               css: "webix_dark",
               paddingX: 2,
               elements: [
                  {
                     view: "label",
                     id: ids.title,
                     align: "center",
                     label: L("Choose Field-Type"),
                     css: "modal_title",
                  },
                  {
                     cols: [
                        {
                           view: "button",
                           id: ids.buttonMaximize,
                           label: '<span class="webix_icon"><i class="nomargin fa fa-expand"></i></span>',
                           css: "webix_transparent",
                           width: 40,
                           click: () => {
                              this.buttonMaximize();
                           },
                        },
                        {
                           view: "button",
                           id: ids.buttonMinimize,
                           label: '<span class="webix_icon"><i class="nomargin fa fa-compress"></i></span>',
                           hidden: true,
                           css: "webix_transparent",
                           width: 40,
                           click: () => {
                              this.buttonMinimize();
                           },
                        },
                        {
                           view: "button",
                           label: '<span class="webix_icon"><i class="nomargin fa fa-times"></i></span>',
                           css: "webix_transparent",
                           width: 40,
                           click: () => {
                              this.buttonCancel();
                           },
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
            // ready: function () {
            //  console.error('ready() called!!!')
            //  _logic.resetState();
            // },
            body: {
               rows: [
                  {
                     id: ids.chooseFieldType,
                     rows: [
                        {
                           view: "search",
                           id: ids.searchBar,
                           placeholder: L("Search by title..."),
                           align: "center",
                           on: {
                              onTimedKeyPress: () => {
                                 this.searchBar();
                              },
                           },
                        },
                        {
                           view: "dataview",
                           id: ids.types,
                           type: {
                              width: 87.5,
                              height: 87.5,
                              template:
                                 '<button type="button" class="webix_button webix_img_btn_top" style="text-align: center;"><span style="font-size: 50px;"><i class="#icon#"></i><br></span><span style="font-size: 12px;">#label#</span></button>',
                              css: "webix_transparent",
                           },
                           data: [],
                           datatype: "json",
                           select: 1,
                           click: (id /* , ev, node */) => {
                              this.onClick(id);
                           },
                        },
                     ],
                  },
                  {
                     id: ids.fieldSetting,
                     minWidth: 692,
                     maxWidth: 3840,
                     maxHeight: 2160,
                     hidden: true,
                     rows: [
                        {
                           view: "multiview",
                           id: ids.editDefinitions,
                           padding: 0,
                           // NOTE: can't leave this an empty [].
                           // We redefine this value later.
                           cells: [
                              {
                                 id: "del_me",
                                 view: "label",
                                 label: L("edit definition here"),
                              },
                           ],
                        },
                        {
                           id: ids.submission,
                           cols: [
                              { fillspace: true },
                              {
                                 view: "button",
                                 value:
                                    '<span class="webix_icon"><i class="nomargin fa fa-arrow-left fa-sm"></i></span><span class"text">' +
                                    L("Back") +
                                    "</span>",
                                 id: ids.buttonBack,
                                 css: "ab-cancel-button webix_transparent icon_back_btn",
                                 autowidth: true,
                                 click: () => {
                                    this.buttonBack();
                                 },
                              },
                              {
                                 view: "button",
                                 css: "webix_primary",
                                 id: ids.buttonSave,
                                 label:
                                    '<span class="text">' +
                                    L("Create") +
                                    "</span>",
                                 autowidth: true,
                                 type: "form",
                                 click: () => {
                                    this.buttonSave();
                                 },
                              },
                              { width: 17 },
                           ],
                        },
                        { height: 17 },
                     ],
                  },
               ],
            },
            on: {
               //onBeforeShow: function () {
               //  _logic.resetState();
               //},
               onHide: () => {
                  this.resetState();
               },
            },
         };
      }

      async init(AB) {
         // Our init() function for setting up our UI
         if (AB) {
            this.AB = AB;
         }
         var ids = this.ids;

         // initialize our components
         webix.ui(this.ui());
         webix.extend($$(ids.component), webix.ProgressBar);

         var Fields = PropertyManager.fields(); // ABFieldManager.allFields();

         //// we need to load a submenu entry and an editor definition for each
         //// of our Fields

         var newEditorList = {
            view: "multiview",
            id: ids.editDefinitions,
            animate: false,
            rows: [],
         };

         Fields.forEach((F) => {
            var menuName = F.defaults().menuName;
            var key = F.defaults().key;

            const icon = F.defaults().icon;

            // add a submenu for the fields multilingual key
            // this.submenus.push({ id: menuName, value: L(menuName) });
            this.submenus.push({
               id: menuName,
               icon: `nomargin fa fa-${icon}`,
               label: L(menuName),
            });

            // Add the Field's definition editor here:
            if (!this.defaultEditorComponent) {
               this.defaultEditorComponent = F;
               // defaultEditorID = menuName;
            }
            newEditorList.rows.push(F.ui());

            this._componentHash[menuName] = F;
            this._componentsByType[key] = F;
         });

         // the submenu button has a placeholder we need to remove and update
         // with one that has all our submenus in it.
         // var firstID = $$(ids.types).getFirstId();
         // $$(ids.types).updateItem(firstID, {
         //  value: labels.component.chooseType,
         //  submenu: submenus
         // })
         // $$(ids.types).define("options", this.submenus);
         // $$(ids.types).refresh();
         $$(ids.types).define("data", this.submenus);
         $$(ids.types).refresh();

         // now remove the 'del_me' definition editor placeholder.
         webix.ui(newEditorList, $$(ids.editDefinitions));

         // init & hide all the unused editors:
         for (let c in this._componentHash) {
            this._componentHash[c].init(this.AB);

            this._componentHash[c].hide();
         }

         this.defaultEditorComponent.show(); // show the default editor
         this._currentEditor = this.defaultEditorComponent;

         // set the richselect to the first option by default.
         // $$(ids.types).setValue(this.submenus[0].id);

         // $$(ids.editDefinitions).show();

         // $$(ids.editDefinitions).cells() // define the edit Definitions here.
      }

      // our internal business logic

      applicationLoad(application) {
         // _currentApplication = application;
         super.applicationLoad(application);

         // make sure all the Property components refer to this ABApplication
         for (var menuName in this._componentHash) {
            this._componentHash[menuName]?.applicationLoad(application);
         }
      }

      objectLoad(object) {
         super.objectLoad(object);

         // make sure all the Property components refer to this ABObject
         for (var menuName in this._componentHash) {
            this._componentHash[menuName]?.objectLoad(object);
         }
      }

      buttonCancel() {
         // set the search bar to '' by default.
         $$(this.ids.searchBar).setValue("");
         this.searchBar();

         this.buttonBack();

         // hide this popup.
         $$(this.ids.component).hide();
      }

      buttonMaximize() {
         $$(this.ids.buttonMaximize).hide();
         $$(this.ids.buttonMinimize).show();

         webix.fullscreen.set(this.ids.component);
      }

      buttonMinimize() {
         $$(this.ids.buttonMinimize).hide();
         $$(this.ids.buttonMaximize).show();

         webix.fullscreen.exit();
      }

      searchBar() {
         const value = $$(this.ids.searchBar).getValue().toLowerCase();
         $$(this.ids.types).filter(
            (obj) => obj.label.toLowerCase().indexOf(value) != -1
         );
      }

      buttonBack() {
         this.resetState();

         this.addPopup();

         // clear all editors:
         for (var c in this._componentHash) {
            this._componentHash[c].clear();
         }
      }

      async buttonSave() {
         var ids = this.ids;

         $$(ids.buttonSave).disable();
         // show progress
         $$(ids.component).showProgress();

         var editor = this._currentEditor;
         if (editor) {
            // the editor can define some basic form validations.
            if (editor.isValid()) {
               var vals = this.AB.cloneDeep(editor.values());

               var field = null;
               var oldData = null;

               var linkCol;

               // if this is an ADD operation, (_editField will be undefined)
               if (!this._editField) {
                  // get a new instance of a field:
                  field = this.CurrentObject.fieldNew(vals);

                  // Provide a default width based on the column label
                  var width = 20 + field.label.length * 10;
                  if (field.settings.showIcon) {
                     width = width + 20;
                  }
                  if (width < 100) {
                     width = 100;
                  }

                  field.settings.width = width;

                  // TODO workaround : where should I add a new link field to link object
                  if (field.key == "connectObject") {
                     let rand = Math.floor(Math.random() * 1000);
                     field.settings.isSource = 1;

                     var linkObject = field.datasourceLink;

                     // 1:1, 1:M, M:1 should have same column name
                     let linkColumnName = field.columnName;

                     // check duplicate column
                     if (
                        linkObject.fields((f) => f.columnName == linkColumnName)
                           .length
                     ) {
                        linkColumnName = `${linkColumnName}${rand}`;
                     }

                     // M:N should have different column name into the join table
                     if (
                        field.settings.linkType == "many" &&
                        field.settings.linkViaType == "many"
                     ) {
                        // NOTE : include random number to prevent duplicate column names
                        linkColumnName = `${this.CurrentObject.name}${rand}`;
                     }

                     linkCol = linkObject.fieldNew({
                        // id: OP.Util.uuid(),

                        key: field.key,

                        columnName: linkColumnName,
                        label: this.CurrentObject.label,

                        settings: {
                           showIcon: field.settings.showIcon,

                           linkObject: field.object.id,
                           linkType: field.settings.linkViaType,
                           linkViaType: field.settings.linkType,
                           isCustomFK: field.settings.isCustomFK,
                           indexField: field.settings.indexField,
                           indexField2: field.settings.indexField2,
                           isSource: 0,
                           width: width,
                        },
                     });
                  }
               } else {
                  // NOTE: update label before .toObj for .unTranslate to .translations
                  if (vals.label) this._editField.label = vals.label;

                  // use our _editField, backup our oldData
                  oldData = this._editField.toObj();

                  // update changed values to old data
                  var updateValues = this.AB.cloneDeep(oldData);
                  for (let key in vals) {
                     // update each values of .settings
                     if (
                        key == "settings" &&
                        vals["settings"] &&
                        typeof vals["settings"] == "object"
                     ) {
                        updateValues["settings"] =
                           updateValues["settings"] || {};

                        for (let keySetting in vals["settings"]) {
                           updateValues["settings"][keySetting] =
                              vals["settings"][keySetting];
                        }
                     } else {
                        updateValues[key] = vals[key];
                     }
                  }

                  this._editField.fromValues(updateValues);

                  field = this._editField;
               }

               var validator = field.isValid();
               if (validator.fail()) {
                  validator.updateForm($$(editor.ids.component));
                  // OP.Form.isValidationError(errors, $$(editor.ui.id));

                  // keep our old data
                  if (oldData) {
                     field.fromValues(oldData);
                  }

                  $$(ids.buttonSave).enable();
                  $$(ids.component).hideProgress();
               } else {
                  try {
                     await field.save();

                     let finishUpdateField = () => {
                        $$(ids.buttonSave).enable();
                        $$(ids.component).hideProgress();
                        this._currentEditor.clear();
                        this.hide();
                        this.emit("save", field);

                        // _logic.callbacks.onSave(field);
                     };

                     // let refreshModels = () => {
                     //    console.error(
                     //       "!!! Verify if we still need to .refresh()"
                     //    );

                     //    // refresh linked object model
                     //    linkCol.object.model().refresh();

                     //    // refresh source object model
                     //    // NOTE: M:1 relation has to refresh model after linked object's refreshed
                     //    field.object.model().refresh();
                     // };

                     // TODO workaround : update link column id
                     if (linkCol != null) {
                        linkCol.settings.linkColumn = field.id;
                        await linkCol.save();

                        // now linkCol has an .id, so update our field:
                        field.settings.linkColumn = linkCol.id;
                        await field.save();

                        // when add new link fields, then run create migrate fields here
                        if (!this._editField) {
                           await field.migrateCreate();
                           await linkCol.migrateCreate();
                        }

                        // refreshModels();
                        finishUpdateField();
                     } else {
                        finishUpdateField();
                     }
                  } catch (err) {
                     this.AB.notify.developer(err, {
                        context:
                           "UIWorkObjectWorkspacePopupNewDataField:buttonSave(): error saving new field",
                        field: field.toObj(),
                     });

                     // if (
                     //    OP.Validation.isFormValidationError(
                     //       err,
                     //       $$(editor.ui.id)
                     //    )
                     // ) {
                     //    // for validation errors, keep things in place
                     //    // and let the user fix the data:
                     //    $$(ids.buttonSave).enable();
                     //    $$(ids.component).hideProgress();
                     // } else {
                     //    var errMsg = err.toString();
                     //    if (err.message) {
                     //       errMsg = err.message;
                     //    }
                     //    webix.alert({
                     //       title: "Error saving fields.",
                     //       ok: "tell appdev",
                     //       text: errMsg,
                     //       type: "alert-error",
                     //    });
                     //    // Q: if not validation error, do we
                     //    // then field.destroy() ? and let them try again?
                     //    // $$(ids.buttonSave).enable();
                     //    // $$(ids.component).hideProgress();
                     // }
                  }
               }
            } else {
               $$(ids.buttonSave).enable();
               $$(ids.component).hideProgress();
            }
         } else {
            this.AB.notify.developer(
               new Error("Could not find the current editor."),
               {}
            );

            $$(ids.buttonSave).enable();
            $$(ids.component).hideProgress();
         }

         // if (!inputValidator.validateFormat(fieldInfo.name)) {
         //  self.enable();
         //  return;
         // }

         // // Validate duplicate field name
         // var existsColumn = $.grep(dataTable.config.columns, function (c) { return c.id == fieldInfo.name.replace(/ /g, '_'); });
         // if (existsColumn && existsColumn.length > 0 && !data.editFieldId) {
         //  webix.alert({
         //      title: labels.add_fields.duplicateFieldTitle,
         //      text: labels.add_fields.duplicateFieldDescription,
         //      ok: labels.common.ok
         //  });
         //  this.enable();
         //  return;
         // }

         // if (fieldInfo.weight == null)
         //  fieldInfo.weight = dataTable.config.columns.length;

         // // Call callback function
         // if (base.saveFieldCallback && base.fieldName) {
         //  base.saveFieldCallback(base.fieldName, fieldInfo)
         //      .then(function () {
         //          self.enable();
         //          base.resetState();
         //          base.hide();
         //      });
         // }

         this.buttonCancel;
      }

      hide() {
         $$(this.ids.component).hide();
      }

      modeAdd(allowFieldKey) {
         // show default editor:
         this.defaultEditorComponent.show(false, false);
         this._currentEditor = this.defaultEditorComponent;
         var ids = this.ids;

         // allow add the connect field only to import object
         if (this.CurrentObject.isImported) allowFieldKey = "connectObject";

         if (allowFieldKey) {
            var connectField = PropertyManager.fields().filter(
               (f) => f.defaults().key == allowFieldKey
            )[0];
            if (!connectField) return;
            var connectMenuName = connectField.defaults().menuName;
            $$(ids.types).setValue(connectMenuName);
            $$(ids.chooseFieldType).disable();
         }
         // show the ability to switch data types
         else {
            $$(ids.chooseFieldType).enable();
         }

         // change button text to 'add'
         // $$(ids.buttonSave).define("label", L("Add Column"));

         // add mode UI
         this.addPopup();
      }

      modeEdit(field) {
         this._currentEditor?.hide();

         // switch to this field's editor:
         // hide the rest
         for (var c in this._componentsByType) {
            if (c == field.key) {
               this._componentsByType[c].show(false, false);
               this._componentsByType[c].populate(field);
               this._currentEditor = this._componentsByType[c];
               this._currentEditor["modeEdit"] = true;
            } else {
               this._componentsByType[c].hide();
            }
         }

         // disable elements that disallow to edit
         var elements = this._currentEditor.ui()?.elements;
         if (elements) {
            var disableElem = (elem) => {
               if (elem.disallowEdit) {
                  $$(elem.id)?.disable?.();
               }
            };

            this._currentEditor.eachDeep(elements, disableElem);
            // elements.forEach((elem) => {
            //    disableElem(elem);

            //    // disable elements are in rows/cols
            //    var childElems = elem.cols || elem.rows;
            //    if (childElems && childElems.forEach) {
            //       childElems.forEach((childElem) => {
            //          disableElem(childElem);
            //       });
            //    }
            // });
         }
         this.editPopup(field.defaults.menuName);
      }

      /**
       * @function onChange
       * swap the editor view to match the data field selected in the menu.
       *
       * @param {string} name  the menuName() of the submenu that was selected.
       */

      onClick(name) {
         // show Field Type popup
         $$(this.ids.chooseFieldType).hide();
         $$(this.ids.fieldSetting).show();

         // set title name by each field type
         $$(this.ids.title).setValue(L("Create Field:") + " " + name);

         // note, the submenu returns the Field.menuName() values.
         // we use that to lookup the Field here:
         var editor = this._componentHash[name];
         if (editor) {
            editor.show();
            this._currentEditor = editor;
            // $$(this.ids.types).blur();
         } else {
            // most likely they clicked on the menu button itself.
            // do nothing.
            // OP.Error.log("App Builder:Workspace:Object:NewDataField: could not find editor for submenu item:"+name, { name:name });
         }
      }

      resetState() {
         // enable elements that disallow to edit
         var elements = this._currentEditor.ui()?.elements;
         if (elements) {
            var enableElem = (elem) => {
               if (elem.disallowEdit) {
                  $$(elem.id)?.enable?.();
               }
            };

            this._currentEditor.eachDeep(elements, enableElem);
            // elements.forEach((elem) => {
            //    enableElem(elem);

            //    // enable elements are in rows/cols
            //    var childElems = elem.cols || elem.rows;
            //    if (childElems && childElems.forEach) {
            //       childElems.forEach((childElem) => {
            //          enableElem(childElem);
            //       });
            //    }
            // });
         }

         this.defaultEditorComponent.show(); // show the default editor
         this._currentEditor = this.defaultEditorComponent;

         // set the richselect to the first option by default.
         // $$(this.ids.types).setValue(this.submenus[0].id);
      }

      addPopup() {
         this.buttonMinimize();

         // show the ability to switch data types
         $$(this.ids.chooseFieldType).show();

         // show button "Back"
         $$(this.ids.buttonBack).show();

         // set title name to "Choose Field-Type"
         $$(this.ids.title).setValue(L("Choose Field-Type"));

         // hide form editor
         $$(this.ids.fieldSetting).hide();

         // change button text to 'Create'
         $$(this.ids.buttonSave).define("label", L("Create"));
         $$(this.ids.buttonSave).refresh();
      }

      editPopup(fieldTypeName) {
         this.buttonMinimize();

         // hide the ability to switch data types
         $$(this.ids.chooseFieldType).hide();

         // hide button "Back"
         $$(this.ids.buttonBack).hide();

         // set title name by each field type
         $$(this.ids.title).setValue(L("Edit Field:") + " " + fieldTypeName);

         // show form editor
         $$(this.ids.fieldSetting).show();

         // change button text to 'save'
         $$(this.ids.buttonSave).define("label", L("Save"));
         $$(this.ids.buttonSave).refresh();
      }

      /**
       * @function show()
       *
       * Show this component.
       * @param {ABField} field
       *        the ABField to edit.  If not provided, then this is an ADD
       *        operation.
       * @param {string} fieldKey
       *        allow only this field type
       */
      show(field, fieldKey) {
         this._editField = field;

         if (this._editField) {
            this.modeEdit(field);
         } else {
            this.modeAdd(fieldKey);
         }

         $$(this.ids.component).show();
      }

      typeClick() {
         // NOTE: for functional testing we need a way to display the submenu
         // (functional tests don't do .hover very well)
         // so this routine is to enable .click() to show the submenu.

         var ids = this.ids;

         var subMenuId = $$(ids.types).config.data[0].submenu;

         // #HACK Sub-menu popup does not render on initial
         // Force it to render popup by use .getSubMenu()
         if (typeof subMenuId != "string") {
            $$(ids.types).getSubMenu($$(ids.types).config.data[0].id);
            subMenuId = $$(ids.types).config.data[0].submenu;
         }

         if ($$(subMenuId)) $$(subMenuId).show();
      }
   } // end class

   return new UI_Work_Object_Workspace_PopupNewDataField();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupSortFields.js":
/*!****************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupSortFields.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_object_workspace_popupSortFields
 *
 * Manage the Sort Fields popup.
 *
 */


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
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


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupTrack.js":
/*!***********************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupTrack.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ab_work_object_workspace_track
 *
 * Manage the Object Workspace track area.
 *
 */
// const ABComponent = require("../classes/platform/ABComponent");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupTrack extends UIClass {
      /**
       * @param {object} App
       * @param {string} idBase
       */
      constructor() {
         var idBase = "ui_work_object_workspace_track";

         super({
            popup: `${idBase}_popup`,
            timeline: `${idBase}_timeline`,
         });
      }

      // Our webix UI definition:
      ui() {
         let ids = this.ids;

         return {
            view: "window",
            id: ids.popup,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Record History"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     align: "right",
                     click: () => {
                        this.close();
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            position: "center",
            resize: true,
            modal: true,
            editable: false,
            width: 500,
            height: 500,
            body: {
               view: "timeline",
               id: ids.timeline,
               type: {
                  height: 140,
                  templateDate: (obj) => {
                     return this.AB.toDateFormat(obj.timestamp, {
                        localeCode: "en",
                        format: "DD MMM, YYYY hh:mma",
                     });
                  },
                  lineColor: (obj) => {
                     switch (obj.level) {
                        case "insert":
                           return "#FF5C4C";
                        case "update":
                           return "#1CA1C1";
                        case "delete":
                           return "#94A1B3";
                     }
                  },
               },
               scheme: {
                  $init: (obj) => {
                     // Action
                     switch (obj.level) {
                        case "insert":
                           obj.value = L("Add");
                           break;
                        case "update":
                           obj.value = L("Edit");
                           break;
                        case "delete":
                           obj.value = L("Delete");
                           break;
                     }

                     // By
                     obj.details = `by <b>${obj.username || L("Unknown")}</b>`;

                     // Detail of record
                     if (obj.record) {
                        let recDetail = "";
                        Object.keys(obj.record).forEach((prop) => {
                           recDetail = recDetail.concat(
                              `${prop}: <b>${
                                 obj.record[prop] != null
                                    ? obj.record[prop]
                                    : ""
                              }</b> <br />`
                           );
                        });

                        obj.details = obj.details.concat("<br />");
                        obj.details = obj.details.concat(
                           `<div>${recDetail}</div>`
                        );
                     }
                  },
               },
            },
         };
      }

      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());

         let $timeline = $$(this.ids.timeline);
         if ($timeline) {
            webix.extend($timeline, webix.ProgressBar);
         }
      }

      open(object, rowId) {
         this.objectLoad(object);

         let ids = this.ids;
         let $popup = $$(ids.popup);
         if (!$popup) return;

         $popup.show();

         this.loadData(rowId);
      }

      async loadData(rowId) {
         if (!this.CurrentObject) return;

         let $timeline = $$(this.ids.timeline);

         // pull tracking data
         $timeline.showProgress({ type: "icon" });
         try {
            var data = this.CurrentObject.model().logs({ rowId });
            $timeline.clearAll(true);
            $timeline.parse(data);
         } catch (err) {
            console.error(err);
            webix.alert({
               text: L("Unable to display logs for this entry."),
            });
         }
         $timeline.hideProgress();
      }

      close() {
         let ids = this.ids;
         let $popup = $$(ids.popup);
         if (!$popup) return;

         $popup.hide();
      }
   }

   return new UI_Work_Object_Workspace_PopupTrack();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_popupViewSettings.js":
/*!******************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_popupViewSettings.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _properties_workspaceViews_ABViewGantt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./properties/workspaceViews/ABViewGantt */ "./src/rootPages/Designer/properties/workspaceViews/ABViewGantt.js");
/* harmony import */ var _properties_workspaceViews_ABViewGrid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./properties/workspaceViews/ABViewGrid */ "./src/rootPages/Designer/properties/workspaceViews/ABViewGrid.js");
/* harmony import */ var _properties_workspaceViews_ABViewKanban__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./properties/workspaceViews/ABViewKanban */ "./src/rootPages/Designer/properties/workspaceViews/ABViewKanban.js");
/*
 * ui_work_object_workspace_popupViewSettings
 *
 * Manage the popup to collect the settings for a workspace view.
 *
 */





/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const ABViewGrid = (0,_properties_workspaceViews_ABViewGrid__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Object_Workspace_PopupAddView extends UIClass {
      constructor() {
         var base = "abd_work_object_workspace_popupAddView";
         super(base, {
            form: "",
            formAdditional: "",
            nameInput: "",
            typeInput: "",
            cancelButton: "",
            cancelX: "",
            saveButton: "",
         });

         this._view = null;
         // {Grid/kanban/Gantt} the current UI View type we are displaying

         this.comKanban = (0,_properties_workspaceViews_ABViewKanban__WEBPACK_IMPORTED_MODULE_3__["default"])(AB, `${base}_kanban`);
         this.comKanban.on("new.field", (key) => {
            this.emit("new.field", key);
         });
         this.comGantt = (0,_properties_workspaceViews_ABViewGantt__WEBPACK_IMPORTED_MODULE_1__["default"])(AB, `${base}_gantt`);

         this.on("field.added", (field) => {
            this.comKanban.emit("field.added", field);
         });
      }

      ui() {
         var ids = this.ids;

         // Our webix UI definition:
         var formUI = {
            view: "form",
            id: ids.form,
            visibleBatch: "global",
            rules: {
               hGroup: (value, { vGroup }) => {
                  return !value || value !== vGroup;
               },
            },
            elements: [
               {
                  view: "text",
                  label: L("Name"),
                  id: ids.nameInput,
                  name: "name",
                  placeholder: L("Create a name for the view"),
                  required: true,
                  invalidMessage: L("this field is required"),
                  on: {
                     onChange: (/* id */) => {
                        $$(ids.nameInput).validate();
                     },
                     onAfterRender() {
                        UIClass.CYPRESS_REF(this);
                     },
                  },
               },
               {
                  view: "richselect",
                  label: L("Type"),
                  id: ids.typeInput,
                  name: "type",
                  options: [
                     {
                        id: ABViewGrid.type(),
                        value: L("Grid"),
                     },
                     {
                        id: this.comKanban.type(),
                        value: L("Kanban"),
                     },
                     {
                        id: this.comGantt.type(),
                        value: L("Gantt"),
                     },
                  ],
                  value: ABViewGrid.type(),
                  required: true,
                  on: {
                     onChange: (typeView) => {
                        this.switchType(typeView);
                     },
                  },
               },
               {
                  id: ids.formAdditional,
                  view: "layout",
                  rows: [this.comKanban.ui(), this.comGantt.ui()],
               },
               {
                  margin: 5,
                  cols: [
                     { fillspace: true },
                     {
                        id: ids.buttonCancel,
                        view: "button",
                        value: L("Cancel"),
                        css: "ab-cancel-button",
                        autowidth: true,
                        click: () => {
                           this.buttonCancel();
                        },
                        on: {
                           onAfterRender() {
                              UIClass.CYPRESS_REF(this);
                           },
                        },
                     },
                     {
                        id: ids.buttonSave,
                        view: "button",
                        css: "webix_primary",
                        value: L("Save"),
                        autowidth: true,
                        type: "form",
                        click: () => {
                           this.buttonSave();
                        },
                        on: {
                           onAfterRender() {
                              UIClass.CYPRESS_REF(this);
                           },
                        },
                     },
                  ],
               },
            ],
         };

         return {
            view: "window",
            id: ids.component,
            height: 400,
            width: 400,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("View Settings"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     id: ids.cancelX,
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.buttonCancel();
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            position: "center",
            body: formUI,
            modal: true,
            on: {
               onShow: () => {
                  this.onShow();
               },
            },
         };
      } // ui()

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         return Promise.resolve();
      } // init()

      switchType(typeView) {
         $$(this.ids.formAdditional).showBatch(typeView);

         // initial
         switch (typeView) {
            case "kanban":
               this.comKanban.init(this.CurrentObject, this._view);
               break;
            case "gantt":
               this.comGantt.init(this.CurrentObject, this._view);
               break;
         }

         $$(this.ids.component).resize();
      }

      onShow() {
         var ids = this.ids;

         // clear field options in the form
         $$(ids.form).clear();
         $$(ids.form).clearValidation();

         if (this._view) {
            $$(ids.nameInput).setValue(this._view.name);
            $$(ids.typeInput).setValue(this._view.type);
            // NOTE: the $$(ids.typeInput).onChange() will trigger
            // the selected view's refresh.
         }
         // Default value
         else {
            $$(ids.nameInput).setValue("");
            $$(ids.typeInput).setValue(ABViewGrid.type());
         }
      }

      /**
       * @function show()
       * Show this component.  If a viewObj is passed in, then we are editing
       * a component. Otherwise, this is an Add operation.
       * @param {ui_work_object_workspace_view_*} viewObj
       *        The currentView definitions of an existing view we are editing
       */
      show(viewObj) {
         this._view = viewObj;
         $$(this.ids.component).show();
      }

      /**
       * @function hide()
       * hide this component.
       */
      hide() {
         $$(this.ids.component).hide();
      }

      buttonCancel() {
         this.hide();
      }

      buttonSave() {
         var ids = this.ids;
         if (!$$(ids.form).validate()) return;

         var view = {};

         switch ($$(ids.typeInput).getValue()) {
            case this.comKanban.type():
               // validate
               if (
                  this.comKanban.validate &&
                  !this.comKanban.validate($$(ids.form))
               )
                  return;

               view = this.comKanban.values();
               break;

            case this.comGantt.type():
               // validate
               if (
                  this.comGantt.validate &&
                  !this.comGantt.validate($$(ids.form))
               )
                  return;

               view = this.comGantt.values($$(ids.form));
               break;
         }

         // save the new/updated view
         view.name = $$(ids.nameInput).getValue();
         view.type = $$(ids.typeInput).getValue();

         // var viewObj;
         if (this._view) {
            Object.keys(view).forEach((k) => {
               this._view[k] = view[k];
            });
            this.emit("updated", this._view);
            // this.callbacks.onViewUpdated(viewObj);
         } else {
            // viewObj = this.CurrentObject.workspaceViews.addView(view);
            this.emit("added", view);
            // this.callbacks.onViewAdded(viewObj);
         }
         this.hide();
      }
   }
   return new UI_Work_Object_Workspace_PopupAddView();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_view_grid.js":
/*!**********************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_view_grid.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _properties_workspaceViews_ABViewGrid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./properties/workspaceViews/ABViewGrid */ "./src/rootPages/Designer/properties/workspaceViews/ABViewGrid.js");
/*
 * ui_work_object_workspace_view_grid
 *
 * Display an instance of a Grid type of Workspace View in our area.
 *
 * This generic webix container will be given an instace of a workspace
 * view definition (Grid), and then create an instance of an ABViewGrid
 * widget to display.
 *
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   const ViewGridProperties = (0,_properties_workspaceViews_ABViewGrid__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   class UI_Work_Object_Workspace_View_Grid extends UIClass {
      constructor() {
         super("ui_work_object_workspace_view_grid");
      }

      // Our webix UI definition:
      ui() {
         var ids = this.ids;

         return {
            id: ids.component,
            rows: [
               {},
               {
                  view: "label",
                  label: "Impressive View -> Grid",
               },
               {},
            ],
         };
      }

      // Our init() function for setting up our UI
      async init(AB) {
         this.AB = AB;
      }

      defaultSettings(data) {
         // Pull the ABViewGrid definitions
         var defaultGridSettings = ViewGridProperties.toSettings();
         defaultGridSettings.label = L(defaultGridSettings.name);
         var defaultGridView = this.AB.viewNewDetatched(defaultGridSettings);
         var defaultGrid = defaultGridView.toObj();
         defaultGrid.id = data?.id ?? AB.jobID();

         // For our ABDesigner Object workspace, these settings are
         // enabled:
         ["isEditable", "massUpdate", "allowDelete", "trackView"].forEach(
            (k) => {
               defaultGrid.settings[k] = 1;
            }
         );
         defaultGrid.settings.padding = 0;
         defaultGrid.settings.showToolbar = 0;
         defaultGrid.settings.gridFilter = {
            filterOption: 0,
            isGlobalToolbar: 0,
         };

         return {
            id: defaultGrid.id,
            isDefaultView: false,
            type: defaultGrid.type,
            icon: defaultGrid.icon,

            name: "Default Grid",
            sortFields: [], // array of columns with their sort configurations
            filterConditions: [], // array of filters to apply to the data table
            frozenColumnID: "", // id of column you want to stop freezing
            hiddenFields: [], // array of [ids] to add hidden:true to

            component: defaultGrid,
         };
      }

      getColumnIndex(id) {
         return this._currentComponent.getColumnIndex(id);
      }

      datacollectionLoad(dc) {
         this.datacollection = dc;
      }

      get $grid() {
         return this._currentComponent?.getDataTable();
      }

      ready() {
         this.ListComponent.ready();
      }

      async show(view) {
         await this.viewLoad(view);
         $$(this.ids.component).show();
         this.emit("show");
      }

      async viewLoad(view) {
         this.currentViewDef = view;

         this.currentView = this.AB.viewNewDetatched(view.component);
         var component = this.currentView.component();

         // OK, a ABViewGrid component wont display the grid unless there
         // is a .datacollection or .dataviewID specified.
         // but calling .datacollectionLoad() doesn't actually load the data
         // unless there is the UI available.
         // So ... do this to register the datacollection
         component.datacollectionLoad(this.datacollection);

         var ui = component.ui();
         ui.id = this.ids.component;
         webix.ui(ui, $$(this.ids.component));
         await component.init(this.AB);

         // Now call .datacollectionLoad() again to actually load the data.
         component.datacollectionLoad(this.datacollection);

         component.on("column.header.clicked", (node, EditField) => {
            this.emit("column.header.clicked", node, EditField);
         });

         component.on("object.track", (currentObject, id) => {
            this.emit("object.track", currentObject, id);
         });

         component.on("selection", () => {
            this.emit("selection");
         });

         component.on("selection.cleared", () => {
            this.emit("selection.cleared");
         });

         component.on("column.order", (fieldOrder) => {
            this.emit("column.order", fieldOrder);
         });

         this._currentComponent = component;
      }

      viewNew(data) {
         var defaults = this.defaultSettings(data);
         Object.keys(data).forEach((k) => {
            defaults[k] = data[k];
         });

         return defaults;
      }

      deleteSelected($view) {
         return this._currentComponent.toolbarDeleteSelected($view);
      }

      massUpdate($view) {
         return this._currentComponent.toolbarMassUpdate($view);
      }

      /**
       * @method refreshHeader()
       * This is called everytime a change in the ABObject happens and the
       * current component needs to refresh the display.  So when a Field is
       * Added or Removed, the display of the component changes.
       *
       * the ui_work_object_workspace keeps track of what the USER has set
       * for the hiddenFields, frozenColumns and related display options.
       *
       * Those are passed in, and we are responsible for converting that
       * to the component settings.
       * @param {array} fields
       *        An array of ABField instances that are in the current object.
       * @param {array} hiddenFields
       *        An array of the ABfield.columnName(s) that are to be hidden.
       *        These are what are matched with the {columnHeader}.id
       * @param {array} filters
       *        The current filter settings.
       * @param {array} sorts
       *        The current sort settings.
       * @param {string} frozenColumnID
       *        the ABField.columnName of the column that we have frozen.
       */
      refreshHeader(
         /* fields,*/ hiddenFields = [],
         filters,
         sorts,
         frozenColumnID
      ) {
         var object = this.CurrentObject;
         var columnHeaders = object.columnHeaders(true, true, [], [], []);

         // this calculation is done in the ABViewGridComponent.refreshHeader():
         // columnHeaders.forEach((h) => {
         //    if (hiddenFields.indexOf(h.id) > -1) {
         //       h.hidden = true;
         //    }
         // });
         if (this._currentComponent) {
            this._currentComponent.columnConfig(columnHeaders);

            this._currentComponent.settings.hiddenFields = hiddenFields;
            this._currentComponent.settings.filterConditions = filters;
            this._currentComponent.settings.sortFields = sorts;
            this._currentComponent.settings.frozenColumnID = frozenColumnID;

            this._currentComponent.refreshHeader(true);
         }
      }

      /**
       * @function rowAdd()
       *
       * add a new row to the data table
       */
      /*
      rowAdd() {
         // TODO: delete this, I think...
         debugger;
         if (!settings.isEditable) return;

         var emptyObj = CurrentObject.defaultValues();
         CurrentObject.model()
            .create(emptyObj)
            .then((obj) => {
               if (obj == null) return;

               // var DataTable = $$(ids.component);
               // if (!DataTable.exists(obj.id))
               //     DataTable.add(obj, 0);
               if (
                  CurrentDatacollection &&
                  CurrentDatacollection.__dataCollection &&
                  !CurrentDatacollection.__dataCollection.exists(obj.id)
               )
                  CurrentDatacollection.__dataCollection.add(obj, 0);
            });
      }
      */
   }
   return new UI_Work_Object_Workspace_View_Grid();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_view_kanban.js":
/*!************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_view_kanban.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _properties_workspaceViews_ABViewKanban__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./properties/workspaceViews/ABViewKanban */ "./src/rootPages/Designer/properties/workspaceViews/ABViewKanban.js");
/*
 * ui_work_object_workspace_view_kanban
 *
 * Display an instance of a Kanban type of Workspace View in our area.
 *
 * This generic webix container will be given an instace of a workspace
 * view definition (Kanban), and then create an instance of an ABViewKanban
 * widget to display.
 *
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   const ViewKanbanProperties = (0,_properties_workspaceViews_ABViewKanban__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   class UI_Work_Object_Workspace_View_Kanban extends UIClass {
      constructor() {
         super("ui_work_object_workspace_view_kanban");
      }

      // Our webix UI definition:
      ui() {
         var ids = this.ids;

         return {
            id: ids.component,
            rows: [
               {},
               {
                  view: "label",
                  label: "Impressive View -> Kanban",
               },
               {},
            ],
         };
      }

      // Our init() function for setting up our UI
      async init(AB) {
         this.AB = AB;
      }

      defaultSettings(data) {
         // Pull the ABViewGrid definitions
         var defaultSettings = ViewKanbanProperties.toSettings();

         // transfer our specific field settings
         Object.keys(defaultSettings.settings).forEach((d) => {
            defaultSettings.settings[d] = data[d];
         });

         // TODO: include a text label formatter in the editor for
         // the Kanban view.  then pull the data.textTemplate into
         // defaultSettings.settings.textTemplate
         //
         // Until then, just make a default view with each Object
         // field: value:
         defaultSettings.label = L(defaultSettings.name);

         var textView = this.AB.viewNewDetatched({ key: "text" });

         var CurrentObject = this.CurrentObject;
         var labelData = CurrentObject.labelFormat;
         if (!labelData && CurrentObject.fields().length > 0) {
            var defaultFields = CurrentObject.fields((f) =>
               f.fieldUseAsLabel()
            );
            defaultFields.forEach((f) => {
               labelData = `${labelData}<br>${f.label}: {${textView.fieldKey(
                  f
               )}}`;
            });
         }

         defaultSettings.settings.textTemplate = labelData;

         // show all the fields in our Side Edit Form
         defaultSettings.settings.editFields = CurrentObject.fields().map(
            (f) => f.id
         );

         var defaultView = this.AB.viewNewDetatched(defaultSettings);
         var defaultKanban = defaultView.toObj();
         defaultKanban.id = data.id ?? AB.jobID();

         return {
            id: defaultKanban.id,
            isDefaultView: false,
            type: defaultKanban.type,
            icon: defaultKanban.icon,

            name: "Default Kanban",
            sortFields: [], // array of columns with their sort configurations
            filterConditions: [], // array of filters to apply to the data table
            frozenColumnID: "", // id of column you want to stop freezing
            hiddenFields: [], // array of [ids] to add hidden:true to

            component: defaultKanban,
         };
      }

      // getColumnIndex(id) {
      //    return this._currentComponent.getColumnIndex(id);
      // }

      datacollectionLoad(dc) {
         this.datacollection = dc;
      }

      // get $grid() {
      //    return this._currentComponent?.getDataTable();
      // }

      // ready() {
      //    this.ListComponent.ready();
      // }

      async show(view) {
         await this.viewLoad(view);
         $$(this.ids.component).show();
         this.emit("show");
      }

      async viewLoad(view) {
         this.currentViewDef = view;

         this.currentView = this.AB.viewNewDetatched(view.component);
         var component = this.currentView.component();

         // OK, a ABViewGrid component wont display the grid unless there
         // is a .datacollection or .dataviewID specified.
         // but calling .datacollectionLoad() doesn't actually load the data
         // unless there is the UI available.
         // So ... do this to register the datacollection
         // component.datacollectionLoad(this.datacollection);

         var ui = component.ui();
         ui.id = this.ids.component;
         webix.ui(ui, $$(this.ids.component));
         await component.init(this.AB);

         // Now call .datacollectionLoad() again to actually load the data.
         component.datacollectionLoad(this.datacollection);

         component.show();

         this._currentComponent = component;
      }

      /**
       * @method viewNew()
       * return a new workspace view definition with an ABViewKanban
       * based upon the provided default data (gathered from our workspaceView)
       * @param {obj} data
       *        The configuration information for this ABView.
       */
      viewNew(data) {
         var defaults = this.defaultSettings(data);
         Object.keys(data).forEach((k) => {
            defaults[k] = data[k];
         });

         return defaults;
      }

      // deleteSelected($view) {
      //    return this._currentComponent.toolbarDeleteSelected($view);
      // }

      // massUpdate($view) {
      //    return this._currentComponent.toolbarMassUpdate($view);
      // }

      /**
       * @method refreshHeader()
       * This is called everytime a change in the ABObject happens and the
       * current component needs to refresh the display.  So when a Field is
       * Added or Removed, the display of the component changes.
       *
       * the ui_work_object_workspace keeps track of what the USER has set
       * for the hiddenFields, frozenColumns and related display options.
       *
       * Those are passed in, and we are responsible for converting that
       * to the component settings.
       * @param {array} fields
       *        An array of ABField instances that are in the current object.
       * @param {array} hiddenFields
       *        An array of the ABfield.columnName(s) that are to be hidden.
       *        These are what are matched with the {columnHeader}.id
       * @param {array} filters
       *        The current filter settings.
       * @param {array} sorts
       *        The current sort settings.
       * @param {string} frozenColumnID
       *        the ABField.columnName of the column that we have frozen.
       */
      // refreshHeader(
      //    /* fields,*/ hiddenFields = [],
      //    filters,
      //    sorts,
      //    frozenColumnID
      // ) {
      //    var object = this.CurrentObject;
      //    var columnHeaders = object.columnHeaders(true, true, [], [], []);

      //    // this calculation is done in the ABViewGridComponent.refreshHeader():
      //    // columnHeaders.forEach((h) => {
      //    //    if (hiddenFields.indexOf(h.id) > -1) {
      //    //       h.hidden = true;
      //    //    }
      //    // });

      //    this._currentComponent.columnConfig(columnHeaders);

      //    this._currentComponent.settings.hiddenFields = hiddenFields;
      //    this._currentComponent.settings.filterConditions = filters;
      //    this._currentComponent.settings.sortFields = sorts;
      //    this._currentComponent.settings.frozenColumnID = frozenColumnID;

      //    this._currentComponent.refreshHeader(true);
      // }

      /**
       * @function rowAdd()
       *
       * add a new row to the data table
       */
      /*
      rowAdd() {
         // TODO: delete this, I think...
         debugger;
         if (!settings.isEditable) return;

         var emptyObj = CurrentObject.defaultValues();
         CurrentObject.model()
            .create(emptyObj)
            .then((obj) => {
               if (obj == null) return;

               // var DataTable = $$(ids.component);
               // if (!DataTable.exists(obj.id))
               //     DataTable.add(obj, 0);
               if (
                  CurrentDatacollection &&
                  CurrentDatacollection.__dataCollection &&
                  !CurrentDatacollection.__dataCollection.exists(obj.id)
               )
                  CurrentDatacollection.__dataCollection.add(obj, 0);
            });
      }
      */
   }
   return new UI_Work_Object_Workspace_View_Kanban();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace_workspaceviews.js":
/*!***************************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace_workspaceviews.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_object_workspace_view_grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object_workspace_view_grid */ "./src/rootPages/Designer/ui_work_object_workspace_view_grid.js");
/* harmony import */ var _ui_work_object_workspace_view_kanban__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_object_workspace_view_kanban */ "./src/rootPages/Designer/ui_work_object_workspace_view_kanban.js");
/* harmony import */ var _properties_workspaceViews_ABViewGantt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./properties/workspaceViews/ABViewGantt */ "./src/rootPages/Designer/properties/workspaceViews/ABViewGantt.js");
/* harmony import */ var _properties_workspaceViews_ABViewGrid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./properties/workspaceViews/ABViewGrid */ "./src/rootPages/Designer/properties/workspaceViews/ABViewGrid.js");
/* harmony import */ var _properties_workspaceViews_ABViewKanban__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./properties/workspaceViews/ABViewKanban */ "./src/rootPages/Designer/properties/workspaceViews/ABViewKanban.js");
// ABObjectWorkspaceViewCollection.js
//
// Manages the settings for a collection of views in the AppBuilder Object
// Workspace
//
// Within the workspace, we offer the ability to view the current ABObject in
// different ways: Grid, KanBan, Gantt
//
// We can define multiple views for each method, and each view will allow you
// to customize certain view settings: Hidden Fields, Filters, Sorts, Frozen
// columns, etc...
//
//








/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();

   const Datatable = (0,_ui_work_object_workspace_view_grid__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
   const Kanban = (0,_ui_work_object_workspace_view_kanban__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);

   // Gather a list of the various View Properties
   const ViewGanttProperties = (0,_properties_workspaceViews_ABViewGantt__WEBPACK_IMPORTED_MODULE_3__["default"])(AB);
   const ViewGridProperties = (0,_properties_workspaceViews_ABViewGrid__WEBPACK_IMPORTED_MODULE_4__["default"])(AB);
   const ViewKanbanProperties = (0,_properties_workspaceViews_ABViewKanban__WEBPACK_IMPORTED_MODULE_5__["default"])(AB);

   var hashViewProperties = {};
   hashViewProperties[ViewGanttProperties.type()] = ViewGanttProperties;
   hashViewProperties[ViewGridProperties.type()] = ViewGridProperties;
   hashViewProperties[ViewKanbanProperties.type()] = ViewKanbanProperties;

   var hashViewComponents = {};
   hashViewComponents[ViewGridProperties.type()] = Datatable;
   hashViewComponents[ViewKanbanProperties.type()] = Kanban;

   const defaultAttributes = {
      currentViewID: undefined,
      list: [],
   };

   class ABObjectWorkspaceViewCollection extends UIClass {
      constructor() {
         super("ui_work_object_workspace_workspaceviews");

         this.AB = AB;
         // {ABFactory}

         this._settings = null;
         // {hash} { ABObject.id  : {collection} }
         // The data structure we are using to manage the different
         // Views for each of our ABObjects.
      }

      async init(AB) {
         this.AB = AB;

         Object.keys(hashViewComponents).forEach((k) => {
            hashViewComponents[k].init(AB);
         });

         // load in the stored View data.
         this._settings = (await this.AB.Storage.get("workspaceviews")) || {};
      }

      objectLoad(object) {
         if (this.CurrentObjectID) {
            // save current data:
            this._settings[this.CurrentObjectID] = this.toObj();
         }
         super.objectLoad(object);

         Object.keys(hashViewComponents).forEach((k) => {
            hashViewComponents[k].objectLoad(object);
         });

         this.fromObj(this._settings[this.CurrentObjectID]);
      }

      /**
       * @method fromObj
       * take our persisted data, and properly load it
       * into this object instance.
       * @param {json} data  the persisted data
       */
      fromObj(data) {
         data = data || AB.cloneDeep(defaultAttributes);

         if ((data?.list ?? []).length === 0) {
            // We should always have at least one default grid view. So if this list
            // is empty we can assume we're 'upgrading' from the old single-view workspace...

            var defaultGrid = Datatable.defaultSettings();
            defaultGrid.isDefaultView = true;
            data.list.unshift(defaultGrid);
         }

         this.importViews(data);

         this.currentViewID = data.currentViewID;
         if (!this.currentViewID) {
            this.currentViewID = this.list()[0].id;
         }
      }

      /**
       * @method toObj()
       *
       * properly compile the current state of this ABApplication instance
       * into the values needed for saving to the DB.
       *
       * Most of the instance data is stored in .json field, so be sure to
       * update that from all the current values of our child fields.
       *
       * @return {json}
       */
      toObj() {
         return {
            currentViewID: this.currentViewID,
            list: this._views,
         };
      }

      list(fn = () => true) {
         return this._views.filter(fn);
      }

      importViews(viewSettings) {
         this._views = [];
         viewSettings.list.forEach((view) => {
            this.viewAdd(view, false);
         });
      }

      // exportViews() {
      //    var views = [];
      //    this._views.forEach((view) => {
      //       views.push(view.toObj());
      //    });

      //    return views;
      // }

      getCurrentView() {
         return this._views.find((v) => v.id == this.currentViewID);
      }

      setCurrentView(viewID) {
         this.currentViewID = viewID;
         this._currentView = this.getCurrentView();
      }

      async viewAdd(view, save = true) {
         // var newView = new hashViewProperties[view.type](view, this);
         this._views.push(view);
         if (save) {
            await this.save();
         }
         return view;
      }

      async viewNew(data) {
         var ViewType = hashViewComponents[data.type];
         if (!ViewType) return;

         var newView = ViewType.viewNew(data);
         await this.viewAdd(newView);
         return newView;
      }

      viewRemove(view) {
         var indexToRemove = this._views.indexOf(view);
         this._views.splice(indexToRemove, 1);
         if (view.id === this.currentViewID) {
            this.currentViewID = this._views[0].id;
         }
         this.save();
      }

      /**
       * @method save()
       * Persist our settings to local storage.
       * @return {Promise}
       */
      async save() {
         this._settings[this.CurrentObjectID] = this.toObj();
         await this.AB.Storage.set("workspaceviews", this._settings);
      }

      /**
       * @method viewUpdate()
       * replace an existing view definition with the newly provided one.
       * NOTE: our view.component might be changed as well, so we regenerate
       * that.
       * @param {obj} view
       *        The key=>value hash of the updated WorkspaceView.
       * @return {Promise}
       */
      async viewUpdate(data) {
         // generate a new view from the provided data;
         var ViewType = hashViewComponents[data.type];
         if (!ViewType) return;

         // remove the .component so it gets regenerated:
         delete data.component;

         var view = ViewType.viewNew(data);

         // NOTE: [].splice() isn't a good candidate to use here as
         // view is a newly created object each time.
         var _newViews = [];
         this._views.forEach((v) => {
            if (v.id != view.id) {
               _newViews.push(v);
               return;
            }
            _newViews.push(view);
         });
         this._views = _newViews;

         await this.save();
      }

      ///
      /// CurrentView Operations
      ///
      get filterConditions() {
         return this._currentView.filterConditions;
      }

      set filterConditions(cond) {
         this._currentView.filterConditions = cond;
      }

      get frozenColumnID() {
         return this._currentView.frozenColumnID;
      }

      set frozenColumnID(id) {
         this._currentView.frozenColumnID = id;
      }

      get hiddenFields() {
         return this._currentView.hiddenFields || [];
      }

      set hiddenFields(fields) {
         this._currentView.hiddenFields = fields;
      }

      get sortFields() {
         return this._currentView.sortFields;
      }

      set sortFields(fields = []) {
         this._currentView.sortFields = fields;
      }
   }
   return new ABObjectWorkspaceViewCollection();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_process.js":
/*!***************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_process.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_process_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_process_list */ "./src/rootPages/Designer/ui_work_process_list.js");
/* harmony import */ var _ui_work_process_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_process_workspace */ "./src/rootPages/Designer/ui_work_process_workspace.js");
/*
 * ui_work_process
 *
 * Display the Process Tab UI:
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   class UI_Work_Process extends UIClass {
      constructor() {
         super("ui_work_process");

         this.CurrentProcessID = null;
         // {string} uuid
         // The current ABProcess.id we are working with.

         this.ProcessList = (0,_ui_work_process_list__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
         this.ProcessWorkspace = (0,_ui_work_process_workspace__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            margin: 10,
            cols: [
               this.ProcessList.ui(),
               { view: "resizer", css: "bg_gray", width: 11 },
               this.ProcessWorkspace.ui(),
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
         // the ProcessWorkspace can show an [add] button if there is
         // no Process selected. When that Add button is pressed,
         // trigger our addNew process on our ProcessList
         this.ProcessWorkspace.on("addNew", () => {
            this.ProcessList.clickNewProcess(true);
         });

         this.ProcessList.on("selected", this.select);

         this.ProcessList.on("deleted", (process) => {
            if (this.CurrentProcessID == process.id) {
               this.select(null);
            }
         });

         return Promise.all([
            this.ProcessWorkspace.init(AB),
            this.ProcessList.init(AB),
         ]);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         var app = this.CurrentApplication;
         if (app && (!app.loadedProcesss || this.ProcessList?.count() < 1)) {
            this.ProcessList?.busy();
            this.ProcessList?.applicationLoad(app);
            this.ProcessList?.ready();
         }
      }

      select(process) {
         this.CurrentProcessID = process.id;

         if (process == null) this.ProcessWorkspace?.clearWorkspace();
         else this.ProcessWorkspace?.populateWorkspace(process);
      }
   }

   return new UI_Work_Process();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_process_list.js":
/*!********************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_process_list.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_common_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_common_list */ "./src/rootPages/Designer/ui_common_list.js");
/* harmony import */ var _ui_work_process_list_newProcess__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_process_list_newProcess */ "./src/rootPages/Designer/ui_work_process_list_newProcess.js");
/*
 * ui_work_process_list
 *
 * Manage the Process List
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();

   class UI_Work_Process_List extends UIClass {
      constructor() {
         super("ui_work_process_list");

         // {ui_common_list} instance to display a list of our objects.
         this.ListComponent = (0,_ui_common_list__WEBPACK_IMPORTED_MODULE_1__["default"])(AB, {
            idBase: this.ids.component,
            labels: {
               addNew: "Add new process",
               confirmDeleteTitle: "Delete Process",
               title: "Processes",
               searchPlaceholder: "Process name",
            },
            // we can overrid the default template like this:
            templateListItem:
               "<div class='ab-object-list-item'>#label#{common.iconGear}</div>",
            menu: {
               copy: false,
               exclude: true,
            },
         });

         // the popup form for adding a new process
         this.AddForm = (0,_ui_work_process_list_newProcess__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
      }

      // Our webix UI definition:
      ui() {
         return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB) {
         this.AB = AB;

         this.on("addNew", (selectNew) => {
            // if we receive a signal to add a new Object from another source
            // like the blank object workspace offering an Add New button:
            this.clickNewProcess(selectNew);
         });

         //
         // List of Processes
         //
         await this.ListComponent.init(AB);

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item);
         });

         this.ListComponent.on("addNew", (selectNew) => {
            this.clickNewProcess(selectNew);
         });

         this.ListComponent.on("deleted", (item) => {
            this.emit("deleted", item);
         });

         this.ListComponent.on("exclude", (item) => {
            this.exclude(item);
         });

         this.ListComponent.on("copied", (data) => {
            this.copy(data);
         });

         //
         // Add Form
         //
         await this.AddForm.init(AB);

         this.AddForm.on("cancel", () => {
            this.AddForm.hide();
         });

         this.AddForm.on("save", (process /*, select */) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(process.id);
            // }
         });
      }

      /**
       * @function applicationLoad
       * Initialize the List from the provided ABApplication
       * If no ABApplication is provided, then show an empty form. (create operation)
       * @param {ABApplication} application
       *        [optional] The current ABApplication we are working with.
       */
      applicationLoad(application) {
         super.applicationLoad(application);
         this.ListComponent.dataLoad(application?.processes());
         this.AddForm.applicationLoad(application);
      }

      /**
       * @function clickNewProcess
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewProcess(/* selectNew */) {
         // show the new popup
         this.AddForm.show();
      }

      /**
       * @function copy
       * the list component notified us of a copy action and has
       * given us the new data for the copied item.
       *
       * now our job is to create a new instance of that Item and
       * tell the list to display it
       */
      copy(data) {
         this.ListComponent.busy();

         this.CurrentApplication.processCreate(data.item).then((newProcess) => {
            this.ListComponent.ready();
            this.ListComponent.dataLoad(this.CurrentApplication.processes());
            this.ListComponent.select(newProcess.id);
         });
      }

      /**
       * @function exclude
       * the list component notified us of an exclude action and which
       * item was chosen.
       *
       * perform the removal and update the UI.
       */
      async exclude(process) {
         this.ListComponent.busy();
         await this.CurrentApplication.processRemove(process);
         this.ListComponent.dataLoad(this.CurrentApplication.processes());

         // this will clear the object workspace
         this.emit("selected", null);
      }

      busy() {
         this.ListComponent.busy();
      }

      ready() {
         this.ListComponent.ready();
      }
   }
   return new UI_Work_Process_List();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_process_list_newProcess.js":
/*!*******************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_process_list_newProcess.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_process_list_newProcess
 *
 * Display the form for creating a new Application.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Process_List_NewProcess extends UIClass {
      constructor() {
         super("ui_work_process_list_newProcess", {
            form: "",
            buttonCancel: "",
            buttonSave: "",
         });

         // {bool} do we select a new data collection after it is created.
         this.selectNew = true;
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            position: "center",
            modal: true,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Add new Process"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.emit("cancel");
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateObjectName
               },
               elements: [
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Enter process name"),
                     labelWidth: 70,
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.emit("cancel");
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Save"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         this.$component = $$(this.ids.component);
         this.$form = $$(this.ids.form);
         this.$buttonSave = $$(this.ids.buttonSave);
         webix.extend(this.$component, webix.ProgressBar);

         this.hide();
      }

      /**
       * @method save
       * take the data gathered by our child creation tabs, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @return {Promise}
       */
      async save(values) {
         // must have an application set.
         if (!this.CurrentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this.emit("save.error", true);
            return false;
         }

         this.busy();

         try {
            // create a new process:
            let newProcess = await this.CurrentApplication.processCreate(
               values
            );
            this.emit("save", newProcess);
            this.clear();
            this.hide();
         } catch (err) {
            console.error(err);
            this.emit("save.error", err);
            return false;
         }

         this.ready();
         return true;
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if (this.$component) this.$component.show();
      }

      /**
       * @function hide()
       *
       * remove the busy indicator from the form.
       */
      hide() {
         if (this.$component) this.$component.hide();
      }

      /**
       * @function clear()
       *
       */
      clear() {
         this.$form.clearValidation();
         this.$form.clear();
         this.$buttonSave.enable();
      }

      /**
       * Show the busy indicator
       */
      busy() {
         if (this.$component && this.$component.showProgress) {
            this.$component.showProgress({ type: "icon" });
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         if (this.$component && this.$component.hideProgress) {
            this.$component.hideProgress();
         }
      }
   }

   return new UI_Work_Process_List_NewProcess();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_process_workspace.js":
/*!*************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_process_workspace.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();
   class UI_Work_Process_Workspace extends UIClass {
      constructor() {
         super();
      }

      ui() {
         return {};
      }

      async init(AB) {
         this.AB = AB;
      }

      populateWorkspace() {}
   }

   return new UI_Work_Process_Workspace();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_query.js":
/*!*************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_query.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_query_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_query_list */ "./src/rootPages/Designer/ui_work_query_list.js");
/* harmony import */ var _ui_work_query_workspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_query_workspace */ "./src/rootPages/Designer/ui_work_query_workspace.js");
/*
 * ui_work_query
 *
 * Display the Query Tab UI:
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();
   class UI_Work_Query extends UIClass {
      constructor() {
         super("ab_work_query");

         this.QueryList = (0,_ui_work_query_list__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
         this.QueryWorkspace = (0,_ui_work_query_workspace__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            cols: [
               this.QueryList.ui(),
               { view: "resizer" },
               this.QueryWorkspace.ui(),
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
         this.QueryList.on("selected", this.select);

         return Promise.all([
            this.QueryWorkspace.init(AB),
            this.QueryList.init(AB),
         ]);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Query Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         this.QueryWorkspace.clearWorkspace();
         this.QueryList.applicationLoad(application);
         this.QueryWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         var app = this.CurrentApplication;
         if (app) {
            this.QueryList?.applicationLoad(app);
         }
         this.QueryList?.ready();
      }

      select(q) {
         this.QueryWorkspace.resetTabs();
         this.QueryWorkspace.populateQueryWorkspace(q);
      }
   }

   return new UI_Work_Query();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_query_list.js":
/*!******************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_query_list.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_common_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_common_list */ "./src/rootPages/Designer/ui_common_list.js");
/* harmony import */ var _ui_work_query_list_newQuery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_query_list_newQuery */ "./src/rootPages/Designer/ui_work_query_list_newQuery.js");
/*
 * ui_work_query_list
 *
 * Manage the ABObjectQuery List
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();
   class UI_Work_Query_List extends UIClass {
      constructor() {
         super("ui_work_query_list");

         // {ui_common_list} instance to display a list of our objects.
         this.ListComponent = (0,_ui_common_list__WEBPACK_IMPORTED_MODULE_1__["default"])(AB, {
            idBase: this.ids.component,
            labels: {
               addNew: "Add new query",
               confirmDeleteTitle: "Delete Query",
               title: "Queries",
               searchPlaceholder: "Query name",
            },
            // we can overrid the default template like this:
            // templateListItem:
            //    "<div class='ab-object-list-item'>#label##warnings#{common.iconGear}</div>",
            menu: {
               copy: false,
               exclude: true,
            },
         });
         this.AddForm = (0,_ui_work_query_list_newQuery__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);

         this._handler_refreshApp = (def) => {
            if (!this.CurrentApplication) return;
            if (this.CurrentApplication.refreshInstance){
              // TODO: Johnny refactor this
              this.CurrentApplication = this.CurrentApplication.refreshInstance();
            }
            this.applicationLoad(this.CurrentApplication);
         };
      }

      // Our webix UI definition:
      ui() {
         return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB) {
         this.AB = AB;

         this.on("addNew", (selectNew) => {
            // if we receive a signal to add a new Query from another source
            this.clickNewQuery(selectNew);
         });

         //
         // List of Processes
         //
         var allInits = [];
         allInits.push(this.ListComponent.init(AB));

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item);
         });

         this.ListComponent.on("addNew", (selectNew) => {
            this.clickNewQuery(selectNew);
         });

         this.ListComponent.on("deleted", (item) => {
            this.emit("deleted", item);
         });

         this.ListComponent.on("exclude", (item) => {
            this.exclude(item);
         });

         //
         // Add Form
         //
         allInits.push(this.AddForm.init(AB));

         this.AddForm.on("cancel", () => {
            this.AddForm.hide();
         });

         this.AddForm.on("save", (q /*, select */) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(q.id);
            // }
         });

         await Promise.all(allInits);
      }

      /**
       * @function applicationLoad
       * Initialize the List from the provided ABApplication
       * If no ABApplication is provided, then show an empty form. (create operation)
       * @param {ABApplication} application
       *        [optional] The current ABApplication we are working with.
       */
      applicationLoad(application) {
         super.applicationLoad(application);
         this.ListComponent.dataLoad(application?.queriesIncluded());
         this.AddForm.applicationLoad(application);
      }

      /**
       * @function clickNewQuery
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewQuery(/* selectNew */) {
         // show the new popup
         this.AddForm.show();
      }

      /*
       * @function exclude
       * the list component notified us of an exclude action and which
       * item was chosen.
       *
       * perform the removal and update the UI.
       */
      async exclude(item) {
         this.ListComponent.busy();
         var app = this.CurrentApplication;
         await app.queryRemove(item);
         this.ListComponent.dataLoad(app.queriesIncluded());

         // this will clear the  workspace
         this.emit("selected", null);
      }

      ready() {
         this.ListComponent.ready();
      }
   }

   return new UI_Work_Query_List();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_query_list_newQuery.js":
/*!***************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_query_list_newQuery.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/* harmony import */ var _ui_work_query_list_newQuery_blank__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_query_list_newQuery_blank */ "./src/rootPages/Designer/ui_work_query_list_newQuery_blank.js");
/* harmony import */ var _ui_work_query_list_newQuery_import__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_query_list_newQuery_import */ "./src/rootPages/Designer/ui_work_query_list_newQuery_import.js");
/*
 * ui_work_query_list_newQuery
 *
 * Display the form for creating a new Query.  This Popup will manage several
 * different sub components for gathering Query data for saving.
 *
 * The sub components will gather the data for the query and do basic form
 * validations on their interface.
 *
 * when ready, the sub component will emit "save" with the values gathered by
 * the form.  This component will manage the actual final query validation,
 * and saving to this application.
 *
 * On success, "save.success" will be emitted on the sub-component, and this
 * component.
 *
 * On Error, "save.error" will be emitted on the sub-component.
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Query_List_NewQuery extends UIClass {
      constructor() {
         super("ui_work_query_list_newQuery", {
            tab: "",
         });

         this.selectNew = true;
         // {bool} do we select a new query after it is created.

         // var callback = null;

         this.BlankTab = (0,_ui_work_query_list_newQuery_blank__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
         this.ImportTab = (0,_ui_work_query_list_newQuery_import__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            position: "center",
            modal: true,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Add new query"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.emit("cancel");
                     },
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            selectNewQuery: true,
            body: {
               view: "tabview",
               id: this.ids.tab,
               cells: [this.BlankTab.ui(), this.ImportTab.ui()],
               tabbar: {
                  on: {
                     onAfterTabClick: (id) => {
                        this.switchTab(id);
                     },
                     onAfterRender() {
                        this.$view
                           .querySelectorAll(".webix_item_tab")
                           .forEach((t) => {
                              var tid = t.getAttribute("button_id");
                              AB.ClassUI.CYPRESS_REF(t, `${tid}_tab`);
                           });
                     },
                  },
               },
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$component = $$(this.ids.component);

         let allInits = [];
         ["BlankTab", "ImportTab"].forEach((k) => {
            allInits.push(this[k].init(AB));
            this[k].on("cancel", () => {
               this.emit("cancel");
            });
            this[k].on("save", (values) => {
               if (values.id) {
                  return this.import(values, k);
               }
               this.save(values, k);
            });
         });

         return Promise.all(allInits);
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {object} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj, this.selectNew);
         // _logic.callbacks.onDone(null, obj, selectNew, callback); // tell parent component we're done
      }

      /**
       * @method import()
       * take an existing query and add it to our ABApplication.
       * @param {ABObjectQuery} query
       * @param {string} tabKey
       *        which of our tabs triggered this method?
       */
      async import(query, tabKey) {
         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            await this.CurrentApplication.queryInsert(query);
            this[tabKey].emit("save.successful", query);
            this.done(query);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the CurrentApplication.
            // NOTE: It has error "queryRemove" is not a function
            // await this.CurrentApplication.queryRemove(newQuery);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * @method save
       * take the data gathered by our child creation tabs, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @param {string}  tabKey
       *        the "key" of the tab initiating the save.
       * @return {Promise}
       */
      async save(values, tabKey) {
         // must have an application set.
         if (!this.CurrentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this[tabKey].emit("save.error", true);
            return false;
         }

         // create a new (unsaved) instance of our object:
         let newQuery = this.AB.queryNew(values);

         // have newObject validate it's values.
         let validator = newQuery.isValid();
         if (validator.fail()) {
            this[tabKey].emit("save.error", validator);
            // cb(validator); // tell current Tab component the errors
            return false; // stop here.
         }

         if (!newQuery.createdInAppID) {
            newQuery.createdInAppID = this.CurrentApplicationID;
         }

         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            let query = await newQuery.save();
            await this.CurrentApplication.queryInsert(query);
            this[tabKey].emit("save.successful", query);
            this.done(query);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the CurrentApplication.
            // NOTE: It has error "queryRemove" is not a function
            // await this.CurrentApplication.queryRemove(newQuery);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show(shouldSelectNew) {
         if (shouldSelectNew != null) {
            this.selectNew = shouldSelectNew;
         }
         if (this.$component) this.$component.show();

         const id = $$(this.ids.tab).getValue();
         this.switchTab(id);
      }

      /**
       * @function hide()
       *
       * remove the busy indicator from the form.
       */
      hide() {
         if (this.$component) this.$component.hide();
      }

      /**
       * Show the busy indicator
       */
      busy() {
         if (this.$component) {
            this.$component.showProgress();
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         if (this.$component) {
            this.$component.hideProgress();
         }
      }

      switchTab(tabId) {
         if (tabId == this.BlankTab?.ui()?.body?.id || !tabId) {
            this.BlankTab?.onShow?.(this.CurrentApplication);
         } else if (tabId == this.ImportTab?.ui()?.body?.id) {
            this.ImportTab?.onShow?.(this.CurrentApplication);
         }
      }
   }

   return new UI_Work_Query_List_NewQuery();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_query_list_newQuery_blank.js":
/*!*********************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_query_list_newQuery_blank.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_query_list_newQuery_blank
 *
 * Display the form for creating a new ABQuery.
 */


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Query_List_NewQuery_Blank extends UIClass {
      constructor() {
         super("ui_work_query_list_newQuery_blank", {
            form: "",
            buttonSave: "",
            buttonCancel: "",
            object: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Create"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateQueryName
               },
               elements: [
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Query name"),
                     labelWidth: 70,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(
                              this,
                              "ui_work_query_list_newQuery_blank_name"
                           );
                        },
                     },
                  },
                  {
                     id: this.ids.object,
                     view: "richselect",
                     label: L("Object"),
                     name: "object",
                     required: true,
                     placeholder: L("Select an object"),
                     labelWidth: 70,
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(
                              this,
                              "ui_work_query_list_newQuery_blank_object"
                           );
                        },
                     },
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.cancel();
                           },
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Add Query"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         this.$buttonSave = $$(this.ids.buttonSave);
         this.$objectList = $$(this.ids.object);

         // "save.error" is triggered by the ui_work_query_list_newQuery
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_query_list_newQuery
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         if (this.$form) {
            this.$form.clearValidation();
            this.$form.clear();
         }
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_query_list_newQuery query had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of queries:
       *        - A javascript Error() query
       *        - An ABValidation query returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            var message = L("the entered data is invalid");
            // if this was our Validation() query:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Query: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         this.$buttonSave.enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_query_list_newQuery successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         this.$buttonSave.enable();
      }

      /**
       * @function save
       *
       * verify the current info is ok, package it, and return it to be
       * added to the application.createModel() method.
       */
      save() {
         this.$buttonSave.disable();

         var Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            this.$buttonSave.enable();
            return false;
         }

         let formVals = Form.getValues();
         let values = {
            name: formVals.name,
            label: formVals.name,
            joins: {
               alias: "BASE_OBJECT",
               objectID: formVals.object,
               links: [],
            },
         };

         this.emit("save", values);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if ($$(this.ids.component)) $$(this.ids.component).show();
      }

      onShow(currentApplication) {
         // populate object list
         if (this.$objectList && currentApplication) {
            let objectOpts = currentApplication.objectsIncluded().map((obj) => {
               return {
                  id: obj.id,
                  value: obj.label,
               };
            });

            this.$objectList.define("options", objectOpts);
            this.$objectList.refresh();

            // Set width of item list
            let $suggestView = this.$objectList.getPopup();
            $suggestView.attachEvent("onShow", () => {
               $suggestView.define("width", 300);
               $suggestView.resize();
            });
         }

         // clear form
         if (this.$form) {
            this.$form.setValues({
               name: "",
               object: "",
            });
         }
      }
   }

   return new UI_Work_Query_List_NewQuery_Blank();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_query_list_newQuery_import.js":
/*!**********************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_query_list_newQuery_import.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");
/*
 * ui_work_query_list_newQuery_import
 *
 * Display the form for importing an existing query into the application.
 *
 */


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var L = UIClass.L();

   class UI_Work_Query_List_NewQuery_Import extends UIClass {
      constructor() {
         super("ui_work_query_list_newQuery_import", {
            form: "",
            filter: "",
            queryList: "",
            buttonSave: "",
            buttonCancel: "",
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Existing"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               elements: [
                  // Filter
                  {
                     cols: [
                        {
                           view: "icon",
                           icon: "fa fa-filter",
                           align: "left",
                        },
                        {
                           view: "text",
                           id: this.ids.filter,
                           on: {
                              onTimedKeyPress: () => this.filter(),
                           },
                        },
                     ],
                  },

                  // Model list
                  {
                     view: "list",
                     id: this.ids.queryList,
                     select: true,
                     height: 200,
                     minHeight: 250,
                     maxHeight: 250,
                     data: [],
                     template: "<div>#label#</div>",
                  },

                  // Import & Cancel buttons
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => this.cancel(),
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Import"),
                           autowidth: true,
                           type: "form",
                           click: () => this.save(),
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);
         this.$filter = $$(this.ids.filter);
         this.$queryList = $$(this.ids.queryList);
         this.$buttonSave = $$(this.ids.buttonSave);
         this.$buttonCancel = $$(this.ids.buttonCancel);

         // "save.error" is triggered by the ui_work_query_list_newQuery
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_query_list_newQuery
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      onShow(app) {
         this.formClear();

         // now all objects are *global* but an application might only
         // reference a sub set of them.  Here we just need to show
         // the objects our current application isn't referencing:

         const availableQueries = app.queriesExcluded();
         this.$queryList.parse(availableQueries, "json");
      }

      filter() {
         let filterText = this.$filter.getValue();
         this.$queryList.filter("#label#", filterText);
      }

      save() {
         let selectedQuery = this.$queryList.getSelectedItem();
         if (!selectedQuery) return false;

         this.$buttonSave.disable();

         this.emit("save", selectedQuery);
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         // Filter section
         if (this.$form) {
            this.$form.clearValidation();
            this.$form.clear();
         }
         // Lists
         if (this.$queryList) {
            this.$queryList.clearAll();
         }
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_object_list_newObject object had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of objects:
       *        - A javascript Error() object
       *        - An ABValidation object returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            let message = L("the entered data is invalid");
            // if this was our Validation() object:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            let values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Query: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         this.$buttonSave.enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_object_list_newObject successfully saved the values.
       */
      onSuccess() {
         this.$buttonSave.enable();
      }
   }

   return new UI_Work_Query_List_NewQuery_Import();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_query_workspace.js":
/*!***********************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_query_workspace.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_class */ "./src/rootPages/Designer/ui_class.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB, init_settings) {
   const UIClass = (0,_ui_class__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var L = UIClass.L();
   class UI_Work_Query_Workspace extends UIClass {
      constructor(settings = init_settings || {}) {
         super();

         this.settings = settings;
      }

      ui() {
         return {};
      }

      init() {
         // TODO
      }

      // applicationLoad(app) {
      //    super.applicationLoad(app);
      //    // TODO
      // }

      clearWorkspace() {
         // TODO
      }

      resetTabs() {
         // TODO
      }

      populateQueryWorkspace() {
         // TODO
      }
   }

   return new UI_Work_Query_Workspace();
}


/***/ }),

/***/ "./src/utils/CSVImporter.js":
/*!**********************************!*\
  !*** ./src/utils/CSVImporter.js ***!
  \**********************************/
/***/ ((module) => {

module.exports = class CSVImporter {
   constructor(AB, fileReader = FileReader) {
      this._AB = AB;
      this._FileReader = fileReader;
   }

   L(...params) {
      return this._AB.Multilingual.labelPlugin("ABDesigner", ...params);
   }

   getSeparateItems() {
      return [
         { id: ",", value: this.L("Comma (,)") },
         {
            id: "\t",
            value: this.L("Tab (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)"),
         },
         { id: ";", value: this.L("Semicolon (;)") },
         { id: "s", value: this.L("Space ( )") },
      ];
   }

   /**
    * @method validateFile
    * Validate file extension
    *
    * @param {*} fileInfo - https://docs.webix.com/api__ui.uploader_onbeforefileadd_event.html
    *
    * @return {boolean}
    */
   validateFile(fileInfo) {
      if (!fileInfo || !fileInfo.file || !fileInfo.file.type) return false;

      // validate file type
      let extensionType = fileInfo.file.type.toLowerCase();
      if (
         extensionType == "text/csv" ||
         extensionType == "application/vnd.ms-excel"
      ) {
         return true;
      } else {
         return false;
      }
   }

   /**
    * @method getDataRows
    * Pull data rows from the CSV file
    *
    * @param {Object} fileInfo - https://docs.webix.com/api__ui.uploader_onbeforefileadd_event.html
    * @param {string} separatedBy
    *
    * @return {Promise} -[
    * 						["Value 1.1", "Value 1.2", "Value 1.3"],
    * 						["Value 2.1", "Value 2.2", "Value 2.3"],
    * 					]
    */
   async getDataRows(fileInfo, separatedBy) {
      if (!this.validateFile(fileInfo))
         return Promise.reject(this.L(".fileInfo parameter is invalid"));

      return new Promise((resolve, reject) => {
         // read CSV file
         let reader = new this._FileReader();
         reader.onload = (e) => {
            const result = this.convertToArray(reader.result, separatedBy);

            resolve(result);
         };
         reader.readAsText(fileInfo.file);
      });
   }

   /**
    * @method convertToArray
    * Pull data rows from the CSV file
    *
    * @param {string} text
    * @param {string} separatedBy
    *
    * @return {Promise} -[
    * 						["Value 1.1", "Value 1.2", "Value 1.3"],
    * 						["Value 2.1", "Value 2.2", "Value 2.3"],
    * 					]
    */
   convertToArray(text = "", separatedBy = ",") {
      let result = [];

      // split lines
      let dataRows = text
         .split(/\r\n|\n|\r/) // CRLF = \r\n; LF = \n; CR = \r;
         .filter((row) => row && row.length > 0);

      // split columns
      (dataRows || []).forEach((row) => {
         let dataCols = [];
         if (separatedBy == ",") {
            // NOTE: if the file contains ,, .match(), then can not recognize this empty string
            row = row.replace(/,,/g, ", ,");

            // https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript#answer-11457952
            dataCols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
         } else {
            dataCols = row.split(separatedBy);
         }

         result.push(dataCols.map((dCol) => this.reformat(dCol)));
      });

      return result;
   }

   /**
    * @method getGuessDataType
    *
    * @param dataRows {Array} - [
    * 								["Value 1.1", "Value 1.2", "Value 1.3"],
    * 								["Value 2.1", "Value 2.2", "Value 2.3"],
    * 							]
    * @param colIndex {Number}
    *
    * @return {string}
    */
   getGuessDataType(dataRows, colIndex) {
      var data,
         repeatNum = 10;

      // Loop to find a value
      for (var i = 1; i <= repeatNum; i++) {
         var line = dataRows[i];
         if (!line) break;

         data = line[colIndex];

         if (data != null && data.length > 0) break;
      }

      if (data === null || data === undefined || data === "") {
         return "string";
      } else if (
         data == 0 ||
         data == 1 ||
         data == true ||
         data == false ||
         data == "checked" ||
         data == "unchecked"
      ) {
         return "boolean";
      } else if (!isNaN(data)) {
         return "number";
      } else if (Date.parse(data)) {
         return "date";
      } else {
         if (data.length > 100) return "LongText";
         else return "string";
      }
   }

   /**
    * @method reformat
    *
    * @param {string} str
    */
   reformat(str) {
      if (!str) return "";

      return str.trim().replace(/"/g, "").replace(/'/g, "");
   }
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_definitions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/definitions.js */ "./src/definitions.js");
/* harmony import */ var _src_definitions_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_definitions_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_application_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/application.js */ "./src/application.js");
/* harmony import */ var _src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/labels/labels.js */ "./src/labels/labels.js");
/* harmony import */ var _src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2__);




if (window.__ABBS) {
   window.__ABBS.addPlugin({
      version: "0.0.0",
      key: "ABDesigner",
      apply: function (AB) {
         // At this point, the Plugin should already have loaded all it's definitions
         // into the AB Factory
         AB.pluginLoad((0,_src_application_js__WEBPACK_IMPORTED_MODULE_1__["default"])(AB));

         // var labels = Labels.en; /* default */;
         // var lang =AB.Multilingual.currentLanguage();

         // if (Labels[lang]) {
         //    labels = Labels[lang];
         // }
         // AB.pluginLabelLoad("ABDesigner", labels);
      },
      definitions: function () {
         return (_src_definitions_js__WEBPACK_IMPORTED_MODULE_0___default());
      },
      labels: function (lang) {
         return (_src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2___default())[lang] || (_src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2___default().en);
      },
   });
}

})();

/******/ })()
;
//# sourceMappingURL=ABDesigner.js.map