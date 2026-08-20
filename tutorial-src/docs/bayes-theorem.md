# Bayes' Theorem

← Back to [[index]] | Previous: [[conditional-probability]]

---

## The Fundamental Theorem

From [[conditional-probability]], we know that the joint probability of events $A$ and $B$ can be expressed in two equivalent ways:

$$P(A \cap B) = P(A|B)P(B) = P(B|A)P(A)$$

Rearranging gives us **Bayes' theorem**:

$$\boxed{P(A|B) = \frac{P(B|A)P(A)}{P(B)}}$$

This single relation is the foundation of Bayesian inference.

---

## Interpreting the Terms

When we apply this to scientific inference with hypothesis $H$ and data $D$:

$$P(H|D) = \frac{P(D|H)P(H)}{P(D)}$$

- **$P(H)$** = **Prior**: Our belief about $H$ *before* seeing the data
- **$P(D|H)$** = **Likelihood**: How probable is this data under hypothesis $H$?
- **$P(H|D)$** = **Posterior**: Our updated belief about $H$ *after* seeing the data
- **$P(D)$** = **Evidence**: The total probability of the data (normalizing constant)

In words:

$$\boxed{\text{Posterior} = \frac{\text{Likelihood} \times \text{Prior}}{\text{Evidence}}}$$

Bayes' theorem inverts the conditioning, allowing us to go from "data given hypothesis" (which we can calculate from theory) to "hypothesis given data" (which is what we actually want).

---

## The Beetle Example: Base Rates Matter

A naturalist spots a beetle with distinctive markings. The rare species has these markings 98% of the time, while only 2% of common beetles do. However, the rare species represents only 0.1% of the population.

**Question:** Given the beetle has the markings, how likely is it to be rare?

**Intuitive (wrong) answer:** 98% (the diagnostic rate)

**Correct answer using Bayes' theorem:**

Let $R$ = "beetle is rare", $M$ = "beetle has markings"

$$P(R|M) = \frac{P(M|R)P(R)}{P(M)}$$

We need to find $P(M)$ using the law of total probability:

$$P(M) = P(M|R)P(R) + P(M|\text{not }R)P(\text{not }R)$$

$$= (0.98)(0.001) + (0.02)(0.999) = 0.00098 + 0.01998 = 0.02096$$

Therefore:

$$P(R|M) = \frac{(0.98)(0.001)}{0.02096} = \frac{0.00098}{0.02096} \approx 0.047 = 4.7\%$$

**Despite the markings being highly diagnostic, the base rate (prior) is so low that most marked beetles are still common species.**

This illustrates a crucial point: **priors matter**. They incorporate what we know about the world before we collect data.

---

## Worked Example: The Coin Flip

A complete Bayesian analysis of a simple problem: estimating the bias of a coin.

### Setup

- We have a coin with unknown probability $\theta$ of landing heads
- We flip it $n$ times and observe $k$ heads
- We want to infer $\theta$ from this data

### The Prior

Before flipping, what do we believe about $\theta$? A natural choice is the **Beta distribution**:

$$P(\theta) = \text{Beta}(\theta | \alpha, \beta) = \frac{\theta^{\alpha-1}(1-\theta)^{\beta-1}}{B(\alpha,\beta)}$$

where $B(\alpha,\beta)$ is the Beta function (normalization constant).

**Why the Beta distribution?**
- It's defined on $[0,1]$ (appropriate for a probability)
- It's flexible (different $\alpha, \beta$ give different shapes)
- It's conjugate to the Binomial (we'll see why this matters)

**Special cases:**
- $\alpha = \beta = 1$: Uniform distribution (no prior knowledge)
- $\alpha = \beta = 2$: Peaked at 0.5 (belief the coin is fair)
- $\alpha > \beta$: Peaked toward 1 (belief in heads bias)

### The Likelihood

Given $\theta$, the probability of observing $k$ heads in $n$ flips is the **Binomial distribution**:

$$P(k|\theta, n) = \binom{n}{k}\theta^k(1-\theta)^{n-k}$$

This is our **likelihood function** (as a function of $\theta$ for fixed data $k, n$).

### The Posterior

Apply Bayes' theorem:

$$P(\theta|k,n) = \frac{P(k|\theta,n)P(\theta)}{P(k|n)}$$

Substituting our prior and likelihood:

