import { PenpotShape } from "@penpot/plugin-types";
import { PluginMessageEvent } from "./model";

console.log("Hello from the plugin!");

penpot.ui.open(
  "ORPHANED COMPONENT LOCATOR PLUGIN",
  `?theme=${penpot.getTheme()}`,
  {
    width: 300,
    height: 600,
  }
);

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
    (shape) => !shape.componentRefShape
  );

  console.log(orphanedInstances);

  return orphanedInstances;
}

function getOrphanedComponentInstances() {
  const message = {
    type: "orphaned",
    content: filterOrphanedShapes()?.map((shape) => {
      return {
        name: shape.name,
      };
    }),
  };

  console.log("message", message);

  penpot.ui.sendMessage(message);
}

penpot.ui.onMessage<PluginMessageEvent>((message) => {
  if (message.type === "locate") {
    getOrphanedComponentInstances();
  }
});
