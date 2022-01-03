import { menuBtn_click } from './variable'

export function init(){
    // 사이드 메인 메뉴 애니메이션 실행
    const mainMenu = document.querySelector<HTMLDivElement>('.mainMenu');
    const mainMenu_contents = document.querySelector<HTMLDivElement>('#mainMenu_contents');
    
    mainMenu.addEventListener('click', function(){
        if(menuBtn_click.main == false){
            mainMenu_contents.style.height = '280px';
            menuBtn_click.main = true;
        }else{
            mainMenu_contents.style.height = '70px';
            menuBtn_click.main = false;
        }
        this.classList.toggle('active');
    });
}
