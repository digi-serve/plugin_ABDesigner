/*
 * ui_choose_list_newApp.js
 *
 * Display the form for creating a new Application.  This Popup will manage the
 * different sub components for gathering Application data for saving.
 *
 * The sub components will gather the data for the application and do basic form
 * validations on their interface.
 *
 * when ready, the sub component will emit "save" with the values gathered by
 * the form.  This component will manage the actual final App validation,
 * and saving to the server.
 *
 * On success, "save.success" will be emitted on the sub-component, and this
 * component.
 *
 * On Error, "save.error" will be emitted on the sub-component.
 *
 */
import UI_Class from "./ui_class";
import UIAppWeb from "./ui_choose_form";
import UIAppMobile from "./ui_choose_list_newApp_mobile";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Choose_List_NewApp extends UIClass {
      constructor() {
         super("ui_choose_list_newApp", {
            tab: "",
         });

         this.selectNew = true;
         // {bool} do we select a new object after it is created.

         // var callback = null;

         this.AppWeb = UIAppWeb(AB);
         this.AppMobile = UIAppMobile(AB);
      }

      ui() {
         const _self = this;

         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            // width: 400,
            position: "center",
            modal: true,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Add new Application"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.hide();
                        // this.emit("cancel");
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            // selectNewObject: true,
            body: {
               view: "tabview",
               id: this.ids.tab,
               cells: [this.AppWeb.ui(), this.AppMobile.ui()],
               tabbar: {
                  on: {
                     onAfterTabClick: (id) => {
                        this.switchTab(id);
                     },
                     onAfterRender() {
                        this.config.options.forEach((o) => {
                           if (o.value == _self.AppMobile.tabLabel) {
                              _self.AppMobile.tabValue = o.id;
                           } else {
                              _self.AppWeb.tabValue = o.id;
                           }
                        });
                        this.$view
                           .querySelectorAll(".webix_item_tab")
                           .forEach((t) => {
                              var tid = t.getAttribute("button_id");
                              UIClass.CYPRESS_REF(t, `${tid}_tab`);
                           });
                     },
                  },
               },
            },
            on: {
               onBeforeShow: () => {
                  var id = $$(this.ids.tab).getValue();
                  this.switchTab(id);
               },
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$component = $$(this.ids.component);

         var allInits = [];
         ["AppWeb", "AppMobile"].forEach((k) => {
            allInits.push(this[k].init(AB));
            this[k].on("view.list", () => {
               this.hide();
            });
            this[k].on("cancel", () => {
               this.hide();
            });
            // this[k].on("save", (values) => {
            //    this.save(values, k);
            // });
         });

         return Promise.all(allInits);
      }

      /**
       * @method clear()
       * clear the add forms.
       */
      clear() {
         this.AppWeb.formReset();
         this.AppMobile.formReset();
      }

      /**
       * @function hide()
       *
       * remove the busy indicator from the form.
       */
      hide() {
         this.$component?.hide();
      }

      /**
       * Show the busy indicator
       */
      busy() {
         this.$component?.showProgress?.();
      }

      applicationLoad(application) {
         super.applicationLoad(application);

         if (!application.isMobile) {
            this.AppWeb.formPopulate(application);
            this.AppMobile.formReset();
            $$(this.ids.tab).setValue(this.AppWeb.tabValue);
         } else {
            this.AppWeb.formReset();
            this.AppMobile.formPopulate(application);
            $$(this.ids.tab).setValue(this.AppMobile.tabValue);
            // this.switchTab(this.AppMobile?.ids.form);
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         this.$component?.hideProgress?.();
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {object} obj
       */
      done(obj) {
         console.error("WHO IS CALLING THIS?");
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj);
      }

      /**
       * @method save
       * take the data gathered by our child creation tabs, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @param {string}  tabKey
       *        the "key" of the tab initiating the save.
       * @return {Promise}
       */
      /*
      async save(values, tabKey) {
         // create a new (unsaved) instance of our object:
         var newObject = this.AB.objectNew(values);

         // have newObject validate it's values.
         var validator = newObject.isValid();
         if (validator.fail()) {
            this[tabKey].emit("save.error", validator);
            // cb(validator); // tell current Tab component the errors
            return false; // stop here.
         }

         if (!newObject.createdInAppID) {
            newObject.createdInAppID = this.CurrentApplicationID;
         }

         // show progress
         this.busy();

         var application = this.CurrentApplication;

         // if we get here, save the new Object
         try {
            var obj = await newObject.save();
            await application.objectInsert(obj);
            this[tabKey].emit("save.successful", obj);
            this.done(obj);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the current application.
            await application.objectRemove(newObject);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }
      */
      /**
       * @function show()
       * Show this component.
       */
      show(shouldSelectNew) {
         if (shouldSelectNew != null) {
            this.selectNew = shouldSelectNew;
         }
         if (this.$component) this.$component.show();
      }

      switchTab(tabId) {
         if (tabId == this.AppWeb?.ids.form) {
            this.AppWeb?.onShow?.(this.CurrentApplicationID);
         } else if (tabId == this.AppMobile?.ids.form) {
            this.AppMobile?.onShow?.(this.CurrentApplicationID);
         }
      }
   }

   return new UI_Choose_List_NewApp();
}
