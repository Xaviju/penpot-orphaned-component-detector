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

function getShapes() {
  const shapes = penpot.getPage()?.findShapes();
  console.log("shapes", shapes);
  return shapes;
}

// function getOrphaned() {
//   penpot.ui.sendMessage({
//     type: "orphaned",
//     content: {
//       selection: getShapes(),
//     },
//   });
// }

penpot.ui.onMessage<PluginMessageEvent>((message) => {
  if (message.type === "locate") {
    getShapes();
  }
});
