/*
 * ab_common_popupEditMenu
 *
 * Many of our Lists offer a gear icon that allows a popup menu to select
 * a set of options for this entry.  This is a common Popup Editor for those
 * options.
 *
 */

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class ABCommonPopupEditMenu extends AB.ClassUI {
      constructor(contextID) {
         var idBase = "abd_common_popupEditMenu";
         super(idBase);

         // var labels = {
         //    common: App.labels,

         //    component: {
         //       copy: L("ab.page.copy", "*Copy"),
         //       exclude: L("ab.object.exclude", "*Exclude"),

         //       menu: L("ab.application.menu", "*Application Menu"),
         //       confirmDeleteTitle: L(
         //          "ab.application.delete.title",
         //          "*Delete application"
         //       ),
         //       confirmDeleteMessage: L(
         //          "ab.application.delete.message",
         //          "*Do you want to delete <b>{0}</b>?"
         //       )
         //    }
         // };

         // since multiple instances of this component can exists, we need to
         // make each instance have unique ids => so add webix.uid() to them:
         // var uid = webix.uid();
         // var ids = {
         //    menu: this.unique("menu") + uid,
         //    list: this.unique("list") + uid
         // };

         this.ids.menu = `${idBase}_menu_${contextID}`;
         this.ids.list = `${idBase}_list_${contextID}`;

         this.Popup = null;
         this._menuOptions = [
            {
               label: L("Rename"),
               icon: "fa fa-pencil-square-o",
               command: "rename",
            },
            {
               label: L("Copy"),
               icon: "fa fa-files-o",
               command: "copy",
            },
            {
               label: L("Exclude"),
               icon: "fa fa-reply",
               command: "exclude",
            },
            {
               label: L("Delete"),
               icon: "fa fa-trash",
               command: "delete",
            },
         ];
      }

      ui() {
         return {
            view: "popup",
            id: this.ids.menu,
            head: L("Application Menu"), // labels.component.menu,
            width: 120,
            body: {
               view: "list",
               id: this.ids.list,
               borderless: true,
               data: [],
               datatype: "json",
               template: "<i class='fa #icon#' aria-hidden='true'></i> #label#",
               autoheight: true,
               select: false,
               on: {
                  onItemClick: (timestamp, e, trg) => {
                     return this.onItemClick(trg);
                  },
               },
            },
         };
      }

      async init(AB, options) {
         options = options || {};

         if (this.Popup == null) this.Popup = webix.ui(this.ui()); // the current instance of this editor.

         // we reference $$(this.ids.list) alot:
         this.$list = $$(this.ids.list);

         this.hide();
         this.menuOptions(this._menuOptions);

         // register our callbacks:
         // for (var c in _logic.callbacks) {
         //    if (options && options[c]) {
         //       _logic.callbacks[c] = options[c] || _logic.callbacks[c];
         //    }
         // }

         // hide "copy" item
         if (options.hideCopy) {
            let itemCopy = this.$list.data.find(
               (item) => item.label == labels.component.copy
            )[0];
            if (itemCopy) {
               this.$list.remove(itemCopy.id);
               this.$list.refresh();
            }
         }

         // hide "exclude" item
         if (options.hideExclude) {
            let hideExclude = this.$list.data.find(
               (item) => item.label == labels.component.exclude
            )[0];
            if (hideExclude) {
               this.$list.remove(hideExclude.id);
               this.$list.refresh();
            }
         }
      }

      /**
       * @function menuOptions
       * override the set of menu options.
       * @param {array} menuOptions an array of option entries:
       *				  .label {string} multilingual label of the option
       *				  .icon  {string} the font awesome icon reference
       *				  .command {string} the command passed back when selected.
       */
      menuOptions(menuOptions) {
         this.$list.clearAll();

         this._menuOptions = menuOptions;
         var data = [];
         menuOptions.forEach((mo) => {
            data.push({ label: mo.label, icon: mo.icon });
         });
         this.$list.parse(data);
         this.$list.refresh();
      }

      /**
       * @function onItemClick
       * process which item in our popup was selected.
       */
      onItemClick(itemNode) {
         // hide our popup before we trigger any other possible UI animation: (like .edit)
         // NOTE: if the UI is animating another component, and we do .hide()
         // while it is in progress, the UI will glitch and give the user whiplash.

         var label = itemNode.textContent.trim();
         var option = this._menuOptions.filter((mo) => {
            return mo.label == label;
         })[0];
         if (option) {
            // this._logic.callbacks.onClick(option.command);
            this.emit("click", option.command);
         }

         this.hide();
         return false;
      }

      show(itemNode) {
         if (this.Popup && itemNode) this.Popup.show(itemNode);
      }

      hide() {
         if (this.Popup) this.Popup.hide();
      }
   }

   // NOTE: return JUST the class definition.
   return ABCommonPopupEditMenu;
}
