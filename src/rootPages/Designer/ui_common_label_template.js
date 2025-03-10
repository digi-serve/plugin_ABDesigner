/*
 * UI_Common_Label_Template
 *
 * A common Label Template builder for our various elements.
 *
 */
import UI_Class from "./ui_class";
export default function (AB, ibase) {
   ibase = ibase || "ui_common_label_template" + AB.jobID();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class UI_Common_Label_Template extends UIClass {
      constructor(base) {
         super(base, {
            // component: idBase,
            format: "",
            list: "",
            buttonSave: "",
         });

         this.labelFormat = "";
      }

      ui() {
         let ids = this.ids;

         // webix UI definition:
         return {
            view: "popup",
            id: ids.component,
            modal: true,
            autoheight: true,
            // maxHeight: 420,
            width: 500,
            body: {
               rows: [
                  {
                     view: "label",
                     label: L("<b>Label format</b>"),
                  },
                  {
                     view: "textarea",
                     id: ids.format,
                     height: 100,
                  },
                  {
                     view: "label",
                     label: L("Select field item to generate format."),
                  },
                  {
                     view: "label",
                     label: L("<b>Fields</b>"),
                  },
                  {
                     view: "list",
                     name: "columnList",
                     id: ids.list,
                     width: 500,
                     height: 180,
                     maxHeight: 180,
                     select: false,
                     template: "#label#",
                     on: {
                        onItemClick: (id, e, node) => {
                           this.onItemClick(id, e, node);
                        },
                     },
                  },
                  {
                     height: 10,
                  },
                  {
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           name: "cancel",
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.buttonCancel();
                           },
                        },
                        {
                           view: "button",
                           css: "webix_primary",
                           name: "save",
                           id: ids.buttonSave,
                           label: L("Save"),
                           type: "form",
                           autowidth: true,
                           click: () => {
                              this.buttonSave();
                           },
                        },
                     ],
                  },
               ],
            },
            on: {
               onShow: () => {
                  this.onShow();
               },
            },
         };
      }

      // for setting up UI
      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());

         webix.extend($$(this.ids.list), webix.ProgressBar);
      }

      // changed() {
      //    this.emit("changed", this._settings);
      // }

      buttonCancel() {
         $$(this.ids.component).hide();
      }

      async buttonSave() {
         var ids = this.ids;

         // disable our save button
         var ButtonSave = $$(ids.buttonSave);
         ButtonSave.disable();

         // get our current labelFormt
         var labelFormat = $$(ids.format).getValue();

         // start our spinner
         var List = $$(ids.list);
         List.showProgress({ type: "icon" });

         // convert from our User Friendly {Label} format to our
         // object friendly {Name} format
         List.data.each(function (d) {
            labelFormat = labelFormat.replace(
               new RegExp("{" + d.label + "}", "g"),
               "{" + d.id + "}"
            );
         });

         this.labelFormat = labelFormat;
         this.emit("save", labelFormat);

         List.hideProgress(); // hide the spinner
         ButtonSave.enable(); // enable the save button
         this.hide();
      }

      hide() {
         $$(this.ids.component).hide();
      }

      setLabelFormat(labelFormat) {
         this.labelFormat = labelFormat;
      }

      objectLoad(object) {
         super.objectLoad(object);

         // clear our list
         var List = $$(this.ids.list);
         List.clearAll();

         // refresh list with new set of fields
         var listFields = object
            .fields((f) => {
               return f.fieldUseAsLabel();
            })
            .map((f) => {
               return {
                  id: f.id,
                  label: f.label,
               };
            });

         List.parse(listFields);
         List.refresh();
      }

      onItemClick(id /*, e, node */) {
         var ids = this.ids;
         var selectedItem = $$(ids.list).getItem(id);
         var labelFormat = $$(ids.format).getValue();
         labelFormat += `{${selectedItem.label}}`;
         $$(ids.format).setValue(labelFormat);
      }

      onShow() {
         var ids = this.ids;

         var labelFormat = this.labelFormat;
         var Format = $$(ids.format);
         var List = $$(ids.list);

         Format.setValue("");
         Format.enable();
         List.enable();
         $$(ids.buttonSave).enable();

         // our labelFormat should be in a computer friendly {name} format
         // here we want to convert it to a user friendly {label} format
         // to use in our popup:
         if (labelFormat) {
            if (List.data?.count() > 0) {
               List.data.each(function (d) {
                  labelFormat = labelFormat.replace(
                     new RegExp(`{${d.id}}`, "g"),
                     `{${d.label}}`
                  );
               });
            }
         } else {
            // no label format:
            // Default to first field
            if (List.data?.count() > 0) {
               var field = List.getItem(List.getFirstId());
               labelFormat = `{${field.label}}`;
            }
         }

         Format.setValue(labelFormat || "");
      }

      /**
       * @function show()
       *
       * Show this component.
       * @param {obj} $view  the webix.$view to hover the popup around.
       */
      show($view) {
         $$(this.ids.component).show($view);
      }
   }

   return new UI_Common_Label_Template(ibase);
}
