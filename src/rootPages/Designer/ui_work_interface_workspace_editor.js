/*
 * ui_work_interface_workspace_editor
 *
 * Display the form for creating a Page/View.
 *
 */

import UI_Class from "./ui_class";
// import UI_Warnings from "./ui_warnings";

import ABComponentMenu from "./ui_work_interface_workspace_editor_components";
import ABEditorLayout from "./ui_work_interface_workspace_editor_layout";

export default function (AB) {
   const ibase = "ui_work_interface_workspace_editor";
   // const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   var ComponentMenu = ABComponentMenu(AB);
   var EditorLayout = ABEditorLayout(AB);

   class UI_Work_Interface_Workspace_Editor extends UIClass {
      constructor() {
         super(ibase, {
            toolbar: "",
            toolbarMap: "",
            toolbarViewMode: "",
            toolbarViewPage: "",

            layoutView: "",
            dataView: "",

            noContent: "",
         });

         this.CurrentViewPart = "layout";

         this.CurrentViewMode = 0;
         // {int} 1/0
         // Indicates if we are in "Preview" mode or not.
         // 1 = Preview Mode
         // 0 = Edit Mode

         this.PreviousViews = [];

         this._handlerViewUpdate = () => {
            this.viewLoad(this.CurrentView);
         };
      }

      // webix UI definition:
      ui() {
         let ids = this.ids;

         return {
            id: ids.component,
            view: "layout",
            borderless: false,
            rows: [
               {
                  id: ids.toolbar,
                  view: "toolbar",
                  css: "ab-data-toolbar webix_dark",
                  cols: [
                     // {
                     //     view: 'label',
                     //     id: ids.toolbarMap,
                     //     label: '[view map]'
                     // },
                     {
                        view: "button",
                        type: "icon",
                        icon: "fa fa-arrow-left",
                        autowidth: true,
                        click: () => {
                           this.buttonBack();
                        },
                     },
                     {
                        id: ids.toolbarMap,
                        view: "list",
                        layout: "x",
                        borderless: true,
                        multiselect: false,
                        select: false,
                        scroll: false,
                        padding: 0,
                        css: "ab_breadcrumb",
                        template: function (item) {
                           return (
                              '<span class="fa fa-chevron-right" aria-hidden="true"></span> ' +
                              // '<i class="fa fa-#icon#" aria-hidden="true"></i> '.replace('#icon#', item.icon) +
                              item.label
                           );
                        },
                        on: {
                           onItemClick: (id /*, e, node */) => {
                              this.pageMap(id);
                           },
                        },
                     },
                     {
                        view: "icon",
                        icon: "fa fa-info-circle",
                        tooltip: L(
                           'Check "Preview" to see what your layout will look like, Click "Add Widget" to add new items to the page.'
                        ),
                        on: {
                           onItemClick: () => {
                              this.infoAlert();
                           },
                        },
                     },
                  ],
               },
               {
                  view: "layout",
                  type: "space",
                  css: "gray",
                  cols: [
                     {
                        id: ids.toolbarViewMode,
                        view: "checkbox",
                        labelRight: L("Preview"),
                        labelWidth: 0,
                        width: 85,
                        on: {
                           onChange: (newValue, oldValue) => {
                              this.viewModeChange(newValue, oldValue);
                           },
                        },
                     },
                     {},
                     ComponentMenu.ui(),
                  ],
               },
               EditorLayout.ui(),
            ],
         };
      }

      // setting up UI
      init(AB) {
         this.AB = AB;

         var allInits = [];

         //// TODO: save the last CurrentViewMode in the workspace data and use that here:
         $$(this.ids.toolbarViewMode).setValue(this.CurrentViewMode);

         allInits.push(EditorLayout.init(AB));
         allInits.push(ComponentMenu.init(AB));

         ComponentMenu.on("widget.adding", () => {
            EditorLayout.busy();
         });
         ComponentMenu.on("widget.add", () => {
            this.viewLoad(this.CurrentView);
            EditorLayout.ready();
         });

         return Promise.all(allInits);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Interface Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         //  InterfaceWorkspace.clearInterfaceWorkspace();
         EditorLayout.applicationLoad(application);
         ComponentMenu.applicationLoad(application);
      }

      buttonBack() {
         if (this.PreviousViews.length > 0) {
            var view = this.PreviousViews.pop();

            // reset view part to 'layout'
            this.CurrentViewPart = "layout";

            this.emit("view.load", view);
         }
         // Switch from 'data' to 'layout' mode
         else if (this.CurrentViewPart == "data") {
            // reset view part to 'layout'
            this.CurrentViewPart = "layout";

            this.emit("view.load", this.CurrentView);
         }
      }

      pageMap(pageId) {
         var clickedView = $$(this.ids.toolbarMap).getItem(pageId);

         // reset view part to 'layout'
         this.CurrentViewPart = "layout";

         this.emit("view.load", clickedView);
      }

      // buttonCancel:function() {

      // },

      // buttonSave: function() {

      // },

      infoAlert() {
         webix.alert({
            title: L("Tip"),
            text: L(
               'Check "Preview" to see what your layout will look like, Click "Add Widget" to add new items to the page.'
            ),
         });
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      /*
       * @method viewLoad
       * A new View has been selected for editing, so update
       * our interface with the details for this View.
       * @param {ABView} view  current view instance.
       */
      viewLoad(view) {
         // store the current view to return here on [back] button.
         if (this.CurrentView) {
            // don't keep storing the same view over and over:
            if (view && view.id != this.CurrentView.id) {
               this.PreviousViews.push(this.CurrentView);

               // TODO: make this a setting?
               // limit the number of views we store in our list.
               // ## lets not be memory hogs.
               if (this.PreviousViews.length > 50) {
                  this.PreviousViews.shift();
               }
            }
         }

         super.viewLoad(view);

         // try to make sure we don't continually add up listeners.
         this.CurrentView.removeListener(
            "properties.updated",
            this._handlerViewUpdate
         ).once("properties.updated", this._handlerViewUpdate);

         // update the toolbar navigation map
         let $tbMap = $$(this.ids.toolbarMap);
         $tbMap.clearAll();
         $tbMap.parse(view.allParents());
         $tbMap.refresh();

         EditorLayout.viewLoad(view);
         EditorLayout.show();

         ComponentMenu.viewLoad(view);
         ComponentMenu.show();
      }

      viewModeChange(newV, oldV) {
         if (newV == oldV) return;

         if (newV == 1) {
            newV = "preview";
         } else {
            newV = "block";
         }
         this.CurrentViewMode = newV;

         // pass view mode to the 'layout' view
         EditorLayout.viewModeChange(this.CurrentViewMode);

         if (this.CurrentView) {
            this.viewLoad(this.CurrentView);
         }
      }
   }

   return new UI_Work_Interface_Workspace_Editor();
}
