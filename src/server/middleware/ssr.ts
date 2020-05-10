require('@skatejs/ssr/register');
const render = require('@skatejs/ssr');

const url = require('url');
const path = require('path');
const fs = require('fs');

const { routes } = require('./../view/index.js');

const indexPath = path.resolve(process.cwd(), 'dist', 'client', 'index.html');

function generateIndex(template, route, dom){
  return new Promise((res) => {
    res(dom
      .replace(`<title></title>`, `<title>${route.title}</title>`)
      .replace(`<div id="root"></div>`, `<div id="root">${template}</div>`)
      .replace(/__ssr\(\)/g, ''));
  })
}

export default async (req, res) => {
  let template: any = class {};
  const dom = fs.readFileSync(indexPath).toString();
  const route = routes.find(rt => rt.path === url.parse(req.url).pathname);
  if (route == undefined) {
    res.redirect(301, '/404');
    return;
  } else {
    template = route.component;
  }
  if (template) {
    const temp = new template();
    (async() => {
      if (temp.getModel) {
        await temp.getModel();
      }
      const tmpl = await render(temp);
      const index = await generateIndex(tmpl, route, dom);
      await res.send(index);
    })();
  } else {
    res.send(dom);
  }
};
