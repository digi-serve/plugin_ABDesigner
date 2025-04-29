/*
 * ABProcessGatewayExclusive
 *
 * Display the form for branching between possible output paths.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();
   const uiConfig = AB.Config.uiSettings();

   class UIProcessGatewayExclusive extends UIClass {
      constructor() {
         super("properties_process_gateway_exclusive", {
            name: "",
            buttonFilter: "",
         });
      }

      static get key() {
         return "GatewayExclusive";
      }

      // {string}
      // This should match the ABProcessEndCore.defaults().key value.

      ui() {
         let ids = this.ids;
         return {
            id: ids.component,
            view: "form",
            elements: [
               {
                  id: ids.name,
                  view: "text",
                  label: L("Name"),
                  labelWidth: uiConfig.labelWidthLarge,
                  name: "name",
                  // value: this.name,
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         return Promise.resolve();
      }

      populate(element) {
         let ids = this.ids;
         const instance = this;

         // we will redraw the form so we know how many connections to display

         let ui = this.ui();

         // we need access to element during .values()
         this._element = element;

         // here is how we can find out what possible process data
         // fields are available to this task:
         //   returns an [{ key:'{uuid}', label:"" field:{ABDataField} }, {}, ...]
         const listDataFields = element.process.processDataFields(element);
         const abFields = (listDataFields || [])
            .map((f) => {
               return f.field;
            })
            .filter((f) => f);

         const myOutgoingConnections = (
            element.process?.connectionsOutgoing?.(element.diagramID) ?? []
         ).filter(
            // Prevent duplicates
            (conn, pos, self) =>
               self.findIndex((item) => item.id === conn.id) === pos
         );

         this.__dfLookup = {};
         this.conditions = element.conditions || this.conditions || {};
         myOutgoingConnections.forEach((conn) => {
            const condition = this.conditions[conn.id] || {};

            const connectedElement = element.process.elementForDiagramID(
               conn.to
            );
            if (connectedElement == null) return;

            let DF;
            if (!this.__dfLookup[conn.id]) {
               DF = this.AB.filterComplexNew(
                  `${ids.component}_${conn.id}_filter`
               );
               // DF.applicationLoad(this.application);

               DF.myPopup = webix.ui({
                  view: "popup",
                  height: 240,
                  width: 480,
                  hidden: true,
                  body: DF.ui,
               });

               DF.init();

               DF.on("save", () => {
                  const value = DF.getValue();
                  const $buttonFilter = $$(`${ids.buttonFilter}_${conn.id}`);
                  $buttonFilter.define("badge", value.rules?.length || null);
                  $buttonFilter.refresh();
               });

               this.__dfLookup[conn.id] = DF;
            }
            DF = this.__dfLookup[conn.id];

            const connUI = {
               view: "fieldset",
               label: L("to {0}", [
                  connectedElement
                     ? connectedElement.name
                     : L("unlabeled Task({0})", [conn.id]),
               ]),
               body: {
                  rows: [
                     {
                        id: `${ids.component}_${conn.id}_label`,
                        view: "text",
                        label: L("Label"),
                        value: condition.label || "",
                     },
                     // DF.ui,
                     {
                        id: `${ids.buttonFilter}_${conn.id}`,
                        css: "webix_primary",
                        view: "button",
                        // name: "buttonFilter",
                        label: L("Add Filter"),
                        icon: "fa fa-gear",
                        type: "icon",
                        badge: condition.filterValue?.rules?.length || null,
                        click: function () {
                           DF.popUp(this.$view, null, { pos: "top" });
                        },
                     },
                  ],
               },
            };

            ui.elements.push(connUI);
         });

         // DF.setValue(CurrentQuery.where);

         webix.ui(ui, $$(ids.component));

         $$(ids.component).show();

         // update the filters after they have been .show()n
         myOutgoingConnections.forEach((conn) => {
            const condition = this.conditions[conn.id] || {};
            const DF = this.__dfLookup[conn.id];
            if (DF == null) return;

            // NOTE: keep the DF.fieldsLoad() AFTER the ui is built.
            DF.fieldsLoad(abFields);
            if (condition.filterValue) {
               DF.setValue(condition.filterValue);
            }
            DF.init();
         });

         $$(ids.name).setValue(element.name);
      }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */
      values() {
         let obj = {};
         const ids = this.ids;
         obj.label = $$(ids.name)?.getValue();
         obj.name = obj.label;

         obj.conditions = {};
         const myOutgoingConnections =
            this._element.process.connectionsOutgoing(this._element.diagramID);
         myOutgoingConnections.forEach((conn) => {
            obj.conditions[conn.id] = {};
            obj.conditions[conn.id].label = $$(
               `${ids.component}_${conn.id}_label`
            ).getValue();
            if (this.__dfLookup && this.__dfLookup[conn.id]) {
               const DF = this.__dfLookup[conn.id];
               obj.conditions[conn.id].filterValue = DF.getValue();
            }
         });

         return obj;
      }
   }

   return UIProcessGatewayExclusive;
}
