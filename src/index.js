import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

const css = function(url) {

  var head = document.getElementsByTagName('head')[0];
  var cssnode = document.createElement('link');

  cssnode.type = 'text/css';
  cssnode.rel = 'stylesheet';
  cssnode.href = url;

  head.appendChild(cssnode);
}

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')
let head = document.createElement('head')
document.body.appendChild(head)

css("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap")
css("https://fonts.googleapis.com/icon?family=Material+Icons")

root.id = 'root'
document.body.appendChild(root)

// Now we can render our application into it
render(<App />, document.getElementById('root'))
