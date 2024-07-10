import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './astro/server_-EfFORJD.mjs';
import 'clsx';
import 'html-escaper';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/signout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signout.ts","pathname":"/api/auth/signout","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/log-error","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/log-error\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"log-error","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/log-error.ts","pathname":"/api/log-error","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.C8XSD0GW.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.Boq_3cTx.css"},{"type":"inline","content":"body{font-family:Roboto,sans-serif}.resizer[data-astro-cid-ouamjn2i]{width:6px;height:100%;background-color:#e0e0e0;cursor:col-resize;transition:background-color .3s}.resizer[data-astro-cid-ouamjn2i]:hover{background-color:#bdbdbd}.main-content[data-astro-cid-ouamjn2i]{border-radius:8px;box-shadow:0 4px 6px #0000001a}.modal[data-astro-cid-ouamjn2i]{display:none;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;background-color:#0006}.modal-content[data-astro-cid-ouamjn2i]{background-color:#fefefe;margin:15% auto;padding:20px;border:1px solid #888;width:80%;max-width:500px;border-radius:8px}.tab[data-astro-cid-ouamjn2i]{cursor:pointer;padding:10px 20px;margin:0 2px;background-color:#f1f1f1;border:none;border-radius:5px 5px 0 0}.tab[data-astro-cid-ouamjn2i].active{background-color:#fff;border-bottom:2px solid #4a90e2}.tab-content[data-astro-cid-ouamjn2i]{display:none;padding:20px;border-top:none}\n"}],"routeData":{"route":"/courses/[...slug]","isIndex":false,"type":"page","pattern":"^\\/courses(?:\\/(.*?))?\\/?$","segments":[[{"content":"courses","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/courses/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.C8XSD0GW.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.Boq_3cTx.css"},{"type":"inline","content":"body{font-family:Roboto,sans-serif}.resizer[data-astro-cid-ouamjn2i]{width:6px;height:100%;background-color:#e0e0e0;cursor:col-resize;transition:background-color .3s}.resizer[data-astro-cid-ouamjn2i]:hover{background-color:#bdbdbd}.main-content[data-astro-cid-ouamjn2i]{border-radius:8px;box-shadow:0 4px 6px #0000001a}.modal[data-astro-cid-ouamjn2i]{display:none;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;background-color:#0006}.modal-content[data-astro-cid-ouamjn2i]{background-color:#fefefe;margin:15% auto;padding:20px;border:1px solid #888;width:80%;max-width:500px;border-radius:8px}.tab[data-astro-cid-ouamjn2i]{cursor:pointer;padding:10px 20px;margin:0 2px;background-color:#f1f1f1;border:none;border-radius:5px 5px 0 0}.tab[data-astro-cid-ouamjn2i].active{background-color:#fff;border-bottom:2px solid #4a90e2}.tab-content[data-astro-cid-ouamjn2i]{display:none;padding:20px;border-top:none}\n"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.Boq_3cTx.css"}],"routeData":{"route":"/profile","isIndex":false,"type":"page","pattern":"^\\/profile\\/?$","segments":[[{"content":"profile","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/profile.astro","pathname":"/profile","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.C8XSD0GW.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.Boq_3cTx.css"},{"type":"inline","content":"body{font-family:Roboto,sans-serif}.resizer[data-astro-cid-ouamjn2i]{width:6px;height:100%;background-color:#e0e0e0;cursor:col-resize;transition:background-color .3s}.resizer[data-astro-cid-ouamjn2i]:hover{background-color:#bdbdbd}.main-content[data-astro-cid-ouamjn2i]{border-radius:8px;box-shadow:0 4px 6px #0000001a}.modal[data-astro-cid-ouamjn2i]{display:none;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;background-color:#0006}.modal-content[data-astro-cid-ouamjn2i]{background-color:#fefefe;margin:15% auto;padding:20px;border:1px solid #888;width:80%;max-width:500px;border-radius:8px}.tab[data-astro-cid-ouamjn2i]{cursor:pointer;padding:10px 20px;margin:0 2px;background-color:#f1f1f1;border:none;border-radius:5px 5px 0 0}.tab[data-astro-cid-ouamjn2i].active{background-color:#fff;border-bottom:2px solid #4a90e2}.tab-content[data-astro-cid-ouamjn2i]{display:none;padding:20px;border-top:none}\n"}],"routeData":{"route":"/signup","isIndex":false,"type":"page","pattern":"^\\/signup\\/?$","segments":[[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/signup.astro","pathname":"/signup","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Cllz_4Nu.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.Boq_3cTx.css"},{"type":"inline","content":":root{--accent: 136, 58, 234;--accent-light: 224, 204, 250;--accent-dark: 49, 10, 101;--accent-gradient: linear-gradient( 45deg, rgb(var(--accent)), rgb(var(--accent-light)) 30%, white 60% )}html{font-family:system-ui,sans-serif;background:#13151a;background-size:224px}code{font-family:Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace}\n"}],"routeData":{"route":"/training","isIndex":false,"type":"page","pattern":"^\\/training\\/?$","segments":[[{"content":"training","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/training.astro","pathname":"/training","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BAmHRVad.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.Boq_3cTx.css"},{"type":"inline","content":".markdown-content[data-astro-cid-ioosybgm]{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;line-height:1.6;color:#333}.markdown-content[data-astro-cid-ioosybgm] h1[data-astro-cid-ioosybgm],.markdown-content[data-astro-cid-ioosybgm] h2[data-astro-cid-ioosybgm],.markdown-content[data-astro-cid-ioosybgm] h3[data-astro-cid-ioosybgm],.markdown-content[data-astro-cid-ioosybgm] h4[data-astro-cid-ioosybgm],.markdown-content[data-astro-cid-ioosybgm] h5[data-astro-cid-ioosybgm],.markdown-content[data-astro-cid-ioosybgm] h6[data-astro-cid-ioosybgm]{margin-top:24px;margin-bottom:16px;font-weight:600;line-height:1.25}.markdown-content[data-astro-cid-ioosybgm] h1[data-astro-cid-ioosybgm]{font-size:2em}.markdown-content[data-astro-cid-ioosybgm] h2[data-astro-cid-ioosybgm]{font-size:1.5em}.markdown-content[data-astro-cid-ioosybgm] h3[data-astro-cid-ioosybgm]{font-size:1.25em}.markdown-content[data-astro-cid-ioosybgm] h4[data-astro-cid-ioosybgm]{font-size:1em}.markdown-content[data-astro-cid-ioosybgm] h5[data-astro-cid-ioosybgm]{font-size:.875em}.markdown-content[data-astro-cid-ioosybgm] h6[data-astro-cid-ioosybgm]{font-size:.85em}.markdown-content[data-astro-cid-ioosybgm] p[data-astro-cid-ioosybgm]{margin-top:0;margin-bottom:16px}.markdown-content[data-astro-cid-ioosybgm] a[data-astro-cid-ioosybgm]{color:#0366d6;text-decoration:none}.markdown-content[data-astro-cid-ioosybgm] a[data-astro-cid-ioosybgm]:hover{text-decoration:underline}.markdown-content[data-astro-cid-ioosybgm] ul[data-astro-cid-ioosybgm],.markdown-content[data-astro-cid-ioosybgm] ol[data-astro-cid-ioosybgm]{margin-top:0;margin-bottom:16px;padding-left:2em}.markdown-content[data-astro-cid-ioosybgm] li[data-astro-cid-ioosybgm]{margin-bottom:.25em}.markdown-content[data-astro-cid-ioosybgm] code[data-astro-cid-ioosybgm]{font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;font-size:85%;background-color:#1b1f230d;padding:.2em .4em;border-radius:3px}.markdown-content[data-astro-cid-ioosybgm] pre[data-astro-cid-ioosybgm]{font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;font-size:85%;line-height:1.45;overflow:auto;padding:16px;margin-top:0;margin-bottom:16px;background-color:#f6f8fa;border-radius:3px}.markdown-content[data-astro-cid-ioosybgm] pre[data-astro-cid-ioosybgm] code[data-astro-cid-ioosybgm]{background-color:transparent;padding:0}.markdown-content[data-astro-cid-ioosybgm] blockquote[data-astro-cid-ioosybgm]{margin:0;padding:0 1em;color:#6a737d;border-left:.25em solid #dfe2e5}.markdown-content[data-astro-cid-ioosybgm] img[data-astro-cid-ioosybgm]{max-width:100%;box-sizing:content-box}.markdown-content[data-astro-cid-ioosybgm] hr[data-astro-cid-ioosybgm]{height:.25em;padding:0;margin:24px 0;background-color:#e1e4e8;border:0}.markdown-content[data-astro-cid-ioosybgm] table[data-astro-cid-ioosybgm]{border-spacing:0;border-collapse:collapse;margin-top:0;margin-bottom:16px}.markdown-content[data-astro-cid-ioosybgm] table[data-astro-cid-ioosybgm] th[data-astro-cid-ioosybgm],.markdown-content[data-astro-cid-ioosybgm] table[data-astro-cid-ioosybgm] td[data-astro-cid-ioosybgm]{padding:6px 13px;border:1px solid #dfe2e5}.markdown-content[data-astro-cid-ioosybgm] table[data-astro-cid-ioosybgm] tr[data-astro-cid-ioosybgm]{background-color:#fff;border-top:1px solid #c6cbd1}.markdown-content[data-astro-cid-ioosybgm] table[data-astro-cid-ioosybgm] tr[data-astro-cid-ioosybgm]:nth-child(2n){background-color:#f6f8fa}\nbody{font-family:Roboto,sans-serif}.resizer[data-astro-cid-ouamjn2i]{width:6px;height:100%;background-color:#e0e0e0;cursor:col-resize;transition:background-color .3s}.resizer[data-astro-cid-ouamjn2i]:hover{background-color:#bdbdbd}.main-content[data-astro-cid-ouamjn2i]{border-radius:8px;box-shadow:0 4px 6px #0000001a}.modal[data-astro-cid-ouamjn2i]{display:none;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;background-color:#0006}.modal-content[data-astro-cid-ouamjn2i]{background-color:#fefefe;margin:15% auto;padding:20px;border:1px solid #888;width:80%;max-width:500px;border-radius:8px}.tab[data-astro-cid-ouamjn2i]{cursor:pointer;padding:10px 20px;margin:0 2px;background-color:#f1f1f1;border:none;border-radius:5px 5px 0 0}.tab[data-astro-cid-ouamjn2i].active{background-color:#fff;border-bottom:2px solid #4a90e2}.tab-content[data-astro-cid-ouamjn2i]{display:none;padding:20px;border-top:none}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/training.astro",{"propagation":"none","containsHead":true}],["/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/courses/[...slug].astro",{"propagation":"none","containsHead":true}],["/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/login.astro",{"propagation":"none","containsHead":true}],["/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/signup.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/auth/signout@_@ts":"pages/api/auth/signout.astro.mjs","\u0000@astro-page:src/pages/api/log-error@_@ts":"pages/api/log-error.astro.mjs","\u0000@astro-page:src/pages/courses/[...slug]@_@astro":"pages/courses/_---slug_.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/profile@_@astro":"pages/profile.astro.mjs","\u0000@astro-page:src/pages/signup@_@astro":"pages/signup.astro.mjs","\u0000@astro-page:src/pages/training@_@astro":"pages/training.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-renderers":"renderers.mjs","/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/generic_GLnnZpo8.mjs","/src/pages/api/auth/signout.ts":"chunks/signout_jdaZ1tS7.mjs","/src/pages/api/log-error.ts":"chunks/log-error_VKqp9ugD.mjs","/src/pages/courses/[...slug].astro":"chunks/_...slug__CoBC4wC2.mjs","/src/pages/login.astro":"chunks/login_BXzVqxdv.mjs","/src/pages/profile.astro":"chunks/profile_LFsgtZ6L.mjs","/src/pages/signup.astro":"chunks/signup_xu-ifXqu.mjs","/src/pages/training.astro":"chunks/training_BhGbi9-N.mjs","/src/pages/index.astro":"chunks/index_BPPt8veQ.mjs","\u0000@astrojs-manifest":"manifest_BFq2id6y.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.BAmHRVad.js","/astro/hoisted.js?q=2":"_astro/hoisted.Cllz_4Nu.js","/astro/hoisted.js?q=1":"_astro/hoisted.C8XSD0GW.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_slug_.Boq_3cTx.css","/favicon.svg","/_astro/browser.BcdDoJjP.js","/_astro/hoisted.BAmHRVad.js","/_astro/hoisted.C8XSD0GW.js","/_astro/hoisted.Cllz_4Nu.js"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false,"experimentalEnvGetSecretEnabled":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest as m };
