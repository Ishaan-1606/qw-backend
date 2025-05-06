import {Router} from 'express'
import { getAllUsers, userLogin, userLogout, userSignUp, verifyUser } from '../controllers/user-controllers.js';
import {loginValidator, signUpValidator, validate} from '../utils/validators.js'
import { verifyToken } from '../utils/token-manager.js';

const userRoutes=Router();
userRoutes.get("/",getAllUsers);
userRoutes.post("/signUp",validate(signUpValidator),userSignUp);
userRoutes.post("/login",validate(loginValidator),userLogin);
userRoutes.get("/auth-status",verifyToken,verifyUser);
userRoutes.get("/logout",verifyToken,userLogout);

export default userRoutes;