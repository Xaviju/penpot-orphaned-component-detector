/**
 * This file contains the typescript interfaces for the plugin events.
 */

export interface ThemePluginEvent {
  type: "theme";
  content: string;
}

export interface LocateOrphanedPluginEvent {
  type: "locate";
  content: string;
}

export type PluginMessageEvent = ThemePluginEvent | LocateOrphanedPluginEvent;
