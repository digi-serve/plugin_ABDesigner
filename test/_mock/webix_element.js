export default function webixElement(id) {
   return {
      id: id,
      adjust: () => {},
      blockEvent: () => {},
      clear: () => {},
      clearAll: () => {},
      clearValidation: () => {},
      define: () => {},
      getParentView: () => {
         return new webixElement();
      },
      getValue: () => {},
      refresh: () => {},
      setValue: () => {},
      setValues: () => {},
      show: () => {},
      unblockEvent: () => {},
   };
}
