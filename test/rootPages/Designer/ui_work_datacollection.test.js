import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";

import AB from "../../_mock/AB.js";
import UICommonList from "../../../src/rootPages/Designer/ui_common_list";
import UIDataCollectionList from "../../../src/rootPages/Designer/ui_work_datacollection";

const base = "ui_work_datacollection";

function getMockApplication() {
   const application = sinon.createStubInstance(EventEmitter);
   application.datacollectionsIncluded = () => {};
   return application;
}

function getTarget(ab = null) {
   if (!ab) ab = new AB();
   const UI_DataCollection_List = UIDataCollectionList(ab);
   const target = new UI_DataCollection_List();
   target.ListComponent = sinon.createStubInstance(UICommonList(ab));

   return target;
}

describe("ui_work_datacollection", function () {
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
      const spyDataCollectionListOnSelect = sinon.spy(
         target.DataCollectionList,
         "on"
      );
      const spyDataCollectionWorkspaceInit = sinon.spy(
         target.DataCollectionWorkspace,
         "init"
      );
      const spyDataCollectionListInit = sinon.spy(
         target.DataCollectionList,
         "init"
      );

      target.init(ab);

      assert.equal(target.AB, ab);
      assert.equal(
         true,
         spyDataCollectionListOnSelect.calledWith("selected", target.select)
      );
      assert.equal(true, spyDataCollectionWorkspaceInit.calledOnceWith(ab));
      assert.equal(true, spyDataCollectionListInit.calledOnceWith(ab));
   });

   it(".applicationLoad - should pass a valid parameter to functions of child pages", async function () {
      const ab = new AB();
      const target = getTarget(ab);
      target.DataCollectionList.ListComponent = sinon.createStubInstance(
         UICommonList(ab)
      );
      const expectParam = getMockApplication();
      const spyClearWorkspace = sinon.spy(
         target.DataCollectionWorkspace,
         "clearWorkspace"
      );
      const spyListApplicationLoad = sinon.spy(
         target.DataCollectionList,
         "applicationLoad"
      );
      const spyWorkspaceApplicationLoad = sinon.spy(
         target.DataCollectionWorkspace,
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

   it(".show - should call .applicationLoad of DataCollectionList when .CurrentApplication is exists", function () {
      const ab = new AB();
      const target = getTarget(ab);
      target.DataCollectionList.ListComponent = sinon.createStubInstance(
         UICommonList(ab)
      );
      target.CurrentApplication = getMockApplication();
      const spyWorkspaceApplicationLoad = sinon.spy(
         target.DataCollectionWorkspace,
         "applicationLoad"
      );
      const spyListApplicationLoad = sinon.spy(
         target.DataCollectionList,
         "applicationLoad"
      );
      const spyListReady = sinon.spy(target.DataCollectionList, "ready");

      target.show();

      assert.equal(
         true,
         spyWorkspaceApplicationLoad.calledOnceWith(target.CurrentApplication)
      );
      assert.equal(
         true,
         spyListApplicationLoad.calledOnceWith(target.CurrentApplication)
      );
      assert.equal(true, spyListReady.calledOnce);
   });

   it(".show - should not call .applicationLoad of DataCollectionList when .CurrentApplication is null", function () {
      const ab = new AB();
      const target = getTarget(ab);
      target.DataCollectionList.ListComponent = sinon.createStubInstance(
         UICommonList(ab)
      );
      const spyWorkspaceApplicationLoad = sinon.spy(
         target.DataCollectionWorkspace,
         "applicationLoad"
      );
      const spyListApplicationLoad = sinon.spy(
         target.DataCollectionList,
         "applicationLoad"
      );
      const spyListReady = sinon.spy(target.DataCollectionList, "ready");

      target.show();

      assert.equal(false, spyWorkspaceApplicationLoad.called);
      assert.equal(false, spyListApplicationLoad.called);
      assert.equal(true, spyListReady.calledOnce);
   });

   it(".select - should pass the selected data collection to .populateWorkspace of DataCollectionWorkspace", function () {
      const target = getTarget();
      const expectParam = {};
      const spyWorkspaceClearWorkspace = sinon.spy(
         target.DataCollectionWorkspace,
         "clearWorkspace"
      );
      const spyPopulateWorkspace = sinon.spy(
         target.DataCollectionWorkspace,
         "populateWorkspace"
      );

      target.select(expectParam);

      assert.equal(true, spyWorkspaceClearWorkspace.calledOnce);
      assert.equal(true, spyPopulateWorkspace.calledOnceWith(expectParam));
   });
});
