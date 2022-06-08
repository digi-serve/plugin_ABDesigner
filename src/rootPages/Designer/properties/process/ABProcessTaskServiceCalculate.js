/*
 * UIProcessTaskServiceCalculate
 *
 * Display the form for entering the properties for a new
 * ServiceCalculate Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function (AB) {
  const UIClass = UI_Class(AB);
  var L = UIClass.L();

  class UIProcessServiceCalculate extends UIClass {
    constructor() {
      super("properties_process_service_calculate", {
        name: "",
        formulaText: "",
        variableList: "",

        variablePopup: "",
        operatorPopup: "",
      });

      this.element = null;
    }

    static get key() {
      return "Calculate";
    }

    ui() {
      const ids = this.ids;

      webix.ui({
        id: ids.variablePopup,
        view: "popup",
        hidden: true,
        body: {
          id: ids.variableList,
          view: "list",
          template: (item) => {
            return item.value;
          },
          data: "",
          on: {
            onItemClick: function (id) {
              var component = this.getItem(id);

              insertFormula(`{${component.value}}`);

              $$(ids.variablePopup).hide();
            },
          },
        },
      });

      let insertFormula = (message) => {
        let formula = $$(ids.formulaText).getValue();

        $$(ids.formulaText).setValue(`${formula}${message} `);
      };

      webix.ui({
        id: ids.operatorPopup,
        view: "popup",
        hidden: true,
        width: 180,
        body: {
          view: "list",
          template: (item) => {
            var template = "";

            if (item.icon) {
              template += `<i class="fa fa-${item.icon}" aria-hidden="true"></i> `;
            }

            if (item.label) {
              template += item.label;
            }

            return template;
          },
          data: [
            {
              label: L("+ Adds"),
              symbol: "+",
            },
            {
              label: L("- Subtracts"),
              symbol: "-",
            },
            {
              label: L("* Multiples"),
              symbol: "*",
            },
            {
              label: L("/ Divides"),
              symbol: "/",
            },
            {
              label: L("( Open Bracket"),
              symbol: "(",
            },
            {
              label: L(") Closed Bracket"),
              symbol: ")",
            },
          ],
          on: {
            onItemClick: function (id, e, node) {
              var component = this.getItem(id);

              insertFormula(component.symbol);

              $$(ids.operatorPopup).hide();
            },
          },
        },
      });
      let labelWidth = 120;
      return {
        rows: [
          {
            //     id: id,
            view: "form",
            elementsConfig: {
              labelWidth: labelWidth,
            },
            elements: [
              {
                id: ids.name,
                view: "text",
                label: L("*Name"),
                name: "name",
                value: this.name,
              },

              {
                id: ids.formulaText,
                view: "texthighlight",
                height: 200,
                label: L("*Formula"),
                type: "textarea",
                value: this.formulaText || "",
                highlight: (text) => {
                  // list.forEach(function (item) {
                  //   text = text.replace(
                  //     new RegExp(`{${item.value}}`, "g"),
                  //     `<span style='background: #90adb5; color:#000000;'>{${item.value}}</span>`
                  //   );
                  // });
                  return text;
                },
              },
              {
                cols: [
                  {
                    width: labelWidth,
                    fillspace: true,
                  },
                  {
                    view: "button",
                    css: "webix_primary",
                    type: "icon",
                    icon: "fa fa-at",
                    label: L("*Parameters"),
                    click: function () {
                      // show popup
                      $$(ids.variablePopup).show(this.$view);
                    },
                  },
                  {
                    view: "button",
                    css: "webix_primary",
                    type: "icon",
                    icon: "fa fa-hashtag",
                    label: L("*Operators"),
                    click: function () {
                      // show popup
                      $$(ids.operatorPopup).show(this.$view);
                    },
                  },
                ], //End Column
              },
            ], //End element
          },
        ], //End row
      }; //End Return
    } //End UI

    populate(element) {
      const ids = this.ids;

      let list = (element?.process?.processDataFields(element) || []).map(
        (item) => {
          return {
            id: item.key,
            value: item.label,
          };
        }
      );

      $$(ids.name).setValue(element.name);
      $$(ids.formulaText).setValue(element.formulaText);
      $$(ids.variableList).define("data", list);
      $$(ids.variableList).refresh();
    }

    values() {
      var obj = {};
      var ids = this.ids;

      obj.label = $$(ids.name)?.getValue();
      obj.formulaText = $$(ids.formulaText).getValue();

      return obj;
    }

    /**
     * @method propertiesStash()
     * pull our values from our property panel.
     * @param {string} id
     *        the webix $$(id) of the properties panel area.
     */
    propertiesStash(id) {
      let ids = this.propertyIDs(id);

      this.name = this.property(ids.name);
      this.formulaText = this.property(ids.formulaText);
    }
  } //End

  return UIProcessServiceCalculate;
}
