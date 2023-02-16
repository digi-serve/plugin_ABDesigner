/*
 * UI Warnings
 *
 * Display the warnings console
 *
 */
import UI_Class from "./ui_class";

export default function (AB, iBase, iSettings) {
   iBase = iBase || "ui_warnings";
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Warnings extends UIClass {
      constructor(idBase, settings = {}) {
         super(idBase, {
            buttonWarning: "",
            buttonWarningHide: "",
            warnings: "",
            warningsScroll: "",
         });
      }

      ui() {
         var ids = this.ids;

         return {
            rows: [
               {
                  view: "button",
                  type: "form",
                  id: ids.buttonWarning,
                  css: "webix_primary darkorange",
                  value: `<i class="fa fa-warning"></i> ${L("Show Issues")}`,
                  hidden: true,
                  click: () => {
                     $$(ids.warnings).show();
                     $$(ids.buttonWarning).hide();
                     $$(ids.buttonWarningHide).show();
                  },
               },
               {
                  view: "button",
                  type: "form",
                  id: ids.buttonWarningHide,
                  css: "webix_primary darkorange",
                  value: `<i class="fa fa-warning"></i> ${L("Hide Issues")}`,
                  hidden: true,
                  click: () => {
                     $$(ids.warnings).hide();
                     $$(ids.buttonWarningHide).hide();
                     $$(ids.buttonWarning).show();
                  },
               },
               {
                  id: ids.warnings,
                  view: "scrollview",
                  scroll: "y",
                  css: "webix_theme_dark",
                  minHeight: 300,
                  body: {
                     rows: [
                        {
                           id: ids.warningsScroll,
                           template: "Here are my warnings",
                           autoheight: true,
                           css: "webix_theme_dark",
                        },
                     ],
                  },
                  hidden: true,
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;
      }

      show(currentObject) {
         super.show();

         var ids = this.ids;

         let warningsAll = currentObject?.warningsAll();
         if (warningsAll?.length) {
            let message = "<ul class='warningslist'>";
            warningsAll.forEach((issue) => {
               if (issue)
                  message += `<li><i class="warningtext fa fa-warning"></i> ${issue.message}</li>`;
            });
            message += `</ul>`;
            $$(ids.warningsScroll).setHTML(message);
            if ($$(ids.warnings).isVisible()) {
               $$(ids.buttonWarning).hide();
               $$(ids.buttonWarningHide).show();
            } else {
               $$(ids.buttonWarning).show();
               $$(ids.buttonWarningHide).hide();
            }
         } else {
            $$(ids.warningsScroll).setHTML("");
            $$(ids.warnings).hide();
            $$(ids.buttonWarning).hide();
            $$(ids.buttonWarningHide).hide();
         }
      }
   }
   return new UI_Warnings(iBase, iSettings);
}
