/*
 * ABViewCustom
 * A Property manager for our ABViewCustom definitions
 */

import FABMobileView from "./ABMobileView";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_custom";

   const ABMobileView = FABMobileView(AB);
   // const L = ABMobileView.L();
   const uiConfig = AB.UISettings.config();

   class ABViewCustomProperty extends ABMobileView {
      constructor() {
         super(BASE_ID, {
            dataCollectionList: "",
            dataCollectionForm: "",
            dataCollection: "",
            initCodeTemplate: "",
            initCode: "",
            htmlCodeTemplate: "",
            htmlCode: "",
         });
      }

      static get key() {
         return "mobile-custom";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "tabview",
               cells: [
                  {
                     header: "DataCollections",
                     body: {
                        rows: [
                           {
                              view: "list",
                              id: ids.dataCollectionList,
                              template:
                                 "#name# - #dataCollection# <span class='webix_icon wxi-trash' style='float:right; cursor:pointer;'></span>",
                              autoheight: true,
                              onClick: {
                                 "wxi-trash": (e, id) => {
                                    this.removeDataCollection(id);
                                    return false;
                                 },
                              },
                           },
                           {
                              view: "form",
                              id: ids.dataCollectionForm,
                              elements: [
                                 {
                                    cols: [
                                       {
                                          view: "text",
                                          name: "name",
                                          label: "Name",
                                          labelWidth: uiConfig.labelWidthSmall,
                                          labelPosition: "top",
                                       },
                                       {
                                          id: ids.dataCollection,
                                          view: "richselect",
                                          name: "id",
                                          label: "Data Collection",
                                          labelWidth: uiConfig.labelWidthLarge,
                                          labelPosition: "top",
                                          options: [],
                                       },
                                       {
                                          view: "button",
                                          value: "Add",
                                          click: () => {
                                             this.addDataCollection();
                                          },
                                       },
                                    ],
                                 },
                              ],
                           },
                        ],
                     },
                  },
                  {
                     header: "init",
                     body: {
                        id: ids.initCodeTemplate,
                        view: "form",
                        elements: [
                           {
                              view: "template",
                              labelWidth: uiConfig.labelWidthLarge,
                              // height: 200,
                              template: "<div id='" + ids.initCode + "'></div>",
                           },
                        ],
                     },
                  },
                  {
                     header: "html",
                     body: {
                        id: ids.htmlCodeTemplate,
                        view: "form",
                        elements: [
                           {
                              view: "template",
                              labelWidth: uiConfig.labelWidthLarge,
                              // height: 200,
                              template: "<div id='" + ids.htmlCode + "'></div>",
                           },
                        ],
                     },
                  },
               ],
               multiview: {
                  keepViews: true,
               },
               tabbar: {
                  on: {
                     onAfterTabClick: (id) => {
                        if (
                           id === ids.initCodeTemplate ||
                           id === ids.htmlCodeTemplate
                        ) {
                           this.initTab(id);
                        }
                        this.onChange();
                     },
                  },
               },
            },
         ]);
      }

      /**
       * Initializes the editor views for the specified tab.
       *
       * @param {string} tab - The identifier of the tab to initialize.
       *
       * Initializes the CodeMirror editor for the `initCodeTemplate` tab if it hasn't been initialized yet.
       * The editor is configured with JavaScript syntax highlighting and a basic setup.
       *
       * Initializes the CodeMirror editor for the `htmlCodeTemplate` tab if it hasn't been initialized yet.
       * The editor is configured with JavaScript syntax highlighting and a basic setup.
       *
       * The editors are set up with initial content based on the current view's settings or default template code.
       *
       * @property {Object} ids - The identifiers for the different tabs and elements.
       * @property {Object} CurrentView - The current view settings.
       * @property {Object} initView - The CodeMirror editor instance for the init code.
       * @property {Object} htmlView - The CodeMirror editor instance for the HTML code.
       * @property {Function} onChange - The function to call when the editor content changes.
       */
      initTab(tab) {
         const ids = this.ids;

         if (tab == ids.initCodeTemplate && !this.initView) {
            this.initView = new EditorView({
               state: EditorState.create({
                  doc:
                     this.CurrentView.settings?.initCode ??
                     `// init code here\n// the following variables are available:\n// $AB: the ABFactory\n// $DC[<label>]: the list of datacollections you defined\n`,
                  extensions: [
                     basicSetup,
                     javascript(),
                     EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                           this.onChange();
                        }
                     }),
                  ],
               }),
               parent: document.getElementById(ids.initCode),
            });
         }

         // Initialize CodeMirror for htmlCode
         if (tab == ids.htmlCodeTemplate && !this.htmlView) {
            this.htmlView = new EditorView({
               state: EditorState.create({
                  doc:
                     this.CurrentView.settings?.htmlCode ??
                     `// html code here\n// the following varialbes are available:\n// $AB: the ABFactory\n// $h: the F7 template function\n// $DC[<label>]: the list of datacollections you defined\n\n// any returned html needs to be wrapped in $h\`...\` like so:\n// return $h\`<div>Hello World</div>\`;\n\nreturn $h\`${this.CurrentView.label} has no html defined.\``,
                  extensions: [
                     basicSetup,
                     javascript(),
                     EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                           this.onChange();
                        }
                     }),
                  ],
               }),
               parent: document.getElementById(ids.htmlCode),
            });
         }
      }

      /**
       * Refreshes the data collection list by filtering out the already included data collections
       * and updating the options of the data collection dropdown.
       *
       * @method dcListRefresh
       */
      dcListRefresh() {
         const ids = this.ids;

         let dcOptions = this.datacollectionsIncluded();
         let listItems = this.listAll();
         listItems.forEach((row) => {
            dcOptions = dcOptions.filter((d) => d.id != row.id);
         });

         $$(ids.dataCollection).define("options", dcOptions);
         $$(ids.dataCollection).refresh();
      }

      /**
       * Adds a data collection based on the form values.
       *
       * This method retrieves the values from the data collection form, checks if the
       * required fields (name and id) are present, and then attempts to find the data
       * collection by its ID. If found, it sets the data collection label and inserts
       * the values into the list. Finally, it clears the form, refreshes the data
       * collection list, and triggers the onChange event.
       */
      addDataCollection() {
         const form = $$(this.ids.dataCollectionForm);
         const values = form.getValues();
         if (values.name && values.id) {
            let dc = this.AB.datacollectionByID(values.id);
            if (dc) {
               values.dataCollection = dc.label;
               this.listInsert(values);
            }
            form.clear();
         }

         this.dcListRefresh();
         this.onChange();
      }

      /**
       * Serializes and returns all items in the data collection list.
       *
       * @returns {Array} An array of serialized items from the data collection list.
       */
      listAll() {
         return $$(this.ids.dataCollectionList).serialize(true);
      }

      /**
       * Inserts a row into the data collection list.
       *
       * @param {Object} row - The row to be inserted.
       * @param {string} row.id - The ID of the row.
       * @param {string} row.name - The name of the row.
       * @param {Object} row.dataCollection - The data collection associated with the row.
       */
      listInsert(row) {
         // row: {id, name, dataCollection}
         const list = $$(this.ids.dataCollectionList);
         list.add(row);
      }

      /**
       * Resets the data collection list by clearing all items and refreshing the list.
       */
      listReset() {
         const list = $$(this.ids.dataCollectionList);
         list.clearAll();
         list.refresh();
      }

      /**
       * Removes a data collection from the list by its ID and triggers the onChange event.
       *
       * @param {string} id - The ID of the data collection to be removed.
       */
      removeDataCollection(id) {
         const list = $$(this.ids.dataCollectionList);
         list.remove(id);
         this.dcListRefresh();
         this.onChange();
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      /**
       * Populates the view with the selected data collections.
       *
       * @param {Object} view - The view object containing settings and data collections.
       * @param {Object} view.settings - The settings object of the view.
       * @param {Object} view.settings.datacollections - The data collections chosen for the view.
       */
      populate(view) {
         super.populate(view);

         let chosenDCs = view.settings?.datacollections ?? {};
         // { label :id }
         // these are the currently chosen data collections

         this.listReset();

         // we will remove these from the list of available data collections
         Object.keys(chosenDCs).forEach((label) => {
            let dcID = chosenDCs[label];
            let dc = this.AB.datacollectionByID(dcID);
            this.listInsert({
               id: dcID,
               name: label,
               dataCollection: dc ? dc.label : "??",
            });
         });

         this.dcListRefresh();
      }

      defaultValues() {
         const ViewClass = this.ViewClass();

         let values = null;

         if (ViewClass) {
            values = ViewClass.defaultValues();
         }

         return values;
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const ids = this.ids;

         const $component = $$(ids.component);

         let values = super.values();

         values.settings = $component.getValues();

         let listValues = this.listAll();
         values.settings.datacollections = {};
         listValues.forEach((row) => {
            values.settings.datacollections[row.name] = row.id;
         });

         values.settings.initCode = this.initView?.state.doc.toString();
         if (!values.settings.initCode) {
            values.settings.initCode = this.CurrentView.settings?.initCode;
         }
         values.settings.htmlCode = this.htmlView?.state.doc.toString();
         if (!values.settings.htmlCode) {
            values.settings.htmlCode = this.CurrentView.settings?.htmlCode;
         }

         return values;
      }
   }

   return ABViewCustomProperty;
}
