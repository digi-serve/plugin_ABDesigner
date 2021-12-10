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
      require("./dataFields/ABFieldConnect"),
      require("./dataFields/ABFieldNumber"),
      require("./dataFields/ABFieldString"),
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
