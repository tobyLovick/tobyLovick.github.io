# Kullback-Leibler Divergence

← Back to [[index]] | See also: [[evidence]], [[tension-statistics]]

---

## The Information-Theoretic Foundation

The Kullback-Leibler (KL) divergence[^KullbackLeibler1951] is a fundamental quantity in information theory that measures the "distance" between two probability distributions. In Bayesian inference, it quantifies how much we **learn from data**—the information gained in going from prior to posterior.

---

## Definition

For two probability distributions $P$ and $Q$ over the same variable $\theta$:

$$\boxed{\mathcal{D}_{\text{KL}}(P||Q) = \int P(\theta) \log\frac{P(\theta)}{Q(\theta)} d\theta}$$

**In Bayesian inference**, we use it to measure the information gain from prior $\pi$ to posterior $\mathcal{P}$:

$$\mathcal{D}_{\text{KL}} = \int \mathcal{P}(\theta) \log\frac{\mathcal{P}(\theta)}{\pi(\theta)} d\theta$$

**Read as:** "The KL divergence from the prior to the posterior"

---

## Intuition: Information Gain

### The Shannon Information

Before introducing KL divergence, consider **Shannon Information**[^Shannon1948] at a specific parameter value:

$$\mathcal{I}(\theta) = \log\frac{\mathcal{P}(\theta)}{\pi(\theta)}$$

