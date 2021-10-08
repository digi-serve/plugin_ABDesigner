/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/application.js":
/*!****************************!*\
  !*** ./src/application.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rootPages_Designer_ui_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rootPages/Designer/ui.js */ "./src/rootPages/Designer/ui.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var Designer = (0,_rootPages_Designer_ui_js__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   var application = {
      id: "ABDesigner",
      label: "AB Designer", // How to get Multilingual?
      // {string} the AB.Multilingual.Label(Key)
      isPlugin: true,

      pages: function () {
         // Return the Root Pages required to
         return this._pages;
      },
      _pages: [Designer],
      // init: function (AB) {
      //    debugger;
      //    this._pages.forEach((p) => {
      //       p.init(AB);
      //    });
      // },
      datacollectionsIncluded: () => {
         // return [];
         var myDCs = [];
         return AB.datacollections((d) => myDCs.indexOf(d.id) > -1);
      },
   };
   Designer.application = application;
   return application;
}


/***/ }),

/***/ "./src/definitions.js":
/*!****************************!*\
  !*** ./src/definitions.js ***!
  \****************************/
/***/ ((module) => {

module.exports = [];


/***/ }),

/***/ "./src/labels/en.js":
/*!**************************!*\
  !*** ./src/labels/en.js ***!
  \**************************/
/***/ ((module) => {

/* eslint-disable */
module.exports = {
   /* key : label */
};


/***/ }),

/***/ "./src/labels/labels.js":
/*!******************************!*\
  !*** ./src/labels/labels.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

//
// Labels.js
//
// The index into our label library.

var Labels = {};
// {hash}  { /* language_code : { key: label} */ }
// all the <lang_code>.js files supported by the AppBuilder

Labels.en = __webpack_require__(/*! ./en.js */ "./src/labels/en.js");

module.exports = Labels;


/***/ }),

/***/ "./src/rootPages/Designer/forms/process/ABProcessParticipant_selectManagersUI.js":
/*!***************************************************************************************!*\
  !*** ./src/rootPages/Designer/forms/process/ABProcessParticipant_selectManagersUI.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * UIProcessParticipant_SelectManagersUI
 *
 * Display the form for entering how to select "managers".
 * this form allows you to choose Roles, or Users directly.
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = (...params) => {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UIProcessParticipant_SelectManagersUI extends AB.ClassUI {
      constructor(id) {
         super({
            component: id,
            form: `${id}_form`,
            name: `${id}_name`,
            role: `${id}_role`,
            useRole: `${id}_useRoles`,
            useAccount: `${id}_useAccounts`,
            account: `${id}_account`,
         });
      }

      ui(obj = {}) {
         var __Roles = AB.Account.rolesAll().map((r) => {
            return { id: r.id, value: r.name };
         });
         var __Users = AB.Account.userList().map((u) => {
            return { id: u.uuid, value: u.username };
         });

         var ids = this.ids;

         return {
            id: this.ids.component,
            type: "form",
            css: "no-margin",
            rows: [
               {
                  cols: [
                     {
                        view: "checkbox",
                        id: this.ids.useRole,
                        labelRight: L("by Role"),
                        labelWidth: 0,
                        width: 120,
                        value: obj.useRole == "1" ? 1 : 0,
                        click: function (id /*, event */) {
                           if ($$(id).getValue()) {
                              $$(ids.role).enable();
                           } else {
                              $$(ids.role).disable();
                           }
                        },
                        on: {
                           onAfterRender() {
                              AB.ClassUI.CYPRESS_REF(this);
                           },
                        },
                     },
                     {
                        id: this.ids.role,
                        view: "multicombo",
                        value: obj.role ? obj.role : 0,
                        disabled: obj.useRole == "1" ? false : true,
                        suggest: {
                           body: {
                              data: __Roles,
                              on: {
                                 //
                                 // TODO: looks like a Webix Bug that has us
                                 // doing all this work.  Let's see if Webix
                                 // can fix this for us.
                                 onAfterRender() {
                                    this.data.each((a) => {
                                       AB.ClassUI.CYPRESS_REF(
                                          this.getItemNode(a.id),
                                          `${ids.role}_${a.id}`
                                       );
                                    });
                                 },
                                 onItemClick: function (id) {
                                    var $roleCombo = $$(ids.role);
                                    var currentItems = $roleCombo.getValue();
                                    var indOf = currentItems.indexOf(id);
                                    if (indOf == -1) {
                                       currentItems.push(id);
                                    } else {
                                       currentItems.splice(indOf, 1);
                                    }
                                    $roleCombo.setValue(currentItems);
                                    // var item = this.getItem(id);
                                    // AB.ClassUI.CYPRESS_REF(
                                    //    this.getItemNode(item.id),
                                    //    `${ids.role}_${item.id}`
                                    // );
                                 },
                              },
                           },
                        },
                        placeholder: L("Click or type to add role..."),
                        labelAlign: "left",
                        stringResult: false /* returns data as an array of [id] */,
                        on: {
                           onAfterRender: function () {
                              // set data-cy for original field to track clicks to open option list
                              AB.ClassUI.CYPRESS_REF(this.getNode(), ids.role);
                           },
                           onChange: function (/* newVal, oldVal */) {
                              // trigger the onAfterRender function from the list so we can add data-cy to dom
                              $$("combo1").getList().callEvent("onAfterRender");
                           },
                        },
                     },
                  ],
               },
               {
                  cols: [
                     {
                        view: "checkbox",
                        id: this.ids.useAccount,
                        labelRight: L("by Account"),
                        labelWidth: 0,
                        width: 120,
                        value: obj.useAccount == "1" ? 1 : 0,
                        click: function (id /*, event */) {
                           if ($$(id).getValue()) {
                              $$(ids.account).enable();
                           } else {
                              $$(ids.account).disable();
                           }
                        },
                        on: {
                           onAfterRender() {
                              AB.ClassUI.CYPRESS_REF(this);
                           },
                        },
                     },
                     {
                        id: this.ids.account,
                        view: "multicombo",
                        value: obj.account ? obj.account : 0,
                        disabled: obj.useAccount == "1" ? false : true,
                        suggest: {
                           body: {
                              data: __Users,
                              on: {
                                 //
                                 // TODO: looks like a Webix Bug that has us
                                 // doing all this work.  Let's see if Webix
                                 // can fix this for us.
                                 onAfterRender() {
                                    this.data.each((a) => {
                                       AB.ClassUI.CYPRESS_REF(
                                          this.getItemNode(a.id),
                                          `${ids.account}_${a.id}`
                                       );
                                    });
                                 },
                                 onItemClick: function (id) {
                                    var $accountCombo = $$(ids.account);
                                    var currentItems = $accountCombo.getValue();
                                    var indOf = currentItems.indexOf(id);
                                    if (indOf == -1) {
                                       currentItems.push(id);
                                    } else {
                                       currentItems.splice(indOf, 1);
                                    }
                                    $accountCombo.setValue(currentItems);
                                    // var item = this.getItem(id);
                                    // AB.ClassUI.CYPRESS_REF(
                                    //    this.getItemNode(item.id),
                                    //    `${ids.account}_${item.id}`
                                    // );
                                 },
                              },
                           },
                        },
                        labelAlign: "left",
                        placeholder: L("Click or type to add user..."),
                        stringResult: false /* returns data as an array of [id] */,
                        on: {
                           onAfterRender: function () {
                              // set data-cy for original field to track clicks to open option list
                              AB.ClassUI.CYPRESS_REF(
                                 this.getNode(),
                                 ids.account
                              );
                           },
                           onChange: function (/* newVal, oldVal */) {
                              // trigger the onAfterRender function from the list so we can add data-cy to dom
                              $$("combo1").getList().callEvent("onAfterRender");
                           },
                        },
                     },
                  ],
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         return Promise.resolve();
      }

      // show() {
      //    super.show();
      //    AppList.show();
      // }

      /**
       * values()
       * return an object hash representing the values for this component.
       * @return {json}
       */
      values() {
         var obj = {};
         var ids = this.ids;

         if ($$(ids.useRole)) {
            obj.useRole = $$(ids.useRole).getValue();
         }

         if ($$(ids.role) && obj.useRole) {
            obj.role = $$(ids.role).getValue();
            if (obj.role === "--") obj.role = null;
         } else {
            obj.role = null;
         }

         if ($$(ids.useAccount)) {
            obj.useAccount = $$(ids.useAccount).getValue();
         }

         if ($$(ids.account) && obj.useAccount) {
            obj.account = $$(ids.account).getValue(/*{ options: true }*/);
            if (obj.account === "--") obj.account = null;
         } else {
            obj.account = null;
         }

         return obj;
      }
   }

   return UIProcessParticipant_SelectManagersUI;
}


/***/ }),

/***/ "./src/rootPages/Designer/ui.js":
/*!**************************************!*\
  !*** ./src/rootPages/Designer/ui.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_choose_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_choose.js */ "./src/rootPages/Designer/ui_choose.js");
/* harmony import */ var _ui_work_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work.js */ "./src/rootPages/Designer/ui_work.js");
/*
 * UI
 *
 * The central Controller for the ABDesigner.
 *
 * We switch between allowing a User to Choose an application to work
 * with, and the actual Workspace for an Application.
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const AppChooser = (0,_ui_choose_js__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   const AppWorkspace = (0,_ui_work_js__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI extends AB.ClassUI {
      constructor() {
         super("abd");
         this.id = this.ids.component;
      }

      label() {
         return L("AB Designer");
      }

      // return "popup" or "page"
      type() {
         return "page";
      }

      // Return any sub pages.
      pages() {
         return [];
      }

      /* mimic the ABPage.component() */
      component() {
         return {
            ui: this.ui(),
            init: () => {
               return this.init(AB);
            },
            onShow: () => {
               /* does anything special need to happen here? */
               this.show();
            },
         };
      }

      ui() {
         return {
            id: this.ids.component,
            view: "multiview",
            borderless: true,
            animate: false,
            // height : 800,
            rows: [AppChooser.ui(), AppWorkspace.ui()],
         };
      }

      async init(AB) {
         this.AB = AB;

         AppChooser.on("view.workplace", (App) => {
            AppWorkspace.transitionWorkspace(App);
         });

         AppWorkspace.on("view.chooser", () => {
            AppChooser.show();
         });

         return Promise.all([AppChooser.init(AB), AppWorkspace.init(AB)]).then(
            () => {
               // Register for ABDefinition Updates
               return this.AB.Network.post({
                  url: `/definition/register`,
               }).catch((err) => {
                  if (err?.code == "E_NOPERM") {
                     // ?? What do we do here ??
                     this.AB.notify.developer(err, {
                        plugin: "ABDesigner",
                        context: "ui::init():/definition/register",
                        msg: "User is not able to access /definition/register",
                     });
                  }
               });
            }
         );
      }

      /**
       * isRoot()
       * indicates this is a RootPage.
       * @return {bool}
       */
      isRoot() {
         return true;
      }

      show() {
         super.show();
         AppChooser.show();
      }
   }
   return new UI();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_choose.js":
/*!*********************************************!*\
  !*** ./src/rootPages/Designer/ui_choose.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_choose_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_choose_list */ "./src/rootPages/Designer/ui_choose_list.js");
/* harmony import */ var _ui_choose_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_choose_form */ "./src/rootPages/Designer/ui_choose_form.js");
/*
 * UI Choose
 *
 * Display the initial options of Applications we can work with.
 *
 * When choosing an initial application to work with, we can
 *   - select an application from a list  :  ab_choose_list
 *   - create an application from a form  :  ab_choose_form
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const AppList = (0,_ui_choose_list__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   const AppForm = (0,_ui_choose_form__WEBPACK_IMPORTED_MODULE_1__["default"])(AB);

   class UIChoose extends AB.ClassUI {
      constructor() {
         super("abd_choose");
      }

      ui() {
         return {
            id: this.ids.component,
            view: "multiview",
            animate: false,
            cells: [AppList.ui(), AppForm.ui()],
         };
      }

      async init(AB) {
         this.AB = AB;

         AppList.on("view.workplace", (App) => {
            this.emit("view.workplace", App);
         });

         AppList.on("view.form", () => {
            AppForm.formReset();
            AppForm.show();
         });

         AppList.on("edit.form", (app) => {
            AppForm.formPopulate(app);
            AppForm.show();
         });

         AppForm.on("view.list", () => {
            AppList.show();
         });
         return Promise.all([AppList.init(AB), AppForm.init(AB)]);
      }

      show() {
         super.show();
         AppList.show();
      }
   }
   return new UIChoose();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_choose_form.js":
/*!**************************************************!*\
  !*** ./src/rootPages/Designer/ui_choose_form.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _forms_process_ABProcessParticipant_selectManagersUI_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./forms/process/ABProcessParticipant_selectManagersUI.js */ "./src/rootPages/Designer/forms/process/ABProcessParticipant_selectManagersUI.js");
/*
 * AB Choose Form
 *
 * Display the form for creating a new Application.
 *
 */

// const ABComponent = require("../classes/platform/ABComponent");
// const ABApplication = require("../classes/platform/ABApplication");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };
   const ClassSelectManagersUI = (0,_forms_process_ABProcessParticipant_selectManagersUI_js__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   class ABChooseForm extends AB.ClassUI {
      // .extend(idBase, function(App) {

      constructor() {
         var base = "abd_choose_form";
         super({
            component: base,
            warnings: `${base}_warnings`,
            form: `${base}_form`,
            appFormPermissionList: `${base}_permission`,
            appFormCreateRoleButton: `${base}_createRole`,

            saveButton: `${base}_buttonSave`,
            accessManager: `${base}_accessManager`,
            accessManagerToolbar: `${base}_accessManagerToolbar`,
            translationManager: `${base}_translationManager`,
            translationManagerToolbar: `${base}_translationManagerToolbar`,
         });

         this.Application = null;
         // {ABApplication} The current ABApplication being Updated().
         // Should be null if performing a Create()
      }

      ui() {
         this.accessManagerUI = new ClassSelectManagersUI("application_amp");
         this.translationManagerUI = new ClassSelectManagersUI(
            "application_translate"
         );

         return {
            id: this.ids.component,
            view: "scrollview",
            scroll: "y",
            body: {
               rows: [
                  {
                     responsive: "hide",
                     type: "space",
                     cols: [
                        {
                           maxWidth: uiConfig.appListSpacerColMaxWidth,
                           minWidth: uiConfig.appListSpacerColMinWidth,
                           width: uiConfig.appListSpacerColMaxWidth,
                        },
                        {
                           responsiveCell: false,
                           rows: [
                              {
                                 maxHeight: uiConfig.appListSpacerRowHeight,
                                 hidden: uiConfig.hideMobile,
                              },
                              {
                                 view: "toolbar",
                                 css: "webix_dark",
                                 cols: [
                                    {
                                       view: "label",
                                       label: L("Application Info"), //labels.component.formHeader,
                                       fillspace: true,
                                    },
                                 ],
                              },
                              {
                                 id: this.ids.warnings,
                                 view: "label",
                                 label: "",
                              },
                              {
                                 view: "form",
                                 id: this.ids.form,
                                 autoheight: true,
                                 margin: 0,
                                 rules: {
                                    label: (value) => {
                                       return (
                                          0 < value.length && value.length <= 20
                                       );
                                    },
                                 },
                                 elements: [
                                    {
                                       name: "label",
                                       view: "text",
                                       label: L("Name"),
                                       placeholder: L("Application name"),
                                       invalidMessage: L(
                                          "Name must be less than or equal to 20"
                                       ),
                                       labelWidth: 100,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_label"
                                             );
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       name: "description",
                                       view: "textarea",
                                       label: L("Description"),
                                       labelAlign: "left",
                                       labelWidth: 100,
                                       placeholder: L(
                                          "Application Description"
                                       ),
                                       height: 100,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_description"
                                             );
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       name: "isSystemObj",
                                       view: "checkbox",
                                       labelRight: L(
                                          "is this a System Object?"
                                       ),
                                       labelWidth: 0,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_isSystemObj"
                                             );
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       view: "toolbar",
                                       css: "ab-toolbar-submenu webix_dark",
                                       cols: [
                                          {
                                             template: L(
                                                "Who can use this app?"
                                             ),
                                             type: "header",
                                             borderless: true,
                                          },
                                          {},
                                          // {
                                          //    view: "checkbox",
                                          //    id: this.ids.appFormCreateRoleButton,
                                          //    align: "right",
                                          //    labelRight: L("Create new role"),
                                          //    labelWidth: 0,
                                          //    width: 150,
                                          //    on: {
                                          //       onItemClick: (/* id, e */) => {
                                          //          this.createRoleButtonClick();
                                          //       },
                                          //    },
                                          // },
                                       ],
                                    },
                                    {
                                       name: "permissions",
                                       id: this.ids.appFormPermissionList,
                                       view: "list",
                                       autowidth: true,
                                       height: 140,
                                       margin: 0,
                                       css: "ab-app-form-permission",
                                       template:
                                          "{common.markCheckbox()} #name#",
                                       type: {
                                          markCheckbox: function (obj) {
                                             return `<span class="check webix_icon fa fa-fw fa-${
                                                obj.markCheckbox ? "check-" : ""
                                             }square-o" data-cy="check_${
                                                obj.id
                                             }"></span>`;

                                             // (
                                             //    "<span class='check webix_icon fa fa-fw fa-" +
                                             //    (obj.markCheckbox
                                             //       ? "check-"
                                             //       : "") +
                                             //    "square-o' data-cy='check_"+obj.id+"'></span>"
                                             // );
                                          },
                                       },
                                       on: {
                                          onAfterRender() {
                                             this.data.each((a) => {
                                                AB.ClassUI.CYPRESS_REF(
                                                   this.getItemNode(a.id),
                                                   `perm_role_${a.id}`
                                                );
                                             });
                                          },
                                          onItemClick: (id, e, node) => {
                                             this.permissionClick(id, e, node);
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       name: "isAccessManaged",
                                       view: "checkbox",
                                       labelRight: L(
                                          "Enable Page/Tab Access Management"
                                       ),
                                       labelWidth: 0,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_isAccessManaged"
                                             );
                                          },
                                          onChange: (newv /* , oldv */) => {
                                             if (newv) {
                                                $$(
                                                   this.ids.accessManager
                                                ).show();
                                                $$(
                                                   this.ids.accessManagerToolbar
                                                ).show();
                                             } else {
                                                $$(
                                                   this.ids.accessManager
                                                ).hide();
                                                $$(
                                                   this.ids.accessManagerToolbar
                                                ).hide();
                                             }
                                          },
                                          onItemClick: (id /*, e */) => {
                                             var enabled = $$(id).getValue();
                                             if (enabled) {
                                                $$(
                                                   this.ids.accessManager
                                                ).show();
                                                $$(
                                                   this.ids.accessManagerToolbar
                                                ).show();
                                             } else {
                                                $$(
                                                   this.ids.accessManager
                                                ).hide();
                                                $$(
                                                   this.ids.accessManagerToolbar
                                                ).hide();
                                             }
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       view: "toolbar",
                                       id: this.ids.accessManagerToolbar,
                                       css: "ab-toolbar-submenu webix_dark",
                                       hidden:
                                          parseInt(this.accessManagement) == 1
                                             ? false
                                             : true,
                                       cols: [
                                          {
                                             template: L(
                                                "Who can manage page/tab access for this app?"
                                             ), //labels.component.managerHeader,
                                             type: "header",
                                             borderless: true,
                                          },
                                          {},
                                       ],
                                    },
                                    {
                                       id: this.ids.accessManager,
                                       rows: [this.accessManagerUI.ui()],
                                       paddingY: 10,
                                       hidden:
                                          parseInt(this.accessManagement) == 1
                                             ? false
                                             : true,
                                    },
                                    {
                                       name: "isTranslationManaged",
                                       view: "checkbox",
                                       labelRight: L("Enable Translation Tool"), // labels.component.enableTranslationManagement,
                                       labelWidth: 0,
                                       on: {
                                          onAfterRender() {
                                             AB.ClassUI.CYPRESS_REF(
                                                this,
                                                "abd_choose_form_isTranslationManaged"
                                             );
                                          },
                                          onChange: (newv /*, oldv */) => {
                                             if (newv) {
                                                $$(
                                                   this.ids.translationManager
                                                ).show();
                                                $$(
                                                   this.ids
                                                      .translationManagerToolbar
                                                ).show();
                                             } else {
                                                $$(
                                                   this.ids.translationManager
                                                ).hide();
                                                $$(
                                                   this.ids
                                                      .translationManagerToolbar
                                                ).hide();
                                             }
                                          },
                                          onItemClick: (id /*, e*/) => {
                                             var enabled = $$(id).getValue();
                                             if (enabled) {
                                                $$(
                                                   this.ids.translationManager
                                                ).show();
                                                $$(
                                                   this.ids
                                                      .translationManagerToolbar
                                                ).show();
                                             } else {
                                                $$(
                                                   this.ids.translationManager
                                                ).hide();
                                                $$(
                                                   this.ids
                                                      .translationManagerToolbar
                                                ).hide();
                                             }
                                          },
                                       },
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       view: "toolbar",
                                       id: this.ids.translationManagerToolbar,
                                       css: "ab-toolbar-submenu webix_dark",
                                       hidden:
                                          parseInt(
                                             this.translationManagement
                                          ) == 1
                                             ? false
                                             : true,
                                       cols: [
                                          {
                                             template: L(
                                                "Who can translate this app?"
                                             ),
                                             type: "header",
                                             borderless: true,
                                          },
                                          {},
                                       ],
                                    },
                                    {
                                       id: this.ids.translationManager,
                                       rows: [this.translationManagerUI.ui()],
                                       paddingY: 10,
                                       hidden:
                                          parseInt(
                                             this.translationManagement
                                          ) == 1
                                             ? false
                                             : true,
                                    },
                                    { height: uiConfig.smallSpacer },
                                    {
                                       margin: 5,
                                       cols: [
                                          { fillspace: true },
                                          {
                                             view: "button",
                                             value: L("Cancel"),
                                             width: uiConfig.buttonWidthSmall,
                                             css: "ab-cancel-button",
                                             click: () => {
                                                this.cancel();
                                             },
                                             on: {
                                                onAfterRender() {
                                                   AB.ClassUI.CYPRESS_REF(
                                                      this,
                                                      "abd_choose_form_cancel"
                                                   );
                                                },
                                             },
                                          },
                                          {
                                             id: this.ids.saveButton,
                                             view: "button",
                                             css: "webix_primary",
                                             label: L("Save"),
                                             type: "form",
                                             width: uiConfig.buttonWidthSmall,
                                             click: () => {
                                                this.buttonSaveClick();
                                             }, // end click()
                                             on: {
                                                onAfterRender() {
                                                   AB.ClassUI.CYPRESS_REF(this);
                                                },
                                             },
                                          },
                                       ],
                                    },
                                 ],
                              },
                              {
                                 hidden: uiConfig.hideMobile,
                              },
                           ],
                        },
                        {
                           maxWidth: uiConfig.appListSpacerColMaxWidth,
                           minWidth: uiConfig.appListSpacerColMinWidth,
                           width: uiConfig.appListSpacerColMaxWidth,
                        },
                     ],
                  },
               ],
            },
         };
      } // ui()

      init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);

         webix.extend(this.$form, webix.ProgressBar);
         webix.extend($$(this.ids.appFormPermissionList), webix.ProgressBar);

         // Make sure we listen for New/Updated Role information

         this.permissionPopulate();
      }

      toList() {
         this.emit("view.list");
      }

      /**
       * @function applicationCreate
       *
       * Step through the process of creating an ABApplication with the
       * current state of the Form.
       *
       * @param {obj} values 	current value hash of the form values.
       */
      async applicationCreate(values) {
         // on a CREATE, make sure .name is set:
         values.name = values.label;

         // work with a new ABApplication
         var app = this.AB.applicationNew(values);
         try {
            await app.save();
            webix.message({
               type: "success",
               text: L("{0} successfully created.", [values.label]),
            });

            // NOTE: the new App isn't actually stored in AB.applications()
            // until after the 'ab.abdefinition.created' message is returned
            // from the Server.

            // TODO: detect if our Network type is REST and then manually
            // add the Application to the AB factory.
         } catch (e) {
            webix.message({
               type: "error",
               text: L("Error creating {0}", [values.label]),
            });
            this.AB.notify.developer(e, {
               plugin: "ABDesigner",
               context: "ui_choose_form:applicationCreate()",
               values,
            });
         }
      }

      /**
       * @method applicationUpdate
       * Step through the process of updating an ABApplication with the
       * current state of the Form.
       * @param {ABApplication} application
       */
      async applicationUpdate(Application) {
         var values = this.formValues();
         // {hash} /key : value
         // the new values pulled from the form

         var oldVals = {};
         // {hash} /key : value
         // a set of the original values to reset to incase of an error saving.

         Object.keys(values).forEach((k) => {
            oldVals[k] = Application[k];
            Application[k] = values[k];
         });

         try {
            await Application.save();
            webix.message({
               type: "success",
               text: L("{0} successfully updated.", [Application.label]),
            });
         } catch (e) {
            webix.message({
               type: "error",
               text: L("Error updating {0}", [Application.label]),
            });
            this.AB.notify.developer(e, {
               context: "ui_choose_form:applicationUpdate()",
               application: Application.toObj(),
               values,
            });
            // Reset our Application to the original values.
            Object.keys(oldVals).forEach((k) => {
               Application[k] = oldVals[k];
            });
         }

         // .then(function () {
         //    next();
         // })
         // .catch(next);

         /*
               async.waterfall(
                  [
                     function (next) {
                        _logic
                           .permissionSave(Application)
                           .then(function (result) {
                              next(null, result);
                           })
                           .catch(next);
                     },
                     function (app_role, next) {
                        // Update application data
                        Application.label = values.label;
                        Application.description = values.description;
                        // Application.isAdminApp = values.isAdminApp;
                        Application.isAccessManaged = values.isAccessManaged;
                        Application.isTranslationManaged =
                           values.isTranslationManaged;
                        Application.accessManagers = accessManagers;
                        Application.translationManagers = translationManagers;

                        if (app_role && app_role.id)
                           Application.role = app_role.id;
                        else Application.role = null;

                        Application.save()
                           .then(function () {
                              next();
                           })
                           .catch(next);
                     },
                  ],
                  function (err) {
                     _logic.formReady();
                     _logic.buttonSaveEnable();
                     if (err) {
                        webix.message({
                           type: "error",
                           text: labels.common.updateErrorMessage.replace(
                              "{0}",
                              Application.label
                           ),
                        });
                        AD.error.log(
                           "App Builder : Error update application data",
                           { error: err }
                        );
                        return false;
                     }

                     App.actions.transitionApplicationList();

                     webix.message({
                        type: "success",
                        text: labels.common.updateSucessMessage.replace(
                           "{0}",
                           Application.label
                        ),
                     });
                  }
               );
*/
      }

      /**
       * @function buttonSaveClick
       * Process the user clicking on the [Save] button.
       */
      async buttonSaveClick() {
         this.buttonSaveDisable();
         this.formBusy();

         // if there is a selected Application, then this is an UPDATE
         // var updateApp = App.actions.getSelectedApplication();
         if (this.Application) {
            if (this.formValidate("update")) {
               try {
                  await this.applicationUpdate(this.Application);
                  this.toList();
               } catch (e) {
                  /* error is handled in .applicationUpdate() */
               }

               this.formReady();
               this.buttonSaveEnable();
            }
         } else {
            // else this is a Create
            if (this.formValidate("add")) {
               try {
                  await this.applicationCreate(this.formValues());
                  this.formReset();
                  this.toList();
               } catch (e) {
                  /* error is handled in .applicationCreate() */
               }
               this.formReady();
               this.buttonSaveEnable();
            }
         }
      }

      /**
       * @function buttonSaveDisable
       * Disable the save button.
       */
      buttonSaveDisable() {
         $$(this.ids.saveButton).disable();
      }

      /**
       * @function buttonSaveEnable
       * Re-enable the save button.
       */
      buttonSaveEnable() {
         $$(this.ids.saveButton).enable();
      }

      /**
       * @function cancel
       * Cancel the current Form Operation and return us to the AppList.
       */
      cancel() {
         this.formReset();
         this.toList();
         // App.actions.transitionApplicationList();
      }

      /**
       * @function createRoleButtonClick
       *
       * The user clicked the [Create Role] button.  Update the UI and add a
       * unique Application permission to our list.
       */
      // createRoleButtonClick: function () {
      //    if ($$(ids.appFormCreateRoleButton).getValue()) {
      //       // TODO: if not called from anywhere else, then move the name gathering into .permissionAddNew()
      //       // Add new app role
      //       var appName = $$(ids.form).elements["label"].getValue();
      //       _logic.permissionAddNew(appName);
      //    } else {
      //       // Remove app role
      //       _logic.permissionRemoveNew();
      //    }
      // },

      /**
       * @function formBusy
       *
       * Show the progress indicator to indicate a Form operation is in
       * progress.
       */
      formBusy() {
         this.$form.showProgress({ type: "icon" });
      }

      /**
       * @methoc formPopulate()
       * populate the form values from the given ABApplication
       * @param {ABApplication} application  instance of the ABApplication
       */
      formPopulate(application) {
         this.Application = application;

         // Populate data to form
         if (application) {
            [
               "label",
               "description",
               "isSystemObj",
               "isAccessManaged",
               "isTranslationManaged",
            ].forEach((f) => {
               if (this.$form.elements[f]) {
                  this.$form.elements[f].setValue(application[f]);
               }
            });

            var messages = this.Application.warnings().map((w) => w.message);
            $$(this.ids.warnings).setValue(messages.join("\n"));

            // populate access manager ui
            var $accessManager = $$(this.ids.accessManager);
            $accessManager.removeView($accessManager.getChildViews()[0]);
            $accessManager.addView(
               this.accessManagerUI.ui(application.accessManagers || {}),
               0
            );

            // populate translation manager ui
            var $translationManager = $$(this.ids.translationManager);
            $translationManager.removeView(
               $translationManager.getChildViews()[0]
            );
            $translationManager.addView(
               this.translationManagerUI.ui(
                  application.translationManagers || {}
               ),
               0
            );
         }

         this.permissionPopulate(application);
      }

      /**
       * @function formReady()
       *
       * remove the busy indicator from the form.
       */
      formReady() {
         this.$form.hideProgress();
      }

      /**
       * @function formReset()
       *
       * return the form to an empty state.
       */
      formReset() {
         this.Application = null;

         this.$form.clear();
         this.$form.clearValidation();

         $$(this.ids.warnings).setValue("");

         this.permissionPopulate(); // leave empty to clear selections.

         $$(this.ids.accessManager).removeView(
            $$(this.ids.accessManager).getChildViews()[0]
         );
         $$(this.ids.translationManager).removeView(
            $$(this.ids.translationManager).getChildViews()[0]
         );
         $$(this.ids.accessManager).addView(this.accessManagerUI.ui(), 0);
         $$(this.ids.translationManager).addView(
            this.translationManagerUI.ui(),
            0
         );
      }

      /**
       * @function formValidate()
       * validate the form values.
       * @param {string} op
       *        The key of the operation we are validating. Can be either
       *        "add", "update" or "destroy"
       * @return {bool}
       *         true if all values pass validation.  false otherwise.
       */
      formValidate(op) {
         // op : ['add', 'update', 'destroy']

         if (!this.$form.validate()) {
            // TODO : Error message

            this.formReady();
            this.buttonSaveEnable();
            return false;
         }

         var errors = [];

         // TODO: replace with manual checking of Application Name
         switch (op) {
            case "add":
               // make sure no other Applications have the same name.
               var values = this.formValues();
               values.name = values.label;
               var mockApp = this.AB.applicationNew(values);
               var matchingApps = [];
               (this.AB.applications() || []).forEach((app) => {
                  // NOTE: .areaKey() uses .name in a formatted way, so
                  // any matching .areaKey() would be a matching .name
                  if (app.areaKey() == mockApp.areaKey()) {
                     matchingApps.push(app);
                  }
               });
               if (matchingApps.length > 0) {
                  errors.push({
                     attr: "label",
                     msg: L("Name ({0}) is already in use.", [mockApp.label]),
                  });
               }
               break;
         }

         if (errors.length > 0) {
            var hasFocus = false;
            errors.forEach((e) => {
               this.$form.markInvalid(e.attr, e.msg);
               if (!hasFocus) {
                  this.$form.elements[e.attr].focus();
                  hasFocus = true;
               }
            });

            this.formReady();
            this.buttonSaveEnable();
            return false;
         }

         return true;
      }

      /**
       * @function formValues()
       *
       * return an object hash of name:value pairs of the current Form.
       *
       * @return {obj}
       */
      formValues() {
         // return the current values of the Form elements.
         var values = this.$form.getValues();
         values.roleAccess = $$(this.ids.appFormPermissionList).getSelectedId();
         if (!Array.isArray(values.roleAccess)) {
            values.roleAccess = [values.roleAccess];
         }
         values.accessManagers = this.accessManagerUI.values();
         values.translationManagers = this.translationManagerUI.values();
         return values;
      }

      /**
       * @function permissionAddNew
       *
       * create a new permission entry based upon the current Application.label
       *
       * This not only adds it to our Permission List, but also selects it.
       *
       * @param {string} appName	The Application.label of the current Application
       */
      // permissionAddNew: function (appName) {
      //    // add new role entry
      //    $$(ids.appFormPermissionList).add(
      //       {
      //          id: "newRole",
      //          name: _logic.permissionName(appName),
      //          isApplicationRole: true,
      //          markCheckbox: 1,
      //       },
      //       0
      //    );

      //    // Select new role
      //    var selectedIds = $$(ids.appFormPermissionList).getSelectedId(
      //       true
      //    );
      //    selectedIds.push("newRole");
      //    $$(ids.appFormPermissionList).select(selectedIds);
      // },

      /**
       * @function permissionClick
       *
       * Process when a permission entry in the list is clicked.
       */
      permissionClick(id /*, e, node*/) {
         var List = $$(this.ids.appFormPermissionList);

         var item = List.getItem(id);

         if (List.getItem(id).isApplicationRole) {
            return;
         }

         if (List.isSelected(id)) {
            item.markCheckbox = 0;
            List.unselect(id);
         } else {
            item.markCheckbox = 1;
            var selectedIds = List.getSelectedId();

            if (typeof selectedIds === "string" || !isNaN(selectedIds)) {
               if (selectedIds) selectedIds = [selectedIds];
               else selectedIds = [];
            }

            selectedIds.push(id);

            List.select(selectedIds);
            List.updateItem(id, item);
         }
      }

      /**
       * @function permissionName
       *
       * returns a formatted name for a Permission Role based upon the provided Application.label
       *
       * @param {string} appName	the current value of the Application.label
       * @return {string} 	Permission Role Name.
       */
      // permissionName(appName) {
      //    return appName + " Application Role";
      // }

      /**
       * @method permissionPopulate
       * fill out the Permission list
       * @param {ABApplication} application	the current ABApplication we are editing
       */
      permissionPopulate(application) {
         var PermForm = $$(this.ids.appFormPermissionList);
         // Get user's roles
         PermForm.showProgress({ type: "icon" });

         var availableRoles = this.AB.Account.rolesAll().map((r) => {
            return { id: r.id, name: r.name };
         });
         if (application) {
            availableRoles
               .filter((r) => application.roleAccess.indexOf(r.id) > -1)
               .map((r) => {
                  r.markCheckbox = 1;
               });
         }
         PermForm.clearAll();
         PermForm.parse(availableRoles);
         var selectedIDs = availableRoles
            .filter((r) => r.markCheckbox)
            .map((r) => r.id);
         PermForm.select(selectedIDs);
         availableRoles.forEach(function (r) {
            if (selectedIDs.indexOf(r.id) > -1) {
               var item = PermForm.getItem(r.id);
               item.markCheckbox = 1;
               PermForm.updateItem(r.id, item);
            }
         });
         PermForm.hideProgress();
      }

      /**
       * @function permissionRemoveNew()
       *
       * Intended to be called when the USER unselects the option to create a Permission
       * for this Application.
       *
       * We remove any Permission Role created for this Application.
       */
      // permissionRemoveNew: function () {
      //    // find any roles that are put here from our application form:
      //    var appRoles = $$(ids.appFormPermissionList).find(function (
      //       perm
      //    ) {
      //       return perm.isApplicationRole;
      //    });

      //    // remove them:
      //    appRoles.forEach(function (r) {
      //       $$(ids.appFormPermissionList).remove(r.id);
      //    });
      // },

      /*
       * permissionRenameRole
       *
       * When the name of the Appliction changes, change the Name of the Permission as well.
       *
       * @param {string} newValue  the current name of the application
       * @param {string} oldValue  the previous name of the application
       */
      // permissionRenameRole(newValue, oldValue) {
      //    var editRole = $$(ids.appFormPermissionList).find(function (d) {
      //       return d.name === _logic.permissionName(oldValue);
      //    });

      //    editRole.forEach(function (r) {
      //       var editItem = $$(ids.appFormPermissionList).getItem(r.id);
      //       editItem.name = _logic.permissionName(newValue);

      //       $$(ids.appFormPermissionList).updateItem(
      //          editItem.id,
      //          editItem
      //       );
      //    });
      // }

      /**
       * @function permissionSave()
       *
       * step through saving the current Permission Settings and associating
       * them with the current Application.
       *
       * @param {ABApplication} App  	The current Application we are working with.
       * @return {Promise}			.resolve( {Permission} ) if one is created for this App
       */
      // permissionSave(app) {
      //    debugger;
      //    //// REFACTOR:
      //    // this step implies that ab_choose_form understands the intracies of how
      //    // ABApplication and Permissions work.
      //    return new Promise((resolve, reject) => {
      //       var saveRoleTasks = [],
      //          appRole = null;

      //       //// Process the option to create a newRole For this Application:

      //       // if the button is set
      //       if ($$(ids.appFormCreateRoleButton).getValue()) {
      //          // check to see if we already have a permission that isApplicationRole
      //          var selectedPerms = $$(
      //             ids.appFormPermissionList
      //          ).getSelectedItem(true);
      //          selectedPerms = selectedPerms.filter((perm) => {
      //             return perm.isApplicationRole;
      //          });

      //          // if not, then create one:
      //          if (selectedPerms.length == 0) {
      //             // Create new role for application
      //             saveRoleTasks.push(function (cb) {
      //                app.createPermission()
      //                   .then(function (result) {
      //                      // remember the Role we just created
      //                      appRole = result;
      //                      cb();
      //                   })
      //                   .catch(cb);
      //             });
      //          }
      //       } else {
      //          // Delete any existing application roles
      //          saveRoleTasks.push(function (cb) {
      //             app.deletePermission()
      //                .then(function () {
      //                   cb();
      //                })
      //                .catch(cb);
      //          });
      //       }

      //       //// Now process any additional roles:

      //       // get array of selected permissions that are not our newRole
      //       var permItems = $$(ids.appFormPermissionList).getSelectedItem(
      //          true
      //       );
      //       permItems = permItems.filter(function (item) {
      //          return item.id !== "newRole";
      //       }); // Remove new role item

      //       // Make sure Application is linked to selected permission items:
      //       saveRoleTasks.push(function (cb) {
      //          // ok, so we removed the 'newRole' entry, but we might
      //          // have created an entry for it earlier, if so, add in
      //          // the created one here:
      //          if (
      //             $$(ids.appFormCreateRoleButton).getValue() &&
      //             appRole
      //          ) {
      //             // make sure it isn't already in there:
      //             var appRoleItem = permItems.filter(function (item) {
      //                return item.id == appRole.id;
      //             });
      //             if (!appRoleItem || appRoleItem.length < 1) {
      //                // if not, add it :
      //                permItems.push({
      //                   id: appRole.id,
      //                   isApplicationRole: true,
      //                });
      //             }
      //          }

      //          // Assign Role Permissions
      //          app.assignPermissions(permItems)
      //             .then(function () {
      //                cb();
      //             })
      //             .catch(cb);
      //       });

      //       async.series(saveRoleTasks, function (err, results) {
      //          if (err) {
      //             reject(err);
      //          } else {
      //             // we return the instance of the newly created Permission.
      //             resolve(appRole);
      //          }
      //       });
      //    });

      //    //// REFACTOR QUESTION:
      //    // why are we updating the app.permissions with this data structure?
      //    // where is this data structure being used?
      //    // Earlier we are using another structure (permissionAddNew()) ... how is that related to this?

      //    // // Final task
      //    // saveRoleTasks.push(function (cb) {
      //    // 	// Update store app data
      //    // 	var applicationData = self.data.filter(function (d) { return d.id == app.id; });
      //    // 	applicationData.forEach(function (app) {
      //    // 		app.attr('permissions', $.map(permItems, function (item) {
      //    // 			return {
      //    // 				application: app.id,
      //    // 				permission: item.id,
      //    // 				isApplicationRole: item.isApplicationRole
      //    // 			}
      //    // 		}));
      //    // 	});

      //    // 	q.resolve(appRole);
      //    // 	cb();
      //    // })
      // }

      /**
       * @function show()
       *
       * Show the Form Component.
       */
      show() {
         $$(this.ids.component).show();
      }

      /*
         this.actions({
            // initiate a request to create a new Application
            transitionApplicationForm: function (application) {
               // if no application is given, then this should be a [create] operation,

               // so clear our AppList
               if ("undefined" == typeof application) {
                  App.actions.unselectApplication();
               }

               // now prepare our form:
               _logic.formReset();
               if (application) {
                  // populate Form here:
                  _logic.formPopulate(application);
               }
               _logic.permissionPopulate(application);
               _logic.show();
            },
         });
         */
   }

   return new ABChooseForm();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_choose_list.js":
