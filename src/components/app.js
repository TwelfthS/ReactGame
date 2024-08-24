import React, { useState } from 'react'
import Canvas from './canvas'

function App() {

    const [playerOneSpeed, setPlayerOneSpeed] = useState(1)
    const [playerTwoSpeed, setPlayerTwoSpeed] = useState(1)

    const [playerOneFireSpeed, setPlayerOneFireSpeed] = useState(1)
    const [playerTwoFireSpeed, setPlayerTwoFireSpeed] = useState(1)

    const changeValue = (e, valueToChange) => {
        switch (valueToChange) {
            case "playerOneSpeed":
                setPlayerOneSpeed(e.target.value)
                break
            case "playerTwoSpeed":
                setPlayerTwoSpeed(e.target.value)
                break
            case "playerOneFireSpeed":
                setPlayerOneFireSpeed(e.target.value)
                break
            case "playerTwoFireSpeed":
                setPlayerTwoFireSpeed(e.target.value)
                break
            default:
                break
        }
    }
    return (
        <>
            <h1 className="h1">Приложение на React</h1>
            <Canvas width={300} height={300} playerOneSpeed={playerOneSpeed} playerTwoSpeed={playerTwoSpeed} playerOneFireSpeed={playerOneFireSpeed} playerTwoFireSpeed={playerTwoFireSpeed} />
            <input type="range" min="1" max="10" value={playerOneSpeed} onChange={(e) => changeValue(e, "playerOneSpeed")}></input>
            <input type="range" min="1" max="10" value={playerTwoSpeed} onChange={(e) => changeValue(e, "playerTwoSpeed")}></input>
            <input type="range" min="1" max="15" value={playerOneFireSpeed} onChange={(e) => changeValue(e, "playerOneFireSpeed")}></input>
            <input type="range" min="1" max="15" value={playerTwoFireSpeed} onChange={(e) => changeValue(e, "playerTwoFireSpeed")}></input>
        </>
    )
}

export default App