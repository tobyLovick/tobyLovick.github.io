# The Bayesian Evidence

← Back to [[index]] | Previous: [[bayesian-inference]]

---

## The Most Important Quantity

In [[bayesian-inference]], we saw that the evidence $\mathcal{Z}$ appears as a normalizing constant:

$$\mathcal{P}(\theta) = \frac{\mathcal{L}(\theta)\pi(\theta)}{\mathcal{Z}}$$

For **parameter inference**, $\mathcal{Z}$ is just a nuisance—it doesn't affect the posterior shape.

**But for model comparison, the evidence is everything.**

---

## What Is the Evidence?

The evidence is the **average likelihood under the prior**:

$$\boxed{\mathcal{Z} = p(d|\mathcal{M}) = \int \mathcal{L}(\theta)\pi(\theta) \, d\theta = \langle \mathcal{L} \rangle_\pi}$$

It answers: **"How well does this model, with its parameter space and priors, predict the observed data?"**

### Three Interpretations

1. **Marginalized likelihood**: The likelihood with parameters integrated out
2. **Prior predictive probability**: How surprised is the model by seeing this data?
3. **Average model performance**: Expected likelihood if we sampled parameters from the prior

All three perspectives are equivalent and useful in different contexts.

---

## Why the Evidence Matters

Consider comparing two models:

**Model A:** Simple (few parameters, narrow predictions)
**Model B:** Complex (many parameters, wide predictions)

If both models fit the data equally well, which should we prefer?

### The Occam Penalty

The evidence naturally implements **Occam's razor** through the prior volume:

- **Simple model**: Concentrates prior on narrow range → high $\mathcal{L}$ everywhere in prior → high $\mathcal{Z}$
- **Complex model**: Spreads prior over wide range → high $\mathcal{L}$ only in small region → low $\mathcal{Z}$

**Intuition:** A complex model must fit **significantly better** to overcome the penalty for wasting prior volume. This is why [[prior-choice]] matters for evidence—the prior encodes the model's predictions.

### Visual Intuition

Imagine two models predicting a measurement:

```
Model A (simple):
Prior range: [0, 2]
Likelihood peak: at 1.0
Evidence: High (most of prior has good likelihood)

Model B (complex):
Prior range: [0, 10]
Likelihood peak: at 1.0 (same fit!)
Evidence: Lower (most of prior has terrible likelihood)
```

Model B spreads its prior over a wider range but the data only fall in a small region of that space. This "wasted" volume penalizes the evidence.

---

## Mathematical Decomposition

The evidence can be decomposed using the **Kullback-Leibler divergence**[^Trotta2008]:

$$\mathcal{D}_{\text{KL}} = \int \mathcal{P}(\theta) \log\frac{\mathcal{P}(\theta)}{\pi(\theta)} d\theta$$

This measures the **information gain** from prior to posterior.

Rearranging gives:

$$\boxed{\log\mathcal{Z} = \langle \log\mathcal{L} \rangle_{\mathcal{P}} - \mathcal{D}_{\text{KL}}}$$

**Interpretation:**

$$\text{Evidence} = \text{Goodness of fit} - \text{Complexity penalty}$$

- **$\langle \log\mathcal{L} \rangle_{\mathcal{P}}$**: How well does the model fit (averaged over posterior)?
- **$\mathcal{D}_{\text{KL}}$**: How much did the posterior compress from the prior?

Models that require **large compression** (high $\mathcal{D}_{\text{KL}}$) are penalized.

---

## The Laplace Approximation

For a likelihood that's approximately Gaussian near the posterior peak (many cosmological problems!), we can further decompose[^Trotta2008]:

$$\langle \log\mathcal{L} \rangle_{\mathcal{P}} \approx \log\mathcal{L}_{\text{max}} - \frac{\hat{d}}{2}$$

where $\hat{d}$ is the **Bayesian model dimensionality**[^HandleyLemos2019]—the effective number of constrained parameters.

