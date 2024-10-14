/**
 * This file contains the typescript interfaces for the plugin events.
 */

import { Page } from "@penpot/plugin-types";

export interface ThemePluginEvent {
  type: "theme";
  content: string;
}

export interface LocateOrphanedPluginEvent {
  type: "locate";
  content: string;
}

export interface CenterViewportPluginEvent {
  type: "centerViewport";
  content: string;
}

export interface PageChangePluginEvent {
  type: "page";
  content: Page;
}

export type PluginMessageEvent =
  | ThemePluginEvent
  | LocateOrphanedPluginEvent
  | PageChangePluginEvent
  | CenterViewportPluginEvent;
