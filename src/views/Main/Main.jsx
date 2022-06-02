import { GAME_NAME, BASIC_VARIANT_NAME, BIGBANG_VARIANT_NAME, XTREME_VARIANT_NAME } from "../../Globals";
import { GameTile } from '../../components/index.js';
import './Main.css';


export default function Main() {
    return (
        <main>
            <h1 className="h1__main-title">{GAME_NAME}</h1>
            <h2 className="h2__sub-title">Select game</h2>
            <section className="section__select-game">
                <article>
                    <GameTile name={BASIC_VARIANT_NAME} src='assets/img/basic.png'/>
                </article>
                <article>
                    <GameTile name={BIGBANG_VARIANT_NAME} src='assets/img/big-bang.png'/>
                </article>
                <article>
                    <GameTile name={XTREME_VARIANT_NAME} src='assets/img/xtreme.png'/>
                </article>
            </section>
        </main>
    );
}

