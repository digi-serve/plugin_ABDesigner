/*
 * ui_work_pwa_list_newPage.js
 *
 * Display the form for creating a new Page in this Mobile Application.
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
import UIPageBlank from "./ui_work_pwa_list_newPage_blank";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_PWA_List_NewPage extends UIClass {
      constructor() {
         super("ui_work_pwa_list_newPage", {
            tab: "",
         });

         // var callback = null;
         this.listPages = ["PageBlank" /* , "PageList", "PageForm" */];
         // {array} [ PageTypes ]
         // this is an array of the different Page Types we support.  At certain
         // points in the code, we want to cycle through all the types of pages
         // and perform some setup steps.

         this.PageBlank = UIPageBlank(AB);
      }

      ui() {
         const _self = this;

         // Our webix UI definition:
         var _ui = {
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
                     label: L("Add new Page"),
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
               cells: [], // [this.PageBlank.ui() /*, this.AppMobile.ui() */],
               tabbar: {
                  on: {
                     onAfterTabClick: (id) => {
                        this.switchTab(id);
                     },
                     onAfterRender() {
                        // assign the webix generated .id to each of our
                        // pages' .tabValue
                        this.config.options.forEach((o) => {
                           _self.listPages.forEach((p) => {
                              if (o.value == _self[p].tabLabel) {
                                 _self[p].tabValue = o.id;
                              }
                           });
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

         this.listPages.forEach((p) => {
            // add each of our page types to our tab lists:
            _ui.body.cells.push(this[p].ui());
         });

         return _ui;
      }

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$component = $$(this.ids.component);

         var allInits = [];
         this.listPages.forEach((p) => {
            allInits.push(this[p].init(AB));
            this[p].on("done", () => {
               this.emit("done");
               this.hide();
            });
            this[p].on("cancel", () => {
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
         this.listPages.forEach((p) => {
            this[p].formReset();
         });
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

         this.listPages.forEach((p) => {
            this[p].applicationLoad(application);
         });
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
      // done(obj) {
      //    console.error("WHO IS CALLING THIS?");
      //    this.ready();
      //    this.hide(); // hide our popup
      //    this.emit("save", obj);
      // }

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
      show(menuType) {
         if (this.$component) this.$component.show();
         this.listPages.forEach((p) => {
            this[p].menuType = menuType;
         });
      }

      switchTab(tabId) {
         this.listPages.forEach((p) => {
            if (tabId == this[p]?.ids.form) {
               this[p]?.onShow?.(this.CurrentApplicationID);
            }
         });
      }
   }

   return new UI_Work_PWA_List_NewPage();
}
