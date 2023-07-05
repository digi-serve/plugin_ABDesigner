/*
 * ui_work_process_workspace_model
 *
 * Manage the Object Workspace area.
 *
 */
import UI_Class from "./ui_class";
import UI_Warnings from "./ui_warnings";
import BpmnModeler from "bpmn-js/lib/Modeler";

import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/diagram-js.css";
// import "bpmn-js/dist/bpmn-navigated-viewer.development.js";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

import FCustomBPMN from "./ui_work_process_workspace_customBPMN";
import AppBuilderExtensions from "./ui_work_process_workspace_customBPMN_customEvents";

const genericElementTypes = ["bpmn:Task", "bpmn:StartEvent", "bpmn:EndEvent"];
// {array} [ "BPMN:Element" ... ]
// A list of the "Generic" BPMN Element Types we use as placeholders
// until our own tasks are assigned to that element.

import FPropertyManager from "./properties/PropertyManager";

/**
 * @function series()
 * perform a series of fn() calls in series.
 * each fn() is provided a node style callback(err).
 * once all fn() have been called, cb() is called.
 * If any fn() in the series returns an error, then cb(err)
 * is returned.
 * @param {array} list
 *        An array of fn() calls that take a node style callback.
 * @param {fn} cb
 *        A node style callback to call after execution.
 */
function series(list, cb) {
   if (list.length == 0) {
      cb();
   } else {
      var step = list.shift();
      step((err) => {
         if (err) {
            return cb(err);
         }
         series(list, cb);
      });
   }
}

/**
 * @function isInSubProcess()
 * a helper fn() to determine if a provided BPMN:Element is contained in a
 * Sub Process.
 * @param {BPMNElement} element
 * @return {bool}
 */
function isInSubProcess(element) {
   return element.parent?.type == "bpmn:SubProcess";
}

