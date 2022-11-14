import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import {
   append as svgAppend,
   attr as svgAttr,
   create as svgCreate,
   remove as svgRemove,
} from "tiny-svg";

import { getRoundRectPath } from "bpmn-js/lib/draw/BpmnRenderUtil";

import { is } from "bpmn-js/lib/util/ModelUtil";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";

const HIGH_PRIORITY = 1500,
   TASK_BORDER_RADIUS = 2;

class CustomRenderer extends BaseRenderer {
   constructor(eventBus, bpmnRenderer) {
      super(eventBus, HIGH_PRIORITY);

      this.bpmnRenderer = bpmnRenderer;
   }

   canRender(element) {
      // only render tasks and events (ignore labels)
      return (
         isAny(element, ["bpmn:Task", "bpmn:Event"]) && !element.labelTarget
      );
   }

   drawShape(parentNode, element) {
      const shape = this.bpmnRenderer.drawShape(parentNode, element);

      // NOTE: our ui_work_process_workspace_model.checkKnownElement()
      // will mark an element with .___abwarnings if it should be
      // marked with our warning symbol.
      if (element.___abwarnings) {
         const rect = drawTriangle(
            parentNode,
            20,
            20
            // TASK_BORDER_RADIUS,
            // "#cc0000"
         );

         svgAttr(rect, {
            transform: "translate(-10, 10)",
         });
      }
      return shape;
   }

   getShapePath(shape) {
      if (is(shape, "bpmn:Task")) {
         return getRoundRectPath(shape, TASK_BORDER_RADIUS);
      }

      return this.bpmnRenderer.getShapePath(shape);
   }
}

CustomRenderer.$inject = ["eventBus", "bpmnRenderer"];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, strokeColor) {
   const rect = svgCreate("rect");

   svgAttr(rect, {
      width: width,
      height: height,
      rx: borderRadius,
      ry: borderRadius,
      stroke: strokeColor || "#000",
      strokeWidth: 2,
      fill: "#fff",
   });

   svgAppend(parentNode, rect);

   return rect;
}

function drawTriangle(parentNode, width, height) {
   let mid = width / 2;

   let points = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: mid, y: -1 * height },
   ];
   let pointsString = points
      .map(function (point) {
         return point.x + "," + point.y;
      })
      .join(" ");

   const tri = svgCreate("polygon");
   svgAttr(tri, {
      points: pointsString,
      stroke: "#f90",
      strokeWidth: 2,
      fill: "#f90",
   });

   svgAppend(parentNode, tri);

   return tri;
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
function prependTo(newNode, parentNode, siblingNode) {
   parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}

export default function (/* AB */) {
   return CustomRenderer;
}
