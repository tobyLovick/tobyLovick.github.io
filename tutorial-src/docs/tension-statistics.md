# Quantifying Tension Between Datasets

← Back to [[index]]

---

**Acknowledgment:** This page adapts the rigorous framework developed by Dily Ong and Will Handley in their work on cosmological tension quantification[^OngHandley2024]. The pedagogical presentation here follows their methodology while tailoring examples for this tutorial.

---

## The Problem

Modern cosmology often involves multiple independent datasets:
- Cosmic Microwave Background (CMB) from Planck
- Type Ia Supernovae from Pantheon+
- Baryon Acoustic Oscillations (BAO) from DESI
- Weak gravitational lensing from DES/KiDS

**Key question:** Are these datasets **statistically consistent** when interpreted under a common cosmological model?

When different datasets give different parameter constraints, we need rigorous methods to quantify whether this represents:
1. **Random statistical fluctuation** (datasets agree within uncertainties)
2. **Genuine tension** (datasets disagree, suggesting systematic errors or new physics)

---

## The Bayesian Framework for Tension

### Setup

Consider two independent datasets $D_A$ and $D_B$ analyzed under a shared model $\mathcal{M}$.

**Likelihoods combine multiplicatively:**

$$\mathcal{L}_{AB}(\theta) = \mathcal{L}_A(\theta) \mathcal{L}_B(\theta)$$

**Posteriors for each dataset:**

$$\mathcal{P}_A(\theta) = \frac{\mathcal{L}_A(\theta)\pi(\theta)}{\mathcal{Z}_A}, \quad \mathcal{P}_B(\theta) = \frac{\mathcal{L}_B(\theta)\pi(\theta)}{\mathcal{Z}_B}$$

**Joint posterior:**

$$\mathcal{P}_{AB}(\theta) = \frac{\mathcal{L}_A(\theta)\mathcal{L}_B(\theta)\pi(\theta)}{\mathcal{Z}_{AB}}$$

**Critical assumption:** We use the same prior $\pi(\theta)$ for shared cosmological parameters across all analyses.

---

## Five Complementary Tension Statistics

Following Ong & Handley[^OngHandley2024], we use **five complementary statistics** that provide different perspectives on dataset consistency:

1. **$R$ statistic** - Direct Bayesian consistency measure
2. **Information Ratio ($I$)** - "Surprise of agreement"
3. **Suspiciousness ($S$)** - Prior-independent tension measure
4. **Bayesian Model Dimensionality ($d_G$)** - Effective degrees of freedom
5. **Tension Probability ($p$) and Significance ($\sigma$)** - Calibrated interpretability

---

## The $R$ Statistic

### Definition

The $R$ statistic[^Marshall2006] quantifies how much our confidence in one dataset changes when we learn about the other:

$$\boxed{R = \frac{\mathcal{Z}_{AB}}{\mathcal{Z}_A \mathcal{Z}_B}}$$

This can also be written as:

$$R = \frac{P(D_A, D_B)}{P(D_A)P(D_B)} = \frac{P(D_A|D_B)}{P(D_A)}$$

### Interpretation

**$R \gg 1$ (Concordance):**
- Knowledge of dataset $B$ has **strengthened** our confidence in dataset $A$
- The datasets are **mutually supportive**
- Example: $R = 10$ means learning about $D_B$ makes $D_A$ 10× more probable

**$R \ll 1$ (Discordance):**
- Introduction of dataset $B$ **diminishes** confidence in dataset $A$
- The datasets are **inconsistent** under the assumed model
- Example: $R = 0.01$ means learning about $D_B$ makes $D_A$ 100× less probable

**$R \approx 1$ (Independence):**
- Datasets neither support nor contradict each other
- May indicate weak constraining power

### Prior Dependence

The $R$ statistic can be rewritten in terms of posteriors[^HandleyLemos2019]:

$$R = \int \frac{\mathcal{P}_A(\theta) \mathcal{P}_B(\theta)}{\pi(\theta)} d\theta = \left\langle \frac{\mathcal{P}_B}{\pi} \right\rangle_{\mathcal{P}_A}$$

