/*
 * ABViewDocxBuilder
 * A Property manager for our ABViewDocxBuilder definitions
 */
import FABView from "./ABView";

export default function (AB) {
   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   let ABViewDocxBuilderPropertyComponentDefaults = {};

   const base = "properties_abview_docxBuilder";

   class ABViewDocxBuilderProperty extends ABView {
      constructor() {
         super(base, {
            // Put our ids here
            buttonlabel: "",
            buttonPosition: "",
            datacollection: "",
            docxFile: "",
            docxDownload: "",
            filelabel: "",
            language: "",
            toolbarBackground: "",
            width: 0,
         });

         this.AB = AB;
         ABViewDocxBuilderPropertyComponentDefaults =
            this.AB.Class.ABViewManager.viewClass(
               "docxBuilder"
            ).defaultValues();
      }

      static get key() {
         return "docxBuilder";
      }

      ui() {
         //  const ids = this.ids;

         // Populate language options
         const langOptions = this.AB.Multilingual.languages().map((lang) => {
            return {
               id: lang.language_code,
               value: lang.language_label,
            };
         });

         // docxFile: "",
         // docxDownload: "",
         // toolbarBackground: "",
         // width: 0,

         return super.ui([
            {
               view: "fieldset",
               label: L("Data:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: this.ids.datacollection,
                        name: "datacollection",
                        view: "richselect",
                        // view: "multicombo",
                        label: L("Data Source"),
                        labelWidth: uiConfig.labelWidthLarge,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },

            {
               view: "fieldset",
               label: L("Template file:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("DOCX file:"),
                              css: "ab-text-bold",
                              width: uiConfig.labelWidthXLarge,
                           },
                           {
                              id: this.ids.docxFile,
                              view: "uploader",
                              value: L("Upload"),
                              name: "docxFile",
                              apiOnly: true,
                              inputName: "file",
                              multiple: false,
                              on: {
                                 onBeforeFileAdd: (item) => {
                                    return this.validateType(item);
                                 },

                                 onFileUpload: (file, response) => {
                                    this.uploadedFile(file);
                                 },

                                 onFileUploadError: (file, response) => {},
                              },
                           },
                        ],
                     },
                     {
                        id: this.ids.filelabel,
                        name: "filelabel",
                        view: "text",
                        label: L("Filename"),
                        labelWidth: uiConfig.labelWidthLarge,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                     {
                        id: this.ids.docxDownload,
                        name: "docxDownload",
                        view: "button",
                        type: "icon",
                        css: "webix_primary",
                        icon: "fa fa-file-word-o",
                        label: L("Download Template File"),
                        click: () => {
                           this.downloadFile();
                        },
                     },
                  ],
               },
            },

            {
               view: "fieldset",
               label: L("Language:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: this.ids.language,
                        name: "language",
                        view: "richselect",
                        label: L("Language"),
                        labelWidth: uiConfig.labelWidthLarge,
                        options: langOptions,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },

            {
               view: "fieldset",
               label: L("Customize Display:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: this.ids.buttonlabel,
                        name: "buttonlabel",
                        view: "text",
                        label: L("Label"),
                        labelWidth: uiConfig.labelWidthXLarge,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },

                     {
                        id: this.ids.width,
                        view: "counter",
                        name: "width",
                        label: L("Width:"),
                        labelWidth: uiConfig.labelWidthXLarge,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                     {
                        id: this.ids.toolbarBackground,
                        view: "richselect",
                        name: "toolbarBackground",
                        label: L("Page background:"),
                        labelWidth: uiConfig.labelWidthXLarge,
                        options: [
                           {
                              id: "ab-background-default",
                              value: L("White (default)"),
                           },
                           {
                              id: "webix_dark",
                              value: L("Dark"),
                           },
                           {
                              id: "ab-background-lightgray",
                              value: L("Gray"),
                           },
                        ],
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },

                     {
                        id: this.ids.buttonPosition,
                        view: "richselect",
                        name: "buttonPosition",
                        label: L("Button Position:"),
                        labelWidth: uiConfig.labelWidthXLarge,
                        options: [
                           {
                              id: "left",
                              value: L("Left (default)"),
                           },
                           {
                              id: "center",
                              value: L("Centered"),
                           },
                           {
                              id: "right",
                              value: L("Right"),
                           },
                        ],
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                  ],
               },
            },
         ]);
      }

      populate(view) {
         super.populate(view);
         if (!view) return;

         const ids = this.ids;

         const $DcSelector = $$(ids.datacollection);

         const selectedDvId = view.settings.dataviewID ?? null;

         $$(ids.toolbarBackground).setValue(
            view.settings.toolbarBackground ??
               ABViewDocxBuilderPropertyComponentDefaults.toolbarBackground
         );
         $$(ids.buttonPosition).setValue(
            view.settings.buttonPosition ??
               ABViewDocxBuilderPropertyComponentDefaults.buttonPosition
         );

         // Pull data views to options
         const dcOptions = view.application
            .datacollectionsIncluded()
            .map((dc) => {
               return {
                  id: dc.id,
                  value: dc.label,
                  icon:
                     dc.sourceType === "query"
                        ? "fa fa-filter"
                        : "fa fa-database",
               };
            });

         $DcSelector.define("options", dcOptions);
         $DcSelector.define("value", selectedDvId);
         $DcSelector.refresh();

         $$(ids.language).setValue(
            view.settings.language ??
               ABViewDocxBuilderPropertyComponentDefaults.language
         );

         $$(ids.filelabel).setValue(view.filelabel ?? view.settings.filelabel);
         $$(ids.buttonlabel).setValue(
            view.buttonlabel ?? view.settings.buttonlabel
         );
         $$(ids.width).setValue(view.settings.width);

         if (view.settings.filename) {
            $$(ids.docxDownload).show();
         } else {
            $$(ids.docxDownload).hide();
         }
      }

      defaultValues() {
         let values = {};
         const ViewClass = this.ViewClass();
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
         let vals = super.values();

         vals.settings = vals.settings ?? {};
         vals.settings.buttonlabel = $$(ids.buttonlabel).getValue();
         vals.settings.dataviewID = $$(ids.datacollection).getValue();
         vals.settings.width = $$(ids.width).getValue();
         vals.filelabel = $$(ids.filelabel).getValue();
         vals.settings.language = $$(ids.language).getValue();
         vals.settings.toolbarBackground = $$(ids.toolbarBackground).getValue();
         vals.settings.buttonPosition = $$(ids.buttonPosition).getValue();

         return vals;
      }

      /**
       * @method ViewClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("docxBuilder");
      }

      validateType(item) {
         const ids = this.ids;

         // verify file type
         const acceptableTypes = ["docx"];
         const type = item.type.toLowerCase();
         if (acceptableTypes.indexOf(type) == -1) {
            this.AB.Webix.message(
               L(`Only [${acceptableTypes.join(", ")}] files are supported`)
            );
            return false;
         } else {
            // set upload url to uploader
            const currView = this.CurrentView;
            const uploadUrl = currView.uploadUrl();

            $$(ids.docxFile).define("upload", uploadUrl);
            $$(ids.docxFile).refresh();

            return true;
         }
      }

      uploadedFile(fileInfo) {
         if (!fileInfo || !fileInfo.data) return;

         const ids = this.ids;
         let currView = this.CurrentView;
         currView.settings.filename = fileInfo.data.uuid;
         currView.filelabel = fileInfo.name;

         $$(ids.filelabel).setValue(currView.filelabel);
         $$(ids.docxDownload).show();
      }

      downloadFile() {
         const currView = this.CurrentView;
         const url = currView.downloadUrl();

         fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
               currView.letUserDownload(blob, currView.filelabel);
            });
      }
   }

   return ABViewDocxBuilderProperty;
}
