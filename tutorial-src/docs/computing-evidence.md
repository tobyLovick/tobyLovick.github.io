# Computing the Evidence

← Back to [[index]] | See also: [[evidence]], [[nested-sampling]], [[mcmc]]

---

## The Challenge

The [[evidence]] is a high-dimensional integral:

$$\mathcal{Z} = \int \mathcal{L}(\theta)\pi(\theta) d\theta$$

Unlike the posterior (which [[mcmc|MCMC]] samples efficiently), computing $\mathcal{Z}$ requires exploring the **entire prior volume**, not just the high-probability peak.

This page compares different methods for evidence calculation.

---

## Method 1: Nested Sampling

**Approach:** Transform the multi-dimensional integral into 1D via prior mass[^Skilling2006].

### How It Works

See [[nested-sampling]] for full details. Brief summary:

1. Generate sequence of points with increasing likelihood
2. Track prior volume shrinkage: $X_i = t_i X_{i-1}$
3. Evidence: $\mathcal{Z} = \sum w_i \mathcal{L}_i$

### Pros

- **Direct calculation** - evidence is primary output
- **Robust error estimates** - from prior volume stochasticity
- **Handles multimodal posteriors** naturally
- **Posterior samples as byproduct**
- **No post-processing** required

### Cons

- **Computationally expensive** - scales poorly with dimension ($\sim e^{d \mathcal{D}_{KL}}$)
- **Implementation complexity** - constrained prior sampling is hard
- **No gradient usage** (in standard implementations)

### Implementations

**PolyChord** (slice sampling)[^Handley2015a]:
```python
from pypolychord import run_polychord
from pypolychord.settings import PolyChordSettings

settings = PolyChordSettings(nDims=6, nDerived=0)
settings.nlive = 500

output = run_polychord(loglike, nDims=6, nDerived=0,
                       settings=settings, prior=prior_transform)

print(f"log Z = {output.logZ} ± {output.logZerr}")
```

**dynesty** (dynamic nested sampling)[^Speagle2020]:
```python
from dynesty import DynamicNestedSampler

dsampler = DynamicNestedSampler(loglike, prior_transform, ndim=6)
dsampler.run_nested()
results = dsampler.results

print(f"log Z = {results.logz[-1]:.2f} ± {results.logzerr[-1]:.2f}")
```

**MultiNest** (ellipsoidal decomposition)[^Feroz2009]:
```python
from pymultinest import run

run(loglike, prior_transform, n_dims=6,
    outputfiles_basename='chains/ns_')
```

### When to Use

- Need accurate evidence for [[model-comparison]]
- Posterior might be multimodal
- Moderate dimensions ($d \lesssim 40$)
- GPU available → see [[gpu-acceleration]]

---

## Method 2: Thermodynamic Integration

**Approach:** Create a "ladder" of tempered distributions from prior to posterior[^Neal1996].

### How It Works

Define a path from prior ($\beta=0$) to posterior ($\beta=1$):

$$p_\beta(\theta) = \frac{\mathcal{L}(\theta)^\beta \pi(\theta)}{Z_\beta}$$

The evidence is:

$$\log\mathcal{Z} = \int_0^1 \left\langle \log\mathcal{L} \right\rangle_\beta d\beta$$

**Algorithm:**
1. Run MCMC at several $\beta$ values: $0 = \beta_0 < \beta_1 < \cdots < \beta_K = 1$
2. Estimate $\langle \log\mathcal{L} \rangle$ at each $\beta_i$
3. Integrate numerically (trapezoid rule)

```python
import numpy as np
from scipy import integrate

# Define beta schedule
betas = np.linspace(0, 1, 20)

# Run MCMC at each temperature
log_L_means = []
for beta in betas:
    def tempered_posterior(theta):
        return beta * log_likelihood(theta) + log_prior(theta)

    samples = run_mcmc(tempered_posterior, n_steps=5000)
    log_L_means.append(np.mean([log_likelihood(s) for s in samples]))

# Integrate
log_Z = integrate.trapz(log_L_means, betas)
print(f"log Z = {log_Z:.2f}")
```

