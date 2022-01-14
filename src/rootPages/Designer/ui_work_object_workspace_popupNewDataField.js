/*
 * ui_work_object_workspace_popupNewDataField
 *
 * Manage the Add New Data Field popup for creating new Fields on an object.
 *
 */

import FPropertyManager from "./properties/PropertyManager";

// const ABFieldManager = require("../AppBuilder/core/ABFieldManager");

export default function (AB) {
   const ClassUI = AB.ClassUI;
   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var PropertyManager = FPropertyManager(AB);

   class UIWorkObjectWorkspacePopupNewDataField extends ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         var base = "abd_work_object_workspace_popupNewDataField";

         super({
            component: `${base}_popNewField`,
            types: `${base}_popNewField_types`,
            editDefinitions: `${base}_popNewField_editDefinitions`,
            buttonSave: `${base}_popNewField_buttonSave`,
            buttonCancel: `${base}_popNewField_buttonCancel`,
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

         // var _currentApplication = null;
         this.CurrentObjectID = null;
         // {string}
         // The current ABObject.id being edited in our Object Workspace.

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
            height: 500,
            width: 700,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Add new field"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.buttonCancel();
                     },
                     on: {
                        onAfterRender() {
                           ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            // ready: function () {
            //  console.error('ready() called!!!')
            //  _logic.resetState();
            // },

            body: {
               view: "scrollview",
               scroll: "y",
               css: "ab-add-fields-popup",
               borderless: true,
               body: {
                  type: "form",
                  rows: [
                     {
                        view: "richselect",
                        id: ids.types,
                        label: L("Field type"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [
                           //We will add these later
                           { id: "temporary", view: "temporary" },
                        ],
                        on: {
                           onChange: (id, ev, node) => {
                              this.onChange(id);
                           },
                        },
                     },
                     {
                        height: 10,
                        type: "line",
                     },
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
                     { height: 10 },
                     {
                        cols: [
                           { fillspace: true },
                           {
                              view: "button",
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
                              id: ids.buttonSave,
                              label: L("Add Column"),
                              autowidth: true,
                              type: "form",
                              click: () => {
                                 this.buttonSave();
                              },
                           },
                        ],
                     },
                  ],
               },
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

            // add a submenu for the fields multilingual key
            this.submenus.push({ id: menuName, value: L(menuName) });

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
         $$(ids.types).define("options", this.submenus);
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
         $$(ids.types).setValue(this.submenus[0].id);

         // $$(ids.editDefinitions).show();

         // $$(ids.editDefinitions).cells() // define the edit Definitions here.
      }

      // our internal business logic

      applicationLoad(application) {
         // _currentApplication = application;

         // make sure all the Property components refer to this ABApplication
         for (var menuName in this._componentHash) {
            this._componentHash[menuName]?.applicationLoad(application);
         }
      }

      objectLoad(object) {
         this.CurrentObjectID = object.id;

         // make sure all the Property components refer to this ABObject
         for (var menuName in this._componentHash) {
            this._componentHash[menuName]?.objectLoad(this.CurrentObjectID);
         }
      }

      get CurrentObject() {
         return this.AB.objectByID(this.CurrentObjectID);
      }

      buttonCancel() {
         this.resetState();

         // clear all editors:
         for (var c in this._componentHash) {
            this._componentHash[c].clear();
         }

         // hide this popup.
         $$(this.ids.component).hide();
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
            var connectField = ABFieldManager.allFields().filter(
               (f) => f.defaults().key == allowFieldKey
            )[0];
            if (!connectField) return;
            var connectMenuName = connectField.defaults().menuName;
            $$(ids.types).setValue(connectMenuName);
            $$(ids.types).disable();
         }
         // show the ability to switch data types
         else {
            $$(ids.types).enable();
         }

         $$(ids.types).show();

         // change button text to 'add'
         $$(ids.buttonSave).define("label", L("Add Column"));
         $$(ids.buttonSave).refresh();
      }

      modeEdit(field) {
         if (this._currentEditor) this._currentEditor.hide();
         var ids = this.ids;

         // switch to this field's editor:
         // hide the rest
         for (var c in this._componentsByType) {
            if (c == field.key) {
               this._componentsByType[c].show(false, false);
               this._componentsByType[c].populate(field);
               this._currentEditor = this._componentsByType[c];
            } else {
               this._componentsByType[c].hide();
            }
         }

         // disable elements that disallow to edit
         var elements = this._currentEditor.ui()?.elements;
         if (elements) {
            var disableElem = (elem) => {
               if (elem.disallowEdit && $$(elem.id) && $$(elem.id).disable) {
                  $$(elem.id).disable();
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

         // hide the ability to switch data types
         $$(ids.types).hide();

         // change button text to 'save'
         $$(ids.buttonSave).define("label", L("Save"));
         $$(ids.buttonSave).refresh();
      }

      /**
       * @function onChange
       * swap the editor view to match the data field selected in the menu.
       *
       * @param {string} name  the menuName() of the submenu that was selected.
       */
      onChange(name) {
         // note, the submenu returns the Field.menuName() values.
         // we use that to lookup the Field here:
         var editor = this._componentHash[name];
         if (editor) {
            editor.show();
            this._currentEditor = editor;
            $$(this.ids.types).blur();
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
               if (elem.disallowEdit && $$(elem.id) && $$(elem.id).enable) {
                  $$(elem.id).enable();
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
         $$(this.ids.types).setValue(this.submenus[0].id);
      }

      /**
       * @function show()
       *
       * Show this component.
       * @param {ABField} field    the ABField to edit.  If not provided, then
       *                           this is an ADD operation.
       * @param {string} fieldKey  allow only this field type
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

   return new UIWorkObjectWorkspacePopupNewDataField();
}
