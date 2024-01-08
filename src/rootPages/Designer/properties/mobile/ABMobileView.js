/*
 * ABMobileView
 * A Generic Property manager for All our ABMobileViews.
 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import AB_VIEW from "../views/ABView";

export default function (AB) {
   if (!myClass) {
      // const uiConfig = AB.Config.uiSettings();
      const ABView = AB_VIEW(AB);
      // var L = ABView.L();

      myClass = class ABMobileViewProperty extends ABView {
         constructor(base = "properties_abmobileview", ids = {}) {
            // base: {string} unique base id reference
            // ids: {hash}  { key => '' }
            // this is provided by the Sub Class and has the keys
            // unique to the Sub Class' interface elements

            super(base, ids);
         }

         // ui(elements = [], rules = {}) {
         //    let ids = this.ids;

         //    let _ui = {
         //       view: "form",
         //       id: ids.component,
         //       scroll: true,
         //       elements: [
         //          {
         //             id: ids.label,
         //             view: "text",
         //             label: L("Name"),
         //             name: "name",
         //             value: "",
         //          },
         //       ],
         //       rules: {
         //          // label: webix.rules.isNotEmpty,
         //       },
         //    };

         //    elements.forEach((e) => {
         //       _ui.elements.push(e);
         //    });

         //    Object.keys(rules).forEach((r) => {
         //       _ui.rules[r] = rules[r];
         //    });

         //    return _ui;
         // }

         //          async init(AB) {
         //             this.AB = AB;

         //             var VC = this.ViewClass();
         //             if (VC) {

         // // TODO:
         //                $$(this.ids.fieldDescription).define(
         //                   "label",
         //                   L(FC.defaults().description)
         //                );
         //             } else {
         //                $$(this.ids.fieldDescription).hide();

         //             }
         //          }

         // propertyDatacollections(view) {
         //    return view.application.datacollectionsIncluded().map((d) => {
         //       return { id: d.id, value: d.label };
         //    });
         // }

         /**
          * @method defaults()
          * Return the ViewClass() default values.
          * NOTE: the child class MUST implement ViewClass() to return the
          * proper ABViewXXX class definition.
          * @return {obj}
          */
         defaults() {
            var ViewClass = this.ViewClass();
            if (!ViewClass) {
               console.error(
                  "!!! properties/views/ABView: could not find ViewClass"
               );
               return null;
            }
            return ViewClass.common();
         }

         // _ViewClass(key) {
         //    var app = this.CurrentApplication;
         //    if (!app) {
         //       app = this.AB.applicationNew({});
         //    }
         //    return app.viewAll((V) => V.common().key == key)[0];
         // }
      };
   }
   return myClass;
}
