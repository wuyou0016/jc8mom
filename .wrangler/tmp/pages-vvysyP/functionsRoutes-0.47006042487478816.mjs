import { onRequestGet as __api_stats_summary_js_onRequestGet } from "/Users/Astar/code/jc8mom/functions/api/stats-summary.js"
import { onRequestGet as __api_track_js_onRequestGet } from "/Users/Astar/code/jc8mom/functions/api/track.js"
import { onRequestPost as __api_track_js_onRequestPost } from "/Users/Astar/code/jc8mom/functions/api/track.js"

export const routes = [
    {
      routePath: "/api/stats-summary",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_stats_summary_js_onRequestGet],
    },
  {
      routePath: "/api/track",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_track_js_onRequestGet],
    },
  {
      routePath: "/api/track",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_track_js_onRequestPost],
    },
  ]