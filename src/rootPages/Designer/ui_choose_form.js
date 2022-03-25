/*
 * AB Choose Form
 *
 * Display the form for creating a new Application.
 *
 */
import UI_Class from "./ui_class";
// const ABComponent = require("../classes/platform/ABComponent");
// const ABApplication = require("../classes/platform/ABApplication");
import ABProcessParticipant_selectManagersUI from "./properties/process/ABProcessParticipant_selectManagersUI.js";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();
   const ClassSelectManagersUI = ABProcessParticipant_selectManagersUI(AB);

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
            let $warnings = $$(this.ids.warnings);
            if (messages.length) {
               $warnings.setValue(messages.join("\n"));
               $warnings.show();
            } else {
               $warnings.setValue("");
               $warnings.hide();
            }

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