### Pros

- **Uses MCMC** - can leverage efficient samplers (HMC)
- **Gradients help** - if available
- **Parallelizable** - run each temperature independently

### Cons

- **Many MCMC runs** needed (one per $\beta$)
- **Tuning** $\beta$ schedule is tricky
- **Costly** - especially in high dimensions
- **Convergence** - each chain must converge

### When to Use

- Already using HMC/NUTS for sampling
- High dimensions where NS struggles
- Have computational resources for many chains

---

## Method 3: Harmonic Mean Estimator

**Approach:** Post-process MCMC posterior samples[^Newton1994].

### The Original (Unstable) Version

From posterior samples $\{\theta_i\}$:

$$\mathcal{Z} \approx \left( \frac{1}{N} \sum_{i=1}^N \frac{1}{\mathcal{L}(\theta_i)} \right)^{-1}$$

**Why this formula?** Bayes' theorem rearranged:

$$\frac{1}{\mathcal{Z}} = \left\langle \frac{1}{\mathcal{L}} \right\rangle_{\mathcal{P}}$$

### Why It Fails

**Problem:** Dominated by lowest-likelihood samples in the posterior tail.

Even a few samples with very low $\mathcal{L}$ cause huge variance. The estimator is theoretically unbiased but has infinite variance.

**Never use the naive harmonic mean estimator.**

---

## Method 4: Learned Harmonic Mean

**Approach:** Use machine learning to stabilize the harmonic mean[^McEwen2021][^Polanska2025].

### How It Works

Train a normalizing flow $q(\theta)$ to approximate the posterior, then:

$$\mathcal{Z} = \left\langle \frac{p(\theta)}{q(\theta)} \right\rangle_{\mathcal{P}}$$

where $p(\theta) = \mathcal{L}(\theta)\pi(\theta)$ (unnormalized posterior).

**Key insight:** The ratio $p/q$ is better behaved than $1/\mathcal{L}$.

```python
import torch
from harmonic import Evidence

# Load MCMC samples
samples = load_posterior_samples()  # Shape: (n_samples, n_dims)

# Split into training and inference sets
train_samples = samples[:int(0.3 * len(samples))]
test_samples = samples[int(0.3 * len(samples)):]

# Train flow on posterior samples
ev = Evidence(n_dims=6, flow='RealNVP')
ev.fit(train_samples)

# Compute evidence using test samples
log_Z, log_Z_err = ev.compute_evidence(test_samples, log_likelihood)
print(f"log Z = {log_Z:.2f} ± {log_Z_err:.2f}")
```

### Pros

- **Post-processes MCMC** - no new sampling needed
- **More stable** than naive harmonic mean
- **Fast** once samples available
- **Improving** - active research area

### Cons

