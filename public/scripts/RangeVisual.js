class RangeVisual {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		this.radius = configObject.radius;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;

		this.update = function () {
			this.render();
		};

		this.render = function () {
			if (this.radius > 0) {
				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.strokeStyle = this.stroke;
				ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			}
		};
		return this;
	}
}
