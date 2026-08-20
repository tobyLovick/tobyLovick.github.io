# Bayesian Inference

← Back to [[index]] | Previous: [[bayes-theorem]]

---

## From Coins to Cosmology

[[bayes-theorem|Bayes' theorem]] works for any inference problem. In science, we're typically trying to infer the values of **model parameters** $\theta$ from observed **data** $d$, within some theoretical framework (a **model** $\mathcal{M}$).

---

## The Framework

Bayes' theorem for scientific inference:

$$\boxed{p(\theta|d,\mathcal{M}) = \frac{p(d|\theta,\mathcal{M}) \, p(\theta|\mathcal{M})}{p(d|\mathcal{M})}}$$

Or in notation we'll use throughout:

$$\boxed{\mathcal{P} = \frac{\mathcal{L} \times \pi}{\mathcal{Z}}}$$

Where:
- **$\pi = p(\theta|\mathcal{M})$** = **Prior**: What we believe about parameters before seeing data
- **$\mathcal{L} = p(d|\theta,\mathcal{M})$** = **Likelihood**: Probability of data given parameters
- **$\mathcal{P} = p(\theta|d,\mathcal{M})$** = **Posterior**: Updated beliefs after seeing data
- **$\mathcal{Z} = p(d|\mathcal{M})$** = **Evidence**: The marginalized likelihood (crucial for [[model-comparison]])

---

## The Three Components

### 1. The Prior $\pi(\theta)$

**Role:** Encodes what we know about parameters *before* collecting data.

**Examples:**
- **Physical bounds**: $\Omega_m \in [0,1]$ (matter can't be negative or exceed closure density)
- **Theoretical expectations**: $H_0 \in [50, 100]$ km/s/Mpc (wide but excludes unphysical values)
- **Previous measurements**: Use posterior from earlier experiment as prior for new one

**Common choices:**
- **Uniform**: $\pi(\theta) \propto 1$ on some range (minimal assumption)
- **Log-uniform**: $\pi(\theta) \propto 1/\theta$ (appropriate for scale parameters)
- **Gaussian**: $\pi(\theta) \propto \exp(-(\theta-\mu)^2/2\sigma^2)$ (encodes previous measurement)

**Important:** For parameter estimation, results become prior-independent as data accumulates. But for [[model-comparison]], prior choice always matters—this is a feature, not a bug. See [[prior-choice]] for detailed discussion of how to choose priors.

For a complete worked example of Bayesian updating with analytical solutions, see [[analytical-update]].

### 2. The Likelihood $\mathcal{L}(\theta)$

**Role:** Quantifies how well parameters predict the observed data.

This comes from our theoretical model. For example:

**Gaussian likelihood** (most common):

$$\mathcal{L}(\theta) = \frac{1}{\sqrt{(2\pi)^n|\mathbf{C}|}} \exp\left(-\frac{1}{2}(\mathbf{d}-\mathbf{m}(\theta))^T\mathbf{C}^{-1}(\mathbf{d}-\mathbf{m}(\theta))\right)$$

where:
- $\mathbf{d}$ = observed data vector
- $\mathbf{m}(\theta)$ = model prediction given parameters $\theta$
- $\mathbf{C}$ = covariance matrix (measurement uncertainties and correlations)

**Key point:** The likelihood is a function of $\theta$ for fixed data $d$. It is **not** a probability distribution over $\theta$ (it doesn't integrate to 1).

### 3. The Posterior $\mathcal{P}(\theta)$

**Role:** Our final inference—what we've learned about parameters from data.

The posterior combines prior knowledge and data:
- If data are weak, posterior $\approx$ prior
- If data are strong, posterior is concentrated near best-fit values
- Posterior quantifies our **uncertainty** via its width

**What we extract:**
- **Point estimate**: Maximum a posteriori (MAP) or posterior mean
- **Uncertainties**: Standard deviation or credible intervals
- **Correlations**: Off-diagonal structure in posterior covariance

**Computing the posterior:** Since we rarely have analytical forms, we use sampling methods:
- **[[mcmc|MCMC]]**: Markov Chain Monte Carlo (e.g., Metropolis-Hastings, Hamiltonian Monte Carlo)
- **[[nested-sampling]]**: Simultaneously computes posterior samples and evidence

---

## Example: Measuring the Hubble Constant

Here's a concrete cosmological example.

**Goal:** Measure $H_0$ (the Hubble constant) from Type Ia supernova distances.

### Setup

- **Parameters**: $\theta = (H_0, M_B)$ where $M_B$ is the absolute magnitude
- **Data**: Observed apparent magnitudes $m_i$ and redshifts $z_i$ for $n$ supernovae
- **Model**: $\mathcal{M}$ = Flat $\Lambda$CDM cosmology

### The Prior

Physical reasoning gives us:

$$\pi(H_0) = \mathcal{U}(50, 100) \quad \text{km/s/Mpc}$$

$$\pi(M_B) = \mathcal{U}(-20, -18)$$

These are wide enough to be "uninformative" but exclude unphysical values.

### The Likelihood

For each supernova, theory predicts:

$$\mu_{\text{th}}(z_i; H_0) = 5\log_{10}\left(\frac{d_L(z_i; H_0)}{10\,\text{pc}}\right)$$

where $d_L(z; H_0)$ is the luminosity distance in Flat $\Lambda$CDM:

$$d_L(z; H_0) = \frac{c(1+z)}{H_0}\int_0^z \frac{dz'}{\sqrt{\Omega_m(1+z')^3 + (1-\Omega_m)}}$$

The data are $m_i$ with uncertainties $\sigma_i$. Since $\mu = m - M_B$:

$$\mathcal{L}(H_0, M_B) = \prod_{i=1}^n \frac{1}{\sqrt{2\pi\sigma_i^2}} \exp\left(-\frac{(m_i - M_B - \mu_{\text{th}}(z_i; H_0))^2}{2\sigma_i^2}\right)$$

In practice, we work with the log-likelihood:

$$\log\mathcal{L} = -\frac{1}{2}\sum_{i=1}^n \left[\frac{(m_i - M_B - \mu_{\text{th}}(z_i; H_0))^2}{\sigma_i^2} + \log(2\pi\sigma_i^2)\right]$$

### The Posterior

We compute $\mathcal{P}(H_0, M_B)$ using [[mcmc|MCMC sampling]]:

```python
import numpy as np
import emcee  # MCMC sampler

def log_prior(theta):
    H0, M_B = theta
    if 50 < H0 < 100 and -20 < M_B < -18:
        return 0.0  # Uniform prior (log of constant)
    return -np.inf  # Outside bounds

def log_likelihood(theta, data):
    H0, M_B = theta
    z, m, sigma = data

    # Compute theoretical distance modulus for each supernova
    mu_th = distance_modulus(z, H0)  # Function computing μ_th(z; H_0)

    # Gaussian likelihood
    residuals = m - M_B - mu_th
    return -0.5 * np.sum((residuals / sigma)**2 + np.log(2*np.pi*sigma**2))

def log_posterior(theta, data):
    lp = log_prior(theta)
    if not np.isfinite(lp):
        return -np.inf
    return lp + log_likelihood(theta, data)

# Run MCMC
nwalkers, ndim = 32, 2
p0 = np.random.rand(nwalkers, ndim) * [50, 2] + [50, -20]  # Initialize
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_posterior, args=[data])
sampler.run_mcmc(p0, 5000, progress=True)

# Extract posterior samples
samples = sampler.get_chain(discard=1000, flat=True)
H0_samples = samples[:, 0]
```

**Output:**
```
H₀ = 73.5 ± 1.2 km/s/Mpc  (68% credible interval)
M_B = -19.3 ± 0.1
```

The posterior gives us both the central value and quantified uncertainty.

---

## Parameter Estimation vs Model Comparison

So far we've focused on **parameter inference**: given a model $\mathcal{M}$, what are the parameter values?

But what if we want to compare **different models**?

- Model A: Flat $\Lambda$CDM ($\Omega_k = 0$ fixed)
- Model B: Curved $\Lambda$CDM ($\Omega_k$ free)

**Question:** Does the data justify the additional parameter $\Omega_k$?

For this, we need to compare the **[[evidence]]** of each model. The posterior samples from MCMC don't directly give us this—we need specialized methods like [[nested-sampling]].

This is where Bayesian inference offers something frequentist methods don't: a rigorous, principled framework for model comparison through the evidence.

---

## The Evidence Preview

For parameter inference, the evidence $\mathcal{Z}$ is just a normalizing constant:

$$\mathcal{Z} = \int \mathcal{L}(\theta)\pi(\theta) d\theta$$

It ensures $\int \mathcal{P}(\theta)d\theta = 1$, but doesn't affect the posterior shape.

**However:** For comparing models, the evidence is **the** key quantity. It quantifies:
1. How well does the model fit the data? (via $\langle \mathcal{L} \rangle$)
2. How much parameter space is wasted? (via the Occam penalty)

Models that fit well but are overly complex get penalized — this naturally implements Occam's razor.

To understand why and how, continue to [[evidence]].

---

## Key Takeaways

1. **Bayesian inference** applies Bayes' theorem to scientific problems
2. **Priors** encode physical constraints and previous knowledge
3. **Likelihoods** come from theoretical models and measurement uncertainties
4. **Posteriors** quantify what we've learned from data
5. **MCMC sampling** is the workhorse for computing posteriors
6. **The evidence** enables model comparison (next topic!)

---

**Next:** [[evidence]] - Why the normalizing constant is the most important quantity

**Related:**
- [[mcmc]] - How to sample the posterior
- [[model-comparison]] - Comparing theories with evidence
- [[nested-sampling]] - Computing evidence directly

---

**References:**

[Trotta2008]: Trotta, R. (2008). Bayes in the sky: Bayesian inference and model selection in cosmology. *Contemporary Physics*, 49(2), 71-104.

[Hobson2010]: Hobson, M. P., et al. (2010). Bayesian Methods in Cosmology. Cambridge University Press.

[Jaynes2003]: Jaynes, E. T. (2003). *Probability Theory: The Logic of Science*. Cambridge University Press.
