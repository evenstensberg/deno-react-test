import { serve } from "https://deno.land/std@v0.30.0/http/server.ts";
import { createRequire } from "https://deno.land/std@v0.34.0/node/module.ts";

(window as any).process = {
  browser: true,
  env: {},
};

const self = window.unescape(import.meta.url.substring(7));
const require_ = createRequire(self);

const React = require_("react");
const htm = require_("htm")
const html = htm.bind(React.createElement);


const Wrapper = () => {
  return html`
    <div>
      <button>Button 1</button>
      <span>Span 2</span>
    </div>
  `
}

const node = html`
<h1>It works!</h1>
<${Wrapper} />
`


function renderStatic(node: any): any {
  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    let n = '';
    node.forEach(no => n += renderStatic(no));
    return n;
  }
  else if (!(node.type instanceof Function)) {
    let o = '';
    Object.keys(node.props).forEach((p: any) => o += renderStatic(node.props[p]));
    return `<${node.type}>` + o + `</${node.type}>\n`;
  }

  else if (node.type instanceof Function) {
    return renderStatic(node.type());
  }
}

const newNode = renderStatic(node);

const s = serve({ port: 8090 });


console.log("Running on http://localhost:8090/ ♥️");

for await (const req of s) {
  req.respond({ body: newNode });
}
