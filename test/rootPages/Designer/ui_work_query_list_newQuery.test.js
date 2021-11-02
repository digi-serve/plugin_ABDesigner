import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";

import AB from "../../_mock/AB.js";
import UINewQuery from "../../../src/rootPages/Designer/ui_work_query_list_newQuery";

const base = "ab_work_query_list_newQuery";

function getTarget(ab = null) {
   if (!ab) ab = new AB();
   const UI_New_Query = UINewQuery(ab);
   const target = new UI_New_Query();

   return target;
}

describe("ab_work_query_list_newQuery", function () {
   it(".constructor - should set properly ids properties", function () {
      const target = getTarget();

      assert.equal(base, target.ids.component);
      assert.equal(`${base}_tab`, target.ids.tab);
      assert.equal(true, target.BlankTab != null);
      assert.equal(true, target.ImportTab != null);
   });

   it(".ui - should return UI definition", function () {
      const target = getTarget();

      const result = target.ui();

      assert.equal(true, result != null);
      assert.equal(target.ids.component, result.id);
   });

   it(".init - should call init and set listen save events of sub-pages", async function () {
      const ab = new AB();
      const target = getTarget();
      const spyUI = sinon.spy(webix, "ui");
      const spyExtend = sinon.spy(webix, "extend");
      const spyBlankTabInit = sinon.spy(target.BlankTab, "init");
      const spyBlankTabOn = sinon.spy(target.BlankTab, "on");
      const spyImportTabInit = sinon.spy(target.ImportTab, "init");
      const spyImportTabOn = sinon.spy(target.ImportTab, "on");

      await target.init(ab);

      assert.equal(ab, target.AB);
      assert.equal(true, spyUI.calledOnce);
      assert.equal(true, spyExtend.calledOnce);
      assert.equal(true, target.$component != null);
      assert.equal(true, spyBlankTabInit.calledOnceWith(ab));
      assert.equal(true, spyImportTabInit.calledOnceWith(ab));
      assert.equal("cancel", spyBlankTabOn.getCalls()[2].args[0]);
      assert.equal("save", spyBlankTabOn.getCalls()[3].args[0]);
      assert.equal("cancel", spyImportTabOn.getCalls()[2].args[0]);
      assert.equal("save", spyImportTabOn.getCalls()[3].args[0]);
   });

   it(".applicationLoad - should store application", function () {
      const target = getTarget();
      const application = sinon.createStubInstance(EventEmitter);

      target.applicationLoad(application);

      assert.equal(application, target.currentApplication);
   });
});
