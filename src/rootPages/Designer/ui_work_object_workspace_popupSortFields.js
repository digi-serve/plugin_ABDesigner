/*
 * ui_work_object_workspace_popupSortFields
 *
 * Manage the Sort Fields popup.
 *
 */
export default function (AB, ibase) {
   ibase = ibase || "ui_work_object_workspace_popupSortFields";

   return new AB.Class.SortPopup(ibase);
}
