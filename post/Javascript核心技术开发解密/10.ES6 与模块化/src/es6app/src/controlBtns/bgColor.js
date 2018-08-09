import { setState } from '../state';

const input = document.querySelector('.bgcolor_input');
const btn = document.querySelector('.bgcolor_btn');

btn.addEventListener('click', () => { 
  if(input.value) {
    setState('backgroundColor', input.value); 
  }
}, false);