/*!**************************************************!*\
  !*** ./src/rootPages/Designer/ui_choose_list.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_common_popupEditMenu */ "./src/rootPages/Designer/ui_common_popupEditMenu.js");
/*
 * UI Choose List
 *
 * Display a list of Applications we can work with.
 *
 *
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   // const AppList = AB_Choose_List_Factory(AB);
   // const AppForm = AB_Choose_Form_Factory(AB);

   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   const AB_Choose_List_Menu = (0,_ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   class UIChooseList extends AB.ClassUI {
      constructor() {
         var base = "abd_choose_list";
         super(base);
         var baseTB = `${base}_toolbar`;

         var ids = {
            toolbar: baseTB,
            buttonCreateNewApplication: `${baseTB}_createnewapp`,
            uploader: `${baseTB}_uploader`,
            exporter: `${baseTB}_exporter`,
            list: `${base}_list`,
         };
         Object.keys(ids).forEach((k) => {
            this.ids[k] = ids[k];
         });
      }

      ui() {
         return {
            id: this.ids.component,
            responsive: "hide",
            type: "space",

            cols: [
               {
                  maxWidth: uiConfig.appListSpacerColMaxWidth,
                  minWidth: uiConfig.appListSpacerColMinWidth,
                  width: uiConfig.appListSpacerColMaxWidth,
               },
               {
                  responsiveCell: false,
                  rows: [
                     {
                        maxHeight: uiConfig.appListSpacerRowHeight,
                        hidden: uiConfig.hideMobile,
                     },
                     //
                     // ToolBar
                     //
                     {
                        view: "toolbar",
                        css: "webix_dark",
                        id: this.ids.toolBar,
                        cols: [
                           { view: "spacer", width: 10 },
                           {
                              view: "label",
                              label: L("Applications"),
                              fillspace: true,
                              on: {
                                 onAfterRender() {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                           // {
                           //    view: "button",
                           //    type: "icon",
                           //    label: labels.component.administration,
                           //    icon: "fa fa-user",
                           //    autowidth: true,
                           //    css: "webix_transparent",
                           //    click: () => {
                           //       App.actions.transitionAdministration();
                           //    },
                           // },

                           // {
                           //    view: "button",
                           //    type: "icon",
                           //    label: L("Settings"),
                           //    icon: "fa fa-cog",
                           //    autowidth: true,
                           //    css: "webix_transparent",
                           //    click: () => {
                           //       this.emit("view.config");
                           //    },
                           // },
                           {
                              id: this.ids.buttonCreateNewApplication,
                              view: "button",
                              label: L("Add new application"),
                              autowidth: true,
                              type: "icon",
                              icon: "fa fa-plus",
                              css: "webix_transparent",
                              click: () => {
                                 // Inform our Chooser we have a request to create an Application:
                                 this.emit("view.form", null); // leave null for CREATE
                              },
                              on: {
                                 onAfterRender() {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                           {
                              view: "uploader",
                              id: this.ids.uploader,
                              label: L("Import"),
                              autowidth: true,
                              upload: "/definition/import",
                              multiple: false,
                              type: "icon",
                              icon: "fa fa-upload no-margin",
                              autosend: true,
                              css: "webix_transparent",
                              on: {
                                 onAfterFileAdd: () => {
                                    $$(this.ids.uploader).disable();
                                 },
                                 onFileUpload: (/*item, response */) => {
                                    // the file upload process has finished
                                    // reload the page:
                                    window.location.reload();
                                    return false;
                                 },
                                 onFileUploadError: (
                                    details /*, response */
                                 ) => {
                                    // {obj} details
                                    //   .file : {obj} file details hash
                                    //   .name : {string} filename
                                    //   .size : {int} file size
                                    //   .status : {string} "error"
                                    //   .xhr :  {XHR Object}
                                    //      .responseText
                                    //      .status : {int}  404
                                    //      .statusText : {string}

                                    this.AB.notify.developer(
                                       "Error uploading file",
                                       {
                                          url: details.xhr.responseURL,
                                          status: details.status,
                                          code: details.xhr.status,
                                          response: details.xhr.responseText,
                                       }
                                    );
                                    $$(this.ids.uploader).enable();
                                    return false;
                                 },
                                 onAfterRender() {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },

                           {
                              view: "button",
                              id: this.ids.exporter,
                              label: L("Export All"), // labels.common.export,
                              autowidth: true,
                              type: "icon",
                              icon: "fa fa-download",
                              css: "webix_transparent",
                              click: function () {
                                 window.location.assign(
                                    "/definition/export/all?download=1"
                                 );
                              },
                              on: {
                                 onAfterRender() {
                                    AB.ClassUI.CYPRESS_REF(this);
                                 },
                              },
                           },
                        ],
                     },

                     //
                     // The List of Applications
                     //
                     {
                        id: this.ids.list,
                        view: "list",
                        css: "ab-app-select-list",
                        template: (obj, common) => {
                           return this.templateListItem(obj, common);
                        },
                        type: {
                           height: uiConfig.appListRowHeight, // Defines item height
                           iconGear: function (app) {
                              return `<span class="webix_icon fa fa-cog" data-cy="edit_${app.id}"></span>`;
                           },
                           iconAdmin: function (app) {
                              return app.isAdminApp
                                 ? "<span class='webix_icon fa fa-circle-o-notch'></span> "
                                 : "";
                           },
                        },
                        select: false,
                        onClick: {
                           "ab-app-list-item": (ev, id, trg) => {
                              return this.onClickListItem(ev, id, trg);
                           },
                           "ab-app-list-edit": (ev, id, trg) => {
                              return this.onClickListEdit(ev, id, trg);
                           },
                        },
                        onHover: {},
                        on: {
                           onAfterRender() {
                              this.data.each((a) => {
                                 AB.ClassUI.CYPRESS_REF(
                                    this.getItemNode(a.id),
                                    a.id
                                 );
                              });
                           },
                        },
                     },
                     {
                        maxHeight: uiConfig.appListSpacerRowHeight,
                        hidden: uiConfig.hideMobile,
                     },
                  ],
               },
               {
                  maxWidth: uiConfig.appListSpacerColMaxWidth,
                  minWidth: uiConfig.appListSpacerColMinWidth,
                  width: uiConfig.appListSpacerColMaxWidth,
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$list = $$(this.ids.list);
         // {webix.list}  The webix component that manages our Application List

         webix.extend(this.$list, webix.ProgressBar);
         webix.extend(this.$list, webix.OverlayBox);

         // Setup our popup Editor Menu for our Applications
         this.MenuComponent = new AB_Choose_List_Menu(this.ids.component);
         this.MenuComponent.init(AB);
         var options = [
            {
               label: L("Edit"), //labels.common.edit,
               icon: "fa fa-pencil-square-o",
               command: "edit",
            },
            {
               label: L("Export"), //labels.common.export,
               icon: "fa fa-download",
               command: "export",
            },
            {
               label: L("Delete"), // labels.common.delete,
               icon: "fa fa-trash",
               command: "delete",
            },
         ];
         this.MenuComponent.menuOptions(options);
         this.MenuComponent.on("click", (action) => {
            var selectedApp = this.$list.getSelectedItem();

            switch (action) {
               case "edit":
                  this.emit("edit.form", selectedApp);
                  break;

               case "delete":
                  webix.confirm({
                     title: L("Delete {0}?", [L("Application")]),
                     text: L("Do you want to delete <b>{0}</b>?", [
                        selectedApp.label,
                     ]),
                     ok: L("Yes"),
                     cancel: L("No"),
                     callback: async (result) => {
                        if (!result) return;

                        this.busy();
                        try {
                           await selectedApp.destroy();
                           this.refreshList();
                           webix.message({
                              type: "success",
                              text: L("{0} successfully deleted.", [
                                 selectedApp.label,
                              ]),
                           });
                        } catch (e) {
                           webix.message({
                              type: "error",
                              text: L("There was an error deleting {0}.", [
                                 selectedApp.label,
                              ]),
                           });
                        }
                        this.ready();
                     },
                  });
                  break;

               case "export":
                  // Download the JSON file to disk
                  window.location.assign(
                     `/definition/export/${selectedApp.id}?download=1`
                  );
                  break;
            }
         });

         // listen for the AllApplications response:
         this.AB.Network.on(
            "definitions.allapplications",
            (context, err, allDefinitions) => {
               this.ready();
               if (err) {
                  // log the error
                  this.AB.notify.developer(err, {
                     plugin: "ABDesigner",
                     context:
                        "ui_choose_list:init(): /definition/allapplications",
                  });
                  context?.reject?.(err);
                  return;
               }

               this.AB.definitionsParse(allDefinitions);

               context?.resolve?.();
            }
         );

         this._handler_reload = (def) => {
            if (def.type == "application") {
               this.loaded = false;
               this.loadData();
            }
         };
         // {fn}
         // The handler that triggers a reload of our Application List
         // when we are alerted of changes to our applications.

         // return Promise.all([AppList.init(AB) /*, AppForm.init(AB)*/]);
         return this.loadAllApps().then(() => {
            // NOTE: .loadAllApps() will generate a TON of "definition.updated"
            // events.  So add these handlers after that is all over.

            // Refresh our Application List each time we are notified of a change
            // in our Application definitions:
            this.AB.on("definition.created", this._handler_reload);
         });
      }

      //
      // Logic Methods
      //

      busy() {
         this.$list.disable();
         if (this.$list.showProgress) this.$list.showProgress({ type: "icon" });
      }

      /**
       * @method loadAllApps();
       * specifically call for loading all the available ABApplications so that a
       * builder can work with them.
       * @return {Promise}
       */
      async loadAllApps() {
         // NOTE: we only actually perform this 1x.
         // so track the _loadInProgress as our indicator of having done that.
         if (!this._loadInProgress) {
            this.busy();
            this._loadInProgress = new Promise((resolve, reject) => {
               var jobResponse = {
                  key: "definitions.allapplications",
                  context: { resolve, reject },
               };

               this.AB.Network.get(
                  {
                     url: `/definition/allapplications`,
                  },
                  jobResponse
               );
            });
         }

         return this._loadInProgress;
      }

      /**
       * @function loadData
       *
       * Load all the ABApplications and display them in our App List
       */
      async loadData() {
         await this.loadAllApps();

         if (this.loaded) return;

         this.loaded = true;

         // Get applications data from the server
         this.busy();

         // User needs Access To Role (System Designer) in order to see
         // app.isSystemObj ABApplications.
         var f = (app) => !app.isSystemObj;

         if (this.AB.Account.isSystemDesigner()) {
            f = () => true;
         }
         var allApps = this.AB.applications(f);
         this.dcEditableApplications = new webix.DataCollection({
            data: allApps || [],
         });
         // {webix.DataCollection} dcEditableApplications
         // a list of all our applications we are able to edit.

         // Now for each of our Apps, be sure to listen for either
         // .updated or .deleted and then reload our list.
         ["definition.updated", "definition.deleted"].forEach((e) => {
            allApps.forEach((a) => {
               // make sure we only have 1 listener registered.
               a.removeListener(e, this._handler_reload);
               a.on(e, this._handler_reload);
            });
         });

         this.dcEditableApplications.attachEvent(
            "onAfterAdd",
            (/* id, index */) => {
               this.refreshOverlay();
            }
         );

         this.dcEditableApplications.attachEvent(
            "onAfterDelete",
            (/* id */) => {
               this.refreshOverlay();
            }
         );

         // // TODO: we should track the order in the List and save as
         // // .sortOrder ... or .local.sortOrder
         // this.dcEditableApplications.sort("label");
         // moved to .refreshList()

         this.refreshList();
         this.ready();
      }

      /**
       * @function onClickListEdit
       * UI updates for when the edit gear is clicked
       */
      onClickListEdit(ev, id, trg) {
         // Show menu
         this.MenuComponent.show(trg);
         this.$list.select(id);

         return false; // block default behavior
      }

      /**
       * @method onClickListItem
       * An item in the list is selected. So update the workspace with that
       * object.
       */
      onClickListItem(ev, id /*, trg */) {
         this.$list.select(id);
         let selectedApp = this.$list.getItem(id);
         if (selectedApp) {
            // set the common App so it is accessible for all the Applications views
            selectedApp.App = this.AB.App;

            // We've selected an Application to work with
            this.emit("view.workplace", selectedApp);
         }
         return false; // block default behavior
      }

      /**
       * @method ready
       * remove the busy indicator on our App List
       */
      ready() {
         this.$list.enable();
         if (this.$list.hideProgress) this.$list.hideProgress();
      }

      /**
       * @method refreshList
       * Apply our list of ABApplication data to our AppList
       */
      refreshList() {
         this.$list.clearAll();
         this.$list.data.unsync();
         this.$list.data.sync(this.dcEditableApplications);
         this.$list.sort("label", "asc");
         this.refreshOverlay();
         this.$list.refresh();
         this.ready();
      }

      /**
       * @method refreshOverlay
       * If we have no items in our list, display a Message.
       */
      refreshOverlay() {
         if (!this.$list.count())
            this.$list.showOverlay(L("There is no application data"));
         else this.$list.hideOverlay();
      }

      /**
       * @method show
       * Trigger our List component to show
       */
      show() {
         super.show();

         // start things off by loading the current list of Applications
         this.loadData();
      }

      templateListItem(obj, common) {
         // JAMES: here are the warning interface:
         // obj.warnings() : Returns the warning for this specific object (Application)
         //       {array} [  { message, data } ]
         //             message: {string} A description of the warning
         //             data: {obj} An object holding related data values.
         //
         // obj.warningsAll(): Like .warnings() but will return the warnings of
         //    this object and any of it's sub objects.
         //
         //
         var numWarnings = (obj.warningsAll() || []).length;
         return `<div class='ab-app-list-item'>
   <div class='ab-app-list-info'>
      <div class='ab-app-list-name'>${common.iconAdmin(obj)}${
            obj.label ?? ""
         }(${numWarnings})</div>
      <div class='ab-app-list-description'>${obj.description ?? ""}</div>
   </div>
   <div class='ab-app-list-edit'>
      ${common.iconGear(obj)}
   </div>
</div>`;
      }
   }
   return new UIChooseList();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_common_list.js":
