// global
window['observer$'] = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting === true){
            observer.unobserve(entry.target);
            entry.target.dispatchEvent( new CustomEvent('entry', { detail: { type: 'entry', index: entry.target.getAttribute('data-index') } }))
        }
    });
}, { rootMargin: '0px 0px 0px 0px' });