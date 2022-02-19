const Sequelize = require('sequelize')
const InvitationsModel = require('../src/models/Invitations');

const sequelize = (process.env.NODE_ENV === 'test')
?
new Sequelize('sqlite::memory:', { logging: false })
:
new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logging: false,
});


const invitations = InvitationsModel(sequelize, Sequelize);

sequelize.sync({}).then(() => {
    console.log('DB synchronized !');
}).catch(err => console.log(err));

module.exports = {
    invitations
};
