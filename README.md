# Raft Consensus Algorithm

Raft is a consensus algorithm designed as an alternative to Paxos. It was meant to be more understandable than Paxos by means of separation of logic, but it is also formally proven safe and offers some additional features.

## The Basics

All nodes start as a `Follower` and will remain in this state until the `Heartbeat Timeout` has been exceeded.


![](https://github.com/barend-erasmus/raft-consensus-algorithm/raw/master/images/raft-consensus-algorithm-1.png)

### Follower to Candidate

When the `Heartbeat Timeout` has been exceeded, the node changes from a `Follower` to a `Candidate`.

The node also set its `Election Timeout` to a random value between 150ms - 300ms.


![](https://github.com/barend-erasmus/raft-consensus-algorithm/raw/master/images/raft-consensus-algorithm-2.png)

### Candidate to Leader

When the `Election Timeout` has been exceeded, the node requests a vote from each of the nodes.


![](https://github.com/barend-erasmus/raft-consensus-algorithm/raw/master/images/raft-consensus-algorithm-3.png)


A node will only vote if they haven't voted in this `Term` otherwise it will decline the vote. When the `Candidate` received votes from the majority of nodes, it will declare itself as the `Leader` and start sending a `Heartbeat` to the other nodes.

## Where is the Raft Consensus Algorithm Used?

* [Redis](https://redis.io/topics/cluster-spec)
* [Consul](https://www.consul.io/docs/internals/consensus.html)