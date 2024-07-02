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

// Sets the data theme at the root of the plugin
const updateThemeFromUrl = () => {
  let queryString: string = window.location.search;
  let params: URLSearchParams = new URLSearchParams(queryString);
  let themeValue: string | null = params.get("theme");

  if (themeValue) {
    root.setAttribute("data-theme", themeValue);
  }
};

// Sends a message to the plugin wrapper when the element is clicked
document.getElementById("locate")?.addEventListener("click", () => {
  sendMessage({
    content: "",
    type: "locate",
  });
});

// Incoming message manager
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

      // Get reference to the orphaned component list and remove all the elements
      const orphanedComponentList =
        document.querySelector<HTMLDivElement>("#orphaned-list")!;
      orphanedComponentList.innerHTML = "";

      orphanedComponents.forEach((shape: PenpotShape) => {
        // Create listItem element
        const componentListItem = document.createElement("li");

        // Create and append icon
        const componentListItemIcon = document.createElement("span");
        componentListItemIcon.classList.add("icon", "icon-copy");
        componentListItem.appendChild(componentListItemIcon);

        // Create and append icon
        const componentListItemName = document.createElement("span");
        componentListItemName.classList.add("component-name");
        componentListItemName.innerHTML = shape.name;
        componentListItem.appendChild(componentListItemName);

        // Create and append locate button
        const componentListItemLocateButton = document.createElement("button");
        componentListItemLocateButton.type = "button";
        componentListItemLocateButton.classList.add("navigate-component");
        componentListItemLocateButton.setAttribute(
          "aria-label",
          "Navigate to component"
        );
        componentListItemLocateButton.setAttribute(
          "data-appearance",
          "secondary"
        );
        componentListItemLocateButton.setAttribute("data-shape", shape.id);
        componentListItemLocateButton.innerHTML = "Go";
        componentListItem.appendChild(componentListItemLocateButton);

        orphanedComponentList.appendChild(componentListItem);

        componentListItemLocateButton?.addEventListener("click", (event) => {
          if (
            event.target &&
            event.target instanceof HTMLButtonElement &&
            event.target.dataset.shape
          ) {
            sendMessage({
              content: event.target.dataset.shape,
              type: "centerViewport",
            });
          }
        });
      });
    }
  }
});

function sendMessage(message: PluginMessageEvent): void {
  parent.postMessage(message, "*");
}

init();
