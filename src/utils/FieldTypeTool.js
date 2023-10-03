module.exports = class FieldTypeTool {
   static getFieldType(value) {
      if (value === null || value === undefined || value === "") {
         return "string";
      } else if (
         value == 0 ||
         value == 1 ||
         value == true ||
         value == false ||
         value == "checked" ||
         value == "unchecked"
      ) {
         return "boolean";
      } else if (!isNaN(value)) {
         return "number";
      } else if (Date.parse(value)) {
         return "date";
      } else {
         if (value.length > 100) return "LongText";
         else return "string";
      }
   }
};
