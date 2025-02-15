import { Router } from '@readymade/router';

const routing = [
  {
    path: '/',
    component: 'home-view',
    title:
      'Stephen Belovarich, Web Engineer, Photographer and Digital Artist in Portland, OR',
    description:
      "Stephen Belovarich is a creative engineer, blending art and design with software engineering. When Steve's not coding UI for web applications, he can be found attending web development meetups in PDX, writing a book about web development, riding his bike or traveling around the Pacific Northwest photographing what interests him.",
    schema: {
      '@context': 'http://schema.org',
      '@type': 'WebPage',
      name: 'Stephen Belovarich, Web Engineer and Digital Artist in Portland, OR',
      description:
        "Stephen Belovarich is a creative engineer, blending art and design with software engineering. When Steve's not coding UI for web applications, he can be found attending web development meetups in PDX, writing a book about web development, riding his bike or traveling around the Pacific Northwest photographing what interests him.",
      publisher: {
        '@type': 'Person',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Portland',
          addressRegion: 'OR',
          postalCode: '97202',
        },
        image:
          'https://stephenbelovarich.com/asset/img/crop-avatar-square-1024.jpg',
        jobTitle: ['Full Stack Web Engineer', 'Digital Artist', 'Photographer'],
        name: 'Stephen Belovarich',
        alumniOf: ['Rensselaer Polytechnic Institute', 'Syracuse University'],
        gender: 'male',
        url: 'https://stephenbelovarich.com',
        sameAs: [
          'https://www.linkedin.com/in/steveblue/',
          'https://bsky.app/profile/iplayitofflegit.bsky.social',
          'https://dev.to/steveblue',
        ],
      },
    },
  },
  {
    path: '/blog',
    component: 'blog-view',
    title: 'Stephen Belovarich Web Development Blog',
    description:
      'Stephen writes about best practices in web development and gives career advice to web developers.',
    schema: {
      '@context': 'http://schema.org',
      '@type': 'WebPage',
      name: "Stephen Belovarich's Web Development Blog",
      description:
        'Stephen writes about best practices in web development and gives career advice to web developers.',
      publisher: {
        '@type': 'Person',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Portland',
          addressRegion: 'OR',
          postalCode: '97202',
        },
        image:
          'https://stephenbelovarich.com/asset/img/crop-avatar-square-1024.jpg',
        jobTitle: ['Full Stack Web Engineer', 'Digital Artist', 'Photographer'],
        name: 'Stephen Belovarich',
        alumniOf: ['Rensselaer Polytechnic Institute', 'Syracuse University'],
        gender: 'male',
        url: 'https://stephenbelovarich.com',
        sameAs: [
          'https://www.linkedin.com/in/steveblue/',
          'https://bsky.app/profile/iplayitofflegit.bsky.social',
          'https://dev.to/steveblue',
        ],
      },
    },
  },
  {
    path: '/resume',
    component: 'resume-view',
    title: 'Stephen Belovarich Resume',
    description:
      "Stephen Belovarich is a creative engineer, blending art and design with software engineering. When Steve's not coding UI for web applications, he can be found attending web development meetups in PDX, writing a book about web development, riding his bike or traveling around the Pacific Northwest photographing what interests him.",
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Portland',
        addressRegion: 'OR',
        postalCode: '97202',
      },
      image:
        'https://stephenbelovarich.com/asset/img/crop-avatar-square-1024.jpg',
      jobTitle: ['Full Stack Web Engineer', 'Digital Artist', 'Photographer'],
      name: 'Stephen Belovarich',
      alumniOf: ['Rensselaer Polytechnic Institute', 'Syracuse University'],
      gender: 'male',
      url: 'https://stephenbelovarich.com',
      sameAs: [
        'https://www.linkedin.com/in/steveblue/',
        'https://bsky.app/profile/iplayitofflegit.bsky.social',
        'https://dev.to/steveblue',
      ],
    },
  },
  {
    path: '/cv',
    component: 'cv-view',
    title: 'Stephen Belovarich Curriculum Vitae, CV',
    description:
      "Stephen Belovarich is a creative engineer, blending art and design with software engineering. When Steve's not coding UI for web applications, he can be found attending web development meetups in PDX, writing a book about web development, riding his bike or traveling around the Pacific Northwest photographing what interests him.",
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Portland',
        addressRegion: 'OR',
        postalCode: '97202',
      },
      image:
        'https://stephenbelovarich.com/asset/img/crop-avatar-square-1024.jpg',
      jobTitle: ['Full Stack Web Engineer', 'Digital Artist', 'Photographer'],
      name: 'Stephen Belovarich',
      alumniOf: ['Rensselaer Polytechnic Institute', 'Syracuse University'],
      gender: 'male',
      url: 'https://stephenbelovarich.com',
      sameAs: [
        'https://www.linkedin.com/in/steveblue/',
        'https://bsky.app/profile/iplayitofflegit.bsky.social',
        'https://dev.to/steveblue',
      ],
    },
  },
  { path: '/404', component: 'not-found-view', title: 'Page Not Found' },
  {
    path: '/photographer-in-portland-or',
    component: 'photo-view',
    title:
      'Stephen Belovarich, Photographer in Portland, OR, Photojournalism, Fine Art',
    description:
      "Stephen Belovarich is a creative engineer, blending art and design with software engineering. When Steve's not coding UI for web applications, he can be found attending web development meetups in PDX, writing a book about web development, riding his bike or traveling around the Pacific Northwest photographing what interests him.",
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Portland',
        addressRegion: 'OR',
        postalCode: '97202',
      },
      image:
        'https://stephenbelovarich.com/asset/img/crop-avatar-square-1024.jpg',
      jobTitle: ['Full Stack Web Engineer', 'Digital Artist', 'Photographer'],
      name: 'Stephen Belovarich',
      alumniOf: ['Rensselaer Polytechnic Institute', 'Syracuse University'],
    },
  },
];

export { Router, routing };
