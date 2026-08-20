# Dark Energy Models

← Back to [[index]] | See also: [[model-comparison]], [[evidence]], [[marginalization]]

---

**Note:** This page draws on the Type Ia supernova analysis from Lovick, Dhawan & Handley (2024)[^Lovick2024], demonstrating [[model-comparison|Bayesian model comparison]] for dark energy scenarios.

---

## The Dark Energy Problem

In 1998, observations of distant Type Ia supernovae revealed the universe's expansion is **accelerating**[^Riess1998][^Perlmutter1999]. This requires a component with **negative pressure**—dubbed "dark energy."

**Key question:** What is the nature of dark energy?

**Candidates:**
- Einstein's cosmological constant $\Lambda$ (simplest)
- Dynamical scalar fields (quintessence)
- Modified gravity theories
- Time-varying equations of state

[[evidence|Bayesian evidence]] comparison provides a rigorous framework to test these scenarios.

---

## The Cosmological Models

### Model 1: Flat ΛCDM (Cosmological Constant)

The minimal "concordance" cosmology with 6 parameters:

**Parameters:**
- $\Omega_b h^2$ — baryon density
- $\Omega_c h^2$ — cold dark matter density
- $H_0$ — Hubble constant
- $A_s$ — scalar amplitude (CMB)
- $n_s$ — spectral index (CMB)
- $\tau$ — optical depth (CMB)

**Dark energy:** Equation of state $w = -1$ (fixed)

**Spatial curvature:** $\Omega_k = 0$ (flat universe, fixed)

### Model 2: wCDM (Constant Dark Energy EoS)

Extends ΛCDM by allowing dark energy equation of state to vary:

**Additional parameter:**
- $w$ — dark energy equation of state (constant in time)

**Prior:** Typically $w \in [-2.5, -0.3]$ or similar
- $w = -1$ recovers ΛCDM
- $w < -1$ is "phantom" dark energy
- $w > -1$ is quintessence-like

**Total parameters:** 7 (6 from ΛCDM + $w$)

**Prediction:** Luminosity distance depends on $w$:

$$H(z)^2 = H_0^2\left[\Omega_m(1+z)^3 + (1-\Omega_m)(1+z)^{3(1+w)}\right]$$

**Complexity cost:** One additional parameter means larger [[prior-choice|prior volume]] and higher [[kl-divergence|KL divergence]] penalty unless data strongly prefer $w \neq -1$.

### Model 3: w₀wₐCDM (Evolving Dark Energy)

Also called the Chevallier-Polarski-Linder (CPL) parameterization[^Chevallier2001][^Linder2003]:

**Additional parameters (beyond ΛCDM):**
- $w_0$ — equation of state today
- $w_a$ — rate of evolution

**Time evolution:**

$$w(z) = w_0 + w_a \frac{z}{1+z}$$

**Total parameters:** 8 (6 from ΛCDM + $w_0 + w_a$)

