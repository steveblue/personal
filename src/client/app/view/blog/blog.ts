import { CustomElement, Component, State } from '@readymade/core';
import { requestPath } from './../../../../server/config';

import style from './blog.css?raw';
import template from './blog.html?raw';

declare global {
  interface Window {
    observer$: IntersectionObserver;
  }
}

export interface DevUser {
  name: string;
  username: string;
  twitter_username: string;
  github_username: string;
  website_url: string;
  profile_image: string;
  profile_image_90: string;
}

export interface DevMeta {
  revision: number;
  created: number;
  version: number;
}
export interface DevPost {
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
  template: template,
})
class BlogComponent extends CustomElement {
  constructor() {
    super();
    document.body.classList.add('is--light');
  }
  @State()
  getState() {
    return {
      scale: 1.0,
    };
  }
  connectedCallback() {
    this.getModel();
    if (!this.shadowRoot.querySelectorAll) return;
    setTimeout(
      () =>
        this.shadowRoot
          .querySelector('.blog__title')
          .classList.add('is--visible'),
      0,
    );
  }
  disconnectedCallback() {
    document.body.classList.remove('is--light');
  }
  getModel() {
    return new Promise((res, rej) => {
      fetch(requestPath('api/blog'))
        .then((data) => data.json())
        .then((json) => {
          this.render(json);
        })
        .catch((error) => rej(error));
    });
  }
  render(data) {
    if (data && data.length) {
      const wrapper = this.shadowRoot.children[2];
      data.forEach((article: DevPost, index: number) => {
        const section = document.createElement('v-section');
        const post = document.createElement('t-post');
        const postWrapper = document.createElement('div');
        const img = document.createElement('div');
        const h3 = document.createElement('h3');
        const h3Link = document.createElement('a');
        const footer = document.createElement('footer');
        const meta = document.createElement('div');
        const dateSpan = document.createElement('span');
        const p = document.createElement('p');
        const pLink = document.createElement('a');

        const date: Date = new Date(article.published_timestamp);
        const formattedDate: string = date.toLocaleString('en-US', {
          month: 'long', // "June"
          day: '2-digit', // "01"
          year: 'numeric', // "2019"
        });

        section.setAttribute('data-index', (index + 1).toString());

        if (index !== 0) {
          post.setAttribute('theme', 'is--light');
        } else {
          post.setAttribute('theme', 'is--trans');
        }

        if (index === data.length - 1) {
          footer.classList.add('is--last');
        }

        postWrapper.classList.add('post__wrapper');
        img.classList.add('post__thumbnail');
        meta.classList.add('post__meta');
        footer.classList.add('post__footer');

        h3.innerHTML = article.title;
        h3Link.setAttribute('href', article.url);
        h3Link.setAttribute('target', '_blank');
        h3Link.setAttribute('rel', 'noreferrer');
        p.innerHTML = article.description.replace(/\n\n/, '');
        pLink.setAttribute('href', article.url);
        pLink.setAttribute('target', '_blank');
        pLink.setAttribute('rel', 'noreferrer');
        dateSpan.innerHTML = formattedDate;
        if (article.cover_image) {
          img.setAttribute('data-bg', `url(${article.cover_image})`);
          postWrapper.appendChild(img);
        } else {
          postWrapper.appendChild(img);
        }

        if (article.tag_list && article.tag_list.length) {
          const ul = document.createElement('ul');
          article.tag_list.forEach((tag) => {
            const li = document.createElement('li');
            li.innerHTML = tag;
            ul.appendChild(li);
          });
          meta.appendChild(ul);
        }

        meta.appendChild(dateSpan);
        h3Link.appendChild(h3);
        img.appendChild(h3Link);
        footer.appendChild(meta);
        pLink.appendChild(p);
        footer.appendChild(pLink);
        postWrapper.appendChild(footer);
        post.appendChild(postWrapper);
        section.appendChild(post);
        wrapper.appendChild(section);

        img.addEventListener('entry', (ev) => {
          img.style.background = img.getAttribute('data-bg');
          img.style.backgroundRepeat = 'no-repeat';
          img.style.backgroundSize = 'contain';
          console.log(img.style);
        });
        window.observer$.observe(img);
      });
    }
  }
}

const render = () => `
  <blog-view>
    <template shadowrootmode="open">
      <style>
        ${style}
      </style>
      ${template}
    </template>
  </blog-view>
`;

export { BlogComponent, render };
