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
      var Klass = F.default(AB);
      Fields.push(new Klass());
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
   };
}
