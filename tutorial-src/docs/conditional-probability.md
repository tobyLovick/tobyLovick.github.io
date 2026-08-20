# Conditional Probability

← Back to [[index]]

---

## The Foundation of Bayesian Reasoning

Conditional probability is the cornerstone of all Bayesian inference. It answers the question: **"What is the probability of A, given that B has occurred?"**

## Definition

The probability of event $A$ given that event $B$ has occurred is:

$$P(A|B) = \frac{P(A \cap B)}{P(B)}$$

where $P(A \cap B)$ is the probability that both $A$ and $B$ occur.

**Intuition:** We're restricting our attention to only those cases where $B$ happened, then asking what fraction of those also have $A$.

---

## Rearranging

From the definition, we can rearrange to get:

$$P(A \cap B) = P(A|B)P(B)$$

By symmetry, we also have:

$$P(A \cap B) = P(B|A)P(A)$$

The same joint probability can be expressed in two different ways. Equating these two expressions immediately gives us [[bayes-theorem]].

---

## A Simple Example

Consider drawing a card from a standard deck:

- Let $A$ = "card is an Ace"
- Let $B$ = "card is a spade"

**Question:** What's the probability the card is an Ace, given that it's a spade?

**Solution:**

$$P(\text{Ace}|\text{Spade}) = \frac{P(\text{Ace} \cap \text{Spade})}{P(\text{Spade})} = \frac{1/52}{13/52} = \frac{1}{13}$$

This makes intuitive sense: if we know the card is a spade, we're looking at 13 cards, exactly one of which is an Ace.

---

## Why This Matters for Science

In scientific inference, we typically have:
- **$B$** = the data we observed
- **$A$** = a hypothesis about nature

We want to know $P(A|B)$: "How probable is this hypothesis, given the data?"

But often we can more easily calculate $P(B|A)$: "How probable is this data, given the hypothesis?" This is what our theoretical models predict.

**The problem:** How do we invert the conditioning? How do we get from $P(B|A)$ to $P(A|B)$?

**The solution:** [[bayes-theorem]] →

---

## Key Takeaways

1. Conditional probability restricts our sample space to cases where the condition is true
2. The joint probability can be expressed in two equivalent ways: $P(A|B)P(B) = P(B|A)P(A)$
3. This symmetry allows us to invert conditional probabilities
4. In science, we need this inversion to go from "data given hypothesis" to "hypothesis given data"

---

**Next:** [[bayes-theorem]] - Using this symmetry to invert probabilities

**Related:** [[bayesian-inference]] - Applying this to parameter estimation
