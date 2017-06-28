import { h, render } from 'preact';
import App from './App';
import { ipcRenderer } from 'electron'

render(<App />, document.body);