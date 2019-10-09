export class Plotter {

  scale = 10;
  x0 = 0;
  y0 = 0;

  _coordinates(point) {
    const x = point[0] * this.scale + this.x0;
    const y = point[1] * this.scale * -1 + this.y0;
    return [x, y];
  }

  render(canvas, points) {
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    // init center
    this.x0 = ctx.canvas.clientWidth / 2;
    this.y0 = ctx.canvas.clientHeight / 2;

    // render Y axis
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.moveTo(this.x0, 0);
    ctx.lineTo(this.x0, ctx.canvas.clientHeight);
    ctx.stroke();

    // render X axis
    ctx.moveTo(0, this.y0);
    ctx.lineTo(ctx.canvas.clientWidth, this.y0);
    ctx.stroke();

    if (points.length < 2) return;

    ctx.strokeStyle = '#000';
    ctx.beginPath();
    const startPoint = points[0];
    ctx.moveTo(...this._coordinates(startPoint));
    points.splice(1).forEach(point => {
      ctx.lineTo(...this._coordinates(point))
    });
    ctx.stroke();
  }

}
