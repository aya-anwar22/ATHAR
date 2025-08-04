const jwt = require("jsonwebtoken");

// generateTokens 
async function generateTokens(user, regenerateRefreshToken = false) {
    const accessToken = jwt.sign(
        { userId: user.id,role: user.role, userName:user.userName },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    let refreshToken = user.refreshToken;
    let refreshTokenExpiry = user.refreshTokenExpiry;

    if (regenerateRefreshToken || !refreshToken || new Date() > refreshTokenExpiry) {
        refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "10d" }
        );
        refreshTokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

        user.set({ refreshToken, refreshTokenExpiry });
        await user.save(); 
    }

    return { accessToken, refreshToken, refreshTokenExpiry };
}
module.exports =generateTokens