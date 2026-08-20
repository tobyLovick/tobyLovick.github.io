# Bayesian Inference: A Tutorial from First Principles

**A ground-up introduction to Bayesian inference, with emphasis on evidence and model comparison in cosmology.**

---

## Welcome

This tutorial teaches Bayesian inference from conditional probability through to evidence calculation methods used in cosmology. Its core philosophy: **Bayesian evidence for model comparison is more valuable than point estimates or parameter constraints alone.**

### Why This Perspective?

In modern cosmology, we often care more about **detecting new physics** than precisely measuring known parameters. Bayesian evidence provides a rigorous framework to ask:

- "Is dark energy evolving, or is it a cosmological constant?"
- "Do we need additional parameters to explain the data?"
- "Which systematic model best describes our observations?"

Evidence comparison naturally implements Occam's razor and provides direct probability statements about competing theories.

---

## Start Here

**If you're completely new to Bayesian inference:**

1. [[conditional-probability]] - The foundation
2. [[bayes-theorem]] - The fundamental theorem
3. [[bayesian-inference]] - Applying Bayes to science
4. [[evidence]] - The key to model comparison

**If you already understand Bayes' theorem:**

- Start with [[evidence]] to see why it matters
- Jump to [[model-comparison]] for applications
- Explore [[computing-evidence]] for practical methods

**If you're here for cosmology applications:**

- [[cmb-analysis]] - Cosmic Microwave Background example
- [[dark-energy-models]] - Model comparison in action
- [[gpu-acceleration]] - Modern computational methods

---

## The Bayesian Hierarchy

This tutorial follows a natural progression in inference complexity:

```
Conditional Probability
        ↓
   Bayes' Theorem
        ↓
Parameter Inference (Posterior distributions)
        ↓
Model Comparison (Evidence)
```

Each level builds on the previous, increasing in both complexity and scientific value.

---

## Navigation Tips

- Pages are interlinked using `[[wiki-style]]` brackets
- Click any linked term to explore that concept
- Mathematical rigor increases gradually through the tutorial
- Code examples are provided for key methods
- All claims are cited to primary literature

---

## About This Tutorial

This tutorial draws from PhD research on efficient Bayesian evidence calculation for cosmological model comparison, including:

- GPU-accelerated nested sampling
- Non-Gaussian likelihood analysis
- Simulation-based inference methods
- Applications to CMB, supernovae, and weak lensing data

The perspective throughout is that of a practitioner who has implemented these methods at scale and worked with real data.

---

## Quick Links

**Core Concepts:**
- [[conditional-probability]] - Foundation of Bayesian reasoning
- [[bayes-theorem]] - Inverting probabilities
- [[bayesian-inference]] - Parameter estimation framework
- [[evidence]] - The marginalized likelihood
- [[model-comparison]] - Comparing theories with Bayes factors

**Computational Methods:**
- [[nested-sampling]] - Direct evidence calculation
- [[mcmc]] - Markov Chain Monte Carlo sampling
- [[computing-evidence]] - Practical methods comparison

**Applications:**
- [[cmb-analysis]] - Nearly-Gaussian posteriors
- [[supernovae-analysis]] - Non-linear degeneracies
- [[cosmic-shear]] - High-dimensional problems

**Advanced Topics:**
- [[gpu-acceleration]] - Modern hardware utilization
- [[simulation-based-inference]] - When likelihoods are intractable

---

**Let's begin:** [[conditional-probability]] →
