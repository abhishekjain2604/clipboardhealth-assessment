# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here


# Refactoring 1: Fixing complicated if...else
In the below code piece, the statement `candidate = TRIVIAL_PARTITION_KEY;` only gets executed when we do not give any input to our `deterministicPartitionKey` function

```js
let candidate;

if (event) {
    if (event.partitionKey) {
        candidate = event.partitionKey;
    } else {
        const data = JSON.stringify(event);
        candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }

if (candidate) {
    if (typeof candidate !== "string") {
        candidate = JSON.stringify(candidate);
    }
  } else {
        candidate = TRIVIAL_PARTITION_KEY;
  }
```

Thus the code can be categorised into 2 cases: When the input is given and when it is not given. That brough me to my first refactoring

```js
let candidate;
if(event) {
    // Handle the case when input is given
} else {
    candidate = TRIVIAL_PARTITION_KEY;
}
```

#  Refactoring 2: Modularity

That is immidiately followed by separating out the logic for finding the candidate from the event object into a separate function for greater code readability
It modularises the code and gets the lower level details on how the candidate is being extracted from event away from the main function which now has just a simple logic

# Refactoring 3: Exctracting out the hashing logic into a separate function

The statement `crypto.createHash("sha3-512").update(data).digest("hex")` was being used twice in our existing code
This means any future change in the logic of hash creation needs to be made in 2 different places. This should be avoided

At the same time, the main function(`deterministicPartitionKey`) should not contain any complicated logic on how the hash is being generated. It should simply call a function that returns a hash for a given input

# Refactoring 4: Using conditional ternary operator for final return statement

In the below code, there is an implicit distinction between the 2 cases(whether it enters the `if` or not)
In case 1, it returns the candiate as it is
In case 2, it creates a hash for the candidate and then returns it

```js
if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
}
return candidate;
```

Having an `if` to change the value of candidate before returning it leaves room for ambiguity as to what we intend to do in the `if` clause. This ambiguity is cleared only after we read the `if` block and what follows after(the return statement)

This is a classic use case for conditional ternary operator
The below refactored code makes the intent of the code immidiately clear that we will be returning different values based on a given condition

```js
return candidate.length > MAX_PARTITION_KEY_LENGTH 
    ? createHash(candidate)
    : candidate;
```