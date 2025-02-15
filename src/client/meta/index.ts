const indexSchema = {
  '@context': 'http://schema.org',
  '@type': 'WebPage',
  name: 'Stephen Belovarich, Web Engineer and Digital Artist in Portland, OR',
  description:
    "Steve Belovarich is a creative engineer, blending art and design with software engineering. When Steve's not coding UI for web applications, he can be found attending web development meetups in PDX, writing a book about web development, riding his bike or traveling around the Pacific Northwest photographing what interests him.",
  publisher: {
    '@type': 'Person',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Portland',
      addressRegion: 'OR',
      postalCode: '97202',
    },
    image: 'https://stephenbelovarich.com/img/crop-avatar-square-1024.jpg',
    jobTitle: ['Full Stack Web Engineer', 'Digital Artist', 'Photographer'],
    name: 'Stephen Belovarich',
    alumniOf: ['Rensselaer Polytechnic Institute', 'Syracuse University'],
    gender: 'male',
    url: 'https://stephenbelovarich.com',
    sameAs: [
      'https://www.facebook.com/stephen.belovarich',
      'https://www.linkedin.com/in/steveblue/',
      'https://twitter.com/iplayitofflegit',
      'https://dev.to/steveblue',
    ],
  },
};

export { indexSchema };
