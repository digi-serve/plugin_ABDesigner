const EventEmitter = require("events").EventEmitter;

export default class AB {
   constructor(definitions) {
      this._definitions = definitions || {};

      this.ClassUI = ClassUI;
      this.Multilingual = Multilingual;
   }
}

export class ClassUI extends EventEmitter {
   constructor(definitions) {
      super();
      this.ids = definitions || {};
   }
}

export class Multilingual {
   static labelPlugin(...params) {
      this._params = params;
   }
}
