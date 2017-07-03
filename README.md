# Raft Consensus Algorithm

Raft is a consensus algorithm designed as an alternative to Paxos. It was meant to be more understandable than Paxos by means of separation of logic, but it is also formally proven safe and offers some additional features.

## The Basics

All nodes starts as a `Follower` and will remain in this state until the `Heartbeat Timeout` has been exceeded.

* The `Election Timeout` has been exceeded.

OR 

* The `Heartbeat Timeout` has been exceeded.

![](https://github.com/barend-erasmus/raft-consensus-algorithm/raw/master/images/raft-consensus-algorithm-1.png)

### Follower to Candidate

When the `Heartbeat Timeout` has been exceeded, the node changes from a `Follower` to a `Candidate`.

The node also set its `Election Timeout` to a random value between 150ms - 300ms.

![](https://github.com/barend-erasmus/raft-consensus-algorithm/raw/master/images/raft-consensus-algorithm-2.png)

### Candidate to Leader

To be continued..

