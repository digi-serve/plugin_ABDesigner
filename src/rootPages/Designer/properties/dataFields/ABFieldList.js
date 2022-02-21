/*
 * ABFieldList
 * A Property manager for our ABFieldList.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   // const uiConfig = AB.Config.uiSettings();

   const ABField = FFieldClass(AB);
   const L = ABField.L();

   const ABFieldSelectivity = AB.Class.ABFieldManager.fieldByKey("selectivity");

   /**
    * ABFieldListProperty
    *
    * Defines the UI Component for this Data Field.  The ui component is responsible
    * for displaying the properties editor, populating existing data, retrieving
    * property values, etc.
    */
   class ABFieldListProperty extends ABField {
      constructor() {
         super("properties_abfield_list", {
            isMultiple: "",
            hasColors: "",
            default: "",
            multipleDefault: "",
            options: "",
            colorboard: "",
         });

         this.colors = [
            ["#F44336", "#E91E63", "#9C27B0", "#673AB7"],
            ["#3F51B5", "#2196F3", "#03A9F4", "#00BCD4"],
            ["#009688", "#4CAF50", "#8BC34A", "#CDDC39"],
            ["#FFEB3B", "#FFC107", "#FF9800", "#FF5722"],
            ["#795548", "#9E9E9E", "#607D8B", "#000000"],
         ];
         // {array}
         // contains the color hex definitions of the list options when they
         // are displayed.

         this._originalOptions = [];
         // {array} [ option.id, ... ]
         // An array of the original options definitions before editing
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "checkbox",
               name: "isMultiple",
               disallowEdit: true,
               id: ids.isMultiple,
               labelRight: L("Multiselect"),
               labelWidth: 0,
               value: false,
               on: {
                  onChange: (newV /* , oldV */) => {
                     if (newV == true) {
                        $$(ids.default).hide();
                        $$(ids.multipleDefault).show();
                     } else {
                        $$(ids.default).show();
                        $$(ids.multipleDefault).hide();
                     }

                     this.updateDefaultList();
                  },
               },
            },
            {
               view: "checkbox",
               name: "hasColors",
               id: ids.hasColors,
               labelRight: L("Customize Colors"),
               labelWidth: 0,
               value: false,
               on: {
                  onChange: (newV, oldV) => {
                     if (newV == oldV) return false;

                     this.toggleColorControl(newV);
                  },
               },
            },
            {
               view: "label",
               label: `<b>${L("Options")}</b>`,
            },
            {
               id: ids.options,
               name: "options",
               css: "padList",
               view: this.AB._App.custom.editlist.view,
               template:
                  "<div style='position: relative;'><i class='ab-color-picker fa fa-lg fa-chevron-circle-down' style='color:#hex#'></i> #value#<i class='ab-new-field-remove fa fa-remove' style='position: absolute; top: 7px; right: 7px;'></i></div>",
               autoheight: true,
               drag: true,
               editable: true,
               hex: "",
               editor: "text",
               editValue: "value",
               onClick: {
                  "ab-new-field-remove": (e, itemId /*, trg */) => {
                     // Remove option item
                     // check that item is in saved data already
                     const matches = (this._originalOptions || []).filter(
                        (x) => {
                           return x.id == itemId;
                        }
                     )[0];
                     if (matches) {
                        // Ask the user if they want to remove option
                        webix
                           .confirm({
                              title: L("Delete Option"),
                              text: L(
                                 "All exisiting entries with this value will be cleared. Are you sure you want to delete this option?"
                              ),
                              type: "confirm-warning",
                           })
                           .then(() => {
                              // This is the "Yes"/"OK" click

                              // store the item that will be deleted for the save action

                              this._CurrentField.pendingDeletions =
                                 this._CurrentField.pendingDeletions || [];
                              this._CurrentField.pendingDeletions.push(itemId);
                              $$(ids.options).remove(itemId);
                           });
                     }
                     // If this item did not be saved, then remove from list
                     else {
                        $$(ids.options).remove(itemId);
                     }
                     // NOTE: the edit list can be in process of showing the editor here.
                     // .editCancel() only works if it is already being shown.  So we do
                     // a little timeout to allow it to technically show, but then cancel it

                     // setTimeout(() => {
                     //    $$(ids.options).editCancel();
                     // }, 0);

                     // e.stopPropagation();
                     return false;
                  },
                  "ab-color-picker": (e, itemID, trg) => {
                     webix
                        .ui({
                           id: ids.colorboard,
                           view: "popup",
                           body: {
                              view: "colorboard",
                              type: "classic",
                              id: "color",
                              width: 125,
                              height: 150,
                              palette: this.colors,
                              left: 125,
                              top: 150,
                              on: {
                                 onSelect: (hex) => {
                                    const vals = $$(ids.options).getItem(
                                       itemID
                                    );
                                    vals.hex = hex;
                                    $$(ids.options).updateItem(itemID, vals);
                                    $$(ids.colorboard).hide();
                                 },
                              },
                           },
                        })
                        .show(trg, { x: -7 });
                     return false;
                  },
               },
               on: {
                  onAfterAdd: () => {
                     this.updateDefaultList();
                  },
                  onAfterEditStop: () => {
                     this.updateDefaultList();
                  },
                  onAfterDelete: () => {
                     this.updateDefaultList();
                  },
                  onAfterRender: () => {
                     this.toggleColorControl($$(ids.hasColors).getValue());
                  },
               },
            },
            {
               view: "button",
               css: "webix_primary",
               value: L("Add new option"),
               click: () => {
                  let itemId = webix.uid();
                  let nextHex = this.getNextHex();
                  let optionElem = $$(ids.options);
                  if (!optionElem) return;

                  optionElem.add(
                     {
                        id: itemId,
                        value: "",
                        hex: nextHex,
                        isNew: true,
                     },
                     optionElem.count()
                  );

                  if (optionElem.exists(itemId)) optionElem.edit(itemId);
               },
            },
            {
               id: ids.default,
               placeholder: L("Select Default"),
               name: "default",
               view: "richselect",
               label: L("Default"),
            },
            {
               id: ids.multipleDefault,
               name: "multipleDefault",
               view: "forminput",
               labelWidth: 0,
               height: 36,
               borderless: true,
               hidden: true,
               body: {
                  view: this.AB._App.custom.focusabletemplate.view,
                  css: "customFieldCls",
                  borderless: true,
                  template:
                     `<label style="width: 80px;text-align: left;line-height:32px;" class="webix_inp_label">${L(
                        "Default"
                     )}</label>` +
                     '<div style="margin-left: 80px; height: 36px;" class="list-data-values form-entry"></div>',
               },
            },
         ]);
      }

      clear() {
         const ids = this.ids;
         $$(ids.isMultiple).setValue(0);
         $$(ids.hasColors).setValue(0);
         $$(ids.options).clearAll();

         $$(ids.default).define("options", []);
         $$(ids.default).setValue(this.FieldClass()?.defaultValues()?.default);

         const domNode = $$(ids.multipleDefault).$view.querySelector(
            ".list-data-values"
         );
         if (domNode && domNode.selectivity) {
            domNode.selectivity.setData([]);
         }
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("list");
      }

      getNextHex() {
         const usedColors = [];
         $$(this.ids.options)?.data.each(function (item) {
            usedColors.push(item.hex);
         });
         const allColors = [];
         this.colors.forEach((c) => {
            c?.forEach?.((j) => {
               allColors.push(j);
            });
         });
         let newHex = "#3498db";
         for (let i = 0; i < allColors.length; i++) {
            if (usedColors.indexOf(allColors[i]) == -1) {
               newHex = allColors[i];
               break;
            }
         }
         return newHex;
      }

      populate(field) {
         super.populate(field);

         // store the options that currently exisit to compare later for deletes
         this._originalOptions = field?.settings?.options ?? [];

         // set options to webix list
         let opts = [];

         // we need to access the fields -> object -> model to run updates on save (may be refactored later)
         this._CurrentField = field;
         if (this._CurrentField) {
            // empty this out so we don't try to delete already deleted options (or delete options that we canceled before running)
            this._CurrentField.pendingDeletions = [];
            opts = (field?.settings.options || []).map((opt) => {
               return {
                  id: opt.id,
                  value: opt.text,
                  hex: opt.hex,
                  translations: opt.translations,
               };
            });
         }
         const $opts = $$(this.ids.options);
         $opts.parse(opts);
         $opts.refresh();

         setTimeout(() => {
            this.updateDefaultList();
         }, 10);
      }

      toggleColorControl(value) {
         const colorPickers = $$(this.ids.options)?.$view.querySelectorAll(
            ".ab-color-picker"
         );
         colorPickers?.forEach(function (itm) {
            if (value == 1) itm.classList.remove("hide");
            else itm.classList.add("hide");
         });
      }

      updateDefaultList() {
         const ids = this.ids;
         const settings = this._CurrentField?.settings;

         const optList = $$(ids.options)
            .find({})
            .map(function (opt) {
               return {
                  id: opt.id,
                  value: opt.value,
                  hex: opt.hex,
               };
            });

         if ($$(ids.isMultiple).getValue()) {
            // Multiple default selector
            const domNode = $$(ids.multipleDefault).$view.querySelector(
               ".list-data-values"
            );
            if (!domNode) return false;

            // TODO : use to render selectivity to set default values
            let selectivityRender = new ABFieldSelectivity(
               {
                  settings: {},
               },
               {},
               {}
            );

            selectivityRender.selectivityRender(domNode, {
               multiple: true,
               data: settings?.multipleDefault ?? [],
               placeholder: L("Select items"),
               items: optList.map(function (opt) {
                  return {
                     id: opt.id,
                     text: opt.value,
                     hex: opt.hex,
                  };
               }),
            });
            domNode.addEventListener("change", function (e) {
               if (e.value.length) {
                  $$(ids.multipleDefault).define("required", false);
               } else if (
                  $$(ids.multipleDefault)
                     .$view.querySelector(".webix_inp_label")
                     .classList.contains("webix_required")
               ) {
                  $$(ids.multipleDefault).define("required", true);
               }
            });
         } else {
            // Single default selector
            $$(ids.default).define("options", optList);
            if (settings?.default) $$(ids.default).setValue(settings.default);

            $$(ids.default).refresh();
         }
      }

      /*
       * @function requiredOnChange
       *
       * The ABField.definitionEditor implements a default operation
       * to look for a default field and set it to a required field
       * if the field is set to required
       *
       * if you want to override that functionality, implement this fn()
       *
       * @param {string} newVal	The new value of label
       * @param {string} oldVal	The previous value
       */
      // requiredOnChange: (newVal, oldVal, ids) => {

      // 	// when require number, then default value needs to be reqired
      // 	$$(ids.default).define("required", newVal);
      // 	$$(ids.default).refresh();

      // 	if ($$(ids.multipleDefault).$view.querySelector(".webix_inp_label")) {
      // 		if (newVal) {
      // 			$$(ids.multipleDefault).define("required", true);
      // 			$$(ids.multipleDefault).$view.querySelector(".webix_inp_label").classList.add("webix_required");
      // 		} else {
      // 			$$(ids.multipleDefault).define("required", false);
      // 			$$(ids.multipleDefault).$view.querySelector(".webix_inp_label").classList.remove("webix_required");
      // 		}
      // 	}

      // },

      values() {
         const values = super.values();

         const ids = this.ids;

         // Get options list from UI, then set them to settings
         values.settings.options = [];
         $$(ids.options).data.each((opt) => {
            let optionId = opt.id;

            // If it is a new option item, then .id uses string instead of UID
            // for support custom index
            if (
               opt.isNew &&
               opt.value &&
               !values.settings.options.filter((o) => o.id == opt.value).length
            ) {
               optionId = opt.value;
            }

            values.settings.options.push({
               id: optionId,
               text: opt.value,
               hex: opt.hex,
               translations: opt.translations,
            });
         });

         // Un-translate options list
         values.settings.options.forEach((opt) => {
            this.AB.Multilingual.unTranslate(opt, opt, ["text"]);
         });

         // Set multiple default value
         values.settings.multipleDefault = [];
         const domNode = $$(ids.multipleDefault).$view.querySelector(
            ".list-data-values"
         );
         if (domNode && domNode.selectivity) {
            values.settings.multipleDefault =
               domNode.selectivity.getData() || [];
         }

         return values;
      }
   }

   return ABFieldListProperty;
}
