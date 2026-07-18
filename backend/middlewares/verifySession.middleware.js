import client from "../redis-client.js";

const verifySession = async (req, res, next) => {
    const session_id = req.cookies.session_id;
    const gmail = req.cookies.gmail;
    if (!session_id || !gmail) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    const stored_session_id = await client.get(gmail);
    if (!stored_session_id || stored_session_id != session_id) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    req.user = { gmail: gmail };
    next();
}
export { verifySession }