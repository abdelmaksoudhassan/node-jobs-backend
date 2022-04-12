const Sequelize = require('sequelize');
const sequelize = require('../connection');

const ClientJob = sequelize.define('client_job', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = ClientJob;
