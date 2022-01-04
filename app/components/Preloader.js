import Component from "classes/Component";
import each from "lodash/each";

export default class Preloader extends Component {
    constructor(){
        super({
            element:'.preloader',
            elements:{
                title:'.preloader__text',
                number:'.preloader__number',
                images:document.querySelectorAll('img')
            }
        })

        this.length = 0

        this.createLoader()
    }

    createLoader() {
        each(this.elements.images, element => {
            const image = new Image()
            image.onload = _ => this.onAssetLoaded(image)
            image.src = element.getAttribute('data-src')
        })
    }

    onAssetLoaded() {
        this.length += 1
        const percent = this.length / this.elements.images.length 

        this.element.number.innerHTML = `${Math.round((percent * 100))}`
        
        if (percent === 1) {
            this.onLoaded()
        }
    }

    onLoaded() {
        this.emit('completed')
    }
 
}