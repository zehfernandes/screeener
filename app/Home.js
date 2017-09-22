import { h, Component } from 'preact'
import { ipcRenderer } from 'electron'
import { bind } from 'decko'
import ListMockup from './ListMockup'

export default class App extends Component {
  state = { defaults: [], loaded: [], notify: false, transitionOut: false }

  loadItems() {
    ipcRenderer.send('load-templates')
    ipcRenderer.on('template-list', (store, data) => {
      // TODO: Remove hardcode names
      this.setState({
        defaults: data.defaults,
        loaded: data.yourMockups,
      })
    })

    ipcRenderer.on('update-downloaded', () => {
      this.setState({
        notify: true,
      })
    })
  }

  @bind
  handleInstall(e) {
    ipcRenderer.send('install-update')
  }

  componentWillMount() {
    this.loadItems()
  }

  render({ }, { defaults, loaded, notify, transitionOut }) {
    return (
      <div className={transitionOut ? 'transitionOut' : null}>
        {notify
          ? <div className="w-100 pv2 ph4 tc black white pointer" onClick={this.handleInstall} style="background:#1880F9">
            <span className="pr1">🎉</span> New version is available
          <a href="#" className="pl1 white link">click here to install it</a>
          </div>
          : null
        }
        <div className="w-90 center">
          <ListMockup name="Default Mockups" items={defaults} />
          <ListMockup name="Your Mockups" items={loaded} {...this.props} />
        </div>
      </div>
    )
  }
}
