/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./AppBuilder/core/ABMLClassCore.js":
/*!******************************************!*\
  !*** ./AppBuilder/core/ABMLClassCore.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * ABMLClassCore
 * manage the multilingual information of an instance of a AB Defined Class.
 *
 * these classes have certain fields ("label", "description"), that can be
 * represented in different language options as defined by our platform.
 *
 * This core ABMLClass will internally track the multilingual fields
 * (this.mlFields) and auto
 */
var ABDefinition = __webpack_require__(/*! ../platform/ABDefinition */ "./AppBuilder/platform/ABDefinition.js");
var ABEmitter = __webpack_require__(/*! ../platform/ABEmitter */ "./AppBuilder/platform/ABEmitter.js");
module.exports = class ABMLClassCore extends ABEmitter {
   constructor(fieldList) {
      super();
      this.mlFields = fieldList || ["label"];
   }

   ///
   /// Static Methods
   ///
   /// Available to the Class level object.  These methods are not dependent
   /// on the instance values of the Application.
   ///

   /**
    * @method fromValues
    * called during the .fromValues() work chain.  Should be called
    * AFTER all the current data is already populated.
    */
   fromValues(attributes) {
      this.translations = attributes.translations;

      // if translations were provided
      if (this.translations) {
         // multilingual fields: label, description
         this.translate();
      } else {
         // maybe this came from a form that has ML values in the attributes, but
         // no .translations[] yet:
         // check for mlFields in attributes and record them here:
         (this.mlFields || []).forEach((field) => {
            if (attributes[field]) {
               this[field] = attributes[field];
            }
         });
      }
   }

   /**
    * @method languageDefault
    * return a default language code.
    * @return {string}
    */
   languageDefault() {
      return "en";
   }

   /**
    * @method toObj()
    *
    * called during the .toObj() work chain.  Should be called
    * BEFORE the current data is populated.
    */
   toObj() {
      this.unTranslate();

      return {
         translations: this.translations
      };
   }

   /**
    * @method toDefinition()
    *
    * convert this instance into an ABDefinition object.
    *
    * @return {ABDefinition}
    */
   toDefinition() {
      return new ABDefinition({
         id: this.id,
         name: this.name,
         type: this.type,
         json: this.toObj()
      });
   }

   /**
    * @method translate
    *
    * Given a set of json data, pull out any multilingual translations
    * and flatten those values to the base object.
    *
    * @param {obj} obj  The instance of the object being translated
    * @param {json} json The json data being used for translation.
    *                      There should be json.translations = [ {transEntry}, ...]
    *                      where transEntry = {
    *                          language_code:'en',
    *                          field1:'value',
    *                          ...
    *                      }
    * @param {array} fields an Array of multilingual fields to pull to
    *                       the obj[field] value.
    *
    */
   translate(obj, json, fields, languageCode = null) {
      if (!obj) obj = this;
      if (!json) json = this;
      if (!fields) fields = this.mlFields || [];

      if (!json.translations) {
         json.translations = [];
      }

      if (typeof json.translations == "string") {
         json.translations = JSON.parse(json.translations);
      }

      var currLanguage = languageCode || this.languageDefault();

      if (fields && fields.length > 0) {
         // [fix] if no matching translation is in our json.translations
         //       object, then just use the 1st one.
         var first = null; // the first translation entry encountered
         var found = false; // did we find a matching translation?

         json.translations.forEach(function(t) {
            if (!first) first = t;

            // find the translation for the current language code
            if (t.language_code == currLanguage) {
               found = true;

               // copy each field to the root object
               fields.forEach(function(f) {
                  if (t[f] != null) obj[f] = t[f];

                  obj[f] = t[f] || ""; // default to '' if not found.
               });
            }
         });

         // if !found, then use the 1st entry we did find.  prepend desired
         // [language_code] to each of the fields.
         if (!found && first) {
            // copy each field to the root object
            fields.forEach(function(f) {
               if (first[f] != null && first[f] != "")
                  obj[f] = `[${currLanguage}]${first[f]}`;
               else obj[f] = ""; // default to '' if not found.
            });
         }
      }
   }

   /**
    * @method unTranslate
    *
    * Take the multilingual information in the base obj, and push that
    * down into the json.translations data.
    *
    * @param {obj} obj  The instance of the object with the translation
    * @param {json} json The json data being used for translation.
    *                      There should be json.translations = [ {transEntry}, ...]
    *                      where transEntry = {
    *                          language_code:'en',
    *                          field1:'value',
    *                          ...
    *                      }
    * @param {array} fields an Array of multilingual fields to pull from
    *                       the obj[field] value.
    *
    */
   unTranslate(obj, json, fields) {
      if (!obj) obj = this;
      if (!json) json = this;
      if (!fields) fields = this.mlFields || [];

      if (!json.translations) {
         json.translations = [];
      }

      var currLanguage = this.languageDefault();

      if (fields && fields.length > 0) {
         var foundOne = false;

         json.translations.forEach(function(t) {
            // find the translation for the current language code
            if (t.language_code == currLanguage) {
               // copy each field to the root object
               fields.forEach(function(f) {
                  // verify obj[f] is defined
                  // --> DONT erase the existing translation
                  if (obj[f] != null) {
                     t[f] = obj[f];
                  }
               });

               foundOne = true;
            }
         });

         // if we didn't update an existing translation
         if (!foundOne) {
            // create a translation entry:
            var trans = {};

            // assume current languageCode:
            trans.language_code = currLanguage;

            fields.forEach(function(field) {
               if (obj[field] != null) {
                  trans[field] = obj[field];
               }
            });

            json.translations.push(trans);
         }
      }
   }
};


/***/ }),

/***/ "./AppBuilder/core/dataFields/ABFieldBooleanCore.js":
/*!**********************************************************!*\
  !*** ./AppBuilder/core/dataFields/ABFieldBooleanCore.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * ABFieldBoolean
 *
 * An ABFieldBoolean defines a boolean field type.
 *
 */

var ABField = __webpack_require__(/*! ../../platform/dataFields/ABField */ "./AppBuilder/platform/dataFields/ABField.js");

function L(key, altText) {
   // TODO:
   return altText; // AD.lang.label.getLabel(key) || altText;
}

var ABFieldBooleanDefaults = {
   key: "boolean", // unique key to reference this specific DataField

   icon: "check-square-o", // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'

   // menuName: what gets displayed in the Editor drop list
   menuName: L("ab.dataField.boolean.menuName", "*Checkbox"),

   // description: what gets displayed in the Editor description.
   description: L(
      "ab.dataField.boolean.description",
      "*A single checkbox that can be checked or unchecked."
   ),

   supportRequire: true,

   // what types of Sails ORM attributes can be imported into this data type?
   // http://sailsjs.org/documentation/concepts/models-and-orm/attributes#?attribute-options
   compatibleOrmTypes: ["boolean"],

   // what types of MySql column types can be imported into this data type?
   // https://www.techonthenet.com/mysql/datatypes.php
   compatibleMysqlTypes: ["bool", "boolean"]
};

var defaultValues = {
   default: 0
};

module.exports = class ABFieldBooleanCore extends ABField {
   constructor(values, object) {
      super(values, object, ABFieldBooleanDefaults);
   }

   // return the default values for this DataField
   static defaults() {
      return ABFieldBooleanDefaults;
   }

   static defaultValues() {
      return defaultValues;
   }

   ///
   /// Instance Methods
   ///

   /**
    * @method fromValues()
    *
    * initialze this object with the given set of values.
    * @param {obj} values
    */
   fromValues(values) {
      super.fromValues(values);

      if (this.settings.default != null)
         this.settings.default = parseInt(this.settings.default);
   }

   /**
    * @method defaultValue
    * insert a key=>value pair that represent the default value
    * for this field.
    * @param {obj} values a key=>value hash of the current values.
    */
   defaultValue(values) {
      if (values[this.columnName] == null && this.settings.default != null) {
         values[this.columnName] = this.settings.default;
      }
   }
};


/***/ }),

/***/ "./AppBuilder/core/dataFields/ABFieldCore.js":
/*!***************************************************!*\
  !*** ./AppBuilder/core/dataFields/ABFieldCore.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * ABFieldCore
 *
 * ABFieldBase defines the common ABField structure that is shared between
 * the client and the server.  Mostly how it manages it's internal data, and
 * how it is related to the ABObject classes.
 *
 */
// const ABEmitter = require("../../platform/ABEmitter");
const ABMLClass = __webpack_require__(/*! ../../platform/ABMLClass */ "./AppBuilder/platform/ABMLClass.js");

module.exports = class ABFieldCore extends ABMLClass {
   constructor(values, object, fieldDefaults) {
      super(["label"]);

      // NOTE: setup this first so later we can use .fieldType(), .fieldIcon()
      this.defaults = fieldDefaults || {};

      /*
  		{
  			id:'uuid',					// uuid value for this obj
  			key:'fieldKey',				// unique key for this Field
  			icon:'font',				// fa-[icon] reference for an icon for this Field Type
  			label:'',					// pulled from translation
			columnName:'column_name',	// a valid mysql table.column name
			isImported: 1/0,			// flag to mark is import from other object
			settings: {					// unique settings for the type of field
				showIcon:true/false,	// only useful in Object Workspace DataTable
				isImported: 1/0,		// flag to mark is import from other object
				required: 1/0,			// field allows does not allow NULL or it does allow NULL
				width: {int}			// width of display column

				// specific for dataField
			},
			translations:[]
  		}
  		*/

      this.object = object;

      this.fromValues(values);
   }

   ///
   /// Static Methods
   ///
   /// Available to the Class level object.  These methods are not dependent
   /// on the instance values of the Application.
   ///
   static get reservedNames() {
      return [
         "id",
         "created_at",
         "updated_at",
         "properties",
         "createdAt",
         "updatedAt"
      ];
   }

   static defaultValues() {
      return {};
   }

   // unique key to reference this specific DataField
   fieldKey() {
      return this.defaults.key;
   }

   /**
    * Sails ORM data types that can be imported to this DataField
    * @return {Array}
    */
   fieldOrmTypes() {
      if (this.defaults.compatibleOrmTypes) {
         if (Array.isArray(this.defaults.compatibleOrmTypes)) {
            return this.defaults.compatibleOrmTypes;
         } else {
            return [this.defaults.compatibleOrmTypes];
         }
      } else {
         return [];
      }
   }

   /**
    * Mysql data types that can be imported to this DataField
    * @return {Array}
    */
   fieldMysqlTypes() {
      if (this.defaults.compatibleMysqlTypes) {
         if (Array.isArray(this.defaults.compatibleMysqlTypes)) {
            return this.defaults.compatibleMysqlTypes;
         } else {
            return [this.defaults.compatibleMysqlTypes];
         }
      } else {
         return [];
      }
   }

   // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'
   fieldIcon() {
      return this.defaults.icon;
   }

   // the multilingual text for the name of this data field.
   fieldMenuName() {
      return this.defaults.menuName;
   }

   // the multilingual text for the name of this data field.
   fieldDescription() {
      return this.defaults.description;
   }

   // the flag to set when checking if field should be filterable
   fieldIsFilterable() {
      if (this.defaults.isFilterable != null) {
         if (typeof this.defaults.isFilterable === "function") {
            return this.defaults.isFilterable(this);
         } else {
            return this.defaults.isFilterable;
         }
      }

      return 1;
   }

   // the flag to set when checking if field should be sortable
   fieldIsSortable() {
      if (this.defaults.isSortable != null) {
         if (typeof this.defaults.isSortable === "function") {
            return this.defaults.isSortable(this);
         } else {
            return this.defaults.isSortable;
         }
      }

      return 1;
   }

   // the flag to set when checking if the field should be used as a label
   fieldUseAsLabel() {
      if (this.defaults.useAsLabel != null) {
         if (typeof this.defaults.useAsLabel === "function") {
            return this.defaults.useAsLabel(this);
         } else {
            return this.defaults.useAsLabel;
         }
      }

      return 1;
   }

   fieldSupportRequire() {
      if (this.defaults.supportRequire) return this.defaults.supportRequire;
      // default
      else return true;
   }

   fieldSupportQuery() {
      if (this.defaults.supportQuery != null) {
         if (typeof this.defaults.supportQuery === "function") {
            return this.defaults.supportQuery(this);
         } else {
            return this.defaults.supportQuery;
         }
      }

      return true;
   }

   ///
   /// Instance Methods
   ///

   /// ABApplication data methods

   /**
    * @method toObj()
    *
    * properly compile the current state of this ABField instance
    * into the values needed for saving to the DB.
    *
    * @return {json}
    */
   toObj() {
      var obj = super.toObj();

      return {
         id: this.id,
         type: this.type || "field",
         key: this.key,
         icon: this.icon,
         isImported: this.isImported,
         columnName: this.columnName,
         settings: this.settings,
         translations: obj.translations
      };
   }

   defaultCheck(val, defaultVal) {
      var returnVal = defaultVal;
      if (typeof val != "undefined") {
         returnVal = val;
      }
      return returnVal;
   }

   /**
    * @method fromValues()
    *
    * initialze this object with the given set of values.
    * @param {obj} values
    */
   fromValues(values) {
      if (!this.id) this.id = values.id; // NOTE: only exists after .save()
      this.type == values.type || "field";
      this.key = values.key || this.fieldKey();
      this.icon = values.icon || this.fieldIcon();

      // if this is being instantiated on a read from the Property UI,
      // .label is coming in under .settings.label
      this.label = values.label || values.settings.label || "?label?";

      this.columnName = values.columnName || "";

      this.isImported = values.isImported || 0;

      values.settings = values.settings || {};
      this.settings = values.settings;
      this.settings.showIcon = this.defaultCheck(values.settings.showIcon, "1");
      this.settings.required = this.defaultCheck(values.settings.required, "0");
      this.settings.width = this.defaultCheck(values.settings.width, "0");

      // convert from "0" => 0
      this.isImported = parseInt(this.isImported);
      this.settings.showIcon = parseInt(this.settings.showIcon);
      this.settings.required = parseInt(this.settings.required);
      this.settings.unique = parseInt(this.settings.unique || 0);
      this.settings.width = parseInt(this.settings.width);

      // we're responsible for setting up our specific settings:
      let defaultValues = this.constructor.defaultValues() || {};
      for (let dv in defaultValues) {
         this.settings[dv] = this.defaultCheck(
            values.settings[dv],
            defaultValues[dv]
         );
      }

      // let the MLClass now process the Translations
      super.fromValues(values);

      // final validity check: columnName really should have a value:
      this.columnName = this.columnName || this.label;

      // knex does not like .(dot) in table and column names
      // https://github.com/knex/knex/issues/2762
      this.columnName = this.columnName.replace(/[^a-zA-Z0-9_ ]/gi, "");
   }

   /**
    * @method urlPointer()
    * return a string pointer to decode this object from the root application
    * object.
    * @return {string} pointer reference
    */
   urlPointer() {
      return this.object.urlField() + this.id;
   }

   /**
    * @method defaultValue
    * insert a key=>value pair that represent the default value
    * for this field.
    * @param {obj} values a key=>value hash of the current values.
    */
   defaultValue(values) {
      values[this.columnName] = "";
   }

   /**
    * @method isValidData
    * Parse through the given data and return an error if this field's
    * data seems invalid.
    * @param {obj} data  a key=>value hash of the inputs to parse.
    */
   isValidData(data, validator) {
      // console.error('!!! Field ['+this.fieldKey()+'] has not implemented .isValidData()!!!');
      if (
         this.settings.required &&
         (data[this.columnName] == null || data[this.columnName] == "") &&
         data[this.columnName] != 0
      ) {
         validator.addError(this.columnName, "This is a required field.");
      }
   }

   /*
    * @property isMultilingual
    * does this field represent multilingual data?
    * @return {bool}
    */
   get isMultilingual() {
      return false;
   }

   dataValue(rowData) {
      let propName = "{objectName}.{columnName}"
         .replace("{objectName}", this.alias || this.object.name)
         .replace("{columnName}", this.columnName);

      let result = "";
      if (rowData[this.columnName] != null) {
         result = rowData[this.columnName];
      } else if (rowData[propName] != null) {
         result = rowData[propName];
      }

      return result;
   }

   /**
    * @method format
    * return display text to detail comonent and define label of object
    *
    * @param {Object} rowData - data
    */
   format(rowData) {
      if (rowData) {
         return this.dataValue(rowData);
      } else return "";
   }

   /**
    * @method toDefinition()
    *
    * convert this instance into an ABDefinition object.
    *
    * @return {ABDefinition}
    */
   toDefinition() {
      var myDef = super.toDefinition();

      // attempt to provide a more descriptive name:
      // [obj]->[fieldName]
      if (myDef.name == "") {
         myDef.name =
            myDef.json.name || myDef.json.label || myDef.json.columnName;
      }
      if (this.object && this.object.name) {
         myDef.name = `${this.object.name}->${myDef.name}`;
      }
      return myDef;
   }
};



