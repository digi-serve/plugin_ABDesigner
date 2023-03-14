import UI_Class from "./ui_class";
import UI_Warnings from "./ui_warnings";

// import FWorkspaceViews from "./ui_work_object_workspace_workspaceviews";
// import FWorkspaceDisplay from "./ui_work_object_workspace_view_grid";
// import FWorkspaceProperty from "./ui_work_version_workspace_properties";

export default function (AB, init_settings) {
   const ibase = "ui_work_version_workspace";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   // const Datatable = FWorkspaceDisplay(AB, `${ibase}_view_grid`, init_settings);
   // const Property = FWorkspaceProperty(AB);

   const Warnings = UI_Warnings(AB, `${ibase}_view_warnings`, init_settings);

   class UI_Work_Version_Workspace extends UIClass {
      constructor(base, settings = {}) {
         super(base, {
            form: "",
            versionForm: "",
            versionOption: "",
            multiview: "",
            noSelection: "",
            workspace: "",
         });
         this.AB = AB;

         this.versionNumber = "1.0.0";

         this.settings = settings;

         // this.workspaceViews = FWorkspaceViews(AB, `${base}_views`, settings);
         // this.hashViewsGrid = Datatable;
      }

      ui() {
         const ids = this.ids;
         ///

         function save_form() {
            var form = $$("versionForm");
            if (form.isDirty()) {
               if (!form.validate()) return false;
               form.save();
               var data = form.getValues();
               var list = $$("versionList");
               var id = list.getSelectedId();
               if (id) {
                  list.updateItem(id, data);
               } else {
                  list.add(data);
               }
            }
         }
         function save_draft_form() {
            var form = $$("versionForm");
            if (form.isDirty()) {
               if (!form.validate()) return false;
               form.save();
               var data = form.getValues();
               var list = $$("versionList");
               var id = list.getSelectedId();
               if (id) {
                  list.updateItem(id, data);
               } else {
                  list.add(data);
               }
            }
         }

         ///

         return {
            // view: "multiview",
            // id: ids.multiview,
            cells: [
               // No selection
               {
                  id: ids.noSelection,
                  rows: [
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                     {
                        css: "webix_dark",
                        id: this.ids.versionOption,
                        view: "toolbar",
                        cols: [
                           { view: "label", label: "App Version" },
                           // {
                           //    icon: "wxi-close",
                           //    view: "icon",
                           //    height: 38,
                           //    width: 38,
                           // },
                        ],
                     },
                     {
                        // autoheight: false,
                        view: "form",
                        // id: "versionForm",
                        id: this.ids.form,
                        rows: [
                           {
                              label: "Version number options for Current Changes",
                              view: "label",
                              height: 10,
                           },
                           {
                              cols: [
                                 {
                                    id: this.ids.versionOption,
                                    options: this.getVersionOptions(
                                       this.versionNumber || "1.0.0"
                                    ),
                                    view: "segmented",
                                    height: 40,
                                    value: this.getVersionOptionByNumber(
                                       this.versionNumber
                                    ),
                                 },
                                 { width: 15 },
                              ],
                           },
                           {
                              view: "text",
                              label: "Author",
                              name: "author",
                              id: "author",
                              labelPosition: "top",
                           },
                           {
                              label: "Release Notes",
                              view: "textarea",
                              name: "commitMessage",
                              id: "commitMessage",
                              labelPosition: "top",
                              placeholder:
                                 "Explain your changes. Users will see this.",
                           },
                           {
                              view: "text",
                              label: "Version Number",
                              name: "version",
                              id: "version",
                              labelPosition: "top",
                              hidden: true,
                           },
                           {
                              view: "text",
                              label: "Date",
                              name: "timestamp",
                              id: "timestamp",
                              labelPosition: "top",
                              hidden: true,
                           },
                           {
                              view: "checkbox",
                              label: "Force keep this version",
                              name: "keepVersion",
                              id: "keepVersion",
                              labelPosition: "top",
                              hidden: true,
                           },

                           {
                              id: "save_button_1",
                              label: "Save Log Message",
                              view: "button",
                              height: 38,
                              type: "icon",
                              css: "webix_primary",
                              // icon: "fa fa-download",
                              disabled: false,
                              // click: save_draft_form,
                           },
                           {
                              id: "save_button_2",
                              label: "Save Change Log as Completed",
                              view: "button",
                              height: 38,
                              type: "icon",
                              css: "webix_primary",
                              // icon: "fa fa-download",
                              disabled: false,
                              click: () => {
                                 return this.save();
                              },
                           },
                           {
                              id: "rollback_button",
                              label: "Rollback module to this version",
                              view: "button",
                              height: 38,
                              type: "icon",
                              css: "webix_primary",
                              disabled: false,
                              // click: rollback_to_old_version,
                              hidden: true,
                           },

                           {
                              id: "export_button",
                              label: "Export",
                              view: "button",
                              height: 38,
                              type: "icon",
                              css: "webix_primary",
                              icon: "fa fa-download",
                              disabled: false,
                              // click: export,
                           },
                        ],
                     },
                  ],
               },
               // {
               //    id: ids.workspace,
               //    view: "layout",
               //    rows: [
               //       {
               //          cols: [
               //             // Workspace
               //             // Datatable.ui(),

               //             { view: "resizer", css: "bg_gray", width: 11 },

               //             // Property
               //             Property.ui(),
               //          ],
               //       },
               //       Warnings.ui(),
               //    ],
               // },
            ],
         };
      }

      async init(AB) {
         const ids = this.ids;

         this.AB = AB;
         this.$form = $$(this.ids.form);
         this.$versionOption = $$(this.ids.versionOption);

         // this.warningsPropogate([Property, Datatable]);
         this.on("warnings", () => {
            Warnings.show(this.mockVersion);
         });

         // this.workspaceViews.init(AB);

         // Property.on("save", async (version) => {
         //    this.versionLoad(version);

         //    // refresh grid view
         //    // if (this.hashViewsGrid) {
         //    //    await this.hashViewsGrid.show(Datatable.defaultSettings());
         //    // }

         //    await this.populateWorkspace(version);
         // });

         // // await Datatable.init(AB);
         // await Property.init(AB);

         // ! datacollection stuff???
         // this.mockVersion = this.AB.versionNew({});
         // this.mockVersion.init();

         // // Datatable.versionLoad(this.mockVersion);
         // Property.versionLoad(this.mockVersion);

         $$(ids.noSelection).show();
      }

      applicationLoad(application) {
         super.applicationLoad(application);

         // TODO fill the default version numbers
         console.dir("Fill default version numbers");
         this.versionNumber = application.versionData.versionNumber || "1.0.0";

         var versionOptions = this.$versionOption;
         if (versionOptions) {
            versionOptions.data.options = this.getVersionOptions(
               this.versionNumber
            );
            versionOptions.refresh();
         }
      }

      versionLoad(version) {
         super.versionLoad(version);

         // Warnings.show(version);
         console.dir($$(this.ids.form));

         // this.$versionOption.hide();
         this.$versionOption.disable();
         $$("save_button_1").hide();
         $$("save_button_2").hide();
         $$("version").show();
         $$("timestamp").show();

         this.$form.setValues(version); //.refresh();

         this.versionData = version;
         // TODO load the selected version data into the form
         console.dir("load the selected version data into the form");

         // $$("commitMessage").();

         // Property.versionLoad(version);

         if (!version) {
            this.clearWorkspace();
         }
      }
      versionUnload(version) {
         super.versionLoad(version);

         // Warnings.show(version);
         console.dir($$(this.ids.form));

         $$("versionList").unselectAll();
         this.$versionOption.show();
         $$("save_button_1").show();
         $$("save_button_2").show();
         $$("versionForm").show();
         $$("version").hide();
         $$("timestamp").hide();

         this.versionData = version;
         // TODO UNload the selected version data into the form
         console.dir("load the selected version data into the form");
         // Property.versionLoad(version);

         if (!version) {
            this.clearWorkspace();
         }
      }

      /**
       * @function loadAll
       * Load all records
       *
       */
      loadAll() {
         // Datatable.loadAll();
      }

      loadData() {
         this.mockVersion.clearAll();
         // WORKAROUND: load all data becuase kanban does not support pagination now
         try {
            this.mockVersion.loadData(0, 20);
         } catch (err) {
            let message = err.toString();
            if (typeof err == "string") {
               try {
                  const jErr = JSON.parse(err);
                  if (jErr.data && jErr.data.sqlMessage) {
                     message = jErr.data.sqlMessage;
                  }
               } catch (e) {
                  // Do nothing
               }
            }

            this.AB.notify.developer(err, {
               context: "ui_work_version_workspace.loadData()",
               message,
               version: this.mockVersion.toObj(),
            });
         }
      }

      clearWorkspace() {
         const ids = this.ids;

         $$(ids.noSelection).show(false, false);
      }

      async populateWorkspace(version) {
         const ids = this.ids;

         // $$(ids.workspace).show();

         this.mockVersion = version;

         // get current view from object
         // this.workspaceViews.objectLoad(this.mockVersion.datasource);
         // const currentView = this.workspaceViews.getCurrentView();

         // // {WorkspaceView}
         // // The current workspace view that is being displayed in our work area
         // // currentView.component {ABViewGrid}
         // if (this.hashViewsGrid) {
         //    this.workspaceViews.setCurrentView(currentView.id);

         //    await this.hashViewsGrid.show(currentView);
         // }

         // save current view
         // await this.workspaceViews.save();

         this.loadData();

         this.warningsRefresh(version);
      }
      /**
       * @method save
       * take the data entered into the form and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @return {Promise}
       */
      async save() {
         var Form = this.$form;
         let formVals = Form.getValues();
         console.dir(formVals);

         // get version number option
         formVals["version"] = this.getVersionNumber(
            this.$versionOption.$getValue()
         );

         // is this error needed?
         if (!this.CurrentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            return false;
         }

         try {
            await this.applicationChangeLogAdd(
               this.CurrentApplication,
               formVals
            );
            this.toList();
         } catch (e) {
            /* error is handled in .applicationChangeLogAdd() */
         }
         // this.ready();
      }

      /**
       * @function getVersionNumber
       * Extracts the version number from a string.
       * @param {string} string The input string to extract the version number from.
       * @return {string|null} The version number if found in the input string, otherwise null.
       */

      getVersionNumber(string) {
         const pattern = /^(\d+\.\d+\.\d+)/;
         const match = pattern.exec(string);
         if (match) {
            return match[1];
         } else {
            const e = new Error(
               "Failed to extract version number from input string."
            );
            this.AB.notify.developer(e, {
               context: "ui_choose_form:applicationChangeLogAdd()",
               application: this.Application.toObj(),
               string,
            });
            return null;
         }
      }

      // Helper functions
      //  The getVersionOptions() function generates an array of version options that start from the current version
      // and go up by one for each of the three segments (major, minor, and patch).
      getVersionOptions(versionNumber) {
         // const versionNumber = versionData.;
         const major = versionNumber.split(".")[0];
         const minor = versionNumber.split(".")[1];
         const patch = versionNumber.split(".")[2];
         const options = [
            `${parseInt(major) + 1}.0.0 <i>major</i>`,
            `${major}.${parseInt(minor) + 1}.0 <i>minor</i>`,
            `${major}.${minor}.${parseInt(patch) + 1} <i>patch</i>`,
         ];
         return options;
      }
      // The getVersionOptionByNumber(versionNumber) function takes a version number and returns the
      // corresponding option from the array generated by getVersionOptions().
      getVersionOptionByNumber(versionNumber) {
         const options = this.getVersionOptions(versionNumber);
         const major = versionNumber.split(".")[0];
         const minor = versionNumber.split(".")[1];
         const patch = versionNumber.split(".")[2];
         if (major > 1) {
            return `${major}.0.0 <i>major</i>`;
         } else if (minor > 91) {
            return `${major}.${minor}.0 <i>minor</i>`;
         } else {
            return `${major}.${minor}.${patch} <i>patch</i>`;
         }
      }

      /**
       * @method applicationChangeLogAdd
       * Step through the process of updating an ABApplication with the
       * current state of the Form.
       * @param {ABApplication} application
       */
      async applicationChangeLogAdd(Application, values) {
         Application = this.CurrentApplication || Application;
         var oldVersionNumber = Application.versionData.versionNumber;
         // string
         // the original version number to reset to incase of an error saving.

         let newVersionNumber = values.version;

         // Set Data
         Application.versionData.changeLog[newVersionNumber] = values;
         Application.versionData.versionNumber = newVersionNumber;
         Application.versionNumber = newVersionNumber;

         try {
            await Application.save();
            webix.message({
               type: "success",
               text: L(
                  "{0} Successfully logged update of ",
                  [Application.label],
                  " to version: ",
                  newVersionNumber
               ),
            });
         } catch (e) {
            webix.message({
               type: "error",
               text: L(
                  "Error Updating {0}",
                  [Application.label],
                  " to version: ",
                  newVersionNumber
               ),
            });
            this.AB.notify.developer(e, {
               context: "ui_choose_form:applicationChangeLogAdd()",
               application: Application.toObj(),
               values,
            });

            // reset the version number
            Application.versionData.versionNumber = oldVersionNumber;
            // Remove the unsaved object
            // ? does reflect work here?
            Reflect.deleteProperty(
               Application.versionData.changeLog,
               newVersionNumber
            );
         }
      }
   }

   return new UI_Work_Version_Workspace(ibase, init_settings);
}
