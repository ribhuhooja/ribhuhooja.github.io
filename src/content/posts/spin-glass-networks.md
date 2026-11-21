---
title: "What is a spin glass network?"
date: 2026-11-19
unlisted: true
series: comp-neuro
order: 1
---
John Hopfield is a physicist. Earlier in his career, he worked on quantum-mechanical properties of crystals, condensed-matter physics, and molecular biology. How did he invent a neural network? To him, this was a natural thing to do. He was familiar with a certain kind of physical model, called a spin glass network, and he was also following developments in computer science and neural networks. He had the right combination of backgrounds and has had enormous success (a Nobel prize!) because of how he combined them.

To understand his perspective, we will have to understand spin glass networks. Spin-glass networks are a toy model of magnetism. They are simple to describe, and (sometimes) simple to analyze, but still exhibit a lot of interesting mathematics and phenomena, like phase transitions. They are the favorite child of statistical physicists on the physics side and probabilists on the math side. The 2022 fields medallist Hugo Duminil-Copin won his medal for solving some of the problems arising from spin glass networks, especially about phase transition temperatures.

## What is a spin-glass network?

Consider the following phenomenon, which is an inspiration for spin glass networks. Iron is not magnetized on its own, but if you rub it against a magnet long enough, it turns into a magnet. It is attracted to magnets, and if it is magnetized, retains the magnetization. Such materials are called ferromagnets. Inside a ferromagnet, we have atoms with unpaired electrons. The spin directions of these unpaired electrons produce a magnetic field with a certain orientation. Nearby unpaired electrons often point in the same direction, creating same-pointing "domains." However, there are many domains, and they point in widely different directions, cancelling the overall magnetization. When an external magnetic field comes into play, it slowly aligns all the domains. When it is switched off, the domains remain aligned, because that is energetically more favorable. This is why we get permanent magnetization.

A simple model for this behavior is the following. Imagine that the atoms were all placed at regular intervals, i.e. on a *lattice*. In two dimensions, this would be like putting the atoms on grid-points ($\mathbb Z^2 \subset \mathbb R^2$), but we could put them on any $\mathbb Z^d \subset \mathbb R^d$ where $d$ is the dimension. For our purposes, let's think about the two-dimensional case. Each atom is assigned a direction: up, or down. 

Now we construct an energy, or *Hamiltonian* $H$. Each atom has four neighbors; if a pair of neighbors has the same sign, we think of that pair as subtracting one from the energy. If they have a different sign, they add one to the energy: $$H = -\sum_{(i, j) \, \text{neighbors}} \sigma_i\sigma_j$$
There are $2^N$ total states of the system, if there are $N$ atoms. Each state has an associated energy $H$. If we index the states $S_1, S_2, \ldots, S_{2^N}$ and their respective energies $H_1, H_2, \ldots, H_{2^N}$, then the probability that the system is in a given state is decided by the *Boltzmann distribution*:

$$P[S_i] = \frac{e^{-\frac {H_i}T}}{\sum_{j=1}^{2^N}e^{-\frac {H_j}T}}$$

Here, $T$ is a parameter called *temperature*, and the denominator $Z = \sum_{j=1}^{2^N}e^{-\frac {H_j}T}$ is called the *partition function*. The parameter $T$ should be thought of as controlling randomness. As $T \to \infty$, each $e^{-\frac {H_j}T}$ goes to 1, so the relative probabilities of each of the states equalize. On the other hand, as $T \to 0$, then each probability goes to 0, but the relative probability of each state goes to 0 faster if $H_i$ is larger. Thus, only the lowest energy states are favored. We call these two different possibilities the "high temperature" and "low temperature" regime.

> Sometimes $\frac 1T$ is written as $\beta$, the inverse temperature. We won't use it here but it does make a lot of formulas easier

In the following simulation of a spin glass, try moving the slider to adjust temperature!

<div data-widget="ising"></div>

