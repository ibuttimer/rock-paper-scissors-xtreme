import { 
    BASIC_VARIANT_NAME, BIGBANG_VARIANT_NAME, XTREME_VARIANT_NAME
} from "../Globals.js";
import { Game, GameVariant } from "../services/game.js";


/**
 * Get the display name for the game variant.
 * @param {Game|GameVariant} game - game or game variant object
 */
export function getVariantName(game) {
    let name;
    if (game instanceof Game) {
        game = game.variant;
    } else if (!(game instanceof GameVariant)) {
        throw new Error(`Unknown object ${game}`);
    }
    switch (game) {
        case GameVariant.Basic:
            name = BASIC_VARIANT_NAME;
            break;
        case GameVariant.BigBang:
            name = BIGBANG_VARIANT_NAME;
            break;
        case GameVariant.Xtreme:
            name = XTREME_VARIANT_NAME;
            break;
        default:
            throw new Error(`Unknown variant ${game.variant}`);
    }
    return name;
}