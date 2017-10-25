/// <reference path="../node_modules/@types/jquery/index.d.ts"/>

type point = { x: number, y: number }

/**
 * the model to control the canvas
 *
 * @class CanvasModel - the canvas model
 */
abstract class CanvasModel {
    private readonly activeDisplayCanvas = <HTMLCanvasElement> $(".active .display canvas").get(0);
    protected readonly activeDisplayConfig = <HTMLFormElement> $(".active .display form").get(0);
    protected get canvasWidth() {
        return this.activeDisplayCanvas.width;
    }
    protected get canvasHeight () {
        return this.activeDisplayCanvas.height;
    }

    protected keepDraw: boolean = true;

    private readonly canvasContextNullable = this.activeDisplayCanvas.getContext('2d');

    abstract readonly startTime: Date;
    abstract oneRoundTimeInSeconds: number;

    /**
     * the none nullable version of canvas context 2d
     * @returns {CanvasRenderingContext2D}
     */
    protected get canvasContext() {
        if (!this.canvasContextNullable)
            throw "canvas context 2d not found, please check spelling";
        else
            return this.canvasContextNullable;
    }

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

    protected getProcess(): number {
        const now = new Date();
        const totalMilliSecPassed = now.getTime() - this.startTime.getTime();
        const oneRoundTimeInMilliSec = this.oneRoundTimeInSeconds * 1000;

        return (totalMilliSecPassed % oneRoundTimeInMilliSec) / oneRoundTimeInMilliSec
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
class EbbinghausModel extends CanvasModel {
    // the distant between the center of the inner ball and the outer ball
    public maxDist = 150;
    public minDist = 30;

    // the radius of the inner ball
    public outerMaxRadius = 70;
    public outerMinRadius = 5;

    // the radius of the inner ball
    public innerRadius = 20;

    // the start position of the guide lines, this require minor geometry calculation
    private get guideStartPositionX() {
        return Math.sqrt((this.innerRadius) ** 2 + (this.innerRadius / this.canvasHeight * this.canvasWidth) ** 2);
    }
    private get guideStartPositionY() {
        return this.guideStartPositionX / this.canvasWidth * this.canvasHeight;
    }

    // number of outer ball
    public numOuterBall = 6;

    // the start and the end of the x coordinate of the inner ball center
    private get topMostInnerCenterYCoord(){
        return this.minDist + this.outerMinRadius + 5;  // 5 is the margin
    }
    private get bottomMostInnerCenterYCoord() {
        return this.canvasHeight - this.maxDist - this.outerMaxRadius - 5;  // 30 is the margin
    }

    // the start of the application
    readonly startTime: Date;

    // the time of one round
    oneRoundTimeInSeconds = 10; // this value needs to be divisible by 60

    // the whether to drawGuide
    private drawGuide: boolean = false;

    constructor(startTime: Date) {
        super();
        this.startTime = startTime;
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

    private getCurInnerBallCenterYCoor(process: number): number {
        return EbbinghausModel.getValFromProcessMinToMax(
            {process: process, min: this.topMostInnerCenterYCoord, max: this.bottomMostInnerCenterYCoord})
    }

    private getCurInnerBallCenterXCoor(process: number): number {
        return this.getCurInnerBallCenterYCoor(process) / this.canvasHeight * this.canvasWidth
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


        this.canvasContext.save();

        // clear canvas
        this.clearCanvas();

        // draw guide lines
        if (this.drawGuide)
            this.drawGuideLinesFrame();

        // draw illusion
        this.drawIllusionFrame();

        this.canvasContext.restore();

        // draw the next frame
        if (this.keepDraw) {
            window.requestAnimationFrame(() => {
                this.draw()
            });
        }

    }

    public toggleGuideLines() {
        this.drawGuide = !this.drawGuide;
    }

}


/**
 * the model for Munker-White illusion
 */
class SineIllusionModel extends CanvasModel {
    readonly startTime: Date;
    oneRoundTimeInSeconds = 8;

    numBars = 100;  // the number of bars displayed on the screen
    barHeight = 30;  // the height of each bar
    amplitude = 100;  // the amplitude of the wave (the dist between the center of highest the bar and the center of the canvas)

    private get barWidth() {  // the width of each bar
        return this.canvasWidth / this.numBars / 2;
    }
    private get gapWidth() { // the width of the gap (same as the width of the bar)
        return this.barWidth;
    }

    constructor(startTime: Date) {
        super();
        this.startTime = startTime;
    }

    private getBarsXStarts(): Array<number> {

        // generates an array from 0 to numBars
        // and then times the barWidth and the gap width
        return Array.from(Array(this.numBars).keys(), (x) => x * (this.barWidth + this.gapWidth))
    }

    private getBarsXYStarts(process: number): Array<point> {

        const XStartYCenters = this.getBarsXStarts().map((xStarts) => {
            return {xStarts: xStarts, yCenter: this.amplitude * Math.sin(xStarts + process * 2 * Math.PI)}
        });

        return XStartYCenters.map((param: { xStarts: number, yCenter: number }) => {
            return {x: param.xStarts, y: param.yCenter - this.barHeight / 2}
        })
    }

    draw() {


        const process = this.getProcess();
        const getBarsXYStarts = this.getBarsXYStarts(process);

        this.canvasContext.save();
        this.clearCanvas();

        // move the the vertical center of the canvas
        this.canvasContext.translate(0, this.canvasHeight / 2);

        getBarsXYStarts.forEach((p: point) => {
            this.drawRectagle({topLeft: p, height: this.barHeight, width: this.barWidth, color: "gray"})
        });

        this.canvasContext.restore();

        // draw the next frame
        if (this.keepDraw) {
            window.requestAnimationFrame(() => {
                this.draw()
            })
        }
    }
}


function makeActiveModel(): CanvasModel {
    if ($('#ebbinghaus-illusion').hasClass("active"))
        return new EbbinghausModel(new Date());
    else if ($('#sine-illusion').hasClass("active"))
        return new SineIllusionModel(new Date());
    else
        throw "no illusion is active";
}

function getActiveillusionName(): string {
    if ($('#ebbinghaus-illusion').hasClass("active"))
        return "Ebbinghaus Illusion";
    else if ($('#sine-illusion').hasClass("active"))
        return "Sine Illusion";
    else
        throw "no illusion is active";
}

function toggleActiveIllusion(prevActiveModel: CanvasModel): CanvasModel {

    // stop the old animation
    prevActiveModel.stopDraw();

    // name the selector
    const ebbinghausSelector = $('#ebbinghaus-illusion');
    const sineSelector = $('#sine-illusion');

    // toggle the active class and re-register events
    if (ebbinghausSelector.hasClass("active")){
        ebbinghausSelector.removeClass("active");
        sineSelector.addClass("active");
    }

    else if (sineSelector.hasClass("active")) {
        sineSelector.removeClass("active");
        ebbinghausSelector.addClass("active");
    }
    else
        throw "no illusion is active";

    // initialize the active model
    const activeModel = makeActiveModel();
    initActiveModel(activeModel);
    return activeModel
}

function initIllusionCommonProperty(activeModel: CanvasModel) {
    $(".illusion .display form .stop").click(() => {
        activeModel.stopDraw()
    });
    $(".illusion .display form .resume").click(() => {
        activeModel.startDraw()
    });

    const oneRoundTimeSelector = $(".illusion .display form .oneRoundTimeInSeconds");
    oneRoundTimeSelector.val(activeModel.oneRoundTimeInSeconds);
    oneRoundTimeSelector.keyup((event) => {
        activeModel.oneRoundTimeInSeconds = Number($(event.currentTarget).val())
    });
}

function registerEbbinghausIllusionProperty(activeModel: EbbinghausModel) {
    const maxDistSelector = $(".illusion .display #maxDist");
    maxDistSelector.val(activeModel.maxDist);
    maxDistSelector.change((event) => {
        activeModel.maxDist = Number($(event.currentTarget).val())
    });

    const minDistSelector = $(".illusion .display #minDist");
    minDistSelector.val(activeModel.minDist);
    minDistSelector.change((event) => {
        activeModel.minDist = Number($(event.currentTarget).val())
    });

    const outerMaxRadiusSelector = $(".illusion .display #outerMaxRadius");
    outerMaxRadiusSelector.val(activeModel.outerMaxRadius);
    outerMaxRadiusSelector.change((event) => {
        activeModel.outerMaxRadius = Number($(event.currentTarget).val())
    });

    const outerMinRadiusSelector = $(".illusion .display #outerMinRadius");
    outerMinRadiusSelector.val(activeModel.outerMinRadius);
    outerMinRadiusSelector.change((event) => {
        activeModel.outerMinRadius = Number($(event.currentTarget).val())
    });

    const innerRadiusSelector = $(".illusion .display #innerRadius");
    innerRadiusSelector.val(activeModel.innerRadius);
    innerRadiusSelector.change((event) => {
        activeModel.innerRadius = Number($(event.currentTarget).val())
    });

    const numOuterBallSelector = $(".illusion .display #numOuterBall");
    numOuterBallSelector.val(activeModel.numOuterBall);
    numOuterBallSelector.keyup((event) => {
        activeModel.numOuterBall = Number($(event.currentTarget).val())
    });

    $(".illusion .display #guideLines").click(() => {
        activeModel.toggleGuideLines()
    });

}

function registerSineIllusionProperty(activeModel: SineIllusionModel) {
    const barHeightSelector = $(".illusion .display #barHeight");
    barHeightSelector.val(activeModel.barHeight);
    barHeightSelector.change((event) => {
        activeModel.barHeight = Number($(event.currentTarget).val())
    });

    const amplitudeSelector = $(".illusion .display #amplitude");
    amplitudeSelector.val(activeModel.amplitude);
    amplitudeSelector.change((event) => {
        activeModel.amplitude = Number($(event.currentTarget).val())
    });

    const numBarSelector = $(".illusion .display #numBars");
    numBarSelector.val(activeModel.numBars);
    numBarSelector.keyup((event) => {
        activeModel.numBars = Number($(event.currentTarget).val())
    });

}

function initActiveModel(activeModel: CanvasModel) {
    initIllusionCommonProperty(activeModel);

    if (activeModel instanceof EbbinghausModel) {
        registerEbbinghausIllusionProperty(activeModel)
    }
    else if (activeModel instanceof SineIllusionModel) {
        registerSineIllusionProperty(activeModel);
    }
    else
        throw "the type of active model is unknown";

    $("header #illusion-name").text(getActiveillusionName());
    activeModel.startDraw()
}


$(() => {

    // make the active model
    let activeModel = makeActiveModel();

    // register the event handler
    $("nav .nav-but").click(() => {
        activeModel = toggleActiveIllusion(activeModel);
    });

    // starts the active model
    initActiveModel(activeModel);

});
