import { serve } from "https://deno.land/std@v0.30.0/http/server.ts";
import { createRequire } from "https://deno.land/std@v0.34.0/node/module.ts";


(window as any).process = {
  browser: true,
  env: {
  },
};


const selfPath = window.unescape(import.meta.url.substring(7));
const require_ = createRequire(selfPath);

const React = require_("react");
const htm = require_("htm")
const html = htm.bind(React.createElement);


const Counter = (props: any) => {
  return html`
    <div>
      <h1>1</h1>
      <button>Decrement</button>
      <button>Increment</button>
    </div>
  `
}

const node = html`
<h1>Look Ma! No script tags, no build step</h1>
<${Counter} count=0 />
`

let content = ';'


function renderStatic(node: any): any {
  if(typeof node === 'string') {
    return node;
  }

  if(Array.isArray(node)) {
    let n = '';
    node.forEach(no => n+=renderStatic(no));
    return n;
  }
  else if(!(node.type instanceof Function)) {
    let o = '';
    Object.keys(node.props).forEach((p: any) => o += renderStatic(node.props[p]));

    return `<${node.type}>` + o +  `</${node.type}>`;
  }

  else if(node.type instanceof Function) {
    return renderStatic(node.type());
  }
}

const newNode = renderStatic(node);

const s = serve({ port: 8000 });


console.log("http://localhost:8000/");

for await (const req of s) {
  req.respond({ body: newNode });
}
