
import { Button } from '@material-tailwind/react';
import { useState, type Dispatch, type ReactElement, type SetStateAction } from 'react';

interface CardProperties {
	xCord: number,
	yCord: number,

	gameState: GameStateType,
	setGameState: Dispatch<SetStateAction<GameStateType>>
}
interface RowProperties {
	numbers: number[],
	yCord: number,
	gameState: GameStateType,
	setGameState: Dispatch<SetStateAction<GameStateType>>
}
interface GameStateType {
	token1Loc: { x: number, y: number }
	token2Loc: { x: number, y: number }
	redTiles: Coords,
	greenDiceVal: number,
	possibleMovesGreen: Coords
	possibleMovesRed: Coords
	stage: string
}
interface Coordinate {
	x: number,
	y: number
}
interface diceRollReturn {
	temporaryPossibleMoves: Coords
	diceRoll: number
}
type Coords = Coordinate[]


function GameCard({ xCord, yCord, gameState, setGameState }: CardProperties): ReactElement {
	// const cellAddr = yCord.toString() + xCord.toString()
	const isRedTile = gameState.redTiles.some(til => til.x === xCord && til.y === yCord)
	// const isWithinRange = findWithinRange(gameState.token1Loc.x, gameState.token1Loc.y, xCord, yCord, distance)
	const isMovableTo = gameState.stage === "movingGreen" ?
		gameState.possibleMovesGreen.some(til => til.x === xCord && til.y === yCord) :
		(gameState.stage === "movingRed" ?
			gameState.possibleMovesRed.some(til => til.x === xCord && til.y === yCord) : [])
	// const isMovableTo = gameState.possibleMovesGreen.some(til => til.x === xCord && til.y === yCord)
	// const isMovableToByRed = gameState.possibleMovesRed.some(til => til.x === xCord && til.y === yCord)

	function onCellClick(): number {
		if (gameState.stage === "movingGreen") { setGameState({ ...gameState, token1Loc: { x: xCord, y: yCord }, stage: "movingRed" }) }
		if (gameState.stage === "movingRed") { setGameState({ ...gameState, token2Loc: { x: xCord, y: yCord }, stage: "Roll" }) }
		return 0
	}
	return (
		<button type="button" onClick={onCellClick} className={`mt-6 h-16 w-24 border-2 border-gray-400
		 ${isRedTile ? 'bg-red-100' : ''} 
		 ${gameState.stage === "movingGreen" && isMovableTo ? 'outline outline-green-900' : ''}
		 ${gameState.stage === "movingRed" && isMovableTo ? 'outline outline-red-900' : ''}
		 `}>

			{xCord} {yCord}
			<div className={`mt-6 h-4 w-4  inline-block  ${(gameState.token1Loc.x === xCord && gameState.token1Loc.y === yCord) ? 'bg-green-200' : ''} `} />
			<div className={`mt-6 h-4 w-4 inline-block ${(gameState.token2Loc.x === xCord && gameState.token2Loc.y === yCord) ? 'bg-red-200' : ''} `} />

		</button >

	)
}
function GameRow({ numbers, yCord, gameState, setGameState }: RowProperties): ReactElement {
	return (

		<div className="flex gap-2.5">
			{numbers.map((xCord) => {
				const key = yCord + xCord
				return (

					<GameCard xCord={xCord} yCord={yCord} key={key} gameState={gameState} setGameState={setGameState} />

				)
			})}

		</div>


	)
}

function isCellRed(redTiles: Coords, x: number, y: number): boolean { return redTiles.some(til => til.x === x && til.y === y) }
const baseState = {
	token1Loc: { x: 1, y: 10 },
	token2Loc: { x: 1, y: 10 },
	redTiles: [

		{ x: 2, y: 9 },
		{ x: 2, y: 10 }
	],
	greenDiceVal: 0,
	possibleMoves: [],
}

