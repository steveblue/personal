// global
window['observer$'] = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting === true) {
        entry.target.dispatchEvent(
          new CustomEvent('entry', {
            detail: {
              type: 'entry',
              index: entry.target.getAttribute('data-index')
            }
          })
        );
      }
      if (entry.isIntersecting === false) {
        entry.target.dispatchEvent(
          new CustomEvent('exit', {
            detail: {
              type: 'exit',
              index: entry.target.getAttribute('data-index')
            }
          })
        );
      }
    });
  },
  { rootMargin: '0px 0px 0px 0px' }
);
