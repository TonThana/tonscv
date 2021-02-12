export default (Target) => class FullScreenInBackground extends Target {
    constructor(props) {
        super(window.innerWidth, window.innerHeight, props)
        // canvas will fall to bg
        this.dom.style.position = 'fixed'
        this.dom.style.top = '0'
        this.dom.style.left = '0';
        this.dom.style.zIndex = '-1';
        document.body.appendChild(this.dom);

        this.resize = this.resize.bind(this);

        window.addEventListener('resize', this.resize);
        window.addEventListener('orientationchange', this.resize);
        this.resize();
    }
    resize() {
        super.resize(window.innerWidth, window.innerHeight);
    }

}