Substituting into the previous equation:

$$\boxed{\Delta\log\mathcal{Z} \approx \Delta\log\mathcal{L}_{\text{max}} - \frac{\Delta\hat{d}}{2} - \Delta\mathcal{D}_{\text{KL}}}$$

**This is the fundamental equation of model comparison.**

### Interpreting the Terms

Comparing Model 0 (complex) to Model 1 (simple):

1. **$\Delta\log\mathcal{L}_{\text{max}}$**: How much better is the complex model's best fit?
2. **$-\Delta\hat{d}/2$**: Penalty for additional constrained parameters (~0.5 per dimension)
3. **$-\Delta\mathcal{D}_{\text{KL}}$**: Penalty for requiring more information gain

**Rule of thumb:** Adding one well-constrained parameter costs $\approx 0.5$ in log-evidence. The complex model must improve the fit by $\Delta\log\mathcal{L}_{\text{max}} \gtrsim 0.5$ per parameter to be favored.

---

## Example: Curvature in Cosmology

**Model 1:** Flat $\Lambda$CDM (6 parameters, $\Omega_k = 0$ fixed)
**Model 2:** Curved $\Lambda$CDM (7 parameters, $\Omega_k$ free)

Suppose we run both models on CMB data:

**Results:**
- Model 1: $\log\mathcal{L}_{\text{max}} = 87573.4$
- Model 2: $\log\mathcal{L}_{\text{max}} = 87573.7$ (slightly better fit)
- $\Delta\hat{d} \approx 1$ (curvature is somewhat constrained)
- Measured: $\Omega_k = 0.03 \pm 0.12$ (consistent with zero)

**Evidence comparison:**

$$\Delta\log\mathcal{Z} \approx (87573.7 - 87573.4) - \frac{1}{2} - \Delta\mathcal{D}_{\text{KL}}$$

$$\approx 0.3 - 0.5 - 0.3 \approx -0.5$$

**Conclusion:** The flat model is (weakly) preferred. The improved fit from freeing curvature doesn't justify the additional parameter.

**This is Occam's razor in action**: Even though the data are *consistent* with small curvature, they don't *require* it, so the simpler model wins.

---

## Why Not Just Use $\chi^2$?

You might ask: "Why not just compare $\chi^2$ values?"

**Problems with $\chi^2$ comparison:**

1. **No complexity penalty**: More parameters always improve $\chi^2$
2. **Arbitrary thresholds**: How much improvement is "enough"?
3. **Ignores prior volume**: Doesn't account for parameter space coverage
4. **Not probabilistic**: Can't make statements like "Model A is 12× more likely"

**AIC and BIC** (Akaike/Bayesian Information Criteria) attempt to add complexity penalties, but these are approximations to the full Bayesian evidence in specific limits.

**The evidence is the principled answer**: It exactly balances fit quality against complexity through integration over the full prior volume.

---

## Computing the Evidence

The evidence is a high-dimensional integral:

$$\mathcal{Z} = \int_{\Omega_\theta} \mathcal{L}(\theta)\pi(\theta) d\theta$$

This is **fundamentally different** from parameter estimation:

- **MCMC** samples the posterior $\mathcal{P} \propto \mathcal{L}\pi$ (explores high-likelihood peak)
- **Evidence** requires sampling the **entire prior volume** (including low-likelihood regions)

**Methods for computing evidence:**

1. **[[nested-sampling]]**: Transforms the integral to 1D, directly computes $\mathcal{Z}$
2. **Thermodynamic integration**: Chains between prior and posterior
3. **Harmonic mean estimator**: Post-processes MCMC samples (can be unstable)
4. **Learned harmonic mean**: Uses machine learning for more stable estimation[^McEwen2021]

For rigorous model comparison, [[nested-sampling]] is the gold standard—it's specifically designed to compute evidence accurately.

---

## Evidence in Model Comparison

