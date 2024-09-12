## 🚀 Deployment Guide

- Run `npm run custom-script`
- Add these missing `env` variables
- Attach a PDF doc if needed

## 📦 Packages

- Installed package A: https://link-to-package.com

## 📝 Changelog

**Summary of Changes**

- Added new QR scanner client
- Removed unused dependencies
- Improved database query on some module

## 📸 Attach screenshots if needed

<hr>

## ☑️ Coding Standard Checklist

- [ ] Follow the team's standard conventions -- consistency will get us far
- [ ] Don't comment it out. Just remove (or I'll smite you 🌩️)
- [ ] Keep it simple stupid. Simpler is always better. Reduce complexity as much as possible
- [ ] Code is DRY (Don't Repeat Yourself) -- but keep complexity to a minimum
- [ ] Be consistent. If you do something a certain way, do all similar things in the same way
- [ ] Use explanatory variables and choose descriptive and unambiguous names
- [ ] Keep configurable data at high levels. Avoid magic numbers
- [ ] Always try to explain yourself in code before leaving a comment. Don't be redundant
- [ ] As much as possible, use comments as an explanation of intent, clarification of code, or as a warning of consequences
- [ ] Separate concepts vertically. Declare variables close to their usage. Related code should show vertically dense
- [ ] Objects should be small, do one thing, and hide internal data structure
- [ ] Avoid experimental framework features and libraries
- [ ] Default to declaring types in the same file they are used. Create a file in the `src/typings` directory for types that will be used by multiple files (typically 3 or more files)
- [ ] Create composables for reusable logic that has `state`. Pure (stateless) functions should be in the `src/utils` directory
