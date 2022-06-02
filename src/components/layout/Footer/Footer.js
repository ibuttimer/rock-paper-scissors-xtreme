import React from 'react';
import './Footer.css';
import { COPYRIGHT, YEAR } from '../../../Globals.js';

export default class Footer extends React.Component {

    render() {
        return (
            <footer className='footer__footer'>
                <div className="div__copyright">
                    <p>&copy; {COPYRIGHT} {YEAR}</p>
                </div>
            </footer>
        );
      }    
}