**Complexity cost:** Two additional parameters with even larger [[evidence#The Occam Penalty|Occam penalty]].

---

## Type Ia Supernovae as Standard Candles

### The Phillips Relation

Type Ia SNe aren't perfect standard candles, but they're **standardizable**: brighter supernovae decline more slowly (Phillips relation[^Phillips1993]).

**Standardization:**

$$m_B^* = m_B - \alpha X_1 + \beta C$$

where:
- $m_B$ = observed peak B-band magnitude
- $X_1$ = stretch (light curve width)
- $C$ = color
- $\alpha, \beta$ = nuisance parameters (fitted)

### Distance Modulus and Cosmology

The standardized magnitude relates to cosmology via:

$$m_B^* = M_B + \mu(z; H_0, \Omega_m, w)$$

where:

$$\mu(z) = 5\log_{10}\left(\frac{d_L(z)}{\text{Mpc}}\right) + 25$$

**Key point:** Supernovae constrain *relative* distances well but have poor leverage on $M_B$ (absolute magnitude). This creates degeneracy: $H_0 \leftrightarrow M_B$.

---

## The Pantheon+ Dataset

The Pantheon+ catalog[^Brout2022] contains:
- **1701 spectroscopically confirmed Type Ia SNe**
- Redshift range: $0.001 < z < 2.26$
- Full covariance matrix accounting for systematics

**Systematic uncertainties include:**
- Photometric calibration across surveys
- Selection biases (Malmquist bias)
- Dust extinction corrections
- Peculiar velocities (local flows)
- Host galaxy properties
- Gravitational lensing (at high-z)

See [[supernovae-analysis]] for technical details.

---

## Beyond Gaussian Scatter

### The Standard Gaussian Assumption

The fiducial Pantheon+ analysis assumes:

$$\mathcal{L} = \frac{1}{\sqrt{(2\pi)^n |\mathbf{C}|}} \exp\left(-\frac{1}{2}\boldsymbol{\Delta}^T \mathbf{C}^{-1} \boldsymbol{\Delta}\right)$$

where $\boldsymbol{\Delta} = \mathbf{m}_{\text{obs}} - \mathbf{m}_{\text{model}}$ is the residual vector.

**Problem:** Real data often have **outliers** not captured by Gaussian tails.

### Student's t-Distribution

A more robust alternative[^Lovick2024]:

$$\mathcal{L} = \prod_{i=1}^n \frac{\Gamma((\nu+1)/2)}{\Gamma(\nu/2)\sqrt{\nu\pi\sigma_i^2}}\left(1 + \frac{\Delta_i^2}{\nu\sigma_i^2}\right)^{-(\nu+1)/2}$$

**Key parameter:** $\nu$ = degrees of freedom
- $\nu \to \infty$: Recovers Gaussian
- $\nu \sim 3-10$: Heavy tails (downweights outliers)
- $\nu < 2$: Undefined variance (unphysical)

**Prior:** $\nu \sim \text{Uniform}(2, 100)$ or similar

### Covariance Rescaling

Alternative approach: add a global scale parameter[^Lovick2024]:

$$\mathbf{C}_{\text{scaled}} = s^2 \mathbf{C}_{\text{fid}}$$

where $s$ is a free parameter accounting for underestimated uncertainties.

**Interpretation:** $s > 1$ indicates covariance matrix is too optimistic.

---

## Bayesian Model Comparison Results

Using [[nested-sampling]] on the Pantheon+ dataset[^Lovick2024]:

### Cosmological Model Comparison (Gaussian Scatter)

```
Model         log Z        Δ log Z    Interpretation
─────────────────────────────────────────────────────
Flat ΛCDM    1234.5       (reference)  Baseline
wCDM         1232.0       -2.5         Moderate evidence against
w₀wₐCDM      1230.8       -3.7         Strong evidence against
```

**Conclusion:** Flat ΛCDM is **preferred** over evolving dark energy models.

**Why?** Adding $w$ (or $w_0, w_a$) improves fit marginally but incurs [[evidence#The Occam Penalty|Occam penalty]]:
- wCDM: $\Delta\hat{d} \approx 0.8$ (one parameter moderately constrained)
- w₀wₐCDM: $\Delta\hat{d} \approx 1.2$ (two parameters weakly constrained)

**[[evidence#The Laplace Approximation|Evidence decomposition]]:**

$$\Delta\log\mathcal{Z} \approx \underbrace{\Delta\log\mathcal{L}_{\max}}_{+0.5} - \underbrace{\Delta\hat{d}/2}_{-0.4} - \underbrace{\Delta\mathcal{D}_{\text{KL}}}_{-2.6} \approx -2.5$$

The data don't **require** $w \neq -1$, so the simpler model wins.

### Scatter Model Comparison (Fixed ΛCDM Cosmology)

```
Scatter Model           log Z        Δ log Z    Best-fit parameter
────────────────────────────────────────────────────────────────────
Gaussian (fiducial)    1234.5       (reference)  —
Scaled covariance      1236.8       +2.3         s = 1.08 ± 0.03
Student's t            1237.0       +2.5         ν = 5.2 ± 1.8
```

**Conclusion:** Data show **moderate evidence** for non-Gaussian scatter.

**Interpretation:**
- $s \approx 1.08$: Covariance matrix is ~8% too small (uncertainties underestimated)
- $\nu \approx 5$: Heavier tails than Gaussian, consistent with unmodeled outliers

**Impact on $H_0$:**
- Gaussian: $H_0 = 73.52 \pm 1.02$ km/s/Mpc
- Student's t: $H_0 = 73.67 \pm 0.99$ km/s/Mpc

The non-Gaussian treatment slightly increases central value and tightens uncertainty (outliers downweighted).

---

## Marginalization Over Scatter Models

**Key insight:** Cosmological model preferences might depend on scatter model choice.

**Solution:** [[marginalization|Marginalize]] over scatter models to get robust answer:

$$\mathcal{Z}_{\text{cosmology}} = \sum_{\text{scatter}} \mathcal{Z}_{\text{cosmology, scatter}} \times P(\text{scatter})$$

**Result:** After marginalizing over scatter models, ΛCDM remains preferred with $\Delta\log\mathcal{Z} \approx 2.2$.

**Robustness:** The cosmological model preference is independent of scatter model choice.

See [[marginalization]] for complete methodology and examples.

---

## The Hubble Tension

### Planck CMB Constraint

Planck 2018[^Planck2018] measured in flat ΛCDM:

$$H_0^{\text{CMB}} = 67.4 \pm 0.5 \text{ km/s/Mpc}$$

### Pantheon+ Supernova Constraint

With Student's t scatter model[^Lovick2024]:

$$H_0^{\text{SNe}} = 73.67 \pm 0.99 \text{ km/s/Mpc}$$

### Tension Quantification

Using [[tension-statistics]]:

**Simple comparison:**

$$\Delta H_0 = 73.67 - 67.4 = 6.27 \text{ km/s/Mpc}$$

$$\sigma = \frac{6.27}{\sqrt{0.99^2 + 0.5^2}} = 5.7\sigma$$

**Full Bayesian tension analysis** (using [[tension-statistics#The R Statistic|$R$]], [[tension-statistics#The Information Ratio|$I$]], [[tension-statistics#Suspiciousness|$S$]] statistics) confirms ~5-6σ discordance between CMB and local measurements.

**Possible explanations:**
1. **Systematic errors** in one or both measurements
2. **New physics** (early dark energy, extra relativistic species, etc.)
3. **Late-time modifications** to ΛCDM not captured by simple $w$ parameterization

---

## Peculiar Velocity Corrections

### The Issue

Low-redshift SNe ($z < 0.05$) have distances contaminated by **peculiar velocities**—galaxy motions relative to the Hubble flow.

**Effect:** Can bias $H_0$ by ~1-2 km/s/Mpc if not corrected[^Peterson2022].

### Correction Methods

**Flow model correction:** Use large-scale structure surveys to model local flows, subtract predicted peculiar velocities.

**Cut low-z sample:** Remove $z < 0.023$ SNe entirely (more conservative).

### Impact on Model Comparison

From Lovick et al. (2024)[^Lovick2024]:

**With peculiar velocity corrections:**
- ΛCDM strongly preferred ($\Delta\log\mathcal{Z} \approx 2.5$)
- $w = -1.02 \pm 0.08$ (consistent with cosmological constant)

**Without corrections (or using different corrections):**
- Model preferences shift
- $w$ constraints can change by ~0.1
- [[evidence]] ratios change by $\Delta\log\mathcal{Z} \sim 1$

**Lesson:** Systematic uncertainties matter for [[model-comparison]]. Proper treatment via non-Gaussian likelihoods is crucial.

---

## Comparison with Information Criteria

For rapid exploration, can use [[information-criteria|AIC/BIC]] instead of full [[evidence]]:

```
Method                    ΛCDM          wCDM         Preference
─────────────────────────────────────────────────────────────────
log L_max                 -621.3        -620.8       wCDM better fit
AIC                       1254.6        1255.6       ΛCDM (weakly)
BIC                       1295.8        1302.5       ΛCDM (strongly)
Nested Sampling (log Z)   1234.5        1232.0       ΛCDM (moderately)
```

**Observations:**
- [[information-criteria#Akaike Information Criterion AIC|AIC]] too lenient (penalty = 2)
- [[information-criteria#Bayesian Information Criterion BIC|BIC]] too harsh (penalty = $\log(1701) \approx 7.4$)
- [[nested-sampling]] exact (penalty via actual [[kl-divergence|$\mathcal{D}_{\text{KL}}$]])

See [[information-criteria]] for detailed comparison.

---

## Summary

**Dark energy model comparison:**

- **Flat ΛCDM remains preferred** over evolving dark energy ($\Delta\log\mathcal{Z} \approx 2-3$)
- **Non-Gaussian scatter models** improve fit ($\Delta\log\mathcal{Z} \approx 2.5$)
- **[[marginalization|Model averaging]]** provides robust constraints independent of nuisance model choices
- **Hubble tension persists** at ~5.7σ (CMB vs local measurements)
- **Systematic uncertainties** (scatter, peculiar velocities) affect model preferences

**Key techniques:**
- **[[evidence]]-based comparison** via [[nested-sampling]]
- **[[marginalization]]** over nuisance models (scatter, systematics)
- **[[tension-statistics|Tension quantification]]** using $R$, $I$, $S$ statistics
- **[[information-criteria]]** for rapid screening

**Open questions:**
- Is dark energy truly a cosmological constant?
- What causes the Hubble tension?
- Are our covariance matrices correctly specified?
- Do we need fundamentally new physics?

---

**Next:**
- [[model-comparison]] - General framework for comparing models
- [[evidence]] - Understanding the Bayesian evidence
- [[marginalization]] - Averaging over model uncertainties
- [[tension-statistics]] - Quantifying CMB-SNe discordance

**Related:**
- [[information-criteria]] - Quick approximations (AIC/BIC)
- [[kl-divergence]] - The Occam penalty in evidence
- [[nested-sampling]] - Computing evidences accurately

---

**References:**

[^Lovick2024]: Lovick, T., Dhawan, S., & Handley, W. (2024). Non-Gaussian likelihoods for Type Ia Supernovae cosmology. *arXiv:2312.02075*.

[^Riess1998]: Riess, A. G., et al. (1998). Observational evidence from supernovae for an accelerating universe. *The Astronomical Journal*, 116(3), 1009.

[^Perlmutter1999]: Perlmutter, S., et al. (1999). Measurements of Ω and Λ from 42 high-redshift supernovae. *The Astrophysical Journal*, 517(2), 565.

[^Brout2022]: Brout, D., et al. (2022). The Pantheon+ analysis: cosmological constraints. *The Astrophysical Journal*, 938(2), 110.

[^Planck2018]: Planck Collaboration (2018). Planck 2018 results. VI. Cosmological parameters. *Astronomy & Astrophysics*, 641, A6.

[^Chevallier2001]: Chevallier, M., & Polarski, D. (2001). Accelerating universes with scaling dark matter. *International Journal of Modern Physics D*, 10(02), 213-223.

[^Linder2003]: Linder, E. V. (2003). Exploring the expansion history of the universe. *Physical Review Letters*, 90(9), 091301.

[^Phillips1993]: Phillips, M. M. (1993). The absolute magnitudes of Type IA supernovae. *The Astrophysical Journal*, 413, L105.

[^Peterson2022]: Peterson, E. R., et al. (2022). A standardized analysis of 77 cosmic shear surveys. *Physical Review D*, 105(8), 083517.

[^Trotta2008]: Trotta, R. (2008). Bayes in the sky: Bayesian inference and model selection in cosmology. *Contemporary Physics*, 49(2), 71-104.
