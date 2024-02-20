/*
 * ab_work_object_workspace_popupHeaderEditMenu
 *
 * Manage the Add New Data Field popup.
 *
 */
import UI_Class from "./ui_class";
import UIListEditMenuFactory from "./ui_common_popupEditMenu";

export default function (AB, ibase) {
   ibase = ibase || "ui_work_object_workspace_popupHeaderEditMenu";
   var ListClass = UIListEditMenuFactory(AB);
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UIWorkObjectWorkspacePopupHeaderEditMenu extends ListClass {
      constructor(base) {
         super(base);

         this.ids.list_info_item = `${base}_list_info_item`;

         // overwrite the default common menu with our column Header
         // options.
         this._menuOptions = [
            {
               label: L("Hide field"),
               // {string} label displayed

               icon: "fa fa-eye-slash",
               // {string} the fontawesome icon reference

               command: "hide",
               // {string} the returned command key

               imported: true,
               // {bool} include this option on an Imported Field?
            },
            {
               label: L("Filter field"),
               icon: "fa fa-filter",
               command: "filter",
               imported: true,
            },
            {
               label: L("Sort field"),
               icon: "fa fa-sort",
               command: "sort",
               imported: true,
            },
            {
               label: L("Freeze field"),
               icon: "fa fa-thumb-tack",
               command: "freeze",
               imported: true,
            },
            {
               label: L("Edit field"),
               icon: "fa fa-pencil-square-o",
               command: "edit",
               imported: false,
            },
            {
               label: L("Delete field"),
               icon: "fa fa-trash",
               command: "delete",
               imported: false,
            },
         ];

         this.$node = null;
         this.field = null;
      }

      show(node, field) {
         this.$node = node;
         this.field = field;

         const $list = $$(this.ids.list);
         if ($list.exists(this.ids.list_info_item))
            $list.remove(this.ids.list_info_item);

         if (this.AB.Account.isSystemDesigner()) {
            $list.add({
               id: this.ids.list_info_item,
               label: L("Information"),
               icon: "fa fa-info-circle",
               command: "system_info",
            });
         }

         super.show(node);
      }

      trigger(command) {
         this.emit("click", command, this.field, this.$node);
      }
   }
   return new UIWorkObjectWorkspacePopupHeaderEditMenu(ibase);
}
