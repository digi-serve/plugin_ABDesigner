/*
 * ab_work
 *
 * Display the component for working with an ABApplication.
 *
 */
import UI_Class from "./ui_class";
import UI_Work_Object from "./ui_work_object";
import UI_Work_Query from "./ui_work_query";
import UI_Work_Datacollection from "./ui_work_datacollection";
import UI_Work_Process from "./ui_work_process";
// const AB_Work_Interface = require("./ab_work_interface");

export default function (AB) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   var AppObjectWorkspace = UI_Work_Object(AB);
   const AppQueryWorkspace = UI_Work_Query(AB);
   const AppDataCollectionWorkspace = UI_Work_Datacollection(AB);
   const AppProcessWorkspace = UI_Work_Process(AB);
   // var AppInterfaceWorkspace = new AB_Work_Interface(App);

   class UI_Work extends UIClass {
      constructor(options = {}) {
         super("abd_work", {
            toolBar: "",
            labelAppName: "",
            tabbar: "",
            tab_object: "",
            tab_query: "",
            tab_datacollection: "",
            tab_processview: "",
            tab_interface: "",
            workspace: "",
            collapseMenu: "",
            expandMenu: "",
         });

         this.options = options;

         this.selectedItem = this.ids.tab_object;
         // {string} {this.ids.xxx}
         // Keep track of the currently selected Tab Item (Object, Query, etc)
      }

      scanTopic(app, key) {
         let countObjects = 0;
         let warnObjects = {};
         if (app) {
            app[key]().forEach((o) => {
               countObjects += (o.warningsAll() || []).length;
            });
         }
         if (countObjects) {
            warnObjects.icon = `<span class="webix_sidebar_dir_icon webix_icon fa fa-warning pulseDark smalltext"></span>`;
            warnObjects.count = countObjects;
         }
         return warnObjects;
      }
      sidebarItems(app) {
         let warnObjects = this.scanTopic(app, "objectsIncluded");
         let warnQueries = this.scanTopic(app, "queriesIncluded");
         const warnDatacollections = this.scanTopic(
            app,
            "datacollectionsIncluded"
         );

         var sidebarItems = [
            {
               id: this.ids.tab_object,
               value: `${L("Objects")}`,
               icon: "fa fa-fw fa-database",
               issues: warnObjects,
            },
            {
               id: this.ids.tab_query,
               value: `${L("Queries")}`,
               icon: "fa fa-fw fa-filter",
               issues: warnQueries,
            },
            {
               id: this.ids.tab_datacollection,
               value: L("Data Collections"),
               icon: "fa fa-fw fa-table",
               issues: warnDatacollections,
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

         return sidebarItems;
      }

      /**
       * @method ui()
       * Return the webix definition of the UI we are managing.
       * @return {json}
       */
      ui() {
         var sidebarItems = this.sidebarItems();

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
                        id: this.ids.tabbar,
                        css: "webix_dark",
                        view: "sidebar",
                        animate: false,
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
                        template: function (obj, common) {
                           if (common.collapsed) {
                              return common.icon(obj, common);
                           } else {
                              return (
                                 (obj.issues?.icon || "") +
                                 common.icon(obj, common) +
                                 "<span>" +
                                 obj.value +
                                 "</span>"
                              );
                           }
                        },
                        tooltip: {
                           template: function (obj) {
                              return obj.issues?.count
                                 ? `${obj.issues?.count} issues`
                                 : "";
                           },
                        },
                     },
                     {
                        id: this.ids.workspace,
                        cells: [
                           AppObjectWorkspace.ui(),
                           AppQueryWorkspace.ui(),
                           AppDataCollectionWorkspace.ui(),
                           AppProcessWorkspace.ui(),
                           // AppInterfaceWorkspace.ui,
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

         this.warningsPropogate([
            AppObjectWorkspace,
            AppQueryWorkspace,
            AppDataCollectionWorkspace,
            AppProcessWorkspace,
         ]);
         this.on("warnings", () => {
            this.refreshSideBar(this.CurrentApplication);
         });

         AppObjectWorkspace.init(AB);
         AppQueryWorkspace.init(AB);
         AppDataCollectionWorkspace.init(AB);
         AppProcessWorkspace.init(AB);
         // AppInterfaceWorkspace.init(AB);

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
       *        The current ABApplication we are working with.
       */
      applicationInit(application) {
         if (application) {
            // setup Application Label:
            var $labelAppName = $$(this.ids.labelAppName);
            $labelAppName.define("label", application?.label);
            $labelAppName.refresh();
         }
         super.applicationLoad(application);
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

      refreshSideBar(application) {
         let $tabbar = $$(this.ids.tabbar);
         let sidebarItems = this.sidebarItems(application);
         $tabbar?.define("data", sidebarItems);
         $tabbar?.refresh();
      }

      /**
       * @method transitionWorkspace
       * Switch the UI to view the App Workspace screen.
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      transitionWorkspace(application) {
         if (this.CurrentApplicationID != application?.id) {
            this.applicationInit(application);
         }
         AppObjectWorkspace.applicationLoad(application);
         AppQueryWorkspace.applicationLoad(application);
         AppDataCollectionWorkspace.applicationLoad(application);
         AppProcessWorkspace.applicationLoad(application);
         // AppInterfaceWorkspace.applicationLoad(application);

         this.refreshSideBar(application);

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
            case this.ids.tab_datacollection:
               AppDataCollectionWorkspace.show();
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