/***/ }),

/***/ "./AppBuilder/core/dataFields/ABFieldDateCore.js":
/*!*******************************************************!*\
  !*** ./AppBuilder/core/dataFields/ABFieldDateCore.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * ABFieldDate
 *
 * An ABFieldDate defines a date field type.
 *
 */

var ABField = __webpack_require__(/*! ../../platform/dataFields/ABField */ "./AppBuilder/platform/dataFields/ABField.js");

function L(key, altText) {
   // TODO:
   return altText; // AD.lang.label.getLabel(key) || altText;
}

var ABFieldDateDefaults = {
   key: "date", // unique key to reference this specific DataField

   icon: "calendar", // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'

   // menuName: what gets displayed in the Editor drop list
   menuName: L("ab.dataField.date.menuName", "*Date"),

   // description: what gets displayed in the Editor description.
   description: L(
      "ab.dataField.date.description",
      "*Pick one from a calendar."
   ),

   supportRequire: true,

   // what types of Sails ORM attributes can be imported into this data type?
   // http://sailsjs.org/documentation/concepts/models-and-orm/attributes#?attribute-options
   compatibleOrmTypes: ["date"],

   // what types of MySql column types can be imported into this data type?
   // https://www.techonthenet.com/mysql/datatypes.php
   compatibleMysqlTypes: ["date"]
};

const defaultValues = {
   dateFormat: 2, // 1 (Ignore date), 2, 3, 4, 5
   defaultDate: 1, // 1 (None), 2 (Current Date), 3 (Specific Date)
   defaultDateValue: null, // {Date}
   validateCondition: "none",
   validateRangeUnit: "days",
   validateRangeBefore: 0,
   validateRangeAfter: 0,
   validateStartDate: null,
   validateEndDate: null
};

module.exports = class ABFieldDateCore extends ABField {
   constructor(values, object, defaultValues = ABFieldDateDefaults) {
      super(values, object, defaultValues);
   }

   // return the default values for this DataField
   static defaults() {
      return ABFieldDateDefaults;
   }

   static defaultValues() {
      return defaultValues;
   }

   ///
   /// Instance Methods
   ///

   /**
    * @method fromValues()
    *
    * initialze this object with the given set of values.
    * @param {obj} values
    */
   fromValues(values) {
      super.fromValues(values);

      // text to Int:
      this.settings.dateFormat = parseInt(this.settings.dateFormat);
      this.settings.defaultDate = parseInt(this.settings.defaultDate);
   }

   ///
   /// Working with Actual Object Values:
   ///

   /**
    * @method defaultValue
    * insert a key=>value pair that represent the default value
    * for this field.
    * @param {obj} values a key=>value hash of the current values.
    */
   defaultValue(values) {
      if (values[this.columnName] != null) return;

      let dateResult;

      // Set current date as default
      if (this.settings.defaultDate == 2) {
         dateResult = new Date();
      }
      // Set specific date as default
      else if (
         this.settings.defaultDate == 3 &&
         this.settings.defaultDateValue
      ) {
         dateResult = new Date(this.settings.defaultDateValue);
      }

      // if no default value is set, then don't insert a value.
      if (dateResult != null) {
         values[this.columnName] = this.object.application.toDateFormat(
            dateResult,
            {
               format: "YYYY-MM-DD"
            }
         );
         // values[this.columnName] = moment(dateResult).format("YYYY-MM-DD");
      }
   }

   /**
    * @method isValidData
    * Parse through the given data and return an error if this field's
    * data seems invalid.
    * @param {obj} data  a key=>value hash of the inputs to parse.
    * @param {OPValidator} validator  provided Validator fn
    */
   isValidData(data, validator) {
      super.isValidData(data, validator);

      if (data[this.columnName]) {
         var value = data[this.columnName];

         if (!(value instanceof Date)) {
            value = this.object.application.toDate(value);
            // value = new Date(this.convertToMoment(value));
         }

         // verify we didn't end up with an InValid Date result.
         if (
            Object.prototype.toString.call(value) === "[object Date]" &&
            isFinite(value)
         ) {
            var isValid = true;

            // Custom vaildate is here
            if (this.settings && this.settings.validateCondition) {
               var startDate = this.settings.validateStartDate
                     ? new Date(this.settings.validateStartDate)
                     : null,
                  endDate = this.settings.validateEndDate
                     ? new Date(this.settings.validateEndDate)
                     : null,
                  startDateDisplay = this.getDateDisplay(startDate),
                  endDateDisplay = this.getDateDisplay(endDate);

               switch (this.settings.validateCondition) {
                  case "dateRange":
                     var minDate = this.object.application.subtractDate(
                        new Date(),
                        this.settings.validateRangeBefore,
                        this.settings.validateRangeUnit
                     );
                     var maxDate = this.object.application.addDate(
                        new Date(),
                        this.settings.validateRangeAfter,
                        this.settings.validateRangeUnit
                     );
                     if (minDate < value && value < maxDate) isValid = true;
                     else {
                        isValid = false;
                        validator.addError(
                           this.columnName,
                           L(
                              "ab.dataField.date.error.dateRange",
                              "*Should be in between {startdate} and {enddate}"
                           )
                              .replace(
                                 "{startdate}",
                                 this.getDateDisplay(minDate)
                              )
                              .replace(
                                 "{enddate}",
                                 this.getDateDisplay(maxDate)
                              )
                        );
                     }

                     break;
                  case "between":
                     if (startDate < value && value < endDate) isValid = true;
                     else {
                        isValid = false;
                        validator.addError(
                           this.columnName,
                           L(
                              "ab.dataField.date.error.between",
                              "*Should be in between {startdate} and {enddate}"
                           )
                              .replace("{startdate}", startDateDisplay)
                              .replace("{enddate}", endDateDisplay)
                        );
                     }
                     break;
                  case "notBetween":
                     if (value < startDate && endDate < value) isValid = true;
                     else {
                        isValid = false;
                        validator.addError(
                           this.columnName,
                           L(
                              "ab.dataField.date.error.notBetween",
                              "*Should not be in between {startdate} and {enddate}"
                           )
                              .replace("{startdate}", startDateDisplay)
                              .replace("{enddate}", endDateDisplay)
                        );
                     }
                     break;
                  case "=":
                     isValid =
                        value.getTime &&
                        startDate.getTime &&
                        value.getTime() == startDate.getTime();
                     if (!isValid)
                        validator.addError(
                           this.columnName,
                           L(
                              "ab.dataField.date.error.equal",
                              "*Should equal {startdate}"
                           ).replace("{startdate}", startDateDisplay)
                        );
                     break;
                  case "<>":
                     isValid =
                        value.getTime &&
                        startDate.getTime &&
                        value.getTime() != startDate.getTime();
                     if (!isValid)
                        validator.addError(
                           this.columnName,
                           L(
                              "ab.dataField.date.error.notEqual",
                              "*Should not equal {startdate}"
                           ).replace("{startdate}", startDateDisplay)
                        );
                     break;
                  case ">":
                     isValid =
                        value.getTime &&
                        startDate.getTime &&
                        value.getTime() > startDate.getTime();
                     if (!isValid)
                        validator.addError(
                           this.columnName,
                           L(
                              "ab.dataField.date.error.after",
                              "*Should after {startdate}"
                           ).replace("{startdate}", startDateDisplay)
                        );
                     break;
                  case "<":
                     isValid =
                        value.getTime &&
                        startDate.getTime &&
                        value.getTime() < startDate.getTime();
                     if (!isValid)
                        validator.addError(
                           this.columnName,
                           L(
                              "ab.dataField.date.error.before",
                              "*Should before {startdate}"
                           ).replace("{startdate}", startDateDisplay)
                        );
                     break;
                  case ">=":
                     isValid =
                        value.getTime &&
                        startDate.getTime &&
                        value.getTime() >= startDate.getTime();
                     if (!isValid)
                        validator.addError(
                           this.columnName,
                           L(
                              "ab.dataField.date.error.afterOrEqual",
                              "*Should after or equal {startdate}"
                           ).replace("{startdate}", startDateDisplay)
                        );
                     break;
                  case "<=":
                     isValid =
                        value.getTime &&
                        startDate.getTime &&
                        value.getTime() <= startDate.getTime();
                     if (!isValid)
                        validator.addError(
                           this.columnName,
                           L(
                              "ab.dataField.date.error.beforeOrEqual",
                              "*Should before or equal {startdate}"
                           ).replace("{startdate}", startDateDisplay)
                        );
                     break;
               }
            }

            if (isValid) {
               // Reformat value to DB
               // NOTE: should we update here?
               data[this.columnName] = this.exportValue(value);
            }
         } else {
            // return a validation error
            validator.addError(this.columnName, "Should be a Date!");
         }
      }
   }

   format(rowData) {
      var d = this.dataValue(rowData);

      if (d == "" || d == null) {
         return "";
      }

      // pull format from settings.
      let dateObj = this.object.application.toDate(d);
      return this.getDateDisplay(dateObj);

      // let momentObj = this.convertToMoment(d);
      // return this.getDateDisplay(new Date(momentObj));
   }

   getFormat() {
      let dateFormatString = "";

      let dateFormat =
         this.settings && this.settings.dateFormat
            ? this.settings.dateFormat
            : "";

      switch (dateFormat) {
         //Ignore Date
         case (1, 2):
            {
               dateFormatString = "%d/%m/%Y";
            }
            break;
         //mm/dd/yyyy
         case 3:
            {
               dateFormatString = "%m/%d/%Y";
            }
            break;
         //M D, yyyy
         case 4:
            {
               dateFormatString = "%M %d, %Y";
            }
            break;
         //D M, yyyy
         case 5:
            {
               dateFormatString = "%d %M, %Y";
            }
            break;
         default:
            {
               dateFormatString = "%d/%m/%Y";
            }
            break;
      }

      return dateFormatString;
   }

   getDateDisplay(dateData) {
      let dateFormat = this.getFormat();

      return this.dateToString(dateFormat, dateData);
   }

   // convertToMoment(string) {
   //    let result = moment(string);

   //    let supportFormats = [
   //       "DD/MM/YYYY",
   //       "MM/DD/YYYY",
   //       "DD-MM-YYYY",
   //       "MM-DD-YYYY"
   //    ];

   //    supportFormats.forEach((format) => {
   //       if (!result || !result.isValid()) result = moment(string, format);
   //    });

   //    return result;
   // }

   exportValue(value) {
      return this.object.application.toDateFormat(value, {
         format: "YYYY-MM-DD"
      });
      // return this.convertToMoment(value).format("YYYY-MM-DD");
   }

   dateToString(dateFormat, dateData) {
      if (dateData && dateData.toString) return dateData.toString();
      else return "";
   }
};



