import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";

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
      assert.equal(true, target.$buttonSave != null);
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
      target.$form = $$(target.ids.form);
      const spyClearValidation = sinon.spy(target.$form, "clearValidation");
      const spyClear = sinon.spy(target.$form, "clear");

      target.formClear();

      assert.equal(true, spyClearValidation.calledOnce);
      assert.equal(true, spyClear.calledOnce);
   });

   it(".onError - should enable the save button", function () {
      const target = getTarget();
      target.$buttonSave = $$(target.ids.buttonSave);
      const spyEnable = sinon.spy(target.$buttonSave, "enable");

      target.onError();

      assert.equal(true, spyEnable.calledOnce);
   });

   it(".onSuccess - should clear form values and enable the save button", function () {
      const target = getTarget();
      target.$buttonSave = $$(target.ids.buttonSave);
      const spyFormClear = sinon.spy(target, "formClear");
      const spyEnable = sinon.spy(target.$buttonSave, "enable");

      target.onSuccess();

      assert.equal(true, spyFormClear.calledOnce);
      assert.equal(true, spyEnable.calledOnce);
   });

   it(".save - should not save data and return false", function () {
      const target = getTarget();
      target.$buttonSave = $$(target.ids.buttonSave);
      target.$form = $$(target.ids.form);
      const spyDisable = sinon.spy(target.$buttonSave, "disable");
      const spyClearValidation = sinon.spy(target.$form, "clearValidation");
      const spyValidate = sinon
         .stub(target.$form, "validate")
         .callsFake(() => false);
      const spyEnable = sinon.spy(target.$buttonSave, "enable");

      const result = target.save();

      assert.equal(true, spyDisable.calledOnce);
      assert.equal(true, spyClearValidation.calledOnce);
      assert.equal(true, spyValidate.calledOnce);
      assert.equal(true, spyEnable.calledOnce);
      assert.equal(false, result);
   });

   it(".save - should call save data", function () {
      const target = getTarget();
      target.$buttonSave = $$(target.ids.buttonSave);
      target.$form = $$(target.ids.form);
      const spyDisable = sinon.spy(target.$buttonSave, "disable");
      const spyClearValidation = sinon.spy(target.$form, "clearValidation");
      const spyValidate = sinon
         .stub(target.$form, "validate")
         .callsFake(() => true);
      const values = {
         name: "NAME",
         object: "OBJECT_ID",
      };
      const spyGetValues = sinon
         .stub(target.$form, "getValues")
         .callsFake(() => values);
      const spyEmit = sinon.spy(target, "emit");

      target.save();

      assert.equal(true, spyDisable.calledOnce);
      assert.equal(true, spyClearValidation.calledOnce);
      assert.equal(true, spyValidate.calledOnce);
      assert.equal(true, spyGetValues.calledOnce);
      assert.equal("save", spyEmit.getCalls()[0].args[0]);
      const result = spyEmit.getCalls()[0].args[1];
      assert.equal(values.name, result.name);
      assert.equal(values.name, result.label);
      assert.equal(values.object, result.joins.objectID);
   });

   it(".onShow - should load object data to list and set UI", function () {
      const target = getTarget();
      target.$objectList = $$(target.ids.object);
      target.$form = $$(target.ids.form);
      const application = sinon.createStubInstance(EventEmitter);
      application.objectsIncluded = () => [
         {
            id: 1,
            label: "Object1",
         },
         {
            id: 2,
            label: "Object2",
         },
         {
            id: 3,
            label: "Object3",
         },
      ];
      const spyDefine = sinon.spy(target.$objectList, "define");
      const spyRefresh = sinon.spy(target.$objectList, "refresh");
      const popup = $$("POPUP");
      const spyGetPopup = sinon
         .stub(target.$objectList, "getPopup")
         .callsFake(() => popup);
      const spyAttachEvent = sinon.spy(popup, "attachEvent");
      const spySetValues = sinon.spy(target.$form, "setValues");

      target.onShow(application);

      assert.equal("options", spyDefine.getCalls()[0].args[0]);
      const optValues = spyDefine.getCalls()[0].args[1];
      application.objectsIncluded().forEach((item, index) => {
         assert.equal(item.id, optValues[index].id);
         assert.equal(item.label, optValues[index].value);
      });
      assert.equal(true, spyRefresh.calledOnce);
      assert.equal(true, spyGetPopup.calledOnce);
      assert.equal(true, spyAttachEvent.calledOnce);
      assert.equal(true, spySetValues.calledOnce);
   });
});
