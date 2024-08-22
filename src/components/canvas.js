import React, { useRef, useEffect, useState } from 'react'

const spellTimeout = 20

function Canvas({width, height}) {
    const canvasRef = useRef(null)
    const mousePos = useRef({ x: 0, y: 0 })

    const score = useRef({one: 0, two: 0})

    const [frame, setFrame] = useState(0)
    const [playerOneSpellTimeout, setPlayerOneSpellTimeout] = useState(spellTimeout)
    const [playerTwoSpellTimeout, setPlayerTwoSpellTimeout] = useState(spellTimeout)

    const [radius, setRadius] = useState(20)
    const [spellRadius, setSpellRadius] = useState(5)

    const [playerOneX, setPlayerOneX] = useState(0)
    const [playerTwoX, setPlayerTwoX] = useState(0)
    const [playerOneY, setPlayerOneY] = useState(0)
    const [playerTwoY, setPlayerTwoY] = useState(0)
    const [playerOneDir, setPlayerOneDir] = useState(-1)
    const [playerTwoDir, setPlayerTwoDir] = useState(-1)

    const [spells, setSpells] = useState([])

    useEffect(() => {
        setInterval(() => {
            setFrame((frame) => frame > 100 ? 0 : frame + 1)
            setPlayerOneSpellTimeout((timeout) => timeout - 1)
            setPlayerTwoSpellTimeout((timeout) => timeout - 1)
        }, 50)
    }, [])

    // console.log(frame)

    // console.log(spells)

    console.log(score.current)

    const generateSpell = (source, spells) => {
        const spell = {
            x: source.x,
            y: source.y,
            dir: source.dir,
            caster: source.player
        }
        const nextSpells = [...spells, spell]
        // setSpells((prevSpells) => [
        //     ...prevSpells, spell
        // ])
        // setSpells(nextSpells)
        return nextSpells
    }

    const checkHit = (spells) => {
        console.log(spells)
        for (let i = 0; i < spells.length; i++) {
            console.log(i)
            if (spells[i].caster === 1 && collisionCheck({x: playerTwoX, y: playerTwoY}, spells[i])) {
                score.current.one = score.current.one + 1
                spells.splice(i, 1)
                // i--
            }
            if (spells[i].caster === 2 && collisionCheck({x: playerOneX, y: playerOneY}, spells[i])) {
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
        context.arc(playerOneX, playerOneY, radius, 0, Math.PI * 2, false)
        context.fillStyle = 'yellow'
        context.fill()
        context.beginPath()
        context.arc(playerTwoX, playerTwoY, radius, 0, Math.PI * 2, false)
        context.fillStyle = 'red'
        context.fill()
        for (let i = 0; i < spells.length; i++) {
            context.beginPath()
            context.arc(spells[i].x, spells[i].y, spellRadius, 0, Math.PI * 2, false)
            context.fillStyle = 'black'
            context.fill()
        }
    }

    const checkDir = () => {
        if (playerOneY - radius === 0) {
            setPlayerOneDir(1)
        } else if (playerOneY + radius === height) {
            setPlayerOneDir(-1)
        }
        if (playerTwoY - radius === 0) {
            setPlayerTwoDir(1)
        } else if (playerTwoY + radius === height) {
            setPlayerTwoDir(-1)
        }
        if (playerOneY + radius === mousePos.current.y && mousePos.current.x > playerOneX - radius && mousePos.current.x < playerOneX + radius) {
            setPlayerOneDir(-1)
        }
        if (playerOneY - radius === mousePos.current.y && mousePos.current.x > playerOneX - radius && mousePos.current.x < playerOneX + radius) {
            setPlayerOneDir(1)
        }
        if (playerTwoY + radius === mousePos.current.y && mousePos.current.x > playerTwoX - radius && mousePos.current.x < playerTwoX + radius) {
            setPlayerTwoDir(-1)
        }
        if (playerTwoY - radius === mousePos.current.y && mousePos.current.x > playerTwoX - radius && mousePos.current.x < playerTwoX + radius) {
            setPlayerTwoDir(1)
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

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.strokeRect(0, 0, width, height)
        setPlayerOneX(canvas.width / 10)
        setPlayerOneY(canvas.height / 2)
        setPlayerTwoX(canvas.width - canvas.width / 10)
        setPlayerTwoY(canvas.height / 2)
        draw(context)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, width, height)
        context.strokeRect(0, 0, width, height)
        setPlayerOneY((y) => y + playerOneDir)
        setPlayerTwoY((y) => y + playerTwoDir)
        checkDir()
        let tempSpells = [...spells]
        if (playerOneSpellTimeout <= 0) {
            tempSpells = generateSpell({x: playerOneX, y: playerOneY, dir: 1, player: 1}, tempSpells)
            setPlayerOneSpellTimeout(spellTimeout)

        }
        if (playerTwoSpellTimeout <= 0) {
            tempSpells = generateSpell({x: playerTwoX, y: playerTwoY, dir: -1, player: 2}, tempSpells)
            setPlayerTwoSpellTimeout(spellTimeout)
        }

        tempSpells = checkHit(tempSpells)
        
        for (let i = 0; i < tempSpells.length; i++) {
            tempSpells[i].x = tempSpells[i].x + tempSpells[i].dir
            if (tempSpells[i].x > width || tempSpells[i].x <= 0) {
                tempSpells.splice(i, 1)
            }
        }
        setSpells([...tempSpells])
        draw(context)
    }, [frame])


    return <div>
        <p>{score.current.one} : {score.current.two}</p>
        <canvas ref={canvasRef} width={width} height={height} onMouseMove={getMousePosition} />
        </div>
}

export default Canvas