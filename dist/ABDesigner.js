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
                                    var item = this.getItem(id);
                                    AB.ClassUI.CYPRESS_REF(
                                       this.getItemNode(item.id),
                                       `${ids.role}_${item.id}`
                                    );
                                 },
                              },
                           },
                        },
                        placeholder: L("Click or type to add role..."),
                        labelAlign: "left",
                        stringResult: false /* returns data as an array of [id] */,
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
                                    var item = this.getItem(id);
                                    AB.ClassUI.CYPRESS_REF(
                                       this.getItemNode(item.id),
                                       `${ids.account}_${item.id}`
                                    );
                                 },
                              },
                           },
                        },
                        labelAlign: "left",
                        placeholder: L("Click or type to add user..."),
                        stringResult: false /* returns data as an array of [id] */,
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
/*
 * UI
 *
 * The central Controller for the ABDesigner.
 *
 * We switch between allowing a User to Choose an application to work
 * with, and the actual Workspace for an Application.
 */


// import AppWorkspaceFactory from "./ui_work.js";

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(AB) {
   const AppChooser = (0,_ui_choose_js__WEBPACK_IMPORTED_MODULE_0__["default"])(AB);
   // const AppWorkspace = AppWorkspaceFactory(AB);

   class UI extends AB.ClassUI {
      constructor() {
         super("abd");
         this.id = this.ids.component;
      }

      label() {
         return AB.Multilingual.labelPlugin("ABDesigner", "AB Designer");
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
            rows: [AppChooser.ui() /*, AppWorkspace.ui*/],
         };
      }

      async init(AB) {
         this.AB = AB;

         return Promise.all([
            AppChooser.init(AB) /*, AppWorkspace.init(AB)*/,
         ]).then(() => {
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
         });
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
            console.error("TODO: switch to workplace", App);
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

         // return Promise.all([AppList.init(AB) /*, AppForm.init(AB)*/]);
         return this.loadAllApps().then(() => {
            // NOTE: .loadAllApps() will generate a TON of "definition.updated"
            // events.  So add these handlers after that is all over.

            // Refresh our Application List each time we are notified of a change
            // in our Application definitions:
            var handler = async (def) => {
               if (def.type == "application") {
                  this.loaded = false;
                  await this.loadData();
                  this.refreshList();
               }
            };
            [
               "definition.created",
               "definition.updated",
               "definition.deleted",
            ].forEach((e) => {
               this.AB.on(e, handler);
            });
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
            this.emit("transition.workplace", selectedApp);
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
               (item) => item.label == labels.component.copy
            )[0];
            if (itemCopy) {
               this.$list.remove(itemCopy.id);
               this.$list.refresh();
            }
         }

         // hide "exclude" item
         if (options.hideExclude) {
            let hideExclude = this.$list.data.find(
               (item) => item.label == labels.component.exclude
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