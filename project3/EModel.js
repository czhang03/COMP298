"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var canvasModel_1 = require("./canvasModel");
var EbbinghausModel = (function (_super) {
    __extends(EbbinghausModel, _super);
    function EbbinghausModel(timeStart) {
        var _this = _super.call(this) || this;
        _this.maxDist = 150;
        _this.minDist = 30;
        _this.outerMaxRadius = 70;
        _this.outerMinRadius = 5;
        _this.leftMostInnerCenterXCoord = _this.activeDisplayCanvas.width / 2;
        _this.rightMostInnerCenterXCoord = _this.activeDisplayCanvas.width - 10;
        _this.innerRadius = 20;
        _this.oneRoundTimeInSeconds = 8;
        _this.guideStartposition = Math.sqrt(2) * _this.innerRadius;
        _this.numOuterBall = 6;
        _this.timeStart = timeStart;
        return _this;
    }
    EbbinghausModel.prototype.getProcess = function () {
        var now = new Date();
        var secPassed = now.getSeconds() - this.timeStart.getSeconds();
        var milliSecPassed = now.getMilliseconds() - this.timeStart.getMilliseconds();
        var totalMilliSecPassed = secPassed * 1000 + milliSecPassed;
        return totalMilliSecPassed / this.oneRoundTimeInSeconds * 1000;
    };
    EbbinghausModel.getValHelper = function (param) {
        if (param.process > 0.5)
            return param.process * 2 * (param.max - param.min) + param.min;
        else if (param.process <= 1)
            return (1 - param.process) * 2 * (param.max - param.min) + param.min;
        else
            throw "the value of process cannot be larger than 1";
    };
    EbbinghausModel.prototype.getCurDist = function (process) {
        return EbbinghausModel.getValHelper({ process: process, min: this.minDist, max: this.maxDist });
    };
    EbbinghausModel.prototype.getCurOuterRadius = function (process) {
        return EbbinghausModel.getValHelper({ process: process, min: this.outerMinRadius, max: this.outerMaxRadius });
    };
    EbbinghausModel.prototype.getCurInnerBallCenterXCoor = function (process) {
        return EbbinghausModel.getValHelper({ process: process, min: this.leftMostInnerCenterXCoord, max: this.rightMostInnerCenterXCoord });
    };
    EbbinghausModel.prototype.getCurInnerBallCenterYCoor = function (process) {
        return this.getCurInnerBallCenterXCoor(process) / this.activeDisplayCanvas.width * this.activeDisplayCanvas.height;
    };
    EbbinghausModel.prototype.drawInnerCircleWithDot = function () {
        var angle;
        this.canvasContext.save();
        var process = this.getProcess();
        var innerBallCenterX = this.getCurInnerBallCenterXCoor(process);
        var innerBallCenterY = this.getCurInnerBallCenterYCoor(process);
        var distOuterInner = this.getCurDist(process);
        var outerRadius = this.getCurOuterRadius(process);
        this.canvasContext.translate(innerBallCenterX, innerBallCenterY);
        this.drawCircle({ center: { x: 0, y: 0 }, radius: this.innerRadius, color: "orange" });
        this.drawCircle({ center: { x: 0, y: 0 }, radius: 10, color: "blue" });
        for (angle = 0; angle <= 2 * Math.PI; angle += 2 * Math.PI / this.numOuterBall)
            this.canvasContext.save();
        this.canvasContext.rotate(angle);
        this.canvasContext.translate(0, -distOuterInner);
        this.drawCircle({ center: { x: 0, y: 0 }, radius: outerRadius, color: "blue" });
        this.drawCircle({ center: { x: 0, y: 0 }, radius: 10, color: "orange" });
        this.canvasContext.restore();
        this.canvasContext.restore();
    };
    return EbbinghausModel;
}(canvasModel_1.canvasModel));
exports.EbbinghausModel = EbbinghausModel;
//# sourceMappingURL=EModel.js.map