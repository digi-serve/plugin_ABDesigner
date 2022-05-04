/*
 * ABViewPropertyFilterData
 * This provides the UI interface for collecting the settings that drive the
 * common ABViewPropertyFilterData component on the UI.
 *
 * This is a common UI interface among our View widgets that offer the ability
 * to filter their data.
 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

import UI_Class from "../../../ui_class";

export default function (AB, idBase) {
   if (!myClass) {
      const base = `${idBase}_viewpropertyfilterdata`;
      const UIClass = UI_Class(AB);
      const uiConfig = AB.Config.uiSettings();
      var L = UIClass.L();

      myClass = class ABViewPropertyFilterData extends UIClass {

            static get default() {
      return {
         filterOption: 1, // 0 - Not allow, 1 - Enable user filter, 2 - Predefined filter menu, 3 - Global filter input

         // 1- Enable user filter options
         userFilterPosition: "toolbar", // "toolbar" || "form"

         // 2 - Predefined filter menu options
         // queryRules: [], // An array of ABViewGridFilterRule object

         // 3 - Global filter input options
         // globalFilterPosition: "default", // "default" || "single"

         isGlobalToolbar: 1, // "boolean"
      };
   }


         constructor() {
            // base: {string} unique base id reference

            super(base, {
               filterRules: "",
               filterRulesScrollview: "",

               filterOptionRadio: "",
               filterUserLayout: "",
               filterUser: "",
               filterGlobal: "",
               filterMenuLayout: "",

               needLoadAllLabel: "",
               globalToolbar: "",
            });

            this.AB = AB;

            this.queryRules = [];
            // {array}
            // of ... ?


         }

         ui() {
            const ids = this.ids;

            return {
               type: "form",
               rows: [
                  {
                     view: "radio",
                     id: ids.filterOptionRadio,
                     value: 0,
                     options: [
                        { id: 0, value: L("Do not Allow User filters") },
                        { id: 1, value: L("Enable User filters") },
                        { id: 2, value: L("Use a filter menu") },
                        { id: 3, value: L("Use a global filter input") },
                     ],
                     vertical: true,
                     label: "Filter Option",
                     labelWidth: uiConfig.labelWidthLarge,
                     on: {
                        onChange: (newValue /*, oldValue */) => {
                           this.setFilterOption(newValue);
                        },
                     },
                  },

                  {
                     view: "radio",
                     id: ids.filterGlobal,
                     hidden: true,
                     vertical: true,
                     label: "Show",
                     labelWidth: uiConfig.labelWidthLarge,
                     options: [
                        { id: "default", value: L("All matching records") },
                        { id: "single", value: L("Single records only") },
                     ],
                  },

                  {
                     view: "layout",
                     id: ids.filterUserLayout,
                     hidden: true,
                     cols: [
                        {
                           view: "radio",
                           vertical: true,
                           id: ids.filterUser,
                           value: "toolbar",
                           label: "Display",
                           labelWidth: uiConfig.labelWidthLarge,
                           width: 200,
                           options: [
                              { id: "toolbar", value: L("Toolbar") },
                              { id: "form", value: L("Form") },
                           ],
                           on: {
                              onChange: (newValue) => {
                                 this.setFilterUser(newValue);
                              },
                           },
                        },
                        {
                           view: "checkbox",
                           id: ids.globalToolbar,
                           width: 350,
                           labelRight: L("Include a global filter input"),
                        },
                        {},
                     ],
                  },

                  {
                     view: "layout",
                     id: ids.filterMenuLayout,
                     hidden: true,
                     rows: [
                        {
                           css: { "padding-bottom": 10 },
                           cols: [
                              {
                                 view: "button",
                                 css: "webix_primary",
                                 icon: "fa fa-plus",
                                 type: "iconButton",
                                 label: L("Add new filter"),
                                 width: 150,
                                 click: () => {
                                    this.addFilterRule();
                                 },
                              },
                              {
                                 id: ids.needLoadAllLabel,
                                 view: "label",
                                 label: L('need "LoadAll" from datasource'),
                                 css: { color: "red" },
                                 hidden: true,
                              },
                              { fillspace: true },
                           ],
                        },
                        {
                           id: ids.filterRulesScrollview,
                           view: "scrollview",
                           scroll: "xy",
                           body: {
                              id: ids.filterRules,
                              view: "layout",
                              margin: 20,
                              padding: 10,
                              rows: [],
                           },
                        },
                     ],
                  },
                  {
                     css: { "background-color": "#fff" },
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
                           label: L("Save"),
                           type: "form",
                           autowidth: true,
                           click: () => {
                              this.buttonSave();
                           },
                        },
                        { fillspace: true },
                     ],
                  },
               ],
            };
         }

         init(AB) {
            this.AB = AB;
         }

          buttonCancel () {
            this.emit("cancel");
         }

         buttonSave() {
            this.emit("save")
         }

         objectLoad(object, isLoadAll = false) {
            this.object = object;
            this.isLoadAll = isLoadAll;

            //tell each of our rules about our object
            if (this.queryRules && this.queryRules.length) {
               this.queryRules.forEach((r) => {
                  r.objectLoad(object);
               });
            }
         }

         setSettings(settings = {}) {
            const ids = this.ids;

            //Convert some condition from string to integer
            (settings.queryRules || []).forEach((qr) => {
               if (
                  qr?.queryRules?.[0]?.rules
               ) {
                  qr.queryRules[0].rules.forEach((rule) => {
                     if (/^[+-]?\d+(\.\d+)?$/.exec(rule.value)) {
                        rule.value = JSON.parse(rule.value);
                     }
                  });
               }
            });

            $$(ids.filterOptionRadio).setValue(settings.filterOption);
            $$(ids.filterUser).setValue(
               settings.userFilterPosition ||
                  ABViewPropertyFilterData.default.userFilterPosition
            );
            $$(ids.globalToolbar).setValue(
               typeof settings.isGlobalToolbar != "undefined"
                  ? settings.isGlobalToolbar
                  : ABViewPropertyFilterData.default.isGlobalToolbar
            );

            $$(ids.filterGlobal).setValue(
               settings.globalFilterPosition ||
                  ABViewPropertyFilterData.default.globalFilterPosition
            );

            // clear any existing Rules:
               (this.queryRules ?? []).forEach((rule) => {
                  if ($$(ids.filterRules))
                     $$(ids.filterRules).removeView(rule.ids.component);
               });
            this.queryRules = [];

            (settings.queryRules || []).forEach((ruleSettings) => {
               this.addFilterRule(ruleSettings);
            });
         }

         getSettings() {
            const ids = this.ids;
            var settings = {};
            settings.filterOption = parseInt(
               $$(ids.filterOptionRadio).getValue()
            );
            settings.queryRules = [];

            switch (settings.filterOption) {
               case 0: // Disable User filters
                  settings.isGlobalToolbar = 0;
                  break;
               case 1: // Enable User filters
                  settings.userFilterPosition = $$(ids.filterUser).getValue();
                  settings.isGlobalToolbar = $$(ids.globalToolbar).getValue();
                  break;
               case 2: // Use a filter menu
                  this.queryRules.forEach((r) => {
                     settings.queryRules.push(r.toSettings());
                  });
                  break;
               case 3: // Use a global filter menu
                  settings.globalFilterPosition = $$(
                     ids.filterGlobal
                  ).getValue();
                  break;
            }

            return settings;
         }

         /**
          * @method addFilterRule
          * Instantiate a new Rule in our list.
          * @param {obj} settings
          *        The settings object from the Rule we created in .toSettings()
          */
         addFilterRule(settings) {
            if (this.object == null) return;

            var Rule = getRule(instance.object, App, idBase);
            instance.queryRules.push(Rule);

            // if we have tried to create our component:
            if (ids) {
               // if our actually exists, then populate it:
               var RulesUI = $$(ids.filterRules);
               if (RulesUI) {
                  // make sure Rule.ui is created before calling .init()
                  Rule.component(App, idBase); // prepare the UI component
                  var viewId = RulesUI.addView(Rule.ui);
                  Rule.showQueryBuilderContainer();
                  Rule.init({
                     onDelete: (deletedRule) => {
                        $$(ids.filterRules).removeView(Rule.ids.component);

                        var index = instance.queryRules.indexOf(deletedRule);
                        if (index !== -1) {
                           instance.queryRules.splice(index, 1);
                        }
                     },
                  });
               }
            }

            if (settings) {
               Rule.fromSettings(settings);
            }
         },

         onShow: function () {
            if (!this.isLoadAll) {
               $$(ids.needLoadAllLabel).show();
            } else {
               $$(ids.needLoadAllLabel).hide();
            }
         },

         setFilterOption: function (value) {
            switch (JSON.parse(value || 0)) {
               case 1: // Enable User filters
                  $$(ids.filterMenuLayout).hide();
                  $$(ids.filterGlobal).hide();
                  $$(ids.filterUserLayout).show();
                  break;
               case 2: // Use a filter menu
                  $$(ids.filterUserLayout).hide();
                  $$(ids.filterGlobal).hide();
                  $$(ids.filterMenuLayout).show();
                  break;
               case 3: // Use a global filter menu
                  $$(ids.filterUserLayout).hide();
                  $$(ids.filterMenuLayout).hide();
                  $$(ids.filterGlobal).show();
                  break;
               case 0:
               default:
                  // Do not Allow User filters
                  $$(ids.filterUserLayout).hide();
                  $$(ids.filterMenuLayout).hide();
                  $$(ids.filterGlobal).hide();
                  break;
            }
         },

         setFilterUser: (val) => {
            switch (val) {
               case "toolbar":
                  $$(ids.globalToolbar).show();
                  break;
               case "form":
                  $$(ids.globalToolbar).hide();
                  break;
            }
         },
      };
   }

   return myClass;
}
