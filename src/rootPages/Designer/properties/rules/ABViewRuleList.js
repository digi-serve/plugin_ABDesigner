//
// ABViewRuleList
//
// A UI component that is responsible for displaying a list of current "Rules"
// for a given purpose.  Some examples are the
//		Form -> Submit Rules,
//		Form -> Display Rules
// 		Form -> Record Rules.
//

// ABViewRuleList is the parent object that manages displaying the common popup,
// list, adding a rule, removing rules, etc...
//
// It is intending to be subclassed by a Specific List object that will load
// up a given set of Actions for their list.
//
// When using it in the AppBuilder Interface Builder, this object provides:
// 	var PopupRecordList = new ABViewRuleList(App, idBase);
//  PopupRecordList.fromSettings(CurrentObjectDefinition.rules); // populates List with current settings defined in CurrentObjectDefinition
//  PopupRecordList.init({ onSave:()=>{}})	// displays the popup for IB
//  CurrentObjectDefinition.rules = PopupRecordList.toSettings(); // save the settings to store in json config
//
// When using on a live running App:
//  PopupRecordList = new ABViewRuleList(App, idBase);
//  PopupRecordList.fromSettings();
//
//  onFormSubmit(data) {
//		// note: this automatically validates and runs each rule:
//		PopupRecordList.process({data:data, view:{ current ABViewForm object }})
//		.then()
//		.catch();
//  }

