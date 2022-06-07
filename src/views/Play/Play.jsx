import React from 'react';
import { Link } from "react-router-dom";
import { AppContext } from '../../App.js'
import { 
    GAME_NAME, BASIC_VARIANT_NAME, BIGBANG_VARIANT_NAME, XTREME_VARIANT_NAME,
    BASIC_URL, BIGBANG_URL, XTREME_URL
} from "../../Globals";
import { getVariantName } from "../../utils";
import { GameTile } from '../../components/index.js';
import { GameVariant } from "../../services/index.js";
import './Play.css';


/**
 * Function Component for Play screen
 * @returns {React element} element to render
 */
export default function Play() {
    const gameState = React.useContext(AppContext);;

    return (
        <AppContext.Consumer>
            { value => 
                <main>
                    <h1 className="h1__main-title">{GAME_NAME} {getVariantName(value.game)}</h1>
                    <h2 className="h2__sub-title">Round</h2>
                </main>
            }
        </AppContext.Consumer>
    );
}
