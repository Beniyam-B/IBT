import React from 'react'
import './Menu.css'
import Dish from './Dish/Dish'

// import images from the local Dish/images folder
import doro from './Dish/images/Doro.jpg'
import tibs from './Dish/images/Tibs.jpg'
import kitfo from './Dish/images/Kitfo.jpg'
import firfir from './Dish/images/firfir.jpg'
import shiro from './Dish/images/shiro.jpg'
import gomen from './Dish/images/gomen.jpg'
import misir from './Dish/images/misir.jpg'
import beyaynetu from './Dish/images/beyaynetu.jpg'
import sambusa from './Dish/images/sambusa.jpg'
import chechebsa from './Dish/images/chechebsa.jpg'
import buna from './Dish/images/buna.jpg'
import tej from './Dish/images/tej.jpg'


const menu = [
  { id: 1, name: 'Doro Wot', category: 'Main', price: 320, spicy: true, image: doro, desc: 'Slow-simmered chicken in berbere sauce, hard-boiled egg, served with injera.' },
  { id: 2, name: 'Tibs', category: 'Main', price: 1200, spicy: false, image: tibs, desc: 'Pan-seared beef with onion, rosemary and jalapeno.' },
  { id: 3, name: 'Kitfo', category: 'Main', price: 1360, spicy: true, image: kitfo, desc: 'Minced beef warmed in spiced butter, served leb leb with ayib and gomen.' },
  { id: 4, name: 'FirFir', category: 'Main', price: 180, spicy: true, image: firfir, desc: 'Torn injera pan-fried in a spiced berbere and onion sauce.' },
  { id: 5, name: 'Shiro Wot', category: 'Vegetarian', price: 220, spicy: true, image: shiro, desc: 'Ground chickpea stew simmered with garlic, ginger and berbere.' },
  { id: 6, name: 'Gomen', category: 'Vegetarian', price: 250, spicy: false, image: gomen, desc: 'Collard greens sauteed with garlic and green chili.' },
  { id: 7, name: 'Misir Wot', category: 'Vegetarian', price: 210, spicy: true, image: misir, desc: 'Spiced red lentils simmered slowly in berbere and garlic.' },
  { id: 8, name: 'Beyaynetu', category: 'Vegetarian', price: 500, spicy: false, image: beyaynetu, desc: 'A vegetarian sampler platter - five stews on fresh injera.' },
  { id: 9, name: 'Sambusa', category: 'Appetizer', price: 90, spicy: false, image: sambusa, desc: 'Crisp pastry triangles filled with spiced lentils or beef.' },
  { id: 10, name: 'Chechebsa', category: 'Breakfast', price: 130, spicy: false, image: chechebsa, desc: 'Torn flatbread tossed in spiced butter and berbere.' },
  { id: 11, name: 'Buna', category: 'Drink', price: 60, spicy: false, image: buna, desc: 'Traditional Ethiopian coffee, roasted and brewed fresh.' },
  { id: 12, name: 'Tej', category: 'Drink', price: 150, spicy: false, image: tej, desc: 'Ethiopian honey wine, fermented with gesho leaves.' }
]
const Menu = () => {
  return (
    <section className="pdt menu-section">
      <h1 className="menu-heading">Menu</h1>
      <div className="menu-grid">
        {menu.map(dish => <Dish key={dish.id} {...dish} />)}
      </div>
    </section>
  )
}

export default Menu