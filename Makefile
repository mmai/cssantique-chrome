build:
	sass src/scss/cssantique.scss:css/cssantique.css
	webpack -p
dev:
	cd src/scss && sass --watch cssantique.scss:../../css/cssantique.css &
	webpack -d -w
