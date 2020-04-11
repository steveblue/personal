import { CustomElement, Component, State } from '@readymade/core';

import style from './blog.scss';
import template from './blog.html';

interface DevUser {
  name: string;
  username: string;
  twitter_username: string;
  github_username: string;
  website_url: string;
  profile_image: string;
  profile_image_90: string;
}

interface DevMeta {
  revision: number;
  created: number;
  version: number;
}
interface DevPost {
  type_of: string;
  id: number;
  title: string;
  description: string;
  cover_image: string;
  readable_publish_date: string;
  social_image: string;
  slug: string;
  path: string;
  url: string;
  canonical_url: string;
  comments_count: number;
  positive_reactions_count: number;
  collection_id: string;
  created_at: string;
  edited_at: string;
  crossposted_at: string;
  published_at: string;
  last_comment_at: string;
  published_timestamp: string;
  tag_list: string[];
  tags: string;
  user: DevUser;
  meta: DevMeta;
}

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
      const wrapper = this.shadowRoot.querySelector('v-stage');
      data.forEach((article: DevPost, index: number) => {

        const section = document.createElement('v-section');
        const post = document.createElement('t-post');
        const postWrapper = document.createElement('div');
        const img = document.createElement('img');
        const h2 = document.createElement('h2');
        const p = document.createElement('p');

        section.setAttribute('data-index', (index + 1).toString());
        post.setAttribute('theme', 'is--light');

        h2.innerText = article.title;
        p.innerText = article.description;

        if (article.cover_image) {
          img.src = article.cover_image;
          postWrapper.appendChild(img);
        }

        postWrapper.appendChild(h2);
        postWrapper.appendChild(p);
        postWrapper.classList.add('post__wrapper');
        post.appendChild(postWrapper);
        section.appendChild(post);
        wrapper.appendChild(section);

      });
    }
  }
}

customElements.define('blog-view', BlogComponent);

export { BlogComponent };
