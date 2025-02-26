/*
 * ui_work_process_workspace_monitor
 *
 * UI for managing process instances
 *
 */
import UI_Class from "./ui_class";

const INSTANCES_IN_PAGE = 20;

export default function (AB) {
   const ibase = "ui_work_process_workspace_monitor";
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class UI_Work_Process_Workspace_Monitor extends UIClass {
      /**
       * @param {object} App
       * @param {string} idBase
       */
      constructor() {
         super(ibase, {
            component: "",
            taskList: "",
            processLogs: "",
            detailView: "",
            resetButton: "",
            deleteButton: "",
            context: "",
            error: "",
            tabGroup: "",
         });
      }

      ui() {
         const ids = this.ids;
         // Our webix UI definition:
         return {
            id: ids.component,
            cols: [
               {
                  gravity: 1,
                  rows: [
                     {
                        view: "toolbar",
                        css: "ab-data-toolbar webix_dark",
                        cols: [
                           {
                              type: "spacer",
                              width: 15,
                           },
                           {
                              view: "label",
                              label: L("Instances"),
                           },
                           {
                              view: "icon",
                              id: "filterIcon",
                              css: "icon-disable",
                              icon: "fa fa-filter",
                              align: "right",
                              popup: {
                                 view: "checksuggest",
                                 id: "instanceFilter",
                                 button: false,
                                 body: {
                                    template: `${L("Hide")} #value#`,
                                 },
                                 data: [
                                    {
                                       id: "completed",
                                       value: L("Completed"),
                                    },
                                    {
                                       id: "created",
                                       value: L("Created"),
                                    },
                                    { id: "error", value: L("Error") },
                                 ],
                                 on: {
                                    onValueSuggest: () => {
                                       this.filter = $$("instanceFilter")
                                          .config.value.split(",")
                                          .filter((s) => s !== "");
                                       $$("filterIcon").config.badge =
                                          this.filter.length != 0
                                             ? this.filter.length
                                             : "";
                                       $$("filterIcon").refresh();
                                       this.loadInstances();
                                    },
                                 },
                              },
                           },
                        ],
                     },
                     {
                        view: "list",
                        id: ids.taskList,
                        select: true,
                        navigation: true,
                        dynamic: true,
                        datafetch: INSTANCES_IN_PAGE,
                        item: {
                           height: 74,
                           template: (instance) => {
                              const icons = {
                                 error: {
                                    icon: "fa-times-circle",
                                    color: "#FF5C4C",
                                 },
                                 created: {
                                    icon: "fa-clock-o",
                                    color: "#FFAE38",
                                 },
                                 completed: {
                                    icon: "fa-check-circle",
                                    color: "#38AEA2",
                                 },
                              };
                              const { icon, color } = icons[
                                 instance.status
                              ] ?? { icon: "fa-question", color: "gray" };
                              // Format updated_at as title
                              const title = new Date(
                                 instance.updated_at
                              ).toLocaleString(
                                 //eslint-disable-next-line no-undef
                                 window?.webixLocale ?? "en-US"
                              );
                              // Use the last log as a description text
                              const lastLog =
                                 instance.log[instance.log.length - 1];
                              return `<div
                                    style="float:left;height:70px;line-height:70px;margin-right:10px;color:${color};"
                                    class="fa ${icon} fa-2x">
                                 </div>
                                 <div style="margin:5px 0;height:60px;overflow:hidden;line-height:20px">
                                    <div style="font-size: 16px; font-weight: 600;">
                                       ${title}
                                    </div>
                                    <div>${lastLog.split(":")[2]}</div>
                                 </div>`;
                           },
                        },
                        on: {
                           onItemClick: (id) => this.showInstance(id),
                        },
                     },
                  ],
               },
               { view: "resizer", css: "bg_gray", width: 11 },
               {
                  gravity: 2,
                  rows: [
                     {
                        gravity: 2,
                        rows: [
                           {
                              view: "toolbar",
                              css: "ab-data-toolbar webix_dark",
                              cols: [
                                 { type: "spacer", width: 15 },
                                 {
                                    view: "label",
                                    label: L("Instance Details"),
                                 },
                                 {
                                    id: ids.resetButton,
                                    view: "button",
                                    width: 100,
                                    css: "webix_secondary",
                                    type: "icon",
                                    icon: "fa fa-refresh",
                                    label: L("Reset"),
                                    click: () => this.resetInstance(),
                                 },
                                 {
                                    id: ids.deleteButton,
                                    view: "button",
                                    width: 100,
                                    css: "webix_danger",
                                    type: "icon",
                                    icon: "fa fa-trash",
                                    label: L("Delete"),
                                    click: () => this.deleteInstance(),
                                 },
                                 { type: "spacer", width: 1 },
                              ],
                           },
                           {
                              view: "property",
                              height: 200,
                              id: ids.detailView,
                              editable: false,
                              elements: [
                                 { label: L("Instance"), type: "label" },
                                 {
                                    label: L("ID"),
                                    type: "text",
                                    id: "id",
                                 },
                                 {
                                    label: L("Created"),
                                    type: "date",
                                    id: "created",
                                 },
                                 {
                                    label: L("Updated"),
                                    type: "date",
                                    id: "updated",
                                 },
                                 {
                                    label: L("Job ID"),
                                    type: "text",
                                    id: "jobId",
                                 },
                                 {
                                    label: L("Status"),
                                    type: "text",
                                    id: "status",
                                 },
                                 {
                                    label: L("Triggered By"),
                                    type: "text",
                                    id: "triggeredBy",
                                 },
                              ],
                           },
                        ],
                     },
                     {
                        view: "tabview",
                        id: ids.tabGroup,
                        css: "webix_dark",
                        cells: [
                           {
                              header: L("Logs"),
                              body: {
                                 id: ids.processLogs,
                                 view: "list",
                                 type: { height: "auto" },
                                 template:
                                    '<div style="padding:5px 0; line-height:20px;color:black">#value#</div>',
                              },
                           },
                           {
                              header: L("Context"),
                              body: {
                                 view: "treetable",
                                 id: ids.context,
                                 css: { color: "black !important" },
                                 resizable: true,
                                 scroll: true,
                                 columns: [
                                    {
                                       id: "title",
                                       header: L("Property"),
                                       width: 300,
                                       template: "{common.treetable()} #key#",
                                    },
                                    {
                                       id: "value",
                                       header: L("Value"),
                                       width: 500,
                                    },
                                 ],
                              },
                           },
                        ],
                     },
                  ],
               },
            ],
         };
      }

      // Our init() function for setting up our UI
      async init(AB) {
         this.model = AB.objectProcessInstance().model();
      }

      async processLoad(process) {
         super.processLoad(process);
         this.loadInstances();
      }

      /**
       * load process instances into the list
       * @param {boolean} [clear=true] whether or not to clear the list
       */
      async loadInstances(clear = true) {
         // Define a custom webix proxy which allows us to dynamically load data
         const proxy = {
            $proxy: true,
            load: (...a) => this.fetchInstances(...a),
         };
         const self = this;
         const cb = function () {
            // select the first record by default
            const id = this.getFirstId();
            this.select(id);
            self.showInstance(id);
         };
         $$(this.ids.taskList).load(proxy, "json", cb, clear);
      }

      /**
       * fetch instances from the server, follows webix proxy api
       * (see https://docs.webix.com/desktop__server_proxy.html#creatingcustomproxyobjects)
       * @param {object} view
       * @param {object} params
       * @return {Promise<object>} response from server with data and paging
       */
      async fetchInstances(v, params) {
         const processIdField = "d5afbc83-17dd-4b38-bded-1bf3f4594135";
         const where = {
            glue: "and",
            rules: [
               {
                  key: processIdField,
                  rule: "equals",
                  value: this.CurrentProcessID,
               },
            ],
         };
         // generate the rules for our filters
         if (this.filter?.length > 0) {
            const statusField = "b957a75d-65aa-427c-a813-63211658649a";
            this.filter.forEach((status) =>
               where.rules.push({
                  key: statusField,
                  rule: "not_equal",
                  value: status,
               })
            );
         }
         const res = await this.model.findAll({
            where,
            sort: [{ key: "updated_at", dir: "DESC" }],
            limit: params?.count ?? INSTANCES_IN_PAGE,
            offset: params?.start ?? 0,
         });
         return res;
      }

      showInstance(itemId) {
         this.instance = itemId;
         const ids = this.ids;
         // Clear if itemId is undefinded (happens if last instance is deleted)
         if (!itemId) {
            $$(ids.processLogs).clearAll();
            $$(ids.detailView).clear();
            $$(ids.tabGroup).removeView(ids.error);
            $$(ids.context).clearAll();
            $$(ids.resetButton).hide();
            $$(ids.deleteButton).hide();
            return;
         }
         const item = $$(ids.taskList).getItem(itemId);
         const logs = item.log.map((log, index) => {
            return { id: index, value: log };
         });
         $$(ids.processLogs).clearAll();
         $$(ids.processLogs).parse(logs);
         $$(ids.detailView).setValues({
            id: item.id,
            created: new Date(item.created_at),
            updated: new Date(item.updated_at),
            jobId: item.jobID,
            status: item.status,
            triggeredBy: item.triggeredBy,
         });
         $$(ids.context).clearAll();
         $$(ids.context).parse(this.processContext(item.context), "json");
         $$(ids.context).refresh();
         $$(ids.detailView).refresh();
         // Only display the error tab if this instance has errors
         $$(ids.tabGroup).removeView(ids.error);
         if (item.errorTasks) {
            const errors = [];
            for (var key in item.errorTasks) {
               errors.push({
                  key,
                  error: item.errorTasks[key],
               });
            }
            $$(ids.tabGroup).addView({
               header: "Errors",
               body: {
                  id: ids.error,
                  view: "list",
                  type: { height: "auto" },
                  template: '<div style="color:black">#key# #error#</div>',
                  data: errors,
               },
            });
         }
         // when you click an instance we need to know if
         // we should show the reset button if it is an error
         if (item.status == "error") {
            $$(ids.resetButton).show();
         } else {
            $$(ids.resetButton).hide();
         }
         $$(ids.deleteButton).show();
      }

      async deleteInstance() {
         const instance = this.instance;
         const confirmed = await webix
            .confirm({
               title: L("Delete Instance"),
               text: L("Are you sure? This can't be undone."),
               type: "confirm-warning",
            })
            .catch(() => {}); //supress console.error
         if (!confirmed) return;

         const res = await this.model.delete(instance);

         if (res.numRows > 0) {
            const $taskList = $$(this.ids.taskList);
            const nextInstance = $taskList.getNextId(this.instance);
            $taskList.remove(this.instance);
            this.showInstance(nextInstance);
            webix.message({
               text: `${L("Deleted Instance")} ${instance}`,
               type: "success",
            });
         } else {
            webix.messages({
               text: L("No rows were effected.  This does not seem right."),
               type: "warn",
            });
         }
      }

      async resetInstance() {
         const item = $$(this.ids.taskList).getItem(this.instance);
         const errorTasks = Object.keys(item.errorTasks);
         if (errorTasks.length < 1) return;
         const task = this.CurrentProcess.elements().filter((e) => {
            return e.diagramID === errorTasks[0];
         })[0];

         const confirmed = await webix
            .confirm({
               title: L("Reset Instance"),
               text: `${L("Restart from")} '${task.label}' (${task.key} ${L(
                  "Task"
               )})?`,
            })
            .catch(() => {}); //supress console.error
         if (!confirmed) return;
         const response = await this.AB.Network.put({
            url: `/process/reset/${task.id}`,
            params: { instanceID: this.instance },
         });
         if (response == 1) {
            webix.message({
               text: L("Instance Reset"),
               type: "success",
            });
            this.processLoad(this.CurrentProcess);
         }
      }

      // Convert context into a tree structure for webix display
      processContext(data) {
         const elements = [];
         for (const key in data) {
            if (
               typeof data[key] === "object" &&
               !Array.isArray(data[key]) &&
               data[key] !== null
            ) {
               elements.push({
                  key: key,
                  open: true,
                  data: this.processContext(data[key]),
               });
            } else {
               elements.push({
                  key: key,
                  value: data[key],
               });
            }
         }
         return elements;
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }
   }

   return new UI_Work_Process_Workspace_Monitor();
}
