/*
 * ui_work_object_workspace_popupNewDataField
 *
 * Manage the Add New Data Field popup for creating new Fields on an object.
 *
 */
import UI_Class from "./ui_class";
import FPropertyManager from "./properties/PropertyManager";

// const ABFieldManager = require("../AppBuilder/core/ABFieldManager");

export default function (AB) {
   // const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const PropertyManager = FPropertyManager(AB);

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

         // const _objectHash = {}; // 'name' => ABFieldXXX object
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

         // const defaultEditorID = null; // the default editor id.

         this.submenus = [];
         // {array}
         // The list of ABField types that we can create.

         this._editField = null; // field instance being edited
         // {ABFieldXXX}
         // The ABField we are currently EDITING. If we are Adding a new field
         // this is null.
      }

      ui() {
         const ids = this.ids;

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
         const ids = this.ids;

         // initialize our components
         webix.ui(this.ui());
         webix.extend($$(ids.component), webix.ProgressBar);

         const Fields = PropertyManager.fields(); // ABFieldManager.allFields();

         //// we need to load a submenu entry and an editor definition for each
         //// of our Fields

         const newEditorList = {
            view: "multiview",
            id: ids.editDefinitions,
            animate: false,
            rows: [],
         };

         Fields.forEach((F) => {
            const menuName = F.defaults().menuName;
            const key = F.defaults().key;

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
         // const firstID = $$(ids.types).getFirstId();
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
         for (const menuName in this._componentHash) {
            this._componentHash[menuName]?.applicationLoad(application);
         }
      }

      objectLoad(object) {
         super.objectLoad(object);

         // make sure all the Property components refer to this ABObject
         for (const menuName in this._componentHash) {
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
         for (const c in this._componentHash) {
            this._componentHash[c].clear();
         }
      }

      async buttonSave() {
         const ids = this.ids;

         $$(ids.buttonSave).disable();
         // show progress
         $$(ids.component).showProgress();

         const editor = this._currentEditor;
         if (editor) {
            // the editor can define some basic form validations.
            if (editor.isValid()) {
               const vals = this.AB.cloneDeep(editor.values());

               let field = null;
               let oldData = null;

               let linkCol;

               // if this is an ADD operation, (_editField will be undefined)
               if (!this._editField) {
                  // get a new instance of a field:
                  field = this.CurrentObject.fieldNew(vals);

                  // Provide a default width based on the column label
                  let width = 20 + field.label.length * 10;
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

                     const linkObject = field.datasourceLink;

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
                  const updateValues = this.AB.cloneDeep(oldData);
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

               const validator = field.isValid();
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
                     //    const errMsg = err.toString();
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
         // const existsColumn = $.grep(dataTable.config.columns, function (c) { return c.id == fieldInfo.name.replace(/ /g, '_'); });
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
         const ids = this.ids;

         // allow add the connect field only to import object
         if (this.CurrentObject.isImported) allowFieldKey = "connectObject";

         if (allowFieldKey) {
            const connectField = PropertyManager.fields().filter(
               (f) => f.defaults().key == allowFieldKey
            )[0];
            if (!connectField) return;
            const connectMenuName = connectField.defaults().menuName;
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
         for (const c in this._componentsByType) {
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
         const elements = this._currentEditor.ui()?.elements;
         if (elements) {
            const disableElem = (elem) => {
               if (elem.disallowEdit) {
                  $$(elem.id)?.disable?.();
               }
            };

            this._currentEditor.eachDeep(elements, disableElem);
            // elements.forEach((elem) => {
            //    disableElem(elem);

            //    // disable elements are in rows/cols
            //    const childElems = elem.cols || elem.rows;
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
         const editor = this._componentHash[name];
         if (editor) {
            editor.show();
            this._currentEditor = editor;
            this._currentEditor["modeEdit"] = false;
            // $$(this.ids.types).blur();
         } else {
            // most likely they clicked on the menu button itself.
            // do nothing.
            // OP.Error.log("App Builder:Workspace:Object:NewDataField: could not find editor for submenu item:"+name, { name:name });
         }
      }

      resetState() {
         // enable elements that disallow to edit
         const elements = this._currentEditor.ui()?.elements;
         if (elements) {
            const enableElem = (elem) => {
               if (elem.disallowEdit) {
                  $$(elem.id)?.enable?.();
               }
            };

            this._currentEditor.eachDeep(elements, enableElem);
            // elements.forEach((elem) => {
            //    enableElem(elem);

            //    // enable elements are in rows/cols
            //    const childElems = elem.cols || elem.rows;
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

         const ids = this.ids;

         let subMenuId = $$(ids.types).config.data[0].submenu;

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
