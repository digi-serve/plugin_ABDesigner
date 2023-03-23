import UI_Class from "./ui_class";
import UI_Warnings from "./ui_warnings";

export default function (AB, init_settings) {
   const ibase = "ui_work_version_workspace";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

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
      }

      ui() {
         const ids = this.ids;

         return {
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
                        cols: [{ view: "label", label: "App Version" }],
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
                              id: "save_button",
                              label: "Save Log Message",
                              view: "button",
                              height: 38,
                              type: "icon",
                              css: "webix_primary",
                              disabled: false,
                              click: () => {
                                 return this.saveNew();
                              },
                           },
                           {
                              id: "update_button",
                              label: "Update Change Log",
                              view: "button",
                              height: 38,
                              type: "icon",
                              css: "webix_primary",
                              disabled: false,
                              click: () => {
                                 return this.saveUpdate();
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

         $$(ids.noSelection).show();
      }

      applicationLoad(application) {
         super.applicationLoad(application);

         // fill the version numbers
         this.versionNumber = application.versionData.versionNumber || "1.0.0";
         this.CurrentVersionID =
            application.versionData.versionNumber || "1.0.0";

         var versionOptions = this.$versionOption;
         if (versionOptions) {
            versionOptions.data.options = this.getVersionOptions(
               this.versionNumber
            );
            versionOptions.refresh();
         }
      }

      versionLoad(version) {
         if (!version) {
            this.clearForm();
            return false;
         }
         super.versionLoad(version);

         // Warnings.show(version);
         console.dir($$(this.ids.form));

         this.$versionOption.disable();
         $$("save_button").hide();
         $$("update_button").show();
         $$("version").show();
         $$("timestamp").show();
         $$("export_button").hide();

         // load the selected version data into the form
         this.$form.setValues(version);
         this.$versionOption.refresh();

         this.versionData = version;
      }
      clearForm() {
         this.$versionOption.enable();
         $$("save_button").show();
         $$("update_button").hide();
         $$("version").hide();
         $$("timestamp").hide();
         $$("export_button").show();

         // UNload the selected version data into the form
         this.$form.setValues({});
         this.$versionOption.refresh();
      }

      loadData(data) {
         this.mockVersion.clearAll();

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

      /**
       * @method saveNew
       * take the data entered into the form and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @return {Promise}
       */
      async saveNew() {
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
            this.emit("versionDataUpdate", true);
            this.toList();
         } catch (e) {
            /* error is handled in .applicationChangeLogAdd() */
         }
         // this.ready();
      }
      /**
       * @method saveUpdate
       * take the data entered into the form and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @return {Promise}
       */
      async saveUpdate() {
         var Form = this.$form;
         let formVals = Form.getValues();
         console.dir(formVals);

         let importantValues = {};
         importantValues["version"] = formVals.version;
         importantValues["author"] = formVals.author;
         importantValues["date"] = formVals.date;
         importantValues["commitMessage"] = formVals.commitMessage;

         // is this error needed?
         if (!this.CurrentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            return false;
         }

         try {
            await this.applicationChangeLogUpdate(
               this.CurrentApplication,
               formVals
            );
            this.emit("versionDataUpdate", true);
            this.toList();
         } catch (e) {
            /* error is handled in .applicationChangeLogUpdate() */
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
            this.emit("addNew", Application, newVersionNumber);
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

      /**
       * @method applicationChangeLogUpdate
       * Step through the process of updating one of the logs for an ABApplication with the
       * current state of the Form.
       * @param {ABApplication} application
       */
      async applicationChangeLogUpdate(Application, values) {
         Application = this.CurrentApplication || Application;

         let updateVersionNum = values.version;

         var oldVersion = Application.versionData.changeLog[updateVersionNum];
         // object
         // the original version to reset to incase of an error saving.

         if (!oldVersion) {
            // There is no old record to update..
            console.error("They are trying to change the version number...");
            // return this.applicationChangeLogAdd(Application, values);
         }

         // Set Data
         Application.versionData.changeLog[updateVersionNum] = values;
         // Application.versionData.versionNumber = updateVersionNum;
         // Application.versionNumber = updateVersionNum;

         try {
            await Application.save();
            webix.message({
               type: "success",
               text: L(
                  "{0} Successfully logged update of ",
                  [Application.label],
                  " to version: ",
                  updateVersionNum
               ),
            });
            this.emit("addNew", Application, updateVersionNum);
         } catch (e) {
            webix.message({
               type: "error",
               text: L(
                  "Error Updating {0}",
                  [Application.label],
                  " to version: ",
                  updateVersionNum
               ),
            });
            this.AB.notify.developer(e, {
               context: "ui_choose_form:applicationChangeLogUpdate()",
               application: Application.toObj(),
               values,
            });

            // reset the version number
            Application.versionData.versionNumber = oldVersionNumber;
            // Remove the unsaved object
            // ? does reflect work here?
            Reflect.deleteProperty(
               Application.versionData.changeLog,
               updateVersionNum
            );
         }
      }
   }

   return new UI_Work_Version_Workspace(ibase, init_settings);
}
