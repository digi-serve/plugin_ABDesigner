/*
 * ui_work_pwa_display
 *
 * Display the PWA Interface Builder Display.  This section
 * of the UI will display a current version of the selected
 * page for the designer to see.
 *
 */

import UI_Class from "./ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();
   const uiConfig = AB.Config.uiSettings();

   class UI_Work_PWA_DISPLAY extends UIClass {
      constructor() {
         super("ab_work_pwa_display", {
            content: "",
            iframe: "",
            noSelection: "",
         });

         this.currentPage = null;

         this._ViewSelect = {
            id: this.ids.noSelection,
            rows: [
               {
                  maxHeight: uiConfig.xxxLargeSpacer,
                  hidden: uiConfig.hideMobile,
               },
               {
                  view: "label",
                  align: "center",
                  height: 200,
                  label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-file-text-o'></div>",
               },
               {
                  view: "label",
                  align: "center",
                  label: L("Select a page to see a preview"),
               },
               {
                  maxHeight: uiConfig.xxxLargeSpacer,
                  hidden: uiConfig.hideMobile,
               },
            ],
         };

         /*
                                 360x800 (11.65%)
                                 390x844 (7.26%)
                                 414x896 (5.66%)
                                 393x873 (5.16%)
                                 328x926 (3.84%)
                              */
         this._ViewIFrame = {
            id: this.ids.iframe,
            view: "iframe",
            height: 700,
            width: 360,
         };
      }

      ui() {
         const ids = this.ids;

         // Our webix UI definition:
         return {
            id: ids.component,
            // scroll: true,
            rows: [
               {
                  view: "toolbar",
                  css: "ab-data-toolbar webix_dark",
                  cols: [
                     { view: "spacer", width: 10 },
                     {
                        view: "label",
                        label: L("Preview"),
                     },
                     {
                        view: "icon",
                        icon: "fa fa-info-circle",
                        tooltip: L("Tip"),
                        on: {
                           onItemClick: () => {
                              this.infoAlert();
                           },
                        },
                     },
                  ],
               },
               {
                  // id: ids.editors,
                  rows: [
                     {},
                     {
                        cols: [
                           {},
                           {
                              /*
                                 360x800 (11.65%)
                                 390x844 (7.26%)
                                 414x896 (5.66%)
                                 393x873 (5.16%)
                                 328x926 (3.84%)
                              */
                              id: ids.content,
                              rows: [this._ViewSelect],
                              // view: "label",
                              // label: L("iFrame Here"),
                              // height: 800,
                              // width: 360,
                              // hidden: true,
                           },
                           {},
                        ],
                     },
                     {},
                  ],
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI
      }

      /**
       * @method clearWorkspace()
       * remove the current editor from the workspace.
       */
      clearWorkspace() {
         let ui = [this._ViewSelect];
         webix.ui(ui, $$(this.ids.content));
      }

      /**
       * @method infoAlert()
       * show the popup info for the Properties panel
       */
      infoAlert() {
         webix.alert({
            title: L("Tip"),
            text: L("Select a page to see it's preview here."),
         });
      }

      pageLoad(page, forced = false) {
         if (!page?.route) return;

         if (!this.currentPage) {
            let ui = [this._ViewIFrame];
            webix.ui(ui, $$(this.ids.content));
         }

         // skip if already loaded
         if (!forced && this.currentPage?.id == page.id) return;

         this.currentPage = page;

         let $iframe = $$(this.ids.iframe);

         let origin = document.location.origin;
         let tenantID = this.AB.Tenant.id();
         let appID = this.currentPage.application.id;
         let urlIFrame = `${origin}/mobile/app/${tenantID}/${appID}?route=${page.route}`;
         if (page.menuType == "tab") {
            urlIFrame = `${origin}/mobile/app/${tenantID}/${appID}?route=tabs/${page.route}`;
         }

         $iframe.load(urlIFrame);
         // console.log("Display: page Load", page);
      }

      refresh() {
         this.pageLoad(this.currentPage, true);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }
   }

   return new UI_Work_PWA_DISPLAY();
}
