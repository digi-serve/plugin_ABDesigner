import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";

import AB from "../../_mock/AB.js";
import UINewProcess from "../../../src/rootPages/Designer/ui_work_process_list_newProcess";

const base = "ab_work_process_list_newProcess";

function getTarget(ab = null) {
   if (!ab) ab = new AB();
   const UI_New_Process = UINewProcess(ab);
   const target = new UI_New_Process();

   return target;
}

function getMockApplication() {
   const application = sinon.createStubInstance(EventEmitter);
   application.processCreate = () => {};
   return application;
}

describe("ui_work_process_list_newProcess", function () {
   it(".constructor - should set properly ids properties", function () {
      const target = getTarget();

      assert.equal(base, target.ids.component);
      assert.equal(`${base}_form`, target.ids.form);
      assert.equal(`${base}_buttonCancel`, target.ids.buttonCancel);
      assert.equal(`${base}_buttonSave`, target.ids.buttonSave);
      assert.equal(true, target.CurrentApplication == null);
      assert.equal(true, target.selectNew == true);
   });

   it(".ui - should return UI definition", function () {
      const target = getTarget();

      const result = target.ui();

      assert.equal(true, result != null);
      assert.equal(target.ids.component, result.id);
   });

   it(".init - should define webix elements", async function () {
      const ab = new AB();
      const target = getTarget(ab);
      webix.extend.restore && webix.extend.restore();
      const spyExtend = sinon.spy(webix, "extend");
      const spyHide = sinon.spy(target, "hide");

      await target.init(ab);

      assert.equal(ab, target.AB);
      assert.equal(true, spyExtend.calledOnce);
      assert.equal(true, target.$component != null);
      assert.equal(true, target.$form != null);
      assert.equal(true, target.$buttonSave != null);
      assert.equal(true, spyHide.calledOnce);
   });

   it(".applicationLoad - should store application", function () {
      const target = getTarget();
      const application = sinon.createStubInstance(EventEmitter);

      target.applicationLoad(application);

      assert.equal(application, target.CurrentApplication);
   });

   it(".save - should call webix.alert and return false when CurrentApplication is null", async function () {
      const target = getTarget();
      webix.alert.restore && webix.alert.restore();
      const spyAlert = sinon.spy(webix, "alert");
      const spyEmit = sinon.spy(target, "emit");

      const expectedValues = {};

      const result = await target.save(expectedValues);

      assert.equal(false, result);
      assert.equal(true, spyAlert.calledOnce);
      assert.equal(true, spyEmit.calledOnceWith("save.error", true));
   });

   it(".save - should call .processCreate when .CurrentApplication has value", async function () {
      const target = getTarget();
      target.CurrentApplication = getMockApplication();

      const newProcess = {};
      const spyProcessCreate = sinon
         .stub(target.CurrentApplication, "processCreate")
         .callsFake(() => newProcess);
      const spyBusy = sinon.spy(target, "busy");
      const spyEmit = sinon.spy(target, "emit");
      const spyClear = sinon.stub(target, "clear");
      const spyHide = sinon.spy(target, "hide");
      const spyReady = sinon.spy(target, "ready");

      const expectedValues = {};
      const result = await target.save(expectedValues);

      assert.equal(true, result);
      assert.equal(true, spyBusy.calledOnce);
      assert.equal(true, spyProcessCreate.calledOnceWith(expectedValues));
      assert.equal(true, spyEmit.calledOnceWith("save", newProcess));
      assert.equal(true, spyClear.calledOnce);
      assert.equal(true, spyHide.calledOnce);
      assert.equal(true, spyReady.calledOnce);
   });

   it(".show - should call $component.show", function () {
      const target = getTarget();
      target.init();
      const spyShow = sinon.spy(target.$component, "show");

      target.show();

      assert.equal(true, spyShow.calledOnce);
   });

   it(".hide - should call $component.hide", function () {
      const target = getTarget();
      target.init();
      const spyHide = sinon.spy(target.$component, "hide");

      target.hide();

      assert.equal(true, spyHide.calledOnce);
   });

   it(".clear - should call clear functions of webix elements", function () {
      const target = getTarget();
      target.init();
      const spyClearValidation = sinon.spy(target.$form, "clearValidation");
      const spyClear = sinon.spy(target.$form, "clear");
      const spyEnable = sinon.spy(target.$buttonSave, "enable");

      target.clear();

      assert.equal(true, spyClearValidation.calledOnce);
      assert.equal(true, spyClear.calledOnce);
      assert.equal(true, spyEnable.calledOnce);
   });

   it(".busy - should call .showProgress function", function () {
      const target = getTarget();
      target.init();
      const spyShowProgress = sinon.spy(target.$component, "showProgress");

      target.busy();

      assert.equal(true, spyShowProgress.calledOnce);
   });

   it(".ready - should call .hideProgress function", function () {
      const target = getTarget();
      target.init();
      const spyHideProgress = sinon.spy(target.$component, "hideProgress");

      target.ready();

      assert.equal(true, spyHideProgress.calledOnce);
   });
});
