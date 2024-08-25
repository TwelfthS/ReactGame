import React from 'react'

function Menu({playerId, changeColor, menuId}) {

    const closeMenu = () => {
        const menu = document.getElementById(menuId)
        menu.classList.add('hidden')
    }

    return <div id={menuId} className='hidden menu'>
        <h4>Цвет снарядов</h4>
            <button className='menu-button' onClick={() => changeColor('red', playerId)}>Красный</button>
            <button className='menu-button' onClick={() => changeColor('blue', playerId)}>Синий</button>
            <button className='menu-button' onClick={() => changeColor('black', playerId)}>Чёрный</button>
            <button className='menu-button' onClick={() => changeColor('yellow', playerId)}>Жёлтый</button>
            <button className='menu-button' onClick={() => changeColor('green', playerId)}>Зелёный</button>
            <button className='close-button' onClick={closeMenu}>X</button>
    </div>
}

export default Menu