import { PenpotShape } from "@penpot/plugin-types";
import { PluginMessageEvent } from "./model";

console.log("Hello from the plugin!");

penpot.ui.open("ORPHANED DETECTOR PLUGIN", `?theme=${penpot.getTheme()}`, {
  width: 400,
  height: 800,
});

penpot.on("themechange", (theme) => {
  sendMessage({ type: "theme", content: theme });
});

function sendMessage(message: PluginMessageEvent) {
  penpot.ui.sendMessage(message);
}

function filterOrphanedShapes(): PenpotShape[] | null {
  const pageShapes = penpot.getPage()?.findShapes();
  if (!pageShapes) return null;

  const componentInstances = pageShapes.filter(
    (shape): boolean => shape.isComponentInstance() && shape.isComponentHead()
  );

  if (!componentInstances.length) return null;

  const orphanedInstances: PenpotShape[] = componentInstances.filter(
    (shape) => !shape.componentRefShape()
  );

  console.log("orphanedInstances", orphanedInstances);

  return orphanedInstances;
}

// Receives a message from the plugin UI and locates orphaned components
function getOrphanedComponentInstances() {
  const message = {
    type: "orphaned",
    content: filterOrphanedShapes()?.map((shape) => {
      return shape;
    }),
  };

  penpot.ui.sendMessage(message);
}

function centerViewport(message: PluginMessageEvent) {
  const shape = penpot.getPage()?.getShapeById(message.content);
  if (shape) {
    const center = penpot.utils.geometry.center([shape])!;
    penpot.viewport.center = center;
    // penpot.selection = [shape];
  }
}

penpot.ui.onMessage<PluginMessageEvent>((message) => {
  if (message.type === "locate") {
    getOrphanedComponentInstances();
  }
  if (message.type === "centerViewport") {
    centerViewport(message);
  }
});