/***/ }),

/***/ "./AppBuilder/core/dataFields/ABFieldLongTextCore.js":
/*!***********************************************************!*\
  !*** ./AppBuilder/core/dataFields/ABFieldLongTextCore.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * ABFieldLongText
 *
 * An ABFieldLongText defines a LongText field type.
 *
 */

var ABField = __webpack_require__(/*! ../../platform/dataFields/ABField */ "./AppBuilder/platform/dataFields/ABField.js");

function L(key, altText) {
   // TODO:
   return altText; // AD.lang.label.getLabel(key) || altText;
}

const MAX_CHAR_LENGTH = 5000;

var ABFieldLongTextDefaults = {
   key: "LongText", // unique key to reference this specific DataField
   type: "longtext",
   icon: "align-right", // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'

   // menuName: what gets displayed in the Editor drop list
   menuName: L("ab.dataField.LongText.menuName", "*Long text"),

   // description: what gets displayed in the Editor description.
   description: L(
      "ab.dataField.LongText.description",
      "*Multiple lines of text"
   ),

   supportRequire: true,

   // what types of Sails ORM attributes can be imported into this data type?
   // http://sailsjs.org/documentation/concepts/models-and-orm/attributes#?attribute-options
   compatibleOrmTypes: ["longtext", "mediumtext", "text"],

   // what types of MySql column types can be imported into this data type?
   // https://www.techonthenet.com/mysql/datatypes.php
   compatibleMysqlTypes: ["text", "mediumtext", "longtext"]
};

// defaultValues: the keys must match a .name of your elements to set it's default value.
var defaultValues = {
   default: "",
   supportMultilingual: 0
};

module.exports = class ABFieldLongText extends ABField {
   constructor(values, object) {
      super(values, object, ABFieldLongTextDefaults);

      /*
    	{
			settings: {
				default: 'string',
				supportMultilingual: 1/0
			}
    	}
    	*/
   }

   // return the default values for this DataField
   static defaults() {
      return ABFieldLongTextDefaults;
   }

   static defaultValues() {
      return defaultValues;
   }

   ///
   /// Instance Methods
   ///

   /**
    * @method fromValues()
    *
    * initialze this object with the given set of values.
    * @param {obj} values
    */
   fromValues(values) {
      super.fromValues(values);

      this.settings.default = values.settings.default || "";

      // we're responsible for setting up our specific settings:
      this.settings.supportMultilingual =
         values.settings.supportMultilingual + "" ||
         defaultValues.supportMultilingual;

      // text to Int:
      this.settings.supportMultilingual = parseInt(
         this.settings.supportMultilingual
      );

      if (this.settings.supportMultilingual) {
         if (this.object)
            this.object.translate(this.settings, this.settings, ["default"]);
      } else this.settings.default = values.settings.default || "";
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
      var obj = super.toObj();

      if (this.settings.supportMultilingual)
         if (this.object)
            this.object.unTranslate(obj.settings, obj.settings, ["default"]);
         else obj.settings.default = this.settings.default;

      return obj;
   }

   /*
    * @property isMultilingual
    * does this field represent multilingual data?
    * @return {bool}
    */
   get isMultilingual() {
      return this.settings.supportMultilingual == 1;
   }

   /**
    * @method defaultValue
    * insert a key=>value pair that represent the default value
    * for this field.
    * @param {obj} values a key=>value hash of the current values.
    */
   defaultValue(values) {
      if (values[this.columnName] == null) {
         if (typeof this.settings.default == "string") {
            values[this.columnName] = this.settings.default;
         } else {
            values[this.columnName] = "";
         }
      }
   }

   /**
    * @method isValidData
    * Parse through the given data and return an error if this field's
    * data seems invalid.
    * @param {obj} data  a key=>value hash of the inputs to parse.
    * @param {OPValidator} validator  provided Validator fn
    * @return {array}
    */
   isValidData(data, validator) {
      super.isValidData(data, validator);

      if (
         data &&
         data[this.columnName] &&
         data[this.columnName].length > MAX_CHAR_LENGTH
      ) {
         validator.addError(
            this.columnName,
            `should NOT be longer than ${MAX_CHAR_LENGTH} characters`
         );
      }
   }
};


/***/ }),

/***/ "./AppBuilder/core/dataFields/ABFieldNumberCore.js":
/*!*********************************************************!*\
  !*** ./AppBuilder/core/dataFields/ABFieldNumberCore.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * ABFieldNumber
 *
 * An ABFieldNumber defines a Number field type.
 *
 */

var ABField = __webpack_require__(/*! ../../platform/dataFields/ABField */ "./AppBuilder/platform/dataFields/ABField.js");

function L(key, altText) {
   // TODO:
   return altText; // AD.lang.label.getLabel(key) || altText;
}

var ABFieldNumberDefaults = {
   key: "number", // unique key to reference this specific DataField

   icon: "hashtag", // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'

   // menuName: what gets displayed in the Editor drop list
   menuName: L("ab.dataField.number.menuName", "*Number"),

   // description: what gets displayed in the Editor description.
   description: L(
      "ab.dataField.number.description",
      "*A Float or Integer Value"
   ),

   supportRequire: true,
   supportUnique: true,

   // what types of Sails ORM attributes can be imported into this data type?
   // http://sailsjs.org/documentation/concepts/models-and-orm/attributes#?attribute-options
   compatibleOrmTypes: ["integer", "float"],

   // what types of MySql column types can be imported into this data type?
   // https://www.techonthenet.com/mysql/datatypes.php
   compatibleMysqlTypes: [
      "tinyint",
      "smallint",
      "mediumint",
      "int",
      "integer",
      "bigint",
      "decimal",
      "dec",
      "numeric",
      "fixed",
      "float",
      "real"
   ]
};

var defaultValues = {
   // 'allowRequired': 0,
   default: "",
   typeFormat: "none",
   typeDecimals: "none",
   typeDecimalPlaces: "none",
   typeRounding: "none",
   typeThousands: "none",
   validation: 0,
   validateMinimum: "",
   validateMaximum: ""
};

module.exports = class ABFieldNumberCore extends ABField {
   constructor(values, object) {
      super(values, object, ABFieldNumberDefaults);

      /*
    	{
			settings: {
				'allowRequired':0,
				'default':null,
				'typeFormat': 'none',
				'typeDecimals': 'none',
				'typeDecimalPlaces': 'none',
				'typeRounding' : 'none',
				'typeThousands': 'none',
				'validation':0,
				'validateMinimum':null,
				'validateMaximum':null
			}
    	}
    	*/
   }

   // return the default values for this DataField
   static defaults() {
      return ABFieldNumberDefaults;
   }

   static defaultValues() {
      return defaultValues;
   }

   static formatList() {
      return [
         { id: "none", value: L("ab.dataField.number.none", "*None") },
         {
            id: "dollar",
            value: L("ab.dataField.number.format.dollar", "$"),
            sign: "$",
            position: "prefix"
         },
         {
            id: "yen",
            value: L("ab.dataField.number.format.yen", "¥"),
            sign: "¥",
            position: "prefix"
         },
         {
            id: "pound",
            value: L("ab.dataField.number.format.pound", "£"),
            sign: "£",
            position: "prefix"
         },
         {
            id: "euroBefore",
            value: L("ab.dataField.number.format.euroBefore", "€ (before)"),
            sign: "€",
            position: "prefix"
         },
         {
            id: "euroAfter",
            value: L("ab.dataField.number.format.euroAfter", "€ (after)"),
            sign: "€",
            position: "postfix"
         },
         {
            id: "percent",
            value: L("ab.dataField.number.format.percent", "%"),
            sign: "%",
            position: "postfix"
         }
      ];
   }

   static delimiterList() {
      return [
         { id: "none", value: L("ab.dataField.number.none", "*None") },
         {
            id: "comma",
            value: L("ab.dataField.number.comma", "*Comma"),
            sign: ","
         },
         {
            id: "period",
            value: L("ab.dataField.number.period", "*Period"),
            sign: "."
         },
         {
            id: "space",
            value: L("ab.dataField.number.space", "*Space"),
            sign: " "
         }
      ];
   }

   ///
   /// Instance Methods
   ///

   fromValues(values) {
      super.fromValues(values);

      // text to Int:
      // this.settings.allowRequired = parseInt(this.settings.allowRequired);
      this.settings.validation = parseInt(this.settings.validation);
   }

   ///
   /// Working with Actual Object Values:
   ///

   /**
    * @method defaultValue
    * insert a key=>value pair that represent the default value
    * for this field.
    * @param {obj} values a key=>value hash of the current values.
    */
   defaultValue(values) {
      // if no default value is set, then don't insert a value.
      if (this.settings.default != "") {
         values[this.columnName] = this.settings.default;
      }
   }

   /**
    * @method isValidData
    * Parse through the given data and return an error if this field's
    * data seems invalid.
    * @param {obj} data  a key=>value hash of the inputs to parse.
    * @param {OPValidator} validator  provided Validator fn
    * @return {array}
    */
   isValidData(data, validator) {
      super.isValidData(data, validator);

      if (data[this.columnName] != null && data[this.columnName] != "") {
         var value = data[this.columnName];

         // if this is an integer:
         if (this.settings.typeDecimals == "none") {
            value = parseInt(value);
         } else {
            var places = parseInt(this.settings.typeDecimalPlaces) || 2;
            value = parseFloat(parseFloat(value).toFixed(places));
         }

         var isNumeric = (n) => {
            return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
         };
         if (!isNumeric(value)) {
            validator.addError(this.columnName, "invalid number");
         }

         // validate Minimum
         if (
            this.settings.validation == true &&
            this.settings.validateMinimum != null &&
            this.settings.validateMinimum > value
         ) {
            var errMessage = "should be greater than {min}".replace(
               "{min}",
               this.settings.validateMinimum
            );

            validator.addError(this.columnName, errMessage);
         }

         // validate Maximum
         if (
            this.settings.validation == true &&
            this.settings.validateMaximum != null &&
            this.settings.validateMaximum < value
         ) {
            var errMessage = "should be less than {max}".replace(
               "{max}",
               this.settings.validateMaximum
            );

            validator.addError(this.columnName, errMessage);
         }
      }
   }

   format(rowData) {
      if (
         rowData[this.columnName] == null ||
         (rowData[this.columnName] != 0 && rowData[this.columnName] == "")
      )
         return "";

      let data = rowData[this.columnName] || 0;

      if (typeof data == "string") {
         data = data.replace(/,/g, "");
      }

      // Validate number
      if (isNaN(parseFloat(data))) data = 0;

      var formatSign = this.constructor
            .formatList()
            .filter((item) => item.id == this.settings.typeFormat)[0],
         thousandsSign = this.constructor
            .delimiterList()
            .filter((item) => item.id == this.settings.typeThousands)[0],
         decimalSign = this.constructor
            .delimiterList()
            .filter((item) => item.id == this.settings.typeDecimals)[0],
         decimalPlaces =
            this.settings.typeDecimalPlaces != "none"
               ? parseInt(this.settings.typeDecimalPlaces)
               : 0;

      var prefix = "",
         postfix = "";

      if (formatSign && formatSign.sign) {
         switch (formatSign.position) {
            case "prefix":
               prefix = formatSign.sign;
               break;
            case "postfix":
               postfix = formatSign.sign;
               break;
         }
      }

      decimalSign = decimalSign.sign || "";
      thousandsSign = thousandsSign.sign || "";

      // round number
      if (this.settings.typeRounding == "roundDown") {
         var digit = Math.pow(10, decimalPlaces);
         data = Math.floor(data * digit) / digit;
      }

      return "{prefix} {number} {postfix}"
         .replace("{prefix}", prefix)
         .replace("{postfix}", postfix)
         .replace(
            "{number}",
            this.formatNumber(data, {
               groupDelimiter: thousandsSign,
               groupSize: 3,
               decimalDelimiter: decimalSign,
               decimalSize: decimalPlaces
            })
         );
   }

   formatNumber(data, options = {}) {
      if (data === "" || data == null) return data;

      data = parseFloat(data);
      let negativeSign = data < 0 ? "-" : "";
      data = Math.abs(data);

      let dataStr = data.toString();
      let integerStr = dataStr.split(".")[0];
      let decimalStr = dataStr.split(".")[1];

      let integerValue = "";

      // Thousands digit sign
      if (options.groupDelimiter) {
         let step = 3;
         let i = integerStr.length;

         do {
            i -= step;
            let chunk =
               i > 0
                  ? integerStr.substr(i, step)
                  : integerStr.substr(0, step + i);
            integerValue = `${chunk}${
               integerValue ? options.groupDelimiter + integerValue : ""
            }`;
         } while (i > 0);
      } else {
         integerValue = integerStr;
      }

      let result = "";

      // Decimal
      if (options.decimalDelimiter && options.decimalSize) {
         result = `${negativeSign}${integerValue}${
            decimalStr
               ? options.decimalDelimiter +
                 decimalStr.toString().substr(0, options.decimalSize)
               : ""
         }`;
      }
      // Integer
      else {
         result = `${negativeSign}${integerValue}`;
      }

      return result;
   }

   getDecimalSize() {
      if (this.settings.typeDecimalPlaces != "none") {
         return parseInt(this.settings.typeDecimalPlaces);
      } else {
         return 0;
      }
   }
};


