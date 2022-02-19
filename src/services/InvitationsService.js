const { invitations } = require('../../config/database');
const sequelize = require('sequelize');

module.exports = class InvitationsService {

    static async generateCode(userId) {
        console.log("generate");
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 8 ; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
        }

        const dupe = await invitations.findOne({
            userId: userId,
        }).then().catch((err) => { console.log(err); });

        if (!dupe) {
            await invitations.create({
                userId: userId,
                invitationCode: result,
                nInvits: 0,
                referees: `[]`
            }).then().catch((err) => { console.log(err); });
            console.log("Created");
        } else {
            await invitations.update({
                userId: userId,
                invitationCode: result,
            }, {
                where: {
                   userId: userId,
                }
            }).then().catch((err) => { console.log(err); });
        }

        return result;
    }

    static async onCodeUse(code, uid) {
        const entry = await invitations.findOne({
            where: {
                invitationCode: code
            }
        }).then().catch((err) => { console.log(err); });

        if(entry){
            const referees = JSON.parse(entry.referees);
            const isExists = referees.find((ref) => {
                return ref === uid;
            });

            if (!isExists) {
                referees.push(uid);
                await invitations.update({
                    nInvits: sequelize.literal('nInvits + 1'),
                    referees: JSON.stringify(referees)
                }, {
                    where: {
                        invitationCode: code
                    }
                });
                return "Approved !";
            } else {
                return "This code has already been used";
            }
        } else {
            return "Code not found !";
        }
    }
}