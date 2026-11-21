---
title: "Modern Hopfield networks"
date: 2026-11-20
unlisted: true
series: comp-neuro
order: 3
---
Modern Hopfield networks are variants of Hopfield networks with higher capacity. The first type was proposed by [Krotov and Hopfield](https://arxiv.org/abs/1606.01164) in 2016, and had polynomial memory. Another variant was then proposed by [Demircigil et al](https://arxiv.org/abs/1702.01929), with exponential memory and quick recall (on average, a single update would get to the required state). In [Hopfield networks is all you need](https://arxiv.org/abs/2008.02217), Ramsauer et al. propose a version of this network with continuous, instead of discrete states, and show that one can recover the transformer attention mechanism from these networks.

> all sources switch to the $\pm 1$ spin convention for these networks, including Hopfield, so I will only use that convention here

## Polynomial storage networks

For polynomial storage networks, the main change is to redefine the energy function to $$E = -\sum_{\mu=1}^m  F\left(\sum_{i=1}^N\xi_i^\mu\sigma_i\right)$$ where $F$ is some smooth function. In fact, this is a generalization of the standard energy function, which was given by $$E = -\sum_{i=1}^N\sum_{j=1}^N J_{ij}\sigma_i\sigma_j
= -\sum_{\mu=1}^m \sum_{i=1}^N\sum_{j=1}^N \xi^\mu_i \xi^\mu_j\sigma_i\sigma_j = -\sum_{\mu=1}^m \left(\sum_{i=1}^N \xi^\mu_i \sigma_i\right)^2$$
> Technically this has an extra diagonal term which the original didn't, but that just adds a constant $N$ since $\sigma_i^2 = 1$. We do have to change the update rule to match the generalized one, though

The update rule has to be changed. After choosing an atom $j$, we switch the atom to whatever minimizes the energy. Krotov-Hopfield calculate that this is given by $$\sigma_i^{(t+1)} = \operatorname{sgn}\left[\sum_{\mu=1}^{m}\left(F\Big(\xi_i^\mu + \sum_{j\neq i}\xi_j^\mu\sigma_j^{(t)}\Big) - F\Big(-\xi_i^\mu + \sum_{j\neq i}\xi_j^\mu\sigma_j^{(t)}\Big)\right)\right]$$

They look at energy functions of the form $F = x^n$. They then ask the same question: given a stored pattern $\xi^\mu$, what is the probability that it is stable? They do this by computing the energy difference between $\xi^\mu$ and $\xi^\mu$ with the $i^{\text{th}}$ spin flipped, and find that this difference is $$\Delta E = \sum_{\nu=1}^{m}\Big(\xi_i^\nu\xi_i^\mu + \sum_{j\neq i}\xi_j^\nu\xi_j^\mu\Big)^n - \sum_{\nu=1}^{m}\Big(-\xi_i^\nu\xi_i^\mu + \sum_{j\neq i}\xi_j^\nu\xi_j^\mu\Big)^n,$$
Because the $\xi_i^\nu\xi_i^\mu$ term is added in the first and subtracted in the second, the mean energy difference comes out to $(N)^n - (N-2)^n \sim 2nN^{n-1}$ . Then, they compute the mean value of the cross-talk, and how likely it is to overpower $\Delta E$. By setting this probability to low, they derive that the maximum number of patterns is $$m_{\text{max}} = \alpha_nN^{n-1}$$
where $\alpha$ is some constant. They also derive that the maximum number stored for perfect retrieval is given by $$m_{\text{perfect}} = \frac1{2(2n-3)!!} \frac{N^{n-1}}{\ln N}$$ which recovers our two-dimensional $\frac12 \frac N{\ln N}$

> The double factorial comes from the asymptotic formula for the variance of $\Delta E$

Building on this, [Demircigil et al.](https://arxiv.org/abs/1702.01929) introduce another Hopfield variant, this time with exponential memory capacity. They do this by simply setting $F = e^x$, which can be thought of as the limit of the polynomial functions. Now, there are exponentially many states ($2^N$), so storing exponentially many memories starts to border on the case where a lot of the total states are memorized states. Yet, they show that each state has a large "basin of attraction", i.e. other states that move to that state in the dynamics. [Lucibello and Mézard](https://arxiv.org/abs/2304.14964) calculate the critical constants $\alpha_c$ for these exponential models, and they do it by mapping the crosstalk term onto the Random Energy Model, which we briefly discussed in the [[What is a spin glass network?#Other networks|first post]]!

## Conclusion

We saw how Hopfield networks can be dreamt up from the point of view of a physicist, rather than a neuroscientist. We also saw how the physics literature and terminology helps us tackle these networks mathematically and prove bounds on them, and saw some interesting mathematics along the way. Hopfield networks and their descendants have had a lot of impact on the connections between physics and machine learning. There are other techniques, like diffusion, that give us other bridges between physics and neuroscience. Perhaps these fields are more connected than one would think!

For more information, see [[Exploring Hopfield networks#Further reading]]

Previous: [[Hopfield networks]]
