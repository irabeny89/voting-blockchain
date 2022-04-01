const { candidates } = require("../config")

const Ballot = artifacts.require("Ballot")
module.exports = async deployer => await deployer.deploy(Ballot, candidates)