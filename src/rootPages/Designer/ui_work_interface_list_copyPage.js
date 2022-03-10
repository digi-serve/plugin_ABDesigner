/*
 * ab_work_interface_list_copyPage
 *
 * Display the form for duplicating an interface.
 *
 */
/*
 * UI_Work_Interface_List_CopyPage
 *
 * Display the form for copying a Page.  This Popup will allow user to rename and set parent.
 *
 * The sub components will gather the data for the object and do basic form
 * validations on their interface.
 *
 * when ready, this component will manage the actual final object validation,
 * and save to this.application.
 *
 * On success, "save" will be emitted, with obj passed so it can be selected in parent view
 *
 *
 */

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Interface_List_NewPage extends AB.ClassUI {
      constructor() {
         var base = "ab_work_interface_list_copyInterface";
         super({
            component: base,
            form: `${base}_blank`,
            buttonSave: `${base}_save`,
            buttonCancel: `${base}_cancel`,
         });
         this.ids.parentList = {};

      }

      ui(oldName) {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            width: 400,
            position: "center",
            modal: true,
            head: L("Copy interface"),
            selectNewInterface: true,
            body: {
               view: "form",
               id: this.ids.form,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validatePageName
               },
               elements: [
                  {
                     view: "select",
                     id: this.ids.parentList,
                     label: L("Parent Page"),
                     name: "parent",
                     options: [],
                     placeholder: L("[ Root Page ]"),
                     labelWidth: 110,
                  },
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: `${oldName} - ${L("copy")}`,
                     labelWidth: 110,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(
                              this,
                              "ui_work_interface_list_newPage_blank_name"
                           );
                        },
                     },
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
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Paste Page"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
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
            on: {
               onBeforeShow: () => {
                  // var id = $$(this.ids.tab).getValue();
                  // this.switchTab(id);
               },
            },
         };
      }

      async init(AB, data) {
         this.AB = AB;
         this.data = data;
         console.log(data);

         webix.ui(this.ui(data.name));
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$form = $$(this.ids.form);

         this.$component = $$(this.ids.component);

         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      /**
       * @method applicationLoad()
       * prepare ourself with the current application
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.currentApplication = application; // remember our current Application.
         var options = [{ id: "-", value: L("[Root page]") }];

         var addPage = function (page, indent) {
            indent = indent || "";
            options.push({
               id: page.urlPointer(),
               value: indent + page.label,
            });
            page
               // .pages((p) => p instanceof AB.Class.ABViewPage)
               .pages()
               .forEach(function (p) {
                  addPage(p, indent + "-");
               });
         };
         // this.currentApplication.pages((p) => p instanceof AB.Class.ABViewPage).forEach(
         this.currentApplication.pages().forEach(function (page) {
            addPage(page, "");
         });

         if($$(this.ids?.parentList)?.define){
            $$(this.ids?.parentList).define("options", options);
            $$(this.ids?.parentList).refresh();
         }
      }

      /**
       * @function hide()
       *
       * remove the busy indicator from the form.
       */
      hide() {
         this?.$component?.hide();
      }

      /**
       * @function cancel()
       *
       * remove the form.
       */
      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      /**
       * Show the busy indicator
       */
      busy() {
         this?.$component?.showProgress();
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         this?.$component?.hideProgress();
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {interface} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj); // tell parent component we're done
      }

      /**
       * @method save
       * verify the current info is ok, package it, and return it to be
       * added to the application.createModel() method.
       * then take the data gathered, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @return {Promise}
       */
      async save() {
         var saveButton = $$(this.ids.buttonSave);
         saveButton.disable();
         // show progress
         this.busy();

         var Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            saveButton.enable();
            this.ready();
            return false;
         }

         var values = Form.getValues();

         // must have an application set.
         if (!this.currentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this.emit("save.error", true);
            return false;
         }

         if (!values) {
            // SaveButton.enable();
            // CurrentEditor.formReady();
            return;
         }

         if (values.parent === "-") {
            values.parent = null;
         } else if (values.parent) {
            // convert a url string to the object of the parent
            values.parent = this.currentApplication.urlResolve(values.parent);
         }

         //  if (values.parent) {
         var newPage = this.data;

         newPage
            .copy(null, values.parent, { newName: values.name })
            .then((copiedPage) => {
               // .copy() should save ...........
               //  copiedPage.save()
               // .then((copiedPage) => {
               this.emit("save.successful", copiedPage);
               this.done(copiedPage);
            })
            .catch((err) => {
               this.ready();
               var strError = err.toString();
               webix.alert({
                  title: "Error copying page",
                  ok: "fix it",
                  text: strError,
                  type: "alert-error",
               });
               console.log(err);
            });
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         this?.$component?.show();
      }

      formClear() {
         this?.$form.clearValidation();
         this?.$form.clear();
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_interface_list_newPage object had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of objects:
       *        - A javascript Error() object
       *        - An ABValidation object returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            var message = L("the entered data is invalid");
            // if this was our Validation() object:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Page: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_interface_list_newPage successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         $$(this.ids.buttonSave).enable();
      }
   }

   return new UI_Work_Interface_List_NewPage();
}
