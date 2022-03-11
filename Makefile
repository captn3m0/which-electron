all:
	npm update
	php _scripts/gen_versions.php
	git commit -am "Updates $(date)"
	npm version patch
	git push
	git push --tags
	npm publish
