/// <reference path="../node_modules/@types/jquery/index.d.ts"/>

type point = {x: number, y: number}

/**
 * the model to control the canvas
 *
 * @export
 * @class canvasModel - the canvas model
 */
export class canvasModel {
    protected readonly activeDisplayCanvas = <HTMLCanvasElement> $(".active .display canvas").get(0);
    protected readonly activeDisplayConfig = <HTMLFormElement> $(".active .display form").get(0);

    protected readonly canvasContext = this.activeDisplayCanvas.getContext('2d');

    /**
     * clear the canvas
     */
    protected clearCanvas() {
        this.canvasContext.clearRect(0, 0, this.activeDisplayCanvas.width, this.activeDisplayCanvas.height);
    }

    protected drawCircle(params: {center: point, radius: number, color: string}) {
        this.canvasContext.save();

        this.canvasContext.arc(params.center.x, params.center.y,
            params.radius, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = params.color;
        this.canvasContext.fill();

        this.canvasContext.restore()
    }

    protected drawRectagle(options: {topLeft: point, width: number, height: number, color: string}) {
        this.canvasContext.save();

        this.canvasContext.rect(options.topLeft.x, options.topLeft.y, options.width, options.height);
        this.canvasContext.fillStyle = options.color;
        this.canvasContext.fill();

        this.canvasContext.restore();
    }

}
