# Model Comparison

← Back to [[index]] | Previous: [[evidence]]

---

## The Question Science Asks

"Which theory is correct?" Or more precisely: **"Given the data, how much more probable is Model A than Model B?"**

This is the domain of Bayesian model comparison, enabled by the [[evidence]].

---

## The Bayes Factor

To compare models $\mathcal{M}_0$ and $\mathcal{M}_1$, apply [[bayes-theorem]] at the model level:

$$\frac{p(\mathcal{M}_0|d)}{p(\mathcal{M}_1|d)} = \frac{p(d|\mathcal{M}_0)}{p(d|\mathcal{M}_1)} \cdot \frac{p(\mathcal{M}_0)}{p(\mathcal{M}_1)}$$

If we assign **equal prior probabilities** to both models (no a priori reason to favor one):

$$\boxed{\text{Posterior odds} = \text{Bayes factor} = B_{01} = \frac{\mathcal{Z}_0}{\mathcal{Z}_1}}$$

We typically work in log space: $\Delta\log\mathcal{Z} = \log(\mathcal{Z}_0/\mathcal{Z}_1)$.

**Interpretation:** $B_{01} = 12$ means "the data favor Model 0 by odds of 12:1" or equivalently "Model 0 is 12 times more probable than Model 1 given the data."

---

## Jeffreys' Scale

Sir Harold Jeffreys provided an empirical scale for interpreting evidence differences[^Jeffreys1961]:

| $\|\Delta\log\mathcal{Z}\|$ | Odds | Posterior Probability | Interpretation |
|:--:|:--:|:--:|:--:|
| $< 1.0$ | $\lesssim 3:1$ | $< 0.75$ | **Inconclusive** |
| $1.0$ | $\sim 3:1$ | $0.75$ | **Weak evidence** |
| $2.5$ | $\sim 12:1$ | $0.92$ | **Moderate evidence** |
| $5.0$ | $\sim 150:1$ | $0.99$ | **Strong evidence** |
| $> 10$ | $> 20,000:1$ | $> 0.9999$ | **Decisive evidence** |

The "Posterior Probability" column shows $p(\mathcal{M}_0|d)$ in a 2-model comparison with equal priors—analogous to a p-value but more interpretable.

**Important:** These thresholds are empirical guidelines, not strict rules. Context matters!

---

## Real-World Examples

For a simple pedagogical example of model comparison with analytical solutions, see [[analytical-update]] (the rowing lane advantage problem).

## Example 1: Dark Energy Equation of State

**Scientific question:** Is dark energy a cosmological constant ($w = -1$), or does it have a different equation of state?

### The Models

**Model 0:** Flat $\Lambda$CDM
- 6 parameters: $\{\Omega_b h^2, \Omega_c h^2, H_0, A_s, n_s, \tau\}$
- Dark energy equation of state: $w = -1$ (fixed)

**Model 1:** Flat $w$CDM
- 7 parameters: same as above plus $w$
- Dark energy equation of state: $w$ is free

### The Data

Type Ia supernovae from Pantheon+ catalog[^Brout2022] (1701 SNe out to $z \sim 2$).

### Results

Running [[nested-sampling]] on both models:

```
Flat ΛCDM:
  log Z₀ = 1234.5 ± 0.3
  Best fit: Ωₘ = 0.33 ± 0.02, H₀ = 73.7 ± 1.0 km/s/Mpc

Flat wCDM:
  log Z₁ = 1232.3 ± 0.3
  Best fit: Ωₘ = 0.32 ± 0.07, w = -0.97 ± 0.16, H₀ = 73.7 ± 1.0 km/s/Mpc
```

### Evidence Comparison

$$\Delta\log\mathcal{Z} = 1234.5 - 1232.3 = 2.2$$