/***/ }),

/***/ "./AppBuilder/core/dataFields/ABFieldStringCore.js":
/*!*********************************************************!*\
  !*** ./AppBuilder/core/dataFields/ABFieldStringCore.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * ABFieldString
 *
 * An ABFieldString defines a string field type.
 *
 */

var ABField = __webpack_require__(/*! ../../platform/dataFields/ABField */ "./AppBuilder/platform/dataFields/ABField.js");

function L(key, altText) {
   // TODO:
   return altText; // AD.lang.label.getLabel(key) || altText;
}

const MAX_CHAR_LENGTH = 255;

var ABFieldStringDefaults = {
   key: "string", // unique key to reference this specific DataField
   // type : 'string', // http://sailsjs.org/documentation/concepts/models-and-orm/attributes#?attribute-options
   icon: "font", // font-awesome icon reference.  (without the 'fa-').  so 'user'  to reference 'fa-user'

   // menuName: what gets displayed in the Editor drop list
   menuName: L("ab.dataField.string.menuName", "*Single line text"),

   // description: what gets displayed in the Editor description.
   description: L("ab.dataField.string.description", "*short string value"),

   supportRequire: true,

   // what types of Sails ORM attributes can be imported into this data type?
   // http://sailsjs.org/documentation/concepts/models-and-orm/attributes#?attribute-options
   compatibleOrmTypes: ["string"],

   // what types of MySql column types can be imported into this data type?
   // https://www.techonthenet.com/mysql/datatypes.php
   compatibleMysqlTypes: ["char", "varchar", "tinytext"]
};

var defaultValues = {
   default: "",
   supportMultilingual: 0
};

module.exports = class ABFieldStringCore extends ABField {
   constructor(values, object) {
      super(values, object, ABFieldStringDefaults);

      /*
    	{
			settings: {
				default: 'string',
				supportMultilingual: 1/0
			}
    	}
        */
   }

   // return the default values for this DataField
   static defaults() {
      return ABFieldStringDefaults;
   }

   static defaultValues() {
      return defaultValues;
   }

   ///
   /// Instance Methods
   ///

   /**
    * @method fromValues()
    *
    * initialze this object with the given set of values.
    * @param {obj} values
    */
   fromValues(values) {
      super.fromValues(values);

      // we're responsible for setting up our specific settings:
      this.settings.default = values.settings.default || defaultValues.default;
      this.settings.supportMultilingual =
         values.settings.supportMultilingual + "" ||
         defaultValues.supportMultilingual;

      // text to Int:
      this.settings.supportMultilingual = parseInt(
         this.settings.supportMultilingual
      );

      if (this.settings.supportMultilingual) {
         this.translate(this.settings, this.settings, ["default"]);
      } else this.settings.default = values.settings.default || "";
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
      var obj = super.toObj();

      if (this.settings.supportMultilingual) {
         this.unTranslate(obj.settings, obj.settings, ["default"]);
      } else obj.settings.default = this.settings.default;

      return obj;
   }

   ///
   /// Working with Actual Object Values:
   ///

   /**
    * @method defaultValue
    * insert a key=>value pair that represent the default value
    * for this field.
    * @param {obj} values a key=>value hash of the current values.
    */
   defaultValue(values) {
      // if no default value is set, then don't insert a value.
      if (!values[this.columnName]) {
         // Set default string
         if (this.settings.default) {
            if (this.settings.default.indexOf("{uuid}") >= 0) {
               values[this.columnName] = OP.Util.uuid();
            } else {
               values[this.columnName] = this.settings.default;
            }
         }
      }
   }

   /**
    * @method isValidData
    * Parse through the given data and return an error if this field's
    * data seems invalid.
    * @param {obj} data  a key=>value hash of the inputs to parse.
    * @param {OPValidator} validator  provided Validator fn
    * @return {array}
    */
   isValidData(data, validator) {
      super.isValidData(data, validator);

      if (
         data &&
         data[this.columnName] &&
         data[this.columnName].length > MAX_CHAR_LENGTH
      ) {
         validator.addError(
            this.columnName,
            `should NOT be longer than ${MAX_CHAR_LENGTH} characters`
         );
      }
   }

   /*
    * @property isMultilingual
    * does this field represent multilingual data?
    * @return {bool}
    */
   get isMultilingual() {
      return this.settings.supportMultilingual == 1;
   }
};


/***/ }),

/***/ "./AppBuilder/platform/ABDefinition.js":
/*!*********************************************!*\
  !*** ./AppBuilder/platform/ABDefinition.js ***!
  \*********************************************/
/***/ (() => {



/***/ }),

/***/ "./AppBuilder/platform/ABEmitter.js":
/*!******************************************!*\
  !*** ./AppBuilder/platform/ABEmitter.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * ABEmitter
 *
 * This is the platform dependent implementation of an Emitter object.
 *
 */

var EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter;

module.exports = class ABEmitter extends EventEmitter {
   constructor() {
      super(/*{ maxListeners: 0 }*/);
   }
};


/***/ }),

/***/ "./AppBuilder/platform/ABMLClass.js":
/*!******************************************!*\
  !*** ./AppBuilder/platform/ABMLClass.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ABMLClassCore = __webpack_require__(/*! ../core/ABMLClassCore */ "./AppBuilder/core/ABMLClassCore.js");

module.exports = class ABMLClass extends ABMLClassCore {};


/***/ }),

/***/ "./AppBuilder/platform/dataFields/ABField.js":
/*!***************************************************!*\
  !*** ./AppBuilder/platform/dataFields/ABField.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ABFieldCore = __webpack_require__(/*! ../../core/dataFields/ABFieldCore */ "./AppBuilder/core/dataFields/ABFieldCore.js");

module.exports = class ABField extends ABFieldCore {};


/***/ }),

/***/ "./AppBuilder/platform/dataFields/ABFieldBoolean.js":
/*!**********************************************************!*\
  !*** ./AppBuilder/platform/dataFields/ABFieldBoolean.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ABFieldBooleanCore = __webpack_require__(/*! ../../core/dataFields/ABFieldBooleanCore */ "./AppBuilder/core/dataFields/ABFieldBooleanCore.js");

module.exports = class ABFieldBoolean extends ABFieldBooleanCore {};


/***/ }),

/***/ "./AppBuilder/platform/dataFields/ABFieldDate.js":
/*!*******************************************************!*\
  !*** ./AppBuilder/platform/dataFields/ABFieldDate.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ABFieldDateCore = __webpack_require__(/*! ../../core/dataFields/ABFieldDateCore */ "./AppBuilder/core/dataFields/ABFieldDateCore.js");

module.exports = class ABFieldDate extends ABFieldDateCore {};


/***/ }),

/***/ "./AppBuilder/platform/dataFields/ABFieldLongText.js":
/*!***********************************************************!*\
  !*** ./AppBuilder/platform/dataFields/ABFieldLongText.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ABFieldLongTextCore = __webpack_require__(/*! ../../core/dataFields/ABFieldLongTextCore */ "./AppBuilder/core/dataFields/ABFieldLongTextCore.js");

module.exports = class ABFieldLongText extends ABFieldLongTextCore {};


/***/ }),

/***/ "./AppBuilder/platform/dataFields/ABFieldNumber.js":
/*!*********************************************************!*\
  !*** ./AppBuilder/platform/dataFields/ABFieldNumber.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ABFieldNumberCore = __webpack_require__(/*! ../../core/dataFields/ABFieldNumberCore */ "./AppBuilder/core/dataFields/ABFieldNumberCore.js");

module.exports = class ABFieldNumber extends ABFieldNumberCore {};


/***/ }),

/***/ "./AppBuilder/platform/dataFields/ABFieldString.js":
/*!*********************************************************!*\
  !*** ./AppBuilder/platform/dataFields/ABFieldString.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ABFieldStringCore = __webpack_require__(/*! ../../core/dataFields/ABFieldStringCore */ "./AppBuilder/core/dataFields/ABFieldStringCore.js");

module.exports = class ABFieldString extends ABFieldStringCore {};


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

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

