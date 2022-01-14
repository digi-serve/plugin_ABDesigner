/*
 * ab_work_object_workspace_track
 *
 * Manage the Object Workspace track area.
 *
 */
// const ABComponent = require("../classes/platform/ABComponent");

export default function (AB) {
   const ClassUI = AB.ClassUI;
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UIWorkObjectWorkspacePopupTrack extends ClassUI {
      /**
       * @param {object} App
       * @param {string} idBase
       */
      constructor() {
         var idBase = "ui_work_object_workspace_track";

         super({
            popup: `${idBase}_popup`,
            timeline: `${idBase}_timeline`,
         });
      }

      // Our webix UI definition:
      ui() {
         let ids = this.ids;

         return {
            view: "window",
            id: ids.popup,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Record History"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     align: "right",
                     click: () => {
                        this.close();
                     },
                     on: {
                        onAfterRender() {
                           ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            position: "center",
            resize: true,
            modal: true,
            editable: false,
            width: 500,
            height: 500,
            body: {
               view: "timeline",
               id: ids.timeline,
               type: {
                  height: 140,
                  templateDate: (obj) => {
                     return this.AB.toDateFormat(obj.timestamp, {
                        localeCode: "en",
                        format: "DD MMM, YYYY hh:mma",
                     });
                  },
                  lineColor: (obj) => {
                     switch (obj.level) {
                        case "insert":
                           return "#FF5C4C";
                        case "update":
                           return "#1CA1C1";
                        case "delete":
                           return "#94A1B3";
                     }
                  },
               },
               scheme: {
                  $init: (obj) => {
                     // Action
                     switch (obj.level) {
                        case "insert":
                           obj.value = L("Add");
                           break;
                        case "update":
                           obj.value = L("Edit");
                           break;
                        case "delete":
                           obj.value = L("Delete");
                           break;
                     }

                     // By
                     obj.details = `by <b>${obj.username || L("Unknown")}</b>`;

                     // Detail of record
                     if (obj.record) {
                        let recDetail = "";
                        Object.keys(obj.record).forEach((prop) => {
                           recDetail = recDetail.concat(
                              `${prop}: <b>${
                                 obj.record[prop] != null
                                    ? obj.record[prop]
                                    : ""
                              }</b> <br />`
                           );
                        });

                        obj.details = obj.details.concat("<br />");
                        obj.details = obj.details.concat(
                           `<div>${recDetail}</div>`
                        );
                     }
                  },
               },
            },
         };
      }

      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());

         let $timeline = $$(this.ids.timeline);
         if ($timeline) {
            webix.extend($timeline, webix.ProgressBar);
         }
      }

      open(object, rowId) {
         this.CurrentObject = object;

         let ids = this.ids;
         let $popup = $$(ids.popup);
         if (!$popup) return;

         $popup.show();

         this.loadData(rowId);
      }

      async loadData(rowId) {
         if (!this.CurrentObject) return;

         let $timeline = $$(this.ids.timeline);

         // pull tracking data
         $timeline.showProgress({ type: "icon" });
         try {
            var data = this.CurrentObject.model().logs({ rowId });
            $timeline.clearAll(true);
            $timeline.parse(data);
         } catch (err) {
            console.error(err);
            webix.alert({
               text: L("Unable to display logs for this entry."),
            });
         }
         $timeline.hideProgress();
      }

      close() {
         let ids = this.ids;
         let $popup = $$(ids.popup);
         if (!$popup) return;

         $popup.hide();
      }
   }

   return new UIWorkObjectWorkspacePopupTrack();
}
