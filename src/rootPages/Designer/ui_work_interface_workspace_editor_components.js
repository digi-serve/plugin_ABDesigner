/*
 * ui_work_interface_workspace_editor_components
 *
 * Display the menu for creating a new Widget.
 *
 */
import UI_Class from "./ui_class";

export default function (AB) {
   const ibase = "ui_work_interface_workspace_editor_components";
   // const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Interface_Workspace_Editor_Components extends UIClass {
      constructor() {
         super(ibase, {
            popup: "",
            list: "",
         });
      }

      // webix UI definition:
      ui() {
         return {
            id: this.ids.component,
            css: "webix_primary",
            view: "button",
            type: "form",
            label: L("Add Widget"),
            align: "center",
            autowidth: true,
            on: {
               onItemClick: (/* id, e */) => {
                  this.showPopup();
               },
            },
         };
      }

      // setting up UI
      init(AB) {
         this.AB = AB;
         let ids = this.ids;
         let _this = this;

         webix.ui({
            view: "window",
            id: ids.popup,
            modal: true,
            width: 600,
            height: 550,
            select: false,
            resize: true,
            position: "center",
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Add Widget"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     label: "Close",
                     autowidth: true,
                     align: "center",
                     click: () => {
                        this.hidePopup();
                     },
                  },
               ],
            },
            body: {
               id: ids.list,
               view: "dataview",
               css: "ab-datacollection-table borderless",
               borderless: true,
               xCount: 5, //the number of items in a row
               yCount: 4, //the number of items in a column
               type: {
                  borderless: true,
                  width: 100,
                  height: 100,
               },
               template: (obj, common) => {
                  return this.template(obj, common);
               },
               on: {
                  onItemClick: function (id /*, e, node */) {
                     var component = this.getItem(id);
                     _this.addWidget(component);
                  },
               },
            },
         });
      }

      // internal business logic

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      /**
       * @function hide()
       *
       * Hide this component.
       */
      hide() {
         $$(this.ids.component).hide();
      }

      showPopup() {
         $$(this.ids.popup).show();
      }

      hidePopup() {
         $$(this.ids.popup).hide();
      }

      /**
       * @function addWidget()
       *
       * @param component {ABView} - new component
       */
      addWidget(component) {
         const newComp = component.newInstance(
            this.CurrentView.application,
            this.CurrentView
         );

         // show loading cursor
         this.emit("widget.adding");

         // CurrentView.viewSave(newComp)
         newComp.save().then(() => {
            // callback to parent
            // hide loading cursor
            this.emit("widget.add");

            // signal that something has changed and our
            // warnings should be re-evaluated
            this.emit("warnings");
         });

         this.hidePopup();
      }

      /**
       * @function template()
       * compile the template for each item in the list.
       */
      template(obj /* , common */) {
         // if this is one of our ABViews:
         if (obj.common) {
            // see if a .label field is present
            var label = obj.common().label;

            // if not, then pull a multilingual field:
            if (!label) {
               label = L(obj.common().labelKey);
            }

            return `<div class='ab-component-in-page'><i class='fa fa-2x fa-${
               obj.common().icon
            }' aria-hidden='true'></i><br/>${label}</div>`;
         } else {
            // maybe this is simply the "No Components" placeholder
            return obj.label;
         }
      }

      /*
       * @method viewLoad
       * A new View has been selected for editing, so update
       * our interface with the components allowed for this View.
       * @param {ABView} view  current view instance.
       */
      viewLoad(view) {
         super.viewLoad(view);
         let ids = this.ids;

         var List = $$(ids.list);
         var Menu = $$(ids.component);

         var components = this.CurrentView.componentList();

         List.clearAll();

         if (components && components.length > 0) {
            List.parse(components);
            Menu.show();
         } else {
            Menu.hide();
         }

         List.refresh();
      }
   }

   return new UI_Work_Interface_Workspace_Editor_Components();
}
