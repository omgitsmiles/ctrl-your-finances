# Making code changes

Changes to the codebase should be requested to be merged by submitting a pull request that will be reviewed by at least one other team member.

### Create a branch for your work

Our default branch to work from is `main`. To create a new branch for your work:

```sh
# In the ctrl-your-finances root, go to main
git checkout main

# Pull down the most recent commits
git pull

# Make a new branch
git branch <new-branch-name>
git checkout <new-branch-name>

# Or for a one liner (-b creates a new branch when checking out)
git checkout -b <new-branch-name>
```

Branch names should be in kebab case (all lower case, dashes separate words) and are best when short and descriptive.

### Commit your work

Any good work with code involves good commit messages.

The best commit messages read like instructions on how to recreate the code being committed.

Individual commits should be small chunks of work included together as one step in the process.

### Push your work up to the remote repo

When you have completed your work and made good commit messages that read like clear instructions, you will want to push your work up to our remote repository on Github.

```sh
# Make a matching remote branch to push to
# Note: While it is usually `origin`, the remote repo may be named a different alias on your machine
git push --set-upstream origin <new-branch-name>

# Once you have set up a remote branch continue to push changes with:
git push
```

### Create a pull request

In order to merge your work to the `main` branch you must create a pull request.

Often Github will put up a notification that a new branch has been pushed and give a green "Make a PR" button on any page of the repo. If you don't see this you can go to the [pull requests tab](https://github.com/omgitsmiles/ctrl-your-finances/pulls) and hit the big green `New` button.

If your changes are addressing an issue, make sure you tag the issue you are addressing. You can do this by writing `#<number>` in the PR comments.

```md
<!-- For example, for a PR addressing issue #13 -->
Closes #13
```

To make sure reviewers know to review it, finish up by assigning a team member in the 'reviewers' tab in the sidebar or under the PR text depending on your view.

### Reviewed work

The reviewer(s) will either recommend for changes or approve the PR.

If changes are recommended, please make the changes in your branch and push them up to Github when ready.

```bash
# Tip: If you are fixing something from a particular commit, you can create a !fixup commit with
git commit --fixup <sha-for-commit>

# Then, when approved, before you merge you can use:
git rebase -i --autosquash develop
# to squash your !fixup commits into their corresponding commits
```

Once you have pushed up your fixes, let your reviewer know and they will follow up and look again. This may loop a few times.

Once your changes are approved, you can hit the `merge` button to merge to the `main` branch (unless specified otherwise).

Please also delete the branch from Github.

### Clean up

Once you've merged your work go back to your terminal

```sh
# Go to the develop branch
git checkout main

# Pull down the changes you merged
git pull

# Delete the branch from your local machine
git branch -d <new-branch-name>
```


# Code of Conduct

If you choose to work on this product you are still expected to follow Flatiron School's Code of Conduct, which can be found in the [Flatiron School Student Catalog](https://drive.google.com/file/d/1j7_zo7QHdp1Znakk3eENcqJNbvFfbjSD/view).
Failure to abide by this will result in removal from the project.

#### Conflict Plan

Disagreements between team members regarding any aspect of the project should be resolved through discussion and majority vote of the team members.  The team may delegate desicisions regarding the implementation or design of app features to a sub-group of team members, in which case disagreements regarding such a feature should be resolved by agreement of the sub-group team members.  If an agreement cannot be reached in that situation, the disagreement can be brought to the full team for a decision to be made.

#### Communication Plan

The Ctrl Your Finances discord channel will be the primary means of communicatino between team members, either through text or voice channels.

Team members will strive to create an environment in which all team members feel comfortable commuicating their ideas or concerns regarding the project.
  
If at any point a team member feels that this Code of Conduct is not being followed, that team member may reach out to the team's Flatiron School Point of Contact, Lindsey Williams.

#### Agreed to by:



