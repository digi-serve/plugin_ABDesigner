/*
 * ABViewButton
 * A Property manager for our ABViewButton definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_button";

   const ABView = FABView(AB);
   const L = ABView.L();

   class ABViewButtonProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            includeSave: "",
            saveLabel: "",
            includeCancel: "",
            cancelLabel: "",
            includeReset: "",
            resetLabel: "",
            afterCancel: "",
            alignment: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "button";
      }

      ui() {
         const ids = this.ids;
         const uiConfig = this.AB.UISettings.config();

         return super.ui([
            {
               id: ids.includeSave,
               name: "includeSave",
               view: "checkbox",
               label: L("Save"),
               click: () => this.onChange(),
            },
            {
               id: ids.saveLabel,
               name: "saveLabel",
               view: "text",
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Save Label"),
               placeholder: L("Save Placeholder"),
               on: {
                  onChange: () => this.onChange(),
               },
            },
            {
               id: ids.includeCancel,
               name: "includeCancel",
               view: "checkbox",
               label: L("Cancel"),
               click: () => this.onChange(),
            },
            {
               id: ids.cancelLabel,
               name: "cancelLabel",
               view: "text",
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Cancel Label"),
               placeholder: L("Cancel Placeholder"),
               on: {
                  onChange: () => this.onChange(),
               },
            },
            {
               id: ids.includeReset,
               name: "includeReset",
               view: "checkbox",
               label: L("Reset"),
               click: () => this.onChange(),
            },
            {
               id: ids.resetLabel,
               name: "resetLabel",
               view: "text",
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Reset Label"),
               placeholder: L("Reset Placeholder"),
               on: {
                  onChange: () => this.onChange(),
               },
            },
            {
               id: ids.afterCancel,
               name: "afterCancel",
               view: "richselect",
               labelWidth: uiConfig.labelWidthLarge,
               label: L("After Cancel"),
               on: {
                  onChange: () => this.onChange(),
               },
               // options: []
            },
            {
               id: ids.alignment,
               name: "alignment",
               view: "richselect",
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Alignment"),
               options: [
                  {
                     id: "left",
                     value: L("Left"),
                  },
                  {
                     id: "center",
                     value: L("Center"),
                  },
                  {
                     id: "right",
                     value: L("Right"),
                  },
               ],
               on: {
                  onChange: () => this.onChange(),
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const ABViewFormButtonPropertyComponentDefaults = this.defaultValues();

         const pagesList = [];
         this.addPagesToList(pagesList, view.application, view.pageRoot().id);

         const opts = pagesList.map((opt) => {
            return {
               id: opt.id,
               value: opt.value,
            };
         });
         $$(ids.afterCancel).define("options", opts);

         $$(ids.includeSave).setValue(
            view.settings.includeSave != null
               ? view.settings.includeSave
               : ABViewFormButtonPropertyComponentDefaults.includeSave
         );
         $$(ids.includeCancel).setValue(
            view.settings.includeCancel != null
               ? view.settings.includeCancel
               : ABViewFormButtonPropertyComponentDefaults.includeCancel
         );
         $$(ids.includeReset).setValue(
            view.settings.includeReset != null
               ? view.settings.includeReset
               : ABViewFormButtonPropertyComponentDefaults.includeReset
         );

         $$(ids.saveLabel).setValue(view.settings.saveLabel ?? "");
         $$(ids.cancelLabel).setValue(view.settings.cancelLabel ?? "");
         $$(ids.resetLabel).setValue(view.settings.resetLabel ?? "");

         $$(ids.afterCancel).setValue(
            view.settings.afterCancel ??
               ABViewFormButtonPropertyComponentDefaults.afterCancel
         );
         $$(ids.alignment).setValue(
            view.settings.alignment ??
               ABViewFormButtonPropertyComponentDefaults.alignment
         );
      }

      defaultValues() {
         const ViewClass = this.ViewClass();

         let values = null;

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

         const $component = $$(ids.component);

         const values = super.values() ?? {};
         values.settings = $component.getValues() ?? {};
         values.settings.includeSave = $$(ids.includeSave).getValue();
         values.settings.saveLabel = $$(ids.saveLabel).getValue();
         values.settings.includeCancel = $$(ids.includeCancel).getValue();
         values.settings.cancelLabel = $$(ids.cancelLabel).getValue();
         values.settings.includeReset = $$(ids.includeReset).getValue();
         values.settings.resetLabel = $$(ids.resetLabel).getValue();
         values.settings.afterCancel = $$(ids.afterCancel).getValue();
         values.settings.alignment = $$(ids.alignment).getValue();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("button");
      }

      addPagesToList(pagesList, parent, rootPageId) {
         if (!parent || !parent.pages || !pagesList) return;

         (parent.pages() ?? []).forEach((page) => {
            if (page.parent != null || page.id == rootPageId) {
               pagesList.push({
                  id: page.id,
                  value: page.label,
               });

               this.addPagesToList(pagesList, page, page.id);
            }
         });
      }
   }

   return ABViewButtonProperty;
}
