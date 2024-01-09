/**
 * ABViewContainerEditor
 * The widget that displays the UI Editor Component on the screen
 * when designing the UI.
 */
var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import UI_Class from "../../ui_class";

export default function (AB) {
   if (!myClass) {
      // const uiConfig = AB.Config.uiSettings();
      const UIClass = UI_Class(AB);
      var L = UIClass.L();

      myClass = class ABViewContainerEditor extends UIClass {
         static get key() {
            return "viewcontainer";
         }

         constructor(view, base = "interface_editor_viewcontainer", ids = {}) {
            // base: {string} unique base id reference
            // ids: {hash}  { key => '' }
            // this is provided by the Sub Class and has the keys
            // unique to the Sub Class' interface elements.

            var common = {
               label: "",
            };

            Object.keys(ids).forEach((k) => {
               if (typeof common[k] != "undefined") {
                  console.error(
                     `!!! ABFieldProperty:: passed in ids contains a restricted field : ${k}`
                  );
                  return;
               }
               common[k] = "";
            });

            super(base, common);

            this.view = view;
            this.settings = view.settings;
            // shortcut to reference the settings

            this.viewLoad(view);

            this.base = base;
            this.AB = AB;

            this.subComponents = {
               /* viewId: viewComponent */
            };

            this.cellHeight = 250;
            // {int}
            // default height of this editor component in our editing area.
         }

         ui() {
            let key = ABViewContainerEditor.key;
            let Defaults =
               AB.Class.ABViewManager.viewClass(key).defaultValues();
            return {
               rows: [
                  {
                     id: this.ids.component,
                     view: "dashboard",
                     css: `ab-${key}-container`,
                     cellHeight: this.cellHeight,
                     gridColumns: this.settings.columns || Defaults.columns,
                  },
               ],
            };
         }

         init(AB) {
            var Dashboard = $$(this.ids.component);
            if (Dashboard) {
               webix.extend(Dashboard, webix.OverlayBox);
               webix.extend(Dashboard, webix.ProgressBar);
            }

            // this.views().reverse().forEach((child) => {

            // NOTE: need to sorting before .addView because there is a render position bug in webix 5.1.7
            // https://webix.com/snippet/404cf0c7
            var childViews = this.CurrentView.viewsSortByPosition();

            // attach all the .UI views:
            childViews.forEach((child) => {
               child.warningsSilent = true;
               // let's not be alerted to unconfigured settings in this context

               // console.error("TODO: REMOVE THIS TESTING CODE:");
               // if (!child.componentOld) return;

               let component;
               try {
                  component = child.component();
               } catch (err) {
                  // WORKAROUND: compatible old versions
                  component = child.component(this.AB._App);
                  let ui = component.ui;
                  component.ui = (() => ui).bind(component);
               }

               // store
               this.subComponents[child.id] = component;

               let view = "panel";
               if (child.settings.movable == false) view = "scrollview";

               Dashboard.addView({
                  view: view,

                  // specific viewId to .name, it will be used to save view position
                  name: child.id,
                  icon: "fa fa-arrows",
                  css: "ab-widget-container",
                  body: {
                     rows: [
                        {
                           view: "template",
                           height: 30,
                           css: "ab-widget-header",
                           template: this.template(child),
                           onClick: {
                              "ab-component-edit": (e, id, trg) => {
                                 this.viewEdit(e, child.id, trg);
                              },
                              "ab-component-remove": (e, id, trg) => {
                                 this.viewDelete(e, child.id, trg);
                              },
                           },
                        },
                        component.ui(),
                        // (mode == 'preview' ? component.ui : {
                        //    // empty element
                        //    view: 'spacer',
                        //    hidden: true,
                        // })
                     ],
                  },

                  // dx: _logic.validatePosition(child.position.dx, 1, Dashboard.config.gridColumns),
                  // dy: _logic.validatePosition(child.position.dy, 1, Dashboard.config.gridRows),

                  dx: child.position.dx || 1,
                  dy: child.position.dy || 1,
                  x: this.validatePosition(
                     child.position.x,
                     0,
                     Dashboard.config.gridColumns - 1
                  ),
                  y: child.position.y || 0,
               });

               // initial sub-component
               component.init(AB, 2); // when in editor allow full access
            });

            // listen onChange event
            // NOTE: listen after populate views by .addView
            if (this._onChangeId) Dashboard.detachEvent(this._onChangeId);
            this._onChangeId = Dashboard.attachEvent("onChange", () => {
               this.onReorder();
            });

            // show "drop here" panel
            this.showEmptyPlaceholder();

            Dashboard.adjust();
         } // init()

         /**
          * @method detatch()
          * Make sure we and any of our child components remove any
          * active listeners on objects.
          */
         detatch() {
            Object.keys(this.subComponents).forEach((k) => {
               this.subComponents[k]?.detatch?.();
            });

            var Dashboard = $$(this.ids.component);
            if (Dashboard) {
               if (this._onChangeId) Dashboard.detachEvent(this._onChangeId);
            }
         }

         /**
          * @method busy()
          * Display a progress in action icon
          */
         busy() {
            let Dashboard = $$(this.ids.component);
            Dashboard?.disable();
            Dashboard?.showProgress({ type: "icon" });
         }

         /**
          * @method onReorder()
          * Attempt to encode the current layout order among all our
          * child views.
          */
         async onReorder() {
            this.busy();

            var Dashboard = $$(this.ids.component);

            // ignore in "preview" mode
            // if (Dashboard == null || Dashboard.config.view != "dashboard") return;

            var viewState = Dashboard.serialize();

            var allViewUpdates = [];

            // save view position state to views
            this.CurrentView.views().forEach((v) => {
               var state = viewState.filter((vs) => vs.name == v.id)[0];
               if (state) {
                  v.position.x = state.x;
                  v.position.y = state.y;

                  // validate position data
                  if (v.position.x < 0) v.position.x = 0;
                  if (v.position.y < 0) v.position.y = 0;

                  allViewUpdates.push(v.save());
               }
            });

            try {
               // save template layout
               // this.saveReorder()
               await Promise.all(allViewUpdates);

               await this.CurrentView.save();

               this.ready();
            } catch (err) {
               this.AB.notify.developer(err, {
                  message: "Error trying to save selected View:",
                  view: this.CurrentView.toObj(),
               });
               this.ready();
            }
         }

         onShow() {
            let hasTextComponent = false;
            this.CurrentView.views().forEach((v) => {
               if (v.key === "text") hasTextComponent = true;
               var component = this.subComponents[v.id];
               component?.onShow?.();
            });
            if (hasTextComponent) this.initTinyMCE();

            let dc = this.CurrentView.datacollection;
            if (dc && dc.dataStatus == dc.dataStatusFlag.notInitial) {
               // load data when a widget is showing
               dc.loadData();
            }
         }

         /**
          * @method ready()
          * Remove the progress in action icon.
          */
         ready() {
            let Dashboard = $$(this.ids.component);
            Dashboard?.enable();
            Dashboard?.hideProgress();
         }

         /**
          * @method showEmptyPlaceholder()
          * Display the message to drop a new widget here to the UI
          * when there are no child views.
          */
         showEmptyPlaceholder() {
            var Dashboard = $$(this.ids.component);

            // if we don't have any views, then place a "drop here" placeholder
            if (Dashboard.getChildViews().length == 0) {
               Dashboard.showOverlay(
                  "<div class='drop-zone'><div>" +
                     L("Add Widgets Here") +
                     "</div></div>"
               );
            }
         }

         /**
          * @method template()
          * render the list template for the View
          * @param {obj} obj the current View instance
          * @param {obj} common  Webix provided object with common UI tools
          */
         template(child) {
            let warnText = "";
            if ((child.warningsAll() || []).length > 0) {
               warnText = this.WARNING_ICON;
            }
            return `<div>
               <i class="fa fa-${child.icon} webix_icon_btn"></i> ${child.label}
               <div class="ab-component-tools">
               ${warnText}${
               child.settings.removable == false
                  ? ""
                  : '<i class="fa fa-trash ab-component-remove"></i>'
            }
               <i class="fa fa-edit ab-component-edit"></i>
               </div></div>`;
         }

         /**
          * @method validatePosition
          * ensure the given position is within the specified bounds.
          * @param {int} curPosition
          * @param {int} minPosition
          * @param {int} maxPosition
          */
         validatePosition(curPosition, minPosition, maxPosition) {
            if (curPosition < minPosition) return minPosition;
            if (curPosition > maxPosition) return maxPosition;
            else return curPosition;
         }

         /**
          * @method viewDelete()
          * Called when the [delete] icon for a child View is clicked.
          * @param {obj} e the onClick event object
          * @param {integer} id the id of the element to delete
          * @param {obj} trg  Webix provided object
          */
         viewDelete(e, id /*, trg */) {
            var deletedView = this.CurrentView.views((v) => v.id == id)[0];
            if (!deletedView) return false;

            webix.confirm({
               title: L("Delete component"),
               text: L("Do you want to delete <b>{0}</b>?", [
                  deletedView.label,
               ]),
               callback: async (result) => {
                  if (!result) return;
                  // let Dashboard = $$(ids.component);

                  // // remove UI of this component in template
                  // var deletedElem = Dashboard.queryView({ name: id });
                  // if (deletedElem) {

                  //    // store the removed view to signal event in .onChange
                  //    this.__deletedView = deletedView;

                  //    // remove view
                  //    var remainingViews = this.views((v) => { return v.id != deletedView.id; })
                  //    this._views = remainingViews;

                  //    // this calls the remove REST to API server
                  //    Dashboard.removeView(deletedElem);
                  // }

                  this.busy();

                  try {
                     await deletedView.destroy();

                     // signal the current view has been deleted.
                     deletedView.emit("destroyed", deletedView);
                     this.emit("view.destroyed", deletedView);

                     let Dashboard = $$(this.ids.component);

                     // Update UI
                     var deletedElem = Dashboard.queryView({ name: id });
                     if (deletedElem) {
                        Dashboard.blockEvent();
                        Dashboard.removeView(deletedElem);
                        Dashboard.unblockEvent();
                     }

                     this.showEmptyPlaceholder();
                  } catch (err) {
                     this.AB.notify.developer(err, {
                        message: "Error trying to delete selected View:",
                        view: deletedView,
                     });
                  }

                  this.ready();
               },
            });
            e.preventDefault();
         } // viewDelete()

         /**
          * @method viewEdit()
          * Called when the [edit] icon for a child View is clicked.
          * @param {obj} e the onClick event object
          * @param {integer} id the id of the element to edit
          * @param {obj} trg  Webix provided object
          */
         viewEdit(e, id /*, trg */) {
            var view = this.CurrentView.views((v) => v.id == id)[0];

            if (!view) return false;

            // NOTE: let webix finish this onClick event, before
            // calling .populateInterfaceWorkspace() which will replace
            // the interface elements with the edited view.  (apparently
            // that causes errors.)
            setTimeout(() => {
               // App.actions.populateInterfaceWorkspace(view);
               try {
                  this.emit("view.edit", view);
               } catch (err) {
                  console.error(err);
               }
            }, 15);

            e.preventDefault();

            return false;
         }
         /**
          * Ensure TinyMCE has been loaded and initialized.
          */
         async initTinyMCE() {
            await this.AB.custom["tinymce-editor"].init();
         }
      };
   }

   return myClass;
}
