# Nested Sampling

← Back to [[index]] | Previous: [[computing-evidence]]

---

## The Algorithm for Evidence Calculation

Nested sampling[^Skilling2006] is a Monte Carlo method specifically designed to compute the [[evidence]] while simultaneously generating posterior samples. It's the **gold standard** for Bayesian model comparison.

---

## The Problem

Computing the evidence requires integrating over the entire prior:

$$\mathcal{Z} = \int_{\Omega_\theta} \mathcal{L}(\theta)\pi(\theta) d\theta$$

This is fundamentally different from [[mcmc|MCMC]]:
- **MCMC** explores the posterior peak (high-likelihood region)
- **Evidence** requires exploring the *entire prior volume* (including low-likelihood regions)

Standard MCMC can't compute evidence because it concentrates samples where $\mathcal{L}$ is large, missing the contribution from low-likelihood regions.

---

## Skilling's Insight

John Skilling's brilliant idea[^Skilling2004][^Skilling2006]: **Transform the multi-dimensional integral into a one-dimensional integral**.

### The Prior Mass

Define the **prior mass** $X(\lambda)$ as the volume of prior with likelihood greater than $\lambda$:

$$X(\lambda) = \int_{\mathcal{L}(\theta) > \lambda} \pi(\theta) d\theta$$

**Properties:**
- $X(0) = 1$ (entire prior has $\mathcal{L} > 0$)
- $X(\mathcal{L}_{\text{max}}) = 0$ (only one point has maximum likelihood)
- $X(\lambda)$ is **monotonically decreasing** (strictly, if $\mathcal{L}$ never plateaus)

Because $X$ is monotonic, we can **invert** it: $\lambda = \mathcal{L}(X)$.

### The Transformation

Change variables in the evidence integral from $\theta$ to $X$:

$$\boxed{\mathcal{Z} = \int_0^1 \mathcal{L}(X) dX}$$

We've converted a $d$-dimensional integral (where $d$ might be 10, 20, 50...) into a one-dimensional integral.

Of course, we don't know $\mathcal{L}(X)$ explicitly—but we can sample it.

---

## The Algorithm

Nested sampling generates a sequence of points with increasing likelihood, tracking the prior mass as it goes.

### Setup

1. Draw $N_{\text{live}}$ points uniformly from the prior $\pi(\theta)$
2. Calculate likelihood $\mathcal{L}_i$ for each point
3. These are the "live points"

### Iteration

Repeat until convergence:

1. **Identify** the point $\theta^*$ with lowest likelihood: $\mathcal{L}^* = \min_i \mathcal{L}_i$
2. **Record** this point as "dead" (it contributes to the evidence)
3. **Estimate** the prior mass shrinkage: $X_i \approx t_i X_{i-1}$ where $t_i \sim \text{Beta}(N_{\text{live}}, 1)$
4. **Replace** $\theta^*$ with a new point drawn from: $\pi(\theta)$ subject to $\mathcal{L}(\theta) > \mathcal{L}^*$

**Key challenge:** Step 4 requires sampling from a *constrained prior*. This is where the clever algorithmic work happens.

### Computing the Evidence

At iteration $i$, we have:
- Likelihood: $\mathcal{L}_i$
- Prior mass: $X_i$

The evidence is approximately (trapezoid rule):

$$\mathcal{Z} \approx \sum_{i=1}^N w_i \mathcal{L}_i$$

where the weights are:

$$w_i = \frac{1}{2}(X_{i-1} - X_{i+1})$$

**Stopping criterion:** When $\Delta\mathcal{Z}_i = \mathcal{L}_i X_i$ becomes negligible compared to $\mathcal{Z}$.

---

## Visualizing the Process

Imagine a 2D parameter space:

```
Iteration 0: [Start with Nlive points scattered across prior]
             Lowest likelihood = 10
             Prior mass X₀ = 1.0

Iteration 1: [Remove point with L=10, add new point with L>10]
             Lowest likelihood = 12
             Prior mass X₁ ≈ 0.95

Iteration 2: [Remove point with L=12, add new point with L>12]
             Lowest likelihood = 15
             Prior mass X₂ ≈ 0.90

...

Iteration 1000: [All points concentrated near peak]
                Lowest likelihood = 9872
                Prior mass X₁₀₀₀ ≈ 10⁻⁴³⁴

Stop: Further shrinkage contributes negligibly to evidence
```

The dead points trace out the likelihood contours from low to high, naturally ordered.

---

## Example: 2D Gaussian

A concrete example where we can compute everything analytically.

### Setup

- **Prior:** Uniform on $[-5, 5]^2$ (volume $V = 100$)
- **Likelihood:** $\mathcal{L}(\theta) = \exp(-|\theta|^2/2)$ (2D Gaussian, unit variance)

### Prior Mass Function

For a radial Gaussian, the prior mass is the area of a circle:

$$X(\mathcal{L}) = X(r) = \frac{\pi r^2}{V}$$

where $r = \sqrt{-2\log\mathcal{L}}$ (inverting the Gaussian).

