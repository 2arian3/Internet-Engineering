# Internet Engineering

### First Assignment
---
This assignment was all about learning git.

1. To add current changes to last commit we use `git commit --amend -m "<new-message>"`. This command will update the last commit message with the new-message and appends the new commit changes to the last one without creating a new commit.

2. In order to delete a specific file history in remote repo, we can use `git filter-branch --index-filter "git rm -rf --cached --ignore-unmatch <file-path>" HEAD`.

3. One of the ways of sharing some files with a teammate without pushing it to the main branch of the remote repository is using another branch. The other way is using `git stash` and saving the changes in originating side, and then appling the changes using `git apply` in the other side.
```
First Method:
git checkout -b test
git add FileB.txt FileC.txt
git commit -m "<commit-message>"
git push origin test

Second Method:
<Sender>
touch FileB.txt --> A line is also added to this file
touch FileC.txt --> A line is also added to this file
git add .
git commit -m "Added files to be shared"
git stash
git stash show -p > shared.patch
git add shared.patch 
git commit -m "Added patch file."

<Receiver>
git pull
git apply shared.patch
```

4. Use `git rebase` to merge a commit from a branch to another. For example:
```
git checkout -b test2
git add FileA.txt
git commit -m "<commit-message>" --> This commit contains a hash
git push origin test2
git checkout master
git cherry-pick <commit-hash> --> For second commit.
git reabse test2
```