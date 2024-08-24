import React, { useRef, useEffect, useState } from 'react'

const spellTimeout = 20
const radius = 20
const spellRadius = 5

function Canvas({width, height, playerOneSpeed, playerTwoSpeed, playerOneFireSpeed, playerTwoFireSpeed}) {
    const canvasRef = useRef(null)
    const mousePos = useRef({ x: 0, y: 0 })

    const score = useRef({one: 0, two: 0})

    const [frame, setFrame] = useState(0)

    const [spells, setSpells] = useState([])
    const [spellOneColor, setSpellOneColor] = useState('black')
    const [spellTwoColor, setSpellTwoColor] = useState('black')

    const [playerOne, setPlayerOne] = useState({ x: width / 10, y: height / 2, dir: -1, speed: playerOneSpeed, spellColor: 'black', spellTimeout: spellTimeout - playerOneFireSpeed, fireSpeed: playerOneFireSpeed})

    const [playerTwo, setPlayerTwo] = useState({ x: width - width / 10, y: height / 2, dir: -1, speed: playerTwoSpeed, spellColor: 'black', spellTimeout: spellTimeout - playerTwoFireSpeed, fireSpeed: playerTwoFireSpeed})

    useEffect(() => {
        setInterval(() => {
            setFrame((frame) => frame > 100 ? 0 : frame + 1)
        }, 50)

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.strokeRect(0, 0, width, height)
        draw(context)
    }, [])

    // console.log(frame)

    const generateSpell = (source, spells, color) => {
        const spell = {
            x: source.x,
            y: source.y,
            dir: source.dir,
            caster: source.player,
            color: color
        }
        const nextSpells = [...spells, spell]
        return nextSpells
    }

    const checkHit = (spells) => {
        for (let i = 0; i < spells.length; i++) {
            if (spells[i].caster === 1 && collisionCheck({x: playerTwo.x, y: playerTwo.y}, spells[i])) {
                score.current.one = score.current.one + 1
                spells.splice(i, 1)
                // i--
            }
            if (spells[i].caster === 2 && collisionCheck({x: playerOne.x, y: playerOne.y}, spells[i])) {
                score.current.two = score.current.two + 1
                spells.splice(i, 1)
                // i--
            }
        }
        return spells
    }

    const collisionCheck = (player, spell) => {
        if (spell.x - spellRadius < player.x + radius && spell.x + spellRadius > player.x - radius && spell.y - spellRadius < player.y + radius && spell.y + spellRadius > player.y - radius) {
            return true
        } else {
            return false
        }
    }

    const draw = (context) => {
        context.beginPath()
        context.arc(playerOne.x, playerOne.y, radius, 0, Math.PI * 2, false)
        context.fillStyle = 'yellow'
        context.fill()
        context.beginPath()
        context.arc(playerTwo.x, playerTwo.y, radius, 0, Math.PI * 2, false)
        context.fillStyle = 'red'
        context.fill()
        for (let i = 0; i < spells.length; i++) {
            context.beginPath()
            context.arc(spells[i].x, spells[i].y, spellRadius, 0, Math.PI * 2, false)
            context.fillStyle = spells[i].color
            context.fill()
        }
    }

    const checkDir = (player) => {
        if (player.y - radius <= 0) {
            player.dir = 1
        } else if (player.y + radius >= height) {
            player.dir = -1
        }
        if (player.y + radius === mousePos.current.y && mousePos.current.x > player.x - radius && mousePos.current.x < player.x + radius) {
            player.dir = -1
        }
        if (player.y - radius === mousePos.current.y && mousePos.current.x > player.x - radius && mousePos.current.x < player.x + radius) {
            player.dir = 1
        }
    }

    const getMousePosition = (event) => {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        mousePos.current = {
            x: Math.floor(event.clientX - rect.left),
            y: Math.floor(event.clientY - rect.top)
        }
    }

    const handleClick = () => {
        if (mousePos.current.x > playerOne.x - radius && mousePos.current.x < playerOne.x + radius && mousePos.current.y > playerOne.y - radius && mousePos.current.y < playerOne.y + radius) {
            const menu = document.getElementById('menuOne')
            menu.classList.remove('hidden')
        }
        if (mousePos.current.x > playerTwo.x - radius && mousePos.current.x < playerTwo.x + radius && mousePos.current.y > playerTwo.y - radius && mousePos.current.y < playerTwo.y + radius) {
            const menu = document.getElementById('menuTwo')
            menu.classList.remove('hidden')
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, width, height)
        context.strokeRect(0, 0, width, height)

        const playerOneNext = {...playerOne}
        playerOneNext.spellTimeout -= 1
        playerOneNext.speed = playerOneSpeed
        playerOneNext.fireSpeed = playerOneFireSpeed
        playerOneNext.y = playerOneNext.y + playerOneNext.dir * playerOneNext.speed

        const playerTwoNext = {...playerTwo}
        playerTwoNext.spellTimeout -= 1
        playerTwoNext.speed = playerTwoSpeed
        playerTwoNext.fireSpeed = playerTwoFireSpeed
        playerTwoNext.y = playerTwoNext.y + playerTwoNext.dir * playerTwoNext.speed

        checkDir(playerOneNext)
        checkDir(playerTwoNext)

        let tempSpells = [...spells]
        if (playerOneNext.spellTimeout <= 0) {
            tempSpells = generateSpell({x: playerOne.x, y: playerOne.y, dir: 1, player: 1}, tempSpells, spellOneColor)
            playerOneNext.spellTimeout = spellTimeout - playerOneFireSpeed
        }
        if (playerTwoNext.spellTimeout <= 0) {
            tempSpells = generateSpell({x: playerTwo.x, y: playerTwo.y, dir: -1, player: 2}, tempSpells, spellTwoColor)
            playerTwoNext.spellTimeout = spellTimeout - playerTwoFireSpeed
        }

        tempSpells = checkHit(tempSpells)
        
        for (let i = 0; i < tempSpells.length; i++) {
            tempSpells[i].x = tempSpells[i].x + tempSpells[i].dir
            if (tempSpells[i].x > width || tempSpells[i].x <= 0) {
                tempSpells.splice(i, 1)
            }
        }
        setSpells([...tempSpells])
        setPlayerOne({...playerOneNext})
        setPlayerTwo({...playerTwoNext})
        draw(context)
    }, [frame])


    const changeColor = (color, player) => {
        player === 1 ? setSpellOneColor(color) : setSpellTwoColor(color)
    }


    return <div>
        <p>{score.current.one} : {score.current.two}</p>
        <canvas ref={canvasRef} width={width} height={height} onMouseMove={getMousePosition} onClick={handleClick} />
        <div id="menuOne" className='hidden'>
            <button onClick={() => changeColor('red', 1)}>Red</button>
            <button onClick={() => changeColor('blue', 1)}>Blue</button>
            <button onClick={() => changeColor('black', 1)}>Black</button>
        </div>
        <div id="menuTwo" className='hidden'>
            <button onClick={() => changeColor('red', 2)}>Red</button>
            <button onClick={() => changeColor('blue', 2)}>Blue</button>
            <button onClick={() => changeColor('black', 2)}>Black</button>
        </div>
        </div>
}

export default Canvas