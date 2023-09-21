const fs = require('fs');
const path = require('path');

import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
const firebaseConfig  = require('../firebaseConfig');
const fapp = initializeApp(firebaseConfig);
const storage = getStorage(fapp, 'gs://knowshare-18e4c.appspot.com/');

export default class FileManager {
  constructor(){
    this.baseDirectory = 'knowshare-files';
  }

  createDirectoriesIfNotExist(dirPath) {
    const fullPath = path.join(this.baseDirectory, dirPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  static saveFile(baseDirectory, dirPath, fileName, fileData) {
    const fileManager = new FileManager(baseDirectory);
    fileManager.createDirectoriesIfNotExist(dirPath);
    const filePath = path.join(baseDirectory, dirPath, fileName);
    fs.writeFileSync(filePath, fileData);
    return path.relative(baseDirectory, filePath);
  }

  static async saveFileToFirebaseStorage(filepath, fileType, fileData) {
    try {
      const storageRef = ref(storage, filepath);
      const metadata = {
        contentType: fileType,
      };
      const snapshot = await uploadBytesResumable(storageRef, fileData, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch(error) {
      console.error(error);
      return;
    }
  }
}
