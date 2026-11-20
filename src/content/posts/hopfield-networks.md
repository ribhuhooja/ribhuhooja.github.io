---
title: "Hopfield networks"
date: 2026-11-20
unlisted: true
series: comp-neuro
order: 2
---
In the [[What is a spin glass network?|previous post]], we saw how spin glass networks model magnetism, and how they can be abstracted in various directions just by changing the Hamiltonian and the interaction matrix $J_{ij}$. In the standard variation (without a magnetic field), the Hamiltonian is a function that takes a state $\{\sigma_k\}_{i=k}^N$ and spits out the energy: $$H(\{\sigma_k\}_{i=k}^N) = -\sum_{i, j} J_{ij}\sigma_i\sigma_j$$
The Hamiltonian, as a function, is entirely defined by the interaction matrix $J$. Hopfield's idea was to store memories inside this Hamiltonian by choosing $J$ so that the remembered states are the minima of the Hamiltonian. Then, if we have an algorithm to find the minima, we would eventually reach minimum.

> [!Notation]
> We were thinking of the spins $\sigma_i$ as belonging to atoms; we might as well now pretend that they are the firing patterns of neurons. I will use "atom" and "neuron" interchangeably from now on.
> 
> Unfortunately, an atom's spin is in $\{\pm 1\}$ but a neuron's activation is in $\{0, 1\}$. Hopfield uses the neuron convention, but most physics sources use the atom convention. Even Hopfield uses the atom convention in later papers. I will use $\sigma_i$ to mean spin and $y_i$ to mean neuron-value; they are related by $\sigma_i = 2y_i-1$

## Hebbian learning and recovery

We saw the algorithm for deciding $J$ based on patterns $\xi^1, \xi^2, \ldots, \xi^m$ (our numbering convention is that $\xi_i^\mu$ is the $i^{\text{th}}$ atom/neuron of the $\mu^{\text{th}}$ pattern), which is Hebbian learning: 

$$J_{ij} = J_{ji} = \sum_{\mu=1}^m \xi^\mu_i\xi^\mu_j$$ (and also set $J_{ii} = 0$) 

The update rule from class was: first choose a neuron $i$, and set $\operatorname{net}_j = \sum_{j}J_{ij}y_j$, then $$y_j = \begin{cases}1 & \operatorname{net}_j > 0\\0 & \operatorname{net}_j < 0\\ y_j & \operatorname{net}_j = 0\end{cases}$$  
> In fact Hopfield didn't specify the $\operatorname{net}_j = 0$ case

> [!Theorem] This process eventually terminates, reaching a stable state

> [! Proof]
> Define an energy function $$E = -\frac12 \sum_{i\neq j} J_{ij}y_i y_j$$ 
> Suppose we change $V_j$ by $\Delta V_j$, then $$\Delta E = -\Delta V_j \sum_{i \neq j} J_{ij} V_i = -\operatorname{net}_j$$
> If $\operatorname{net}_j > 0$, then we set $\Delta V_j$ to be $1$, if possible, by setting the new $y_j$ to be $1$. In this case if $y_j$ was previously zero, $\Delta V_j = 1$, otherwise, it is zero. A similar analysis holds for if $\operatorname{net}_j < 0$. Thus, if we flip $y_j$ at all, we decrease the energy. This means we can never have a cycle, so our walk on the finite graph of states must end. When it ends, the state it reaches will have a lower energy than its neighbors, and is thus a local minimum.

This whole setup is quite similar to our spin glass setup! Let's compare the formula for the energy with that for the Hamiltonian we had been using: $$E = -\sum_{(i, j)} J_{ij}\left(\frac{\sigma_i + 1}2\right)\left(\frac{\sigma_j + 1}2\right) = -\frac14\sum_{(i, j)}J_{ij}(\sigma_i\sigma_j + \sigma_i + \sigma_j +1)$$

The $+1$ term at the end can be ignored, and the $\sigma_i\sigma_j$ gives us the Hamiltonian, but then there's the extra linear terms. What do we do with them? Well, we talked about biasing the whole system by applying a magnetic field in the last post. This is like that, except we are applying a magnetic field at each atom separately. Let $b_i = \sum_{j \neq i} J_{ij}$, then we get $$E = -\frac14H + 2\sum_i b_i \sigma_i + c$$ Even the update rule can be understood in terms of spin glass dynamics. Recall that we flip if and only if it decreases the energy. That is the $T \to 0$ limit of the Metropolis-Hastings algorithm. If $\Delta E < 0$, $\min(1, e^{-\frac {\Delta E}T}) = 1$  and we flip; if $\Delta E > 0$, then as $T \to 0$, $e^{-\frac {\Delta E}T} \to 0$ and we don't flip.

## Storage capacity


TODO: attraction basin? Recovery with/without error


Thus, this is approximately linear in its capacity. In the next post, we will see a modified variant of the Hopfield network, called the Modern Hopfield network. There are different versions of it, but even the simplest one (proposed by [Krotov and Hopfield](https://arxiv.org/abs/1606.01164) in 2016) has polynomial capacity, while the later one by [Demircigil et al](https://arxiv.org/abs/1702.01929) has *exponential* capacity.

Next: [[Modern Hopfield networks]]

Previous: [[What is a spin glass network?]]

Up: [[Exploring Hopfield networks|Project main page]]
