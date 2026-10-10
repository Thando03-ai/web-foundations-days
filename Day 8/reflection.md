Reflection
The most difficult concept for me was asynchronous JavaScript. At

first I did not understand why my code printed "Promise {<pending>}"

instead of data. What helped was the idea that fetch returns a

promise of a future value, and that await pauses only my function

while the rest of the page keeps running. Rebuilding the user

directory assignment twice, and watching the requests in the Network

tab, made it click.