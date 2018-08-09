import { getState, setState } from '../state';

const reduce_btn = document.querySelector('.width_reduce');
const add_btn = document.querySelector('.width_add');

reduce_btn.addEventListener('click', () => { 
  const cur = getState('width');
  if(cur > 50) {
    setState('width', cur - 5); 
  }
}, false);

add_btn.addEventListener('click', () => { 
  const cur = getState('width');
  if(cur < 400) {
    setState('width', cur + 5); 
  }
}, false);