/*!**************************************************!*\
  !*** ./src/rootPages/Designer/ui_common_list.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_common_popupEditMenu */ "./src/rootPages/Designer/ui_common_popupEditMenu.js");
/*
 * ab_common_list
 *
 * A common interface for displaying AB category list widget
 *
 */



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var UIListEditMenu = (0,_ui_common_popupEditMenu__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Common_List extends AB.ClassUI {
      constructor(attributes) {
         // attributes.idBase = attributes.idBase || "ui_common_list";
         var base = attributes.idBase || "ui_common_list";
         super({
            component: base,
            listSetting: `${base}_listsetting`,
            list: `${base}_editlist`,
            searchText: `${base}_searchText`,
            sort: `${base}_sort`,
            group: `${base}_group`,
            buttonNew: `${base}_buttonNew`,
         });

         this.idBase = base;

         this.labels = {
            addNew: "Add new item",
            confirmDeleteTitle: "Delete Item",
            title: "Items",
            searchPlaceholder: "Item name",
            renameErrorMessage: "error renaming {0}",

            // we can reuse some of the Object ones:
            confirmDeleteMessage: "Do you want to delete <b>{0}</b>?",
            listSearch: "Search",
            listSetting: "Setting",
            listSort: "Sort",
            listAsc: "A -> Z",
            listDesc: "Z -> A",
            listGroup: "Group",
         };
         // copy in any passed in labels:
         if (attributes.labels) {
            for (var key in attributes.labels) {
               this.labels[key] = attributes.labels[key];
            }
         }
         // {lookup hash} id : Label Key
         // we allow the creating UI component to pass in alternate
         // label keys for this list.  That's how to customize the labels
         // for the current situation.

         attributes.menu = attributes.menu || {};
         attributes.menu.copy =
            typeof attributes.menu.copy == "undefined"
               ? true
               : attributes.menu.copy;
         attributes.menu.exclude =
            typeof attributes.menu.exclude == "undefined"
               ? true
               : attributes.menu.exclude;
         this.attributes = attributes;

         /*
          * _templateListItem
          *
          * The Process Row template definition.
          */
         this._templateListItem =
            attributes.templateListItem ||
            [
               "<div class='ab-object-list-item'>",
               "#label##warnings#",
               "{common.iconGear}",
               "</div>",
            ].join("");

         this.CurrentApplication = null;
         this.itemList = null;

         this._initialized = false;
         this._settings = {};
      }

      ui() {
         // the popup edit list for each entry in the list.
         this.PopupEditComponent = new UIListEditMenu(this.ids.component);

         //PopupListEditMenuComponent
         // console.log("look here------------------>", App.custom.editunitlist.view);

         var ids = this.ids;
         // for our onAfterRender() handler

         // Our webix UI definition:
         return {
            id: this.ids.component,
            rows: [
               {
                  view: AB.custom.editunitlist.view, // "editunitlist"
                  id: this.ids.list,
                  width: uiConfig.columnWidthLarge,

                  select: true,

                  editaction: "custom",
                  editable: true,
                  editor: "text",
                  editValue: "label",

                  uniteBy: (/* item */) => {
                     return L(this.labels.title);
                  },
                  template: (obj, common) => {
                     return this.templateListItem(obj, common);
                  },
                  type: {
                     height: 35,
                     headerHeight: 35,
                     iconGear: (obj) => {
                        return `<div class="ab-object-list-edit"><span class="webix_icon fa fa-cog" data-cy="${this.ids.list}_edit_${obj.id}"></span></div>`;
                     },
                  },
                  on: {
                     onAfterSelect: (id) => {
                        this.selectItem(id);
                     },
                     onBeforeEditStop: (state, editor) => {
                        this.onBeforeEditStop(state, editor);
                     },
                     onAfterEditStop: (state, editor, ignoreUpdate) => {
                        this.onAfterEditStop(state, editor, ignoreUpdate);
                     },
                     onAfterRender() {
                        this.data.each((a) => {
                           AB.ClassUI.CYPRESS_REF(
                              this.getItemNode(a.id),
                              `${ids.list}_${a.id}`
                           );
                        });
                     },
                  },
                  onClick: {
                     "ab-object-list-edit": (e, id, trg) => {
                        this.clickEditMenu(e, id, trg);
                     },
                  },
               },
               {
                  view: "accordion",
                  multi: true,
                  css: "ab-object-list-filter",
                  rows: [
                     {
                        id: this.ids.listSetting,
                        header: L(this.labels.listSetting),
                        headerHeight: 45,
                        headerAltHeight: 45,
                        body: {
                           padding: 5,
                           rows: [
                              {
                                 id: this.ids.searchText,
                                 view: "search",
                                 icon: "fa fa-search",
                                 label: L(this.labels.listSearch),
                                 labelWidth: 80,
                                 placeholder: L(this.labels.searchPlaceholder),
                                 height: 35,
                                 keyPressTimeout: 100,
                                 on: {
                                    onAfterRender() {
                                       AB.ClassUI.CYPRESS_REF(this);
                                    },
                                    onTimedKeyPress: () => {
                                       this.listSearch();
                                       this.save();
                                    },
                                 },
                              },
                              {
                                 id: this.ids.sort,
                                 view: "segmented",
                                 label: L(this.labels.listSort),
                                 labelWidth: 80,
                                 height: 35,
                                 options: [
                                    {
                                       id: "asc",
                                       value: L(this.labels.listAsc),
                                    },
                                    {
                                       id: "desc",
                                       value: L(this.labels.listDesc),
                                    },
                                 ],
                                 on: {
                                    onAfterRender() {
                                       this.$view
                                          .querySelectorAll("button")
                                          .forEach((b) => {
                                             var bid = b.getAttribute(
                                                "button_id"
                                             );
                                             AB.ClassUI.CYPRESS_REF(
                                                b,
                                                `${ids.sort}_${bid}`
                                             );
                                          });
                                    },
                                    onChange: (newVal /*, oldVal */) => {
                                       this.listSort(newVal);
                                       this.save();
                                    },
                                 },
                              },
                              {
                                 id: this.ids.group,
                                 view: "checkbox",
                                 label: L(this.labels.listGroup),
                                 labelWidth: 80,
                                 on: {
                                    onAfterRender() {
                                       AB.ClassUI.CYPRESS_REF(this);
                                    },
                                    onChange: (newVal /*, oldVal */) => {
                                       this.listGroup(newVal);
                                       this.save();
                                    },
                                 },
                              },
                           ],
                        },
                     },
                  ],
                  on: {
                     onAfterCollapse: (/* id */) => {
                        this.listSettingCollapse();
                        this.save();
                     },
                     onAfterExpand: (/* id */) => {
                        this.listSettingExpand();
                        this.save();
                     },
                  },
               },
               {
                  view: "button",
                  css: "webix_primary",
                  id: this.ids.buttonNew,
                  value: L(this.labels.addNew),
                  type: "form",
                  click: () => {
                     this.clickAddNew(true); // pass true so it will select the new object after you created it
                  },
                  on: {
                     onAfterRender() {
                        AB.ClassUI.CYPRESS_REF(this);
                     },
                  },
               },
            ],
         };
      }

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;

         if ($$(this.ids.component)) $$(this.ids.component).adjust();

         this.$list = $$(this.ids.list);
         if (this.$list) {
            webix.extend(this.$list, webix.ProgressBar);
            this.$list.adjust();
         }

         this.PopupEditComponent.init(AB, {
            // onClick: _logic.callbackProcessEditorMenu,
            hideCopy: !this.attributes.menu.copy,
            hideExclude: !this.attributes.menu.exclude,
         });

         this.PopupEditComponent.on("click", (command) => {
            var selectedItem = this.$list.getSelectedItem(false);
            switch (command) {
               case "delete":
                  this.remove();
                  break;

               case "rename":
                  this.rename();
                  break;

               case "exclude":
                  this.emit("exclude", selectedItem);
                  break;

               case "copy":
                  this.copy(selectedItem);
                  // this.emit("copy", selectedItem);
                  break;

               default:
                  this.emit("menu", {
                     command: command,
                     id: selectedItem.id,
                  });
                  break;
            }
         });

         this._settings = this.AB.Storage.get(this.idBase) || {
            objectlistIsOpen: false,
            objectlistSearchText: "",
            objectlistSortDirection: "",
            objectlistIsGroup: false,
         };

         // mark initialed
         this._initialized = true;
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Process List from the provided ABApplication
       *
       * If no ABApplication is provided, then show an empty form. (create operation)
       *
       * @param {ABApplication} application  	[optional] The current ABApplication
       *										we are working with.
       */
      // applicationLoad(application) {
      //    // this.CurrentApplication = application;
      // }

      dataLoad(data) {
         this.busy();

         // get a DataCollection of all our objects
         this.itemList = new webix.DataCollection({
            data: data,
         });

         // setup object list settings
         var $listSetting = $$(this.ids.listSetting);
         $listSetting.getParentView().blockEvent();
         $listSetting.define(
            "collapsed",
            this._settings.objectlistIsOpen != true
         );
         $listSetting.refresh();
         $listSetting.getParentView().unblockEvent();

         var $searchText = $$(this.ids.searchText);
         $searchText.blockEvent();
         $searchText.setValue(this._settings.objectlistSearchText);
         $searchText.unblockEvent();

         var $sort = $$(this.ids.sort);
         $sort.blockEvent();
         $sort.setValue(this._settings.objectlistSortDirection);
         $sort.unblockEvent();

         var $group = $$(this.ids.group);
         $group.blockEvent();
         $group.setValue(this._settings.objectlistIsGroup);
         $group.unblockEvent();

         // clear our list and display our objects:
         var List = this.$list;
         List.clearAll();
         List.data.unsync();
         List.data.sync(this.itemList);
         List.refresh();
         List.unselectAll();

         // sort objects
         this.listSort(this._settings.objectlistSortDirection);

         // filter object list
         this.listSearch();

         // hide progress loading cursor
         this.ready();
      }

      clickEditMenu(e, id, trg) {
         // Show menu
         this.PopupEditComponent.show(trg);
         return false;
      }

      /*
       * @function copy
       * make a copy of the current selected item.
       *
       * copies should have all the same .toObj() data,
       * but will need unique names, and ids.
       *
       * we start the process by making a copy and then
       * having the user enter a new label/name for it.
       *
       * our .afterEdit() routines will detect it is a copy
       * then alert the parent UI component of the "copied" data
       *
       * @param {obj} selectedItem the currently selected item in
       * 		our list.
       */
      copy(selectedItem) {
         var newItem = selectedItem.toObj();
         newItem.id = "copy_" + (this.itemList ? this.itemList.count() : "01");
         delete newItem.translations;
         newItem.name = newItem.name + " copy";
         newItem.label = newItem.name;

         // find the current index of the item being copied:
         var list = this.$list;
         var selectedIndex = list.getIndexById(list.getSelectedId());

         // insert copy in it's place and make it editable:
         list.add(newItem, selectedIndex);
         list.select(newItem.id);
         list.edit(newItem.id);
      }

      listSettingCollapse() {
         this._settings.objectlistIsOpen = false;
      }

      listSettingExpand() {
         this._settings.objectlistIsOpen = true;
      }

      busy() {
         this.$list?.showProgress?.({ type: "icon" });
      }

      ready() {
         this.$list?.hideProgress?.();
      }

      listSearch() {
         var searchText = $$(this.ids.searchText).getValue().toLowerCase();

         this.$list.filter(function (item) {
            return (
               !item.label || item.label.toLowerCase().indexOf(searchText) > -1
            );
         });

         this._settings.objectlistSearchText = searchText;
      }

      listSort(sortType) {
         if (this.itemList == null) return;
         this.itemList.sort("label", sortType);
         this.listSearch();
         this._settings.objectlistSortDirection = sortType;
      }

      listGroup(isGroup) {
         if (isGroup == true) {
            this.$list.define("uniteBy", (item) => {
               return item.label.toUpperCase().substr(0, 1);
            });
         } else {
            this.$list.define("uniteBy", (/* item */) => {
               return L(this.labels.title);
            });
         }
         this.$list.refresh();
         this._settings.objectlistIsGroup = isGroup;
      }

      listCount() {
         if (this.$list) return this.$list.count();
      }

      onAfterEditStop(state, editor /*, ignoreUpdate */) {
         this.showGear(editor.id);

         if (state.value != state.old) {
            this.busy();

            var selectedItem = this.$list.getSelectedItem(false);
            selectedItem.label = state.value;

            // if this item supports .save()
            if (selectedItem.save) {
               // Call server to rename
               selectedItem
                  .save()
                  .catch((err) => {
                     this.ready();

                     webix.alert({
                        title: L("Alert"),
                        text: L(this.labels.renameErrorMessage, state.old),
                     });
                     this.AB.notify.developer(err, {
                        context:
                           "ui_common_list:onAfterEditStop():Error saving item.",
                        id: selectedItem.id,
                        value: state.value,
                     });
                  })
                  .then(() => {
                     this.ready();
                  });
            } else {
               // maybe this is from a .copy() command:
               if (selectedItem.id.indexOf("copy_") == 0) {
                  // if so, then our default name should be what
                  // the label is:
                  selectedItem.name = selectedItem.label;
                  var currID = selectedItem.id;

                  // remove our temp id
                  delete selectedItem.id;

                  // alert the parent UI of the copied data:
                  this.emit("copied", {
                     item: selectedItem,
                     currID: currID,
                  });
               }
            }
         }
      }

      onBeforeEditStop(state /*, editor */) {
         var selectedItem = this.$list.getSelectedItem(false);
         selectedItem.label = state.value;

         // if this item supports isValid()
         if (selectedItem.isValid) {
            var validator = selectedItem.isValid();
            if (validator.fail()) {
               selectedItem.label = state.old;

               return false; // stop here.
            }
         }

         return true;
      }

      /**
       * @function save()
       *
       */
      save() {
         // if this UI has not been initialed, then skip it
         if (!this._initialized) return;

         // CurrentApplication.save();
         this.AB.Storage.set(this.idBase, this._settings);
      }

      /**
       * @function selectItem()
       *
       * Perform these actions when an Process is selected in the List.
       */
      selectItem(id) {
         var process = this.$list.getItem(id);

         // _logic.callbacks.onChange(object);
         this.emit("selected", process);

         this.showGear(id);
      }

      showGear(id) {
         let $item = this.$list.getItemNode(id);
         if ($item) {
            let gearIcon = $item.querySelector(".ab-object-list-edit");
            if (gearIcon) {
               gearIcon.style.visibility = "visible";
               gearIcon.style.display = "block";
            }
         }
      }

      /**
       * @function templateListItem
       *
       * Defines the template for each row of our ProcessList.
       *
       * @param {obj} obj the current instance of ABProcess for the row.
       * @param {?} common the webix.common icon data structure
       * @return {string}
       */
      templateListItem(obj, common) {
         var warnings = obj.warningsAll();
         var warnText = "";
         if (warnings.length > 0) {
            warnText = `(${warnings.length})`;
         }
         return this._templateListItem
            .replace("#label#", obj.label || "??label??")
            .replace("{common.iconGear}", common.iconGear(obj))
            .replace("#warnings#", warnText);
      }

      /**
       * @function callbackNewProcess
       *
       * Once a New Process was created in the Popup, follow up with it here.
       */
      // callbackNewProcess:function(err, object, selectNew, callback){

      // 	if (err) {
      // 		OP.Error.log('Error creating New Process', {error: err});
      // 		return;
      // 	}

      // 	let objects = CurrentApplication.objects();
      // 	itemList.parse(objects);

      // 	// if (processList.exists(object.id))
      // 	// 	processList.updateItem(object.id, object);
      // 	// else
      // 	// 	processList.add(object);

      // 	if (selectNew != null && selectNew == true) {
      // 		$$(ids.list).select(object.id);
      // 	}
      // 	else if (callback) {
      // 		callback();
      // 	}

      // },

      /**
       * @function clickAddNew
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickAddNew(selectNew) {
         this.emit("addNew", selectNew);
      }

      /**
       * @function exclude()
       *
       * alert calling UI that a list item was chosen for "exclude"
       */
      exclude() {
         var item = this.$list.getSelectedItem(false);
         this.emit("exclude", item);
      }

      rename() {
         var itemId = this.$list.getSelectedId(false);
         this.$list.edit(itemId);
      }

      remove() {
         var selectedItem = this.$list.getSelectedItem(false);

         // verify they mean to do this:
         webix.confirm({
            title: L(this.labels.confirmDeleteTitle),
            text: L(this.labels.confirmDeleteMessage, [selectedItem.label]),
            ok: L("Yes"),
            cancel: L("No"),
            callback: async (isOK) => {
               if (isOK) {
                  this.busy();

                  try {
                     await selectedItem.destroy();
                     this.ready();
                     this.itemList.remove(selectedItem.id);

                     // let the calling component know about
                     // the deletion:
                     this.emit("deleted", selectedItem);

                     // clear object workspace
                     this.emit("selected", null);
                  } catch (e) {
                     this.AB.notify.developer(e, {
                        context: "ui_common_list:remove(): error removing item",
                     });
                     this.ready();
                  }
               }
            },
         });
      }

      select(id) {
         this.$list.select(id);
      }

      callbackProcessEditorMenu(action) {
         switch (action) {
            case "rename":
               this.rename();
               break;
            case "exclude":
               this.exclude();
               break;
            case "delete":
               this.remove();
               break;
         }
      }

      // Expose any globally accessible Actions:
      // this.actions({
      //    /**
      //     * @function getSelectedProcess
      //     *
      //     * returns which ABProcess is currently selected.
      //     * @return {ABProcess}  or {null} if nothing selected.
      //     */
      //    getSelectedProcess: function () {
      //       return $$(ids.list).getSelectedItem();
      //    },

      //    addNewProcess: function (selectNew, callback) {
      //       _logic.clickNewProcess(selectNew, callback);
      //    },
      // });
   }

   // NOTE: We are returning the Class here, not an instance:
   return UI_Common_List;
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_common_popupEditMenu.js":
/*!***********************************************************!*\
  !*** ./src/rootPages/Designer/ui_common_popupEditMenu.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * ab_common_popupEditMenu
 *
 * Many of our Lists offer a gear icon that allows a popup menu to select
 * a set of options for this entry.  This is a common Popup Editor for those
 * options.
 *
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class ABCommonPopupEditMenu extends AB.ClassUI {
      constructor(contextID) {
         var idBase = "abd_common_popupEditMenu";
         super(idBase);

         this.labels = {
            copy: L("Copy"),
            exclude: L("Exclude"),
            rename: L("Rename"),
            delete: L("Delete"),
         };

         // var labels = {
         //    common: App.labels,

         //    component: {
         //       copy: L("ab.page.copy", "*Copy"),
         //       exclude: L("ab.object.exclude", "*Exclude"),

         //       menu: L("ab.application.menu", "*Application Menu"),
         //       confirmDeleteTitle: L(
         //          "ab.application.delete.title",
         //          "*Delete application"
         //       ),
         //       confirmDeleteMessage: L(
         //          "ab.application.delete.message",
         //          "*Do you want to delete <b>{0}</b>?"
         //       )
         //    }
         // };

         // since multiple instances of this component can exists, we need to
         // make each instance have unique ids => so add webix.uid() to them:
         // var uid = webix.uid();
         // var ids = {
         //    menu: this.unique("menu") + uid,
         //    list: this.unique("list") + uid
         // };

         this.ids.menu = `${idBase}_menu_${contextID}`;
         this.ids.list = `${idBase}_list_${contextID}`;

         this.Popup = null;
         this._menuOptions = [
            {
               label: L("Rename"),
               icon: "fa fa-pencil-square-o",
               command: "rename",
            },
            {
               label: L("Copy"),
               icon: "fa fa-files-o",
               command: "copy",
            },
            {
               label: L("Exclude"),
               icon: "fa fa-reply",
               command: "exclude",
            },
            {
               label: L("Delete"),
               icon: "fa fa-trash",
               command: "delete",
            },
         ];
      }

      ui() {
         return {
            view: "popup",
            id: this.ids.menu,
            head: L("Application Menu"), // labels.component.menu,
            width: 120,
            body: {
               view: "list",
               id: this.ids.list,
               borderless: true,
               data: [],
               datatype: "json",
               template: "<i class='fa #icon#' aria-hidden='true'></i> #label#",
               autoheight: true,
               select: false,
               on: {
                  onItemClick: (timestamp, e, trg) => {
                     return this.onItemClick(trg);
                  },
               },
            },
         };
      }

      async init(AB, options) {
         options = options || {};

         if (this.Popup == null) this.Popup = webix.ui(this.ui()); // the current instance of this editor.

         // we reference $$(this.ids.list) alot:
         this.$list = $$(this.ids.list);

         this.hide();
         this.menuOptions(this._menuOptions);

         // register our callbacks:
         // for (var c in _logic.callbacks) {
         //    if (options && options[c]) {
         //       _logic.callbacks[c] = options[c] || _logic.callbacks[c];
         //    }
         // }

         // hide "copy" item
         if (options.hideCopy) {
            let itemCopy = this.$list.data.find(
               (item) => item.label == this.labels.copy
            )[0];
            if (itemCopy) {
               this.$list.remove(itemCopy.id);
               this.$list.refresh();
            }
         }

         // hide "exclude" item
         if (options.hideExclude) {
            let hideExclude = this.$list.data.find(
               (item) => item.label == this.labels.exclude
            )[0];
            if (hideExclude) {
               this.$list.remove(hideExclude.id);
               this.$list.refresh();
            }
         }
      }

      /**
       * @function menuOptions
       * override the set of menu options.
       * @param {array} menuOptions an array of option entries:
       *				  .label {string} multilingual label of the option
       *				  .icon  {string} the font awesome icon reference
       *				  .command {string} the command passed back when selected.
       */
      menuOptions(menuOptions) {
         this.$list.clearAll();

         this._menuOptions = menuOptions;
         var data = [];
         menuOptions.forEach((mo) => {
            data.push({ label: mo.label, icon: mo.icon });
         });
         this.$list.parse(data);
         this.$list.refresh();
      }

      /**
       * @function onItemClick
       * process which item in our popup was selected.
       */
      onItemClick(itemNode) {
         // hide our popup before we trigger any other possible UI animation: (like .edit)
         // NOTE: if the UI is animating another component, and we do .hide()
         // while it is in progress, the UI will glitch and give the user whiplash.

         var label = itemNode.textContent.trim();
         var option = this._menuOptions.filter((mo) => {
            return mo.label == label;
         })[0];
         if (option) {
            // this._logic.callbacks.onClick(option.command);
            this.emit("click", option.command);
         }

         this.hide();
         return false;
      }

      show(itemNode) {
         if (this.Popup && itemNode) this.Popup.show(itemNode);
      }

      hide() {
         if (this.Popup) this.Popup.hide();
      }
   }

   // NOTE: return JUST the class definition.
   return ABCommonPopupEditMenu;
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work.js":
/*!*******************************************!*\
  !*** ./src/rootPages/Designer/ui_work.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_work_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_work_object */ "./src/rootPages/Designer/ui_work_object.js");
