import UI_Class from "./ui_class";
import UI_Warnings from "./ui_warnings";

// import FWorkspaceViews from "./ui_work_object_workspace_workspaceviews";
// import FWorkspaceDisplay from "./ui_work_object_workspace_view_grid";
import FWorkspaceProperty from "./ui_work_version_workspace_properties";

export default function (AB, init_settings) {
   const ibase = "ui_work_version_workspace";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   // const Datatable = FWorkspaceDisplay(AB, `${ibase}_view_grid`, init_settings);
   const Property = FWorkspaceProperty(AB);

   const Warnings = UI_Warnings(AB, `${ibase}_view_warnings`, init_settings);

   class UI_Work_Version_Workspace extends UIClass {
      constructor(base, settings = {}) {
         super(base, {
            multiview: "",
            noSelection: "",
            workspace: "",
         });
         this.AB = AB;

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

         //
         var versionData = {
            versionNumber: "1.0.1",
            changelog: {
               "1.0.0": {
                  changeSize: 0, // the initial version has no changes, so the change size is 0
                  commitMessage: "Created App", // the commit message for the initial version
                  author: "Bob", // the name of the builder who created the initial version
                  timestamp: "2023-03-02T14:30:00.000Z", // the timestamp for the initial version
               },
               "1.0.1": {
                  changeSize: 1, // the size of the changes made in version 1.0.1
                  commitMessage: "Added a home page", // the commit message for version 1.0.1
                  author: "Ann", // the name of the builder who made the changes
                  timestamp: "2023-03-03T10:15:00.000Z", // the timestamp for version 1.0.1
               },
            },
         };

         function sortChangelogByVersion(changelogObj) {
            const changeData = changelogObj;
            // Get an array of the changelog object's keys (i.e. version numbers)
            const versionNumbers = Object.keys(changelogObj);

            // Sort the version numbers based on semantic versioning rules, with newest versions first
            const sortedVersionNumbers = versionNumbers.sort((a, b) => {
               const [aMajor, aMinor, aPatch] = a
                  .split(".")
                  .map((num) => parseInt(num));
               const [bMajor, bMinor, bPatch] = b
                  .split(".")
                  .map((num) => parseInt(num));

               if (aMajor !== bMajor) {
                  return bMajor - aMajor;
               } else if (aMinor !== bMinor) {
                  return bMinor - aMinor;
               } else {
                  return bPatch - aPatch;
               }
            });

            // Map the sorted versions to an array of objects that includes the version number and changelog info
            const sortedChangelog = sortedVersionNumbers.map((version) => {
               changelogObj[version]["versionNumber"] = version;
               console.dir(changeData[version].commitMessage);
               return {
                  version,
                  changelog: changelogObj[version],
                  commitMessage: changeData[version]["commitMessage"],
                  author: changeData[version]["author"],
                  timestamp: changeData[version]["timestamp"],
                  changeSize: changeData[version]["changeSize"],
               };
            });

            return sortedChangelog;
         }
         // Helper functions
         //  The getVersionOptions() function generates an array of version options that start from the current version
         // and go up by one for each of the three segments (major, minor, and patch).
         function getVersionOptions() {
            const versionNumber = versionData.versionNumber;
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
         function getVersionOptionByNumber(versionNumber) {
            const options = getVersionOptions();
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

         ///

         return {
            view: "multiview",
            id: ids.multiview,
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
                        view: "toolbar",
                        cols: [
                           { view: "label", label: "App Version" },
                           {
                              icon: "wxi-close",
                              view: "icon",
                              height: 38,
                              width: 38,
                           },
                        ],
                     },
                     {
                        // autoheight: false,
                        view: "form",
                        id: "versionForm",
                        rows: [
                           {
                              label: "Version number options for Current Changes",
                              view: "label",
                              height: 10,
                           },
                           {
                              cols: [
                                 {
                                    options: getVersionOptions(),
                                    view: "segmented",
                                    height: 40,
                                    value: getVersionOptionByNumber(
                                       versionData.versionNumber
                                    ),
                                 },
                                 { width: 15 },
                              ],
                           },
                           {
                              view: "text",
                              label: "Author",
                              name: "author",
                              labelPosition: "top",
                           },
                           {
                              label: "Release Notes",
                              view: "textarea",
                              name: "commitMessage",
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
                              // click: save_form,
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
               {
                  id: ids.workspace,
                  view: "layout",
                  rows: [
                     {
                        cols: [
                           // Workspace
                           // Datatable.ui(),

                           { view: "resizer", css: "bg_gray", width: 11 },

                           // Property
                           Property.ui(),
                        ],
                     },
                     Warnings.ui(),
                  ],
               },
            ],
         };
      }

      async init(AB) {
         const ids = this.ids;

         this.AB = AB;

         // this.warningsPropogate([Property, Datatable]);
         this.on("warnings", () => {
            Warnings.show(this.mockVersion);
         });

         // this.workspaceViews.init(AB);

         Property.on("save", async (version) => {
            this.versionLoad(version);

            // refresh grid view
            // if (this.hashViewsGrid) {
            //    await this.hashViewsGrid.show(Datatable.defaultSettings());
            // }

            await this.populateWorkspace(version);
         });

         // await Datatable.init(AB);
         await Property.init(AB);

         this.mockVersion = this.AB.versionNew({});
         this.mockVersion.init();

         // Datatable.versionLoad(this.mockVersion);
         Property.versionLoad(this.mockVersion);

         $$(ids.noSelection).show();
      }

      applicationLoad(application) {
         super.applicationLoad(application);

         // Datatable.applicationLoad(application);
         Property.applicationLoad(application);
      }

      versionLoad(version) {
         super.versionLoad(version);

         Warnings.show(version);

         // Datatable.versionLoad(version);
         Property.versionLoad(version);

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

         $$(ids.workspace).show();

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
   }

   return new UI_Work_Version_Workspace(ibase, init_settings);
}
