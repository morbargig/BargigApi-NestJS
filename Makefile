autoCommit:
	`git add . && git commit -m \"`echo \"Auto commit by $(git config user.name) at $(date +%Y-%m-%dT%H:%M%z)\"`\"&& git push origin master`