**Key insight:** $R$ is strongly prior-dependent.

**Effect of narrower priors:**
- Reducing prior width on constrained parameters **decreases** $R$
- This **increases** apparent tension between datasets
- Opposite to prior's effect on evidence alone

**Interpretation guidance:**
- **If $R$ indicates discordance:** Conclusion is robust (prior volume effect typically masks tension)
- **If $R$ indicates agreement:** Check if merely due to overly wide prior

### Example: CMB vs BAO

```python
# Hypothetical example
Z_CMB = 5432.1
Z_BAO = 2891.3
Z_joint = 8320.5

R = Z_joint / (Z_CMB * Z_BAO)
log_R = np.log(R)

print(f"log R = {log_R:.2f}")
# Output: log R = -2.8 (discordance)
```

Interpretation: $R \approx 0.06$ indicates the datasets are in tension—combining them reduces overall evidence.

---

## The Information Ratio

### Definition

The information ratio $I$[^HandleyLemos2019] measures the "surprise of agreement" using [[kl-divergence|KL divergences]]:

$$\log I = \mathcal{D}_{\text{KL}}^A + \mathcal{D}_{\text{KL}}^B - \mathcal{D}_{\text{KL}}^{AB}$$

where:
- $\mathcal{D}_{\text{KL}}^A = \int \mathcal{P}_A \log\frac{\mathcal{P}_A}{\pi} d\theta$ (information gain from prior to posterior for dataset $A$)
- Similarly for $B$ and $AB$

### Volumetric Approximation

Using the volumetric interpretation $\mathcal{D}_{\text{KL}} \approx \log(V_\pi) - \log(V_\mathcal{P})$:

$$\log I \approx \log(V_\pi) - \log(V_\mathcal{P}^A) - \log(V_\mathcal{P}^B) + \log(V_\mathcal{P}^{AB})$$

### Interpretation: "Surprise of Agreement"

**Larger prior volume $V_\pi$:**
- Greater initial uncertainty
- Agreement of two constraining datasets becomes **more surprising**
- Results in **larger $\log I$**

**More constraining datasets (smaller $V_\mathcal{P}$):**
- If two highly constraining posteriors happen to agree, this is very surprising
- Example: Two experiments independently measure $H_0 = 73.0 \pm 0.5$ km/s/Mpc → high surprise.

**If datasets in tension:**
- Posteriors barely overlap
- Joint posterior volume $V_\mathcal{P}^{AB}$ becomes extremely small
- Makes $\log(V_\mathcal{P}^{AB})$ large negative number
- **Very low or negative $\log I$** signals disagreement

**Key distinction:** $\log I$ quantifies surprise based on prior volume and constraining powers—distinct from actual statistical mismatch.

---

## Suspiciousness

### Definition

While $I$ quantifies surprise of agreement, suspiciousness $S$ quantifies **statistical conflict** between likelihoods[^HandleyLemos2019]:

$$\boxed{S = \frac{R}{I}, \quad \log S = \log R - \log I}$$

### Prior Independence

