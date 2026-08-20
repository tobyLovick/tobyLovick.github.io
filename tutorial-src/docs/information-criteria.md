# Information Criteria: AIC and BIC

← Back to [[index]] | See also: [[evidence]], [[model-comparison]]

---

## When Full Bayesian Analysis Isn't Feasible

Computing the [[evidence]] via [[nested-sampling]] can be computationally expensive, especially for:
- Very high-dimensional problems
- Rapid prototyping and exploration
- Screening many candidate models

**Information criteria** provide quick approximations to [[model-comparison]] using only the **maximum likelihood**.

---

## Akaike Information Criterion (AIC)

Proposed by Hirotsugu Akaike in 1974[^Akaike1974], AIC estimates the relative quality of statistical models.

### Definition

$$\boxed{\text{AIC} = 2k - 2\log\mathcal{L}_{\max}}$$

where:
- $k$ = number of parameters in the model
- $\mathcal{L}_{\max}$ = maximum likelihood value

**Model comparison:** Prefer the model with **lower AIC**.

**Differences in AIC:**

$$\Delta\text{AIC} = \text{AIC}_1 - \text{AIC}_0$$

- $\Delta\text{AIC} < 2$: Models essentially equivalent
- $2 < \Delta\text{AIC} < 7$: Moderate evidence for model 0
- $\Delta\text{AIC} > 10$: Strong evidence for model 0

### Theoretical Foundation

AIC is an **asymptotic estimate** of the expected out-of-sample prediction error, derived from information theory.

**Connection to evidence:** In the limit of:
- Large sample size ($n \to \infty$)
- Weak, uniform priors
- Well-determined parameters

We have approximately:

$$-2\log\mathcal{Z} \approx \text{AIC} + \text{const}$$

### What AIC Measures

$$\text{AIC} = \underbrace{-2\log\mathcal{L}_{\max}}_{\text{Goodness of fit}} + \underbrace{2k}_{\text{Complexity penalty}}$$

**Interpretation:**
- First term: How poorly does the best-fit model explain the data?
- Second term: Linear penalty of 2 per parameter

### Limitations

**AIC ignores:**
1. **Prior volume** - Doesn't account for parameter ranges
2. **Posterior shape** - Only uses the peak, not the full distribution
3. **Parameter correlations** - Penalty is simply $k$, not effective dimensionality
4. **Sample size** - Assumes large $n$ limit

**Example where AIC fails:**

Suppose you have two models:
- **Model A:** 2 independent parameters, both well-constrained
- **Model B:** 2 highly degenerate parameters (banana-shaped posterior)

AIC gives same penalty (2) for both, but Model B effectively has fewer constrained parameters. The [[evidence]] (via [[kl-divergence|KL divergence]]) correctly accounts for this.

---

## Bayesian Information Criterion (BIC)

Also called the Schwarz criterion[^Schwarz1978], BIC provides a better approximation to the Bayesian evidence.

### Definition

$$\boxed{\text{BIC} = k\log n - 2\log\mathcal{L}_{\max}}$$

where $n$ = number of data points.

**Model comparison:** Prefer the model with **lower BIC**.

### Theoretical Foundation

Under certain assumptions (Gaussian posterior, large $n$), BIC approximates:

$$\text{BIC} \approx -2\log\mathcal{Z} + \text{const}$$

**More principled than AIC** for Bayesian model comparison because it explicitly approximates the [[evidence]].

### What BIC Measures

$$\text{BIC} = \underbrace{-2\log\mathcal{L}_{\max}}_{\text{Goodness of fit}} + \underbrace{k\log n}_{\text{Complexity penalty}}$$

**Key difference from AIC:** The penalty $k\log n$ **increases with sample size**.

**Intuition:** With more data, we can afford more complex models—but we also demand stronger evidence before accepting them.

### Relationship to Laplace Approximation