import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class ABViewRuleList extends UIClass {
      /**
       * @param {object} App
       *      The shared App object that is created in OP.Component
       * @param {string} idBase
       *      Identifier for this component
       */
      constructor(base, childSettings) {
         base = base || "ABViewRuleList";
         super(base, {
            rules: "",
            rulesScrollview: "",

            action: "",
            when: "",

            values: "",
            set: "",
         });

         this.listRules = [];

         // ensure required values:
         childSettings = childSettings || {};
         childSettings.labels = childSettings.labels || {};
         childSettings.labels.header =
            childSettings.labels.header || L("Rule List");
         childSettings.labels.headerDefault =
            childSettings.labels.headerDefault || L("Rule List");
         this.childSettings = childSettings;
      }

      ui() {
         const ids = this.ids;

         return {
            view: "window",
            id: ids.component,
            modal: true,
            position: "center",
            resize: true,
            width: 700,
            height: 450,
            css: "ab-main-container",
            head: {
               view: "toolbar",
               css: "webix_dark",
               cols: [
                  {
                     view: "label",
                     label: this.childSettings.labels.headerDefault,
                  },
                  {
                     view: "button",
                     css: "webix_primary",
                     icon: "fa fa-plus",
                     type: "iconButton",
                     label: L("Add new rule"),
                     width: 150,
                     click: () => {
                        this.addRule();
                        $$(ids.rulesScrollview).scrollTo(
                           0,
                           $$(ids.rules).$height
                        );
                     },
                  },
               ],
            },
            body: {
               type: "form",
               rows: [
                  {
                     view: "scrollview",
                     id: ids.rulesScrollview,
                     scroll: "xy",
                     body: {
                        view: "layout",
                        id: ids.rules,
                        margin: 20,
                        padding: 10,
                        rows: [],
                     },
                  },
                  // {
                  //    css: { 'background-color': '#fff' },
                  //    cols: [
                  //       {
                  //          view: "button",
                  //          icon: "plus",
                  //          type: "iconButton",
                  //          label: labels.component.addNewRule,
                  //          width: 150,
                  //          click: () => {
                  //             this.addRule();
                  //          }
                  //       },
                  //       { fillspace: true }
                  //    ]
                  // },
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
            },
         };
      }

      init(AB) {
         this.AB = AB;
         webix.ui(this.ui());
         return Promise.resolve();
      }

      buttonCancel() {
         $$(this.ids.component)?.hide();
      }

      buttonSave() {
         var results = this.toSettings();

         this.emit("save", results);
         // _logic.callbacks.onSave(results);
         this.hide();
      }

      hide() {
         $$(this.ids.component)?.hide();
      }

      show() {
         $$(this.ids.component)?.show();
      }

      /**
       * @method component
       * initialize the UI display for this popup editor.
       * @param {obj} App  The common UI App object shared among our UI components
       * @param {string} idBase A unique Key used the the base of our unique ids
       */
      // component() {

      //    // internal business logic
      //    var _logic = (this._logic = {
      //       buttonCancel: function () {
      //          $$(ids.component).hide();
      //       },

      //       buttonSave: () => {
      //          var results = this.toSettings();

      //          _logic.callbacks.onSave(results);
      //          _logic.hide();
      //       },

      //       callbacks: {
      //          onCancel: function () {
      //             console.warn("NO onCancel()!");
      //          },
      //          onSave: function (field) {
      //             console.warn("NO onSave()!");
      //          },
      //       },

      //       hide: function () {
      //          $$(ids.component).hide();
      //       },

      //       show: function () {
      //          $$(ids.component).show();
      //       },
      //    });

      //    this.show = _logic.show;
      //    this.setValue = _logic.setValue;
      // }

      /**
       * @method addRule
       * Instantiate a new Rule in our list.
       * @param {obj} settings  The settings object from the Rule we created in .toSettings()
       */
      addRule(settings) {
         var Rule = this.getRule();
         if (!Rule) return;

         this.listRules.push(Rule);

         // if our list actually exists, then populate it:
         var RulesUI = $$(this.ids.rules);
         if (RulesUI) {
            // make sure Rule.ui is created before calling .init()
            // Rule.component(this.App, this.idBase); // prepare the UI component
            RulesUI.addView(Rule.ui());
            Rule.objectLoad(this.CurrentObject);

            Rule.on("delete", (deletedRule) => {
               $$(this.ids.rules).removeView(Rule.ids.component);

               var index = this.listRules.indexOf(deletedRule);
               if (index !== -1) {
                  this.listRules.splice(index, 1);
               }
            });
         }

         if (settings) {
            Rule.fromSettings(settings);
         }
      }

      /**
       * @method fromSettings
       * Create an initial set of default values based upon our settings object.
       * @param {obj} settings  The settings object we created in .toSettings()
       */
      fromSettings(settings) {
         // settings: [
         //  { rule.settings },
         //  { rule.settings }
         // ]

         // clear any existing Rules:
         this.listRules.forEach((rule) => {
            if (this.ids?.rules && rule?.ids?.component) {
               $$(this.ids.rules).removeView(rule.ids.component);
            }
         });
         this.listRules = [];

         if (settings) {
            settings.forEach((ruleSettings) => {
               this.addRule(ruleSettings);
            });
         }
      }

      /**
       * @method objectLoad
       * A rule is based upon a Form that was working with an Object.
       * .objectLoad() is how we specify which object we are working with.
       * @param {ABObject} object
       *        The object that will be used to evaluate the Rules
       */
      objectLoad(object) {
         super.objectLoad(object);

         // tell each of our rules about our object
         this.listRules.forEach((r) => {
            r.objectLoad(object);
         });
      }
      /*
      processPre(options) {
         (this.listRules || [])
            .filter((rule) => rule.isPreProcess == true)
            .forEach((rule) => {
               rule.processPre(options, options.data);
            });
      }
*/
      /**
       * @method process
       * Take the provided data and process each of our rules.
       * @param {obj} options
       * @return {promise}
       */ /*
      process(options) {
         return new Promise((resolve, reject) => {
            let listRules = (this.listRules || []).filter(
               (rule) => !rule.isPreProcess
            );

            var numDone = 0;
            var onDone = () => {
               numDone++;
               if (numDone >= listRules.length) {
                  resolve();
               }
            };

            listRules.forEach((rule) => {
               rule
                  .process(options)
                  .then(function () {
                     onDone();
                  })
                  .catch((err) => {
                     reject(err);
                  });
            });

            if (listRules.length == 0) {
               resolve();
            }
         });
      }
*/

      /**
       * @method toSettings
       * create a settings object to be persisted with the application.
       * @return {array} of rule settings.
       */
      toSettings() {
         var settings = [];
         this.listRules.forEach((r) => {
            settings.push(r.toSettings());
         });
         return settings;
      }

      getRule() {
         console.error(
            "!!! ABViewRuleList.getRule() should be overridded by a child object."
         );
         return null;
      }

      formLoad(form) {
         this.viewLoad(form);
      }

      get currentForm() {
         return this.CurrentView;
      }

      /**
       * @method isReady()
       * returns a promise that gets resolved once our action is ready to work.
       * @return {Promise}
       */
      rulesReady() {
         // This base class should be overwritten by any subclass that needs
         // to prepare:
         return Promise.resolve();
      }

      // NOTE: Querybuilder v5.2 has a bug where it won't display the [and/or]
      // choosers properly if it hasn't been shown before the .setValue() call.
      // so this work around allows us to refresh the display after the .show()
      // on the popup.
      // When they've fixed the bug, we'll remove this workaround:
      qbFixAfterShow() {
         this.listRules.forEach((r) => {
            r.qbFixAfterShow();
         });
      }
   }

   return ABViewRuleList;
}
