/*
 * UIProcessTaskServiceApi
 *
 * Display the form for entering the properties for a new
 * ServiceApi Task
 *
 * @return {ClassUI} The Class Definition for this UI widget.
 */
import UI_Class from "../../ui_class";

export default function(AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();
   const uiConfig = AB.Config.uiSettings();

   class UIProcessServiceApi extends UIClass {
      constructor() {
         super("properties_process_service_api", {
            form: "",
            headers: "",
            suggest: "",
         });

         this.element = null;
         // A webix datacollection - used to load process data into our mention suggest
         this.suggestData = new AB.Webix.DataCollection({});
      }

      static get key() {
         return "Api";
      }

      ui() {
         const ids = this.ids;
         return {
            rows: [
               {
                  id: ids.form,
                  view: "form",
                  elementsConfig: {
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  elements: [
                     {
                        view: "text",
                        name: "name",
                        label: L("Name"),
                     },
                     {
                        view: "text",
                        name: "url",
                        label: L("Url"),
                     },
                     {
                        view: "combo",
                        name: "method",
                        label: L("Method"),
                        options: ["GET", "POST", "PUT", "DELETE"],
                     },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Headers"),
                              autowidth: true,
                           },
                           {
                              view: "icon",
                              icon: "fa fa-plus",
                              width: 50,
                              on: { onItemClick: () => this.addHeader() },
                           },
                           {},
                        ],
                     },
                     { id: ids.headers, rows: [] },
                     {
                        view: "texthighlight",
                        name: "body",
                        height: 200,
                        label: L("Request Body"),
                        labelPosition: "top",
                        type: "textarea",
                        placeholder: "use ${...} to add process data",
                        css: "monospace",
                        highlight: (text) => {
                           text = text.replaceAll(
                              " ",
                              `<span style="color:#d5d5d5">·</span>`
                           );
                           text = text.replace(/\${([^}]*)}/g, (m, c) => {
                              const data = this.suggestData.find(
                                 { key: c },
                                 true
                              );
                              const centerPad = (str, target, pad, right) => {
                                 if (str.length === target) return str;
                                 if (right)
                                    return centerPad(
                                       `${str}${pad}`,
                                       target,
                                       pad
                                    );
                                 else
                                    return centerPad(
                                       `${pad}${str}`,
                                       target,
                                       pad,
                                       true
                                    );
                              };
                              if (data) {
                                 // We save the key in the text, but display the
                                 // label. Need to keep the length the same or
                                 // the cursor get's messed up.
                                 const { key, value } = data;
                                 const diff = key.length - value.length;
                                 let val = data.value;
                                 if (diff > 0) {
                                    val = centerPad(val, key.length, "─", true);
                                 } else if (diff < 0) {
                                    val = `...${val.slice(diff + 3)}`;
                                 }
                                 return `<span style="color:#4CAF51;font-weight:bold;background:#c4edc6;">\${${val}}</span>`;
                              }
                              return `<span style="background:#fff3e5;color:#FF8C00;font-weight:bold;">${m}</span>`;
                           });
                           return text;
                        },
                        suggest: {
                           id: ids.suggest,
                           view: "mentionsuggest",
                           symbol: "$",
                           template: "{#key#}",
                           data: this.suggestData,
                        },
                     },
                     {
                        view: "switch",
                        name: "responseJson",
                        value: 1,
                        label: L("Response as"),
                        onLabel: L("JSON"),
                        offLabel: L("Text"),
                     },
                  ],
               },
            ],
         };
      }

      populate(element) {
         const { name, url, method, body, responseJson } = element;
         $$(this.ids.form).setValues({ name, url, method, body, responseJson });
         element.headers?.forEach?.((header) => {
            this.addHeader(header);
         });
         const processData = element.process.processDataFields(element) ?? [];
         this.suggestData.parse(
            processData
               .filter((i) => !!i)
               .map?.((i) => ({ value: i.label, key: i.key }))
         );
      }

      values() {
         const values = {};
         let form = {};
         try {
            form = $$(this.ids.form).getValues();
         } catch (e) {
            console.log("caught", e);
         }
         Object.keys(form).forEach((key) => {
            key.includes("headers")
               ? nestValue(key, form[key], values)
               : (values[key] = form[key]);
         });
         // Convert headers to an array
         if (values.headers) {
            const headers = [];
            Object.keys(values.headers).forEach((key) =>
               headers.push(values.headers[key])
            );
            values.headers = headers;
         }
         return values;
      }

      addHeader(header = {}) {
         const uid = AB.Webix.uid(); //this is unique to the page
         const row = {
            id: uid,
            cols: [
               {
                  view: "text",
                  name: `headers.${uid}.key`,
                  placeholder: "header",
                  value: header.key,
               },
               {
                  view: "text",
                  name: `headers.${uid}.value`,
                  placeholder: "value",
                  value: header.value,
                  gravity: 2,
               },
               {
                  view: "icon",
                  icon: "wxi-trash",
                  width: "50",
                  on: {
                     onItemClick: () => $$(this.ids.headers).removeView(uid),
                  },
               },
            ],
         };
         $$(this.ids.headers).addView(row);
      }
   }

   return UIProcessServiceApi;
}

/**
 * Recursively nests a value within an object based on a dot-separated key.
 *
 * @param {string} key - The dot-separated key specifying the nested path.
 * @param {*} value - The value to assign at the final nested level.
 * @param {object} [obj={}] - The object to modify (or a new object if not provided).
 * @returns {object} The modified object with the nested value.
 */
function nestValue(key, value, obj = {}) {
   const [firstKey, ...remainingKeys] = key.split(".");

   if (remainingKeys.length === 0) {
      obj[firstKey] = value;
   } else {
      obj[firstKey] = obj[firstKey] ?? {};
      nestValue(remainingKeys.join("."), value, obj[firstKey]);
   }

   return obj;
}
