import Tracker from './Tracker';

const tracker = new Tracker();
tracker.bindToDOM(document.querySelector('.tracker'));
tracker.init();
