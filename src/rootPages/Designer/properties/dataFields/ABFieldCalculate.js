/*
 * ABFieldCalculate
 * A Property manager for our ABFieldCalculate.
 */

import FFieldClass from "./ABField";

export default function (AB) {
    const uiConfig = AB.Config.uiSettings();

    var ABField = FFieldClass(AB);
    var L = ABField.L();

    class ABFieldCalculate extends ABField {
        constructor() {
            super("properties_abfield_calculate", {
                formula: "",

                fieldPopup: "",
                fieldList: "",

                numberOperatorPopup: "",

                dateOperatorPopup: "",
                dateFieldList: "",

                decimalPlaces: "",
            });
        }

        ui() {
            const ids = this.ids;
            
            const delimiterList = [
                { id: "none", value: L("None") },
                {
                    id: "comma",
                    value: L("Comma"),
                    sign: ",",
                },
                {
                    id: "period",
                    value: L("Period"),
                    sign: ".",
                },
                {
                    id: "space",
                    value: L("Space"),
                    sign: " ",
                },
            ];

            // field popup
            webix.ui({
                id: ids.fieldPopup,
                view: "popup",
                hidden: true,
                width: 200,
                body: {
                    id: ids.fieldList,
                    view: "list",
                    data: [],
                    template: this.itemTemplate,
                    on: {
                        onItemClick: function (id, e, node) {
                            var component = this.getItem(id),
                                message = "{" + component.columnName + "}";

                            // field.logic.insertEquation(message);

                            $$(ids.fieldPopup).hide();
                        },
                    },
                },
                on: {
                    onBeforeShow: () => {
                        // refresh field list
                        $$(ids.fieldList).clearAll();
                        $$(ids.fieldList).parse(this.getNumberFields());
                    },
                },
            });

            webix.ui({
                id: ids.numberOperatorPopup,
                view: "popup",
                hidden: true,
                width: 200,
                body: {
                    view: "list",
                    template: this.itemTemplate,
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
        
                            field.logic.insertEquation(component.symbol);
        
                            $$(ids.numberOperatorPopup).hide();
                        },
                    },
                },
            });

            webix.ui({
                id: ids.dateOperatorPopup,
                view: "popup",
                hidden: true,
                width: 280,
                data: [],
                body: {
                    id: ids.dateFieldList,
                    view: "list",
                    template: this.itemTemplate,
                    data: [],
                    on: {
                        onItemClick: function (id, e, node) {
                            var component = this.getItem(id);
        
                            field.logic.insertEquation(component.function);
        
                            $$(ids.dateOperatorPopup).hide();
                        },
                    },
                },
                on: {
                    onBeforeShow: () => {
                        // refresh field list
                        $$(ids.dateFieldList).clearAll();
                        $$(ids.dateFieldList).parse(this.getDateFields());
                    },
                },
            });

            return super.ui([
                {
                    id: ids.formula,
                    name: "formula",
                    view: "textarea",
                    label: L("Equation"),
                    labelPosition: "top",
                    height: 150,
                },
                {
                    rows: [
                        {
                            cols: [
                            {
                                view: "button",
                                type: "icon",
                                css: "webix_primary",
                                icon: "fa fa-hashtag",
                                label: L("Number Fields"),
                                width: 185,
                                click: function () {
                                    // show popup
                                    $$(ids.fieldPopup).show(this.$view);
                                },
                            },
                            {
                                view: "button",
                                type: "icon",
                                css: "webix_primary",
                                icon: "fa fa-calendar",
                                label: L("Date Fields"),
                                click: function () {
                                    // show popup
                                    $$(ids.dateOperatorPopup).show(this.$view);
                                },
                            },
                            ],
                        },
        
                        {
                            cols: [
                            {
                                view: "button",
                                css: "webix_primary",
                                type: "icon",
                                icon: "fa fa-hashtag",
                                label: L("Number Operators"),
                                width: 185,
                                click: function () {
                                    // show popup
                                    $$(ids.numberOperatorPopup).show(this.$view);
                                },
                            },
                            {},
                            ],
                        },
        
                        {
                            view: "richselect",
                            name: "decimalSign",
                            label: L("Decimals"),
                            value: "none",
                            labelWidth: this.AB.UISettings.config().labelWidthXLarge,
                            options: delimiterList,
                            on: {
                            onChange: function (newValue, oldValue) {
                                if (newValue == "none") {
                                    $$(ids.decimalPlaces).disable();
                                } else {
                                    $$(ids.decimalPlaces).enable();
                                }
                            },
                            },
                        },
        
                        {
                            view: "richselect",
                            id: ids.decimalPlaces,
                            name: "decimalPlaces",
                            label: L("Places"),
                            value: "none",
                            labelWidth: this.AB.UISettings.config().labelWidthXLarge,
                            disabled: true,
                            options: [
                            { id: "none", value: "0" },
                            { id: 1, value: "1" },
                            { id: 2, value: "2" },
                            { id: 3, value: "3" },
                            { id: 4, value: "4" },
                            { id: 5, value: "5" },
                            { id: 10, value: "10" },
                            ],
                        },
                    ],
                },
            ]);
        }

        objectLoad(object) {
            this.CurrentObject = object;
        }

        getNumberFields() {
            if (this.CurrentObject)
            return this.CurrentObject.fields(
                (f) =>
                    f.key == "number" ||
                    f.key == "calculate" ||
                    f.key == "formula"
            );
            else return [];
        }

        getDateFields() {
            if (this.CurrentObject) {
            const options = [];

            options.push({
                label: L("Convert minutes to hours (Format: hours.minutes)"),
                function: "MINUTE_TO_HOUR()",
            });

            /** CURRENT DATE */
            options.push({
                label: L("Year of [{0}]", ["Current"]),
                function: "YEAR(CURRENT)",
            });

            options.push({
                label: L("Month of [{0}]", ["Current"]),
                function: "MONTH(CURRENT)",
            });

            options.push({
                label: L("Day of [{0}]", ["Current"]),
                function: "DAY(CURRENT)",
            });

            options.push({
                label: L("Get days of [{0}] (since January 1, 1970)", [
                    "Current",
                ]),
                function: "DATE(CURRENT)",
            });

            options.push({
                label: L("Get hours of [{0}] (since January 1, 1970)", [
                    "Current",
                ]),
                function: "HOUR(CURRENT)",
            });

            options.push({
                label: L("Get minutes of [{0}] (since January 1, 1970)", [
                    "Current",
                ]),
                function: "MINUTE(CURRENT)",
            });

            /** DATE FIELDS */
            this.CurrentObject.fields(
                (f) => f.key == "date"
            ).forEach((f) => {
                options.push({
                    label: L("Calculate age from [{0}]", [f.label]),
                    function: `AGE({${f.columnName}})`,
                });

                options.push({
                    label: L("Year of [{0}]", [f.label]),
                    function: `YEAR({${f.columnName}})`,
                });

                options.push({
                    label: L("Month of [{0}]", [f.label]),
                    function: `MONTH({${f.columnName}})`,
                });

                options.push({
                    label: L("Day of [{0}]", [f.label]),
                    function: `DAY({${f.columnName}})`,
                });

                options.push({
                    label: L("Get days of [${0}] (since January 1, 1970)", [
                        f.label,
                    ]),
                    function: `DATE({${f.columnName}})`,
                });

                options.push({
                    label: L("Get hours of [${0}] (since January 1, 1970)", [
                        f.label,
                    ]),
                    function: `HOUR({${f.columnName}})`,
                });

                options.push({
                    label: L("Get minutes of [${0}] (since January 1, 1970)", [
                        f.label,
                    ]),
                    function: `MINUTE({${f.columnName}})`,
                });
            });

            return options;
            } else return [];
        }

        itemTemplate(item) {
            let template = "";

            if (item.icon) {
                template += `<i class="fa fa-${item.icon}" aria-hidden="true"></i> `;
            }

            if (item.label) {
                template += item.label;
            }

            return template;
        }

        insertEquation(message) {
            var formula = $$(ids.formula).getValue();

            $$(ids.formula).setValue(formula + message);
        }

        /**
         * @method FieldClass()
         * Call our Parent's _FieldClass() helper with the proper key to return
         * the ABFieldXXX class represented by this Property Editor.
         * @return {ABFieldXXX Class}
         */
        FieldClass() {
            return super._FieldClass("calculate");
        }

        isValid () {
            const ids = this.ids
            const FC = this.FieldClass();

            let isValid = super.isValid();

            $$(ids.component).markInvalid("formula", false);

            const formula = $$(ids.formula).getValue();

            try {
                FC.convertToJs(
                    this.CurrentObject,
                    formula,
                    {}
                );

                // correct
                isValid = true;
            } catch (err) {
                $$(ids.component).markInvalid("formula", "");

                // incorrect
                isValid = false;
            }

            return isValid;
        }

        // populate(field) {
        //     var ids = this.ids;
        //     super.populate(field);

        //     this.previewChange();
        // }
    }

    return ABFieldCalculate;
}
