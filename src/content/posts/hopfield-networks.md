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

The purpose of the Hopfield network is to take an initial pattern, and find which stored pattern is closest to it. The fewer patters are stored in the network, the more likely that we end up at a stored pattern. There are also *spurious states*, which are stable states that were not stored. Moreover, sometimes. we are only interested in recovering a state from a corrupted version of that state, such as finding an image from just half of the given image.

The capacity of a network is how many states it can store while still being able to recall them approximately correctly. How can we estimate the capacity of a Hopfield network? The standard approaches to this problem come from statistical mechanics. Here we have to distinguish between two different types of recall. *Perfect recall* means that we end up at exactly one of the stored states, while *approximate recall* means that it's fine if we end up within a certain threshold (say $5\%$) of a stored state.

Unfortunately, it turns out that there are vastly more spurious states than stored states. To test perfect recall, we always have to start close to a stored state and see if we end up exactly at that stored state. To get a theoretical bound for perfect recall, McEliece et al. compute the probability that a given stored states ends up being a stable state at all. This should give us an upper bound to the perfect recall capacity, though it does not account for spurious states.

For a pattern $\xi^\mu$ to be stable, each of its bits $\xi^\mu_j$ should be unflippable. In an update rule, we calculate $$\sum_i J_{ij} \xi^\mu_i = \xi^\mu_j + \sum_{i\neq j} J_{ij} \xi^\mu_i = \xi^\mu_j + \frac1N \sum_{\nu \neq \mu} \sum_{i\neq j} \xi^\nu_i \xi^\nu_j \xi^\mu_i$$
(where we just expanded the definition of $J_{ij}$). If all the other patterns were 0, then we would just have $\xi_j^\mu$, which is called the *signal*. The other term, $\frac1N \sum_{\nu \neq \mu} \sum_{i\neq j} \xi^\nu_i \xi^\nu_j \xi^\mu_i$, is called the *crosstalk* and represents the "attraction" that other states are putting on a given stable state. Assuming Gaussian stored states, McEliece at all computer the value of the crosstalk as a random variable, and conclude that the probability of a bit error is $Ne^{-\frac N{2m}}$ (where $m$ is the number of stored patterns), so the perfect recall capacity is approximately $$m < \frac N{2 \ln N}$$

One could also look at the capacity for approximate recall. In [Storing Infinite Numbers of Patterns in a Spin-Glass Model of Neural Networks](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.55.1530), Amit et al. compute this capacity. This is much harder and requires a lot more sophisticated statistical physics. They use a powerful and strange technique called the the *Replica method* or the *Replica trick.* Their findings are that there is a critical threshold $\alpha_c$, where if the load $\alpha = m/N < \alpha_c$ , approximate recall works very well, and above it, it quickly stops working at all. This is another example of a phase transition!

> [!note] The Replica trick
> The replica trick is a statistical physics technique for studying these kinds of system at *quenched disorder* i.e. with fixed coupling parameters but varying spins. At some point, the calculation needs to estimate $\mathbb E[\log(Z)]$ where $Z$ is the partition function $\sum_i e^{-\beta H_i}$, $\beta = \frac 1T$. This is hard, so one uses the identity $$\log(Z) = \lim_{n\to 0} \frac{Z^n - 1}{n}$$
> 
> The interpretation of this technique is that $Z^n$ is the partition function of $n$ independent systems. However, this is incredibly hand-wavey, because $n$ must then be an integer, so we cannot do $n \to 0$, and the systems are not independent. Somehow, this trick still works. It was introduced in the 70s by Giorgio Parisi and others and only rigorously proved in the 2000s. Giorgio Parisi won the 2021 Nobel Prize in physics for his contributions to statistical physics (among other things)

From this computation, Amit et al. conclude that $\alpha_cN \sim 0.138N$ is the asymptotic capacity of the network when we relax the recovery condition to approximate recall. Thus, asymptotically, approximate recall can store $\log N$ more memories than perfect recall. 

> These constants are for the Hebbian learning pattern. With different learning algorithms, and different distributions of stored vectors, the specific constants can be increased, though memory is still linear

## Experimental verification

