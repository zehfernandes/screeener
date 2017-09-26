import { h, Component } from 'preact'
import { ipcRenderer } from 'electron'
import { bind } from 'decko'

const ListItem = ({ name, thumb, imgSizes, edit, ...props }) => {
  return (
    <li className="list db fl w-third pr3 pl3 pb3" {...props}>
      <img src={thumb} className="img w-100 ba bw1" style="height:134px;" />
      <h3 className="db tc ma1 fw4 f5 o-80 mt2" style="letter-spacing:0.05em">
        {name}
      </h3>
      <p className="db tc ma0 pa0 o-40 f6 fw3" style="letter-spacing:0.05em">
        {edit ? "Edit mockup" : imgSizes}
      </p>
    </li>
  )
}

const AddMockup = ({ ...props }) => {
  return (
    <li className="list db fl w-third pr3 pl3 pb3" {...props}>
      <div className="img ba bw1 tc pt1" style="height:140px;">
        <span className="fw1 o-80" style="font-size:90px">+</span>
      </div>
      <h3 className="db tc ma1 fw4 f5 o-80 mt2" style="letter-spacing:0.05em">
        Add your mockup
      </h3>
    </li>
  )
}

export default class ListMockup extends Component {
  constructor() {
    super()

    this.state = {
      editMode: false
    }
  }

  @bind handleClick(mock) {
    if (!this.state.edit) {
      ipcRenderer.send('run-keynote', mock)
      console.log(mock)
    } else {
      this.props.changePage('add', mock)
    }
  }

  @bind handleEditMode() {
    this.setState({ edit: this.state.edit ? false : true })
  }

  @bind handleAddClick() {
    ipcRenderer.send('add-mockup')
    ipcRenderer.on('change-page', (store, data) => {
      this.props.changePage('add')
    })
  }

  extractImageSize(obj) {
    let imgs = obj.map(img => {
      return `${img.width}x${img.height}`
    })

    return imgs.join(', ')
  }

  humanizeName(name) {
    return name.charAt(0).toUpperCase() + name.replace(/-/g, ' ').slice(1)
  }

  render({ name, items, addClick }) {
    return (
      <div className="relative">
        {name
          ? <h4
            className="f6 ttu tracked-mega fw7 pl3 pb3 pt3"
            style="color:#C5C5C5"
          >
            {name}
          </h4>
          : null}

        {name !== 'Default Mockups' && items.length > 0 ?
          <a onClick={this.handleEditMode} className="f5 link absolute right-0 pr3 dim pointer" style="color: #A7A7A7; top:15.5px;">
            {this.state.edit ? 'cancel editing' : 'edit mode'}
          </a>
          : null}

        <ul className="pa0 ma0 list w-100 cf relative">
          {items.map(template => {
            let imgSizes = this.extractImageSize(template.images)
            let name = this.humanizeName(template.name)
            return (
              <ListItem
                name={name}
                imgSizes={imgSizes}
                thumb={template.mockup.path}
                onClick={() => this.handleClick(template)}
                edit={this.state.edit}
              />
            )
          })}
          {name !== 'Default Mockups'
            ? <AddMockup onClick={this.handleAddClick} />
            : null}
        </ul>
      </div>
    )
  }
}