export default function (AB) {
   const ibase = "ui_work_process_workspace_model";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const Warnings = UI_Warnings(AB, `${ibase}_view_warnings`);

   const CustomBPMN = FCustomBPMN(AB);
   const PropertyManager = FPropertyManager(AB);

   class UI_Work_Process_Workspace_Model extends UIClass {
      /**
       * @param {object} App
       * @param {string} idBase
       */
      constructor() {
         super(ibase, {
            button: "",
            component: "",
            modeler: "",
            modelerBroken: "",
            modelerWorking: "",
            properties: "",
            propertyPanel: "",
         });

         this.viewer = null;
         // {BpmnModeler}
         // this is the actual BMPN modeler widget displayed on the page.

         this.unsavedChanges = false;
         // {bool}
         // Do we have unsaved changes to our model?

         this.CurrentPropertiesObj = null;

         this.panelsByType = {};
         // {hash} {ABProcessXXX.default().key : PropertyEditor }
         // A hash of all the available property editors for our process
         // elements.  These panels will be used to enter/update the
         // process properties.

         this.panelSelectElement = {
            id: this.ids.properties,
            view: "template",
            template: `<div id="${this.ids.properties}_div">${L(
               "Select an element to edit."
            )}</div>`,
         };

         this.panelGenericEndEvent = {
            id: this.ids.properties,
            view: "template",
            template: `<div id="${this.ids.properties}_div">${L(
               "This is a generic BPMN End Event placeholder. Change it to one of our Specific End Event Types to edit."
            )}</div>`,
         };

         this.panelGenericTrigger = {
            id: this.ids.properties,
            view: "template",
            template: `<div id="${this.ids.properties}_div">${L(
               "This is a generic BPMN Trigger placeholder. Change it to one of our Specific Trigger Types to edit."
            )}</div>`,
         };

         this.panelGenericService = {
            id: this.ids.properties,
            view: "template",
            template: `<div id="${this.ids.properties}_div">${L(
               "This is a generic BPMN Task placeholder. Change it to one of our Specific Tasks to edit."
            )}</div>`,
         };
      }

      ui() {
         let ids = this.ids;

         // Our webix UI definition:
         return {
            id: ids.component,
            css: "bg_gray",
            rows: [
               {
                  id: ids.button,
                  view: "button",
                  css: "webix_primary",
                  type: "form",
                  label: L("Save"),
                  icon: "fa fa-save",
                  click: () => {
                     this.saveProcess(this.CurrentProcess);
                  },
               },
               {
                  id: ids.modelerWorking,
                  cols: [
                     {
                        view: "template",
                        // height: 800,
                        template: `<div id="${ids.modeler}" style="width: 100%; height: 100%;"></div>`,
                     },
                     { view: "resizer", css: "bg_gray", width: 11 },
                     {
                        width: uiConfig.columnWidthXXLarge,
                        rows: [
                           {
                              view: "toolbar",
                              css: "ab-data-toolbar webix_dark",
                              cols: [
                                 {
                                    type: "spacer",
                                    width: 15,
                                 },
                                 {
                                    view: "label",
                                    label: L("Properties"),
                                 },
                              ],
                           },
                           {
                              view: "scrollview",
                              id: ids.propertyPanel,
                              body: {
                                 padding: 15,
                                 rows: [
                                    {
                                       id: ids.properties,
                                       view: "template",
                                       template: `<div id="${ids.properties}_div">properties here!</div>`,
                                    },
                                 ],
                              },
                           },
                        ],
                     },
                  ],
               },
               {
                  id: ids.modelerBroken,
                  view: "template",
                  // height: 800,
                  template: `<div  style="width: 100%; height: 100%;"> Big Broken Icon Here </div>`,
               },
               // {
               //     maxHeight: App.config.xxxLargeSpacer,
               //     hidden: App.config.hideMobile
               // }
               Warnings.ui(),
            ],
         };
      }

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;
         let ids = this.ids;

         //// NOTE: the webix template isn't created at this point.
         ////   we need to wait until the [process] tab and a Process are
         ////   selected before we are SURE this template exists in the DOM
         // viewer = new BpmnModeler({
         //     container: "#" + ids.modeler
         // });

         $$(ids.button)?.hide();
         $$(ids.modelerBroken)?.hide();
         $$(ids.modelerWorking)?.show();
         // $$(ids.properties)?.hide();

         // Populate the Property Editors
         const ProcessElements = PropertyManager.processElements();

         ProcessElements.forEach((PE) => {
            this.panelsByType[PE.key] = new PE();
         });

         // now remove the 'del_me' definition editor placeholder.
         webix.ui(this.panelSelectElement, $$(ids.properties));
      }

      applicationLoad(application) {
         super.applicationLoad(application);

         Object.keys(this.panelsByType).forEach((k) => {
            this.panelsByType[k].applicationLoad(application);
         });
      }

      /**
       * @method checkKnownElement()
       * Given an element on the BPMN diagram, check to see if it is
       * known by the process or not.  If not, it is most likely a generic
       * element that needs to be assigned one of our specific tasks.
       * This method will assign warnings to the element that will be
       * noted on the diagram.
       * @param {BPMNShape} shape
       * @param {BPMNElement} parent
       */
      checkKnownElement(shape, parent) {
         const currElement = this.CurrentProcess.elementForDiagramID(shape.id);

         // if this is one of our generic types, and it isn't currently
         // tracked by our CurrentProcess, then it should show a warning.
         if (genericElementTypes.indexOf(shape.type) > -1) {
            if (!currElement) {
               // skip elements that are Start and End markers in a SubProcess

               // we might get {Shape}s or {BPMNElement} objects. Referencing
               // the parent type is different for the two objects.
               let parentType = parent?.type ?? "unknown";
               parentType =
                  shape.parent?.type ??
                  shape.businessObject?.$parent?.$type ??
                  parentType;

               if (
                  parentType != "bpmn:SubProcess" ||
                  ["bpmn:StartEvent", "bpmn:EndEvent"].indexOf(shape.type) == -1
               ) {
                  shape.___abwarnings = ["generic task"];
                  // NOTE: this warning will be removed once the property
                  // panel for this element has been saved.

                  // make sure the process knows about it
                  this.CurrentProcess.unknownShape(shape);
                  this.emit("warnings");
               } else {
                  delete shape.___abwarnings;
               }
            }
         }

         // Case 2: An element that already knows it has warnings should
         // default display the warning symbol.
         if (currElement) {
            const warnings = currElement.warnings();
            if (warnings.length > 0) {
               shape.___abwarnings = warnings;
            }
         }
      }

      /**
       * @method clearWorkspace()
       * Clear the object workspace.
       */
      clearWorkspace() {
         // usually a .clearWorkspace() happens on a Delete or a process is no
         // longer selected.

         // if we are told to clear the workspace, then reset our
         // internal trackers.
         this.CurrentProcessID = null;
         this.unsavedChanges = false;
      }

      /**
       * @method saveProcess()
       * Make sure the provided process saves any changes.
       * @param {ABProcess} _process
       *        the current process this interface is working with.
       */
      async saveProcess(_process) {
         if (this.CurrentPropertiesObj) {
            this.propertiesSave();
         }

         try {
            let { xml } = await this.viewer.saveXML({ preamble: true });
            _process.modelUpdate(xml);
            await _process.save();
            this.unsavedChanges = false;
            // now we refresh our warnings.
            this.warningsRefresh(this.CurrentProcess);
            Warnings.show(this.CurrentProcess);
            $$(this.ids.button).hide();
         } catch (err) {
            this.AB.notify.developer(err, {
               context: "ui_work_process_workspace_model:saveProcess()",
            });
         }
      }

      /**
       * @method processLoad()
       * Initialize the Process Workspace with the provided ABProcess.
       * @param {ABProcess} process
       *        current ABProcess instance we are working with.
       */
      processLoad(process) {
         // NOTE: do not do super.processLoad() here!  Wait until we have saved
         // any unsaved data below.
         // super.processLoad(process);
         var ids = this.ids;

         Object.keys(this.panelsByType).forEach((k) => {
            // if (this.panelsByType[k].processLoad) {
            this.panelsByType[k]?.processLoad?.(process);
            // }
         });

         // initialize the BPMN Viewer if not already initialized:
         if (!this.viewer) {
            $$(ids.modelerBroken).hide();
            $$(ids.modelerWorking).show();
            const container = document.getElementById(ids.modeler);
            this.viewer = new BpmnModeler({
               container: container, // "#" + ids.modeler,
               additionalModules: [CustomBPMN],
               moddleExtensions: {
                  ab: AppBuilderExtensions(),
               },
            });

            // Modifying Attributes on a Diagram Shape:
            // var elementRegistry = viewer.get('elementRegistry');
            // var startEventShape = elementRegistry.get('StartEvent_1');
            // var modeling = viewer.get("modeling");
            // modeling.updateProperties(startEventShape, {
            //   name: 'New name'
            // });

            // Adding color to a diagram element:
            // var canvas = bpmnViewer.get('canvas');
            // canvas.addMarker('UserTask_XYZ', 'highlight');
            //   --> define svg style for "highlight"

            // get currently selected shape:
            // var selection = viewer.get("selection");
            // var selectedElements = selection.get();

            // to find possible events:
            // do a file search on bpmn-js for ".fire(""
            // or, put a breakpoint in diagram-js/lib/core/EventBus.js
            //     in the .fire() method and look at: this._listeners

            this.viewer.on(["bpmnElement.added"], (event) => {
               // catch elements .added so we can initialize our
               // connection information.

               // console.log(`${event.type}:`, event.element);
               var element = event.element;
               if (
                  element.type == "bpmn:SequenceFlow" ||
                  element.type == "bpmn:MessageFlow"
               ) {
                  this.CurrentProcess?.connectionUpsert(element);
               }
            });

            // viewer.on(
            //     [
            //         "element.click"
            //         // "element.updateId",
            //         // "element.changed",
            //         // "shape.remove"
            //     ],
            //     (event) => {
            //         console.log(`${event.type}:`, event.element);
            //     }
            // );
            // viewer.on("element.updateId", (event) => {
            //     console.log("element.updateId:", event.element);
            //     //
            // });

            // When a Shape is added to the diagram, decide if it should
            // show a warning.
            this.viewer.on("shape.add", (event) => {
               this.checkKnownElement(event.element, event.parent);
            });

            this.viewer.on("shape.remove", (event) => {
               // console.log("shape.remove:", event.element);
               if (this.CurrentProcess) {
                  // let isSubTask = false;
                  let processTask = this.CurrentProcess;
                  var element = event.element;
                  if (isInSubProcess(element)) {
                     processTask =
                        this.CurrentProcess.elementForDiagramID(
                           element.parent.id
                        ) || this.CurrentProcess;
                     // isSubTask = true;
                  }

                  // remove this connection
                  if (
                     element.type == "bpmn:SequenceFlow" ||
                     element.type == "bpmn:MessageFlow"
                  ) {
                     processTask.connectionRemove(element);
                  } else {
                     // remove this task
                     // if our current process tracks this Element/Task
                     var currTask = processTask.elementForDiagramID(element.id);
                     if (currTask) {
                        currTask.destroy();
                     }

                     // NOTE: Gateways need to be re-evaluated if their next task
                     // is removed:
                     let connectionsIN =
                        this.CurrentProcess.connectionsIncoming(element.id);
                     connectionsIN.forEach((c) => {
                        // remove this connection:
                        this.CurrentProcess.connectionRemove(c);

                        // tell the previous task to re-eval it's warnings:
                        var prevTask = this.CurrentProcess.elementForDiagramID(
                           c.from
                        );
                        if (prevTask) {
                           prevTask.warningsEval();
                           this.timedUpdate(prevTask);
                        }
                     });
                  }

                  this.CurrentProcess.unknownShapeRemove(element);
               }
            });
            this.viewer.on("element.changed", (event) => {
               let element = event.element;

               // ignore label updates
               if (element.type == "label") {
                  return;
               }

               let processTask = this.CurrentProcess;
               if (isInSubProcess(element)) {
                  processTask =
                     this.CurrentProcess.elementForDiagramID(
                        element.parent.id
                     ) || this.CurrentProcess;
               }

               if (processTask == null) return;

               // if not sequence flow lines:
               if (
                  element.type != "bpmn:SequenceFlow" &&
                  // SequenceFlow : seems to happen between tasks within the same Participant
                  element.type != "bpmn:MessageFlow"
                  // MessageFlow : seems to happen between tasks between Participants
               ) {
                  // if our current process already has this Element/Task
                  var currElement = processTask.elementForDiagramID(element.id);
                  if (currElement) {
                     // send it an onChange(event.element);
                     currElement.onChange(element, ids.properties);
                  } else {
                     // element.changed : can be triggered for deleted elements
                     // make sure the shape for this element still exists,
                     // before doing anything else here:
                     var elementRegistry = this.viewer.get("elementRegistry");
                     var currentElementShape = elementRegistry.get(element.id);
                     if (currentElementShape) {
                        // shape does exist, so:

                        // if one of the generic elements
                        // that doesn't have a definition attached
                        // NOTE: EndEvents, are replaced with
                        // elements.type=="EndEvent", but a
                        // .eventDefinition[0].$type ==
                        // "TerminateEndEvent"
                        var def = null;
                        var defType = null;
                        if (event.element.businessObject.eventDefinitions) {
                           def =
                              event.element.businessObject.eventDefinitions[0];
                        }
                        if (def) {
                           defType = def.$type;
                        }

                        if (
                           genericElementTypes.indexOf(element.type) != -1 &&
                           !defType
                        ) {
                           // set the display to ".highlight"
                           // so the user knows it hasn't been
                           // fully configured yet.
                           let canvas = this.viewer.get("canvas");
                           canvas.addMarker(
                              element.id,
                              "highlight-undefined-task"
                           );
                        } else {
                           // create new process task for this
                           var newElement =
                              processTask.elementNewForModelDefinition(element);
                           if (newElement) {
                              // if successful
                              // try to remove the marker if it has one
                              let canvas = this.viewer.get("canvas");
                              canvas.removeMarker(
                                 element.id,
                                 "highlight-undefined-task"
                              );
                           } else {
                              this.AB.notify.developer(
                                 new Error(
                                    "no ProcessElement for BPMN Element"
                                 ),
                                 {
                                    element,
                                 }
                              );
                           }
                        }
                     }
                  }
               } else {
                  // this is a connection update:
                  processTask.connectionUpsert(element);

                  // NOTE: if this is adding a new connection, we need the previous
                  // element to have a chance to update it's warnings.
                  let connection = this.CurrentProcess.connectionForDiagramID(
                     element.id
                  );
                  if (connection) {
                     let prevTask = this.CurrentProcess.elementForDiagramID(
                        connection.from
                     );
                     if (prevTask) {
                        // NOTE: timedUpdate() is necessary for the BPMN diagram to
                        // display the new state of the warnings. BUT it also triggers
                        // another "element.changed" event, so we need to not trigger
                        // it again if the current call was a result of a previous
                        // timedUpdate(). (otherwise you get an infinit loop)
                        if (!prevTask.___pendingUpdate) {
                           let properties = prevTask.diagramProperties(
                              this.viewer
                           );
                           // NOTE: this section of the "element.changed" handler only
                           // looks at connections, so we only need to skip the updates
                           // that are for connections:
                           properties = properties.filter(
                              (p) => p.id.indexOf("Flow") > -1
                           );

                           if (properties.length > 0) {
                              prevTask.___pendingUpdate = properties.length;
                           }
                           prevTask.warningsEval();
                           this.timedUpdate(prevTask);
                        } else {
                           prevTask.___pendingUpdate--;
                           if (prevTask.___pendingUpdate == 0) {
                              delete prevTask.___pendingUpdate;
                           }
                           // event.cancelBubble = true;
                        }
                     }
                  }
               }
            });

            this.viewer.on("selection.changed", (event) => {
               if (!this.CurrentProcess) {
                  return;
               }

               // only show properties Pane when there is 1 selection
               if (event.newSelection.length == 1) {
                  let element = event.newSelection[0];
                  var newObj = this.CurrentProcess.elementForDiagramID(
                     element.id
                  );
                  if (isInSubProcess(element) && newObj == null) {
                     let subProcessTask =
                        this.CurrentProcess.elementForDiagramID(
                           element.parent.id
                        );
                     if (subProcessTask)
                        newObj = subProcessTask.elementForDiagramID(element.id);
                  }

                  if (newObj) {
                     // make sure previous selection records it's properties
                     if (
                        this.CurrentPropertiesObj &&
                        this.CurrentPropertiesObj.diagramID != newObj.diagramID
                     ) {
                        this.propertiesSave();
                     }

                     this.CurrentPropertiesObj = newObj;

                     // NOTE: this is trying to prevent adding the same
                     // listener repeatedly
                     if (!this.CurrentPropertiesObj._handlerSwitchTo) {
                        this.CurrentPropertiesObj._handlerSwitchTo = (
                           switchObj
                        ) => {
                           this.CurrentPropertiesObj = switchObj;
                           this.panelShow(switchObj);
                        };
                        this.CurrentPropertiesObj.on(
                           "switchTo",
                           this.CurrentPropertiesObj._handlerSwitchTo
                        );
                     }
                     this.panelShow(newObj);
                     // newObj.propertiesShow(ids.properties /*, App */);

                     if (!this.CurrentPropertiesObj._handlerSave) {
                        this.CurrentPropertiesObj._handlerSave = () => {
                           this.saveProcess(this.CurrentProcess);

                           this.CurrentPropertiesObj?.propertiesShow(
                              ids.properties
                           );
                        };
                        this.CurrentPropertiesObj.on(
                           "save",
                           this.CurrentPropertiesObj._handlerSave
                        );
                     }
                  } else {
                     this.CurrentPropertiesObj = null;

                     // don't show this warning if a SubProcess Start/End element.
                     if (
                        !isInSubProcess(element) ||
                        ["bpmn:StartEvent", "bpmn:EndEvent"].indexOf(
                           element.type
                        ) == -1
                     ) {
                        console.warn(
                           "Selected Element is unknown to this Process: " +
                              event.newSelection[0].id
                        );
                     }

                     let genPanel = this.panelSelectElement;
                     switch (element.type) {
                        case "bpmn:EndEvent":
                           genPanel = this.panelGenericEndEvent;
                           break;
                        case "bpmn:StartEvent":
                           genPanel = this.panelGenericTrigger;
                           break;
                        case "bpmn:Task":
                           genPanel = this.panelGenericService;
                           break;
                     }
                     // Perhaps, this was a diagram element that was unsaved.
                     // And now we don't know what to do with it.
                     // What do we do? Suggest that the User Delete it, and
                     // recreate it?
                     webix.ui(genPanel, $$(ids.properties));
                     this.CurrentPanel = genPanel;
                  }
               } else {
                  // we are clearing the properties panel:
                  // stash any current values that are there
                  if (this.CurrentPropertiesObj) {
                     this.propertiesSave();
                  }
                  this.CurrentPropertiesObj = null;
                  $$(ids.properties).hide();
               }

               // console.log(
               //    "selection.changed: New: ",
               //    event.newSelection
               // );
               // console.log(
               //    "selection.changed: Old: ",
               //    event.oldSelection
               // );
            });

            // setup our Listeners:

            // when a change is made, then make the [Save] button ready:
            this.viewer.on("commandStack.changed", () => {
               this.unsavedChanges = true;
               $$(ids.button).show();
            });
         }

         var processSequence = [];

         // if there are unsaved changes in our CurrentProcess
         if (this.CurrentProcess && this.unsavedChanges) {
            // insert a save confirmation step
            processSequence.push((done) => {
               webix.confirm({
                  title: L("Save?"),
                  text: L("Save your changes to {0}?", [
                     this.CurrentProcess.label,
                  ]),
                  callback: (isOK) => {
                     if (isOK) {
                        this.saveProcess(this.CurrentProcess)
                           .then(() => {
                              done();
                           })
                           .catch(done);
                     } else {
                        // then ignore the unsaved changes
                        this.unsavedChanges = false;
                        $$(ids.button).hide();
                        done();
                     }
                  },
               });
            });
         }

         // continue our sequence with loading the new process
         processSequence.push(async (done) => {
            // NOTE: make sure CurrentProcess == null BEFORE .clear()
            // this prevents the "shape.removed" handler from trying to
            // process all the deletes triggered by the .clear()
            this.CurrentProcessID = null;
            this.viewer.clear();
            super.processLoad(process);

            // new process, so let's clear our properties selection.
            this.CurrentPropertiesObj = null;
            $$(ids.properties).hide();

            ///////
            var xml = process.modelDefinition();
            if (!xml) {
               process.modelNew();
               xml = process.modelDefinition();
            }

            try {
               await this.viewer.importXML(xml);
               this.viewer.get("canvas").zoom("fit-viewport", "auto");
               done();
            } catch (err) {
               done(err);
            }
         });

         series(processSequence, (err) => {
            if (err) {
               if (err.toString().indexOf("no diagram to display")) {
                  webix.confirm({
                     title: L("Error Displaying Process"),
                     message: L(
                        "Could not display the process definition for {0}. Do you want to start a blank process?",
                        [this.CurrentProcess.name]
                     ),
                     callback: (isOK) => {
                        if (isOK) {
                           process.modelNew();
                           this.processLoad(this.CurrentProcess);
                        } else {
                           // show the broken Process page
                           $$(ids.modelerWorking).hide();
                           $$(ids.modelerBroken).show();
                           this.viewer.clear();
                           this.viewer.destroy();
                           this.viewer = null;
                        }
                     },
                  });
               }
               this.AB.notify.developer(err, {
                  context: "error during the process of changing the Process",
               });
               // console.log(err);
            }

            $$(ids.modelerBroken).hide();
            $$(ids.modelerWorking).show();

            this.warningsRefresh(this.CurrentProcess);
            Warnings.show(this.CurrentProcess);
         });
      }

      panelShow(element) {
         // get the Panel for the element
         let newPanel = { ui: () => this.panelSelectElement };
         if (this.panelsByType[element.key]) {
            newPanel = this.panelsByType[element.key];
         }

         // insert Panel into the webix ui
         let newPanelUI = {
            id: this.ids.properties,
            rows: [newPanel.ui(element), {}],
         };
         webix.ui(newPanelUI, $$(this.ids.properties));

         // populate the panel with element data
         newPanel.populate?.(element);
         this.CurrentPanel = newPanel;
      }

      /**
       * propertiesSave()
       * make sure the current values in the properties editor are
       * stashed
       */
      propertiesSave() {
         if (
            !this.CurrentPanel ||
            "function" !== typeof this.CurrentPanel.values
         ) {
            return;
         }
         var thisObj = this.CurrentPropertiesObj;
         var values = this.CurrentPanel.values();
         var objVals = thisObj.toObj();
         Object.keys(values).forEach((k) => {
            objVals[k] = values[k];
         });
         if (!thisObj.name) objVals.name = values.label;
         thisObj.fromValues(objVals);
         thisObj.warningsEval(); // resets the warnings

         // NOTE: this can get called during a BPMN event phase,
         // and we need to let that complete before trying to update the
         // diagram element properties.
         // an immediate timeout should let the other process complete.
         this.timedUpdate(thisObj);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      timedUpdate(thisObj) {
         setTimeout(() => {
            var properties = thisObj.diagramProperties(this.viewer);
            properties.forEach((prop) => {
               this.updateElementProperties(prop.id, prop.def, prop.warn);
            });

            this.warningsRefresh(this.CurrentProcess);
            Warnings.show(this.CurrentProcess);
         }, 0);
      }

      /**
       * updateElementProperties()
       * modify the XML properties of elements
       * @param {string} diagramID
       *        the XML diagram ID of the element
       * @param {obj} properies
       *        a { 'name':'value' } of the updated properties
       */
      updateElementProperties(diagramID, values, warnings) {
         var elementRegistry = this.viewer.get("elementRegistry");
         var elementShape = elementRegistry.get(diagramID);

         if (elementShape) {
            if (warnings) {
               elementShape.___abwarnings = warnings;
            } else {
               delete elementShape.___abwarnings;
            }

            var modeling = this.viewer.get("modeling");
            modeling.updateProperties(elementShape, values);
         }
      }

      /**
       * @method warningsRefresh()
       * reset the warnings on the provided ABObject and then start propogating
       * the "warnings" display updates.
       */
      warningsRefresh(process) {
         // #HACK: .warningsRefresh() can cause a Process to reset it's
         // current ._elements to what is in our definitions. This can loose
         // any current  unsaved changes. So, lets restore our working copy:
         let currElements = process.elements();
         super.warningsRefresh(process);
         currElements.forEach((e) => process.elementAdd(e));
      }
   }

   return new UI_Work_Process_Workspace_Model();
}
