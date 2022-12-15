import FABViewRuleAction from "../ABViewRuleAction";

export default function (AB) {
   const ABViewRuleAction = FABViewRuleAction(AB);
   const L = ABViewRuleAction.L();

   class ABViewRuleActionFormSubmitRuleExistPage extends ABViewRuleAction {
      /**
       * @param {object} App
       *      The shared App object that is created in OP.Component
       * @param {string} idBase
       *      Identifier for this component
       */
      constructor(idBase) {
         super(idBase, {
            pagesAndTabs: "",
         });

         this.key = "ABViewRuleActionFormSubmitRuleExistPage";
         this.label = L("Redirect to an existing page");

         this.formRows = []; // keep track of the Value Components being set
         // [
         //		{ fieldId: xxx, value:yyy, type:key['string', 'number', 'date',...]}
         // ]
      }

      ui() {
         return {
            id: this.ids.pagesAndTabs,
            view: "richselect",
            options: [],
         };
      }

      init(AB) {
         this.AB = AB;

         this.refreshUI();
      }

      fromSettings(settings) {
         super.fromSettings(settings); // let the parent handle the QB

         const valueRules = settings.valueRules || {};

         $$(this.ids.pagesAndTabs).setValue(
            valueRules.tabId ?? valueRules.pageId ?? ""
         );
      }

      toSettings() {
         const ids = this.ids;
         const settings = super.toSettings();

         const selectedId = $$(ids.pagesAndTabs).getValue();
         const selectedItem = $$(ids.pagesAndTabs)
            .getPopup()
            .getList()
            .config.data.filter((opt) => opt.id == selectedId)[0];

         if (selectedItem) {
            if (selectedItem.type == "tab") {
               // store page id and tab id
               settings.valueRules = {
                  pageId: selectedItem.pageId,
                  tabId: selectedId,
               };
            } else {
               // store only page id
               settings.valueRules = {
                  pageId: selectedId,
               };
            }
         }

         return settings;
      }

      refreshUI() {
         const ids = this.ids;

         // Pull page list to "Redirect to an existing page"
         const _pageOptions = [];

         /**
          * @param pageOrTab	{Object}	- ABViewPage or ABViewTab
          * @param indent	{integer}
          * @param type		{string}	- 'page' or 'tab'
          * @param pageId	{uuid}		- the id of page (only tab)
          */
         const addPage = (pageOrTab, indent, type, pageId) => {
            indent = indent || "";

            const icon =
               type == "tab" ? "fa fa-window-maximize" : "fa fa-file-o";

            const pageParent = pageOrTab.pageParent();

            _pageOptions.push({
               id: pageOrTab.id,
               value: `${indent}${pageOrTab.label}`,
               type: type,
               pageId: pageParent?.id,
               icon: icon,
            });

            if (type == "page" || type == "tab") {
               (pageOrTab?.pages?.() ?? []).forEach(function (p) {
                  addPage(p, `${indent}-`, "page");
               });

               // add 'tab' options
               (pageOrTab?.views?.((v) => v.key == "tab") ?? []).forEach(
                  (tab) => {
                     // add 'tab view' to options
                     tab.views().forEach((tabView) => {
                        addPage(tabView, `${indent}-`, "tab", pageOrTab.id);
                     });
                  }
               );
            }
         };

         addPage(this.currentForm.pageRoot(), "", "page");

         $$(ids.pagesAndTabs).define("options", _pageOptions);
         $$(ids.pagesAndTabs).refresh();
      }
   }

   return ABViewRuleActionFormSubmitRuleExistPage;
}
