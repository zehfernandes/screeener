import { h, Component } from 'preact'
import { ipcRenderer } from 'electron'
import { bind } from 'decko'

const ImageItem = ({ name, thumb, width, height, x, y, index, onChange, ...props }) => {
  return (
    <li className="list db fl w-third pr4 pl4 pb3" {...props}>
      <img src={thumb} className="img w-100 ba bw1 mb4" style="height:134px;" />
      <section>
        <div class="fl w-50 pr2 pb2">
          <FloatInput label="Width" value={width} name={`${index}-width`} onChange={onChange} />
        </div>
        <div class="fl w-50 pl2 pb2">
          <FloatInput label="Height" value={height} name={`${index}-height`} onChange={onChange} />
        </div>
        <div class="fl w-50 pr2 pb2">
          <FloatInput label="X" value={x} name={`${index}-x`} onChange={onChange} />
        </div>
        <div class="fl w-50 pl2 pb2">
          <FloatInput label="Y" value={y} name={`${index}-y`} onChange={onChange} />
        </div>
      </section>
    </li>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      mockup: { image: '', width: '', height: '', x: '', y: '', name: '' },
      images: []
    }
  }

  @bind
  handleRemoveItem() {
    const { editData } = this.props
    const jsonFile = editData ? editData.fileName : '_temp.json'
  
    ipcRenderer.send('clear-mockup', jsonFile)
    this.props.changePage('home')
  }

  @bind
  handleSaveMockup() {
    ipcRenderer.send('save-mockup', this.state)
    this.props.changePage('home')
  }

  onChangeTextMockup = (evt) => {
    let mockup = this.state.mockup
    let state = evt.target.name.split('-')[1]
    mockup[state] = parseInt(evt.target.value)

    this.setState({ mockup })
  }

  onChangeTextImage = (evt) => {
    let images = this.state.images
    let name = evt.target.name.split('-')
    let state = name[1]
    let index = name[0]
    images[index][state] = parseInt(evt.target.value)

    this.setState({ images })
  }

  loadItems() {
    ipcRenderer.send('load-mockup', '_temp.json')
    ipcRenderer.on('result-mockup', (store, data) => {
      this.setState({
        name: data.name,
        mockup: data.mockup,
        images: data.images,
      })
    })
  }

  componentWillMount() {
    const { editData } = this.props
    if (editData) {
      this.setState(editData)
      console.log(editData)
    } else {
      this.loadItems()
    }
  }

  render({ }, { mockup, images, name }) {
    return (
      <div className="w-100">
        <div className="w-90 center cf">
          <section className="cf relative">
            <div className="absolute right-0 pt3" style="margin-top: 1.33em; top:2px">
              <a onClick={this.handleRemoveItem} className="dib f5 link pr3 dim pointer" style="color: #A7A7A7;">remove</a>
            </div>
            
            <h4 className="f6 ttu tracked-mega fw7 pl3 pb2 pt3" style="color:#C5C5C5" onClick={this.handleBacktoHome}>Mockup</h4>
            <div class="fl w-60 pl3 pr3">
              <img src={mockup.path} className="img w-100 ba bw1" />
            </div>

            <div class="fl w-40 pr3 pl3">
              <div class="fl w-100 pb2">
                <FloatInput label="Title" onChange={(evt) => { this.setState({ name: evt.target.value }) }} value={name} name="name" />
              </div>
              <div class="fl w-50 pr3 pb2">
                <FloatInput label="Width" value={mockup.width} name="mockup-width" onChange={this.onChangeTextMockup} />
              </div>
              <div class="fl w-50 pl3 pb2">
                <FloatInput label="Height" value={mockup.height} name="mockup-height" onChange={this.onChangeTextMockup} />
              </div>
              <div class="fl w-50 pr3 pb2">
                <FloatInput label="X" value={mockup.x} name="mock-x" onChange={this.onChangeTextMockup} />
              </div>
              <div class="fl w-50 pl3 pb2">
                <FloatInput label="Y" value={mockup.y} name="mock-y" onChange={this.onChangeTextMockup} />
              </div>

            </div>
          </section>

          <section>
            <div>
              <h4 className="f6 ttu tracked-mega fw7 pl3 pb2 pt3" style="color:#C5C5C5">Images</h4>
            </div>

            <ul style="margin-left: -3.4rem">
              {images.map((image, i) => {
                return (
                  <ImageItem
                    index={i}
                    thumb={image.path}
                    width={image.width}
                    height={image.height}
                    x={image.x}
                    y={image.y}
                    onChange={this.onChangeTextImage}
                  />
                )
              })}
            </ul>
          </section>
        </div>
        <div class="w-100 mt4">
          <a onClick={this.handleSaveMockup} class="f5 link dim db white w-100 tc" style="background: #1880F9; padding:1.5em 0" href="#0" id="sendData">Save Mockup</a>
        </div>
      </div>
    )
  }
}

class FloatInput extends Component {
  render() {
    const { name, label, value } = this.props
    return (
      <div className="relative">
        <label for={name} className="f6 fw6 db mb1" style="color:#686868; margin-left: -1px;">{label}</label>
        <input style="color: #E5E5E5; font-size: 1.4em; outline:0" className="input-reset bg-transparent bt-0 br-0 bl-0 bb b--silver pa2 pl0 pt1 mb3 db w-100 z3 relative f5 mt0" name={name} type="text" value={value}
          {...this.props} />
      </div>
    )
  }
}
