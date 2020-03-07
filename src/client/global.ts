// global
const channel = new BroadcastChannel('main');
window['observer$'] = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
    if(entry.isIntersecting){
        channel.postMessage({
            type: 'entry',
            index: entry.target.getAttribute('data-index')
        });
        observer.unobserve(entry.target);
    }
    });
}, { rootMargin: '0px 0px 0px 0px' });