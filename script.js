const c = document.getElementById("myCanvas")
const ctx = c.getContext("2d")
const popupContent = document.getElementById('popup-content')
popup.style.maxWidth = `${window.innerWidth * 0.9}px`
popup.style.maxHeight = `${window.innerHeight * 0.3}px`
popupContent.style.fontSize = `${Math.max(Math.min(window.innerWidth, window.innerHeight) * 0.025, 15)}px`
let programmStart = Date.now()
const chunkKante = 25
let walkSpeed = 200
let furthestPos
let tastenEingabe = false
c.width = chunkKante * (~~((window.innerWidth) / chunkKante))
c.height = chunkKante * (~~((window.innerHeight) / chunkKante))
let scale = Math.max(c.width, c.height) / chunkKante
let updateScreen = true
const env = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]]
let walkId, interruptId
function einfarbigB(a, farbe) {
	const pow = a ** 2
	let out = Array(pow)
	for (let x = 0; x < pow; x++) {
		out[x] = farbe
	}
	return out
}
let ozeanB = (a) => einfarbigB(a, [0, 0, 255])
let grasB = (a) => einfarbigB(a, [0, 150, 0])
let steinB = (a) => einfarbigB(a, [75, 75, 75])
let teichB = (a) => einfarbigB(a, [0, 0, 175])
let flussB = (a) => einfarbigB(a, [0, 0, 255])
let strandB = (a) => einfarbigB(a, [255, 204, 0])
let schwarzB = (a) => einfarbigB(a, [0, 0, 0])
let baumB = (a) => einfarbigB(a, [0, 51, 0])
let buschB = (a) => einfarbigB(a, [50, 100, 0])
let erdeB = (a) => einfarbigB(a, [87, 59, 23])
function miniBuschB(a) {
	let out = einfarbigB(a, [0, 150, 0])
	let krumm = 0
	let äste = [~~(Math.random() * a), ~~(Math.random() * a)]
	let ästeKrumm = [0, 0]
	for (let y = a - 1; y > 0; y--) {
		krumm += ((~~(Math.random() * 3)) - 1)
		krumm = Math.min(Math.max(krumm, -(a / 3)), a / 3)
		if (äste[0] == y) {
			ästeKrumm[0] == krumm
		}
		if (äste[1] == y) {
			ästeKrumm[1] == krumm
		}
		for (let x = -(a >> 4); x < a >> 4; x++) {
			let pos = cord(x + (a >> 1) + krumm, y, a)
			out[pos] = [50, 100, 0]
		}
	}
	krumm = ästeKrumm[0]
	for (let y = äste[0]; y > äste[0] - a >> 1 && y > -1; y--) {
		krumm += ((~~(Math.random() * 3)) - 1) - (a >> 5)
		krumm = Math.min(Math.max(krumm, -(a / 3)), a / 3)
		for (let x = -(a >> 4); x < a >> 4; x++) {
			let pos = cord(x + (a >> 1) + krumm, y, a)
			out[pos] = [50, 100, 0]
		}
	}
	krumm = ästeKrumm[1]
	for (let y = äste[1]; y > äste[1] - a >> 1 && y > -1; y--) {
		krumm += ((~~(Math.random() * 3)) - 1) + (a >> 5)
		krumm = Math.min(Math.max(krumm, -(a / 3)), a / 3)
		for (let x = -(a >> 4); x < a >> 4; x++) {
			let pos = cord(x + (a >> 1) + krumm, y, a)
			out[pos] = [50, 100, 0]
		}
	}
	return out
}
function miniBaumB(a) {
	let out = einfarbigB(a, [0, 150, 0])
	let äste = []
	for (let x = 0; x < a >> 3; x++) {
		äste.push(~~(Math.random() * a))
	}
	for (let y = 0; y < a; y++) {
		for (let x = -(a >> 4); x < a >> 4; x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = [166, 94, 35]
		}
	}
	for (let x = 0; x < äste.length; x++) {
		let krumm = 0
		for (let y = äste[x]; y > äste[x] - a >> 1 && y > -1; y--) {
			krumm += (~~((Math.random() - 0.5) * 12))
			krumm = Math.min(Math.max(krumm, -(a / 3)), a / 3)
			for (let x = -(a >> 4); x < a >> 4; x++) {
				let pos = cord(x + (a >> 1) + krumm, y, a)
				out[pos] = [50, 100, 0]
			}
		}
	}
	return out
}
function buschBeerenB(a) {
	let out = einfarbigB(a, [50, 100, 0])
	let size = a >> 3
	let amount = a >> 1
	for (let i = 0; i < amount; i++) {
		let centerX = ~~(Math.random() * (a - (size << 1))) + size
		let centerY = ~~(Math.random() * (a - (size << 1))) + size
		for (let x = -size; x < size; x++) {
			for (let y = -size; y < size; y++) {
				let dis = (x ** 2 + y ** 2) * 0.5
				if (dis < size) {
					let pos = cord(centerX + x, centerY + y, a)
					out[pos] = [155, 0, 0]
				}
			}
		}
	}
	return out
}
function grubeB(a) {
	let out = einfarbigB(a, [87, 59, 23])
	let size = a >> 1
	let amount = a
	for (let i = 0; i < amount; i++) {
		let centerX = ~~(Math.random() * (a - (size >> 1))) + size >> 1
		let centerY = ~~(Math.random() * (a - (size >> 1))) + size >> 1
		for (let x = -size; x < size; x++) {
			for (let y = -size; y < size; y++) {
				let dis = (x ** 2 + y ** 2) * 0.5
				if (dis < size) {
					let pos = cord(centerX + x, centerY + y, a)
					out[pos] = [57, 29, 0]
				}
			}
		}
	}
	return out
}
function ozeanSteineB(a) {
	let out = einfarbigB(a, [0, 0, 255])
	let size = a >> 2
	let amount = ~~(a / 6)
	for (let i = 0; i < amount; i++) {
		let centerX = ~~(Math.random() * (a - (size << 1))) + size
		let centerY = ~~(Math.random() * (a - (size << 1))) + size
		for (let x = -size; x < size; x++) {
			for (let y = -size; y < size; y++) {
				let dis = (x ** 2 + y ** 2) * 0.5
				if (dis < size) {
					let pos = cord(centerX + x, centerY + y, a)
					out[pos] = [75, 75, 75]
				}
			}
		}
	}
	return out
}
function seeSteineB(a) {
	let out = einfarbigB(a, [0, 0, 175])
	let size = a >> 2
	let amount = ~~(a / 6)
	for (let i = 0; i < amount; i++) {
		let centerX = ~~(Math.random() * (a - (size << 1))) + size
		let centerY = ~~(Math.random() * (a - (size << 1))) + size
		for (let x = -size; x < size; x++) {
			for (let y = -size; y < size; y++) {
				let dis = (x ** 2 + y ** 2) * 0.5
				if (dis < size) {
					let pos = cord(centerX + x, centerY + y, a)
					out[pos] = [75, 75, 75]
				}
			}
		}
	}
	return out
}
let flussSteineB = (a) => ozeanSteineB(a)
function generiereBöden() {
	let scale = ~~(Math.max(ctx.canvas.width, ctx.canvas.height) / 25)
	let bodenTextur = [
		ozeanB, grasB, steinB,
		teichB, flussB, strandB,
		schwarzB, buschBeerenB, baumB,
		buschB, miniBaumB, miniBuschB,
		erdeB, grubeB, ozeanSteineB, flussSteineB, seeSteineB
	]
	let out = []
	for (let x = 0; x < bodenTextur.length; x++) {
		out.push(bodenTextur[x](scale))
	}
	return out
}
let color = generiereBöden()
let boden = [1, 2, 5, 12, , 14, 15, 16]
let notPickUp = [13]
let rezept = {
	"0g7": "1g9",
	"0g9": "2g1",
	"0g2": "3g2",
	"0g1": "7g12",
	"4g8": "5g1",
	"0g8": "6g8",
	"11g12": "12g13",
	"12g13": "0g12",
	"3g0": "0g14",
	"3g4": "0g15",
	"3g3": "0g16",
	"0g14": "3g0",
	"0g15": "3g4",
	"0g16": "3g3",
	"9g0": "13g0",
	"9g3": "13g3",
	"9g4": "13g4",
	"1g13": "0g13",
	"2g13": "0g13",
	"3g13": "0g13",
	"5g13": "0g13",
	"6g13": "0g13",
	"7g13": "0g13",
	"8g13": "0g13",
	"10g13": "0g13",
	"15g13": "0g13",
	"18g13": "0g13",
	"0g10": "2g1",
	"0g11": "2g1",
}
let craft = {
	"2i3": "4i0",
	"2i8": "9i0",
	"7i7": "8i0",
	"2i10": "11i0",
	"4i5": "4i10",
	"4i10": "4i16",
	"0i16": "18i17",
	"0i17": "18i18",
	"18i18": "0i17",
	"18i17": "0i16",
	"18i3": "4i0",
	"18i8": "9i0",
	"18i10": "11i0"
}
let abs = (a) => Math.abs(a)
let kant = (a) => a.length ** 0.5
let first = Date.now()
function cord(x, y, kante) {
	while (x >= kante) {
		x -= kante
	}
	while (y >= kante) {
		y -= kante
	}
	while (y < 0) {
		y += kante
	}
	while (x < 0) {
		x += kante
	}
	return y * kante + x
}
function posRich(pos, rich, kante) {
	return cord((pos % kante) + env[rich][0], ~~(pos / kante) + env[rich][1], kante)
}
function chunkInd(pos) {
	let x = pos % weltKante
	let y = ~~(pos / weltKante)
	while (x >= weltKante) {
		x -= weltKante
	}
	while (y >= weltKante) {
		y -= weltKante
	}
	while (y < 0) {
		y += weltKante
	}
	while (x < 0) {
		x += weltKante
	}
	return (~~(x / chunkKante)) + (~~(y / chunkKante)) * kant(chunks)
}
function chunkPos(pos) {
	let x = pos % weltKante
	let y = ~~(pos / weltKante)
	while (x >= weltKante) {
		x -= weltKante
	}
	while (y >= weltKante) {
		y -= weltKante
	}
	while (y < 0) {
		y += weltKante
	}
	while (x < 0) {
		x += weltKante
	}
	return x % chunkKante + (y % chunkKante) * chunkKante
}
function bodenTyp(pos) {
	return chunks[chunkInd(pos)][1][chunkPos(pos)]
}
function neben(pos, kante, test) {
	for (let x = 0; x < 4; x++) {
		if (test(posRich(pos, x, kante))) {
			return true
		}
	}
	return false
}
function average(list) {
	const pow = list.length
	const kante = Math.sqrt(pow)
	let newList = Array(pow).fill(0)
	for (let x = 0; x < kante; x++) {
		for (let y = 0; y < kante; y++) {
			let collector = list[y * kante + x]
			for (let z = 0; z < 8; z++) {
				collector += list[cord(x + env[z][0], y + env[z][1], kante)]
			}
			newList[y * kante + x] = collector / 9
		}
	}
	return newList
}
function resize(list) {
	const pow = list.length
	const kante = Math.sqrt(pow)
	let min = list[0]
	let max = list[0]
	for (let x = 1; x < pow; x++) {
		min = Math.min(min, list[x])
		max = Math.max(max, list[x])
	}
	const mul = 100 / (max - min)
	for (let x = 0; x < pow; x++) {
		list[x] = Math.max(Math.min((list[x] - min) * mul, 100), 0)
	}
	return list
}
function zoom(list, depth, mul) {
	if (depth == 0) {
		return list
	} else {
		const pow = list.length
		const kante = Math.sqrt(pow)
		const neuKante = kante * 10
		const neuPow = neuKante * neuKante
		let neuList = Array(neuPow).fill(0)
		for (let x = 0; x < neuKante; x++) {
			for (let y = 0; y < neuKante; y++) {
				neuList[cord(x, y, neuKante)] = list[cord(~~(x / 10), ~~(y / 10), kante)] + (Math.random() - 0.5) * mul
			}
		}
		const zeros = neuKante.toString().length - 1
		for (let x = 0; x < zeros * zeros; x++) {
			neuList = average(neuList)
		}
		return zoom(neuList, depth - 1, mul)
	}
}
function createFrame(height, colors, areaItems) {
	const pow = height.length
	const kante = Math.sqrt(pow)
	const col = colors || Array(pow).fill(6)
	const preMin = Math.max(c.width, c.height)
	const div = ~~(preMin / (kante))
	const min = div * kante
	const image = ctx.createImageData(min, min)
	const breite = div * div * kante
	for (let y = 0; y < kante; y++) {
		for (let x = 0; x < kante; x++) {
			const pos = y * kante + x
			const farben = color[col[pos]]
			const overFarbe = 255 - (height[pos] - NN) * (1 / ((100 - NN) / 100)) * 1.5
			for (let n = 0; n < div; n++) {
				for (let m = 0; m < div; m++) {
					const farbe = farben[n + m * div]
					const pixel = (x * div + y * breite + m * min + n) << 2
					image.data[pixel] = farbe[0]
					image.data[pixel + 1] = farbe[1]
					image.data[pixel + 2] = farbe[2]
					image.data[pixel + 3] = overFarbe
				}
			}
			if (areaItems[pos] != 0) {
				let picture = textures[areaItems[pos] - 1]
				for (let n = 0; n < div; n++) {
					for (let m = 0; m < div; m++) {
						const pixel = (x * div + y * breite + m * min + n) << 2
						const colored = picture[cord(n, m, div)]
						if (colored != 0) {
							image.data[pixel] = colored[0]
							image.data[pixel + 1] = colored[1]
							image.data[pixel + 2] = colored[2]
						}
					}
				}
			}
		}
	}
	return image
}
function tiefste(list) {
	const kante = list.length
	let deepest = kante
	let index, streak, bestStreak = 0
	for (let x = 0; x < kante * 2; x++) {
		if (list[x % kante] < deepest) {
			index = x
			deepest = list[x % kante]
			streak, bestStreak = 1
		} else if (list[x % kante] == deepest) {
			streak++
			if (streak > bestStreak) {
				index = ~~(x - streak / 2)
				bestStreak = streak
			}
		} else {
			streak = 0
		}
	}
	return index % kante
}
function center(list, submerged) {
	const pow = list.length
	const kante = Math.sqrt(pow)
	let zeilen = Array(kante).fill(0)
	let spalten = Array(kante).fill(0)
	for (let x = 0; x < kante; x++) {
		for (let y = 0; y < kante; y++) {
			if (list[cord(y, x, kante)] > submerged) {
				zeilen[x]++
			}
			if (list[cord(x, y, kante)] > submerged) {
				spalten[x]++
			}
		}
	}
	const zeilIndex = tiefste(zeilen)
	const spaltIndex = tiefste(spalten)
	let newList = Array(pow).fill(0)
	for (let x = 0; x < kante; x++) {
		for (let y = 0; y < kante; y++) {
			newList[cord(x, y, kante)] = list[cord(x + spaltIndex, y + zeilIndex, kante)]
		}
	}
	return newList
}
function waterPerc(list, perc) {
	perc = Math.max(Math.min(99, perc), 1)
	const pow = list.length
	const kante = Math.sqrt(pow)
	let höhen = Array(101).fill(0)
	for (let x = 0; x < pow; x++) {
		höhen[~~(list[x])]++
	}
	let wasser = 0
	for (let x = 0; x < 101; x++) {
		wasser += höhen[x]
		if (wasser / pow >= perc / 100) {
			return x
		}
	}
}
function waterAndLand(list, submerged) {
	const pow = list.length
	const kante = Math.sqrt(pow)
	let out = [[], [], Array(pow).fill(-1)]
	for (let x = 0; x < pow; x++) {
		if (out[2][x] == -1) {
			const searched = list[x] > submerged
			out[+searched].push([x])
			out[2][x] = searched ? out[1].length : 0
			let newBorder = []
			let border = [x]
			while (border.length > 0) {
				for (let y = 0; y < border.length; y++) {
					for (let z = 0; z < 4; z++) {
						let pos = posRich(border[y], z, kante)
						if (out[2][pos] == -1 && searched == (list[pos] > submerged)) {
							newBorder.push(pos)
							out[2][pos] = searched ? out[1].length : 0
							out[+searched][out[+searched].length - 1].push(pos)
						}
					}
				}
				border = newBorder
				newBorder = []
			}
		}
	}
	return out
}
function stop(note) {
	const second = Date.now()
	const time = (second - first) / 1000
	const seconds = time % 60
	const minutes = ~~(time / 60)
	if (minutes == 0) {
		console.log(`time needed: ${seconds}s for: ${note}`)
	} else {
		console.log(`time needed: ${minutes}min ${seconds}s for: ${note}`)
	}
	first = Date.now()
}
function oneSea(vals) {
	vals[0] = vals[0].sort((a, b) => b.length - a.length)
	const kante = Math.sqrt(vals[2].length)
	while (vals[0].length > 1) {
		const wasser = vals[0].length - 1
		let maxIter = 0
		let pos = posRich(vals[0][wasser][0], 0, kante)
		while (vals[2][pos] == 0 && maxIter < kante) {
			maxIter++
			pos = posRich(pos, 0, kante)
		}
		const land = vals[2][pos]
		for (let x = 0; x < vals[0][wasser].length; x++) {
			vals[2][vals[0][wasser][x]] = land
		}
		let popped = vals[0].pop()
		for (let x = 0; x < popped.length; x++) {
			vals[1][land - 1].push(popped[x])
		}
	}
	for (let x = 0; x < vals[1].length; x++) {
		let pos = vals[1][x][0]
		let maxIter = 0
		while (vals[2][pos] == x + 1 && maxIter < kante) {
			maxIter++
			pos = posRich(pos, 0, kante)
		}
		const land = vals[2][pos]
		if (land != 0 && land != x + 1) {
			for (let y = 0; y < vals[1][x].length; y++) {
				vals[2][vals[1][x][y]] = land
			}
			for (let y = 0; y < vals[1][x].length; y++) {
				vals[1][land - 1].push(vals[1][x][y])
			}
			vals[1][x] = []
		}
	}
	for (let x = 0; x < vals[1].length; x++) {
		if (vals[1][x].length == 0) {
			vals[1].splice(x, 1)
			x--
			continue
		}
		for (let y = 0; y < vals[1][x].length; y++) {
			vals[2][vals[1][x][y]] = x + 1
		}
	}
	return vals
}
function cutout(insel, map, tag) {
	const pow = map.length
	const kante = Math.sqrt(pow)
	let mod = a => a % kante
	let div = a => ~~(a / kante)
	let conv = [div, mod, div, mod]
	const n = div(insel[0])
	const m = mod(insel[0])
	const nummer = tag[insel[0]]
	let extreme = [n, m, n, m]
	let kl = (a, b) => a - 1 == b || a + (kante - 1) == b
	let gr = (a, b) => a + 1 == b || a - (kante - 1) == b
	let oper = [kl, gr, gr, kl]
	let searched = Array(pow).fill(false)
	searched[insel[0]] = true
	let search = [insel[0]]
	while (search.length > 0) {
		let neu = []
		for (let x = 0; x < search.length; x++) {
			for (let y = 0; y < 4; y++) {
				let neuPos = posRich(search[x], y, kante)
				if (!searched[neuPos] && tag[neuPos] == nummer) {
					searched[neuPos] = true
					neu.push(neuPos)
					if (oper[y](extreme[y], conv[y](neuPos))) {
						extreme[y] += env[y][1 - (y % 2)]
					}
				}
			}
		}
		search = [...neu]
	}
	const oben = extreme[0]
	const rechts = extreme[1]
	const unten = extreme[2]
	const links = extreme[3]
	const hor = Math.abs(rechts - links)
	const ver = Math.abs(unten - oben)
	const cutKante = Math.min(Math.max(ver, hor) + 3, kante)
	const xNull = (hor > ver ? links : links - ((ver - hor) >> 1)) - 1
	const yNull = (ver > hor ? oben : oben - ((hor - ver) >> 1)) - 1
	const cutPow = cutKante * cutKante
	let cutMap = Array(cutPow).fill(0)
	let cutTag = Array(cutPow).fill(0)
	cutInsel = []
	for (let x = 0; x < cutKante; x++) {
		for (let y = 0; y < cutKante; y++) {
			let pos = y * cutKante + x
			cutMap[pos] = map[cord(x + xNull, y + yNull, kante)]
			cutTag[pos] = tag[cord(x + xNull, y + yNull, kante)] == nummer
			if (cutTag[pos]) {
				cutInsel.push(pos)
			}
		}
	}
	return [cutMap, cutTag, cutInsel, [xNull, yNull, cutKante]]
}
function print(map) {
	const pow = map.length
	const kante = Math.sqrt(pow)
	for (let y = 0; y < kante; y++) {
		out = ""
		for (let x = 0; x < kante; x++) {
			out += `${(~~(map[y * kante + x] * 10)) / 10} `
		}
		console.log(out)
	}
	return map
}
function firstBeach(land, tagged, kante) {
	for (let x = 0; x < land.length; x++) {
		for (let y = 0; y < 4; y++) {
			if (!tagged[posRich(land[x], y, kante)]) {
				return land[x]
			}
		}
	}
}
function firstPondable(flush, type, tagged, kante) {
	for (let x = flush.length - 1; x > -1; x--) {
		if (neben(flush[x], kante, a => tagged[a] && type[a] == 0)) {
			return flush[x]
		}
	}
}
function smallest(list) {
	const pow = list.length
	const kante = Math.sqrt(pow)
	const out = Array(pow)
	for (let x = 0; x < pow; x++) {
		let minNum = list[posRich(x, 0, kante)]
		let minRich = 0
		for (let y = 1; y < 4; y++) {
			let neu = posRich(x, y, kante)
			if (list[neu] < minNum) {
				minRich = y
				minNum = list[neu]
			}
		}
		out[x] = minRich
	}
	return out
}
function selectBeach(start, tagged) {
	let pow = tagged.length
	let kante = Math.sqrt(pow)
	let type = Array(pow).fill(0)
	let changed = [start]
	let beach = []
	while (changed.length > 0) {
		let neu = []
		for (let x = 0; x < changed.length; x++) {
			type[changed[x]] = -1
			for (let y = 0; y < 8; y++) {
				let neuPos = posRich(changed[x], y, kante)
				let nebenWasser = neben(neuPos, kante, a => !tagged[a])
				if (tagged[neuPos] && nebenWasser && type[neuPos] == 0) {
					neu.push(neuPos)
				}
			}
		}
		beach.push(...changed)
		changed = neu
	}
	return beach
}
function teiche(into, NN) {
	const karte = into[0]
	const tagged = into[1]
	const land = into[2]
	const pow = karte.length
	const kante = Math.sqrt(pow)
	let type = Array(pow).fill(0)
	let beach = selectBeach(firstBeach(land, tagged, kante), tagged)
	for (let x = 0; x < beach.length; x++) {
		type[beach[x]] = -1
	}
	let changed = -1
	for (let x = 0; x < kante && changed == -1; x++) {
		for (let y = 0; y < 4; y++) {
			let horNeu = posRich(x, y, kante)
			let ver = x * kante
			let verNeu = posRich(ver, y, kante)
			if (tagged[x] && !tagged[horNeu] && type[x] != -1) {
				changed = x
			}
			if (tagged[ver] && !tagged[verNeu] && type[ver] != -1) {
				changed = ver
			}
		}
	}
	if (changed != -1) {
		let neuStrand = selectBeach(changed, tagged)
		for (let x = 0; x < neuStrand.length; x++) {
			beach.push(neuStrand[x])
			type[neuStrand[x]] = -1
		}
	}
	changed = [...beach]
	const smal = smallest(karte)
	const flush = [...beach]
	while (changed.length > 0) {
		let neu = []
		for (let x = 0; x < changed.length; x++) {
			for (let y = 0; y < 4; y++) {
				let neuPos = posRich(changed[x], y, kante)
				let smalPos = posRich(neuPos, smal[neuPos], kante)
				if (karte[smalPos] < karte[neuPos] && tagged[neuPos] && type[smalPos] == -1 && type[neuPos] == 0) {
					type[neuPos] = -1
					neu.push(neuPos)
				}
			}
		}
		for (let x = 0; x < changed.length; x++) {
			flush.push(changed[x])
		}
		changed = neu
	}
	let brim = []
	let flowHeight = []
	let flowDir = []
	for (let x = 0; x < flush.length; x++) {
		let pos = flush[x]
		if (neben(pos, kante, a => type[a] == 0 && tagged[a])) {
			let lowestFlow = 100
			let lowestDir = 0
			for (let y = 0; y < 4; y++) {
				let a = posRich(pos, y, kante)
				if (type[a] == 0 && tagged[a] && karte[a] < lowestFlow) {
					lowestFlow = karte[a]
					lowestDir = y
				}
			}
			flowDir.push(lowestDir)
			flowHeight.push(Math.max(lowestFlow, karte[pos]))
			brim.push(pos)
		}
	}
	ponds = []
	while (brim.length > 0) {
		let minNum = flowHeight[0]
		let minI = 0
		for (let x = 1; x < brim.length; x++) {
			if (flowHeight[x] < minNum) {
				minNum = flowHeight[x]
				minI = x
			}
		}
		let changed = [posRich(brim[minI], flowDir[minI], kante)]
		type[changed[0]] = brim[minI]
		type[brim[minI]] = -minNum
		let pond = []
		while (changed.length > 0) {
			let neu = []
			for (let x = 0; x < changed.length; x++) {
				let pos = changed[x]
				for (let y = 0; y < 4; y++) {
					let neuPos = posRich(pos, y, kante)
					if (type[neuPos] == 0 && karte[neuPos] < minNum) {
						neu.push(neuPos)
						type[neuPos] = brim[minI]
					}
				}
			}
			for (let x = 0; x < changed.length; x++) {
				pond.push(changed[x])
			}
			changed = neu
		}
		ponds.push([...pond])
		let intoPond = []
		changed = [...pond]
		while (changed.length > 0) {
			let neu = []
			for (let x = 0; x < changed.length; x++) {
				for (let y = 0; y < 4; y++) {
					let pos = posRich(changed[x], y, kante)
					if (type[pos] == 0 && type[posRich(pos, smal[pos], kante)] != 0) {
						neu.push(pos)
						type[pos] = -1
					}
				}
			}
			for (let x = 0; x < changed.length; x++) {
				intoPond.push(changed[x])
			}
			changed = neu
		}
		let potential = [...brim, ...intoPond]
		brim = []
		flowHeight = []
		flowDir = []
		for (let x = 0; x < potential.length; x++) {
			let pos = potential[x]
			if (neben(pos, kante, a => type[a] == 0 && tagged[a])) {
				let lowestFlow = 100
				let lowestDir = 0
				for (let y = 0; y < 4; y++) {
					let a = posRich(pos, y, kante)
					if (type[a] == 0 && tagged[a] && karte[a] < lowestFlow) {
						lowestFlow = karte[a]
						lowestDir = y
					}
				}
				flowDir.push(lowestDir)
				flowHeight.push(Math.max(lowestFlow, karte[pos]))
				brim.push(pos)
			}
		}
	}
	land.sort((a, b) => karte[b] - karte[a])
	let sources = []
	let waterDump = Array(pow).fill(1)
	for (let x = 0; x < land.length; x++) {
		let dir = []
		let pos = land[x]
		for (let y = 0; y < 4; y++) {
			if (karte[posRich(pos, y, kante)] < karte[pos]) {
				dir.push(y)
			}
		}
		for (let y = 0; y < dir.length; y++) {
			let neuPos = posRich(pos, dir[y], kante)
			waterDump[neuPos] += waterDump[pos] / dir.length
		}
		if (dir.length > 0) {
			waterDump[pos] = 0
		} else {
			sources.push(pos)
		}
	}
	let waterDis = Array(pow).fill(0)
	for (let x = 0; x < ponds.length; x++) {
		let sum = 0
		for (let y = 0; y < ponds[x].length; y++) {
			sum += waterDump[ponds[x][y]]
		}
		ponds[x].push(sum)
	}
	let sums = []
	for (let x = 0; x < ponds.length; x++) {
		sums.push(ponds[x][ponds[x].length - 1])
	}
	ponds.sort((a, b) => b[b.length - 1] - a[a.length - 1])
	for (let x = 0; x < ponds.length && ponds[x][ponds[x].length - 1] > 200; x++) {
		let pond = ponds[x]
		let source = pond[0]
		let exit = type[source]
		let watrLvl = -type[exit]
		while (watrLvl - karte[source] > 0) {
			exit = type[source]
			watrLvl = -type[exit]
			changed = [source]
			waterDis[source] = 1
			while (changed.length > 0) {
				let neu = []
				for (let x = 0; x < changed.length; x++) {
					for (let y = 0; y < 4; y++) {
						let pos = posRich(changed[x], y, kante)
						if (type[pos] == exit && waterDis[pos] == 0) {
							waterDis[pos] = 1
							neu.push(pos)
						}
					}
				}
				changed = neu
			}
			source = type[source]
			while (type[source] < 0) {
				waterDis[source] = 2
				source = posRich(source, smal[source], kante)
			}
			if (karte[exit] == -type[exit]) {
				waterDis[exit] = 1
			}
			if (waterDis[source] > 0) {
				break
			}
			waterDis[source] = 1
			watrLvl = type[source]
		}
	}
	return [karte, tagged, land, waterDis, beach, into[3]]
}
function steigung(into) {
	const karte = into[0]
	const land = into[2]
	const pow = karte.length
	const kante = Math.sqrt(pow)
	let steep = Array(pow).fill(0)
	for (let x = 0; x < land.length; x++) {
		for (let y = 0; y < 4; y++) {
			let pos = posRich(land[x], y, kante)
			steep[land[x]] += Math.abs(karte[land[x]] - karte[pos])
		}
	}
	return steep
}
function tagTerrain(into, NN) {
	const karte = into[0]
	const tagged = into[1]
	const land = into[2]
	const water = into[3]
	const beach = into[4]
	const steep = into[6]
	const pow = karte.length
	const kante = Math.sqrt(pow)
	let terrain = Array(pow).fill(0)
	for (let x = 0; x < land.length; x++) {
		pos = land[x]
		if (steep[pos] > 3) {
			terrain[pos] = 2
		}
		if (water[pos] > 0) {
			terrain[pos] = water[pos] + 2
		}
	}
	let changed = []
	for (let x = 0; x < beach.length; x++) {
		if (terrain[beach[x]] == 0) {
			changed.push(beach[x])
			terrain[beach[x]] = 5
		}
	}
	while (changed.length > 0) {
		let neu = []
		for (let x = 0; x < changed.length; x++) {
			for (let y = 0; y < 8; y++) {
				let pos = posRich(changed[x], y, kante)
				if (tagged[pos] && terrain[pos] == 0 && karte[pos] - NN < 2) {
					terrain[pos] = 5
					neu.push(pos)
				}
			}
		}
		changed = neu
	}
	let erde = []
	for (let x = 0; x < land.length; x++) {
		if (terrain[land[x]] == 0) {
			erde.push(land[x])
			terrain[land[x]] = 1
		}
	}
	for (let x = 0; x < erde.length; x++) {
		let rand = Math.random()
		if (rand < 1 / 64) {
			terrain[erde[x]] = 7
		} else if (rand < Math.min(1 / 64 + (1 / 200) * ((karte[erde[x]] - NN - 2) ** 2), 0.5) && karte[erde[x]] > NN + 4) {
			terrain[erde[x]] = 8
		}
	}
	return terrain
}
function findStart(inseln, map) {
	let smalNum = map.length
	let smalInd = -1
	let bigNum = 0
	let bigInd = -1
	for (let x = 0; x < inseln.length; x++) {
		let size = inseln[x][2].length
		if (size > 3000 && size < smalNum) {
			smalNum = size
			smalInd = x
		}
		if (size > bigNum) {
			bigNum = size
			bigInd = x
		}
	}
	if (smalInd == -1) {
		smalInd = bigInd
	}
	let insel = inseln[smalInd]
	let strand = insel[4]
	let pos = strand[0]
	let einleitungPos = strand[1]
	for (let x = 0; x < strand.length; x++) {
		if (insel[7][strand[x]] != 4) {
			pos = strand[x]
			einleitungPos = strand[x + 1]
			break
		}
	}
	let bewegt = insel[5]
	let x = pos % bewegt[2] + bewegt[0]
	let y = ~~(pos / bewegt[2]) + bewegt[1]
	allItems[cord(einleitungPos % bewegt[2] + bewegt[0], ~~(einleitungPos / bewegt[2]) + bewegt[1], weltKante)] = 19
	return cord(x, y, map.length ** 0.5)
}
function generate(wasserPerc, auflösung) {
	let map = resize(zoom(zoom([90], auflösung, 100), 1, 25))
	const NN = waterPerc(map, wasserPerc)
	map = center(map, NN)
	const vals = oneSea(waterAndLand(map, NN))
	const wasser = vals[0][0]
	const tagged = vals[2]
	const inseln = []
	for (let x = 0; x < vals[1].length; x++) {
		inseln.push(teiche(cutout(vals[1][x], map, tagged), NN))
	}
	for (let x = 0; x < inseln.length; x++) {
		inseln[x].push(steigung(inseln[x]))
		inseln[x].push(tagTerrain(inseln[x], NN))
	}
	return [map, tagged, inseln, NN]
}
function male() {
	if (updateScreen) {
		let insel = chunks[chunkInd(playerPos)][4][chunkPos(playerPos)]
		if (insel != counters[15] && insel != 0 && counters[16] == 0 && counters[13] == 1) {
			counters[16] = 1
			letter(["Hier, der letzte Zettel", 10], `Hi,
this is the End of my Game. You have successfully solved every riddle!
I hope you had fun playing :)

derBohrman`, "paper_3.txt")
		}
		updateScreen = false
		let xNull = playerPos % weltKante - (chunkKante >> 1)
		let yNull = ~~(playerPos / weltKante) - (chunkKante >> 1)
		let xEck = playerPos % weltKante + (chunkKante >> 1)
		let yEck = ~~(playerPos / weltKante) + (chunkKante >> 1)
		let xNullChanged = 0
		let yNullChanged = 0
		if (xNull < 0) {
			xNull += weltKante
			xNullChanged += weltKante
		}
		if (yNull < 0) {
			yNull += weltKante
			yNullChanged += weltKante
		}
		if (xEck < 0) {
			xEck += weltKante
		} if (yEck < 0) {
			xEck += weltKante
		}
		const xNullChunk = ~~(xNull / chunkKante)
		const yNullChunk = ~~(yNull / chunkKante)
		const xEckChunk = ~~(xEck / chunkKante)
		const yEckChunk = ~~(yEck / chunkKante)
		const chunkA = cord(xNullChunk, yNullChunk, kant(chunks))
		const chunkB = cord(xNullChunk, yEckChunk, kant(chunks))
		const chunkC = cord(xEckChunk, yNullChunk, kant(chunks))
		const chunkD = cord(xEckChunk, yEckChunk, kant(chunks))
		const drawChunks = [...new Set([chunkA, chunkB, chunkC, chunkD])]
		const widthOffset = (chunkKante - (c.width / scale)) * scale * 0.5
		const heightOffset = (chunkKante - (c.height / scale)) * scale * 0.5
		const centerChunk = chunkInd(playerPos)
		const centerChunkX = centerChunk % kant(chunks)
		const centerChunkY = ~~(centerChunk / kant(chunks))
		for (let x = 0; x < drawChunks.length; x++) {
			const chunkIndex = drawChunks[x]
			let chunkFrame = chunks[chunkIndex][0]
			const xChunk = chunkIndex % kant(chunks)
			const yChunk = ~~(chunkIndex / kant(chunks))
			const xChunkNull = xChunk * chunkKante
			const yChunkNull = yChunk * chunkKante
			let xOffset = xNull - xChunkNull
			let yOffset = yNull - yChunkNull
			if (abs(xChunk - centerChunkX) < 2 && centerChunkX == 0) {
				xOffset -= xNullChanged
			}
			if (abs(xChunk - centerChunkX) > 1 && centerChunkX == kant(chunks) - 1) {
				xOffset -= weltKante
			}
			if (abs(yChunk - centerChunkY) < 2 && centerChunkY == 0) {
				yOffset -= yNullChanged
			}
			if (abs(yChunk - centerChunkY) > 1 && centerChunkY == kant(chunks) - 1) {
				yOffset -= weltKante
			}
			if (chunkFrame == 0) {
				let chunk = chunks[chunkIndex]
				chunk[0] = chunkFrame = createFrame(chunk[3], chunk[1], chunk[2])
			}
			ctx.putImageData(chunkFrame, (xPlayerOff - xOffset) * scale - widthOffset, (yPlayerOff - yOffset) * scale - heightOffset)
		}
		let widthCenter = c.width >> 1
		let heightCenter = c.height >> 1
		let half = scale >> 1
		ctx.fillStyle = "rgb(277 188 154)"
		ctx.strokeStyle = "rgb(227 138 104)"
		ctx.lineWidth = scale >> 3
		if (!walkable) {
			ctx.beginPath()
			ctx.arc(widthCenter + half, heightCenter + half, scale >> 2, 0, 8)
			ctx.fill()
			ctx.stroke()
			ctx.beginPath()
			ctx.arc(widthCenter + half, heightCenter - half, scale >> 2, 0, 8)
			ctx.fill()
			ctx.stroke()
			if (holding != 0) {
				let textur = textures[holding - 1]
				for (let x = 0; x < scale; x++) {
					for (let y = 0; y < scale; y++) {
						let col = textur[cord(x, y, scale)]
						if (col != 0) {
							let xFrame = widthCenter + (half >> 1) + x
							let yFrame = heightCenter - (half >> 1) + y
							ctx.beginPath()
							ctx.fillStyle = `rgb(${col[0]} ${col[1]} ${col[2]})`
							ctx.rect(xFrame, yFrame, 1, 1)
							ctx.fill()
						}
					}
				}
			}
		}
		ctx.beginPath()
		ctx.lineWidth = scale >> 3
		ctx.fillStyle = "rgb(277 188 154)"
		ctx.strokeStyle = "rgb(227 138 104)"
		ctx.arc(widthCenter, heightCenter, half, 0, 8)
		ctx.fill()
		ctx.stroke()
	}
	requestAnimationFrame(male)
}
function findWay(startPos, zielPos) {
	let dis = Array(weltGröße).fill(-1)
	let changed = [startPos]
	dis[startPos] = 0
	let time = 0
	while (changed.length > 0 && dis[zielPos] == -1) {
		time++
		let neu = []
		for (let x = 0; x < changed.length; x++) {
			for (let y = 0; y < 8; y++) {
				let pos = posRich(changed[x], y, weltKante)
				if (boden.includes(bodenTyp(pos)) && dis[pos] == -1) {
					if (y > 3) {
						let firstRich = y - 4
						let secondRich = (firstRich + 1) % 4
						let firstPos = posRich(changed[x], firstRich, weltKante)
						let secondPos = posRich(changed[x], secondRich, weltKante)
						if (!(boden.includes(bodenTyp(firstPos)) && boden.includes(bodenTyp(secondPos)))) {
							continue
						}
					}
					neu.push(pos)
					dis[pos] = time
				}
			}
		}
		changed = neu
	}
	let tested = Array(weltGröße).fill(0)
	let länge = dis[zielPos]
	if (länge == -1) {
		let nächstesPos = []
		let changed = [zielPos]
		while (changed.length > 0 && nächstesPos.length == 0) {
			let neu = []
			for (let x = 0; x < changed.length; x++) {
				for (let y = 0; y < 8; y++) {
					let pos = posRich(changed[x], y, weltKante)
					if (!tested[pos]) {
						tested[pos] = 1
						neu.push(pos)
						if (dis[pos] != -1) {
							nächstesPos.push([pos, y])
						}
					}
				}
			}
			changed = neu
		}
		let bestPos = nächstesPos[0][0]
		let schräg = nächstesPos[0][1] > 3
		for (let x = 1; x < nächstesPos.length; x++) {
			if ((dis[bestPos] > dis[nächstesPos[x][0]] && schräg == (nächstesPos[x][1] > 3)) || (schräg && !(nächstesPos[x][1] > 3) && dis[bestPos] == dis[nächstesPos[x][0]])) {
				bestPos = nächstesPos[x][0]
				schräg = nächstesPos[x][1] > 3
			}
		}
		zielPos = bestPos
		länge = dis[zielPos]
	}
	let weg = Array(länge)
	while (länge--) {
		for (let x = 0; x < 8; x++) {
			let pos = posRich(zielPos, x, weltKante)
			if (dis[pos] == länge) {
				zielPos = pos
				weg[länge] = x ^ 2
				break
			}
		}
	}
	return weg
}
function walk(weg, pickup) {
	let beforeWalking = walkable
	walkable = true
	let endAction = pickup || 0
	if (weg.length == 0) {
		walkable = beforeWalking
		if (endAction != 0) {
			endAction()
			updateScreen = true
		}
		return
	}
	let positions = Array(weg.length)
	positions[0] = playerPos
	for (let x = 1; x < weg.length; x++) {
		positions[x] = posRich(positions[x - 1], weg[x - 1], weltKante)
	}
	let lastInd = weg.length - 1
	let zielPos = posRich(positions[lastInd], weg[lastInd], weltKante)
	let walkStart = Date.now()
	walkId = setInterval(function () {
		let deltaTime = Date.now() - walkStart
		let x = ~~(deltaTime / walkSpeed)
		if (x >= weg.length) {
			walkable = beforeWalking
			playerPos = zielPos
			xPlayerOff = 0
			yPlayerOff = 0
			updateScreen = true
			if (endAction != 0) {
				endAction()
			}
			clearInterval(walkId)
		} else {
			playerPos = positions[x]
			xPlayerOff = env[weg[x] ^ 2][0] * (deltaTime % walkSpeed) / walkSpeed
			yPlayerOff = env[weg[x] ^ 2][1] * (deltaTime % walkSpeed) / walkSpeed
			updateScreen = true
		}
	}, 5)
}
function interrupt(resolve, stopper) {
	clearInterval(walkId)
	clearInterval(interruptId)
	if (xPlayerOff != 0 || yPlayerOff != 0) {
		let start = Date.now()
		let startX = xPlayerOff
		let startY = yPlayerOff
		start -= Math.max(abs(startX), abs(startY)) * walkSpeed
		let endX = Math.round(abs(startX) / startX) || 0
		let endY = Math.round(abs(startY) / startY) || 0
		let playerX = playerPos % weltKante
		let playerY = ~~(playerPos / weltKante)
		let neuPos = cord(playerX - endX, playerY - endY, weltKante)
		updateScreen = true
		interruptId = setInterval(function () {
			let deltaTime = Date.now() - start
			if (deltaTime >= walkSpeed) {
				playerPos = neuPos
				xPlayerOff = 0
				yPlayerOff = 0
				updateScreen = true
				clearInterval(interruptId)
				resolve()
				clearTimeout(stopper)
			} else {
				xPlayerOff = (endX * deltaTime) / walkSpeed
				yPlayerOff = (endY * deltaTime) / walkSpeed
				updateScreen = true
			}
		}, 5)
	} else {
		resolve()
		clearTimeout(stopper)
	}
}
function changeBlock(dir) {
	updateScreen = true
	let pos = posRich(playerPos, dir, weltKante)
	let chunk = chunks[chunkInd(pos)]
	let old = bodenTyp(pos)
	let oldData = `${holding}g${old}`
	let neuData = rezept[oldData] || oldData
	let item = chunks[chunkInd(pos)][2][chunkPos(pos)]
	if (holding == 0 && chunk[2][chunkPos(pos)] == 0 && counters[8] == 0 && counters[12] == 1 && counters[13] == 0 && pos == furthestPos) {
		chunk[2][chunkPos(pos)] = 21
		showPopup("Another piece of paper!", 10)
		chunk[0] = 0
		return
	}
	if (holding == 0 && chunk[2][chunkPos(pos)] == 0 && old == 13 && counters[14] == 0) {
		counters[14] = 1
		chunk[2][chunkPos(pos)] = 22
		showPopup("This seems to be old...", 10)
		chunk[0] = 0
		return
	}
	if ((oldData == neuData && boden.includes(old)) || item != 0) {
		let bodenItem = chunk[2][chunkPos(pos)]
		let a = holding
		let b = item
		let c = "-1"
		let neu = (craft[`${a}i${b}`] || craft[`${b}i${a}`]) || c
		if (neu != c) {
			let neuList = neu.split("i")
			holding = parseInt(neuList[0])
			bodenItem = parseInt(neuList[1])
			if (bodenItem == 16 && counters[10] == 0) {
				counters[10] = 1
				showPopup("chopped Wood?", 10)
			}
		} else if (item == 0) {
			bodenItem = holding
			holding = 0
			if (bodenItem == 11 && old == 1 && counters[6] == 0) {
				counters[6] = 1
				showPopup("The shovel slips over the Gras without making a dent", 10)
			} else if (oldData == "0g5" && counters[11] == 1 && counters[12] == 0 && counters[22] == 0) {
				counters[22] = 1
				bodenItem = 21
				showPopup("Oh, a piece of Paper.", 10)
			}
		} else if (holding == 0 && !notPickUp.includes(bodenItem)) {
			holding = item
			bodenItem = 0
			pickupActions(pos, holding)
		}
		chunk[2][chunkPos(pos)] = bodenItem
		chunk[0] = 0
		itemAction(pos, bodenItem)
		return
	}
	if (oldData != neuData) {
		lastAction = oldData
		let neuList = neuData.split("g")
		let neuGelände = parseInt(neuList[1])
		chunk[1][chunkPos(pos)] = neuGelände
		groundAction(pos, neuGelände)
		let neuItem = parseInt(neuList[0])
		if (holding == 0) {
			holding = neuItem
			if (holding == 1 && counters[7] == 0) {
				counters[7] = 1
				showPopup("This is supposed to be a berry?...\nNo, you can't eat it!!!", 10)
			}
		} else if (neuItem == 0) {
			holding = 0
		} else {
			chunk[2][chunkPos(pos)] = neuItem
			itemAction(pos, neuItem)
		}
		chunk[0] = 0
	}
}
function beere(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let x = -(a / 10); x < a / 10; x++) {
		for (let y = 0; y < a >> 1; y++) {
			let pos = cord(x + a >> 1, y, a)
			out[pos] = [0, 50, 0]
		}
	}
	for (let x = 0; x < a; x++) {
		for (let y = 0; y < a; y++) {
			let disX = abs(x - ((a - 1) >> 1)) ** 2
			let disY = abs(y - ((a - 1) >> 1)) ** 2
			if ((disX + disY) ** 0.5 < a * 0.3) {
				out[cord(x, y, a)] = [155, 0, 0]
			}
		}
	}
	return out
}
function stock(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	let krumm = 0
	for (let y = 0; y < a; y++) {
		krumm += ((~~(Math.random() * 3)) - 1)
		krumm = Math.min(Math.max(krumm, -(a / 3)), a / 3)
		for (let x = -(a >> 4); x < a >> 4; x++) {
			let pos = cord(x + (a >> 1) + krumm, y, a)
			out[pos] = [166, 94, 35]
		}
	}
	return out
}
function stein(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let x = 0; x < a; x++) {
		for (let y = 0; y < a; y++) {
			let disX = abs(x - ((a - 1) >> 1)) ** 2
			let disY = abs(y - ((a - 1) >> 1)) ** 2
			if ((disX + disY) ** 0.5 < a * 0.25) {
				out[cord(x, y, a)] = [100, 100, 100]
			}
		}
	}
	return out
}
function axt(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let y = a >> 4; y < a; y++) {
		for (let x = -(a >> 4); x < a >> 4; x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = [166, 94, 35]
		}
	}
	for (let y = a >> 4; y < a >> 2; y++) {
		for (let x = -(a >> 3); x < a >> 2; x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = [100, 100, 100]
		}
	}
	return out
}
function holz(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	let dunkel = Array(a).fill(0)
	for (let x = 0; x < a; x++) {
		dunkel[x] = Math.random() + 0.5
	}
	for (let x = 0; x < a; x++) {
		for (let y = 0; y < a; y++) {
			let disX = abs(x - ((a - 1) >> 1)) ** 2
			let disY = abs(y - ((a - 1) >> 1)) ** 2
			let dis = (disX + disY) ** 0.5
			if (dis < a * 0.4) {
				let b = dunkel[~~dis]
				out[cord(x, y, a)] = [166 * b, 94 * b, 35 * b]
			}
		}
	}
	return out
}
function nuss(a) {
	const pow = a ** 2
	let hell = 0.5
	let hülle = [166 * hell, 94 * hell, 35 * hell]
	let out = Array(pow).fill(0)
	let dunkel = Array(a).fill(0)
	for (let x = 0; x < a; x++) {
		dunkel[x] = Math.random() + 0.2
	}
	for (let x = ~~(a * 0.15); x < a; x++) {
		dunkel[x] = hell
	}
	for (let x = 0; x < a; x++) {
		for (let y = 0; y < a; y++) {
			let disX = abs(x - ((a - 1) >> 1)) ** 2
			let disY = abs(y - ((a - 1) >> 1)) ** 2
			let dis = (disX + disY) ** 0.5
			if (dis < a * 0.2) {
				let b = dunkel[~~dis]
				out[cord(x, y, a)] = [166 * b, 94 * b, 35 * b]
			}
		}
	}
	for (let y = ~~(a / 4); y < ~~(a * 0.68); y++) {
		for (let x = -~~(a / 30); x < ~~(a / 30); x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = hülle
		}
	}
	return out
}
function gras(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let x = 0; x < a; x++) {
		let farbe = ((Math.random() - 0.5) / 4) + 1
		for (let y = a - 1; y > -1 && Math.random() < 0.97; y--) {
			let pos = cord(x, y, a)
			out[pos] = [0, 150 * farbe + (Math.random() - 0.5) * 16, 0]
		}
	}
	return out
}
function seil(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let y = 0; y < a; y++) {
		for (let x = -(a >> 4); x < a >> 4; x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = [252, 186, 3]
		}
	}
	for (let x = 0; x < a; x++) {
		for (let y = 0; y < a; y++) {
			if ((x + y) % (a >> 2) == 0 && out[cord(x, y, a)] != 0) {
				out[cord(x, y, a)] = [112, 100, 66]
			}
		}
	}
	return out
}
function angel(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let x = a >> 4; x < a - (a >> 4); x++) {
		for (let y = a >> 4; y < a - (a >> 4); y++) {
			if (abs((x + y) - a) < a >> 3) {
				out[cord(x, y, a)] = [166, 94, 35]
			}
		}
	}
	for (let y = a >> 4; y < a - (a >> 3); y++) {
		for (let x = a - (a >> 3); x < a - (a >> 4); x++) {
			let pos = cord(x, y, a)
			out[pos] = [222, 222, 222]
		}
	}
	for (let y = a - (a >> 3); y < a; y++) {
		for (let x = a - (a >> 2); x < a; x++) {
			let pos = cord(x, y, a)
			out[pos] = [22, 22, 22]
		}
	}
	return out
}
function brett(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let x = a >> 2; x < a - (a >> 2); x++) {
		let farbe = ((Math.random() - 0.5) / 4) + 1
		for (let y = 0; y < a; y++) {
			let pos = cord(x, y, a)
			let all = (Math.random() - 0.5) * 16
			out[pos] = [166 * farbe + all, 94 * farbe + all, 35 * farbe + all]
		}
	}
	return out
}
function schaufel(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let y = a >> 4; y < a; y++) {
		for (let x = -(a >> 4); x < a >> 4; x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = [116, 44, 0]
		}
	}
	for (let y = a >> 4; y < a >> 1; y++) {
		for (let x = -~~(a / 5); x < a / 5; x++) {
			if (abs(x) < y) {
				let pos = cord(x + (a >> 1), y, a)
				out[pos] = [166, 94, 35]
			}
		}
	}
	return out
}
function erde(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	let size = a >> 2
	let amount = a >> 1
	for (let i = 0; i < amount; i++) {
		let centerX = ~~(Math.random() * (a - (size << 1))) + size
		let centerY = ~~(Math.random() * (a - (size << 1))) + size
		for (let x = -size; x < size; x++) {
			for (let y = -size; y < size; y++) {
				let dis = (x ** 2 + y ** 2) * 0.5
				if (dis < size) {
					let pos = cord(centerX + x, centerY + y, a)
					out[pos] = [116, 44, 0]
				}
			}
		}
	}
	for (let x = 0; x < a; x++) {
		for (let y = 0; y < a; y++) {
			let pos = cord(x, y, a)
			if (out[pos] != 0 && Math.random() < 0.025) {
				out[pos] = [125, 125, 125]
			}
		}
	}
	return out
}
function angelSchatz(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	let size = a >> 2
	let amount = a >> 4
	for (let i = 0; i < amount; i++) {
		let centerX = ~~(Math.random() * (a - (size << 1))) + size
		let centerY = ~~(Math.random() * (a - (size << 1))) + size
		for (let x = -size; x < size; x++) {
			for (let y = -size; y < size; y++) {
				let dis = (x ** 2 + y ** 2) * 0.5
				if (abs(dis - size) < a >> 4) {
					let pos = cord(centerX + x, centerY + y, a)
					out[pos] = [222, 222, 222]
				}
			}
		}
	}
	for (let x = 0; x < a; x++) {
		for (let y = 0; y < a; y++) {
			let pos = cord(x, y, a)
			if (Math.random() < 0.001) {
				out[pos] = [222, 222, 222]
			}
		}
	}
	return out
}
function schuh(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let y = a >> 1; y < a; y++) {
		for (let x = -(a >> 3); x < a >> 3; x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = [48, 39, 58]
		}
	}
	for (let y = ~~(a / 3); y < a >> 1; y++) {
		for (let x = -~~(a / 6); x < a / 6; x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = [32, 24, 40]
		}
	}
	for (let y = ~~(a * 0.8); y < a; y++) {
		for (let x = 0; x < a >> 1; x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = [48, 39, 58]
		}
	}
	for (let y = ~~(a * 0.95); y < a; y++) {
		for (let x = -(a >> 3); x < a >> 1; x++) {
			let pos = cord(x + (a >> 1), y, a)
			out[pos] = [0, 0, 0]
		}
	}
	return out
}
function fisch(a) {
	const pow = a ** 2
	let centerX = ~~(a * 0.85)
	let centerY = (a >> 1) - ~~(((a >> 1) - abs(centerX - (a >> 1))) ** 0.75)
	let out = Array(pow).fill(0)
	for (let x = 0; x < a; x++) {
		for (let y = -~~(((a >> 1) - abs(x - (a >> 1))) ** 0.75); y < ((a >> 1) - abs(x - (a >> 1))) ** 0.75; y++) {
			let pos = cord(x, y + (a >> 1), a)
			if (y > 0) {
				out[pos] = [62 + y * (a >> 1), 219 - y * (a >> 3), 224 - y * (a >> 3)]
			} else {
				out[pos] = [62, 219, 224]
			}
		}
	}
	for (let x = 0; x < a >> 1; x++) {
		for (let y = -abs((a >> 1) - x) >> 1; y < abs((a >> 1) - x) >> 1; y++) {
			let pos = cord(x, y + (a >> 1), a)
			out[pos] = [62, 219, 224]
		}
	}
	for (let x = ~~(a * 0.88); x < a; x++) {
		let pos = cord(x, a >> 1, a)
		out[pos] = [0, 0, 0]
	}
	let size = Math.max(a >> 5, 2)
	for (let x = -size; x < size; x++) {
		for (let y = -size; y < size; y++) {
			let dis = (x ** 2 + y ** 2) * 0.5
			if (dis <= size) {
				let pos = cord(centerX + x, centerY + y, a)
				out[pos] = [0, 0, 0]
			}
		}
	}
	return out
}
function dreiStäbe(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let x = ~~(1 * (a / 7)); x < ~~(2 * (a / 7)); x++) {
		let farbe = ((Math.random() - 0.5) / 4) + 1
		for (let y = 0; y < a; y++) {
			let pos = cord(x, y, a)
			let all = (Math.random() - 0.5) * 16
			out[pos] = [166 * farbe + all, 94 * farbe + all, 35 * farbe + all]
		}
	}
	for (let x = ~~(3 * (a / 7)); x < ~~(4 * (a / 7)); x++) {
		let farbe = ((Math.random() - 0.5) / 4) + 1
		for (let y = 0; y < a; y++) {
			let pos = cord(x, y, a)
			let all = (Math.random() - 0.5) * 16
			out[pos] = [166 * farbe + all, 94 * farbe + all, 35 * farbe + all]
		}
	}
	for (let x = ~~(5 * (a / 7)); x < ~~(6 * (a / 7)); x++) {
		let farbe = ((Math.random() - 0.5) / 4) + 1
		for (let y = 0; y < a; y++) {
			let pos = cord(x, y, a)
			let all = (Math.random() - 0.5) * 16
			out[pos] = [166 * farbe + all, 94 * farbe + all, 35 * farbe + all]
		}
	}
	return out
}
function zweiStäbe(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let x = ~~(1 * (a / 7)); x < ~~(2 * (a / 7)); x++) {
		let farbe = ((Math.random() - 0.5) / 4) + 1
		for (let y = 0; y < a; y++) {
			let pos = cord(x, y, a)
			let all = (Math.random() - 0.5) * 16
			out[pos] = [166 * farbe + all, 94 * farbe + all, 35 * farbe + all]
		}
	}
	for (let x = ~~(3 * (a / 7)); x < ~~(4 * (a / 7)); x++) {
		let farbe = ((Math.random() - 0.5) / 4) + 1
		for (let y = 0; y < a; y++) {
			let pos = cord(x, y, a)
			let all = (Math.random() - 0.5) * 16
			out[pos] = [166 * farbe + all, 94 * farbe + all, 35 * farbe + all]
		}
	}
	return out
}
function stab(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let x = ~~(3 * (a / 7)); x < ~~(4 * (a / 7)); x++) {
		let farbe = ((Math.random() - 0.5) / 4) + 1
		for (let y = 0; y < a; y++) {
			let pos = cord(x, y, a)
			let all = (Math.random() - 0.5) * 16
			out[pos] = [166 * farbe + all, 94 * farbe + all, 35 * farbe + all]
		}
	}
	return out
}
function text(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let y = 0; y < a; y++) {
		for (let x = a >> 3; x < a - (a >> 3); x++) {
			let pos = cord(x, y, a)
			out[pos] = [222, 222, 222]
		}
	}
	for (let z = a >> 3; z < a - (a >> 3); z += a >> 3) {
		for (let x = ~~(a / 6); x < a - (a / 6); x++) {
			for (let y = -Math.max((a >> 5), 1); y < Math.max(a >> 5, 1); y++) {
				if (out[cord(x, y + (a >> 1) + z, a)] != 0) {
					out[cord(x, y + (a >> 1) + z, a)] = [22, 22, 22]
				}
			}
		}
	}
	return out
}
function landkarte(a) {
	let geländeFarben = [
		[0, 0, 255], [0, 0, 255], [0, 0, 255], [0, 150, 0], [0, 150, 0], [75, 75, 75], [0, 0, 175], [255, 204, 0]
	]
	const pow = a ** 2
	let out = Array(pow).fill([235, 234, 171])
	for (let y = a >> 5; y < a - (a >> 5); y++) {
		for (let x = a >> 5; x < a - (a >> 5); x++) {
			let pos = cord(x, y, a)
			out[pos] = geländeFarben[~~(Math.random() * geländeFarben.length)]
		}
	}
	return out
}
function zettel(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let y = 0; y < a >> 2; y++) {
		for (let x = -y; x < y; x++) {
			let pos = cord(x + a >> 1, y + a >> 1, a)
			out[pos] = [222, 222, 222]
		}
	}
	return out
}
function buch(a) {
	const pow = a ** 2
	let out = Array(pow).fill(0)
	for (let y = a >> 5; y < a - (a >> 5); y++) {
		for (let x = a >> 3; x < a - (a >> 3); x++) {
			let pos = cord(x, y, a)
			hell = (Math.random() - 0.5) * 30
			out[pos] = [136 + hell, 64 + hell, 20 + hell]
		}
	}
	for (let x = ~~(a / 6); x < a - (a / 6); x++) {
		for (let y = -Math.max((a >> 5), 1); y < Math.max(a >> 5, 1); y++) {
			let z = -(a >> 2)
			out[cord(x, y + (a >> 1) + z, a)] = [22, 22, 22]
			if (Math.random() < 0.3) {
				out[cord(x, y + (a >> 1) + z, a)] = [116, 44, 0]
			}
		}
	}
	return out
}
function texture(scale) {
	let itemTextur = [
		beere, stock, stein,
		axt, holz, nuss,
		gras, seil, angel,
		brett, schaufel, erde,
		angelSchatz, schuh, fisch,
		dreiStäbe, zweiStäbe, stab,
		text, landkarte, zettel,
		buch
	]
	let out = []
	for (let x = 0; x < itemTextur.length; x++) {
		out.push(itemTextur[x](scale))
	}
	return out
}
function liegendeBeere(pos, time) {
	let chunk = chunks[chunkInd(pos)]
	if (chunk[2][chunkPos(pos)] == 1 && chunk[1][chunkPos(pos)] == 1) {
		if (time >= 6 && playerPos != pos) {
			chunk[2][chunkPos(pos)] = 0
			chunk[1][chunkPos(pos)] = 11
			updateScreen = true
			chunk[0] = 0
			return [pos, 0, 1]
		} else {
			return [pos, time + 1, 0]
		}
	}
	return 0
}
function wachseBusch(pos, time) {
	let chunk = chunks[chunkInd(pos)]
	if (chunk[1][chunkPos(pos)] == 11) {
		if (time >= 4 && playerPos != pos) {
			chunk[1][chunkPos(pos)] = 9
			updateScreen = true
			chunk[0] = 0
			return [pos, 0, 2]
		} else {
			if (Math.random() < 0.8) {
				return [pos, time + 1, 1]
			} else {
				chunk[1][chunkPos(pos)] = 1
				updateScreen = true
				chunk[0] = 0
			}
		}
	}
	return 0
}
function wachseBeeren(pos, time) {
	let chunk = chunks[chunkInd(pos)]
	if (chunk[1][chunkPos(pos)] == 9) {
		if (time >= 3 && playerPos != pos) {
			chunk[1][chunkPos(pos)] = 7
			updateScreen = true
			chunk[0] = 0
		} else {
			return [pos, time + 1, 2]
		}
	}
	return 0
}
function liegendeNuss(pos, time) {
	let chunk = chunks[chunkInd(pos)]
	if (chunk[2][chunkPos(pos)] == 6 && chunk[1][chunkPos(pos)] == 1) {
		if (time >= 6 && playerPos != pos) {
			chunk[2][chunkPos(pos)] = 0
			chunk[1][chunkPos(pos)] = 10
			updateScreen = true
			chunk[0] = 0
			return [pos, 0, 4]
		} else {
			return [pos, time + 1, 3]
		}
	}
	return 0
}
function wachseBaum(pos, time) {
	let chunk = chunks[chunkInd(pos)]
	if (chunk[1][chunkPos(pos)] == 10) {
		if (time >= 8 && playerPos != pos) {
			chunk[1][chunkPos(pos)] = 8
			updateScreen = true
			chunk[0] = 0
		} else {
			if (Math.random() < 0.95) {
				return [pos, time + 1, 4]
			} else {
				chunk[1][chunkPos(pos)] = 1
				updateScreen = true
				chunk[0] = 0
			}
		}
	}
	return 0
}
function wachseGras(pos, time) {
	let chunk = chunks[chunkInd(pos)]
	if (chunk[1][chunkPos(pos)] == 12) {
		if (time >= 4 && playerPos != pos) {
			chunk[1][chunkPos(pos)] = 1
			updateScreen = true
			chunk[0] = 0
		} else {
			let nebenGras = false
			for (let x = 0; x < 4; x++) {
				let testPos = posRich(pos, x, weltKante)
				if (chunks[chunkInd(testPos)][1][chunkPos(testPos)] == 1) {
					nebenGras = true
				}
			}
			if (nebenGras) {
				return [pos, time + 1, 5]
			} else {
				return [pos, 0, 5]
			}
		}
	}
	return 0
}
function liegendesGras(pos, time) {
	let chunk = chunks[chunkInd(pos)]
	if (chunk[2][chunkPos(pos)] == 7 && (chunk[1][chunkPos(pos)] == 1 || chunk[1][chunkPos(pos)] == 12)) {
		if (time >= 5 && playerPos != pos) {
			chunk[2][chunkPos(pos)] = 0
			chunk[1][chunkPos(pos)] = 1
			updateScreen = true
			chunk[0] = 0
		} else {
			return [pos, time + 1, 6]
		}
	}
	return 0
}
function speicherErinnerung(pos, time) {
	if (counters[1] == 0) {
		if (time >= 40) {
			showPopup("Don't forget to save your progress.\nHint:\nthe Buttons for that can be found below.", 10)
		} else {
			return [pos, time + 1, 7]
		}
	}
	return 0
}
function liegenderAngelschatz(pos) {
	setTimeout(function () {
		let chunk = chunks[chunkInd(pos)]
		if (chunk[2][chunkPos(pos)] == 13) {
			if (counters[2] + counters[3] + counters[8] > 0) {
				let zufall = ~~(Math.random() * (counters[2] + counters[3] + counters[8]))
				if (zufall < counters[2]) {
					counters[2]--
					chunk[2][chunkPos(pos)] = 14
				} else if (zufall < counters[2] + counters[3]) {
					counters[3]--
					chunk[2][chunkPos(pos)] = 15
				} else {
					counters[8]--
					chunk[2][chunkPos(pos)] = 20
				}
			} else {
				chunk[2][chunkPos(pos)] = 15
			}
			updateScreen = true
			chunk[0] = 0
		}
	}, 500)
	return 0
}
function itemAction(pos, item) {
	let actions = [
		liegendeBeere, liegendeNuss, liegendesGras, liegenderAngelschatz
	]
	let actionedItems = [1, 6, 7, 13]
	if (actionedItems.includes(item)) {
		let result = actions[actionedItems.indexOf(item)](pos, 0)
		if (result != 0) {
			waitingStuff.push(result)
		}
	}
}
function grubeGraben() {
	if (counters[5] == 0) {
		counters[5] = 1
		showPopup("This Hole is so deep, most stuff just gets lost in it.", 10)
	}
	return 0
}
function groundAction(pos, ground) {
	let actions = [
		wachseBeeren, wachseGras, grubeGraben
	]
	let actionedGrounds = [9, 12, 13]
	if (actionedGrounds.includes(ground)) {
		let result = actions[actionedGrounds.indexOf(ground)](pos, 0)
		if (result != 0) {
			waitingStuff.push(result)
		}
	}
}
function schuhAnziehen() {
	holding = 0
	walkSpeed = 150
	counters[4] = 1
	showPopup("SPEED BUFF!", 10)
	return 0
}
function textLesen() {
	holding = 0
	counters[11] = 1
	letter(["Oh, a Letter!\nwhat? why did ir escape into Donwloads?", 10], `Hi,
nice you give this Game a try! Explore a generated World and solve fun riddles.
You can interact with your enviroment by clicking. In fact, you only need to click.
For a better experience, go into full Screen by clicking F11. Don't forget to save your Progress from time to time.
\"No Backup, no mercy\"
In case you are able to find a Bug, you can report it to me :)

derBohrman`, "intro.txt")
	return 0
}
function kartenDownload() {
	holding = 0
	showPopup("nice map", 10)
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')
	const image = context.createImageData(weltKante, weltKante)
	canvas.width = weltKante
	canvas.height = weltKante
	for (let x = 0; x < map.length; x++) {
		const chunk = chunks[chunkInd(x)]
		const überWasser = ~~(chunk[4][chunkPos(x)] > 0)
		const höhe = chunk[3][chunkPos(x)]
		const pixel = x << 2
		if (überWasser) {
			const helligkeit = ~~((höhe - counters[9]) * (100 / (100 - counters[9])) * 2.55)
			image.data[pixel] = helligkeit
			image.data[pixel + 1] = helligkeit
			image.data[pixel + 2] = helligkeit
		} else {
			image.data[pixel] = 0
			image.data[pixel + 1] = 0
			image.data[pixel + 2] = ~~(höhe * (100 / counters[9]) * 2.55)
		}
		image.data[pixel + 3] = 255
	}
	const redPixel = furthestPos << 2
	image.data[redPixel] = 255
	image.data[redPixel + 1] = 0
	image.data[redPixel + 2] = 0
	context.putImageData(image, 0, 0)
	const dataUrl = canvas.toDataURL('image/png')
	const link = document.createElement('a')
	link.href = dataUrl
	link.download = 'worldMap.png'
	link.click()
	return 0
}
function sandZettel() {
	holding = 0
	if (counters[12] == 0) {
		counters[12] = 1
		letter(["What is written there?", 10], "011110111000101000001010001001011010010100000100000000100100100110000010011010010111000100000000010101001011100010100000101000111101100011000010100000100110000100011010000010100000000000001010010000011010100011010000010101110000000000100010001011001000000100111000000101010010001101000001011001010000011000000110100110100000000000010100010110100110101010000000001100010101000011000010101110000000111010101100100000001110011110001101000000001101000001010000110000101011100000001101010011010000000101010111000101011100010001100010010001101000000001101001001001100011000101100100111000000101010110100000001010100101110001010111000000000100010101100010010010100010001110010101110000001010000101110001010000000001010100000101100100000010101011101001101001000110100000101100100000011010101010000000011011110010001001001011001000101011100000000000001011001001000000010110010100001010000001011000011001010100001010000000100101011001000011010000000000001011100011100101011000000000000100111000110010101000000001101", "paper_1.txt")
	} else {
		counters[13] = 1
		letter(["Another one?!", 10], "JKHJFZGGPSIGQMMAGRQTFU", "paper_2.txt")
	}
	return 0
}
function chroniken() {
	holding = 0
	letter(["an old Book?", 10], `Breadth-First Search (BFS) is one of the most fundamental algorithms in computer science, particularly in the domain of graph theory. It is used to traverse or search through graph data structures in a systematic way. Unlike Depth-First Search (DFS), which goes as deep as possible before backtracking, BFS explores all the neighbor nodes at the present depth prior to moving on to nodes at the next depth level.

How BFS Works

BFS uses a queue to keep track of the next location to visit. It starts at a chosen source node and visits all its immediate neighbors before moving to the neighbors of those neighbors. This level-by-level approach makes it very useful for finding the shortest path in unweighted graphs.

Step-by-step:
1. Start with the root node (or any arbitrary node as the starting point).
2. Enqueue the root node and mark it as visited.
3. Dequeue a node from the front of the queue.
4. For each unvisited adjacent node, mark it as visited and enqueue it.
5. Repeat steps 3 and 4 until the queue is empty.

Time and Space Complexity

The time complexity of BFS is O(V + E), where V is the number of vertices and E is the number of edges in the graph. This is because every vertex and every edge will be explored in the worst case. The space complexity is also O(V), as the queue may hold all the vertices in the worst case.`, "book.txt")
	return 0
}
function pickupActions(pos, item) {
	let actions = [
		schuhAnziehen, textLesen, kartenDownload,
		sandZettel, chroniken
	]
	let actionedItems = [14, 19, 20, 21, 22]
	if (actionedItems.includes(item)) {
		let result = actions[actionedItems.indexOf(item)](pos, 0)
		if (result != 0) {
			waitingStuff.push(result)
		}
	}
}
function createChunks(generated, weltItems) {
	const weltHöhen = generated[0]
	const inselPointer = generated[1]
	const inseln = generated[2]
	const chunkGröße = chunkKante ** 2
	const chunkMenge = (weltKante / chunkKante) ** 2
	let chunkData = Array(chunkMenge)
	for (let chunkIndex = 0; chunkIndex < chunkData.length; chunkIndex++) {
		let chunkBodenTyp = Array(chunkGröße).fill(0)
		let chunkHöhen = Array(chunkGröße).fill(0)
		let chunkItems = Array(chunkGröße).fill(0)
		let inselRef = Array(chunkGröße).fill(0)
		const xChunkNull = chunkIndex % kant(chunkData) * chunkKante
		const yChunkNull = ~~(chunkIndex / kant(chunkData)) * chunkKante
		for (let x = 0; x < chunkKante; x++) {
			for (let y = 0; y < chunkKante; y++) {
				const chunkPosistion = cord(x, y, chunkKante)
				const weltPos = cord(x + xChunkNull, y + yChunkNull, weltKante)
				chunkHöhen[chunkPosistion] = weltHöhen[weltPos]
				chunkItems[chunkPosistion] = weltItems[weltPos]
				inselRef[chunkPosistion] = inselPointer[weltPos]
				if (inselRef[chunkPosistion]) {
					const insel = inseln[inselPointer[weltPos] - 1]
					const xInselNull = insel[5][0]
					const yInselNull = insel[5][1]
					const inselKante = insel[5][2]
					const weltX = weltPos % weltKante
					const weltY = ~~(weltPos / weltKante)
					const inselPos = cord(weltX - xInselNull, weltY - yInselNull, inselKante)
					chunkBodenTyp[chunkPosistion] = insel[7][inselPos]
				}
			}
		}
		chunkData[chunkIndex] = []
		chunkData[chunkIndex].push(0)
		chunkData[chunkIndex].push(chunkBodenTyp)
		chunkData[chunkIndex].push(chunkItems)
		chunkData[chunkIndex].push(chunkHöhen)
		chunkData[chunkIndex].push(inselRef)
	}
	return chunkData
}
function furthestAway(pos) {
	let tested = Array(weltKante).fill(false)
	tested[pos] = 0
	let changed = [pos]
	while (changed.length > 0) {
		let neu = []
		for (let x = 0; x < changed.length; x++) {
			for (let y = 0; y < 4; y++) {
				let neuPos = posRich(changed[x], y, weltKante)
				if (!tested[neuPos] && boden.includes(chunks[chunkInd(neuPos)][1][chunkPos(neuPos)])) {
					tested[neuPos] = true
					furthestPos = neuPos
					neu.push(neuPos)
				}
			}
		}
		changed = neu
	}
}
let map, tagged, inseln, NN, weltGröße, weltKante, playerPos, xPlayerOff, yPlayerOff, holding, walkable, allItems, textures, chunks, counters, waitingStuff, lastAction
function main() {
	const generated = generate(90, 2)
	console.log(c.width, c.height)
	stop("generieren")
	map = generated[0]
	tagged = generated[1]
	inseln = generated[2]
	NN = generated[3]
	weltGröße = map.length
	weltKante = weltGröße ** 0.5
	allItems = Array(map.length).fill(0)
	playerPos = findStart(inseln, map)
	xPlayerOff = 0
	yPlayerOff = 0
	holding = 0
	walkable = true
	textures = texture(scale)
	lastAction = `${textures.length}g0`
	chunks = createChunks(generated, allItems)
	furthestAway(playerPos)
	stop("chunks")
	counters = Array(23).fill(0)
	counters[2] = 1
	counters[3] = 18
	counters[8] = 1
	counters[9] = NN
	counters[15] = chunks[chunkInd(playerPos)][4][chunkPos(playerPos)]
	counters[21] = furthestPos
	timedFunctions = [
		liegendeBeere, wachseBusch, wachseBeeren,
		liegendeNuss, wachseBaum, wachseGras,
		liegendesGras, speicherErinnerung
	]
	waitingStuff = [[0, 0, 7]]
	setInterval(function () {
		let neu = []
		for (let x = 0; x < waitingStuff.length; x++) {
			let funcVals = waitingStuff[x]
			let neuWerte = timedFunctions[funcVals[2]](funcVals[0], funcVals[1])
			if (neuWerte != 0) {
				neu.push(neuWerte)
			}
		}
		waitingStuff = neu
	}, 15 * (1000))
	requestAnimationFrame(male)
}
c.addEventListener('click', async function (event) {
	const width = c.width
	const height = c.height
	const widthOff = (chunkKante - (width / scale)) * scale * 0.5
	const heightOff = (chunkKante - (height / scale)) * scale * 0.5
	let rect = c.getBoundingClientRect()
	let scaleX = c.width / rect.width
	let scaleY = c.height / rect.height
	let clickX = (event.clientX - rect.left) * scaleX + widthOff
	let clickY = (event.clientY - rect.top) * scaleY + heightOff
	let x = ~~((clickX + xPlayerOff) / scale)
	let y = ~~((clickY + yPlayerOff) / scale)
	if (0 <= x && x < chunkKante && 0 <= y && y < chunkKante) {
		const halfChunk = chunkKante >> 1
		const xOffset = (playerPos % weltKante) - halfChunk
		const yOffset = (~~(playerPos / weltKante)) - halfChunk
		let pos = cord(x + xOffset, y + yOffset, weltKante)
		let xDif = x - halfChunk
		let yDif = y - halfChunk
		function abbruchAnimation() {
			return new Promise((resolve) => {
				let stopper = setTimeout(function () {
					clearInterval(interruptId)
					clearInterval(walkId)
					resolve()
				}, walkSpeed)
				interrupt(resolve, stopper)
			})
		}
		try {
			await abbruchAnimation()
		} catch (error) {
			console.log(error)
		}
		let a = holding
		let b = chunks[chunkInd(pos)][1][chunkPos(pos)]
		let anweisung = `${a}g${b}`
		if (x == halfChunk && y == halfChunk) {
			walkable = !walkable
			updateScreen = true
		} else if (abs(xDif) + abs(yDif) < 2 && !walkable) {
			changeBlock((xDif & 2) + yDif + 1)
		} else if (!walkable && lastAction == anweisung && chunks[chunkInd(pos)][2][chunkPos(pos)] == 0) {
			let way = findWay(playerPos, pos)
			let imaginPos = playerPos
			for (let i = 0; i < way.length; i++) {
				imaginPos = posRich(imaginPos, way[i], weltKante)
			}
			if (imaginPos == pos) {
				let lastInd = way.length - 1
				if (way[lastInd] < 4) {
					imaginPos = posRich(imaginPos, way.pop() ^ 2, weltKante)
				} else {
					let direction = way.pop()
					let firstOption = direction - 4
					let secondOption = (firstOption + 1) % 4
					imaginPos = posRich(imaginPos, firstOption ^ 2, weltKante)
					way.push(secondOption)
				}
			}
			let xImaginPos = imaginPos % weltKante
			let yImaginPos = ~~(imaginPos / weltKante)
			let xPos = pos % weltKante
			let yPos = ~~(pos / weltKante)
			let xPlayer = playerPos % weltKante
			let yPlayer = ~~(playerPos / weltKante)
			if (abs(xImaginPos - xPos) + abs(yImaginPos - yPos) == 1) {
				walk(way, () => changeBlock(((xPos - xImaginPos) & 2) + (yPos - yImaginPos) + 1))
			} else if (abs(xPlayer - xPos) + abs(yPlayer - yPos) > 2) {
				walk(way)
			}
		} else {
			let extraAction = 0
			let way = findWay(playerPos, pos)
			if (!walkable) {
				let imaginPos = playerPos
				for (let i = 0; i < way.length; i++) {
					imaginPos = posRich(imaginPos, way[i], weltKante)
				}
				if (chunks[chunkInd(imaginPos)][2][chunkPos(imaginPos)] != 0 && imaginPos == pos) {
					let lastInd = way.length - 1
					if (way[lastInd] < 4) {
						extraAction = way.pop()
					} else {
						let direction = way.pop()
						let firstOption = direction - 4
						let secondOption = (firstOption + 1) % 4
						extraAction = firstOption
						way.push(secondOption)
					}
					walk(way, () => changeBlock(extraAction))
					return
				} else if (chunks[chunkInd(pos)][2][chunkPos(pos)] != 0) {
					let xImaginPos = imaginPos % weltKante
					let yImaginPos = ~~(imaginPos / weltKante)
					let xPos = pos % weltKante
					let yPos = ~~(pos / weltKante)
					if (abs(xImaginPos - xPos) + abs(yImaginPos - yPos) == 1) {
						walk(way, () => changeBlock(((xPos - xImaginPos) & 2) + (yPos - yImaginPos) + 1))
						return
					}
				}
			}
			walk(way)
		}
	}
})
document.addEventListener("keydown", async function (event) {
	if (!tastenEingabe) {
		tastenEingabe = true
		function abbruchAnimation() {
			return new Promise((resolve) => {
				let stopper = setTimeout(function () {
					clearInterval(interruptId)
					clearInterval(walkId)
					resolve()
				}, walkSpeed)
				interrupt(resolve, stopper)
			})
		}
		let destination = -1
		switch (event.key) {
			case "w":
				destination = 0
				break
			case "a":
				destination = 3
				break
			case "s":
				destination = 2
				break
			case "d":
				destination = 1
				break
			case "e":
				try {
					await abbruchAnimation()
				} catch (error) {
					console.log(error)
				}
				walkable = !walkable
				updateScreen = true
				break
		}
		if (destination != -1) {
			try {
				await abbruchAnimation()
			} catch (error) {
				console.log(error)
			}
			if (walkable) {
				let neuPos = posRich(playerPos, destination, weltKante)
				if (boden.includes(bodenTyp(neuPos))) {
					walk([destination])
				}
			} else {
				changeBlock(destination)
			}
		}
		tastenEingabe = false
	}
})
function triggerFileUpload() {
	const fileInput = document.getElementById('fileUpload')
	fileInput.value = null
	fileInput.click()
}
document.getElementById('fileUpload').addEventListener('change', function (event) {
	const file = event.target.files[0]
	if (file && file.type === 'application/json') {
		const reader = new FileReader()
		reader.onload = function (e) {
			const jsonContent = e.target.result
			try {
				let fehler = ""
				let abbrechen = false
				const parsedData = JSON.parse(jsonContent)
				if (parsedData.length != 4) {
					throw new Error("Weird data, wrong amount of data!")
				}
				let neuChunks = parsedData[0]
				if (neuChunks instanceof Array) {
					let chunksDif = abs(chunks.length - neuChunks.length)
					if (neuChunks.length < chunks.length) {
						fehler += `\ntotal of ${chunksDif} missing chunks`
						abbrechen = true
					} else if (chunks.length < neuChunks.length) {
						fehler += `\n${chunksDif} chunks too much`
						neuChunks.splice(-chunksDif)
					}
					for (let x = 0; x < neuChunks.length; x++) {
						let chunk = neuChunks[x]
						if (!(chunk instanceof Array) || chunk.length != 5) {
							fehler += `\nChunk ${x} has too much data (${chunk.length} instead of 5)`
							abbrechen = true
							continue
						}
						if (chunk[0] != 0) {
							fehler += `\nChunk ${x} has data where it shouldn't.`
							chunk[0] = 0
						}
						if (chunk[1] instanceof Array) {
							if (chunk[1].length != chunkKante ** 2) {
								fehler += `\nChunk ${x} has too much ground pieces (${chunk[1].length} instead of ${chunkKante ** 2})`
								abbrechen = true
							}
							for (let y = 0; y < Math.min(chunk[1].length, chunkKante ** 2); y++) {
								if (Number.isFinite(chunk[1][y])) {
									if (~~chunk[1][y] != chunk[1][y] || chunk[1][y] >= color.length || chunk[1][y] < 0) {
										fehler += `\nChunk ${x} has unknown ground type ${y}: ${chunk[1][y]}`
										abbrechen = true
									}
								} else {
									fehler += `\nChunk ${x} has unreadable ground type at ${y}`
									abbrechen = true
								}
							}
						} else {
							fehler += `\nChunk ${x} has no ground`
							abbrechen = true
						}
						if (chunk[2] instanceof Array) {
							if (chunk[2].length != chunkKante ** 2) {
								fehler += `\nChunk ${x} doesn't has the right amount of Items (${chunk[2].length} instead of ${chunkKante ** 2})`
								abbrechen = true
							}
							for (let y = 0; y < Math.min(chunk[2].length, chunkKante ** 2); y++) {
								if (Number.isFinite(chunk[2][y])) {
									if (~~chunk[2][y] != chunk[2][y] || chunk[2][y] > textures.length || chunk[2][y] < 0) {
										fehler += `\nChunk ${x} has unknown item at ${y}: ${chunk[2][y]}`
										chunk[2][y] = 0
									}
								} else {
									fehler += `\nChunk ${x} has unreadable item at ${y}`
									chunk[2][y] = 0
								}
							}
						} else {
							fehler += `\nChunk ${x} has no readable itemvalues`
							abbrechen = true
						}
						if (chunk[3] instanceof Array) {
							if (chunk[3].length != chunkKante ** 2) {
								fehler += `\nChunk ${x} has wrong amount of depths (${chunk[3].length} instead of ${chunkKante ** 2})`
								abbrechen = true
							}
							for (let y = 0; y < Math.min(chunk[3].length, chunkKante ** 2); y++) {
								if (Number.isFinite(chunk[3][y])) {
									if (chunk[3][y] > 100 || chunk[3][y] < 0) {
										fehler += `\nChunk ${x} is too high at ${y}: ${chunk[3][y]}`
										chunk[3][y] = Math.max(Math.min(chunk[3][y], 100), 0)
									}
								} else {
									fehler += `\nChunk ${x} has unreadable hight at ${y}`
									abbrechen = true
								}
							}
						} else {
							fehler += `\nChunk ${x} has no readable depths`
							abbrechen = true
						}
						if (chunk[4] instanceof Array) {
							if (chunk[4].length != chunkKante ** 2) {
								fehler += `\nChunk ${x} wrong amount of land indicators (${chunk[4].length} instead of ${chunkKante ** 2})`
								abbrechen = true
							}
							for (let y = 0; y < Math.min(chunk[4].length, chunkKante ** 2); y++) {
								if (Number.isFinite(chunk[4][y])) {
									if (!(chunk[4][y] >= 0 && ~~chunk[4][y] == chunk[4][y])) {
										fehler += `\nChunk ${x} has no integer Value at ${y}: ${chunk[4][y]}`
										abbrechen = true
									}
								} else {
									fehler += `\nChunk ${x} has unreadable land value at ${y}`
									abbrechen = true
								}
							}
						} else {
							fehler += `\nChunk ${x} has no land values`
							abbrechen = true
						}
					}
				} else {
					fehler += `\nChunks not readable`
					abbrechen = true
				}
				let neuWaitingStuff = parsedData[1]
				if (neuWaitingStuff instanceof Array) {
					for (let x = 0; x < neuWaitingStuff.length; x++) {
						let warte = neuWaitingStuff[x]
						if (warte instanceof Array && warte.length == 3) {
							if (!(Number.isFinite(warte[0]) && ~~warte[0] == warte[0] && warte[0] < map.length && warte[0] >= 0)) {
								fehler += `\nwaitingdata ${x} has weird position`
								neuWaitingStuff.splice(x, 1)
								x--
							} else if (!(Number.isFinite(warte[1]) && warte[1] >= 0)) {
								fehler += `\nwaitindata ${x} has weird time`
								warte[1] = 0
							} else if (!(Number.isFinite(warte[2]) && ~~warte[2] == warte[2] && warte[2] < timedFunctions.length && warte[2] >= 0)) {
								fehler += `\nwaitingdata ${x} has weird function`
								neuWaitingStuff.splice(x, 1)
								x--
							}
						} else {
							fehler += `\nwaitingdata ${x} is weird: ${warte}`
							neuWaitingStuff.splice(x, 1)
							x--
						}
					}
				} else {
					fehler += `\nwaitingdata not readable`
					neuWaitingStuff = []
				}
				let neuCounters = parsedData[2]
				if (neuCounters instanceof Array) {
					if (neuCounters.length == counters.length) {
						for (let x = 0; x < neuCounters.length; x++) {
							let counter = neuCounters[x]
							if (!(Number.isFinite(counter) && ~~counter == counter && counter >= 0)) {
								fehler += `\ncount at ${x} has weird value`
								neuCounters[x] = 0
							}
						}
					} else if (neuCounters.length < counters.length) {
						fehler += `\nmissing counters`
						neuCounters.push(...Array(counters.length - neuCounters.length).fill(0))
					} else {
						fehler += `\ntoo much counters`
						neuCounters.splice(counters.length - neuCounters.length)
					}
				} else {
					fehler += `\ncounterdata not readable`
					neuCounters = Array(counters.length).fill(0)
				}
				let neuPlayerpos = parsedData[3]
				if (!(Number.isFinite(neuPlayerpos) && ~~neuPlayerpos == neuPlayerpos && neuPlayerpos >= 0 && neuPlayerpos < map.length)) {
					fehler += `\nplayerposition unreadable`
					abbrechen = true
				}
				if (abbrechen) {
					throw new Error(fehler)
				} else {
					chunks = neuChunks
					counters = neuCounters
					waitingStuff = neuWaitingStuff
					playerPos = neuPlayerpos
					updateScreen = true
					programmStart = Date.now()
					clearInterval(walkId)
					clearInterval(interruptId)
					xPlayerOff = 0
					yPlayerOff = 0
					holding = counters[17]
					lastAction = `${counters[19]}g${counters[18]}`
					walkable = !!counters[20]
					furthestPos = counters[21]
					if (furthestPos == 0) {
						furthestAway(playerPos)
						counters[21] = furthestPos
					}
					NN = counters[9]
					if (counters[4]) {
						walkSpeed = 150
					} else {
						walkSpeed = 200
					}
					if (fehler != "") {
						showPopup("Data accepted, BUT:" + fehler, 10)
					}
				}
			} catch (error) {
				showPopup('The Json seems to be broken!\n' + error.message, 20)
			}
		}
		reader.readAsText(file)
	} else {
		showPopup('I do not know that filetype. Please input  a .json file.', 10)
	}
})
function downloadFile() {
	let downloadData = [[...chunks]]
	for (let x = 0; x < chunks.length; x++) {
		downloadData[0][x][0] = 0
	}
	let jetzt = Date.now()
	counters[0] += jetzt - programmStart
	programmStart = jetzt
	counters[1]++
	counters[17] = holding
	let actionDescription = lastAction.split("g")
	counters[19] = parseInt(actionDescription[0])
	counters[18] = parseInt(actionDescription[1])
	counters[20] = ~~walkable
	downloadData.push(waitingStuff)
	downloadData.push(counters)
	downloadData.push(playerPos)
	const jsonString = JSON.stringify(downloadData)
	const blob = new Blob([jsonString], { type: 'application/json' })
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = `SavePoint_${counters[1]}.json`
	link.click()
}
window.addEventListener('resize', function () {
	c.width = chunkKante * (~~((window.innerWidth) / chunkKante))
	c.height = chunkKante * (~~((window.innerHeight) / chunkKante))
	scale = Math.max(c.width, c.height) / chunkKante
	color = generiereBöden()
	textures = texture(scale)
	for (let x = 0; x < chunks.length; x++) {
		chunks[x][0] = 0
	}
	updateScreen = true
	popup.style.maxWidth = `${window.innerWidth * 0.9}px`
	popup.style.maxHeight = `${window.innerHeight * 0.3}px`
	popupContent.style.fontSize = `${Math.max(Math.min(window.innerWidth, window.innerHeight) * 0.025, 15)}px`
})
window.onload = async function () {
	const bildUrl = "https://cdn-icons-png.flaticon.com/512/94/94766.png"
	const bild = new Image()
	function ladeBildAsync(url) {
		return new Promise((resolve, reject) => {
			bild.src = url;
			const timer = setTimeout(() => { reject("timeout") }, 1000)
			bild.onload = () => {
				clearTimeout(timer)
				resolve(bild)
			}
			bild.onerror = () => {
				clearTimeout(timer)
				reject("error")
			}
		})
	}
	try {
		await ladeBildAsync(bildUrl)
		const imgAspectRatio = bild.width / bild.height
		const canvasAspectRatio = c.width / c.height
		let newWidth, newHeight;
		if (c.width < bild.width || c.height < bild.height) {
			if (canvasAspectRatio > imgAspectRatio) {
				newHeight = c.height;
				newWidth = c.height * imgAspectRatio
			} else {
				newWidth = c.width;
				newHeight = c.width / imgAspectRatio
			}
		} else {
			newWidth = bild.width
			newHeight = bild.height
		}
		const offsetX = (c.width - newWidth) / 2
		const offsetY = (c.height - newHeight) / 2
		ctx.drawImage(bild, offsetX, offsetY, newWidth, newHeight)
		setTimeout(main, 100)
	} catch (error) {
		console.log(error)
		main()
	}
}
let stopPopup
function showPopup(textInput, time) {
	clearTimeout(stopPopup)
	const popup = document.getElementById('popup')
	popupContent.textContent = textInput
	popup.style.display = 'block'
	popup.style.visibility = 'visible'
	setTimeout(() => {
		popup.style.opacity = 1
	}, 100)
	stopPopup = setTimeout(() => {
		popup.style.visibility = 'hidden'
		popup.style.opacity = 0
	}, time * 1000)
}
function letter(popupData, text, filename) {
	showPopup(popupData[0], popupData[1])
	const blob = new Blob([text], { type: 'text/plain' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	a.click()
	URL.revokeObjectURL(url)
}
