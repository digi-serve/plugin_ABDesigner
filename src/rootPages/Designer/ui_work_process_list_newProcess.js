/*
 * ui_work_process_list_newProcess
 *
 * Display the form for creating a new Application.
 *
 */
import UI_Class from "./ui_class";
export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_Process_List_NewProcess extends UIClass {
      constructor() {
         super("ui_work_process_list_newProcess", {
            form: "",
            buttonCancel: "",
            buttonSave: "",
         });

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
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Add new Process"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.emit("cancel");
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
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
                              this.emit("cancel");
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

         webix.ui(this.ui());
         this.$component = $$(this.ids.component);
         this.$form = $$(this.ids.form);
         this.$buttonSave = $$(this.ids.buttonSave);
         webix.extend(this.$component, webix.ProgressBar);

         this.hide();
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

   return new UI_Work_Process_List_NewProcess();
}
