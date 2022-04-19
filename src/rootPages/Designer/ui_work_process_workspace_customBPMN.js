/*
 * ui_work_process_workspace_customBPMN
 *
 * Provide customized interface modifications to BPMN Modler
 *
 */
import FPaletteProvider from "./ui_work_process_workspace_customBPMN_paletteProvider";
import FReplaceMenuProvider from "./ui_work_process_workspace_customBPMN_replaceMenuProvider";

export default function (AB) {
   const PaletteProvider = FPaletteProvider(AB);
   const ReplaceMenuProvider = FReplaceMenuProvider(AB);

   return {
      __init__: ["paletteProvider", "replaceMenuProvider"],
      paletteProvider: ["type", PaletteProvider],
      replaceMenuProvider: ["type", ReplaceMenuProvider],
   };
}
