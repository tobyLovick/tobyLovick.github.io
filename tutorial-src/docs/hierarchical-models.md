# Hierarchical Bayesian Models

← Back to [[index]] | See also: [[analytical-update]], [[bayesian-inference]]

---

## When Parameters Have Structure

So far we've treated parameters as independent quantities to infer. But real-world problems often have **hierarchical structure**:

- Multiple observations sharing **common parameters**
- Individual observations having **local parameters** plus **global patterns**
- Data naturally **grouped** (by time, location, experiment, etc.)

**Hierarchical models** allow us to pool information across groups while respecting individual variation.

---

## The Core Idea

Instead of treating each group independently **or** forcing all groups to be identical, hierarchical models find a **middle ground**:

$$\text{Complete pooling} \longleftrightarrow \text{Partial pooling} \longleftrightarrow \text{No pooling}$$

**Partial pooling** (hierarchical modeling):
- Infer group-specific parameters
- Also infer the **distribution** from which those parameters are drawn
- Groups "borrow strength" from each other

---

## Example: Extending the Rowing Problem

Recall the [[analytical-update|rowing lane advantage]] problem: does Towpath have an advantage over Meadow in Oxford-Cambridge boat races?

### Original Problem

**Data:** 84 races, 54 Towpath wins → $\theta = 0.643 \pm 0.051$

**Model:** Single parameter $\theta$ (Towpath win probability)

### Hierarchical Extension

**New question:** Does the advantage vary year-to-year? Perhaps weather, river conditions, or crew skill affects the lane advantage differently each year.

**Data structure:**
```
Year    Races    Towpath wins
-----------------------------
1980      2          1
1981      2          2
1982      2          1
1983      2          1
...
2022      2          1
2023      2          2
```

(Simplified; actual race history varies)

---

## Three Modeling Approaches

### Approach 1: No Pooling

Estimate $\theta_y$ independently for each year $y$:

$$\theta_y \sim \text{Beta}(1 + k_y, 1 + n_y - k_y)$$

**Problems:**
- With only 2 races/year, individual estimates are very noisy
- Year with 0 or 2 Towpath wins → extreme estimates
- Doesn't use information that years should be similar

**Example:**
```
Year 1980: 1/2 wins → θ₁₉₈₀ = 0.50 ± 0.35 (huge uncertainty!)
Year 1981: 2/2 wins → θ₁₉₈₁ = 0.75 ± 0.25 (biased high)
```

### Approach 2: Complete Pooling

Ignore year structure, pool all data:

$$\theta \sim \text{Beta}(1 + \sum k_y, 1 + \sum (n_y - k_y))$$

**Problems:**
- Assumes advantage is identical every year
- Ignores genuine year-to-year variation
- Can't answer "was 2023 different from average?"

### Approach 3: Hierarchical Model (Partial Pooling)

**Two levels of parameters:**

1. **Individual level:** Each year has its own $\theta_y$
2. **Population level:** These $\theta_y$ are drawn from a common distribution

**Model:**

$$\theta_y \sim \text{Beta}(\alpha, \beta) \quad \text{(population-level prior, given hyperparameters $\alpha,\beta$)}$$

$$k_y | \theta_y \sim \text{Binomial}(n_y, \theta_y) \quad \text{(likelihood)}$$

(The hyperprior proper is the prior placed on $\alpha, \beta$ themselves — see below.)

We infer both:
- $\{\theta_y\}$ for each year (individual effects)
- $\alpha, \beta$ describing the population (hyperparameters)

---

## The Hierarchical Structure

```
         Hyperparameters
         α, β (unknown)
              ↓
         Population distribution
         Beta(α, β)
           ↙  ↓  ↘
       θ₁  θ₂  ... θₙ  (year-specific, unknown)
        ↓   ↓       ↓
       k₁  k₂  ... kₙ  (observed data)
```

**Key insight:** The data from year 1 informs our beliefs about $\alpha, \beta$, which in turn affects our inference about year 2's $\theta_2$. **Information flows across groups.**

