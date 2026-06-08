import { sessions } from "../constants.js";

const verifySession = (req, res, next) => {
    const session_id = req.cookies.session_id;
    const gmail = req.cookies.gmail;
    console.log(session_id, "session_id");
    console.log(gmail, "gmail");
    if (!session_id || !gmail) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    if (!sessions[gmail] || sessions[gmail] != session_id) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    req.user = { gmail: gmail };
    next();
}
export { verifySession }