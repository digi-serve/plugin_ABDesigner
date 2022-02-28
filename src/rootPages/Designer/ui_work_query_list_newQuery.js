/*
 * ui_work_query_list_newQuery
 *
 * Display the form for creating a new Query.  This Popup will manage several
 * different sub components for gathering Query data for saving.
 *
 * The sub components will gather the data for the query and do basic form
 * validations on their interface.
 *
 * when ready, the sub component will emit "save" with the values gathered by
 * the form.  This component will manage the actual final query validation,
 * and saving to this application.
 *
 * On success, "save.success" will be emitted on the sub-component, and this
 * component.
 *
 * On Error, "save.error" will be emitted on the sub-component.
 *
 */
import UI_Class from "./ui_class";
import UIBlankQuery from "./ui_work_query_list_newQuery_blank";
import UIImportQuery from "./ui_work_query_list_newQuery_import";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Work_Query_List_NewQuery extends UIClass {
      constructor() {
         super("ui_work_query_list_newQuery", {
            tab: "",
         });

         this.selectNew = true;
         // {bool} do we select a new query after it is created.

         // var callback = null;

         this.BlankTab = UIBlankQuery(AB);
         this.ImportTab = UIImportQuery(AB);
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
                     label: L("Add new query"),
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
            selectNewQuery: true,
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
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {object} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj, this.selectNew);
         // _logic.callbacks.onDone(null, obj, selectNew, callback); // tell parent component we're done
      }

      /**
       * @method import()
       * take an existing query and add it to our ABApplication.
       * @param {ABObjectQuery} query
       * @param {string} tabKey
       *        which of our tabs triggered this method?
       */
      async import(query, tabKey) {
         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            await this.CurrentApplication.queryInsert(query);
            this[tabKey].emit("save.successful", query);
            this.done(query);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the CurrentApplication.
            // NOTE: It has error "queryRemove" is not a function
            // await this.CurrentApplication.queryRemove(newQuery);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
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

         // create a new (unsaved) instance of our object:
         let newQuery = this.AB.queryNew(values);

         // have newObject validate it's values.
         let validator = newQuery.isValid();
         if (validator.fail()) {
            this[tabKey].emit("save.error", validator);
            // cb(validator); // tell current Tab component the errors
            return false; // stop here.
         }

         if (!newQuery.createdInAppID) {
            newQuery.createdInAppID = this.CurrentApplicationID;
         }

         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            let query = await newQuery.save();
            await this.CurrentApplication.queryInsert(query);
            this[tabKey].emit("save.successful", query);
            this.done(query);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the CurrentApplication.
            // NOTE: It has error "queryRemove" is not a function
            // await this.CurrentApplication.queryRemove(newQuery);

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
            this.BlankTab?.onShow?.(this.CurrentApplication);
         } else if (tabId == this.ImportTab?.ui()?.body?.id) {
            this.ImportTab?.onShow?.(this.CurrentApplication);
         }
      }
   }

   return new UI_Work_Query_List_NewQuery();
}
