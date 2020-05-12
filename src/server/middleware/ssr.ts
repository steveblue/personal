require('@skatejs/ssr/register');
const render = require('@skatejs/ssr');

const url = require('url');
const path = require('path');
const fs = require('fs');

const { routes } = require('./../view/index.js');

const indexPath = path.join(process.cwd(), 'dist', 'client', 'index.html');

function generateIndex(template, route, dom){
  return dom
  .replace(`<title></title>`, `<title>${route.title}</title>`)
  .replace(`<div id="root"></div>`, `<div id="root">${template}</div>`)
  .replace(/__ssr\(\)/g, '')
}

export default async(req, res) => {
  let component: any = class {};
  const dom = fs.readFileSync(indexPath).toString();
  const route = routes.find(rt => rt.path === url.parse(req.url).pathname);
  if (route == undefined) {
    res.redirect(301, '/404');
    return;
  } else {
    component = route.component;
  }
  if (component) {
    const template = new component();
    if (template.getModel) {
      await template.getModel();
    }
    const tmpl = await render(template);
    res.send(generateIndex(tmpl, route, dom));
  } else {
    res.send(dom);
  }
};
