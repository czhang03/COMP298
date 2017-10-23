import {canvasModel} from './canvasModel'

export class EbbinghausModel extends canvasModel {
    // the distant between the center of the inner ball and the outer ball
    private readonly maxDist = 150;
    private readonly minDist = 30;

    // the radius of the inner ball
    private readonly outerMaxRadius = 70;
    private readonly outerMinRadius = 5;

    // the start and the end of the x coordinate of the inner ball center
    private readonly leftMostInnerCenterXCoord = this.activeDisplayCanvas.width / 2;
    private readonly rightMostInnerCenterXCoord = this.activeDisplayCanvas.width - 10;


    // the radius of the inner ball
    private readonly innerRadius = 20;

    // the time of one round
    private readonly oneRoundTimeInSeconds = 8;

    // the start position of the guide lines
    private readonly guideStartposition = Math.sqrt(2) * this.innerRadius;

    // number of outer ball
    private readonly numOuterBall = 6;

    private timeStart: Date;

    constructor (timeStart: Date) {
        super();
        this.timeStart = timeStart;
    }

    private getProcess(): number {
        const now = new Date();
        const secPassed = now.getSeconds() - this.timeStart.getSeconds();
        const milliSecPassed = now.getMilliseconds() - this.timeStart.getMilliseconds();
        const totalMilliSecPassed = secPassed * 1000 + milliSecPassed;

        return totalMilliSecPassed / this.oneRoundTimeInSeconds * 1000
    }

    private static getValHelper(param:{process: number, min: number, max: number}): number {
        if (param.process > 0.5)  // going forward
            return param.process * 2 * (param.max - param.min) + param.min;
        else if (param.process <= 1)  // going back
            return (1 - param.process) * 2 * (param.max - param.min) + param.min;
        else
            throw "the value of process cannot be larger than 1"
    }

    private getCurDist(process: number): number {
        return EbbinghausModel.getValHelper({process: process, min: this.minDist, max: this.maxDist})
    }

    private getCurOuterRadius(process: number): number {
        return EbbinghausModel.getValHelper(
            {process: process, min: this.outerMinRadius, max: this.outerMaxRadius})
    }

    private getCurInnerBallCenterXCoor(process: number): number {
        return EbbinghausModel.getValHelper(
            {process: process, min: this.leftMostInnerCenterXCoord, max: this.rightMostInnerCenterXCoord})
    }

    private getCurInnerBallCenterYCoor(process: number): number {
        return this.getCurInnerBallCenterXCoor(process) / this.activeDisplayCanvas.width * this.activeDisplayCanvas.height
    }

    protected drawInnerCircleWithDot() {
        let angle;
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
        this.drawCircle({center: {x: 0, y: 0}, radius: this.innerRadius, color: "orange"});
        this.drawCircle({center: {x: 0, y: 0}, radius: 10, color: "blue"});

        // draw the outer circles with dot
        for (angle = 0; angle <= 2*Math.PI; angle += 2*Math.PI/this.numOuterBall)
            this.canvasContext.save();
            this.canvasContext.rotate(angle);
            this.canvasContext.translate(0, - distOuterInner);
            this.drawCircle({center: {x: 0, y: 0}, radius: outerRadius, color: "blue"});
            this.drawCircle({center: {x: 0, y: 0}, radius: 10, color: "orange"});
            this.canvasContext.restore();

        this.canvasContext.restore();
    }


}
