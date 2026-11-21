---
title: "Exploring Hopfield networks"
date: 2026-11-18
unlisted: true
series: comp-neuro
order: 0
---
> Final project for COSC 16: Computational Neuroscience, Fall 2026

In class, we looked at Hopfield networks through the lens of neural networks, describing them as recurrent single-layer dense networks. This is not necessarily how Hopfield looked at them. In statistical mechanics, a spin glass network is a type of model for magnets (and more). Each model has many configurations, each with an energy, and over time the system tends to a state that minimizes energy. The Hopfield network is a spin glass network that stores particular memories in its energy function by having the memorized states be minima of the energy.

In this series of posts, I will introduce spin glass networks, and then talk about Hopfield networks and their modern variants. Modern Hopfield networks are particularly interesting because the 2020 paper "Hopfield Networks is All You Need" (sic) explains how modern Hopfield networks can recover the Transformer attention mechanism. I will also talk about the math (and very sketchily, the physics) behind these things, indicating (for instance) how we derive the capacities of Hopfield networks.

> [!AI statement] 
> I wrote the posts and the code for the storage capacity experiments myself. I used Claude Code to help program the the website and the Ising-spin widgets on it.

---
### Posts
[[What is a spin glass network?]]
[[Hopfield networks]]
[[Modern Hopfield networks]]

---
### Further reading
If this topic is of interest to you, then here are some sources for further reading, arranged in order of seriousness.

On the statistical mechanics side of things,
1. I first learned about spin glasses from [this beautiful video on percolation](https://www.youtube.com/watch?v=a-767WnbaCQ), and its [follow up](https://www.youtube.com/watch?v=yEcysu5xZH0) which does some mathematical analysis of the critical temperature (for a lattice gas system, which is a little different from the spin glasses we discussed, but has similar critical behavior). They are incredibly well-made, do some actual mathematics along with pretty visuals, and talk about a lot of different math in this area.
2. [Lewis Cole's blog posts](https://lewiscoleblog.com/spin-glass-models) on spin glasses are detailed yet accessible. He talks about them from the programmer's lens, going into various simulation algorithms and applications to optimization.
3. *Statistical Mechanics of Lattice Systems* by S. Friedli and Y. Velenik, available on [Velenik's website](https://www.unige.ch/~velenik/#/book) (along with lectures and other resources), is a math-y but friendly exploration of these systems.
4. *Information, Physics, and Computation* by M. Mézard and A. Montanari, available on [Montanari's website](https://web.stanford.edu/~montanar/RESEARCH/book.html), is a book introducing statistical mechanics, information theory, and the application of these fields to problems in theoretical computer science. Chapter 5 in this book is a good introduction to the Random Energy Model and Chapter 8 to the mysterious Replica Method. Montanari and Sen also have the less-friendly expository paper [A friendly tutorial on mean-field spin glass techniques for non-physicists](https://arxiv.org/pdf/2204.02909) (by "non-physicists", they mean "mathematicians")

On the machine learning side of things, 
1. [Hopfield networks is all you need](https://ml-jku.github.io/hopfield-layers/#selfatt), a blog post explaining the paper of the same name. Their main thesis is to recover the attention mechanism from transformers inside modern Hopfield networks.
2. [Walkthrough of "Hopfield Networks are all you need"](https://www.beren.io/2020-11-02-Walkthrough_Hopfield-Networks-Is-All-You-Need/) is a blog post explaining the blog post explaining that paper, going into more detail than the original blog post.
3. [Modern methods in associative memory](https://arxiv.org/abs/2507.06211), co-written by the Krotov who co-introduced modern Hopfield networks, unifies all the different Hopfield variants, along with other things like transformers, into a single framework.


---
## References

1. _Neural Networks and Physical Systems with Emergent Collective Computational Abilities_, J. J. Hopfield. Proc. Natl. Acad. Sci. USA **79**(8), 2554–2558 – **Published April 1982**. DOI: [https://doi.org/10.1073/pnas.79.8.2554](https://doi.org/10.1073/pnas.79.8.2554)
2. _The Capacity of the Hopfield Associative Memory_, R. J. McEliece, E. C. Posner, E. R. Rodemich, S. S. Venkatesh. IEEE Trans. Inf. Theory **33**(4), 461–482 – **Published July 1987**. DOI: [https://doi.org/10.1109/TIT.1987.1057328](https://doi.org/10.1109/TIT.1987.1057328)
3. _Storing Infinite Numbers of Patterns in a Spin-Glass Model of Neural Networks_, D. Amit, H. Gutfreund, H. Sompolinsky. Phys. Rev. Lett. **55**, 1530 – **Published 30 September 1985**. DOI: [https://doi.org/10.1103/PhysRevLett.55.1530](https://doi.org/10.1103/PhysRevLett.55.1530)
4. _Dense Associative Memory for Pattern Recognition_, D. Krotov, J. J. Hopfield. Advances in Neural Information Processing Systems **29** (NIPS 2016), 1172–1180. arXiv: [https://arxiv.org/abs/1606.01164](https://arxiv.org/abs/1606.01164)
5. _On a Model of Associative Memory with Huge Storage Capacity_, M. Demircigil, J. Heusel, M. Löwe, S. Upgang, F. Vermet. J. Stat. Phys. **168**, 288–299 – **Published 2017**. DOI: [https://doi.org/10.1007/s10955-017-1806-y](https://doi.org/10.1007/s10955-017-1806-y)
6. _Hopfield Networks is All You Need_, H. Ramsauer, B. Schäfl, J. Lehner, P. Seidl, M. Widrich, T. Adler, L. Gruber, M. Holzleitner, M. Pavlović, G. K. Sandve, V. Greiff, D. Kreil, M. Kopp, G. Klambauer, J. Brandstetter, S. Hochreiter. ICLR 2021. arXiv: [https://arxiv.org/abs/2008.02217](https://arxiv.org/abs/2008.02217)
