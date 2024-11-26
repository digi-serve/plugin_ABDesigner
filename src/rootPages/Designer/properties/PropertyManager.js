/*
 * PropertyManager
 *
 * An Interface for managing all the various Property Editors we support.
 *
 */

var PropertyMgr = null;

export default function (AB) {
   if (!PropertyMgr) {
      var Fields = [];
      // {array}
      // All the ABField Property Inerfaces available.
      [
         require("./dataFields/ABFieldAutoIndex"),
         require("./dataFields/ABFieldBoolean"),
         require("./dataFields/ABFieldCalculate"),
         require("./dataFields/ABFieldCombine"),
         require("./dataFields/ABFieldConnect"),
         require("./dataFields/ABFieldDate"),
         require("./dataFields/ABFieldDateTime"),
         require("./dataFields/ABFieldEmail"),
         require("./dataFields/ABFieldFile"),
         require("./dataFields/ABFieldFormula"),
         require("./dataFields/ABFieldImage"),
         require("./dataFields/ABFieldJson"),
         require("./dataFields/ABFieldList"),
         require("./dataFields/ABFieldLongText"),
         require("./dataFields/ABFieldNumber"),
         require("./dataFields/ABFieldString"),
         require("./dataFields/ABFieldTextFormula"),
         require("./dataFields/ABFieldTree"),
         require("./dataFields/ABFieldUser"),
      ].forEach((F) => {
         Fields.push(F.default(AB));
      });

      var Processes = [];
      // {array}
      // All the ABProcess... Property Interfaces Available
      [
         require("./process/ABProcessEnd.js"),
         require("./process/ABProcessGatewayExclusive.js"),
         require("./process/ABProcessParticipant.js"),
         require("./process/ABProcessTaskEmail.js"),
         require("./process/ABProcessTaskService.js"),
         require("./process/ABProcessTaskServiceAccountingBatchProcessing.js"),
         require("./process/ABProcessTaskServiceAccountingFPClose.js"),
         require("./process/ABProcessTaskServiceAccountingFPYearClose.js"),
         require("./process/ABProcessTaskServiceAccountingJEArchive.js"),
         require("./process/ABProcessTaskServiceCalculate.js"),
         require("./process/ABProcessTaskServiceGetResetPasswordUrl.js"),
         require("./process/ABProcessTaskServiceInsertRecord.js"),
         require("./process/ABProcessTaskServiceQuery.js"),
         require("./process/ABProcessTaskSubProcess.js"),
         require("./process/ABProcessTaskUser.js"),
         require("./process/ABProcessTaskUserApproval.js"),
         require("./process/ABProcessTaskUserExternal.js"),
         require("./process/ABProcessTriggerLifecycle.js"),
         require("./process/ABProcessTriggerTimer.js"),
      ].forEach((P) => {
         Processes.push(P.default(AB));
      });

      var Views = [];
      // {array}
      // All the ABViewXXX Property Interfaces Available.
      [
         require("./views/ABViewCarousel"),
         require("./views/ABViewChart"),
         require("./views/ABViewChartArea"),
         require("./views/ABViewChartBar"),
         require("./views/ABViewChartLine"),
         require("./views/ABViewChartPie"),
         require("./views/ABViewComment"),
         require("./views/ABViewConditionalContainer"),
         require("./views/ABViewContainer"),
         require("./views/ABViewCSVExporter"),
         require("./views/ABViewCSVImporter"),
         require("./views/ABViewDataFilter"),
         require("./views/ABViewDataSelect"),
         require("./views/ABViewDataview"),
         require("./views/ABViewDetail"),
         require("./views/ABViewDetailCheckbox"),
         require("./views/ABViewDetailCustom"),
         require("./views/ABViewDetailImage"),
         require("./views/ABViewDetailItem"),
         require("./views/ABViewDetailText"),
         require("./views/ABViewDetailTree"),
         require("./views/ABViewDocxBuilder"),
         require("./views/ABViewForm"),
         require("./views/ABViewFormButton"),
         require("./views/ABViewFormCheckbox"),
         require("./views/ABViewFormConnect"),
         require("./views/ABViewFormCustom"),
         require("./views/ABViewFormDatepicker"),
         require("./views/ABViewFormJson"),
         require("./views/ABViewFormNumber"),
         require("./views/ABViewFormSelectMultiple"),
         require("./views/ABViewFormSelectSingle"),
         require("./views/ABViewFormTextbox"),
         require("./views/ABViewFormTree"),
         require("./views/ABViewGantt"),
         require("./views/ABViewGrid"),
         require("./views/ABViewImage"),
         require("./views/ABViewKanban"),
         require("./views/ABViewLabel"),
         require("./views/ABViewLayout"),
         require("./views/ABViewList"),
         require("./views/ABViewMenu"),
         require("./views/ABViewOrgChart"),
         require("./views/ABViewOrgChartTeams"),
         require("./views/ABViewPage"),
         require("./views/ABViewPDFImporter"),
         require("./views/ABViewPivot"),
         require("./views/ABViewReportsManager"),
         require("./views/ABViewScheduler"),
         require("./views/ABViewTab"),
         require("./views/ABViewText"),
      ].forEach((V) => {
         Views.push(V.default(AB));
      });

      var MobileViews = [];
      // {array}
      // All the ABMobileViewXXX Property Interfaces Available.
      [
         require("./mobile/ABMobilePage"),
         require("./mobile/ABMobileViewForm"),
         require("./mobile/ABMobileViewFormButton"),
         require("./mobile/ABMobileViewFormCheckbox"),
         require("./mobile/ABMobileViewFormConnect"),
         require("./mobile/ABMobileViewFormDate"),
         require("./mobile/ABMobileViewFormDatetime"),
         require("./mobile/ABMobileViewFormEmail"),
         require("./mobile/ABMobileViewFormFile"),
         require("./mobile/ABMobileViewFormFormula"),
         require("./mobile/ABMobileViewFormImage"),
         require("./mobile/ABMobileViewFormNumber"),
         require("./mobile/ABMobileViewFormReadonly"),
         require("./mobile/ABMobileViewFormSelectMultiple"),
         require("./mobile/ABMobileViewFormSelectSingle"),
         require("./mobile/ABMobileViewFormTextbox"),
         require("./mobile/ABMobileViewLabel"),
         require("./mobile/ABMobileViewList"),
      ].forEach((V) => {
         MobileViews.push(V.default(AB));
      });

      PropertyMgr = {
         /*
          * @function fields
          * return all the currently defined Field Properties in an array.
          * @param {fn} f
          *        A filter for limiting which fields you want.
          * @return [{ClassUI(Field1)}, {ClassUI(Field2)}, ...]
          */
         fields: function (f = () => true) {
            return Fields.filter(f);
         },

         processElements: function (f = () => true) {
            return Processes.filter(f);
         },

         views: function (v = () => true) {
            return Views.filter(v);
         },

         mobileViews: function (v = () => true) {
            return MobileViews.filter(v);
         },
      };
   }
   return PropertyMgr;
}
