import { CustomElement, Component, State } from '@readymade/core';

import style from './blog.scss';
import template from './blog.html';

@Component({
  selector: 'blog-view',
  style: style,
  template: template
})
class BlogComponent extends CustomElement {
  constructor() {
    super();
  }
  @State()
  getState() {
    return {
      scale: 1.0
    };
  }
}

customElements.define('blog-view', BlogComponent);

export { BlogComponent };
