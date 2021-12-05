import React from 'react'
import Konva from 'konva'

class Waveform extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playheadPosition: 0.0,
      mask0: {
        width: 20,
      },
      mask1: {
        width: 20,
      }
    }
  }

  componentDidMount() {
    this.drawKonva()
  }

  componentDidUpdate() {
    this.drawKonva()
  }

  drawKonva() {
    var stage = new Konva.Stage({
      container: 'konvaContainer',
      width: this.props.width,
      height: this.props.height,
    })

    const rect = new Konva.Shape({
       width: this.props.width,
       height: this.props.height,
        sceneFunc: (ctx, shape) => {
          this.draw(ctx)
       }
    })

    var playhead = new Konva.Rect({
      x: this.playheadX() * 0.9,
      y: 0,
      width: 4,
      height: this.props.height,
      fill: 'black',
      draggable: true,
      dragBoundFunc: function(pos) {
        var newX = (pos.x <= this.props.width * 0.020)
          ? this.props.width * 0.020 : pos.x
        newX = newX >= this.props.width * 0.98 ? this.props.width * 0.98 : newX
        this.setState({playheadPosition: newX / this.props.width})
        return {
          x: newX,
          y: 0,
        };
      }.bind(this),
    })

    var mask0Handle = new Konva.Rect({
      x: this.state.mask0.width,
      y: this.props.height * 0.05,
      width: 4,
      height: this.props.height * 0.9,
      fill: 'gray',
      draggable: true,
    })

    var mask0 = new Konva.Rect({
      x: 0,
      y: this.props.height * 0.05,
      width: this.state.mask0.width,
      height: this.props.height * 0.9,
      fill: 'gray',
      opacity: 0.4,
    })

    mask0Handle.on('dragmove', () => {
      this.setState(state => {
        return {
          mask0: {
            width: stage.getPointerPosition().x
          }
        }
      })
    })

    var mask1Handle = new Konva.Rect({
      x: this.state.mask0.width,
      y: this.props.height * 0.05,
      width: 4,
      height: this.props.height * 0.9,
      fill: 'gray',
      draggable: true,
    })

    var mask1 = new Konva.Rect({
      x: this.props.width * 0.9,
      y: this.props.height * 0.05,
      width: this.state.mask1.width,
      height: this.props.height * 0.9,
      fill: 'gray',
      opacity: 0.4,
    })

    mask1Handle.on('dragmove', () => {
      this.setState(state => {
        return {
          mask0: {
            width: stage.getPointerPosition().x
          }
        }
      })
    })

    var layer = new Konva.Layer();
    layer.add(rect)
    layer.add(playhead)
    layer.add(mask0)
    layer.add(mask1)
    layer.add(mask0Handle)
    layer.add(mask1Handle)
    stage.add(layer)
    layer.draw()
  }

  draw(ctx) {
    const w = this.props.width
    const h = this.props.height

    if (ctx !== null) {
      ctx.clearRect(0, 0, w, h)
      ctx.beginPath()
      ctx.strokeStyle = 'rgb(40, 43, 96)'
      ctx.lineWidth = 2

      const waveformHeight = h * 0.65
      const waveformWidth = w * 0.95
      this.drawWaveform(ctx, waveformWidth, waveformHeight)
      ctx.closePath()
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 4

      ctx.closePath()
      ctx.stroke()
    }
  }

  drawWaveform(ctx, w, h) {
    const pixelsPerLine = w / this.props.data.length
    for (var i = 0; i < this.props.data.length; i += 1) {
      const datum = this.props.data[i]
      const yCenter = this.props.height / 2

      const x = i * pixelsPerLine + (w * 0.025)
      const y = yCenter - (h * datum)
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + (2 * h * datum))
    }
  }

  playheadX() {
    const w = this.props.width
    return (w * 0.025) + (this.state.playheadPosition * w)
  }

  render() {
    return (
      <div
        id="konvaContainer"
      >
      </div>
    )
  }
}

export default Waveform
