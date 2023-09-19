const fs = require('fs');
const path = require('path');

class FileManager {
  constructor(baseDirectory) {
    this.baseDirectory = baseDirectory;
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
}

module.exports = FileManager;
