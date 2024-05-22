/*
 * ui_work_object_workspace_popupSortFields
 *
 * Manage the Sort Fields popup.
 *
 */
export default function (AB, ibase) {
   ibase = ibase || "ui_work_object_workspace_popupSortFields";

   const sort_popup = new AB.Class.SortPopup(ibase);
   sort_popup.AB = AB;

   return sort_popup;
}
