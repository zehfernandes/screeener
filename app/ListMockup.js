import { h, Component } from 'preact'
import { ipcRenderer } from 'electron'
import { bind } from 'decko'

const ListItem = ({ name, thumb, imgSizes, ...props }) => {
  return (
  <li className="list db fl w-third pr3 pl3 pb3" {...props}>
    <img src={thumb} className="img w-100 ba bw1" style="height:134px;" />
    <h3 className="db tc ma1 fw4 f5 o-80 mt2" style="letter-spacing:0.05em">
      {name}
    </h3>
    <p className="db tc ma0 pa0 o-40 f6 fw3" style="letter-spacing:0.05em">
      {imgSizes}
    </p>
  </li>
)}

export default class ListMockup extends Component {
  constructor() {
    super()
  }

  @bind
  handleClick(mock) {
    ipcRenderer.send('run-keynote', mock)
    console.log(mock)
  }

  extractImageSize(obj) {
    let imgs = obj.map((img) => {
      return `${img.width}x${img.height}`
    })

    return imgs.join(', ')
  }

  humanizeName(name) {
    return name.charAt(0).toUpperCase() + name.replace(/-/g, ' ').slice(1)
  }

  render({ name, items }) {
    return (
      <div>
        {name
        ? <h4
          className="f6 ttu tracked-mega fw7 pl3 pb2 pt3"
          style="color:#C5C5C5"
        >
          {name}
        </h4>
        : null }
        <ul className="pa0 ma0 list w-100 cf">
          {items.map(template => {
            let imgSizes = this.extractImageSize(template.images)
            let name = this.humanizeName(template.name)
            return <ListItem name={name} imgSizes={imgSizes} thumb={template.mockup.path} onClick={() => this.handleClick(template)} />
          })}
        </ul>
      </div>
    )
  }
}
