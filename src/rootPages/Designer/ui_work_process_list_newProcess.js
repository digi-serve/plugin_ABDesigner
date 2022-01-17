/*
 * ab_work_process_list_newProcess
 *
 * Display the form for creating a new Application.
 *
 */
export default function (AB) {
   const L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Process_List_NewProcess extends AB.ClassUI {
      constructor() {
         const base = "ab_work_process_list_newProcess";
         super({
            component: base,
            form: `${base}_form`,
            buttonCancel: `${base}_buttonCancel`,
            buttonSave: `${base}_buttonSave`,
         });

         // {ABApplication} the ABApplication we are currently working on.
         this.CurrentApplication = null;

         // {bool} do we select a new data collection after it is created.
         this.selectNew = true;
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            position: "center",
            modal: true,
            head: L("Create"),
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
                     placeholder: L("Enter process name"),
                     labelWidth: 70,
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
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Save"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      init(AB) {
         this.AB = AB;
         this.$component = $$(this.ids.component);
         this.$form = $$(this.ids.form);
         this.$buttonSave = $$(this.ids.buttonSave);
         webix.extend(this.$component, webix.ProgressBar);

         this.hide();
      }

      /**
       * @method applicationLoad()
       * prepare ourself with the current application
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplication = application; // remember our current Application.
      }

      /**
       * @method save
       * take the data gathered by our child creation tabs, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @return {Promise}
       */
      async save(values) {
         // must have an application set.
         if (!this.CurrentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this.emit("save.error", true);
            return false;
         }

         this.busy();

         try {
            // create a new process:
            let newProcess = await this.CurrentApplication.processCreate(
               values
            );
            this.emit("save", newProcess);
            this.clear();
            this.hide();
         } catch (err) {
            console.error(err);
            this.emit("save.error", err);
            return false;
         }

         this.ready();
         return true;
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if (this.$component) this.$component.show();
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
       * @function clear()
       *
       */
      clear() {
         this.$form.clearValidation();
         this.$form.clear();
         this.$buttonSave.enable();
      }

      /**
       * Show the busy indicator
       */
      busy() {
         if (this.$component && this.$component.showProgress) {
            this.$component.showProgress({ type: "icon" });
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         if (this.$component && this.$component.hideProgress) {
            this.$component.hideProgress();
         }
      }
   }

   return UI_Work_Process_List_NewProcess;
}
