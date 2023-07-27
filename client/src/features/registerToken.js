import bcrypt from "bcryptjs";

export default async function generateToken(size) {
    let randomToken = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < size; i++) {
        randomToken += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    // Generate token with brcypt
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) reject(err);
            else {
                bcrypt.hash(randomToken, salt, (err, hashedToken) => {
                    if (err) reject(err);
                    else resolve(hashedToken);
                });
            }
        });
    });
}