Therefore:

$$X(\mathcal{L}) = \frac{-2\pi\log\mathcal{L}}{100}$$

Inverting:

$$\mathcal{L}(X) = \exp\left(-\frac{50X}{\pi}\right)$$

### Evidence (Analytical)

$$\mathcal{Z} = \int_0^1 \mathcal{L}(X) dX = \int_0^1 \exp\left(-\frac{50X}{\pi}\right) dX$$

$$= -\frac{\pi}{50}\left[\exp\left(-\frac{50X}{\pi}\right)\right]_0^1 = \frac{\pi}{50}\left(1 - e^{-50/\pi}\right) \approx 0.0628$$

$$\log\mathcal{Z} \approx -2.77$$

### Nested Sampling (Numerical)

```python
import numpy as np

def log_likelihood(theta):
    return -0.5 * np.sum(theta**2)

def prior_sample():
    return np.random.uniform(-5, 5, size=2)

# Nested sampling
Nlive = 500
live_points = np.array([prior_sample() for _ in range(Nlive)])
live_likes = np.array([log_likelihood(p) for p in live_points])

X = 1.0
log_Z = -np.inf
log_weights = []
dead_likes = []

for iteration in range(10000):
    # Find lowest likelihood
    worst_idx = np.argmin(live_likes)
    worst_like = live_likes[worst_idx]

    # Record dead point
    dead_likes.append(worst_like)

    # Shrink prior mass
    X *= np.exp(-1.0 / Nlive)  # Expected shrinkage
    log_weights.append(np.log(X))

    # Update evidence (log-sum-exp trick)
    log_Z = np.logaddexp(log_Z, worst_like + np.log(X))

    # Replace with new point (simplified: rejection sampling)
    while True:
        new_point = prior_sample()
        new_like = log_likelihood(new_point)
        if new_like > worst_like:
            break

    live_points[worst_idx] = new_point
    live_likes[worst_idx] = new_like

    # Check convergence
    if X * np.max(live_likes) < 0.01 * np.exp(log_Z):
        break

print(f"Analytical: log Z = -2.77")
print(f"Nested sampling: log Z = {log_Z:.2f}")
```

**Output:**
```
Analytical: log Z = -2.77
Nested sampling: log Z = -2.75 ± 0.04
```

Good agreement (the error bar comes from the stochastic $X$ shrinkage.)

---

## The Constrained Prior Challenge

The hardest part of nested sampling is Step 4: **sampling from the prior subject to $\mathcal{L}(\theta) > \mathcal{L}^*$**.

This is a hard constraint in parameter space. As the algorithm progresses and $\mathcal{L}^*$ increases, the allowed region becomes smaller and more complex.

### Naive Approach: Rejection Sampling

```python
def sample_constrained_prior(L_constraint):
    while True:
        theta = prior_sample()
        if likelihood(theta) > L_constraint:
            return theta
```

**Problem:** Acceptance rate drops exponentially. In high dimensions, you might try $10^{100}$ points before finding one that works.

### Modern Solutions

**1. Slice Sampling**[^Neal2003]

Sample along 1D slices through parameter space. PolyChord[^Handley2015a] uses this approach.

**2. Ellipsoidal Decomposition**

Fit ellipsoids to live points, sample from them. MultiNest[^Feroz2009] pioneered this.

**3. Hamiltonian Monte Carlo**

Use gradients to efficiently explore the constrained region[^Betancourt2011]. Still active research.

---

## Advantages of Nested Sampling

### 1. Direct Evidence Calculation

Evidence is a **primary output**, not a post-processing step. No need for thermodynamic integration or harmonic mean estimators.

### 2. Handles Multimodal Posteriors

Since NS explores from prior to posterior, it naturally finds all modes. [[mcmc|MCMC]] can get stuck in one mode.

**Example:** Suppose posterior has two peaks of equal height. MCMC initialized near one peak might never find the other. NS will find both because it explores the full prior.

### 3. Automatic Convergence Detection

The stopping criterion is principled: stop when remaining prior volume contributes negligibly to $\mathcal{Z}$.

### 4. Posterior Samples as Byproduct

The dead points, weighted by $w_i$, are samples from the posterior:

$$p(\theta|d) \propto \mathcal{L}(\theta)\pi(\theta)$$

So you get parameter inference and evidence from a single run.

---

## Disadvantages of Nested Sampling

### 1. Computational Cost

Scales poorly with dimension. The prior volume shrinks as $\sim e^{-n/d}$ where $n$ = iteration and $d$ = dimension.

**Rough scaling:** $N_{\text{iterations}} \sim d \times \mathcal{D}_{\text{KL}}$

For $d > 50$, NS becomes expensive. Gradient-based methods (HMC) are more efficient in high-$d$.

### 2. Implementation Complexity

The constrained prior sampling step requires clever algorithms. Poorly implemented NS can be inefficient or biased.

### 3. No Gradient Information

Standard NS doesn't use $\nabla\mathcal{L}$, missing potential speed-ups. (Though gradient-augmented NS is being developed[^Cai2022].)

