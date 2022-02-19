module.exports = (sequelize, types) => {
    return sequelize.define('invitations', {
        id: {
            type: types.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: types.STRING,
            unique: true
        },
        invitationCode: {
            type: types.STRING,
            unique: true
        },
        nInvits: {
            type: types.INTEGER,
        },
        referees: {
            type: types.STRING,
        }
    });
}