> [!note] How do we simulate one of these? 
> 
> We have a probability distribution on states given by the Boltzmann distribution, but we also have to figure out how to "sample" the probability distribution i.e. get states in accordance to the probability rule. There are a bunch of ways of doing this, but the most standard one is called the "Metropolis-Hastings algorithm."
> 
>  The idea behind the algorithm is to start at a random state, then choose an atom to flip. This produces a new state with a new energy (and because we just flipped a single atom, the energy difference is easy to calculate). Then, we choose the new state with probability $\min(1, e^{-\frac{\Delta H}T})$ and do this many many times. We could also flip in a sweep from left-to-right instead of one atom, flip in a chessboard pattern (because differently colored squares of a chessboard don't interact), etc.

In this simulation, you can see a clear difference between the high-temperature and low-temperature *phases*. When the temperature is high, fluctuations dominate, and you get a random mess. At low temperatures, an atom is much more likely to be in the same spin as its neighbors, so we get large domains of the same spin. This transition happens at a *critical temperature* $T_c$, which is around $2.269$.

What happens *at* the critical point? Theoretically, in the infinitely large lattice limit, we see neither domains nor randomness but *fractals*. The behavior of these systems at the critical temperature is a fascinating phenomenon, and it even led Hopfield and others to conjecture the critical brain hypothesis: the brain operates at the critical parameters between different phases.

> This is exactly the same meaning of "phase" as in the phrase "phases of matter." From a statistical mechanics point of view, a phase of matter is exactly the large-scale probabilistic behavior of small independent parts. Also see: Lattice gas models.
## Other networks
The specific network described above is called the *Ising model*, named after Ernst Ising. The main property of this model is that atoms only interact with their adjacent atoms, and that atoms favor being in the same spin as their neighbors. Both of these properties can be generalized.

Suppose we have $N$ atoms in our system. For every pair of atoms $(i, j)$, we can decide if that pair of atoms interacts, and how it interacts. We encode this in an *interaction matrix* $J$. If we don't want that pair to interact at all, we set $J_{ij} = 0$. If we want the pair to prefer being in the same spin state, we set $J_{ij} = 1$; if not, we set it to $-1$. We're only doing this once per pair, so $J_{ij} = J_{ji}$ and $J$ is a symmetric matrix. Thus, the general equation becomes $$H = -\sum_{(i, j)} J_{ij}\sigma_i\sigma_j$$
(We're only doing this once per pair, so $J_{ij} = J_{ji}$ and $J$ is a symmetric matrix)

Sometimes we globally bias the system by adding a magnetic field $h$, giving us the Hamiltonian $$H = -\sum_{(i, j)} J_{ij}\sigma_i\sigma_j - h\sum_i\sigma_i$$ 
<div data-widget="ising-field"></div>

> Suppose $h$ is large, and we run the simulation. Then it would strongly bias the $\sigma_i$ to be $+1$, "magnetizing" the whole model. If you then switch off the magnetic field, if $T$ is low, the system will be stuck at mostly $+1$. If you raise the temperature, random fluctuations will dominate again and we "lose magnetization." Even such a simple model can recover physical behavior!

In the Ising model, we set $J_{ij}$ to 1 if $i$ and $j$ are neighbors and zero otherwise. In the Sherrington-Kirkpatrick (SK) model, one forgets all geometry and chooses each $J_{ij}$ as an independent random variable (or all $+1$, or by any other scheme). A model that does this is called a "mean field model." While not visually appealing, the SK model has the benefit of being easier to compute.

There are more generalizations. In the Potts model, there are discretely many spins instead of just 2, and $\sigma_i \sigma_j$ is replaced by $2(\delta(\sigma_i, \sigma_j)-1)$ i.e. $+1$ if same and $-1$ if different. In the NK model, not only are there interactions $J_{ij}$ associated to pairs, but also $J_{ijk}$ to triples, and so on (here $N$ is the number of atoms and $K$ the number of atoms per interaction; $K=3$ means that we don't go beyond $J_{ijk}$. Hence,  "$NK$ model". Truly a feat of naming). In the Random Energy Model (REM), we forget that the energies $H_1, H_2, \ldots, H_{2^N}$ are associated to atoms at all and just sample $2^N$ numbers per some Gaussian.

Perhaps my favorite version of these is the $XY$ model. It is like the Ising model, except spins are allowed to take any angle value from $0$ to $2\pi$, instead of just up and down. The interaction between neighbors is proportional to $\cos(\theta_i - \theta_j)$, so if they point in the same direction energy is minimized, just like the Ising model. When we simulate this model (for instance using colors to represent angles), in the low-temperature regime we see "vortices" and "anti-vortices" that act like charges attracting and repelling each other (for a simulation see [this](https://www.ibiblio.org/e-notes/Perc/xy.htm)). This is incredibly interesting behavior for such a simple model!

<div data-widget="xy"></div>

## Some other applications

In the [[Hopfield networks|next post]], we will see an application of the spin glass idea to neural networks. However, these are not the only applications of spin glass networks. One of the applications in optimization problems. The main idea is to encode some kind of optimization problem into the Hamiltonian of a spin glass system. For instance, one can map a 3-SAT type problem onto the atoms in the system and put formulas into the interaction matrix. The goal is to find a configuration that minimizes the energy.

<div data-widget="ising-draw"></div>

> When you draw on this, it makes new regions. Crossing region walls has a -1 edge, not +1

One way of doing this is called "simulated annealing." This is the idea of starting the system at a high temperature and slowly cooling it down. Conceptually, this is just like having a large step size for gradient descent and then making it smaller as time goes on. When the temperature is high, the probability difference between a high energy state and a low energy state is smaller, so states are explored more randomly. In the low temperature regime, states that are low-energy (compared to their neighbors) are much more likely. Thus, at the start the system explores states semi-randomly, and as it cools it starts to have a stronger and stronger preference for stabler states. This means that the area of configuration space that is explored at the start is large, and starts to shrink as time goes on. This means that more space is searched and the chances of ending up in a local minimum that is far from optimal are low.

> These two dynamics are called "quenching" (instantly reducing temperature) and "annealing" (slowly dropping). Not to be confused with quenched and annealed disorder, which are two different types of models. In quenched disorder, the couplings $J_{ij}$ are frozen as the spins vary, while in annealed disorder, both the couplings and the spins vary at similar timescales. 


Next: [[Hopfield networks]]

[[Exploring Hopfield networks|Back to project main page]]
