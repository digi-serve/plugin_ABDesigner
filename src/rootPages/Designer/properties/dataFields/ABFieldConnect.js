/*
 * ABFieldNumber
 * A Property manager for our ABFieldNumber.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldConnectProperty extends ABField {
      constructor() {
         super("properties_abfield_connect", {
            linkObject: "",
            objectCreateNew: "",

            fieldLink: "",
            fieldLink2: "",
            linkType: "",
            linkViaType: "",
            fieldLinkVia: "",
            fieldLinkVia2: "",

            link1: "",
            link2: "",

            isCustomFK: "",
            indexField: "",
            indexField2: "",

            connectDataPopup: "",
         });
      }

      ui() {
         const FC = this.FieldClass();
         const ids = this.ids;
         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Connected to:"),
                     align: "right",
                     width: 94,
                  },
                  {
                     id: ids.linkObject,
                     view: "richselect",
                     disallowEdit: true,
                     name: "linkObject",
                     labelWidth: uiConfig.labelWidthLarge,
                     placeholder: L("Select object"),
                     options: [],
                     // select: true,
                     // height: 140,
                     // template: "<div class='ab-new-connectObject-list-item'>#label#</div>",
                     on: {
                        onChange: (newV, oldV) => {
                           this.selectObjectTo(newV, oldV);
                        },
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            /*
            // NOTE: leave out of v2 until someone asks for it back.

            {
               view: "button",
               css: "webix_primary",
               id: ids.objectCreateNew,
               disallowEdit: true,
               value: L(
                  "Connect to new Object"
               ),
               click: () => {
                  ABFieldConnectComponent.logic.clickNewObject();
               },
            },
            */
            {
               view: "layout",
               id: ids.link1,
               hidden: true,
               cols: [
                  {
                     id: ids.fieldLink,
                     view: "label",
                     width: 300,
                  },
                  {
                     id: ids.linkType,
                     disallowEdit: true,
                     name: "linkType",
                     view: "richselect",
                     value: FC.defaultValues().linkType,
                     width: 95,
                     options: [
                        {
                           id: "many",
                           value: L("many"),
                        },
                        {
                           id: "one",
                           value: L("one"),
                        },
                     ],
                     on: {
                        onChange: (newValue, oldValue) => {
                           this.selectLinkType(newValue, oldValue);
                        },
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.fieldLinkVia,
                     view: "label",
                     label: L("<b>[Select Object]</b> entry."),
                     width: 200,
                  },
               ],
            },
            {
               view: "layout",
               id: ids.link2,
               hidden: true,
               cols: [
                  {
                     id: ids.fieldLinkVia2,
                     view: "label",
                     label: L(
                        "Each <b>[Select object]</b> entry connects with"
                     ),
                     width: 300,
                  },
                  {
                     id: ids.linkViaType,
                     name: "linkViaType",
                     disallowEdit: true,
                     view: "richselect",
                     value: FC.defaultValues().linkViaType,
                     width: 95,
                     options: [
                        {
                           id: "many",
                           value: L("many"),
                        },
                        {
                           id: "one",
                           value: L("one"),
                        },
                     ],
                     on: {
                        onChange: (newV, oldV) => {
                           this.selectLinkViaType(newV, oldV);
                        },
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.fieldLink2,
                     view: "label",
                     width: 200,
                  },
               ],
            },
            {
               name: "linkColumn",
               view: "text",
               hidden: true,
            },
            {
               name: "isSource",
               view: "text",
               hidden: true,
            },
            {
               id: ids.isCustomFK,
               name: "isCustomFK",
               view: "checkbox",
               disallowEdit: true,
               labelWidth: 0,
               labelRight: L("Custom Foreign Key"),
               hidden: true,
               on: {
                  onChange: () => {
                     this.checkCustomFK();
                  },
                  onAfterRender: function () {
                     ABField.CYPRESS_REF(this);
                  },
               },
            },
            {
               id: ids.indexField,
               name: "indexField",
               view: "richselect",
               disallowEdit: true,
               hidden: true,
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Index Field:"),
               placeholder: L("Select index field"),
               options: [],
               on: {
                  // onChange: () => {
                  //    ABFieldConnectComponent.logic.updateColumnName();
                  // },
                  onAfterRender: function () {
                     ABField.CYPRESS_REF(this);
                  },
               },
            },
            {
               id: ids.indexField2,
               name: "indexField2",
               view: "richselect",
               disallowEdit: true,
               hidden: true,
               labelWidth: uiConfig.labelWidthLarge,
               label: L("Index Field:"),
               placeholder: L("Select index field"),
               options: [],
               on: {
                  onAfterRender: function () {
                     ABField.CYPRESS_REF(this);
                  },
               },
            },
         ]);
      }

      clear() {
         super.clear();
         $$(this.ids.linkObject).setValue(
            this.FieldClass().defaultValues().linkObject
         );
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("connectObject");
      }

      isValid() {
         const ids = this.ids;
         let isValid = super.isValid();

         // validate require select linked object
         const selectedObjId = $$(ids.linkObject).getValue();
         if (!selectedObjId) {
            this.markInvalid("linkObject", L("Select an object"));
            // webix.html.addCss($$(ids.linkObject).$view, "webix_invalid");
            isValid = false;
         } else {
            console.error("!!! Don't forget to refactor this .removeCss()");
            webix.html.removeCss($$(ids.linkObject).$view, "webix_invalid");
         }

         return isValid;
      }

      // populate(field) {
      //    const ids = this.ids;
      //    super.populate(field);
      // }

      selectLinkViaType(newValue /*, oldValue */) {
         let labelEntry = L("entry");
         let labelEntries = L("entries");

         let $fieldLink2 = $$(this.ids.fieldLink2);

         let message = $fieldLink2.getValue() || "";

         if (newValue == "many") {
            message = message.replace(labelEntry, labelEntries);
         } else {
            message = message.replace(labelEntries, labelEntry);
         }
         $fieldLink2.define("label", message);
         $fieldLink2.refresh();

         this.updateCustomIndex();
      }

      show() {
         super.show();

         this.populateSelect(false);
         const ids = this.ids;

         // show current object name
         $$(ids.fieldLink).setValue(
            L("Each <b>{0}</b> entry connects with", [
               this.CurrentObject?.label,
            ])
         );
         $$(ids.fieldLink2).setValue(
            L("<b>{0}</b> entry.", [this.CurrentObject?.label])
         );

         // keep the column name element to use when custom index is checked
         // ABFieldConnectComponent._$columnName = $$(pass_ids.columnName);
         this.updateCustomIndex();
      }

      ////

      checkCustomFK() {
         const ids = this.ids;
         $$(ids.indexField).hide();
         $$(ids.indexField2).hide();

         let isChecked = $$(ids.isCustomFK).getValue();
         if (isChecked) {
            let menuItems = $$(ids.indexField).getList().config.data;
            if (menuItems && menuItems.length) {
               $$(ids.indexField).show();
            }

            let menuItems2 = $$(ids.indexField2).getList().config.data;
            if (menuItems2 && menuItems2.length) {
               $$(ids.indexField2).show();
            }
         }
      }

      //// NOTE: This feature wasn't currently working as of our Transition to
      //// v2, so we decided to leave it out until someone requested for this
      //// to come back.
      /*
      clickNewObject() {
         if (!App.actions.addNewObject) return;

         async.series(
            [
               function (callback) {
                  App.actions.addNewObject(false, callback); // pass false because after it is created we do not want it to select it in the object list
               },
               function (callback) {
                  populateSelect(true, callback); // pass true because we want it to select the last item in the list that was just created
               },
            ],
            function (err) {
               if (err) {
                  App.AB.error(err);
               }
               // console.log('all functions complete')
            }
         );
      }
      */

      /**
       * @method populateSelect()
       * Ensure that the linkObject list is populated with the ABObjects in
       * our currentApplication.
       * NOTE: in v1 we had an option to [create new object] from this
       * Property panel. If we did, then the @populate & @callback params
       * were used to add the new object and default select it in our
       * panel.
       *
       * In v2: we haven't implement the [create new object] option ... yet.
       *
       * @param {bool} populate
       *        Should we default choose the last entry in our list? It
       *        would have been the one we just created.
       * @param {fn} callback
       *        The .clickNewObject() routine used callbacks to tell when
       *        a task was complete. This is that callback.
       */
      populateSelect(/* populate, callback */) {
         const options = [];
         // if an ABApplication is set then load in the related objects
         const application = this.CurrentApplication;
         if (application) {
            application.objectsIncluded().forEach((o) => {
               options.push({ id: o.id, value: o.label });
            });
         } else {
            // else load in all the ABObjects
            this.AB.objects().forEach((o) => {
               options.push({ id: o.id, value: o.label });
            });
         }

         // sort by object's label  A -> Z
         options.sort((a, b) => {
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
         });

         const ids = this.ids;
         const $linkObject = $$(ids.linkObject);
         $linkObject.define("options", options);
         $linkObject.refresh();
         /*
         // NOTE: not implemented yet ...
         if (populate != null && populate == true) {
            $linkObject.setValue(options[options.length - 1].id);
            $linkObject.refresh();
            const selectedObj = $linkObject
               .getList()
               .getItem(options[options.length - 1].id);
            if (selectedObj) {
               const selectedObjLabel = selectedObj.value;
               $$(ids.fieldLinkVia).setValue(
                  L("<b>{0}</b> entry.", [selectedObjLabel])
               );
               $$(ids.fieldLinkVia2).setValue(
                  L("Each <b>{0}</b> entry connects with", [selectedObjLabel])
               );
               $$(ids.link1).show();
               $$(ids.link2).show();
            }
            callback?.();
         }
         */
      }

      selectLinkType(newValue /*, oldValue */) {
         let labelEntry = L("entry");
         let labelEntries = L("entries");
         let $field = $$(this.ids.fieldLinkVia);

         let message = $field.getValue() || "";

         if (newValue == "many") {
            message = message.replace(labelEntry, labelEntries);
         } else {
            message = message.replace(labelEntries, labelEntry);
         }
         $field.define("label", message);
         $field.refresh();

         this.updateCustomIndex();
      }

      selectObjectTo(newValue, oldValue) {
         const ids = this.ids;

         if (!newValue) {
            $$(ids.link1).hide();
            $$(ids.link2).hide();
         }
         if (newValue == oldValue || newValue == "") return;

         let selectedObj = $$(ids.linkObject).getList().getItem(newValue);
         if (!selectedObj) return;

         let selectedObjLabel = selectedObj.value;
         $$(ids.fieldLinkVia).setValue(
            L("<b>{0}</b> entry.", [selectedObjLabel])
         );
         $$(ids.fieldLinkVia2).setValue(
            L("Each <b>{0}</b> entry connects with", [selectedObjLabel])
         );
         $$(ids.link1).show();
         $$(ids.link2).show();

         this.updateCustomIndex();
      }

      updateCustomIndex() {
         const ids = this.ids;
         let linkObjectId = $$(ids.linkObject).getValue();
         let linkType = $$(ids.linkType).getValue();
         let linkViaType = $$(ids.linkViaType).getValue();

         let sourceObject = null; // object stores index column
         let linkIndexes = null; // the index fields of link object M:N

         $$(ids.indexField2).define("options", []);
         $$(ids.indexField2).refresh();

         let link = `${linkType}:${linkViaType}`;
         // 1:1
         // 1:M
         if (["one:one", "one:many"].indexOf(link) > -1) {
            sourceObject = this.AB.objectByID(linkObjectId);
         }
         // M:1
         else if (link == "many:one") {
            sourceObject = this.CurrentObject;
         }
         // M:N
         else if (link == "many:many") {
            sourceObject = this.CurrentObject;

            let linkObject = this.AB.objectByID(linkObjectId);

            // Populate the second index fields
            let linkIndexFields = [];
            linkIndexes = linkObject.indexes((idx) => idx.unique);
            (linkIndexes || []).forEach((idx) => {
               (idx.fields || []).forEach((f) => {
                  if (
                     (!f ||
                        !f.settings ||
                        !f.settings.required ||
                        linkIndexFields.filter((opt) => opt.id == f.id)
                           .length) &&
                     f.key != "AutoIndex" &&
                     f.key != "combined"
                  )
                     return;

                  linkIndexFields.push({
                     id: f.id,
                     value: f.label,
                  });
               });
            });
            $$(ids.indexField2).define("options", linkIndexFields);
            $$(ids.indexField2).refresh();
         }

         $$(ids.indexField).hide();
         $$(ids.indexField2).hide();

         if (!sourceObject) {
            $$(ids.isCustomFK).hide();
            return;
         }

         let indexes = sourceObject.indexes((idx) => idx.unique);
         if (
            (!indexes || indexes.length < 1) &&
            (!linkIndexes || linkIndexes.length < 1)
         ) {
            $$(ids.isCustomFK).hide();
            $$(ids.indexField).define("options", []);
            $$(ids.indexField).refresh();
            return;
         }

         let indexFields = [];
         (indexes || []).forEach((idx) => {
            (idx.fields || []).forEach((f) => {
               if (
                  (!f ||
                     !f.settings ||
                     !f.settings.required ||
                     indexFields.filter((opt) => opt.id == f.id).length) &&
                  f.key != "AutoIndex" &&
                  f.key != "combined"
               )
                  return;

               indexFields.push({
                  id: f.id,
                  value: f.label,
                  field: f,
               });
            });
         });
         $$(ids.indexField).define("options", indexFields);
         $$(ids.indexField).refresh();

         if (indexFields && indexFields.length) {
            $$(ids.isCustomFK).show();
         }

         this.checkCustomFK();
      }
   }

   return ABFieldConnectProperty;
}
