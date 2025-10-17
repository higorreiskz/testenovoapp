import type { Multer } from "multer";
import type { IUser } from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      file?: Multer.File;
    }
  }
}

export {};
