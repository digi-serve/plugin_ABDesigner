import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";

import AB from "../../_mock/AB.js";
import UICommonList from "../../../src/rootPages/Designer/ui_common_list";
import UIProcess from "../../../src/rootPages/Designer/ui_work_process";

const base = "ab_work_process";

function getMockApplication() {
   const application = sinon.createStubInstance(EventEmitter);
   application.processes = () => {};
   return application;
}

function getTarget(ab = null) {
   if (!ab) ab = new AB();
   const UI_Work_Process = UIProcess(ab);
   return new UI_Work_Process();
}

describe("ui_work_process", function () {
   it(".constructor - should set valid properties", function () {
      const target = getTarget();

      assert.equal(base, target.ids.component);
      assert.equal(true, target.CurrentApplication == null);
      assert.equal(true, target.ProcessList != null);
      assert.equal(true, target.ProcessWorkspace != null);
   });

   it(".ui - should return valid UI definition", function () {
      const target = getTarget();

      const result = target.ui();

      assert.equal(base, result.id);
      assert.equal("space", result.type);
      assert.equal(3, result.cols.length);
   });

   it(".init - should pass a valid parameter and call .init of child pages", function () {
      const ab = new AB();
      const target = getTarget(ab);
      const spyProcessListOnSelect = sinon.spy(target.ProcessList, "on");
      const spyProcessWorkspaceInit = sinon.spy(
         target.ProcessWorkspace,
         "init"
      );
      const spyProcessListInit = sinon.spy(target.ProcessList, "init");

      target.init(ab);

      assert.equal(target.AB, ab);
      assert.equal(
         true,
         spyProcessListOnSelect.calledWith("selected", target.select)
      );
      assert.equal(true, spyProcessWorkspaceInit.calledOnceWith(ab));
      assert.equal(true, spyProcessListInit.calledOnceWith(ab));
   });

   it(".applicationLoad - should pass a valid parameter to functions of child pages", async function () {
      const ab = new AB();
      const target = getTarget(ab);
      target.ProcessList.ListComponent = sinon.createStubInstance(
         UICommonList(ab)
      );
      const expectParam = getMockApplication();
      const spyListApplicationLoad = sinon.spy(
         target.ProcessList,
         "applicationLoad"
      );

      target.applicationLoad(expectParam);

      assert.equal(expectParam, target.CurrentApplication);
      assert.equal(true, spyListApplicationLoad.calledOnceWith(expectParam));
   });

   it(".show - should call .applicationLoad of ProcessList when .CurrentApplication is exists", function () {
      const ab = new AB();
      const target = getTarget(ab);
      target.ProcessList.ListComponent = sinon.createStubInstance(
         UICommonList(ab)
      );
      target.CurrentApplication = getMockApplication();
      const spyListBusy = sinon.spy(target.ProcessList, "busy");
      const spyListApplicationLoad = sinon.spy(
         target.ProcessList,
         "applicationLoad"
      );
      const spyListReady = sinon.spy(target.ProcessList, "ready");

      target.show();

      assert.equal(true, spyListBusy.calledOnce);
      assert.equal(
         true,
         spyListApplicationLoad.calledOnceWith(target.CurrentApplication)
      );
      assert.equal(true, spyListReady.calledOnce);
   });

   it(".show - should not call .applicationLoad of ProcessList when .CurrentApplication is null", function () {
      const ab = new AB();
      const target = getTarget(ab);
      target.ProcessList.ListComponent = sinon.createStubInstance(
         UICommonList(ab)
      );
      const spyListBusy = sinon.spy(target.ProcessList, "busy");
      const spyListApplicationLoad = sinon.spy(
         target.ProcessList,
         "applicationLoad"
      );
      const spyListReady = sinon.spy(target.ProcessList, "ready");

      target.show();

      assert.equal(false, spyListBusy.called);
      assert.equal(false, spyListApplicationLoad.called);
      assert.equal(false, spyListReady.called);
   });

   it(".select - should pass the selected process to .populateProcessWorkspace of ProcessWorkspace", function () {
      const target = getTarget();
      const expectParam = {};
      const spyPopulateWorkspace = sinon.spy(
         target.ProcessWorkspace,
         "populateWorkspace"
      );

      target.select(expectParam);

      assert.equal(true, spyPopulateWorkspace.calledOnceWith(expectParam));
   });
});
