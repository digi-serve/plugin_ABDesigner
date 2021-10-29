import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";

import AB from "../../_mock/AB.js";
import UIQueryBlank from "../../../src/rootPages/Designer/ui_work_query_list_newQuery_blank";

const base = "ui_work_query_list_newQuery_blank";

function getTarget(ab = null) {
   if (!ab) ab = new AB();
   const UI_Query_Blank = UIQueryBlank(ab);
   const target = new UI_Query_Blank();

   return target;
}

describe("ui_work_query_list_newQuery_blank", function () {
   it(".constructor - should set properly ids properties", function () {
      const target = getTarget();

      assert.equal(base, target.ids.component);
      assert.equal(`${base}_blank`, target.ids.form);
      assert.equal(`${base}_save`, target.ids.buttonSave);
      assert.equal(`${base}_cancel`, target.ids.buttonCancel);
      assert.equal(`${base}_object`, target.ids.object);
   });

   it(".ui - should return UI definition", function () {
      const target = getTarget();

      const result = target.ui();

      assert.equal(true, result != null);
      assert.equal(target.ids.component, result.id);
   });

   it(".init - should set listen save events", async function () {
      const ab = new AB();
      const target = getTarget(ab);
      const spyOn = sinon.spy(target, "on");

      await target.init(ab);

      assert.equal(ab, target.AB);
      assert.equal(true, target.$form != null);
      assert.equal("save.error", spyOn.getCalls()[0].args[0]);
      assert.equal("save.successful", spyOn.getCalls()[1].args[0]);
   });

   it(".cancel - should clear form values and trigger 'cancel' event", function () {
      const target = getTarget();
      const spyFormClear = sinon.spy(target, "formClear");
      const spyEmit = sinon.spy(target, "emit");

      target.cancel();

      assert.equal(true, spyFormClear.calledOnce);
      assert.equal(true, spyEmit.calledOnceWith("cancel"));
   });

   it(".formClear - should clear form values", function () {
      const target = getTarget();
      target.$form = $$("target.ids.form");
      const spyClearValidation = sinon.spy(target.$form, "clearValidation");
      const spyClear = sinon.spy(target.$form, "clear");

      target.formClear();

      assert.equal(true, spyClearValidation.calledOnce);
      assert.equal(true, spyClear.calledOnce);
   });
});