To compare models $\mathcal{M}_0$ and $\mathcal{M}_1$, we compute the **Bayes factor**:

$$B_{01} = \frac{\mathcal{Z}_0}{\mathcal{Z}_1} = \frac{p(d|\mathcal{M}_0)}{p(d|\mathcal{M}_1)}$$

If we assign equal prior probabilities to the models, then:

$$\frac{p(\mathcal{M}_0|d)}{p(\mathcal{M}_1|d)} = B_{01}$$

We typically work with $\Delta\log\mathcal{Z} = \log B_{01}$.

**Jeffreys' scale for interpretation:**

| $\|\Delta\log\mathcal{Z}\|$ | Odds | Strength |
|:--:|:--:|:--:|
| $< 1$ | $< 3:1$ | Inconclusive |
| $1$ | $\sim 3:1$ | Weak evidence |
| $2.5$ | $\sim 12:1$ | Moderate evidence |
| $5$ | $\sim 150:1$ | Strong evidence |

See [[model-comparison]] for detailed examples.

---

## The Evidence Is Model-Independent

A powerful feature: Evidence comparisons for different components of your model **factorize**.

Suppose you want to compare:
- Cosmologies: $\Lambda$CDM vs $w_0w_a$CDM
- Scatter models: Gaussian vs Student's t

You can compute four evidences:

$$\mathcal{Z}_{ij} = p(d|\text{Cosmology}_i, \text{Scatter}_j)$$

Then marginalize to compare cosmologies **independent of scatter choice**:

$$p(d|\text{Cosmology}_i) = \sum_j p(d|\text{Cosmology}_i, \text{Scatter}_j)p(\text{Scatter}_j)$$

This factorization is unique to the Bayesian framework: you can rigorously separate physical and statistical model assumptions.

---

## Key Insights

1. **Evidence = marginalized likelihood** over the prior
2. **Occam's razor is automatic** through the $\mathcal{D}_{\text{KL}}$ penalty
3. **Complexity costs ~0.5 per constrained parameter** (rule of thumb)
4. **Evidence requires special methods** (standard MCMC doesn't give it)
5. **Model comparison is rigorous** via Bayes factors
6. **Different model aspects can be separated** and marginalized independently

---

## The Hierarchy of Inference

We've now climbed the full hierarchy:

1. **Point estimates** (MLE): $\theta_{\text{best}}$
2. **Parameter constraints** (Posterior): $\theta \pm \sigma$
3. **Model comparison** (Evidence): $\mathcal{M}_0$ vs $\mathcal{M}_1$

Each level is more computationally expensive, but more scientifically valuable.

In cosmology, we often care more about detecting new physics (model comparison) than precisely measuring known parameters. The evidence is how we do this rigorously.

---

**Next:**
- [[model-comparison]] - Applying evidence to compare cosmological models
- [[nested-sampling]] - The algorithm for computing evidence
- [[computing-evidence]] - Practical methods comparison

**Related:**
- [[bayesian-inference]] - The general framework
- [[kl-divergence]] - Understanding the complexity penalty

---

**References:**

[^Trotta2008]: Trotta, R. (2008). Bayes in the sky: Bayesian inference and model selection in cosmology. *Contemporary Physics*, 49(2), 71-104.

[^Jeffreys1961]: Jeffreys, H. (1961). *Theory of Probability* (3rd ed.). Oxford University Press.

[^HandleyLemos2019]: Handley, W. J., & Lemos, P. (2019). Quantifying dimensionality: Bayesian cosmological model complexity. *Physical Review D*, 100(10), 103511.

[^McEwen2021]: McEwen, J. D., et al. (2021). Machine learning assisted Bayesian model comparison: learnt harmonic mean estimator. *MNRAS*, 508(3), 3771-3795.

[^Trotta2007]: Trotta, R. (2007). Applications of Bayesian model selection to cosmological parameters. *MNRAS*, 378(1), 72-82.