/*
 * ab_work
 *
 * Display the component for working with an ABApplication.
 *
 */


// const AB_Work_Query = require("./ab_work_query");
// const AB_Work_Datacollection = require("./ab_work_dataview");
// const AB_Work_Process = require("./ab_work_process");
// const AB_Work_Interface = require("./ab_work_interface");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var AppObjectWorkspace = (0,_ui_work_object__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // var AppQueryWorkspace = new AB_Work_Query(App);
   // var AppDatacollectionWorkspace = new AB_Work_Datacollection(App);
   // var AppProcessWorkspace = new AB_Work_Process(App);
   // var AppInterfaceWorkspace = new AB_Work_Interface(App);

   class UI_Work extends AB.ClassUI {
      constructor(options = {}) {
         var base = "abd_work";
         super({
            component: `${base}_component`,
            toolBar: `${base}_toolbar`,
            labelAppName: `${base}_label_appname`,
            tabbar: `${base}_tabbar`,
            tab_object: `${base}_tab_object`,
            tab_query: `${base}_tab_query`,
            tab_dataview: `${base}_tab_dataview`,
            tab_processview: `${base}_tab_processview`,
            tab_interface: `${base}_tab_interface`,
            workspace: `${base}_workspace`,
            collapseMenu: `${base}_collapseMenu`,
            expandMenu: `${base}_expandMenu`,
         });

         this.options = options;

         this.selectedItem = this.ids.tab_object;
         // {string} {this.ids.xxx}
         // Keep track of the currently selected Tab Item (Object, Query, etc)
      } // constructor

      /**
       * @method ui()
       * Return the webix definition of the UI we are managing.
       * @return {json}
       */
      ui() {
         var sidebarItems = [
            {
               id: this.ids.tab_object,
               value: L("Objects"),
               icon: "fa fa-fw fa-database",
            },
            {
               id: this.ids.tab_query,
               value: L("Queries"),
               icon: "fa fa-fw fa-filter",
            },
            {
               id: this.ids.tab_dataview,
               value: L("Data Collections"),
               icon: "fa fa-fw fa-table",
            },
            {
               id: this.ids.tab_processview,
               value: L("Process"),
               icon: "fa fa-fw fa-code-fork",
            },
            {
               id: this.ids.tab_interface,
               value: L("Interface"),
               icon: "fa fa-fw fa-id-card-o",
            },
         ];

         var expandMenu = (this.expandMenu = {
            id: this.ids.expandMenu,
            value: L("Expand Menu"),
            icon: "fa fa-fw fa-chevron-circle-right",
         });

         var collapseMenu = {
            id: this.ids.collapseMenu,
            value: L("Collapse Menu"),
            icon: "fa fa-fw fa-chevron-circle-left",
         };

         return {
            id: this.ids.component,
            rows: [
               {
                  view: "toolbar",
                  id: this.ids.toolBar,
                  autowidth: true,
                  elements: [
                     {
                        view: "button",
                        css: "webix_transparent",
                        label: L("Back to Applications page"),
                        autowidth: true,
                        align: "left",
                        type: "icon",
                        icon: "fa fa-arrow-left",
                        align: "left",
                        hidden: this.options?.IsBackHidden ?? false, // hide this button in the admin lve page
                        click: () => {
                           this.emit("view.chooser");
                           // App.actions.transitionApplicationChooser();
                        },
                     },
                     // {
                     // 	view: "button",
                     // 	type: "icon",
                     // 	icon: "fa fa-bars",
                     // 	width: 37,
                     // 	align: "left",
                     // 	css: "app_button",
                     // 	click: function(){
                     // 		$$(ids.tabbar).toggle();
                     // 	}
                     // },
                     {},
                     {
                        view: "label",
                        css: "appTitle",
                        id: this.ids.labelAppName,
                        align: "center",
                     },
                     {},
                  ],
               },
               //{ height: App.config.mediumSpacer },
               // {
               // 	view:"segmented",
               // 	id: ids.tabbar,
               // 	value: ids.tab_object,
               // 	multiview: true,
               // 	align: "center",
               // 	options:[
               // 		{
               // 			id: ids.tab_object,
               // 			value: labels.component.objectTitle,
               // 			width: App.config.tabWidthMedium
               // 		},
               // 		{
               // 			id: ids.tab_interface,
               // 			value: labels.component.interfaceTitle,
               // 			width: App.config.tabWidthMedium
               // 		}
               // 	],
               // 	on: {
               // 		onChange: function (idNew, idOld) {
               // 			if (idNew != idOld) {
               // 				_logic.tabSwitch(idNew, idOld);
               // 			}
               // 		}
               // 	}
               // },
               {
                  cols: [
                     {
                        css: "webix_dark",
                        view: "sidebar",
                        id: this.ids.tabbar,
                        width: 160,
                        data: sidebarItems.concat(collapseMenu),
                        on: {
                           onAfterSelect: (id) => {
                              if (id == this.ids.collapseMenu) {
                                 setTimeout(() => {
                                    this.$tabbar.remove(this.ids.collapseMenu);
                                    this.$tabbar.add(expandMenu);
                                    this.$tabbar.toggle();
                                    this.$tabbar.select(this.selectedItem);
                                    this.saveState();
                                 }, 0);
                              } else if (id == this.ids.expandMenu) {
                                 setTimeout(() => {
                                    this.$tabbar.remove(this.ids.expandMenu);
                                    this.$tabbar.add(collapseMenu);
                                    this.$tabbar.toggle();
                                    this.$tabbar.select(this.selectedItem);
                                    this.saveState();
                                 }, 0);
                              } else {
                                 this.tabSwitch(id);
                                 this.selectedItem = id;
                              }
                           },
                        },
                     },
                     {
                        id: this.ids.workspace,
                        cells: [
                           AppObjectWorkspace.ui(),
                           // AppQueryWorkspace.ui,
                           // AppDatacollectionWorkspace.ui,
                           // AppProcessWorkspace.ui,
                           // AppInterfaceWorkspace.ui,
                        ],
                     },
                  ],
               },
            ],
         };
      } // ui()

      /**
       * @method init()
       * Initialize the State of this widget
       * @param {ABFactory} AB
       * @return {Promise}
       */
      async init(AB) {
         this.AB = AB;

         AppObjectWorkspace.init(AB);
         // AppQueryWorkspace.init(AB);
         // AppDatacollectionWorkspace.init(AB);
         // AppProcessWorkspace.init(AB);
         // AppInterfaceWorkspace.init(AB);

         this.$tabbar = $$(this.ids.tabbar);

         // initialize the Object Workspace to show first.
         var state = this.AB.Storage.get(this.ids.component);
         if (state) {
            this.$tabbar.setState(state);

            if (state.collapsed) {
               setTimeout(() => {
                  this.$tabbar.remove(this.ids.collapseMenu);
                  this.$tabbar.add(this.expandMenu);
               }, 0);
            }
         }

         this.tabSwitch(this.ids.tab_object);
         this.$tabbar.select(this.ids.tab_object);
      } // init()

      /**
       * @method applicationInit()
       * Store the current ABApplication we are working with.
       * @param {ABApplication} application
       */
      applicationInit(application) {
         // setup Application Label:
         var $labelAppName = $$(this.ids.labelAppName);
         $labelAppName.define("label", application.label);
         $labelAppName.refresh();
      }

      /**
       * @method saveState()
       * Save the state of this tabbar to local storage.
       */
      saveState() {
         this.AB.Storage.set(this.ids.component, this.$tabbar.getState());
      }

      /**
       * @method show()
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
         let tabId = this.$tabbar.getSelectedId();
         this.tabSwitch(tabId);
      }

      /**
       * @method transitionWorkspace
       * Switch the UI to view the App Workspace screen.
       * @param {ABApplication} application
       */
      transitionWorkspace(application) {
         this.applicationInit(application);
         AppObjectWorkspace.applicationLoad(application);
         // AppQueryWorkspace.applicationLoad(application);
         // AppDatacollectionWorkspace.applicationLoad(application);
         // AppProcessWorkspace.applicationLoad(application);
         // AppInterfaceWorkspace.applicationLoad(application);

         this.show();
      }

      /**
       * @method tabSwitch
       * Every time a tab switch happens, decide which workspace to show.
       * @param {string} idTab
       *        the id of the tab that was changed to.
       */
      tabSwitch(idTab) {
         switch (idTab) {
            // Object Workspace Tab
            case this.ids.tab_object:
               AppObjectWorkspace.show();
               break;

            // Query Workspace Tab
            case this.ids.tab_query:
               AppQueryWorkspace.show();
               break;

            // Datacollection Workspace Tab
            case this.ids.tab_dataview:
               AppDatacollectionWorkspace.show();
               break;

            // Process Workspace Tab
            case this.ids.tab_processview:
               AppProcessWorkspace.show();
               break;

            // Interface Workspace Tab
            case this.ids.tab_interface:
               AppInterfaceWorkspace.show();
               break;

            // Interface Workspace Tab
            case "interface":
               AppInterfaceWorkspace.show();
               this.$tabbar.select(this.ids.tab_interface);
               break;
         }
      }
   } // class UI_Work

   return new UI_Work();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object.js":
/*!**************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_work_object_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_work_object_list */ "./src/rootPages/Designer/ui_work_object_list.js");
/* harmony import */ var _ui_work_object_workspace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object_workspace */ "./src/rootPages/Designer/ui_work_object_workspace.js");
/*
 * ui_work_object
 *
 * Display the Object Tab UI:
 *
 */




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var ObjectList = (0,_ui_work_object_list__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   var ObjectWorkspace = (0,_ui_work_object_workspace__WEBPACK_IMPORTED_MODULE_1__["default"])(
      AB
      /* leave empty for default settings */
   );

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object extends AB.ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         super("ab_work_object");

         this.CurrentApplication = null;
         // {ABApplication}
         // The current ABApplication we are working with.
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            type: "space",
            margin: 10,
            cols: [ObjectList.ui(), { view: "resizer" }, ObjectWorkspace.ui()],
         };
      }

      init(AB) {
         this.AB = AB;

         // Our init() function for setting up our UI

         ObjectList.on("selected", (obj) => {
            if (obj == null) ObjectWorkspace.clearObjectWorkspace();
            else ObjectWorkspace.populateObjectWorkspace(obj);
         });

         ObjectWorkspace.on("addNew", (selectNew) => {
            ObjectList.emit("addNew", selectNew);
         });

         return Promise.all([ObjectWorkspace.init(AB), ObjectList.init(AB)]);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Object Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplication = application;

         ObjectWorkspace.clearObjectWorkspace();
         ObjectList.applicationLoad(application);
         ObjectWorkspace.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();

         if (this.CurrentApplication) {
            ObjectList?.applicationLoad(this.CurrentApplication);
         }
         ObjectList?.ready();
      }
   }

   return new UI_Work_Object();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_list.js":
