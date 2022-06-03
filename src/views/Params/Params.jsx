import { useOutletContext } from "react-router-dom";
import { GAME_NAME } from './../../Globals.js'
import { getVariantName } from "../../utils";
import './Params.css';

/**
 * Function Component for Params screen
 * @returns {React element} element to render
 */
 export default function Params() {
    const game = useOutletContext();

    return (
        <main>
            <h1 className="h1__main-title">{GAME_NAME} {getVariantName(game)}</h1>
        </main>
    );
}

