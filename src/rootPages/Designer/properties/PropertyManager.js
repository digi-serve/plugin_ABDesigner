/*
 * PropertyManager
 *
 * An Interface for managing all the various Property Editors we support.
 *
 */
export default function (AB) {
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
      let Klass = F.default(AB);
      Fields.push(new Klass());
   });

   var Processes = [];
   // {array}
   // All the ABProcess... Property Interfaces Available
   [
      require("./process/ABProcessEnd.js"),
      require("./process/ABProcessGatewayExclusive.js"),
      require("./process/ABProcessParticipant.js"),
      require("./process/ABProcessTaskEmail.js"),
      require("./process/ABProcessTriggerLifecycle.js"),
      require("./process/ABProcessTaskService.js"),
      require("./process/ABProcessTaskServiceInsertRecord.js"),
      require("./process/ABProcessTaskServiceCalculate.js"),
      require("./process/ABProcessTaskServiceGetResetPasswordUrl.js"),
      require("./process/ABProcessTaskServiceQuery.js"),
      require("./process/ABProcessTaskSubProcess.js"),
      require("./process/ABProcessTaskUser.js"),
      require("./process/ABProcessTaskUserApproval.js"),
      require("./process/ABProcessTaskUserExternal.js"),
      require("./process/ABProcessTriggerTimer.js"),
   ].forEach((P) => {
      let Klass = P.default(AB);
      Processes.push(Klass);
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
      require("./views/ABViewCSVExporter"),
      require("./views/ABViewCSVImporter"),
      require("./views/ABViewDataview"),
      require("./views/ABViewDetail"),
      require("./views/ABViewDocxBuilder"),
      require("./views/ABViewForm"),
      require("./views/ABViewFormButton"),
      require("./views/ABViewFormConnect"),
      require("./views/ABViewFormNumber"),
      require("./views/ABViewFormSelectMultiple"),
      require("./views/ABViewFormSelectSingle"),
      require("./views/ABViewFormTextbox"),
      require("./views/ABViewGantt"),
      require("./views/ABViewGrid"),
      require("./views/ABViewLabel"),
      require("./views/ABViewLayout"),
      require("./views/ABViewMenu"),
      require("./views/ABViewPage"),
      require("./views/ABViewTab"),
      require("./views/ABViewText"),
   ].forEach((V) => {
      let Klass = V.default(AB);
      Views.push(Klass);
   });

   return {
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
   };
}
