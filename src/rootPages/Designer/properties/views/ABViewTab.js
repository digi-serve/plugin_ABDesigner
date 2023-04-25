/*
 * ABViewTab
 * A Property manager for our ABViewTab definitions
 */

import FABView from "./ABView";
import FTabPopup from "../../interface_common/ui_tab_form_popup";

export default function (AB) {
   const BASE_ID = "properties_abview_tab";

   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   const TabPopup = FTabPopup(AB);

   class ABViewTabProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            sidebarWidth: "",
            sidebarPos: "",
            iconOnTop: "",
            height: "",
            minWidth: "",
            stackTabs: "",
            darkTheme: "",
         });
      }

      static get key() {
         return "tab";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.height,
               name: "height",
               view: "counter",
               label: L("Height"),
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.minWidth,
               view: "counter",
               name: "minWidth",
               label: L("Minimum width"),
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.stackTabs,
               view: "checkbox",
               name: "stackTabs",
               labelRight: L("Stack Tabs Vertically"),
               labelWidth: uiConfig.labelWidthCheckbox,
               on: {
                  onChange: (newValue) => {
                     if (newValue == 1) {
                        $$(ids.sidebarWidth).show();
                        $$(ids.sidebarPos).show();
                        $$(ids.iconOnTop).hide();
                     } else {
                        $$(ids.sidebarWidth).hide();
                        $$(ids.sidebarPos).hide();
                        $$(ids.iconOnTop).show();
                     }
                     this.onChange();
                  },
               },
            },
            {
               id: ids.iconOnTop,
               view: "checkbox",
               name: "iconOnTop",
               labelRight: L("Position icon above text"),
               labelWidth: uiConfig.labelWidthCheckbox,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.darkTheme,
               view: "checkbox",
               name: "darkTheme",
               labelRight: L("Use Dark Theme"),
               labelWidth: uiConfig.labelWidthCheckbox,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.sidebarWidth,
               view: "counter",
               name: "sidebarWidth",
               label: L("Width of Sidebar"),
               labelWidth: uiConfig.labelWidthXLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.sidebarPos,
               view: "richselect",
               name: "sidebarPos",
               label: L("Position of Sidebar"),
               labelWidth: uiConfig.labelWidthXLarge,
               options: [
                  { id: "left", value: L("Left") },
                  { id: "right", value: L("Right") },
               ],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            // [button] : add tab
            {
               view: "button",
               css: "webix_primary",
               value: L("Add Tab"),
               click: () => {
                  this.CurrentView.tabPopup.show();
               },
            },
         ]);
      }

      async init(AB) {
         await super.init(AB);

         const baseView = this.CurrentView;

         if (!baseView.tabPopup) {
            baseView.tabPopup = new TabPopup(baseView);

            await baseView.tabPopup.init(AB);
         }

         if (!this.__tabPopupSave) {
            this.__tabPopupSave = baseView.tabPopup.on("saved", () => {
               this.onChange();
            });
         }
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;

         $$(ids.height).setValue(view.settings.height);
         $$(ids.minWidth).setValue(view.settings.minWidth);
         $$(ids.stackTabs).setValue(view.settings.stackTabs);
         $$(ids.darkTheme).setValue(view.settings.darkTheme);
         $$(ids.sidebarWidth).setValue(view.settings.sidebarWidth);
         $$(ids.sidebarPos).setValue(view.settings.sidebarPos);
         $$(ids.iconOnTop).setValue(view.settings.iconOnTop);

         if (view.settings.stackTabs) {
            $$(ids.sidebarWidth).show();
            $$(ids.sidebarPos).show();
            $$(ids.iconOnTop).hide();
         } else {
            $$(ids.sidebarWidth).hide();
            $$(ids.sidebarPos).hide();
            $$(ids.iconOnTop).show();
         }
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const values = super.values();

         const ids = this.ids;
         const $component = $$(ids.component);

         values.settings = $component.getValues();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("tab");
      }
   }

   return ABViewTabProperty;
}
