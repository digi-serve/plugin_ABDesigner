import UI_Class from "./ui_class";

export default function (AB) {
   const ibase = "ui_work_datacollection_workspace_linked_dc";
   const UIClass = UI_Class(AB);
   const uiConfig = AB.Config.uiSettings();
   const uiCustom = AB.custom;
   const L = UIClass.L();

   class UI_Work_Datacollection_Workspace_Linked_DC extends UIClass {
      constructor() {
         super(ibase, {
            selectList: "",
         });

         this.AB = AB;
         // {ABFactory}
      }

      _getLinkedDC() {
         const currentDC = this.CurrentDatacollection;
         return currentDC?.datacollectionLink ?? currentDC?.datacollectionFollow;
      }

      _populateOptions() {
         let $selectList = $$(this.ids.selectList);

         const dcLink = this._getLinkedDC();

         // Populate linked DC options
         const _ui = this.ui(dcLink.getData(), dcLink.getCursor()?.id);
         $selectList = this.AB.Webix.ui(_ui, $selectList);

         // Refresh columns
         const columns = [];
         dcLink.datasource.fields().forEach((f) => {
            if (f.key == "connectObject" || f.key == "image" || f.key == "file")
               return;

            columns.push({
               id: f.columnName,
               header: f.label,
               minWidth: 150,
               fillspace: true,
            });
         });
         const $table = $selectList.getPopup().getBody();
         $table.refreshColumns(columns);
         $table.refresh();

         $selectList.show();
      }

      ui(options = [], value) {
         const ids = this.ids;
         const currentDC = this.CurrentDatacollection;
         const linkedDC = this._getLinkedDC();

         return {
            id: ids.selectList,
            view: "richselect",
            label: L("Linked cursor: "),
            labelWidth: 100,
            value,
            options: {
               view: "gridsuggest",
               data: options ?? [],
               template: function (item) {
                  return linkedDC?.datasource?.displayData(item) ?? item.id;
               },
            },
            on: {
               onChange: (val) => {
                  linkedDC?.setCursor(val);
                  currentDC.reloadData(0, 20);
               }
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         const ids = this.ids;

         const $selectList = $$(ids.selectList);
         if ($selectList) {
            AB.Webix.extend($selectList, AB.Webix.ProgressBar);
         }
      }

      async datacollectionLoad(dc) {
         const ids = this.ids;
         super.datacollectionLoad(dc);

         const dcLink = this._getLinkedDC();
         if (dcLink) {
            if (dcLink.dataStatus == dcLink.dataStatusFlag.initialized) {
               this._populateOptions();
            }
            else {
               dcLink.once("initializedData", () => {
                  this._populateOptions();
                  dc.reloadData(0, 20);
               });
            }
         }
         else {
            $$(ids.selectList).hide();
         }
      }

      busy() {
         const ids = this.ids;

         const $selectList = $$(ids.selectList);

         if ($selectList?.showProgress)
            $selectList.showProgress({ type: "icon" });
      }

      ready() {
         const ids = this.ids;

         const $selectList = $$(ids.selectList);

         if ($selectList?.hideProgress) $selectList.hideProgress();
      }
   }

   return new UI_Work_Datacollection_Workspace_Linked_DC();
}
