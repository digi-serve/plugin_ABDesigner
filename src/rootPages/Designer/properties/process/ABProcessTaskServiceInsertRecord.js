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
      }

      static get key() {
         return "InsertRecord";
      }
      // {string}
      // This should match the ABProcessTaskServiceInsertRecordCore.defaults().key value.

      ui() {
         // we are creating these on the fly, and should have CurrentApplication
         // defined already.

         const ids = this.ids;

         const objectList = this.CurrentApplication.objectsIncluded().map(
            (o) => {
               return { id: o.id, value: o.label ?? o.name };
            }
         );

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
                  value: "",
               },
               {
                  id: ids.objectID,
                  view: "select",
                  label: L("Object"),
                  value: "",
                  name: "objectID",
                  options: objectList,
                  on: {
                     onChange: (newVal) => {
                        this.element.objectID = newVal;
                        this.refreshFieldValues(newVal);
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
                        value: "",
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
                              this.element.repeatMode = newVal;
                              this.refreshFieldValues();
                           },
                        },
                     },
                     {
                        id: ids.repeatColumn,
                        view: "select",
                        label: "",
                        value: this.repeatColumn,
                        name: "repeatColumn",
                        options: [],
                        on: {
                           onChange: (newVal) => {
                              this.element.repeatColumn = newVal;
                              this.refreshFieldValues();
                           },
                        },
                     },
                  ],
                  on: {
                     onViewShow: () => {
                        this.propertiesStash();
                        this.refreshFieldValues();
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

      getFieldOptions(object) {
         const result = [];
         result.push({
            id: "PK",
            value: L("Primary Key"),
         });

         object.fields().forEach((f) => {
            // Populate fields of linked data source
            if (f.isConnection) {
               const linkDS = f.datasourceLink;
               if (linkDS) {
                  result.push({
                     id: `${f.id}|PK`,
                     value: `${f.label} -> ${L("Primary Key")}`,
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
      }

      refreshFieldValues(objectID) {
         const ids = this.ids;

         const $fieldValues = $$(ids.fieldValues);
         if (!$fieldValues) return;

         // clear form
         webix.ui([], $fieldValues);

         const object = this.AB.objectByID(objectID ?? this.element.objectID);
         if (!object) return;

         // Pull object & fields of start step
         const startElemObj = this.element.objectOfStartElement;
         const startElemObjFields = startElemObj
            ? this.getFieldOptions(startElemObj)
            : [];

         // Pull object & fields of previous step
         const prevElemObj = this.objectOfPrevElement;
         let prevElemObjFields = [];
         if (prevElemObj) {
            prevElemObjFields = this.getFieldOptions(prevElemObj);
         }

         const setOptions = [
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
         const fieldRepeat = this.element.fieldRepeat;

         if (fieldRepeat && fieldRepeat.datasourceLink) {
            setOptions.push({
               id: 5,
               value: L("Set by the instance [{0}]", [
                  this.fieldRepeat ? this.element.fieldRepeat.label : "",
               ]),
            });

            repeatObjectFields = this.getFieldOptions(
               fieldRepeat.datasourceLink
            );
         }

         setOptions.push({
            id: 6,
            value: L("Set by the parameter of a Query task"),
         });

         // Pull query tasks option list
         const queryTaskOptions = (
            this.element.process.processDataFields(this.element) ?? []
         ).map((item) => {
            return {
               id: item.key,
               value: item.label,
            };
         });

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
                              onChange: function (newVal) {
                                 const $parent = this.getParentView();
                                 const $valuePanel = $parent.queryView({
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
                              {
                                 batch: 6,
                                 view: "multicombo",
                                 label: "",
                                 options: queryTaskOptions,
                              },
                           ],
                        },
                     ],
                  },
               ],
            });
         });
      }

      /**
       * @method propertiesStash()
       * pull our values from our property panel.
       * @param {string} id
       *        the webix $$(id) of the properties panel area.
       */
      propertiesStash() {
         // TIP: keep the .settings entries == ids[s] keys and this will
         // remain simple:
         this.element.defaults.settings.forEach((s) => {
            switch (s) {
               case "fieldValues":
                  this.element[s] = this.getFieldValues();
                  break;
               case "isRepeat":
                  // .isRepeat is set in .onChange
                  break;
               case "repeatMode":
               case "repeatColumn":
                  if (!(this.elememt?.isRepeat ?? null)) {
                     this.element[s] = "";
                     break;
                  }
               // no break;
               // eslint-disable-next-line no-fallthrough
               default:
                  break;
            }
         });
      }

      setFieldValues() {
         const ids = this.ids;

         const $fieldValues = $$(ids.fieldValues);
         const $fValueItems = $fieldValues.getChildViews() ?? [];

         this.element.fieldValues = this.element.fieldValues ?? {};

         $fValueItems.forEach(($item) => {
            const fieldId = $item.config.fieldId;
            const fValue = this.element.fieldValues[fieldId] ?? {};

            const $setSelector = $item.queryView({ name: "setSelector" });
            $setSelector.setValue(fValue.set);

            const $valuePanel = $item.queryView({ name: "valuePanel" });
            const $valueSelector = $valuePanel.queryView({
               batch: $valuePanel.config.visibleBatch,
            });
            if ($valueSelector && $valueSelector.setValue)
               $valueSelector.setValue(fValue.value);
         });
      }

      getFieldValues() {
         const result = {};
         const ids = this.ids;
         const $fieldValues = $$(ids.fieldValues);
         const $fValueItems = $fieldValues.getChildViews() ?? [];

         $fValueItems.forEach(($item) => {
            const fieldId = $item.config.fieldId;

            const $setSelector = $item.queryView({ name: "setSelector" });
            const $valuePanel = $item.queryView({ name: "valuePanel" });
            const $valueSelector = $valuePanel.queryView({
               batch: $valuePanel.config.visibleBatch,
            });

            result[fieldId] = {};
            result[fieldId].set = $setSelector.getValue();

            result[fieldId].value = $valueSelector?.getValue?.() ?? null;
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
         const $repeatLayout = $$(ids.repeatLayout);
         const $repeatMode = $$(ids.repeatMode);
         const $repeatColumn = $$(ids.repeatColumn);

         const repeatColumnList =
            element?.objectOfStartElement?.connectFields().map((f) => {
               return {
                  id: f.id,
                  value: f.label,
               };
            }) ?? [];

         this.element = element;

         $name.setValue(element.label);
         $objectID.setValue(element.objectID);
         $repeatMode.setValue(element.repeatMode);
         $repeatColumn.define("options", repeatColumnList);
         $repeatColumn.refresh();

         this.refreshFieldValues();
         this.setFieldValues();

         if (element.isRepeat) $repeatLayout.show();
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
         const $repeatMode = $$(ids.repeatMode);
         const $repeatColumn = $$(ids.repeatColumn);

         obj.label = $name.getValue() ?? "";
         obj.name = $name.getValue() ?? "";
         obj.objectID = $objectID.getValue() ?? "";
         obj.repeatMode = $repeatMode.getValue() ?? "";
         obj.repeatColumn = $repeatColumn.getValue() ?? "";

         obj.fieldValues = this.getFieldValues();

         return obj;
      }
   }

   return UIProcessServiceInsertRecord;
}
