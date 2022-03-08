/*
 * ab_common_popupEditMenu
 *
 * Many of our Lists offer a gear icon that allows a popup menu to select
 * a set of options for this entry.  This is a common Popup Editor for those
 * options.
 *
 */
import UI_Class from "./ui_class";

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

export default function (AB) {
   if (!myClass) {
      const UIClass = UI_Class(AB);
      var L = UIClass.L();

      myClass = class ABCommonPopupEditMenu extends UIClass {
         constructor(contextID) {
            var idBase = "abd_common_popupEditMenu";
            super(idBase);

            this.labels = {
               copy: L("Copy"),
               exclude: L("Exclude"),
               rename: L("Rename"),
               delete: L("Delete"),
            };

            // since multiple instances of this component can exists, we need to
            // make each instance have unique ids => so add contextID to them:
            this.ids.menu = `${idBase}_menu_${contextID}`;
            this.ids.list = `${idBase}_list_${contextID}`;

            this.Popup = null;
            this._menuOptions = [
               {
                  label: this.labels.rename,
                  icon: "fa fa-pencil-square-o",
                  command: "rename",
               },
               {
                  label: this.labels.copy,
                  icon: "fa fa-files-o",
                  command: "copy",
               },
               {
                  label: this.labels.exclude,
                  icon: "fa fa-reply",
                  command: "exclude",
               },
               {
                  label: this.labels.delete,
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
                  template:
                     "<i class='fa #icon#' aria-hidden='true'></i> #label#",
                  autoheight: true,
                  select: false,
                  on: {
                     onItemClick: (timestamp, e, trg) => {
                        // we need to process which node was clicked before emitting
                        return this.trigger(trg);
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

            // hide "copy" item
            if (options.hideCopy) {
               let itemCopy = this.$list.data.find(
                  (item) => item.label == this.labels.copy
               )[0];
               if (itemCopy) {
                  this.$list.remove(itemCopy.id);
                  this.$list.refresh();
               }

               // hide "exclude" item
               if (options.hideExclude) {
                  let hideExclude = this.$list.data.find(
                     (item) => item.label == this.labels.exclude
                  )[0];
                  if (hideExclude) {
                     this.$list.remove(hideExclude.id);
                     this.$list.refresh();
                  }
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

         show(itemNode) {
            if (this.Popup && itemNode) this.Popup.show(itemNode);
         }

         /**
          * @method trigger()
          * process which item in our popup was selected, then
          * emit the selected command.
          * NOTE: this can be overridden by child objects
          * @param {itemNode} div.webix_list_item: we get the label then pass this up,
          * The itemNode contains the 'page' the user wants to edit
          */
         trigger(itemNode) {
            // hide our popup before we trigger any other possible UI animation: (like .edit)
            // NOTE: if the UI is animating another component, and we do .hide()
            // while it is in progress, the UI will glitch and give the user whiplash.
            var label = itemNode.textContent.trim();
            var option = this._menuOptions.filter((mo) => {
               return mo.label == label;
            })[0];
            if (option) {
               this.emit(option.command, itemNode);
               this.hide();
               return false;
            }
         }

         hide() {
            if (this.Popup) this.Popup.hide();
         }
      };
   }

   // NOTE: return JUST the class definition.
   return myClass;
}
