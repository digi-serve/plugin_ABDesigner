import UI_Class from "./ui_class";

export default function (AB, init_settings) {
   const ibase = "ui_work_version_workspace";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

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
                        css: "webix_dark",
                        id: this.ids.versionOption,
                        view: "toolbar",
                        cols: [
                           { width: 12 },
                           { view: "label", label: "App Version" },
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
                              hidden: true,
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

         $$(ids.noSelection).show();
      }

      applicationLoad(application) {
         super.applicationLoad(application);
         let versionData = this.getVersionData(application); //|| application.json.versionData;

         // fill the version numbers
         this.versionNumber = versionData?.versionNumber
            ? versionData.versionNumber
            : "1.0.0";
         this.CurrentVersionID = this.versionNumber; // SET Default selected version

         this.setOptions(this.versionNumber);
         // var versionOptions = this.$versionOption;
         // if (versionOptions) {
         //    versionOptions.data.options = this.getVersionOptions(
         //       this.versionNumber
         //    );
         //    versionOptions.refresh();
         // }
      }

      getVersionData(AB) {
         AB = AB || this.CurrentApplication;
         let versionData = AB.versionData || AB.json.versionData;
         if (!versionData) {
            this.AB.notify.developer("there is no versionData", {
               context: "ui_work_version_workspace:getVersionData()",
               application: AB.toObj(),
            });
         }
         return versionData;
      }

      setOptions(vNumber) {
         let versionOptions = this.$versionOption;
         if (versionOptions) {
            versionOptions.data.options = this.getVersionOptions(vNumber);
            versionOptions.refresh();
         }
      }

      versionLoad(version) {
         if (!version) {
            this.clearForm();
            return false;
         }
         super.versionLoad(version);

         this.$versionOption.disable();
         $$("save_button").hide();
         $$("update_button").show();
         $$("version").show();
         $$("timestamp").show();
         $$("export_button").hide();

         // load the selected version data into the form
         this.$form.setValues(version);
         this.setOptions(this.versionNumber);
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
         this.setOptions(this.versionNumber);
         this.$versionOption.refresh();
      }

      loadData(data) {
         console.error("no function should be here", data);
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

         // get version number option
         formVals["version"] = this.getVersionNumber(
            this.$versionOption.$getValue()
         );

         // set to current time
         formVals["timestamp"] = new Date().toISOString();

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
               context: "ui_work_version_workspace:getVersionNumber()",
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
       * @param {ABApplication, object} application, values to add
       */
      async applicationChangeLogAdd(AB, values) {
         let versionData = this.getVersionData(AB);
         var oldVersionNumber = versionData?.versionNumber;
         // string
         // the original version number to reset to incase of an error saving.

         let newVersionNumber = values.version;

         // Set only new Data, we want to keep the old version data
         versionData.changeLog[newVersionNumber] = values;
         versionData.versionNumber = newVersionNumber;

         AB.json["versionData"] = versionData;

         try {
            await AB.save();
            webix.message({
               type: "success",
               text: L(
                  "{0} Successfully logged update of ",
                  [AB.label],
                  " to version: ",
                  newVersionNumber
               ),
            });

            // update the UI
            this.versionNumber = newVersionNumber;
            this.clearForm();
            // emit, update the list
            this.emit("addNew", AB, newVersionNumber);
         } catch (e) {
            webix.message({
               type: "error",
               text: L(
                  "Error Updating {0}",
                  [AB.label],
                  " to version: ",
                  newVersionNumber
               ),
            });
            this.AB.notify.developer(e, {
               context: "ui_work_version_workspace:applicationChangeLogAdd()",
               application: AB.toObj(),
               values,
            });

            // reset the version number
            AB.versionData.versionNumber = oldVersionNumber;
            // Remove the unsaved object
            // ? does reflect work here?
            Reflect.deleteProperty(AB.versionData.changeLog, newVersionNumber);
         }
      }

      /**
       * @method applicationChangeLogUpdate
       * Step through the process of updating one of the logs for an ABApplication with the
       * current state of the Form.
       * @param {ABApplication} application
       */
      async applicationChangeLogUpdate(AB, values) {
         AB = this.CurrentApplication || AB;

         let updateVersionNum = values.version;

         let appData = this.getVersionData(AB);
         var oldVersion = appData.changeLog[updateVersionNum];
         // object
         // the original version to reset to incase of an error saving.

         if (!oldVersion) {
            // There is no old record to update..
            console.error("They are trying to change the version number...");
            // return this.applicationChangeLogAdd(Application, values);
         }

         // Set Data
         AB.json.versionData.changeLog[updateVersionNum] = values;

         try {
            await AB.save();
            webix.message({
               type: "success",
               text: L(
                  "{0} Successfully logged update of ",
                  [AB.label],
                  " to version: ",
                  updateVersionNum
               ),
            });
            this.emit("addNew", AB, values);
         } catch (e) {
            webix.message({
               type: "error",
               text: L(
                  "Error Updating {0}",
                  [AB.label],
                  " to version: ",
                  updateVersionNum
               ),
            });
            this.AB.notify.developer(e, {
               context:
                  "ui_work_version_workspace:applicationChangeLogUpdate()",
               application: AB.toObj(),
               values,
            });

            // reset the version number
            AB.json.versionData.versionNumber = oldVersion.versionNumber;
            // Remove the unsaved object
            Reflect.deleteProperty(
               AB.json.versionData.changeLog,
               updateVersionNum
            );
         }
      }
   }

   return new UI_Work_Version_Workspace(ibase, init_settings);
}
