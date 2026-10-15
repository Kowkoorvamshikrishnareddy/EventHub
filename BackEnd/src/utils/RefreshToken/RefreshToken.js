import jwt from "jsonwebtoken";

export const createRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};