/*!*******************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_list.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_common_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_common_list */ "./src/rootPages/Designer/ui_common_list.js");
/* harmony import */ var _ui_work_object_list_newObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_work_object_list_newObject */ "./src/rootPages/Designer/ui_work_object_list_newObject.js");
/*
 * ui_work_object_list
 *
 * Manage the ABObject List
 *
 */



// const ABProcess = require("../classes/platform/ABProcess");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var UI_COMMON_LIST = (0,_ui_common_list__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);

   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var AddForm = new _ui_work_object_list_newObject__WEBPACK_IMPORTED_MODULE_1__["default"](AB);
   // the popup form for adding a new process

   class UI_Work_Object_List extends AB.ClassUI {
      constructor() {
         super("ui_work_object_list");

         this.CurrentApplication = null;
         var processList = null;

         this.ListComponent = new UI_COMMON_LIST({
            idBase: this.ids.component,
            labels: {
               addNew: "Add new object",
               confirmDeleteTitle: "Delete Object",
               title: "Objects",
               searchPlaceholder: "Object name",
            },
            // we can overrid the default template like this:
            // templateListItem:
            //    "<div class='ab-object-list-item'>#label##warnings#{common.iconGear}</div>",
            menu: {
               copy: false,
               exclude: true,
            },
         });
         // {ui_common_list} instance to display a list of our objects.
      }

      // Our webix UI definition:
      ui() {
         return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(AB, options) {
         this.AB = AB;

         this.on("addNew", (selectNew) => {
            // if we receive a signal to add a new Object from another source
            // like the blank object workspace offering an Add New button:
            this.clickNewProcess(selectNew);
         });

         //
         // List of Processes
         //
         await this.ListComponent.init(AB);

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item);
         });

         this.ListComponent.on("addNew", (selectNew) => {
            this.clickNewProcess(selectNew);
         });

         this.ListComponent.on("deleted", (item) => {
            this.emit("deleted", item);
         });

         this.ListComponent.on("exclude", (item) => {
            this.exclude(item);
         });

         this.ListComponent.on("copied", (data) => {
            this.copy(data);
         });

         // ListComponent.on("menu", (data)=>{
         // 	console.log(data);
         // 	switch (data.command) {
         // 		case "exclude":
         // 			this._logic.exclude(process);
         // 			break;

         // 		case "copy":
         // 			break;
         // 	}
         // })

         //
         // Add Form
         //
         await AddForm.init(AB);

         AddForm.on("cancel", () => {
            AddForm.hide();
         });

         AddForm.on("save", (obj, select) => {
            // the AddForm already takes care of updating the
            // CurrentApplication.

            // we just need to update our list of objects
            this.applicationLoad(this.CurrentApplication);

            // if (select) {
            this.ListComponent.select(obj.id);
            // }
         });

         this._handler_refreshApp = (def) => {
            this.CurrentApplication = this.CurrentApplication.refreshInstance();
            this.applicationLoad(this.CurrentApplication);
         };
      }

      addNew() {
         console.error("!! Who is calling this?");
         this.clickNewProcess(true);
      }

      /**
       * @function applicationLoad
       * Initialize the List from the provided ABApplication
       * If no ABApplication is provided, then show an empty form. (create operation)
       * @param {ABApplication} application
       *        [optional] The current ABApplication we are working with.
       */
      applicationLoad(application) {
         var events = ["definition.updated", "definition.deleted"];
         if (this.CurrentApplication) {
            // remove current handler
            events.forEach((e) => {
               this.CurrentApplication.removeListener(
                  e,
                  this._handler_refreshApp
               );
            });
         }
         this.CurrentApplication = application;
         if (this.CurrentApplication) {
            events.forEach((e) => {
               this.CurrentApplication.on(e, this._handler_refreshApp);
            });
         }

         // NOTE: only include System Objects if the user has permission
         var f = (obj) => !obj.isSystemObject;
         if (this.AB.Account.isSystemDesigner()) {
            f = () => true;
         }
         this.ListComponent.dataLoad(application?.objectsIncluded(f));

         AddForm.applicationLoad(application);
      }

      /**
       * @function callbackNewProcess
       *
       * Once a New Process was created in the Popup, follow up with it here.
       */
      // callbackNewProcess(err, object, selectNew, callback) {
      //    debugger;
      //    if (err) {
      //       OP.Error.log("Error creating New Process", { error: err });
      //       return;
      //    }

      //    let objects = this.CurrentApplication.objects();
      //    processList.parse(objects);

      //    // if (processList.exists(object.id))
      //    // 	processList.updateItem(object.id, object);
      //    // else
      //    // 	processList.add(object);

      //    if (selectNew != null && selectNew == true) {
      //       $$(ids.list).select(object.id);
      //    } else if (callback) {
      //       callback();
      //    }
      // }

      /**
       * @function clickNewProcess
       *
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewProcess(selectNew) {
         // show the new popup
         AddForm.show();
      }

      /*
       * @function copy
       * the list component notified us of a copy action and has
       * given us the new data for the copied item.
       *
       * now our job is to create a new instance of that Item and
       * tell the list to display it
       */
      copy(data) {
         debugger;
         this.ListComponent.busy();

         this.CurrentApplication.processCreate(data.item).then((newProcess) => {
            this.ListComponent.ready();
            this.ListComponent.dataLoad(this.CurrentApplication.processes());
            this.ListComponent.select(newProcess.id);
         });
      }

      /*
       * @function exclude
       * the list component notified us of an exclude action and which
       * item was chosen.
       *
       * perform the removal and update the UI.
       */
      async exclude(item) {
         this.ListComponent.busy();
         await this.CurrentApplication.objectRemove(item);
         this.ListComponent.dataLoad(this.CurrentApplication.objectsIncluded());

         // this will clear the object workspace
         this.emit("selected", null);
      }

      ready() {
         this.ListComponent.ready();
      }
      // Expose any globally accessible Actions:
      // this.actions({
      //    /**
      //     * @function getSelectedProcess
      //     *
      //     * returns which ABProcess is currently selected.
      //     * @return {ABProcess}  or {null} if nothing selected.
      //     */
      //    getSelectedProcess: function () {
      //       return $$(ids.list).getSelectedItem();
      //    },

      //    addNewProcess: function (selectNew, callback) {
      //       _logic.clickNewProcess(selectNew, callback);
      //    },
      // });
   }
   return new UI_Work_Object_List();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_list_newObject.js":
/*!*****************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_list_newObject.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ui_work_object_list_newObject_blank__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_work_object_list_newObject_blank */ "./src/rootPages/Designer/ui_work_object_list_newObject_blank.js");
/*
 * ui_work_object_list_newObject
 *
 * Display the form for creating a new Object.  This Popup will manage several
 * different sub components for gathering Object data for saving.
 *
 * The sub components will gather the data for the object and do basic form
 * validations on their interface.
 *
 * when ready, the sub component will emit "save" with the values gathered by
 * the form.  This component will manage the actual final object validation,
 * and saving to this application.
 *
 * On success, "save.success" will be emitted on the sub-component, and this
 * component.
 *
 * On Error, "save.error" will be emitted on the sub-component.
 *
 */


