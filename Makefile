SHELL=/bin/bash

auto-commit: 
	echo `git commit -am "Auto commit by $$(git config user.name) at $(date +%Y-%m-%dT%H:%M%z)" && git push origin $(git branch --show-current)`
pull:
	`git pull --recurse-submodules origin $(git branch --show-current)`
get-remote:
	echo `git config --get remote.origin.url`
clone:
	make get-remote


