import { mylocate } from './constants'
import { moveOpts, variable } from './variable'

export function init(){
    // setInterval(() => { // 플레이어 위치 표시
        if(moveOpts.check == false){
            mylocate.style.filter = 'opacity(0%)';
        }
    // }, 50)
}