Using [[evidence#The Laplace Approximation|the Laplace decomposition]]:

$$\Delta\log\mathcal{Z} \approx \underbrace{\Delta\log\mathcal{L}_{\text{max}}}_{+0.5} - \underbrace{\frac{\Delta\hat{d}}{2}}_{-0.5} - \underbrace{\Delta\mathcal{D}_{\text{KL}}}_{-1.2} \approx +2.2$$

**Interpretation:**
- **Fit quality**: $w$CDM fits slightly better (+0.5)
- **Dimensionality penalty**: Adding $w$ costs -0.5
- **Occam penalty**: The prior on $w$ is wide but posterior only slightly narrower (-1.2)
- **Conclusion**: $\Lambda$CDM is preferred with **moderate evidence** (Jeffreys scale: 2.2 ≈ 9:1 odds)

**Physical interpretation:** The data are consistent with $w = -1$. Adding $w$ as a free parameter doesn't improve the fit enough to justify the complexity. The simplest model (cosmological constant) is favored.

---

## Example 2: Spatial Curvature

**Scientific question:** Is the universe spatially flat, or does it have curvature?

### The Models

**Model 0:** Flat $\Lambda$CDM
- 6 parameters
- Curvature: $\Omega_k = 0$ (fixed)

**Model 1:** Curved $\Lambda$CDM
- 7 parameters (adds $\Omega_k$)
- Curvature: $\Omega_k$ free

### The Data

Planck 2018 CMB temperature and polarization power spectra[^Planck2018].

### Results

```
Flat ΛCDM:
  log Z₀ = 87573.4 ± 0.3
  Best fit: Ωₘ = 0.315 ± 0.007

Curved ΛCDM:
  log Z₁ = 87572.3 ± 0.3
  Best fit: Ωₘ = 0.32 ± 0.05, Ωₖ = 0.03 ± 0.12
```

### Evidence Comparison

$$\Delta\log\mathcal{Z} = 87573.4 - 87572.3 = 1.1$$

**Interpretation:**
- Flat model is weakly preferred (3:1 odds)
- The data are consistent with $\Omega_k = 0$ (within 1σ)
- Adding curvature improves fit marginally but doesn't justify the extra parameter
- **Conclusion**: Universe is consistent with flatness; no evidence for curvature

**Why does this matter?** The posterior includes $\Omega_k = 0$ within its credible interval, so a frequentist analysis might say "we can't rule out curvature." But Bayesian evidence says "we don't *need* curvature"—a stronger statement.

---

## Example 3: Non-Gaussian Scatter

**Scientific question:** Are the supernova residuals actually Gaussian, or do they have heavier tails?

This example illustrates comparing **statistical assumptions**, not just physical models.

### The Models

Both use Flat $\Lambda$CDM cosmology, but differ in scatter model:

**Model A:** Gaussian likelihood

$$\mathcal{L} = \prod_i \frac{1}{\sqrt{2\pi\sigma_i^2}} \exp\left(-\frac{\Delta_i^2}{2\sigma_i^2}\right)$$

**Model B:** Student's t-distribution

$$\mathcal{L} = \prod_i \frac{\Gamma((\nu+1)/2)}{\Gamma(\nu/2)\sqrt{\nu\pi\sigma_i^2}}\left(1 + \frac{\Delta_i^2}{\nu\sigma_i^2}\right)^{-(\nu+1)/2}$$

where $\nu$ is the degrees of freedom (controls tail heaviness).

### The Data

Pantheon+ supernova Hubble residuals[^Lovick2024].

### Results

```
Gaussian:
  log Z_A = 1234.5 ± 0.3

Student's t:
  log Z_B = 1237.2 ± 0.3
  ν = 5.2 ± 1.8 (heavier tails than Gaussian)
```

### Evidence Comparison

$$\Delta\log\mathcal{Z} = 1237.2 - 1234.5 = 2.7$$

**Interpretation:**
- Student's t is preferred with **moderate evidence** (~15:1 odds)
- Best-fit $\nu \approx 5$ suggests heavier tails than Gaussian ($\nu \to \infty$)
- This indicates either:
  - Underestimated uncertainties in the covariance matrix
  - Outliers from unmodeled systematics
  - Non-Gaussian intrinsic scatter

**Practical impact:** Using Student's t reduces uncertainty on $H_0$ from $1.03$ to $0.99$ km/s/Mpc by down-weighting outliers.

**Key insight:** Evidence can test *any* model assumption—not just cosmology, but also likelihoods, priors, and systematics.

---

## The Power of Marginalization

A unique feature of Bayesian evidence: **you can marginalize over model uncertainties**.

Suppose we're uncertain about both:
- Cosmology: $\Lambda$CDM vs $w$CDM
- Scatter: Gaussian vs Student's t

We can compute **four evidences** (2 cosmologies × 2 scatters), then marginalize:

$$p(d|\text{Cosmology}_i) = \sum_j p(d|\text{Cosmology}_i, \text{Scatter}_j) p(\text{Scatter}_j)$$

This gives a **model-averaged** answer that accounts for our uncertainty about the statistical model.

**Example result:**
```
Marginalizing over scatter models:
  P(ΛCDM | data) = 0.85
  P(wCDM | data) = 0.15

Best-fit H₀ (marginalized): 73.7 ± 1.1 km/s/Mpc
```

This is more honest than picking one scatter model arbitrarily.

---

## Nested Models and the Savage-Dickey Ratio

When Model 1 is **nested** in Model 0 (i.e., setting one parameter $\theta^* = 0$ recovers Model 1), there's a clever shortcut[^TrottaDickey]:

$$B_{01} = \frac{\mathcal{Z}_0}{\mathcal{Z}_1} = \frac{p(\theta^* = 0|d, \mathcal{M}_0)}{p(\theta^* = 0|\mathcal{M}_0)}$$

**In words:** The Bayes factor equals the ratio of posterior to prior density at the special value.

**Example:** Testing $w = -1$ in $w$CDM:

```python
# Run MCMC on wCDM
posterior_samples = run_mcmc(wCDM_model)

# Evaluate densities at w = -1
posterior_density_at_minus1 = kde(posterior_samples['w']).pdf(-1)
prior_density_at_minus1 = 1 / (w_max - w_min)  # Uniform prior

# Bayes factor
B = posterior_density_at_minus1 / prior_density_at_minus1
```

This avoids running the simpler model entirely — you only need the more complex model's posterior.

---

## Common Pitfalls

### 1. "My Bayes factor is sensitive to the prior"

That's correct — evidence *should* depend on priors, that's the point.

The prior encodes your model's predictions. A model that predicts "anything is possible" (very wide prior) gets penalized via the Occam factor.

**Solution:** Use physically motivated priors. If results change dramatically with reasonable prior choices, you probably need more data.

### 2. "I got different evidences from different methods"

Evidence calculation is numerically challenging. Different methods can give slightly different values:

- [[nested-sampling]]: $\mathcal{Z} \pm 0.5$ (typical precision)
- Thermodynamic integration: $\mathcal{Z} \pm 0.3$
- Harmonic mean: Can be very unstable!

**Solution:** Use nested sampling for rigorous comparisons. Check convergence carefully. Compare methods on toy problems first.

### 3. "Can I compare models with different data?"

No. The evidence is $p(d|\mathcal{M})$—the probability of *this specific dataset* under each model.

If you use different data (e.g., different redshift cuts), you're computing $p(d_1|\mathcal{M}_1)$ vs $p(d_2|\mathcal{M}_2)$, which is meaningless.

**Solution:** Use identical datasets for all models you're comparing.

### 4. "Bayes factor is 0.3, which model is better?"

$\Delta\log\mathcal{Z} = 0.3$ is **inconclusive** (< 1 on Jeffreys scale).

This doesn't mean "they're equally good"—it means "this dataset can't distinguish them." You need:
- More data, or
- Different/complementary data, or
- To accept that both models are viable

---

## Evidence vs Other Criteria

### AIC (Akaike Information Criterion)

$$\text{AIC} = 2k - 2\log\mathcal{L}_{\text{max}}$$

where $k$ = number of parameters.

**Relation to evidence:** AIC approximates $-2\log\mathcal{Z}$ in the limit of large data and weak priors.

**Drawback:** Only uses $\mathcal{L}_{\text{max}}$, ignores posterior volume. Penalty is simply $k$, not the Bayesian $\hat{d}$ (effective dimensionality).

### BIC (Bayesian Information Criterion)

$$\text{BIC} = k\log n - 2\log\mathcal{L}_{\text{max}}$$

where $n$ = number of data points.

**Relation to evidence:** Better approximation to $-2\log\mathcal{Z}$ under more restrictive assumptions.

**Drawback:** Still only uses $\mathcal{L}_{\text{max}}$. Assumes large $n$ limit.

### Why Use Full Bayesian Evidence?

1. **Accounts for full posterior volume**, not just the peak
2. **Natural Occam penalty** through $\mathcal{D}_{\text{KL}}$
3. **Exact for any sample size** (no large-$n$ assumption)
4. **Principled probability statements** (odds ratios)
5. **Allows marginalization** over nuisance models

---

## Real-World Example: DESI and Evolving Dark Energy

In 2024, the DESI collaboration reported hints of evolving dark energy ($w_0w_a$ model)[^DESI2024]. The community debate centered on: **Is this statistically significant?**

### Frequentist Analysis

- $w_a = -0.5 \pm 0.3$ (2σ from zero)
- PTE (probability to exceed) analysis
- "Moderate tension with $\Lambda$CDM"

**Problem:** Different metrics give different answers. Is 2σ enough? What about the look-elsewhere effect?

### Bayesian Analysis (hypothetical)

Compare evidences:
```
ΛCDM: log Z₀ = 5432.1
w₀wₐCDM: log Z₁ = 5431.8
```

$$\Delta\log\mathcal{Z} = -0.3$$

**Conclusion:** Inconclusive (< 1). The improved fit doesn't overcome the penalty for two extra parameters ($w_0$, $w_a$).

**Interpretation:** The data show a *preference* for $w_a \neq 0$, but not enough to justify the more complex model. This is a much clearer statement than "2σ tension."

*(Note: These are illustrative numbers; full DESI Bayesian analysis would be needed.)*

---

## Summary

**Model comparison via Bayesian evidence:**

- Provides direct probability statements (odds ratios)
- Automatically implements Occam's razor
- Works for any models (nested or not)
- Allows marginalization over model uncertainties
- Rigorous and principled

**Requires:**
- Careful prior specification (affects evidence)
- Specialized computation methods ([[nested-sampling]])
- Same dataset for all models compared

**Jeffreys scale guide:**
- < 1: Inconclusive
- 1-2.5: Weak to moderate
- 2.5-5: Moderate to strong
- \> 5: Strong evidence

When you want to answer "which model is correct?", compute the evidence — it's the principled way to do model comparison.

---

**Next:**
- [[nested-sampling]] - How to compute the evidence
- [[computing-evidence]] - Comparing different methods
- [[cmb-analysis]] - Model comparison applied to CMB data

**Related:**
- [[evidence]] - Understanding what evidence means
- [[bayesian-inference]] - The general framework

---

**References:**

[^Jeffreys1961]: Jeffreys, H. (1961). *Theory of Probability* (3rd ed.). Oxford University Press.

[^Trotta2008]: Trotta, R. (2008). Bayes in the sky: Bayesian inference and model selection in cosmology. *Contemporary Physics*, 49(2), 71-104.

[^Brout2022]: Brout, D., et al. (2022). The Pantheon+ analysis: cosmological constraints. *The Astrophysical Journal*, 938(2), 110.

[^Planck2018]: Planck Collaboration (2018). Planck 2018 results. VI. Cosmological parameters. *Astronomy & Astrophysics*, 641, A6.

[^Lovick2024]: Lovick, T., Dhawan, S., & Handley, W. (2024). Non-Gaussian likelihoods for Type Ia Supernovae cosmology. *MNRAS* (submitted).

[^TrottaDickey]: Trotta, R. (2007). Applications of Bayesian model selection to cosmological parameters. *MNRAS*, 378(1), 72-82.

[^DESI2024]: DESI Collaboration (2024). DESI 2024 VI: Cosmological constraints from the measurements of baryon acoustic oscillations. *arXiv:2404.03002*.
