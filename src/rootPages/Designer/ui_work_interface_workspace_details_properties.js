/*
 * ui_work_interface_workspace_details_properties
 *
 * Display the properties available for the current view.
 *
 */

// const ABViewManager = require("../classes/platform/ABViewManager");

import UI_Class from "./ui_class";
// import UI_Warnings from "./ui_warnings";

import FPropertyManager from "./properties/PropertyManager";

export default function (AB) {
   const ibase = "ui_work_interface_workspace_details_properties";
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const PropertyManager = FPropertyManager(AB);

   class UI_Work_Interface_Workspace_Details_Properties extends UIClass {
      constructor() {
         super(ibase, {
            editors: "",
            form: "",
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
            let values = this.currentPanel.values();

            // to update the label, add it before we ask for .toObj():
            this.CurrentView.label = values.label;
            var objVals = this.CurrentView.toObj();
            Object.keys(values.settings).forEach((k) => {
               objVals.settings[k] = values.settings[k];
            });

            this.CurrentView.fromValues(objVals);

            // Timed saves ... once every 3s of no changes
            let view = this.CurrentView;

            if (view.__timedSave) {
               clearTimeout(view.__timedSave);
            }
            view.__timedSave = setTimeout(() => {
               view.save();
               delete view.__timedSave;
            }, waitDuration);

            if (!skipEmit) {
               this.emit("view.changed");
            }
         };
      }

      // webix UI definition:
      ui() {
         let ids = this.ids;

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
                  rows: [{}],
               },
            ],
         };
      }

      // setting up UI
      init(AB) {
         this.AB = AB;

         // get a copy of all the possible Editors by their .key
         PropertyManager.views().forEach((V) => {
            this._editorsByType[V.key] = V;
         });
      }

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
         if (this.currentPanel) {
            // Make sure the current Data is saved:
            this._handler_onChange(10, true);

            // unload the current panel
            this.currentPanel.removeAllListeners("changed");
            this.currentPanel = null;
         }

         super.viewLoad(view);

         let _editor = this._editorsByType[view.key];

         if (_editor) {
            let newPanel = new _editor();

            let ui = {
               id: this.ids.editors,
               rows: [newPanel.ui()],
            };

            webix.ui(ui, $$(this.ids.editors));
            newPanel.init(this.AB);
            newPanel.populate(view);

            newPanel.on("changed", this._handler_onChange);
            this.currentPanel = newPanel;
            // newPanel.show();
         }
      }
   }

   return new UI_Work_Interface_Workspace_Details_Properties();
}
