/*
 * ab_work
 *
 * Display the component for working with an ABApplication.
 *
 */

import UI_Work_Object from "./ui_work_object";
import UI_Work_Query from "./ui_work_query";
import UI_Work_Interface from "./ui_work_interface";
// const AB_Work_Datacollection = require("./ab_work_dataview");
// const AB_Work_Process = require("./ab_work_process");
// const AB_Work_Interface = require("./ab_work_interface");

export default function (AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var AppObjectWorkspace = UI_Work_Object(AB);
   const AppQueryWorkspace = new (UI_Work_Query(AB))();
   // var AppDatacollectionWorkspace = new AB_Work_Datacollection(App);
   // var AppProcessWorkspace = new AB_Work_Process(App);
   var AppInterfaceWorkspace = new UI_Work_Interface(AB);

   class UI_Work extends AB.ClassUI {
      constructor(options = {}) {
         var base = "abd_work";
         super({
            component: `${base}_component`,
            toolBar: `${base}_toolbar`,
            labelAppName: `${base}_label_appname`,
            tabbar: `${base}_tabbar`,
            tab_object: `${base}_tab_object`,
            tab_query: `${base}_tab_query`,
            tab_dataview: `${base}_tab_dataview`,
            tab_processview: `${base}_tab_processview`,
            tab_interface: `${base}_tab_interface`,
            workspace: `${base}_workspace`,
            collapseMenu: `${base}_collapseMenu`,
            expandMenu: `${base}_expandMenu`,
         });

         this.options = options;

         this.selectedItem = this.ids.tab_object;
         // {string} {this.ids.xxx}
         // Keep track of the currently selected Tab Item (Object, Query, etc)
      } // constructor

      /**
       * @method ui()
       * Return the webix definition of the UI we are managing.
       * @return {json}
       */
      ui() {
         var sidebarItems = [
            {
               id: this.ids.tab_object,
               value: L("Objects"),
               icon: "fa fa-fw fa-database",
            },
            {
               id: this.ids.tab_query,
               value: L("Queries"),
               icon: "fa fa-fw fa-filter",
            },
            {
               id: this.ids.tab_dataview,
               value: L("Data Collections"),
               icon: "fa fa-fw fa-table",
            },
            {
               id: this.ids.tab_processview,
               value: L("Process"),
               icon: "fa fa-fw fa-code-fork",
            },
            {
               id: this.ids.tab_interface,
               value: L("Interface"),
               icon: "fa fa-fw fa-id-card-o",
            },
         ];

         var expandMenu = (this.expandMenu = {
            id: this.ids.expandMenu,
            value: L("Expand Menu"),
            icon: "fa fa-fw fa-chevron-circle-right",
         });

         var collapseMenu = {
            id: this.ids.collapseMenu,
            value: L("Collapse Menu"),
            icon: "fa fa-fw fa-chevron-circle-left",
         };

         return {
            id: this.ids.component,
            rows: [
               {
                  view: "toolbar",
                  id: this.ids.toolBar,
                  autowidth: true,
                  elements: [
                     {
                        view: "button",
                        css: "webix_transparent",
                        label: L("Back to Applications page"),
                        autowidth: true,
                        align: "left",
                        type: "icon",
                        icon: "fa fa-arrow-left",
                        align: "left",
                        hidden: this.options?.IsBackHidden ?? false, // hide this button in the admin lve page
                        click: () => {
                           this.emit("view.chooser");
                           // App.actions.transitionApplicationChooser();
                        },
                     },
                     // {
                     // 	view: "button",
                     // 	type: "icon",
                     // 	icon: "fa fa-bars",
                     // 	width: 37,
                     // 	align: "left",
                     // 	css: "app_button",
                     // 	click: function(){
                     // 		$$(ids.tabbar).toggle();
                     // 	}
                     // },
                     {},
                     {
                        view: "label",
                        css: "appTitle",
                        id: this.ids.labelAppName,
                        align: "center",
                     },
                     {},
                  ],
               },
               //{ height: App.config.mediumSpacer },
               // {
               // 	view:"segmented",
               // 	id: ids.tabbar,
               // 	value: ids.tab_object,
               // 	multiview: true,
               // 	align: "center",
               // 	options:[
               // 		{
               // 			id: ids.tab_object,
               // 			value: labels.component.objectTitle,
               // 			width: App.config.tabWidthMedium
               // 		},
               // 		{
               // 			id: ids.tab_interface,
               // 			value: labels.component.interfaceTitle,
               // 			width: App.config.tabWidthMedium
               // 		}
               // 	],
               // 	on: {
               // 		onChange: function (idNew, idOld) {
               // 			if (idNew != idOld) {
               // 				_logic.tabSwitch(idNew, idOld);
               // 			}
               // 		}
               // 	}
               // },
               {
                  cols: [
                     {
                        css: "webix_dark",
                        view: "sidebar",
                        id: this.ids.tabbar,
                        width: 160,
                        data: sidebarItems.concat(collapseMenu),
                        on: {
                           onAfterSelect: (id) => {
                              if (id == this.ids.collapseMenu) {
                                 setTimeout(() => {
                                    this.$tabbar.remove(this.ids.collapseMenu);
                                    this.$tabbar.add(expandMenu);
                                    this.$tabbar.toggle();
                                    this.$tabbar.select(this.selectedItem);
                                    this.saveState();
                                 }, 0);
                              } else if (id == this.ids.expandMenu) {
                                 setTimeout(() => {
                                    this.$tabbar.remove(this.ids.expandMenu);
                                    this.$tabbar.add(collapseMenu);
                                    this.$tabbar.toggle();
                                    this.$tabbar.select(this.selectedItem);
                                    this.saveState();
                                 }, 0);
                              } else {
                                 this.tabSwitch(id);
                                 this.selectedItem = id;
                              }
                           },
                        },
                     },
                     {
                        id: this.ids.workspace,
                        cells: [
                           AppObjectWorkspace.ui(),
                           AppQueryWorkspace.ui(),
                           // AppDatacollectionWorkspace.ui,
                           // AppProcessWorkspace.ui,
                           AppInterfaceWorkspace.ui(),
                        ],
                     },
                  ],
               },
            ],
         };
      } // ui()

      /**
       * @method init()
       * Initialize the State of this widget
       * @param {ABFactory} AB
       * @return {Promise}
       */
      async init(AB) {
         this.AB = AB;

         AppObjectWorkspace.init(AB);
         AppQueryWorkspace.init(AB);
         // AppDatacollectionWorkspace.init(AB);
         // AppProcessWorkspace.init(AB);
         AppInterfaceWorkspace.init(AB);

         this.$tabbar = $$(this.ids.tabbar);

         // initialize the Object Workspace to show first.
         var state = this.AB.Storage.get(this.ids.component);
         if (state) {
            this.$tabbar.setState(state);

            if (state.collapsed) {
               setTimeout(() => {
                  this.$tabbar.remove(this.ids.collapseMenu);
                  this.$tabbar.add(this.expandMenu);
               }, 0);
            }
         }

         this.tabSwitch(this.ids.tab_object);
         this.$tabbar.select(this.ids.tab_object);
      } // init()

      /**
       * @method applicationInit()
       * Store the current ABApplication we are working with.
       * @param {ABApplication} application
       */
      applicationInit(application) {
         // setup Application Label:
         var $labelAppName = $$(this.ids.labelAppName);
         $labelAppName.define("label", application.label);
         $labelAppName.refresh();
      }

      /**
       * @method saveState()
       * Save the state of this tabbar to local storage.
       */
      saveState() {
         this.AB.Storage.set(this.ids.component, this.$tabbar.getState());
      }

      /**
       * @method show()
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
         let tabId = this.$tabbar.getSelectedId();
         this.tabSwitch(tabId);
      }

      /**
       * @method transitionWorkspace
       * Switch the UI to view the App Workspace screen.
       * @param {ABApplication} application
       */
      transitionWorkspace(application) {
         this.applicationInit(application);
         AppObjectWorkspace.applicationLoad(application);
         AppQueryWorkspace.applicationLoad(application);
         // AppDatacollectionWorkspace.applicationLoad(application);
         // AppProcessWorkspace.applicationLoad(application);
         AppInterfaceWorkspace.applicationLoad(application);

         this.show();
      }

      /**
       * @method tabSwitch
       * Every time a tab switch happens, decide which workspace to show.
       * @param {string} idTab
       *        the id of the tab that was changed to.
       */
      tabSwitch(idTab) {
         switch (idTab) {
            // Object Workspace Tab
            case this.ids.tab_object:
               AppObjectWorkspace.show();
               break;

            // Query Workspace Tab
            case this.ids.tab_query:
               AppQueryWorkspace.show();
               break;

            // Datacollection Workspace Tab
            case this.ids.tab_dataview:
               AppDatacollectionWorkspace.show();
               break;

            // Process Workspace Tab
            case this.ids.tab_processview:
               AppProcessWorkspace.show();
               break;

            // Interface Workspace Tab
            case this.ids.tab_interface:
               AppInterfaceWorkspace.show();
               break;

            // Interface Workspace Tab
            case "interface":
               AppInterfaceWorkspace.show();
               this.$tabbar.select(this.ids.tab_interface);
               break;
         }
      }
   } // class UI_Work

   return new UI_Work();
}