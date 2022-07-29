/*
 * ABViewDataview
 * A Property manager for our ABViewDataview definitions
 */

import FABViewDetail from "./ABViewDetail";
import ABViewPropertyLinkPage from "./viewProperties/ABViewPropertyLinkPage";

export default function (AB) {
   const base = "properties_abview_dataview";

   const ABViewDetail = FABViewDetail(AB);
   const LinkPageProperty = ABViewPropertyLinkPage(AB, base);
   const uiConfig = AB.Config.uiSettings();
   const L = ABViewDetail.L();

   let ABViewDataviewPropertyComponentDefaults = {};

   class ABViewDataviewProperty extends ABViewDetail {
      constructor() {
         super(base, {
            // Put our ids here
            xCount: "",
         });

         this.AB = AB;
         ABViewDataviewPropertyComponentDefaults =
            this.AB.Class.ABViewManager.viewClass("dataview").defaultValues();

         this.linkPageComponent = new LinkPageProperty(AB, base);
      }

      static get key() {
         return "dataview";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.xCount,
               view: "counter",
               name: "xCount",
               min: 1, // we cannot have 0 columns per row so lets not accept it
               label: L("Items in a row"),
               labelWidth: uiConfig.labelWidthLarge,
               step: 1,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            this.linkPageComponent.ui(),
         ]);
      }

      init() {
         super.init(this.AB);

         this.linkPageComponent.init();
         this.linkPageComponent.on("change", () => {
            this.onChange();
         });
      }

      populate(view) {
         super.populate(view);
         if (!view) return;

         const ids = this.ids;

         $$(ids.xCount).setValue(
            view.settings.xCount ||
               ABViewDataviewPropertyComponentDefaults.xCount
         );

         this.linkPageComponent.viewLoad(view);
         this.linkPageComponent.setSettings(view.settings);
      }

      defaultValues() {
         let values = {};
         const ViewClass = this.ViewClass();
         if (ViewClass) {
            values = ViewClass.defaultValues();
         }
         return values;
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const ids = this.ids;
         let vals = super.values();

         vals.settings = vals.settings ?? {};
         vals.settings.xCount = $$(ids.xCount).getValue();

         let linkSettings = this.linkPageComponent.getSettings();
         for (let key in linkSettings) {
            vals.settings[key] = linkSettings[key];
         }

         return vals;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("dataview");
      }
   }

   return ABViewDataviewProperty;
}
