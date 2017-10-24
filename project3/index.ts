/// <reference path="../node_modules/@types/jquery/index.d.ts"/>

type point = { x: number, y: number }

/**
 * the model to control the canvas
 *
 * @export
 * @class canvasModel - the canvas model
 */
abstract class canvasModel {
    private readonly activeDisplayCanvas = <HTMLCanvasElement> $(".active .display canvas").get(0);
    protected readonly activeDisplayConfig = <HTMLFormElement> $(".active .display form").get(0);
    protected canvasWidth = this.activeDisplayCanvas.width;
    protected canvasHeight = this.activeDisplayCanvas.height;

    protected keepDraw: boolean = true;

    protected readonly canvasContext = this.activeDisplayCanvas.getContext('2d');

    /**
     * clear the canvas
     */
    protected clearCanvas() {
        this.canvasContext.clearRect(0, 0, this.activeDisplayCanvas.width, this.activeDisplayCanvas.height);
    }

    protected drawCircle(params: { center: point, radius: number, color: string }) {
        this.canvasContext.save();

        this.canvasContext.beginPath();
        this.canvasContext.arc(params.center.x, params.center.y,
            params.radius, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = params.color;
        this.canvasContext.fill();
        this.canvasContext.closePath();

        this.canvasContext.restore()
    }

    protected drawCircleHere(params: { radius: number, color: string }) {
        this.drawCircle({center: {x: 0, y: 0}, radius: params.radius, color: params.color})
    }

    protected drawRectagle(options: { topLeft: point, width: number, height: number, color: string }) {
        this.canvasContext.save();

        this.canvasContext.beginPath();
        this.canvasContext.rect(options.topLeft.x, options.topLeft.y, options.width, options.height);
        this.canvasContext.fillStyle = options.color;
        this.canvasContext.fill();
        this.canvasContext.closePath();

        this.canvasContext.restore();
    }

    abstract draw(): void;

    public startDraw() {
        this.keepDraw = true;
        this.draw();
    }

    public stopDraw() {
        this.keepDraw = false;
    }


}


/**
 * the model to contorl the Ebbinghaus illusion
 */
class EbbinghausModel extends canvasModel {
    // the distant between the center of the inner ball and the outer ball
    private readonly maxDist = 150;
    private readonly minDist = 30;

    // the radius of the inner ball
    private readonly outerMaxRadius = 70;
    private readonly outerMinRadius = 5;

    // the start and the end of the x coordinate of the inner ball center
    private readonly leftMostInnerCenterXCoord = 50;
    private readonly rightMostInnerCenterXCoord = 400;

    // the radius of the inner ball
    private readonly innerRadius = 20;

    // the time of one round
    private readonly oneRoundTimeInSeconds = 10; // this value needs to be divisible by 60

    // the start position of the guide lines, this require minor geometry calculation
    private readonly guideStartPositionX = Math.sqrt((this.innerRadius) ** 2 + (this.innerRadius / this.canvasHeight * this.canvasWidth) ** 2);
    private readonly guideStartPositionY = this.guideStartPositionX / this.canvasWidth * this.canvasHeight;

    // number of outer ball
    private readonly numOuterBall = 6;

    // the start of the application
    private startTime: Date;

    // the whether to drawGuide
    private drawGuide: boolean = false;

    constructor(startTime: Date) {
        super();
        this.startTime = startTime;
    }

    private getProcess(): number {
        const now = new Date();
        const totalMilliSecPassed = now.getTime() - this.startTime.getTime();
        const oneRoundTimeInMilliSec = this.oneRoundTimeInSeconds * 1000;

        return (totalMilliSecPassed % oneRoundTimeInMilliSec) / oneRoundTimeInMilliSec
    }

    private static getValFromProcessMinToMax(param: { process: number, min: number, max: number }): number {
        if (param.process <= 0.5 && param.process >= 0)  // going forward
            return param.process * 2 * (param.max - param.min) + param.min;
        else if (param.process <= 1)  // going back
            return (1 - param.process) * 2 * (param.max - param.min) + param.min;
        else
            throw "the value of process cannot be larger than 1 or smaller than 0"
    }

    private getCurDist(process: number): number {
        return EbbinghausModel.getValFromProcessMinToMax({process: process, min: this.minDist, max: this.maxDist})
    }

    private getCurOuterRadius(process: number): number {
        return EbbinghausModel.getValFromProcessMinToMax(
            {process: process, min: this.outerMinRadius, max: this.outerMaxRadius})
    }

    private getCurInnerBallCenterXCoor(process: number): number {
        return EbbinghausModel.getValFromProcessMinToMax(
            {process: process, min: this.leftMostInnerCenterXCoord, max: this.rightMostInnerCenterXCoord})
    }

    private getCurInnerBallCenterYCoor(process: number): number {
        return this.getCurInnerBallCenterXCoor(process) / this.canvasWidth * this.canvasHeight
    }

    protected drawIllusionFrame() {
        this.canvasContext.save();

        // gather data
        const process = this.getProcess();
        const innerBallCenterX = this.getCurInnerBallCenterXCoor(process);
        const innerBallCenterY = this.getCurInnerBallCenterYCoor(process);
        const distOuterInner = this.getCurDist(process);
        const outerRadius = this.getCurOuterRadius(process);

        // move the the inner inner ball center
        this.canvasContext.translate(innerBallCenterX, innerBallCenterY);

        // draw the inner circle with dot
        this.drawCircleHere({radius: this.innerRadius, color: "orange"});
        this.drawCircleHere({radius: 3, color: "CornflowerBlue"});

        // draw the outer circles with dot
        let angle;
        for (angle = 0; angle <= 2 * Math.PI; angle += 2 * Math.PI / this.numOuterBall) {
            this.canvasContext.save();
            this.canvasContext.rotate(angle);
            this.canvasContext.translate(0, -distOuterInner);
            this.drawCircleHere({radius: outerRadius, color: "CornflowerBlue"});
            this.drawCircleHere({radius: 3, color: "orange"});
            this.canvasContext.restore();
        }

        this.canvasContext.restore();
    }

    protected drawGuideLinesFrame() {

        // draw the guide line on above
        this.canvasContext.save();

        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.guideStartPositionX, 0);
        this.canvasContext.lineTo(this.canvasWidth, this.canvasHeight - this.guideStartPositionY);
        this.canvasContext.stroke();
        this.canvasContext.closePath();

        this.canvasContext.restore();

        // draw the guide line on the bottom
        this.canvasContext.save();

        this.canvasContext.beginPath();
        this.canvasContext.moveTo(0, this.guideStartPositionY);
        this.canvasContext.lineTo(this.canvasWidth - this.guideStartPositionX, this.canvasHeight);
        this.canvasContext.stroke();
        this.canvasContext.closePath();

        this.canvasContext.restore();
    }

    draw() {

        if (this.keepDraw) {
            this.canvasContext.save();

            // clear canvas
            this.clearCanvas();

            // draw guide lines
            if (this.drawGuide)
                this.drawGuideLinesFrame();

            // draw illusion
            this.drawIllusionFrame();

            this.canvasContext.restore();
            window.requestAnimationFrame(() => new EbbinghausModel(this.startTime).draw());
        }

    }

}


/**
 * the model for Munker-White illusion
 */
class MunkerWhiteModel {

}


$(() => {
    let curModel: canvasModel;

    if ($('#ebbinghaus-illusion').hasClass("active")) {
        curModel = new EbbinghausModel(new Date());
    }

    curModel.startDraw()
});
