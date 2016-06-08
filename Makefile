dev:
	cd src/scss && sass --watch .:../../css/ &
	webpack -d -w
build:
	# generate optimized files
	sass src/scss/:css/
	webpack --config webpack.config.prod.js
	# Copy files to dist
	rm -rf dist/*
	cp manifest.json dist/
	cp *.html dist/
	mkdir dist/js
	cp js/*.js dist/js/
	mkdir dist/css
	cp css/*.css dist/css/
	cp -R images dist/
	cp -R icons dist/
	cp -R _locales dist/
	# zip chrome extension package
	rm cssantique.zip
	zip -r cssantique.zip dist/


