# Raft Consensus Algorithm

Raft is a consensus algorithm designed as an alternative to Paxos. It was meant to be more understandable than Paxos by means of separation of logic, but it is also formally proven safe and offers some additional features.

## The Basics

### All Servers:

* If commitIndex > lastApplied: increment lastApplied, apply log[lastApplied] to state machine.
* If RPC request or response contains term T > currentTerm: set currentTerm = T, convert to follower.

### Followers:

* Respond to RPCs from candidates and leaders
* If election timeout elapses without receiving AppendEntries RPC from current leader or granting vote to candidate: convert to candidate

### Candidates:

* On conversion to candidate, start election:
    * Increment currentTerm
    * Vote for self
    * Reset election timer
    * Send RequestVote RPCs to all other servers
* If votes received from majority of servers: become leader
* If AppendEntries RPC received from new leader: convert to follower
* If election timeout elapses: start new election

### Leaders:

* Upon election: send initial empty AppendEntries RPCs (heartbeat) to each server; repeat during idle periods to prevent election timeouts
* If command received from client: append entry to local log, respond after entry applied to state machine
* If last log index ≥ nextIndex for a follower: send AppendEntries RPC with log entries starting at nextIndex
    * If successful: update nextIndex and matchIndex for follower
    * If AppendEntries fails because of log inconsistency: decrement nextIndex and retry
* If there exists an N such that N > commitIndex, a majority of matchIndex[i] ≥ N, and log[N].term == currentTerm: set commitIndex = N.

## Where is the Raft Consensus Algorithm Used?

* [Redis](https://redis.io/topics/cluster-spec)
* [Consul](https://www.consul.io/docs/internals/consensus.html)

## Sources:

[In Search of an Understandable Consensus Algorithm
](https://raft.github.io/raft.pdf)