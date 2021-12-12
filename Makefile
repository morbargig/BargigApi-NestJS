SHELL=/bin/bash


NAME = $(git config user.name)

auto-commit: 
	`git add . && git commit -m "echo 'Auto commit by $(NAME) at $(date +%Y-%m-%dT%H:%M%z)" && git push origin $(git branch --show-current)`
pull:
	`git pull --recurse-submodules origin $(git branch --show-current)`
get-remote:
	echo `git config --get remote.origin.url`
clone:
	make get-remote
		