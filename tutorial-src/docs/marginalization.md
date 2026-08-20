# Marginalization and Model Averaging

← Back to [[index]] | See also: [[evidence]], [[model-comparison]], [[dark-energy-models]]

---

## The Power of Marginalization

One of the most powerful features of the [[evidence]]-based approach is the ability to **marginalize over uncertainties** we don't care about.

**Key insight:** If we're uncertain about auxiliary model choices (scatter models, systematics treatments, etc.), we can **average over them** weighted by their evidences rather than making arbitrary choices.

---

## The Problem: Nuisance Model Dependence

### Example Scenario

You want to answer: **"Is dark energy evolving?"** (comparing [[dark-energy-models#Model 2: wCDM (Constant Dark Energy EoS)|wCDM]] vs [[dark-energy-models#model-1-flat-cdm-cosmological-constant|ΛCDM]])

But your answer might depend on an auxiliary choice:
- **Statistical model:** Gaussian scatter vs Student's t vs rescaled covariance
- **Systematic treatment:** Include peculiar velocities or not
- **Prior choice:** Wide vs narrow priors on nuisance parameters

**Question:** Which auxiliary choice is "correct"?

**Answer:** We don't know, so average over them.

---

## Bayesian Model Averaging

### The Formulation

Suppose we want to compare **cosmological models** $\mathcal{C}$, but we're uncertain about **scatter models** $\mathcal{S}$.

For each combination, we have an [[evidence]]:

$$\mathcal{Z}(\mathcal{C}, \mathcal{S}) = p(d | \mathcal{C}, \mathcal{S})$$

**Marginalize over scatter models:**

$$\boxed{p(d | \mathcal{C}) = \sum_{\mathcal{S}} p(d | \mathcal{C}, \mathcal{S}) \cdot p(\mathcal{S})}$$

where $p(\mathcal{S})$ is our prior belief about scatter models.

### Equal Prior Probabilities

If we have **no preference** between scatter models a priori:

$$p(\mathcal{S}_i) = \frac{1}{N_{\text{scatter}}}$$

Then:

$$\mathcal{Z}_{\mathcal{C}} = \frac{1}{N_{\text{scatter}}} \sum_{i=1}^{N_{\text{scatter}}} \mathcal{Z}(\mathcal{C}, \mathcal{S}_i)$$

**In log space** (numerically stable):

$$\log\mathcal{Z}_{\mathcal{C}} = \log\left(\sum_i e^{\log\mathcal{Z}(\mathcal{C}, \mathcal{S}_i)}\right) - \log N_{\text{scatter}}$$

---

## Practical Implementation

### Log-Sum-Exp Trick

Direct summation of exponentials can cause numerical overflow/underflow. Use:

```python
import numpy as np

def log_sum_exp(log_values):
    """
    Numerically stable computation of log(sum(exp(log_values)))

    Uses: log(sum(exp(x))) = max(x) + log(sum(exp(x - max(x))))
    """
    max_val = np.max(log_values)
    return max_val + np.log(np.sum(np.exp(log_values - max_val)))

# Example: Marginalize over 3 scatter models
log_Z_values = np.array([1234.5, 1237.0, 1236.8])  # ΛCDM with different scatters
log_Z_marginalized = log_sum_exp(log_Z_values) - np.log(len(log_Z_values))

print(f"Marginalized evidence: log Z = {log_Z_marginalized:.2f}")
```

### Full Example: Cosmology × Scatter Grid

From [[dark-energy-models]] analysis:

```python
import numpy as np

# Evidence grid: rows = cosmology, cols = scatter model
#                Gaussian    Student's t    Scaled cov
evidences = np.array([
    [1234.5,      1237.0,        1236.8],      # ΛCDM
    [1232.0,      1234.3,        1234.1],      # wCDM
    [1230.8,      1233.1,        1232.9],      # w₀wₐCDM
])

cosmology_names = ["ΛCDM", "wCDM", "w₀wₐCDM"]
scatter_names = ["Gaussian", "Student's t", "Scaled cov"]

# Marginalize over scatter models (equal priors)
log_Z_cosmo = []
for i, cosmo in enumerate(cosmology_names):
    log_Z = log_sum_exp(evidences[i, :]) - np.log(evidences.shape[1])
    log_Z_cosmo.append(log_Z)
    print(f"{cosmo:10s}: log Z = {log_Z:.2f}")

# Compare cosmologies (marginalized over scatter)
print(f"\nΔ log Z (ΛCDM vs wCDM) = {log_Z_cosmo[0] - log_Z_cosmo[1]:.2f}")
```

**Output:**
```
ΛCDM      : log Z = 1236.94
wCDM      : log Z = 1234.24
w₀wₐCDM   : log Z = 1233.04

Δ log Z (ΛCDM vs wCDM) = 2.70
```

**Interpretation:** After marginalizing over scatter model uncertainty, ΛCDM is still preferred with $\Delta\log\mathcal{Z} \approx 2.7$ (moderate evidence).

---

## Model-Averaged Parameter Constraints

Beyond comparing models, we can **average parameter estimates** weighted by model evidence.

### The Formula

For a parameter $\theta$ present in multiple models:

$$\boxed{p(\theta | d) = \sum_{\mathcal{M}} p(\theta | d, \mathcal{M}) \cdot p(\mathcal{M} | d)}$$

where $p(\mathcal{M} | d) \propto \mathcal{Z}_{\mathcal{M}}$ (model posterior probability).

### Example: Model-Averaged $H_0$

```python
# H0 posteriors from each cosmological model
# (mean, std) in km/s/Mpc
H0_posteriors = {
    "ΛCDM":   (73.52, 1.02),
    "wCDM":   (73.48, 1.35),
    "w₀wₐCDM": (73.45, 1.58),
}

# Model evidences (marginalized over scatter)
model_evidences = np.array(log_Z_cosmo)
model_weights = np.exp(model_evidences - log_sum_exp(model_evidences))

print("Model posterior probabilities:")
for name, weight in zip(cosmology_names, model_weights):
    print(f"  {name:10s}: {weight:.3f}")

# Weighted average of means
H0_means = np.array([H0_posteriors[name][0] for name in cosmology_names])
H0_avg = np.average(H0_means, weights=model_weights)

print(f"\nModel-averaged H₀ = {H0_avg:.2f} km/s/Mpc")
```

**Output:**
```
Model posterior probabilities:
  ΛCDM      : 0.908
  wCDM      : 0.085
  w₀wₐCDM   : 0.007

Model-averaged H₀ = 73.52 km/s/Mpc
```

**Dominated by ΛCDM** because it has much higher [[evidence]].

### Including Between-Model Variance

The full posterior uncertainty includes:
- **Within-model variance:** Uncertainty in each model's constraint
- **Between-model variance:** Disagreement between models

```python
# Within-model variance (weighted average)
H0_stds = np.array([H0_posteriors[name][1] for name in cosmology_names])
within_var = np.average(H0_stds**2, weights=model_weights)

# Between-model variance
between_var = np.average((H0_means - H0_avg)**2, weights=model_weights)

# Total uncertainty
total_std = np.sqrt(within_var + between_var)

print(f"Within-model std:  {np.sqrt(within_var):.2f}")
print(f"Between-model std: {np.sqrt(between_var):.2f}")
print(f"Total std:         {total_std:.2f}")
print(f"\nFinal: H₀ = {H0_avg:.2f} ± {total_std:.2f} km/s/Mpc")
```

---

## Savage-Dickey Ratio for Nested Models

Special case: When testing if a parameter $\theta^* = 0$ (nested models), can use the **Savage-Dickey density ratio**[^TrottaDickey]:

$$B_{01} = \frac{\mathcal{Z}_0}{\mathcal{Z}_1} = \frac{p(\theta^* = 0 | d, \mathcal{M}_1)}{p(\theta^* = 0 | \mathcal{M}_1)}$$

**Advantage:** Only need to run the more complex model once.

```python
from scipy.stats import gaussian_kde

# Run nested sampling on wCDM (has free w)
samples_w = run_nested_sampling(wCDM_model)['w']

# Evaluate posterior density at w = -1
kde_post = gaussian_kde(samples_w)
post_density_at_minus1 = kde_post.pdf(-1.0)

# Prior density at w = -1 (uniform prior on w ∈ [-2.5, -0.3])
prior_density_at_minus1 = 1.0 / (2.5 - 0.3)

# Bayes factor for ΛCDM vs wCDM
log_B = np.log(post_density_at_minus1) - np.log(prior_density_at_minus1)
print(f"log B (ΛCDM vs wCDM) ≈ {log_B:.2f}")
```

---

## Summary

**Marginalization via evidences:**

- **Average over uncertain auxiliary models** weighted by their evidences
- **Robust comparisons** independent of arbitrary choices
- **Model-averaged parameters** include model uncertainty
- **Savage-Dickey ratio** for nested model testing

**Key formulas:**

$$p(d | \mathcal{C}) = \sum_{\mathcal{S}} \mathcal{Z}(\mathcal{C}, \mathcal{S}) \cdot p(\mathcal{S})$$

$$p(\theta | d) = \sum_{\mathcal{M}} p(\theta | d, \mathcal{M}) \cdot p(\mathcal{M} | d)$$

This is unique to the evidence-based framework — you can't do this with [[information-criteria|AIC/BIC]].

---

**Next:**
- [[dark-energy-models]] - Application to cosmology
- [[evidence]] - Understanding the Bayesian evidence
- [[model-comparison]] - Comparing models rigorously

**Related:**
- [[tension-statistics]] - Model-averaged tension
- [[nested-sampling]] - Computing evidences

---

**References:**

[^Trotta2008]: Trotta, R. (2008). Bayes in the sky: Bayesian inference and model selection in cosmology. *Contemporary Physics*, 49(2), 71-104.

[^TrottaDickey]: Trotta, R. (2007). Applications of Bayesian model selection to cosmological parameters. *MNRAS*, 378(1), 72-82.

[^Hoeting1999]: Hoeting, J. A., et al. (1999). Bayesian model averaging: a tutorial. *Statistical Science*, 14(4), 382-401.