$$P(\theta|k,n) = \frac{\binom{n}{k}\theta^k(1-\theta)^{n-k} \cdot \frac{\theta^{\alpha-1}(1-\theta)^{\beta-1}}{B(\alpha,\beta)}}{P(k|n)}$$

The numerator simplifies:

$$\propto \theta^{k+\alpha-1}(1-\theta)^{n-k+\beta-1}$$

**This is another Beta distribution!** Specifically:

$$\boxed{P(\theta|k,n) = \text{Beta}(\theta | \alpha + k, \beta + n - k)}$$

**Interpretation:**
- Start with "prior" data: $\alpha-1$ heads, $\beta-1$ tails
- Observe real data: $k$ heads, $n-k$ tails
- Posterior has effective counts: $(\alpha-1)+k$ heads, $(\beta-1)+(n-k)$ tails

This is called **conjugacy**: the posterior has the same functional form as the prior.

### Numerical Example

**Prior:** $\text{Beta}(2, 2)$ (weak belief in fairness)

**Data:** Flip 10 times, observe 7 heads

**Posterior:** $\text{Beta}(2+7, 2+3) = \text{Beta}(9, 5)$

The posterior mean is:

$$\mathbb{E}[\theta] = \frac{\alpha}{\alpha+\beta} = \frac{9}{9+5} = \frac{9}{14} \approx 0.643$$

**Visual:**

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import beta

theta = np.linspace(0, 1, 1000)

# Prior: Beta(2, 2)
prior = beta.pdf(theta, 2, 2)

# Posterior: Beta(9, 5)
posterior = beta.pdf(theta, 9, 5)

plt.figure(figsize=(10, 6))
plt.plot(theta, prior, label='Prior: Beta(2,2)', linewidth=2)
plt.plot(theta, posterior, label='Posterior: Beta(9,5)', linewidth=2)
plt.axvline(7/10, color='red', linestyle='--', label='Data proportion: 7/10')
plt.axvline(9/14, color='blue', linestyle='--', label='Posterior mean: 9/14')
plt.xlabel('θ (probability of heads)')
plt.ylabel('Probability density')
plt.legend()
plt.title('Bayesian Update: Coin Flip Example')
plt.grid(True, alpha=0.3)
plt.show()
```

**Output:**

The posterior is peaked near 0.7 (the observed proportion), but pulled slightly toward 0.5 by the prior. With more data, the posterior would concentrate more tightly around the true value.

---

## Key Insights

1. **Priors encode prior knowledge** - they're not arbitrary, but represent what we know before the experiment
2. **Data updates beliefs** - the likelihood tells us how much to shift from prior to posterior
3. **More data = less prior dependence** - with enough data, the likelihood dominates
4. **Conjugacy is beautiful** - when it exists, inference can be done analytically
5. **The evidence normalizes** - $P(D)$ ensures the posterior integrates to 1

---

## What About the Evidence?

In the coin flip example, we ignored $P(k|n)$ because it's just a normalizing constant for parameter inference. But for [[model-comparison]], it becomes **the central quantity**.

The evidence is:

$$P(k|n) = \int_0^1 P(k|\theta,n)P(\theta) d\theta$$

For our Beta-Binomial case, this can be computed analytically:

$$P(k|n) = \binom{n}{k}\frac{B(\alpha+k, \beta+n-k)}{B(\alpha,\beta)}$$

**Why does this matter?** Because when we compare two models (e.g., "coin is fair" vs "coin is biased"), we compare their evidences. This is the subject of [[model-comparison]].

---

## Moving Forward

Now that we understand Bayes' theorem:

- [[analytical-update]] - Complete worked example with real rowing data
- [[bayesian-inference]] - Applying this framework to scientific problems
- [[evidence]] - Why the normalizing constant matters for model comparison
- [[model-comparison]] - Using evidence to compare theories

---

**References:**

[Bayes1763]: Bayes, T. (1763). An Essay towards solving a Problem in the Doctrine of Chances. *Philosophical Transactions of the Royal Society*, 53, 370-418.

[Jeffreys1961]: Jeffreys, H. (1961). *Theory of Probability* (3rd ed.). Oxford University Press.

[Jaynes2003]: Jaynes, E. T. (2003). *Probability Theory: The Logic of Science*. Cambridge University Press.
