import { Shape } from "@penpot/plugin-types";
import { PluginMessageEvent } from "./model";
import "./style.css";

const root = document.querySelector<HTMLDivElement>("#app")!;

const icons = {
  locate: `
  <svg version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none">
    <path d="m8.0011-3e-8c-4.4117 0-8.0011 3.5895-8.0011 8.0011 0 4.4117 3.5895 7.9989 8.0011 7.9989 4.4112-6.59e-4 7.9989-3.5877 7.9989-7.9989 0-3.9948-3.5561-7.9793-7.9989-8.0011zm-0.55811 1.2296v2.3066c0 0.30824 0.24988 0.55811 0.55811 0.55811 0.30824 0 0.55811-0.24988 0.55811-0.55811v-2.3066c3.3375 0.28157 5.9301 2.8758 6.2111 6.2134h-2.3043c-0.30824 0-0.55811 0.24988-0.55811 0.55811s0.24988 0.55811 0.55811 0.55811h2.3043c-0.28108 3.3377-2.8735 5.932-6.2111 6.2134v-2.3066c0-0.30824-0.24988-0.55811-0.55811-0.55811-0.30823 0-0.55811 0.24988-0.55811 0.55811v2.3066c-3.3381-0.28097-5.9323-2.8753-6.2134-6.2134h2.3066c0.30824 0 0.55811-0.24988 0.55811-0.55811s-0.24988-0.55811-0.55811-0.55811h-2.3066c0.28112-3.338 2.8754-5.9323 6.2134-6.2134z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" />
  </svg>`,
  component: `
  <svg version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor">
    <path d="m6.8764 0.98119a1.5903 1.5896 0 0 1 2.2471 0l5.8987 5.8958c0.61961 0.62034 0.61961 1.6257 0 2.246l-5.8987 5.8958c-0.62064 0.61931-1.6265 0.61931-2.2471 0l-5.8987-5.8958a1.5903 1.5896 0 0 1 0-2.246zm0.77968 4.8678-1.8082 1.8073a0.48536 0.48512 0 0 0 0 0.68743l1.8082 1.8073a0.48536 0.48512 0 0 0 0.68777 0l1.8082-1.8073a0.48536 0.48512 0 0 0 0-0.68743l-1.8082-1.8073a0.48536 0.48512 0 0 0-0.68777 0z" stroke-linecap="round" stroke-width="1.0324"/>
  </svg>`,
  empty: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
};