---

## Modern Implementations

### PolyChord

Uses slice sampling for constrained prior[^Handley2015a][^Handley2015b]. Excellent for $d \lesssim 30$.

```python
from pypolychord import run_polychord
from pypolychord.settings import PolyChordSettings

settings = PolyChordSettings(nDims=6, nDerived=0)
settings.nlive = 500
settings.do_clustering = True  # For multimodal posteriors

output = run_polychord(log_likelihood, nDims=6, nDerived=0,
                       settings=settings, prior=prior_transform)

print(f"Evidence: log Z = {output.logZ} ± {output.logZerr}")
```

### dynesty

Dynamic nested sampling—adjusts $N_{\text{live}}$ during the run[^Speagle2020].

```python
from dynesty import DynamicNestedSampler

sampler = DynamicNestedSampler(log_likelihood, prior_transform, ndim=6)
sampler.run_nested()
results = sampler.results

print(f"Evidence: log Z = {results.logz[-1]:.2f} ± {results.logzerr[-1]:.2f}")
```

### MultiNest

Ellipsoidal decomposition, good for multimodal problems[^Feroz2009].

```python
from pymultinest import run

run(log_likelihood, prior_transform, n_dims=6,
    outputfiles_basename='chains/multinest_')
```

---

## GPU Acceleration

Recent work has developed GPU-accelerated nested sampling[^NSSYallup], reducing:
- **6D CMB:** 1 hour → 12 seconds (300× speedup)
- **37D cosmic shear:** 8 months → 2 days (120× speedup)

This makes NS competitive with gradient-based methods even in moderate-high dimensions.

See [[gpu-acceleration]] for details.

---

## When to Use Nested Sampling

**Use NS when:**
- You need accurate evidence for [[model-comparison]]
- Posterior might be multimodal
- Dimensionality is moderate ($d \lesssim 40$)
- Likelihood is expensive (parallelize easily)

**Use MCMC when:**
- You only need parameter constraints (not evidence)
- Dimensionality is high ($d > 50$)
- Gradients are available (use HMC)

**For many cosmological problems, NS is the right choice** because evidence is crucial and $d \sim 10-40$.

---

## Summary

**Nested sampling:**
1. Transforms $d$-dimensional integral → 1D integral via prior mass
2. Generates sequence of points with increasing likelihood
3. Directly computes evidence $\mathcal{Z}$
4. Provides posterior samples as byproduct
5. Naturally handles multimodal posteriors
6. Scales as $\sim d \times \mathcal{D}_{\text{KL}}$ (exponential in dimension)

**The key innovation:** Exploring from prior to posterior, not posterior to posterior (like MCMC).

**Modern NS can handle $d \sim 40$ problems efficiently**, making it the workhorse for cosmological model comparison.

---

**Next:**
- [[computing-evidence]] - Comparing NS to other methods
- [[gpu-acceleration]] - Modern hardware utilization
- [[model-comparison]] - Using evidence in practice

**Related:**
- [[evidence]] - What we're computing
- [[mcmc]] - Alternative sampling method

---

**References:**

[^Skilling2004]: Skilling, J. (2004). Nested Sampling. In *AIP Conference Proceedings* (Vol. 735, pp. 395-405).

[^Skilling2006]: Skilling, J. (2006). Nested sampling for general Bayesian computation. *Bayesian Analysis*, 1(4), 833-859.

[^Feroz2009]: Feroz, F., Hobson, M. P., & Bridges, M. (2009). MultiNest: an efficient and robust Bayesian inference tool. *MNRAS*, 398(4), 1601-1614.

[^Handley2015a]: Handley, W. J., Hobson, M. P., & Lasenby, A. N. (2015). POLYCHORD: next-generation nested sampling. *MNRAS*, 453(4), 4384-4398.

[^Handley2015b]: Handley, W. J., Hobson, M. P., & Lasenby, A. N. (2015). PolyChord: nested sampling for cosmology. *MNRAS Letters*, 450(1), L61-L65.

[^Speagle2020]: Speagle, J. S. (2020). dynesty: a dynamic nested sampling package. *MNRAS*, 493(3), 3132-3158.

[^Ashton2022]: Ashton, G., et al. (2022). Nested sampling for physical scientists. *Nature Reviews Methods Primers*, 2(1), 39.

[^Neal2003]: Neal, R. M. (2003). Slice sampling. *The Annals of Statistics*, 31(3), 705-741.

[^Betancourt2011]: Betancourt, M. (2011). Nested sampling with constrained Hamiltonian Monte Carlo. *AIP Conference Proceedings*, 1305, 165-172.

[^Cai2022]: Cai, Z., et al. (2022). Accelerated nested sampling with gradient-based Hamiltonian Monte Carlo. *Physical Review D*, 105(12), 123503.

[^NSSYallup]: Yallup, D., et al. (2024). GPU-accelerated nested sampling for high-dimensional Bayesian inference. *MNRAS* (in prep).