---

## Shrinkage: The Magic of Partial Pooling

Hierarchical models exhibit **shrinkage** (also called **regularization**):

Individual estimates are "pulled" toward the population mean:

$$\hat{\theta}_y^{\text{hierarchical}} \approx w_y \cdot \hat{\theta}_y^{\text{independent}} + (1-w_y) \cdot \bar{\theta}$$

where:
- $w_y$ depends on the data quality for group $y$
- $\bar{\theta}$ is the population mean
- Groups with less data shrink more toward the mean

**Example:**
```
Year 1980 (sparse data):  1/2 wins
  - No pooling:      θ = 0.50 ± 0.35
  - Hierarchical:    θ = 0.58 ± 0.18  (shrunk toward population mean ~0.64)

Year with 20/30 wins (more data):
  - No pooling:      θ = 0.67 ± 0.08
  - Hierarchical:    θ = 0.66 ± 0.08  (barely shrunk, data speak for themselves)
```

**Benefit:** Years with sparse data get regularized by the population; years with rich data dominate their own estimate.

---

## Mathematical Details

### Prior on Hyperparameters

We need priors on $\alpha$ and $\beta$. A common choice:

$$\alpha, \beta \sim \text{Gamma}(a_0, b_0)$$

or more intuitively, reparameterize as:
- Mean: $\mu = \alpha/(\alpha + \beta)$
- Concentration: $\kappa = \alpha + \beta$ (controls variance)

Then:

$$\mu \sim \text{Beta}(1, 1) \quad \text{(uniform)}$$

$$\kappa \sim \text{Pareto}(1, 1.5) \quad \text{(weakly informative)}$$

### Full Posterior

The joint posterior is:

$$p(\{\theta_y\}, \alpha, \beta | \{k_y\}) \propto p(\alpha, \beta) \prod_y p(\theta_y | \alpha, \beta) p(k_y | \theta_y)$$

Expanding:

$$\propto p(\alpha, \beta) \prod_y \left[\text{Beta}(\theta_y | \alpha, \beta) \times \text{Binomial}(k_y | n_y, \theta_y)\right]$$

**This is analytically intractable** (unlike the simple Beta-Binomial). Need MCMC or other sampling methods.

---

## Implementation in PyMC

```python
import pymc as pm
import numpy as np

# Data: races by year
years = np.arange(1980, 2024)
n_races = np.full(len(years), 2)  # 2 races per year
towpath_wins = np.array([1, 2, 1, 1, ..., 1, 2])  # Observed wins

with pm.Model() as hierarchical_model:
    # Hyperpriors on population parameters
    mu = pm.Beta('mu', alpha=1, beta=1)  # Population mean
    kappa = pm.Pareto('kappa', alpha=1, m=1.5)  # Population concentration

    # Convert to α, β parameterization
    alpha = pm.Deterministic('alpha', mu * kappa)
    beta = pm.Deterministic('beta', (1 - mu) * kappa)

    # Individual year parameters (vectorized)
    theta = pm.Beta('theta', alpha=alpha, beta=beta, shape=len(years))

    # Likelihood
    k = pm.Binomial('k', n=n_races, p=theta, observed=towpath_wins)

    # Sample
    trace = pm.sample(2000, tune=1000, target_accept=0.95)

# Analyze results
import arviz as az

# Population-level inference
print(f"Population mean: μ = {trace.posterior['mu'].mean():.3f}")
print(f"Population std:  σ = {np.sqrt(trace.posterior['alpha'].mean() *
                                       trace.posterior['beta'].mean() /
                                       (trace.posterior['alpha'].mean() +
                                        trace.posterior['beta'].mean() + 1)).values:.3f}")

# Year-specific inference
theta_mean = trace.posterior['theta'].mean(dim=['chain', 'draw'])
theta_std = trace.posterior['theta'].std(dim=['chain', 'draw'])

# Plot shrinkage
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(12, 6))

# Raw proportions (no pooling)
raw_proportions = towpath_wins / n_races

# Hierarchical estimates
ax.scatter(years, raw_proportions, alpha=0.5, label='Raw data', s=50)
ax.errorbar(years, theta_mean, yerr=theta_std, fmt='o',
            label='Hierarchical estimate', capsize=3)
ax.axhline(trace.posterior['mu'].mean(), ls='--', color='red',
           label='Population mean')
ax.set_xlabel('Year')
ax.set_ylabel('Towpath win probability')
ax.legend()
ax.set_title('Hierarchical Shrinkage in Rowing Lane Advantage')
plt.show()
```

