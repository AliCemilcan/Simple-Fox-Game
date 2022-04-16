import gameState, {handleUserAction} from './gameState';
import { TICK_RATE } from './constants';
import initButtons from './buttons';

async function init() {
  console.log('starting time')
  initButtons(handleUserAction);
  let next_time_to_tick = Date.now()
  
  function nextAnimationFrame() {
    const now = Date.now()

    if (next_time_to_tick <= now) {
      gameState.tick();
      next_time_to_tick += TICK_RATE
    }
    requestAnimationFrame(nextAnimationFrame)
  }
    requestAnimationFrame(nextAnimationFrame)

}
init()
