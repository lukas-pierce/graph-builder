export class Plotter {

  x0 = 0;
  y0 = 0;

  config = {
    scale: {
      x: 20,
      y: 20
    },
    axis: {
      color: '#00f',
      width: 1
    },
    graph: {
      color: '#000',
      width: 1
    },
    grid: {
      color: '#ccc',
      width: 1
    }
  };

  constructor(config = {}) {
    this.config = {...this.config, ...config}
  }

  _coordinates(point) {
    const x = point[0] * this.config.scale.x + this.x0;
    const y = point[1] * this.config.scale.y * -1 + this.y0;
    return [x, y];
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
    this.ctx.beginPath();
  }

  _initCenter() {
    this.x0 = this.ctx.canvas.clientWidth / 2;
    this.y0 = this.ctx.canvas.clientHeight / 2;

    // canvas pixel adjustment
    if (Number.isInteger(this.x0)) this.x0 += .5;
    if (Number.isInteger(this.y0)) this.y0 += .5;
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

  _renderGridVerticalLine(x) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + this.x0, 0);
    this.ctx.lineTo(x + this.x0, this.ctx.canvas.clientHeight);
    this.ctx.stroke();
  }

  _renderGridHorizontalLine(y) {
    this.ctx.beginPath();
    this.ctx.moveTo(0, y + this.y0);
    this.ctx.lineTo(this.ctx.canvas.clientWidth, y + this.y0);
    this.ctx.stroke();
  }

  _renderGridVerticals() {
    const stepsCount = Math.floor(this.ctx.canvas.clientWidth / 2 / this.config.scale.x);
    for (let i = 0; i <= stepsCount; i++) {
      const x = i * this.config.scale.x;

      // from x0 to right
      this._renderGridVerticalLine(x);

      // from x0 to left
      if (i > 0) this._renderGridVerticalLine(-x);
    }
  }

  _renderGridHorizontals() {
    const stepsCount = Math.floor(this.ctx.canvas.clientHeight / 2 / this.config.scale.y);
    for (let i = 0; i <= stepsCount; i++) {
      const y = i * this.config.scale.y;

      // from y0 to bottom
      this._renderGridHorizontalLine(y);

      // from y0 to top
      if (i > 0) this._renderGridHorizontalLine(-y);
    }
  }

  _renderGrid() {
    this.ctx.lineWidth = this.config.grid.width;
    this.ctx.strokeStyle = this.config.grid.color;
    this._renderGridVerticals();
    this._renderGridHorizontals();
  }

  render(canvas, points) {
    this.ctx = canvas.getContext('2d');

    this.clear();
    this._initCenter();
    this._renderGrid();
    this._renderAxisY();
    this._renderAxisX();
    this._renderGraph(points);
  }

}
