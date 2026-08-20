# Bayesian Inference Tutorial - Live Site

This folder contains the complete Bayesian inference tutorial website, ready for deployment.

## Structure

### Core Learning Path

1. **`index.md`** - Landing page with navigation
2. **`conditional-probability.md`** - Foundation (card example, joint probability)
3. **`bayes-theorem.md`** - The fundamental theorem
   - Beetle example (base rates matter)
   - **Complete coin flip example** (Beta-Binomial conjugacy with code)
4. **`bayesian-inference.md`** - Scientific framework
   - Three components: Prior, Likelihood, Posterior
   - **H₀ measurement example** with MCMC code
5. **`evidence.md`** - The centerpiece
   - Three interpretations of evidence
   - KL divergence decomposition
   - Laplace approximation and Occam penalty
   - Curvature example

### Model Comparison

6. **`model-comparison.md`** - Applications
   - Jeffreys scale interpretation
   - **Dark energy equation of state** example
   - **Curvature** example
   - **Non-Gaussian scatter** example
   - Savage-Dickey ratio for nested models
   - Common pitfalls

### Computational Methods

7. **`nested-sampling.md`** - Evidence calculation algorithm
   - **Complete Skilling 2006 derivation**
   - Prior mass transformation
   - Full algorithm with 2D Gaussian worked example
   - Constrained prior sampling challenge
   - Modern implementations (PolyChord, dynesty, MultiNest)
   - GPU acceleration mention

8. **`mcmc.md`** - Posterior sampling methods
   - Metropolis-Hastings with code
   - Gibbs sampling
   - Hamiltonian Monte Carlo (HMC)
   - NUTS (No-U-Turn Sampler)
   - Convergence diagnostics
   - Modern software (emcee, Stan, PyMC, NumPyro)

9. **`computing-evidence.md`** - Methods comparison
   - Nested Sampling (★★★★★)
   - Thermodynamic Integration (★★★★☆)
   - Learned Harmonic Mean (★★★☆☆)
   - Laplace Approximation (★★☆☆☆)
   - Practical recommendations by problem type

## Features

- **Progressive difficulty** - builds from first principles
- **Multiple entry points** - for different backgrounds
- **Evidence-focused** - unique pedagogical perspective
- **Practical examples** - real cosmology applications
- **Working code** - Python examples throughout
- **Properly cited** - references at bottom of each page
- **Interconnected** - `[[wikilinks]]` between pages

## Page Count

**9 comprehensive pages** covering the full journey from conditional probability to cutting-edge evidence calculation methods.

**Not overwhelming** - clear structure with progression marked at each step.

## What's Missing (Future Expansion)

Pages mentioned in index but not yet created:
- Application pages (CMB, supernovae, cosmic shear detailed analyses)
- `gpu-acceleration.md` - Modern hardware utilization
- `simulation-based-inference.md` - When likelihoods are intractable
- Specific topic deep-dives (KL divergence, prior choice, etc.)

These can be added incrementally without disrupting the core structure.

## Deployment

### Option 1: Quartz (Recommended for wikilinks)

```bash
# Install Quartz
npm install -g quartz-cli

# Initialize
npx quartz create

# Configure to use live/ folder
# Edit quartz.config.ts to set contentDir: "live"

# Build and serve
npx quartz build --serve
```

### Option 2: Simple Python Server (Quick Preview)

```bash
cd live
python3 -m http.server 8000
# Visit http://localhost:8000
```

Note: Wikilinks won't work with simple server—Markdown won't be rendered.

### Option 3: MkDocs

```bash
pip install mkdocs mkdocs-material
mkdocs serve
```

## Live Editing Workflow

For two-monitor editing:

```bash
# Terminal on monitor 1
npx quartz build --serve

# Edit files in VS Code on monitor 1
# See live updates in browser on monitor 2
```

Quartz auto-reloads when you save any `.md` file!

## File Sizes

```
index.md                    ~2 KB   (concise landing page)
conditional-probability.md  ~3 KB   (foundation)
bayes-theorem.md            ~8 KB   (coin flip example)
bayesian-inference.md       ~7 KB   (H0 example with code)
evidence.md                 ~10 KB  (comprehensive, KL derivation)
model-comparison.md         ~12 KB  (3 detailed examples)
nested-sampling.md          ~15 KB  (Skilling deep-dive)
mcmc.md                     ~13 KB  (all major methods)
computing-evidence.md       ~12 KB  (complete comparison)

TOTAL: ~82 KB markdown content
```

## Next Steps

1. **Test the structure** - read through the progression
2. **Add images** - visualizations for key concepts
3. **Deploy** - set up Quartz or alternative
4. **Expand** - add application pages incrementally
5. **Get feedback** - from students/colleagues

## Using with LLM Assistance

Point future LLMs to `/home/toby/Documents/Teaching/Tutorials/LLM-COLLABORATION-GUIDE.md` for:
- Adding citations to any section
- Creating new linked pages
- Generating code examples
- Expanding specific topics
- Maintaining consistent style

## Contact

This tutorial is based on PhD research on efficient Bayesian evidence calculation in cosmology. Questions or suggestions welcome!