**Output interpretation:**
- Raw data points (blue) are noisy (0.0, 0.5, or 1.0 for 2 races)
- Hierarchical estimates (orange) are shrunk toward population mean
- Years with extreme raw values get shrunk more
- Uncertainty bars are realistic (not overconfident from small samples)

---

## Advantages of Hierarchical Models

### 1. Better Estimates for Small Groups

Groups with little data benefit from borrowing strength from others.

**Example:** A year with only 1 race gets a reasonable estimate by learning from other years.

### 2. Realistic Uncertainty

Hierarchical models properly account for:
- Sampling uncertainty (within-group variation)
- Structural uncertainty (between-group variation)

### 3. Population-Level Inference

Can answer questions like:
- "What's the typical lane advantage?" ($\mu$)
- "How much does it vary year-to-year?" ($\sigma$)
- "Is 2023 unusually different?" (compare $\theta_{2023}$ to population)

### 4. Prediction for New Groups

Can predict for unobserved years:

$$\theta_{\text{new}} \sim \text{Beta}(\alpha, \beta)$$

This uses the learned population distribution.

---

## When to Use Hierarchical Models

**Use hierarchical models when:**
- Data naturally grouped (schools, hospitals, years, locations, etc.)
- Group sizes vary (some have lots of data, others sparse)
- You believe groups share similarities but aren't identical
- You want to make predictions for new groups

**Don't use when:**
- Groups are truly independent with no shared structure
- You have so much data per group that pooling doesn't help
- Computational cost of MCMC is prohibitive (though see [[gpu-acceleration]])

---

## Extensions

### Non-Conjugate Hierarchical Models

The Beta-Binomial is special because it's conjugate. Most real problems aren't:

**Example:** Normal data with hierarchical variance:

$$y_{ij} \sim \mathcal{N}(\mu_i, \sigma_i^2)$$

$$\mu_i \sim \mathcal{N}(\mu_0, \tau^2)$$

$$\sigma_i \sim \text{HalfNormal}(\sigma_0)$$

Requires MCMC (no analytical solution).

### Deeper Hierarchies

Can have multiple levels:

```
Population (all rowing)
    ↓
University (Oxford vs Cambridge)
    ↓
Year
    ↓
Individual race
```

Each level pools information from the level above.

### Multivariate Hierarchies

Parameters can be vectors:

$$\boldsymbol{\theta}_i \sim \text{MultivariateNormal}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$$

Captures correlations between parameters within groups.

---

## Hierarchical Models in Cosmology

### Supernova Standardization

Type Ia supernovae have **intrinsic brightness variation**. Hierarchical models:

**Individual level:** Each SN has intrinsic magnitude $M_i$

**Population level:** $M_i \sim \mathcal{N}(M_0, \sigma_{\text{int}})$

Simultaneously infer:
- Cosmology ($H_0$, $\Omega_m$, etc.)
- Population distribution ($M_0$, $\sigma_{\text{int}}$)
- Individual SN parameters

**Benefit:** Properly propagates uncertainty in standardization to cosmological inference.

### Galaxy Cluster Masses

Clusters have masses $M_i$ inferred from multiple methods (X-ray, lensing, dynamics).

**Hierarchical approach:**
- Each method has systematic biases
- Masses follow a population distribution
- Infer both individual masses and population simultaneously

### Strong Lensing Time Delays

Multiple images of lensed quasars have time delays $\Delta t_i$.

