/*
 * ui_work_interface_workspace_editor_layout
 *
 * Display the workspace for showing the list of views on a page.
 *
 */
import UI_Class from "./ui_class";
// import UI_Warnings from "./ui_warnings";
import FEditorManager from "./editors/EditorManager";

export default function (AB) {
   const ibase = "ui_work_interface_workspace_editor_layout";
   // const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const EditorManager = FEditorManager(AB);

   class UI_Work_Interface_Workspace_Editor_Layout extends UIClass {
      constructor() {
         super(ibase, {
            editArea: "",
            editAreaContainer: "",
            editAreaLeft: "",
            editAreaRight: "",
            editAreaTop: "",
            editAreaBottom: "",
            editAreaSamplePopup: "",
         });

         this.CurrentViewMode = 1; // preview mode by default

         this._editorsByType = {
            /* view.key : {ViewEditorClass} */
         };
         // {hash}
         // a collection of all possible View Editors that we can display in our
         // layout editor.
      }

      // webix UI definition:
      ui() {
         let ids = this.ids;
         return {
            view: "scrollview",
            id: ids.component,
            body: {
               cols: [
                  {
                     id: ids.editAreaLeft,
                     width: 1,
                  },
                  {
                     id: ids.editAreaContainer,
                     type: "clean",
                     rows: [
                        {
                           id: ids.editAreaTop,
                           height: 1,
                        },
                        {
                           id: ids.editAreaSamplePopup,
                           view: "toolbar",
                           css: "webix_dark",
                           hidden: true,
                           cols: [
                              {},
                              {
                                 view: "label",
                                 label: L("Sample Popup"),
                              },
                              {},
                           ],
                        },
                        {
                           id: ids.editArea,
                           view: "layout",
                           borderless: true,
                           rows: [],
                           // template:'[edit Area]'
                        },
                        {
                           id: ids.editAreaBottom,
                           height: 1,
                        },
                     ],
                  },
                  {
                     id: ids.editAreaRight,
                     width: 1,
                  },
               ],
            },
         };
      }

      // setting up UI
      init(AB) {
         this.AB = AB;

         let EditArea = $$(this.ids.editArea);
         if (EditArea) webix.extend(EditArea, webix.ProgressBar);

         // get a copy of all the possible Editors by their .key
         EditorManager.editors().forEach((E) => {
            this._editorsByType[E.key] = E;
         });

         return Promise.resolve();
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
         // remove the current Editor if it exists.
         this.currentEditor?.detatch?.();

         super.viewLoad(view);
         let ids = this.ids;

         // clear edit area
         $$(ids.editArea)
            .getChildViews()
            .forEach((childView) => {
               $$(ids.editArea)?.removeView(childView);
            });

         // load the component's editor in our editArea
         var editorComponent;
         if (this.CurrentViewMode == "preview") {
            editorComponent = view.component();
            if (
               this.CurrentView.settings.type == "popup" &&
               this.CurrentView.settings.popupWidth &&
               this.CurrentView.settings.popupHeight
            ) {
               $$(ids.editAreaContainer).define({
                  width: parseInt(this.CurrentView.settings.popupWidth),
               });
               $$(ids.editArea).define({
                  height: parseInt(this.CurrentView.settings.popupHeight),
               });
               webix.html.addCss(
                  $$(ids.editAreaLeft).getNode(),
                  "preview_item"
               );
               webix.html.addCss(
                  $$(ids.editAreaRight).getNode(),
                  "preview_item"
               );
               webix.html.addCss($$(ids.editAreaTop).getNode(), "preview_item");
               webix.html.addCss(
                  $$(ids.editAreaBottom).getNode(),
                  "preview_item"
               );
               $$(ids.editAreaLeft).define({ width: 0 });
               $$(ids.editAreaRight).define({ width: 0 });
               $$(ids.editAreaTop).define({ height: 0 });
               $$(ids.editAreaBottom).define({ height: 0 });
               $$(ids.editAreaSamplePopup).show();
            } else if (
               this.CurrentView.settings.type == "page" &&
               this.CurrentView.settings.fixedPageWidth == 1 &&
               this.CurrentView.settings.pageWidth
            ) {
               $$(ids.editAreaContainer).define({
                  width: parseInt(this.CurrentView.settings.pageWidth),
               });
               $$(ids.editArea).define({ height: 0 });
               webix.html.removeCss(
                  $$(ids.editAreaLeft).getNode(),
                  "preview_item"
               );
               webix.html.removeCss(
                  $$(ids.editAreaRight).getNode(),
                  "preview_item"
               );
               webix.html.removeCss(
                  $$(ids.editAreaTop).getNode(),
                  "preview_item"
               );
               webix.html.removeCss(
                  $$(ids.editAreaBottom).getNode(),
                  "preview_item"
               );
               $$(ids.editAreaLeft).define({ width: 0 });
               $$(ids.editAreaRight).define({ width: 0 });
               $$(ids.editAreaTop).define({ height: 1 });
               $$(ids.editAreaBottom).define({ height: 1 });
               $$(ids.editAreaSamplePopup).hide();
            } else {
               $$(ids.editAreaContainer).define({ width: 0 });
               $$(ids.editArea).define({ height: 0 });
               webix.html.removeCss(
                  $$(ids.editAreaLeft).getNode(),
                  "preview_item"
               );
               webix.html.removeCss(
                  $$(ids.editAreaRight).getNode(),
                  "preview_item"
               );
               webix.html.removeCss(
                  $$(ids.editAreaTop).getNode(),
                  "preview_item"
               );
               webix.html.removeCss(
                  $$(ids.editAreaBottom).getNode(),
                  "preview_item"
               );
               $$(ids.editAreaLeft).define({ width: 1 });
               $$(ids.editAreaRight).define({ width: 1 });
               $$(ids.editAreaTop).define({ height: 1 });
               $$(ids.editAreaBottom).define({ height: 1 });
               $$(ids.editAreaSamplePopup).hide();
            }
         } else {
            let newEditor = this._editorsByType[view.key];
            if (newEditor == null) {
               newEditor = this._editorsByType["_default"];
            }

            editorComponent = new newEditor(view); // view.editorComponent(this.AB._App, "preview");
            editorComponent.viewLoad(view);
            $$(ids.editAreaContainer).define({ width: 0 });
            $$(ids.editArea).define({ height: 0 });
            webix.html.removeCss(
               $$(ids.editAreaLeft).getNode(),
               "preview_item"
            );
            webix.html.removeCss(
               $$(ids.editAreaRight).getNode(),
               "preview_item"
            );
            webix.html.removeCss($$(ids.editAreaTop).getNode(), "preview_item");
            webix.html.removeCss(
               $$(ids.editAreaBottom).getNode(),
               "preview_item"
            );
            $$(ids.editAreaLeft).define({ width: 1 });
            $$(ids.editAreaRight).define({ width: 1 });
            $$(ids.editAreaTop).define({ height: 1 });
            $$(ids.editAreaBottom).define({ height: 1 });
            $$(ids.editAreaSamplePopup).hide();
         }
         // editorComponent.ui.id = ids.editArea;
         // webix.ui(editorComponent.ui, $$(ids.editArea));
         $$(ids.editArea).addView(editorComponent.ui());
         editorComponent.init(this.AB, 2);
         // note: parentAccessLevel = 2 here in our Designer

         editorComponent.on("view.edit", (_view) => {
            // if the [edit] icon is clicked on this component:
            // tell our interface_workspace to load a new view
            this.emit("view.load", _view);
         });

         editorComponent.on("view.destroyed", (/* _view */) => {
            // if the [delete] icon is clicked on this component:
            // tell our interface_workspace to reload our CurrentView
            this.emit("view.load", this.CurrentView);
         });

         if (editorComponent.onShow) editorComponent.onShow();
         this.currentEditor = editorComponent;

         setTimeout(() => {
            $$(ids.component).adjust();
            $$(ids.editAreaContainer).adjust();
         }, 150);
      }

      /*
       * @method viewModeChange
       *
       *
       */
      viewModeChange(viewMode) {
         this.CurrentViewMode = viewMode;
      }

      busy() {
         let EditArea = $$(this.ids.editArea);
         EditArea?.disable();
         EditArea?.showProgress({ type: "icon" });
      }

      ready() {
         let EditArea = $$(this.ids.editArea);
         EditArea?.enable();
         EditArea?.hideProgress();
      }
   }

   return new UI_Work_Interface_Workspace_Editor_Layout();
}
