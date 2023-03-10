class CanvasImage {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		this.id = configObject.id || Math.random().toString(36).substr(2);
		this.parent = configObject.parent || null;
		this.img = configObject.img;
		this.width = configObject.width;
		this.height = configObject.height;
		this.destroyMe = false;

		this.destroy = function () {
			this.destroyMe = true;
		};

		this.update = function () {
			this.render();
		};

		this.render = function () {
			ctx.beginPath();
			ctx.drawImage(
				this.img,
				this.position.x,
				this.position.y,
				this.width,
				this.height
			);
			ctx.closePath();
		};
		return this;
	}
}
