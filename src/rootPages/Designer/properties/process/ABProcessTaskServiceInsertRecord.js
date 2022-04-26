/*
 * UIProcessTaskServiceInsertRecord
 *
 * Display the form for entering the properties for a new
 * ServiceInsertRecord Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UIProcessServiceInsertRecord extends UIClass {
      constructor() {
         super("properties_process_service_insertRecord", {
            name: "",
            objectID: "",
            fieldValues: "",

            repeatLayout: "",
            repeatMode: "",
            repeatColumn: "",
         });

         this.element = null;

      }

        static key = "InsertRecord";
      // {string}
      // This should match the ABProcessTriggerLifecycleCore.defaults().key value.

      ui() {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.

         const ids = this.ids;

         let objectList = this.AB.objects().map((o) => {
            return { id: o.id, value: o.label || o.name };
         });

         let repeatColumnList = this.objectOfStartElement
            ? this.objectOfStartElement.connectFields().map((f) => {
                 return {
                    id: f.id,
                    value: f.label,
                 };
              })
            : [];

         let getFieldOptions = (object) => {
            let result = [];
            result.push({
               id: "PK",
               value: L("[Primary Key]"),
            });

            object.fields().forEach((f) => {
               // Populate fields of linked data source
               if (f.isConnection) {
                  let linkDS = f.datasourceLink;
                  if (linkDS) {
                     result.push({
                        id: `${f.id}|PK`,
                        value: `${f.label} -> ${L("[Primary Key]")}`,
                     });

                     linkDS.fields().forEach((linkF) => {
                        result.push({
                           id: `${f.id}|${linkF.id}`,
                           value: `${f.label} -> ${linkF.label}`,
                        });
                     });
                  }
               } else {
                  result.push({
                     id: f.id,
                     value: f.label,
                  });
               }
            });

            return result;
         };

         let refreshFieldValues = (objectID) => {
            let $fieldValues = $$(ids.fieldValues);
            if (!$fieldValues) return;

            // clear form
            webix.ui([], $fieldValues);

            let object = this.AB.objectByID(objectID || this.objectID);
            if (!object) return;

            // Pull object & fields of start step
            let startElemObj = this.objectOfStartElement;
            let startElemObjFields = startElemObj
               ? getFieldOptions(startElemObj)
               : [];

            // Pull object & fields of previous step
            let prevElemObj = this.objectOfPrevElement;
            let prevElemObjFields = [];
            if (prevElemObj) {
               prevElemObjFields = getFieldOptions(prevElemObj);
            }

            let setOptions = [
               { id: 0, value: L("Not Set") },
               { id: 1, value: L("Set by custom value") },
               {
                  id: 2,
                  value: L("Set by the root data [{0}]", [
                     startElemObj ? startElemObj.label : "",
                  ]),
               },
               {
                  id: 3,
                  value: L("Set by previous step data [{0}]", [
                     prevElemObj ? prevElemObj.label : "",
                  ]),
               },
               {
                  id: 4,
                  value: L("Set by formula format"),
               },
            ];

            let repeatObjectFields = [];
            let fieldRepeat = this.fieldRepeat;
            if (fieldRepeat && fieldRepeat.datasourceLink) {
               setOptions.push({
                  id: 5,
                  value: L("Set by the instance [{0}]", [
                     this.fieldRepeat ? this.fieldRepeat.label : "",
                  ]),
               });

               repeatObjectFields = getFieldOptions(fieldRepeat.datasourceLink);
            }

            // field options to the form
            object.fields().forEach((f) => {
               $fieldValues.addView({
                  fieldId: f.id,
                  view: "layout",
                  cols: [
                     {
                        rows: [
                           {
                              view: "label",
                              label: f.label,
                              width: 100,
                           },
                           { fillspace: true },
                        ],
                     },
                     {
                        rows: [
                           {
                              name: "setSelector",
                              view: "select",
                              options: setOptions,
                              on: {
                                 onChange: function (newVal, oldVal) {
                                    let $parent = this.getParentView();
                                    let $valuePanel = $parent.queryView({
                                       name: "valuePanel",
                                    });
                                    $valuePanel.showBatch(newVal);
                                 },
                              },
                           },
                           {
                              name: "valuePanel",
                              view: "multiview",
                              visibleBatch: 0,
                              cols: [
                                 { batch: 0, fillspace: true },
                                 { batch: 1, view: "text" },
                                 {
                                    batch: 2,
                                    view: "select",
                                    options: startElemObjFields,
                                 },
                                 {
                                    batch: 3,
                                    view: "select",
                                    options: prevElemObjFields,
                                 },
                                 { batch: 4, view: "text" },
                                 {
                                    batch: 5,
                                    view: "select",
                                    options: repeatObjectFields,
                                 },
                              ],
                           },
                        ],
                     },
                  ],
               });
            });

            this.setFieldValues(ids.component);
         };

         return {
            id: ids.component,
            view: "form",
            elementsConfig: {
               labelWidth: 120,
            },
            elements: [
               {
                  id: ids.name,
                  view: "text",
                  label: L("Name"),
                  name: "name",
                  value: this.name,
               },
               {
                  id: ids.objectID,
                  view: "select",
                  label: L("Object"),
                  value: this.objectID,
                  name: "objectID",
                  options: objectList,
                  on: {
                     onChange: (newVal) => {
                        this.objectID = newVal;
                        refreshFieldValues(newVal);
                     },
                  },
               },
               {
                  id: ids.repeatLayout,
                  hidden: true,
                  cols: [
                     {
                        id: ids.repeatMode,
                        view: "select",
                        label: L("Repeat"),
                        value: this.repeatMode,
                        name: "repeatMode",
                        width: 330,
                        options: [
                           {
                              id: "rootData",
                              value: L("For Connection in root data"),
                           },
                        ],
                        on: {
                           onChange: (newVal) => {
                              this.repeatMode = newVal;
                              refreshFieldValues();
                           },
                        },
                     },
                     {
                        id: ids.repeatColumn,
                        view: "select",
                        label: "",
                        value: this.repeatColumn,
                        name: "repeatColumn",
                        options: repeatColumnList,
                        on: {
                           onChange: (newVal) => {
                              this.repeatColumn = newVal;
                              refreshFieldValues();
                           },
                        },
                     },
                  ],
                  on: {
                     onViewShow: () => {
                        this.propertiesStash(ids.component);
                        refreshFieldValues();
                     },
                  },
               },
               {
                  view: "fieldset",
                  label: L("Values"),
                  body: {
                     id: ids.fieldValues,
                     view: "form",
                     borderless: true,
                     elements: [],
                  },
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         return Promise.resolve();
      }

      /**
       * @method propertiesStash()
       * pull our values from our property panel.
       * @param {string} id
       *        the webix $$(id) of the properties panel area.
       */
      propertiesStash(id) {
         let ids = this.ids;

         // TIP: keep the .settings entries == ids[s] keys and this will
         // remain simple:
         this.defaults.settings.forEach((s) => {
            switch (s) {
               case "fieldValues":
                  this[s] = this.getFieldValues(id);
                  break;
               case "isRepeat":
                  // .isRepeat is set in .onChange
                  break;
               case "repeatMode":
               case "repeatColumn":
                  if (!this.isRepeat) {
                     this[s] = "";
                     break;
                  }
               // no break;
               // eslint-disable-next-line no-fallthrough
               default:
                  break;
            }
         });
      }

      setFieldValues(id) {
         let ids = this.ids;
         let $fieldValues = $$(ids.fieldValues);
         let $fValueItems = $fieldValues.getChildViews() || [];

         this.fieldValues = this.fieldValues || {};

         $fValueItems.forEach(($item) => {
            let fieldId = $item.config.fieldId;
            let fValue = this.fieldValues[fieldId] || {};

            let $setSelector = $item.queryView({ name: "setSelector" });
            $setSelector.setValue(fValue.set);

            let $valuePanel = $item.queryView({ name: "valuePanel" });
            let $valueSelector = $valuePanel.queryView({
               batch: $valuePanel.config.visibleBatch,
            });
            if ($valueSelector && $valueSelector.setValue)
               $valueSelector.setValue(fValue.value);
         });
      }

      getFieldValues(id) {
         let result = {};
         let ids = this.ids;
         let $fieldValues = $$(ids.fieldValues);
         let $fValueItems = $fieldValues.getChildViews() || [];

         $fValueItems.forEach(($item) => {
            let fieldId = $item.config.fieldId;
            result[fieldId] = {};

            let $setSelector = $item.queryView({ name: "setSelector" });
            result[fieldId].set = $setSelector.getValue();

            let $valuePanel = $item.queryView({ name: "valuePanel" });
            let $valueSelector = $valuePanel.queryView({
               batch: $valuePanel.config.visibleBatch,
            });
            if (
               $valueSelector &&
               $valueSelector.getValue &&
               $valueSelector.getValue()
            )
               result[fieldId].value = $valueSelector.getValue();
            else result[fieldId].value = null;
         });

         return result;
      }

      // applicationLoad(application) {
      //    super.applicationLoad(application);

      //    $$(this.ids.objList).define("data", listObj);
      //    $$(this.ids.objList).refresh();
      // }

      // show() {
      //    super.show();
      //    AppList.show();
      // }

      populate(element) {
         const ids = this.ids;

         const $name = $$(ids.name);
         const $objectID = $$(ids.objectID);
         const $fieldValues = $$(ids.fieldValues);
         const $repeatLayout = $$(ids.repeatLayout);
         const $repeatMode = $$(ids.repeatMode);
         const $repeatColumn = $$(ids.repeatColumn);

         this.element = element;

         $name.setValue(element.label);
         $objectID.setValue(element.objectID);
         $repeatMode.setValue(element.repeatMode);
         $repeatColumn.setValue(element.repeatColumn);

         $fieldValues.setValues(element.fieldValues);

         if(element.repeatMode || element.repeatColumn)
            $repeatLayout.show();
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */

      values() {
         const obj = {};
         const ids = this.ids;

         const $name = $$(ids.name);
         const $objectID = $$(ids.objectID);
         const $fieldValues = $$(ids.fieldValues);
         const $repeatMode = $$(ids.repeatMode);
         const $repeatColumn = $$(ids.repeatColumn);

         obj.label = $name.getValue() || "";
         obj.name = $name.getValue() || "";
         obj.objectID = $objectID.getValue() || "";
         obj.repeatMode = $repeatMode.getValue() || "";
         obj.repeatColumn = $repeatColumn.getValue() || "";

         obj.fieldValues = $fieldValues.getValues() || {};

         return obj;
      }
   }

   return UIProcessServiceInsertRecord;
}
