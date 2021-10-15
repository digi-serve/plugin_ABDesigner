import "@babel/polyfill";
import assert from "assert";

import AB from "../../_mock/AB.js";
import UICsvObject from "../../../src/rootPages/Designer/ui_work_object_list_newObject_csv.js";

const getStaticIds = () => {
   let base = "ui_work_object_list_newObject_csv";

   return {
      base: base,
      form: `${base}_csvForm`,
      uploadFileList: `${base}_uploadFileList`,
      separatedBy: `${base}_separatedBy`,
      headerOnFirstLine: `${base}_headerOnFirstLine`,
      columnList: `${base}_columnList`,
      importButton: `${base}_importButton`,
   };
};

describe("ui_work_object_list_newObject_csv", function () {
   it(".constructor - should set valid properties", function () {
      // NOTE: .constructor is called by new() in function
      // target.constructor();
      let ab = new AB();
      let target = UICsvObject(ab);

      const IDS = getStaticIds();

      assert.equal(IDS.base, target.ids.component);
      assert.equal(IDS.form, target.ids.form);
      assert.equal(IDS.uploadFileList, target.ids.uploadFileList);
      assert.equal(IDS.separatedBy, target.ids.separatedBy);
      assert.equal(IDS.headerOnFirstLine, target.ids.headerOnFirstLine);
      assert.equal(IDS.columnList, target.ids.columnList);
      assert.equal(IDS.importButton, target.ids.importButton);

      assert.equal(ab, target._csvImporter.AB);
   });

   it(".ui - should pass valid id to webix elements", function () {
      let ab = new AB();
      let target = UICsvObject(ab);

      const IDS = getStaticIds();

      let result = target.ui();

      assert.equal(IDS.base, result.id);
      assert.equal(IDS.form, result.body.id);
      assert.equal(IDS.uploadFileList, result.body.elements[1].link);
      assert.equal(IDS.uploadFileList, result.body.elements[2].id);
      assert.equal(IDS.separatedBy, result.body.elements[3].id);
      assert.equal(IDS.headerOnFirstLine, result.body.elements[4].id);
      assert.equal(IDS.columnList, result.body.elements[5].rows[0].body.id);
      assert.equal(IDS.importButton, result.body.elements[6].cols[2].id);
   });

   it(".init - should init and store webix elements to variables", async function() {
      let ab = new AB();
      let target = UICsvObject(ab);

      const IDS = getStaticIds();

      await target.init();

      assert.notEqual(null, target._dataRows);
      assert.equal(IDS.form, target.$form.id);
      assert.equal(IDS.uploadFileList, target.$uploadFileList.id);
      assert.equal(IDS.separatedBy, target.$separatedBy.id);
      assert.equal(IDS.headerOnFirstLine, target.$headerOnFirstLine.id);
      assert.equal(IDS.columnList, target.$columnList.id);
      assert.equal(IDS.importButton, target.$importButton.id);
   });
});