// const ABCsvObject = require("./ab_work_object_list_newObject_csv");
// const ABImportObject = require("./ab_work_object_list_newObject_import");
// const ABImportExternal = require("./ab_work_object_list_newObject_external");
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_List_NewObject extends AB.ClassUI {
      //.extend(idBase, function(App) {

      constructor() {
         var base = "ab_work_object_list_newObject";
         super({
            component: base,
            tab: `${base}_tab`,
         });

         this.currentApplication = null;
         // {ABApplication} the ABApplication we are currently working on.

         this.selectNew = true;
         // {bool} do we select a new object after it is created.

         // var callback = null;

         this.BlankTab = (0,_ui_work_object_list_newObject_blank__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
         /*
         this.CsvTab = new ABCsvObject(AB);
         this.ImportTab = new ABImportObject(AB);
         this.ExternalTab = new ABImportExternal(AB);
         */
      }

      ui() {
         // Our webix UI definition:
         return {
            view: "window",
            id: this.ids.component,
            // width: 400,
            position: "center",
            modal: true,
            head: L("Add new object"),
            selectNewObject: true,
            body: {
               view: "tabview",
               id: this.ids.tab,
               cells: [
                  this.BlankTab.ui() /*, this.CsvTab.ui(), this.ImportTab.ui(), this.ExternalTab.ui() */,
               ],
               tabbar: {
                  on: {
                     onAfterTabClick: (id) => {
                        this.switchTab(id);
                     },
                     onAfterRender() {
                        this.$view
                           .querySelectorAll(".webix_item_tab")
                           .forEach((t) => {
                              var tid = t.getAttribute("button_id");
                              AB.ClassUI.CYPRESS_REF(t, `${tid}_tab`);
                           });
                     },
                  },
               },
            },
            on: {
               onBeforeShow: () => {
                  var id = $$(this.ids.tab).getValue();
                  this.switchTab(id);
               },
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         webix.ui(this.ui());
         webix.extend($$(this.ids.component), webix.ProgressBar);

         this.$component = $$(this.ids.component);

         var allInits = [];
         ["BlankTab" /*, "CsvTab", "ImportTab", "ExternalTab"*/].forEach(
            (k) => {
               allInits.push(this[k].init(AB));
               this[k].on("cancel", () => {
                  this.emit("cancel");
               });
               this[k].on("save", (values) => {
                  this.save(values, k);
               });
            }
         );

         return Promise.all(allInits);
      }

      /**
       * @method applicationLoad()
       * prepare ourself with the current application
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.currentApplication = application; // remember our current Application.
      }

      /**
       * @function hide()
       *
       * remove the busy indicator from the form.
       */
      hide() {
         if (this.$component) this.$component.hide();
      }

      /**
       * Show the busy indicator
       */
      busy() {
         if (this.$component) {
            this.$component.showProgress();
         }
      }

      /**
       * Hide the busy indicator
       */
      ready() {
         if (this.$component) {
            this.$component.hideProgress();
         }
      }

      /**
       * @method done()
       * Finished saving, so hide the popup and clean up.
       * @param {object} obj
       */
      done(obj) {
         this.ready();
         this.hide(); // hide our popup
         this.emit("save", obj, this.selectNew);
         // _logic.callbacks.onDone(null, obj, selectNew, callback); // tell parent component we're done
      }

      /**
       * @method save
       * take the data gathered by our child creation tabs, and
       * add it to our current application.
       * @param {obj} values  key=>value hash of model values.
       * @param {string}  tabKey
       *        the "key" of the tab initiating the save.
       * @return {Promise}
       */
      async save(values, tabKey) {
         // must have an application set.
         if (!this.currentApplication) {
            webix.alert({
               title: L("Shoot!"),
               test: L("No Application Set!  Why?"),
            });
            this[tabKey].emit("save.error", true);
            return false;
         }

         // create a new (unsaved) instance of our object:
         var newObject = this.AB.objectNew(values);

         // have newObject validate it's values.
         var validator = newObject.isValid();
         if (validator.fail()) {
            this[tabKey].emit("save.error", validator);
            // cb(validator); // tell current Tab component the errors
            return false; // stop here.
         }

         if (!newObject.createdInAppID) {
            newObject.createdInAppID = this.currentApplication.id;
         }

         // show progress
         this.busy();

         // if we get here, save the new Object
         try {
            var obj = await newObject.save();
            await this.currentApplication.objectInsert(obj);
            this[tabKey].emit("save.successful", obj);
            this.done(obj);
         } catch (err) {
            // hide progress
            this.ready();

            // an error happend during the server side creation.
            // so remove this object from the current object list of
            // the currentApplication.
            await this.currentApplication.objectRemove(newObject);

            // tell current Tab component there was an error
            this[tabKey].emit("save.error", err);
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show(shouldSelectNew) {
         if (shouldSelectNew != null) {
            this.selectNew = shouldSelectNew;
         }
         if (this.$component) this.$component.show();
      }

      switchTab(tabId) {
         if (tabId == this.BlankTab?.ui?.body?.id) {
            this.BlankTab?.onShow?.(this.currentApplication);
         } else if (tabId == this.CsvTab?.ui?.body?.id) {
            this.CsvTab?.onShow?.(this.currentApplication);
         } else if (tabId == this.ImportTab?.ui?.body?.id) {
            this.ImportTab?.onShow?.(this.currentApplication);
         } else if (tabId == this.ExternalTab?.ui?.body?.id) {
            this.ExternalTab?.onShow?.(this.currentApplication);
         }
      }
   }

   return new UI_Work_Object_List_NewObject();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_list_newObject_blank.js":
/*!***********************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_list_newObject_blank.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * ui_work_object_list_newObject_blank
 *
 * Display the form for creating a new ABObject.
 */

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UI_Work_Object_List_NewObject_Blank extends AB.ClassUI {
      constructor() {
         var base = "ui_work_object_list_newObject_blank";
         super({
            component: base,

            form: `${base}_blank`,
            buttonSave: `${base}_save`,
            buttonCancel: `${base}_cancel`,
         });
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            header: L("Create"),
            body: {
               view: "form",
               id: this.ids.form,
               width: 400,
               rules: {
                  // TODO:
                  // name: inputValidator.rules.validateObjectName
               },
               elements: [
                  {
                     view: "text",
                     label: L("Name"),
                     name: "name",
                     required: true,
                     placeholder: L("Object name"),
                     labelWidth: 70,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(
                              this,
                              "ui_work_object_list_newObject_blank_name"
                           );
                        },
                     },
                  },
                  {
                     name: "isSystemObject",
                     view: "checkbox",
                     labelRight: L("is this a System Object?"),
                     labelWidth: 0,
                     on: {
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(
                              this,
                              "ui_work_object_list_newObject_blank_isSystemObj"
                           );
                        },
                     },
                  },
                  {
                     margin: 5,
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           id: this.ids.buttonCancel,
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.cancel();
                           },
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                        {
                           view: "button",
                           id: this.ids.buttonSave,
                           css: "webix_primary",
                           value: L("Add Object"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              return this.save();
                           },
                           on: {
                              onAfterRender() {
                                 AB.ClassUI.CYPRESS_REF(this);
                              },
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      async init(AB) {
         this.AB = AB;

         this.$form = $$(this.ids.form);

         // "save.error" is triggered by the ui_work_object_list_newObject
         // if there was an error saving the values from our form.
         this.on("save.error", (err) => {
            this.onError(err);
         });

         // "save.successful" is triggered by the ui_work_object_list_newObject
         // if the values we provided were successfully saved.
         this.on("save.successful", () => {
            this.onSuccess();
         });

         // init() routines are always considered async so:
         return Promise.resolve();
      }

      cancel() {
         this.formClear();
         this.emit("cancel");
      }

      formClear() {
         this.$form.clearValidation();
         this.$form.clear();
      }

      /**
       * @method onError()
       * Our Error handler when the data we provided our parent
       * ui_work_object_list_newObject object had an error saving
       * the values.
       * @param {Error|ABValidation|other} err
       *        The error information returned. This can be several
       *        different types of objects:
       *        - A javascript Error() object
       *        - An ABValidation object returned from our .isValid()
       *          method
       *        - An error response from our API call.
       */
      onError(err) {
         if (err) {
            console.error(err);
            var message = L("the entered data is invalid");
            // if this was our Validation() object:
            if (err.updateForm) {
               err.updateForm(this.$form);
            } else {
               if (err.code && err.data) {
                  message = err.data?.sqlMessage ?? message;
               } else {
                  message = err?.message ?? message;
               }
            }

            var values = this.$form.getValues();
            webix.alert({
               title: L("Error creating Object: {0}", [values.name]),
               ok: L("fix it"),
               text: message,
               type: "alert-error",
            });
         }
         // get notified if there was an error saving.
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @method onSuccess()
       * Our success handler when the data we provided our parent
       * ui_work_object_list_newObject successfully saved the values.
       */
      onSuccess() {
         this.formClear();
         $$(this.ids.buttonSave).enable();
      }

      /**
       * @function save
       *
       * verify the current info is ok, package it, and return it to be
       * added to the application.createModel() method.
       */
      save() {
         var saveButton = $$(this.ids.buttonSave);
         saveButton.disable();

         var Form = this.$form;

         Form.clearValidation();

         // if it doesn't pass the basic form validation, return:
         if (!Form.validate()) {
            saveButton.enable();
            return false;
         }

         var values = Form.getValues();

         // set uuid to be primary column
         values.primaryColumnName = "uuid";

         this.emit("save", values);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         if ($$(this.ids.component)) $$(this.ids.component).show();
      }
   }
   return new UI_Work_Object_List_NewObject_Blank();
}


/***/ }),

/***/ "./src/rootPages/Designer/ui_work_object_workspace.js":
/*!************************************************************!*\
  !*** ./src/rootPages/Designer/ui_work_object_workspace.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * ui_work_object_workspace
 *
 * Manage the Object Workspace area.
 */

// const ABWorkspaceDatatable = require("./ab_work_object_workspace_datatable");
// const ABWorkspaceKanBan = require("./ab_work_object_workspace_kanban");
// const ABWorkspaceGantt = require("./ab_work_object_workspace_gantt");

// const ABWorkspaceIndex = require("./ab_work_object_workspace_index");
// const ABWorkspaceTrack = require("./ab_work_object_workspace_track");

// const ABPopupDefineLabel = require("./ab_work_object_workspace_popupDefineLabel");
// const ABPopupFilterDataTable = require("./ab_work_object_workspace_popupFilterDataTable");
// const ABPopupFrozenColumns = require("./ab_work_object_workspace_popupFrozenColumns");
// const ABPopupHideFields = require("./ab_work_object_workspace_popupHideFields");
// const ABPopupMassUpdate = require("./ab_work_object_workspace_popupMassUpdate");
// const ABPopupNewDataField = require("./ab_work_object_workspace_popupNewDataField");
// const ABPopupSortField = require("./ab_work_object_workspace_popupSortFields");
// const ABPopupExport = require("./ab_work_object_workspace_popupExport");
// const ABPopupImport = require("./ab_work_object_workspace_popupImport");
// const ABPopupViewSettings = require("./ab_work_object_workspace_popupViewSettings");

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB, init_settings) {
   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   class UIWorkObjectWorkspace extends AB.ClassUI {
      /**
       * @param {object} App
       * @param {string} idBase
       * @param {object} settings - {
       * 								allowDelete: bool,
       * 								detailsView: string,
       * 								editView: string,
       * 								isInsertable: bool,
       * 								isEditable: bool,
       * 								massUpdate: bool,
       * 								configureHeaders: bool,
       *
       * 								isFieldAddable: bool
       * 							}
       */
      constructor(settings = {}) {
         var base = "abd_work_object_workspace";

         super({
            component: `${base}_component`,

            buttonAddField: `${base}_buttonAddField`,
            buttonDeleteSelected: `${base}_deleteSelected`,
            buttonExport: `${base}_buttonExport`,
            buttonImport: `${base}_buttonImport`,
            buttonFieldsVisible: `${base}_buttonFieldsVisible`,
            buttonFilter: `${base}_buttonFilter`,
            buttonFrozen: `${base}_buttonFrozen`,
            buttonLabel: `${base}_buttonLabel`,
            buttonMassUpdate: `${base}_buttonMassUpdate`,
            buttonRowNew: `${base}_buttonRowNew`,
            buttonSort: `${base}_buttonSort`,

            listIndex: `${base}_listIndex`,
            buttonIndex: `${base}_buttonIndex`,

            datatable: `${base}_datatable`,
            error: `${base}_error`,
            error_msg: `${base}_error_msg`,

            viewMenu: `${base}_viewMenu`,
            viewMenuButton: `${base}_viewMenuButton`,
            viewMenuNewView: `${base}_viewMenuNewView`,

            // Toolbar:
            toolbar: `${base}_toolbar`,

            noSelection: `${base}_noSelection`,
            selectedObject: `${base}_selectedObject`,
         });

         // default settings
         settings.trackView = settings.trackView ?? true;
         settings.allowDelete = settings.allowDelete ?? true;
         settings.isInsertable = settings.isInsertable ?? true;
         settings.isEditable = settings.isEditable ?? true;
         settings.massUpdate = settings.massUpdate ?? true;
         settings.configureHeaders = settings.configureHeaders ?? true;
         settings.isFieldAddable = settings.isFieldAddable ?? true;
         this.settings = settings;

         this.hashViews = {}; // a hash of the available workspace view components

         // The DataTable that displays our object:
         // var DataTable = new ABWorkspaceDatatable(App, idBase, settings);
         // this.hashViews["grid"] = DataTable;

         // var KanBan = new ABWorkspaceKanBan(base);
         // this.hashViews["kanban"] = KanBan;

         // var Gantt = new ABWorkspaceGantt(base);
         // this.hashViews["gantt"] = Gantt;

         // let CustomIndex = new ABWorkspaceIndex(App, idBase);
         // let Track = new ABWorkspaceTrack(App, idBase);

         // // Various Popups on our page:
         // var PopupDefineLabelComponent = new ABPopupDefineLabel(App, idBase);

         // var PopupFilterDataTableComponent = new ABPopupFilterDataTable(
         //    App,
         //    idBase
         // );

         // var PopupFrozenColumnsComponent = new ABPopupFrozenColumns(
         //    App,
         //    idBase
         // );

         // var PopupHideFieldComponent = new ABPopupHideFields(App, idBase);

         // var PopupMassUpdateComponent = new ABPopupMassUpdate(App, idBase);

         // var PopupNewDataFieldComponent = new ABPopupNewDataField(App, idBase);

         // var PopupSortFieldComponent = new ABPopupSortField(App, idBase);

         // var PopupExportObjectComponent = new ABPopupExport(App, idBase);

         // var PopupImportObjectComponent = new ABPopupImport(App, idBase);

         // var PopupViewSettingsComponent = new ABPopupViewSettings(App, idBase);

         // create ABViewDataCollection
         this.CurrentDatacollection = null;
         this.CurrentApplication = null;
         this.CurrentObject = null;
      } // constructor

      ui() {
         var ids = this.ids;

         var view = "button";
         // at some point we thought this was a good idea.

         var _logic = this;
         // some of these callback fn() are useful to not have this
         // refer to this class, so we allow them to call _logic.XXX()
         // instead.

         var newViewButton = {
            view: "button",
            type: "icon",
            autowidth: true,
            css: "webix_primary",
            label: L("New view"),
            icon: "fa fa-plus",
            align: "center",
            id: this.ids.viewMenuNewView,
            click: () => {
               this.PopupViewSettingsComponent.show();
            },
         };

         var menu = {
            view: "menu",
            // css: "darkgray",
            // borderless: true,
            // minWidth: 150,
            // autowidth: true,
            id: this.ids.viewMenu,
            data: [],
            on: {
               onMenuItemClick: (id) => {
                  var item = $$(ids.viewMenu).getMenuItem(id);
                  if (id === ids.viewMenuButton) {
                     return;
                  }
                  if (item.isView) {
                     var view = this.CurrentObject.workspaceViews.list(
                        (v) => v.id === id
                     )[0];
                     this.switchWorkspaceView(view);
                  } else if (item.action === "edit") {
                     var view = this.CurrentObject.workspaceViews.list(
                        (v) => v.id === item.viewId
                     )[0];
                     PopupViewSettingsComponent.show(view);
                  } else if (item.action === "delete") {
                     // Ask the user what to do about the existing file:
                     webix.confirm({
                        title: L("Delete View?"),
                        message: L(
                           "Are you sure you want to remove this view?"
                        ),
                        callback: (result) => {
                           if (result) {
                              var view = this.CurrentObject.workspaceViews.list(
                                 (v) => v.id === item.viewId
                              )[0];
                              this.CurrentObject.workspaceViews.removeView(
                                 view
                              );
                              this.switchWorkspaceView(
                                 this.CurrentObject.workspaceViews.getCurrentView()
                              );
                           }
                        },
                     });
                  }
               },
            },
            type: {
               subsign: true,
            },
         };

         var toolbar = {
            view: "toolbar",
            id: ids.toolbar,
            hidden: true,
            css: "webix_dark",
            elementsConfig: {
               autowidth: true,
               padding: 0,
               margin: 0,
            },
            margin: 0,
            padding: 0,
            rows: [
               {
                  cols: [
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonAddField,
                        label: L("Add field"),
                        icon: "fa fa-plus",
                        css: "webix_transparent",
                        type: "icon",
                        hidden: !this.settings.isFieldAddable,
                        // minWidth: 115,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarAddFields(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonFieldsVisible,
                        label: L("Hide fields"),
                        icon: "fa fa-eye-slash",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 105,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarFieldsVisible(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonFilter,
                        label: L("Filters"),
                        icon: "fa fa-filter",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 70,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarFilter(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonSort,
                        label: L("Sort"),
                        icon: "fa fa-sort",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 60,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarSort(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonFrozen,
                        label: L("Freeze"),
                        icon: "fa fa-thumb-tack",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 75,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarFrozen(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonLabel,
                        label: L("Label"),
                        icon: "fa fa-crosshairs",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 75,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarDefineLabel(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     // {
                     //  view: view,
                     //  label: L("Permission"),
                     //  icon: "lock",
                     //  type: "icon",
                     //  // autowidth: true,
                     //  click: function() {
                     //      _logic.toolbarPermission(this.$view);
                     //  }
                     //
                     // },
                     {
                        view: view,
                        id: ids.buttonImport,
                        label: L("Import"),
                        icon: "fa fa-upload",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 80,
                        click: function () {
                           _logic.toolbarButtonImport();
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonExport,
                        label: L("Export"),
                        icon: "fa fa-download",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 80,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarButtonExport(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonMassUpdate,
                        label: L("Edit"),
                        icon: "fa fa-pencil-square-o",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 65,
                        // autowidth: true,
                        badge: null,
                        hidden: true,
                        click: function () {
                           _logic.toolbarMassUpdate(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonDeleteSelected,
                        label: L("Delete"),
                        icon: "fa fa-trash",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 85,
                        // autowidth: true,
                        badge: null,
                        hidden: true,
                        click: function () {
                           _logic.toolbarDeleteSelected(this.$view);
                        },
                     },
                     { responsive: "hide" },
                  ],
               },
               {
                  css: { "background-color": "#747d84 !important" },
                  cols: [
                     {
                        view: view,
                        id: ids.buttonIndex,
                        label: L("Add Index"),
                        icon: "fa fa-plus-circle",
                        css: "webix_transparent",
                        type: "icon",
                        click: () => {
                           this.CustomIndex.open(this.CurrentObject);
                        },
                     },
                     {
                        id: ids.listIndex,
                        cols: [],
                     },
                     {
                        responsive: "hide",
                     },
                  ],
               },
            ],
         };

         // Our webix UI definition:
         return {
            view: "multiview",
            id: ids.component,
            rows: [
               {
                  id: ids.error,
                  rows: [
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                     {
                        view: "label",
                        align: "center",
                        height: 200,
                        label:
                           "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-exclamation-triangle'></div>",
                     },
                     {
                        id: ids.error_msg,
                        view: "label",
                        align: "center",
                        label: L("There was an error"),
                     },
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                  ],
               },
               {
                  id: ids.noSelection,
                  rows: [
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                     {
                        view: "label",
                        align: "center",
                        height: 200,
                        label:
                           "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-database'></div>",
                     },
                     {
                        view: "label",
                        align: "center",
                        label: L("Select an object to work with."),
                     },
                     {
                        cols: [
                           {},
                           {
                              view: "button",
                              label: L("Add new object"),
                              type: "form",
                              css: "webix_primary",
                              autowidth: true,
                              click: () => {
                                 this.emit("addNew", true);
                              },
                           },
                           {},
                        ],
                     },
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                  ],
               },
               {
                  id: ids.selectedObject,
                  type: "wide",
                  paddingY: 0,
                  // css: "ab-data-toolbar",
                  // borderless: true,
                  rows: [
                     {
                        cols: [newViewButton, menu],
                     },
                     toolbar,
                     {
                        padding: 0,
                        rows: [
                           {
                              view: "multiview",
                              cells: [
                                 {
                                    rows: [
                                       {},
                                       {
                                          view: "label",
                                          label:
                                             "Impressive workspace editor here!",
                                       },
                                       {},
                                    ],
                                 },
                                 /* DataTable.ui(), Gantt.ui(), KanBan.ui() */
                              ],
                           },
                           this.settings.isInsertable
                              ? {
                                   view: "button",
                                   type: "form",
                                   id: ids.buttonRowNew,
                                   css: "webix_primary",
                                   value: L("Add new row"),
                                   click: function () {
                                      _logic.rowAdd();
                                   },
                                }
                              : {
                                   view: "layout",
                                   rows: [],
                                   hidden: true,
                                },
                        ],
                     },
                  ],
               },
            ],
         };
      } // ui()

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;

         // DataTable.init({
         //    onEditorMenu: _logic.callbackHeaderEditorMenu,
         //    onColumnOrderChange: _logic.callbackColumnOrderChange,
         //    onCheckboxChecked: _logic.callbackCheckboxChecked,
         // });
         // KanBan.init();
         // Gantt.init();

         // this.CurrentDatacollection = this.AB.datacollectionNew({});
         // this.CurrentDatacollection.init();

         // CustomIndex.init({
         //    onChange: _logic.refreshIndexes,
         // });
         // Track.init();

         // DataTable.datacollectionLoad(this.CurrentDatacollection);
         // KanBan.datacollectionLoad(this.CurrentDatacollection);
         // Gantt.datacollectionLoad(this.CurrentDatacollection);

         // PopupDefineLabelComponent.init({
         //    onChange: _logic.callbackDefineLabel, // be notified when there is a change in the label
         // });

         // PopupFilterDataTableComponent.init({
         //    onChange: _logic.callbackFilterDataTable, // be notified when there is a change in the filters
         // });

         // PopupFrozenColumnsComponent.init({
         //    onChange: _logic.callbackFrozenColumns, // be notified when there is a change in the frozen columns
         // });

         // PopupHideFieldComponent.init({
         //    onChange: _logic.callbackFieldsVisible, // be notified when there is a change in the hidden fields
         // });

         // PopupMassUpdateComponent.init({
         //    // onSave:_logic.callbackAddFields			// be notified of something...who knows...
         // });

         // if (settings.isFieldAddable) {
         //    PopupNewDataFieldComponent.init({
         //       onSave: _logic.callbackAddFields, // be notified when a new Field is created & saved
         //    });
         // }

         // // ?? what is this for ??
         // // var fieldList = DataTable.getFieldList();

         // PopupSortFieldComponent.init({
         //    onChange: _logic.callbackSortFields, // be notified when there is a change in the sort fields
         // });

         // PopupImportObjectComponent.init({
         //    onDone: () => {
         //       // refresh data in object
         //       _logic.populateObjectWorkspace(CurrentObject);
         //    },
         // });

         // PopupExportObjectComponent.init({});

         // PopupViewSettingsComponent.init({
         //    onViewAdded: _logic.callbackViewAdded,
         //    onViewUpdated: _logic.callbackViewUpdated,
         // });

         $$(this.ids.noSelection).show();
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Object Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         this.CurrentApplication = application;
         return;
         PopupNewDataFieldComponent.applicationLoad(application);

         // this.CurrentDatacollection.application = CurrentApplication;
      }

      /**
       * @function callbackDefineLabel
       *
       * call back for when the Define Label popup is finished.
       */
      callbackAddFields(field) {
         DataTable.refreshHeader();
         _logic.loadData();
      }

      /**
       * @function callbackDefineLabel
       *
       * call back for when the Define Label popup is finished.
       */
      // callbackDefineLabel: function () {},

      /**
       * @function callbackFilterDataTable
       *
       * call back for when the Define Label popup is finished.
       */
      callbackFilterDataTable() {
         // Since we are making server side requests lets offload the badge count to another function so it can be called independently
         _logic.getBadgeFilters();
         // this will be handled by the server side request now
         _logic.loadData();
      }

      /**
       * @function callbackFrozenColumns
       *
       * call back for when the hidden fields have changed.
       */
      callbackFrozenColumns(frozen_field_id) {
         // We need to load data first because there isn't anything to look at if we don't
         // _logic.loadData();
         // DataTable.refresh();

         CurrentObject.workspaceFrozenColumnID = frozen_field_id;
         CurrentObject.save().then(() => {
            _logic.getBadgeFrozenColumn();

            PopupHideFieldComponent.setFrozenColumnID(
               CurrentObject.objectWorkspace.frozenColumnID || ""
            );

            DataTable.refreshHeader();
         });
      }

      /**
       * @function callbackFieldsVisible
       *
       * call back for when the hidden fields have changed.
       */
      callbackFieldsVisible(hidden_fields_settings) {
         CurrentObject.workspaceHiddenFields = hidden_fields_settings;
         CurrentObject.save().then(() => {
            _logic.getBadgeHiddenFields();

            PopupFrozenColumnsComponent.setHiddenFields(hidden_fields_settings);

            DataTable.refreshHeader();
         });
      }

      /**
       * @function callbackCheckboxChecked
       *
       * call back for when the checkbox of datatable is checked
       */

      callbackCheckboxChecked(state) {
         if (state == "enable") {
            _logic.enableUpdateDelete();
         } else {
            _logic.disableUpdateDelete();
         }
      }

      /**
       * @function callbackColumnOrderChange
       *
       */
      callbackColumnOrderChange(object) {
         _logic.getBadgeHiddenFields();
         _logic.getBadgeFrozenColumn();
      }

      /**
       * @function callbackHeaderEditorMenu
       *
       * call back for when an editor menu action has been selected.
       * @param {string} action [ 'hide', 'filter', 'sort', 'edit', 'delete' ]
       */
      callbackHeaderEditorMenu(action, field, node) {
         switch (action) {
            case "hide":
               var newFields = [];
               var isHidden =
                  CurrentObject.workspaceHiddenFields.filter((fID) => {
                     return fID == field.columnName;
                  }).length > 0;
               if (isHidden) {
                  // get remaining fields
                  newFields = CurrentObject.workspaceHiddenFields.filter(
                     (fID) => {
                        return fID != field.columnName;
                     }
                  );
               } else {
                  newFields = CurrentObject.workspaceHiddenFields;
                  newFields.push(field.columnName);
               }

               // update our Object with current hidden fields
               CurrentObject.workspaceHiddenFields = newFields;
               CurrentObject.save()
                  .then(function () {
                     PopupHideFieldComponent.setValue(
                        CurrentObject.objectWorkspace.hiddenFields
                     );
                     PopupFrozenColumnsComponent.setHiddenFields(
                        CurrentObject.objectWorkspace.hiddenFields
                     );
                     DataTable.refreshHeader();
                  })
                  .catch(function (err) {
                     OP.Error.log(
                        "Error trying to save workspaceHiddenFields",
                        { error: err, fields: newFields }
                     );
                  });
               break;
            case "filter":
               _logic.toolbarFilter($$(ids.buttonFilter).$view, field.id);
               break;
            case "sort":
               _logic.toolbarSort($$(ids.buttonSort).$view, field.id);
               break;
            case "freeze":
               CurrentObject.workspaceFrozenColumnID = field.columnName;
               CurrentObject.save()
                  .then(function () {
                     PopupFrozenColumnsComponent.setValue(
                        CurrentObject.objectWorkspace.frozenColumnID || ""
                     );
                     PopupHideFieldComponent.setFrozenColumnID(
                        CurrentObject.objectWorkspace.frozenColumnID || ""
                     );
                     DataTable.refreshHeader();
                  })
                  .catch(function (err) {
                     OP.Error.log(
                        "Error trying to save workspaceFrozenColumnID",
                        { error: err, fields: field.columnName }
                     );
                  });
               break;
            case "edit":
               // pass control on to our Popup:
               PopupNewDataFieldComponent.show(field);
               break;

            case "delete":
               // verify they mean to do this:
               webix.confirm({
                  title: L("Delete data field"),
                  message: L("Do you want to delete <b>{0}</b>?", [
                     field.label,
                  ]),
                  callback: (isOK) => {
                     if (isOK) {
                        field
                           .destroy()
                           .then(() => {
                              DataTable.refreshHeader();
                              _logic.loadData();

                              // recursive fn to remove any form/detail fields related to this field
                              function checkPages(list, cb) {
                                 if (list.length == 0) {
                                    cb();
                                 } else {
                                    var page = list.shift();

                                    // begin calling removeField for each main page in the app
                                    // this will kick off a chain of events that will have removeField called on
                                    // all pages, subpages, widgets and views.
                                    page.removeField(field, (err) => {
                                       if (err) {
                                          cb(err);
                                       } else {
                                          checkPages(list, cb);
                                       }
                                    });
                                 }
                              }
                              checkPages(
                                 CurrentApplication.pages(),
                                 (err) => {}
                              );
                           })
                           .catch((err) => {
                              if (err && err.message) {
                                 webix.alert({
                                    type: "alert-error",
                                    title: L("Could not delete"),
                                    text: err.message,
                                 });
                              }

                              this.AB.notify.developer(err, {
                                 context: "Error trying to delete field",
                                 error: err,
                                 fields: field.toObj(),
                              });
                           });
                     }
                  },
               });
               break;
         }
      }

      /**
       * @function callbackMassUpdate
       *
       * call back for when the mass update is fired
       */
      callbackMassUpdate() {
         // _logic.getBadgeSortFields();
         _logic.loadData();
      }

      /**
       * @function callbackSortFields
       *
       * call back for when the sort fields popup changes
       **/
      callbackSortFields(sort_settings) {
         CurrentObject.workspaceSortFields = sort_settings;
         CurrentObject.save().then(() => {
            _logic.getBadgeSortFields();
            DataTable.refreshHeader();
            _logic.loadData();
         });
      }

      /**
       * @function callbackViewAdded
       *
       * call back for when a new workspace view is added
       */
      callbackViewAdded(view) {
         _logic.switchWorkspaceView(view);
         DataTable.refreshHeader();
         _logic.loadData();
      }

      /**
       * @function callbackViewUpdated
       *
       * call back for when a workspace view is updated
       */
      callbackViewUpdated(view) {
         if (view.id === CurrentObject.workspaceViews.getCurrentView().id) {
            _logic.switchWorkspaceView(view);
         } else {
            _logic.refreshViewMenu();
         }
      }

      /**
       * @function enableUpdateDelete
       *
       * enable the update or delete buttons in the toolbar if there are any items selected
       * we will make this externally accessible so we can call it from within the datatable component
       */
      enableUpdateDelete() {
         $$(ids.buttonMassUpdate).show();
         $$(ids.buttonDeleteSelected).show();
      }

      /**
       * @function enableUpdateDelete
       *
       * disable the update or delete buttons in the toolbar if there no items selected
       * we will make this externally accessible so we can call it from within the datatable component
       */
      disableUpdateDelete() {
         $$(ids.buttonMassUpdate).hide();
         $$(ids.buttonDeleteSelected).hide();
      }

      /**
       * @function getBadgeFilters
       *
       * we need to set the badge count for filters on load and after filters are added or removed
       */

      getBadgeFilters() {
         var filterConditions = CurrentObject.currentView().filterConditions;
         var numberOfFilter = 0;

         if (
            filterConditions &&
            filterConditions.rules &&
            filterConditions.rules.length
         )
            numberOfFilter = filterConditions.rules.length;

         if (typeof filterConditions != "undefined") {
            $$(ids.buttonFilter).define("badge", numberOfFilter || null);
            $$(ids.buttonFilter).refresh();
         }
      }

      /**
       * @function getBadgeFrozenColumn
       *
       * we need to set the badge count for frozen columns on load and after changed are added or removed
       */

      getBadgeFrozenColumn() {
         var frozenID = CurrentObject.workspaceFrozenColumnID;

         if (typeof frozenID != "undefined") {
            var badgeNumber = DataTable.getColumnIndex(frozenID) + 1;

            $$(ids.buttonFrozen).define("badge", badgeNumber || null);
            $$(ids.buttonFrozen).refresh();
         }
      }

      /**
       * @function getBadgeHiddenFields
       *
       * we need to set the badge count for hidden fields on load and after fields are hidden or shown
       */

      getBadgeHiddenFields() {
         var hiddenFields = CurrentObject.workspaceHiddenFields;

         if (typeof hiddenFields != "undefined") {
            $$(ids.buttonFieldsVisible).define(
               "badge",
               hiddenFields.length || null
            );
            $$(ids.buttonFieldsVisible).refresh();
         }
      }

      /**
       * @function getBadgeSortFields
       *
       * we need to set the badge count for sorts on load and after sorts are added or removed
       */

      getBadgeSortFields() {
         var sortFields = CurrentObject.workspaceSortFields;

         if (typeof sortFields != "undefined") {
            $$(ids.buttonSort).define("badge", sortFields.length || null);
            $$(ids.buttonSort).refresh();
         }
      }

      /**
       * @function rowAdd()
       *
       * When our [add row] button is pressed, alert our DataTable
       * component to add a row.
       */
      rowAdd() {
         let currView = CurrentObject.currentView();

         switch (currView.type) {
            case "kanban":
               KanBan.addCard();
               break;
            case "grid":
            default:
               DataTable.addRow();
               break;
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(ids.component).show();
      }

      /**
       * @function toolbarAddFields
       *
       * Show the popup to allow the user to create new fields for
       * this object.
       */
      toolbarAddFields($view) {
         PopupNewDataFieldComponent.show();
      }

      toolbarButtonImport() {
         PopupImportObjectComponent.show();
      }

      toolbarButtonExport($view) {
         PopupExportObjectComponent.show($view);
      }

      toolbarDeleteSelected($view) {
         var deleteTasks = [];
         $$(DataTable.ui.id).data.each(function (obj) {
            if (
               typeof obj != "undefined" &&
               obj.hasOwnProperty("appbuilder_select_item") &&
               obj.appbuilder_select_item == 1
            ) {
               deleteTasks.push(function (next) {
                  CurrentObject.model()
                     .delete(obj.id)
                     .then((response) => {
                        if (response.numRows > 0) {
                           $$(DataTable.ui.id).remove(obj.id);
                        }
                        next();
                     }, next);
               });
            }
         });

         if (deleteTasks.length > 0) {
            OP.Dialog.Confirm({
               title: L("ab.massDelete.title", "*Delete Multiple Records"),
               text: L(
                  "ab.massDelete.description",
                  "*Are you sure you want to delete the selected records?"
               ),
               callback: function (result) {
                  if (result) {
                     async.parallel(deleteTasks, function (err) {
                        if (err) {
                           // TODO : Error message
                        } else {
                           // Anything we need to do after we are done.
                           _logic.disableUpdateDelete();
                        }
                     });
                  }
               },
            });
         } else {
            OP.Dialog.Alert({
               title: "No Records Selected",
               text:
                  "You need to select at least one record...did you drink your coffee today?",
            });
         }
      }

      /**
       * @function toolbarDefineLabel
       *
       * Show the popup to allow the user to define the default label for
       * this object.
       */
      toolbarDefineLabel($view) {
         PopupDefineLabelComponent.show($view);
      }

      /**
       * @function toolbarFieldsVisible
       *
       * Show the popup to allow the user to hide columns for this view.
       */
      toolbarFieldsVisible($view) {
         PopupHideFieldComponent.show($view);
      }

      /**
       * @function toolbarFilter
       *
       * show the popup to add a filter to the datatable
       */
      toolbarFilter($view, fieldId) {
         PopupFilterDataTableComponent.show($view, fieldId);
      }

      /**
       * @function toolbarFrozen
       *
       * show the popup to freeze columns for the datatable
       */
      toolbarFrozen($view) {
         PopupFrozenColumnsComponent.show($view);
      }

      toolbarPermission($view) {
         console.error("TODO: toolbarPermission()");
      }

      toolbarMassUpdate($view) {
         PopupMassUpdateComponent.show($view);
      }

      /**
       * @function toolbarSort
       *
       * show the popup to sort the datatable
       */
      toolbarSort($view, fieldId) {
         PopupSortFieldComponent.show($view, fieldId);
         // self.refreshPopupData();
         // $$(self.webixUiId.sortFieldsPopup).show($view);
         //console.error('TODO: toolbarSort()');
      }

      /**
       * @function populateObjectWorkspace()
       *
       * Initialize the Object Workspace with the provided ABObject.
       *
       * @param {ABObject} object  	current ABObject instance we are working with.
       */
      populateObjectWorkspace(object) {
         $$(this.ids.toolbar).show();
         $$(this.ids.selectedObject).show();

         // temp placeholder until we refactor this method.
         return;

         CurrentObject = object;

         // get current view from object
         var currentView = CurrentObject.workspaceViews.getCurrentView();

         // get defined views
         // update the view picker in the toolbar

         // get toolbar config
         // update toolbar with approved tools

         /// still working with DataTable
         // initial data
         _logic.loadData();

         // the replicated tables are read only
         if (CurrentObject.isReadOnly) {
            DataTable.readonly();

            if ($$(ids.buttonRowNew)) $$(ids.buttonRowNew).disable();
         } else {
            DataTable.editable();

            if ($$(ids.buttonRowNew)) $$(ids.buttonRowNew).enable();
         }

         this.CurrentDatacollection.datasource = CurrentObject;

         DataTable.objectLoad(CurrentObject);
         KanBan.objectLoad(CurrentObject);
         Gantt.objectLoad(CurrentObject);

         PopupNewDataFieldComponent.objectLoad(CurrentObject);
         PopupDefineLabelComponent.objectLoad(CurrentObject);
         PopupFilterDataTableComponent.objectLoad(CurrentObject);
         PopupFrozenColumnsComponent.objectLoad(CurrentObject);
         PopupFrozenColumnsComponent.setValue(
            CurrentObject.workspaceFrozenColumnID || ""
         );
         PopupFrozenColumnsComponent.setHiddenFields(
            CurrentObject.workspaceHiddenFields
         );
         PopupHideFieldComponent.objectLoad(CurrentObject);
         PopupHideFieldComponent.setValue(CurrentObject.workspaceHiddenFields);
         PopupHideFieldComponent.setFrozenColumnID(
            CurrentObject.workspaceFrozenColumnID || ""
         );
         PopupMassUpdateComponent.objectLoad(CurrentObject, DataTable);
         PopupSortFieldComponent.objectLoad(CurrentObject);
         PopupSortFieldComponent.setValue(CurrentObject.workspaceSortFields);
         PopupImportObjectComponent.objectLoad(CurrentObject);
         PopupExportObjectComponent.objectLoad(CurrentObject);
         PopupExportObjectComponent.objectLoad(CurrentObject);
         PopupExportObjectComponent.setGridComponent($$(DataTable.ui.id));
         PopupExportObjectComponent.setHiddenFields(
            CurrentObject.workspaceHiddenFields
         );
         PopupExportObjectComponent.setFilename(CurrentObject.label);
         PopupViewSettingsComponent.objectLoad(CurrentObject);

         DataTable.refreshHeader();
         _logic.refreshToolBarView();

         _logic.refreshIndexes();

         // $$(ids.component).setValue(ids.selectedObject);
         $$(ids.selectedObject).show(true, false);

         // disable add fields into the object
         if (
            object.isExternal ||
            object.isImported ||
            !settings.isFieldAddable
         ) {
            $$(ids.buttonAddField).disable();
            $$(ids.buttonImport).disable();
         } else {
            $$(ids.buttonAddField).enable();
            $$(ids.buttonImport).enable();
         }

         _logic.refreshViewMenu();

         // display the proper ViewComponent
         var currDisplay = hashViews[currentView.type];
         currDisplay.show();
         // viewPicker needs to show this is the current view.
      }

      /**
       * @function clearObjectWorkspace()
       *
       * Clear the object workspace.
       */
      clearObjectWorkspace() {
         // NOTE: to clear a visual glitch when multiple views are updating
         // at one time ... stop the animation on this one:
         $$(this.ids.noSelection).show(false, false);
      }

      /**
       * @function loadAll
       * Load all records
       *
       */
      loadAll() {
         DataTable.loadAll();
      }

      loadData() {
         // update ABViewDataCollection settings
         var wheres = {
            glue: "and",
            rules: [],
         };
         if (
            CurrentObject.workspaceFilterConditions &&
            CurrentObject.workspaceFilterConditions.rules &&
            CurrentObject.workspaceFilterConditions.rules.length > 0
         ) {
            wheres = CurrentObject.workspaceFilterConditions;
         }

         var sorts = {};
         if (
            CurrentObject.workspaceSortFields &&
            CurrentObject.workspaceSortFields.length > 0
         ) {
            sorts = CurrentObject.workspaceSortFields;
         }

         this.CurrentDatacollection.datasource = CurrentObject;

         this.CurrentDatacollection.fromValues({
            settings: {
               datasourceID: CurrentObject.id,
               objectWorkspace: {
                  filterConditions: wheres,
                  sortFields: sorts,
               },
            },
         });

         this.CurrentDatacollection.refreshFilterConditions(wheres);
         this.CurrentDatacollection.clearAll();

         // WORKAROUND: load all data becuase kanban does not support pagination now
         let view = CurrentObject.workspaceViews.getCurrentView();
         if (view.type === "gantt" || view.type === "kanban") {
            this.CurrentDatacollection.settings.loadAll = true;
            this.CurrentDatacollection.loadData(0);
         } else {
            this.CurrentDatacollection.loadData(0, 30).catch((err) => {
               var message = err.toString();
               if (typeof err == "string") {
                  try {
                     var jErr = JSON.parse(err);
                     if (jErr.data && jErr.data.sqlMessage) {
                        message = jErr.data.sqlMessage;
                     }
                  } catch (e) {}
               }

               $$(ids.error).show();
               $$(ids.error_msg).define("label", message);
               $$(ids.error_msg).refresh();

               // webix.alert({
               //     title: "Error loading object Values ",
               //     ok: "fix it",
               //     text: message,
               //     type: "alert-error"
               // });

               console.error(err);
            });
         }
      }

      switchWorkspaceView(view) {
         if (hashViews[view.type]) {
            CurrentObject.workspaceViews.setCurrentView(view.id);
            hashViews[view.type].show();
            _logic.refreshViewMenu();

            // now update the rest of the toolbar for this view:
            _logic.refreshToolBarView();

            // save current view
            CurrentObject.save();

            _logic.loadData();
         }
      }

      /**
       * @function refreshToolBarView
       * update the display of the toolbar buttons based upon
       * the current view being displayed.
       */
      refreshToolBarView() {
         // get badge counts for server side components
         _logic.getBadgeHiddenFields();
         _logic.getBadgeFrozenColumn();
         _logic.getBadgeSortFields();
         _logic.getBadgeFilters();

         // $$(ids.component).setValue(ids.selectedObject);
         $$(ids.selectedObject).show(true, false);

         // disable add fields into the object
         if (
            CurrentObject.isExternal ||
            CurrentObject.isImported ||
            !settings.isFieldAddable
         ) {
            $$(ids.buttonAddField).disable();
         } else {
            $$(ids.buttonAddField).enable();
         }
      }

      refreshViewMenu() {
         var currentViewId = CurrentObject.workspaceViews.getCurrentView().id;
         var submenu = CurrentObject.workspaceViews.list().map((view) => ({
            hash: view.type,
            value: view.name,
            id: view.id,
            isView: true,
            $css: view.id === currentViewId ? "selected" : "",
            icon: view.constructor.icon(),
            submenu: view.isDefaultView
               ? null
               : [
                    {
                       value: L("ab.common.edit", "*Edit"),
                       icon: "fa fa-cog",
                       viewId: view.id,
                       action: "edit",
                    },
                    {
                       value: L("ab.common.delete", "*Delete"),
                       icon: "fa fa-trash",
                       viewId: view.id,
                       action: "delete",
                    },
                 ],
         }));

         // var currView = CurrentObject.workspaceViews.getCurrentView();
         // var icon = currView.constructor.icon();

         $$(ids.viewMenu).clearAll();
         $$(ids.viewMenu).define("data", submenu);
         $$(ids.viewMenu).refresh();
      }

      refreshIndexes() {
         let indexes = CurrentObject.indexes() || [];

         // clear indexes list
         webix.ui([], $$(ids.listIndex));

         indexes.forEach((index) => {
            _logic.addNewIndex(index);
         });
      }

      addNewIndex(index) {
         $$(ids.listIndex).addView({
            view: view,
            label: index.name,
            icon: "fa fa-key",
            css: "webix_transparent",
            type: "icon",
            width: 160,
            click: () => {
               CustomIndex.open(CurrentObject, index);
            },
         });
      }
   }

   // NOTE: since this is configurable, we return the CLASS only.
   return new UIWorkObjectWorkspace(init_settings);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_definitions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/definitions.js */ "./src/definitions.js");
/* harmony import */ var _src_definitions_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_definitions_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_application_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/application.js */ "./src/application.js");
/* harmony import */ var _src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/labels/labels.js */ "./src/labels/labels.js");
/* harmony import */ var _src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2__);




if (window.__ABBS) {
   window.__ABBS.addPlugin({
      version: "0.0.0",
      key: "ABDesigner",
      apply: function (AB) {
         // At this point, the Plugin should already have loaded all it's definitions
         // into the AB Factory
         AB.pluginLoad((0,_src_application_js__WEBPACK_IMPORTED_MODULE_1__["default"])(AB));

         // var labels = Labels.en; /* default */;
         // var lang =AB.Multilingual.currentLanguage();

         // if (Labels[lang]) {
         //    labels = Labels[lang];
         // }
         // AB.pluginLabelLoad("ABDesigner", labels);
      },
      definitions: function () {
         return (_src_definitions_js__WEBPACK_IMPORTED_MODULE_0___default());
      },
      labels: function (lang) {
         return (_src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2___default())[lang] || (_src_labels_labels_js__WEBPACK_IMPORTED_MODULE_2___default().en);
      },
   });
}

})();

/******/ })()
;
//# sourceMappingURL=ABDesigner.js.map