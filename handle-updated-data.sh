export NEW_DATE=$(date +"%s")
echo "Update to [$NEW_DATE]"
# Update env for local dev:
sed -i "-backup" s/MEN_CURR_UPDATE=.*/MEN_CURR_UPDATE=$NEW_DATE/ .env
sed -i "-backup" s/WOMEN_CURR_UPDATE=.*/WOMEN_CURR_UPDATE=$NEW_DATE/ .env
echo "Now call 'source .env'"
# Update the env variables in now:
echo "y" | now secrets rm men-curr-update
now secrets add men-curr-update $NEW_DATE
echo "y" | now secrets rm women-curr-update
now secrets add women-curr-update $NEW_DATE
# Redeploy app (so that server side cache gets the new data)
#echo "Always deploy to dev:"
#now
if git status | grep -q "nothing to commit, working tree clean"  && \
    git status | grep -q "Your branch is up to date with 'origin/master'."; then
  echo "Deploy to prod:"
  now --prod
else
  echo "Unclean working directory, you will have to hand deploy to prod: 'now --prod'"
fi
