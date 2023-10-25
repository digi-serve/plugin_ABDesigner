/*
 * ABMobileViewLabel
 * A Property manager for our ABMobileViewLabel definitions
 */

import FABMobileView from "./ABMobileView";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_label";

   const ABMobileView = FABMobileView(AB);
   const L = ABMobileView.L();

   class ABViewLabelProperty extends ABMobileView {
      constructor() {
         super(BASE_ID, {
            text: "",
            format: "",
            alignment: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "mobile-label";
      }

      ui() {
         const defaultValues = this.defaultValues();

         const ids = this.ids;

         return super.ui([
            // .text :  The Text displayed for this label
            {
               id: ids.text,
               view: "text",
               name: "text",
               label: L("Text"),
               placeholder: L("Text Placeholder"),
               // labelWidth: this.AB.UISettings.config().labelWidthMedium,
               on: {
                  onChange: (newValue, oldValue) => {
                     if (newValue !== oldValue) {
                        const baseView = this.CurrentView;

                        baseView.text = newValue;

                        baseView.save();
                        this.onChange();
                     }
                  },
               },
            },
            {
               view: "fieldset",
               label: L("Format Options:"),
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.format,
                        view: "radio",
                        name: "format",
                        vertical: true,
                        value: defaultValues.format,
                        options: [
                           {
                              id: 0,
                              value: L("normal"),
                           },
                           {
                              id: 1,
                              value: L("title"),
                           },
                           {
                              id: 2,
                              value: L("description"),
                           },
                        ],
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },
            {
               view: "fieldset",
               label: L("Alignment:"),
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.alignment,
                        view: "radio",
                        name: "alignment",
                        vertical: true,
                        value: defaultValues.alignment,
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
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },
            {},
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;

         $$(ids.text).setValue(view.text);
         $$(ids.format).setValue(view.settings.format);
         $$(ids.alignment).setValue(view.settings.alignment);
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

         const values = super.values();

         values.settings = $component.getValues();
         values.text = values.settings.text;

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("mobile-label");
      }
   }

   return ABViewLabelProperty;
}
