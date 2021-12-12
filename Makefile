auto-commit:
	`git commit -am "echo 'Auto commit by $(git config user.name) at $(date +%Y-%m-%dT%H:%M%z)'" && git push origin master`
pull:
	`git push origin master`
clone:

get-remote:
	`git config --get remote.origin.url`
		