const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const canvas = {
	width: gameCanvas.width,
	height: gameCanvas.height,
};

const canvasCenter = {
	x: gameCanvas.width / 2,
	y: gameCanvas.height / 2,
};

const screenCenter = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
};

const xOffset = Math.round(screenCenter.x - canvasCenter.x); // because the canvas is centered
const yOffset = 0; // because the canvas is at the top of the page

// Uncomment this block to enable waypoint building in the console.
// const trackedArray = [];
// document.onclick = (event) => {
// 	trackedArray.push(getMousePosition(event));
// 	console.log(JSON.stringify(trackedArray));
// };

const getMousePosition = (event) => {
	const x = event.clientX - xOffset;
	const y = event.clientY;
	return { x, y };
};

const randomHex = () => (Math.random() * 0xfffff * 1000000).toString(16);

const colorFromHexString = (hexadecimalString) => {
	return "#" + hexadecimalString.slice(0, 6).toUpperCase();
};

const randomColor = () => colorFromHexString(randomHex());

const summonCircle = (configCircle) => {
	const newCircle = new Circle(configCircle)
	circles.push(newCircle);
}

const summonGloop = (configGloop) => {
	const newGloop = new Gloop(configGloop)
	gloops.push(newGloop);
}

const summonGloops = (configSummon) => {
	const { totalGloops, configGloop, xOffset, wave } = configSummon
	const newGloops = []
	for (let i = 0; i < totalGloops; i++) {
		const gloop = { ...configGloop }
		gloop.wave = wave
		newGloops.push(gloop)
	}
	let totalOffset = 0
	newGloops.forEach(gloop => {
		gloop.x = gloop.x - totalOffset
		summonGloop(gloop)
		totalOffset += xOffset
	})
}

const summonTower = (configTower) => {
	const newTower = new Tower(configTower)
	towers.push(newTower);
}

const summonTowers = (configSummon) => {
	const { configTower, towerLocations } = configSummon
	const newTowers = []
	for (let i = 0; i < towerLocations.length; i++) {
		const tower = { ...configTower }
		tower.x = towerLocations[i].x;
		tower.y = towerLocations[i].y;
		newTowers.push(tower)
	};
	newTowers.forEach(tower => {

		summonTower(tower)
	});
}

const waypoints = [
	{ x: 0, y: 217 },
	{ x: 95, y: 215 },
	{ x: 98, y: 97 },
	{ x: 224, y: 103 },
	{ x: 219, y: 254 },
	{ x: 381, y: 254 },
	{ x: 382, y: 181 },
	{ x: 667, y: 176 },
];

const towerLocations = [
	{ x: 135, y: 135 },
	{ x: 410, y: 210 }
];

const circles = [];
const towers = [];
let gloops = [];
let projectiles = [];

const goldStash = {
	total: 0,
	setTotal(amount) {
		if (amount < 0) {
			return this.total = 0
		}
		this.total = amount
	},
	deposit(amount) {
		this.total += amount
	},
	withdraw(amount) {
		this.total -= amount
	},
};

const configWave = {
	speedDefault: 1,
	hpDefault: 1,
	currentWave: 0,
	nextWave: 1,
	speedMultiplier: 0.5,
	hpMultiplier: 1.0,
	goldMultiplier: 2,
};

const configGloop = {
	ctx,
	x: waypoints[0].x,
	y: waypoints[0].y,
	radius: 15,
	fillColor: "black",
	strokeColor: "yellow",
	waypointIndex: 0,
	wave: 0,
	_gold: 10,
	get gold() {
		return this._gold
	},
	set gold(value) {
		if (value < 0) {
			return this._gold = 0
		}
		this._gold = value;
	},
	get hp() {
		return this._hp
	},
	set hp(value) {
		if (value < 0) {
			return this._hp = 0
		}
		this._hp = value;
	},
	get speed() {
		return this._speed
	},
	set speed(value) {
		if (value < 0) {
			return this._speed = 0
		}
		this._speed = value;
	},
};

const configTower = {
	ctx,
	x: 135,
	y: 135,
	width: 50,
	height: 50,
	fillColor: "transparent",
	strokeColor: "cyan",
	towersIndex: towers.length,
	attackRadius: 60,
	attacksMultiple: false,
	showRange: true,
	projectileSize: 10,
};

const configNextWaveButton = {
	x: 20,
	y: 20,
	radius: 20,
	fillColor: "cyan",
	strokeColor: "rgba(0, 0, 0, 0)"
}

const isIntersecting = (mousePoint, circle) => {
  return Math.sqrt((mousePoint.x - circle.position.x) ** 2 + (mousePoint.y - circle.position.y) ** 2) < circle.radius;
}

gameCanvas.addEventListener("click", (event) => {
	const mousePosition = getMousePosition(event)
	circles.forEach(circle => {
		if (isIntersecting(mousePosition, circle)) {
			nextWave()
		}
	})
})

const nextWave = () => {
	if (configWave.nextWave > 1) {
		configGloop.speed = configWave.speedDefault + (configWave.currentWave * configWave.speedMultiplier)
		configGloop.hp = configWave.hpDefault + (configWave.currentWave * configWave.hpMultiplier)
		configGloop.gold = configGloop.gold + (configWave.currentWave * configWave.goldMultiplier)
	} else {
		configGloop.speed = configWave.speedDefault
		configGloop.hp = configWave.hpDefault
	}
	configWave.currentWave = configWave.nextWave
	configWave.nextWave++
	const configSummon = {
		configGloop,
		totalGloops: 1,
		xOffset: 45,
		wave: configWave.currentWave,
	}

	summonGloops(configSummon)

}

const isWaveClear = (waveNumber) => {
	const matched = gloops.filter(gloop => gloop.wave === waveNumber)
	return matched.length === 0
}

const loop = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (circles.length === 0) {
		summonCircle(configNextWaveButton)
	};

	if (towers.length === 0) {
		const configSummon = {
			configTower,
			towerLocations,
		}
		summonTowers(configSummon)
	}

	if (gloops.length === 0 || isWaveClear(configWave.currentWave)) {
		nextWave()
	}
	requestAnimationFrame(loop)

	circles.forEach((circle) => {
		circle.update();
	});

	gloops.forEach((gloop) => {
		gloop.update();
		console.log(gloop.gold);
	});
	
	const survivingGloops = gloops.filter(gloop => gloop.destroyMe === false)
	gloops = [...survivingGloops]

	towers.forEach((tower) => {
		tower.update();
	});


	projectiles.forEach((projectile) => {
		projectile.update();
	});

	const activeProjectiles = projectiles.filter(projectile => projectile.destroyMe === false)
	projectiles = [...activeProjectiles]
};

loop();



