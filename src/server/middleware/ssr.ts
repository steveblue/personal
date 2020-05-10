require('@skatejs/ssr/register');
const render = require('@skatejs/ssr');

const url = require('url');
const path = require('path');
const fs = require('fs');

const { routes } = require('./../view/index.js');

const indexPath = path.resolve(process.cwd(), 'dist', 'client', 'index.html');

function generateIndex(template, route, dom){
  return dom
  .replace(`<title></title>`, `<title>${route.title}</title>`)
  .replace(`<div id="root"></div>`, `<div id="root">${template}</div>`)
  .replace(/__ssr\(\)/g, '')
}
// TODO: convert to async/await
export default (req, res) => {
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
    if (temp.getModel) {
      temp.getModel().then(() => {
        render(temp).then(tmpl => {
          const index = generateIndex(tmpl, route, dom);
          res.send(index);
        });
      });
    } else {
      render(temp).then(tmpl => {
        const index = generateIndex(tmpl, route, dom);
        res.send(index);
      });
    }
  } else {
    res.send(dom);
  }
};
