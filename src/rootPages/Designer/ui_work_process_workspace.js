import UI_Class from "./ui_class";
export default function (AB) {
   const UIClass = UI_Class(AB);
   // var L = UIClass.L();
   class UI_Work_Process_Workspace extends UIClass {
      constructor() {
         super();
      }

      ui() {
         return {};
      }

      async init(AB) {
         this.AB = AB;
      }

      populateWorkspace() {}
   }

   return new UI_Work_Process_Workspace();
}
