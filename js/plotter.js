export class Plotter {

  scale = 10;
  x0 = 0;
  y0 = 0;

  config = {
    axis: {
      color: '#00f',
      width: 1
    },
    graph: {
      color: '#000',
      width: 1
    }
  };

  constructor(config = {}) {
    this.config = {...this.config, ...config}
  }

  _coordinates(point) {
    const x = point[0] * this.scale + this.x0;
    const y = point[1] * this.scale * -1 + this.y0;
    return [x, y];
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
    this.ctx.beginPath();
  }

  _initCenter() {
    this.x0 = this.ctx.canvas.clientWidth / 2;
    this.y0 = this.ctx.canvas.clientHeight / 2;
  }

  _renderAxisY() {
    this.ctx.lineWidth = this.config.axis.width;
    this.ctx.strokeStyle = this.config.axis.color;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x0, 0);
    this.ctx.lineTo(this.x0, this.ctx.canvas.clientHeight);
    this.ctx.stroke();
  }

  _renderAxisX() {
    this.ctx.lineWidth = this.config.axis.width;
    this.ctx.strokeStyle = this.config.axis.color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.y0);
    this.ctx.lineTo(this.ctx.canvas.clientWidth, this.y0);
    this.ctx.stroke();
  }

  _renderGraph(points) {
    if (points.length < 2) return;
    this.ctx.lineWidth = this.config.graph.width;
    this.ctx.strokeStyle = this.config.graph.color;
    this.ctx.beginPath();
    const startPoint = points[0];
    this.ctx.moveTo(...this._coordinates(startPoint));
    points.forEach((point, index) => {
      if (index > 0) this.ctx.lineTo(...this._coordinates(point))
    });
    this.ctx.stroke();
  }

  render(canvas, points) {
    this.ctx = canvas.getContext('2d');

    this.clear();
    this._initCenter();
    // todo render grid
    this._renderAxisY();
    this._renderAxisX();
    this._renderGraph(points);
  }

}
