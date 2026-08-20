# Prior Choice

← Back to [[index]] | See also: [[analytical-update]], [[bayesian-inference]]

---

## The Prior Dilemma

In [[bayesian-inference]], we must specify a **prior distribution** $\pi(\theta)$ before seeing data. But how do we choose it?

This is both Bayesian inference's greatest strength (incorporating prior knowledge) and its most controversial aspect ("aren't you just making stuff up?").

---

## Principles for Prior Choice

### 1. Physical Constraints

**Use what you know about the parameter's range.**

**Examples:**
- Probabilities: $\theta \in [0, 1]$
- Matter density: $\Omega_m \in [0, 1]$ (can't exceed closure density)
- Hubble constant: $H_0 \in [50, 100]$ km/s/Mpc (excludes unphysical values)

**Implementation:** Uniform prior on physically allowed range.

### 2. Scale Invariance

**For scale parameters (quantities that span orders of magnitude), use log-uniform priors.**

**Example:** If $\sigma$ could be anywhere from 0.01 to 100, we don't know the scale. Use:

$$\pi(\sigma) \propto \frac{1}{\sigma}$$

This makes all decades equally likely: $[0.1, 1]$, $[1, 10]$, $[10, 100]$ get equal prior weight.

**Why?** Being "uncertain about the scale" means being uncertain about $\log\sigma$, not $\sigma$ itself.

### 3. Previous Measurements

**Use posteriors from earlier experiments as priors for new ones.**

**Example:** Planck 2018 measured $H_0 = 67.4 \pm 0.5$ km/s/Mpc. For a new analysis combining SNe + BAO:

$$\pi(H_0) = \mathcal{N}(67.4, 0.5^2)$$

This is Bayesian **learning**: each experiment refines our beliefs.

### 4. Theoretical Expectations

**Encode predictions from theory.**

**Example:** Inflation predicts $n_s \approx 0.96$ (nearly scale-invariant). We could use:

$$\pi(n_s) = \mathcal{N}(0.96, 0.02^2)$$

But be careful: this can bias against discovering new physics!

### 5. Maximum Entropy (Uninformative)

**When you truly have no information, maximize entropy subject to constraints.**[^Jaynes1957]

**Example:** For $\theta \in [0,1]$ with no other information:

$$\pi(\theta) = \mathcal{U}(0,1)$$

This is the "most uncertain" distribution on $[0,1]$.

---

## The Beta Prior: A Deep Dive

The [[analytical-update#The Beta-Binomial Model|Beta distribution]] is perfect for probabilities:

$$\text{Beta}(\theta|\alpha, \beta) = \frac{\theta^{\alpha-1}(1-\theta)^{\beta-1}}{B(\alpha,\beta)}$$

But **how do we choose $\alpha$ and $\beta$?**

### Interpretation 1: Pseudocounts

**Think of $\alpha$ and $\beta$ as "prior data":**

- $\alpha - 1$ = "successes" you've seen before
- $\beta - 1$ = "failures" you've seen before
- Total "prior sample size" = $\alpha + \beta - 2$

**Example from [[analytical-update]]:**

**$\text{Beta}(2, 2)$** = "I've seen 1 Towpath win and 1 Meadow win"
- Weak prior, equivalent to 2 races of prior data
- Easily updated by real data (84 races)

**$\text{Beta}(10, 10)$** = "I've seen 9 wins each side"
- Stronger prior, equivalent to 18 races of prior data
- Requires more data to shift beliefs

### Interpretation 2: Quality Control Analogy

**Beautiful interpretation for the rowing example:**

Imagine the race organizers tested whether their finish line skew properly compensates for the bend:
- Each test race checks if the course is balanced
- $\alpha$ = test races where Towpath won
- $\beta$ = test races where Meadow won

**$\text{Beta}(1, 1)$:** "Never checked the course" (uniform)

**$\text{Beta}(2, 2)$:** "Checked once, seemed fair" (weak fairness belief)

**$\text{Beta}(10, 10)$:** "Checked 18 times, always fair" (strong fairness belief)

**This makes the prior concrete:** How many checks would justify your prior belief?

### Interpretation 3: Effective Sample Size

The **prior strength** is measured by:

$$n_0 = \alpha + \beta$$

After observing $n$ data points with $k$ successes, the posterior mean is:

$$\mathbb{E}[\theta|\text{data}] = \frac{\alpha + k}{\alpha + \beta + n} = \frac{n_0 \bar{\theta}_0 + n\bar{\theta}}{n_0 + n}$$

where $\bar{\theta}_0 = \alpha/(\alpha+\beta)$ (prior mean) and $\bar{\theta} = k/n$ (data proportion).

**Interpretation:** Posterior mean is a **weighted average** of prior belief and data, weighted by sample sizes!

**Example:** $\text{Beta}(10, 10)$ prior with 54/84 Towpath wins:

$$\mathbb{E}[\theta] = \frac{20 \cdot 0.5 + 84 \cdot 0.643}{20 + 84} = \frac{10 + 54}{104} \approx 0.615$$

The strong prior ($n_0 = 20$) pulls the estimate toward 0.5, but data ($n=84$) dominate.

---

## Special Cases of the Beta Distribution

### $\text{Beta}(1, 1)$ - Uniform

$$\pi(\theta) = 1$$

All values equally likely. **Jeffreys prior** for Binomial likelihood[^Jeffreys1961].

**When to use:** True ignorance about $\theta$.

### $\text{Beta}(0.5, 0.5)$ - Jeffreys Prior

$$\pi(\theta) \propto \theta^{-1/2}(1-\theta)^{-1/2}$$

U-shaped: concentrates near 0 and 1.

**When to use:** Scale-invariant prior (rare in practice).

### $\text{Beta}(\alpha, \alpha)$ - Symmetric

Centered at $\theta = 0.5$.

**When to use:** Belief in symmetry/fairness. Larger $\alpha$ = stronger belief.

### $\text{Beta}(\alpha, \beta)$ with $\alpha \neq \beta$ - Asymmetric

Peaked away from 0.5.

**When to use:** Prior belief in bias. E.g., $\text{Beta}(7, 3)$ if you think Towpath likely has advantage.

---

## Sensitivity Analysis

**Key question:** Do my conclusions depend on the prior?

**Test:** Run analysis with multiple priors:

```python
from scipy.stats import beta

# Observed data
n, k = 84, 54

# Three priors
priors = [
    (1, 1, "Uniform"),
    (2, 2, "Weak fairness"),
    (10, 10, "Strong fairness"),
    (20, 20, "Very strong fairness")
]

for alpha, beta_param, label in priors:
    posterior = beta(alpha + k, beta_param + n - k)
    mean = posterior.mean()
    ci = posterior.ppf([0.025, 0.975])

    print(f"{label:25s} θ = {mean:.3f}, 95% CI: [{ci[0]:.3f}, {ci[1]:.3f}]")
```

**Output:**
```
Uniform                   θ = 0.640, 95% CI: [0.547, 0.728]
Weak fairness             θ = 0.636, 95% CI: [0.544, 0.724]
Strong fairness           θ = 0.615, 95% CI: [0.527, 0.700]
Very strong fairness      θ = 0.590, 95% CI: [0.509, 0.669]
```

**Interpretation:**
- With moderate data (84 races), all reasonable priors give similar results
- Even very strong fairness prior ($n_0 = 40$) still shows Towpath advantage
- **Conclusion is robust to prior choice**

**General rule:** If conclusions change dramatically with reasonable prior choices, you probably need more data.

---

## Prior Choice for [[evidence|Bayesian Evidence]]

**Critical point:** For [[model-comparison]], prior choice **always matters**.

The [[evidence]] is:

$$\mathcal{Z} = \int \mathcal{L}(\theta)\pi(\theta) d\theta$$

Unlike parameter inference (where data dominate), evidence **directly depends on prior volume**.

### Example: Comparing Fair vs Biased Course

**Model A:** Fair course, $\theta = 0.5$ (no free parameters)

**Model B:** Biased course, $\theta$ free with prior $\text{Beta}(\alpha, \beta)$

The Bayes factor depends on the prior:

**Wide prior** (e.g., $\text{Beta}(1, 1)$): Model B wastes prior volume → penalized
**Narrow prior** (e.g., $\text{Beta}(50, 50)$): Model B concentrates near data → favored

This is a feature, not a bug: the prior encodes the model's predictions.
- Wide prior = "model predicts anything could happen" (vague)
- Narrow prior = "model makes specific prediction" (bold)

See [[evidence#The Occam Penalty|Occam penalty]] for why this is desirable.

---

## Practical Guidelines

### For Parameter Inference

- **Use informative priors** when you have genuine prior knowledge
- **Use weakly informative priors** when uncertain (e.g., $\text{Beta}(2,2)$ instead of $\text{Beta}(1,1)$)
- **Run sensitivity analysis** with multiple priors
- **Report your prior choice** and justify it

- Don't use priors that exclude the truth
- Don't cherry-pick priors to get desired results
- Don't claim priors "don't matter" without checking

### For Model Comparison

- **Priors encode model predictions** - choose them carefully
- **Use same prior philosophy** for all models (e.g., all weakly informative)
- **Document prior rationale** - why these values?
- **Consider prior predictive checks** - does the prior predict reasonable data?

See [[computing-evidence#Common Pitfalls|common pitfalls]] for evidence-specific prior issues.

---

## Examples from Cosmology

### CMB Analysis

**Parameter:** Spectral index $n_s$

**Prior:** $\mathcal{U}(0.8, 1.2)$
- Physically motivated: excludes extreme scale-dependence
- Wide enough to not constrain data

**Why not $\mathcal{U}(0, 2)$?** Wider prior doesn't change posterior but wastes volume, penalizing evidence.

### Dark Energy Equation of State

**Parameter:** $w$ (equation of state)

**Prior:** $\mathcal{U}(-2, 0)$
- Physical bound: $w \geq -1$ for normal matter
- Extended to $w < -1$ for exotic "phantom" energy

**Debate:** Should we use $\mathcal{U}(-1.5, -0.5)$ (narrower) or $\mathcal{U}(-2, 0)$?
- Narrower: "I expect $w$ near -1" (informed by theory)
- Wider: "I'm open to exotic physics" (conservative)

Different priors can change Bayes factors by $\Delta\log\mathcal{Z} \sim 1-2$!

---

## The "Objective Bayes" Debate

**Question:** Can we choose priors "objectively" without subjective judgment?

**Jeffreys approach:** Use invariance principles (e.g., scale-invariance) to derive "objective" priors[^Jeffreys1961].

**Berger-Bernardo:** Maximize expected information gain[^BergerBernardo1992].

**Maximum entropy:** Choose the "most uncertain" prior subject to constraints[^Jaynes1957].

**Pragmatic view:** There's no single "objective" prior. Instead:
1. Be **transparent** about your choice
2. **Justify** it with physical reasoning
3. Check **sensitivity** to reasonable alternatives
4. Use **weakly informative** priors when uncertain

Bayesian inference is honest about incorporating prior knowledge. Pretending we have no priors doesn't make them go away — it just makes them implicit.

---

## Summary

**Prior choice guidelines:**

1. **Use physical constraints** to bound parameter ranges
2. **Encode prior information** when you have it (previous experiments, theory)
3. **Pseudocount interpretation** for Beta priors (how many prior "data points"?)
4. **Effective sample size** determines prior strength vs data
5. **Sensitivity analysis** checks robustness
6. **For evidence:** Priors encode model predictions (always matter!)

**The Beta distribution:**
- $\text{Beta}(\alpha, \beta)$ = $(\alpha-1)$ successes, $(\beta-1)$ failures
- $n_0 = \alpha + \beta$ = effective prior sample size
- Posterior = weighted average of prior and data

**Golden rule:** Be transparent, be principled, and check sensitivity.

---

**Next:**
- [[analytical-update]] - Seeing prior choice in action
- [[model-comparison]] - How priors affect evidence
- [[bayesian-inference]] - The general framework

---

**References:**

[^Jaynes1957]: Jaynes, E. T. (1957). Information theory and statistical mechanics. *Physical Review*, 106(4), 620.

[^Jeffreys1961]: Jeffreys, H. (1961). *Theory of Probability* (3rd ed.). Oxford University Press.

[^BergerBernardo1992]: Berger, J. O., & Bernardo, J. M. (1992). On the development of reference priors. *Bayesian Statistics*, 4, 35-60.

[^Gelman2013]: Gelman, A., et al. (2013). *Bayesian Data Analysis* (3rd ed.). CRC Press.

[^Robert2007]: Robert, C. P. (2007). *The Bayesian Choice* (2nd ed.). Springer.
