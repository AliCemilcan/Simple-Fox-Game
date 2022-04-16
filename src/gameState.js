import { modFox, modScene ,tofflePoopBag, writeModal} from "./ui";
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime
} from "./constants";

const gameState =  {
  current: 'INIT',
  clock: 1,
  wakeTime: -1,
  sleepTime: -1,
  hungerTime: -1,
  startCelebratingTime: -1,
  endCelebratingTime: -1,
  poopTime: -1,
  dieTime: -1,
  scene:0,
  tick(){
    this.clock++;
    console.log('CLOCK', this.clock)
    if (this.clock === this.wakeTime) {
      this.wake()
    } else if (this.clock === this.sleepTime) {
      this.sleep()
    
    } else if (this.clock === this.dieTime) {
      this.die()
    
    } else if (this.clock === this.hungerTime) {
      this.getHungry()
    } else if (this.clock === this.startCelebratingTime) {
      this.startCelebrating()
    } else if (this.clock === this.endCelebratingTime) {
      this.endCelebrating()
    } else if (this.clock === this.poopTime) {
      this.poop()
    }
    return this.clock
  },
  startGame() {
    console.log('HATCHING')
    this.current = 'HATCHING'
    this.wakeTime = this.clock + 3;
    modFox('egg')
    modScene('day')
    writeModal()

  },
  wake() {
    console.log('awoken')
    this.current = 'IDLING'
    this.wakeTime = -1
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene])
    this.sleepTime = this.clock + DAY_LENGTH
    this.hungerTime = getNextHungerTime(this.clock)
    console.log(this.hungerTime)
    this.determineFoxState();

  },
  clearTimes() {
    this.wakeTime = -1
    this.dieTime = -1
    this.sleepTime = -1
    this.hungerTime = -1
    this.poopTime = -1
    this.startCelebratingTime = -1
    this.endCelebratingTime = -1
  },
  getHungry() {
    this.current = 'HUNGRY'
    this.dieTime = getNextDieTime(this.clock)
    this.hungerTime = -1
    modFox('hungry')
    
  },
  handleUserAction(icon) {
    if (['SLEEP', 'FEEDING', 'CELEBRATING', 'HATCHING'].includes(this.current)) {
      return;
    }
    if (this.current === 'DEAD' || this.current === 'INIT') {
      this.startGame();
      return
    }
    switch (icon) {
      case 'weather':
        this.changeWeather();
        break;
      case 'poop':
        this.cleanPoop();
        break;
      case 'fish':
        this.feed();
        break;
    }
  },
  sleep() {
    this.state = 'SLEEP'
    modFox('sleep');
    modScene('night')
    this.clearTimes()
    this.wakeTime = this.clock + NIGHT_LENGTH
  },
  poop() {
    this.current = 'POOPING'
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock)
    modFox('pooping')
  },
  cleanUpPoop() {
    if (!this.current === 'POOPING') {
      return
    }
    this.dieTime = -1
    tofflePoopBag(false)
    this.startCelebrating()
    this.hungerTime = getNextHungerTime(this.clock)
  },
  changeWeather() {
    this.scene = (1 + this.scene) % SCENES.length;
    modScene(SCENES[this.scene])
    this.determineFoxState();

  },
  cleanPoop() {
    console.log('cleanPoop')
  },
  startCelebrating() {
    this.current = 'CELEBRATING'
    modFox('celebrate')
    this.startCelebratingTime = -1;
    this.endCelebratingTime = this.clock + 2;
  },
  endCelebrating() {
    this.endCelebratingTime = -1;
    this.current = 'IDLING'
    this.determineFoxState()
    tofflePoopBag(true)
  },
  determineFoxState() {
    if (this.current === 'IDLING') {
      if (SCENES[this.scene] === 'rain') {
        modFox('rain')
         modScene('rain')

      } else {
        modFox('idling')
      }
    }
  },
  feed() {
    if (this.current !== 'HUNGRY') {
      return
    }
    this.current = 'FEEDING'
    this.dieTime = -1
    this.poopTime = getNextPoopTime(this.clock)
    modFox('eating')
    this.startCelebratingTime = this.clock + 2
  },
  die() {
    this.current = 'DEAD'
    modScene('dead')
    modFox('dead')
    this.clearTimes()
    writeModal('Fox died, press middle button to start')
    console.log('DIED')
  }
};
export const handleUserAction = gameState.handleUserAction.bind(gameState)
export default gameState
