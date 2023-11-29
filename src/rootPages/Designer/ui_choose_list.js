/*
 * UI Choose List
 *
 * Display a list of Applications we can work with.
 *
 *
 */
import UI_Class from "./ui_class";
import UI_Choose_List_Menu_Factory from "./ui_common_popupEditMenu";
import UI_Choose_List_NewApp from "./ui_choose_list_newApp";

export default function (AB) {
   // const AppList = AB_Choose_List_Factory(AB);
   // const AppForm = AB_Choose_Form_Factory(AB);

   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   const UI_Choose_List_Menu = UI_Choose_List_Menu_Factory(AB);

   const UINewApp = UI_Choose_List_NewApp(AB);

   class UIChooseList extends UIClass {
      constructor() {
         super("abd_choose_list", {
            toolbar: "",
            buttonCreateNewApplication: "",
            uploader: "",
            exporter: "",
            list: "",
         });

         this.cacheTemplate = {};
         // {json} hash { obj.id : template display }
         // a temporary cache of an items template
         // this is to prevent multiple template generations
         // in rapid succession.
      }

      ui() {
         return {
            id: this.ids.component,
            responsive: "hide",
            type: "space",

            cols: [
               {
                  maxWidth: uiConfig.appListSpacerColMaxWidth,
                  minWidth: uiConfig.appListSpacerColMinWidth,
                  width: uiConfig.appListSpacerColMaxWidth,
               },
               {
                  responsiveCell: false,
                  rows: [
                     {
                        maxHeight: uiConfig.appListSpacerRowHeight,
                        hidden: uiConfig.hideMobile,
                     },
                     //
                     // ToolBar
                     //
                     {
                        view: "toolbar",
                        css: "webix_dark",
                        id: this.ids.toolBar,
                        cols: [
                           { view: "spacer", width: 10 },
                           {
                              view: "label",
                              label: L("Applications"),
                              fillspace: true,
                              on: {
                                 onAfterRender() {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                           // {
                           //    view: "button",
                           //    type: "icon",
                           //    label: labels.component.administration,
                           //    icon: "fa fa-user",
                           //    autowidth: true,
                           //    css: "webix_transparent",
                           //    click: () => {
                           //       App.actions.transitionAdministration();
                           //    },
                           // },

                           // {
                           //    view: "button",
                           //    type: "icon",
                           //    label: L("Settings"),
                           //    icon: "fa fa-cog",
                           //    autowidth: true,
                           //    css: "webix_transparent",
                           //    click: () => {
                           //       this.emit("view.config");
                           //    },
                           // },
                           {
                              id: this.ids.buttonCreateNewApplication,
                              view: "button",
                              label: L("Add new application"),
                              autowidth: true,
                              type: "icon",
                              icon: "fa fa-plus",
                              css: "webix_transparent",
                              click: () => {
                                 // Inform our Chooser we have a request to create an Application:
                                 // this.emit("view.form", null); // leave null for CREATE
                                 this.NewApp.show();
                                 this.NewApp.clear();
                              },
                              on: {
                                 onAfterRender() {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                           {
                              view: "uploader",
                              id: this.ids.uploader,
                              label: L("Import"),
                              autowidth: true,
                              upload: "/definition/import",
                              multiple: false,
                              type: "icon",
                              icon: "fa fa-upload no-margin",
                              autosend: true,
                              css: "webix_transparent",
                              on: {
                                 onAfterFileAdd: () => {
                                    $$(this.ids.uploader).disable();
                                 },
                                 onFileUpload: (/*item, response */) => {
                                    // the file upload process has finished
                                    // reload the page:
                                    window.location.reload();
                                    return false;
                                 },
                                 onFileUploadError: (
                                    details /*, response */
                                 ) => {
                                    // {obj} details
                                    //   .file : {obj} file details hash
                                    //   .name : {string} filename
                                    //   .size : {int} file size
                                    //   .status : {string} "error"
                                    //   .xhr :  {XHR Object}
                                    //      .responseText
                                    //      .status : {int}  404
                                    //      .statusText : {string}

                                    this.AB.notify.developer(
                                       "Error uploading file",
                                       {
                                          url: details.xhr.responseURL,
                                          status: details.status,
                                          code: details.xhr.status,
                                          response: details.xhr.responseText,
                                       }
                                    );
                                    $$(this.ids.uploader).enable();
                                    return false;
                                 },
                                 onAfterRender() {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },

                           {
                              view: "button",
                              id: this.ids.exporter,
                              label: L("Export All"), // labels.common.export,
                              autowidth: true,
                              type: "icon",
                              icon: "fa fa-download",
                              css: "webix_transparent",
                              click: function () {
                                 window.location.assign(
                                    "/definition/export/all?download=1"
                                 );
                              },
                              on: {
                                 onAfterRender() {
                                    UIClass.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },

                     //
                     // The List of Applications
                     //
                     {
                        id: this.ids.list,
                        view: "list",
                        css: "ab-app-select-list",
                        template: (obj, common) => {
                           return this.templateListItem(obj, common);
                        },
                        tooltip: (obj) => {
                           return this.toolTipListItem(obj);
                        },
                        type: {
                           height: uiConfig.appListRowHeight, // Defines item height
                           iconGear: function (app) {
                              return `<span class="webix_icon fa fa-cog" data-cy="edit_${app.id}"></span>`;
                           },
                           iconAdmin: function (app) {
                              return app.isAdminApp
                                 ? "<span class='webix_icon fa fa-circle-o-notch'></span> "
                                 : "";
                           },
                        },
                        select: false,
                        onClick: {
                           "ab-app-list-item": (ev, id, trg) => {
                              return this.onClickListItem(ev, id, trg);
                           },
                           "ab-app-list-edit": (ev, id, trg) => {
                              return this.onClickListEdit(ev, id, trg);
                           },
                        },
                        onHover: {},
                        on: {
                           onAfterRender() {
                              this.data.each((a) => {
                                 UIClass.CYPRESS_REF(
                                    this.getItemNode(a.id),
                                    a.id
                                 );
                              });
                           },
                        },
                     },
                     {
                        maxHeight: uiConfig.appListSpacerRowHeight,
                        hidden: uiConfig.hideMobile,
                     },
                  ],
               },
               {
                  maxWidth: uiConfig.appListSpacerColMaxWidth,
                  minWidth: uiConfig.appListSpacerColMinWidth,
                  width: uiConfig.appListSpacerColMaxWidth,
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$list = $$(this.ids.list);
         // {webix.list}  The webix component that manages our Application List

         webix.extend(this.$list, webix.ProgressBar);
         webix.extend(this.$list, webix.OverlayBox);

         // Setup our popup Editor Menu for our Applications
         this.MenuComponent = new UI_Choose_List_Menu(this.ids.component);
         this.MenuComponent.init(AB);
         var options = [
            {
               label: L("Edit"), //labels.common.edit,
               icon: "fa fa-pencil-square-o",
               command: "edit",
            },
            {
               label: L("Export"), //labels.common.export,
               icon: "fa fa-download",
               command: "export",
            },
            {
               label: L("Delete"), // labels.common.delete,
               icon: "fa fa-trash",
               command: "delete",
            },
         ];
         this.MenuComponent.menuOptions(options);
         this.MenuComponent.on("click", (action) => {
            var selectedApp = this.$list.getSelectedItem();

            switch (action) {
               case "edit":
                  // this.emit("edit.form", selectedApp);
                  this.NewApp.show();
                  this.NewApp.applicationLoad(selectedApp);
                  break;

               case "delete":
                  webix.confirm({
                     title: L("Delete {0}?", [L("Application")]),
                     text: L("Do you want to delete <b>{0}</b>?", [
                        selectedApp.label,
                     ]),
                     ok: L("Yes"),
                     cancel: L("No"),
                     callback: async (result) => {
                        if (!result) return;

                        this.busy();
                        try {
                           await selectedApp.destroy();
                           this.refreshList();
                           webix.message({
                              type: "success",
                              text: L("{0}&nbsp; Successfully Deleted", [
                                 selectedApp.label,
                              ]),
                           });
                        } catch (e) {
                           webix.message({
                              type: "error",
                              text: L("There was an error deleting {0}.", [
                                 selectedApp.label,
                              ]),
                           });
                        }
                        this.ready();
                     },
                  });
                  break;

               case "export":
                  // Download the JSON file to disk
                  window.location.assign(
                     `/definition/export/${selectedApp.id}?download=1`
                  );
                  break;
            }
         });

         // listen for the AllApplications response:
         this.AB.Network.on(
            "definitions.allapplications",
            (context, err, allDefinitions) => {
               this.ready();
               if (err) {
                  // log the error
                  this.AB.notify.developer(err, {
                     plugin: "ABDesigner",
                     context:
                        "ui_choose_list:init(): /definition/allapplications",
                  });
                  context?.reject?.(err);
                  return;
               }

               this.AB.definitionsParse(allDefinitions);

               context?.resolve?.();
            }
         );

         this._handler_create = (def) => {
            if (def?.type != "application") return;

            if (this.AB.applications((app) => app.id == def.id).length < 1) {
               // Add a new Application to AB._allApplications
               this.AB.definitionSync("created", def.id, def);
            }

            this.refresh();
         };

         this._handler_reload = (def) => {
            if (def?.type == "application") {
               // this.loaded = false;
               this.refresh();
            } else if (!def) {
               this.AB.notify.developer(new Error("No def passed"), {
                  plugin: "ABDesigner",
                  context: "_handler_reload(): /definition/allapplications",
               });
            }
         };
         // {fn}
         // The handler that triggers a reload of our Application List
         // when we are alerted of changes to our applications.

         // Prepare the Popup New App Modal
         this.NewApp = UI_Choose_List_NewApp(AB);
         await this.NewApp.init(AB);

         // return Promise.all([AppList.init(AB) /*, AppForm.init(AB)*/]);
         // return this.loadAllApps().then(() => {
         //    // NOTE: .loadAllApps() will generate a TON of "definition.updated"
         //    // events.  So add these handlers after that is all over.

         //    // Refresh our Application List each time we are notified of a change
         //    // in our Application definitions:
         //    this.AB.on("definition.created", this._handler_reload);
         this.AB.on("definition.created", this._handler_create);
         // });
      }

      //
      // Logic Methods
      //

      busy() {
         this.$list.disable();
         if (this.$list.showProgress) this.$list.showProgress({ type: "icon" });
      }

      /**
       * @method loadAllApps();
       * specifically call for loading all the available ABApplications so that a
       * builder can work with them.
       * @return {Promise}
       */
      // async loadAllApps() {
      //    // NOTE: we only actually perform this 1x.
      //    // so track the _loadInProgress as our indicator of having done that.
      //    if (!this._loadInProgress) {
      //       this.busy();
      //       this._loadInProgress = new Promise((resolve, reject) => {
      //          var jobResponse = {
      //             key: "definitions.allapplications",
      //             context: { resolve, reject },
      //          };

      //          this.AB.Network.get(
      //             {
      //                url: `/definition/allapplications`,
      //             },
      //             jobResponse
      //          );
      //       });
      //    }

      //    return this._loadInProgress;
      // }

      /**
       * @function refresh
       *
       * Load all the ABApplications and display them in our App List
       */
      refresh() {
         // NOTE: pull Applications from myapps REST request instead
         // await this.loadAllApps();

         // if (this.loaded) return;

         // this.loaded = true;

         // Get applications data from the server
         this.busy();

         // User needs Access To Role (System Designer) in order to see
         // app.isSystemObj ABApplications.
         var f = (app) => !app.isSystemObj;

         if (this.AB.Account.isSystemDesigner()) {
            f = () => true;
         }
         var allApps = this.AB.applications(f);
         this.dcEditableApplications = new webix.DataCollection({
            data: allApps || [],
         });
         // {webix.DataCollection} dcEditableApplications
         // a list of all our applications we are able to edit.

         // Now for each of our Apps, be sure to listen for either
         // .updated or .deleted and then reload our list.
         ["definition.updated", "definition.deleted"].forEach((e) => {
            allApps.forEach((a) => {
               // make sure we only have 1 listener registered.
               a.removeListener(e, this._handler_reload);
               a.on(e, this._handler_reload);
            });
         });

         this.dcEditableApplications.attachEvent(
            "onAfterAdd",
            (/* id, index */) => {
               this.refreshOverlay();
            }
         );

         this.dcEditableApplications.attachEvent(
            "onAfterDelete",
            (/* id */) => {
               this.refreshOverlay();
            }
         );

         // // TODO: we should track the order in the List and save as
         // // .sortOrder ... or .local.sortOrder
         // this.dcEditableApplications.sort("label");
         // moved to .refreshList()

         this.refreshList();
         this.ready();
      }

      /**
       * @function onClickListEdit
       * UI updates for when the edit gear is clicked
       */
      onClickListEdit(ev, id, trg) {
         // Show menu
         this.MenuComponent.show(trg);
         this.$list.select(id);

         return false; // block default behavior
      }

      /**
       * @method onClickListItem
       * An item in the list is selected. So update the workspace with that
       * object.
       */
      onClickListItem(ev, id /*, trg */) {
         this.$list.select(id);
         let selectedApp = this.$list.getItem(id);
         if (selectedApp) {
            // set the common App so it is accessible for all the Applications views
            selectedApp.App = this.AB.App;

            // We've selected an Application to work with
            this.emit("view.workplace", selectedApp);
         }
         return false; // block default behavior
      }

      /**
       * @method ready
       * remove the busy indicator on our App List
       */
      ready() {
         this.$list.enable();
         if (this.$list.hideProgress) this.$list.hideProgress();
      }

      /**
       * @method refreshList
       * Apply our list of ABApplication data to our AppList
       */
      refreshList() {
         this.$list.clearAll();
         this.$list.data.unsync();
         this.$list.data.sync(this.dcEditableApplications);
         this.$list.sort("label", "asc");
         this.refreshOverlay();
         this.$list.refresh();
         this.ready();
      }

      /**
       * @method refreshOverlay
       * If we have no items in our list, display a Message.
       */
      refreshOverlay() {
         if (!this.$list.count())
            this.$list.showOverlay(L("There is no application data"));
         else this.$list.hideOverlay();
      }

      /**
       * @method show
       * Trigger our List component to show
       */
      show() {
         super.show();

         // start things off by loading the current list of Applications
         this.refresh();
      }

      templateListItem(obj, common) {
         // JAMES: here are the warning interface:
         // obj.warnings() : Returns the warning for this specific object (Application)
         //       {array} [  { message, data } ]
         //             message: {string} A description of the warning
         //             data: {obj} An object holding related data values.
         //
         // obj.warningsAll(): Like .warnings() but will return the warnings of
         //    this object and any of it's sub objects.
         //
         //
         if (!this.cacheTemplate[obj.id]) {
            var warnings = {
               icon: "",
               count: 0,
            };
            obj.warningsEval?.();
            let warningsAll = obj.warningsAll();
            if (warningsAll.length) {
               warnings.icon = this.WARNING_ICON;
               warnings.count = warningsAll.length;
            }
            this.cacheTemplate[obj.id] = `<div class='ab-app-list-item'>
   <div class='ab-app-list-info'>
      <div class='ab-app-list-name'><i class="lighten fa-fw fa ${
         obj.icon
      }"></i> ${common.iconAdmin(obj)}${obj.label ?? ""}</div>
      <div class='ab-app-list-description'>${obj.description ?? ""}</div>
   </div>
   <div class='ab-app-list-edit'>
      ${warnings.icon}
      ${common.iconGear(obj)}
   </div>
</div>`;

            setTimeout(() => {
               delete this.cacheTemplate[obj.id];
            }, 400);
         }
         return this.cacheTemplate[obj.id];
      }

      toolTipListItem(obj) {
         let issues = $$(this.ids.list)
            .data.getItem(obj.id)
            .warningsAll().length;
         return issues ? `${issues} issues` : "";
      }
   }
   return new UIChooseList();
}
