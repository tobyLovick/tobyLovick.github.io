#!/usr/bin/env python3
"""Generate all plots for the analytical-update page"""

import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import beta

# Set style
plt.style.use('seaborn-v0_8-darkgrid')
plt.rcParams['figure.dpi'] = 150
plt.rcParams['savefig.dpi'] = 150

# Create images directory
import os
os.makedirs('docs/images', exist_ok=True)

# ============================================================================
# Plot 1: Bayesian Update - Three Priors
# ============================================================================

theta = np.linspace(0, 1, 1000)

# Three priors
prior1 = beta(1, 1)    # Uniform
prior2 = beta(2, 2)    # Weak fairness
prior3 = beta(10, 10)  # Strong fairness

# Three posteriors (after observing 54/84 Towpath wins)
post1 = beta(55, 31)
post2 = beta(56, 32)
post3 = beta(64, 40)

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Plot each case
cases = [
    (prior1, post1, "Uniform Prior", "Beta(1,1)"),
    (prior2, post2, "Weak Fairness Prior", "Beta(2,2)"),
    (prior3, post3, "Strong Fairness Prior", "Beta(10,10)")
]

for ax, (prior, post, title, prior_label) in zip(axes, cases):
    ax.plot(theta, prior.pdf(theta), 'b--', linewidth=2,
            label=f'Prior: {prior_label}')
    ax.plot(theta, post.pdf(theta), 'r-', linewidth=2,
            label=f'Posterior (after 54/84)')
    ax.axvline(0.5, color='gray', linestyle=':', alpha=0.5,
               label='Balanced course')
    ax.axvline(54/84, color='orange', linestyle='--',
               label='Observed rate')
    ax.set_xlabel('θ (P(Towpath wins))')
    ax.set_ylabel('Probability density')
    ax.set_title(title)
    ax.legend(fontsize=8)
    ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('docs/images/rowing_update.png', bbox_inches='tight')
print("✓ Generated rowing_update.png")
plt.close()

# ============================================================================
# Plot 2: Beta Distribution Shapes
# ============================================================================

fig, axes = plt.subplots(2, 3, figsize=(15, 8))
axes = axes.flatten()

beta_params = [
    (1, 1, "Beta(1,1) - Uniform"),
    (2, 2, "Beta(2,2) - Weak fairness"),
    (5, 5, "Beta(5,5) - Moderate fairness"),
    (10, 10, "Beta(10,10) - Strong fairness"),
    (7, 3, "Beta(7,3) - Towpath bias"),
    (3, 7, "Beta(3,7) - Meadow bias"),
]

for ax, (a, b, title) in zip(axes, beta_params):
    dist = beta(a, b)
    ax.plot(theta, dist.pdf(theta), 'b-', linewidth=2)
    ax.fill_between(theta, dist.pdf(theta), alpha=0.3)
    ax.axvline(0.5, color='gray', linestyle=':', alpha=0.5, label='θ=0.5')
    ax.axvline(dist.mean(), color='r', linestyle='--', alpha=0.7,
               label=f'Mean={dist.mean():.2f}')
    ax.set_xlabel('θ')
    ax.set_ylabel('Density')
    ax.set_title(title)
    ax.legend(fontsize=8)
    ax.grid(True, alpha=0.3)
    ax.set_ylim(0, None)

plt.tight_layout()
plt.savefig('docs/images/beta_prior_shapes.png', bbox_inches='tight')
print("✓ Generated beta_prior_shapes.png")
plt.close()

# ============================================================================
# Plot 3: Prior Strength Comparison
# ============================================================================

fig, ax = plt.subplots(figsize=(10, 6))

# Different strength priors, all centered at 0.5
priors = [
    (1, 1, "Beta(1,1) - n₀=2"),
    (2, 2, "Beta(2,2) - n₀=4"),
    (5, 5, "Beta(5,5) - n₀=10"),
    (10, 10, "Beta(10,10) - n₀=20"),
    (25, 25, "Beta(25,25) - n₀=50"),
]

colors = plt.cm.viridis(np.linspace(0, 0.9, len(priors)))

for (a, b, label), color in zip(priors, colors):
    dist = beta(a, b)
    ax.plot(theta, dist.pdf(theta), linewidth=2, label=label, color=color)

ax.axvline(0.5, color='red', linestyle='--', alpha=0.5, linewidth=2,
           label='θ=0.5 (balanced)')
ax.set_xlabel('θ (P(Towpath wins))', fontsize=12)
ax.set_ylabel('Probability density', fontsize=12)
ax.set_title('Prior Strength: Increasing n₀ (effective sample size)', fontsize=14)
ax.legend(loc='upper right')
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('docs/images/prior_strength.png', bbox_inches='tight')
print("✓ Generated prior_strength.png")
plt.close()

# ============================================================================
# Plot 4: Data Overwhelming Prior
# ============================================================================

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Simulate different amounts of data
data_amounts = [
    (5, 3, "5 races (3 Towpath wins)"),
    (10, 6, "10 races (6 Towpath wins)"),
    (40, 26, "40 races (26 Towpath wins)"),
    (84, 54, "84 races (54 Towpath wins)"),
]

for ax, (n, k, title) in zip(axes.flatten(), data_amounts):
    # Two priors: uniform and strong fairness
    prior_weak = beta(1, 1)
    prior_strong = beta(10, 10)

    post_weak = beta(1 + k, 1 + n - k)
    post_strong = beta(10 + k, 10 + n - k)

    ax.plot(theta, prior_weak.pdf(theta), 'b:', linewidth=1.5,
            alpha=0.5, label='Uniform prior')
    ax.plot(theta, prior_strong.pdf(theta), 'r:', linewidth=1.5,
            alpha=0.5, label='Strong prior Beta(10,10)')
    ax.plot(theta, post_weak.pdf(theta), 'b-', linewidth=2,
            label='Posterior (uniform)')
    ax.plot(theta, post_strong.pdf(theta), 'r-', linewidth=2,
            label='Posterior (strong)')
    ax.axvline(0.5, color='gray', linestyle='--', alpha=0.3)
    ax.axvline(k/n, color='orange', linestyle='--', alpha=0.7,
               label=f'Data rate: {k/n:.2f}')

    ax.set_xlabel('θ')
    ax.set_ylabel('Density')
    ax.set_title(title)
    ax.legend(fontsize=8)
    ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('docs/images/data_overwhelming_prior.png', bbox_inches='tight')
print("✓ Generated data_overwhelming_prior.png")
plt.close()

print("\n✅ All plots generated successfully in docs/images/")
