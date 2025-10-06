# Deploying to GitHub Pages

This document explains how to deploy the application to GitHub Pages.

## Prerequisites

- You must have push permissions to the GitHub repository.
- The project dependencies must be installed (`npm install`).

## Deployment a New Version

To deploy a new version of the application, follow these steps:

1.  **Build and Deploy**: Run the following command to build the application and deploy it to the `gh-pages` branch:

    ```bash
    ng deploy
    ```

    This command will:
    - Build the application for production.
    - Commit the build artifacts to the `gh-pages` branch.
    - Push the `gh-pages` branch to the remote repository.

2.  **Verify Deployment**: Once the command completes, the updated application will be available at `https://test-user.github.io/test-repo/`. Note that it might take a few minutes for GitHub Pages to update.