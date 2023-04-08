/*
 * ABViewImage
 * A Property manager for our ABViewImage definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_image";

   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   class ABViewLabelProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            width: "",
            height: "",
         });
         // this.AB = AB;
      }

      static get key() {
         return "image";
      }

      ui() {
         const defaultValues = this.defaultValues();
         const ids = this.ids;

         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Image:"),
                     css: "ab-text-bold",
                     width: uiConfig.labelWidthXLarge,
                  },
                  {
                     view: "uploader",
                     value: L("Upload image"),
                     name: "file",
                     apiOnly: true,
                     inputName: "image",
                     multiple: false,
                     accept:
                        "image/png, image/gif, image/jpeg, image/jpg, image/bmp",
                     // Image field
                     upload: `/image/upload/1`,
                     on: {
                        // onBeforeFileAdd: (item) => {
                        //    // verify file type
                        //    let acceptableTypes = [
                        //       "jpg",
                        //       "jpeg",
                        //       "bmp",
                        //       "png",
                        //       "gif",
                        //    ];
                        //    let type = item.type.toLowerCase();
                        //    if (acceptableTypes.indexOf(type) == -1) {
                        //       webix.message(
                        //          L("Only [{0}] images are supported", [
                        //             acceptableTypes.join(", "),
                        //          ])
                        //       );
                        //       return false;
                        //    } else {
                        //       // set upload url to uploader
                        //       var currView = _logic.currentEditObject();
                        //       let actionKey = `opstool.AB_${currView.application.name.replace(
                        //          "_",
                        //          ""
                        //       )}.view`;
                        //       let url = `/image/upload/1`;

                        //       $$(ids.file).define("upload", url);
                        //       $$(ids.file).refresh();

                        //       return true;
                        //    }
                        // },

                        onFileUpload: (fileInfo /*, response */) => {
                           if (!fileInfo || !fileInfo.data) return;

                           this.filename = fileInfo.data.uuid;

                           // get width & height of images
                           if (fileInfo.file) {
                              let img = new Image();
                              img.onload = function () {
                                 $$(ids.width).setValue(img.width);
                                 $$(ids.height).setValue(img.height);
                              };
                              img.src = URL.createObjectURL(fileInfo.file);
                           }

                           // trigger a save()
                           this.onChange();
                        },

                        onFileUploadError: (file, response) => {},
                     },
                  },
               ],
            },
            {
               id: ids.width,
               view: "counter",
               name: "width",
               label: L("Width:"),
               labelWidth: uiConfig.labelWidthXLarge,
               on: {
                  onChange: (newVal, oldVal) => {
                     if (newVal == oldVal) return;

                     if (this._saveTimeout) {
                        clearTimeout(this._saveTimeout);
                     }
                     this._saveTimeout = setTimeout(() => {
                        this._saveTimeout = null;
                        this.onChange();
                     }, 1000);
                  },
               },
            },
            {
               id: ids.height,
               view: "counter",
               name: "height",
               label: L("Height:"),
               labelWidth: uiConfig.labelWidthXLarge,
               on: {
                  onChange: (newVal, oldVal) => {
                     if (newVal == oldVal) return;

                     if (this._saveTimeout) {
                        clearTimeout(this._saveTimeout);
                     }
                     this._saveTimeout = setTimeout(() => {
                        this._saveTimeout = null;
                        this.onChange();
                     }, 1000);
                  },
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;
         await super.init(AB);
      }

      populate(view) {
         super.populate(view);

         this.filename = view.settings.filename;

         const ids = this.ids;

         let $w = $$(ids.width);
         $w.blockEvent();
         $w.setValue(view.settings.width);
         $w.unblockEvent();

         let $h = $$(ids.height);
         $h.blockEvent();
         $h.setValue(view.settings.height);
         $h.unblockEvent();
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
         const values = super.values();

         values.settings = values.settings || {};
         values.settings.filename = this.filename;
         values.settings.width = $$(ids.width).getValue();
         values.settings.height = $$(ids.height).getValue();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("label");
      }
   }

   return ABViewLabelProperty;
}
