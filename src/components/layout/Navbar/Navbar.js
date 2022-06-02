import React from 'react';
import './Navbar.css';

export default class Navbar extends React.Component {

    render() {
        return (
            <header>
                <nav className='nav__top'>
                    <div className='div__logo'>
                        <a href='index.html' aria-label='logo, home page.'>
                            <span>
                                <img src='android-chrome-192x192.png' width='28' height='28'
                                    alt='logo, current page, home.'/>
                            </span>
                        </a>
                    </div>
                    <ul className='menu__row'>
                        <li className='menu__list'>
                            <a href='#' className='menu__link' aria-label='goto rules page.'>
                                <i className='lni lni-book'></i>&nbsp;Rules
                            </a>
                        </li>
                        <li className='menu__list'>
                            <a href='ireland.html' className='menu__link' aria-label='goto ireland page.'>
                                <i className='lni lni-cog'></i>&nbsp;Settings
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

        );
      }    
}



