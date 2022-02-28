// ABViewGrid.js
//
// Manages the settings for a Data Grid View in the AppBuilder Object Workspace
// These properties serve 2 purposes: they collect the configuration information
// for a grid view, and they also are able to store those settings

// const ABObjectWorkspaceView = require("./ABObjectWorkspaceView");

var defaultValues = {
   name: "Default Grid",
   sortFields: [], // array of columns with their sort configurations
   filterConditions: [], // array of filters to apply to the data table
   frozenColumnID: "", // id of column you want to stop freezing
   hiddenFields: [], // array of [ids] to add hidden:true to
};

import UI_Class from "../../ui_class";

export default function (AB, ibase) {
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   class ABViewGrid extends UIClass {
      constructor(idBase) {
         super(idBase);

         /*
	{
		id:uuid(),
		type:'grid',  
		sortFields:[],
		filterConditions:[],
		frozenColumnID:"",
		hiddenFields:[],
	}

*/
      }

      /**
       * unique key describing this View.
       * @return {string}
       */
      type() {
         return "grid";
      }

      /**
       * @return {string}
       */
      icon() {
         return "fa fa-table";
      }

      /**
       * @method fromObj
       * take our persisted data, and properly load it
       * into this object instance.
       * @param {json} data  the persisted data
       */
      fromSettings(data) {
         // super.fromObj(data);

         for (var v in defaultValues) {
            this[v] = data[v] || defaultValues[v];
         }

         this.type = this.type();
         this.key = this.type();
      }

      /**
       * @method toObj()
       * compile our current state into a {json} object
       * that can be persisted.
       */
      toSettings() {
         var obj = {}; // super.toObj();

         for (var v in defaultValues) {
            obj[v] = this[v] || defaultValues[v];
         }

         obj.key = this.type();
         obj.type = this.type();
         return obj;
      }
   }

   return new ABViewGrid(ibase);
}
