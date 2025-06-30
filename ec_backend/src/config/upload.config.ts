import * as multer from 'multer';

export const multerMemoryStorage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (1024bytes = 1Kb * 1024kb = 1MB)
  },
});