I wrote a Hopfield network, and tested the capacity (with a small amount of error acceptable), to see if I could recover a number around $0.138$
```python
import numpy as np

rng = np.random.default_rng()

def create_hopfield(dimension, patterns):
    hopfield = np.zeros((dimension, dimension))
    scale = 1/dimension
    for i in range(dimension):
        for j in range(dimension):                
            hopfield[i, j] = scale * sum([(2*pattern[i]-1) * (2*pattern[j]-1) for pattern in patterns])
    for i in range(dimension):
        hopfield[i, i] = 0

    return hopfield

def generate_pattern(dimension):
    return rng.integers(0, 2, size=dimension)

def generate_patterns(num_patterns, dimension):
    return [generate_pattern(dimension) for _ in range(num_patterns)]


## if we do random updates, it's hard to tell when a stable state is reached
## so we do a random-order sweep through them all, and terminate if the sweep didn't flip any neuron
def run_hopfield(hopfield, start_pattern):
    dim = len(hopfield)
    curr = start_pattern
    order = np.arange(dim)
    while True:
        rng.shuffle(order)
        flipped = False
        for j in order:
            yj = curr[j]
            netj = hopfield[j] @ curr
            curr[j] = 1 if netj > 0 else (0 if netj < 0 else yj)
            if curr[j] != yj: flipped = True

        if not flipped:
            return curr



def corrupt(pattern, noise):
    flip = rng.random(len(pattern)) < noise
    return np.where(flip, 1 - pattern, pattern)



## generate num_tests random states and see what fraction of them end up near saved state, where "near" is defined as being 95% similar to
def test_memory(hopfield, original_patterns, num_tests, threshold=0.95, noise=0.1):
    successful = 0
    for _ in range(num_tests):
        target = original_patterns[rng.integers(len(original_patterns))]
        result = run_hopfield(hopfield, corrupt(target, noise))
        if np.mean(result == target) >= threshold:
            successful += 1
    return successful / num_tests


## Check the success percentage of a Hopfield of a given dimension storing a given number of patterns
def check_memory(dimension, num_patterns, num_tests):
    original_patterns = generate_patterns(num_patterns, dimension)
    hopfield = create_hopfield(dimension, original_patterns)
    return test_memory(hopfield, original_patterns, num_tests)


N = 1000
for num in range(50, 200, 25):
    success = check_memory(N, num, 500)
    print(f"The retrieval accuracy of a size {N} Hopfield network with {num} memorized patterns is: {success}")

```

My results were
| Patterns $m$ | Load $m/N$ | Retrieval accuracy |
| -----------: | ---------: | -----------------: |
| 50           | 0.050      | 1.000              |
| 75           | 0.075      | 0.802              |
| 100          | 0.100      | 0.048              |
| 125          | 0.125      | 0.000              |
| 150          | 0.150      | 0.000              |
| 175          | 0.175      | 0.000              |

Huh?! This is much lower than expected! This is Hopfield's original algorithm, and its recall is less that $0.075$, not $0.138$. In fact, when we look at the $0.138$ paper, we see that they used the Hamiltonian $H = - \sum_{i, j} J_{ij} \sigma_i \sigma_j$, not the $E$ that Hopfield used. The implementation difference is to simply use $\pm 1$ spins instead of $0, 1$ neuron activations.

```python
## The only lines I had to change were:
def generate_pattern(dimension):
    return 2*rng.integers(0, 2, size=dimension) - 1

# in create_hopfield
hopfield[i, j] = scale * sum([pattern[i] * pattern[j] for pattern in patterns])

# the update rule
curr[j] = 1 if netj > 0 else (-1 if netj < 0 else yj)

```

From this, I recovered the capacity around $1.4$:

| Patterns $m$ | Load $m/N$ | Retrieval accuracy |
| -----------: | ---------: | -----------------: |
| 50           | 0.050      | 1.000              |
| 75           | 0.075      | 1.000              |
| 100          | 0.100      | 1.000              |
| 125          | 0.125      | 0.946              |
| 150          | 0.150      | 0.600              |
| 175          | 0.175      | 0.138              |

These were experiments on approximate recall. One might hope that running perfect recall experiments would give us the $N/\log N$ bound, but unfortunately all that bound tells us is that beyond that number of memories, stored memories are no longer stable states. We have to be careful to start very close to the original state, otherwise we end up at a spurious state that is very close to the original state. With this caveat, we do see that for $N=1000$, perfect recall stores about $\frac N{2 \ln N} \approx 72$ memories

| Patterns $m$ | Load $m/N$ | Perfect recall rate |
| -----------: | ---------: | ------------------: |
| 60           | 0.060      | 1.000               |
| 70           | 0.070      | 0.964               |
| 80           | 0.080      | 0.836               |
| 90           | 0.090      | 0.586               |
| 100          | 0.100      | 0.460               |
| 110          | 0.110      | 0.386               |

Thus, a Hopfield network is linear in its capacity. In the next post, we will see a modified variant of the Hopfield network, called the Modern Hopfield network. There are different versions of it, but even the simplest one (proposed by [Krotov and Hopfield](https://arxiv.org/abs/1606.01164) in 2016) has polynomial capacity, while the later one by [Demircigil et al](https://arxiv.org/abs/1702.01929) has *exponential* capacity.

Next: [[Modern Hopfield networks]]

Previous: [[What is a spin glass network?]]

Up: [[Exploring Hopfield networks|Project main page]]
