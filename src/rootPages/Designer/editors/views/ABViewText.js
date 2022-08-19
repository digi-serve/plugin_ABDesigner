/**
 * ABViewText
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 */
let myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import UI_Class from "../../ui_class";

export default function (AB) {
   if (!myClass) {
      const BASE_ID = "interface_editor_viewtext";

      const UIClass = UI_Class(AB);

      myClass = class ABViewTextEditor extends UIClass {
         static get key() {
            return "text";
         }

         constructor(view, base = BASE_ID) {
            // base: {string} unique base id reference
            super(base);

            this.AB = AB;
            this.view = view;
            this.component = this.view.component();
         }

         ui() {
            const ids = this.ids;
            const baseView = this.view;

            return {
               id: ids.component,
               view: "tinymce-editor",
               value: baseView.text,
               config: {
                  plugins: [
                     "advlist autolink lists link image charmap print preview anchor",
                     "searchreplace visualblocks code fullscreen",
                     "insertdatetime media table contextmenu paste imagetools wordcount",
                  ],
                  toolbar:
                     "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                  // menu: {
                  // 	file: { title: 'File', items: 'newdocument' },
                  // 	edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall' },
                  // 	format: { title: 'Format', items: 'formats | removeformat' }
                  // },
                  init_instance_callback: (editor) => {
                     const eventHandlerOnChange = () => {
                        this.onChange();
                     };

                     editor.on("Change", eventHandlerOnChange);
                  },
               },
            };
         }

         async init(AB) {
            this.AB = AB;

            webix.codebase = "/js/webix/extras/";

            await this.component.init(this.AB);

            // this.component.onShow();
            // in our editor, we provide accessLv = 2
         }

         onChange() {
            const ids = this.ids;
            const baseView = this.view;

            if (baseView._onChangeFunction) {
               clearTimeout(baseView._onChangeFunction);

               baseView._onChangeFunction = null;
            }

            const $component = $$(ids.component);

            baseView._onChangeFunction = setTimeout(() => {
               baseView.text = $component.getValue();

               baseView.save();
            }, 400);
         }

         detatch() {
            this.component.detatch?.();
         }

         onShow() {
            this.component.onShow();
         }
      };
   }

   return myClass;
}
