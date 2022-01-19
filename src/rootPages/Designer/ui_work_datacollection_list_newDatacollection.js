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
import UI_Class from "./ui_class";
import UI_Blank_DataCollection from "./ui_work_datacollection_list_newDatacollection_blank";
import UI_Import_DataCollection from "./ui_work_datacollection_list_newDatacollection_import";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_DataCollection_List_NewDataCollection extends UIClass {
      constructor() {
         super("ui_work_datacollection_list_newDataCollection", {
            tab: "",
         });

         this.selectNew = true;
         // {bool} do we select a new data collection after it is created.

         // var callback = null;

         this.BlankTab = UI_Blank_DataCollection(AB);
         this.ImportTab = UI_Import_DataCollection(AB);
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
                     label: L("Add new Data Collection"),
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
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
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
               if (values.id) {
                  return this.import(values, k);
               }
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
      // applicationLoad(application) {
      //    this.CurrentApplicationID = application.id;
      // }

      /**
       * Show the busy indicator
       */
      busy() {
         this.$component?.showProgress?.();
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {object} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj, this.selectNew);
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
       * @method import()
       * take an existing ABDataCollection and add it to our ABApplication.
       * @param {ABODataCollection} dc
       * @param {string} tabKey
       *        which of our tabs triggered this method?
       */
      async import(dc, tabKey) {
         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            await this.CurrentApplication.datacollectionInsert(dc);
            this[tabKey].emit("save.successful", dc);
            this.done(dc);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current datacollection list of
            // the CurrentApplication.
            // NOTE: It has error "queryRemove" is not a function
            // await this.CurrentApplication.datacollectionRemove(newQuery);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         this.$component?.hideProgress?.();
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
         if (!this.CurrentApplication) {
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
            newDataCollection.createdInAppID = this.CurrentApplicationID;
         }

         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            let datacollection = await newDataCollection.save();
            await this.CurrentApplication.datacollectionInsert(datacollection);
            this[tabKey].emit("save.successful", datacollection);
            this.done(datacollection);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this data collection from the current data collection list of
            // the CurrentApplication.
            // NOTE: It has error "datacollectionRemove" is not a function
            // await this.CurrentApplication.datacollectionRemove(newDataCollection);

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
         this.$component?.show();

         const id = $$(this.ids.tab).getValue();
         this.switchTab(id);
      }

      switchTab(tabId) {
         if (tabId == this.BlankTab?.ui()?.body?.id || !tabId) {
            this.BlankTab?.onShow?.(this.CurrentApplication);
         } else if (tabId == this.ImportTab?.ui()?.body?.id) {
            this.ImportTab?.onShow?.(this.CurrentApplication);
         }
      }
   }

   return new UI_Work_DataCollection_List_NewDataCollection();
}
