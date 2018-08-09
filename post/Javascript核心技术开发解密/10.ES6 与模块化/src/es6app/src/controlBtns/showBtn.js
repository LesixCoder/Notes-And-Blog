import { getState, setState } from '../state';

const btn = document.querySelector('.show');

btn.addEventListener('click', () => { 
  if(getState('show') == 0) {
    setState('show', 1); 
  } else {
    setState('show', 0);
  }
}, false);