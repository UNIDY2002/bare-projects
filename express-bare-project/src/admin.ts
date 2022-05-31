import express from "express";
import { User } from "./models";
import { createHash } from "crypto";
import { Joi, validate } from "express-validation";

const router = express.Router();

const hash = (s: string) => createHash("sha256").update(s).digest("hex");

const loginSchema = {
    body: Joi.object({
        username: Joi.string().max(20).required(),
        password: Joi.string().required(),
    }),
};

router.post("/register", validate(loginSchema), async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if ((await User.findByPk(username)) !== null) {
            res.status(400).json({ msg: "用户名重复" });
        }
        await User.create({
            username: username,
            password: hash(password),
        });
        res.json({});
    } catch (e) {
        next(e);
    }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const r = await User.findByPk(username);
        if (r === null) {
            res.status(400).json({ msg: "用户名或密码错误。" });
            return;
        }
        if (!r.admin) {
            res.status(400).json({ msg: "用户不是管理员。" });
            return;
        }
        const hashedPassword = hash(password);
        if (hashedPassword !== r.password) {
            res.status(400).json({ msg: "用户名或密码错误。" });
            return;
        }
        // @ts-ignore
        req.session.username = username;
        res.json({});
    } catch (e) {
        next(e);
    }
});

export default router;
