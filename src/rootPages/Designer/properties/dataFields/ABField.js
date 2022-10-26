/*
 * ABField
 * A Generic Property manager for All our fields.
 */
import UI_Class from "../../ui_class";

let myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

export default function (AB) {
   if (!myClass) {
      const uiConfig = AB.Config.uiSettings();
      const UIClass = UI_Class(AB);
      const L = UIClass.L();

      myClass = class ABFieldProperty extends UIClass {
         constructor(base = "properties_abfield", ids = {}) {
            // base: {string} unique base id reference
            // ids: {hash}  { key => '' }
            // this is provided by the Sub Class and has the keys
            // unique to the Sub Class' interface elements.

            const common = {
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
            const ids = this.ids;

            const FC = this.FieldClass();
            const _ui = {
               view: "form",
               id: ids.component,
               borderless: true,
               autowidth: true,
               elements: [
                  {
                     cols: [
                        {
                           view: "label",
                           label: L("Field Name:"),
                           align: "left",
                           width: 87,
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
                           on: {
                              onAfterRender() {
                                 UIClass.CYPRESS_REF(this);
                              },
                           },
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
                           label: L("Show icon:"),
                           align: "left",
                           width: 75,
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
                           label: L("Required:"),
                           align: "left",
                           width: 66,
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
                           label: L("Unique:"),
                           align: "left",
                           width: 59,
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
                           label: L("Custom Settings:"),
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
                              label: L("Database Column:"),
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

            const FC = this.FieldClass();
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
            const ids = this.ids;
            const Filter = new this.AB.Class.FilterComplex(
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
                        const $viewCond = this.getParentView();
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
            const filterViews = $$(ids.filterComplex).queryView(
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
            const ids = this.ids;
            this._CurrentField = null;

            const defaultValues = this.defaultValues();

            for (const f in defaultValues) {
               const component = $$(ids[f]);
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
            const FieldClass = this.FieldClass();
            if (!FieldClass) {
               console.error(
                  "!!! ABFieldStringProperty: could not find FieldClass[]"
               );
               return null;
            }
            return FieldClass.defaults();
         }

         defaultValues() {
            const values = {
               label: "",
               columnName: "",
               showIcon: 1,
               required: 0,
               unique: 0,
               validationRules: "",
            };

            const FieldClass = this.FieldClass();
            if (FieldClass) {
               const fcValues = FieldClass.defaultValues();
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
            const ids = this.ids;
            if (
               isRequired &&
               this._CurrentField &&
               this._CurrentField.id &&
               this._CurrentField.settings.required != isRequired
            ) {
               // TODO: disable save button

               // get count number
               try {
                  const data = await this._CurrentField.object.model().count({
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
            const ids = this.ids;
            let isValid = $$(ids.component).validate(),
               colName = this.formValues()["columnName"];

            // validate reserve column names
            const FC = this.FieldClass();
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
            let fieldColName = this.CurrentObject?.fields(
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
            const ids = this.ids;
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
               let rules = field.settings.validationRules;
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
            const ids = this.ids;

            const settings = $$(ids.component).getValues();
            if ($$(ids.filterComplex)) {
               const validationRules = [];
               const forms = $$(ids.filterComplex).queryView(
                  { view: "form", css: "abValidationForm" },
                  "all"
               );
               forms.forEach((form) => {
                  const rules = form
                     .queryView({ view: "querybuilder" })
                     .getValue();
                  const invalidMessage = form
                     .queryView({ name: "invalidMessage" })
                     .getValue();
                  const validationObj = {
                     invalidMessage: invalidMessage,
                     rules: rules,
                  };
                  validationRules.push(validationObj);
               });
               settings.validationRules = JSON.stringify(validationRules);
            }

            const FC = this.FieldClass();

            // convert flat settings into our ABField value format:
            const values = FC.editorValues(settings);

            values.key = FC.defaults().key;

            return values;
         }
      };
   }
   return myClass;
}
