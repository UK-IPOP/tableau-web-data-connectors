#!/usr/bin/env sh

# abort on errors

echo "Copying files"
mkdir dist
cp package-lock.json dist/
cp package.json dist/
cp -r web/* dist/

# navigate into the build output directory
cd dist
touch index.md
echo "This is the homepage">>index.md

echo "Installing dependencies"
npm install --production


# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

echo "Deploying..."
git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/UK-IPOP/wdc.git master:gh-pages

cd -