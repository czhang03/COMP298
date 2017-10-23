"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvasModel = (function () {
    function canvasModel() {
        this.activeDisplayCanvas = $(".active .display canvas").get(0);
        this.activeDisplayConfig = $(".active .display form").get(0);
        this.canvasContext = this.activeDisplayCanvas.getContext('2d');
    }
    canvasModel.prototype.clearCanvas = function () {
        this.canvasContext.clearRect(0, 0, this.activeDisplayCanvas.width, this.activeDisplayCanvas.height);
    };
    canvasModel.prototype.drawCircle = function (params) {
        this.canvasContext.save();
        this.canvasContext.arc(params.center.x, params.center.y, params.radius, 0, 2 * Math.PI);
        this.canvasContext.fillStyle = params.color;
        this.canvasContext.fill();
        this.canvasContext.restore();
    };
    canvasModel.prototype.drawRectagle = function (options) {
        this.canvasContext.save();
        this.canvasContext.rect(options.topLeft.x, options.topLeft.y, options.width, options.height);
        this.canvasContext.fillStyle = options.color;
        this.canvasContext.fill();
        this.canvasContext.restore();
    };
    return canvasModel;
}());
exports.canvasModel = canvasModel;
//# sourceMappingURL=canvasModel.js.map