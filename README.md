# Raft Consensus Algorithm

Raft is a consensus algorithm designed as an alternative to Paxos. It was meant to be more understandable than Paxos by means of separation of logic, but it is also formally proven safe and offers some additional features.

## The Basics

All nodes starts as a `follower` and will remain in this state until:

* The `Election Timeout` has been exceeded.

OR 

* The `Heartbeat Timeout` has been exceeded.

![](https://github.com/barend-erasmus/raft-consensus-algorithm/raw/master/images/raft-consensus-algorithm-1.png)

## To be continued...
