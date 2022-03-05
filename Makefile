all:
	npm update
	php _scripts/gen_versions.php
	gc -am "Updates $(date)"
	npm version patch
	git push
	git push --tags
	npm publish
