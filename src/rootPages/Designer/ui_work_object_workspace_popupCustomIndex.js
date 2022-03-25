/*
 * ui_work_object_workspace_popupIndex
 *
 * Manage the Object Workspace custom index popup.
 *
 */
import UI_Class from "./ui_class";
export default function (AB, ibase) {
   ibase = ibase || "ui_work_object_workspace_popupIndex";
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   const ABIndex = AB.Class.ABIndex;

   class UI_Work_Object_Workspace_PopupIndex extends UIClass {
      /**
       * @param {object} App
       * @param {string} idBase
       */
      constructor(base) {
         super(base, {
            // component: idBase,
            popup: "",
            form: "",
            name: "",
            fields: "",
            unique: "",
            removeButton: "",
            saveButton: "",
         });
      }

      // Our webix UI definition:
      ui() {
         let ids = this.ids;

         return {
            view: "window",
            id: ids.popup,
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: L("Custom Index"),
                     css: "modal_title",
                     align: "center",
                  },
                  {
                     view: "button",
                     autowidth: true,
                     // width: 50,
                     type: "icon",
                     icon: "nomargin fa fa-times",
                     click: () => {
                        this.close();
                     },
                     on: {
                        onAfterRender() {
                           UIClass.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            position: "center",
            resize: true,
            modal: true,
            editable: false,
            width: 500,
            height: 500,
            body: {
               view: "form",
               id: ids.form,
               elements: [
                  {
                     id: ids.name,
                     view: "text",
                     label: L("Name"),
                     name: "name",
                  },
                  {
                     id: ids.fields,
                     view: "multicombo",
                     label: L("Fields"),
                     name: "fieldIDs",
                     options: [],
                  },
                  {
                     id: ids.unique,
                     view: "checkbox",
                     label: L("Unique"),
                     name: "unique",
                  },
                  {
                     cols: [
                        {
                           id: ids.removeButton,
                           view: "button",
                           type: "icon",
                           icon: "fa fa-trash-o",
                           css: "webix_danger",
                           width: 40,
                           click: () => this.removeIndex(),
                        },
                        { fillspace: true },
                        {
                           view: "button",
                           value: L("Cancel"),
                           width: 100,
                           click: () => this.close(),
                        },
                        {
                           id: ids.saveButton,
                           view: "button",
                           type: "icon",
                           icon: "fa fa-floppy-o",
                           css: "webix_primary",
                           label: L("Save"),
                           width: 100,
                           click: () => this.save(),
                        },
                     ],
                  },
               ],
            },
         };
      }

      init(AB) {
         this.AB = AB;

         webix.ui(this.ui());

         let $form = $$(this.ids.form);
         if ($form) {
            webix.extend($form, webix.ProgressBar);
         }
      }

      open(object, index) {
         this.CurrentObject = object;
         this.CurrentIndex = index;

         let ids = this.ids;
         let $popup = $$(ids.popup);
         if (!$popup) return;

         $popup.show();

         let $fields = $$(ids.fields);
         if ($fields && this.CurrentObject) {
            var allowedFields = [
               "number",
               "date",
               "datetime",
               "boolean",
               "list",
               "email",
               "user",
               "AutoIndex",
               "combined",
            ];

            let fields = this.CurrentObject.fields((f) => {
               return (
                  allowedFields.indexOf(f.key) > -1 ||
                  ((f.key == "string" || f.key == "LongText") &&
                     f.settings &&
                     !f.settings.supportMultilingual) ||
                  (f.key == "connectObject" &&
                     // 1:M
                     ((f.settings.linkType == "one" &&
                        f.settings.linkViaType == "many") ||
                        // 1:1 isSource = true
                        (f.settings.linkType == "one" &&
                           f.settings.linkViaType == "one" &&
                           f.settings.isSource)))
               );
            }).map((f) => {
               return {
                  id: f.id,
                  value: f.label,
               };
            });

            $fields.define("options", fields);
            $fields.refresh();
         }

         let $form = $$(this.ids.form);
         if ($form) {
            $form.clear();

            if (index) $form.setValues(index.toObj());
         }

         let $name = $$(ids.name);
         let $unique = $$(ids.unique);
         let $saveButton = $$(ids.saveButton);
         let $removeButton = $$(ids.removeButton);

         // Edit
         if (this.CurrentIndex) {
            $name.disable();
            $fields.disable();
            $unique.disable();
            $saveButton.hide();
            $removeButton.show();
         }
         // Add new
         else {
            $name.enable();
            $fields.enable();
            $unique.enable();
            $saveButton.show();
            $removeButton.hide();
         }
      }

      async save() {
         let $form = $$(this.ids.form);
         if (!$form) return;

         this.busy();

         let vals = $form.getValues();
         vals.fieldIDs = vals.fieldIDs.split(",");

         // Add new
         if (this.CurrentIndex == null)
            this.CurrentIndex = new ABIndex(vals, this.CurrentObject);

         // update values
         this.CurrentIndex.fromValues(vals);
         try {
            await this.CurrentIndex.save();

            this.ready();
            this.emit("changed");
            this.close();
         } catch (err) {
            let message = L("The system could not create your index.");
            switch (err.code) {
               case "ER_DUP_ENTRY":
                  message = `${message} : ${L(
                     "There are duplicated values in this column."
                  )}`;
                  break;
            }

            this.AB.notify.developer(err, {
               context: `${this.ids.component}:save()`,
               message,
               vals,
            });

            webix.alert({
               type: "alert-error",
               title: L("Failed"),
               text: message,
            });
            this.ready();
         }
      }

      close() {
         let $popup = $$(this.ids.popup);
         if (!$popup) return;
         $popup.hide();
      }

      busy() {
         $$(this.ids.form)?.showProgress?.({ type: "icon" });
         $$(this.ids.saveButton)?.disable();
         $$(this.ids.removeButton)?.disable();
      }

      ready() {
         $$(this.ids.form)?.hideProgress?.();
         $$(this.ids.saveButton)?.enable();
         $$(this.ids.removeButton)?.enable();
      }

      removeIndex() {
         if (!this.CurrentIndex) return;

         webix.confirm({
            title: L("Delete this Index"),
            message: L("Do you want to remove this index ?"),
            callback: async (isOK) => {
               if (isOK) {
                  this.busy();

                  try {
                     await this.CurrentIndex.destroy();
                     this.ready();
                     this.emit("changed");
                     this.close();
                  } catch (err) {
                     this.AB.notify.developer(err, {
                        context: `${this.ids.component}:removeIndex()`,
                        ABIndex: this.CurrentIndex.toObj(),
                     });
                     this.ready();
                  }
               }
            },
         });
      }
   }

   return new UI_Work_Object_Workspace_PopupIndex(ibase);
}