- **Requires many samples** - typically 100k+
- **Flow training** can be finicky
- **Error estimates** are optimistic (don't include flow training uncertainty)
- **Less robust** than nested sampling

### When to Use

- Already have MCMC posterior samples
- Running nested sampling is too expensive
- Can afford to run long chains (100k+ samples)

---

## Method 5: Laplace Approximation

**Approach:** Approximate posterior as Gaussian around the maximum a posteriori (MAP)[^Mackay2003].

### How It Works

Taylor expand $\log\mathcal{P}$ around $\hat{\theta}$ (the MAP):

$$\log\mathcal{P}(\theta) \approx \log\mathcal{P}(\hat{\theta}) - \frac{1}{2}(\theta - \hat{\theta})^T H (\theta - \hat{\theta})$$

where $H$ is the Hessian matrix.

The Laplace approximation to the evidence:

$$\boxed{\log\mathcal{Z} \approx \log\mathcal{L}(\hat{\theta}) + \log\pi(\hat{\theta}) + \frac{d}{2}\log(2\pi) - \frac{1}{2}\log|H|}$$

```python
from scipy.optimize import minimize
import numpy as np

# Find MAP
result = minimize(lambda x: -log_posterior(x), x0=theta_init)
theta_map = result.x
log_P_map = -result.fun

# Compute Hessian (numerical)
from numdifftools import Hessian
hessian = Hessian(lambda x: -log_posterior(x))
H = hessian(theta_map)

# Laplace evidence
d = len(theta_map)
log_Z_laplace = (log_P_map
                 + 0.5 * d * np.log(2 * np.pi)
                 - 0.5 * np.log(np.linalg.det(H)))

print(f"log Z ≈ {log_Z_laplace:.2f} (Laplace approx)")
```

### Pros

- **Extremely fast** - just optimization + Hessian
- **No sampling** required
- **Analytical** formula

### Cons

- **Only valid if posterior is Gaussian** (often not true)
- **Misses multimodality** completely
- **Inaccurate** for complex posteriors
- **Numerical Hessian** can be unstable

### When to Use

- Quick approximation / sanity check
- Posterior is known to be nearly Gaussian (rare)
- Very high dimensions where nothing else is feasible

**For rigorous model comparison, don't rely solely on Laplace.**

---

## Method Comparison

| Method | Accuracy | Cost | Dimensions | Multimodal? | Need Gradients? |
|--------|----------|------|------------|-------------|-----------------|
| [[nested-sampling|Nested Sampling]] | ★★★★★ | High | $d \lesssim 40$ | Yes | No |
| Thermodynamic Integration | ★★★★☆ | High | $d \lesssim 100$ | Yes | Optional |
| Learned Harmonic Mean | ★★★☆☆ | Medium* | Any | Maybe | No |
| Laplace Approx | ★★☆☆☆ | Very Low | Any | No | Optional |

*Assumes MCMC samples already available

### Accuracy Comparison (Example Problem)

Toy problem: 10D Gaussian posterior, known evidence $\log\mathcal{Z}_{\text{true}} = -52.3$

```
Method                    Result              Error      Time
─────────────────────────────────────────────────────────────
PolyChord (NS)           -52.4 ± 0.3          ±0.3       2 min
dynesty (NS)             -52.5 ± 0.4          ±0.4       3 min
Thermodynamic Int.       -52.1 ± 0.5          ±0.5       15 min
Learned Harmonic         -51.8 ± 1.2          ±1.2       5 min*
Laplace                  -53.7 (no error)     ±1.4       10 sec
Naive Harmonic           -48 ± 27             Unreliable 1 sec*

* Post-processing only, not including MCMC sampling time
```

**Takeaway:** Nested sampling is most reliable. Laplace is fast but biased. Naive harmonic mean is unusable.

---

## Practical Recommendations

### For Cosmology ($d \sim 5-40$)

**Primary method:** [[nested-sampling]] (PolyChord or dynesty)
- Most reliable
- Handles multimodality
- Worth the computational cost for rigorous model comparison

**Cross-check:** Thermodynamic integration if you have HMC chains

### For High Dimensions ($d > 50$)

**Primary method:** Thermodynamic integration with HMC
- Nested sampling becomes too expensive
- HMC scales better

**Alternative:** Learned harmonic mean (but be cautious of error estimates)

### Quick Estimates

**Laplace approximation** for order-of-magnitude
- Sanity check before expensive calculations
- Don't use for final publication

### Model Comparison

**Always use nested sampling** for final Bayes factors
- Other methods' error bars often underestimate uncertainty
- NS is the "ground truth" other methods are validated against

---

## Checking Your Evidence Calculation

### 1. Analytic Test Cases

Before real data, test on problems with known evidence:

```python
# Gaussian posterior with known evidence
def test_gaussian():
    # Prior: Uniform on [-5, 5]^d
    # Likelihood: Gaussian, unit variance
    # Evidence (analytic): log Z = -d/2 * log(2π) + log(Vol)

    # Run your method
    log_Z_computed = compute_evidence(gaussian_loglike, prior)
    log_Z_analytic = compute_analytic_evidence()

    assert abs(log_Z_computed - log_Z_analytic) < 0.5, "Test failed!"
```

### 2. Compare Methods

Run 2-3 methods on the same problem. Should agree within error bars.

```python
log_Z_ns = run_nested_sampling()
log_Z_ti = run_thermodynamic_integration()

difference = abs(log_Z_ns - log_Z_ti)
combined_error = np.sqrt(error_ns**2 + error_ti**2)

assert difference < 2 * combined_error, "Methods disagree!"
```

### 3. Convergence Tests

For nested sampling: increase $N_{\text{live}}$, check evidence stabilizes.

```python
for nlive in [100, 250, 500, 1000]:
    log_Z = run_ns(nlive=nlive)
    print(f"N_live={nlive}: log Z = {log_Z}")

# Should see convergence
```

---

## Common Pitfalls

### "My evidence is -10^6, is that wrong?"

Absolute evidence values are meaningless — they depend on prior volume. Only **evidence differences** matter:

$$\Delta\log\mathcal{Z} = \log\mathcal{Z}_1 - \log\mathcal{Z}_2$$

### "Different methods give different evidences"

Small differences ($< 1$) are expected due to numerical precision. Large differences ($> 2$) indicate a problem:
- Insufficient convergence
- Implementation bug
- One method is inappropriate (e.g., Laplace on multimodal posterior)

### "Can I combine evidence estimates?"

Don't average evidences from different methods. Pick the most reliable method for your problem.

### "My nested sampling error bar is 0.01 but results vary by 0.5"

The reported error is only the **sampling uncertainty**. Systematic error from incomplete exploration can be larger. Check:
- Increase $N_{\text{live}}$
- Verify stopping criterion wasn't too aggressive
- Try different implementations

---

## Summary

**For rigorous Bayesian [[model-comparison]]:**

🥇 **Nested sampling** (PolyChord, dynesty) - most reliable
🥈 **Thermodynamic integration** - if high-dimensional
🥉 **Learned harmonic mean** - if MCMC samples already exist

**Never use:**
- Naive harmonic mean estimator (infinite variance)
- Laplace for final results (too approximate)

**Always:**
- Test on analytic cases first
- Compare multiple methods when possible
- Report method and settings used
- Check convergence carefully

Computing evidence is harder than sampling the posterior — budget time accordingly.

---

**Next:**
- [[nested-sampling]] - Deep dive into the recommended method
- [[model-comparison]] - Using evidence in practice
- [[gpu-acceleration]] - Modern computational techniques

---

**References:**

[^Skilling2006]: Skilling, J. (2006). Nested sampling for general Bayesian computation. *Bayesian Analysis*, 1(4), 833-859.

[^Feroz2009]: Feroz, F., Hobson, M. P., & Bridges, M. (2009). MultiNest: an efficient and robust Bayesian inference tool. *MNRAS*, 398(4), 1601-1614.

[^Handley2015a]: Handley, W. J., Hobson, M. P., & Lasenby, A. N. (2015). POLYCHORD: next-generation nested sampling. *MNRAS*, 453(4), 4384-4398.

[^Speagle2020]: Speagle, J. S. (2020). dynesty: a dynamic nested sampling package. *MNRAS*, 493(3), 3132-3158.

[^Neal1996]: Neal, R. M. (1996). Sampling from multimodal distributions using tempered transitions. *Statistics and Computing*, 6(4), 353-366.

[^Newton1994]: Newton, M. A., & Raftery, A. E. (1994). Approximate Bayesian inference with the weighted likelihood bootstrap. *Journal of the Royal Statistical Society: Series B*, 56(1), 3-26.

[^McEwen2021]: McEwen, J. D., et al. (2021). Machine learning assisted Bayesian model comparison: learnt harmonic mean estimator. *MNRAS*, 508(3), 3771-3795.

[^Polanska2025]: Polanska, M., et al. (2025). Further improvements to the learned harmonic mean estimator. *MNRAS*, 536(1), 851-869.

[^Mackay2003]: MacKay, D. J. C. (2003). *Information Theory, Inference, and Learning Algorithms*. Cambridge University Press.
