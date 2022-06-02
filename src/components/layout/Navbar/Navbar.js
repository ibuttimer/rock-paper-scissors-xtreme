import React from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';

export default class Navbar extends React.Component {

    render() {
        return (
            <header>
                <nav className='nav__top'>
                    <div className='div__logo'>
                        <Link to="/" aria-label='logo, home page.'>
                            <span>
                                <img src='android-chrome-192x192.png' width='28' height='28'
                                    alt='logo, current page, home.'/>
                            </span>
                        </Link>
                    </div>
                    <ul className='menu__row'>
                        <li className='menu__list'>
                            <Link to="/rules" className='menu__link' aria-label='goto rules page.'>
                                <i className='lni lni-book'></i>&nbsp;Rules
                            </Link>
                        </li>
                        <li className='menu__list'>
                            <a href='#' className='menu__link' aria-label='open settings.'>
                                <i className='lni lni-cog'></i>&nbsp;Settings
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
        );
      }    
}



