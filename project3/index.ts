import {EbbinghausModel} from "./EModel"

$(()=> {
    if ($('#ebbinghaus-illusion').hasClass("active")) {
        new EbbinghausModel(new Date()).draw()
    }
});
