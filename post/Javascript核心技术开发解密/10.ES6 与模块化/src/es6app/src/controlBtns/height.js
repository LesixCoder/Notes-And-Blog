import { getState, setState } from '../state';

const reduce_btn = document.querySelector('.height_reduce');
const add_btn = document.querySelector('.height_add');
const height_input = document.querySelector('.height_input');

height_input.value = getState('height') || 100;

reduce_btn.addEventListener('click', () => { 
  const cur = getState('height');
  if(cur > 50) {
    setState('height', cur - 5);
    height_input.value = cur - 5; 
  }
}, false);

add_btn.addEventListener('click', () => { 
  const cur = getState('height');
  if(cur < 400) {
    setState('height', cur + 5); 
    height_input.value = cur + 5; 
  }
}, false);