import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", rateLimiter, login);
router.get("/data", (req ,res)=> {
    res.json({
        message : "Server Run Successfuly !"
    })
});

export default router;