root.innerHTML = `
<div class="plugin-wrapper">
  <div id="plugin-welcome" class="plugin-welcome">
    <div class="plugin-welcome-inner">
      <div class="plugin-welcome-hero">${icons.component}</div>
      <p class="plugin-welcome-text">Click on the button to list orphaned components</p>
    </div>
  </div>
  <main
    id="plugin-main"
    class="plugin-main"
    hidden
  >
    <div
        class="orphaned-counter body-s"
        id="comp-count"
      ></div>
    <div class="plugin-content-wrapper" id="plugin-content-wrapper">
    </div>
  </main>
  <!-- <div class="plugin-error">

  </div> -->

</div>
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

const handleLocateButtonClick = () => {
  sendMessage({
    content: "",
    type: "locate",
  });
};

// Sends a message to the plugin wrapper when the element is clicked
document.getElementById("locate")?.addEventListener("click", () => {
  handleLocateButtonClick();
});

// Incoming message manager
window.addEventListener("message", (event) => {
  if (event.data) {
    if (event.data.type === "page") {
      reset();
    }
    if (event.data.type === "theme") {
      root.setAttribute("data-theme", event.data.content);
    }
    if (event.data.type === "orphaned") {
      const pageTransition = () => {
        document
          .querySelector<HTMLDivElement>("#plugin-welcome")
          ?.setAttribute("hidden", "hidden");
        document
          .querySelector<HTMLDivElement>("#plugin-main")
          ?.removeAttribute("hidden");
      };

      if (!document.startViewTransition) {
        pageTransition();
      } else {
        document.startViewTransition(() => pageTransition());
      }

      const orphanedComponents = event.data.content || [];

      // Get reference to the orphaned component list and remove all the elements
      const pluginContentWrapper = document.querySelector<HTMLDivElement>(
        "#plugin-content-wrapper"
      )!;
      pluginContentWrapper.innerHTML = "";

      // Set the counter of orphaned element
      document.querySelector<HTMLDivElement>(
        "#comp-count"
      )!.innerHTML = `${orphanedComponents.length} orphaned components`;

      if (orphanedComponents.length) {
        const orphanedComponentListWrapper = document.createElement("div");
        orphanedComponentListWrapper.classList.add("orphaned-list-wrapper");
        pluginContentWrapper.appendChild(orphanedComponentListWrapper);

        // Create UL component list
        const orphanedComponentList = document.createElement("ul");
        orphanedComponentList.classList.add("orphaned-list");
        orphanedComponentListWrapper.appendChild(orphanedComponentList);

        // Generate the corresponding LI element for each shape
        orphanedComponents.forEach((shape: Shape) => {
          // Create listItem element
          const componentListItem = document.createElement("li");

          // Create and append icon
          componentListItem.innerHTML = icons.component;

          // Create and append icon
          const componentListItemName = document.createElement("div");
          componentListItemName.classList.add("component-name", "body-m");
          componentListItemName.innerHTML = shape.name;
          componentListItem.appendChild(componentListItemName);

          // Create and append locate button
          const componentListItemLocateButton =
            document.createElement("button");
          componentListItemLocateButton.type = "button";
          componentListItemLocateButton.classList.add("navigate-component");
          componentListItemLocateButton.setAttribute(
            "aria-label",
            "Navigate to component"
          );
          componentListItemLocateButton.setAttribute("data-shape", shape.id);
          componentListItemLocateButton.innerHTML = icons.locate;
          componentListItem.appendChild(componentListItemLocateButton);

          orphanedComponentList.appendChild(componentListItem);

          componentListItemLocateButton?.addEventListener("click", (event) => {
            if (
              event.currentTarget &&
              event.currentTarget instanceof HTMLButtonElement &&
              event.currentTarget.dataset.shape
            ) {
              sendMessage({
                content: event.currentTarget.dataset.shape,
                type: "centerViewport",
              });
            }
          });
        });
      } else {
        const emptyOrphanedComponentsWrapper = document.createElement("div");
        emptyOrphanedComponentsWrapper.classList.add("empty-orphaned-wrapper");

        const emptyOrphanedComponents = document.createElement("div");
        emptyOrphanedComponents.classList.add("empty-orphaned");

        const emptyOrphanedComponentsIcon = document.createElement("div");
        emptyOrphanedComponentsIcon.innerHTML = icons.empty;

        const emptyOrphanedComponentsTxt = document.createElement("p");
        emptyOrphanedComponentsTxt.innerHTML =
          "Well done! <br> Couldn't find any orphaned components in this page";

        emptyOrphanedComponents.appendChild(emptyOrphanedComponentsIcon);
        emptyOrphanedComponents.appendChild(emptyOrphanedComponentsTxt);
        emptyOrphanedComponentsWrapper.appendChild(emptyOrphanedComponents);
        pluginContentWrapper.appendChild(emptyOrphanedComponentsWrapper);
      }
    }
  }
});

const reset = () => {
  const pageTransition = () => {
    document
      .querySelector<HTMLDivElement>("#plugin-welcome")
      ?.removeAttribute("hidden");
    document
      .querySelector<HTMLDivElement>("#plugin-main")
      ?.setAttribute("hidden", "hidden");
  };

  if (!document.startViewTransition) {
    pageTransition();
  } else {
    document.startViewTransition(() => pageTransition());
  }

  // Get reference to the orphaned component list and remove all the elements
  const orphanedComponentWrapper = document.querySelector<HTMLDivElement>(
    "#orphaned-list-wrapper"
  )!;
  orphanedComponentWrapper.innerHTML = "";
};

function sendMessage(message: PluginMessageEvent): void {
  parent.postMessage(message, "*");
}

init();