/***/ "./src/rootPages/Designer/forms/process/ABProcessParticipant_selectManagersUI.js":
/*!***************************************************************************************!*\
  !*** ./src/rootPages/Designer/forms/process/ABProcessParticipant_selectManagersUI.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * UIProcessParticipant_SelectManagersUI
 *
 * Display the form for entering how to select "managers".
 * this form allows you to choose Roles, or Users directly.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = (...params) => {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UIProcessParticipant_SelectManagersUI extends AB.ClassUI {
      constructor(id) {
         super({
            component: id,
            form: `${id}_form`,
            name: `${id}_name`,
            role: `${id}_role`,
            useRole: `${id}_useRoles`,
            useAccount: `${id}_useAccounts`,
            account: `${id}_account`,
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
                              AB.ClassUI.CYPRESS_REF(this);
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
                                       AB.ClassUI.CYPRESS_REF(
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
                                    // AB.ClassUI.CYPRESS_REF(
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
                              AB.ClassUI.CYPRESS_REF(this.getNode(), ids.role);
                           },
                           onChange: function (/* newVal, oldVal */) {
                              // trigger the onAfterRender function from the list so we can add data-cy to dom
                              $$("combo1").getList().callEvent("onAfterRender");
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
                              AB.ClassUI.CYPRESS_REF(this);
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
                                       AB.ClassUI.CYPRESS_REF(
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
                                    // AB.ClassUI.CYPRESS_REF(
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
                              AB.ClassUI.CYPRESS_REF(
                                 this.getNode(),
                                 ids.account
                              );
                           },
                           onChange: function (/* newVal, oldVal */) {
                              // trigger the onAfterRender function from the list so we can add data-cy to dom
                              $$("combo1").getList().callEvent("onAfterRender");
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
/* harmony import */ var _ui_choose_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_choose.js */ "./src/rootPages/Designer/ui_choose.js");
/* harmony import */ var _ui_work_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work.js */ "./src/rootPages/Designer/ui_work.js");
/*
 * UI
 *
 * The central Controller for the ABDesigner.
 *
 * We switch between allowing a User to Choose an application to work
 * with, and the actual Workspace for an Application.
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const AppChooser = (0,_ui_choose_js__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   const AppWorkspace = (0,_ui_work_js__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI extends AB.ClassUI {
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

         AppChooser.on("view.workplace", (App) => {
            AppWorkspace.transitionWorkspace(App);
         });

         AppWorkspace.on("view.chooser", () => {
            AppChooser.show();
         });

         return Promise.all([AppChooser.init(AB), AppWorkspace.init(AB)]).then(
            () => {
               // Register for ABDefinition Updates
               return this.AB.Network.post({
                  url: `/definition/register`,
               }).catch((err) => {
                  if (err?.code == "E_NOPERM") {
                     // ?? What do we do here ??
                     this.AB.notify.developer(err, {
                        plugin: "ABDesigner",
                        context: "ui::init():/definition/register",
                        msg: "User is not able to access /definition/register",
                     });
                  }
               });
            }
         );
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
/* harmony import */ var _ui_choose_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_choose_list */ "./src/rootPages/Designer/ui_choose_list.js");
/* harmony import */ var _ui_choose_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_choose_form */ "./src/rootPages/Designer/ui_choose_form.js");
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
   const AppList = (0,_ui_choose_list__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   const AppForm = (0,_ui_choose_form__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   class UIChoose extends AB.ClassUI {
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

         AppList.on("view.workplace", (App) => {
            this.emit("view.workplace", App);
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
   return new UIChoose();
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
/* harmony import */ var _forms_process_ABProcessParticipant_selectManagersUI_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./forms/process/ABProcessParticipant_selectManagersUI.js */ "./src/rootPages/Designer/forms/process/ABProcessParticipant_selectManagersUI.js");
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
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };
   const ClassSelectManagersUI = (0,_forms_process_ABProcessParticipant_selectManagersUI_js__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   class ABChooseForm extends AB.ClassUI {
      // .extend(idBase, function(App) {

      constructor() {
         var base = "abd_choose_form";
         super({
            component: base,
            warnings: `${base}_warnings`,
            form: `${base}_form`,
            appFormPermissionList: `${base}_permission`,
            appFormCreateRoleButton: `${base}_createRole`,

            saveButton: `${base}_buttonSave`,
            accessManager: `${base}_accessManager`,
            accessManagerToolbar: `${base}_accessManagerToolbar`,
            translationManager: `${base}_translationManager`,
            translationManagerToolbar: `${base}_translationManagerToolbar`,
         });

         this.Application = null;
         // {ABApplication} The current ABApplication being Updated().
         // Should be null if performing a Create()
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
         if (this.Application) {
            if (this.formValidate("update")) {
               try {
                  await this.applicationUpdate(this.Application);
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
         this.Application = application;

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

            var messages = this.Application.warnings().map((w) => w.message);
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
         this.Application = null;

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
/* harmony import */ var _ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_common_popupEditMenu */ "./src/rootPages/Designer/ui_common_popupEditMenu.js");
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
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   const AB_Choose_List_Menu = (0,_ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   class UIChooseList extends AB.ClassUI {
      constructor() {
         var base = "abd_choose_list";
         super(base);
         var baseTB = `${base}_toolbar`;

         var ids = {
            toolbar: baseTB,
            buttonCreateNewApplication: `${baseTB}_createnewapp`,
            uploader: `${baseTB}_uploader`,
            exporter: `${baseTB}_exporter`,
            list: `${base}_list`,
         };
         Object.keys(ids).forEach((k) => {
            this.ids[k] = ids[k];
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
                                    AB.ClassUI.CYPRESS_REF(this);
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
                                    AB.ClassUI.CYPRESS_REF(this);
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
                                    AB.ClassUI.CYPRESS_REF(this);
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
                                    AB.ClassUI.CYPRESS_REF(this);
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
                                 AB.ClassUI.CYPRESS_REF(
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
         this.MenuComponent = new AB_Choose_List_Menu(this.ids.component);
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
            if (def.type == "application") {
               this.loaded = false;
               this.loadData();
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



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var UIListEditMenu = (0,_ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Common_List extends AB.ClassUI {
      constructor(attributes) {
         // attributes.idBase = attributes.idBase || "ui_common_list";
         var base = attributes.idBase || "ui_common_list";
         super({
            component: base,
            listSetting: `${base}_listsetting`,
            list: `${base}_editlist`,
            searchText: `${base}_searchText`,
            sort: `${base}_sort`,
            group: `${base}_group`,
            buttonNew: `${base}_buttonNew`,
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
                        this.selectItem(id);
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
                                             var bid = b.getAttribute(
                                                "button_id"
                                             );
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

      /*
       * @function copy
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
       * @function save()
       *
       */
      save() {
         // if this UI has not been initialed, then skip it
         if (!this._initialized) return;

         // CurrentApplication.save();
         this.AB.Storage.set(this.idBase, this._settings);
      }

      /**
       * @function selectItem()
       *
       * Perform these actions when an Process is selected in the List.
       */
      selectItem(id) {
         var process = this.$list.getItem(id);

         // _logic.callbacks.onChange(object);
         this.emit("selected", process);

         this.showGear(id);
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
         var warnText = "";
         if (warnings.length > 0) {
            warnText = `(${warnings.length})`;
         }
         return this._templateListItem
            .replace("#label#", obj.label || "??label??")
            .replace("{common.iconGear}", common.iconGear(obj))
            .replace("#warnings#", warnText);
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
   return UI_Common_List;
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
/*
 * ab_common_popupEditMenu
 *
 * Many of our Lists offer a gear icon that allows a popup menu to select
 * a set of options for this entry.  This is a common Popup Editor for those
 * options.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class ABCommonPopupEditMenu extends AB.ClassUI {
      constructor(contextID) {
         var idBase = "abd_common_popupEditMenu";
         super(idBase);

         this.labels = {
            copy: L("Copy"),
            exclude: L("Exclude"),
            rename: L("Rename"),
            delete: L("Delete"),
         };

         // var labels = {
         //    common: App.labels,

         //    component: {
         //       copy: L("ab.page.copy", "*Copy"),
         //       exclude: L("ab.object.exclude", "*Exclude"),

         //       menu: L("ab.application.menu", "*Application Menu"),
         //       confirmDeleteTitle: L(
         //          "ab.application.delete.title",
         //          "*Delete application"
         //       ),
         //       confirmDeleteMessage: L(
         //          "ab.application.delete.message",
         //          "*Do you want to delete <b>{0}</b>?"
         //       )
         //    }
         // };

         // since multiple instances of this component can exists, we need to
         // make each instance have unique ids => so add webix.uid() to them:
         // var uid = webix.uid();
         // var ids = {
         //    menu: this.unique("menu") + uid,
         //    list: this.unique("list") + uid
         // };

         this.ids.menu = `${idBase}_menu_${contextID}`;
         this.ids.list = `${idBase}_list_${contextID}`;

         this.Popup = null;
         this._menuOptions = [
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
               label: L("Exclude"),
               icon: "fa fa-reply",
               command: "exclude",
            },
            {
               label: L("Delete"),
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
               template: "<i class='fa #icon#' aria-hidden='true'></i> #label#",
               autoheight: true,
               select: false,
               on: {
                  onItemClick: (timestamp, e, trg) => {
                     return this.onItemClick(trg);
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

         // register our callbacks:
         // for (var c in _logic.callbacks) {
         //    if (options && options[c]) {
         //       _logic.callbacks[c] = options[c] || _logic.callbacks[c];
         //    }
         // }

         // hide "copy" item
         if (options.hideCopy) {
            let itemCopy = this.$list.data.find(
               (item) => item.label == this.labels.copy
            )[0];
            if (itemCopy) {
               this.$list.remove(itemCopy.id);
               this.$list.refresh();
            }
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

      /**
       * @function onItemClick
       * process which item in our popup was selected.
       */
      onItemClick(itemNode) {
         // hide our popup before we trigger any other possible UI animation: (like .edit)
         // NOTE: if the UI is animating another component, and we do .hide()
         // while it is in progress, the UI will glitch and give the user whiplash.

         var label = itemNode.textContent.trim();
         var option = this._menuOptions.filter((mo) => {
            return mo.label == label;
         })[0];
         if (option) {
            // this._logic.callbacks.onClick(option.command);
            this.emit("click", option.command);
         }

         this.hide();
         return false;
      }

      show(itemNode) {
         if (this.Popup && itemNode) this.Popup.show(itemNode);
      }

      hide() {
         if (this.Popup) this.Popup.hide();
      }
   }

   // NOTE: return JUST the class definition.
   return ABCommonPopupEditMenu;
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
/* harmony import */ var _ui_work_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_work_object */ "./src/rootPages/Designer/ui_work_object.js");
/*
 * ab_work
 *
 * Display the component for working with an ABApplication.
 *
 */


// const AB_Work_Query = require("./ab_work_query");
// const AB_Work_Datacollection = require("./ab_work_dataview");
// const AB_Work_Process = require("./ab_work_process");
// const AB_Work_Interface = require("./ab_work_interface");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var AppObjectWorkspace = (0,_ui_work_object__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var AppQueryWorkspace = new AB_Work_Query(App);
   // var AppDatacollectionWorkspace = new AB_Work_Datacollection(App);
   // var AppProcessWorkspace = new AB_Work_Process(App);
   // var AppInterfaceWorkspace = new AB_Work_Interface(App);

   class UI_Work extends AB.ClassUI {
      constructor(options = {}) {
         var base = "abd_work";
         super({
            component: `${base}_component`,
            toolBar: `${base}_toolbar`,
            labelAppName: `${base}_label_appname`,
            tabbar: `${base}_tabbar`,
            tab_object: `${base}_tab_object`,
            tab_query: `${base}_tab_query`,
            tab_dataview: `${base}_tab_dataview`,
            tab_processview: `${base}_tab_processview`,
            tab_interface: `${base}_tab_interface`,
            workspace: `${base}_workspace`,
            collapseMenu: `${base}_collapseMenu`,
            expandMenu: `${base}_expandMenu`,
         });

         this.options = options;

         this.selectedItem = this.ids.tab_object;
         // {string} {this.ids.xxx}
         // Keep track of the currently selected Tab Item (Object, Query, etc)
      } // constructor

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
               id: this.ids.tab_dataview,
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
                        align: "left",
                        type: "icon",
                        icon: "fa fa-arrow-left",
                        align: "left",
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
                           // AppQueryWorkspace.ui,
                           // AppDatacollectionWorkspace.ui,
                           // AppProcessWorkspace.ui,
                           // AppInterfaceWorkspace.ui,
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
         // AppQueryWorkspace.init(AB);
         // AppDatacollectionWorkspace.init(AB);
         // AppProcessWorkspace.init(AB);
         // AppInterfaceWorkspace.init(AB);

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
       */
      applicationInit(application) {
         // setup Application Label:
         var $labelAppName = $$(this.ids.labelAppName);
         $labelAppName.define("label", application.label);
         $labelAppName.refresh();
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
       */
      transitionWorkspace(application) {
         this.applicationInit(application);
         AppObjectWorkspace.applicationLoad(application);
         // AppQueryWorkspace.applicationLoad(application);
         // AppDatacollectionWorkspace.applicationLoad(application);
         // AppProcessWorkspace.applicationLoad(application);
         // AppInterfaceWorkspace.applicationLoad(application);

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
            case this.ids.tab_dataview:
               AppDatacollectionWorkspace.show();
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
/* harmony import */ var _ui_work_object_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_work_object_list */ "./src/rootPages/Designer/ui_work_object_list.js");
/* harmony import */ var _ui_work_object_workspace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object_workspace */ "./src/rootPages/Designer/ui_work_object_workspace.js");
/*
 * ui_work_object
 *
 * Display the Object Tab UI:
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var ObjectList = (0,_ui_work_object_list__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var ObjectWorkspace = (0,_ui_work_object_workspace__WEBPACK_IMPORTED_MODULE_1__["default"])(
      AB
      /* leave empty for default settings */
   );

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object extends AB.ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         super("ab_work_object");

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
            cols: [ObjectList.ui(), { view: "resizer" }, ObjectWorkspace.ui()],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI

         ObjectList.on("selected", (obj) => {
            if (obj == null) ObjectWorkspace.clearObjectWorkspace();
            else ObjectWorkspace.populateObjectWorkspace(obj);
         });

         ObjectWorkspace.on("addNew", (selectNew) => {
            ObjectList.emit("addNew", selectNew);
         });

         return Promise.all([ObjectWorkspace.init(AB), ObjectList.init(AB)]);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Object Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplication = application;

         ObjectWorkspace.clearObjectWorkspace();
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

         if (this.CurrentApplication) {
            ObjectList?.applicationLoad(this.CurrentApplication);
         }
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
/* harmony import */ var _ui_common_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_common_list */ "./src/rootPages/Designer/ui_common_list.js");
/* harmony import */ var _ui_work_object_list_newObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object_list_newObject */ "./src/rootPages/Designer/ui_work_object_list_newObject.js");
/*
 * ui_work_object_list
 *
 * Manage the ABObject List
 *
 */



// const ABProcess = require("../classes/platform/ABProcess");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var UI_COMMON_LIST = (0,_ui_common_list__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var AddForm = new _ui_work_object_list_newObject__WEBPACK_IMPORTED_MODULE_1__["default"](AB);
   // the popup form for adding a new process

   class UI_Work_Object_List extends AB.ClassUI {
      constructor() {
         super("ui_work_object_list");

         this.CurrentApplication = null;
         var processList = null;

         this.ListComponent = new UI_COMMON_LIST({
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
      async init(AB, options) {
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

         AddForm.on("save", (obj, select) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(obj.id);
            // }
         });

         this._handler_refreshApp = (def) => {
            this.CurrentApplication = this.CurrentApplication.refreshInstance();
            this.applicationLoad(this.CurrentApplication);
         };
      }

      addNew() {
         console.error("!! Who is calling this?");
         this.clickNewProcess(true);
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
               this.CurrentApplication.removeListener(
                  e,
                  this._handler_refreshApp
               );
            });
         }
         this.CurrentApplication = application;
         if (this.CurrentApplication) {
            events.forEach((e) => {
               this.CurrentApplication.on(e, this._handler_refreshApp);
            });
         }

         // NOTE: only include System Objects if the user has permission
         var f = (obj) => !obj.isSystemObject;
         if (this.AB.Account.isSystemDesigner()) {
            f = () => true;
         }
         this.ListComponent.dataLoad(application?.objectsIncluded(f));

         AddForm.applicationLoad(application);
      }

      /**
       * @function callbackNewProcess
       *
       * Once a New Process was created in the Popup, follow up with it here.
       */
      // callbackNewProcess(err, object, selectNew, callback) {
      //    debugger;
      //    if (err) {
      //       OP.Error.log("Error creating New Process", { error: err });
      //       return;
      //    }

      //    let objects = this.CurrentApplication.objects();
      //    processList.parse(objects);

      //    // if (processList.exists(object.id))
      //    // 	processList.updateItem(object.id, object);
      //    // else
      //    // 	processList.add(object);

      //    if (selectNew != null && selectNew == true) {
      //       $$(ids.list).select(object.id);
      //    } else if (callback) {
      //       callback();
      //    }
      // }

      /**
       * @function clickNewProcess
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewProcess(selectNew) {
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
      copy(data) {
         debugger;
         this.ListComponent.busy();

         this.CurrentApplication.processCreate(data.item).then((newProcess) => {
            this.ListComponent.ready();
            this.ListComponent.dataLoad(this.CurrentApplication.processes());
            this.ListComponent.select(newProcess.id);
         });
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
         await this.CurrentApplication.objectRemove(item);
         this.ListComponent.dataLoad(this.CurrentApplication.objectsIncluded());

         // this will clear the object workspace
         this.emit("selected", null);
      }

      ready() {
         this.ListComponent.ready();
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
/* harmony import */ var _ui_work_object_list_newObject_blank__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_work_object_list_newObject_blank */ "./src/rootPages/Designer/ui_work_object_list_newObject_blank.js");
/* harmony import */ var _ui_work_object_list_newObject_csv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object_list_newObject_csv */ "./src/rootPages/Designer/ui_work_object_list_newObject_csv.js");
/* harmony import */ var _ui_work_object_list_newObject_import__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui_work_object_list_newObject_import */ "./src/rootPages/Designer/ui_work_object_list_newObject_import.js");
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
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_List_NewObject extends AB.ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         var base = "ab_work_object_list_newObject";
         super({
            component: base,
            tab: `${base}_tab`,
         });

         this.currentApplication = null;
         // {ABApplication} the ABApplication we are currently working on.

         this.selectNew = true;
         // {bool} do we select a new object after it is created.

         // var callback = null;

         this.BlankTab = (0,_ui_work_object_list_newObject_blank__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
         this.CsvTab = (0,_ui_work_object_list_newObject_csv__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);
         this.ImportTab = (0,_ui_work_object_list_newObject_import__WEBPACK_IMPORTED_MODULE_2__["default"])(AB);
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
            head: L("Add new object"),
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
       */
      applicationLoad(application) {
         this.currentApplication = application; // remember our current Application.
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
       * @param {object} obj
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
            newObject.createdInAppID = this.currentApplication.id;
         }

         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            var obj = await newObject.save();
            await this.currentApplication.objectInsert(obj);
            this[tabKey].emit("save.successful", obj);
            this.done(obj);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the currentApplication.
            await this.currentApplication.objectRemove(newObject);

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
      }

      switchTab(tabId) {
         if (tabId == this.BlankTab?.ui?.body?.id) {
            this.BlankTab?.onShow?.(this.currentApplication);
         } else if (tabId == this.CsvTab?.ui?.body?.id) {
            this.CsvTab?.onShow?.(this.currentApplication);
         } else if (tabId == this.ImportTab?.ui()?.body?.id) {
            this.ImportTab?.onShow?.(this.currentApplication);
         } else if (tabId == this.ExternalTab?.ui?.body?.id) {
            this.ExternalTab?.onShow?.(this.currentApplication);
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
/*
 * ui_work_object_list_newObject_blank
 *
 * Display the form for creating a new ABObject.
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_List_NewObject_Blank extends AB.ClassUI {
      constructor() {
         var base = "ui_work_object_list_newObject_blank";
         super({
            component: base,

            form: `${base}_blank`,
            buttonSave: `${base}_save`,
            buttonCancel: `${base}_cancel`,
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
                           AB.ClassUI.CYPRESS_REF(
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
                           AB.ClassUI.CYPRESS_REF(
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
                                 AB.ClassUI.CYPRESS_REF(this);
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
         if ($$(this.ids.component)) $$(this.ids.component).show();
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
/* harmony import */ var _AppBuilder_platform_dataFields_ABField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../AppBuilder/platform/dataFields/ABField */ "./AppBuilder/platform/dataFields/ABField.js");
/* harmony import */ var _AppBuilder_platform_dataFields_ABField__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_AppBuilder_platform_dataFields_ABField__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldString__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../AppBuilder/platform/dataFields/ABFieldString */ "./AppBuilder/platform/dataFields/ABFieldString.js");
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldString__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_AppBuilder_platform_dataFields_ABFieldString__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldLongText__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../AppBuilder/platform/dataFields/ABFieldLongText */ "./AppBuilder/platform/dataFields/ABFieldLongText.js");
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldLongText__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_AppBuilder_platform_dataFields_ABFieldLongText__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldNumber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../AppBuilder/platform/dataFields/ABFieldNumber */ "./AppBuilder/platform/dataFields/ABFieldNumber.js");
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldNumber__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_AppBuilder_platform_dataFields_ABFieldNumber__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldDate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../AppBuilder/platform/dataFields/ABFieldDate */ "./AppBuilder/platform/dataFields/ABFieldDate.js");
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldDate__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_AppBuilder_platform_dataFields_ABFieldDate__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldBoolean__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../AppBuilder/platform/dataFields/ABFieldBoolean */ "./AppBuilder/platform/dataFields/ABFieldBoolean.js");
/* harmony import */ var _AppBuilder_platform_dataFields_ABFieldBoolean__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_AppBuilder_platform_dataFields_ABFieldBoolean__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils_CSVImporter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/CSVImporter */ "./src/utils/CSVImporter.js");
/* harmony import */ var _utils_CSVImporter__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_utils_CSVImporter__WEBPACK_IMPORTED_MODULE_6__);
/*
 * ab_work_object_list_newObject_csv
 *
 * Display the form for import CSV file to a object.
 *
 */









/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_List_NewObject_Csv extends AB.ClassUI {
      constructor() {
         var base = "ui_work_object_list_newObject_csv";
         super({
            component: base,

            form: `${base}_csvForm`,
            uploadFileList: `${base}_uploadFileList`,
            separatedBy: `${base}_separatedBy`,
            headerOnFirstLine: `${base}_headerOnFirstLine`,
            columnList: `${base}_columnList`,
            importButton: `${base}_importButton`,
         });

         this._csvImporter = new (_utils_CSVImporter__WEBPACK_IMPORTED_MODULE_6___default())(AB);
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
                     labelWidth: 70,
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
                        webix_remove_upload: (e, id, trg) => {
                           this.removeCsvFile(id);
                        },
                     },
                  },
                  {
                     id: ids.separatedBy,
                     view: "richselect",
                     name: "separatedBy",
                     label: L("Separated by"),
                     labelWidth: 140,
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
                        onChange: (newVal, oldVal) => {
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
               title: L("This file extension is disallow"),
               text: L("Please only upload CSV file"),
               ok: L("OK"),
            });

            return false;
         }

         // show loading cursor
         if (this.$form.showProgress) this.$form.showProgress({ type: "icon" });

         // read CSV file
         let separatedBy = this.$separatedBy.getValue();
         let data = await this._csvImporter.getDataRows(fileInfo, separatedBy);

         this._dataRows = data;

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
                     width: 170,
                  },
                  {
                     view: "select",
                     value: col.dataType,
                     options: [
                        {
                           id: "string",
                           value: _AppBuilder_platform_dataFields_ABFieldString__WEBPACK_IMPORTED_MODULE_1___default().defaults().menuName,
                        },
                        {
                           id: "LongText",
                           value: _AppBuilder_platform_dataFields_ABFieldLongText__WEBPACK_IMPORTED_MODULE_2___default().defaults().menuName,
                        },
                        {
                           id: "number",
                           value: _AppBuilder_platform_dataFields_ABFieldNumber__WEBPACK_IMPORTED_MODULE_3___default().defaults().menuName,
                        },
                        {
                           id: "date",
                           value: _AppBuilder_platform_dataFields_ABFieldDate__WEBPACK_IMPORTED_MODULE_4___default().defaults().menuName,
                        },
                        {
                           id: "boolean",
                           value: _AppBuilder_platform_dataFields_ABFieldBoolean__WEBPACK_IMPORTED_MODULE_5___default().defaults().menuName,
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
               _AppBuilder_platform_dataFields_ABField__WEBPACK_IMPORTED_MODULE_0___default().reservedNames.indexOf(
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
                  "Please enter column name does not match [{0}]",
                  _AppBuilder_platform_dataFields_ABField__WEBPACK_IMPORTED_MODULE_0___default().reservedNames.join(", ")
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
            fields: [],
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
               id: AB.uuid(),
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
            subTasks = subTasks
               .then(() => field.save())
               .then(() => field.migrateCreate());
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
         return subTasks.then(() => {
            this.formClear();
            this.$importButton.enable();

            return Promise.resolve();
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
/*
 * ab_work_object_list_newObject_import
 *
 * Display the form for importing an existing object into the application.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_List_NewObject_Import extends AB.ClassUI {
      constructor() {
         var base = "ui_work_object_list_newObject_import";
         super({
            component: base,

            form: `${base}_import`,
            filter: `${base}_filter`,
            objectList: `${base}_objectList`,
            columnList: `${base}_columnList`,
            buttonSave: `${base}_save`,
            buttonCancel: `${base}_cancel`,
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
                     template: (obj, common) => {
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
         this.currentApp = app;
         this.formClear();

         // now all objects are *global* but an application might only
         // reference a sub set of them.  Here we just need to show
         // the objects our current application isn't referencing:

         let availableObjs = this.currentApp.objectsExcluded(
            (o) => !o.isSystemObject
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
/*
 * ui_work_object_workspace
 *
 * Manage the Object Workspace area.
 */

// const ABWorkspaceDatatable = require("./ab_work_object_workspace_datatable");
// const ABWorkspaceKanBan = require("./ab_work_object_workspace_kanban");
// const ABWorkspaceGantt = require("./ab_work_object_workspace_gantt");

// const ABWorkspaceIndex = require("./ab_work_object_workspace_index");
// const ABWorkspaceTrack = require("./ab_work_object_workspace_track");

// const ABPopupDefineLabel = require("./ab_work_object_workspace_popupDefineLabel");
// const ABPopupFilterDataTable = require("./ab_work_object_workspace_popupFilterDataTable");
// const ABPopupFrozenColumns = require("./ab_work_object_workspace_popupFrozenColumns");
// const ABPopupHideFields = require("./ab_work_object_workspace_popupHideFields");
// const ABPopupMassUpdate = require("./ab_work_object_workspace_popupMassUpdate");
// const ABPopupNewDataField = require("./ab_work_object_workspace_popupNewDataField");
// const ABPopupSortField = require("./ab_work_object_workspace_popupSortFields");
// const ABPopupExport = require("./ab_work_object_workspace_popupExport");
// const ABPopupImport = require("./ab_work_object_workspace_popupImport");
// const ABPopupViewSettings = require("./ab_work_object_workspace_popupViewSettings");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB, init_settings) {
   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UIWorkObjectWorkspace extends AB.ClassUI {
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
         var base = "abd_work_object_workspace";

         super({
            component: `${base}_component`,

            buttonAddField: `${base}_buttonAddField`,
            buttonDeleteSelected: `${base}_deleteSelected`,
            buttonExport: `${base}_buttonExport`,
            buttonImport: `${base}_buttonImport`,
            buttonFieldsVisible: `${base}_buttonFieldsVisible`,
            buttonFilter: `${base}_buttonFilter`,
            buttonFrozen: `${base}_buttonFrozen`,
            buttonLabel: `${base}_buttonLabel`,
            buttonMassUpdate: `${base}_buttonMassUpdate`,
            buttonRowNew: `${base}_buttonRowNew`,
            buttonSort: `${base}_buttonSort`,

            listIndex: `${base}_listIndex`,
            buttonIndex: `${base}_buttonIndex`,

            datatable: `${base}_datatable`,
            error: `${base}_error`,
            error_msg: `${base}_error_msg`,

            viewMenu: `${base}_viewMenu`,
            viewMenuButton: `${base}_viewMenuButton`,
            viewMenuNewView: `${base}_viewMenuNewView`,

            // Toolbar:
            toolbar: `${base}_toolbar`,

            noSelection: `${base}_noSelection`,
            selectedObject: `${base}_selectedObject`,
         });

         // default settings
         settings.trackView = settings.trackView ?? true;
         settings.allowDelete = settings.allowDelete ?? true;
         settings.isInsertable = settings.isInsertable ?? true;
         settings.isEditable = settings.isEditable ?? true;
         settings.massUpdate = settings.massUpdate ?? true;
         settings.configureHeaders = settings.configureHeaders ?? true;
         settings.isFieldAddable = settings.isFieldAddable ?? true;
         this.settings = settings;

         this.hashViews = {}; // a hash of the available workspace view components

         // The DataTable that displays our object:
         // var DataTable = new ABWorkspaceDatatable(App, idBase, settings);
         // this.hashViews["grid"] = DataTable;

         // var KanBan = new ABWorkspaceKanBan(base);
         // this.hashViews["kanban"] = KanBan;

         // var Gantt = new ABWorkspaceGantt(base);
         // this.hashViews["gantt"] = Gantt;

         // let CustomIndex = new ABWorkspaceIndex(App, idBase);
         // let Track = new ABWorkspaceTrack(App, idBase);

         // // Various Popups on our page:
         // var PopupDefineLabelComponent = new ABPopupDefineLabel(App, idBase);

         // var PopupFilterDataTableComponent = new ABPopupFilterDataTable(
         //    App,
         //    idBase
         // );

         // var PopupFrozenColumnsComponent = new ABPopupFrozenColumns(
         //    App,
         //    idBase
         // );

         // var PopupHideFieldComponent = new ABPopupHideFields(App, idBase);

         // var PopupMassUpdateComponent = new ABPopupMassUpdate(App, idBase);

         // var PopupNewDataFieldComponent = new ABPopupNewDataField(App, idBase);

         // var PopupSortFieldComponent = new ABPopupSortField(App, idBase);

         // var PopupExportObjectComponent = new ABPopupExport(App, idBase);

         // var PopupImportObjectComponent = new ABPopupImport(App, idBase);

         // var PopupViewSettingsComponent = new ABPopupViewSettings(App, idBase);

         // create ABViewDataCollection
         this.CurrentDatacollection = null;
         this.CurrentApplication = null;
         this.CurrentObject = null;
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
            view: "button",
            type: "icon",
            autowidth: true,
            css: "webix_primary",
            label: L("New view"),
            icon: "fa fa-plus",
            align: "center",
            id: this.ids.viewMenuNewView,
            click: () => {
               this.PopupViewSettingsComponent.show();
            },
         };

         var menu = {
            view: "menu",
            // css: "darkgray",
            // borderless: true,
            // minWidth: 150,
            // autowidth: true,
            id: this.ids.viewMenu,
            data: [],
            on: {
               onMenuItemClick: (id) => {
                  var item = $$(ids.viewMenu).getMenuItem(id);
                  if (id === ids.viewMenuButton) {
                     return;
                  }
                  if (item.isView) {
                     var view = this.CurrentObject.workspaceViews.list(
                        (v) => v.id === id
                     )[0];
                     this.switchWorkspaceView(view);
                  } else if (item.action === "edit") {
                     var view = this.CurrentObject.workspaceViews.list(
                        (v) => v.id === item.viewId
                     )[0];
                     PopupViewSettingsComponent.show(view);
                  } else if (item.action === "delete") {
                     // Ask the user what to do about the existing file:
                     webix.confirm({
                        title: L("Delete View?"),
                        message: L(
                           "Are you sure you want to remove this view?"
                        ),
                        callback: (result) => {
                           if (result) {
                              var view = this.CurrentObject.workspaceViews.list(
                                 (v) => v.id === item.viewId
                              )[0];
                              this.CurrentObject.workspaceViews.removeView(
                                 view
                              );
                              this.switchWorkspaceView(
                                 this.CurrentObject.workspaceViews.getCurrentView()
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
                        hidden: !this.settings.isFieldAddable,
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
                           this.CustomIndex.open(this.CurrentObject);
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
                        label:
                           "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-exclamation-triangle'></div>",
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
                        label:
                           "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-database'></div>",
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
                        cols: [newViewButton, menu],
                     },
                     toolbar,
                     {
                        padding: 0,
                        rows: [
                           {
                              view: "multiview",
                              cells: [
                                 {
                                    rows: [
                                       {},
                                       {
                                          view: "label",
                                          label:
                                             "Impressive workspace editor here!",
                                       },
                                       {},
                                    ],
                                 },
                                 /* DataTable.ui(), Gantt.ui(), KanBan.ui() */
                              ],
                           },
                           this.settings.isInsertable
                              ? {
                                   view: "button",
                                   type: "form",
                                   id: ids.buttonRowNew,
                                   css: "webix_primary",
                                   value: L("Add new row"),
                                   click: function () {
                                      _logic.rowAdd();
                                   },
                                }
                              : {
                                   view: "layout",
                                   rows: [],
                                   hidden: true,
                                },
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

         // DataTable.init({
         //    onEditorMenu: _logic.callbackHeaderEditorMenu,
         //    onColumnOrderChange: _logic.callbackColumnOrderChange,
         //    onCheckboxChecked: _logic.callbackCheckboxChecked,
         // });
         // KanBan.init();
         // Gantt.init();

         // this.CurrentDatacollection = this.AB.datacollectionNew({});
         // this.CurrentDatacollection.init();

         // CustomIndex.init({
         //    onChange: _logic.refreshIndexes,
         // });
         // Track.init();

         // DataTable.datacollectionLoad(this.CurrentDatacollection);
         // KanBan.datacollectionLoad(this.CurrentDatacollection);
         // Gantt.datacollectionLoad(this.CurrentDatacollection);

         // PopupDefineLabelComponent.init({
         //    onChange: _logic.callbackDefineLabel, // be notified when there is a change in the label
         // });

         // PopupFilterDataTableComponent.init({
         //    onChange: _logic.callbackFilterDataTable, // be notified when there is a change in the filters
         // });

         // PopupFrozenColumnsComponent.init({
         //    onChange: _logic.callbackFrozenColumns, // be notified when there is a change in the frozen columns
         // });

         // PopupHideFieldComponent.init({
         //    onChange: _logic.callbackFieldsVisible, // be notified when there is a change in the hidden fields
         // });

         // PopupMassUpdateComponent.init({
         //    // onSave:_logic.callbackAddFields			// be notified of something...who knows...
         // });

         // if (settings.isFieldAddable) {
         //    PopupNewDataFieldComponent.init({
         //       onSave: _logic.callbackAddFields, // be notified when a new Field is created & saved
         //    });
         // }

         // // ?? what is this for ??
         // // var fieldList = DataTable.getFieldList();

         // PopupSortFieldComponent.init({
         //    onChange: _logic.callbackSortFields, // be notified when there is a change in the sort fields
         // });

         // PopupImportObjectComponent.init({
         //    onDone: () => {
         //       // refresh data in object
         //       _logic.populateObjectWorkspace(CurrentObject);
         //    },
         // });

         // PopupExportObjectComponent.init({});

         // PopupViewSettingsComponent.init({
         //    onViewAdded: _logic.callbackViewAdded,
         //    onViewUpdated: _logic.callbackViewUpdated,
         // });

         $$(this.ids.noSelection).show();
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Object Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplication = application;
         return;
         PopupNewDataFieldComponent.applicationLoad(application);

         // this.CurrentDatacollection.application = CurrentApplication;
      }

      /**
       * @function callbackDefineLabel
       *
       * call back for when the Define Label popup is finished.
       */
      callbackAddFields(field) {
         DataTable.refreshHeader();
         _logic.loadData();
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
      callbackFrozenColumns(frozen_field_id) {
         // We need to load data first because there isn't anything to look at if we don't
         // _logic.loadData();
         // DataTable.refresh();

         CurrentObject.workspaceFrozenColumnID = frozen_field_id;
         CurrentObject.save().then(() => {
            _logic.getBadgeFrozenColumn();

            PopupHideFieldComponent.setFrozenColumnID(
               CurrentObject.objectWorkspace.frozenColumnID || ""
            );

            DataTable.refreshHeader();
         });
      }

      /**
       * @function callbackFieldsVisible
       *
       * call back for when the hidden fields have changed.
       */
      callbackFieldsVisible(hidden_fields_settings) {
         CurrentObject.workspaceHiddenFields = hidden_fields_settings;
         CurrentObject.save().then(() => {
            _logic.getBadgeHiddenFields();

            PopupFrozenColumnsComponent.setHiddenFields(hidden_fields_settings);

            DataTable.refreshHeader();
         });
      }

      /**
       * @function callbackCheckboxChecked
       *
       * call back for when the checkbox of datatable is checked
       */

      callbackCheckboxChecked(state) {
         if (state == "enable") {
            _logic.enableUpdateDelete();
         } else {
            _logic.disableUpdateDelete();
         }
      }

      /**
       * @function callbackColumnOrderChange
       *
       */
      callbackColumnOrderChange(object) {
         _logic.getBadgeHiddenFields();
         _logic.getBadgeFrozenColumn();
      }

      /**
       * @function callbackHeaderEditorMenu
       *
       * call back for when an editor menu action has been selected.
       * @param {string} action [ 'hide', 'filter', 'sort', 'edit', 'delete' ]
       */
      callbackHeaderEditorMenu(action, field, node) {
         switch (action) {
            case "hide":
               var newFields = [];
               var isHidden =
                  CurrentObject.workspaceHiddenFields.filter((fID) => {
                     return fID == field.columnName;
                  }).length > 0;
               if (isHidden) {
                  // get remaining fields
                  newFields = CurrentObject.workspaceHiddenFields.filter(
                     (fID) => {
                        return fID != field.columnName;
                     }
                  );
               } else {
                  newFields = CurrentObject.workspaceHiddenFields;
                  newFields.push(field.columnName);
               }

               // update our Object with current hidden fields
               CurrentObject.workspaceHiddenFields = newFields;
               CurrentObject.save()
                  .then(function () {
                     PopupHideFieldComponent.setValue(
                        CurrentObject.objectWorkspace.hiddenFields
                     );
                     PopupFrozenColumnsComponent.setHiddenFields(
                        CurrentObject.objectWorkspace.hiddenFields
                     );
                     DataTable.refreshHeader();
                  })
                  .catch(function (err) {
                     OP.Error.log(
                        "Error trying to save workspaceHiddenFields",
                        { error: err, fields: newFields }
                     );
                  });
               break;
            case "filter":
               _logic.toolbarFilter($$(ids.buttonFilter).$view, field.id);
               break;
            case "sort":
               _logic.toolbarSort($$(ids.buttonSort).$view, field.id);
               break;
            case "freeze":
               CurrentObject.workspaceFrozenColumnID = field.columnName;
               CurrentObject.save()
                  .then(function () {
                     PopupFrozenColumnsComponent.setValue(
                        CurrentObject.objectWorkspace.frozenColumnID || ""
                     );
                     PopupHideFieldComponent.setFrozenColumnID(
                        CurrentObject.objectWorkspace.frozenColumnID || ""
                     );
                     DataTable.refreshHeader();
                  })
                  .catch(function (err) {
                     OP.Error.log(
                        "Error trying to save workspaceFrozenColumnID",
                        { error: err, fields: field.columnName }
                     );
                  });
               break;
            case "edit":
               // pass control on to our Popup:
               PopupNewDataFieldComponent.show(field);
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
                        field
                           .destroy()
                           .then(() => {
                              DataTable.refreshHeader();
                              _logic.loadData();

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
                                 CurrentApplication.pages(),
                                 (err) => {}
                              );
                           })
                           .catch((err) => {
                              if (err && err.message) {
                                 webix.alert({
                                    type: "alert-error",
                                    title: L("Could not delete"),
                                    text: err.message,
                                 });
                              }

                              this.AB.notify.developer(err, {
                                 context: "Error trying to delete field",
                                 error: err,
                                 fields: field.toObj(),
                              });
                           });
                     }
                  },
               });
               break;
         }
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
      callbackSortFields(sort_settings) {
         CurrentObject.workspaceSortFields = sort_settings;
         CurrentObject.save().then(() => {
            _logic.getBadgeSortFields();
            DataTable.refreshHeader();
            _logic.loadData();
         });
      }

      /**
       * @function callbackViewAdded
       *
       * call back for when a new workspace view is added
       */
      callbackViewAdded(view) {
         _logic.switchWorkspaceView(view);
         DataTable.refreshHeader();
         _logic.loadData();
      }

      /**
       * @function callbackViewUpdated
       *
       * call back for when a workspace view is updated
       */
      callbackViewUpdated(view) {
         if (view.id === CurrentObject.workspaceViews.getCurrentView().id) {
            _logic.switchWorkspaceView(view);
         } else {
            _logic.refreshViewMenu();
         }
      }

      /**
       * @function enableUpdateDelete
       *
       * enable the update or delete buttons in the toolbar if there are any items selected
       * we will make this externally accessible so we can call it from within the datatable component
       */
      enableUpdateDelete() {
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
         $$(ids.buttonMassUpdate).hide();
         $$(ids.buttonDeleteSelected).hide();
      }

      /**
       * @function getBadgeFilters
       *
       * we need to set the badge count for filters on load and after filters are added or removed
       */

      getBadgeFilters() {
         var filterConditions = CurrentObject.currentView().filterConditions;
         var numberOfFilter = 0;

         if (
            filterConditions &&
            filterConditions.rules &&
            filterConditions.rules.length
         )
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
         var frozenID = CurrentObject.workspaceFrozenColumnID;

         if (typeof frozenID != "undefined") {
            var badgeNumber = DataTable.getColumnIndex(frozenID) + 1;

            $$(ids.buttonFrozen).define("badge", badgeNumber || null);
            $$(ids.buttonFrozen).refresh();
         }
      }

      /**
       * @function getBadgeHiddenFields
       *
       * we need to set the badge count for hidden fields on load and after fields are hidden or shown
       */

      getBadgeHiddenFields() {
         var hiddenFields = CurrentObject.workspaceHiddenFields;

         if (typeof hiddenFields != "undefined") {
            $$(ids.buttonFieldsVisible).define(
               "badge",
               hiddenFields.length || null
            );
            $$(ids.buttonFieldsVisible).refresh();
         }
      }

      /**
       * @function getBadgeSortFields
       *
       * we need to set the badge count for sorts on load and after sorts are added or removed
       */

      getBadgeSortFields() {
         var sortFields = CurrentObject.workspaceSortFields;

         if (typeof sortFields != "undefined") {
            $$(ids.buttonSort).define("badge", sortFields.length || null);
            $$(ids.buttonSort).refresh();
         }
      }

      /**
       * @function rowAdd()
       *
       * When our [add row] button is pressed, alert our DataTable
       * component to add a row.
       */
      rowAdd() {
         let currView = CurrentObject.currentView();

         switch (currView.type) {
            case "kanban":
               KanBan.addCard();
               break;
            case "grid":
            default:
               DataTable.addRow();
               break;
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
         PopupNewDataFieldComponent.show();
      }

      toolbarButtonImport() {
         PopupImportObjectComponent.show();
      }

      toolbarButtonExport($view) {
         PopupExportObjectComponent.show($view);
      }

      toolbarDeleteSelected($view) {
         var deleteTasks = [];
         $$(DataTable.ui.id).data.each(function (obj) {
            if (
               typeof obj != "undefined" &&
               obj.hasOwnProperty("appbuilder_select_item") &&
               obj.appbuilder_select_item == 1
            ) {
               deleteTasks.push(function (next) {
                  CurrentObject.model()
                     .delete(obj.id)
                     .then((response) => {
                        if (response.numRows > 0) {
                           $$(DataTable.ui.id).remove(obj.id);
                        }
                        next();
                     }, next);
               });
            }
         });

         if (deleteTasks.length > 0) {
            OP.Dialog.Confirm({
               title: L("ab.massDelete.title", "*Delete Multiple Records"),
               text: L(
                  "ab.massDelete.description",
                  "*Are you sure you want to delete the selected records?"
               ),
               callback: function (result) {
                  if (result) {
                     async.parallel(deleteTasks, function (err) {
                        if (err) {
                           // TODO : Error message
                        } else {
                           // Anything we need to do after we are done.
                           _logic.disableUpdateDelete();
                        }
                     });
                  }
               },
            });
         } else {
            OP.Dialog.Alert({
               title: "No Records Selected",
               text:
                  "You need to select at least one record...did you drink your coffee today?",
            });
         }
      }

      /**
       * @function toolbarDefineLabel
       *
       * Show the popup to allow the user to define the default label for
       * this object.
       */
      toolbarDefineLabel($view) {
         PopupDefineLabelComponent.show($view);
      }

      /**
       * @function toolbarFieldsVisible
       *
       * Show the popup to allow the user to hide columns for this view.
       */
      toolbarFieldsVisible($view) {
         PopupHideFieldComponent.show($view);
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
         PopupFrozenColumnsComponent.show($view);
      }

      toolbarPermission($view) {
         console.error("TODO: toolbarPermission()");
      }

      toolbarMassUpdate($view) {
         PopupMassUpdateComponent.show($view);
      }

      /**
       * @function toolbarSort
       *
       * show the popup to sort the datatable
       */
      toolbarSort($view, fieldId) {
         PopupSortFieldComponent.show($view, fieldId);
         // self.refreshPopupData();
         // $$(self.webixUiId.sortFieldsPopup).show($view);
         //console.error('TODO: toolbarSort()');
      }

      /**
       * @function populateObjectWorkspace()
       *
       * Initialize the Object Workspace with the provided ABObject.
       *
       * @param {ABObject} object  	current ABObject instance we are working with.
       */
      populateObjectWorkspace(object) {
         $$(this.ids.toolbar).show();
         $$(this.ids.selectedObject).show();

         // temp placeholder until we refactor this method.
         return;

         CurrentObject = object;

         // get current view from object
         var currentView = CurrentObject.workspaceViews.getCurrentView();

         // get defined views
         // update the view picker in the toolbar

         // get toolbar config
         // update toolbar with approved tools

         /// still working with DataTable
         // initial data
         _logic.loadData();

         // the replicated tables are read only
         if (CurrentObject.isReadOnly) {
            DataTable.readonly();

            if ($$(ids.buttonRowNew)) $$(ids.buttonRowNew).disable();
         } else {
            DataTable.editable();

            if ($$(ids.buttonRowNew)) $$(ids.buttonRowNew).enable();
         }

         this.CurrentDatacollection.datasource = CurrentObject;

         DataTable.objectLoad(CurrentObject);
         KanBan.objectLoad(CurrentObject);
         Gantt.objectLoad(CurrentObject);

         PopupNewDataFieldComponent.objectLoad(CurrentObject);
         PopupDefineLabelComponent.objectLoad(CurrentObject);
         PopupFilterDataTableComponent.objectLoad(CurrentObject);
         PopupFrozenColumnsComponent.objectLoad(CurrentObject);
         PopupFrozenColumnsComponent.setValue(
            CurrentObject.workspaceFrozenColumnID || ""
         );
         PopupFrozenColumnsComponent.setHiddenFields(
            CurrentObject.workspaceHiddenFields
         );
         PopupHideFieldComponent.objectLoad(CurrentObject);
         PopupHideFieldComponent.setValue(CurrentObject.workspaceHiddenFields);
         PopupHideFieldComponent.setFrozenColumnID(
            CurrentObject.workspaceFrozenColumnID || ""
         );
         PopupMassUpdateComponent.objectLoad(CurrentObject, DataTable);
         PopupSortFieldComponent.objectLoad(CurrentObject);
         PopupSortFieldComponent.setValue(CurrentObject.workspaceSortFields);
         PopupImportObjectComponent.objectLoad(CurrentObject);
         PopupExportObjectComponent.objectLoad(CurrentObject);
         PopupExportObjectComponent.objectLoad(CurrentObject);
         PopupExportObjectComponent.setGridComponent($$(DataTable.ui.id));
         PopupExportObjectComponent.setHiddenFields(
            CurrentObject.workspaceHiddenFields
         );
         PopupExportObjectComponent.setFilename(CurrentObject.label);
         PopupViewSettingsComponent.objectLoad(CurrentObject);

         DataTable.refreshHeader();
         _logic.refreshToolBarView();

         _logic.refreshIndexes();

         // $$(ids.component).setValue(ids.selectedObject);
         $$(ids.selectedObject).show(true, false);

         // disable add fields into the object
         if (
            object.isExternal ||
            object.isImported ||
            !settings.isFieldAddable
         ) {
            $$(ids.buttonAddField).disable();
            $$(ids.buttonImport).disable();
         } else {
            $$(ids.buttonAddField).enable();
            $$(ids.buttonImport).enable();
         }

         _logic.refreshViewMenu();

         // display the proper ViewComponent
         var currDisplay = hashViews[currentView.type];
         currDisplay.show();
         // viewPicker needs to show this is the current view.
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

      /**
       * @function loadAll
       * Load all records
       *
       */
      loadAll() {
         DataTable.loadAll();
      }

      loadData() {
         // update ABViewDataCollection settings
         var wheres = {
            glue: "and",
            rules: [],
         };
         if (
            CurrentObject.workspaceFilterConditions &&
            CurrentObject.workspaceFilterConditions.rules &&
            CurrentObject.workspaceFilterConditions.rules.length > 0
         ) {
            wheres = CurrentObject.workspaceFilterConditions;
         }

         var sorts = {};
         if (
            CurrentObject.workspaceSortFields &&
            CurrentObject.workspaceSortFields.length > 0
         ) {
            sorts = CurrentObject.workspaceSortFields;
         }

         this.CurrentDatacollection.datasource = CurrentObject;

         this.CurrentDatacollection.fromValues({
            settings: {
               datasourceID: CurrentObject.id,
               objectWorkspace: {
                  filterConditions: wheres,
                  sortFields: sorts,
               },
            },
         });

         this.CurrentDatacollection.refreshFilterConditions(wheres);
         this.CurrentDatacollection.clearAll();

         // WORKAROUND: load all data becuase kanban does not support pagination now
         let view = CurrentObject.workspaceViews.getCurrentView();
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

               $$(ids.error).show();
               $$(ids.error_msg).define("label", message);
               $$(ids.error_msg).refresh();

               // webix.alert({
               //     title: "Error loading object Values ",
               //     ok: "fix it",
               //     text: message,
               //     type: "alert-error"
               // });

               console.error(err);
            });
         }
      }

      switchWorkspaceView(view) {
         if (hashViews[view.type]) {
            CurrentObject.workspaceViews.setCurrentView(view.id);
            hashViews[view.type].show();
            _logic.refreshViewMenu();

            // now update the rest of the toolbar for this view:
            _logic.refreshToolBarView();

            // save current view
            CurrentObject.save();

            _logic.loadData();
         }
      }

      /**
       * @function refreshToolBarView
       * update the display of the toolbar buttons based upon
       * the current view being displayed.
       */
      refreshToolBarView() {
         // get badge counts for server side components
         _logic.getBadgeHiddenFields();
         _logic.getBadgeFrozenColumn();
         _logic.getBadgeSortFields();
         _logic.getBadgeFilters();

         // $$(ids.component).setValue(ids.selectedObject);
         $$(ids.selectedObject).show(true, false);

         // disable add fields into the object
         if (
            CurrentObject.isExternal ||
            CurrentObject.isImported ||
            !settings.isFieldAddable
         ) {
            $$(ids.buttonAddField).disable();
         } else {
            $$(ids.buttonAddField).enable();
         }
      }

      refreshViewMenu() {
         var currentViewId = CurrentObject.workspaceViews.getCurrentView().id;
         var submenu = CurrentObject.workspaceViews.list().map((view) => ({
            hash: view.type,
            value: view.name,
            id: view.id,
            isView: true,
            $css: view.id === currentViewId ? "selected" : "",
            icon: view.constructor.icon(),
            submenu: view.isDefaultView
               ? null
               : [
                    {
                       value: L("ab.common.edit", "*Edit"),
                       icon: "fa fa-cog",
                       viewId: view.id,
                       action: "edit",
                    },
                    {
                       value: L("ab.common.delete", "*Delete"),
                       icon: "fa fa-trash",
                       viewId: view.id,
                       action: "delete",
                    },
                 ],
         }));

         // var currView = CurrentObject.workspaceViews.getCurrentView();
         // var icon = currView.constructor.icon();

         $$(ids.viewMenu).clearAll();
         $$(ids.viewMenu).define("data", submenu);
         $$(ids.viewMenu).refresh();
      }

      refreshIndexes() {
         let indexes = CurrentObject.indexes() || [];

         // clear indexes list
         webix.ui([], $$(ids.listIndex));

         indexes.forEach((index) => {
            _logic.addNewIndex(index);
         });
      }

      addNewIndex(index) {
         $$(ids.listIndex).addView({
            view: view,
            label: index.name,
            icon: "fa fa-key",
            css: "webix_transparent",
            type: "icon",
            width: 160,
            click: () => {
               CustomIndex.open(CurrentObject, index);
            },
         });
      }
   }

   // NOTE: since this is configurable, we return the CLASS only.
   return new UIWorkObjectWorkspace(init_settings);
}


/***/ }),

/***/ "./src/utils/CSVImporter.js":
/*!**********************************!*\
  !*** ./src/utils/CSVImporter.js ***!
  \**********************************/
/***/ ((module) => {

module.exports = class CSVImporter {
   constructor(AB) {
      this.AB = AB;
   }

   L(...params) {
      return this.AB.Multilingual.labelPlugin("ABDesigner", ...params);
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
      if (!this.validateFile(fileInfo)) return Promise.reject();

      return new Promise((resolve, reject) => {
         // read CSV file
         let reader = new FileReader();
         reader.onload = (e) => {
            let result = [];

            // split lines
            let dataRows = reader.result
               .split(/\r\n|\n|\r/) // CRLF = \r\n; LF = \n; CR = \r;
               .filter((row) => row && row.length > 0);

            // split columns
            (dataRows || []).forEach((row) => {
               let dataCols = [];
               if (separatedBy == ",") {
                  // NOTE: if the file contains ,, .match() can not reconize this empty string
                  row = row.replace(/,,/g, ", ,");

                  // https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript#answer-11457952
                  dataCols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
               } else {
                  dataCols = row.split(separatedBy);
               }

               result.push(dataCols.map((dCol) => this.reformat(dCol)));
            });

            resolve(result);
         };
         reader.readAsText(fileInfo.file);
      });
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

      if (data == null || data == "") {
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