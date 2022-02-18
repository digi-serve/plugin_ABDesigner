/*
 * ABFieldTree
 * A Property manager for our ABFieldTree.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const ABField = FFieldClass(AB);

   class ABFieldTree extends ABField {
      constructor() {
         super("properties_abfield_tree", {
            options: "",
            popup: "",
            tree: "",
         });
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "button",
               type: "icon",
               icon: "fa fa-plus",
               height: 30,
               click: () => {
                  const itemId = webix.uid().toString();
                  $$(ids.options).data.add({
                     id: itemId,
                     text: "",
                  });
                  $$(ids.options).openAll();
                  $$(ids.options).config.height =
                     $$(ids.options).count() * 28 + 18; // Number of pages plus 9px of padding top and bottom
                  $$(ids.options).resize();
                  $$(ids.options).edit(itemId);
               },
            },
            {
               id: ids.options,
               name: "options",
               // css: "padList",
               css: { background: "transparent" },
               view: this.AB.custom.edittree.view,
               template:
                  "<div style='position: relative;'><i class='ab-new-field-add fa fa-plus' style='position: relative; right: 0px;'></i> #text#<i class='ab-new-field-remove fa fa-remove' style='position: absolute; top: 7px; right: 7px;'></i></div>",
               autoheight: true,
               drag: true,
               editor: "text",
               editable: true,
               editValue: "text",
               onClick: {
                  "ab-new-field-remove": (e, itemId) => {
                     // Remove option item
                     $$(ids.options).remove(itemId);
                     $$(ids.options).config.height = 0;
                     $$(ids.options).config.height =
                        $$(ids.options).count() * 28 + 18;
                     // stop the default click action for this item
                     return false;
                  },
                  "ab-new-field-add": (e, thisId) => {
                     // Add option item
                     const itemId = webix.uid().toString();
                     const parentId = thisId.toString();
                     $$(ids.options).data.add(
                        {
                           id: itemId,
                           text: "",
                        },
                        null,
                        parentId
                     );
                     $$(ids.options).openAll();
                     $$(ids.options).config.height =
                        $$(ids.options).count() * 28 + 18; // Number of pages plus 9px of padding top and bottom
                     $$(ids.options).resize();
                     $$(ids.options).edit(itemId);

                     // stop the default click action for this item
                     return false;
                  },
               },
            },
         ]);
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("tree");
      }

      clear() {
         const ids = this.ids;
         $$(ids.options).clearAll();
         $$(ids.options).config.height = 0;
         $$(ids.options).resize();
         $$(ids.options).refresh();
      }

      values() {
         // Get options list from UI, then set them to settings
         const values = super.values();
         values.settings.options = $$(this.ids.options).serialize();
         return values;
      }

      populate(field) {
         const ids = this.ids;
         $$(ids.options).clearAll();
         $$(ids.options).parse(field.settings.options);
         $$(ids.options).openAll();
         $$(ids.options).config.height = $$(ids.options).count() * 28 + 18; // Number of pages plus 9px of padding top and bottom
         $$(ids.options).resize();
         $$(ids.options).refresh();
      }
   }

   return ABFieldTree;
}
