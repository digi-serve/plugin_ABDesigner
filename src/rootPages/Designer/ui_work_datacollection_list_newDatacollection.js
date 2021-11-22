/*
 * ui_work_datacollection_list_newDataCollection
 *
 * Display the form for creating a new Data collection.  This Popup will manage several
 * different sub components for gathering Data collection data for saving.
 *
 * The sub components will gather the data for the data collection and do basic form
 * validations on their interface.
 *
 * when ready, the sub component will emit "save" with the values gathered by
 * the form.  This component will manage the actual final datacollection validation,
 * and saving to this application.
 *
 * On success, "save.success" will be emitted on the sub-component, and this
 * component.
 *
 * On Error, "save.error" will be emitted on the sub-component.
 *
 */
import UIBlankDataCollection from "./ui_work_datacollection_list_newDatacollection_blank";
import UIImportDataCollection from "./ui_work_datacollection_list_newDatacollection_import";

export default function (AB) {
   const L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   const UI_Blank_DataCollection = UIBlankDataCollection(AB);
   const UI_Import_DataCollection = UIImportDataCollection(AB);

   class UI_Work_DataCollection_List_NewDataCollection extends AB.ClassUI {
      constructor() {
         const base = "ab_work_datacollection_list_newDataCollection";
         super({
            component: base,
            tab: `${base}_tab`,
         });

         this.currentApplication = null;
         // {ABApplication} the ABApplication we are currently working on.

         this.selectNew = true;
         // {bool} do we select a new data collection after it is created.

         // var callback = null;

         this.BlankTab = new UI_Blank_DataCollection(AB);
         this.ImportTab = new UI_Import_DataCollection(AB);
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            position: "center",
            modal: true,
            head: L("Add new data collection"),
            selectNewDataCollection: true,
            body: {
               view: "tabview",
               id: this.ids.tab,
               cells: [this.BlankTab.ui(), this.ImportTab.ui()],
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
         };
      }

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$component = $$(this.ids.component);

         let allInits = [];
         ["BlankTab", "ImportTab"].forEach((k) => {
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

         // create a new (unsaved) instance of our data collection:
         let newDataCollection = this.AB.datacollectionNew(values);

         // have newObject validate it's values.
         let validator = newDataCollection.isValid();
         if (validator.fail()) {
            this[tabKey].emit("save.error", validator);
            // cb(validator); // tell current Tab component the errors
            return false; // stop here.
         }

         if (!newDataCollection.createdInAppID) {
            newDataCollection.createdInAppID = this.currentApplication.id;
         }

         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            let datacollection = await newDataCollection.save();
            await this.currentApplication.datacollectionInsert(datacollection);
            this[tabKey].emit("save.successful", datacollection);
            this.done(datacollection);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this data collection from the current data collection list of
            // the currentApplication.
            // NOTE: It has error "datacollectionRemove" is not a function
            // await this.currentApplication.datacollectionRemove(newDataCollection);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show(shouldSelectNew) {
         if (shouldSelectNew != null) {
            this.selectNew = shouldSelectNew;
         }
         if (this.$component) this.$component.show();

         const id = $$(this.ids.tab).getValue();
         this.switchTab(id);
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

      switchTab(tabId) {
         if (tabId == this.BlankTab?.ui()?.body?.id || !tabId) {
            this.BlankTab?.onShow?.(this.currentApplication);
         } else if (tabId == this.ImportTab?.ui()?.body?.id) {
            this.ImportTab?.onShow?.(this.currentApplication);
         }
      }
   }

   return UI_Work_DataCollection_List_NewDataCollection;
}
