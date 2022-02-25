/*
 * ABFieldImage
 * A Property manager for our ABFieldImage.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldImage extends ABField {
      constructor() {
         super("properties_abfield_image", {
            imageWidth: "",
            imageHeight: "",
            imageContainer: "",
            defaultImageUrl: "",

            useWidth: "",
            useHeight: "",
            useDefaultImage: "",
         });
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Width") + ": ",
                     align: "right",
                     width: 60,
                  },
                  {
                     id: ids.useWidth,
                     view: "checkbox",
                     name: "useWidth",
                     width: 30,
                     value: 1,
                     click: function () {
                        if (this.getValue()) $$(ids.imageWidth).enable();
                        else $$(ids.imageWidth).disable();
                     },
                  },
                  {
                     id: ids.imageWidth,
                     view: "text",
                     name: "imageWidth",
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Height") + ": ",
                     align: "right",
                     width: 60,
                  },
                  {
                     id: ids.useHeight,
                     view: "checkbox",
                     name: "useHeight",
                     width: 30,
                     value: 1,
                     click: function () {
                        if (this.getValue()) $$(ids.imageHeight).enable();
                        else $$(ids.imageHeight).disable();
                     },
                  },
                  {
                     view: "text",
                     name: "imageHeight",
                     id: ids.imageHeight,
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Default image") + ": ",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.useDefaultImage,
                     view: "checkbox",
                     name: "useDefaultImage",
                     value: 0,
                     click: function () {
                        if (this.getValue()) $$(ids.imageContainer).enable();
                        else $$(ids.imageContainer).disable();
                     },
                  },
               ],
            },
            {
               id: ids.imageContainer,
               disabled: true,
               cols: [
                  {},
                  {
                     view: "uploader",
                     id: ids.defaultImageUrl,
                     template:
                        '<div style="text-align:center; font-size: 30px;">' +
                        '<div class="default-image-holder">' +
                        '<div class="image-data-field-icon">' +
                        '<i class="fa fa-picture-o fa-2x"></i>' +
                        `<div style="font-size: 15px;">${L(
                           "Drag and drop or click here"
                        )}</div>` +
                        "</div>" +
                        '<div class="image-data-field-image" style="display:none;">' +
                        '<a style="" class="ab-delete-photo" href="javascript:void(0);"><i class="fa fa-times delete-image" style="display:none;"></i></a>' +
                        "</div>" +
                        "</div>" +
                        "</div>",
                     apiOnly: true,
                     inputName: "file",
                     multiple: false,
                     name: "defaultImageUrl",
                     height: 105,
                     width: 150,
                     on: {
                        // when a file is added to the uploader
                        onBeforeFileAdd: function (item) {
                           // verify file type
                           const acceptableTypes = [
                              "jpg",
                              "jpeg",
                              "bmp",
                              "png",
                              "gif",
                           ];
                           const type = item.type.toLowerCase();
                           if (acceptableTypes.indexOf(type) == -1) {
                              //// TODO: multilingual
                              webix.message(
                                 "Only [" +
                                    acceptableTypes.join(", ") +
                                    "] images are supported"
                              );
                              return false;
                           }
                        },
                        // if an error was returned
                        onFileUploadError: function (item, response) {
                           AB.notify.developer(
                              new Error("Error loading image"),
                              {
                                 message: "Error loading image",
                                 response,
                              }
                           );
                        },
                     },
                  },
                  {},
               ],
            },
         ]);
      }

      urlImage(id) {
         return `/file/${id}`;
      }

      urlUpload(isWebix = true) {
         return `/file/upload/${this.CurrentObjectID}/${this._CurrentField}/${
            isWebix ? "1" : "0"
         }`;
      }
      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("image");
      }

      populate(field) {
         const ids = this.ids;
         const uploader = $$(ids.defaultImageUrl);
         const value = field.settings.defaultImageUrl;
         const isUseDefaultImage = field.settings.useDefaultImage;

         super.populate(field);

         if (field.settings.useDefaultImage) {
            $$(ids.imageContainer).enable();
         }

         if (value && isUseDefaultImage) {
            //Show default image
            uploader.attachEvent("onAfterRender", function () {
               const parentContainer = uploader.$view.querySelector(
                  ".default-image-holder"
               );
               parentContainer.querySelector(
                  ".image-data-field-icon"
               ).style.display = "none";

               const image = parentContainer.querySelector(
                  ".image-data-field-image"
               );
               image.style.display = "";
               image.style.backgroundImage = `url('/file/${value}')`;
               image.setAttribute("image-uuid", value);

               parentContainer.querySelector(".delete-image").style.display =
                  "table-cell";
            });

            uploader.$view.addEventListener("click", (e) => {
               if (e.target.className.indexOf("delete-image") > -1) {
                  const parentContainer = uploader.$view.querySelector(
                     ".default-image-holder"
                  );
                  parentContainer.querySelector(
                     ".image-data-field-icon"
                  ).style.display = "";

                  const image = parentContainer.querySelector(
                     ".image-data-field-image"
                  );
                  image.style.display = "none";
                  image.style.backgroundImage = "";
                  image.setAttribute("image-uuid", "");

                  parentContainer.querySelector(".delete-image").style.display =
                     "none";
               }
            });
         }
      }

      show() {
         const ids = this.ids;
         const url = this.urlUpload(true);

         const uploader = $$(ids.defaultImageUrl);
         uploader.config.upload = url;
         uploader.attachEvent("onFileUpload", function (file, response) {
            $$(ids.defaultImageUrl).setValue(response.data.uuid);

            const parentContainer = uploader.$view.querySelector(
               ".default-image-holder"
            );
            parentContainer.querySelector(
               ".image-data-field-icon"
            ).style.display = "none";

            const image = parentContainer.querySelector(
               ".image-data-field-image"
            );
            image.style.display = "";
            image.style.backgroundImage = `url('${this.urlImage(
               response.data.uuid
            )}')`;

            image.setAttribute("image-uuid", response.data.uuid);

            parentContainer.querySelector(".delete-image").style.display =
               "table-cell";
         });
         uploader.attachEvent("onAfterRender", function () {
            const parentContainer = uploader.$view.querySelector(
               ".default-image-holder"
            );
            parentContainer.querySelector(
               ".image-data-field-icon"
            ).style.display = "";

            const image = parentContainer.querySelector(
               ".image-data-field-image"
            );
            image.style.display = "none";
            image.style.backgroundImage = "";
            image.setAttribute("image-uuid", "");

            parentContainer.querySelector(".delete-image").style.display =
               "none";
         });
         uploader.addDropZone(uploader.$view);
         uploader.render();

         super.show();
      }

      clear() {
         const ids = this.ids;

         super.clear();

         $$(ids.useWidth).setValue(0);
         $$(ids.useHeight).setValue(0);
         $$(ids.useDefaultImage).setValue(0);

         $$(ids.imageWidth).setValue("");
         $$(ids.imageHeight).setValue("");
         $$(ids.defaultImageUrl).setValue("");
      }
   }

   return ABFieldImage;
}
