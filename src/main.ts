import { PenpotShape } from "@penpot/plugin-types";
import { PluginMessageEvent } from "./model";
import "./style.css";

const root = document.querySelector<HTMLDivElement>("#app")!;

root.innerHTML = `
<main class="orphaned-list-wrapper">
<div class="orphaned-counter body-s" id="comp-count"></div>
  <ul id="orphaned-list" class="orphaned-list">

  </ul>
</main>
<footer class="plugin-actions">

  <button
    id="locate"
    type="button"
    data-appearance="primary"
  >
    List orphaned
  </button>
</footer>
`;

const init = () => {
  updateThemeFromUrl();
};

// Sets the data theme at the top of the plugin
const updateThemeFromUrl = () => {
  let queryString: string = window.location.search;
  let params: URLSearchParams = new URLSearchParams(queryString);
  let themeValue: string | null = params.get("theme");

  if (themeValue) {
    root.setAttribute("data-theme", themeValue);
  }
};

document.getElementById("locate")?.addEventListener("click", () => {
  sendMessage({
    content: "",
    type: "locate",
  });
});

window.addEventListener("message", (event) => {
  if (event.data) {
    if (event.data.type === "theme") {
      root.setAttribute("data-theme", event.data.content);
    }
    if (event.data.type === "orphaned") {
      const orphanedComponents = event.data.content;

      document.querySelector<HTMLDivElement>(
        "#comp-count"
      )!.innerHTML = `${orphanedComponents.length} orphaned components`;

      const orphanedComponentList =
        document.querySelector<HTMLDivElement>("#orphaned-list")!;
      orphanedComponentList.innerHTML = "";

      orphanedComponents.forEach((comp: PenpotShape) => {
        // Create listItem element
        const componentListItem = document.createElement("li");

        // Create and append icon
        const componentListItemIcon = document.createElement("span");
        componentListItemIcon.classList.add("icon", "icon-copy");
        componentListItem.appendChild(componentListItemIcon);

        // Create and append icon
        const componentListItemName = document.createElement("span");
        componentListItemName.classList.add("component-name");
        componentListItemName.innerHTML = comp.name;
        componentListItem.appendChild(componentListItemName);

        // Create and append locate button
        const componentListItemLocateButton = document.createElement("button");
        componentListItemLocateButton.classList.add("navigate-component");
        componentListItemLocateButton.innerHTML = "Navigate";
        componentListItem.appendChild(componentListItemLocateButton);

        orphanedComponentList.appendChild(componentListItem);
      });
    }
  }
});

function sendMessage(message: PluginMessageEvent): void {
  parent.postMessage(message, "*");
}

init();
