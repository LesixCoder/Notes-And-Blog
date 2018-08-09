import { bind } from './state';
import { getStyle } from './utils';
import './register'

const div = document.querySelector('.target');

// control show or hide
bind('show', value => {
  if(value === 1) {
    div.classList.add('hide');
  }
  if(value === 0) {
    div.classList.remove('hide');
  }
})

// change background color
bind('backgroundColor', value => {
  div.style.backgroundColor = value;
})

// change border color
bind('borderColor', value => {
  const width = parseInt(getStyle(div, 'borderWidth'));
  if(width === 0) {
    div.style.border = '2px solid #ccc';
  }
  div.style.borderColor = value;
})

// change width
bind('width', value => {
  div.style.width = `${value}px`;
})

bind('height', value => {
  div.style.height = `${value}px`;
})