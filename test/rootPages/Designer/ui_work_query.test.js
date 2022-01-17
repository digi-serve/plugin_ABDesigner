import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";

import AB from "../../_mock/AB.js";
import UICommonList from "../../../src/rootPages/Designer/ui_common_list";
import UIQuery from "../../../src/rootPages/Designer/ui_work_query";

const base = "ab_work_query";

function getMockApplication() {
   const application = sinon.createStubInstance(EventEmitter);
   application.queriesIncluded = () => {};
   return application;
}

function getTarget(ab = null) {
   if (!ab) ab = new AB();
   const UI_Work_Query_List = UIQuery(ab);
   return new UI_Work_Query_List();
}

describe("ui_work_query", function () {
   it(".constructor - should set valid properties", function () {
      const target = getTarget();

      assert.equal(base, target.ids.component);
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
      const spyQueryListOnSelect = sinon.spy(target.QueryList, "on");
      const spyQueryWorkspaceInit = sinon.spy(target.QueryWorkspace, "init");
      const spyQueryListInit = sinon.spy(target.QueryList, "init");

      target.init(ab);

      assert.equal(target.AB, ab);
      assert.equal(
         true,
         spyQueryListOnSelect.calledWith("selected", target.select)
      );
      assert.equal(true, spyQueryWorkspaceInit.calledOnceWith(ab));
      assert.equal(true, spyQueryListInit.calledOnceWith(ab));
   });

   it(".applicationLoad - should pass a valid parameter to functions of child pages", async function () {
      const ab = new AB();
      const target = getTarget(ab);
      target.QueryList.ListComponent = sinon.createStubInstance(
         UICommonList(ab)
      );
      const expectParam = getMockApplication();
      const spyClearWorkspace = sinon.spy(
         target.QueryWorkspace,
         "clearWorkspace"
      );
      const spyListApplicationLoad = sinon.spy(
         target.QueryList,
         "applicationLoad"
      );
      const spyWorkspaceApplicationLoad = sinon.spy(
         target.QueryWorkspace,
         "applicationLoad"
      );

      target.applicationLoad(expectParam);

      assert.equal(expectParam, target.CurrentApplication);
      assert.equal(true, spyClearWorkspace.calledOnce);
      assert.equal(true, spyListApplicationLoad.calledOnceWith(expectParam));
      assert.equal(
         true,
         spyWorkspaceApplicationLoad.calledOnceWith(expectParam)
      );
   });

   it(".show - should call .applicationLoad of QueryList when .CurrentApplication is exists", function () {
      const ab = new AB();
      const target = getTarget(ab);
      target.QueryList.ListComponent = sinon.createStubInstance(
         UICommonList(ab)
      );
      target.CurrentApplication = getMockApplication();
      const spyListApplicationLoad = sinon.spy(
         target.QueryList,
         "applicationLoad"
      );
      const spyListReady = sinon.spy(target.QueryList, "ready");

      target.show();

      assert.equal(
         true,
         spyListApplicationLoad.calledOnceWith(target.CurrentApplication)
      );
      assert.equal(true, spyListReady.calledOnce);
   });

   it(".show - should not call .applicationLoad of QueryList when .CurrentApplication is null", function () {
      const ab = new AB();
      const target = getTarget(ab);
      target.QueryList.ListComponent = sinon.createStubInstance(
         UICommonList(ab)
      );
      const spyListApplicationLoad = sinon.spy(
         target.QueryList,
         "applicationLoad"
      );
      const spyListReady = sinon.spy(target.QueryList, "ready");

      target.show();

      assert.equal(false, spyListApplicationLoad.called);
      assert.equal(true, spyListReady.calledOnce);
   });

   it(".select - should pass the selected query to .populateQueryWorkspace of QueryWorkspace", function () {
      const target = getTarget();
      const expectParam = {};
      const spyWorkspaceResetTabs = sinon.spy(
         target.QueryWorkspace,
         "resetTabs"
      );
      const spyPopulateQueryWorkspace = sinon.spy(
         target.QueryWorkspace,
         "populateQueryWorkspace"
      );

      target.select(expectParam);

      assert.equal(true, spyWorkspaceResetTabs.calledOnce);
      assert.equal(true, spyPopulateQueryWorkspace.calledOnceWith(expectParam));
   });
});
