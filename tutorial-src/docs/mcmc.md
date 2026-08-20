# Markov Chain Monte Carlo (MCMC)

← Back to [[index]] | See also: [[nested-sampling]]

---

## Sampling the Posterior

[[bayesian-inference|Bayesian inference]] gives us a posterior distribution:

$$\mathcal{P}(\theta|d) \propto \mathcal{L}(\theta)\pi(\theta)$$

For most problems, we can't compute this analytically. **Markov Chain Monte Carlo** (MCMC) methods generate samples from $\mathcal{P}$ that we can use to estimate any quantity of interest.

---

## The Core Idea

Create a **Markov chain**—a sequence of parameter values $\theta_1, \theta_2, \theta_3, \ldots$—whose **stationary distribution is the posterior** $\mathcal{P}(\theta)$.

After a "burn-in" period, samples from the chain are (approximately) samples from $\mathcal{P}$.

**Key properties needed:**
1. **Irreducible**: Can reach any state from any other state
2. **Aperiodic**: Doesn't cycle deterministically
3. **Positive recurrent**: Returns to states infinitely often

If these hold, the chain converges to a unique stationary distribution.

---

## Detailed Balance

To ensure the stationary distribution is $\mathcal{P}$, we design the chain to satisfy **detailed balance**:

$$\mathcal{P}(\theta) T(\theta'|\theta) = \mathcal{P}(\theta') T(\theta|\theta')$$

where $T(\theta'|\theta)$ is the transition probability from $\theta$ to $\theta'$.

**Intuition:** The flow from $\theta$ to $\theta'$ equals the flow from $\theta'$ to $\theta$ at equilibrium.

**Consequence:** If detailed balance holds, $\mathcal{P}$ is the stationary distribution.

---

## Metropolis-Hastings Algorithm

The workhorse of MCMC. Proposed by Metropolis et al. (1953)[^Metropolis1953] and generalized by Hastings (1970)[^Hastings1970].

### The Algorithm

Given current state $\theta_i$:

**Step 1 — Propose** a new state: $\theta' \sim Q(\theta'|\theta_i)$ (proposal distribution)

**Step 2 — Compute acceptance probability:**

$$\alpha = \min\left(1, \frac{\mathcal{P}(\theta') Q(\theta_i|\theta')}{\mathcal{P}(\theta_i) Q(\theta'|\theta_i)}\right)$$

**Step 3 — Accept or reject:**

- With probability $\alpha$: set $\theta_{i+1} = \theta'$
- With probability $1-\alpha$: set $\theta_{i+1} = \theta_i$ (stay put)

**Step 4 — Repeat**

### Why This Works

The acceptance ratio ensures detailed balance. The key insight: we only need the **ratio** $\mathcal{P}(\theta')/\mathcal{P}(\theta_i)$, so the normalization constant (the [[evidence]]) cancels out.

$$\alpha = \min\left(1, \frac{\mathcal{L}(\theta')\pi(\theta')}{\mathcal{L}(\theta_i)\pi(\theta_i)} \cdot \frac{Q(\theta_i|\theta')}{Q(\theta'|\theta_i)}\right)$$

**This is why MCMC works for parameter inference without computing evidence.**

### Example: Symmetric Proposal

If $Q$ is symmetric ($Q(\theta'|\theta) = Q(\theta|\theta')$), the acceptance simplifies to:

$$\alpha = \min\left(1, \frac{\mathcal{P}(\theta')}{\mathcal{P}(\theta_i)}\right)$$

**Common choice:** Gaussian random walk: $\theta' = \theta_i + \mathcal{N}(0, \Sigma)$

```python
import numpy as np

def mcmc_metropolis(log_posterior, theta_init, Sigma, n_steps):
    """Simple Metropolis MCMC with Gaussian proposal"""
    chain = [theta_init]
    theta = theta_init
    log_p = log_posterior(theta)
    n_accept = 0

    for i in range(n_steps):
        # Propose
        theta_prime = theta + np.random.multivariate_normal(np.zeros(len(theta)), Sigma)

        # Evaluate
        log_p_prime = log_posterior(theta_prime)

        # Accept/reject
        log_alpha = log_p_prime - log_p
        if np.log(np.random.rand()) < log_alpha:
            theta = theta_prime
            log_p = log_p_prime
            n_accept += 1

        chain.append(theta.copy())

    acceptance_rate = n_accept / n_steps
    return np.array(chain), acceptance_rate

# Run
chain, acc_rate = mcmc_metropolis(log_post, theta_init, Sigma, n_steps=10000)
print(f"Acceptance rate: {acc_rate:.2%}")

# Discard burn-in
samples = chain[1000:]  # Use last 9000 samples
```

**Tuning:** Adjust $\Sigma$ to get acceptance rate $\sim 20-40\%$. Too high = small steps, slow exploration. Too low = proposals rarely accepted.

---

## Gibbs Sampling

A special case where we update **one parameter at a time**, conditioning on the others.

For parameters $\theta = (\theta_1, \theta_2, \ldots, \theta_d)$:

1. Sample $\theta_1^{(i+1)} \sim p(\theta_1 | \theta_2^{(i)}, \theta_3^{(i)}, \ldots, \theta_d^{(i)}, d)$
2. Sample $\theta_2^{(i+1)} \sim p(\theta_2 | \theta_1^{(i+1)}, \theta_3^{(i)}, \ldots, \theta_d^{(i)}, d)$
3. ...
4. Sample $\theta_d^{(i+1)} \sim p(\theta_d | \theta_1^{(i+1)}, \ldots, \theta_{d-1}^{(i+1)}, d)$

**Advantage:** No tuning required. Each conditional distribution might be simple (e.g., conjugate prior situations).

**Disadvantage:** Can be slow if parameters are highly correlated (updates along axes, not along degeneracy directions).

---

## Hamiltonian Monte Carlo (HMC)

Uses **gradient information** to make efficient proposals[^Duane1987][^Neal1996].

### The Physics Analogy

Imagine a particle moving in potential $U(\theta) = -\log\mathcal{P}(\theta)$ with momentum $p$.

**Hamilton's equations:**

$$\frac{d\theta}{dt} = \frac{\partial H}{\partial p}, \quad \frac{dp}{dt} = -\frac{\partial H}{\partial \theta}$$

where $H(\theta, p) = U(\theta) + K(p)$ is the Hamiltonian (total energy).

**Key insight:** Trajectories along constant-$H$ surfaces explore parameter space efficiently, following the natural geometry of $\mathcal{P}$.

### The Algorithm

1. **Sample momentum:** $p \sim \mathcal{N}(0, M)$
2. **Integrate Hamilton's equations** for time $T$ using leapfrog steps:
   ```
   p ← p + (ε/2) ∇log P(θ)
   θ ← θ + ε M⁻¹ p
   p ← p + (ε/2) ∇log P(θ)
   ```
3. **Accept/reject** using Metropolis criterion (corrects for discretization error)

**Advantage:** Can take large steps while maintaining high acceptance rate. Scales well to high dimensions.

**Disadvantage:** Requires gradients $\nabla\log\mathcal{P}$. Tuning $\epsilon$ (step size) and $T$ (trajectory length) can be tricky.

### No-U-Turn Sampler (NUTS)

Automatically tunes trajectory length[^Hoffman2014]. Used in Stan and PyMC.

```python
import pymc as pm

with pm.Model() as model:
    # Define priors
    Omega_m = pm.Uniform('Omega_m', 0, 1)
    H0 = pm.Uniform('H0', 50, 100)

    # Define likelihood
    mu_theory = distance_modulus(z, Omega_m, H0)
    pm.Normal('obs', mu=mu_theory, sigma=sigma_obs, observed=m_obs)

    # Sample with NUTS
    trace = pm.sample(2000, tune=1000, cores=4)

pm.plot_trace(trace)
```

**NUTS is the state-of-the-art** for problems where gradients are available.

---

## Convergence Diagnostics

How do we know the chain has converged?

### 1. Trace Plots

Plot $\theta_i$ vs iteration $i$. Should look like "fuzzy caterpillar"—no trends, no getting stuck.

```python
import matplotlib.pyplot as plt

plt.plot(chain[:, 0])  # First parameter
plt.xlabel('Iteration')
plt.ylabel('θ₁')
```

**Bad signs:** Upward trend, oscillations, flat regions

### 2. Autocorrelation

Chains have memory—nearby samples are correlated. Compute the **integrated autocorrelation time** $\tau$:

$$\tau = 1 + 2\sum_{k=1}^\infty \rho_k$$

where $\rho_k$ is the autocorrelation at lag $k$.

**Rule:** Effective sample size $N_{\text{eff}} \approx N / \tau$. Need $N_{\text{eff}} > 100$ for reliable estimates.

```python
import arviz as az

az.ess(trace)  # Effective sample size
az.rhat(trace)  # Gelman-Rubin statistic
```

### 3. Gelman-Rubin Statistic ($\hat{R}$)

Run **multiple chains** from different starting points. If they converge to the same distribution:

$$\hat{R} = \sqrt{\frac{B/n}{W}}$$

where $B$ = between-chain variance, $W$ = within-chain variance.

**Rule:** $\hat{R} < 1.1$ indicates convergence. $\hat{R} > 1.2$ is bad.

---

## Burn-In

Early iterations explore from the initial point toward high-probability regions. These samples **don't** represent the posterior.

**Solution:** Discard the first $N_{\text{burn}}$ samples (typically 10-50% of chain).

```python
# Discard first 1000 iterations
samples = chain[1000:]
```

**How much burn-in?** Look at trace plots. Burn-in is over when the chain "settles."

---

## MCMC vs Nested Sampling

| Feature | MCMC | [[nested-sampling|Nested Sampling]] |
|---------|------|-------------------------------------|
| **Output** | Posterior samples | Evidence + posterior samples |
| **Efficiency** | High (especially HMC) | Moderate |
| **Dimensionality** | Excellent (50-1000+) | Good (up to ~40) |
| **Multimodal?** | Can get stuck | Naturally handles |
| **Gradients?** | Optional (HMC) | Not typically used |
| **Burn-in?** | Yes | No |
| **Use case** | Parameter inference | Model comparison |

**Bottom line:**
- Use **MCMC** (especially NUTS) for parameter constraints in high dimensions
- Use **Nested Sampling** when you need evidence for [[model-comparison]]

---

## Modern MCMC Software

### 1. emcee (Python)

Affine-invariant ensemble sampler[^emcee]. No gradient needed.

```python
import emcee

nwalkers, ndim = 32, 6
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_posterior)
sampler.run_mcmc(initial_pos, 5000)
samples = sampler.get_chain(discard=1000, flat=True)
```

**Pros:** Easy to parallelize, no tuning
**Cons:** Not as efficient as HMC

### 2. Stan (via PyStan/CmdStan)

Automatic differentiation + NUTS.

```stan
data {
  int<lower=0> N;
  vector[N] z;
  vector[N] m;
  vector[N] sigma;
}
parameters {
  real<lower=0, upper=1> Omega_m;
  real<lower=50, upper=100> H0;
}
model {
  vector[N] mu_th;
  for (i in 1:N)
    mu_th[i] = distance_modulus(z[i], Omega_m, H0);
  m ~ normal(mu_th, sigma);
}
```

**Pros:** State-of-the-art efficiency, automatic tuning
**Cons:** Learning curve for Stan language

### 3. PyMC

Pythonic interface to NUTS.

```python
import pymc as pm

with pm.Model():
    # Model specification (shown earlier)
    trace = pm.sample(2000)
```

**Pros:** Pure Python, great ecosystem
**Cons:** Can be slower than compiled Stan

### 4. NumPyro

JAX-based NUTS for GPU acceleration[^Phan2019].

```python
import numpyro
from numpyro.infer import MCMC, NUTS

mcmc = MCMC(NUTS(model), num_warmup=1000, num_samples=2000)
mcmc.run(rng_key, data)
samples = mcmc.get_samples()
```

**Pros:** GPU acceleration, very fast
**Cons:** Still maturing ecosystem

---

## Practical Tips

### 1. Initialize Near Posterior

Don't start at random prior points. Use optimization to find MAP, then initialize chain nearby.

```python
from scipy.optimize import minimize

result = minimize(lambda x: -log_posterior(x), x0=prior_mean)
theta_init = result.x
```

### 2. Run Multiple Chains

Helps detect convergence problems. If chains don't agree, you haven't converged.

```python
chains = [run_mcmc(random_init()) for _ in range(4)]
rhat = gelman_rubin(chains)  # Should be < 1.1
```

### 3. Thin if Necessary

If storage is an issue, keep every $k$-th sample to reduce autocorrelation.

```python
thinned = chain[::10]  # Every 10th sample
```

But often it's better to run longer and keep all samples.

### 4. Check Effective Sample Size

Not all samples are independent. Aim for $N_{\text{eff}} > 100$ per parameter.

---

## When MCMC Fails

### 1. Highly Multimodal Posteriors

MCMC can get stuck in one mode. Use:
- Parallel tempering
- Simulated annealing
- [[nested-sampling]] (naturally handles multimodality)

### 2. Strongly Degenerate Parameters

HMC helps, but can still struggle. Try:
- Reparameterization
- Non-centered parameterization
- Gradient-based nested sampling

### 3. Expensive Likelihoods

Each step requires likelihood evaluation. Solutions:
- Use surrogate models / emulators
- Batch evaluations on GPU
- See [[gpu-acceleration]]

---

## Summary

**MCMC generates samples from the posterior distribution:**

- No evidence calculation (great for parameter inference)
- Scales well to high dimensions (especially HMC/NUTS)
- Gradients greatly improve efficiency
- Mature software ecosystem
- Requires burn-in and convergence checks

**When to use:**
- Parameter constraints only (no model comparison)
- High-dimensional problems ($d > 40$)
- Gradients available → use NUTS
- Multiple chains to verify convergence

**For model comparison, use [[nested-sampling]] to compute the [[evidence]].**

---

**Next:**
- [[computing-evidence]] - Methods for evidence calculation
- [[nested-sampling]] - Alternative that gives evidence
- [[bayesian-inference]] - The framework

---

**References:**

[^Metropolis1953]: Metropolis, N., et al. (1953). Equation of state calculations by fast computing machines. *The Journal of Chemical Physics*, 21(6), 1087-1092.

[^Hastings1970]: Hastings, W. K. (1970). Monte Carlo sampling methods using Markov chains. *Biometrika*, 57(1), 97-109.

[^Duane1987]: Duane, S., et al. (1987). Hybrid Monte Carlo. *Physics Letters B*, 195(2), 216-222.

[^Neal1996]: Neal, R. M. (1996). Sampling from multimodal distributions using tempered transitions. *Statistics and Computing*, 6(4), 353-366.

[^Hoffman2014]: Hoffman, M. D., & Gelman, A. (2014). The No-U-Turn sampler. *Journal of Machine Learning Research*, 15(1), 1593-1623.

[^emcee]: Foreman-Mackey, D., et al. (2013). emcee: The MCMC Hammer. *PASP*, 125(925), 306.

[^Phan2019]: Phan, D., et al. (2019). Composable effects for flexible and accelerated probabilistic programming in NumPyro. *arXiv:1912.11554*.
