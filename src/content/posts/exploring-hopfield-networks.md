---
title: "Exploring Hopfield networks"
date: 2026-11-18
unlisted: true
series: comp-neuro
order: 0
---
> Final project for COSC 16: Computational Neuroscience

In class, we looked at Hopfield networks through the lens of neural networks, describing them as recurrent single-layer dense networks. This is not necessarily how Hopfield looked at them. In statistical mechanics, a spin glass network is a type of model for magnets (and more). Each model has many configurations, each with an energy, and over time the system tends to a state that minimizes energy. The Hopfield network is a spin glass network that stores particular memories in its energy function by having the memorized states be minima of the energy.


> [!AI statement] 
> I wrote every word and equation in this project. I used Claude Code to help program the simulations and the website

---
### Posts
[[What is a spin glass network?]]
- [[Spin-glass networks: math supplement]]
[[Hopfield networks]]
[[Modern Hopfield networks]]
[[Experimental data]]

---
### Further reading
If this topic is of interest to you, then here are some sources for further reading, arranged in order of seriousness.

First, on the statistical mechanics side of things
1. I first learned about spin glasses from [this beautiful video on percolation](https://www.youtube.com/watch?v=a-767WnbaCQ), and its [follow up](https://www.youtube.com/watch?v=yEcysu5xZH0) which does some mathematical analysis of the critical temperature (for a lattice gas system, which is a little different from the spin glasses we discussed, but has similar critical behavior). They are incredibly well-made, do some actual mathematics along with pretty visuals, and talk about a lot of different math in this area.
2. [Lewis Cole's blog posts](https://lewiscoleblog.com/spin-glass-models) on spin glasses are detailed yet accessible. He talks about them from the programmer's lens, going into various simulation algorithms and applications to optimization.
3. *Statistical Mechanics of Lattice Systems* by S. Friedli and Y. Velenik, available on [Velenik's website](https://www.unige.ch/~velenik/#/book) (along with lectures and other resources), is a math-y but friendly exploration of these systems.
4. *Information, Physics, and Computation* by M. Mézard and A. Montanari, available on [Montanari's website](https://web.stanford.edu/~montanar/RESEARCH/book.html), is a book introducing statistical mechanics, information theory, and the application of these fields to problems in theoretical computer science. Chapter 5 in this book is a good introduction to the Random Energy Model and Chapter 8 to the mysterious Replica Method. Montanari and Sen also have the less-friendly expository paper [A friendly tutorial on mean-field spin glass techniques for non-physicists](https://arxiv.org/pdf/2204.02909) (by "non-physicists", they mean "mathematicians")

On the machine learning side of things, 
1. [Hopfield networks is all you need](https://ml-jku.github.io/hopfield-layers/#selfatt), a blog post explaining the paper of the same name. Their main thesis is to recover the attention mechanism from transformers inside modern Hopfield networks.
2. ["Walkthrough of "Hopfield Networks are all you need"](https://www.beren.io/2020-11-02-Walkthrough_Hopfield-Networks-Is-All-You-Need/) is a blog post explaining the blog post explaining that paper, going into more detail than the original blog post.


---
## References

1. REM original paper
2. Hopfield original paper
3. Modern Hopfield network original paper
4. Hopfield networks is all you need
