const Ballot = artifacts.require("Ballot"),
  { candidates } = require("../config"),
  { reduceString } = require("../utils")

contract("Ballot", accounts => {
  it("initialize, add candidates & also add chairperson as voter", async () => {
    const ballot = await Ballot.deployed(),
      solidity = (await ballot.candidates(0)).name,
      javascript = (await ballot.candidates(1)).name,
      chairPersonVoteRightCount = (await ballot.voters(accounts[0])).voteRightCount.toNumber()

    assert.deepEqual(candidates, [solidity, javascript], "Not equal. Candidates are not added correctly.")
    assert.equal(typeof chairPersonVoteRightCount, "number", "Chairperson was not added to vote.")
  })
  it(`give voting rights to ${reduceString(accounts[1])} & ${reduceString(accounts[2])}`, async () => {
    const ballot = await Ballot.deployed()
    // voters have 1 voting right each
    await ballot.giveRightToVote(accounts[1])
    await ballot.giveRightToVote(accounts[2])
    const voter1 = await ballot.voters(accounts[1])
    const voter2 = await ballot.voters(accounts[2])

    assert.equal(voter1.voteRightCount.toNumber(), 1)
    assert.equal(voter2.voteRightCount.toNumber(), 1)
  })
  it(`address ${reduceString(accounts[1])} delegate vote right to address ${reduceString(accounts[2])}`, async () => {
    // voters have 1 vote right each
    const ballot = await Ballot.deployed()
    await ballot.delegate(accounts[2], {
      from: accounts[1]
    })
    const voter2 = await ballot.voters(accounts[2])

    assert.equal(voter2.voteRightCount.toNumber(), 2)
  })
  it(`vote a candidate: ${candidates[0]}`, async () => {
    const ballot = await Ballot.deployed()
    await ballot.vote(0, {
      // voter has 2 voting rights from above(initial test case as a delegate)
      from: accounts[2]
    })
    const solidity = await ballot.candidates(0),
      voter = await ballot.voters(accounts[2])

    assert.equal(solidity.voteCount.toNumber(), 2)
  })
  it(`show winning candidate is ${candidates[0]} at index 0`, async () => {
    const ballot = await Ballot.deployed(),
    winningCandidateIndex = await ballot.winningCandidate()
    
    // winning candidate is Solidity at index 0
    assert.equal(winningCandidateIndex.toNumber(), 0)
  })
  it(`announces winner name as ${candidates[0]}`, async () => {
    const ballot = await Ballot.deployed()
    
    assert.equal(await ballot.winnerName(), candidates[0])
  })
})