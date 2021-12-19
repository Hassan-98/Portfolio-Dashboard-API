const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const path = require('path');
const sharp = require('sharp');

const serviceAccount = {
  "type": process.env.SA_type,
  "project_id": process.env.SA_project_id,
  "private_key_id": process.env.SA_private_key_id,
  "private_key": process.env.SA_private_key.replace(/\\n/g, '\n'),
  "client_email": process.env.SA_client_email,
  "client_id": process.env.SW_client_id,
  "auth_uri": process.env.SA_auth_uri,
  "token_uri": process.env.SA_token_uri,
  "auth_provider_x509_cert_url": process.env.SA_auth_provider_x509_cert_url,
  "client_x509_cert_url": process.env.client_x509_cert_url
}

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${process.env.SA_project_id}.appspot.com`
});

const bucket = getStorage().bucket();

// Upload Function
const uploadImageToStorage = file => {
  return new Promise(async (resolve, reject) => {

    // File Type Filter
    const fileType = file.mimetype.split("/")[0]
    if (!file || fileType != "image") return reject("The selected file is not an image");

    // File Size Filter
    const maxFileSize = 5 * ( 1024 * 1024 )
    if (file.size > maxFileSize) return reject("Image size is more than 5MB");
    

    // File Extention Filter
    const fileExtention = path.extname(file.originalname);
    const whitelistExtentions = [".jpg", ".jpeg", ".png"]
    if (whitelistExtentions.indexOf(fileExtention.toLowerCase()) == -1) return reject("Image type is not supported");
    
    // Use Sharp to compress image
    var compressedFile = null;
    
    switch (fileExtention) {
      case ".jpg": {
        compressedFile = await sharp(file.buffer).jpeg({
          quality: 50,
          mozjpeg: true,
          progressive: true
        }).toBuffer();
        
        break;
      }
      case ".jpeg": {
        compressedFile = await sharp(file.buffer).jpeg({
          quality: 50,
          mozjpeg: true,
          progressive: true
        }).toBuffer();
        
        break;
      }
      case ".png": {
        compressedFile = await sharp(file.buffer).png({
          quality: 60,
          compressionLevel: 9,
          progressive: true
        }).toBuffer();
        
        break;
      }
      default:
        break;
    }
    
    if (!compressedFile) return reject("An error occurred");

    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on("error", error => {
      reject(error);
    });

    blobStream.on("finish", () => {
      resolve(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(fileUpload.name)}?alt=media`);
    });

    blobStream.end(compressedFile);
  }); 
};

function extractName(url) {
  var spUrl = url.split("/");
  return spUrl[spUrl.length - 1].split("?")[0];
}

module.exports = {
  bucket,
  uploadImageToStorage,
  extractName,
}
