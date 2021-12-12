SHELL=/bin/bash

auto-commit: 
	`git commit -am "echo 'Auto commit by $(make get-remote) at $(date +%Y-%m-%dT%H:%M%z)'" && git push origin $(git branch --show-current)`
pull:
	`git pull --recurse-submodules origin $(git branch --show-current)`
get-remote:
	echo `git config --get remote.origin.url`
clone:
	make get-remote
		