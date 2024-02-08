import rock from "./images/icon-rock.svg";
import lizard from "./images/icon-lizard.svg";
import paper from "./images/icon-paper.svg";
import scissors from "./images/icon-scissors.svg";
import _ from "lodash";
import spock from "./images/icon-spock.svg";
import { useState, createContext, useContext, useEffect } from "react";
import { useReducer } from "react";
let GameContext = createContext();

// -------------------Element Componetn-------------

function Element({ file, color, id, onClick, shadowColor }) {
	return (
		<div className="element-wraper">
			<button
				id={id}
				className="element"
				style={{
					borderColor: color,
					boxShadow: `-0.3rem 0.3rem  0px ${shadowColor}`,
				}}
				onClick={() => {
					onClick(file);
				}}>
				<img src={file} alt="" />
			</button>
		</div>
	);
}
///----------------------Elements Component----------

function Elements() {
	let {
		setPhase,
		setPerson,
		setHouse,
		dispatchWinner,
		person,
		house,
		winner,
		setScore,
		score,
	} = useContext(GameContext);
	let elements = [rock, lizard, spock, scissors, paper];

	async function handleClick(value) {
		setPerson(value);
		let personForReducer = value;
		async function SetBot() {
			let chosen = Math.floor(Math.random() * (elements.length - 1));
			console.log(`the file path for the House element ${elements[chosen]}`);
			setHouse(elements[chosen]);

			return elements[chosen]; // Return an object directly
		}

		try {
			let houseForReducer = await SetBot();
			console.log(
				`logging from handle click,,, person: ${personForReducer},,, house: ${houseForReducer}`
			);
			dispatchWinner({ personForReducer, houseForReducer });

			///update score
		} catch (error) {
			// Handle the error if needed
		}

		setPhase(2);
		setTimeout(() => {
			setPhase(3);
			setTimeout(() => {
				setPhase(4);
			}, 1000);
		}, 1000);
	}

	useEffect(() => {
		winner != "ITS A DRAW!!!!" &&
			(winner == "YOU WON"
				? setScore((prevScore) => prevScore + 1)
				: setScore((prevScore) => prevScore - 1));
	}, [winner]);

	let colors = [
		"hsl(349, 71%, 52%)",
		" hsl(261, 73%, 60%)",
		"#16B7E0",
		"hsl(39, 89%, 49%)",
		" hsl(230, 89%, 62%)",
	];
	let shadowColors = [
		"#660022",
		" #100085",
		" #006069 ",
		"#8f5d00 ",
		"#002d6b  ",
	];

	let myArr = elements.map((value, index) => (
		<Element
			onClick={handleClick}
			file={value}
			color={colors[index]}
			shadowColor={shadowColors[index]}
			key={index}
			id={index}
		/>
	));

	let [row1, row2, row3] = [
		_.chunk(myArr, 2)[0],
		_.chunk(myArr, 2)[1],
		_.chunk(myArr, 2)[2],
	];

	return (
		<div className="elements">
			<div className="elements-inner">
				<div className="row" id="row1">
					{row1}
				</div>
				<div className="row" id="row2">
					{row2}
				</div>
				<div className="row">{row3}</div>
			</div>
		</div>
	);
}

///------------Result Component------------

function Result() {
	let elements = [rock, lizard, spock, scissors, paper];
	let colors = [
		"hsl(349, 71%, 52%)",
		" hsl(261, 73%, 60%)",
		"#16B7E0",
		"hsl(39, 89%, 49%)",
		" hsl(230, 89%, 62%)",
	];

	let { person, house, winner, setPhase, setPerson, setHouse, phase } =
		useContext(GameContext);

	return (
		<div className="result">
			<div className="person">
				<p className="choser-text">YOU PICKED:</p>
				<Element file={person} color={colors[elements.indexOf(person)]} />
			</div>
			{phase == 4 && (
				<div className="button">
					<p className="para-winner">{winner} </p>
					<button
						className="replay"
						onClick={() => {
							setPhase(1);
							setPerson("");
							setHouse("");
						}}>
						Replay
					</button>
				</div>
			)}
			{(phase == 3 || phase == 4) && (
				<div className="house">
					<p className="choser-text">THE HOUSE PICKED:</p>
					<Element file={house} color={colors[elements.indexOf(house)]} />
				</div>
			)}
		</div>
	);
}

///--------------Score Component-----

function Score() {
	let { winner, score } = useContext(GameContext);

	return (
		<div className="score-container">
			<div>
				<ul>
					<li>ROCK</li>
					<li>PAPER</li>
					<li>SCISSORS</li>
					<li>SPOCK</li>
					<li>LIZARD</li>
				</ul>
			</div>
			<div className="score-box">
				<p className="score-text">score</p>
				<p className="score">{score / 2}</p>
			</div>
		</div>
	);
}

function App() {
	let [person, setPerson] = useState("");
	let [house, setHouse] = useState("");
	let [phase, setPhase] = useState(1);

	const reducer = (state, action) => {
		console.log(
			`logging from the reducer action: ${action.personForReducer},,,,, ${action.houseForReducer}`
		);
		if (action.personForReducer == action.houseForReducer) {
			return "ITS A DRAW!!!!";
		}

		switch (action.personForReducer) {
			case rock:
				return action.houseForReducer == lizard ||
					action.houseForReducer == scissors
					? "YOU WON"
					: " YOU LOSE";
			case lizard:
				return action.houseForReducer == spock ||
					action.houseForReducer == paper
					? "YOU WON"
					: " YOU LOSE";
			case spock:
				return action.houseForReducer == rock ||
					action.houseForReducer == scissors
					? "YOU WON"
					: "YOU LOSE";
			case scissors:
				return action.houseForReducer == paper ||
					action.houseForReducer == lizard
					? "YOU WON"
					: "YOU LOSE";
			case paper:
				return action.houseForReducer == spock || action.houseForReducer == rock
					? "YOU WON "
					: "YOU LOSE";
			default:
				return "unexpected"; // Handle unexpected cases
		}
	};

	let [winner, dispatchWinner] = useReducer(reducer, "ITS A DRAW!!!!");
	let [score, setScore] = useState(0);
	return (
		<>
			<div className="container">
				<GameContext.Provider
					value={{
						setPerson,
						setHouse,
						setPhase,
						person,
						house,
						phase,
						dispatchWinner,
						winner,
						score,
						setScore,
					}}>
					<Score />
					{phase === 1 ? <Elements /> : <Result />}
				</GameContext.Provider>
			</div>
		</>
	);
}

export default App;
