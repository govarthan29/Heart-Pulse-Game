import express from "express"
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { signup } from "../controllers/auth/signup.js";
import { userData } from "../controllers/user/userData.js";
import { addCoins } from "../controllers/user/addCoins.js";
import { getAllUsers } from "../controllers/user/getAllUsers.js";

const router = express.Router();

router.post("/signup", signup )
router.post("/login", login )
router.post("/logout", logout )
router.post("/userData", userData )
router.post("/addCoins", addCoins )
router.get("/users", getAllUsers);
export default router;