function rollADice(tokenLoc: Coordinate, redTiles: Coords): diceRollReturn {
	let temporaryPossibleMoves: Coords = []
	const currentRoll = 1 + Math.floor(2 * Number(Math.random()))
	const isOnRedTile = isCellRed(redTiles, tokenLoc.x, tokenLoc.y)
	// alert(gameState.greenDiceVal.toString())
	if (currentRoll === 2) {
		temporaryPossibleMoves = [...temporaryPossibleMoves,
		{ x: tokenLoc.x + 1, y: tokenLoc.y },
		{ x: tokenLoc.x - 1, y: tokenLoc.y },
		{ x: tokenLoc.x, y: tokenLoc.y + 1 },
		{ x: tokenLoc.x, y: tokenLoc.y - 1 },]
		if (!isOnRedTile) {
			if (!isCellRed(redTiles, tokenLoc.x + 1, tokenLoc.y)) {
				temporaryPossibleMoves = [...temporaryPossibleMoves,
				{ x: tokenLoc.x + 2, y: tokenLoc.y },
				]
			}
			if (!isCellRed(redTiles, tokenLoc.x - 1, tokenLoc.y)) {
				temporaryPossibleMoves = [...temporaryPossibleMoves,
				{ x: tokenLoc.x - 2, y: tokenLoc.y },
				]
			}
			if (!isCellRed(redTiles, tokenLoc.x, tokenLoc.y + 1)) {
				temporaryPossibleMoves = [...temporaryPossibleMoves,
				{ x: tokenLoc.x, y: tokenLoc.y + 2 },
				]
			}
			if (!isCellRed(redTiles, tokenLoc.x, tokenLoc.y - 1)) {
				temporaryPossibleMoves = [...temporaryPossibleMoves,
				{ x: tokenLoc.x, y: tokenLoc.y - 2 },
				]
			}


		}
	} else if (currentRoll === 1 && !isOnRedTile) {
		temporaryPossibleMoves = [...temporaryPossibleMoves,
		{ x: tokenLoc.x + 1, y: tokenLoc.y },
		{ x: tokenLoc.x - 1, y: tokenLoc.y },
		{ x: tokenLoc.x, y: tokenLoc.y + 1 },
		{ x: tokenLoc.x, y: tokenLoc.y - 1 },]
	} else if (currentRoll === 1 && isOnRedTile) {
		temporaryPossibleMoves = [...temporaryPossibleMoves,
		{ x: tokenLoc.x, y: tokenLoc.y }]

	}
	console.log(temporaryPossibleMoves)
	// setGameState()
	return { possibleMoves: temporaryPossibleMoves, diceRoll: currentRoll }
}

export default function Home(): ReactElement {


	const [gameState, setGameState] = useState<GameStateType>(baseState)
	function onReset(): number {
		setGameState(baseState)
		return 0
	}


	function onGreenDiceRoll(): number {
		const greenResult = rollADice(gameState.token1Loc, gameState.redTiles)
		const redResult = rollADice(gameState.token2Loc, gameState.redTiles)
		setGameState({
			...gameState, possibleMovesGreen: greenResult.possibleMoves, greenDiceVal: greenResult.diceRoll,
			possibleMovesRed: redResult.possibleMoves, redDiceVal: redResult.diceRoll,
			stage: "movingGreen"
		})

		return 0
	}
	if (gameState.stage === "Roll") {
		onGreenDiceRoll()
	}

	function onRedDiceRoll(): number {
		const result = rollADice(gameState.token2Loc, gameState.redTiles)
		setGameState({ ...gameState, possibleMoves: result.possibleMoves, greenDiceVal: result.diceRoll })

		return 0
	}
	return (
		<>
			<head>Agile Sequence</head>
			<div className='flex'>

				<div>
					{Array.from({ length: 10 }, (v, k) => k + 1).map(
						(yCord: number) => <GameRow numbers={Array.from({ length: 10 }, (v, k) => k + 1)} yCord={yCord} key={yCord} gameState={gameState} setGameState={setGameState} />
					)}

				</div>
				<div className='flex w-full border-l-4 border-l-black'>
					<div>
						<Button onClick={onGreenDiceRoll} type='button' color='green'> Roll Dice</Button>
						<Button onClick={onReset} type='button' color='red'> reset</Button>
						<span> {gameState.greenDiceVal} {gameState.redDiceVal}</span>
					</div>
				</div>
			</div>
		</>
	)
}
