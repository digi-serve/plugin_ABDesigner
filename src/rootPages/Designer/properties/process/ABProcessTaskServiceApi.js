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
            body: "",
            form: "",
            headers: "",
            secrets: "",
            suggest: "",
         });

         this.element = null;
         // A webix datacollection - used to load process data into our mention suggest
         this.suggestData = new AB.Webix.DataCollection({});
         this.templateRgx = /<%= (.+?) %>/g;
         this.hint = L("Use <%= ... %> to add process data / secrets");
      }

      static get key() {
         return "Api";
      }

      ui() {
         const ids = this.ids;
         this.AB.Webix.ui({
            id: ids.suggest,
            view: "mentionsuggest",
            symbol: "<",
            template: "%= #value# %>",
            data: this.suggestData,
         });
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
                        view: "texthighlight",
                        name: "url",
                        label: L("Url"),
                        highlight: (t) => this.highlight(t),
                        suggest: this.ids.suggest,
                        placeholder: this.hint,
                        css: "monospace",
                     },
                     {
                        view: "combo",
                        name: "method",
                        label: L("Method"),
                        options: ["GET", "POST", "PUT", "DELETE"],
                        on: {
                           onChange: (val) => {
                              val == "GET"
                                 ? $$(ids.body).disable()
                                 : $$(ids.body).enable();
                           },
                        },
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
                        id: ids.body,
                        height: 200,
                        label: L("Request Body"),
                        labelPosition: "top",
                        type: "textarea",
                        placeholder: this.hint,
                        css: "monospace",
                        highlight: (t) => this.highlight(t),
                        suggest: this.ids.suggest,
                     },
                     {
                        cols: [
                           {
                              view: "label",
                              label: L("Secrets"),
                              autowidth: true,
                           },
                           {
                              view: "icon",
                              icon: "fa fa-plus",
                              width: 50,
                              on: { onItemClick: () => this.addSecret() },
                           },
                           {},
                        ],
                     },
                     { id: ids.secrets, rows: [] },
                     /**
                      * TODO: Allow the response to be decoded and saved for
                      * future process tasks
                     {
                        view: "switch",
                        name: "responseJson",
                        value: 1,
                        label: L("Response as"),
                        onLabel: L("JSON"),
                        offLabel: L("Text"),
                     },
                     */
                  ],
               },
            ],
         };
      }

      populate(element) {
         // Reset our suggest data
         this.suggestData.clearAll();
         this.suggestData.parse(
            element.storedSecrets?.map((s) => ({
               value: `Secret: ${s}`,
               key: `Secret: ${s}`,
            }))
         );
         const processData = element.process.processDataFields(element) ?? [];
         this.suggestData.parse(
            processData
               .filter((i) => !!i)
               .map?.((i) => ({ value: i.label, key: i.key }))
         );
         let { name, url, method, body, responseJson } = element;
         // These might have process value placeholders, display the label
         // instead of ids
         body = this.convertIDToLabel(body);
         url = this.convertIDToLabel(url);

         $$(this.ids.form).setValues({ name, url, method, body, responseJson });

         element.headers?.forEach?.((header) => {
            header.value = this.convertIDToLabel(header.value);
            this.addHeader(header);
         });
         element.storedSecrets?.forEach?.((secret) => this.addSecret(secret));
      }

      values() {
         const values = {};
         let form = {};
         form = $$(this.ids.form).getValues();
         Object.keys(form).forEach((key) => {
            key.includes("headers") || key.includes("secrets")
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
         // These might contain process value placeholders, convert the label to
         // actuall ids before saving
         values.body = this.convertLabelToID(values.body);
         values.url = this.convertLabelToID(values.url);
         values.headers?.forEach(
            (h) => (h.value = this.convertLabelToID(h.value))
         );
         // Convert secrets to an array
         if (values.secrets) {
            const secrets = [];
            Object.keys(values.secrets).forEach((secret) =>
               secrets.push(values.secrets[secret])
            );
            values.secrets = secrets;
         }
         if (this.deleteSecrets) {
            values.deleteSecrets = this.deleteSecrets;
            delete this.deleteSecrets;
         }
         console.log("VALUES", values);

         return values;
      }

      /**
       * Add fields to the form for a header
       * @param {object} [header={}]
       * @param {string} [header.key]
       * @param {string} [header.value]
       */
      addHeader(header = {}) {
         const uid = AB.Webix.uid(); //this is unique to the page
         const row = {
            id: uid,
            cols: [
               {
                  view: "text",
                  name: `headers.${uid}.key`,
                  placeholder: L("header"),
                  value: header.key,
               },
               {
                  view: "texthighlight",
                  name: `headers.${uid}.value`,
                  placeholder: `${L("value")} (${this.hint})`,
                  value: header.value,
                  gravity: 2,
                  highlight: (t) => this.highlight(t),
                  suggest: this.ids.suggest,
                  css: "monospace",
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

      /**
       * Add fields to the form for a secret
       * @param {string} secret name of an existing secret
       */
      addSecret(secret) {
         const alreadySaved = !!secret;
         // If the secret is already saved in the db we only allow deleting.
         // Since secrets aren't saved in the definition, we don't need to send
         // existing secrets to the server. New one will get encrypted and saved
         const uid = secret ?? AB.Webix.uid(); //this is unique to the page
         const self = this;
         const row = {
            id: uid,
            cols: [
               {
                  view: "text",
                  name: alreadySaved ? undefined : `secrets.${uid}.name`,
                  placeholder: L("Name"),
                  disabled: alreadySaved,
                  value: secret,
                  invalidMessage: L("Secret names must be unique!"),
                  validate: (val) => {
                     // Check that the secret name is unique
                     const opts = this.suggestData.find({
                        key: `Secret: ${val}`,
                     });
                     return opts.length === 1;
                  },
                  on: {
                     onChange: function(n, o) {
                        if (n == o) return;
                        // Add the secret to the suggest data
                        const suggest = {
                           id: uid,
                           key: `Secret: ${n}`,
                           value: `Secret: ${n}`,
                        };
                        if (o == "") self.suggestData.parse(suggest);
                        else self.suggestData.updateItem(uid, suggest);
                        this.validate();
                     },
                  },
               },
               {
                  view: "text",
                  type: "password",
                  name: alreadySaved ? undefined : `secrets.${uid}.value`,
                  placeholder: "Value",
                  disabled: alreadySaved,
                  // We don't actually get the existing secret values back
                  // so we'll just mock a value.
                  value: alreadySaved ? ".........." : undefined,
                  gravity: 2,
               },
               {
                  view: "icon",
                  icon: "wxi-trash",
                  width: "50",
                  on: {
                     onItemClick: () => {
                        $$(this.ids.secret).removeView(uid);
                        if (alreadySaved) {
                           this.deleteSecrets = this.deleteSecrets ?? [];
                           this.deleteSecrets.push(secret);
                        }
                     },
                  },
               },
            ],
         };
         $$(this.ids.secrets).addView(row);
      }

      /**
       * Highlight function for webix texthighlight elements. Highlights secret and
       * process data in the text.
       */
      highlight(text) {
         // text = text.replaceAll(" ", `<span style="color:#d5d5d5">·</span>`);
         text = text.replace(this.templateRgx, (match, value) => {
            const data = this.suggestData.find({ value }, true);
            let color = "#FF8C00"; //Not matched - highlight orange
            let background = "#FFE0B2";
            if (data) {
               if (/^Secret:/.test(value)) {
                  color = "#008C8C"; // Matches secret - highlight cyan
                  background = "#A0D7D7";
               } else {
                  color = "#388E3C"; // Matches process value - highlight green
                  background = "#C4EDC6";
               }
            }
            return `<span style="background:${background};color:${color};font-weight:bold;">${match}</span>`;
         });
         return text;
      }

      /**
       * Replace process value labels with ids. Used before saving templates.
       */
      convertLabelToID(template) {
         if (!template) return;
         return template.replace(this.templateRgx, (match, value) => {
            const data = this.suggestData.find({ value }, true);
            if (!data) return match;
            return `<%= ${data.key} %>`;
         });
      }

      /**
       * Replace process value ids with labels. Used before displaying
       * templates.
       */
      convertIDToLabel(template) {
         if (!template) return;
         return template.replace(this.templateRgx, (match, key) => {
            const data = this.suggestData.find({ key }, true);
            if (!data) return match;
            return `<%= ${data.value} %>`;
         });
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