This measures the "surprise" or information content at point $\theta$:
- If $\mathcal{P}(\theta) \gg \pi(\theta)$: High information (data concentrated probability here)
- If $\mathcal{P}(\theta) \ll \pi(\theta)$: Negative information (data ruled out this region)
- If $\mathcal{P}(\theta) = \pi(\theta)$: Zero information (data didn't change beliefs here)

### KL as Average Information

The KL divergence is simply the **posterior-weighted average** of Shannon Information:

$$\boxed{\mathcal{D}_{\text{KL}} = \langle \mathcal{I} \rangle_{\mathcal{P}} = \left\langle \log\frac{\mathcal{P}}{\pi} \right\rangle_{\mathcal{P}}}$$

**Interpretation:** How much information, on average, did we gain about $\theta$ by observing the data?

---

## Properties

### 1. Non-Negativity

$$\mathcal{D}_{\text{KL}} \geq 0$$

with equality if and only if $\mathcal{P} = \pi$ (i.e. the data told us nothing).

**Proof sketch:** By Jensen's inequality applied to the convex function $-\log$.

### 2. Asymmetry

$$\mathcal{D}_{\text{KL}}(P||Q) \neq \mathcal{D}_{\text{KL}}(Q||P)$$

KL divergence is **not** a true distance metric (doesn't satisfy triangle inequality). It's a **directed** measure of information.

### 3. Additivity

For independent parameters $\theta = (\theta_1, \theta_2)$:

$$\mathcal{D}_{\text{KL}}(\theta_1, \theta_2) = \mathcal{D}_{\text{KL}}(\theta_1) + \mathcal{D}_{\text{KL}}(\theta_2)$$

Information from independent sources adds linearly.

### 4. Invariance Under Reparametrization

If $\phi = f(\theta)$ is a bijection:

$$\mathcal{D}_{\text{KL}}(\phi) = \mathcal{D}_{\text{KL}}(\theta)$$

The information content doesn't depend on how you parameterize the problem.

---

## Connection to Evidence: Occam's Razor

The KL divergence appears naturally in the decomposition of the [[evidence#Mathematical Decomposition|Bayesian evidence]]:

$$\boxed{\log\mathcal{Z} = \langle \log\mathcal{L} \rangle_{\mathcal{P}} - \mathcal{D}_{\text{KL}}}$$

**Derivation:**

Starting from Bayes' theorem:

$$\mathcal{P}(\theta) = \frac{\mathcal{L}(\theta)\pi(\theta)}{\mathcal{Z}}$$

Take logarithms:

$$\log\mathcal{P}(\theta) = \log\mathcal{L}(\theta) + \log\pi(\theta) - \log\mathcal{Z}$$

Average over the posterior:

$$\langle \log\mathcal{P} \rangle_{\mathcal{P}} = \langle \log\mathcal{L} \rangle_{\mathcal{P}} + \langle \log\pi \rangle_{\mathcal{P}} - \log\mathcal{Z}$$

Rearrange:

$$\log\mathcal{Z} = \langle \log\mathcal{L} \rangle_{\mathcal{P}} - \left(\langle \log\mathcal{P} \rangle_{\mathcal{P}} - \langle \log\pi \rangle_{\mathcal{P}}\right)$$

The term in parentheses is exactly $\mathcal{D}_{\text{KL}}$.

### Interpretation as Occam Penalty

$$\text{log Evidence} = \underbrace{\langle \log\mathcal{L} \rangle_{\mathcal{P}}}_{\text{Goodness of fit}} - \underbrace{\mathcal{D}_{\text{KL}}}_{\text{Complexity penalty}}$$

- **$\langle \log\mathcal{L} \rangle_{\mathcal{P}}$:** How well does the model fit the data?
- **$\mathcal{D}_{\text{KL}}$:** How much did the posterior have to compress from the prior?

**Models requiring large compression are penalized** because they made vague predictions (wide prior) and needed extensive tuning by data (narrow posterior).

This is **Occam's Razor implemented automatically**: simpler models (narrow priors that already predict the data well) have low $\mathcal{D}_{\text{KL}}$ and thus higher evidence.

---

## The Volumetric Approximation

For broad priors where $\pi(\theta)$ is approximately constant over the posterior support:

$$\mathcal{D}_{\text{KL}} \approx \log\frac{V_{\pi}}{V_{\mathcal{P}}}$$

where:
- $V_{\pi}$ = volume of prior support
- $V_{\mathcal{P}}$ = volume of posterior support

**Intuition:** KL divergence measures how much the allowed parameter space has shrunk.

**Example:**
- Prior uniform on $[0, 10]^d$ → $V_\pi = 10^d$
- Posterior concentrated in region of volume $V_\mathcal{P} = 1$
- Then $\mathcal{D}_{\text{KL}} \approx d \log 10 \approx 2.3d$

This approximation becomes exact for uniform ("top-hat") distributions and remains accurate when the prior is "locally flat" around the posterior.

---

## Computing KL Divergence

### From Nested Sampling

[[nested-sampling|Nested sampling]] naturally computes $\mathcal{D}_{\text{KL}}$ as a byproduct[^Skilling2006]:

```python
# PolyChord output includes D_KL automatically
from pypolychord import run_polychord

output = run_polychord(loglike, nDims=6, prior=prior_transform, ...)
D_KL = output.info  # Information content (nats)

print(f"Information gain: {D_KL:.2f} nats")
print(f"Equivalent bits: {D_KL/np.log(2):.2f} bits")
```

### From MCMC Samples (Approximate)

If you only have MCMC posterior samples, you can estimate:

```python
import numpy as np
from scipy.stats import gaussian_kde

# Posterior samples from MCMC
samples = mcmc_samples  # Shape: (n_samples, n_dims)

# Estimate posterior density at each sample using KDE
kde_post = gaussian_kde(samples.T)
log_post = kde_post.logpdf(samples.T)

# Evaluate prior density at each sample
log_prior = np.array([log_prior_func(s) for s in samples])

# KL divergence estimate
D_KL = np.mean(log_post - log_prior)

print(f"D_KL ≈ {D_KL:.2f} nats")
```

**Warning:** This requires density estimation and can be unreliable in high dimensions. Prefer nested sampling when accurate $\mathcal{D}_{\text{KL}}$ is needed.

---

## Examples

### Example 1: Gaussian Posterior

**Setup:**
- Prior: $\pi(\theta) = \mathcal{N}(0, \sigma_{\text{prior}}^2)$
- Posterior: $\mathcal{P}(\theta) = \mathcal{N}(\mu, \sigma_{\text{post}}^2)$

**Analytical KL divergence:**

$$\mathcal{D}_{\text{KL}} = \frac{1}{2}\left[\log\frac{\sigma_{\text{prior}}^2}{\sigma_{\text{post}}^2} + \frac{\sigma_{\text{post}}^2 + \mu^2}{\sigma_{\text{prior}}^2} - 1\right]$$

For $\mu = 0$ (posterior still centered):

$$\mathcal{D}_{\text{KL}} = \frac{1}{2}\log\frac{\sigma_{\text{prior}}^2}{\sigma_{\text{post}}^2} + \frac{1}{2}\left(\frac{\sigma_{\text{post}}^2}{\sigma_{\text{prior}}^2} - 1\right)$$

**Special case:** If $\sigma_{\text{post}} \ll \sigma_{\text{prior}}$ (strong data):

$$\mathcal{D}_{\text{KL}} \approx \frac{1}{2}\log\frac{\sigma_{\text{prior}}^2}{\sigma_{\text{post}}^2}$$

**Numerical example:**
```python
sigma_prior = 10.0
sigma_post = 1.0

D_KL = 0.5 * np.log(sigma_prior**2 / sigma_post**2)
print(f"D_KL = {D_KL:.2f} nats")
# Output: D_KL = 2.30 nats

# In "number of e-foldings"
print(f"Prior/Posterior volume ratio: {np.exp(D_KL):.0f}:1")
# Output: 10:1 (posterior is 10× narrower)
```

### Example 2: Cosmological Parameters

From a typical CMB analysis (6-parameter $\Lambda$CDM):

```
Parameter    Prior range       Posterior width    Contribution to D_KL
------------------------------------------------------------------------
Ωb h²        [0.005, 0.1]      ±0.0001           ~6.9 nats
Ωc h²        [0.001, 0.99]     ±0.001            ~6.9 nats
H₀           [20, 100]         ±0.5 km/s/Mpc     ~5.4 nats
ln(10¹⁰As)   [1.61, 3.91]      ±0.01             ~5.1 nats
ns           [0.8, 1.2]        ±0.004            ~4.6 nats
τ            [0.01, 0.8]       ±0.007            ~4.8 nats

Total: D_KL ≈ 33.7 nats ≈ 48.6 bits
```

**Interpretation:** Planck CMB data provides approximately **34 nats** (49 bits) of information about these 6 parameters.

---

## Bayesian Model Dimensionality

KL divergence gives the **total** information, but not how it's distributed across parameters. The **Bayesian Model Dimensionality**[^HandleyLemos2019] measures the effective number of constrained parameters:

$$\boxed{\frac{d}{2} = \text{var}(\mathcal{I})_{\mathcal{P}} = \left\langle \left(\log\frac{\mathcal{P}}{\pi}\right)^2 \right\rangle_{\mathcal{P}} - \mathcal{D}_{\text{KL}}^2}$$

**Interpretation:**
- $\mathcal{D}_{\text{KL}}$ = mean information (first moment)
- $d$ = variance of information (second moment)

**Properties:**
- For $n$ independent, equally-constrained parameters: $d \approx n$
- For highly correlated parameters: $d < n$ (degeneracies reduce effective dimensionality)
- For weakly constrained parameters: $d \approx 0$ (data didn't learn about them)

See [[tension-statistics#Bayesian Model Dimensionality|tension quantification]] for applications.

---

## KL Divergence in Tension Quantification

In [[tension-statistics]], KL divergence plays a central role through the **Information Ratio**:

$$\log I = \mathcal{D}_{\text{KL}}^A + \mathcal{D}_{\text{KL}}^B - \mathcal{D}_{\text{KL}}^{AB}$$

This measures the "surprise of agreement" between datasets $A$ and $B$:
- If datasets agree: joint analysis gains similar information as separate analyses → $\log I$ large
- If datasets conflict: joint posterior is very narrow (high $\mathcal{D}_{\text{KL}}^{AB}$) → $\log I$ small

---

## Connection to Other Information Measures

### Fisher Information

The **Fisher Information** matrix is:

$$\mathcal{F}_{ij} = -\left\langle \frac{\partial^2 \log\mathcal{L}}{\partial\theta_i \partial\theta_j} \right\rangle_{\mathcal{P}}$$

**Connection:** In the Gaussian approximation (Laplace approximation):

$$\mathcal{D}_{\text{KL}} \approx \frac{1}{2}\log\det(\mathcal{F})$$

The KL divergence is related to the determinant of the Fisher matrix (which measures the curvature of the likelihood).

### Mutual Information

For two variables $X$ and $Y$:

$$I(X; Y) = \mathcal{D}_{\text{KL}}(P(X,Y) || P(X)P(Y))$$

Mutual information measures how much learning $X$ tells you about $Y$—a symmetric version of KL divergence.

### Relative Entropy

KL divergence is also called **relative entropy** because it measures the inefficiency of assuming distribution $Q$ when the true distribution is $P$.

In coding theory: extra bits needed if you use wrong distribution for compression.

---

## Common Pitfalls

### "My KL divergence is huge!"

**Not necessarily bad.** $\mathcal{D}_{\text{KL}}$ scales with:
- Number of dimensions
- Width of prior
- Strength of data

**Example:** A 100-dimensional problem with $\mathcal{D}_{\text{KL}} = 200$ nats means each parameter contributes ~2 nats on average — quite reasonable.

### "KL divergence is a distance"

**Not quite.** It's asymmetric and doesn't satisfy triangle inequality. Use "divergence" not "distance."

### "I can compute it from MCMC samples"

**Be careful.** Requires estimating $\mathcal{P}(\theta)$ via density estimation, which is unreliable in high dimensions. Prefer methods that compute it directly (nested sampling).

---

## Summary

**KL Divergence measures:**
1. Information gain from prior to posterior
2. Compression of parameter space by data
3. The Occam penalty in the evidence decomposition
4. "Surprise" in tension quantification

**Key equations:**

$$\mathcal{D}_{\text{KL}} = \int \mathcal{P} \log\frac{\mathcal{P}}{\pi} d\theta = \langle \mathcal{I} \rangle_{\mathcal{P}}$$

$$\log\mathcal{Z} = \langle \log\mathcal{L} \rangle_{\mathcal{P}} - \mathcal{D}_{\text{KL}}$$

$$\mathcal{D}_{\text{KL}} \approx \log\frac{V_{\pi}}{V_{\mathcal{P}}} \quad \text{(volumetric approximation)}$$

**Typical values:**
- 1 well-constrained parameter: $\mathcal{D}_{\text{KL}} \sim 3-5$ nats
- 6-parameter CMB analysis: $\mathcal{D}_{\text{KL}} \sim 30-40$ nats
- High-dimensional weak lensing: $\mathcal{D}_{\text{KL}} \sim 100-200$ nats

---

**Next:**
- [[evidence]] - How KL appears in evidence decomposition
- [[tension-statistics]] - Using KL in tension quantification
- [[model-comparison]] - Occam's razor in action

---

**References:**

[^KullbackLeibler1951]: Kullback, S., & Leibler, R. A. (1951). On information and sufficiency. *The Annals of Mathematical Statistics*, 22(1), 79-86.

[^Shannon1948]: Shannon, C. E. (1948). A mathematical theory of communication. *Bell System Technical Journal*, 27(3), 379-423.

[^Skilling2006]: Skilling, J. (2006). Nested sampling for general Bayesian computation. *Bayesian Analysis*, 1(4), 833-859.

[^HandleyLemos2019]: Handley, W. J., & Lemos, P. (2019). Quantifying dimensionality: Bayesian cosmological model complexity. *Physical Review D*, 100(10), 103511.

[^Trotta2008]: Trotta, R. (2008). Bayes in the sky: Bayesian inference and model selection in cosmology. *Contemporary Physics*, 49(2), 71-104.

[^Mackay2003]: MacKay, D. J. C. (2003). *Information Theory, Inference, and Learning Algorithms*. Cambridge University Press.
