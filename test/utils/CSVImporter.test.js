import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";

import AB from "../_mock/AB.js";
import CSVImporter from "../../src/utils/CSVImporter.js";

function getMockAB() {
   return new AB();
}

function getTarget() {
   const ab = getMockAB();
   return new CSVImporter(ab);
}

describe("CSVImporter", function () {
   it(".constructor - should store AB to a local variable", function () {
      const ab = getMockAB();
      const target = new CSVImporter(ab);

      assert.equal(ab, target._AB);
   });

   it(".L - should pass valid parameters and return result of .labelPlugin function", function () {
      const ab = getMockAB();
      const target = new CSVImporter(ab);
      const pluginKey = "ABDesigner";
      const expectParams = ["A", "B", "C"];
      const expectResult = "RESULT";

      const spyLabelPlugin = sinon.stub(ab.Multilingual, "labelPlugin");
      spyLabelPlugin.returns(expectResult);

      const result = target.L(expectParams);

      assert.equal(
         true,
         spyLabelPlugin.calledOnceWith(pluginKey, expectParams)
      );
      assert.equal(expectResult, result);
   });

   it(".getSeparateItems - should return a valid array", function () {
      const target = getTarget();

      const result = target.getSeparateItems();

      assert.equal(4, result.length, "should have 4 items in result");
      assert.equal(",", result[0].id, "The id of first item should be ','");
      assert.equal("\t", result[1].id, "The id of second item should be '\t'");
      assert.equal(";", result[2].id, "The id of third item should be ';'");
      assert.equal("s", result[3].id, "The id of fourth item should be 's'");
   });

   it(".validateFile - should return false because the parameter is invalid", function () {
      const target = getTarget();
      let result;

      result = target.validateFile(undefined);
      assert.equal(
         false,
         result,
         "should return false because the parameter is undefined"
      );

      result = target.validateFile(null);
      assert.equal(
         false,
         result,
         "should return false because the parameter is null"
      );

      result = target.validateFile({ file: null });
      assert.equal(
         false,
         result,
         "should return false because .file property is null"
      );

      result = target.validateFile({ file: { type: null } });
      assert.equal(
         false,
         result,
         "should return false because .type property is null"
      );
   });

   it(".validateFile - should return false because file type is invalid", function () {
      const target = getTarget();
      let param = {
         file: { type: "" },
      };
      let result;

      param.file.type = "application/msword";
      result = target.validateFile(param);
      assert.equal(
         false,
         result,
         `should return false because file type is '${param.file.type}'`
      );

      param.file.type = "image/gif";
      result = target.validateFile(param);
      assert.equal(
         false,
         result,
         `should return false because file type is '${param.file.type}'`
      );
   });

   it(".validateFile - should return true", function () {
      const target = getTarget();
      let param = {
         file: { type: "" },
      };
      let result;

      param.file.type = "text/csv";
      result = target.validateFile(param);
      assert.equal(true, result, "should return true");

      param.file.type = "application/vnd.ms-excel";
      result = target.validateFile(param);
      assert.equal(true, result, "should return true");
   });

   it(".getDataRows - should return a array from the CSV file", async function () {
      const target = getTarget();
      const expectedParams = [
         ["Col1.1", "Col1.2", "Col1.3"],
         ["Col2.1", "Col2.2", "Col2.3"],
      ];
      const fileContent = [
         expectedParams.map((item) => item.join(",")).join("\n"),
      ];
      const fileInfo = {
         file: new Blob(fileContent, {
            type: "text/csv",
         }),
      };
      const separatedBy = ",";

      const spyValidateFile = sinon.spy(target, "validateFile");
      const spyConvertToArray = sinon.spy(target, "convertToArray");

      const result = await target.getDataRows(fileInfo, separatedBy);

      assert.equal(true, spyValidateFile.calledOnceWith(fileInfo));
      assert.equal(true, spyConvertToArray.calledOnce);
      assert.deepStrictEqual(expectedParams, result);
   });

   it(".convertToArray - should return an array", function () {
      const target = getTarget();
      const text = `
         Header1,Header2,Header3\n
         Value1.1,Value1.2,Value1.3\r\n
         Value2.1,Value2.2,Value2.3\r
         \n
         Value3.1,Value3.2,Value3.3\n
      `;
      const separatedBy = ",";

      const result = target.convertToArray(text, separatedBy);

      assert.equal(true, Array.isArray(result));
   });

   it(".getGuessDataType - should return a valid data type", function () {
      const target = getTarget();
      const expectedParams = [
         [null, "string"],
         ["", "string"],
         [0, "boolean"],
         [1, "boolean"],
         [true, "boolean"],
         [false, "boolean"],
         ["checked", "boolean"],
         ["unchecked", "boolean"],
         [5, "number"],
         [-5, "number"],
         ["2021-05-28", "date"],
         ["ANYTHING", "string"],
      ];
      const dataRows = [[], expectedParams.map((p) => p[0])];

      for (
         let columnIndex = 0;
         columnIndex < dataRows[1].length;
         columnIndex++
      ) {
         const dataType = target.getGuessDataType(dataRows, columnIndex);

         assert.equal(expectedParams[columnIndex][1], dataType);
      }
   });

   it(".reformat - should remove double and single quotes", function () {
      const target = getTarget();
      const param = `"Lorem ipsum" 'dolor' sit amet, "consectetur" adipiscing elit.`;

      const result = target.reformat(param);

      assert.equal(true, result.indexOf(`"`) < 0);
      assert.equal(true, result.indexOf(`'`) < 0);
   });
});
