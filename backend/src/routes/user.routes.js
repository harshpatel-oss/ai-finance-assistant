import { Router } from "express";
import 
{ 
    registerUser ,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single('avatar'),registerUser);

router.route('/login').post(loginUser)

//secured routes - verifyJWT middleware lagana pdta hae

router.route("/logout").post(verifyJWT,logoutUser) //logoutUser
router.route("/refresh-token").post(refreshAccessToken) //refresh token logic 
router.route("/current-user").get(verifyJWT, getCurrentUser); //get current user details
export default router;
