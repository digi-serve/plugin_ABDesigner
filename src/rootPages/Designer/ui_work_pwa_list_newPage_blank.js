/*
 * ui_work_pwa_list_newPage_blank
 *
 * Display the form for creating a new BLANK mobile app page.
 *
 */

import UI_Class from "./ui_class";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_PWA_List_NewPage_Blank extends UIClass {
      constructor() {
         super("ui_work_pwa_list_newPage_blank", {
            form: "",

            saveButton: "",

            issue_id: "",
            issue_list: "",
         });

         this.tabValue = null;
         this.tabLabel = L("Blank");

         this.menuType = "??";
      }

      ui() {
         let ids = this.ids;

         return {
            // view: "window",
            id: ids.component,
            header: this.tabLabel,
            body: {
               view: "scrollview",
               scroll: true,
               height: 670,
               width: 770,
               body: {
                  padding: 4,
                  cols: [
                     {
                        view: "spacer",
                        width: 2,
                     },
                     {
                        rows: [
                           {
                              view: "form",
                              id: ids.form,
                              rules: {
                                 label: (value) => {
                                    return (
                                       0 < value.length && value.length <= 20
                                    );
                                 },
                              },
                              borderless: true,
                              elements: [
                                 {
                                    name: "label",
                                    view: "text",
                                    label: L("Name"),
                                    labelWidth: 100,
                                    placeholder: L("Name"),
                                    invalidMessage: L(
                                       "&nbsp; Name must be less than or equal to 20 letters."
                                    ),
                                    on: {
                                       onAfterRender() {
                                          AB.ClassUI.CYPRESS_REF(
                                             this,
                                             `${ids.component}_label`
                                          );
                                       },
                                    },
                                 },

                                 { height: uiConfig.smallSpacer },

                                 // QUESTION: do we assign a route? or just
                                 // manually create one internally?

                                 // {
                                 //    name: "route",
                                 //    view: "text",
                                 //    label: L("Route"),
                                 //    labelWidth: 100,
                                 //    // height: 100,
                                 //    placeholder: L("make this unique per page"),
                                 //    on: {
                                 //       onAfterRender() {
                                 //          AB.ClassUI.CYPRESS_REF(
                                 //             this,
                                 //             `${ids.component}_route`
                                 //          );
                                 //       },
                                 //    },
                                 // },

                                 // end MObile Config Settings
                                 {
                                    view: "spacer",
                                    height: 2,
                                 },
                                 {
                                    view: "toolbar",
                                    margin: 14,
                                    paddingY: 20,
                                    cols: [
                                       {
                                          view: "button",
                                          value: L("Cancel"),
                                          css: "ab-cancel-button",
                                          inputWidth: 100,
                                          align: "right",
                                          click: () => {
                                             this.cancel();
                                          },
                                          on: {
                                             onAfterRender() {
                                                AB.ClassUI.CYPRESS_REF(
                                                   this,
                                                   `${ids.component}_cancel`
                                                );
                                             },
                                          },
                                       },
                                       {
                                          view: "button",
                                          id: ids.saveButton,
                                          value: L("Save"),
                                          css: "webix_primary",
                                          inputWidth: 100,
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
                                    borderless: true,
                                 },
                              ],
                           },
                        ],
                     },
                     {
                        view: "spacer",
                        width: 8,
                     },
                  ],
               },
            },
         };
      } // ui()

      init(AB) {
         this.AB = AB;

         this.AB.Webix.ui(this.ui());

         webix.extend($$(this.ids.form), this.AB.Webix.ProgressBar);

         // Warnings.init(AB);

         // $$(Warnings.ids.buttonWarning).show();

         // const $warningsWindow = this.AB.Webix.ui({
         //    view: "window",
         //    id: this.ids.issue_id,
         //    css: "app_form_window_2",
         //    height: 222,
         //    width: 700,
         //    head: {
         //       type: "clean",
         //       cols: [
         //          {
         //             view: "spacer",
         //             width: 50,
         //          },
         //          {
         //             template: issue_icon + L(" Issues"),
         //             type: "header",
         //             css: "webix_win_title",
         //          },
         //          {
         //             view: "icon",
         //             icon: "wxi-close",
         //             click() {
         //                this.getTopParentView().hide();
         //             },
         //          },
         //          {
         //             view: "spacer",
         //             width: 4,
         //          },
         //       ],
         //    },
         //    position: "center",
         //    close: true,
         //    modal: true,
         //    move: true,
         //    scroll: true,
         //    body: {
         //       rows: [
         //          {
         //             view: "list",
         //             id: this.ids.issue_list,
         //             template: issue_icon + " #issue#",
         //             scrollX: true,
         //             scrollY: true,
         //             select: true,
         //             editable: false,
         //             autoheight: false,
         //             autowidth: false,
         //             data: [],
         //             click() {
         //                this.getParentView().show();
         //             },
         //          },
         //       ],
         //    },
         // });
      }

      toList() {
         this.emit("done");
      }

      // warningData() {

      // }

      /**
       * @function applicationCreate
       *
       * Step through the process of creating an ABApplication with the
       * current state of the Form.
       *
       * @param {obj} values  current value hash of the form values.
       */
      // async applicationCreate(values) {
      //    // on a CREATE, make sure .name is set:
      //    values.name = values.label;

      //    // work with a new ABApplication
      //    var app = this.AB.applicationMobileNew(values);
      //    try {
      //       await app.save();
      //       webix.message({
      //          type: "success",
      //          text: L("{0}&nbsp; Successfully Created", [values.label]),
      //       });

      //       // NOTE: the new App isn't actually stored in AB.applications()
      //       // until after the 'ab.abdefinition.created' message is returned
      //       // from the Server.

      //       // TODO: detect if our Network type is REST and then manually
      //       // add the Application to the AB factory.
      //    } catch (e) {
      //       webix.message({
      //          type: "error",
      //          text: L("Error Creating {0}", [values.label]),
      //       });
      //       this.AB.notify.developer(e, {
      //          plugin: "ABDesigner",
      //          context: "ui_choose_form:applicationCreate()",
      //          values,
      //       });
      //    }
      // }

      /**
       * @method applicationUpdate
       * Step through the process of updating an ABApplication with the
       * current state of the Form.
       * @param {ABApplication} application
       */
      // async applicationUpdate(Application) {
      //    var values = this.formValues();
      //    // {hash} /key : value
      //    // the new values pulled from the form

      //    var oldVals = {};
      //    // {hash} /key : value
      //    // a set of the original values to reset to incase of an error saving.

      //    Object.keys(values).forEach((k) => {
      //       oldVals[k] = Application[k];
      //       Application[k] = values[k];
      //    });

      //    try {
      //       await Application.save();
      //       webix.message({
      //          type: "success",
      //          text: L("{0} Successfully Updated", [Application.label]),
      //       });
      //    } catch (e) {
      //       webix.message({
      //          type: "error",
      //          text: L("Error Updating {0}", [Application.label]),
      //       });
      //       this.AB.notify.developer(e, {
      //          context: "ui_choose_form:applicationUpdate()",
      //          application: Application.toObj(),
      //          values,
      //       });
      //       // Reset our Application to the original values.
      //       Object.keys(oldVals).forEach((k) => {
      //          Application[k] = oldVals[k];
      //       });
      //    }

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
      // }

      /**
       * @function buttonSaveClick
       * Process the user clicking on the [Save] button.
       */
      async buttonSaveClick() {
         this.buttonSaveDisable();
         this.formBusy();

         const App = this.CurrentApplication;

         var values = this.formValues();
         values.menuType = this.menuType;
         var newPage = App.pageNew(values);

         await newPage.save();
         this.formReset();
         this.toList();

         this.formReady();
         this.buttonSaveEnable();
         $$(this.ids.component).hide();
         // this.emit("done");
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
         // $$(this.ids.component).hide();
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
         $$(this.ids.form).showProgress({ type: "icon" });
      }

      /**
       * @methoc formPopulate()
       * populate the form values from the given ABApplication
       * @param {ABApplication} application  instance of the ABApplication
       */
      formPopulate(application) {
         super.applicationLoad(application);

         let $form = $$(this.ids.form);
         // Populate data to form
         if (application) {
            [
               "label",
               "description",
               "version",
               "icon",
               "isSystemObject",
               "isAccessManaged",
               "isTranslationManaged",
               "isTutorialManaged",
               "networkType",
            ].forEach((f) => {
               if ($form.elements[f]) {
                  $form.elements[f].setValue(
                     application[f] || application.json[f]
                  );
               }
            });

            // populate access manager ui
            var $accessManager = $$(this.ids.accessManager);
            if ($accessManager) {
               $accessManager.removeView($accessManager.getChildViews()[0]);
               $accessManager.addView(
                  this.accessManagerUI.ui(application.accessManagers || {}),
                  0
               );
            }

            // populate translation manager ui
            var $translationManager = $$(this.ids.translationManager);
            if ($translationManager) {
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

            // populate tutorial manager ui
            var $tutorialManager = $$(this.ids.tutorialManager);
            if ($tutorialManager) {
               $tutorialManager.removeView($tutorialManager.getChildViews()[0]);
               $tutorialManager.addView(
                  this.tutorialManagerUI.ui(application.tutorialManagers || {}),
                  0
               );
            }
         }

         this.permissionPopulate(application);
      }

      /**
       * @function formReady()
       *
       * remove the busy indicator from the form.
       */
      formReady() {
         $$(this.ids.form).hideProgress();
      }

      /**
       * @function formReset()
       *
       * return the form to an empty state.
       */
      formReset() {
         super.applicationLoad(null);

         $$(this.ids.form).clear();
         $$(this.ids.form).clearValidation();

         // this.permissionPopulate(); // leave empty to clear selections.

         // $$(this.ids.accessManager).removeView(
         //    $$(this.ids.accessManager).getChildViews()[0]
         // );
         // $$(this.ids.translationManager).removeView(
         //    $$(this.ids.translationManager).getChildViews()[0]
         // );
         // $$(this.ids.accessManager).addView(this.accessManagerUI.ui(), 0);
         // $$(this.ids.translationManager).addView(
         //    this.translationManagerUI.ui(),
         //    0
         // );
         // $$(this.ids.tutorialManager).addView(this.tutorialManagerUI.ui(), 0);
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

         if (!$$(this.ids.form).validate()) {
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
               var mockApp = this.AB.applicationMobileNew(values);
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
                     msg: L("&nbsp; Name ({0}) is already in use.", [
                        mockApp.label,
                     ]),
                  });
               }
               break;
         }

         if (errors.length > 0) {
            var hasFocus = false;
            errors.forEach((e) => {
               $$(this.ids.form).markInvalid(e.attr, e.msg);
               if (!hasFocus) {
                  $$(this.ids.form).elements[e.attr].focus();
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
         const values = $$(this.ids.form).getValues();

         return values;
      }

      /**
       * @function permissionAddNew
       *
       * create a new permission entry based upon the current Application.label
       *
       * This not only adds it to our Permission List, but also selects it.
       *
       * @param {string} appName The Application.label of the current Application
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
      // permissionClick(id /*, e, node*/) {
      //    var List = $$(this.ids.appFormPermissionList);

      //    var item = List.getItem(id);

      //    if (List.getItem(id).isApplicationRole) {
      //       return;
      //    }

      //    if (List.isSelected(id)) {
      //       item.markCheckbox = 0;
      //       List.unselect(id);
      //    } else {
      //       item.markCheckbox = 1;
      //       var selectedIds = List.getSelectedId();

      //       if (typeof selectedIds === "string" || !isNaN(selectedIds)) {
      //          if (selectedIds) selectedIds = [selectedIds];
      //          else selectedIds = [];
      //       }

      //       selectedIds.push(id);

      //       List.select(selectedIds);
      //       List.updateItem(id, item);
      //    }
      // }

      /**
       * @function permissionName
       *
       * returns a formatted name for a Permission Role based upon the provided Application.label
       *
       * @param {string} appName the current value of the Application.label
       * @return {string}  Permission Role Name.
       */
      // permissionName(appName) {
      //    return appName + " Application Role";
      // }

      /**
       * @method permissionPopulate
       * fill out the Permission list
       * @param {ABApplication} application  the current ABApplication we are editing
       */
      // permissionPopulate(application) {
      //    const PermForm = $$(this.ids.appFormPermissionList);

      //    // Get user's roles
      //    const availableRoles = this.AB.Account.rolesAll().map((r) => {
      //       return { id: r.id, value: r.name };
      //    });

      //    if (application) {
      //       availableRoles
      //          .filter((r) => application.roleAccess.indexOf(r.id) > -1)
      //          .map((r) => {
      //             r.markCheckbox = 1;
      //          });
      //    }

      //    const selectedIDs = availableRoles
      //       .filter((r) => r.markCheckbox)
      //       .map((r) => r.id);

      //    // availableRoles.forEach(function (r) {
      //    //    if (selectedIDs.indexOf(r.id) > -1) {
      //    //       const item = PermForm.getValue();
      //    //       item.markCheckbox = 1;
      //    //    }
      //    // });

      //    PermForm.define("suggest", availableRoles);
      //    PermForm.setValue(selectedIDs);
      //    PermForm.refresh();
      // }

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
       * @param {ABApplication} App    The current Application we are working with.
       * @return {Promise}       .resolve( {Permission} ) if one is created for this App
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
      //    //    // Update store app data
      //    //    var applicationData = self.data.filter(function (d) { return d.id == app.id; });
      //    //    applicationData.forEach(function (app) {
      //    //       app.attr('permissions', $.map(permItems, function (item) {
      //    //          return {
      //    //             application: app.id,
      //    //             permission: item.id,
      //    //             isApplicationRole: item.isApplicationRole
      //    //          }
      //    //       }));
      //    //    });

      //    //    q.resolve(appRole);
      //    //    cb();
      //    // })
      // }

      /**
       * @function show()
       *
       * Show the Form Component.
       */
      show() {
         $$(this.ids.component).show();
         // Warnings.show(this.CurrentApplication);
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

   return new UI_Work_PWA_List_NewPage_Blank();
}
