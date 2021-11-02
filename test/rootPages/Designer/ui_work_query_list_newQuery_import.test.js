import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";

import AB from "../../_mock/AB.js";
import UIQueryImport from "../../../src/rootPages/Designer/ui_work_query_list_newQuery_import";

const base = "ui_work_query_list_newQuery_import";

function getTarget(ab = null) {
   if (!ab) ab = new AB();
   const UI_Query_Import = UIQueryImport(ab);
   const target = new UI_Query_Import();

   return target;
}

describe("ui_work_query_list_newQuery_import", function () {
   it(".constructor - should set properly ids properties", function () {
      const target = getTarget();

      assert.equal(base, target.ids.component);
      assert.equal(`${base}_import`, target.ids.form);
      assert.equal(`${base}_filter`, target.ids.filter);
      assert.equal(`${base}_queryList`, target.ids.queryList);
      assert.equal(`${base}_save`, target.ids.buttonSave);
      assert.equal(`${base}_cancel`, target.ids.buttonCancel);
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
      assert.equal(true, target.$filter != null);
      assert.equal(true, target.$queryList != null);
      assert.equal(true, target.$buttonSave != null);
      assert.equal(true, target.$buttonCancel != null);
      assert.equal("save.error", spyOn.getCalls()[0].args[0]);
      assert.equal("save.successful", spyOn.getCalls()[1].args[0]);
   });

   it(".onShow - should load object data to list and set UI", function () {
      const target = getTarget();
      const spyFormClear = sinon.spy(target, "formClear");
      target.$queryList = $$(target.ids.queryList);
      const spyParse = sinon.spy(target.$queryList, "parse");
      const application = sinon.createStubInstance(EventEmitter);
      application.queriesExcluded = () => [
         {
            id: 1,
            value: "Query1",
         },
         {
            id: 2,
            value: "Query2",
         },
      ];

      target.onShow(application);

      assert.equal(application, target.currentApp);
      assert.equal(true, spyFormClear.calledOnce);
      const optValues = spyParse.getCalls()[0].args[0];
      application.queriesExcluded().forEach((item, index) => {
         assert.equal(item.id, optValues[index].id);
         assert.equal(item.value, optValues[index].value);
      });
      assert.equal("json", spyParse.getCalls()[0].args[1]);
   });

   it(".filter - should filter with properly search text", function () {
      const target = getTarget();
      target.$filter = $$(target.ids.filter);
      target.$queryList = $$(target.ids.queryList);
      const filterText = "FILTER_TEXT";
      const spyGetValue = sinon
         .stub(target.$filter, "getValue")
         .callsFake(() => filterText);
      const spyFilter = sinon.spy(target.$queryList, "filter");

      target.filter();

      assert.equal(true, spyGetValue.calledOnce);
      assert.equal(true, spyFilter.calledOnceWith("#label#", filterText));
   });

   it(".save - should pass a selected item to trigger save event and disable the save button", function () {
      const target = getTarget();
      target.$queryList = $$(target.ids.queryList);
      target.$buttonSave = $$(target.ids.buttonSave);
      const selectedItem = { id: "SELECT_ID" };
      const spyGetSelectedItem = sinon
         .stub(target.$queryList, "getSelectedItem")
         .callsFake(() => selectedItem);
      const spyDisable = sinon.spy(target.$buttonSave, "disable");
      const spyEmit = sinon.spy(target, "emit");

      target.save();

      assert.equal(true, spyGetSelectedItem.calledOnce);
      assert.equal(true, spyDisable.calledOnce);
      assert.equal(true, spyEmit.calledOnceWith("save", selectedItem));
   });

   it(".cancel - should clear form values and trigger 'cancel' event", function () {
      const target = getTarget();
      const spyFormClear = sinon.spy(target, "formClear");
      const spyEmit = sinon.spy(target, "emit");

      target.cancel();

      assert.equal(true, spyFormClear.calledOnce);
      assert.equal(true, spyEmit.calledOnce);
   });

   it(".formClear - should clear form values and list", function () {
      const target = getTarget();
      target.$form = $$(target.ids.form);
      target.$queryList = $$(target.ids.queryList);
      const spyClearValidation = sinon.spy(target.$form, "clearValidation");
      const spyClear = sinon.spy(target.$form, "clear");
      const spyClearAll = sinon.spy(target.$queryList, "clearAll");

      target.formClear();

      assert.equal(true, spyClearValidation.calledOnce);
      assert.equal(true, spyClear.calledOnce);
      assert.equal(true, spyClearAll.calledOnce);
   });

   it(".onSuccess - should enable the save button", function () {
      const target = getTarget();
      target.$buttonSave = $$(target.ids.buttonSave);
      const spyEnable = sinon.spy(target.$buttonSave, "enable");

      target.onSuccess();

      assert.equal(true, spyEnable.calledOnce);
   });
});
