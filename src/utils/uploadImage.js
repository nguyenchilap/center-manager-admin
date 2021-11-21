const multer  = require('multer');
const fs = require('fs-extra');

module.exports = {
    uploadCourseImg:
        multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                const d = new Date();
                const path = `src/public/img/courses/${d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + "-" + req.body.name}`;
                fs.ensureDirSync(path);
                callback(null, path);
            },
            filename: (req, file, cb) => {
                cb(null , `${file.originalname}`);
            }
        })
        }),
}
