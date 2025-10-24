import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp') // Specify the destination directory for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Specify the filename for the uploaded file
    }
});

 export const upload = multer({ 
     storage ,
     });