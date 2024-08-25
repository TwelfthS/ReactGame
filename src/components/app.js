import React, { useState } from 'react'
import Canvas from './canvas'
import Menu from './menu'

function App() {

    const [playerOneSpeed, setPlayerOneSpeed] = useState(1)
    const [playerTwoSpeed, setPlayerTwoSpeed] = useState(1)

    const [playerOneFireSpeed, setPlayerOneFireSpeed] = useState(1)
    const [playerTwoFireSpeed, setPlayerTwoFireSpeed] = useState(1)

    const [spellColorOne, setSpellColorOne] = useState('black')
    const [spellColorTwo, setSpellColorTwo] = useState('black')

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

    const changeColor = (color, player) => {
        player === 1 ? setSpellColorOne(color) : setSpellColorTwo(color)
    }


    return (
        <div className='main-flex'>
            <div className='ranges-div'>
                <input name='oneSpeed' type='range' min='1' max='10' value={playerOneSpeed} onChange={(e) => changeValue(e, 'playerOneSpeed')}></input>
                <label htmlFor='oneSpeed'>Скорость движения</label>
                <input name='oneFireSpeed' type='range' min='1' max='15' value={playerOneFireSpeed} onChange={(e) => changeValue(e, 'playerOneFireSpeed')}></input>
                <label htmlFor='oneFireSpeed'>Скорость атаки</label>
                <Menu menuId='menuOne' playerId={1} changeColor={changeColor} />
            </div>

            <Canvas width={500} height={300} playerOneSettings={{speed: playerOneSpeed, fireSpeed: playerOneFireSpeed, spellColor: spellColorOne}} playerTwoSettings={{speed: playerTwoSpeed, fireSpeed: playerTwoFireSpeed, spellColor: spellColorTwo}} />
            
            <div className='ranges-div'>
                <input name='twoSpeed' type='range' min='1' max='10' value={playerTwoSpeed} onChange={(e) => changeValue(e, 'playerTwoSpeed')}></input>
                <label htmlFor='twoSpeed'>Скорость движения</label>
                <input name='twoFireSpeed' type='range' min='1' max='15' value={playerTwoFireSpeed} onChange={(e) => changeValue(e, 'playerTwoFireSpeed')}></input>   
                <label htmlFor='twoFireSpeed'>Скорость атаки</label>
                <Menu menuId='menuTwo' playerId={2} changeColor={changeColor} />
            </div>

        </div>
    )
}

export default App