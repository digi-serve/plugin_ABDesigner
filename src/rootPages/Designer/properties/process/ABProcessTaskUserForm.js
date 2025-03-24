/*
 * ABProcessTaskUserForm
 *
 * Display the form for entering the properties for a Form Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();
   const uiConfig = AB.Config.uiSettings();

   class UIProcessUserForm extends UIClass {
      constructor() {
         super("properties_process_user_form", {
            name: "",
            formBuilder: "",
            modalWindow: "",
            formPreview: "",
         });
      }

      static get key() {
         return "Form";
      }
      // {string}
      // This should match the ABProcessTaskServiceGetResetPasswordUrlCore.defaults().key value.

      ui(element) {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.

         const ids = this.ids;

         const modalUi = () => {
            return {
               id: ids.modalWindow,
               view: "window",
               position: "center",
               fullscreen: true,
               modal: true,
               head: {
                  view: "toolbar",
                  css: "webix_dark",
                  cols: [
                     {
                        view: "spacer",
                        width: 17,
                     },
                     {
                        view: "label",
                        label: L("Customize the form layout"),
                     },
                     {
                        view: "spacer",
                     },
                     {
                        view: "button",
                        label: L("Cancel"),
                        autowidth: true,
                        click: function () {
                           $$(ids.modalWindow).close();
                        },
                     },
                     {
                        view: "button",
                        css: "webixtype_form",
                        label: L("Save"),
                        autowidth: true,
                        click: () => {
                           this.formBuilder = $$(ids.formBuilder).getFormData();
                           this.element.formBuilder = this.formBuilder;

                           (this.formBuilder.components ?? []).forEach(
                              (component) => {
                                 if (component.key != component?._key)
                                    component.key = component._key;
                              }
                           );

                           this.processComponents();
                           $$(ids.modalWindow).close();
                        },
                     },
                     {
                        view: "spacer",
                        width: 17,
                     },
                  ],
               },
               body: {
                  id: ids.formBuilder,
                  view: "formiobuilder",
                  formComponents: this.formIOComponents,
               },
            };
         };

         return {
            id: ids.component,
            view: "form",
            rows: [
               {
                  id: ids.name,
                  view: "text",
                  label: L("Name"),
                  labelWidth: uiConfig.labelWidthLarge,
                  name: "name",
                  value: "",
               },
               {
                  view: "spacer",
                  height: 10,
               },
               {
                  view: "toolbar",
                  type: "clean",
                  borderless: true,
                  cols: [
                     {
                        view: "label",
                        label: L("Data To Form"),
                     },
                     {
                        view: "spacer",
                     },
                     {
                        view: "button",
                        value: L("Customize Layout"),
                        autowidth: true,
                        click: () => {
                           webix.ui(modalUi()).show();
                        },
                     },
                  ],
               },
               {
                  view: "layout",
                  type: "form",
                  rows: [
                     {
                        view: "layout",
                        padding: 20,
                        rows: [
                           {
                              id: ids.formPreview,
                              view: "formiopreview",
                              formComponents: [],
                              height: 500,
                           },
                        ],
                     },
                  ],
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;
         return;
      }

      /**
       * process the formIOComponents components and data for the preview and
       * form builder
       * @function processComponents
       */
      processComponents() {
         const ids = this.ids;
         this.formIOComponents = this.formBuilder;

         const $preview = $$(ids.formPreview).getParentView();
         $preview.removeView(ids.formPreview);

         $preview.addView({
            id: ids.formPreview,
            view: "formiopreview",
            formComponents: this.formIOComponents,
            height: 500,
         });
      }

      populate(element) {
         this.element = element;
         const ids = this.ids;

         const $name = $$(ids.name);

         $name.setValue(element.label);

         this.formBuilder = element.formBuilder;
         this.processComponents();
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */

      values() {
         const obj = {};
         const ids = this.ids;

         const $name = $$(ids.name);

         obj.label = $name?.getValue() ?? "";
         obj.name = $name?.getValue() ?? "";
         obj.formBuilder = this.formIOComponents;

         (obj.formBuilder?.components ?? []).forEach((comp) => {
            if (!comp.key) {
               const rand = this.AB.uuid().substring(0, 4);
               comp.key = `${this.AB.rules.nameFilter(comp.label)}_${rand}`;
            }
         });

         return obj;
      }
   }

   return UIProcessUserForm;
}