**Hierarchical model:**
- Each system constrains $H_0$
- Systems share population-level systematics
- Pooling improves $H_0$ constraints while marginalizing over systematics

---

## Comparison Table

| Feature | No Pooling | Complete Pooling | Hierarchical (Partial Pooling) |
|---------|------------|------------------|--------------------------------|
| **Assumptions** | All groups independent | All groups identical | Groups similar, drawn from population |
| **Group estimates** | Independent | All forced equal | Shrunk toward population mean |
| **Small-sample groups** | Very uncertain | Overconfident | Regularized by population |
| **Large-sample groups** | Accurate | Biased if group is unusual | Accurate (minimal shrinkage) |
| **Population inference** | Impossible | Possible but biased | Optimal |
| **Predictions** | Can't generalize | Uses global mean only | Uses learned population distribution |
| **Computation** | Trivial | Trivial | Requires MCMC |

---

## Practical Tips

### 1. Check Convergence Carefully

Hierarchical models can have tricky geometry. Use:
- Multiple chains (check $\hat{R} < 1.01$)
- High `target_accept` (e.g., 0.95)
- Longer warmup/tuning

### 2. Parameterization Matters

**Centered:** $\theta_i \sim \text{Beta}(\alpha, \beta)$
- Simple, but can have poor geometry when $\kappa$ is large

**Non-centered:** $\theta_i = \mu + \tau \cdot \epsilon_i$ where $\epsilon_i \sim \mathcal{N}(0, 1)$
- Better geometry for weakly-informed hierarchies
- See Stan/PyMC documentation for details

### 3. Visualize Shrinkage

Always plot:
- Raw group estimates vs hierarchical estimates
- Population distribution
- Individual group posteriors

Helps diagnose issues and communicate results.

### 4. Prior Sensitivity

Hierarchical models can be sensitive to hyperpriors on $\kappa$ (concentration).

**Check:** Run with different hyperpriors and verify conclusions are robust.

---

## Summary

**Hierarchical Bayesian models:**

- Pool information across groups via shared population parameters
- Exhibit shrinkage—regularizing small-sample groups toward population mean
- Provide population-level inference in addition to group-level
- Naturally handle unbalanced data (varying group sizes)
- Enable principled predictions for new groups

**Key concepts:**
- **Partial pooling** = middle ground between no pooling and complete pooling
- **Shrinkage** = groups borrow strength from population
- **Hyperparameters** = population-level parameters (e.g., $\alpha, \beta$)
- **Requires MCMC** for most non-conjugate problems

**Applications:**
- Time-varying parameters (rowing example)
- Meta-analysis (combining studies)
- Spatial/temporal models
- Cosmological systematics
- Calibration hierarchies

---

**Next:**
- [[bayesian-inference]] - The general framework
- [[analytical-update]] - The rowing example this extends
- [[mcmc]] - Sampling methods for hierarchical models

**Related:**
- [[prior-choice]] - Choosing hyperpriors
- [[model-comparison]] - Comparing pooling strategies via evidence

---

**References:**

[Gelman2013]: Gelman, A., et al. (2013). *Bayesian Data Analysis* (3rd ed.). CRC Press. [Chapter 5: Hierarchical Models]

[McElreath2020]: McElreath, R. (2020). *Statistical Rethinking* (2nd ed.). CRC Press. [Chapter 13: Models with Memory]

[Efron1977]: Efron, B., & Morris, C. (1977). Stein's paradox in statistics. *Scientific American*, 236(5), 119-127.

[Rubin1981]: Rubin, D. B. (1981). Estimation in parallel randomized experiments. *Journal of Educational Statistics*, 6(4), 377-401.

[Betancourt2017]: Betancourt, M. (2017). Diagnosing Biased Inference with Divergences. Stan Case Studies, Volume 4.

[Trotta2008]: Trotta, R. (2008). Bayes in the sky: Bayesian inference and model selection in cosmology. *Contemporary Physics*, 49(2), 71-104.
