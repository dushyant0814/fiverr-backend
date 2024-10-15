const Sequelize = require('sequelize');
const ProfileModel = require('./profile');
const ContractModel = require('./contract');
const JobModel = require('./job');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
});

const Profile = ProfileModel(sequelize);
const Contract = ContractModel(sequelize);
const Job = JobModel(sequelize);

// Run `.associate` if it exists,
// ie create relationships in the ORM
[Profile, Contract, Job].forEach(model => {
  if (model.associate) {
    model.associate({ Profile, Contract, Job });
  }
});

module.exports = {
  sequelize,
  Profile,
  Contract,
  Job
};