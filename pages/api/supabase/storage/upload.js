// Backend
import formidable from 'formidable';
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {

    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
    if (err) {
        res.end(err);
        return;
    }
    var oldpath = files.files.filepath;
    var newpath = '/Users/stewiethepro/Documents/hamlet/' + files.files.newFilename;
    fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        console.log("files: ", files);
        console.log("newpath: ", newpath);
        console.log("oldpath: " + oldpath);
        res.write(200, 'File uploaded and moved!');
        res.end();
    });
    console.log("files: ", files);
    console.log("newpath: ", newpath);
    console.log("oldpath: " + oldpath);
    let theFile = files.files.filepath;
    console.log("theFile: " + theFile);

    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    // res.end(theFile);
    });  


//   const form = new formidable.IncomingForm();
//   form.uploadDir = "./";
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     console.log(err, fields, files);
//   });
};

export default handler;