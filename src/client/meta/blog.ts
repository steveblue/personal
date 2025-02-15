const blogSchema = {
  '@context': 'http://schema.org',
  '@type': 'WebPage',
  name: "Stephen Belovarich's Web Development Blog",
  description:
    'Steve writes about best practices in web development and gives career advice to web developers.',
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

export { blogSchema };
