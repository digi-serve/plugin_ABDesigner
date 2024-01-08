/*
 * ui_work_pwa_properties
 *
 * Display the PWA Interface Builder Properties Panel.  This section of the UI
 * will display a current version of the selected page for the designer to see.
 *
 */

import UI_Class from "./ui_class";

import FPropertyManager from "./properties/PropertyManager";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = UIClass.L();

   const PropertyManager = FPropertyManager(AB);

   class UI_Work_PWA_PROPERTIES extends UIClass {
      constructor() {
         super("ab_work_pwa_display", {
            editors: "",
            noSelection: "",
         });

         this._editorsByType = {
            /* View.key : ViewPropertyClass */
         };
         this.currentPanel = null;

         /**
          * @function _handler_onChange()
          * Triggered when a change in the Property Editor
          * is alerted, or when a new view is loaded and we
          * want to save the current one.
          */
         this._handler_onChange = (waitDuration = 3000, skipEmit = false) => {
            if (!this.CurrentView) return;

            let values = this.currentPanel.values();

            let hasChanged = false;

            // to update the label, add it before we ask for .toObj():
            // this.CurrentView.label = values.label;

            // to update the label (and other properties like .menuTextLeft, menuTextCenter, and .menuTextRight of the Menu widget), add it before we ask for .toObj():
            Object.keys(values ?? {}).forEach((k) => {
               if (k == "settings") return;
               if (this.CurrentView[k] != values[k]) {
                  hasChanged = true;
               }
               this.CurrentView[k] = values[k];
            });

            var objVals = this.CurrentView.toObj();
            Object.keys(values.settings ?? {}).forEach((k) => {
               if (objVals.settings[k] != values.settings[k]) {
                  hasChanged = true;
               }
               objVals.settings[k] = values.settings[k];
            });

            this.CurrentView.fromValues(objVals);

            // Timed saves ... once every 3s of no changes
            let view = this.CurrentView;
            this.pendingSave = true;

            // Add a beforeunload event listener to save changes if the user leaves
            if (!this.unloadListener) {
               this.unloadListener = this.AB.Webix.event(
                  window,
                  "beforeunload",
                  () => {
                     this._handler_onChange(0, true);
                  }
               );
            }

            if (view.__timedSave) {
               clearTimeout(view.__timedSave);
            }
            view.__timedSave = setTimeout(async () => {
               this.busy();
               try {
                  await view.save();
                  delete view.__timedSave;
               } catch (err) {
                  this.AB.notify.developer(err, {
                     message: "Error trying to save the View:",
                     view: view.toObj(),
                  });
                  view.AB.message({
                     text: this.label("Error trying to save the View"),
                     type: "error",
                  });
               } finally {
                  this.ready();
                  this.pendingSave = false;
                  this.AB.Webix.eventRemove(this.unloadListener);
                  delete this.unloadListener;

                  // warnings should be refreshed now:
                  this.emit("warnings");
                  if (hasChanged || !skipEmit) {
                     this.emit("view.changed");
                  }
               }
            }, waitDuration);
         };

         this._ViewSelect = {
            id: this.ids.noSelection,
            rows: [
               {
                  maxHeight: uiConfig.xxxLargeSpacer,
                  hidden: uiConfig.hideMobile,
               },
               {
                  view: "label",
                  align: "center",
                  height: 200,
                  label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-file-text-o'></div>",
               },
               {
                  view: "label",
                  align: "center",
                  label: L("Select a page or widget to edit"),
               },
               {
                  maxHeight: uiConfig.xxxLargeSpacer,
                  hidden: uiConfig.hideMobile,
               },
            ],
         };
      }

      ui() {
         let ids = this.ids;

         // Our webix UI definition:
         return {
            id: ids.component,
            // scroll: true,
            rows: [
               {
                  view: "toolbar",
                  css: "ab-data-toolbar webix_dark",
                  cols: [
                     { view: "spacer", width: 10 },
                     {
                        view: "label",
                        label: L("Properties"),
                     },
                     {
                        view: "icon",
                        icon: "fa fa-info-circle",
                        tooltip: L("Tip"),
                        on: {
                           onItemClick: () => {
                              this.infoAlert();
                           },
                        },
                     },
                  ],
               },
               {
                  id: ids.editors,
                  rows: [this._ViewSelect],
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         // get a copy of all the possible Editors by their .key
         PropertyManager.mobileViews().forEach((V) => {
            this._editorsByType[V.key] = V;
         });
      }

      /**
       * @method clearWorkspace()
       * remove the current editor from the workspace.
       */
      clearWorkspace() {
         let ui = [this._ViewSelect];

         webix.ui(ui, $$(this.ids.editors));
      }

      /**
       * @method infoAlert()
       * show the popup info for the Properties panel
       */
      infoAlert() {
         webix.alert({
            title: L("Tip"),
            text: L("Edit a widgets properties here."),
         });
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).expand();
      }

      /*
       * @method viewLoad
       * A new View has been selected for editing, so update
       * our interface with the details for this View.
       * @param {ABView} view  current view instance.
       */
      viewLoad(view) {
         if (this.currentPanel && view.id != this.CurrentViewID) {
            // Make sure the current Data is saved:
            if (this.pendingSave) this._handler_onChange(10, true);

            // unload the current panel
            this.currentPanel.removeAllListeners("changed");
            this.currentPanel = null;
         }

         if (view.id != this.CurrentViewID) {
            super.viewLoad(view);

            let _editor = this._editorsByType[view.key];

            if (_editor) {
               let newPanel = new _editor();
               newPanel.applicationLoad(this.CurrentApplication);

               let ui = [newPanel.ui()];

               webix.ui(ui, $$(this.ids.editors));
               newPanel.init(this.AB);
               newPanel.populate(view);

               newPanel.on("changed", this._handler_onChange);
               this.currentPanel = newPanel;
               // newPanel.show();
            }
         }
      }

      ready() {
         const $component = $$(this.ids.component);
         $component?.enable?.();
         $component?.hideProgress?.();
      }

      busy() {
         const $component = $$(this.ids.component);
         $component?.showProgress?.({ type: "icon" });
         $component?.disable?.();
      }
   }

   return new UI_Work_PWA_PROPERTIES();
}
