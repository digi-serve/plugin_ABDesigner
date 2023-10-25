import UI_Class from "./ui_class";
import UI_ApiObjectReadRequest from "./ui_work_object_list_newObject_api_read_request";
import UI_ApiObjectReadResponse from "./ui_work_object_list_newObject_api_read_response";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const UIRequest = UI_ApiObjectReadRequest(AB);
   const UIResponse = UI_ApiObjectReadResponse(AB);

   class UI_Work_Object_List_NewObject_API_Read extends UIClass {
      constructor() {
         super("ui_work_object_list_newObject_api_read", {});
      }

      ui() {
         // Our webix UI definition:
         const uiResponse = UIResponse.ui();
         return {
            view: "accordion",
            type: "clean",
            multi: false,
            on: {
               onAfterExpand: (viewId) => {
                  if (uiResponse.id == viewId) {
                     const requestVals = UIRequest.getValues();
                     UIResponse.refreshResponse(requestVals);
                  }
               },
            },
            rows: [UIRequest.ui(), uiResponse],
         };
      }

      init(AB) {
         this._shareData = {};

         UIRequest.init(AB, this._shareData);
         UIResponse.init(AB, this._shareData);
      }

      getValues() {
         const values = {
            request: UIRequest.getValues(),
            response: UIResponse.getValues(),
         };

         return values;
      }

      validate() {
         return UIRequest.validate() && UIResponse.validate();
      }

      busy() {
         UIRequest.busy();
         UIResponse.busy();
      }

      ready() {
         UIRequest.ready();
         UIResponse.ready();
      }
   }

   return new UI_Work_Object_List_NewObject_API_Read();
}
