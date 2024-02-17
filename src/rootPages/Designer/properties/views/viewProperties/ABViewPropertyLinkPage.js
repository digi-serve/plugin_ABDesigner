/*
 * ABViewPropertyLinkPage
 * This provides the UI interface for collecting the settings that link a
 * component to various other Pages for editing/viewing/etc...
 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import UI_Class from "../../../ui_class";

export default function (AB, idBase) {
   if (!myClass) {
      const base = `${idBase}_viewpropertylinkpage`;
      const UIClass = UI_Class(AB);
      const uiConfig = AB.Config.uiSettings();
      var L = UIClass.L();

      myClass = class ABViewPropertyLinkPage extends UIClass {
         constructor() {
            super(base, {
               detailsPage: "",
               editPage: "",
            });

            this.AB = AB;
         }

         /**
          * @property default
          * return default settings
          *
          * @return {Object}
          */
         static get default() {
            return {
               detailsPage: null, // uuid
               detailsTab: null, // uuid
               editPage: null, // uuid
               editTab: null, // uuid
            };
         }

         ui() {
            return {
               view: "fieldset",
               label: L("Linked Pages:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: this.ids.detailsPage,
                        view: "combo",
                        clear: true,
                        placeholder: L("No linked view"),
                        name: "detailsPage",
                        label: L("Details Page:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: () => this.emit("changed"),
                        },
                     },
                     {
                        id: this.ids.editPage,
                        view: "combo",
                        clear: true,
                        placeholder: L("No linked form"),
                        name: "editPage",
                        label: L("Edit Form:"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: [],
                        on: {
                           onChange: () => this.emit("changed"),
                        },
                     },
                  ],
               },
            };
         }

         init(AB) {
            this.AB = AB;
            return Promise.resolve();
         }

         clear() {
            $$(this.ids.detailsPage).setValue("");
            $$(this.ids.editPage).setValue("");
         }

         viewLoad(view) {
            this.view = view;
            const ids = this.ids;

            let filter = (v, widgetKey) => {
               return (
                  v.key == widgetKey &&
                  (v.settings.dataviewID == view.settings.dataviewID ||
                     (this.AB ?? view.AB)?.datacollectionByID(
                        v.settings.dataviewID
                     )?.datacollectionFollow?.id == view.settings.dataviewID)
               );
            };

            // Set the options of the possible detail views
            let pagesHasDetail = [];

            pagesHasDetail = pagesHasDetail.concat(
               view
                  .pageRoot()
                  .views((v) => {
                     return filter(v, "detail");
                  }, true)
                  .map((p) => {
                     return {
                        id: p.id,
                        value: p.label,
                     };
                  })
            );

            pagesHasDetail = pagesHasDetail.concat(
               view
                  .pageRoot()
                  .pages((p) => {
                     return p.views((v) => {
                        return filter(v, "detail");
                     }, true).length;
                  }, true)
                  .map((p) => {
                     return {
                        id: p.id,
                        value: p.label,
                     };
                  })
            );

            // pagesHasDetail.unshift({
            //    id: "",
            //    value: L("No linked view"),
            // });
            $$(ids.detailsPage).define("options", pagesHasDetail);
            $$(ids.detailsPage).refresh();

            // Set the options of the possible edit forms
            let pagesHasForm = [];

            pagesHasForm = pagesHasForm.concat(
               view
                  .pageRoot()
                  .views((v) => {
                     return filter(v, "form");
                  }, true)
                  .map((p) => {
                     return {
                        id: p.id,
                        value: p.label,
                     };
                  })
            );

            pagesHasForm = pagesHasForm.concat(
               view
                  .pageRoot()
                  .pages((p) => {
                     return p.views((v) => {
                        return filter(v, "form");
                     }, true).length;
                  }, true)
                  .map((p) => {
                     return {
                        id: p.id,
                        value: p.label,
                     };
                  })
            );

            // pagesHasForm.unshift({
            //    id: 0,
            //    value: L("No linked form"),
            // });
            $$(ids.editPage).define("options", pagesHasForm);
            $$(ids.editPage).refresh();
         }

         setSettings(settings) {
            if (settings.detailsPage) {
               let details = settings.detailsPage;
               if (settings.detailsTab != "") {
                  details += ":" + settings.detailsTab;
               }
               $$(this.ids.detailsPage).setValue(details);
            } else {
               $$(this.ids.detailsPage).setValue(null);
            }
            $$(this.ids.detailsPage).refresh();

            if (settings.editPage) {
               var edit = settings.editPage;
               if (settings.editTab != "") {
                  edit += ":" + settings.editTab;
               }
               $$(this.ids.editPage).setValue(edit);
            } else {
               $$(this.ids.editPage).setValue(null);
            }
            $$(this.ids.editPage).refresh();
         }

         getSettings() {
            let settings = {};

            var detailsPage = $$(this.ids.detailsPage).getValue();
            var detailsTab = "";
            if (detailsPage.split(":").length > 1) {
               var detailsVals = detailsPage.split(":");
               detailsPage = detailsVals[0];
               detailsTab = detailsVals[1];
            }
            settings.detailsPage = detailsPage;
            settings.detailsTab = detailsTab;

            var editPage = $$(this.ids.editPage).getValue();
            var editTab = "";
            if (editPage.split(":").length > 1) {
               var editVals = editPage.split(":");
               editPage = editVals[0];
               editTab = editVals[1];
            }
            settings.editPage = editPage;
            settings.editTab = editTab;

            return settings;
         }
      };
   }

   return myClass;
}
