import { PluginMessageEvent } from "./model";
import "./style.css";

const root = document.querySelector<HTMLDivElement>("#app")!;

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

root.innerHTML = `
  <div class="plugin-wrapper">
  <header>
    <h1>Orphaned components Locator</h1>
    <span>#NUMBER</span>
  </header>
  <main class="orphaned-list-wrapper">
    <ul class="orphaned-list">
      <li>
        <span class="icon"></span> <span class="name">Component name</span>
        <button class="focus">ICON</button>
      </li>
    </ul>
  </main>
  <footer>
    <button
      id="locate"
      type="button"
      data-appearance="primary"
    >
      List orphaned
    </button>
  </footer>
</div>
`;

document.getElementById("locate")?.addEventListener("click", () => {
  sendMessage({
    content: "",
    type: "locate",
  });
});

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "theme") {
    root.setAttribute("data-theme", event.data.content);
  }
});

function sendMessage(message: PluginMessageEvent): void {
  parent.postMessage(message, "*");
}

init();
