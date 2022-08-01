/**
 * ui_tab_form_popup
 *
 * The widget that displays the UI Popup Component (Add/Edit Tab) on the screen
 * when designing the UI.
 */

export default function (AB) {
   const L = (...params) => AB.Multilingual.label(...params);

   class TabPopup extends AB.ClassUI {
      constructor(view) {
         super(`${view.id}_popup`, {
            popupTabManager: "",
            popupTabManagerForm: "",
            popupTabManagerSaveButton: "",
         });

         this.view = view;
      }

      async init(AB) {
         this.view.AB = AB;

         this.create();
      }

      ui() {
         const ids = this.ids;

         return {
            id: ids.popupTabManager,
            view: "window",
            height: 250,
            width: 300,
            modal: true,
            position: "center",
            head: " ",
            body: {
               id: ids.popupTabManagerForm,
               view: "form",
               elements: [
                  {
                     view: "text",
                     name: "id",
                     label: L("ID"),
                     disabled: true,
                  },
                  {
                     view: "text",
                     name: "label",
                     label: L("Label"),
                     required: true,
                  },
                  {
                     view: "combo",
                     name: "tabicon",
                     label: L("Icon"),
                     options: {
                        filter: (item, value) => {
                           if (
                              item.value
                                 .toString()
                                 .toLowerCase()
                                 .indexOf(value.toLowerCase()) === 0
                           )
                              return true;

                           return false;
                        },
                        body: {
                           data: this.view.AB._App.icons ?? [],
                           template:
                              "<i class='fa fa-fw fa-#value#'></i> #value#",
                        },
                     },
                  },
                  // action buttons
                  {
                     cols: [
                        { fillspace: true },
                        {
                           view: "button",
                           value: L("Cancel"),
                           css: "ab-cancel-button",
                           autowidth: true,
                           click: () => {
                              this.hide();
                           },
                        },
                        {
                           id: ids.popupTabManagerSaveButton,
                           view: "button",
                           css: "webix_primary",
                           value: L("Add Tab"),
                           autowidth: true,
                           type: "form",
                           click: () => {
                              const $form = $$(ids.popupTabManagerForm);

                              if ($form.validate()) {
                                 this.busy();

                                 const vals = $form.getValues();

                                 const doneFn = () => {
                                    this.ready();
                                    this.hide();

                                    // Trigger the event - 'saved'
                                    this.emit("saved");
                                 };

                                 // add
                                 if (!vals.id) {
                                    this.addTab(vals).then(() => doneFn());
                                 }
                                 // edit
                                 else {
                                    this.editTab(vals).then(() => doneFn());
                                 }
                              }
                           },
                        },
                     ],
                  },
               ],
            },
         };
      }

      create() {
         this.view.AB.Webix.ui(this.ui()).hide();
      }

      show(tab) {
         const ids = this.ids;

         const $popup = $$(ids.popupTabManager);
         const $form = $$(ids.popupTabManagerForm);
         const $button = $$(ids.popupTabManagerSaveButton);

         if ($popup) {
            // Edit tab
            if (tab) {
               $form.setValues({
                  id: tab.id,
                  label: tab.label,
                  tabicon: tab.tabicon,
               });

               $popup.getHead().setHTML(L("Edit Tab"));
               $button.setValue(L("Save"));
            }

            // Add new tab
            else {
               $form.setValues({
                  id: null,
                  label: "",
                  tabicon: "",
               });

               $popup.getHead().setHTML(L("Add Tab"));
               $button.setValue(L("Add"));
            }

            $button.refresh();

            // show 'add new field' popup
            $popup.show();
         }
      }

      hide() {
         const ids = this.ids;

         const $popup = $$(ids.popupTabManager);

         if ($popup) $popup.hide();
      }

      busy() {
         const ids = this.ids;

         const $button = $$(ids.popupTabManagerSaveButton);

         if ($button) $button.disable();
      }

      ready() {
         const ids = this.ids;

         const $button = $$(ids.popupTabManagerSaveButton);

         if ($button) $button.enable();
      }

      addTab(values) {
         // get current instance and .addTab()
         const LayoutView = this.view;

         return LayoutView.addTab(values.label ?? "", values.tabicon ?? null);
      }

      editTab(values) {
         // get current instance and rename tab
         const LayoutView = this.view;
         const editedTab = LayoutView.views((view) => view.id === values.id)[0];

         if (!editedTab) return;

         editedTab.label = values.label;
         editedTab.tabicon = values.tabicon;

         return editedTab.save();
      }
   }

   return TabPopup;
}
