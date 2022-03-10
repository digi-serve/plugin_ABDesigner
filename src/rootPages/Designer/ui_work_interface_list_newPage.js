/*
 * ab_work_interface_list_newPage
 *
 * Display the form for creating a new Application.
 *
 */
/*
 * UI_Work_Interface_List_NewPage
 *
 * Display the form for creating a new Page.  This Popup will manage several
 * different sub components for gathering Page data for saving.
 *
 * The sub components will gather the data for the object and do basic form
 * validations on their interface.
 *
 * when ready, the sub component will emit "save" with the values gathered by
 * the form.  This component will manage the actual final object validation,
 * and saving to this application.
 *
 * On success, "save.success" will be emitted on the sub-component, and this
 * component.
 *
 * On Error, "save.error" will be emitted on the sub-component.
 *
 */

import UIBlankPage from "./ui_work_interface_list_newPage_blank";
//import UIQuickPage from "./ui_work_interface_list_newPage_quick"

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Interface_List_NewPage extends AB.ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         var base = "ab_work_interface_list_newInterface";
         super({
            component: base,
            tab: `${base}_tab`,
         });

         this.selectNew = true;
         // {bool} do we select a new interface after it is created.

         // var callback = null;

         this.BlankTab = new UIBlankPage(AB);
         //this.QuickTab = new UIQuickPage(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            // width: 400,
            position: "center",
            modal: true,
            head: L("Add new interface"),
            selectNewInterface: true,
            body: {
               view: "tabview",
               id: this.ids.tab,
               cells: [
                  this.BlankTab.ui(),
                  //this.QuickTab.ui(),
               ],
               tabbar: {
                  on: {
                     onAfterTabClick: (id) => {
                        this.switchTab(id);
                     },
                     onAfterRender() {
                        this.$view
                           .querySelectorAll(".webix_item_tab")
                           .forEach((t) => {
                              var tid = t.getAttribute("button_id");
                              AB.ClassUI.CYPRESS_REF(t, `${tid}_tab`);
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
         this.$form = $$(this.ids.form);

         var allInits = [];
         ["BlankTab" /*, "QuickTab" */].forEach((k) => {
            allInits.push(this[k].init(AB));
            this[k].on("cancel", () => {
               this.emit("cancel");
            });
            this[k].on("save", (values) => {
               this.save(values, k);
            });
         });

         return Promise.all(allInits);
      }

      /**
       * @method applicationLoad()
       * prepare ourself with the current application
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.currentApplication = application; // remember our current Application.
         this.BlankTab.applicationLoad(application); // send so parent pagelist can be made
         //  this.QuickTab.applicationLoad(application);
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
       * Show the busy indicator
       */
      busy() {
         if (this.$component) {
            this.$component.showProgress();
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         if (this.$component) {
            this.$component.hideProgress();
         }
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {interface} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj, this.selectNew);
         // _logic.callbacks.onDone(null, obj, selectNew, callback); // tell parent component we're done
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
      async save(values, tabKey) {
         // must have an application set.
         if (!this.currentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this[tabKey].emit("save.error", true);
            return false;
         }

         if (!values) {
            // SaveButton.enable();
            // CurrentEditor.formReady();
            return;
         }

         // create a new (unsaved) instance of our interface:
         // this interface only creates Root Pages, or pages related to
         var newInterface = null;
         if (values.useParent && values.parent) {
            // ?????????????????
            newInterface = values.parent;
         } else if (values.parent) {
            newInterface = values.parent.pageNew(values);
         } else {
            //page = CurrentApplication.pageNew(values);
            newInterface = this.currentApplication.pageNew(values);
         }
         //

         // have newInterface validate it's values.
         // if this item supports isValid()
         if (newInterface.isValid) {
           var validator = newInterface.isValid();
           if (validator.fail()) {
             // cb(validator); // tell current Tab component the errors
             this[tabKey].emit("save.error", validator);
             newInterface.label = state.old;

             return false; // stop here.
           }
         }

         if (!newInterface.createdInAppID) {
            newInterface.createdInAppID = this.currentApplication.id;
         }

         // show progress
         this.busy();

         // if we get here, save the new Page
         try {
            var obj = await newInterface.save();
            // await this.currentApplication.pageInsert(obj);
            this[tabKey].emit("save.successful", obj);
            this.done(obj);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the currentApplication.
            await this.currentApplication.pageRemove(newInterface);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if (this.$component) this.$component.show();
      }

      switchTab(tabId) {
         if (tabId == this.BlankTab?.ui?.body?.id) {
            this.BlankTab?.onShow?.(this.currentApplication);
         } else if (tabId == this.QuickTab?.ui?.body?.id) {
            this.QuickTab?.onShow?.(this.currentApplication);
         }
      }
   }

   return new UI_Work_Interface_List_NewPage();
}
