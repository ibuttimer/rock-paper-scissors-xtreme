import React from 'react';
import { Link } from "react-router-dom";
import { AppContext } from '../../App.js'
import { 
    GAME_NAME, BASIC_VARIANT_NAME, BIGBANG_VARIANT_NAME, XTREME_VARIANT_NAME,
    BASIC_URL, BIGBANG_URL, XTREME_URL
} from "../../Globals";
import { GameTile } from '../../components/index.js';
import { GameVariant } from "../../services/index.js";
import './Main.css';


/**
 * Function Component for Main screen
 * @returns {React element} element to render
 */
export default function Main() {
    const gameState = React.useContext(AppContext);

    /**
     * Set the game variant.
     * @param {GameVariant} variant 
     */
    function setVariant(variant) {
        gameState.game.variant = variant;
    }

    return (
        <main>
            <h1 className="h1__main-title">{GAME_NAME}</h1>
            <h2 className="h2__sub-title">Select game</h2>
            <section className="section__select-game">
                <article>
                    <Link to={BASIC_URL} aria-label='select basic game.'
                        onClick={() => setVariant(GameVariant.Basic)}>
                        <GameTile name={BASIC_VARIANT_NAME} src='assets/img/basic.png'/>
                    </Link>
                </article>
                <article>
                    <Link to={BIGBANG_URL} aria-label='select big bang game.'
                        onClick={() => setVariant(GameVariant.BigBang)}>
                        <GameTile name={BIGBANG_VARIANT_NAME} src='assets/img/big-bang.png'/>
                    </Link>
                </article>
                <article>
                    <Link to={XTREME_URL} aria-label='select extreme game.'
                        onClick={() => setVariant(GameVariant.Xtreme)}>
                        <GameTile name={XTREME_VARIANT_NAME} src='assets/img/xtreme.png'/>
                    </Link>
                </article>
            </section>
        </main>
    );
}

