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
  connectedCallback() {
    if (!fetch) return;
    fetch('http://localhost:4444/api/blog')
    .then((data) => {
      return data.json();
    })
    .then((json) => {
      this.displayPosts(json);
    })
    .catch((error) => console.error(error));
  }
  displayPosts(data) {
    if (!this.shadowRoot || !this.shadowRoot.querySelector) return;
    if (data && data.length) {
      const wrapper = this.shadowRoot.querySelector('v-scroll-view');
      data.forEach((article: any, index: number) => {
        const section = document.createElement('v-section');
        const post = document.createElement('t-post');
        const h2 = document.createElement('h2');
        const p = document.createElement('p');
        section.setAttribute('data-index', (index + 1).toString());
        post.setAttribute('theme', 'is--light');
        h2.innerText = article.title;
        p.innerText = article.description;
        post.appendChild(h2);
        post.appendChild(p);
        section.appendChild(post);
        wrapper.appendChild(section);
      });
    }
  }
}

customElements.define('blog-view', BlogComponent);

export { BlogComponent };