BIC arises from the [[evidence#The Laplace Approximation|Laplace approximation]]:

$$\log\mathcal{Z} \approx \log\mathcal{L}_{\max} + \frac{k}{2}\log(2\pi) - \frac{1}{2}\log|\mathbf{H}|$$

When the Hessian $\mathbf{H}$ is approximated by $n \mathbf{I}$ (identity matrix scaled by sample size):

$$\log|\mathbf{H}| \approx k\log n$$

This gives:

$$-2\log\mathcal{Z} \approx -2\log\mathcal{L}_{\max} + k\log n = \text{BIC}$$

### Limitations

**BIC assumes:**
1. **Large sample size** ($n \gg k$)
2. **Gaussian posterior** (Laplace approximation valid)
3. **Unit Fisher information** (parameters on natural scale)

**BIC can be:**
- **Too lenient** when $n$ is small (penalty underestimates complexity)
- **Too harsh** when parameters are degenerate (penalty overestimates effective dimensionality)

---

## Worked Example: Dark Energy Models

Comparing [[dark-energy-models|cosmological models]] using Pantheon+ supernovae ($n = 1701$ SNe).

### The Models

**Flat ΛCDM:** 6 cosmological parameters (for CMB) + 3 nuisance ($M_B$, $\alpha$, $\beta$)
- Total fitted to SNe: $k_{\Lambda\text{CDM}} = 3$ (assuming $H_0$, $\Omega_m$ fixed by CMB)

**wCDM:** Same as ΛCDM + free $w$
- Total: $k_{w\text{CDM}} = 4$

### Results

From [[nested-sampling]] analysis:

```
Model         log L_max    k    AIC       BIC       log Z
───────────────────────────────────────────────────────────
Flat ΛCDM     -621.3       3    1248.6    1266.2    1234.5
wCDM          -620.8       4    1249.6    1273.8    1232.0
```

### AIC Comparison

$$\Delta\text{AIC} = 1249.6 - 1248.6 = 1.0$$

**Conclusion:** Models essentially equivalent (Δ < 2). wCDM fits better but has one more parameter.

### BIC Comparison

$$\Delta\text{BIC} = 1273.8 - 1266.2 = 7.6$$

**Conclusion:** Moderate to strong evidence for ΛCDM.

**Why harsher than AIC?** Penalty for extra parameter is $\log(1701) \approx 7.4$ vs just 2 in AIC.

### Bayesian Evidence Comparison

$$\Delta\log\mathcal{Z} = 1232.0 - 1234.5 = -2.5$$

**Conclusion:** Moderate evidence for ΛCDM (Bayes factor $\sim 12:1$).

### Why Do They Differ?

**AIC (Δ = 1.0):** Too optimistic about wCDM
- Penalty of 2 is insufficient for 1701 data points
- Doesn't account for wide prior on $w$

**BIC (Δ = 7.6):** Too harsh against wCDM
- Assumes Gaussian posterior (actually has long tail in $w$)
- Doesn't account for partial constraint on $w$

**Evidence (Δ = 2.5):** Just right
- Accounts for actual [[kl-divergence|posterior compression]]
- Includes [[evidence#The Occam Penalty|Occam penalty]] from prior volume
- Bayesian model dimensionality $\hat{d}_w \approx 0.8$ (not 1)

### Decomposition

Using the [[evidence#The Laplace Approximation|evidence decomposition]]:

$$\Delta\log\mathcal{Z} \approx \underbrace{\Delta\log\mathcal{L}_{\max}}_{+0.5} - \underbrace{\Delta\hat{d}/2}_{-0.4} - \underbrace{\Delta\mathcal{D}_{\text{KL}}}_{-2.6} \approx -2.5$$

- **AIC approximation:** $\Delta\log\mathcal{L}_{\max} - k/2 = 0.5 - 0.5 = 0$ ✗ (wrong sign)
- **BIC approximation:** Uses $k\log n$ not actual $\hat{d}$ ✗ (overestimates)
- **Nested sampling:** Exact ✓

---

## Corrected AIC (AICc)

For small sample sizes, AIC has a **finite-sample correction**[^Hurvich1989]:

$$\text{AICc} = \text{AIC} + \frac{2k(k+1)}{n - k - 1}$$

**When $n \gg k$:** Correction term negligible, AICc ≈ AIC

**When $n \sim k$:** Correction important, penalizes complexity more heavily

**Rule of thumb:** Use AICc when $n/k < 40$.

---

## DIC: Deviance Information Criterion

An alternative for Bayesian models[^Spiegelhalter2002]:

$$\text{DIC} = \bar{D} + p_D$$

where:
- $\bar{D} = \mathbb{E}[-2\log\mathcal{L}(\theta)]$ averaged over posterior
- $p_D = \bar{D} - (-2\log\mathcal{L}(\bar{\theta}))$ effective number of parameters

**Advantage:** Can be computed from [[mcmc|MCMC samples]] without rerunning model.

**Disadvantage:** Not as well-founded as AIC/BIC; can give negative $p_D$ in some cases.

---

## When to Use Each Criterion

### Use AIC When:
- Exploratory data analysis
- Prediction accuracy is the goal
- Many models to screen quickly
- Sample size is moderate-to-large

### Use BIC When:
- You want Bayesian-like model comparison
- Sample size is large ($n \gg k$)
- You believe true model is in candidate set
- Penalizing complexity more heavily

### Use AICc When:
- Sample size is small ($n/k < 40$)
- Risk of overfitting is high

### Use Full Bayesian Evidence When:
- Final publishable results
- Priors contain important information
- Parameters are correlated/degenerate
- Strong model comparison claims
- Computational resources available

---

## Practical Workflow

**Phase 1: Rapid screening (AIC/BIC)**
```python
# Quick screening of many models
models = [model1, model2, ..., model20]
aics = []

for model in models:
    fit = maximize_likelihood(model, data)
    k = model.n_parameters
    aic = 2*k - 2*fit.log_likelihood
    aics.append((model.name, aic))

# Keep top 3-5 models
top_models = sorted(aics, key=lambda x: x[1])[:5]
```

**Phase 2: Detailed comparison (Nested Sampling)**
```python
from pypolychord import run_polychord

# Run nested sampling on top candidates
for model_name in top_models:
    output = run_polychord(
        loglike=model.log_likelihood,
        prior=model.prior_transform,
        nDims=model.n_parameters,
        ...
    )
    print(f"{model_name}: log Z = {output.logZ:.2f}")
```

**Phase 3: Report both**
```
Model Selection Results:
  Screening (BIC): ΛCDM preferred (ΔBIC = 7.6)
  Full Bayesian (NS): ΛCDM preferred (Δlog Z = 2.5)
  Conclusion: Robust preference for simpler model
```

---

## Common Pitfalls

### "My AIC and BIC disagree"

**This is normal.** BIC penalizes complexity more heavily:
- BIC penalty: $k\log n$
- AIC penalty: $2k$

For $n > 8$, we have $\log n > 2$, so BIC prefers simpler models than AIC.

**What to do:**
- If they agree: good, no ambiguity.
- If they disagree: Use [[nested-sampling]] to arbitrate
- Generally: **BIC is closer to Bayesian evidence** for large $n$

### "I got negative AIC"

AIC can be negative (log-likelihood can be positive). Only **differences** matter:

$$\Delta\text{AIC} = \text{AIC}_1 - \text{AIC}_0$$

### "Should I use AIC or log(evidence)?"

They're on different scales, so don't mix them:
- AIC ≈ $-2\log\mathcal{Z} + \text{const}$
- The constant depends on priors, sample size, etc.

Use AIC to compare models **within your analysis**. Use evidence to make Bayesian statements.

### "My ΔAIC = 1.5, is this significant?"

**Rules of thumb** (Burnham & Anderson[^Burnham2002]):
- Δ < 2: Substantial support for both models
- 2-7: Less support for higher-AIC model
- 7-10: Considerably less support
- \> 10: Essentially no support

But these are **guidelines**, not hard thresholds. Use [[model-comparison#Jeffreys' Scale|Jeffreys' scale]] for Bayesian evidence.

---

## Summary

**Information criteria provide quick model comparison:**

| Criterion | Formula | Best for | Limitations |
|-----------|---------|----------|-------------|
| **AIC** | $2k - 2\log\mathcal{L}_{\max}$ | Prediction, screening | Ignores priors, posteriors |
| **BIC** | $k\log n - 2\log\mathcal{L}_{\max}$ | Bayesian approximation | Assumes Gaussian, large $n$ |
| **AICc** | AIC + correction | Small samples | Still ignores posteriors |
| **Evidence** | $\int\mathcal{L}\pi\,d\theta$ | Final comparison | Computationally expensive |

**Key insights:**
- AIC/BIC use only $\mathcal{L}_{\max}$ (peak), not full posterior
- Penalties ($2k$ or $k\log n$) approximate [[kl-divergence|KL divergence]] crudely
- Useful for **screening**, not **final conclusions**
- [[nested-sampling|Nested sampling]] gives exact Bayesian answer

**Best practice:**
1. Screen with AIC/BIC (cheap, fast)
2. Confirm top models with full evidence (rigorous)
3. Report both for transparency

---

**Next:**
- [[evidence]] - The full Bayesian approach
- [[model-comparison]] - Using evidence in practice
- [[nested-sampling]] - Computing evidence exactly

**Related:**
- [[kl-divergence]] - What information criteria approximate
- [[dark-energy-models]] - Application to cosmology

---

**References:**

[^Akaike1974]: Akaike, H. (1974). A new look at the statistical model identification. *IEEE Transactions on Automatic Control*, 19(6), 716-723.

[^Schwarz1978]: Schwarz, G. (1978). Estimating the dimension of a model. *The Annals of Statistics*, 6(2), 461-464.

[^Hurvich1989]: Hurvich, C. M., & Tsai, C. L. (1989). Regression and time series model selection in small samples. *Biometrika*, 76(2), 297-307.

[^Spiegelhalter2002]: Spiegelhalter, D. J., et al. (2002). Bayesian measures of model complexity and fit. *Journal of the Royal Statistical Society: Series B*, 64(4), 583-639.

[^Burnham2002]: Burnham, K. P., & Anderson, D. R. (2002). *Model Selection and Multimodel Inference* (2nd ed.). Springer.

[^Trotta2008]: Trotta, R. (2008). Bayes in the sky: Bayesian inference and model selection in cosmology. *Contemporary Physics*, 49(2), 71-104.