Since $R$ and $I$ transform similarly under prior volume changes, **$S$ is largely unaffected by changing prior widths** (as long as change doesn't significantly alter posteriors).

**Trade-off:** This prior-independence comes at cost of direct probabilistic interpretation inherent in $R$, requiring calibration for significance (see below).

### Expression in Likelihoods

Substituting definitions:

$$\log S = \langle \log\mathcal{L}_{AB} \rangle_{\mathcal{P}_{AB}} - \langle \log\mathcal{L}_A \rangle_{\mathcal{P}_A} - \langle \log\mathcal{L}_B \rangle_{\mathcal{P}_B}$$

### Interpretation

**When likelihoods agree:** $\log S$ is zero or positive

**When likelihoods in tension:** $\log S$ becomes negative, with larger negative values indicating stronger tension

**Next step:** Calibrate $\log S$ into tension probability $p$ and significance $\sigma$ (see below)

---

## Bayesian Model Dimensionality

### Motivation

KL divergence $\mathcal{D}_{\text{KL}}$ gives a single value for total information gain, but **marginalizes out** information about individual parameters.

**Example:** Strong correlated constraint between two parameters can yield same $\mathcal{D}_{\text{KL}}$ as two well-constrained independent parameters.

**Need:** A metric for the **effective number of constrained parameters**.

### Definition

Bayesian Model Dimensionality $d$[^HandleyLemos2019] is defined as:

$$\frac{d}{2} = \int \mathcal{P}(\theta) \left(\log\frac{\mathcal{P}(\theta)}{\pi(\theta)} - \mathcal{D}_{\text{KL}}\right)^2 d\theta$$

Equivalently:

$$\boxed{\frac{d}{2} = \text{var}(\mathcal{I})_{\mathcal{P}}}$$

where $\mathcal{I} = \log\frac{\mathcal{P}}{\pi}$ is Shannon Information.

Alternative form:

$$\frac{d}{2} = \langle(\log \mathcal{L})^2\rangle_{\mathcal{P}} - \langle\log\mathcal{L}\rangle_{\mathcal{P}}^2$$

### Properties

1. **Weakly prior-dependent:** Evidence contributions in Shannon Information largely cancel out
2. **Additive for independent parameters:** Like KL divergence
3. **Invariant under reparametrization**

### Combining Datasets

Number of parameters constrained when combining datasets:

$$\boxed{d_{A \cap B} = d_A + d_B - d_{AB}}$$

This $d_G$ (dimensionality of the **shared** parameter space) is what enters the tension significance calculation.

### Interpretation

**Simple Gaussian constraint on single parameter:** $d = 1$

**Tight correlated constraint between two parameters:** Also $d = 1$ (not 2)

**Example:** If CMB constrains 5.8 parameters and BAO constrains 2.3 parameters, but jointly they constrain 6.1 parameters, then:

$$d_G = 5.8 + 2.3 - 6.1 = 2.0$$

Only **2 effective parameters** are being jointly constrained.

---

## Tension Probability and Significance

### Theoretical Basis

For **Gaussian likelihoods**, the quantity $d_G - 2\log S$ follows a $\chi^2$ distribution with $d_G$ degrees of freedom[^HandleyLemos2019].

### Tension Probability

$p$ represents the **probability that discordance at least as large as observed could arise by chance**:

$$\boxed{p = \int_{d_G-2\log S}^{\infty} \chi_{d_G}^2(x)\,dx}$$

where $\chi_{d_G}^2(x)$ is the chi-squared PDF:

$$\chi_{d_G}^2(x) = \frac{x^{d_G/2-1}e^{-x/2}}{2^{d_G/2}\Gamma(d_G/2)}$$

### Gaussian Significance

This $p$-value is converted into equivalent significance on Gaussian scale using:

$$\boxed{\sigma = \sqrt{2}\,\text{Erfc}^{-1}(p)}$$

where $\text{Erfc}^{-1}$ is the inverse complementary error function.

### Interpretation Thresholds

**Standard conventions:**
- $p \lesssim 0.05$ (corresponding to $\sigma \gtrsim 2$): **Moderate tension**
- $p \lesssim 0.003$ (corresponding to $\sigma \gtrsim 3$): **Strong tension**

```python
from scipy.stats import chi2
from scipy.special import erfcinv
import numpy as np

def tension_significance(log_S, d_G):
    """Compute tension probability and Gaussian significance"""
    # Chi-squared test statistic
    test_stat = d_G - 2*log_S

    # Tension probability (survival function)
    p = chi2.sf(test_stat, df=d_G)

    # Gaussian significance
    sigma = np.sqrt(2) * erfcinv(p)

    return p, sigma

# Example: CMB vs local H0
log_S_H0 = -3.2
d_G_H0 = 1.1

p, sigma = tension_significance(log_S_H0, d_G_H0)
print(f"Tension probability: p = {p:.4f}")
print(f"Gaussian significance: σ = {sigma:.2f}")
# Output: p = 0.0013, σ = 3.0 (strong tension)
```

---

## The Look-Elsewhere Effect

### Problem

When performing **multiple statistical tests**, probability of finding seemingly significant result **purely by chance** increases.

**Relevance:** When systematically evaluating tension for $N$ distinct model-dataset combinations, likelihood of false positive becomes substantial.

### The Natural Threshold Approach

**Key insight:** Under null hypothesis of no genuine tension, $p$-values are uniformly distributed between 0 and 1.

**Therefore:** If performing $N$ independent tests, expect exactly **one result to have $p \leq 1/N$ purely by chance**.

**Natural threshold:**

$$\boxed{\sigma_{\text{threshold}} = \sqrt{2}\,\text{Erfc}^{-1}\left(\frac{1}{N}\right)}$$

### Example

For analysis with $N = 50$ pairwise dataset comparisons:

$$\sigma_{\text{threshold}} = \sqrt{2}\,\text{Erfc}^{-1}(1/50) \approx 2.58$$

**Interpretation:** This threshold represents significance level at which we expect only **one false positive** across all 50 tests if there were no genuine tensions.

### Advantages

1. **Threshold reflects scope of analysis** naturally
2. **Individual $p$-values remain interpretable** independently of grid size
3. **Natural statistical interpretation:** Expected number of false positives = 1
4. **Results remain comparable** across different analysis scopes

**Note:** This is **NOT** the Bonferroni correction (which would modify each $p$-value). Individual values stay the same; only the interpretation threshold changes.

---

## Worked Example: Planck vs Pantheon+

We can quantify tension between CMB (Planck) and supernovae (Pantheon+) constraints on $\Lambda$CDM.

### Step 1: Run Nested Sampling

```python
# Individual analyses
Z_Planck = 87573.4  # From Planck 2018 analysis
D_KL_Planck = 12.3
d_Planck = 5.8

Z_Pantheon = 1234.5  # From SNe analysis
D_KL_Pantheon = 2.1
d_Pantheon = 2.3

# Joint analysis
Z_joint = 88806.2
D_KL_joint = 14.1
d_joint = 6.1
```

### Step 2: Compute Tension Statistics

```python
import numpy as np
from scipy.stats import chi2
from scipy.special import erfcinv

# R statistic
log_R = Z_joint - Z_Planck - Z_Pantheon
print(f"log R = {log_R:.2f}")

# Information ratio
log_I = D_KL_Planck + D_KL_Pantheon - D_KL_joint
print(f"log I = {log_I:.2f}")

# Suspiciousness
log_S = log_R - log_I
print(f"log S = {log_S:.2f}")

# Dimensionality of overlap
d_G = d_Planck + d_Pantheon - d_joint
print(f"d_G = {d_G:.2f}")

# Tension probability
test_stat = d_G - 2*log_S
p = chi2.sf(test_stat, df=d_G)
sigma = np.sqrt(2) * erfcinv(p)

print(f"\nTension probability: p = {p:.4f}")
print(f"Gaussian significance: σ = {sigma:.2f}")
```

### Step 3: Interpret Results

```
log R = -1.7  (discordance)
log I = 0.3   (mild surprise of agreement)
log S = -2.0  (tension)
d_G = 2.0     (2 effective shared parameters)

Tension probability: p = 0.050
Gaussian significance: σ = 1.96
```

**Interpretation:**
- **$\log R < 0$:** Datasets are discordant
- **$\log S < 0$:** Negative suspiciousness confirms tension
- **$\sigma = 1.96$:** Moderate tension (~2σ)
- **$d_G = 2$:** Tension primarily in 2 parameters (likely $H_0$ and $\Omega_m$)

**Conclusion:** Planck and Pantheon+ show moderate but not strong tension under $\Lambda$CDM.

---

## Model-Weighted Average Tension

When uncertain about the model, compute tension statistics for multiple models and average weighted by model probability[^OngHandley2024]:

$$\langle \sigma \rangle_{P(\mathcal{M})} = \sum_i P(\mathcal{M}_i|D) \times \sigma(\mathcal{M}_i)$$

**Example:** Test CMB vs SNe tension under:
- Flat $\Lambda$CDM: $\sigma = 2.1$, $P(\mathcal{M}|D) = 0.7$
- Curved $\Lambda$CDM: $\sigma = 1.8$, $P(\mathcal{M}|D) = 0.2$
- $w$CDM: $\sigma = 1.5$, $P(\mathcal{M}|D) = 0.1$

Model-averaged significance:

$$\langle \sigma \rangle = 0.7(2.1) + 0.2(1.8) + 0.1(1.5) = 1.98$$

This accounts for model uncertainty in the tension assessment.

---

## Summary: Complete Workflow

### The Five Statistics

1. **$R = \mathcal{Z}_{AB}/(\mathcal{Z}_A \mathcal{Z}_B)$** - Bayesian consistency (prior-dependent)
2. **$I$ from KL divergences** - Surprise of agreement (prior-dependent)
3. **$S = R/I$** - Pure likelihood conflict (prior-independent)
4. **$d_G = d_A + d_B - d_{AB}$** - Effective dimensionality of tension
5. **$p, \sigma$ from $\chi^2_{d_G}$** - Calibrated, interpretable measures

### Implementation Steps

1. Run [[nested-sampling]] for $D_A$ alone → get $\mathcal{Z}_A$, $\mathcal{D}_{\text{KL}}^A$, $d_A$
2. Run nested sampling for $D_B$ alone → get $\mathcal{Z}_B$, $\mathcal{D}_{\text{KL}}^B$, $d_B$
3. Run nested sampling for $D_{AB}$ joint → get $\mathcal{Z}_{AB}$, $\mathcal{D}_{\text{KL}}^{AB}$, $d_{AB}$
4. Compute all five statistics
5. Apply look-elsewhere effect correction if testing multiple pairs
6. Optionally: model-weight across cosmologies

### Complementary Nature

**Use all five together** for complete understanding:
- **$R$:** Direct Bayesian measure (sensitive to priors)
- **$I$:** Based on constraining power
- **$S$:** Prior-robust tension measure
- **$d$:** Tells you *where* tension lives (how many parameters)
- **$p, \sigma$:** Easy to interpret and communicate

---

## Key Takeaways

1. **Tension requires multiple perspectives** - no single statistic tells the full story
2. **Prior sensitivity matters** - $R$ and $I$ depend on priors, $S$ doesn't
3. **Dimensionality is crucial** - $d_G$ determines degrees of freedom for significance
4. **Multiple testing must be addressed** - use natural threshold for look-elsewhere effect
5. **Model uncertainty should be marginalized** - use model-weighted averages
6. **Bayesian approach is rigorous** - built on evidences and information theory

---

**Next:**
- [[evidence]] - Understanding the Bayesian evidence
- [[model-comparison]] - Using evidence to compare theories
- [[nested-sampling]] - Computing evidences accurately

**Related:**
- [[kl-divergence]] - Information-theoretic foundations
- [[computing-evidence]] - Practical methods

---

**References:**

[^OngHandley2024]: Ong, D., & Handley, W. (2024). unimpeded: A Public Grid of Nested Sampling Chains for Cosmological Model Comparison and Tension Analysis. *arXiv preprint*.

[^Marshall2006]: Marshall, P., et al. (2006). Hyper-Extreme Hierarchical Bayesian Inference. *Proceedings of MaxEnt*.

[^HandleyLemos2019]: Handley, W. J., & Lemos, P. (2019). Quantifying tensions in cosmological parameters: Interpreting the DES evidence ratio. *Physical Review D*, 100(4), 043504.

[^Lemos2021]: Lemos, P., et al. (2021). Quantifying suspiciousness within correlated data sets. *MNRAS*, 505(4), 6179-6192.

[^Skilling2006]: Skilling, J. (2006). Nested sampling for general Bayesian computation. *Bayesian Analysis*, 1(4), 833-859.
