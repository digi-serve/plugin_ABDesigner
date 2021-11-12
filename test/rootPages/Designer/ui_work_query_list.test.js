import "@babel/polyfill";
import assert from "assert";
import sinon from "sinon";
import { EventEmitter } from "events";

import AB from "../../_mock/AB.js";
import UICommonList from "../../../src/rootPages/Designer/ui_common_list";
import UIQueryList from "../../../src/rootPages/Designer/ui_work_query_list";

const base = "ui_work_query_list";

function getTarget(ab = null) {
   if (!ab) ab = new AB();
   const UI_Query_List = UIQueryList(ab);
   const target = new UI_Query_List();
   target.ListComponent = sinon.createStubInstance(UICommonList(ab));

   return target;
}

describe("ui_work_query_list", function () {
   it(".constructor - should set valid properties", function () {
      const ab = new AB();
      const UI_Query_List = UIQueryList(ab);
      const target = new UI_Query_List();

      assert.equal(base, target.ids.component);
      assert.equal(true, target.ListComponent != null);
      assert.equal(base, target.ListComponent.idBase);
      assert.equal(base, target.ListComponent.ids.component);
      assert.equal(true, target.AddForm != null);
   });

   it(".ui - should call .ui of .ListComponent", function () {
      const target = getTarget();

      target.ui();

      assert.equal(true, target.ListComponent.ui.calledOnce);
   });

   it(".init - should pass a valid parameter and set event listeners", async function () {
      const ab = new AB();
      const target = getTarget(ab);
      const spyOn = sinon.spy(target, "on");
      const spyAddFormInit = sinon.spy(target.AddForm, "init");
      const spyAddFormOn = sinon.spy(target.AddForm, "on");

      await target.init(ab);

      assert.equal(ab, target.AB);
      assert.equal(true, spyOn.calledOnce);
      assert.equal(true, target.ListComponent.init.calledOnceWith(ab));
      ["selected", "addNew", "deleted", "exclude", "copied"].forEach(
         (key, index) => {
            assert.equal(
               key,
               target.ListComponent.on.getCalls()[index].args[0]
            );
         }
      );
      assert.equal(true, spyAddFormInit.calledOnceWith(ab));
      assert.equal("cancel", spyAddFormOn.getCalls()[0].args[0]);
      assert.equal("save", spyAddFormOn.getCalls()[1].args[0]);
   });

   it(".applicationLoad - should listen events of application and load query data", function () {
      const target = getTarget();
      const application = sinon.createStubInstance(EventEmitter);
      application.queriesIncluded = () => ["Query1", "Query2"];
      const spyAddFormApplicationLoad = sinon.spy(
         target.AddForm,
         "applicationLoad"
      );

      target.applicationLoad(application);

      assert.equal("definition.updated", application.on.getCalls()[0].args[0]);
      assert.equal("definition.deleted", application.on.getCalls()[1].args[0]);
      assert.equal(
         true,
         target.ListComponent.dataLoad.calledOnceWith(
            application.queriesIncluded()
         )
      );
      assert.equal(true, spyAddFormApplicationLoad.calledOnceWith(application));
   });

   it(".ready - should call .ready of ListComponent", function () {
      const target = getTarget();

      target.ready();

      assert.equal(true, target.ListComponent.ready.calledOnce);
   });

   it(".clickNewQuery - should call .show of .AddForm", function () {
      const target = getTarget();
      const spyAddFormShow = sinon.spy(target.AddForm, "show");

      target.clickNewQuery();

      assert.equal(true, spyAddFormShow.calledOnce);
   });
});
